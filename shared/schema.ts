import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, date, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("student"), // admin, staff, student
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  studentId: text("student_id").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  address: text("address").notNull(),
  course: text("course").notNull(),
  year: integer("year").notNull(),
  admissionDate: date("admission_date").notNull(),
  status: text("status").notNull().default("active"), // active, inactive, graduated
  createdAt: timestamp("created_at").defaultNow(),
});

export const fees = pgTable("fees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentDate: date("payment_date").notNull(),
  paymentMethod: text("payment_method").notNull(), // cash, card, upi, bank_transfer
  transactionId: text("transaction_id"),
  receiptUrl: text("receipt_url"),
  status: text("status").notNull().default("completed"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
});

export const hostels = pgTable("hostels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  roomNo: text("room_no").notNull(),
  block: text("block").notNull(),
  allocationDate: date("allocation_date").notNull(),
  status: text("status").notNull().default("allocated"), // allocated, vacated
  createdAt: timestamp("created_at").defaultNow(),
});

export const libraryBooks = pgTable("library_books", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  bookId: text("book_id").notNull(),
  bookTitle: text("book_title").notNull(),
  author: text("author").notNull(),
  issueDate: date("issue_date").notNull(),
  returnDate: date("return_date"),
  dueDate: date("due_date").notNull(),
  status: text("status").notNull().default("issued"), // issued, returned, overdue
  createdAt: timestamp("created_at").defaultNow(),
});

export const exams = pgTable("exams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  subject: text("subject").notNull(),
  marks: integer("marks").notNull(),
  totalMarks: integer("total_marks").notNull().default(100),
  grade: text("grade").notNull(),
  examDate: date("exam_date").notNull(),
  examType: text("exam_type").notNull(), // midterm, final, quiz
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  userId: true,
  studentId: true,
  createdAt: true,
});

export const insertFeeSchema = createInsertSchema(fees).omit({
  id: true,
  createdAt: true,
});

export const insertHostelSchema = createInsertSchema(hostels).omit({
  id: true,
  createdAt: true,
});

export const insertLibraryBookSchema = createInsertSchema(libraryBooks).omit({
  id: true,
  createdAt: true,
});

export const insertExamSchema = createInsertSchema(exams).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;

export type Fee = typeof fees.$inferSelect;
export type InsertFee = z.infer<typeof insertFeeSchema>;

export type Hostel = typeof hostels.$inferSelect;
export type InsertHostel = z.infer<typeof insertHostelSchema>;

export type LibraryBook = typeof libraryBooks.$inferSelect;
export type InsertLibraryBook = z.infer<typeof insertLibraryBookSchema>;

export type Exam = typeof exams.$inferSelect;
export type InsertExam = z.infer<typeof insertExamSchema>;
