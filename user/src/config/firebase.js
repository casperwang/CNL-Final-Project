// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_eWGLSc3yzlN708jtzss-jEFVG-ITiiU",
  authDomain: "cnl-final-chrome-extensions.firebaseapp.com",
  projectId: "cnl-final-chrome-extensions",
  storageBucket: "cnl-final-chrome-extensions.appspot.com",
  messagingSenderId: "928734285481",
  appId: "1:928734285481:web:ff0da12bf5056d0e9ea3b8",
  measurementId: "G-HE5849SNSL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provide = new GoogleAuthProvider();