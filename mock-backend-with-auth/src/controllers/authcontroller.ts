import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/users';
import { config } from '../config';
import { IAuthRequest, IAuthResponse, IUserResponse } from '../types';

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '7d' });
};

const formatUserResponse = (user: any): IUserResponse => {
  return {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt
  };
};

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName }: IAuthRequest = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName
    });
    // console.log(user);

    await user.save();//custom method to hash passwords

    // Generate token
    const token = generateToken(user._id);

    const response: IAuthResponse = {
      token,
      user: formatUserResponse(user)
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('SignUp error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: IAuthRequest = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = generateToken(user._id);

    const response: IAuthResponse = {
      token,
      user: formatUserResponse(user)
    };

    res.json(response);
  } catch (error) {
    console.error('SignIn error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    res.json({ user: formatUserResponse(req.user) });
  } catch (error) {
    console.error('GetProfile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};