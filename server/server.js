import express from 'express';
import cors from 'cors';
import 'dotenv/config' ;
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

import connectDB from './config/mongodb.js';
import { log } from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 4000
connectDB();
const allowedOrigins = [
	'http://localhost:3000',
	'http://localhost:5173',
	'http://127.0.0.1:3000',
	'http://127.0.0.1:5173',
	...(process.env.CORS_ORIGINS || '')
		.split(',')
		.map((origin) => origin.trim())
		.filter(Boolean),
];

app.use((req, res, next) => {
	const startedAt = Date.now();
	const originalJson = res.json.bind(res);

	res.json = (body) => {
		if (body?.success === false) {
			const level = res.statusCode >= 500 ? 'error' : 'warn';
			log(level, 'Application request failed', {
				method: req.method,
				path: req.originalUrl,
				status: res.statusCode,
				message: body.message,
			});
		}

		return originalJson(body);
	};

	res.on('finish', () => {
		const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
		log(level, 'HTTP request completed', {
			method: req.method,
			path: req.originalUrl,
			status: res.statusCode,
			durationMs: Date.now() - startedAt,
		});
	});

	next();
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true}));

// API Endpoints
app.get('/', (req, res) => res.send('API Working '));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use((error, req, res, next) => {
	log('error', 'Unhandled server error', {
		method: req.method,
		path: req.originalUrl,
		message: error.message,
		stack: error.stack,
	});

	if (res.headersSent) {
		return next(error);
	}

	return res.status(500).json({ success: false, message: 'Internal server error' });
});

process.on('uncaughtException', (error) => log('error', 'Uncaught exception', { message: error.message, stack: error.stack }));
process.on('unhandledRejection', (reason) => log('error', 'Unhandled promise rejection', { reason: String(reason) }));

app.listen(PORT, () => log('info', 'Server started', { port: PORT }));
