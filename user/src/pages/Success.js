import React from "react";
import "../App.css";
import { auth } from "../config/firebase";
import successImage from "../success.png";

const SuccessPage = () => {
  return (
    <div className="success-container">
        <img src={successImage} alt="Success" style={{ width: '30%', height: 'auto' }}/>
        <h1>Hello {auth?.currentUser?.displayName || "User"}!</h1>
        <p>You have checked in!</p>
    </div>
  );
};

export default SuccessPage;