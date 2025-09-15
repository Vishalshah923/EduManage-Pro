import { 
  type User, type InsertUser,
  type Student, type InsertStudent,
  type Fee, type InsertFee,
  type Hostel, type InsertHostel,
  type LibraryBook, type InsertLibraryBook,
  type Exam, type InsertExam
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Student methods
  getStudent(id: string): Promise<Student | undefined>;
  getStudentByUserId(userId: string): Promise<Student | undefined>;
  getStudents(): Promise<Student[]>;
  createStudent(student: InsertStudent, userId: string): Promise<Student>;
  updateStudent(id: string, updates: Partial<Student>): Promise<Student | undefined>;

  // Fee methods
  getFees(): Promise<Fee[]>;
  getFeesByStudentId(studentId: string): Promise<Fee[]>;
  createFee(fee: InsertFee): Promise<Fee>;
  getTotalFeesCollected(): Promise<number>;

  // Hostel methods
  getHostels(): Promise<Hostel[]>;
  getHostelByStudentId(studentId: string): Promise<Hostel | undefined>;
  createHostel(hostel: InsertHostel): Promise<Hostel>;
  getHostelOccupancy(): Promise<{ total: number; occupied: number }>;

  // Library methods
  getLibraryBooks(): Promise<LibraryBook[]>;
  getLibraryBooksByStudentId(studentId: string): Promise<LibraryBook[]>;
  createLibraryBook(book: InsertLibraryBook): Promise<LibraryBook>;
  updateLibraryBook(id: string, updates: Partial<LibraryBook>): Promise<LibraryBook | undefined>;
  getBooksIssuedToday(): Promise<number>;

  // Exam methods
  getExams(): Promise<Exam[]>;
  getExamsByStudentId(studentId: string): Promise<Exam[]>;
  createExam(exam: InsertExam): Promise<Exam>;
  getAverageExamPerformance(): Promise<{ [subject: string]: number }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private students: Map<string, Student> = new Map();
  private fees: Map<string, Fee> = new Map();
  private hostels: Map<string, Hostel> = new Map();
  private libraryBooks: Map<string, LibraryBook> = new Map();
  private exams: Map<string, Exam> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Create admin user
    const adminId = randomUUID();
    this.users.set(adminId, {
      id: adminId,
      username: "admin",
      password: "admin123", // In real app, this should be hashed
      role: "admin",
      email: "admin@edumanage.com",
      createdAt: new Date(),
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser,
      role: insertUser.role || "student",
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Student methods
  async getStudent(id: string): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async getStudentByUserId(userId: string): Promise<Student | undefined> {
    return Array.from(this.students.values()).find(student => student.userId === userId);
  }

  async getStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }

  async createStudent(insertStudent: InsertStudent, userId: string): Promise<Student> {
    const id = randomUUID();
    const studentId = `STU${Date.now()}`;
    const student: Student = {
      ...insertStudent,
      status: insertStudent.status || "active",
      id,
      userId,
      studentId,
      createdAt: new Date(),
    };
    this.students.set(id, student);
    return student;
  }

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student | undefined> {
    const student = this.students.get(id);
    if (!student) return undefined;
    
    const updatedStudent = { ...student, ...updates };
    this.students.set(id, updatedStudent);
    return updatedStudent;
  }

  // Fee methods
  async getFees(): Promise<Fee[]> {
    return Array.from(this.fees.values());
  }

  async getFeesByStudentId(studentId: string): Promise<Fee[]> {
    return Array.from(this.fees.values()).filter(fee => fee.studentId === studentId);
  }

  async createFee(insertFee: InsertFee): Promise<Fee> {
    const id = randomUUID();
    const fee: Fee = {
      ...insertFee,
      status: insertFee.status || "completed",
      transactionId: insertFee.transactionId || null,
      receiptUrl: insertFee.receiptUrl || null,
      id,
      createdAt: new Date(),
    };
    this.fees.set(id, fee);
    return fee;
  }

  async getTotalFeesCollected(): Promise<number> {
    return Array.from(this.fees.values())
      .filter(fee => fee.status === 'completed')
      .reduce((total, fee) => total + parseFloat(fee.amount), 0);
  }

  // Hostel methods
  async getHostels(): Promise<Hostel[]> {
    return Array.from(this.hostels.values());
  }

  async getHostelByStudentId(studentId: string): Promise<Hostel | undefined> {
    return Array.from(this.hostels.values()).find(hostel => hostel.studentId === studentId);
  }

  async createHostel(insertHostel: InsertHostel): Promise<Hostel> {
    const id = randomUUID();
    const hostel: Hostel = {
      ...insertHostel,
      status: insertHostel.status || "allocated",
      id,
      createdAt: new Date(),
    };
    this.hostels.set(id, hostel);
    return hostel;
  }

  async getHostelOccupancy(): Promise<{ total: number; occupied: number }> {
    const total = 275; // Total hostel capacity
    const occupied = Array.from(this.hostels.values()).filter(h => h.status === 'allocated').length;
    return { total, occupied };
  }

  // Library methods
  async getLibraryBooks(): Promise<LibraryBook[]> {
    return Array.from(this.libraryBooks.values());
  }

  async getLibraryBooksByStudentId(studentId: string): Promise<LibraryBook[]> {
    return Array.from(this.libraryBooks.values()).filter(book => book.studentId === studentId);
  }

  async createLibraryBook(insertBook: InsertLibraryBook): Promise<LibraryBook> {
    const id = randomUUID();
    const book: LibraryBook = {
      ...insertBook,
      status: insertBook.status || "issued",
      returnDate: insertBook.returnDate || null,
      id,
      createdAt: new Date(),
    };
    this.libraryBooks.set(id, book);
    return book;
  }

  async updateLibraryBook(id: string, updates: Partial<LibraryBook>): Promise<LibraryBook | undefined> {
    const book = this.libraryBooks.get(id);
    if (!book) return undefined;
    
    const updatedBook = { ...book, ...updates };
    this.libraryBooks.set(id, updatedBook);
    return updatedBook;
  }

  async getBooksIssuedToday(): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    return Array.from(this.libraryBooks.values())
      .filter(book => book.issueDate === today).length;
  }

  // Exam methods
  async getExams(): Promise<Exam[]> {
    return Array.from(this.exams.values());
  }

  async getExamsByStudentId(studentId: string): Promise<Exam[]> {
    return Array.from(this.exams.values()).filter(exam => exam.studentId === studentId);
  }

  async createExam(insertExam: InsertExam): Promise<Exam> {
    const id = randomUUID();
    const exam: Exam = {
      ...insertExam,
      totalMarks: insertExam.totalMarks || 100,
      id,
      createdAt: new Date(),
    };
    this.exams.set(id, exam);
    return exam;
  }

  async getAverageExamPerformance(): Promise<{ [subject: string]: number }> {
    const exams = Array.from(this.exams.values());
    const subjectGroups = exams.reduce((acc, exam) => {
      if (!acc[exam.subject]) acc[exam.subject] = [];
      acc[exam.subject].push((exam.marks / exam.totalMarks) * 100);
      return acc;
    }, {} as { [subject: string]: number[] });

    const averages: { [subject: string]: number } = {};
    for (const [subject, marks] of Object.entries(subjectGroups)) {
      averages[subject] = marks.reduce((sum, mark) => sum + mark, 0) / marks.length;
    }

    return averages;
  }
}

export const storage = new MemStorage();
