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
  apiKey: "AIzaSyCRdfxMmUtRGulpqA8tFFJ8dFqBhif1TjE",
  authDomain: "evee-e2737.firebaseapp.com",
  projectId: "evee-e2737",
  storageBucket: "evee-e2737.appspot.com",
  messagingSenderId: "86651358251",
  appId: "1:86651358251:web:abc15362472fb4d802ee6e",
  measurementId: "G-LLC8J5BPFD"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db=getFirestore(app)
export const auth=getAuth()



export default app