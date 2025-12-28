const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({
  region: "us-east-1", // your region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS,
    secretAccessKey: process.env.AWS_SECRET
  }
});

exports.generateRoadmap = async (career, mentors) => {
  const mentorSnippets = mentors.map((m, idx) => {
    const professionQA = m.qa.find(q => q.q.includes("Profession"))?.a || "";
    return `Mentor ${idx + 1}: ${professionQA}`;
  }).join("\n");

  const prompt = `Create a personalized career roadmap for a student from Tamil medium, low-income background, and poor academic status who wants to become a ${career}. Base this roadmap on the following mentor insights:\n\n${mentorSnippets}`;

  const command = new InvokeModelCommand({
    modelId: "amazon.titan-text-lite-v1",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({ inputText: prompt })
  });

  const response = await client.send(command);
  const body = JSON.parse(Buffer.from(response.body).toString());
  return body.results?.[0]?.outputText || "Could not generate roadmap.";
};
