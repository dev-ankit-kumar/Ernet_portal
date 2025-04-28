// controllers/userController.js
const db = require('../db/db');

// Add new user
function addUser(req, res) {
  const {
    username,
    state,
    serviceType,
    plan,
    additionalResources,
    totalAmount,
    discount,
    piDate,
    invoiceDate,
    address,
    gstin,
    numVMs
  } = req.body;

  // Validate required fields
  if (
    !username || !state || !serviceType || !plan || !totalAmount ||
    !piDate || !invoiceDate
  ) {
    return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  // Check if username already exists
  const checkQuery = 'SELECT * FROM users WHERE USERNAME = ?';
  db.query(checkQuery, [username], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Error checking existing username:', checkErr);
      return res.status(500).json({ message: 'Database error during username check.' });
    }

    if (checkResults.length > 0) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    // Insert the new user
    const insertQuery = `
      INSERT INTO users 
      (USERNAME, STATE, SERVICE_TYPE, PLAN, ADDITIONAL_RESOURCES, TOTAL_AMOUNT, DISCOUNT, PI_DATE, INVOICE_DATE, ADDRESS, GSTIN_UIN, NUM_VMS)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      username,
      state,
      serviceType,
      plan,
      additionalResources || '',
      parseFloat(totalAmount),
      parseFloat(discount) || 0,
      piDate,
      invoiceDate,
      address || '',
      gstin || '',
      parseInt(numVMs, 10) || 0
    ];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error('Error inserting new user:', err);
        return res.status(500).json({ message: 'Failed to insert user.' });
      }

      // return the new record ID for redirecting to /invoice/:id
      return res.status(201).json({ message: 'User added successfully.', id: result.insertId });
    });
  });
}

// Get all users
function getAllUsers(req, res) {
  const query = 'SELECT * FROM users ORDER BY id DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ message: 'Error fetching users.' });
    }

    return res.status(200).json(results);
  });
}

// Get total user count
function getUserCount(req, res) {
  const query = 'SELECT COUNT(*) AS total FROM users';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching user count:', err);
      return res.status(500).json({ message: 'Error fetching user count.' });
    }

    return res.status(200).json({ total: results[0].total });
  });
}

// Get a single invoice/user by ID
function getInvoice(req, res) {
  const { id } = req.params;
  const query = `
    SELECT
      id,
      USERNAME       AS username,
      STATE          AS state,
      SERVICE_TYPE   AS serviceType,
      PLAN           AS plan,
      ADDITIONAL_RESOURCES AS additionalResources,
      TOTAL_AMOUNT   AS totalAmount,
      DISCOUNT       AS discount,
      PI_DATE        AS piDate,
      INVOICE_DATE   AS invoiceDate,
      ADDRESS        AS address,
      GSTIN_UIN      AS gstin,
      NUM_VMS        AS numVMs
    FROM users
    WHERE id = ?
  `;

  db.query(query, [id], (err, rows) => {
    if (err) {
      console.error('Error fetching invoice:', err);
      return res.status(500).json({ message: 'Database error fetching invoice.' });
    }
    if (!rows.length) {
      return res.status(404).json({ message: 'Invoice not found.' });
    }
    return res.status(200).json(rows[0]);
  });
}

module.exports = {
  addUser,
  getAllUsers,
  getUserCount,
  getInvoice,
};
