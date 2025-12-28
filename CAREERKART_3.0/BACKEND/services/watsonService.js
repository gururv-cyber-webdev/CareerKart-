exports.callWatsonAPI = async (prompt) => {
  try {
    const sessionRes = await axios.post(`${url}/v2/assistants/${assistantId}/sessions`, {}, {
      auth: { username: "apikey", password: apiKey },
      headers: { "Content-Type": "application/json" }
    });

    const sessionId = sessionRes.data.session_id;

    const messageRes = await axios.post(
      `${url}/v2/assistants/${assistantId}/sessions/${sessionId}/message`,
      {
        input: { message_type: "text", text: prompt }
      },
      {
        auth: { username: "apikey", password: apiKey },
        headers: { "Content-Type": "application/json" }
      }
    );

    return messageRes.data.output.generic?.[0]?.text || "No response from Watson.";
  } catch (err) {
    console.error("Watson Error", err.response?.data || err.message);
    return "Could not fetch suggestion from Watson.";
  }
};
