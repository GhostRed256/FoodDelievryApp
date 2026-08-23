// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAOXjdWH5NNedqygcmtCvsSceNpsD5R0_A",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "foodnjoy-95079.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "foodnjoy-95079",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "foodnjoy-95079.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "346896317993",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:346896317993:web:baad9b513df52db4fb2638",
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
