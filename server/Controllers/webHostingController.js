const db = require('../db/db');
const xlsx = require('xlsx');
const fs = require('fs');

/////////////////////////////////////////////////////
// Utility: Parse Excel Dates
/////////////////////////////////////////////////////
function parseExcelDate(excelValue) {
  if (excelValue instanceof Date) return excelValue.toISOString().split('T')[0];
  if (typeof excelValue === 'number') {
    const date = new Date((excelValue - 25569) * 86400 * 1000);
    return date.toISOString().split('T')[0];
  }
  return excelValue || null;
}

function cleanFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) console.warn('Failed to delete file:', filePath);
  });
}

/////////////////////////////////////////////////////
// ✅ 1. Add Single Web Hosting User
/////////////////////////////////////////////////////
function addWebHostingUser(req, res) {
  const { user_name, hosting_type, tariff_plan, yearly_amount, activation_date, email, contact_person } = req.body;

  if (!user_name || !hosting_type || !tariff_plan || !yearly_amount || !activation_date) {
    return res.status(400).json({ message: 'Required fields are missing.' });
  }

  const query = `
    INSERT INTO web_hosting_users 
    (user_name, hosting_type, tariff_plan, yearly_amount, activation_date, email, contact_person)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [
    user_name,
    hosting_type,
    tariff_plan,
    parseFloat(yearly_amount),
    parseExcelDate(activation_date),
    email || '',
    contact_person || ''
  ], (err, result) => {
    if (err) {
      console.error('DB Error (Single User):', err);
      return res.status(500).json({ message: 'Database error while adding user.' });
    }
    res.status(201).json({ message: 'User added successfully.', id: result.insertId });
  });
}

/////////////////////////////////////////////////////
// ✅ 2. Bulk Upload Web Hosting Users from Excel
/////////////////////////////////////////////////////
function bulkUploadWebHosting(req, res) {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

  try {
    const workbook = xlsx.readFile(req.file.path, { cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    console.log(data);
    if (!data.length) {
      cleanFile(req.file.path);
      return res.status(400).json({ message: 'Excel file is empty.' });
    }

    const values = data.map(row => [
      row['user_name'] || '',
      row['hosting_type'] || '',
      row['tariff_plan'] || '',
      parseFloat(row['yearly_amount']) || 0,
      parseExcelDate(row['activation_date']),
      row['email'] || '',
      row['contact_person'] || ''
    ]).filter(entry => entry[0]);  // Skip rows without user_name
    
    if (!values.length) {
      cleanFile(req.file.path);
      return res.status(400).json({ message: 'No valid rows found in Excel.' });
    }

    const insertQuery = `
      INSERT INTO web_hosting_users 
      (user_name, hosting_type, tariff_plan, yearly_amount, activation_date, email, contact_person)
      VALUES ?
    `;

    db.query(insertQuery, [values], (err) => {
      cleanFile(req.file.path);
      if (err) {
        console.error('DB Error (Bulk Upload):', err);
        return res.status(500).json({ message: 'Database error during bulk upload.' });
      }
      res.status(200).json({ message: 'Bulk upload successful!', count: values.length });
    });

  } catch (err) {
    cleanFile(req.file.path);
    console.error('Processing Error:', err);
    res.status(500).json({ message: 'Failed to process Excel file.' });
  }
}


function getAllWebHostingUsers(req, res) {
    const query = 'SELECT * FROM web_hosting_users';
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({ message: 'Failed to fetch users.' });
      }
      res.status(200).json(results);
    });
  }
  
  module.exports = {
    addWebHostingUser,
    bulkUploadWebHosting,
    getAllWebHostingUsers   // ✅ Export it here
  };
  

