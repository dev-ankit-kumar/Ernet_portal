const db = require('../db/db');

// Add a single user
function addUser(req, res) {
  const {
    username,
    user_plan,
    email_hosting_amount,
    web_hosting_amount,
    activation_date,
    deactivation_date,
    plan_for_year,
    gstin,
    address,
    phone_no,
    email,
    tan_no
  } = req.body;

  if (!username || !user_plan) {
    return res.status(400).json({ message: 'Username and user plan are required.' });
  }

  const checkQuery = 'SELECT * FROM users WHERE username = ?';
  db.query(checkQuery, [username], (checkErr, checkResult) => {
    if (checkErr) {
      console.error('Error checking username:', checkErr);
      return res.status(500).json({ message: 'Error checking existing user.' });
    }

    if (checkResult.length > 0) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    const insertQuery = `
      INSERT INTO users 
      (username, user_plan, email_hosting_amount, web_hosting_amount, activation_date, deactivation_date, 
       plan_for_year, gstin, address, phone_no, email, tan_no)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      username,
      user_plan,
      parseFloat(email_hosting_amount) || 0.0,
      parseFloat(web_hosting_amount) || 0.0,
      activation_date || null,
      deactivation_date || null,
      parseInt(plan_for_year) || 0,
      gstin || '',
      address || '',
      phone_no || '',
      email || '',
      tan_no || ''
    ];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error('Insert error:', err);
        return res.status(500).json({ message: 'Failed to insert user.' });
      }

      return res.status(201).json({ message: 'User added successfully.', id: result.insertId });
    });
  });
}

// Bulk upload users
function bulkAddUsers(req, res) {
  const users = req.body.users;

  if (!Array.isArray(users) || users.length === 0) {
    return res.status(400).json({ message: 'No users to insert.' });
  }

  const validUsers = users.filter(u => u.username);

  if (validUsers.length === 0) {
    return res.status(400).json({ message: 'No valid users with usernames.' });
  }

  const insertQuery = `
    INSERT INTO users 
    (username, user_plan, email_hosting_amount, web_hosting_amount, activation_date, deactivation_date, plan_for_year, gstin, address, phone_no, email, tan_no)
    VALUES ?
  `;

  const values = validUsers.map(user => [
    user.username || null,
    user.user_plan || null,
    parseFloat(user.email_hosting_amount) || 0,
    parseFloat(user.web_hosting_amount) || 0,
    user.activation_date || '',
    user.deactivation_date || '01-01-0001',
    parseInt(user.plan_for_year) || 0,
    user.gstin || 'N.A.',
    user.address || 'N.A.',
    user.phone_no || 'N.A.',
    user.email || 'N.A.',
    user.tan_no || 'N.A.',
  ]);

  db.query(insertQuery, [values], (err, result) => {
    if (err) {
      console.error('Bulk insert error:', err);
      return res.status(500).json({ message: 'Failed to insert users.' });
    }
    return res.status(201).json({ message: `Inserted ${result.affectedRows} users successfully.` });
  });
}

// Get all users
function getAllUsers(req, res) {
  const query = 'SELECT * FROM users ORDER BY id DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Fetch users error:', err);
      return res.status(500).json({ message: 'Failed to fetch users.' });
    }

    return res.status(200).json(results);
  });
}

// Get user count
function getUserCount(req, res) {
  const query = 'SELECT COUNT(*) AS total FROM users';

  db.query(query, (err, result) => {
    if (err) {
      console.error('Fetch count error:', err);
      return res.status(500).json({ message: 'Failed to get user count.' });
    }

    return res.status(200).json({ total: result[0].total });
  });
}

// Get single user by ID
function getUserById(req, res) {
  const { id } = req.params;

  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Fetch user error:', err);
      return res.status(500).json({ message: 'Error retrieving user.' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json(result[0]);
  });
}

// ✅ Update user by ID
function updateUser(req, res) {
  const { id } = req.params;
  const updatedFields = req.body;

  const query = `
    UPDATE users SET ? WHERE id = ?
  `;

  db.query(query, [updatedFields, id], (err, result) => {
    if (err) {
      console.error('Update error:', err);
      return res.status(500).json({ message: 'Failed to update user.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({ message: 'User updated successfully.' });
  });
}

// ✅ Delete user by ID
function deleteUser(req, res) {
  const { id } = req.params;

  const query = 'DELETE FROM users WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Delete error:', err);
      return res.status(500).json({ message: 'Failed to delete user.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({ message: 'User deleted successfully.' });
  });
}

module.exports = {
  addUser,
  bulkAddUsers,
  getAllUsers,
  getUserCount,
  getUserById,
  updateUser,   // ✅ export added
  deleteUser    // ✅ export added
};
