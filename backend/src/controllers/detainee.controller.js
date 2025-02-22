import { Detainee } from "../models/detainee.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const getCookieOptions = () => ({
  httpOnly: true,
  secure: true, // Always true for production
  sameSite: 'none', // Required for cross-site cookies
  maxAge: 3600000, // 1 hour
  path: '/'
});

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
        res.cookie("token", token, getCookieOptions());

        res.status(201).json({
            message: "Detainee account created successfully!",
            user: { // Changed from 'data' to 'user'
                id: detainee._id,
                name: detainee.name,
                username: detainee.username
            },
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
        res.cookie("token", token, getCookieOptions());

        res.status(200).json({ 
            message: 'Login successful!', 
            user: { // Changed from 'data' to 'user'
                id: detainee._id,
                name: detainee.name,
                username: detainee.username
            },
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

export const detaineeLogout = (req, res) => {
    res.clearCookie("token", getCookieOptions());
    res.status(200).json({ 
        message: "Logout successful",
        success: true
    });
};
