require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 5000;
const API_KEY = process.env.API_KEY;
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

if (!API_KEY) {
  console.error("API_KEY is missing. Please set it in your .env file.");
  process.exit(1);
}

app.get("/weather", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "City name (q) is required." });
  }

  try {
    console.log(`Making request to OpenWeatherMap with city: ${q}`);
    const response = await axios.get(`${WEATHER_URL}?q=${q}&units=metric&appid=${API_KEY}`);
    // console.log("Response from OpenWeatherMap:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching weather data:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      error: "Failed to fetch weather data",
      message: error.response ? error.response.data : error.message,
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
