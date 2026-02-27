const express = require("express");
const os = require("os");

const app = express();

app.get("/", (req, res) => {
  res.send(`
    <h1>CloudNest v2 - CI Working</h1>
    <p>Server Hostname: ${os.hostname()}</p>
    <p>Environment: Production</p>
  `);
});

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(4000, () => {
  console.log("CloudNest running on port 4000");
});
