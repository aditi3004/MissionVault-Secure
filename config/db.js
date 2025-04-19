// config/db.js

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "aditi10387!@#", // replace with your actual MySQL password
  database: "missionvault_db",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Could not connect to MySQL:", err);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL");
});

module.exports = db;
