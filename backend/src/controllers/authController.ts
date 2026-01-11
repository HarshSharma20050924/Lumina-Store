
import { Request, Response } from 'express';
import prisma from '../config/db';
import { generateToken, hashPassword, comparePassword } from '../utils/auth';

const otpStore: Record<string, string> = {};

// @desc    Check if email exists
export const checkEmail = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    res.json({ exists: !!user });
};

// @desc    Register a new user
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER' 
      },
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Auth user & get token
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && (await comparePassword(password, user.password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        address: user.address,
        phone: user.phone,
        isPhoneVerified: user.isPhoneVerified, // Return verification status
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Send OTP to email (mocking mobile here)
export const sendOtp = async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email/Identifier required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    console.log(`[OTP] Sent to ${email}: ${otp}`); 
    res.json({ message: 'OTP sent', otp });
};

// @desc    Verify OTP and Create/Update User
export const verifyOtp = async (req: Request, res: Response) => {
    const { email, otp, password, name } = req.body;
    
    if (otpStore[email] !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    delete otpStore[email];

    try {
        let user = await prisma.user.findUnique({ where: { email } });

        // If user doesn't exist and password provided -> Registration
        if (!user && password) {
            const hashedPassword = await hashPassword(password);
            user = await prisma.user.create({
                data: {
                    name: name || email.split('@')[0],
                    email,
                    password: hashedPassword,
                    role: 'USER',
                    isPhoneVerified: true // Auto-verify on registration via OTP
                }
            });
        } 
        // If user DOES exist, this might be a Profile Verification
        else if (user) {
            user = await prisma.user.update({
                where: { id: user.id },
                data: { isPhoneVerified: true }
            });
        }

        if (!user) {
             return res.status(400).json({ message: 'User creation failed.' });
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            address: user.address,
            phone: user.phone,
            isPhoneVerified: user.isPhoneVerified, // Return updated status
            token: generateToken(user.id, user.role),
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const validateOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    if (otpStore[email] && otpStore[email] === otp) {
        res.json({ message: 'OTP Valid' });
    } else {
        res.status(400).json({ message: 'Invalid OTP' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, otp, newPassword, newPass } = req.body;
        const passwordToSet = newPassword || newPass;

        if (!passwordToSet) {
            return res.status(400).json({ message: 'New password is required' });
        }

        if (otpStore[email] !== otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await hashPassword(passwordToSet);
        
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });

        delete otpStore[email];

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error during password reset' });
    }
};

// @desc    Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        address: true,
        phone: true,
        isPhoneVerified: true, // Include status
        avatar: true,
        createdAt: true,
      }
    });

    if (user) res.json(user);
    else res.status(404).json({ message: 'User not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user profile & password
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (user) {
      const updateData: any = {
          name: req.body.name || user.name,
          email: req.body.email || user.email,
          phone: req.body.phone || user.phone,
          address: req.body.address || user.address,
          avatar: req.body.avatar || user.avatar,
      };

      // Explicitly allow updating verification status if provided (e.g. from valid OTP flow)
      if (req.body.isPhoneVerified !== undefined) {
          updateData.isPhoneVerified = req.body.isPhoneVerified;
      } 
      // If phone number changes and isPhoneVerified was NOT explicitly set to true, reset it
      else if (req.body.phone && req.body.phone !== user.phone) {
          updateData.isPhoneVerified = false;
      }

      // Handle Password Change
      if (req.body.newPassword) {
          if (req.body.currentPassword) {
              const isMatch = await comparePassword(req.body.currentPassword, user.password);
              if (!isMatch) {
                  return res.status(400).json({ message: 'Current password incorrect' });
              }
          }
          updateData.password = await hashPassword(req.body.newPassword);
      }

      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: updateData,
      });

      res.json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        phone: updatedUser.phone,
        isPhoneVerified: updatedUser.isPhoneVerified,
        address: updatedUser.address,
        token: generateToken(updatedUser.id, updatedUser.role),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
