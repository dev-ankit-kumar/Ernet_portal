const db = require('../db/db');

// ✅ Add VM to database
function addVm(req, res) {
  const {
    hostname,
    core,
    ram,
    storage,
    tariffPlan,
    os,
    privateIp,
    publicIp,
    password,
    websiteName,
    contactNo,
  } = req.body;

  if (!hostname || !core || !ram || !storage || !os) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const query = `
    INSERT INTO vm_details (
      hostname, core, ram, storage, tariff_plan, os, private_ip, public_ip, password, website_name, contact_no
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    hostname,
    core,
    ram,
    storage,
    tariffPlan,
    os,
    privateIp,
    publicIp, 
    password,
    websiteName,
    contactNo,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Error inserting VM:', err);
      return res.status(500).json({ message: 'Failed to insert VM details' });
    }

    return res.status(201).json({ message: 'VM details added successfully', id: result.insertId });
  });
}

// ✅ Get all VM entries from database
function getAllVms(req, res) {
  const query = 'SELECT * FROM vm_details ORDER BY created_at DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error fetching VMs:', err);
      return res.status(500).json({ message: 'Failed to fetch VM details' });
    }

    return res.status(200).json({ vms: results });
  });
}

function getVmCount(req, res) {
    const query = 'SELECT COUNT(*) AS total FROM vm_details';
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching VM count:', err);
        return res.status(500).json({ message: 'Failed to fetch VM count' });
      }
  
      res.status(200).json({ total: results[0].total });
    });
  }

  function bulkAddVms(req, res) {
    const vms = req.body.vms;
  
    if (!Array.isArray(vms) || vms.length === 0) {
      return res.status(400).json({ message: 'No VM data provided' });
    }
  
    const query = `
      INSERT INTO vm_details (
        hostname, core, ram, storage, tariff_plan, os,
        private_ip, public_ip, password, website_name, contact_no
      ) VALUES ?
    `;
  
    const values = vms.map(vm => [
      vm.hostname,
      vm.core,
      vm.ram,
      vm.storage,
      vm.tariffPlan,
      vm.os,
      vm.privateIp,
      vm.publicIp,
      vm.password,
      vm.websiteName,
      vm.contactNo
    ]);
  
    db.query(query, [values], (err, result) => {
      if (err) {
        console.error('Bulk insert error:', err);
        return res.status(500).json({ message: 'Failed to insert VMs' });
      }
  
      res.status(201).json({ message: 'Bulk insert successful', inserted: result.affectedRows });
    });
  }
  

  module.exports = {
    addVm,
    getAllVms,
    getVmCount,
    bulkAddVms
  };
  
