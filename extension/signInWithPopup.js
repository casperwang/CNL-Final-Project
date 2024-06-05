import { signInWithPopup, GoogleAuthProvider, getAuth , signOut} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js';

const firebaseConfig = {
  apiKey: "AIzaSyD_eWGLSc3yzlN708jtzss-jEFVG-ITiiU",
  authDomain: "cnl-final-chrome-extensions.firebaseapp.com",
  projectId: "cnl-final-chrome-extensions",
  storageBucket: "cnl-final-chrome-extensions.appspot.com",
  messagingSenderId: "928734285481",
  appId: "1:928734285481:web:ff0da12bf5056d0e9ea3b8",
  measurementId: "G-HE5849SNSL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

// This code runs inside of an iframe in the extension's offscreen document.
// This gives you a reference to the parent frame, i.e. the offscreen document.
// You will need this to assign the targetOrigin for postMessage.
const PARENT_FRAME = document.location.ancestorOrigins[0];

// This demo uses the Google auth provider, but any supported provider works.
// Make sure that you enable any provider you want to use in the Firebase Console.
// https://console.firebase.google.com/project/_/authentication/providers
const PROVIDER = new GoogleAuthProvider();

function sendPlain(result) {
  console.log(result);
  globalThis.parent.self.postMessage(JSON.stringify(result), PARENT_FRAME);
}

async function sendSignInRes(result) {
  console.log(auth.currentUser);
  const token = await auth.currentUser.getIdToken(false);
  globalThis.parent.self.postMessage(JSON.stringify({name: result.user.displayName, email: result.user.email, photo: result.user.photoURL, token: token}), PARENT_FRAME);
}

globalThis.addEventListener('message', function({data}) {
  console.log("receive some message", data);
  console.log(auth);
  if (data.initAuth) {
    // Opens the Google sign-in page in a popup, inside of an iframe in the
    // extension's offscreen document.
    // To centralize logic, all respones are forwarded to the parent frame,
    // which goes on to forward them to the extension's service worker.
    signInWithPopup(auth, PROVIDER)
      .then(sendSignInRes)
      .catch(sendPlain)
  }
  if (data.logout) {
    signOut(auth)
      .then(() => {sendPlain({logout: "success"})})
      .catch(() => {sendPlain({logout: "fail"})})
  }
});
