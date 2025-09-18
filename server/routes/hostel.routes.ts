import express from 'express';
import { submitComplaint, getComplaints, resolveComplaint, getHostelOccupancy } from '../controllers/hostel.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/complaints', authenticate, authorize('Student'), submitComplaint);
router.get('/complaints', authenticate, authorize('Student'), getComplaints);
router.put('/complaints/:complaintId', authenticate, authorize('Staff'), resolveComplaint);
router.get('/occupancy', authenticate, authorize('Admin', 'Staff'), getHostelOccupancy);

export default router;