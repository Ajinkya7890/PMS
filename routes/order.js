const express = require("express");
const router = express.Router();
const db = require("../db");

// Show all orders
router.get("/", (req, res) => {
  const query = `SELECT \`Order\`.*, Drug.name AS drug_name
                 FROM \`Order\`
                 JOIN Drug ON \`Order\`.drug_id = Drug.drug_id`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err.message);  // More detailed logging
      res.status(500).send("Internal Server Error");
      return;
    }
    res.render("order/index", { orders: results });
  });
});

// GET: Show form to add a new order
router.get("/new", (req, res) => {
  const drugQuery = `SELECT drug_id, name FROM Drug`;

  db.query(drugQuery, (err, drugs) => {
    if (err) {
      console.error("Error fetching drugs:", err.message);  // More detailed logging
      res.status(500).send("Internal Server Error");
      return;
    }

    res.render("order/new", { drugs });
  });
});

// POST: Add new order
router.post("/new", (req, res) => {
  const { quantity, drug_id } = req.body;

  const insertQuery = `INSERT INTO \`Order\` (quantity, drug_id) VALUES (?, ?)`;

  db.query(insertQuery, [quantity, drug_id], (err, result) => {
    if (err) {
      console.error("Error inserting new order:", err.message);  // More detailed logging
      res.status(500).send("Internal Server Error");
      return;
    }

    res.redirect("/order");
  });
});

// GET: Show edit form
router.get("/edit/:id", (req, res) => {
  const orderId = req.params.id;
  const query = `SELECT * FROM \`Order\` WHERE order_id = ?`;

  db.query(query, [orderId], (err, results) => {
    if (err) {
      console.error("Error fetching order for edit:", err.message);  // More detailed logging
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length === 0) {
      console.log("Order not found:", orderId);  // Log if order not found
      res.status(404).send("Order not found");
      return;
    }

    res.render("order/edit", { order: results[0] });
  });
});

// POST: Update order
router.post("/edit/:id", (req, res) => {
  const orderId = req.params.id;
  const { quantity, drug_id } = req.body;

  const updateQuery = `UPDATE \`Order\` SET quantity = ?, drug_id = ? WHERE order_id = ?`;

  db.query(updateQuery, [quantity, drug_id, orderId], (err, result) => {
    if (err) {
      console.error("Error updating order:", err.message);  // More detailed logging
      res.status(500).send("Internal Server Error");
      return;
    }

    res.redirect("/order");
  });
});

// POST: Delete order
router.post("/delete/:id", (req, res) => {
  const orderId = req.params.id;

  console.log(`Attempting to delete order with ID: ${orderId}`);  // Log the order ID being deleted

  // First, check if the order exists
  const checkQuery = `SELECT * FROM \`Order\` WHERE order_id = ?`;

  db.query(checkQuery, [orderId], (err, results) => {
    if (err) {
      console.error("Error checking if order exists:", err.message);  // More detailed logging
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length === 0) {
      console.log("Order not found:", orderId);  // Log if order not found
      res.status(404).send("Order not found");
      return;
    }

    // If the order exists, proceed with deletion
    const deleteQuery = `DELETE FROM \`Order\` WHERE order_id = ?`;

    db.query(deleteQuery, [orderId], (err, result) => {
      if (err) {
        console.error("Error deleting order:", err.message);  // More detailed logging
        res.status(500).send("Internal Server Error");
        return;
      }

      // Check if any rows were affected (deleted)
      if (result.affectedRows === 0) {
        console.log("No rows affected, order might have already been deleted.");  // Log if no rows affected
        res.status(404).send("Order not found");
        return;
      }

      console.log(`Order with ID ${orderId} successfully deleted.`);  // Log successful deletion
      res.redirect("/order");
    });
  });
});

module.exports = router;
