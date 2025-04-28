const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// DB Connection
const db = require('./db/db');

// Route Handlers
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const vmRoutes = require('./routes/vmRoutes');
const webHostingRoutes = require('./routes/webHostingRoutes');   // ✅ Add this line

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(bodyParser.json());

// ===== API Routes =====
app.use('/api', userRoutes);        // User CRUD
app.use('/api', authRoutes);        // Auth (send-otp, verify-otp)
app.use('/api', vmRoutes);          // VM CRUD
app.use('/api', webHostingRoutes);  // ✅ Web Hosting User Routes

// ===== Default Route =====
app.get('/', (req, res) => {
  res.send('🛰️ ERNET API is running...');
});

app.use((req, res) => {
  res.status(404).json({ message: 'API Route not found.' });
});


// ===== Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
