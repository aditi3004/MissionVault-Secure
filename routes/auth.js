const express = require("express");
const bcrypt = require("bcryptjs");
const path = require("path");
const db = require("../config/db");
const router = express.Router();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, "secret", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Joi validation schema for signup
const signupSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "user").required(),
  name: Joi.string().required(),
  ranking: Joi.string().required(),
  email: Joi.string().email().required(),
  aadhaar_number: Joi.string()
    .length(12)
    .pattern(/^[0-9]+$/)
    .required(),
  pan_number: Joi.string().length(10).alphanum().required(),
  dob: Joi.date().required(),
  service_number: Joi.string().required(),
});

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
  const { error } = signupSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .send("Validation failed: " + error.details[0].message);
  }

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

          res.redirect("/dashboard.html");
        }
      );
    }
  );
});

// Login Logic with JWT and Cookie
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
        // Session fallback (optional)
        req.session.user = {
          id: user.id,
          username: user.username,
          role: user.role,
        };

        // JWT generation
        const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1h" });

        // Set cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: false, // Set to true if using HTTPS
          maxAge: 3600000, // 1 hour
        });

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
      return res.redirect("/signup");
    }
  });
});

// Get user profile (JWT Auth)
router.get("/api/user/profile", authenticateToken, async (req, res) => {
  try {
    const [user] = await db
      .promise()
      .query(
        "SELECT u.username, u.role, p.name, p.ranking FROM users u JOIN personnel p ON u.personnel_id = p.personnel_id WHERE u.id = ?",
        [req.user.id]
      );
    if (user.length === 0)
      return res.status(404).json({ error: "User not found" });

    res.json({
      username: user[0].name,
      role: user[0].role,
      ranking: user[0].ranking,
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get payment history (JWT Auth)
router.get("/api/user/payments", authenticateToken, async (req, res) => {
  try {
    const [[user]] = await db
      .promise()
      .query("SELECT personnel_id FROM users WHERE id = ?", [req.user.id]);

    const [payments] = await db
      .promise()
      .query(
        "SELECT amount, purpose, payment_date AS date FROM payments WHERE personnel_id = ? ORDER BY payment_date DESC",
        [user.personnel_id]
      );

    res.json(payments);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update password (JWT Auth)
router.post("/api/user/password", authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const [user] = await db.query("SELECT * FROM users WHERE id = ?", [
    req.user.id,
  ]);

  const match = await bcrypt.compare(currentPassword, user[0].password);
  if (!match)
    return res.status(400).json({ message: "Incorrect current password" });

  const hashed = await bcrypt.hash(newPassword, 10);
  await db.query("UPDATE users SET password = ? WHERE id = ?", [
    hashed,
    req.user.id,
  ]);

  res.json({ message: "Password updated successfully" });
});

module.exports = router;
