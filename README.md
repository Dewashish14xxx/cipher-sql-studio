# CipherSQLStudio

**🌟 Live Demo:** [https://cipher-sql-studio-tawny.vercel.app](https://cipher-sql-studio-tawny.vercel.app)  
*(Backend API: [https://cipher-sql-backend.onrender.com](https://cipher-sql-backend.onrender.com))*

> A browser-based SQL learning platform where students practice SQL queries against pre-configured assignments with real-time execution and AI-powered hints.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite), Monaco Editor, SCSS |
| Backend | Node.js, Express.js |
| Sandbox DB | PostgreSQL |
| Persistence DB | MongoDB (Atlas) |
| LLM | Google Gemini (`gemini-1.5-flash`) |

## Project Structure

```
cipher-sql-studio/
├── backend/          # Node.js / Express API
│   ├── src/
│   │   ├── config/   # DB connections (pg, mongoose)
│   │   ├── models/   # Mongoose models (Assignment, Attempt, User)
│   │   ├── routes/   # API routers (assignments, query, hint, auth)
│   │   ├── services/ # queryService (PG sandbox), hintService (Gemini)
│   │   ├── middleware/
│   │   └── seed/     # seed.js - pre-loads sample assignments
│   ├── .env.example
│   └── package.json
└── frontend/         # React (Vite) SPA
    ├── src/
    │   ├── api/      # Axios service layer
    │   ├── components/
    │   ├── context/  # AuthContext
    │   ├── pages/    # HomePage, AttemptPage, AuthPage
    │   └── styles/   # SCSS partials (BEM naming)
    ├── .env.example
    └── package.json
```

## Setup & Installation

### Prerequisites
- Node.js 18+
- PostgreSQL (local or hosted)
- MongoDB Atlas account (free tier works)
- Google Gemini API key ([get one free](https://aistudio.google.com/app/apikey))

### 1. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env     # fill in your values

# Frontend
cd ../frontend
npm install
cp .env.example .env     # defaults to http://localhost:5000/api
```

### 2. Configure Environment Variables

**backend/.env**
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ciphersql
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=your_pg_password
PG_DATABASE=ciphersql_sandbox
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=any_long_random_string
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Create the PostgreSQL Database

```bash
psql -U postgres -c "CREATE DATABASE ciphersql_sandbox;"
```

### 4. Seed Assignments

```bash
cd backend
npm run seed
```

This inserts 3 sample assignments (easy → medium → hard) into MongoDB and will automatically create the PostgreSQL sandbox schemas when the first query is run.

### 5. Run

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Open http://localhost:5173

---

## 🚀 Deployment Guide (Public Live Link)

To get a public link to submit for your assignment, you can easily deploy this repository for free using **Render** (for the Backend API) and **Vercel** (for the Frontend UI).

### Part 1: Deploy Backend (Render)
1. Push this code to a public GitHub repository.
2. Go to [Render.com](https://render.com) and log in.
3. Click **New +** and select **Blueprint**.
4. Connect your GitHub repository. Render will automatically read the `render.yaml` file and set up a Web Service.
5. In the Render Dashboard, click on your new web service, go to **Environment**, and fill in the missing secrets (`MONGODB_URI`, `PG_HOST`, `GEMINI_API_KEY`, etc.).
6. Once deployed, copy the Render URL (e.g., `https://cipher-sql-backend.onrender.com`).

### Part 2: Deploy Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com) and log in.
2. Click **Add New** → **Project** and import your GitHub repository.
3. Before clicking deploy, configure the **Framework Preset** to `Vite`.
4. Open **Environment Variables** and add:
   - Name: `VITE_API_URL`
   - Value: `YOUR_RENDER_URL/api` *(e.g., `https://cipher-sql-backend.onrender.com/api`)*
5. Click **Deploy**. Vercel will automatically read `vercel.json` and host your frontend.

You now have a live public link you can share and submit!

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/assignments` | List all assignments |
| GET | `/api/assignments/:id` | Get assignment with table schemas |
| POST | `/api/query` | Execute user SQL in sandbox |
| POST | `/api/hint` | Get LLM hint from Gemini |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |

## Security

- Only `SELECT` queries are allowed (DML/DDL blocked by regex + keyword check)
- Each assignment gets its own PostgreSQL schema namespace
- 5-second query timeout
- Results capped at 500 rows

## Features

- ✅ Assignment listing with difficulty filter
- ✅ Monaco Editor with SQL syntax highlighting
- ✅ Live PostgreSQL query execution
- ✅ Formatted results table
- ✅ AI-powered hints (Gemini) — no full solutions
- ✅ Schema viewer with sample data preview
- ✅ Login / Register with JWT
- ✅ Attempt history saved to MongoDB
- ✅ Mobile-first responsive design (320px → 1280px)
- ✅ SCSS with variables, mixins, nesting, BEM naming

## Data-Flow Diagram

See `/data-flow-diagram.md` or draw by hand:

```
User types SQL → clicks "Run Query"
  │
  ├─► [Frontend] validateEmpty → POST /api/query {assignmentId, query}
  │                                      │
  │                            [Backend] MongoDB.findById(assignmentId)
  │                                      │
  │                            [queryService] isSelectOnly() check
  │                                      │
  │                            [PostgreSQL] SET search_path → executeQuery
  │                                      │
  │                            [Attempt] MongoDB.create({query, success})
  │                                      │
  └─◄─────────────────── {columns, rows} → ResultsTable renders
```
