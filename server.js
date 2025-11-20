const express = require('express');
const app = express();

// Serve static files
app.use(express.static(__dirname));

// Handle all routes
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

module.exports = app;
