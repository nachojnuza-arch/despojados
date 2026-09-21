const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace("import * as admin from 'firebase-admin';", "import admin from 'firebase-admin';");
code = code.replace(/snap\.docs\.map\(d => d\.data\(\)\);/g, "snap.docs.map((d: any) => d.data());");
code = code.replace(/snap\.docs\.forEach\(d => batch\.delete\(d\.ref\)\);/g, "snap.docs.forEach((d: any) => batch.delete(d.ref));");

fs.writeFileSync('server.ts', code);
