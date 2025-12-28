import React, { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      if (res.data.role === "student") navigate("/student/profile");
      else if (res.data.role === "mentor") navigate("/mentor/profile");
      else if (res.data.role === "admin") navigate("/admin/approve");
    } catch (e) {
      alert(e.response?.data?.message || "Login failed");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <input name="email" onChange={handleChange} required placeholder="Email" />
      <input name="password" type="password" onChange={handleChange} required placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
};
export default Login;
