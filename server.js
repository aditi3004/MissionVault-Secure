// server.js
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const session = require("express-session"); // ✅ Add this
const authRoutes = require("./routes/auth");
const db = require("./config/db");
const app = express();

// Middleware to parse JSON and form data
app.use(express.json()); // for application/json
app.use(express.urlencoded({ extended: true })); // for x-www-form-urlencoded

// ✅ Add this session middleware BEFORE routes
app.use(
  session({
    secret: "missionvault-secret-key", // Use a secure key in prod
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set to true only if using HTTPS
  })
);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

// Routes
app.use("/", authRoutes);
const apiRoutes = require("./routes/CRUD_api");
app.use("/api", apiRoutes);

// Server start
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
