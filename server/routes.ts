import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertStudentSchema, insertFeeSchema, insertHostelSchema, insertLibraryBookSchema, insertExamSchema } from "@shared/schema";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          role: user.role 
        } 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser(userData);
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          role: user.role 
        } 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Student routes
  app.get("/api/students", async (req, res) => {
    try {
      const students = await storage.getStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  app.get("/api/students/:id", async (req, res) => {
    try {
      const student = await storage.getStudent(req.params.id);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch student" });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      const studentData = insertStudentSchema.parse(req.body);
      
      // Create user account for student
      const userData = {
        username: studentData.email,
        password: "student123", // Default password
        email: studentData.email,
        role: "student" as const,
      };
      
      const user = await storage.createUser(userData);
      const student = await storage.createStudent(studentData, user.id);
      
      res.json(student);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Fee routes
  app.get("/api/fees", async (req, res) => {
    try {
      const fees = await storage.getFees();
      res.json(fees);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch fees" });
    }
  });

  app.get("/api/fees/student/:studentId", async (req, res) => {
    try {
      const fees = await storage.getFeesByStudentId(req.params.studentId);
      res.json(fees);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch student fees" });
    }
  });

  app.post("/api/fees", async (req, res) => {
    try {
      const feeData = insertFeeSchema.parse(req.body);
      const fee = await storage.createFee(feeData);
      res.json(fee);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Hostel routes
  app.get("/api/hostels", async (req, res) => {
    try {
      const hostels = await storage.getHostels();
      res.json(hostels);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hostels" });
    }
  });

  app.post("/api/hostels", async (req, res) => {
    try {
      const hostelData = insertHostelSchema.parse(req.body);
      const hostel = await storage.createHostel(hostelData);
      res.json(hostel);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Library routes
  app.get("/api/library/books", async (req, res) => {
    try {
      const books = await storage.getLibraryBooks();
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch library books" });
    }
  });

  app.post("/api/library/books", async (req, res) => {
    try {
      const bookData = insertLibraryBookSchema.parse(req.body);
      const book = await storage.createLibraryBook(bookData);
      res.json(book);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.patch("/api/library/books/:id", async (req, res) => {
    try {
      const updates = req.body;
      const book = await storage.updateLibraryBook(req.params.id, updates);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.json(book);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Exam routes
  app.get("/api/exams", async (req, res) => {
    try {
      const exams = await storage.getExams();
      res.json(exams);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exams" });
    }
  });

  app.post("/api/exams", async (req, res) => {
    try {
      const examData = insertExamSchema.parse(req.body);
      const exam = await storage.createExam(examData);
      res.json(exam);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Dashboard stats routes
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const students = await storage.getStudents();
      const totalFeesCollected = await storage.getTotalFeesCollected();
      const hostelOccupancy = await storage.getHostelOccupancy();
      const booksIssuedToday = await storage.getBooksIssuedToday();
      
      res.json({
        totalStudents: students.length,
        feesCollected: totalFeesCollected,
        hostelOccupancy: Math.round((hostelOccupancy.occupied / hostelOccupancy.total) * 100),
        booksIssuedToday,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get("/api/dashboard/exam-performance", async (req, res) => {
    try {
      const performance = await storage.getAverageExamPerformance();
      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exam performance" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
