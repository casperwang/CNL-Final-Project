import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, provide } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import "../App.css";

const Login = () => {
  const navigate = useNavigate();

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provide);
      console.log(result);
      navigate("/GPS"); // 成功登入後導航到 /GPS 頁面
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Login was cancelled by the user');
      } else {
        console.error('Login failed:', error.message);
      }
    }
  };

  return (
    <div className="login-container"> 
      <p className="login-prompt">Welcome to the meeting!</p>
      <p className="login-prompt"> Please sign in with your Google account! </p>
      <button className="login-button" onClick={login}>Sign in with Google</button>
    </div>
  );
};

export default Login;