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
    <div className="GPS-container"> 
        <button className="GPS-button" onClick={getLocation}>Sign in</button>
    </div>
  );
};

export default Login;