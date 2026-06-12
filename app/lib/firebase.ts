import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
  query,
  where,
  onSnapshot,
  increment,
  arrayUnion,
  serverTimestamp,
  Timestamp,
  orderBy,
  limit,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signInWithCredential,
  getRedirectResult,
  GoogleAuthProvider,
  OAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export {
  db,
  auth,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
  query,
  where,
  onSnapshot,
  increment,
  arrayUnion,
  serverTimestamp,
  Timestamp,
  orderBy,
  limit,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signInWithCredential,
  getRedirectResult,
  GoogleAuthProvider,
  OAuthProvider,
  signOut,
  onAuthStateChanged,
};

export type { User };

export async function ensureUserDoc(userId: string, data: Record<string, any>) {
  const ref = doc(db, `users/${userId}`);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { ...data, created_at: serverTimestamp() });
  }
  return ref;
}

export async function getUserProfile(userId: string) {
  const ref = doc(db, `users/${userId}/profile/main`);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function setUserProfile(userId: string, data: Record<string, any>) {
  const ref = doc(db, `users/${userId}/profile/main`);
  await setDoc(ref, { ...data, updated_at: serverTimestamp() }, { merge: true });
}

export async function getMemories(userId: string): Promise<string[]> {
  const ref = doc(db, `users/${userId}/memories/observations`);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().items || [] : [];
}

export async function addMemory(userId: string, newObservations: string[]) {
  if (!newObservations.length) return;
  const ref = doc(db, `users/${userId}/memories/observations`);
  const snap = await getDoc(ref);
  const existing: string[] = snap.exists() ? snap.data().items || [] : [];
  const combined = [...new Set([...existing, ...newObservations])].slice(-10);
  await setDoc(ref, { items: combined, updated_at: serverTimestamp() }, { merge: true });
}
