import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";

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

      navigate(`/sign/Success?qrcode_id=${qrcode_id}&mode=online`);
    } catch (error) {
        navigate(`/sign/Success?qrcode_id=${qrcode_id}&mode=online`);
    }
  };

  return (
    <div className="GPS-container"> 
        <button className="GPS-button" onClick={login}>Sign in</button>
    </div>
  );
};

export default Login;