import mongoose from 'mongoose';
const { Schema } = mongoose;

const detaineeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  caseIds: {
    type: []
  }
    
}, { timestamps: true });

export const Detainee = mongoose.model('Detainee', detaineeSchema);