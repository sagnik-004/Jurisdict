import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Refresh Token Route - Common for all user types
router.get('/refresh', (req, res) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Issue a new token
        const newToken = jwt.sign(
            { 
                id: decoded.id,
                email: decoded.email,
                username: decoded.username,
                type: decoded.type
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // Set the new token in the response cookies
        res.cookie('token', newToken, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
        });

        res.status(200).json({ user: decoded });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid token' });
        } else {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
});

export default router;