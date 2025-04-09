const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./db/db');
const authRoutes = require('./routes/authRoutes');





const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API routes
app.use('/api', userRoutes);

//authenticate users
app.use('/api', authRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('ERNET API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
