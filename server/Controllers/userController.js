// controllers/userController.js
const db = require('../db/db');

// Add new user
function addUser(req, res) {
  const {
    username,
    phoneNo,
    email,
    state,
    serviceType,
    plan,
    gstin,
    tan,
    address,
    totalAmount,
    discount,
    piDate,
    invoiceDate,
    activation_date,
    deactivation_date,
    additionalResources
  } = req.body;




  const missingFields = [];
if (!username) missingFields.push("username");
if (!phoneNo) missingFields.push("phoneNo");
if (!email) missingFields.push("email");
if (!state) missingFields.push("state");
if (!serviceType) missingFields.push("serviceType");
if (!plan) missingFields.push("plan");
if (!totalAmount) missingFields.push("totalAmount");
if (!piDate) missingFields.push("piDate");
if (!invoiceDate) missingFields.push("invoiceDate");
if (!piDate) missingFields.push("activation_date");
if (!invoiceDate) missingFields.push("deactivation_date");

if (missingFields.length > 0) {
  return res.status(400).json({ message: `Missing fields: ${missingFields.join(", ")}` });
}


  // Validate required fields
  if (
    !username || !phoneNo || !email || !state || !serviceType || !plan ||
    !totalAmount || !piDate || !invoiceDate
  ) {
    return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  // Check if username already exists
  const checkQuery = 'SELECT * FROM users WHERE username = ?';
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
      (username, phone_no, email, state, service_type, plan, gstin_uin, tan_no, address, total_amount, discount, pi_date, invoice_date, activation_date, deactivation_date, additional_resources) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      username,
      phoneNo,
      email,
      state,
      serviceType,
      plan,
      gstin || '',
      tan || '',
      address || '',
      parseFloat(totalAmount) || 0,
      parseFloat(discount) || 0,
      piDate,
      invoiceDate,
      activation_date || null,
      deactivation_date || null,
      additionalResources || ''
    ];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error('Error inserting new user:', err);
        return res.status(500).json({ message: 'Failed to insert user.' });
      }

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
      username,
      phone_no         AS phoneNo,
      email,
      state,
      service_type     AS serviceType,
      plan,
      gstin_uin        AS gstin,
      tan_no           AS tan,
      address,
      total_amount     AS totalAmount,
      discount,
      pi_date          AS piDate,
      invoice_date     AS invoiceDate,
      activation_date  AS activation_date,
      deactivation_date AS deactivation_date,
      additional_resources AS additionalResources
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
