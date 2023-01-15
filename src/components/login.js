import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Posts = function () {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  async function submitHandler(event) {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });
      if (response && response.data.token) {
        const token = response.data.token;
        localStorage.setItem("token", `Bearer: ${token}`);
        axios.defaults.headers.common["Authorization"] = `Bearer: ${token}`;
        navigate("/");
      }
    } catch (err) {
      setErrors([err]);
    }
  }
  return (
    <div>
      <form action="" method="POST">
        <div className="inputGroup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
        </div>
        <div className="inputGroup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
        </div>
        <button onClick={(event) => submitHandler(event)}>Submit</button>
      </form>

      {errors
        ? errors.map((err) => {
            return <p>{err.message}</p>;
          })
        : null}
    </div>
  );
};

export default Posts;
