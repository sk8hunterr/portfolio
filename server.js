const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Only required for local development

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle contact form submission
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  // Create transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // hunterwetzelportfolio@gmail.com
      pass: process.env.EMAIL_PASS, // App Password (not regular password)
    },
  });

  // Email contents
  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: 'New Portfolio Contact Form Message',
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  // Optional: Verify connection
  transporter.verify((err, success) => {
    if (err) {
      console.error('❌ Email server error:', err);
    } else {
      console.log('✅ Email server is ready to send');
    }
  });

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Failed to send email:', error);
      return res.status(500).send('Something went wrong while sending email.');
    }
    console.log('✅ Email sent:', info.response);
    res.redirect('/thankyou.html');
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});