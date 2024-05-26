import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, provide } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import "../App.css";
import login_button from './image.png'

const Login = () => {
  const navigate = useNavigate();

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provide);
      console.log(result);
      navigate("/GPS");
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
      <p></p>
      <img 
      src={login_button}// 图片路径
      // alt="Sign in with Google" // 替代文本
      className="login-button" // 应用样式
      onClick={login} // 点击图片时触发登录函数
      // style={{cursor: 'pointer'}} // 将鼠标悬停时的光标样式设置为指针
    />
      {/* <button className="login-button" onClick={login}>Sign in with Google</button> */}
    </div>
  );
};

export default Login;