import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Home from "./components/home.jsx";
import Invoice from "./components/invoice.jsx";
import History from "./components/history.jsx";
import Draft from "./components/draft.jsx";
import HomePage from "./assets/home-button.png";
import "./App.css";

export default function App() {
  return (
    <>
      <Router>
        <div className="title_panel">
          <div className="title_panel_box1">
            <Link to="/">
              <img src={HomePage} alt="Home" className="homepage" />
            </Link>
          </div>
          <div className="title_panel_box2">
            <Link to="/Invoice">
              <span className="invoice">Invoice</span>
            </Link>
            <Link to="/History">
              <span className="history">History</span>
            </Link>
            <Link to="/Draft">
              <span className="draft">Draft</span>
            </Link>
          </div>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Invoice" element={<Invoice />} />
          <Route path="/History" element={<History />} />
          <Route path="/Draft" element={<Draft />} />
        </Routes>
      </Router>
    </>
  );
}