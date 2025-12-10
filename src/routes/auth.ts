import express from 'express';
import { register, login } from '../controllers/authController';


const router = express.Router();

// router.get('/test', (req, res) => {
//   res.send("Auth router loaded");
// });


router.post('/register', register);
router.post('/login', login);

export default router;
