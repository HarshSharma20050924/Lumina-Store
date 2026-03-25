import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import JWT_SECRET from '../config/jwt';

// Generate JWT Token
export const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Hash Password
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare Password
export const comparePassword = async (enteredPassword: string, hash: string) => {
  return await bcrypt.compare(enteredPassword, hash);
};