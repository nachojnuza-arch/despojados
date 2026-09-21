import { Track, Post, SiteContent } from '../types';

export const DEFAULT_TRACKS: Track[] = [
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

export const DEFAULT_SITE_CONTENT: SiteContent = {
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

export const DEFAULT_POSTS: Post[] = [
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

const LOCAL_STORAGE_KEY = 'despojados_tracks_v3';
const ADMIN_SESSION_TOKEN_KEY = 'despojados_admin_token';
const LOCAL_CONTENT_KEY = 'despojados_site_content_v1';
const LOCAL_POSTS_KEY = 'despojados_posts_v1';

// Admin Session Management
export function getAdminToken(): string | null {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string): void {
  try {
    sessionStorage.setItem(ADMIN_SESSION_TOKEN_KEY, token);
  } catch {}
}

export function clearAdminToken(): void {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_TOKEN_KEY);
  } catch {}
}

// Admin Login to backend
export async function loginAdmin(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      setAdminToken(data.token);
      return { success: true, token: data.token };
    }
    return { success: false, error: data.error || 'Clave de administración incorrecta' };
  } catch (err: any) {
    return { success: false, error: 'Error conectando con el servidor' };
  }
}

// ==========================================
// TRACKS SERVICE
// ==========================================

export async function loadTracks(): Promise<Track[]> {
  try {
    const res = await fetch('/api/tracks');
    if (res.ok) {
      const serverTracks: Track[] = await res.json();
      if (serverTracks && serverTracks.length > 0) {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serverTracks));
        } catch {}
        return serverTracks;
      }
    }
  } catch (err) {
    console.warn('Could not fetch tracks from server, falling back to cache:', err);
  }

  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {}

  return DEFAULT_TRACKS;
}

export async function uploadTrackToServer(
  formData: FormData,
  token?: string
): Promise<{ success: boolean; track?: Track; error?: string }> {
  const adminToken = token || getAdminToken();
  try {
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: {
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Error al subir la pista' };
    }
    return { success: true, track: data.track };
  } catch (err: any) {
    return { success: false, error: 'Error de red al subir la pista: ' + err.message };
  }
}

export async function deleteTrackFromServer(
  trackId: string,
  token?: string
): Promise<{ success: boolean; error?: string }> {
  const adminToken = token || getAdminToken();
  try {
    const res = await fetch(`/api/admin/tracks/${trackId}`, {
      method: 'DELETE',
      headers: {
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Error al eliminar pista' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: 'Error de red: ' + err.message };
  }
}

export async function resetArchiveOnServer(
  token?: string
): Promise<{ success: boolean; tracks?: Track[]; error?: string }> {
  const adminToken = token || getAdminToken();
  try {
    const res = await fetch('/api/admin/reset', {
      method: 'POST',
      headers: {
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Error al restablecer' };
    }
    return { success: true, tracks: data.tracks };
  } catch (err: any) {
    return { success: false, error: 'Error de red' };
  }
}

// ==========================================
// SITE CONTENT SERVICE (TITULOS, TEXTOS & BIO)
// ==========================================

export async function loadSiteContent(): Promise<SiteContent> {
  try {
    const res = await fetch('/api/content');
    if (res.ok) {
      const data = await res.json();
      if (data && data.bandName) {
        try {
          localStorage.setItem(LOCAL_CONTENT_KEY, JSON.stringify(data));
        } catch {}
        return data;
      }
    }
  } catch (err) {
    console.warn('Could not fetch site content, using cache:', err);
  }

  try {
    const cached = localStorage.getItem(LOCAL_CONTENT_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {}

  return DEFAULT_SITE_CONTENT;
}

export async function saveSiteContent(
  content: SiteContent,
  token?: string
): Promise<{ success: boolean; content?: SiteContent; error?: string }> {
  const adminToken = token || getAdminToken();
  try {
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      },
      body: JSON.stringify(content),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Error al guardar textos del sitio' };
    }
    try {
      localStorage.setItem(LOCAL_CONTENT_KEY, JSON.stringify(data.content));
    } catch {}
    return { success: true, content: data.content };
  } catch (err: any) {
    return { success: false, error: 'Error de red: ' + err.message };
  }
}

// ==========================================
// POSTS (PUBLICACIONES) SERVICE
// ==========================================

export async function loadPosts(): Promise<Post[]> {
  try {
    const res = await fetch('/api/posts');
    if (res.ok) {
      const posts: Post[] = await res.json();
      if (Array.isArray(posts)) {
        try {
          localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(posts));
        } catch {}
        return posts;
      }
    }
  } catch (err) {
    console.warn('Could not fetch posts, using cache:', err);
  }

  try {
    const cached = localStorage.getItem(LOCAL_POSTS_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {}

  return DEFAULT_POSTS;
}

export async function savePost(
  formData: FormData,
  postId?: string,
  token?: string
): Promise<{ success: boolean; post?: Post; error?: string }> {
  const adminToken = token || getAdminToken();
  const url = postId ? `/api/admin/posts/${postId}` : '/api/admin/posts';
  const method = postId ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: {
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Error al guardar publicación' };
    }
    return { success: true, post: data.post };
  } catch (err: any) {
    return { success: false, error: 'Error de red al guardar publicación: ' + err.message };
  }
}

export async function deletePost(
  postId: string,
  token?: string
): Promise<{ success: boolean; error?: string }> {
  const adminToken = token || getAdminToken();
  try {
    const res = await fetch(`/api/admin/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Error al eliminar publicación' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: 'Error de red: ' + err.message };
  }
}

export async function uploadCustomImage(
  file: File,
  token?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const adminToken = token || getAdminToken();
  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch('/api/admin/upload-image', {
      method: 'POST',
      headers: {
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Error al subir la imagen' };
    }
    return { success: true, url: data.url };
  } catch (err: any) {
    return { success: false, error: 'Error de red: ' + err.message };
  }
}
