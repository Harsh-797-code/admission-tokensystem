import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import db from './db.js'; // Notice the .js extension!

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check & Database Test Route
app.get('/', async (req, res) => {
  try {
    // Run a lightweight test query to check DB connection
    const result = await db.query('SELECT NOW()');
    
    res.status(200).json({
      status: 'success',
      message: 'Admission Token API is online & connected to DB',
      db_time: result.rows[0].now
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed', 
      error: err.message 
    });
  }
});

// Start Server
const PORT = process.env.PORT || 7777;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});