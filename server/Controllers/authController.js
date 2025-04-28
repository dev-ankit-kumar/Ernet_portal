const db = require('../db/db');

// ✅ Send OTP
function sendOtp(req, res) {
    const { phone } = req.body;
  
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
  
    // Check if phone exists in authorized_users table
    const checkQuery = 'SELECT * FROM authorized_users WHERE phone = ?';
    db.query(checkQuery, [phone], (err, results) => {
      if (err) {
        console.error('Database error while checking user:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      if (results.length === 0) {
        return res.status(401).json({ message: 'Unauthorized: User not found' });
      }
  
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
      // ✅ Insert or update OTP with expiry_time
      const insertOrUpdateOtp = `
        INSERT INTO otp_codes (username, otp, created_at, expiry_time)
        VALUES (?, ?, NOW(), NOW() + INTERVAL 30 SECOND)
        ON DUPLICATE KEY UPDATE 
          otp = VALUES(otp), 
          created_at = NOW(), 
          expiry_time = NOW() + INTERVAL 30 SECOND
      `;
  
      db.query(insertOrUpdateOtp, [phone, otp], (err2) => {
        if (err2) {
          console.error('❌ Error storing OTP:', err2);
          return res.status(500).json({ message: 'Failed to store OTP' });
        }
  
        console.log(`✅ OTP for ${phone}: ${otp}`);
        return res.status(200).json({ message: 'OTP sent successfully' });
      });
    });
  }
  

// ✅ Verify OTP
function verifyOtp(req, res) {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: 'Phone and OTP are required' });
  }

  const verifyQuery = `
  SELECT * FROM otp_codes
  WHERE username = ? AND otp = ? AND expiry_time >= NOW()
  ORDER BY created_at DESC
  LIMIT 1
`;


  db.query(verifyQuery, [phone, otp], (err, results) => {
    if (err) {
      console.error('Error verifying OTP:', err);
      return res.status(500).json({ message: 'Internal server error during OTP verification' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    return res.status(200).json({ message: 'Login successful' });
  });
}

module.exports = {
  sendOtp,
  verifyOtp,
};
