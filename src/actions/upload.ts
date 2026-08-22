'use server';

import { adminStorage } from '@/lib/firebase-admin';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImageAction(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop();
    const filename = `blog-images/${Date.now()}-${uuidv4()}.${ext}`;

    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!bucketName) throw new Error('No storage bucket configured');
    
    const bucket = adminStorage.bucket(bucketName);
    const fileRef = bucket.file(filename);

    const token = uuidv4(); // Generate a secure token

    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          firebaseStorageDownloadTokens: token, // This makes the URL work FOREVER without changing rules!
        }
      },
    });

    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filename)}?alt=media&token=${token}`;

    return { url };
  } catch (error: any) {
    console.error('Upload error:', error);
    return { error: error.message };
  }
}
