const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
require('dotenv').config({ path: '.env.local' });

async function testUpload() {
  try {
    let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
    if (privateKey.includes('\n') || privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }
    const credential = cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    });
    const app = initializeApp({
      credential,
      storageBucket: 'thhf-blog.appspot.com'
    });
    const bucket = getStorage(app).bucket();
    const fileRef = bucket.file('test2.txt');
    await fileRef.save('Hello world');
    console.log('Upload successful');
  } catch (e) {
    console.error('ERROR:', e.message);
  }
}
testUpload();
