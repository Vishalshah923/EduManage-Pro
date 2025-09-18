import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { fees, students } from '../schema';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { studentId, amount } = req.body;

    // Find student
    const [student] = await db.select()
      .from(students)
      .where(eq(students.studentId, studentId));

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Create fee record
    const [fee] = await db.insert(fees).values({
      studentId: student.id,
      amount,
      status: 'Paid'
    }).returning();

    // Generate PDF receipt
    const doc = new PDFDocument();
    const receiptDir = path.join(process.cwd(), 'receipts');
    if (!fs.existsSync(receiptDir)) {
      fs.mkdirSync(receiptDir);
    }
    const receiptPath = path.join(receiptDir, `receipt_${fee.id}.pdf`);
    const writeStream = fs.createWriteStream(receiptPath);

    doc.pipe(writeStream);
    doc.fontSize(20).text('Fee Receipt', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Receipt No: ${fee.id}`);
    doc.text(`Student ID: ${studentId}`);
    doc.text(`Amount: $${amount}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Status: Paid`);
    doc.end();

    // Update fee record with receipt URL
    await db.update(fees)
      .set({ receiptUrl: receiptPath })
      .where(eq(fees.id, fee.id));

    res.status(201).json({ ...fee, receiptUrl: receiptPath });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getFeeSummary = async (req: Request, res: Response) => {
  try {
    const allFees = await db.select().from(fees);
    const paid = allFees.filter(f => f.status === 'Paid').length;
    const pending = allFees.filter(f => f.status === 'Pending').length;
    const totalCollected = allFees
      .filter(f => f.status === 'Paid')
      .reduce((sum, f) => sum + f.amount, 0);

    res.json({
      paid,
      pending,
      totalCollected
    });
  } catch (error) {
    console.error('Get fee summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStudentFees = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const [student] = await db.select()
      .from(students)
      .where(eq(students.studentId, studentId));

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const studentFees = await db.select()
      .from(fees)
      .where(eq(fees.studentId, student.id));

    res.json(studentFees);
  } catch (error) {
    console.error('Get student fees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};