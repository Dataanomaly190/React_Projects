const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000"] }));
app.use(bodyParser.json({ limit: "1000mb" }));
app.use(express.json({ limit: "1000mb" }));

const dataDir = path.join(__dirname, "data");
const draftsFile = path.join(dataDir, "drafts.json");
const historyDir = path.join(__dirname, "history");
const historyUploadsDir = path.join(historyDir, "uploads");
const historyJsonPath = path.join(historyDir, "history.json");

// Serve public uploads statically so links work
const publicUploadsDir = path.join(__dirname, "Uploads");
if (!fs.existsSync(publicUploadsDir)) fs.mkdirSync(publicUploadsDir);
app.use("/Uploads", express.static(publicUploadsDir));

// Ensure directories exist
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(historyDir)) fs.mkdirSync(historyDir);
if (!fs.existsSync(historyUploadsDir)) fs.mkdirSync(historyUploadsDir);

// Ensure files exist
if (!fs.existsSync(draftsFile)) fs.writeFileSync(draftsFile, "[]", "utf-8");
if (!fs.existsSync(historyJsonPath)) fs.writeFileSync(historyJsonPath, "[]", "utf-8");

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));
app.use("/history/uploads", express.static(historyUploadsDir));

// Health check
app.get("/", (req, res) => {
  res.send("Unified Server is running");
});

// DRAFT ROUTES
function readDrafts() {
  const data = fs.readFileSync(draftsFile, "utf-8");
  return JSON.parse(data);
}

function writeDrafts(drafts) {
  fs.writeFileSync(draftsFile, JSON.stringify(drafts, null, 2));
}

app.get("/api/drafts", (req, res) => {
  res.json(readDrafts());
});

app.get("/api/drafts/:id", (req, res) => {
  const drafts = readDrafts();
  const draft = drafts.find((d) => d.id === req.params.id);
  if (!draft) return res.status(404).json({ message: "Draft not found" });
  res.json(draft);
});

app.post("/api/drafts", (req, res) => {
  const drafts = readDrafts();
  const incomingDraft = req.body;

  if (!incomingDraft || !incomingDraft.data) {
    return res.status(400).json({ message: "Invalid draft format." });
  }

  const existingIndex = drafts.findIndex((d) => d.id === incomingDraft.id);

  if (incomingDraft.id && existingIndex !== -1) {
    drafts[existingIndex] = {
      ...drafts[existingIndex],
      data: incomingDraft.data,
      updatedAt: new Date().toISOString(),
    };
    writeDrafts(drafts);
    return res.status(200).json(drafts[existingIndex]);
  }

  const newDraft = {
    id: Date.now().toString(),
    data: incomingDraft.data,
    createdAt: new Date().toISOString(),
  };

  drafts.unshift(newDraft);
  writeDrafts(drafts);
  res.status(201).json(newDraft);
});

app.put("/api/drafts/:id", (req, res) => {
  const drafts = readDrafts();
  const index = drafts.findIndex((d) => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Draft not found" });

  drafts[index].data = req.body.data;
  drafts[index].updatedAt = new Date().toISOString();
  writeDrafts(drafts);
  res.json(drafts[index]);
});

app.delete("/api/drafts/:id", (req, res) => {
  let drafts = readDrafts();
  const initialLength = drafts.length;
  drafts = drafts.filter((d) => d.id !== req.params.id);

  if (drafts.length === initialLength) {
    return res.status(404).json({ message: "Draft not found" });
  }

  writeDrafts(drafts);
  res.status(204).send();
});

// HISTORY ROUTES
app.get("/api/history", (req, res) => {
  fs.readFile(historyJsonPath, "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read history" });
    res.json(JSON.parse(data));
  });
});

app.post("/api/history/upload-image", (req, res) => {
  const { invoiceNumber, projectName, issueDate, imageName, imageData } = req.body;

  if (!invoiceNumber || !projectName || !issueDate || !imageName || !imageData) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
  const filePath = path.join(historyUploadsDir, imageName);

  try {
    fs.writeFileSync(filePath, base64Data, "base64");

    const historyItem = {
      ...req.body,
      image: imageName,
      finalizedAt: new Date().toISOString()
    };
    delete historyItem.imageData;

    const history = JSON.parse(fs.readFileSync(historyJsonPath, "utf-8"));
    history.push(historyItem);
    fs.writeFileSync(historyJsonPath, JSON.stringify(history, null, 2));

    res.json({
      message: "Invoice image saved",
      imageUrl: `/history/uploads/${imageName}`,
      savedItem: historyItem
    });
  } catch (err) {
    console.error("Error saving invoice image:", err);
    res.status(500).json({ error: "Failed to save invoice image" });
  }
});

app.delete("/api/history/reset", (req, res) => {
  try {
    fs.writeFileSync(historyJsonPath, "[]", "utf-8");
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

// FILE UPLOAD ROUTE
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, publicUploadsDir);
  },
  filename: (req, file, cb) => {
    const invoiceNumber = req.body.invoiceNumber || "null";
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Math.floor(10000 + Math.random() * 90000);
    cb(null, `invoice-${invoiceNumber}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const fileUrl = `http://localhost:${PORT}/Uploads/${req.file.filename}`;
    res.json({ fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Unified Server running on port ${PORT}`);
  console.log('Press Ctrl+C to stop');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Error: Port ${PORT} is already in use.`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});