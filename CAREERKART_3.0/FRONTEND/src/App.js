import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import RegisterStudent from "./components/Auth/RegisterStudent";
import RegisterMentor from "./components/Auth/RegisterMentor";
import StudentProfile from "./components/Profile/StudentProfile";
import MentorProfile from "./components/Profile/MentorProfile";
import ApproveMentors from "./components/Admin/ApproveMentors";
import Home from "./components/Home";
// import "./App.css"; // Ensure you have a global CSS file for basic styles

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register/student" element={<RegisterStudent />} />
      <Route path="/register/mentor" element={<RegisterMentor />} />
      <Route path="/student/profile" element={<StudentProfile />} />
      <Route path="/mentor/profile" element={<MentorProfile />} />
      <Route path="/admin/approve" element={<ApproveMentors />} />
    </Routes>
  </BrowserRouter>
);

export default App;