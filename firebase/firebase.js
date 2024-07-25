// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcPYkYA0udiwXLxz9NX3J0mcChsa6syHk",
  authDomain: "instagrab-5ac0a.firebaseapp.com",
  projectId: "instagrab-5ac0a",
  storageBucket: "instagrab-5ac0a.appspot.com",
  messagingSenderId: "687915372844",
  appId: "1:687915372844:web:8fc9a9cf0136e50e575c89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
