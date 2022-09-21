import React from "react";
import './App.css'
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Test from "./pages/test";
import Graph from "./pages/graph";

function App(){
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />}/>
        <Route path="/test" element={<Test /> } />
        <Route path="/graph" element={<Graph />}/>
      </Routes>
    </Router>
  );
}

export default App;