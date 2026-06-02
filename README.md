# Spoowa — Hydration That Moves With You

A full-stack React JavaScript application for the Spoowa hydration brand website.

## Project Structure

```
project-root/
├── frontend/               # Frontend (React + Vite)
│   ├── assets/             # Images (product cans, activities, hero)
│   ├── components/         # React components (Navbar, Hero, etc.)
│   ├── pages/              # Page components (Home, NotFound)
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API service layer
│   ├── context/            # React context providers
│   ├── utils/              # Utility functions (cn)
│   ├── App.jsx             # Root app with routing
│   ├── main.jsx            # Entry point
│   └── styles.css          # Tailwind CSS v4 theme
├── backend/                # Backend (Express.js)
│   └── src/
│       ├── config/         # Environment config
│       ├── controllers/    # Route handlers
│       ├── middleware/      # Express middleware
│       ├── routes/         # API route definitions
│       ├── services/       # Business logic
│       ├── utils/          # Utility functions
│       └── server.js       # Express entry point
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
└── package.json            # Frontend dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Frontend

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server (port 5173)
npm run dev
```

### Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start server (port 3001)
npm start

# Or with auto-reload
npm run dev
```

### Run Both

Open two terminals:

```bash
# Terminal 1 — Frontend
cd frontend
npm run dev

# Terminal 2 — Backend
cd backend
npm run dev
```

The frontend proxies `/api/*` requests to the backend at `http://localhost:3001`.

## API Endpoints

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| GET    | `/api/health`    | Health check             |
| GET    | `/api/products`  | List all products        |
| POST   | `/api/greeting`  | Get personalized greeting|

## Tech Stack

- **Frontend**: React 19, Vite, React Router, Tailwind CSS v4, Lucide Icons
- **Backend**: Node.js, Express.js
- **Styling**: Tailwind CSS v4 with custom Spoowa theme (oklch colors, custom animations)
