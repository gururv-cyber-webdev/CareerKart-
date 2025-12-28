import React, { useEffect, useState } from "react";
import api from "../../api";
import "../../styles/ApproveMentors.css";

const ApproveMentors = () => {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    api.get("/admin/mentors/pending").then(res => setMentors(res.data));
  }, []);

  const approve = async (id) => {
    await api.post("/admin/mentor/approve", { mentorId: id });
    setMentors(mentors.filter(m => m._id !== id));
  };

  return (
    <div className="approve-mentors-list-container">
      <h2 className="approve-mentors-title">Pending Mentors</h2>
      {mentors.map(m => (
        <div key={m._id} className="mentor-card">
          <span>{m.email}</span>
          <span>{m.name}</span>
          <span>
            <a
              href={`http://localhost:5000/${m.idProof}`}
              target="_blank"
              rel="noopener noreferrer"
              className="id-proof-link"
            >
              View ID Proof
            </a>
          </span>
          <button className="approve-btn" onClick={() => approve(m._id)}>
            Approve
          </button>
        </div>
      ))}
    </div>
  );
};

export default ApproveMentors;
