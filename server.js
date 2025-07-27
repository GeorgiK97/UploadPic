require("dotenv").config();
const path = require("path");
const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require('./db');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
const authRoutes = require("./auth");
const authMiddleware = require("./middleware");

const app = express();
connectDB();

app.use(cors({
  origin: "http://localhost:5000",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);

// Serve static files from public
app.use(express.static(path.join(__dirname, "public")));

// AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Multer for uploads
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: "public-read",
    key: (req, file, cb) => {
      const userEmail = req.headers["user-email"] || "unknown";
      const userName = req.headers["user-name"] || "anonymous";
      const safeEmail = userEmail.replace(/[^a-zA-Z0-9@.]/g, "_");
      const safeName = userName.replace(/[^a-zA-Z0-9а-яА-Я ]/g, "_");
      const folderName = `${safeName}_${safeEmail}`;
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, `${folderName}/${filename}`);
    }
  })
});

// Upload route
app.post("/upload", authMiddleware, upload.array("images", 30), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const fileUrls = req.files.map(file => file.location);
  res.json({ fileUrls, message: "Upload successful!" });
});

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "homePage.html"));
});
app.use("/protected", authMiddleware, express.static(path.join(__dirname, "protected")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
