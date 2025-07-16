// inventory routes
const express = require("express");
const router = express.Router();
const db = require("../db");

// Show all inventory records
router.get("/", (req, res) => {
  const query = `
    SELECT Inventory.*, Drug.name AS drug_name 
    FROM Inventory 
    JOIN Drug ON Inventory.drug_id = Drug.drug_id
  `;
  db.query(query, (err, results) => {
    if (err) throw err;
    res.render("inventory/index", { inventory: results });
  });
});

// Show form to add new inventory
router.get("/new", (req, res) => {
  db.query("SELECT * FROM Drug", (err, drugs) => {
    if (err) throw err;
    res.render("inventory/new", { drugs });
  });
});

// Insert inventory
router.post("/new", (req, res) => {
  const { drug_id, quantity, expiry_date } = req.body;
  db.query(
    "INSERT INTO Inventory (drug_id, quantity, expiry_date) VALUES (?, ?, ?)",
    [drug_id, quantity, expiry_date],
    (err) => {
      if (err) throw err;
      res.redirect("/inventory");
    }
  );
});

// Show edit form
router.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const getInventory = "SELECT * FROM Inventory WHERE inventory_id = ?";
  const getDrugs = "SELECT * FROM Drug";
  db.query(getInventory, [id], (err, inventoryResult) => {
    if (err) throw err;
    db.query(getDrugs, (err, drugs) => {
      if (err) throw err;
      res.render("inventory/edit", { inventory: inventoryResult[0], drugs });
    });
  });
});

// Update inventory
router.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const { drug_id, quantity, expiry_date } = req.body;
  db.query(
    "UPDATE Inventory SET drug_id = ?, quantity = ?, expiry_date = ? WHERE inventory_id = ?",
    [drug_id, quantity, expiry_date, id],
    (err) => {
      if (err) throw err;
      res.redirect("/inventory");
    }
  );
});

// Delete inventory
router.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM Inventory WHERE inventory_id = ?", [id], (err) => {
    if (err) throw err;
    res.redirect("/inventory");
  });
});

module.exports = router;
