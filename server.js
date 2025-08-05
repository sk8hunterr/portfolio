const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Add a specific route for the root path to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Add a specific route for thankyou.html
app.get('/thankyou.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'thankyou.html'));
});

// POST route to send email
app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Set in Render dashboard
      pass: process.env.EMAIL_PASS  // Set in Render dashboard
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `New message from ${name}`,
    text: `From: ${name} (${email})\n\nMessage:\n${message}`,
    replyTo: email // This allows you to reply directly to the sender
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    res.redirect("/thankyou.html");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending message. Please try again later.");
  }
});

// Catch-all handler for any other routes
app.get('*', (req, res) => {
  res.status(404).send('Page not found');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});