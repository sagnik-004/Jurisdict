import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import {Lawyer} from '../models/lawyer.model.js';

const router = express.Router();

router.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

router.post('/lawyer/signup', async (req, res) => {
    try {
        const { name, lawyerId, email, address, username, password } = req.body;
        
        const existingUser = await Lawyer.findOne({
            $or: [{ email }, { username }, { lawyerId }]
        });

        if (existingUser) {
            return res.status(400).json({ 
                message: 'Email, username or lawyer ID already exists',
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const lawyer = new Lawyer({
            name,
            lawyerId,
            email,
            address,
            username,
            password: hashedPassword
        });

        await lawyer.save();

        const token = jwt.sign(
            { 
                id: lawyer._id,
                email: lawyer.email,
                username: lawyer.username
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, { 
            httpOnly: true, 
            secure: true,
            sameSite: 'none',
            maxAge: 3600000,
            path: '/'
        });

        res.status(201).json({
            message: 'Signup successful',
            user: {
                id: lawyer._id,
                name: lawyer.name,
                username: lawyer.username,
                lawyerId: lawyer.lawyerId
            },
            success: true
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Internal Server Error',
            success: false
        });
    }
});

export default router;
