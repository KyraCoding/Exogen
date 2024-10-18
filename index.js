// Exogen. Redefining your horizons.
const express = require("express");
const multer = require('multer');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const PORT = process.env.PORT || 3001;
const API_KEY = process.env.API_KEY || process.exit(1);

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const app = express();
app.get("/api/healthcheck", (req, res) => {
  res.json({ success: true });
});
app.get("/api/generate/", async (req, res) => {
  const prompt = req.query.prompt;
  const result = (await model.generateContent(prompt)).response.text();
  res.json({ response: result, success: true });
});
app.post("/api/analyze", upload.single('image'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send({ response: 'Please upload a file.', success: false });
    } else {
      const result = await model.generateContent(file.buffer.toString('base64'));
      res.json({ response: result.response.text(), success: true });
    }
  } catch (err) {
    res.status(500).send({ response: 'An error occurred while processing the file.', success: false });
  }

});
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});