import React, { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import MapContainer from '../config/MapContainer'; // 確保路徑正確

const GPSPage = () => {
    const navigate = useNavigate();
    
    const [location, setLocation] = useState({ latitude: null, longitude: null });

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    };

    const showPosition = (position) => {
        setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    };

    const showError = (error) => {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                console.log("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                console.log("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                console.log("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                console.log("An unknown error occurred.");
                break;
        }
    };

    const SignIn = () => {
        navigate('/Success');
    };

    return (
        <div className="login-container"> 
            <p className="login-prompt">Hello {auth?.currentUser?.displayName || "User"}, please let me check your location :)</p>
            <button className="login-button" onClick={getLocation}>Get GPS Location</button>
            {location.latitude && location.longitude && (
                <>
                    <p className="login-prompt">You are here!</p>
                    <MapContainer lat={location.latitude} lng={location.longitude} />
                    <button className="login-button" onClick={SignIn}>Sign In</button>
                </>
            )}
        </div>
    );
};

export default GPSPage;