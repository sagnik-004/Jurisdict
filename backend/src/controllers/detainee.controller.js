import { Detainee } from "../models/detainee.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { Case } from "../models/case.model.js";
import jwt from 'jsonwebtoken';

// Middleware to validate token from Authorization header
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

    if (!token) {
        return res.status(401).json({ 
            message: 'Access denied. No token provided.',
            success: false
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded user data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token expired.',
                success: false
            });
        }
        return res.status(403).json({ 
            message: 'Invalid token.',
            success: false
        });
    }
};

// Detainee Signup
export const detaineeSignup = async (req, res) => {
    try {
        const existingUser = await Detainee.findOne({
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        });

        if (existingUser) {
            const field = existingUser.email === req.body.email ? 'Email' :
                         existingUser.username === req.body.username ? 'Username' : 'Other';
            return res.status(400).json({ 
                message: `${field} already registered!`,
                success: false
            });
        }

        const requiredFields = ['name', 'address', 'email', 'username', 'password'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`,
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        const detainee = new Detainee({
            name: req.body.name,
            address: req.body.address,
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword,
        });

        await detainee.save();

        const token = generateToken(detainee._id, detainee.email, detainee.username);

        res.status(201).json({
            message: "Detainee account created successfully!",
            user: {
                id: detainee._id,
                name: detainee.name,
                username: detainee.username
            },
            token: token, // Send token in the response
            success: true
        });
    } catch (error) {
        console.error("Detainee Signup Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

// Detainee Login
export const detaineeLogin = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        if (!emailOrUsername || !password) {
            return res.status(400).json({ 
                message: 'Missing required fields.',
                success: false
            });
        }

        const query = emailOrUsername.includes('@') 
            ? { email: emailOrUsername } 
            : { username: emailOrUsername };
            
        const detainee = await Detainee.findOne(query).select('+password');

        if (!detainee) {
            return res.status(404).json({ 
                message: "Detainee not found.",
                success: false
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, detainee.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ 
                message: "Incorrect password.",
                success: false
            });
        }

        const token = generateToken(detainee._id, detainee.email, detainee.username);

        res.status(200).json({ 
            message: 'Login successful!', 
            user: {
                id: detainee._id,
                name: detainee.name,
                username: detainee.username
            },
            token: token, // Send token in the response
            success: true
        });
    } catch (error) {
        console.error("Detainee Login Error:", error);
        res.status(500).json({ 
            message: 'Internal Server Error', 
            success: false
        });
    }
};

// Detainee Logout
export const detaineeLogout = (req, res) => {
    res.status(200).json({ 
        message: "Logout successful",
        success: true
    });
};

// Get Ongoing Cases
export const getOngoingCases = async (req, res) => {
    try {
        const { username } = req.params;
        
        const cases = await Case.find({ 
            detaineeUsername: username,
            status: { $nin: ["closed", "dismissed"] }
        }).sort({ filingDate: -1 });

        res.status(200).json({
            success: true,
            data: cases
        });
    } catch (error) {
        console.error("Error fetching ongoing cases:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// Get Bail Appeals
export const getBailAppeals = async (req, res) => {
    try {
        const { username } = req.params;
        const cases = await Case.find({ 
            detaineeUsername: username,
            bailStatus: { $in: ["Pending to judge", "Pending to lawyer"] }
        });

        const pendingToJudge = cases.filter(c => c.bailStatus === "Pending to judge");
        const pendingToLawyer = cases.filter(c => c.bailStatus === "Pending to lawyer");

        res.status(200).json({
            success: true,
            data: { pendingToJudge, pendingToLawyer }
        });
    } catch (error) {
        console.error("Error fetching bail appeals:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};
