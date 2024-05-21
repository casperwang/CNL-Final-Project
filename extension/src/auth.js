import React from "react";
import { useContext, createContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, getAuth, signInWithRedirect, signOut, GoogleAuthProvider, updateProfile, signInWithPopup } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
// import ErrorBoundary from '@/components/ErrorBoundary';
// import { useStatus } from "@/context/Status";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
// const analytics = getAnalytics(app);
const auth = getAuth(app);

const AuthContext = createContext({ user: null });

export const AuthContextProvider = ({ children }) => {
  // const { message } = useStatus();
  const [user, setUser] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => { unsubscribe(); };
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    if (window.confirm(`
Please **DON'T** sign in with in-app browser like Instagram, Facebook or LINE browser. Google Oauth blocks access from insecure browsers.
On mobile devices, use Chrome or Safari instead.

請**勿**使用應用程式內建瀏覽器登入，如 IG、FB 或 LINE。Google Oauth 拒絕來自不安全瀏覽器的連線。
若為行動裝置，請在 Chrome 或 Safari 上登入。
    `.trim())) {
      const res = await signInWithPopup(auth, provider);
      // const res = await signInWithRedirect(auth, provider);
      console.log(res);
      // await signInWithRedirect(auth, provider);
      // window.location.reload();
    }
    // else {
    //   navigator.clipboard.writeText(window.location.origin + "/sign-in");
    //   message("Sign-in link copied", { variant: "success" });
    // }
  };

  const logOut = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{
      user,
      signIn,
      logOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};