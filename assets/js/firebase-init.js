// Firebase SDK loaded via CDN in each HTML file
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBj46m2-duKEwXDDl68fGImNuHRovw2JsM",
  authDomain: "d4rkz-quiz.firebaseapp.com",
  projectId: "d4rkz-quiz",
  storageBucket: "d4rkz-quiz.firebasestorage.app",
  messagingSenderId: "711998674723",
  appId: "1:711998674723:web:089cb0cc93bacd375e1e96",
  measurementId: "G-4DMRCNZ6TD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
