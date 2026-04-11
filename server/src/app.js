const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Normalize URLs to handle double slashes (e.g., //api/tokens -> /api/tokens)
app.use((req, res, next) => {
  if (req.url.includes('//')) {
    req.url = req.url.replace(/\/\/+/g, '/');
  }
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patient.routes');
const doctorRoutes = require('./routes/doctor.routes');
const adminRoutes = require('./routes/admin.routes');

app.use('/api/auth', authRoutes);
app.use('/api/tokens', patientRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', doctorRoutes);


// Basic route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Backend service is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    data: null,
    // Include stack trace only in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app;
