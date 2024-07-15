// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1ub06fM2ZrYzHytT4j9hDMduPU-p4-Pk",
  authDomain: "my-project-fc361.firebaseapp.com",
  projectId: "my-project-fc361",
  storageBucket: "my-project-fc361.appspot.com",
  messagingSenderId: "228002789297",
  appId: "1:228002789297:web:b998a80de78e5c86026f90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app)
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);

signInAnonymously(auth).catch((error) => {
  console.error("Error signing in anonymously", error);
});

export { db, auth };
