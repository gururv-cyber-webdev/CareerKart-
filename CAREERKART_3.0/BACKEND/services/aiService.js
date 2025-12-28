const { callWatsonAPI } = require('./watsonService');
const { generateCareerRoadmap } = require('./gpt4allService');
const Mentor = require('../models/Mentor');
const axios = require('axios');
const path = require("path");
const { GPT4All } = require("gpt4all");
let gpt;

async function initModel() {
  if (!gpt) {
    const modelPath = path.resolve(__dirname, "../models");
    gpt = new GPT4All("ggml-gpt4all-j-v1.3-groovy.bin", { modelPath });
    await gpt.init();
  }
}

exports.createRoadmapForStudent = async (student, suggestion) => {
  const className = student.education;  // ✅ Treat as string (UG, 12th, etc.)
  const interest = student.interest;

  if (!className) throw new Error("Missing student class");

  const message = `Based on the student's class level: ${className}, and their interest in ${interest}, here's the recommended roadmap.`;

  return `${message}\n\n${suggestion}`;
};



exports.getCareerSuggestions = async ({ interest, mentors }) => {
  if (!mentors.length) return "No mentor suggestions available.";

  const combinedPrompt = `Mentor Suggestions:\n${mentors.map(m => `- ${m.advice}`).join("\n")}
Based on this, what's the best career suggestion for a student interested in ${interest}?`;

  const watsonResponse = await callWatsonAPI(combinedPrompt);
  return watsonResponse;
};

