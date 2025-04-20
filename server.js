const express = require("express");
const https = require("https");
const fs = require("fs");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const db = require("./config/db");

const app = express();

// Load SSL certificate and key
const sslOptions = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.crt"),
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "missionvault-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }, // ✅ only works on HTTPS
  })
);
app.use(express.static("public"));

// Routes
app.use("/", authRoutes);
const apiRoutes = require("./routes/CRUD_api");
app.use("/api", apiRoutes);

// Start HTTPS server
https.createServer(sslOptions, app).listen(443, () => {
  console.log("🔐 HTTPS Server running at https://localhost");
});
