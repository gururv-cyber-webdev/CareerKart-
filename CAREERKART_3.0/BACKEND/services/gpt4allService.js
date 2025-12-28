const { GPT4All } = require('gpt4all');
const path = require('path');

let gpt;

async function initModel() {
  if (!gpt) {
    const modelPath = path.resolve(__dirname, '../models');  // relative path to .bin
    gpt = new GPT4All('ggml-gpt4all-j-v1.3-groovy.bin', { modelPath });

    await gpt.init(); // important to initialize
  }
}

exports.generateCareerRoadmap = async (studentClass, careerGoal) => {
  try {
    await initModel();

    const prompt = `
You are a friendly career coach. 
A student is currently in ${studentClass} standard and wants to become a ${careerGoal}. 
Please generate a clear, step-by-step roadmap from ${studentClass} to achieving that career, 
including exams, degrees, skills, and approximate timelines.
`;

    const response = await gpt.chat([
      { role: 'system', content: 'You are an expert career advisor.' },
      { role: 'user', content: prompt }
    ]);

    return response || "Sorry, I couldn't generate a roadmap right now.";
  } catch (err) {
    console.error("GPT4All Error:", err);
    return "Unable to generate roadmap at this time.";
  }
};
