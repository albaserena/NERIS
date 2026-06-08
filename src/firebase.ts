import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

import {
  getStorage
} from "firebase/storage";

const firebaseConfig = {

  apiKey: "AIzaSyDYFN-XEW8BFpKRxVmrpQABC3ayk8hMtd0",

  authDomain: "neris-462b3.firebaseapp.com",

  projectId: "neris-462b3",

  storageBucket: "neris-462b3.firebasestorage.app",

  messagingSenderId: "807470348295",

  appId: "1:807470348295:web:8ae303eeef61f8914052a2"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

export {
  auth,
  db,
  storage
};