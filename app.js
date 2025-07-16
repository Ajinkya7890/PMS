const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db");

// Route imports
const customerRoutes = require("./routes/customer");
const supplierRoutes = require("./routes/supplier");
const drugRoutes = require("./routes/drug");
const inventoryRoutes = require("./routes/inventory");
const supplyRoutes = require("./routes/supply");
const prescribeRoutes = require("./routes/prescribe");
const orderRoutes = require("./routes/order");
const transactionRoutes = require("./routes/transaction");

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files and body parser
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// Use routes
app.use("/customer", customerRoutes);
app.use("/supplier", supplierRoutes);
app.use("/drug", drugRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/supply", supplyRoutes);
app.use("/prescribe", prescribeRoutes);
app.use("/order", orderRoutes);
app.use("/transaction", transactionRoutes);




// Start server
app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
