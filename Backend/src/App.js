const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const db = require('./config/database');

const app  = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to SCST API 🚀',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/health', async (req, res) => {
    try {
        await db.query('SELECT 1');
        res.json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            database: 'disconnected',
            error: error.message
        });
    }
});

// API Routes
const authRoutes        = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const userRoutes        = require('./routes/userRoutes');
const officerRoutes     = require('./routes/officerRoutes');
const paymentRoutes     = require('./routes/paymentRoutes'); // ✅ নতুন

app.use('/api/auth',         authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users',        userRoutes);
app.use('/api/officers',     officerRoutes);
app.use('/api/payment',      paymentRoutes); // ✅ নতুন

// Error Handlers

// 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.path
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Something went wrong!',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start Server
app.listen(PORT, () => {
    console.log('=================================');
    console.log('🚀 SCST Backend Server Started');
    console.log('=================================');
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log('=================================');
});
