import React, { useState } from "react";
import api from "../../api";
import "../../styles/RegisterMentor.css";

const RegisterMentor = () => {
  const [form, setForm] = useState({
    email: "", password: "", name: "", dob: "", location: "",
    education: "", jobRole: "", profilePic: null, idProof: null
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) =>
    setForm({ ...form, [e.target.name]: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    await api.post("/auth/mentor/register", data);
    alert("Registered! Wait for admin approval.");
  };

  return (
    <form className="register-mentor-form" onSubmit={handleSubmit}>
      <input name="email" onChange={handleChange} required placeholder="Email" />
      
      <div style={{ position: "relative" }}>
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          onChange={handleChange}
          required
          placeholder="Password"
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            fontSize: "12px",
            color: "#007BFF"
          }}
        >
          {showPassword ? "Hide" : "Show"}
        </span>
      </div>

      <input name="name" onChange={handleChange} required placeholder="Name" />
      <input name="dob" type="date" onChange={handleChange} required />
      <input name="location" onChange={handleChange} required placeholder="Location" />
      
      <select name="education" required onChange={handleChange}>
        <option value="">--Educational Qualification--</option>
        <option value="10th">10th</option>
        <option value="12th">12th</option>
        <option value="UG">UG</option>
        <option value="PG">PG</option>
        <option value="Diploma">Diploma</option>
        <option value="PhD">PhD</option>
        <option value="Other">Other</option>
      </select>

      <input name="jobRole" onChange={handleChange} required placeholder="Job Role" />
      <input name="idProof" type="file" onChange={handleFile} required />
      <input name="profilePic" type="file" accept="image/*" onChange={handleFile} />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterMentor;