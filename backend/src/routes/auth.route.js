import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Refresh Token Route - Common for all user types
router.get('/refresh', (req, res) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        // Verify the token
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

        // Send the new token in the response (frontend will store it in local storage)
        res.status(200).json({ 
            user: decoded,
            token: newToken // Send the new token to the frontend
        });
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
