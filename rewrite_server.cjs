const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// 1. Add Firebase Admin import
code = code.replace(
  "import { createServer as createViteServer } from 'vite';",
  "import { createServer as createViteServer } from 'vite';\nimport * as admin from 'firebase-admin';\n"
);

// 2. Add Firebase init logic right after app creation
code = code.replace(
  "const PORT = 3000;",
  `const PORT = 3000;

// ==========================================
// FIREBASE INITIALIZATION
// ==========================================
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT.startsWith('{')
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

async function uploadToFirebase(file: Express.Multer.File, folder: string): Promise<string | undefined> {
  if (!bucket) return undefined;
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
`
);

// 3. Replace Multer storage configuration
const multerOld = /const storage = multer\.diskStorage\(\{[\s\S]*?\}\);\n\nconst upload = multer\(\{\n  storage,\n  limits: \{\n    fileSize: 100 \* 1024 \* 1024,\n  \},\n\}\);/;
const multerNew = `const upload = multer({
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
code = code.replace(multerOld, multerNew);

// 4. Replace ALL disk IO helpers
const diskIOStart = code.indexOf('// Disk I/O Helpers');
const apiEndpointsStart = code.indexOf('// ==========================================');
const oldDiskIO = code.slice(diskIOStart, apiEndpointsStart);

const newDBHelpers = `// ==========================================
// DB Helpers (Firebase + Local Fallback)
// ==========================================
async function getTracks(): Promise<any[]> {
  if (db) {
    const snap = await db.collection('tracks').orderBy('createdAt', 'desc').get();
    if (snap.empty) {
      for (const t of INITIAL_DEFAULT_TRACKS) await db.collection('tracks').doc(t.id).set(t);
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
    for (const t of INITIAL_DEFAULT_TRACKS) await db.collection('tracks').doc(t.id).set(t);
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
      for (const p of DEFAULT_POSTS) await db.collection('posts').doc(p.id).set(p);
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
code = code.replace(oldDiskIO, newDBHelpers);

// 5. Rewrite Track endpoints
code = code.replace("app.get('/api/tracks', (req, res) => {", "app.get('/api/tracks', async (req, res) => {");
code = code.replace("const tracks = getTracksFromDisk();", "const tracks = await getTracks();");

code = code.replace(
  "app.post(\n  '/api/admin/upload',",
  "app.post(\n  '/api/admin/upload',"
);
code = code.replace(
  "(req: Request, res: Response) => {",
  "async (req: Request, res: Response) => {"
);
const oldUploadTrackFiles = /let audioBlobUrl: string \| undefined = undefined;\n\s*if \(audioFile\) \{\n\s*audioBlobUrl = `\/uploads\/audio\/\$\{audioFile\.filename\}`;\n\s*\}\n\n\s*let finalCoverUrl = coverUrl;\n\s*if \(coverFile\) \{\n\s*finalCoverUrl = `\/uploads\/covers\/\$\{coverFile\.filename\}`;\n\s*\}/;
const newUploadTrackFiles = `let audioBlobUrl: string | undefined = undefined;
      if (audioFile) {
        if (bucket) audioBlobUrl = await uploadToFirebase(audioFile, 'audio');
        else audioBlobUrl = \`/uploads/audio/\${audioFile.filename}\`;
      }
      let finalCoverUrl = coverUrl;
      if (coverFile) {
        if (bucket) finalCoverUrl = await uploadToFirebase(coverFile, 'covers');
        else finalCoverUrl = \`/uploads/covers/\${coverFile.filename}\`;
      }`;
code = code.replace(oldUploadTrackFiles, newUploadTrackFiles);
code = code.replace(/const tracks = getTracksFromDisk\(\);\s*tracks\.unshift\(newTrack\);\s*saveTracksToDisk\(tracks\);/, "await saveTrack(newTrack);");

code = code.replace("app.delete('/api/admin/tracks/:id', requireAdminAuth, (req, res) => {", "app.delete('/api/admin/tracks/:id', requireAdminAuth, async (req, res) => {");
code = code.replace(/const tracks = getTracksFromDisk\(\);[\s\S]*?const trackToDelete = tracks\.find\(\(t\) => t\.id === id\);/, "const tracks = await getTracks();\n  const trackToDelete = tracks.find((t: any) => t.id === id);");
code = code.replace(/const updatedTracks = tracks\.filter\(\(t\) => t\.id !== id\);\s*saveTracksToDisk\(updatedTracks\);/, "await deleteTrackData(id);");

code = code.replace("app.post('/api/admin/reset', requireAdminAuth, (req, res) => {", "app.post('/api/admin/reset', requireAdminAuth, async (req, res) => {");
code = code.replace("saveTracksToDisk(INITIAL_DEFAULT_TRACKS);", "await resetTracks();");

// 6. Rewrite Content endpoints
code = code.replace("app.get('/api/content', (req, res) => {", "app.get('/api/content', async (req, res) => {");
code = code.replace("const content = getContentFromDisk();", "const content = await getContent();");

code = code.replace("app.put('/api/admin/content', requireAdminAuth, (req, res) => {", "app.put('/api/admin/content', requireAdminAuth, async (req, res) => {");
code = code.replace("const current = getContentFromDisk();", "const current = await getContent();");
code = code.replace("saveContentToDisk(updated);", "await saveContent(updated);");

// 7. Rewrite Post endpoints
code = code.replace("app.get('/api/posts', (req, res) => {", "app.get('/api/posts', async (req, res) => {");
code = code.replace("const posts = getPostsFromDisk();", "const posts = await getPosts();");

code = code.replace("app.post(\n  '/api/admin/posts',\n  requireAdminAuth,\n  upload.fields([{ name: 'image', maxCount: 1 }]),\n  (req: Request, res: Response) => {", "app.post(\n  '/api/admin/posts',\n  requireAdminAuth,\n  upload.fields([{ name: 'image', maxCount: 1 }]),\n  async (req: Request, res: Response) => {");
const oldUploadPostFiles = /let finalImageUrl = imageUrl \|\| '';\n\s*if \(imageFile\) \{\n\s*finalImageUrl = `\/uploads\/images\/\$\{imageFile\.filename\}`;\n\s*\}/;
const newUploadPostFiles = `let finalImageUrl = imageUrl || '';
      if (imageFile) {
        if (bucket) finalImageUrl = await uploadToFirebase(imageFile, 'images') || '';
        else finalImageUrl = \`/uploads/images/\${imageFile.filename}\`;
      }`;
code = code.replace(oldUploadPostFiles, newUploadPostFiles);
code = code.replace(/const posts = getPostsFromDisk\(\);\s*posts\.unshift\(newPost\);\s*savePostsToDisk\(posts\);/, "await savePost(newPost);");

code = code.replace("app.put(\n  '/api/admin/posts/:id',\n  requireAdminAuth,\n  upload.fields([{ name: 'image', maxCount: 1 }]),\n  (req: Request, res: Response) => {", "app.put(\n  '/api/admin/posts/:id',\n  requireAdminAuth,\n  upload.fields([{ name: 'image', maxCount: 1 }]),\n  async (req: Request, res: Response) => {");
code = code.replace(/const posts = getPostsFromDisk\(\);\s*const postIndex = posts\.findIndex\(\(p\) => p\.id === id\);/, "const posts = await getPosts();\n      const postIndex = posts.findIndex((p: any) => p.id === id);");
const oldUpdatePostFiles = /let finalImageUrl = imageUrl \?\? posts\[postIndex\]\.imageUrl;\n\s*if \(imageFile\) \{\n\s*finalImageUrl = `\/uploads\/images\/\$\{imageFile\.filename\}`;\n\s*\}/;
const newUpdatePostFiles = `let finalImageUrl = imageUrl ?? posts[postIndex].imageUrl;
      if (imageFile) {
        if (bucket) finalImageUrl = await uploadToFirebase(imageFile, 'images') || '';
        else finalImageUrl = \`/uploads/images/\${imageFile.filename}\`;
      }`;
code = code.replace(oldUpdatePostFiles, newUpdatePostFiles);
code = code.replace(/posts\[postIndex\] = \{[\s\S]*?\};\n\n\s*savePostsToDisk\(posts\);/m, `const updatedPostData = {
        ...posts[postIndex],
        title: title ? title.trim() : posts[postIndex].title,
        category: category ? category.trim() : posts[postIndex].category,
        date: date ? date.trim() : posts[postIndex].date,
        content: content ? content.trim() : posts[postIndex].content,
        imageUrl: finalImageUrl,
      };
      await updatePostData(id, updatedPostData);
      posts[postIndex] = updatedPostData;`);

code = code.replace("app.delete('/api/admin/posts/:id', requireAdminAuth, (req, res) => {", "app.delete('/api/admin/posts/:id', requireAdminAuth, async (req, res) => {");
code = code.replace(/const posts = getPostsFromDisk\(\);\s*const postToDelete = posts\.find\(\(p\) => p\.id === id\);/, "const posts = await getPosts();\n  const postToDelete = posts.find((p: any) => p.id === id);");
code = code.replace(/const updatedPosts = posts\.filter\(\(p\) => p\.id !== id\);\s*savePostsToDisk\(updatedPosts\);/, "await deletePostData(id);");

code = code.replace("app.post(\n  '/api/admin/upload-image',\n  requireAdminAuth,\n  upload.single('image'),\n  (req: Request, res: Response) => {", "app.post(\n  '/api/admin/upload-image',\n  requireAdminAuth,\n  upload.single('image'),\n  async (req: Request, res: Response) => {");
code = code.replace("const imageUrl = `/uploads/images/${req.file.filename}`;", "const imageUrl = bucket && req.file ? await uploadToFirebase(req.file, 'images') : (req.file ? `/uploads/images/${req.file.filename}` : '');");

fs.writeFileSync('server.ts', code);
