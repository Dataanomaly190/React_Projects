const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const PORT = 5001;

const path = require("path");
const FILE_PATH = path.join(__dirname, "drafts.json");

app.use(cors());
app.use(bodyParser.json());

// Utility to read file
function readDrafts() {
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, "[]", "utf-8");
  }
  const data = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(data);
}

// Utility to write file
function writeDrafts(drafts) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(drafts, null, 2));
}

// GET all drafts
app.get("/drafts", (req, res) => {
  const drafts = readDrafts();
  res.json(drafts);
});

// GET single draft by ID
app.get("/drafts/:id", (req, res) => {
  const drafts = readDrafts();
  const draft = drafts.find((d) => d.id === req.params.id);
  if (!draft) return res.status(404).json({ message: "Draft not found" });
  res.json(draft);
});

// POST create a new draft
app.post("/drafts", (req, res) => {
  const drafts = readDrafts();
  const incomingDraft = req.body;

  if (!incomingDraft || !incomingDraft.data) {
    return res.status(400).json({ message: "Invalid draft format." });
  }

  const existingIndex = drafts.findIndex((d) => d.id === incomingDraft.id);

  if (incomingDraft.id && existingIndex !== -1) {
    // If ID exists and matches → update the existing draft
    drafts[existingIndex] = {
      ...drafts[existingIndex],
      data: incomingDraft.data,
      updatedAt: new Date().toISOString(),
    };
    writeDrafts(drafts);
    console.log("Draft updated:", drafts[existingIndex]);
    return res.status(200).json(drafts[existingIndex]);
  }

  // Else → create a new draft
  const newDraft = {
    id: Date.now().toString(),
    data: incomingDraft.data,
    createdAt: new Date().toISOString(),
  };

  drafts.unshift(newDraft);
  writeDrafts(drafts);
  console.log("New draft saved:", newDraft);
  res.status(201).json(newDraft);
});

// PUT update existing draft
app.put("/drafts/:id", (req, res) => {
  const drafts = readDrafts();
  const index = drafts.findIndex((d) => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Draft not found" });

  drafts[index].data = req.body.data;
  drafts[index].updatedAt = new Date().toISOString();
  writeDrafts(drafts);
  res.json(drafts[index]);
});

// DELETE draft
app.delete("/drafts/:id", (req, res) => {
  let drafts = readDrafts();
  const initialLength = drafts.length;
  drafts = drafts.filter((d) => d.id !== req.params.id);

  if (drafts.length === initialLength) {
    return res.status(404).json({ message: "Draft not found" });
  }

  writeDrafts(drafts);
  res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
  console.log(
    `Draft Server running on port ${PORT}`
  );
});
