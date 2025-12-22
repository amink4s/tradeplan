import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfigStr = import.meta.env.VITE_FIREBASE_CONFIG;

if (!firebaseConfigStr) {
  console.warn('VITE_FIREBASE_CONFIG is not set. Firebase features will not work.');
}

const firebaseConfig = firebaseConfigStr ? JSON.parse(firebaseConfigStr) : null;

// Initialize Firebase
export const app = firebaseConfig ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

