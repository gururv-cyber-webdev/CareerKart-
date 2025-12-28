import React, { useState } from "react";
import api from "../api";
import "../styles/MentorQAForm.css";

const questions = [
  "What is your Profession?",
  "What class did you decide on this Career?",
  "Which school subject helped you most?",
  "Why did you choose this career?",
  "What is your medium of education in school?",
  "What is your financial background (low or high)?",
  "Are you a topper/Average/Poor Student during schooling?", 
  "What stream did you take in 11th and 12th?",
  "Your score in boards?",
  "Scores in any entrance exams (marks - Name of exam)?",
  "Top 5 colleges in your stream?",
  "Which colleges did you attend and why?",
  "How do you keep your knowledge updated in a fast-changing field?",
  "Pursued PG/Doc (yes or no)?",
  "UG CGPA or % and if pursued PG yes PG/DOC CGPA or % or NA?",
  "What alternative career you considered and why?",
  "Which major entrance exams did you prepare for? (e.g., NEET, JEE, CLAT, UPSC, CAT)",
  "What books, materials, or coaching did you use?",
  "Share your preparation tips and strategies that worked best (provide links for learning resources if possible).",
  "What was the biggest challenge you faced and how did you overcome it?",
  "What internships, training, or projects shaped your path?",
  "What skills should students start building early?",
  "Any valuable advice to future generation that could change their path?",
  "Please upload your resume here for student reference (file data type)."
];

const MentorQAForm = () => {
  const [answers, setAnswers] = useState(Array(questions.length - 1).fill(""));
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleAnswer = (i, val) => {
    const copy = [...answers];
    copy[i] = val;
    setAnswers(copy);
  };
  const handleFile = (e) => setResume(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const qaArr = questions.slice(0, -1).map((q, i) => ({ q, a: answers[i] }));
    const data = new FormData();
    // FormData only sends strings
    data.append("qa", JSON.stringify(qaArr));
    if (resume) data.append("resume", resume);
    const token = localStorage.getItem('token');

    try {
      await api.post("/mentor/qa", data, {
        headers: { "Content-Type": "multipart/form-data" , Authorization: `Bearer ${token}`},
      });
      setSuccess(true);
      setAnswers(Array(questions.length - 1).fill(""));
      setResume(null);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
    }
    setLoading(false);
  };

  return (
    <form className="mentor-qa-form" onSubmit={handleSubmit}>
      {questions.slice(0, -1).map((q, i) => (
        <div key={i}>
          <label>{q}</label>
          <input
            value={answers[i]}
            required
            onChange={e => handleAnswer(i, e.target.value)}
          />
        </div>
      ))}
      <label>{questions[20]}</label>
      <input type="file" onChange={handleFile} required />
      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Q&A submitted!</div>}
    </form>
  );
};

export default MentorQAForm;