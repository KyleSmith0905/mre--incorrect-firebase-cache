// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8Gskb8JJZa2Gwh0eUKGix1pSBocu_sQQ",
  authDomain: "mre--incorect-firestore-cache.firebaseapp.com",
  projectId: "mre--incorect-firestore-cache",
  storageBucket: "mre--incorect-firestore-cache.appspot.com",
  messagingSenderId: "609894755319",
  appId: "1:609894755319:web:f5242b445938df0a75dcf2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {app, firestore};