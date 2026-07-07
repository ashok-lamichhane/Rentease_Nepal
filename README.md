# RentEase Nepal

A full-stack room and property rental platform (MERN stack) for booking hotels, rooms, flats, resorts, and tourist accommodations in Nepal.

## Features

- User registration and login (email/password + Google OAuth)
- Browse and search property listings by category
- Create and manage property listings (host)
- Book properties with date selection and price calculation
- Wish list, trip list, and reservation management
- Photo uploads for profiles and listings

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Redux, Material UI, SCSS |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT, Google OAuth |

## Project Structure

```
Rentease_Nepal/
├── client/          # React frontend
│   ├── src/
│   ├── public/
│   ├── vercel.json  # Vercel deployment config
│   └── .env.example
├── server/          # Express backend API
│   ├── routes/
│   ├── models/
│   └── .env.example
├── docs/
│   ├── MONGODB_SETUP_GUIDE.md # Create & host MongoDB Atlas (free)
│   ├── DEPLOYMENT_GUIDE.md    # Vercel + Render hosting guide
│   └── PLATFORM_USER_GUIDE.md # Full user & feature documentation
└── render.yaml      # Render backend deployment config
```

## Quick Start (Local)

```bash
# Backend
cd server
npm install
cp .env.example .env   # Add your MongoDB URL, JWT secret, etc.
npm run dev            # http://localhost:3001

# Frontend (new terminal)
cd client
npm install
cp .env.example .env   # REACT_APP_API_URL=http://localhost:3001
npm start              # http://localhost:3000
```

## Deploy for Free

| Service | Platform | Guide |
|---------|----------|-------|
| Frontend | Vercel | [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md#step-3-deploy-frontend-on-vercel-free) |
| Backend | Render | [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md#step-2-deploy-backend-on-render-free) |
| Database | MongoDB Atlas | [MongoDB Setup Guide](./docs/MONGODB_SETUP_GUIDE.md) |

## Documentation

- **[MongoDB Setup Guide](./docs/MONGODB_SETUP_GUIDE.md)** — Create and host a free MongoDB Atlas database (step-by-step)
- **[Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)** — Step-by-step Vercel + Render hosting (free tier)
- **[Platform User Guide](./docs/PLATFORM_USER_GUIDE.md)** — Features, user roles, booking flow, and navigation

## Security

Dependency vulnerabilities (`nth-check`, `postcss`) reported by GitHub Dependabot are fixed via npm overrides in `client/package.json`. Run `npm install` in the `client` folder after pulling updates.
