const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace("import admin from 'firebase-admin';", "import { initializeApp, cert, getApps } from 'firebase-admin/app';\nimport { getFirestore } from 'firebase-admin/firestore';\nimport { getStorage } from 'firebase-admin/storage';");
code = code.replace("admin.initializeApp({", "initializeApp({");
code = code.replace("admin.credential.cert(serviceAccount)", "cert(serviceAccount)");
code = code.replace("const db = admin.apps.length > 0 ? admin.firestore() : null;", "const db = getApps().length > 0 ? getFirestore() : null;");
code = code.replace("const bucket = admin.apps.length > 0 ? admin.storage().bucket() : null;", "const bucket = getApps().length > 0 ? getStorage().bucket() : null;");

fs.writeFileSync('server.ts', code);
