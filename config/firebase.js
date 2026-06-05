 
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAS4FPI5n79OAfiphqeSbuDr0j7sEJjpFY",
  authDomain: "trustscan-a0425.firebaseapp.com",
  projectId: "trustscan-a0425",
  storageBucket: "trustscan-a0425.firebasestorage.app",
  messagingSenderId: "681633957063",
  appId: "1:681633957063:web:be68368385a2aecbddeae2"

};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);