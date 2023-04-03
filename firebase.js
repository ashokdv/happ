// Import the functions you need from the SDKs you need
// import  *  as firebase from "firebase";
import  {initializeApp}  from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

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
console.log(app);

const auth = getAuth(app);
export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut };