import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB7sZXiswvkItn1XUoUKeo9uTtsFBKrPnA",
  authDomain: "hayaoshi-aef9c.firebaseapp.com",
  projectId: "hayaoshi-aef9c",
  storageBucket: "hayaoshi-aef9c.firebasestorage.app",
  messagingSenderId: "425920833176",
  appId: "1:425920833176:web:c4ea28d55ec4629c2892ed",
  measurementId: "G-855K48N60H"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
