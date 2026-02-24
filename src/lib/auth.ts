'use client';

import { initializeFirebase } from '@/firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential, updateProfile } from 'firebase/auth';

const { auth } = initializeFirebase();
const provider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<UserCredential> {
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
}

export async function signUpWithEmail(email: string, password: string): Promise<any> {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error signing up with email", error);
        throw error;
    }
}

export async function signInWithEmail(email: string, password: string): Promise<any> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error signing in with email", error);
        throw error;
    }
}

export async function updateUserProfile({ displayName }: { displayName: string }) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is signed in to update.");
  }
  try {
    await updateProfile(user, { displayName });
  } catch (error) {
    console.error("Error updating profile", error);
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

export function generateCustomUserId(uid: string): string {
  if (!uid) return '';
  // Use last 8 chars for more "randomness" appearance
  const uniquePart = uid.slice(-8).toUpperCase();
  return `Gry8${uniquePart}VIP`;
}
