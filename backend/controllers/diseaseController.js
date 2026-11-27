const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images are allowed'), false);
  }
});

const analyzeCropImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Please upload an image" });

    const uploadFromBuffer = (req) => {
      return new Promise((resolve, reject) => {
        const cld_upload_stream = cloudinary.uploader.upload_stream(
          { folder: "krishibondhu_scans" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
      });
    };

    const cloudinaryResult = await uploadFromBuffer(req);
    const imageUrl = cloudinaryResult.secure_url;
    const base64Image = req.file.buffer.toString("base64");
    
    // IMPROVED PROMPT: Forces the AI to state the plant name first
    const systemPrompt = `You are KrishiBondhu AI, an expert agricultural pathologist. 
    Analyze this plant image. 
    1. Identify the plant/crop name (e.g., Tomato, Rice, Potato).
    2. Identify the disease or pest. 
    3. Provide a cure/treatment in Bangla. 
    4. Ask 1 relevant follow-up question.
    
    STRICT RULES:
    1. DO NOT use any greetings.
    2. Start your response IMMEDIATELY with the plant name and diagnosis.
    3. Add this disclaimer at the very end: "AI suggestion, confirm with your Upazila Agriculture Officer."`;

    const primaryModel = 'gemini-3.5-flash-lite';
    const fallbackModel = 'gemini-3.8-flash';

    async function callGemini(modelName) {
      return await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': process.env.GEMINI_API_KEY,
          },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [{
              parts: [
                { text: "Analyze this image." },
                { inline_data: { mime_type: req.file.mimetype, data: base64Image } }
              ]
            }],
          }),
        }
      );
    }

    let response = await callGemini(primaryModel);
    if (!response.ok) response = await callGemini(fallbackModel);

    const data = await response.json();
    const aiAdvice = data.candidates?.[0]?.content?.parts?.[0]?.text || "ছবিটি বিশ্লেষণ করা সম্ভব হয়নি।";

    res.status(200).json({ success: true, image_url: imageUrl, ai_analysis: aiAdvice });

  } catch (error) {
    console.error("Disease Scan Error:", error);
    res.status(500).json({ message: "Failed to analyze image. Please try again." });
  }
};

module.exports = { analyzeCropImage, upload };