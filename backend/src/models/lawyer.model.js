import mongoose from 'mongoose';

const lawyerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    lawyerId: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    address: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    caseIds: {
        type: []
    }
}, { timestamps: true });

export const Lawyer = mongoose.model('Lawyer', lawyerSchema);