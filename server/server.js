import express from 'express';
import cors from 'cors';
import 'dotenv/config' ;
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

import connectDB from './config/mongodb.js';

const app = express();
const PORT = process.env.PORT || 4000
const allowedOrigins =['http://localhost:5173', 'http://localhost:5174']

console.log('Starting server...');
console.log('Backend URL configured:', process.env.MONGODB_URL ? 'Yes' : 'No');

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true}));

// API Endpoints
app.get('/', (req, res) => res.send('API Working '));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// Connect to database and start server
console.log('Connecting to MongoDB...');
connectDB().then(() => {
  app.listen(PORT, () => console.log(`✅ Server started on port: ${PORT}`));
}).catch((error) => {
  console.error('❌ Failed to connect to database:', error.message);
  process.exit(1);
});
