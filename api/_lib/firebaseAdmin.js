// Inicializa o Firebase Admin uma única vez (evita reinicializar a cada
// chamada de função serverless, o que quebraria em ambiente Vercel).
const admin = require('firebase-admin');

function getFirestore() {
  if (!admin.apps.length) {
    const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
  }
  return admin.firestore();
}

module.exports = { getFirestore };
