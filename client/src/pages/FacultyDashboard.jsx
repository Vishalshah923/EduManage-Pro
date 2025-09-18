import React from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/24/outline';
import { Card, StatsCard } from '../components/ui/Card';
import { Table, Button } from '../components/ui/Common';

const FacultyDashboard = () => {
  // Sample data (replace with actual API calls)
  const courseStats = {
    totalCourses: 4,
    totalStudents: 120,
    averageAttendance: 85,
    upcomingClasses: 3
  };

  const courses = [
    { code: 'CS101', name: 'Introduction to Programming', students: 35, attendance: '88%' },
    { code: 'CS102', name: 'Data Structures', students: 30, attendance: '82%' },
    { code: 'CS103', name: 'Database Systems', students: 28, attendance: '85%' }
  ];

  const upcomingClasses = [
    { time: '10:00 AM', course: 'CS101', room: 'Lab 1' },
    { time: '11:30 AM', course: 'CS102', room: 'Room 201' },
    { time: '2:00 PM', course: 'CS103', room: 'Lab 2' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Courses"
          value={courseStats.totalCourses}
          icon={BookOpenIcon}
          color="blue"
        />
        <StatsCard
          title="Total Students"
          value={courseStats.totalStudents}
          icon={UserGroupIcon}
          color="green"
        />
        <StatsCard
          title="Average Attendance"
          value={`${courseStats.averageAttendance}%`}
          icon={ClipboardDocumentCheckIcon}
          color="yellow"
        />
        <StatsCard
          title="Upcoming Classes"
          value={courseStats.upcomingClasses}
          icon={PresentationChartLineIcon}
          color="purple"
        />
      </div>

      {/* Courses Overview */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Courses</h2>
          <Button variant="primary">Mark Attendance</Button>
        </div>
        <Table
          headers={['Course Code', 'Course Name', 'Students', 'Attendance']}
          data={courses.map(course => ({
            code: course.code,
            name: course.name,
            students: course.students,
            attendance: (
              <span className={`font-semibold ${
                parseInt(course.attendance) >= 85 ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {course.attendance}
              </span>
            )
          }))}
        />
      </Card>

      {/* Today's Schedule */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingClasses.map((cls, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-400">{cls.time}</span>
                <span className="text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded">
                  {cls.room}
                </span>
              </div>
              <p className="font-semibold">{cls.course}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="font-semibold mb-3">Attendance</h3>
          <Button variant="secondary" className="w-full">
            Take Attendance
          </Button>
        </Card>
        <Card>
          <h3 className="font-semibold mb-3">Grades</h3>
          <Button variant="secondary" className="w-full">
            Update Grades
          </Button>
        </Card>
        <Card>
          <h3 className="font-semibold mb-3">Reports</h3>
          <Button variant="secondary" className="w-full">
            Generate Reports
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default FacultyDashboard;