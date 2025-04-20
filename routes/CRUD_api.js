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
    return res
      .status(400)
      .json({
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

module.exports = router;
