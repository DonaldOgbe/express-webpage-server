const express = require("express");
const axios = require("axios");
const requestIp = require("request-ip");
const app = express();
// API key for OpenWeatherMap
const weatherAPIKey = "98a5d1cf72bf9821ecfcf58872b07db1";

// Middleware to get client IP address
app.use(requestIp.mw());

// Define a GET request handler for the "/api/hello" endpoint
app.get("/api/hello", async (req, res) => {
  // Extract visitor name from query parameters, default to "Guest" if not provided
  const visitorName = req.query.visitor_name || "Guest";

  let clientIP = req.clientIp;

  // Handle special cases for localhost
  if (clientIP === "::1" || clientIP === "127.0.0.1") {
    clientIP = await axios
      .get("https://api.ipify.org?format=json")
      .then((response) => response.data.ip);
  }

  try {
    // Fetch location data from the external API using the client IP address
    const locationResponse = await axios.get(
      `https://ipapi.co/${clientIP}/json/`
    );
    // Extract city name from the location response, default to "Unknown location" if not provided
    const location = locationResponse.data.city;

    // Fetch weather data from the OpenWeatherMap API using the location
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherAPIKey}&units=metric`
    );
    // Extract temperature from the weather response
    const weather = weatherResponse.data;
    const temperature = weather.main.temp;

    // Send a JSON response with the client IP, location, and a greeting message including the temperature

    res.send({
      client_IP: clientIP,
      location: location,
      greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location}.`,
    });
  } catch (error) {
    // Log the error and send a 500 Internal Server Error response if fetching location or weather data fails
    console.error(error);
    res
      .status(500)
      .json({ error: `"Failed to fetch location or weather data"` });
  }
});

// Define the port for the server to listen on, default to 3000 if not provided
const port = process.env.PORT || 3000;

// Start the server and log a message when it's listening
app.listen(port, () => {
  console.log(`Listening for ${port}...`);
});
