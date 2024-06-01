import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";
import login_button from '../picture/login_button.png'

const Login = () => {
  const {qrcode_id} = useParams();
  const navigate = useNavigate();

  const login = async () => {
    try {
      const endpoint_geturl = `https://cnl.casperwang.dev/online_sign/?qrcode_id=${qrcode_id}`;
      const response_geturl = await fetch(endpoint_geturl, {
        method: 'POST', 
        headers: {
          'accept': 'application/json',
        },
      });
      const data_geturl = await response_geturl.json(); 
      console.log(data_geturl);

      navigate(`/Success`);
    } catch (error) {
      console.error(error);
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