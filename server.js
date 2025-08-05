const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Simple test route to verify server is running
app.get("/", (req, res) => {
  res.send("Portfolio Backend Server is running!");
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// POST route to send email
app.post("/send-email", async (req, res) => {
  console.log("Received email request:", req.body);

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send("All fields are required");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `Portfolio Contact: ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <h3>New Portfolio Contact</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    res.redirect("https://sk8hunterr.github.io/portfolio/thankyou.html");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send(`Error sending message: ${error.message}`);
  }
});

// Catch-all 404 route
app.use('*', (req, res) => {
  res.status(404).json({
    error: "Route not found",
    availableRoutes: ["/", "/health", "/send-email (POST)"]
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Available routes:`);
  console.log(`GET  / - Server status`);
  console.log(`GET  /health - Health check`);
  console.log(`POST /send-email - Send contact email`);
});