import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route (To test if server is alive)
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Admission Token API is online',
    timestamp: new Date()
  });
});

// Start Server
const PORT = process.env.PORT || 7777;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});