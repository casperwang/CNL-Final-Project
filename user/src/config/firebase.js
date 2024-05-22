// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaFhadyjV_txTyQfXjiWosaV4dapCLl0M",
  authDomain: "cnl-final-user.firebaseapp.com",
  projectId: "cnl-final-user",
  storageBucket: "cnl-final-user.appspot.com",
  messagingSenderId: "859208036554",
  appId: "1:859208036554:web:45dde60a39ba309fe24433"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provide = new GoogleAuthProvider();