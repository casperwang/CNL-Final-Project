import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Login from "./pages/login"; // 確保您已經有了Login組件
import GPS from "./pages/GPS";
import SUCCESS from "./pages/Success";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/GPS" element={<GPS />} />
          <Route path="/Success" element={<SUCCESS />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;