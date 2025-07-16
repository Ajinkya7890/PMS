const express = require("express");
const router = express.Router();
const db = require("../db");

// Show all transactions
router.get("/", (req, res) => {
  const query = `SELECT Transaction.*, \`Order\`.price AS order_price, \`Order\`.quantity AS order_quantity, \`Order\`.date AS order_date
                 FROM Transaction
                 JOIN \`Order\` ON Transaction.order_id = \`Order\`.order_id`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching transactions:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.render("transaction/index", { transactions: results });
  });
});

// Show form to add new transaction
router.get("/new", (req, res) => {
  res.render("transaction/new");
});

// Insert new transaction
router.post("/new", (req, res) => {
  const { order_id, total_amount, payment_method, date } = req.body;
  
  // Simple validation
  if (!order_id || !total_amount || !payment_method || !date) {
    return res.status(400).send("All fields are required");
  }

  db.query(
    "INSERT INTO Transaction (order_id, total_amount, payment_method, date) VALUES (?, ?, ?, ?)",
    [order_id, total_amount, payment_method, date],
    (err) => {
      if (err) {
        console.error("Error inserting transaction:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.redirect("/transaction");
    }
  );
});

// Show form to edit transaction
router.get("/edit/:transaction_id", (req, res) => {
  const { transaction_id } = req.params;
  const query = "SELECT * FROM Transaction WHERE transaction_id = ?";
  
  db.query(query, [transaction_id], (err, result) => {
    if (err) {
      console.error("Error fetching transaction:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    if (!result.length) {
      return res.status(404).send("Transaction not found");
    }
    res.render("transaction/edit", { transaction: result[0] });
  });
});

// Update transaction
router.post("/edit/:transaction_id", (req, res) => {
  const { transaction_id } = req.params;
  const { order_id, total_amount, payment_method, date } = req.body;
  
  // Simple validation
  if (!order_id || !total_amount || !payment_method || !date) {
    return res.status(400).send("All fields are required");
  }

  db.query(
    "UPDATE Transaction SET order_id = ?, total_amount = ?, payment_method = ?, date = ? WHERE transaction_id = ?",
    [order_id, total_amount, payment_method, date, transaction_id],
    (err) => {
      if (err) {
        console.error("Error updating transaction:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.redirect("/transaction");
    }
  );
});

// Delete transaction
router.post("/delete/:transaction_id", (req, res) => {
  const { transaction_id } = req.params;
  db.query("DELETE FROM Transaction WHERE transaction_id = ?", [transaction_id], (err) => {
    if (err) {
      console.error("Error deleting transaction:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.redirect("/transaction");
  });
});

module.exports = router;
