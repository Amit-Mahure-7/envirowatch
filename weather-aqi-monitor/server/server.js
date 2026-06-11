const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const weatherRoutes = require('./routes/weather');
const aqiRoutes = require('./routes/aqi');
const forecastRoutes = require('./routes/forecast');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET'],
}));
app.use(express.json());

// ── MongoDB Connection (optional caching) ───────────────
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.log('⚠️  MongoDB not connected (caching disabled):', err.message));
}

// ── Routes ──────────────────────────────────────────────
app.use('/api/weather', weatherRoutes);
app.use('/api/aqi', aqiRoutes);
app.use('/api/forecast', forecastRoutes);

// ── Health check ────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'EnviroWatch API is running',
    timestamp: new Date().toISOString(),
  });
});

// ── 404 Handler ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Error Handler ───────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 EnviroWatch server running on http://localhost:${PORT}`);
});
