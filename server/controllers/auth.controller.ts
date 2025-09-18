import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../schema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const [newUser] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role
    }).returning();

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};