import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Firebase console එකෙන් copy කරපු config එක මෙහේ දාන්න
const firebaseConfig = {
  apiKey: "AIzaSyDJBeEHUtaQ4TYjhhSAWePBjcAJimqBX1E",
  authDomain: "richlight-apparels.firebaseapp.com",
  projectId: "richlight-apparels",
  storageBucket: "richlight-apparels.firebasestorage.app",
  messagingSenderId: "75849292405",
  appId: "1:75849292405:web:3717c04fce2bea3a63363c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
