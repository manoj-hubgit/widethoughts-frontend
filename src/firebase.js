
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "widethoughts-m.firebaseapp.com",
  projectId: "widethoughts-m",
  storageBucket: "widethoughts-m.appspot.com",
  messagingSenderId: "636677648977",
  appId: "1:636677648977:web:2cc597a102be6de4d6be70"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);