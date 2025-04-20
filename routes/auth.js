const express = require("express");
const bcrypt = require("bcryptjs");
const path = require("path");
const db = require("../config/db");
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

// Signup Logic (Inserts into personnel first, then users)
router.post("/signup", async (req, res) => {
  const {
    username,
    password,
    role,
    name,
    ranking,
    email,
    aadhaar_number,
    pan_number,
    dob,
    service_number,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  // Step 1: Insert into personnel
  const insertPersonnelQuery = `
    INSERT INTO personnel (name, role, ranking, email, aadhaar_number, pan_number, dob, service_number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.execute(
    insertPersonnelQuery,
    [
      name,
      role,
      ranking,
      email,
      aadhaar_number,
      pan_number,
      dob,
      service_number,
    ],
    (err, result) => {
      if (err) {
        console.error("Personnel insert error:", err);
        return res.send("Signup failed during personnel creation.");
      }

      const personnel_id = result.insertId;

      // Step 2: Insert into users with the personnel_id
      const insertUserQuery = `
        INSERT INTO users (username, password, role, personnel_id)
        VALUES (?, ?, ?, ?)
      `;

      db.execute(
        insertUserQuery,
        [username, hashedPassword, role, personnel_id],
        (err2) => {
          if (err2) {
            console.error("User insert error:", err2);
            return res.send("Signup failed during user creation.");
          }

          // ✅ Signup successful — redirect user
          res.redirect("/dashboard.html"); // or "/login" or "/personnel-form.html"
        }
      );
    }
  );
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
      // 🚨 Username doesn't exist — redirect to signup
      return res.redirect("/signup");
    }
  });
});

module.exports = router;
