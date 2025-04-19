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
  console.log("Incoming data:", req.body); // 👈 DEBUG

  const {
    first_name,
    last_name,
    gender,
    date_of_birth,
    rank,
    branch,
    unit,
    enlistment_date,
    discharge_date,
    service_status,
    contact_number,
    email,
    address,
    emergency_contact_name,
    emergency_contact_number,
    medical_conditions,
    blood_group,
    photo_url,
    created_by,
  } = req.body;

  // Check for undefined values
  if (
    [
      first_name,
      last_name,
      gender,
      date_of_birth,
      rank,
      branch,
      unit,
      enlistment_date,
      service_status,
      contact_number,
      email,
      address,
      emergency_contact_name,
      emergency_contact_number,
      medical_conditions,
      blood_group,
      photo_url,
      created_by,
    ].includes(undefined)
  ) {
    return res.status(400).json({
      error: "All fields must be provided. No undefined values allowed.",
    });
  }

  const sql = `INSERT INTO personnel (
    first_name, last_name, gender, date_of_birth, rank, branch, unit,
    enlistment_date, discharge_date, service_status, contact_number, email,
    address, emergency_contact_name, emergency_contact_number,
    medical_conditions, blood_group, photo_url, created_by
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`;

  db.execute(
    sql,
    [
      first_name,
      last_name,
      gender,
      date_of_birth,
      rank,
      branch,
      unit,
      enlistment_date,
      discharge_date,
      service_status,
      contact_number,
      email,
      address,
      emergency_contact_name,
      emergency_contact_number,
      medical_conditions,
      blood_group,
      photo_url,
      created_by,
    ],
    (err, result) => {
      if (err) {
        console.error("Insert error:", err); // 👈 DEBUG
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, id: result.insertId });
    }
  );
});

// Update a personnel record
router.put("/records/:id", (req, res) => {
  const {
    first_name,
    last_name,
    gender,
    date_of_birth,
    rank,
    branch,
    unit,
    enlistment_date,
    discharge_date,
    service_status,
    contact_number,
    email,
    address,
    emergency_contact_name,
    emergency_contact_number,
    medical_conditions,
    blood_group,
    photo_url,
  } = req.body;

  const sql = `UPDATE personnel SET
    first_name=?, last_name=?, gender=?, date_of_birth=?, rank=?, branch=?, unit=?,
    enlistment_date=?, discharge_date=?, service_status=?, contact_number=?, email=?,
    address=?, emergency_contact_name=?, emergency_contact_number=?,
    medical_conditions=?, blood_group=?, photo_url=?
    WHERE id=?`;

  const values = [
    first_name,
    last_name,
    gender,
    date_of_birth,
    rank,
    branch,
    unit,
    enlistment_date,
    discharge_date,
    service_status,
    contact_number,
    email,
    address,
    emergency_contact_name,
    emergency_contact_number,
    medical_conditions,
    blood_group,
    photo_url,
    req.params.id,
  ].map((val) => (val === undefined ? null : val)); // 🔧 Sanitize here too

  db.execute(sql, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Delete a personnel record
router.delete("/records/:id", (req, res) => {
  const sql = "DELETE FROM personnel WHERE id=?";
  db.execute(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Insert into personnel table on successful sign up
router.post("/personnel", (req, res) => {
  const { name, email, rank, division, joining_date } = req.body;

  const query = `
    INSERT INTO personnel (name, email, rank, division, joining_date)
    VALUES (?, ?, ?, ?, ?)`;

  const values = [name, email, rank, division, joining_date].map((val) =>
    val === undefined ? null : val
  );

  db.execute(query, values, (err, results) => {
    if (err) {
      console.error("Error inserting personnel:", err);
      return res.status(500).send("Failed to save personnel data.");
    }
    res.send("Personnel details saved successfully.");
  });
});

module.exports = router;
