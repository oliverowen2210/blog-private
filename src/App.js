import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router";
import { Navigate } from "react-router";

import "./App.css";

import PostsPage from "./components/PostsPage";
import PostPage from "./components/PostPage";
import Login from "./components/Login";
import Layout from "./components/Layout";

function App() {
  let [busy, setBusy] = useState(true);
  let [JWT, setJWT] = useState(false);

  function checkJWT() {
    if (localStorage.getItem("token")) {
      setJWT(localStorage.getItem("token"));
    } else setJWT(null);
    setBusy(false);
  }

  useEffect(() => {
    checkJWT();
  }, []);

  return busy ? (
    <div>Loading...</div>
  ) : (
    <Routes>
      <Route
        path="/login"
        element={JWT ? <Navigate to="/" /> : <Login checkJWT={checkJWT} />}
      />
      <Route path="/" element={JWT ? <Layout /> : <Navigate to="/login" />}>
        <Route path="post/:postid" element={<PostPage />} />
        <Route index element={<PostsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
