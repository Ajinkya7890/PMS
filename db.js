const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root", // change this to your MySQL username
  password: "NORDOP777@m", // change this to your MySQL password
  database: "pharmacydb2" // make sure the database name matches
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

module.exports = db;
