import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes   from './routes/authRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import clinicRoutes from './routes/clinicRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import quoteRoutes from './routes/quoteRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app  = express();
const PORT = process.env.PORT || 5001;   // fixed: was 3000, frontend calls 5001

/* ── CORS ─────────────────────────────────────────────────────────
   Allowed origins are read from FRONTEND_ORIGINS (comma-separated)
   so you can add/change deployed frontend URLs without touching code
   — just update the env var in Railway and redeploy.

   Example Railway value:
     FRONTEND_ORIGINS=https://your-hope-xxxx.netlify.app,https://yourdomain.com

   Local dev origins are always allowed by default.
──────────────────────────────────────────────────────────────────── */
const defaultOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
];

const envOrigins = (process.env.FRONTEND_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const allowedOrigins = [...defaultOrigins, ...envOrigins];

console.log('🌐  Allowed CORS origins:', allowedOrigins);

/* ── MIDDLEWARE ───────────────────────────────────────────────────── */
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, server-to-server, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json());

/* ── ROUTES ───────────────────────────────────────────────────────── */
app.use('/api/auth',    authRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/chat-messages', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

/* ── HEALTH CHECK ─────────────────────────────────────────────────── */
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

/* ── 404 ──────────────────────────────────────────────────────────── */
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

/* ── START ────────────────────────────────────────────────────────── */
app.listen(PORT, () => console.log(`🚀  Server running on port ${PORT}`));