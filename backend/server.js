const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// 1. Import ALL Routes First
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const diseaseRoutes = require('./routes/diseaseRoutes');
const farmRoutes = require('./routes/farmRoutes');
const chatRoutes = require('./routes/chatRoutes');
const adminRoutes = require('./routes/adminRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// 2. Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));

// 3. Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/records', farmRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/feedback', feedbackRoutes);// <-- Now this works perfectly

// Test Route
app.get('/', (req, res) => {
  res.send('KrishiBondhu AI Backend is running successfully!');
});

// Central Error Handler
app.use(errorHandler);

// Define Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});