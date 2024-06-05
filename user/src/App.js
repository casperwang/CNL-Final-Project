import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Login from "./pages/login"; 
import GPS from "./pages/GPS";
import SUCCESS from "./pages/Success";
import FAIL from "./pages/Fail";
import Online from "./pages/online_login"

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/sign/GPS" element={<GPS />} />
          <Route path="/sign/Success" element={<SUCCESS />} />
          <Route path="/sign/Fail" element={<FAIL />} />
          <Route path="/sign/online/:qrcode_id" element={<Online />} />
          <Route path="/sign/:qrcode_id" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
