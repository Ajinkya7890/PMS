const express = require("express");
const router = express.Router();
const db = require("../db");

// Show all customers
router.get("/", (req, res) => {
  const query = "SELECT * FROM Customer";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching customers:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.render("customer/index", { customers: results });
  });
});

// Show form to add new customer
router.get("/new", (req, res) => {
  res.render("customer/new");
});

// Insert new customer
router.post("/new", (req, res) => {
  const { name, contact } = req.body;
  
  // Simple validation
  if (!name || !contact) {
    return res.status(400).send("Name and contact are required");
  }

  db.query(
    "INSERT INTO Customer (name, contact) VALUES (?, ?)",
    [name, contact],
    (err) => {
      if (err) {
        console.error("Error inserting customer:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.redirect("/customer");
    }
  );
});

// Show form to edit customer
router.get("/edit/:customer_id", (req, res) => {
  const { customer_id } = req.params;
  const query = "SELECT * FROM Customer WHERE customer_id = ?";
  
  db.query(query, [customer_id], (err, result) => {
    if (err) {
      console.error("Error fetching customer:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    if (!result.length) {
      return res.status(404).send("Customer not found");
    }
    res.render("customer/edit", { customer: result[0] });
  });
});

// Update customer
router.post("/edit/:customer_id", (req, res) => {
  const { customer_id } = req.params;
  const { name, contact } = req.body;
  
  // Simple validation
  if (!name || !contact) {
    return res.status(400).send("Name and contact are required");
  }

  db.query(
    "UPDATE Customer SET name = ?, contact = ? WHERE customer_id = ?",
    [name, contact, customer_id],
    (err) => {
      if (err) {
        console.error("Error updating customer:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.redirect("/customer");
    }
  );
});

// Delete customer
router.post("/delete/:customer_id", (req, res) => {
  const { customer_id } = req.params;
  db.query("DELETE FROM Customer WHERE customer_id = ?", [customer_id], (err) => {
    if (err) {
      console.error("Error deleting customer:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.redirect("/customer");
  });
});

// Show a specific customer by ID
router.get("/view/:customer_id", (req, res) => {
  const { customer_id } = req.params;
  const query = "SELECT * FROM Customer WHERE customer_id = ?";
  
  db.query(query, [customer_id], (err, result) => {
    if (err) {
      console.error("Error fetching customer:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    if (!result.length) {
      return res.status(404).send("Customer not found");
    }
    res.render("customer/view", { customer: result[0] });
  });
});

module.exports = router;
