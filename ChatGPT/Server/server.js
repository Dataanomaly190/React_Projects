const express = require("express");
const { OpenAI } = require("openai");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:5000", "http://localhost:5173"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Explicitly handle OPTIONS requests for /api/chat
app.options("/api/chat", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(204); // No Content
});

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OpenAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    });

    if (!response.choices || response.choices.length === 0) {
      return res.status(500).json({ error: "No response from OpenAI" });
    }

    console.log(response.choices[0].message.content); // ✅ Safe here

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong with the API call" });
  }
  console.log(response.choices[0].message.content);
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});