// Import the functions you need from the SDKs you need
// import  *  as firebase from "firebase";
import  {initializeApp}  from "firebase/app";
import { getAuth,sendPasswordResetEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
// import * as firebase from 'firebase/app';
import { getFirestore, collection, addDoc, query, getDocs, where } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxJ8aDBvOI_QQ_Gu8A-o0KW-EarJdhT1c",
  authDomain: "happ-auth.firebaseapp.com",
  projectId: "happ-auth",
  storageBucket: "happ-auth.appspot.com",
  messagingSenderId: "496424499949",
  appId: "1:496424499949:web:fb54fa3044084c524faae4"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { auth, signInWithEmailAndPassword,sendPasswordResetEmail, createUserWithEmailAndPassword, onAuthStateChanged, signOut, db, collection, addDoc
, query, getDocs, where };


