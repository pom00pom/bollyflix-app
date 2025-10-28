// src/firebase.js - FINAL AND CORRECT
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, RecaptchaVerifier } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// --- आपका Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyBPi6XUCbLsRofpJ19X4a65zQkumiXVipU",
  authDomain: "hollyflix-app.firebaseapp.com",
  projectId: "hollyflix-app",
  storageBucket: "hollyflix-app.firebasestorage.app",
  messagingSenderId: "877951256563",
  appId: "1:877951256563:web:70e2b9ca4e051e88eab486",
  measurementId: "G-RV8GBZKC6M"
};
// -----------------------------

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// reCAPTCHA बनाने का फंक्शन
export const generateRecaptcha = (containerId) => {
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
  }
  window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    'size': 'invisible',
    'callback': (response) => {
      // reCAPTCHA solved
    }
  });
};