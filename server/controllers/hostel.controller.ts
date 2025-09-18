import { Request, Response } from 'express';
import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import { hostelComplaints } from '../schema.extended';
import { AuthRequest } from '../middleware/auth.middleware';

export const submitComplaint = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const [complaint] = await db.insert(hostelComplaints)
      .values({
        title,
        description,
        studentId: req.user.id,
        status: 'Pending'
      })
      .returning();

    res.status(201).json(complaint);
  } catch (error) {
    console.error('Submit complaint error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getComplaints = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const complaints = await db.select()
      .from(hostelComplaints)
      .where(eq(hostelComplaints.studentId, req.user.id));

    res.json(complaints);
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resolveComplaint = async (req: AuthRequest, res: Response) => {
  try {
    const { complaintId } = req.params;
    const { status } = req.body;

    const [updatedComplaint] = await db.update(hostelComplaints)
      .set({
        status,
        resolvedAt: new Date(),
        resolvedBy: req.user?.id
      })
      .where(eq(hostelComplaints.id, parseInt(complaintId)))
      .returning();

    res.json(updatedComplaint);
  } catch (error) {
    console.error('Resolve complaint error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getHostelOccupancy = async (req: Request, res: Response) => {
  try {
    const rooms = await db.select()
      .from(hostelRooms);

    res.json(rooms);
  } catch (error) {
    console.error('Get hostel occupancy error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};