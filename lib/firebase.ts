"use client";

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAxQCp83uUp9HGl0XezV4KSynuzaDP-x8g",
  authDomain: "parking-ba468.firebaseapp.com",
  projectId: "parking-ba468",
  storageBucket: "parking-ba468.firebasestorage.app",
  messagingSenderId: "969164155593",
  appId: "1:969164155593:web:f0a9783ed55db86288bb18",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

// Set persistence to local
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

export { auth, db };