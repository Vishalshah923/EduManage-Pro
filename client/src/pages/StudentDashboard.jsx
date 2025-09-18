import React from 'react';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  ClockIcon,
  CurrencyDollarIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import { Card, StatsCard } from '../components/ui/Card';
import { Table } from '../components/ui/Common';

const StudentDashboard = () => {
  // Sample data (replace with actual API calls)
  const attendanceData = {
    present: 85,
    total: 100
  };

  const grades = [
    { subject: 'Mathematics', grade: 'A', marks: 85 },
    { subject: 'Physics', grade: 'B+', marks: 78 },
    { subject: 'Chemistry', grade: 'A-', marks: 82 }
  ];

  const feeStatus = {
    paid: 5000,
    total: 10000
  };

  const hostelInfo = {
    room: 'A101',
    complaints: 2
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Attendance"
          value={`${(attendanceData.present / attendanceData.total * 100).toFixed(1)}%`}
          icon={ClockIcon}
          color="green"
        />
        <StatsCard
          title="Average Grade"
          value="A-"
          icon={AcademicCapIcon}
          color="blue"
        />
        <StatsCard
          title="Fee Paid"
          value={`$${feeStatus.paid}/${feeStatus.total}`}
          icon={CurrencyDollarIcon}
          color="purple"
        />
        <StatsCard
          title="Hostel Room"
          value={hostelInfo.room}
          icon={HomeIcon}
          color="orange"
        />
      </div>

      {/* Academic Performance */}
      <Card className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Academic Performance</h2>
        <Table
          headers={['Subject', 'Grade', 'Marks']}
          data={grades.map(g => ({
            subject: g.subject,
            grade: (
              <span className={`font-semibold ${g.grade.startsWith('A') ? 'text-green-600' : 'text-yellow-600'}`}>
                {g.grade}
              </span>
            ),
            marks: g.marks
          }))}
        />
      </Card>

      {/* Recent Attendance */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Recent Attendance</h2>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Present Days</p>
            <p className="text-2xl font-bold">{attendanceData.present}/{attendanceData.total}</p>
          </div>
          <motion.div
            className="w-24 h-24"
            style={{
              background: `conic-gradient(#10B981 ${(attendanceData.present / attendanceData.total) * 360}deg, #E5E7EB 0)`
            }}
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1 }}
            className="rounded-full"
          />
        </div>
      </Card>

      {/* Hostel Status */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Hostel Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">Room Number</p>
            <p className="text-2xl font-bold">{hostelInfo.room}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">Active Complaints</p>
            <p className="text-2xl font-bold">{hostelInfo.complaints}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentDashboard;