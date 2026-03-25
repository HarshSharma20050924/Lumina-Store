
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import JWT_SECRET from '../config/jwt';

interface DecodedToken {
  id: string;
  role: 'USER' | 'ADMIN' | 'AGENT';
  iat: number;
  exp: number;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      if (!token || token === 'undefined' || token === 'null') {
          console.error('[Auth Error] Invalid token string received:', token);
          return res.status(401).json({ message: 'Not authorized, invalid token format' });
      }

      const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      return next();
    } catch (error: any) {
      console.error('[Auth Error] Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

export const adminOrAgent = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'AGENT')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin or agent' });
  }
};
