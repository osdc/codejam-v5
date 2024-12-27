// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEpvPoOK_1pVP3_F81XD_rjpRC3cZEPAw",
  authDomain: "travel-planner-f6acd.firebaseapp.com",
  projectId: "travel-planner-f6acd",
  storageBucket: "travel-planner-f6acd.firebasestorage.app",
  messagingSenderId: "493961312323",
  appId: "1:493961312323:web:da1e41b73d167168a8bcf6",
  measurementId: "G-EM751X2BEP"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const db =getFirestore(app);
// const analytics = getAnalytics(app);

export{db};