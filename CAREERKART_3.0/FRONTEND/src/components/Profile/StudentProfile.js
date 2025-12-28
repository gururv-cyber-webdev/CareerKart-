import React, { useEffect, useState } from "react";
import api from "../../api";
import "../../styles/StudentProfile.css";

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    education: "",
    institution: "",
    location: "",
    profilePic: "",
  });

  const [careerQuery, setCareerQuery] = useState("");
  const [careerAnswer, setCareerAnswer] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [error, setError] = useState("");
  const [showRoadmap, setShowRoadmap] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/student/profile");
      setProfile(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });

      await api.put("/student/profile", form);
      setEditing(false);
      fetchProfile();
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const handleCareerSearch = async (e) => {
    e.preventDefault();
    setError("");
    setCareerAnswer("");
    setRoadmap("");
    try {
      const res = await api.post("/student/careerSearch", { query: careerQuery });
      setCareerAnswer(res.data.answer);
      setRoadmap(res.data.roadmap);
      setShowRoadmap(false);
    } catch (err) {
      setError(err.response?.data?.message || "Career search failed");
    }
  };

  // const renderGuidanceAsList = (text) => {
  //   return text
  //     .split("✔")
  //     .map((line, idx) => line.trim())
  //     .filter(Boolean)
  //     .map((line, idx) => <li key={idx}>{line}</li>);
  // };

//   const renderGuidanceAsList = (text) => {
//   if (!text) return null;

//   // Split into lines and remove any leading numbering like "1.", "2.", etc.
//   const points = text
//     .split(/\n|(?<=\.)\s+/) // splits on newlines or period+space
//     .map(line => line.trim().replace(/^\d+\.\s*/, '')) // remove leading numbers
//     .filter(line => line.length > 0);

//   return (
//     <ul className="guidance-list">
//       {points.map((point, index) => (
//         <li key={index} className="guidance-point">• {point}</li>
//       ))}
//     </ul>
//   );
// };

const renderGuidanceAsList = (text) => {
  if (!text) return null;

  const points = text
    .split(/\n|(?<=\.)\s+/) // Split by newline or period+space
    .map(line => line.trim().replace(/^\d+\.\s*/, '')) // Remove leading numbers
    .filter(line => line.length > 0);

  return (
    <div className="guidance-list">
      {points.map((point, index) => {
        const isHeading = point.endsWith(":");
        return isHeading ? (
          <div key={index} className="guidance-heading">{point}</div>
        ) : (
          <div key={index} className="guidance-point">• {point}</div>
        );
      })}
    </div>
  );
};

const renderRoadmapBoxes = (text) => {
  const sections = text
    .split(/\d+\.\s+/)
    .map((section) => section.trim())
    .filter(Boolean);

  const allSteps = [];

  sections.forEach((section) => {
    const [titleLine, ...stepLines] = section.split(/\d+\.\s+/).map(s => s.trim()).filter(Boolean);

    // push section title as heading box
    allSteps.push({ type: "heading", text: titleLine });

    stepLines.forEach((step) => {
      allSteps.push({ type: "step", text: step });
    });
  });

  let count = 1;

  return (
    <div className="roadmap-box-container">
      {allSteps.map((item, idx) => (
        <React.Fragment key={idx}>
          {item.type === "heading" ? (
            <div className="roadmap-box heading">{item.text}</div>
          ) : (
            <div className="roadmap-box">
              <span className="step-number">{count++}. </span>{item.text}
            </div>
          )}
          {idx < allSteps.length - 1 && <div className="roadmap-arrow">↓</div>}
        </React.Fragment>
      ))}
    </div>
  );
};


  if (!profile) return <div className="loading">Loading profile...</div>;

  return (
    <div className="student-profile-container">
      <h2>Student Profile</h2>

      <div className="student-profile-content">
        {profile.profilePic && (
          <img
            src={`http://localhost:5000/${profile.profilePic}`}
            alt="Profile"
            className="student-profile-img"
          />
        )}

        {!editing ? (
          <div className="student-profile-details">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Education:</strong> {profile.education}</p>
            <p><strong>Institution:</strong> {profile.institution}</p>
            <p><strong>Location:</strong> {profile.location}</p>
            <button className="student-profile-edit-btn" onClick={() => setEditing(true)}>
              Edit
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="student-profile-form">
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            <input type="text" name="education" value={formData.education} onChange={handleChange} required />
            <input type="text" name="institution" value={formData.institution} onChange={handleChange} required />
            <input type="text" name="location" value={formData.location} onChange={handleChange} required />
            <input type="file" name="profilePic" accept="image/*" onChange={handleChange} />
            <div className="form-btns">
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>

      {/* Career Search Section */}
      <div className="career-search-section">
        <h3>Get Personalized Career Guidance</h3>
        <form onSubmit={handleCareerSearch}>
          <input
            type="text"
            placeholder="Ask about your career interest..."
            value={careerQuery}
            onChange={(e) => setCareerQuery(e.target.value)}
            required
          />
          <button type="submit">Search</button>
        </form>

        {error && <p className="error">{error}</p>}

        {careerAnswer && (
          <div className="career-answer">
            <h4>Guidance:</h4>
            <ol>{renderGuidanceAsList(careerAnswer)}</ol>
            {roadmap && (
              <button
                className="toggle-roadmap-btn"
                onClick={() => setShowRoadmap(!showRoadmap)}
              >
                {showRoadmap ? "Hide Roadmap" : "Show Roadmap"}
              </button>
            )}
          </div>
        )}

        {showRoadmap && roadmap && (
          <div className="career-roadmap">
            <h4>Suggested Roadmap:</h4>
            {renderRoadmapBoxes(roadmap)}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
