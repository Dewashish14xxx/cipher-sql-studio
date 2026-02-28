const jwt = require('jsonwebtoken');
const User = require('../models/User');

const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        req.userId = null;
        return next();
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
    } catch (_) {
        req.userId = null;
    }
    next();
};

const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Authentication required.' });
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (_) {
        return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
    }
};

module.exports = { optionalAuth, requireAuth };
