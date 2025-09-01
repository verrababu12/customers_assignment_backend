const db = require("../db/database");

// Add address for a customer
exports.addAddress = (req, res) => {
  const { id } = req.params;
  const { address_details, city, state, pin_code } = req.body;
  if (!address_details || !city || !state || !pin_code) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const sql = `INSERT INTO addresses (customer_id, address_details, city, state, pin_code) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [id, address_details, city, state, pin_code], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({
      id: this.lastID,
      customer_id: id,
      address_details,
      city,
      state,
      pin_code,
    });
  });
};

// Get all addresses for a customer
exports.getAddressesByCustomer = (req, res) => {
  const sql = `SELECT * FROM addresses WHERE customer_id = ?`;
  db.all(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
};

// Update address
exports.updateAddress = (req, res) => {
  const { address_details, city, state, pin_code } = req.body;
  const sql = `UPDATE addresses SET address_details = ?, city = ?, state = ?, pin_code = ? WHERE id = ?`;
  db.run(
    sql,
    [address_details, city, state, pin_code, req.params.addressId],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
};

// Delete address
exports.deleteAddress = (req, res) => {
  const sql = `DELETE FROM addresses WHERE id = ?`;
  db.run(sql, [req.params.addressId], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
};
