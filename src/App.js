import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router";
import { Navigate } from "react-router";

import "./App.css";

import Posts from "./components/posts";
import Login from "./components/login";
import Layout from "./components/layout";

function App() {
  let [JWT, setJWT] = useState(false);

  return (
    <Routes>
      <Route path="/" element={<Posts />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
