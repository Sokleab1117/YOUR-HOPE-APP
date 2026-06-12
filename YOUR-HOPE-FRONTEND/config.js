/* ═══════════════════════════════════════════════════════════════════
   YOUR HOPE — config.js
   Single source of truth for connecting the frontend to the backend.

   ── HOW TO DEPLOY ─────────────────────────────────────────────────
   This is the ONLY place you need to change the backend URL.

   • Local development (default):
       API_BASE: 'http://localhost:5001/api'

   • Production (after deploying your backend, e.g. to Render/Railway):
       API_BASE: 'https://your-backend-domain.com/api'

   The Gemini AI key is NOT stored here anymore — it lives only on
   the backend (.env -> GEMINI_API_KEY) and is called through
   POST {API_BASE}/ai/chat, so it is never exposed in the browser.
   ═══════════════════════════════════════════════════════════════════ */

const CONFIG = {
  API_BASE: 'http://localhost:5001/api',
};