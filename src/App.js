import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router";
import { Navigate } from "react-router";

import "./App.css";

import PostsList from "./components/PostsList";
import PostDetail from "./components/PostDetail";
import PostForm from "./components/PostForm";
import Login from "./components/Login";
import Layout from "./components/Layout";

function App() {
  /**Busy state stops page from redirecting you before it checks for JWT
   */
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
        <Route path="post/new" element={<PostForm />} />
        <Route path="post/:postid" element={<PostDetail />} />
        <Route path="post/:postid/update" element={<PostForm />} />
        <Route index element={<PostsList />} />
      </Route>
    </Routes>
  );
}

export default App;
