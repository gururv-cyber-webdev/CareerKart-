const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.callTitan = async (prompt) => {
  const input = {
    modelId: "amazon.titan-text-express-v1", // ✅ Titan model ID
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      inputText: prompt,
      textGenerationConfig: {
        maxTokenCount: 1000,
        temperature: 0.7,
        topP: 0.9,
      },
    }),
  };

  try {
    const command = new InvokeModelCommand(input);
    const response = await client.send(command);
    const responseBody = JSON.parse(Buffer.from(response.body).toString("utf-8"));
    return responseBody.results?.[0]?.outputText?.trim() || "";
  } catch (err) {
    console.error("Titan AI Error:", err);
    throw new Error("Titan AI failed");
  }
};
