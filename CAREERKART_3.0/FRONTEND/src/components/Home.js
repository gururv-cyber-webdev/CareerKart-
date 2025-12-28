import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css"; // Assuming you have a CSS file for styling

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home-bg">
      <video className="home-video" autoPlay loop muted>
        <source src="/your-background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="home-content">
        <h1 className="home-title">CareerKart</h1>
        <div>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register/student")}>Register as Student</button>
          <button onClick={() => navigate("/register/mentor")}>Register as Mentor</button>
        </div>
      </div>
    </div>
  );
};

export default Home;