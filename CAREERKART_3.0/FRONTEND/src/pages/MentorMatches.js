import React, { useEffect, useState } from "react";
import "../../styles/MentorMatches.css"; // Create this CSS file or reuse existing

const MentorMatches = () => {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("mentorResults");
    if (data) {
      setMentors(JSON.parse(data));
    }
  }, []);

  if (!mentors.length) return <p>No mentors found.</p>;

  return (
    <div className="mentor-matches-container">
      <h2>Matched Mentors</h2>
      {mentors.map((mentor) => (
        <div key={mentor._id} className="mentor-card">
          <img src={`http://localhost:5000/${mentor.profilePic}`} alt="Mentor" />
          <h3>{mentor.name}</h3>
          <p><strong>Profession:</strong> {mentor.qa.find(q => q.q.includes("Profession"))?.a}</p>
          <p><strong>Education Medium:</strong> {mentor.qa.find(q => q.q.includes("medium"))?.a}</p>
          <p><strong>Financial Background:</strong> {mentor.qa.find(q => q.q.includes("financial"))?.a}</p>
          <p><strong>Academic Type:</strong> {mentor.qa.find(q => q.q.includes("schooling"))?.a}</p>
          <p><strong>Email:</strong> {mentor.email}</p>
        </div>
      ))}
    </div>
  );
};

export default MentorMatches;
