import { pgTable, serial, text, timestamp, integer, boolean, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: ['Admin', 'Staff', 'Student'] }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  studentId: text('student_id').unique().notNull(),
  phone: text('phone').notNull(),
  course: text('course').notNull(),
  documents: json('documents').$type<string[]>(),
  hostelRoomId: integer('hostel_room_id').references(() => hostelRooms.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const fees = pgTable('fees', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id),
  amount: integer('amount').notNull(),
  status: text('status', { enum: ['Paid', 'Pending'] }).notNull(),
  receiptUrl: text('receipt_url'),
  date: timestamp('date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const hostelRooms = pgTable('hostel_rooms', {
  id: serial('id').primaryKey(),
  roomNumber: text('room_number').unique().notNull(),
  occupancy: integer('occupancy').default(0),
  capacity: integer('capacity').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const exams = pgTable('exams', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id),
  subject: text('subject').notNull(),
  marks: integer('marks').notNull(),
  attendance: integer('attendance').notNull(),
  grade: text('grade'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  student: one(students, {
    fields: [users.id],
    references: [students.userId],
  }),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  hostelRoom: one(hostelRooms, {
    fields: [students.hostelRoomId],
    references: [hostelRooms.id],
  }),
  fees: many(fees),
  exams: many(exams),
}));

export const hostelRoomsRelations = relations(hostelRooms, ({ many }) => ({
  students: many(students),
}));

export const feesRelations = relations(fees, ({ one }) => ({
  student: one(students, {
    fields: [fees.studentId],
    references: [students.id],
  }),
}));

export const examsRelations = relations(exams, ({ one }) => ({
  student: one(students, {
    fields: [exams.studentId],
    references: [students.id],
  }),
}));