import React from "react";
import "../App.css";
import { Link } from "react-router-dom";
import failImage from "../picture/fail_icon.png";

const FailPage = () => {
  return (
    <div className="success-container">
        <img src={failImage} alt="Fail:(" style={{ width: '30%', height: 'auto' }}/>
        <h1>Oops! Something went wrong.</h1>
        <p><Link to="/">Let's try that again.</Link></p>
    </div>
  );
};

export default FailPage;