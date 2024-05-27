import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Login from "./pages/login"; 
import GPS from "./pages/GPS";
import SUCCESS from "./pages/Success";
import FAIL from "./pages/Fail";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/GPS" element={<GPS />} />
          <Route path="/Success" element={<SUCCESS />} />
          <Route path="/Fail" element={<FAIL />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;