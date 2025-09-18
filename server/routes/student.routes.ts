import express from 'express';
import { createStudent, getStudents, getStudentProfile } from '../controllers/student.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticate, authorize('Admin', 'Staff'), createStudent);
router.get('/', authenticate, authorize('Admin', 'Staff'), getStudents);
router.get('/me', authenticate, authorize('Student'), getStudentProfile);

export default router;