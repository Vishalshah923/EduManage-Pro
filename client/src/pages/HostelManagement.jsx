import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  UserGroupIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { Card, StatsCard } from '../components/ui/Card';
import { Table, Button, Modal } from '../components/ui/Common';

const HostelManagement = () => {
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  // Sample data (replace with actual API calls)
  const hostelStats = {
    totalRooms: 50,
    occupiedRooms: 42,
    totalStudents: 84,
    activeComplaints: 5
  };

  const rooms = [
    { number: 'A101', capacity: 2, occupied: 2, students: ['John Doe', 'Jane Smith'] },
    { number: 'A102', capacity: 2, occupied: 1, students: ['Alice Brown'] },
    { number: 'A103', capacity: 2, occupied: 2, students: ['Bob Wilson', 'Charlie Davis'] }
  ];

  const complaints = [
    { id: 1, room: 'A101', issue: 'Water leakage', status: 'Pending', date: '2023-09-18' },
    { id: 2, room: 'A103', issue: 'Electrical fault', status: 'In Progress', date: '2023-09-17' },
    { id: 3, room: 'A102', issue: 'Window repair', status: 'Resolved', date: '2023-09-15' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Rooms"
          value={hostelStats.totalRooms}
          icon={HomeIcon}
          color="blue"
        />
        <StatsCard
          title="Occupied Rooms"
          value={`${hostelStats.occupiedRooms}/${hostelStats.totalRooms}`}
          icon={UserGroupIcon}
          color="green"
        />
        <StatsCard
          title="Total Students"
          value={hostelStats.totalStudents}
          icon={UserGroupIcon}
          color="purple"
        />
        <StatsCard
          title="Active Complaints"
          value={hostelStats.activeComplaints}
          icon={ExclamationCircleIcon}
          color="red"
        />
      </div>

      {/* Room Occupancy */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Room Occupancy</h2>
          <Button variant="primary">Allocate Room</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room, index) => (
            <motion.div
              key={room.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Room {room.number}</span>
                <span className={`text-sm ${
                  room.occupied === room.capacity ? 'text-red-600' : 'text-green-600'
                }`}>
                  {room.occupied}/{room.capacity}
                </span>
              </div>
              <div className="space-y-1">
                {room.students.map((student, i) => (
                  <div key={i} className="text-sm text-gray-600 dark:text-gray-400">
                    {student}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Complaints */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Complaints</h2>
          <Button variant="secondary" onClick={() => setShowComplaintModal(true)}>
            Submit Complaint
          </Button>
        </div>
        <Table
          headers={['Room', 'Issue', 'Status', 'Date', 'Actions']}
          data={complaints.map(complaint => ({
            room: complaint.room,
            issue: complaint.issue,
            status: (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                complaint.status === 'Resolved'
                  ? 'bg-green-100 text-green-800'
                  : complaint.status === 'In Progress'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {complaint.status}
              </span>
            ),
            date: complaint.date,
            actions: (
              <Button
                variant="secondary"
                className="text-sm"
                disabled={complaint.status === 'Resolved'}
              >
                {complaint.status === 'Resolved' ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                ) : (
                  'Update Status'
                )}
              </Button>
            )
          }))}
        />
      </Card>

      {/* Complaint Modal */}
      <Modal
        isOpen={showComplaintModal}
        onClose={() => setShowComplaintModal(false)}
        title="Submit Complaint"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Issue Title
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowComplaintModal(false)}>
              Cancel
            </Button>
            <Button variant="primary">Submit</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HostelManagement;