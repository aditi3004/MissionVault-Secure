// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const path = require("path");
const db = require("../config/db");
const authorise = require("../middleware/authorise_user");

const router = express.Router();

// Redirect root to login
router.get("/", (req, res) => {
  res.redirect("/login");
});

// Serve Login Page
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

// Serve Signup Page
router.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/signup.html"));
});

// Signup Logic
router.post("/signup", async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
  db.execute(query, [username, hashedPassword, role], (err) => {
    if (err) {
      console.error("Signup error:", err);
      return res.send("Signup failed");
    }
    // ✅ Redirect to personnel form page
    res.redirect("/personnel-form.html");
  });
});

// Login Logic with Role-Based Redirection
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE username = ?";
  db.execute(query, [username], async (err, results) => {
    if (err) {
      console.error("Login error:", err);
      return res.send("Login failed");
    }

    if (results.length > 0) {
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        // ✅ Store in session (server-side)
        req.session.user = {
          id: user.id,
          username: user.username,
          role: user.role,
        };

        // ✅ Also send user info to browser to be stored in sessionStorage (client-side)
        const userData = {
          username: user.username,
          role: user.role,
        };

        const redirectPage =
          user.role === "admin" ? "/dashboard.html" : "/users.html";

        return res.send(`
          <script>
            sessionStorage.setItem('user', '${JSON.stringify(userData)}');
            window.location.href = '${redirectPage}';
          </script>
        `);
      } else {
        return res.send("Invalid username or password");
      }
    } else {
      return res.redirect("/users.html");
    }
  });
});

module.exports = router;
