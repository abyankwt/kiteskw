import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';

import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth.routes';
import courseRoutes from './routes/courses.routes';
import enrollmentRoutes from './routes/enrollments.routes';
import paymentRoutes from './routes/payments.routes';
import adminCourseRoutes from './routes/admin.courses.routes';
import adminUserRoutes from './routes/admin.users.routes';
import adminAnalyticsRoutes from './routes/admin.analytics.routes';
import adminEnrollmentRoutes from './routes/admin.enrollments.routes';

const app = express();

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:8080',
  'http://localhost:5173',
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Static file serving for uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/enrollments', enrollmentRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/admin/courses', adminCourseRoutes);
app.use('/api/v1/admin/users', adminUserRoutes);
app.use('/api/v1/admin/analytics', adminAnalyticsRoutes);
app.use('/api/v1/admin/enrollments', adminEnrollmentRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

export default app;
