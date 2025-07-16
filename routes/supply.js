const express = require("express");
const router = express.Router();
const db = require("../db");

// Show all supply records
router.get("/", (req, res) => {
  const query = `
    SELECT Supply.*, Supplier.name AS supplier_name, Drug.name AS drug_name 
    FROM Supply 
    JOIN Supplier ON Supply.supplier_id = Supplier.supplier_id
    JOIN Drug ON Supply.drug_id = Drug.drug_id
  `;
  db.query(query, (err, results) => {
    if (err) throw err;
    res.render("supply/index", { supply: results });
  });
});

// Show form to add new supply
router.get("/new", (req, res) => {
  const getSuppliers = "SELECT * FROM Supplier";
  const getDrugs = "SELECT * FROM Drug";
  db.query(getSuppliers, (err, suppliers) => {
    if (err) throw err;
    db.query(getDrugs, (err, drugs) => {
      if (err) throw err;
      res.render("supply/new", { suppliers, drugs });
    });
  });
});

// Insert new supply
router.post("/new", (req, res) => {
  const { supplier_id, drug_id } = req.body;
  db.query(
    "INSERT INTO Supply (supplier_id, drug_id) VALUES (?, ?)",
    [supplier_id, drug_id],
    (err) => {
      if (err) throw err;
      res.redirect("/supply");
    }
  );
});

// Delete supply
router.post("/delete/:supplier_id/:drug_id", (req, res) => {
  const { supplier_id, drug_id } = req.params;
  db.query("DELETE FROM Supply WHERE supplier_id = ? AND drug_id = ?", [supplier_id, drug_id], (err) => {
    if (err) throw err;
    res.redirect("/supply");
  });
});

module.exports = router;
