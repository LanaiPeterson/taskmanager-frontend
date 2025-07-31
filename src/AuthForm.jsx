import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:3000/api/auth";

export default function AuthForm({ setToken, setUser }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (mode === "register" && form.password !== form.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      if (mode === "login") {
        const res = await axios.post(`${API}/login`, {
          email: form.email,
          password: form.password,
        });
        setToken(res.data.token);
        setUser({ name: res.data.name, email: res.data.email });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify({ name: res.data.name, email: res.data.email }));
      } else {
        await axios.post(`${API}/register`, form);
        alert("Registered! Please login.");
        setMode("login");
        setForm({ name: "", email: "", password: "", confirmPassword: "" });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Auth error");
    }
  };

  return (
    <div style={{ maxWidth: 320, margin: "40px auto" }}>
      <h2>{mode === "login" ? "Login" : "Register"}</h2>
      <form onSubmit={handleAuth}>
        {mode === "register" && (
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: 8 }}
            autoComplete="name"
          />
        )}
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 8 }}
          autoComplete="email"
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 8 }}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />
        {mode === "register" && (
          <input
            name="confirmPassword"
            placeholder="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: 8 }}
            autoComplete="new-password"
          />
        )}
        <button type="submit">{mode === "login" ? "Login" : "Register"}</button>
      </form>
      <button
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        style={{ marginTop: 8 }}
      >
        {mode === "login"
          ? "Need an account? Register"
          : "Have an account? Login"}
      </button>
    </div>
  );
}