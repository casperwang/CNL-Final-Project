import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, provide } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
// import { signInWithRedirect } from "firebase/auth";
import "../App.css";
import login_button from '../picture/login_button.png'

const Login = () => {
  
  const {qrcode_id} = useParams();
  const navigate = useNavigate();

  const login = async () => {
    try {
      // await signInWithRedirect(auth, provide);
      const result = await signInWithPopup(auth, provide);
      console.log(result);

      const endpoint_geturl = `https://cnl.casperwang.dev/get_meeting_url/?qrcode_id=${qrcode_id}`;
      const response_geturl = await fetch(endpoint_geturl, {
        method: 'GET', 
        headers: {
          'accept': 'application/json',
        },
      });
      const data_geturl = await response_geturl.json(); 
      console.log(data_geturl);

      const token = await result.user.getIdToken();
      const endpoint_join = `https://cnl.casperwang.dev/join_meeting/?user_id=${token}&meeting_url=${data_geturl}`;
      const response_join = await fetch(endpoint_join, {
        method: 'POST', 
        headers: {
          'accept': 'application/json',
        },
      });
      const data = await response_join.json(); 
      console.log(data);

      navigate(`/GPS?qrcode_id=${qrcode_id}`);
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
      {/* <img src="/logo_tran.png" alt="Logo" className="logo" /> */}
      <p className="login-prompt">Welcome to the meeting!</p>
      <p className="login-prompt"> Please sign in with your Google account! </p>
      <p></p>
      <img 
      src={login_button}
      alt="Sign in with Google"
      className="login-button"
      onClick={login}
      style={{cursor: 'pointer'}} // 将鼠标悬停时的光标样式设置为指针
      />
      {/* <button className="login-button" onClick={login}>Sign in with Google</button> */}
    </div>
  );
};

export default Login;