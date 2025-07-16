// supplier routes
const express = require("express");
const router = express.Router();
const db = require("../db");

// Display all suppliers
router.get("/", (req, res) => {
  db.query("SELECT * FROM Supplier", (err, results) => {
    if (err) throw err;
    res.render("supplier/index", { suppliers: results });
  });
});

// Show form to add a new supplier
router.get("/new", (req, res) => {
  res.render("supplier/new");
});

// Insert new supplier
router.post("/new", (req, res) => {
  const { name, address } = req.body;
  db.query("INSERT INTO Supplier (name, address) VALUES (?, ?)", [name, address], (err) => {
    if (err) throw err;
    res.redirect("/supplier");
  });
});

// Show edit form
router.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM Supplier WHERE supplier_id = ?", [id], (err, results) => {
    if (err) throw err;
    res.render("supplier/edit", { supplier: results[0] });
  });
});

// Update supplier
router.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const { name, address } = req.body;
  db.query("UPDATE Supplier SET name = ?, address = ? WHERE supplier_id = ?", [name, address, id], (err) => {
    if (err) throw err;
    res.redirect("/supplier");
  });
});

// Delete supplier
router.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM Supplier WHERE supplier_id = ?", [id], (err) => {
    if (err) throw err;
    res.redirect("/supplier");
  });
});

module.exports = router;
