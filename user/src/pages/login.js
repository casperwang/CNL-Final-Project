import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, provide } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import "../App.css";

const Login = () => {
  const navigate = useNavigate();

  const login = async () => {
    const result = await signInWithPopup(auth, provide);
    console.log(result);
    // const user = result.user;
    // console.log("用戶名稱:", user.displayName);
    // console.log("用戶郵件:", user.email);
    // console.log("用戶照片URL:", user.photoURL);
    navigate("/GPS");
  };

  return (
    <div className="login-container"> 
      <p className="login-prompt">Welcome to the meeting! Please sign in with your Google account!</p>
      <button className="login-button" onClick={login}>Sign in with Google</button>
    </div>
  );
};

export default Login;