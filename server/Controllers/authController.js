const db = require('../db/db');

function loginUser(req, res) {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  const query = 'SELECT * FROM authorized_users WHERE phone = ?';
  db.query(query, [phone], (err, results) => {
    if (err) {
      console.error('Error checking user:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // For simplicity, return success message
    res.status(200).json({ message: 'Login successful', phone });
  });
}

module.exports = {
  loginUser,
};
