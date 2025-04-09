const db = require('../db/db');

// ADD NEW USER
function addUser(req, res) {
  const {
    username,
    state,
    plan,
    additionalResources,
    totalAmount,
    discount,
    piDate,
    invoiceDate
  } = req.body;

  // Basic validation
  if (!username || !state || !plan || !totalAmount || !piDate || !invoiceDate) {
    return res.status(400).json({ message: 'All required fields must be filled.' });
  }

  // Check for duplicate username
  // const checkQuery = 'SELECT * FROM users WHERE USERNAME = ?';
  // db.query(checkQuery, [username], (checkErr, checkResults) => {
  //   if (checkErr) {
  //     console.error('Error checking username:', checkErr);
  //     return res.status(500).json({ message: 'Database error during validation.' });
  //   }

  //   if (checkResults.length > 0) {
  //     return res.status(409).json({ message: 'Username already exists.' });
  //   }

    // Insert new user
    const insertQuery = `
      INSERT INTO users 
      (USERNAME, STATE, PLAN, ADDITIONAL_RESOURCES, TOTAL_AMOUNT, DISCOUNT, PI_DATE, INVOICE_DATE)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      username,
      state,
      plan,
      additionalResources || '',
      parseFloat(totalAmount),
      parseFloat(discount) || 0,
      piDate,
      invoiceDate
    ];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ message: 'Failed to insert user into database.' });
      }

      res.status(201).json({ message: 'User added successfully', id: result.insertId });
    });
  // });
}

// GET ALL USERS
function getAllUsers(req, res) {
  const query = 'SELECT * FROM users ORDER BY id DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ message: 'Error retrieving users' });
    }

    res.status(200).json(results);
  });
}



function getUserCount(req, res) {
  const query = 'SELECT COUNT(*) AS total FROM users';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching user count:', err);
      return res.status(500).json({ message: 'Error fetching user count' });
    }

    const total = results[0].total;
    res.status(200).json({ total });
  });
}

// Export using classic syntax
module.exports = {
  addUser,
  getAllUsers,
  getUserCount, // 👈 include this
};

