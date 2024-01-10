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
  apiKey: "AIzaSyBeTll06CxUxTKYe8kkBhFAg875kec5Y1M" ,
  authDomain: "eveegpt.firebaseapp.com" ,
  projectId: "eveegpt" ,
  storageBucket:"eveegpt.appspot.com" ,
  messagingSenderId:"952423566741" ,
  appId: "1:952423566741:web:474a071a72af221ebdba9c",
  measurementId: "G-NKBZJEGBLY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db=getFirestore(app)
export const auth=getAuth()



export default app