import jwt from 'jsonwebtoken';

const generateToken = (identifier, email, username) => {
  return jwt.sign(
    { ...identifier, email, username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export default generateToken;