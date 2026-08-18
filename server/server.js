// server.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import authRoute from  "./src/routes/auth.route.js"
import itemsRoute from "./src/routes/Items.route.js"
import pool from './src/config/db.js';

dotenv.config();

await pool.query('SELECT NOW()')

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// DB connection test — hit this route once, then remove it


// Routes
app.use('/api/items', itemsRoute);
app.use('/api/login', authRoute);



// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong on the server' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});