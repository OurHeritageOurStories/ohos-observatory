import React from "react";
import './App.css'
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Test from "./pages/test";
import Graph from "./pages/graph";
import Query from "./pages/query";

function App(){
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />}/>
        <Route path="/test" element={<Test /> } />
        <Route path="/graph" element={<Graph />}/>
        Route path="/query" element={<Query />}/>
      </Routes>
    </Router>
  );
}

export default App;