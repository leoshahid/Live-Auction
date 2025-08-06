const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        console.log('Auth middleware - Headers:', req.headers);
        const authHeader = req.header('Authorization');
        console.log('Auth middleware - Authorization header:', authHeader);

        const token = authHeader?.replace('Bearer ', '');
        console.log('Auth middleware - Token extracted:', !!token);

        if (!token) {
            console.log('Auth middleware - No token found');
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        console.log('Auth middleware - Verifying token...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Auth middleware - Token decoded:', decoded);

        const user = await User.findById(decoded.userId).select('-password');
        console.log('Auth middleware - User found:', !!user);

        if (!user || !user.isActive) {
            console.log('Auth middleware - User not found or inactive');
            return res.status(401).json({ message: 'Token is not valid' });
        }

        console.log('Auth middleware - Authentication successful for user:', user.username);
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user || !user.isActive) {
            return res.status(401).json({ message: 'Token is not valid' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Admin auth middleware error:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const userAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user || !user.isActive) {
            return res.status(401).json({ message: 'Token is not valid' });
        }

        if (user.role !== 'user') {
            return res.status(403).json({ message: 'Access denied. Users only.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('User auth middleware error:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = { auth, adminAuth, userAuth }; 