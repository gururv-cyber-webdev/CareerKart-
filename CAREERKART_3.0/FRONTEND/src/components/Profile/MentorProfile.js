import React, { useEffect, useState } from "react";
import api from "../../api";
import "../../styles/MentorProfile.css";
import MentorQAForm from '../MentorQAForm';

const MentorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    api.get("/mentor/profile").then(res => {
      setProfile(res.data);
      setForm(res.data);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setForm({ ...form, profilePic: e.target.files[0] });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "profilePic" && value instanceof File) {
        data.append(key, value);
      } else if (key !== "profilePic" && key !== "user") { // 🛡️ Exclude 'user'
        data.append(key, value);
      }
    });

    if (form.profilePic instanceof File) {
      data.append("profilePic", form.profilePic);
    }
    const res = await api.put("/mentor/profile", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setProfile(res.data);
    setEditing(false);
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="mentor-profile-container">
      <img
        src={`http://localhost:5000/${profile.profilePic || "default.png"}`}
        alt="profile"
        className="mentor-profile-img"
      />
      {editing ? (
        <form onSubmit={handleSave}>
          <input
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            placeholder="Name"
          />
          <input
            name="dob"
            type="date"
            value={form.dob || ""}
            onChange={handleChange}
            placeholder="Date of Birth"
          />
          <input
            name="location"
            value={form.location || ""}
            onChange={handleChange}
            placeholder="Location"
          />
          <input
            name="jobRole"
            value={form.jobRole || ""}
            onChange={handleChange}
            placeholder="Job Role"
          />
          <input
            name="institution"
            value={form.institution || ""}
            onChange={handleChange}
            placeholder="Institution"
          />
          <input
            name="education"
            value={form.education || ""}
            onChange={handleChange}
            placeholder="Education"
          />
          <input
            name="profilePic"
            type="file"
            accept="image/*"
            onChange={handleFile}
          />
          <button type="submit" className="mentor-profile-edit-btn">
            Save
          </button>
        </form>
      ) : (
        <>
          <div>{profile.name} ({profile.education})</div>
          <div>{profile.jobRole}</div>
          <div>{profile.institution}</div>
          <button className="mentor-profile-edit-btn" onClick={() => setEditing(true)}>
            Edit
          </button>
        </>
      )}

      {/* Add Mentor Q&A Form below profile info */}
      <hr />
      <MentorQAForm />
    </div>
  );
};

export default MentorProfile;
