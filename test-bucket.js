const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
require('dotenv').config({ path: '.env.local' });

async function testUpload() {
  let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
  if (privateKey.includes('\n') || privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }
  const credential = cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey,
  });

  const app = initializeApp({ credential });
  
  const bucketsToTest = ['thhf-blog.firebasestorage.app', 'thhf-blog.appspot.com'];
  let success = false;

  for (const bucketName of bucketsToTest) {
    try {
      console.log('Testing bucket:', bucketName);
      const bucket = getStorage(app).bucket(bucketName);
      const fileRef = bucket.file('test-connection.txt');
      await fileRef.save('Hello world');
      console.log('? Upload successful to:', bucketName);
      success = bucketName;
      break;
    } catch (e) {
      console.log('? Failed:', bucketName, e.message);
    }
  }

  if (success) {
    const fs = require('fs');
    let envContent = fs.readFileSync('.env.local', 'utf8');
    envContent = envContent.replace(
      /NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=.*/, 
      `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${success}`
    );
    fs.writeFileSync('.env.local', envContent, 'utf8');
    console.log('Updated .env.local with correct bucket!');
  }
}
testUpload();
