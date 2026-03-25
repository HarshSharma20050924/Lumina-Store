
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Ensure dotenv is loaded if this file is imported early
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

export default JWT_SECRET;
