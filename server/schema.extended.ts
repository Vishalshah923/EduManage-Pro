import { pgTable, serial, text, timestamp, integer, boolean, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users, students } from './schema';

// Faculty table
export const faculty = pgTable('faculty', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  employeeId: text('employee_id').unique().notNull(),
  department: text('department').notNull(),
  designation: text('designation').notNull(),
  joiningDate: date('joining_date').notNull(),
  qualification: text('qualification').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Classes/Courses table
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  code: text('code').unique().notNull(),
  department: text('department').notNull(),
  semester: integer('semester').notNull(),
  credits: integer('credits').notNull(),
  facultyId: integer('faculty_id').references(() => faculty.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Student Course Enrollment
export const enrollments = pgTable('enrollments', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id),
  courseId: integer('course_id').references(() => courses.id),
  semester: integer('semester').notNull(),
  academicYear: text('academic_year').notNull(),
  status: text('status', { enum: ['Active', 'Completed', 'Dropped'] }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Attendance table
export const attendance = pgTable('attendance', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id),
  courseId: integer('course_id').references(() => courses.id),
  date: date('date').notNull(),
  status: text('status', { enum: ['Present', 'Absent', 'Late'] }).notNull(),
  markedBy: integer('marked_by').references(() => faculty.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Hostel Complaints
export const hostelComplaints = pgTable('hostel_complaints', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id),
  roomId: integer('room_id').references(() => hostelRooms.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: text('status', { enum: ['Pending', 'In Progress', 'Resolved'] }).default('Pending'),
  resolvedBy: integer('resolved_by').references(() => faculty.id),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const facultyRelations = relations(faculty, ({ one }) => ({
  user: one(users, {
    fields: [faculty.userId],
    references: [users.id],
  }),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  faculty: one(faculty, {
    fields: [courses.facultyId],
    references: [faculty.id],
  }),
  enrollments: many(enrollments),
  attendance: many(attendance),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  student: one(students, {
    fields: [enrollments.studentId],
    references: [students.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(students, {
    fields: [attendance.studentId],
    references: [students.id],
  }),
  course: one(courses, {
    fields: [attendance.courseId],
    references: [courses.id],
  }),
  faculty: one(faculty, {
    fields: [attendance.markedBy],
    references: [faculty.id],
  }),
}));