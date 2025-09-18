import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { students, users } from '../schema';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/auth.middleware';

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, course, documents } = req.body;

    // Generate unique student ID
    const lastStudent = await db.select().from(students).orderBy(students.studentId).limit(1);
    const studentId = `STU${String(lastStudent.length > 0 
      ? parseInt(lastStudent[0].studentId.slice(3)) + 1 
      : 1001).padStart(4, '0')}`;

    // Create user account for student
    const hashedPassword = await bcrypt.hash('student123', 10); // Default password
    const [user] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role: 'Student'
    }).returning();

    // Create student record
    const [student] = await db.insert(students).values({
      userId: user.id,
      studentId,
      phone,
      course,
      documents: documents || []
    }).returning();

    res.status(201).json(student);
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStudents = async (req: Request, res: Response) => {
  try {
    const allStudents = await db.select().from(students);
    res.json(allStudents);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const [student] = await db.select()
      .from(students)
      .where(eq(students.userId, req.user.id));

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};