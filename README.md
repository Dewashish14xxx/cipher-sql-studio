# CipherSQLStudio 🚀

Hi everyone! I just built this project to help people learn SQL interactively. It's a browser-based SQL platform where you can practice writing queries, and it even has an AI assistant giving hints!

**🌟 Live Links:**
- **Frontend (Play Here!):** [https://cipher-sql-studio-tawny.vercel.app](https://cipher-sql-studio-tawny.vercel.app)  
- **Backend API:** [https://cipher-sql-backend.onrender.com](https://cipher-sql-backend.onrender.com)

## What does it do?
I wanted to build a real-world application, so this project lets you:
- Write SQL queries in a cool code editor (like the one in VS Code!)
- Run them against a real PostgreSQL sandbox database
- Create an account to save your progress
- Check out past SQL query attempts in the Query History panel
- Compete with others on a Global Leaderboard! 🏆
- Switch between Light and Dark mode 🌗

## Tech Stack 🛠️
I learned and used some awesome modern technologies to build this:
- **Frontend:** React.js, Vite, SCSS (for custom styling)
- **Backend:** Node.js, Express.js
- **Databases:** MongoDB (for storing users/progress) & PostgreSQL (for executing the SQL challenges)
- **AI Integration:** Google Gemini API for intelligent, real-time query hints

## How to run it on your own computer 💻
If you want to check out my code and run it yourself locally, follow these easy steps!

### 1. Prerequisites
Make sure you have Node.js installed on your PC, and free accounts for MongoDB Atlas and Neon (for PostgreSQL). You'll also need a free Gemini API key from Google AI Studio.

### 2. Clone the repo
```bash
git clone https://github.com/Dewashish14xxx/cipher-sql-studio.git
cd cipher-sql-studio
```

### 3. Setup Backend
Open a terminal and go into the backend folder:
```bash
cd backend
npm install
```
Create a `.env` file in the backend folder and add these variables (check `.env.example` to see what they look like!):
```env
PORT=5000
MONGODB_URI=your_mongodb_cluster_string
PG_HOST=your_neon_pg_host
PG_PORT=5432
PG_USER=your_pg_user
PG_PASSWORD=your_pg_password
PG_DATABASE=your_pg_database
PG_SSL=true
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_secret_random_string
CLIENT_URL=http://localhost:5173
```

Then run the seed script to load the assignments to the database, and start the server!
```bash
npm run seed
npm run dev
```

### 4. Setup Frontend
Open a new terminal and go into the frontend folder:
```bash
cd frontend
npm install
```
Create a `.env` file in the frontend folder:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the React app!
```bash
npm run dev
```

Now you can open `http://localhost:5173` in your browser and it should be working perfectly!

---
Thanks for checking out my project! Any feedback is greatly appreciated. 😊
