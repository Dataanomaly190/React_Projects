// const express = require("express");
// const multer = require("multer");
// const cors = require("cors");
// const path = require("path");
// const { v4: uuidv4 } = require("uuid");
// const fs = require("fs");
// const files = {}; // In-memory storage for uploaded file metadata

// const app = express();
// const port = process.env.PORT || 5000;

// // Allow requests from your React frontend (localhost:5173)
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "http://localhost:3000"],
//     methods: ["GET", "POST"],
//   })
// );

// // Serve static files from the "uploads" directory
// app.use("/uploads", express.static(path.join(__dirname, "Uploads")));

// // Ensure the "Uploads" directory exists
// const uploadsDir = path.join(__dirname, "Uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir);
// }

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "Uploads/");  // Uploads folder
//   },
//   filename: (req, file, cb) => {
//     const invoiceNumber = req.body.invoiceNumber || "null";
//     const ext = path.extname(file.originalname);
//     // const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//     const uniqueSuffix = Math.floor(10000 + Math.random() * 90000); // 5-digit number
//     // cb(null, `invoice-${invoiceNumber}${ext}`);  // Set filename as invoice-{invoiceNumber}.pdf
//     cb(null, `invoice-${invoiceNumber}-${uniqueSuffix}${ext}`);
//   },
// });

// // File type validation (e.g., allow only PDF, PNG, DOCX)
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = [
//     "application/pdf",
//     "image/png",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   ];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true); // Accept the file
//   } else {
//     cb(
//       new Error("Invalid file type. Only PDF, PNG, and DOCX are allowed."),
//       false // Reject the file
//     );
//   }
// };

// // Set limits and apply file filter
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 500 * 1024 * 1024 }, // Limit to 500MB
// });

// // File upload route
// app.post("/upload", upload.single("file"), (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     // Generate file URL (this can be accessed by the frontend)
//     const fileUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
//     console.log("Generated file URL:", fileUrl);

//     // Store metadata (optional, here it's in-memory)
//     const fileId = uuidv4();
//     files[fileId] = {
//       filePath: req.file.path,
//       fileUrl,
//       timestamp: Date.now(),
//     };

//     // Respond with file URL (frontend expects this)
//     res.json({ fileUrl });
//   } catch (error) {
//     console.error("Upload error:", error);
//     res.status(500).json({ error: "Failed to upload file" });
//   }
// });

// // Optional: Endpoint to retrieve file by fileId (if needed)
// app.get("/files/:fileId", (req, res) => {
//   const { fileId } = req.params;
//   const fileData = files[fileId];

//   if (!fileData) {
//     return res.status(404).json({ error: "File not found" });
//   }

//   res.sendFile(fileData.filePath, (err) => {
//     if (err) {
//       console.error("File send error:", err);
//       res.status(500).json({ error: "Failed to retrieve file" });
//     }
//   });
// });

// // Health check
// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Invoice Server running on port ${port}`);
// });


const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

// Allow requests from your React frontend
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"],
  })
);

// Serve static files from the "Uploads" directory
// Keep this ONLY if old files might still be accessed
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));

// Health check route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start the server
app.listen(port, () => {
  console.log(`Invoice Server running on port ${port}`);
});
