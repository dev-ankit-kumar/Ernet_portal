const db = require('../db/db');

// Add new user (handles both single user and bulk upload)
function addUser(req, res) {
  // Check if this is a bulk upload request
  if (req.body.users && Array.isArray(req.body.users)) {
    return handleBulkUpload(req, res);
  }

  // Handle single user submission
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
    // state,
    // serviceType,
    // plan,
    // additionalResources,
    // totalAmount,
    // discount,
    // piDate,
    // invoiceDate,
    
    tan_no
    
    
    // numVMs
  } = req.body;

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

    // Insert new user
    const insertQuery = `
      INSERT INTO users 
      (username, user_plan,email_hosting_amount,web_hosting_amount,activation_date, deactivation_date,plan_for_year,gstin, address, phone_no, email, tan_no)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `;

    const values = [
      username || null,
      user_plan || null, 
      parseFloat(email_hosting_amount) || 0,
      parseFloat(web_hosting_amount) || 0,
      activation_date || null,
      deactivation_date || null,
      plan_for_year || null,    // additionalResources || null,
      gstin || null,
      address || null,



      phone_no || null,
      email || null,
      // state || null,
      // serviceType || null,
      
      // piDate || null,
      // invoiceDate || null,
      tan_no || null,
      
      // parseInt(numVMs) || null
    ];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ message: 'Failed to insert user.' });
      }

      return res.status(201).json({ 
        message: 'User added successfully.', 
        id: result.insertId 
      });
    });
  });
}

// Handle bulk upload from Excel
function handleBulkUpload(req, res) {
  const { users } = req.body;
  
  if (!users || !Array.isArray(users) || users.length === 0) {
    return res.status(400).json({ message: 'No user data provided for bulk upload.' });
  }

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  // Process each user
  const processUser = (index) => {
    if (index >= users.length) {
      // All users processed
      return res.status(200).json({
        message: `Bulk upload completed. ${successCount} users added, ${errorCount} failed.`,
        successCount,
        errorCount,
        errors: errors.length > 0 ? errors : undefined
      });
    }

    const user = users[index];
    
    // Map Excel data to database fields
    const userData = {
      username: user.username,
      phone_no: user.phone_no,
      email: user.email,
      user_plan: user.user_plan,
      email_hosting_amount: parseFloat(user.email_hosting_amount) || 0,
      web_hosting_amount: parseFloat(user.web_hosting_amount) || 0,
      activation_date: user.activation_date,
      deactivation_date: user.deactivation_date,
      plan_for_year: parseInt(user.plan_for_year) || 1,
      gstin: user.gstin,
      address: user.address,
      tan_no: user.tan_no
    };

    // Skip if username is missing
    if (!userData.username) {
      errorCount++;
      errors.push(`Row ${index + 1}: Username is required`);
      return processUser(index + 1);
    }

    // Check if username already exists
    const checkQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(checkQuery, [userData.username], (checkErr, checkResults) => {
      if (checkErr) {
        console.error(`Error checking username for row ${index + 1}:`, checkErr);
        errorCount++;
        errors.push(`Row ${index + 1}: Database error checking username`);
        return processUser(index + 1);
      }

      if (checkResults.length > 0) {
        errorCount++;
        errors.push(`Row ${index + 1}: Username '${userData.username}' already exists`);
        return processUser(index + 1);
      }

      // Insert user
      const insertQuery = `
        INSERT INTO users 
        (username, phone_no, email, user_plan, email_hosting_amount, web_hosting_amount,
         activation_date, deactivation_date, plan_for_year, gstin, address, tan_no)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        userData.username,
        userData.phone_no || null,
        userData.email || null,
        userData.user_plan || null,
        userData.email_hosting_amount,
        userData.web_hosting_amount,
        userData.activation_date || null,
        userData.deactivation_date || null,
        userData.plan_for_year,
        userData.gstin || null,
        userData.address || null,
        userData.tan_no || null
      ];

      db.query(insertQuery, values, (err, result) => {
        if (err) {
          console.error(`Error inserting user for row ${index + 1}:`, err);
          errorCount++;
          errors.push(`Row ${index + 1}: Failed to insert user`);
        } else {
          successCount++;
        }
        
        // Process next user
        processUser(index + 1);
      });
    });
  };

  // Start processing from first user
  processUser(0);
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

// Get a single user/invoice by ID
function getInvoice(req, res) {
  const { id } = req.params;
  const query = `
    SELECT
      id,
      username,
      phone_no,
      email,
      user_plan,
      address,
      gstin,
      tan_no,
      activation_date,
      deactivation_date,
      email_hosting_amount,
      web_hosting_amount,
      plan_for_year,
      created_at
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

// Update user (optional - for editing functionality)
function updateUser(req, res) {
  const { id } = req.params;
  const {
    username,
    phoneNo,
    email,
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
    tan,
    activation_date,
    deactivation_date,
    numVMs
  } = req.body;

  const updateQuery = `
    UPDATE users SET
      username = ?, phone_no = ?, email = ?, state = ?, service_type = ?, 
      plan = ?, additional_resources = ?, total_amount = ?, discount = ?, 
      pi_date = ?, invoice_date = ?, address = ?, gstin = ?, tan_no = ?, 
      activation_date = ?, deactivation_date = ?, num_vms = ?
    WHERE id = ?
  `;

  const values = [
    username || null,
    phoneNo || null,
    email || null,
    state || null,
    serviceType || null,
    plan || null,
    additionalResources || null,
    parseFloat(totalAmount) || 0,
    parseFloat(discount) || 0,
    piDate || null,
    invoiceDate || null,
    address || null,
    gstin || null,
    tan || null,
    activation_date || null,
    deactivation_date || null,
    parseInt(numVMs) || null,
    id
  ];

  db.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ message: 'Failed to update user.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({ message: 'User updated successfully.' });
  });
}

// Delete user (optional)
function deleteUser(req, res) {
  const { id } = req.params;
  
  const deleteQuery = 'DELETE FROM users WHERE id = ?';
  
  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
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
  getAllUsers,
  getUserCount,
  getInvoice,
  updateUser,
  deleteUser,
};