// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getDatabase} from "firebase/database"
import { getAnalytics } from "firebase/analytics";

import { getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: String(import.meta.env.VITE_FB_APIKEY) ,
  authDomain: String(import.meta.env.VITE_FB_AUTHDOMAIN) ,
  projectId: String(import.meta.env.VITE_FB_PROJECTID) ,
  storageBucket: String(import.meta.env.VITE_FB_STORAGEBUCKET) ,
  messagingSenderId: String(import.meta.env.VITE_FB_MESSAGINSENDERID) ,
  appId: String(import.meta.env.VITE_FB_APPID) ,
  measurementId: String(import.meta.env.VITE_FB_MEASUREMENTID) 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db=getFirestore(app)
export const auth=getAuth()



export default app