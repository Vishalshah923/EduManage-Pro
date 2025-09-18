import express from 'express';
import { getFacultyProfile, getFacultyCourses, markAttendance, getAttendanceReport } from '../controllers/faculty.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/profile', authenticate, authorize('Staff'), getFacultyProfile);
router.get('/courses', authenticate, authorize('Staff'), getFacultyCourses);
router.post('/attendance', authenticate, authorize('Staff'), markAttendance);
router.get('/attendance/report', authenticate, authorize('Staff', 'Admin'), getAttendanceReport);

export default router;