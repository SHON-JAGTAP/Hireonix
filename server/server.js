import express from 'express';
import cors from 'cors';
import 'dotenv/config' ;
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

import connectDB from './config/mongodb.js';

const app = express();
const PORT = process.env.PORT || 4000
const allowedOrigins = [
  process.env.FRONTEND_URL,       // production URL from .env
  /^http:\/\/localhost:\d+$/,     // any localhost port in development
]

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true)
    
    const isAllowed = allowedOrigins.some(allowed => {
      if (!allowed) return false
      if (allowed instanceof RegExp) return allowed.test(origin)
      return allowed === origin
    })

    if (isAllowed) {
      callback(null, true)
    } else {
      callback(new Error(`CORS blocked: ${origin}`))
    }
  },
  credentials: true
}));

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
