import "dotenv/config";
// ==========================================
// DB Helpers (Supabase + Local Fallback)
// ==========================================
async function getTracks(): Promise<any[]> {
  if (supabase) {
    const { data, error } = await supabase.from('tracks').select('*').order('createdAt', { ascending: false });
    if (error) console.error(error);
    if (!data || data.length === 0) {
      for (const t of INITIAL_DEFAULT_TRACKS) await supabase.from('tracks').insert(t);
      return INITIAL_DEFAULT_TRACKS;
    }
    return data;
  } else {
    try {
      if (fs.existsSync(TRACKS_FILE)) {
        const data = fs.readFileSync(TRACKS_FILE, 'utf-8');
        return JSON.parse(data);
      }
    } catch (e) {}
    fs.writeFileSync(TRACKS_FILE, JSON.stringify(INITIAL_DEFAULT_TRACKS, null, 2));
    return INITIAL_DEFAULT_TRACKS;
  }
}

async function saveTrack(track: any) {
  if (supabase) {
    await supabase.from('tracks').upsert(track);
  } else {
    const tracks = await getTracks();
    tracks.unshift(track);
    fs.writeFileSync(TRACKS_FILE, JSON.stringify(tracks, null, 2));
  }
}

async function deleteTrackData(id: string) {
  if (supabase) {
    await supabase.from('tracks').delete().eq('id', id);
  } else {
    const tracks = await getTracks();
    fs.writeFileSync(TRACKS_FILE, JSON.stringify(tracks.filter(t => t.id !== id), null, 2));
  }
}

async function resetTracks() {
  if (supabase) {
    await supabase.from('tracks').delete().neq('id', '0');
    for (const t of INITIAL_DEFAULT_TRACKS) await supabase.from('tracks').insert(t);
  } else {
    fs.writeFileSync(TRACKS_FILE, JSON.stringify(INITIAL_DEFAULT_TRACKS, null, 2));
  }
}

async function getContent(): Promise<any> {
  if (supabase) {
    const { data } = await supabase.from('content').select('data').eq('id', 'main').single();
    if (!data) {
      await supabase.from('content').insert({ id: 'main', data: DEFAULT_CONTENT });
      return DEFAULT_CONTENT;
    }
    return { ...DEFAULT_CONTENT, ...data.data };
  } else {
    try {
      if (fs.existsSync(CONTENT_FILE)) {
        return { ...DEFAULT_CONTENT, ...JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8')) };
      }
    } catch(e) {}
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(DEFAULT_CONTENT, null, 2));
    return DEFAULT_CONTENT;
  }
}

async function saveContent(content: any) {
  if (supabase) {
    await supabase.from('content').upsert({ id: 'main', data: content });
  } else {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
  }
}

async function getPosts(): Promise<any[]> {
  if (supabase) {
    const { data } = await supabase.from('posts').select('*').order('createdAt', { ascending: false });
    if (!data || data.length === 0) {
      for (const p of DEFAULT_POSTS) await supabase.from('posts').insert(p);
      return DEFAULT_POSTS;
    }
    return data;
  } else {
    try {
      if (fs.existsSync(POSTS_FILE)) {
        return JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8'));
      }
    } catch(e) {}
    fs.writeFileSync(POSTS_FILE, JSON.stringify(DEFAULT_POSTS, null, 2));
    return DEFAULT_POSTS;
  }
}

async function savePost(post: any) {
  if (supabase) {
    await supabase.from('posts').upsert(post);
  } else {
    const posts = await getPosts();
    posts.unshift(post);
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
  }
}

async function updatePostData(id: string, updates: any) {
  if (supabase) {
    await supabase.from('posts').update(updates).eq('id', id);
  } else {
    const posts = await getPosts();
    const idx = posts.findIndex(p => p.id === id);
    if (idx !== -1) {
      posts[idx] = { ...posts[idx], ...updates };
      fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
    }
  }
}

async function deletePostData(id: string) {
  if (supabase) {
    await supabase.from('posts').delete().eq('id', id);
  } else {
    const posts = await getPosts();
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts.filter(p => p.id !== id), null, 2));
  }
}

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';


const app = express();
const PORT = 3000;

// ==========================================
// SUPABASE INITIALIZATION
// ==========================================
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

if (supabase) console.log('Supabase initialized.');
else console.warn('No Supabase credentials. Falling back to local storage.');

async function uploadToSupabase(file: Express.Multer.File, folder: string): Promise<string | undefined> {
  if (!supabase) return undefined;
  const ext = path.extname(file.originalname).toLowerCase();
  const safeName = file.originalname.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const filename = `${folder}/${Date.now()}_${safeName}${ext ? '' : '.bin'}`;
  
  const { data, error } = await supabase.storage.from('media').upload(filename, file.buffer, {
    contentType: file.mimetype,
    upsert: false
  });
  
  if (error) {
    console.error('Supabase upload error:', error);
    return undefined;
  }
  
  const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filename);
  return publicUrl;
}


// Admin authentication keys
const VALID_PASSWORDS = new Set(
  [
    process.env.ADMIN_PASSWORD,
    'despojados2024',
    'despojados',
    'diagonal_master_2024',
    'admin',
  ].filter(Boolean) as string[]
);

function checkPassword(pass: string): boolean {
  if (!pass) return false;
  const p = pass.trim();
  return VALID_PASSWORDS.has(p) || VALID_PASSWORDS.has(p.toLowerCase());
}

// Ensure data & upload directories exist
const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const AUDIO_UPLOADS_DIR = path.join(UPLOADS_DIR, 'audio');
const COVERS_UPLOADS_DIR = path.join(UPLOADS_DIR, 'covers');
const IMAGES_UPLOADS_DIR = path.join(UPLOADS_DIR, 'images');

const TRACKS_FILE = path.join(DATA_DIR, 'tracks.json');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');

[DATA_DIR, UPLOADS_DIR, AUDIO_UPLOADS_DIR, COVERS_UPLOADS_DIR, IMAGES_UPLOADS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Default seed tracks for Despojados
const INITIAL_DEFAULT_TRACKS = [
  {
    id: 'track-1',
    title: '1. Canción del Bosque Platense',
    artist: 'Despojados',
    album: 'Despojados',
    duration: '04:18',
    durationSeconds: 258,
    side: 'LADO A',
    speed: '33 RPM',
    format: 'VINILO 180g',
    grooveLabel: 'SURCO 1: CANCIÓN DEL BOSQUE PLATENSE',
    recordingNotes: 'CRIOLLA & FUZZ',
    venueOrStudio: 'SALA CALLE 47 // LA PLATA',
    year: '2024',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCacxB2Xar5biMqOgp9B0LqQeka0PbHlXdfo7kMhhuDu0hGv2BRVxLnSsVvfEzA2F-CpeignVpzxHsB6r0EeA3t0pdrpigNFQiafqQPQpFefbt0wEJc8ovNiXAVll0qDe2eWpc8CQ3k2Nv3I0AWYIEDq95RHX-RjY135gGXOWb7PN8ZNPCiylDjG-tSei3T73CJrAVvfZ6ZnNJDXmbXQZZrceW6Yty8X_JJQqS-xlMe_ULiTiafxTX9aA',
    chords: ['Am7', 'D9', 'Fmaj7', 'E7(#9)'],
    hasCustomAudio: false,
    createdAt: 1700000000000,
  },
  {
    id: 'track-2',
    title: '2. Rambla Acústica',
    artist: 'Despojados',
    album: 'Despojados',
    duration: '03:32',
    durationSeconds: 212,
    side: 'LADO A',
    speed: '33 RPM',
    format: 'VINILO 180g',
    grooveLabel: 'SURCO 2: RAMBLA ACÚSTICA',
    recordingNotes: 'MIC DE CINTA',
    venueOrStudio: 'RAMBLA 32 // VESTÍBULO',
    year: '2024',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCacxB2Xar5biMqOgp9B0LqQeka0PbHlXdfo7kMhhuDu0hGv2BRVxLnSsVvfEzA2F-CpeignVpzxHsB6r0EeA3t0pdrpigNFQiafqQPQpFefbt0wEJc8ovNiXAVll0qDe2eWpc8CQ3k2Nv3I0AWYIEDq95RHX-RjY135gGXOWb7PN8ZNPCiylDjG-tSei3T73CJrAVvfZ6ZnNJDXmbXQZZrceW6Yty8X_JJQqS-xlMe_ULiTiafxTX9aA',
    chords: ['Em7', 'A7', 'Cmaj7', 'B7'],
    hasCustomAudio: false,
    createdAt: 1700000001000,
  },
  {
    id: 'track-3',
    title: '3. Milonga Eléctrica de Calle 6',
    artist: 'Despojados',
    album: 'Despojados',
    duration: '05:04',
    durationSeconds: 304,
    side: 'LADO A',
    speed: '33 RPM',
    format: 'VINILO 180g',
    grooveLabel: 'SURCO 3: MILONGA ELÉCTRICA DE CALLE 6',
    recordingNotes: 'VALVULAR TWEED',
    venueOrStudio: 'ESTUDIO LA PLATA CENTRO',
    year: '2024',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBbIOA4OG6qP6zaGo-TVABqDiacUDuSWwQ10szC0msiP6uvhXr3miJgVXPWvcYjDRYZ_UWAwLkmJLRY6FhGWSdXALNRxavnM_jB-zM_E1YN8P1KTNdtkPfFZ4wYoVvJUvI78onUHeN2ZSBAOfR1drBCK2k4hMA2HL28_E79atWKXPRu8DY-ChY5nA_OUILxXC58rMt6eJxO-C034Fu75hgxMSdYB3bfwmJizt7QqgHhgRdqwuzBpaO9Ng',
    chords: ['Dm', 'G7', 'Bbmaj7', 'A7'],
    hasCustomAudio: false,
    createdAt: 1700000002000,
  },
  {
    id: 'track-4',
    title: 'Fuego en la Estación 1 y 44',
    artist: 'Despojados',
    album: 'En Vivo Atenas',
    duration: '04:18',
    durationSeconds: 258,
    side: 'LADO A',
    speed: '33 RPM',
    format: 'VINILO 180g',
    grooveLabel: 'SURCO: FUEGO EN LA ESTACIÓN',
    recordingNotes: 'CORTE EN LACA / PURA VIDA',
    venueOrStudio: 'PURA VIDA BAR // CALLE 1 & 44',
    year: '2023',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBbIOA4OG6qP6zaGo-TVABqDiacUDuSWwQ10szC0msiP6uvhXr3miJgVXPWvcYjDRYZ_UWAwLkmJLRY6FhGWSdXALNRxavnM_jB-zM_E1YN8P1KTNdtkPfFZ4wYoVvJUvI78onUHeN2ZSBAOfR1drBCK2k4hMA2HL28_E79atWKXPRu8DY-ChY5nA_OUILxXC58rMt6eJxO-C034Fu75hgxMSdYB3bfwmJizt7QqgHhgRdqwuzBpaO9Ng',
    chords: ['A5', 'G5', 'F5', 'E5'],
    hasCustomAudio: false,
    createdAt: 1700000003000,
  },
  {
    id: 'track-5',
    title: 'Caminata Nocturna por Calle 12',
    artist: 'Despojados',
    album: 'Sencillos de Barrio',
    duration: '04:20',
    durationSeconds: 260,
    side: 'LADO A',
    speed: '45 RPM',
    format: '7" SINGLE 45 RPM',
    grooveLabel: 'SURCO: CAMINATA POR CALLE 12',
    recordingNotes: 'REVERB DE LADRILLO VISTO',
    venueOrStudio: 'TALLER CALLE 53 & 19',
    year: '2024',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCnV-oUDbYidf8YmJ6FkkqI3TUVIIVEwsvElfE3z7DZCIEJA6Bkaw5y13LeB-_FVedtvFG1xFYxX8a4pkmlFNna4iB_mMfA2QutQvG5UhhlZ-NTWa-UCEGQ91N7mXxJ8E5sSrMYQMc0kDcR5_kJLxqzp9z2GpI920an74yaut3zfuJJrXy0q38qSkcXXKTzfFhf8R_WVfcqbP4qmNtRzhLcsOGjKXv6gRvEXrpkfWaQbstUAgsfOAZ6PA',
    chords: ['Bm7', 'E7', 'Gmaj7', 'F#7'],
    hasCustomAudio: false,
    createdAt: 1700000004000,
  },
  {
    id: 'track-6',
    title: 'Viento del Río Santiago',
    artist: 'Despojados',
    album: 'Ribera de Berisso y Ensenada',
    duration: '03:48',
    durationSeconds: 228,
    side: 'LADO B',
    speed: '33 RPM',
    format: '10" MINI-LP',
    grooveLabel: 'SURCO: VIENTO DEL RÍO SANTIAGO',
    recordingNotes: 'CRIOLLA Y BOMBO LEGÜERO',
    venueOrStudio: 'BARRIO MONDONGO // ENSAYO',
    year: '2023',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAzmnfUCUba1a8x500MaxX-6U3j9t0XrBmQxO-YGbjpMmjrXUPXIU_Rg4q6Hqm065FhPM-mF-wKfwRY0Q-9FygpLizsktQL9-USQPNKDyyKFVXie1dSMG100S9O6LR-7zxChmYhOzHLGoP-lIFxCYv1UZ-6rARkVcFBEtXRtAAIgW5mU6RwP1ygLa8JujkytuoS-HQPiYjHrI7Gy1DRLP54XAkMaoVqyALnCXSl0YFd557a0uPdFO0yRg',
    chords: ['Dm7', 'Gm7', 'C7', 'Fmaj7', 'A7'],
    hasCustomAudio: false,
    createdAt: 1700000005000,
  },
  {
    id: 'track-7',
    title: 'Misterio de Plaza Paso',
    artist: 'Despojados',
    album: 'Despojados',
    duration: '04:45',
    durationSeconds: 285,
    side: 'LADO B',
    speed: '33 RPM',
    format: 'VINILO 180g',
    grooveLabel: 'SURCO 2: MISTERIO DE PLAZA PASO',
    recordingNotes: 'ACÚSTICO DE TRASNOCHE',
    venueOrStudio: 'CALLE 13 & 44 // BALCÓN',
    year: '2024',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDePNxg7tVmai6sznpH65zOFj4weN2Eqol4T74_GV2WesF3Ylly16Zp-Xix050RpOxhshh5oyrhHwyDvCFozbG0-joStSz9cV5UPiT0cqDeew4f8NRYnTKBV5rstxdlcJgObG_P5U4OnSexmBVbJgvl1DBPl4ovFFug8CFbE4ytEDKIbnO1yl36JwfWb8AQHUxoiEYf8pbErYH5ukbrquG_KxgbkGBB0lXM95EXvHRpb8ovD_fdrJVH_g',
    chords: ['Am', 'Dm', 'E7', 'Am'],
    hasCustomAudio: false,
    createdAt: 1700000006000,
  },
];

// Default site content
const DEFAULT_CONTENT = {
  bandName: 'Despojados',
  heroBadge: 'MOVIDA CULTURAL AUTOGESTIVA // LA PLATA // A PULMÓN',
  heroTitle: 'DESPOJADOS',
  heroSubtitle: 'Canción Barrial, Resistencia & Sonido Autogestivo',
  heroDescription:
    'Archivo sonoro y colectivo cultural de Despojados: escuchá las canciones en la bandeja del galpón, hojeá el fanzine de novedades y compartí la música libre sin intermediarios.',
  bioTitle: 'MÚSICA POPULAR NACIDA EN GALPONES, CALLES Y PLAZAS PLATENSES',
  bioText1:
    'Despojados nace desde la necesidad colectiva de tocar, cantar y encontrarnos en el barro cotidiano, sin sellos multinacionales ni algoritmos de mercado. Creemos en la autogestión como trinchera y en el arte como construcción comunitaria horizontal.',
  bioText2:
    'Grabamos en salas colectivas, clubes barriales y galpones con mate en mano, guitarras criollas, cables remendados y micrófonos de batalla. Este espacio es nuestra batea comunitaria: poné a girar el disco, bajá la púa y sentite en casa.',
  origin: 'LA PLATA // BUENOS AIRES',
  productionNotes: 'Producción Colectiva & Autogestiva',
};

// Default news & posts
const DEFAULT_POSTS = [
  {
    id: 'post-1',
    title: 'Festival autogestivo en el galpón cultural: tocan Despojados y bandas amigas',
    category: 'Show Barrial',
    date: '18 de Octubre, 2024',
    content:
      'Este sábado abrimos las puertas del galpón comunitario para compartir una jornada de música en vivo, feria de fanzines independientes, buffet popular y micrófono abierto. Entrada solidaria y a la gorra para sostener el espacio y los talleres barriales. ¡Vení con tu mate y compartí la movida!',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCacxB2Xar5biMqOgp9B0LqQeka0PbHlXdfo7kMhhuDu0hGv2BRVxLnSsVvfEzA2F-CpeignVpzxHsB6r0EeA3t0pdrpigNFQiafqQPQpFefbt0wEJc8ovNiXAVll0qDe2eWpc8CQ3k2Nv3I0AWYIEDq95RHX-RjY135gGXOWb7PN8ZNPCiylDjG-tSei3T73CJrAVvfZ6ZnNJDXmbXQZZrceW6Yty8X_JJQqS-xlMe_ULiTiafxTX9aA',
    createdAt: 1729000000000,
  },
  {
    id: 'post-2',
    title: 'Sesión de grabación directa a dos canales en la sala comunitaria',
    category: 'Ensayo & Taller',
    date: '4 de Noviembre, 2024',
    content:
      'Registramos nuevas tomas acústicas en la sala de calle 47. Sin sobreproducción ni retoques: guitarras de madera, bombo legüero, voces directas y el crujido cálido del ambiente. Ya podés escuchar los adelantos directo en la bandeja tocadiscos.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBbIOA4OG6qP6zaGo-TVABqDiacUDuSWwQ10szC0msiP6uvhXr3miJgVXPWvcYjDRYZ_UWAwLkmJLRY6FhGWSdXALNRxavnM_jB-zM_E1YN8P1KTNdtkPfFZ4wYoVvJUvI78onUHeN2ZSBAOfR1drBCK2k4hMA2HL28_E79atWKXPRu8DY-ChY5nA_OUILxXC58rMt6eJxO-C034Fu75hgxMSdYB3bfwmJizt7QqgHhgRdqwuzBpaO9Ng',
    createdAt: 1730500000000,
  },
  {
    id: 'post-3',
    title: 'Nueva tirada de volantes, acordes para guitarrear y afiches serigrafiados',
    category: 'Fanzine',
    date: '12 de Noviembre, 2024',
    content:
      'Imprimimos una edición especial en papel sulfito con las letras completas, acordes para criolla y notas de los temas. Están disponibles en los toques para que cualquiera pueda sacar las canciones en su casa o en la plaza.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCnV-oUDbYidf8YmJ6FkkqI3TUVIIVEwsvElfE3z7DZCIEJA6Bkaw5y13LeB-_FVedtvFG1xFYxX8a4pkmlFNna4iB_mMfA2QutQvG5UhhlZ-NTWa-UCEGQ91N7mXxJ8E5sSrMYQMc0kDcR5_kJLxqzp9z2GpI920an74yaut3zfuJJrXy0q38qSkcXXKTzfFhf8R_WVfcqbP4qmNtRzhLcsOGjKXv6gRvEXrpkfWaQbstUAgsfOAZ6PA',
    createdAt: 1731400000000,
  },
];

// Disk I/O Helpers
function getTracksFromDisk(): any[] {
  try {
    if (fs.existsSync(TRACKS_FILE)) {
      const data = fs.readFileSync(TRACKS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Upgrade artist names if old default was present
        return parsed.map((t) => (t.artist === 'Los Duendes de la Diagonal' ? { ...t, artist: 'Despojados', album: 'Despojados' } : t));
      }
    }
  } catch (err) {
    console.error('Error reading tracks from disk:', err);
  }
  fs.writeFileSync(TRACKS_FILE, JSON.stringify(INITIAL_DEFAULT_TRACKS, null, 2));
  return INITIAL_DEFAULT_TRACKS;
}

function saveTracksToDisk(tracks: any[]): void {
  try {
    fs.writeFileSync(TRACKS_FILE, JSON.stringify(tracks, null, 2));
  } catch (err) {
    console.error('Error saving tracks to disk:', err);
  }
}

function getContentFromDisk(): any {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const data = fs.readFileSync(CONTENT_FILE, 'utf-8');
      return { ...DEFAULT_CONTENT, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Error reading content from disk:', err);
  }
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(DEFAULT_CONTENT, null, 2));
  return DEFAULT_CONTENT;
}

function saveContentToDisk(content: any): void {
  try {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
  } catch (err) {
    console.error('Error saving content to disk:', err);
  }
}

function getPostsFromDisk(): any[] {
  try {
    if (fs.existsSync(POSTS_FILE)) {
      const data = fs.readFileSync(POSTS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading posts from disk:', err);
  }
  fs.writeFileSync(POSTS_FILE, JSON.stringify(DEFAULT_POSTS, null, 2));
  return DEFAULT_POSTS;
}

function savePostsToDisk(posts: any[]): void {
  try {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
  } catch (err) {
    console.error('Error saving posts to disk:', err);
  }
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'audio') {
      cb(null, AUDIO_UPLOADS_DIR);
    } else if (file.fieldname === 'cover') {
      cb(null, COVERS_UPLOADS_DIR);
    } else if (file.fieldname === 'image') {
      cb(null, IMAGES_UPLOADS_DIR);
    } else {
      cb(null, UPLOADS_DIR);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    cb(null, `${Date.now()}_${safeName}${ext ? '' : '.bin'}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 150 * 1024 * 1024 }, // 150MB per file
});

// Middleware for parsing JSON
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(UPLOADS_DIR));

// Simple admin authentication check
const activeTokens = new Set<string>();

function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-admin-token'] as string);
  const passHeader = req.headers['x-admin-password'] as string;

  if ((token && activeTokens.has(token)) || (passHeader && checkPassword(passHeader))) {
    next();
  } else {
    res.status(401).json({ error: 'Acceso no autorizado al panel de administración de Despojados' });
  }
}

// ==========================================
// API ROUTES
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    tracksCount: getTracksFromDisk().length,
    postsCount: getPostsFromDisk().length,
  });
});

// ==========================================
// TRACKS API
// ==========================================

// Public: Get all tracks (shared to all visitors)
app.get('/api/tracks', async (req, res) => {
  const tracks = await getTracks();
  res.json(tracks);
});

// Admin: Login to get session token
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password && checkPassword(password)) {
    const token = `despojados-session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    activeTokens.add(token);
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, error: 'Clave de administración incorrecta' });
  }
});

// Admin: Upload a new song with audio and optional cover image
app.post(
  '/api/admin/upload',
  requireAdminAuth,
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const audioFile = files?.['audio']?.[0];
      const coverFile = files?.['cover']?.[0];

      const {
        title,
        artist,
        album,
        duration,
        durationSeconds,
        side,
        speed,
        format,
        venueOrStudio,
        recordingNotes,
        year,
        coverUrl,
        chords,
      } = req.body;

      if (!title || !artist) {
        res.status(400).json({ error: 'Título e Intérprete son obligatorios' });
        return;
      }

      const trackId = `track-${Date.now()}`;
      let audioBlobUrl: string | undefined = undefined;
      if (audioFile) {
        if (supabase) audioBlobUrl = await uploadToSupabase(audioFile, 'audio');
        else audioBlobUrl = `/uploads/audio/${audioFile.filename}`;
      }
      let finalCoverUrl = coverUrl;
      if (coverFile) {
        if (supabase) finalCoverUrl = await uploadToSupabase(coverFile, 'covers');
        else finalCoverUrl = `/uploads/covers/${coverFile.filename}`;
      } else if (!finalCoverUrl) {
        finalCoverUrl =
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBbIOA4OG6qP6zaGo-TVABqDiacUDuSWwQ10szC0msiP6uvhXr3miJgVXPWvcYjDRYZ_UWAwLkmJLRY6FhGWSdXALNRxavnM_jB-zM_E1YN8P1KTNdtkPfFZ4wYoVvJUvI78onUHeN2ZSBAOfR1drBCK2k4hMA2HL28_E79atWKXPRu8DY-ChY5nA_OUILxXC58rMt6eJxO-C034Fu75hgxMSdYB3bfwmJizt7QqgHhgRdqwuzBpaO9Ng';
      }

      let parsedChords: string[] = ['Am7', 'D9', 'Fmaj7', 'E7(#9)'];
      if (typeof chords === 'string') {
        parsedChords = chords.split(',').map((c) => c.trim()).filter(Boolean);
      } else if (Array.isArray(chords)) {
        parsedChords = chords;
      }

      const newTrack = {
        id: trackId,
        title: title.trim(),
        artist: artist.trim(),
        album: album?.trim() || 'Despojados',
        duration: duration || '03:45',
        durationSeconds: parseInt(durationSeconds, 10) || 225,
        side: side === 'LADO B' ? 'LADO B' : 'LADO A',
        speed: speed === '45 RPM' ? '45 RPM' : '33 RPM',
        format: format || 'VINILO 180g',
        grooveLabel: `SURCO: ${title.trim().toUpperCase()}`,
        recordingNotes: recordingNotes?.trim() || 'CANCIÓN DE ESTUDIO',
        venueOrStudio: venueOrStudio?.trim() || 'LA PLATA // MÁSTER DIRECTO',
        year: year?.trim() || '2024',
        coverUrl: finalCoverUrl,
        audioBlobUrl,
        hasCustomAudio: !!audioFile,
        chords: parsedChords,
        createdAt: Date.now(),
      };

      await saveTrack(newTrack);

      res.status(201).json({ success: true, track: newTrack });
    } catch (err: any) {
      console.error('Error uploading track:', err);
      res.status(500).json({ error: 'Error procesando el archivo de audio: ' + err.message });
    }
  }
);

// Admin: Delete a track
app.delete('/api/admin/tracks/:id', requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  const tracks = await getTracks();
  const trackToDelete = tracks.find((t: any) => t.id === id);

  if (!trackToDelete) {
    res.status(404).json({ error: 'Pista no encontrada' });
    return;
  }

  // If track has uploaded audio, remove physical file
  if (trackToDelete.audioBlobUrl && trackToDelete.audioBlobUrl.startsWith('/uploads/')) {
    const filePath = path.join(process.cwd(), trackToDelete.audioBlobUrl);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.error('Failed to unlink audio file:', e);
      }
    }
  }

  await deleteTrackData(id);
  res.json({ success: true, message: 'Pista eliminada del archivo' });
});

// Admin: Reset to default catalogue
app.post('/api/admin/reset', requireAdminAuth, async (req, res) => {
  await resetTracks();
  res.json({ success: true, tracks: INITIAL_DEFAULT_TRACKS });
});

// ==========================================
// SITE CONTENT API (TITULOS, TEXTOS & BIO)
// ==========================================
app.get('/api/content', async (req, res) => {
  const content = await getContent();
  res.json(content);
});

app.put('/api/admin/content', requireAdminAuth, async (req, res) => {
  try {
    const current = await getContent();
    const updated = { ...current, ...req.body };
    await saveContent(updated);
    res.json({ success: true, content: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Error guardando contenidos del sitio: ' + err.message });
  }
});

// ==========================================
// POSTS (PUBLICACIONES) API
// ==========================================
app.get('/api/posts', async (req, res) => {
  const posts = await getPosts();
  res.json(posts);
});

app.post(
  '/api/admin/posts',
  requireAdminAuth,
  upload.fields([{ name: 'image', maxCount: 1 }]),
  async (req: Request, res: Response) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const imageFile = files?.['image']?.[0];
      const { title, category, date, content, imageUrl } = req.body;

      if (!title || !content) {
        res.status(400).json({ error: 'Título y contenido son obligatorios' });
        return;
      }

      let finalImageUrl = imageUrl || '';
      if (imageFile) {
        if (supabase) finalImageUrl = await uploadToSupabase(imageFile, 'images') || '';
        else finalImageUrl = `/uploads/images/${imageFile.filename}`;
      }

      const newPost = {
        id: `post-${Date.now()}`,
        title: title.trim(),
        category: category?.trim() || 'Novedad',
        date: date?.trim() || new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }),
        content: content.trim(),
        imageUrl: finalImageUrl,
        createdAt: Date.now(),
      };

      await savePost(newPost);

      res.status(201).json({ success: true, post: newPost });
    } catch (err: any) {
      res.status(500).json({ error: 'Error creando publicación: ' + err.message });
    }
  }
);

app.put(
  '/api/admin/posts/:id',
  requireAdminAuth,
  upload.fields([{ name: 'image', maxCount: 1 }]),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const imageFile = files?.['image']?.[0];
      const { title, category, date, content, imageUrl } = req.body;

      const posts = await getPosts();
      const postIndex = posts.findIndex((p: any) => p.id === id);
      if (postIndex === -1) {
        res.status(404).json({ error: 'Publicación no encontrada' });
        return;
      }

      let finalImageUrl = imageUrl ?? posts[postIndex].imageUrl;
      if (imageFile) {
        if (supabase) finalImageUrl = await uploadToSupabase(imageFile, 'images') || '';
        else finalImageUrl = `/uploads/images/${imageFile.filename}`;
      }

      const updatedPostData = {
        ...posts[postIndex],
        title: title ? title.trim() : posts[postIndex].title,
        category: category ? category.trim() : posts[postIndex].category,
        date: date ? date.trim() : posts[postIndex].date,
        content: content ? content.trim() : posts[postIndex].content,
        imageUrl: finalImageUrl,
      };
      await updatePostData(id, updatedPostData);
      posts[postIndex] = updatedPostData;
      res.json({ success: true, post: posts[postIndex] });
    } catch (err: any) {
      res.status(500).json({ error: 'Error actualizando publicación: ' + err.message });
    }
  }
);

app.delete('/api/admin/posts/:id', requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  const posts = await getPosts();
  const postToDelete = posts.find((p: any) => p.id === id);
  if (!postToDelete) {
    res.status(404).json({ error: 'Publicación no encontrada' });
    return;
  }

  if (postToDelete.imageUrl && postToDelete.imageUrl.startsWith('/uploads/')) {
    const filePath = path.join(process.cwd(), postToDelete.imageUrl);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.error('Failed to unlink post image:', e);
      }
    }
  }

  await deletePostData(id);
  res.json({ success: true, message: 'Publicación eliminada' });
});

// Single image upload endpoint (for adding custom photos easily)
app.post(
  '/api/admin/upload-image',
  requireAdminAuth,
  upload.single('image'),
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: 'No se envió ningún archivo de imagen' });
      return;
    }
    const imageUrl = supabase && req.file ? await uploadToSupabase(req.file, 'images') : (req.file ? `/uploads/images/${req.file.filename}` : '');
    res.json({ success: true, url: imageUrl });
  }
);

// ==========================================
// VITE / STATIC SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Despojados server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
