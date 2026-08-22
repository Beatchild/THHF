import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const getFirebaseAdminApp = (): App => {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  if (!process.env.FIREBASE_PRIVATE_KEY) {
    return initializeApp();
  }

  
  let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  } else if (privateKey.includes('\n')) {
    privateKey = privateKey.replace(/\n/g, '\n');
  }


  const credential = cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey,
  });

  return initializeApp({
    credential,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  });
};

export const adminApp = getFirebaseAdminApp();
export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
import { getStorage } from 'firebase-admin/storage';
export const adminStorage = getStorage(adminApp);
