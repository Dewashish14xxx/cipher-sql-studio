require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectMongo = require('./config/db');
const assignmentsRouter = require('./routes/assignments');
const queryRouter = require('./routes/query');
const hintRouter = require('./routes/hint');
const authRouter = require('./routes/auth');
const progressRouter = require('./routes/progress');
const historyRouter = require('./routes/history');
const userRouter = require('./routes/userRoutes');
const leaderboardRouter = require('./routes/leaderboardRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Routes
app.use('/api/assignments', assignmentsRouter);
app.use('/api/query', queryRouter);
app.use('/api/hint', hintRouter);
app.use('/api/auth', authRouter);
app.use('/api/progress', progressRouter);
app.use('/api/history', historyRouter);
app.use('/api/users', userRouter);
app.use('/api/leaderboard', leaderboardRouter);

// 404
app.use((req, res) => res.status(404).json({ success: false, error: 'Route not found' }));

// Error handler
app.use(errorHandler);

// Boot
const PORT = process.env.PORT || 5000;
connectMongo().then(() => {
    app.listen(PORT, () => {
        console.log(`CipherSQLStudio backend running on http://localhost:${PORT}`);
    });
});
