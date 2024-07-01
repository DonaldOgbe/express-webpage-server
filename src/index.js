const express = require("express");
const app = express();

app.get("/api/hello", (req, res) => {
  const visitorName = req.query.visitor_name || "Guest";
  res.send(`Hello ${visitorName}`);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening for ${port}...`);
});
