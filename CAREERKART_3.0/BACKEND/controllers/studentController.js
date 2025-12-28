const mongoose = require("mongoose");
const User = require("../models/User");
const Student = require("../models/Student");
const Mentor = require("../models/Mentor");
const Career = require("../models/Career");
const extractStudentProfile = require('../utils/extractstudentProfile'); 
const TitanAI = require("../utils/titanAI");
const { callTitan } = require("../utils/callTitan");


const watson = require("../utils/watson"); // summarization
const nlu = require("../utils/watson");    // IBM NLU (same file assumed)

const { createRoadmapForStudent } = require("../services/aiService");

// ------------------ Get Student Profile ------------------
exports.profile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id }).populate("user", "email");
    if (!student) return res.status(404).json({ message: "Not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------ Edit Student Profile ------------------
exports.editProfile = async (req, res) => {
  try {
    const { _id, ...updates } = req.body;
    if (!_id) return res.status(400).json({ message: "Student ID is required" });

    if (req.file) updates.profilePic = req.file.path;

    // Handle user field
    if (updates.user) {
      try {
        if (typeof updates.user === "object" && updates.user._id) {
          updates.user = updates.user._id;
        }
        updates.user = new mongoose.Types.ObjectId(updates.user);
      } catch (e) {
        delete updates.user;
      }
    }

    const student = await Student.findByIdAndUpdate(_id, updates, { new: true });
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------ Career Search with Roadmap ------------------
// backend/controllers/careerController.js


// if separated

exports.searchMentorsByStudentQuery = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) return res.status(400).json({ error: "Missing query." });

    const profile = extractStudentProfile(query);
    if (!profile.role) return res.status(404).json({ message: "No valid career goal detected." });

    // Role filter (strict match in mentor QA)
    const mentors = await Mentor.find({
      "qa.a": { $regex: new RegExp(profile.role, 'i') }
    });

    // Filter based on other attributes (medium, financial, performance)
    const filteredMentors = mentors.filter((mentor) => {
      const qa = mentor.qa.map(q => q.a.toLowerCase());

      let mediumMatch = !profile.medium || qa.some(a => a.includes(profile.medium));
      let financialMatch = !profile.financial || qa.some(a => a.includes(profile.financial));
      let performanceMatch = !profile.performance || qa.some(a => a.includes(profile.performance));

      return mediumMatch || financialMatch || performanceMatch; // even partial match allowed
    });

    if (filteredMentors.length === 0)
      return res.status(404).json({ message: "No matching mentors found." });

    return res.status(200).json({ mentors: filteredMentors, profile });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

 // Your wrapper for AWS Titan call

//exports.careerSearch = async (req, res) => {
//   try {
//     const { query } = req.body;
//     const student = req.student;

//     if (!query || !student) {
//       return res.status(400).json({ message: "Missing query or student data" });
//     }

//     // Extract keywords
//     const lowerQuery = query.toLowerCase();
//     const jobRoles = ["doctor", "engineer", "lawyer", "ca", "teacher", "dsp", "pilot"];
//     const mediums = ["english", "tamil", "hindi", "telugu"];
//     const finances = ["low", "middle", "high"];
//     const academics = ["topper", "average", "poor"];

//     const detected = {
//       jobRole: jobRoles.find(role => lowerQuery.includes(role)),
//       medium: mediums.find(m => lowerQuery.includes(m)),
//       finance: finances.find(f => lowerQuery.includes(f)),
//       academic: academics.find(a => lowerQuery.includes(a)),
//     };

//     if (!detected.jobRole) {
//       return res.status(404).json({ message: `No mentors found for the keyword.` });
//     }

//     // Search mentors matching the main job role
//     const mentors = await Mentor.find();
//     const matchedMentors = mentors.filter(mentor => {
//       const qaMap = {};
//       mentor.qa.forEach(item => {
//         qaMap[item.q?.toLowerCase()] = item.a?.toLowerCase();
//       });

//       const profession = qaMap["what is your profession?"] || "";
//       const medium = qaMap["what is your medium of education in school?"] || "";
//       const finance = qaMap["what is your financial background (low or high)?"] || "";
//       const academic = qaMap["are you a topper/average/poor student during schooling?"] || "";

//       return profession.includes(detected.jobRole) &&
//         (!detected.medium || medium.includes(detected.medium)) &&
//         (!detected.finance || finance.includes(detected.finance)) &&
//         (!detected.academic || academic.includes(detected.academic));
//     });

//     if (matchedMentors.length === 0) {
//       return res.status(404).json({ message: "No matching mentors found for your criteria." });
//     }

//     // Use Titan AI to get roadmap (example implementation)
//     const roadmap = await TitanAI.generateRoadmap(detected.jobRole, matchedMentors);

//     res.json({
//       answer: `Found ${matchedMentors.length} mentors who matched your profile for the role "${detected.jobRole}".`,
//       roadmap,
//     });
//   } catch (err) {
//     console.error("Career search failed:", err);
//     res.status(500).json({ message: "Server error during career search" });
//   }
// };



// exports.careerSearch = async (req, res) => {
//   try {
//     const { query } = req.body;
//     const student = await Student.findOne({ user: req.user.id });

//     if (!query || !student) {
//       return res.status(400).json({ message: "Query and student info required" });
//     }

//     // 1. Extract Keyword
//     const extractPrompt = `
// You are a keyword extractor AI. Extract the most important keyword from this sentence for career analysis:
// "${query}"
// Respond ONLY with the keyword (e.g., doctor, engineer, artist).
//     `;
//     const keyword = await callTitan(extractPrompt);
//     const cleanKeyword = keyword
//   .toLowerCase()
//   .trim()
//   .replace(/^[0-9]+[\.\)]*\s*/, '') // removes leading numbers like "1. " or "2) "
//   .replace(/[^a-z\s]/g, '')         // removes any extra non-alpha characters
//   .trim();


//     // 2. Find matching mentors
//     const mentors = await Mentor.find({
//       jobRole: { $regex: cleanKeyword, $options: "i" }
//     });

//     if (mentors.length === 0) {
//       return res.json({
//         answer: `No mentors found for the keyword "${cleanKeyword}". Please try a different query.`,
//         roadmap: ""
//       });
//     }

//     // 3. Format mentor responses
//     const mentorSnippets = mentors.map((m, idx) => {
//       return `Mentor ${idx + 1} (${m.name}):\nAdvice: ${m.advice || "N/A"}\nMistakes: ${m.mistakes || "N/A"}\nExams: ${m.exams || "N/A"}\n`;
//     }).join("\n");

//     // 4. Final AI Summary
//    const finalPrompt = `
// You are a career roadmap expert. You help students understand the step-by-step journey to become a doctor in India.

// Please format the response like this:
// 🔧 Unified Career Pathways to Become a Doctor (Step-by-Step Options)

// 🏫 1. Schooling (After 10th)
// ✔ Step 1: Study well in 10th with focus on science and biology-related subjects.
// ✔ Step 2: Maintain high grades to qualify for science stream.

// 🎓 2. Group / Stream in Higher Secondary (11th & 12th)
// ✔ Step 1: Choose PCB (Physics, Chemistry, Biology).
// ✔ Step 2: Enroll in NEET coaching if possible.
// ✔ Step 3: Focus on building strong concepts.

// 🏛️ 3. Medical College Admission Paths
// ✔ Step 1: Write and crack NEET exam.
// ✔ Step 2: Apply to MBBS programs in government/private colleges.

// 🧠 4. Skill Building & Certifications (Parallel or Post-College)
// ✔ Step 1: Learn communication, patient care, and clinical skills.
// ✔ Step 2: Do internships, attend seminars, and build medical ethics.

// 🧑‍⚕️ 5. Career Roles in Medicine
// ✔ General Physician
// ✔ Surgeon
// ✔ Pediatrician
// ✔ Psychiatrist
// ✔ And many more...

// Please begin directly from step 1. Avoid all disclaimers or apologies.
// `;


//     const answer = await callTitan(finalPrompt);

//     return res.json({
//       answer,
//       roadmap: answer.split("Roadmap:")[1] || answer
//     });

//   } catch (err) {
//     console.error("Career Search Error:", err);
//     res.status(500).json({ message: "Career search failed" });
//   }
// };



exports.createRoadmapForStudent = async (student, suggestion) => {
  const className = student.education;  // ✅ Treat as string (UG, 12th, etc.)
  const interest = student.interest;

  if (!className) throw new Error("Missing student class");

  const message = `Based on the student's class level: ${className}, and their interest in ${interest}, here's the recommended roadmap.`;

  return `${message}\n\n${suggestion}`;
};

exports.careerSearch = async (req, res) => {
  try {
    const { query } = req.body;
    const student = await Student.findOne({ user: req.user.id });

    if (!query || !student) {
      return res.status(400).json({ message: "Query and student info required" });
    }

    const lowerQuery = query.toLowerCase();
    const jobRoles = ["doctor", "engineer", "lawyer", "ca", "teacher", "dsp", "pilot"];
    const mediums = ["english", "tamil", "hindi", "telugu"];
    const finances = ["low", "middle", "high"];
    const academics = ["topper", "average", "poor"];

    const detected = {
      jobRole: jobRoles.find(role => lowerQuery.includes(role)),
      medium: mediums.find(m => lowerQuery.includes(m)),
      finance: finances.find(f => lowerQuery.includes(f)),
      academic: academics.find(a => lowerQuery.includes(a)),
    };

    if (!detected.jobRole) {
      return res.status(404).json({ message: `No valid job role found in query.` });
    }

    // STEP 1: Find mentors matching job role
    const mentors = await Mentor.find({
      "qa.a": { $regex: new RegExp(detected.jobRole, 'i') }
    });

    if (!mentors.length) {
      return res.status(404).json({ message: "No mentors found for the selected job role." });
    }

    // STEP 2: Filter based on medium/finance/performance (partial match allowed)
    const matchedMentors = mentors.filter((mentor) => {
      const qa = mentor.qa.reduce((map, obj) => {
        map[obj.q.toLowerCase()] = obj.a.toLowerCase();
        return map;
      }, {});

      const profession = qa["what is your profession?"] || "";
      const medium = qa["what is your medium of education in school?"] || "";
      const finance = qa["what is your financial background (low or high)?"] || "";
      const academic = qa["are you a topper/average/poor student during schooling?"] || "";

      return (
        profession.includes(detected.jobRole) &&
        (!detected.medium || medium.includes(detected.medium)) &&
        (!detected.finance || finance.includes(detected.finance)) &&
        (!detected.academic || academic.includes(detected.academic))
      );
    });

    if (!matchedMentors.length) {
      return res.status(404).json({ message: "No mentors found matching your full profile." });
    }

    // STEP 3: Prepare mentor advice block for Titan
    const mentorInputs = matchedMentors.map((m, i) => {
      const qas = m.qa.map((item) => `Q: ${item.q}\nA: ${item.a}`).join("\n");
      return `Mentor ${i + 1} (${m.name}):\n${qas}`;
    }).join("\n\n");

    // STEP 4: Send prompt to Titan
    const prompt = `
You are a career mentor AI assistant for Indian students.

Based on the following mentor experiences and student background (role: ${detected.jobRole}, medium: ${detected.medium}, finance: ${detected.finance}, academic: ${detected.academic}), generate a structured roadmap to succeed in this career.

Structure it like:
1. Schooling Advice
2. Higher Secondary (11th & 12th)
3. Entrance Exams or Admission Paths
4. Skill Building
5. Career Roles

Give only relevant and helpful steps. Do not repeat or just echo the prompt. Start directly with:
"Here is your personalized career guidance:"
    
Mentor Experiences:
${mentorInputs}
`;

    const titanResponse = await callTitan(prompt);
    const cleaned = titanResponse
      .replace(/^.*roadmap:/i, "Here is your personalized roadmap:") // if model adds any unnecessary text
      .trim();

    return res.json({
      answer: cleaned,
      roadmap: cleaned
    });

  } catch (err) {
    console.error("Career Search Error:", err);
    res.status(500).json({ message: "Career search failed" });
  }
};
