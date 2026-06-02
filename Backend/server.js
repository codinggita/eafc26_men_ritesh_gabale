const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Route files
const lawRoutes = require('./routes/lawRoutes');
const authRoutes = require('./routes/authRoutes');
const searchRoutes = require('./routes/searchRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const statsRoutes = require('./routes/statsRoutes');
const jwtRoutes = require('./routes/jwtRoutes');
const middlewareRoutes = require('./routes/middlewareRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middlewares/error');

const app = express();

app.use((req, res, next) => {
  req.startedAt = Date.now();
  next();
});

// Standard middleware
app.use(express.json());

// Sanitize data (Prevent NoSQL injection)
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

app.use(cors());

// Enable pre-flight requests for all routes
app.options('*', cors());

// Mount routers
app.use('/api/v1/laws', lawRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/analytics/laws', analyticsRoutes);
app.use('/api/v1/stats/laws', statsRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jwt', jwtRoutes);
app.use('/api/v1/middleware', middlewareRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use(errorHandler);

// Basic health-check route to verify server status
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Indian Penal Code API Server is running successfully!'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
