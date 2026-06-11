# 🌤️ EnviroWatch — Weather & AQI Monitor

A full-stack MERN application for real-time weather and air quality monitoring.

## 📁 Project Structure

```
weather-aqi-monitor/
├── client/          → React + Vite frontend
├── server/          → Node.js + Express backend
└── README.md
```

## 🚀 Quick Start

### 1. Get Free API Keys
- **OpenWeatherMap**: https://openweathermap.org/api (free tier)
- **WAQI (Air Quality)**: https://aqicn.org/data-platform/token/ (free)

### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Fill in your API keys in .env
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```

### 4. Open App
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, Chart.js, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (caching layer)
- **APIs**: OpenWeatherMap, WAQI
