import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import getStorage

const firebaseConfig = {
    apiKey: "AIzaSyAYBfcWbsB1LPcd6fJjK53v7XxNV8zQC84",
    authDomain: "malang-rs.firebaseapp.com",
    projectId: "malang-rs",
    storageBucket: "malang-rs.appspot.com",
    messagingSenderId: "418142685711",
    appId: "1:418142685711:web:bfa0c84aa2b7a16a3d317a",
    measurementId: "G-7C6GBJDFY7"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
