const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

// POST route to send email
app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
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
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    res.redirect("/thankyou.html");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending message");
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});