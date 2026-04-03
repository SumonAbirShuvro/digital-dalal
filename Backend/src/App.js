const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// Middleware
// ==========================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// ==========================================
// Routes
// ==========================================

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

// ==========================================
// API Routes
// ==========================================

const authRoutes = require('c:/Users/USER/Desktop/SCST/Backend/src/routes/authRoutes');
app.use('/api/auth', authRoutes);

// ==========================================
// Error Handlers
// ==========================================

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

// ==========================================
// Start Server
// ==========================================

app.listen(PORT, () => {
    console.log('=================================');
    console.log('🚀 SCST Backend Server Started');
    console.log('=================================');
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log('=================================');
});

// payment-gateway
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payment', paymentRoutes);
