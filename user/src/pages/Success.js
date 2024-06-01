import React from "react";
import { Link, useLocation } from 'react-router-dom';
import "../App.css";
import { auth } from "../config/firebase";
import successImage from "../picture/success.png";

const SuccessPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const qrcode_id = queryParams.get('qrcode_id');
  const homepage = `/sign/${qrcode_id}`;

  return (
    <div className="success-container">
        {/* <img src="/logo_tran.png" alt="Logo" className="logo" /> */}
        <img src={successImage} alt="Success" style={{ width: '30%', height: 'auto' }}/>
        <h1>Hello {auth?.currentUser?.displayName || "User"}!</h1>
        <p>You have checked in!</p>
        <p><Link to={homepage}>Go back to the homepage</Link></p>
    </div>
  );
};

export default SuccessPage;