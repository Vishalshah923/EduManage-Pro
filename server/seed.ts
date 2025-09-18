import { db } from './db';
import { users, students, fees, hostelRooms, exams } from './schema';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    console.log('Starting database seeding...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const [admin] = await db.insert(users).values({
      name: 'Admin User',
      email: 'admin@college.com',
      password: adminPassword,
      role: 'Admin'
    }).returning();

    console.log('Admin user created:', admin.email);

    // Create staff user
    const staffPassword = await bcrypt.hash('staff123', 10);
    const [staff] = await db.insert(users).values({
      name: 'Staff User',
      email: 'staff@college.com',
      password: staffPassword,
      role: 'Staff'
    }).returning();

    console.log('Staff user created:', staff.email);

    // Create hostel rooms
    const [room1, room2] = await db.insert(hostelRooms).values([
      { roomNumber: 'A101', capacity: 2, occupancy: 0 },
      { roomNumber: 'A102', capacity: 2, occupancy: 0 }
    ]).returning();

    console.log('Hostel rooms created');

    // Create students with their user accounts
    const studentPassword = await bcrypt.hash('student123', 10);
    
    // Student 1
    const [student1User] = await db.insert(users).values({
      name: 'John Doe',
      email: 'john@college.com',
      password: studentPassword,
      role: 'Student'
    }).returning();

    const [student1] = await db.insert(students).values({
      userId: student1User.id,
      studentId: 'STU1001',
      phone: '1234567890',
      course: 'Computer Science',
      documents: ['id.pdf', 'transcript.pdf'],
      hostelRoomId: room1.id
    }).returning();

    // Update room occupancy
    await db.update(hostelRooms)
      .set({ occupancy: 1 })
      .where({ id: room1.id });

    // Create fee records
    await db.insert(fees).values([
      {
        studentId: student1.id,
        amount: 5000,
        status: 'Paid',
        date: new Date()
      }
    ]);

    // Create exam records
    await db.insert(exams).values([
      {
        studentId: student1.id,
        subject: 'Mathematics',
        marks: 85,
        attendance: 90,
        grade: 'A'
      },
      {
        studentId: student1.id,
        subject: 'Programming',
        marks: 92,
        attendance: 95,
        grade: 'A+'
      }
    ]);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();