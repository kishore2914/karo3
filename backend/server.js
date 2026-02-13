const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
 
const app = express();
 
// Middleware
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
 
// ----------------------
// DATABASE CONNECTION
// ----------------------
 
const db = mysql.createConnection({
  host: "database-1.c8lyqi2gwgl4.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "fR$4rockaws",   // <-- your updated password
  database: "mysql"       // temporary default DB
});
 
db.connect((err) => {
  if (err) {
    console.error("❌ DB connection failed:", err);
  } else {
    console.log("✅ Connected to RDS");
  }
});
 
// ----------------------
// BASIC ROUTES
// ----------------------
 
app.get("/", (req, res) => {
  res.json({ message: "Backend running successfully" });
});
 
// ----------------------
// AUTH ROUTES
// ----------------------
 
app.post("/api/auth/send-otp", (req, res) => {
  const { mobile, email, type } = req.body;
 
  console.log("📲 OTP requested for:",{ mobile, email, type });
 
  res.json({
    success: true,
    message: "OTP sent successfully",
    otp: "123456" // mock OTP for now
  });
});
 
app.post("/api/auth/verify-otp", (req, res) => {
  const { otp } = req.body;
 
  if (otp === "123456") {
    res.json({
      success: true,
      message: "OTP verified successfully"
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid OTP"
    });
  }
});
 
// ----------------------
// LOAN ROUTES
// ----------------------
 
app.post("/api/loans/apply", (req, res) => {
  const data = req.body;
 
  console.log("📄 Loan application received:", data);
 
  res.json({
    success: true,
    message: "Loan application submitted successfully"
  });
});
 
// ----------------------
// PROFILE ROUTE
// ----------------------
 
app.post("/api/profile", (req, res) => {
  res.json({
    success: true,
    profile: {
      name: "Test User",
      mobile: "9999999999"
    }
  });
});
 
// ----------------------
// ADMIN ROUTES
// ----------------------
 
app.get("/api/admin/loans", (req, res) => {
  res.json({
    success: true,
    loans: []
  });
});
 
app.get("/api/admin/stats", (req, res) => {
  res.json({
    success: true,
    totalUsers: 0,
    totalLoans: 0
  });
});
 
// ----------------------
// ERROR HANDLER
// ----------------------
 
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});
 
// ----------------------
// START SERVER
// ----------------------
 
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
