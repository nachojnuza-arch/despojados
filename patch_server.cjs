const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const importAdmin = `import * as admin from 'firebase-admin';

// Initialize Firebase
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = typeof process.env.FIREBASE_SERVICE_ACCOUNT === 'string' && process.env.FIREBASE_SERVICE_ACCOUNT.startsWith('{') 
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
      : JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf8'));
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'your-bucket.appspot.com'
    });
    console.log('Firebase Admin initialized.');
  } catch(e) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT', e);
  }
}
const db = admin.apps.length > 0 ? admin.firestore() : null;
const bucket = admin.apps.length > 0 ? admin.storage().bucket() : null;

async function uploadToFirebase(file, folder) {
  if (!bucket) return null;
  const ext = path.extname(file.originalname).toLowerCase();
  const safeName = file.originalname.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const filename = \`\${folder}/\${Date.now()}_\${safeName}\${ext ? '' : '.bin'}\`;
  const fileRef = bucket.file(filename);
  await fileRef.save(file.buffer, {
    metadata: { contentType: file.mimetype },
    public: true
  });
  return \`https://storage.googleapis.com/\${bucket.name}/\${filename}\`;
}
`;

code = code.replace("import { createServer as createViteServer } from 'vite';", "import { createServer as createViteServer } from 'vite';\n" + importAdmin);

const newDiskHelpers = `
// ==========================================
// DB Helpers (Firebase + Local Fallback)
// ==========================================
async function getTracks(): Promise<any[]> {
  if (db) {
    const snap = await db.collection('tracks').orderBy('createdAt', 'desc').get();
    if (snap.empty) {
      for (const t of INITIAL_DEFAULT_TRACKS) {
        await db.collection('tracks').doc(t.id).set(t);
      }
      return INITIAL_DEFAULT_TRACKS;
    }
    return snap.docs.map(d => d.data());
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
  if (db) {
    await db.collection('tracks').doc(track.id).set(track);
  } else {
    const tracks = await getTracks();
    tracks.unshift(track);
    fs.writeFileSync(TRACKS_FILE, JSON.stringify(tracks, null, 2));
  }
}

async function deleteTrackData(id: string) {
  if (db) {
    await db.collection('tracks').doc(id).delete();
  } else {
    const tracks = await getTracks();
    fs.writeFileSync(TRACKS_FILE, JSON.stringify(tracks.filter(t => t.id !== id), null, 2));
  }
}

async function resetTracks() {
  if (db) {
    const snap = await db.collection('tracks').get();
    const batch = db.batch();
    snap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
    for (const t of INITIAL_DEFAULT_TRACKS) {
      await db.collection('tracks').doc(t.id).set(t);
    }
  } else {
    fs.writeFileSync(TRACKS_FILE, JSON.stringify(INITIAL_DEFAULT_TRACKS, null, 2));
  }
}

async function getContent(): Promise<any> {
  if (db) {
    const doc = await db.collection('config').doc('content').get();
    if (!doc.exists) {
      await db.collection('config').doc('content').set(DEFAULT_CONTENT);
      return DEFAULT_CONTENT;
    }
    return doc.data();
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
  if (db) {
    await db.collection('config').doc('content').set(content, { merge: true });
  } else {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
  }
}

async function getPosts(): Promise<any[]> {
  if (db) {
    const snap = await db.collection('posts').orderBy('createdAt', 'desc').get();
    if (snap.empty) {
      for (const p of DEFAULT_POSTS) {
        await db.collection('posts').doc(p.id).set(p);
      }
      return DEFAULT_POSTS;
    }
    return snap.docs.map(d => d.data());
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
  if (db) {
    await db.collection('posts').doc(post.id).set(post);
  } else {
    const posts = await getPosts();
    posts.unshift(post);
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
  }
}

async function updatePostData(id: string, updates: any) {
  if (db) {
    await db.collection('posts').doc(id).set(updates, { merge: true });
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
  if (db) {
    await db.collection('posts').doc(id).delete();
  } else {
    const posts = await getPosts();
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts.filter(p => p.id !== id), null, 2));
  }
}
`;

// Replace disk helpers completely
const diskHelperRegex = /\/\/ Disk I\/O Helpers[\s\S]*?(?=\/\/ API ENDPOINTS)/;
code = code.replace(diskHelperRegex, newDiskHelpers + "\n\n// API ENDPOINTS\n");

// Replace getTracksFromDisk with getTracks (async) everywhere
code = code.replace(/const tracks = getTracksFromDisk\(\);/g, 'const tracks = await getTracks();');
code = code.replace(/const tracks = getTracksFromDisk\(\)\.length;/g, 'const tracks = await getTracks(); const tracksCount = tracks.length;');

// Replace multer configuration to use memoryStorage if Firebase is used
const multerConfigRegex = /const storage = multer\.diskStorage\(\{[\s\S]*?\}\);\s*const upload = multer\(\{\s*storage,\s*limits: \{\s*fileSize: 100 \* 1024 \* 1024,\s*\},\s*\}\);/;
const newMulterConfig = `const upload = multer({
  storage: process.env.FIREBASE_SERVICE_ACCOUNT ? multer.memoryStorage() : multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'audio') cb(null, AUDIO_UPLOADS_DIR);
      else if (file.fieldname === 'cover') cb(null, COVERS_UPLOADS_DIR);
      else if (file.fieldname === 'image') cb(null, IMAGES_UPLOADS_DIR);
      else cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeName = file.originalname.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      cb(null, \`\${Date.now()}_\${safeName}\${ext ? '' : '.bin'}\`);
    }
  }),
  limits: { fileSize: 100 * 1024 * 1024 }
});`;
code = code.replace(multerConfigRegex, newMulterConfig);

// Rewrite endpoints to be async
code = code.replace(/app\.get\('\/api\/tracks', \(req, res\) => \{/g, "app.get('/api/tracks', async (req, res) => {");
code = code.replace(/app\.get\('\/api\/content', \(req, res\) => \{/g, "app.get('/api/content', async (req, res) => {");
code = code.replace(/const content = getContentFromDisk\(\);/g, "const content = await getContent();");
code = code.replace(/app\.put\('\/api\/admin\/content', requireAdminAuth, \(req, res\) => \{/g, "app.put('/api/admin/content', requireAdminAuth, async (req, res) => {");
code = code.replace(/const current = getContentFromDisk\(\);/g, "const current = await getContent();");
code = code.replace(/saveContentToDisk\(updated\);/g, "await saveContent(updated);");
code = code.replace(/app\.get\('\/api\/posts', \(req, res\) => \{/g, "app.get('/api/posts', async (req, res) => {");
code = code.replace(/const posts = getPostsFromDisk\(\);/g, "const posts = await getPosts();");
code = code.replace(/app\.delete\('\/api\/admin\/tracks\/:id', requireAdminAuth, \(req, res\) => \{/g, "app.delete('/api/admin/tracks/:id', requireAdminAuth, async (req, res) => {");
code = code.replace(/app\.post\('\/api\/admin\/reset', requireAdminAuth, \(req, res\) => \{/g, "app.post('/api/admin/reset', requireAdminAuth, async (req, res) => {");
code = code.replace(/app\.delete\('\/api\/admin\/posts\/:id', requireAdminAuth, \(req, res\) => \{/g, "app.delete('/api/admin/posts/:id', requireAdminAuth, async (req, res) => {");

// Update track upload
code = code.replace(/\(req: Request, res: Response\) => \{[\s\S]*?const trackId = `track-\${Date\.now\(\)}`;/, `async (req: Request, res: Response) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const audioFile = files?.['audio']?.[0];
      const coverFile = files?.['cover']?.[0];

      const { title, artist, album, duration, durationSeconds, side, speed, format, venueOrStudio, recordingNotes, year, coverUrl, chords } = req.body;

      if (!title || !artist) {
        res.status(400).json({ error: 'Título e Intérprete son obligatorios' });
        return;
      }

      const trackId = \`track-\${Date.now()}\`;`);

const uploadLogicTrack = `      let audioBlobUrl: string | undefined = undefined;
      if (audioFile) {
        if (bucket) {
          audioBlobUrl = await uploadToFirebase(audioFile, 'audio');
        } else {
          audioBlobUrl = \`/uploads/audio/\${audioFile.filename}\`;
        }
      }

      let finalCoverUrl = coverUrl;
      if (coverFile) {
        if (bucket) {
          finalCoverUrl = await uploadToFirebase(coverFile, 'covers');
        } else {
          finalCoverUrl = \`/uploads/covers/\${coverFile.filename}\`;
        }
      }`;
const oldUploadLogicTrack = /let audioBlobUrl[\s\S]*?finalCoverUrl = `\/uploads\/covers\/\$\{coverFile\.filename\}`;[\s]*\}/;
code = code.replace(oldUploadLogicTrack, uploadLogicTrack);

code = code.replace(/tracks\.unshift\(newTrack\);\s*saveTracksToDisk\(tracks\);/g, "await saveTrack(newTrack);");

// Update track delete
const oldDeleteTrackLogic = /const updatedTracks = tracks\.filter\(\(t\) => t\.id !== id\);\s*saveTracksToDisk\(updatedTracks\);/;
code = code.replace(oldDeleteTrackLogic, "await deleteTrackData(id);");

// Update reset
code = code.replace(/saveTracksToDisk\(INITIAL_DEFAULT_TRACKS\);/, "await resetTracks();");

// Update post upload
code = code.replace(/app\.post\(\s*'\/api\/admin\/posts',[\s\S]*?\(req: Request, res: Response\) => \{[\s\S]*?if \(!title \|\| !content\) \{/m, `app.post(
  '/api/admin/posts',
  requireAdminAuth,
  upload.fields([{ name: 'image', maxCount: 1 }]),
  async (req: Request, res: Response) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const imageFile = files?.['image']?.[0];
      const { title, category, date, content, imageUrl } = req.body;

      if (!title || !content) {`);

const oldUploadLogicPost = /let finalImageUrl = imageUrl \|\| '';[\s\S]*?finalImageUrl = `\/uploads\/images\/\$\{imageFile\.filename\}`;[\s]*\}/;
const uploadLogicPost = `let finalImageUrl = imageUrl || '';
      if (imageFile) {
        if (bucket) {
          finalImageUrl = await uploadToFirebase(imageFile, 'images');
        } else {
          finalImageUrl = \`/uploads/images/\${imageFile.filename}\`;
        }
      }`;
code = code.replace(oldUploadLogicPost, uploadLogicPost);
code = code.replace(/posts\.unshift\(newPost\);\s*savePostsToDisk\(posts\);/g, "await savePost(newPost);");

// Update post update
code = code.replace(/app\.put\(\s*'\/api\/admin\/posts\/:id',[\s\S]*?\(req: Request, res: Response\) => \{[\s\S]*?const \{ id \} = req\.params;/, `app.put(
  '/api/admin/posts/:id',
  requireAdminAuth,
  upload.fields([{ name: 'image', maxCount: 1 }]),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;`);

const oldUpdateLogicPost = /let finalImageUrl = imageUrl \?\? posts\[postIndex\]\.imageUrl;[\s\S]*?finalImageUrl = `\/uploads\/images\/\$\{imageFile\.filename\}`;[\s]*\}/;
const updateLogicPost = `let finalImageUrl = imageUrl ?? posts[postIndex].imageUrl;
      if (imageFile) {
        if (bucket) {
          finalImageUrl = await uploadToFirebase(imageFile, 'images');
        } else {
          finalImageUrl = \`/uploads/images/\${imageFile.filename}\`;
        }
      }`;
code = code.replace(oldUpdateLogicPost, updateLogicPost);
code = code.replace(/savePostsToDisk\(posts\);/g, `await updatePostData(id, posts[postIndex]);`);

// Update post delete
const oldDeletePostLogic = /const updatedPosts = posts\.filter\(\(p\) => p\.id !== id\);\s*savePostsToDisk\(updatedPosts\);/;
code = code.replace(oldDeletePostLogic, "await deletePostData(id);");

// Update single image upload
code = code.replace(/app\.post\(\s*'\/api\/admin\/upload-image',[\s\S]*?\(req: Request, res: Response\) => \{/, `app.post(
  '/api/admin/upload-image',
  requireAdminAuth,
  upload.single('image'),
  async (req: Request, res: Response) => {`);

const oldImageUploadLogic = /const imageUrl = `\/uploads\/images\/\$\{req\.file\.filename\}`;/;
const imageUploadLogic = `const imageUrl = bucket ? await uploadToFirebase(req.file, 'images') : \`/uploads/images/\${req.file.filename}\`;`;
code = code.replace(oldImageUploadLogic, imageUploadLogic);

// Ensure the code is correct
fs.writeFileSync('server.ts', code);
console.log('server.ts patched successfully');
