import React, { useState } from "react";
import api from "../../api";
import "../../styles/RegisterStudent.css";

const RegisterStudent = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    dob: "",
    location: "",
    education: "",
    institution: "",
    profilePic: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setForm({ ...form, profilePic: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    // Append all form fields except profilePic (do it separately)
    Object.entries(form).forEach(([key, value]) => {
      if (key !== "profilePic") data.append(key, value);
    });
    // Append profilePic if present
    if (form.profilePic) {
      data.append("profilePic", form.profilePic);
    }
    try {
      await api.post("/auth/student/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Registered! Please log in.");
      // Optionally reset form
      setForm({
        email: "",
        password: "",
        name: "",
        dob: "",
        location: "",
        education: "",
        institution: "",
        profilePic: null,
      });
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form className="register-student-form" onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
        placeholder="Email"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        required
        placeholder="Password"
      />
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        required
        placeholder="Name"
      />
      <input
        name="dob"
        type="date"
        value={form.dob}
        onChange={handleChange}
        required
      />
      <input
        name="location"
        value={form.location}
        onChange={handleChange}
        required
        placeholder="Location"
      />
      <select
        name="education"
        value={form.education}
        required
        onChange={handleChange}
      >
        <option value="">--Educational Qualification--</option>
        <option value="10th">10th</option>
        <option value="12th">12th</option>
        <option value="UG">UG</option>
        <option value="PG">PG</option>
        <option value="Diploma">Diploma</option>
        <option value="PhD">PhD</option>
        <option value="Other">Other</option>
      </select>
      <input
        name="institution"
        value={form.institution}
        onChange={handleChange}
        required
        placeholder="Institution name"
      />
      <input
        name="profilePic"
        type="file"
        accept="image/*"
        onChange={handleFile}
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterStudent;