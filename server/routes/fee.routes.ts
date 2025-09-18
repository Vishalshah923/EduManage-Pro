import express from 'express';
import { createPayment, getFeeSummary, getStudentFees } from '../controllers/fee.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticate, authorize('Staff'), createPayment);
router.get('/summary', authenticate, authorize('Admin', 'Staff'), getFeeSummary);
router.get('/student/:studentId', authenticate, getStudentFees);

export default router;