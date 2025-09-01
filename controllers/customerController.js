const db = require("../db/database");

// Create new customer
exports.createCustomer = (req, res) => {
  const { first_name, last_name, phone_number } = req.body;
  if (!first_name || !last_name || !phone_number) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const sql = `INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)`;
  db.run(sql, [first_name, last_name, phone_number], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res
      .status(201)
      .json({ id: this.lastID, first_name, last_name, phone_number });
  });
};

// Get all customers (with search, pagination)
exports.getAllCustomers = (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const sql = `
    SELECT * FROM customers
    WHERE first_name LIKE ? OR last_name LIKE ? OR phone_number LIKE ?
    LIMIT ? OFFSET ?`;
  db.all(
    sql,
    [`%${search}%`, `%${search}%`, `%${search}%`, limit, offset],
    (err, rows) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(rows);
    }
  );
};

// Get single customer by ID
exports.getCustomerById = (req, res) => {
  const sql = `SELECT * FROM customers WHERE id = ?`;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Customer not found" });
    res.json(row);
  });
};

// Update customer
exports.updateCustomer = (req, res) => {
  const { first_name, last_name, phone_number } = req.body;
  const sql = `UPDATE customers SET first_name = ?, last_name = ?, phone_number = ? WHERE id = ?`;
  db.run(
    sql,
    [first_name, last_name, phone_number, req.params.id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
};

// Delete customer
exports.deleteCustomer = (req, res) => {
  const sql = `DELETE FROM customers WHERE id = ?`;
  db.run(sql, [req.params.id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
};
