import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrqJPx2idenZoa6-knUYETXGseOrMBzzQ",
  authDomain: "car-hub-430db.firebaseapp.com",
  projectId: "car-hub-430db",
  storageBucket: "car-hub-430db.appspot.com",
  messagingSenderId: "799725660558",
  appId: "1:799725660558:web:733dc18909a6474e9a5cdf"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);