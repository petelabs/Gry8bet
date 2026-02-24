'use client';

import { initializeFirebase } from '@/firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';

const { auth } = initializeFirebase();
const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
}
