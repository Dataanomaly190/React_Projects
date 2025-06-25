const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 5002;

const historyDir = path.join(__dirname, "history");
const historyUploadsDir = path.join(historyDir, "uploads");
const historyJsonPath = path.join(historyDir, "history.json");

// Ensure directories exist
if (!fs.existsSync(historyDir)) fs.mkdirSync(historyDir);
if (!fs.existsSync(historyUploadsDir)) fs.mkdirSync(historyUploadsDir);
if (!fs.existsSync(historyJsonPath))
  fs.writeFileSync(historyJsonPath, "[]", "utf-8");

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "1000mb" }));
app.use("/uploads", express.static(historyUploadsDir));

// GET history
app.get("/history.json", (req, res) => {
  fs.readFile(historyJsonPath, "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read history" });
    res.json(JSON.parse(data));
  });
});

// POST to save image data
app.post("/upload-invoice-image", (req, res) => {
  const { invoiceNumber, projectName, issueDate, imageName, imageData } =
    req.body;

  if (
    !invoiceNumber ||
    !projectName ||
    !issueDate ||
    !imageName ||
    !imageData
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
  const filePath = path.join(historyUploadsDir, imageName);

  try {
    fs.writeFileSync(filePath, base64Data, "base64");

    const history = JSON.parse(fs.readFileSync(historyJsonPath, "utf-8"));
    history.push({ invoiceNumber, projectName, issueDate, image: imageName });
    fs.writeFileSync(historyJsonPath, JSON.stringify(history, null, 2));

    res.json({
      message: "Invoice image saved",
      imageUrl: `/uploads/${imageName}`,
    });
  } catch (err) {
    console.error("Error saving invoice image:", err);
    res.status(500).json({ error: "Failed to save invoice image" });
  }
});

// DELETE /reset-history - clear history.json and delete uploaded images
app.delete("/reset-history", (req, res) => {
    try {
      // Reset history.json to empty array
      fs.writeFileSync(historyJsonPath, "[]", "utf-8");
  
      // Delete all files in uploads directory
      const files = fs.readdirSync(historyUploadsDir);
      for (const file of files) {
        fs.unlinkSync(path.join(historyUploadsDir, file));
      }

      res.json({ message: "History reset successfully" });
    } catch (err) {
      console.error("Error resetting history:", err);
      res.status(500).json({ error: "Failed to reset history" });
    }
  });  

app.listen(port, () => {
  console.log(`History server running on port ${port}`);
});