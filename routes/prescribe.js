// prescribe routes
const express = require("express");
const router = express.Router();
const db = require("../db");

// Show all prescriptions
router.get("/", (req, res) => {
  const query = `
    SELECT Prescribe.*, Customer.name AS customer_name, Drug.name AS drug_name 
    FROM Prescribe 
    JOIN Customer ON Prescribe.customer_id = Customer.customer_id
    JOIN Drug ON Prescribe.drug_id = Drug.drug_id
  `;
  db.query(query, (err, results) => {
    if (err) throw err;
    res.render("prescribe/index", { prescriptions: results });
  });
});

// Show form to add new prescription
router.get("/new", (req, res) => {
  const getCustomers = "SELECT * FROM Customer";
  const getDrugs = "SELECT * FROM Drug";
  db.query(getCustomers, (err, customers) => {
    if (err) throw err;
    db.query(getDrugs, (err, drugs) => {
      if (err) throw err;
      res.render("prescribe/new", { customers, drugs });
    });
  });
});

// Insert new prescription
router.post("/new", (req, res) => {
  const { customer_id, drug_id } = req.body;
  db.query(
    "INSERT INTO Prescribe (customer_id, drug_id) VALUES (?, ?)",
    [customer_id, drug_id],
    (err) => {
      if (err) throw err;
      res.redirect("/prescribe");
    }
  );
});

// Delete prescription
router.post("/delete/:customer_id/:drug_id", (req, res) => {
  const { customer_id, drug_id } = req.params;
  db.query("DELETE FROM Prescribe WHERE customer_id = ? AND drug_id = ?", [customer_id, drug_id], (err) => {
    if (err) throw err;
    res.redirect("/prescribe");
  });
});

module.exports = router;
