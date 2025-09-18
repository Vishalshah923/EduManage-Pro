import { Request, Response } from 'express';
import { eq, and, gte, lte } from 'drizzle-orm';
import { db } from '../db';
import { faculty, courses, attendance } from '../schema.extended';
import { AuthRequest } from '../middleware/auth.middleware';

export const getFacultyProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const [facultyProfile] = await db.select()
      .from(faculty)
      .where(eq(faculty.userId, req.user.id));

    if (!facultyProfile) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.json(facultyProfile);
  } catch (error) {
    console.error('Get faculty profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getFacultyCourses = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const [facultyProfile] = await db.select()
      .from(faculty)
      .where(eq(faculty.userId, req.user.id));

    const facultyCourses = await db.select()
      .from(courses)
      .where(eq(courses.facultyId, facultyProfile.id));

    res.json(facultyCourses);
  } catch (error) {
    console.error('Get faculty courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, date, attendanceData } = req.body;
    const attendanceRecords = attendanceData.map((record: any) => ({
      studentId: record.studentId,
      courseId,
      date: new Date(date),
      status: record.status,
      markedBy: req.user?.id
    }));

    const result = await db.insert(attendance).values(attendanceRecords).returning();
    res.json(result);
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAttendanceReport = async (req: Request, res: Response) => {
  try {
    const { courseId, startDate, endDate } = req.query;
    
    const attendanceRecords = await db.select()
      .from(attendance)
      .where(
        and(
          eq(attendance.courseId, Number(courseId)),
          gte(attendance.date, String(startDate)),
          lte(attendance.date, String(endDate))
        )
      );

    res.json(attendanceRecords);
  } catch (error) {
    console.error('Get attendance report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};