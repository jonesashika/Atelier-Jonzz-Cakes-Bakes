
import dotenv from 'dotenv';
dotenv.config();



// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "*****" : "Not set");
// console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);

import express from 'express';
import path from 'path';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';

// console.log("Loaded authRoutes:", authRoutes);

const app = express();
app.use(cors());
app.use(express.json());

connectDB();
app.use('/api', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// app.get('/', (req, res) => {
//   res.send('Backend is alive');
// });
const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));

app.get(/^(?!\/api\/).*$/, (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));


