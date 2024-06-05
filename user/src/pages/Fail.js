import React from "react";
import "../App.css";
import { Link, useLocation } from 'react-router-dom';
import failImage from "../picture/fail_icon.png";

const FailPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const qrcode_id = queryParams.get('qrcode_id');
  const homepage = `/sign/${qrcode_id}`;

  return (
    <div className="success-container">
        {/* <img src="/logo_tran.png" alt="Logo" className="logo" /> */}
        <img src={failImage} alt="Fail:(" style={{ width: '30%', height: 'auto' }}/>
        <h1>Oops! Something went wrong.</h1>
        {mode === 'onsign' && (
          <p><Link to = {homepage} >Let's try that again.</Link></p>
        )}
    </div>
  );
};

export default FailPage;