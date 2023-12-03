// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase} from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtfQ5xc7Wu5C7kqfDi3XTjnYa0mi_Yzdc",
  authDomain: "nilwalaticketmaster.firebaseapp.com",
  projectId: "nilwalaticketmaster",
  storageBucket: "nilwalaticketmaster.appspot.com",
  messagingSenderId: "506710078840",
  appId: "1:506710078840:web:0da77973c381513c0c448d",
  databaseURL: 'https://nilwalaticketmaster-default-rtdb.asia-southeast1.firebasedatabase.app'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);