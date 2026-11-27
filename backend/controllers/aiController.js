const chatWithAI = async (req, res) => {
  try {
    let { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: "Invalid input" });
    }

    message = message.substring(0, 1000);

    // STRONGER PROMPT: Forces AI to look at history
    const systemPrompt = `You are KrishiBondhu AI, an expert agricultural advisor. 
    You MUST read the previous chat history carefully. If the user asks a follow-up question (like "Which plant is this?" or "What is the cure?"), look at the AI's previous responses (like a recent image diagnosis) to answer correctly.
    
    STRICT RULES:
    1. DO NOT use any greetings like "Nomoskar", "Hello", "নমস্তি", or "আসসালামু আলাইকুম".
    2. DO NOT introduce yourself. Start immediately with the answer.
    3. Always add this disclaimer at the very end: "AI suggestion, confirm with your Upazila Agriculture Officer before using pesticides."`;

    const contents = [];
    if (history && Array.isArray(history)) {
      history.forEach(msg => {
        contents.push({ role: msg.role === 'user' ? 'user' : 'model', parts: msg.parts });
      });
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const primaryModel = 'gemini-3.5-flash-lite'; 
    const fallbackModel = 'gemini-3.8-flash'; 

    async function makeApiCall(modelName) { 
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: systemPrompt }] },
              contents: contents,
            }),
          }
        );
        if (response.ok) return await response.json();
        throw new Error("Model failed");
    }

    let data;
    try {
      data = await makeApiCall(primaryModel);
    } catch (error) {
      data = await makeApiCall(fallbackModel); 
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not analyze.";
    res.status(200).json({ success: true, reply: text });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: "AI service temporarily unavailable." });
  }
};

module.exports = { chatWithAI };