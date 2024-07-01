const express = require("express");
const axios = require("axios");
const app = express();

// create GET request handler
app.get("/api/hello", async (req, res) => {
  // Extract visitor name
  const visitorName = req.query.visitor_name || "Guest";

  // Extract user IP address
  const clientIP = req.ip;

  // Fetch location from IP address

  try {
    // Fetch location data from the external API

    const response = await axios.get(`https://ipapi.co/${clientIP}/json/`);
    const location = response.data.city || "Unknown location";

    res.send({
      client_IP: clientIP,
      greeting: `Hello, ${visitorName}`,
      location: `You are in ${location}`,
    });
  } catch (error) {
    res.send({
      client_IP: clientIP,
      greeting: `Hello, ${visitorName}`,
      location: `Failed to fetch location data`,
    });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening for ${port}...`);
});
