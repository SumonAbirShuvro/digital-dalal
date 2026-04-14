const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const axios = require('axios');

// REGISTER
const register = async (req, res) => {
    try {
        
        const { name, mobile, email, password, role, currentAddress } = req.body;

            if (!name || !mobile || !password) {
            return res.status(400).json({ error: 'সব ফিল্ড পূরণ করুন' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' });
        }

        const userRole = 'citizen';

        const [existingUsers] = await db.query(
            'SELECT * FROM users WHERE mobile = ?', [mobile]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'এই মোবাইল নম্বর দিয়ে ইতিমধ্যে রেজিস্ট্রেশন করা হয়েছে' });
        }

        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        const [result] = await db.query(
            `INSERT INTO users (name, mobile, email, password_hash, role, current_address) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, mobile, email || null, password_hash, userRole, currentAddress || null]
        );

        const userId = result.insertId;

        const token = jwt.sign(
            { userId: userId, mobile: mobile, role: userRole },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        await db.query(
            `INSERT INTO audit_logs (user_id, action, details) VALUES (?, 'user_register', ?)`,
            [userId, JSON.stringify({ mobile, role: userRole, timestamp: new Date() })]
        );

        res.status(201).json({
            success: true,
            message: 'রেজিস্ট্রেশন সফল হয়েছে',
            data: {
                userId: userId,
                name: name,
                mobile: mobile,
                email: email,
                role: userRole,
                token: token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' });
    }
};

// SEND OTP
const sendOTP = async (req, res) => {
    try {
        const { userId, contact } = req.body;

        if (!userId || !contact) {
            return res.status(400).json({ error: 'userId এবং contact দিন' });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const expiryTime = new Date(Date.now() + 10 * 60 * 1000);

        const [updateResult] = await db.query(
            `UPDATE users SET otp = ?, otp_expires = ? WHERE user_id = ?`,
            [otp, expiryTime, userId]
        );

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ error: 'User পাওয়া যায়নি' });
        }

        console.log(` OTP saved to DB: ${otp} for userId: ${userId}`);

        //BD BULK SMS 
        try {
            const apiToken = process.env.BDBULK_API_TOKEN;

            if (!apiToken) {
                console.error(' BDBULK_API_TOKEN is missing in .env!');
                throw new Error('SMS API token not configured');
            }

            let formattedContact = contact.toString().trim();
            if (formattedContact.startsWith('01')) {
                formattedContact = '88' + formattedContact;
            }

            const message = `Smart Citizen Portal OTP Code: ${otp}। এই কোড ১০ মিনিট পর্যন্ত বৈধ।`;
            const smsUrl = `https://bulksmsbd.net/api/smsapi?api_key=${apiToken}&type=text&number=${formattedContact}&senderid=8809648906678&message=${encodeURIComponent(message)}`;

            console.log(` Sending SMS to: ${formattedContact}`);
            const smsResponse = await axios.get(smsUrl, { timeout: 10000 });
            console.log(`📱 SMS Response:`, smsResponse.data);

        } catch (smsError) {
            console.error(' SMS send failed:', smsError.message);
        }
        //  END BD BULK SMS

        await db.query(
            `INSERT INTO audit_logs (user_id, action, details) VALUES (?, 'otp_sent', ?)`,
            [userId, JSON.stringify({ contact, timestamp: new Date() })]
        );

        res.json({
            success: true,
            message: 'OTP পাঠানো হয়েছে',
            otp: process.env.NODE_ENV === 'development' ? otp : undefined
        });

    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ error: 'OTP পাঠাতে ব্যর্থ হয়েছে' });
    }
};

// VERIFY OTP
const verifyOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        if (!userId || !otp) {
            return res.status(400).json({ error: 'userId এবং OTP দিন' });
        }

        const [users] = await db.query(
            `SELECT * FROM users 
             WHERE user_id = ? AND otp = ? AND otp_expires > NOW()`,
            [userId, otp]
        );

        if (users.length === 0) {
            return res.status(400).json({ error: 'OTP ভুল অথবা মেয়াদ শেষ হয়ে গেছে' });
        }

        await db.query(
            `UPDATE users 
             SET otp = NULL, otp_expires = NULL, is_verified = TRUE 
             WHERE user_id = ?`,
            [userId]
        );

        await db.query(
            `INSERT INTO audit_logs (user_id, action, details) VALUES (?, 'otp_verified', ?)`,
            [userId, JSON.stringify({ timestamp: new Date() })]
        );

        res.json({
            success: true,
            message: 'OTP যাচাই সফল হয়েছে'
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ error: 'OTP যাচাই করতে ব্যর্থ হয়েছে' });
    }
};

// LOGIN

const login = async (req, res) => {
    try {
        const { mobile, password } = req.body;

        if (!mobile || !password) {
            return res.status(400).json({ error: 'মোবাইল নম্বর এবং পাসওয়ার্ড দিন' });
        }

        const [users] = await db.query(
            'SELECT * FROM users WHERE mobile = ?', [mobile]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'মোবাইল নম্বর অথবা পাসওয়ার্ড ভুল' });
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'মোবাইল নম্বর অথবা পাসওয়ার্ড ভুল' });
        }

        const token = jwt.sign(
            { userId: user.user_id, mobile: user.mobile, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        await db.query(
            `INSERT INTO audit_logs (user_id, action, details) VALUES (?, 'user_login', ?)`,
            [user.user_id, JSON.stringify({ mobile, timestamp: new Date() })]
        );

        res.json({
            success: true,
            message: 'লগইন সফল হয়েছে',
            data: {
                userId: user.user_id,
                name: user.name,
                mobile: user.mobile,
                email: user.email,
                role: user.role,                      // role returned — use this for dashboard redirect
                isVerified: user.is_verified,
                token: token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'লগইন ব্যর্থ হয়েছে' });
    }
};

// GET CURRENT USER
const getMe = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [users] = await db.query(
            'SELECT user_id, name, mobile, email, role, is_verified, created_at FROM users WHERE user_id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'ইউজার পাওয়া যায়নি' });
        }

        res.json({ success: true, data: users[0] });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'ইউজার তথ্য আনতে ব্যর্থ হয়েছে' });
    }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, email } = req.body;

        await db.query(
            'UPDATE users SET name = ?, email = ? WHERE user_id = ?',
            [name, email, userId]
        );

        await db.query(
            `INSERT INTO audit_logs (user_id, action, details) VALUES (?, 'profile_update', ?)`,
            [userId, JSON.stringify({ name, email, timestamp: new Date() })]
        );

        res.json({ success: true, message: 'প্রোফাইল আপডেট সফল হয়েছে' });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'প্রোফাইল আপডেট ব্যর্থ হয়েছে' });
    }
};

// LOGOUT
const logout = async (req, res) => {
    try {
        const userId = req.user.userId;

        await db.query(
            `INSERT INTO audit_logs (user_id, action, details) VALUES (?, 'user_logout', ?)`,
            [userId, JSON.stringify({ timestamp: new Date() })]
        );

        res.json({ success: true, message: 'লগআউট সফল হয়েছে' });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'লগআউট ব্যর্থ হয়েছে' });
    }
};

module.exports = { register, sendOTP, verifyOTP, login, getMe, updateProfile, logout };
