const express = require('express');
const path = require('path');
const app = express();

// Ye line add kar - sab files serve karne ke liye
app.use(express.static(__dirname, {
  extensions: ['html', 'css', 'js'],
  index: 'index.html'
}));

// Sab routes ko handle kar
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;
