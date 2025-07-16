// drug routes
const express = require("express");
const router = express.Router();
const db = require("../db");

// Show all drugs
router.get("/", (req, res) => {
  db.query("SELECT * FROM Drug", (err, results) => {
    if (err) throw err;
    res.render("drug/index", { drugs: results });
  });
});

// Show form to add new drug
router.get("/new", (req, res) => {
  res.render("drug/new");
});

// Insert new drug
router.post("/new", (req, res) => {
  const { name } = req.body;
  db.query("INSERT INTO Drug (name) VALUES (?)", [name], (err) => {
    if (err) throw err;
    res.redirect("/drug");
  });
});

// Show edit form
router.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM Drug WHERE drug_id = ?", [id], (err, results) => {
    if (err) throw err;
    res.render("drug/edit", { drug: results[0] });
  });
});

// Update drug
router.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  db.query("UPDATE Drug SET name = ? WHERE drug_id = ?", [name, id], (err) => {
    if (err) throw err;
    res.redirect("/drug");
  });
});

// Delete drug
router.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM Drug WHERE drug_id = ?", [id], (err) => {
    if (err) throw err;
    res.redirect("/drug");
  });
});

module.exports = router;
