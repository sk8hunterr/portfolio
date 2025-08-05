const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Route to serve portfolio.html as homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'portfolio.html'));
});

// ✅ Handle contact form submission
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  // Optional: Save to file
  const log = `\nName: ${name}\nEmail: ${email}\nMessage: ${message}\n---\n`;
  fs.appendFileSync('submissions.txt', log, 'utf8');

  // ✅ Redirect to thank-you page
  res.redirect('/thankyou.html');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
