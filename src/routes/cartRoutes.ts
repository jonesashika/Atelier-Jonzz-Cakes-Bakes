import express from 'express';
import { addToCart, getCart, updateQuantity,updateOptions,removeFromCart } from '../controllers/cartController';
import { authMiddleware } from '../middleware/auth';
const router = express.Router();

router.post('/add', authMiddleware, addToCart);
router.get('/', authMiddleware, getCart);
router.post('/update', authMiddleware, updateQuantity);
router.post('/update-options', authMiddleware, updateOptions);
router.post('/remove', authMiddleware, removeFromCart);

export default router;
