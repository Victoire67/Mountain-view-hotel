// app.js — the Express app, shared by the local server (server.js)
// and the Vercel serverless function (../api/index.js)
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import authRoute from "./src/routes/auth.route.js"
import itemsRoute from "./src/routes/Items.route.js"

dotenv.config({ quiet: true });

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1); // behind a hosting proxy (Vercel / Railway)

// Middleware
app.use(cors({
  // Comma-separated allow-list, e.g. "https://mountainview.rw,http://localhost:5173"; defaults to any origin
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()) : true,
  maxAge: 86_400, // let browsers cache preflight responses for a day
}));
app.use(express.json({ limit: '100kb' }));

// Health check
app.get('/api/health', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json({ status: 'ok' });
});

// Routes
app.use('/api/items', itemsRoute);
app.use('/api/login', authRoute);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Invalid JSON body' });
    }
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong on the server' });
});

export default app;
