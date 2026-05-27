import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes           from './routes/authRoutes.js';
import resultRoutes         from './routes/resultRoutes.js';
import clinicRoutes         from './routes/clinicRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import quoteRoutes          from './routes/quoteRoutes.js';
import appointmentRoutes    from './routes/appointmentRoutes.js';
import chatRoutes           from './routes/chatRoutes.js';
import adminRoutes          from './routes/adminRoutes.js';

const app  = express();
const PORT = process.env.PORT || 5001;

/* ── CORS ─────────────────────────────────────────────────────────── */
// FRONTEND_URL in .env locally  → e.g. http://localhost:5500
// FRONTEND_URL in Railway env   → e.g. https://your-hope.netlify.app
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5500',   // Live Server (VS Code default)
  'http://127.0.0.1:5500',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true
}));

/* ── MIDDLEWARE ───────────────────────────────────────────────────── */
app.use(express.json());

/* ── ROUTES ───────────────────────────────────────────────────────── */
app.use('/api/auth',            authRoutes);
app.use('/api/results',         resultRoutes);
app.use('/api/clinics',         clinicRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/quotes',          quoteRoutes);
app.use('/api/appointments',    appointmentRoutes);
app.use('/api/chat-messages',   chatRoutes);
app.use('/api/admin',           adminRoutes);

/* ── HEALTH CHECK ─────────────────────────────────────────────────── */
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

/* ── 404 ──────────────────────────────────────────────────────────── */
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

/* ── START ────────────────────────────────────────────────────────── */
app.listen(PORT, () => console.log(`🚀  Server running on port ${PORT}`));