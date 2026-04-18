import express from 'express';
import { submitHostRequest, getAllRequests } from '../controllers/requestController.js';

const router = express.Router();

router.post('/', submitHostRequest);
// For admins to view requests
router.get('/', getAllRequests);

export default router;
