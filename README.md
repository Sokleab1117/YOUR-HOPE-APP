<div align="center">

# 🌿 YOUR HOPE

### Mental Health Support Platform for Phnom Penh

A bilingual (English · ខ្មែរ) web application offering DASS-21 mental health
screening, a directory of local services, AI-powered support chat, and an
admin analytics dashboard.

[![Live Demo](https://img.shields.io/badge/demo-live-2ea44f)](https://ams-your-hope.netlify.app)
![Node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/express-4.x-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8%2F9-4479A1?logo=mysql&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

[Live Demo](https://ams-your-hope.netlify.app) · [Features](#-features) · [Setup](#-getting-started) · [Deployment](#-deployment) · [API](#-api-reference)

</div>

---

## 📖 About

**YOUR HOPE** helps people in Phnom Penh take a first step toward better
mental health. Users can complete a validated DASS-21 screening, browse a
directory of 100 local clinics and services, chat with an AI assistant for
support and guidance, and export their results to share with a doctor —
all in English or Khmer.

> ⚠️ **Disclaimer**: This app is for informational and screening purposes
> only. DASS-21 is a validated tool but does not provide a clinical
> diagnosis. If you or someone you know is in crisis, please contact a
> qualified mental health professional immediately.

---

## ✨ Features

<table>
<tr>
<td valign="top" width="50%">

### 👤 For Users
- **DASS-21 Screening** — 21-item assessment across Depression, Anxiety,
  and Stress, scored per Lovibond & Lovibond (1995)
- **Service Directory** — 100 mental health services across Phnom Penh,
  filterable by type and NSSF coverage, with list and map views
- **AI Support Chat** — context-aware assistant powered by Google Gemini
- **PDF Export** — print-ready results to share with a healthcare provider
- **Bilingual UI** — full English / Khmer translations, switchable anytime
- **Guest mode** — browse freely; sign up only when taking the test or
  using protected features

</td>
<td valign="top" width="50%">

### 🛠️ For Admins
- **Live dashboard** with key metrics: total users, tests taken,
  high-risk cases, registered clinics
- **Interactive charts** — risk level breakdown, average scores,
  user status, and severity distribution by scale
- **User management** — search, filter, and review profiles
- **Results management** — search and filter screening history
- **Content management** — add/remove clinics and motivational quotes

</td>
</tr>
</table>

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vanilla HTML / CSS / JavaScript — no build step |
| **Charts** | Chart.js |
| **Backend** | Node.js + Express |
| **Database** | MySQL (InnoDB, utf8mb4) |
| **Auth** | bcrypt + JWT |
| **AI** | Google Gemini API (server-side proxy) |
| **Hosting** | Netlify (frontend) · Railway (backend + database) |

---

## 🗂️ Project Structure

```
YOUR-HOPE-APP/
├── index.html              # App layout & page structure
├── style.css                # Theme, layout, responsive design
├── app.js                    # Tabs, DASS-21, services, chat, admin, charts
├── auth.js                   # Sign up / sign in / guest mode / sessions
├── data.js                    # Questions, clinics, translations
├── config.js                  # Frontend → backend API config
├── docs/
│   └── DASS-21.pdf             # Reference document
└── YOUR-HOPE-BACKEND/
    ├── server.js               # Express entry point, CORS, routes
    ├── config/db.js             # MySQL connection pool
    ├── middleware/authMiddleware.js
    ├── controllers/             # auth, results, admin, ai (Gemini proxy)
    ├── routes/
    └── sql/
        ├── schema.sql            # Full schema + starter data
        └── admin_user.sql         # Promote a user to admin
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MySQL 8 or 9
- A Gemini API key ([aistudio.google.com](https://aistudio.google.com))

### 1. Clone & set up the database
```bash
git clone https://github.com/<your-username>/YOUR-HOPE-APP.git
cd YOUR-HOPE-APP
mysql -u root -p < YOUR-HOPE-BACKEND/sql/schema.sql
```

### 2. Configure & run the backend
```bash
cd YOUR-HOPE-BACKEND
npm install
```

Create `.env`:
```env
PORT=5001
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_local_password
DB_NAME=your_hope_db
JWT_SECRET=replace_with_a_long_random_secret
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_ORIGINS=http://localhost:5500
```

```bash
npm run dev
```

Verify: `http://localhost:5001/health` → `{"status":"ok"}`

### 3. Run the frontend
Set `config.js`:
```js
const CONFIG = {
  API_BASE: 'http://localhost:5001/api',
};
```
Serve `index.html` with any static server (e.g. VS Code Live Server, port `5500`).

### 4. Create an admin account
Sign up through the UI, then run:
```bash
mysql -u root -p your_hope_db < YOUR-HOPE-BACKEND/sql/admin_user.sql
```
(edit the email inside the file first). Sign out and back in to see the **Admin** tab.

---

## 🌐 Deployment

| Component | Platform |
|---|---|
| Frontend | [Netlify](https://netlify.com) |
| Backend + Database | [Railway](https://railway.app) |

**Backend (Railway)**
1. Add a MySQL plugin and a Node service from this repo
2. Import `sql/schema.sql` into the Railway database
3. Set environment variables: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`,
   `DB_PORT`, `JWT_SECRET`, `GEMINI_API_KEY`, `FRONTEND_ORIGINS`

**Frontend (Netlify)**
1. Point `config.js` → `API_BASE` at your Railway backend URL
2. Deploy the repo root (no build command needed)
3. Add the resulting Netlify URL to `FRONTEND_ORIGINS` on Railway

---

## 🔌 API Reference

| Method & Route | Description |
|---|---|
| `POST /api/auth/signup` | Create account |
| `POST /api/auth/login` | Authenticate, returns JWT |
| `GET /api/auth/me` | Current user profile |
| `GET /api/results` | Fetch DASS-21 history |
| `POST /api/results` | Save a DASS-21 result |
| `GET /api/clinics` | Service directory (filterable) |
| `GET /api/recommendations` | Severity-tiered recommendations |
| `GET /api/quotes` | Motivational quotes |
| `POST /api/ai/chat` | AI support chat (Gemini proxy) |
| `GET /api/admin/*` | Admin analytics (requires `role: admin`) |
| `GET /health` | Health check |

---

## 📊 DASS-21 Scoring Reference

| Scale | Normal | Mild | Moderate | Severe | Extremely Severe |
|---|---|---|---|---|---|
| Depression | 0–9 | 10–13 | 14–20 | 21–27 | 28+ |
| Anxiety | 0–7 | 8–9 | 10–14 | 15–19 | 20+ |
| Stress | 0–14 | 15–18 | 19–25 | 26–33 | 34+ |

*Raw item sums × 2, per Lovibond & Lovibond (1995)*

---

## 🔒 Security

- Secrets (`.env`) are excluded via `.gitignore` and never committed
- Gemini API key is used **server-side only**, via `/api/ai/chat`
- CORS restricted to origins listed in `FRONTEND_ORIGINS`
- Passwords hashed with bcrypt (12 rounds); JWTs expire after 7 days

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with 🌱 for the mental health community of Phnom Penh

</div>