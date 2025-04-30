const express = require("express");
const db = require("../config/db");
const router = express.Router();

// Get all personnel records
router.get("/records", (req, res) => {
  const sql = "SELECT * FROM personnel";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add a new personnel record
router.post("/records", (req, res) => {
  const {
    name,
    role,
    ranking,
    email,
    aadhaar_number,
    pan_number,
    dob,
    service_number,
  } = req.body;

  if (
    [
      name,
      role,
      ranking,
      email,
      aadhaar_number,
      pan_number,
      dob,
      service_number,
    ].includes(undefined)
  ) {
    return res.status(400).json({
      error: "All fields must be provided. No undefined values allowed.",
    });
  }

  const sql = `
    INSERT INTO personnel (
      name, role, ranking, email,
      aadhaar_number, pan_number, dob, service_number
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name,
    role,
    ranking,
    email,
    aadhaar_number,
    pan_number,
    dob,
    service_number,
  ];

  db.execute(sql, values, (err, result) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, personnel_id: result.insertId });
  });
});

// Update a personnel record
router.put("/records/:personnel_id", (req, res) => {
  const {
    name,
    role,
    ranking,
    email,
    aadhaar_number,
    pan_number,
    dob,
    service_number,
  } = req.body;

  const sql = `
    UPDATE personnel SET
      name=?, role=?, ranking=?, email=?,
      aadhaar_number=?, pan_number=?, dob=?, service_number=?
    WHERE personnel_id=?
  `;

  const values = [
    name,
    role,
    ranking,
    email,
    aadhaar_number,
    pan_number,
    dob,
    service_number,
    req.params.personnel_id,
  ].map((val) => (val === undefined ? null : val));

  db.execute(sql, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Delete a personnel record
router.delete("/records/:personnel_id", (req, res) => {
  const sql = "DELETE FROM personnel WHERE personnel_id=?";
  db.execute(sql, [req.params.personnel_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Update name using oldName and newName
router.put("/records/update-name", (req, res) => {
  const { oldName, newName } = req.body;

  if (!oldName || !newName) {
    return res
      .status(400)
      .json({ error: "Both oldName and newName are required." });
  }

  const sql = "UPDATE personnel SET name = ? WHERE LOWER(name) = LOWER(?)";
  db.execute(sql, [newName, oldName], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Name not found." });
    }

    res.json({ message: "Record updated successfully." });
  });
});

// Express route to handle search by service number
router.get("/api/records/search", async (req, res) => {
  const { serviceNumber } = req.query;

  if (!serviceNumber) {
    return res
      .status(400)
      .json({ error: "serviceNumber parameter is missing" });
  }

  try {
    const [results] = await db.execute(
      "SELECT name, email, role, dob FROM personnel WHERE service_number = ?",
      [serviceNumber]
    );

    res.json(results);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
