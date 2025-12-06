import express from 'express';
import { placeOrder } from '../controllers/orderController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/place-order', authMiddleware, placeOrder);

export default router;
