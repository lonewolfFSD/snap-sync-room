import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCmL3UGy7W5YbGrLQXJyiwjO9ksdC-kUFk",
  authDomain: "livesnap-1beab.firebaseapp.com",
  projectId: "livesnap-1beab",
  storageBucket: "livesnap-1beab.firebasestorage.app",
  messagingSenderId: "363980426469",
  appId: "1:363980426469:web:1b70e8895430bd1c4b980c",
  measurementId: "G-70XREG4T5B"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);