# RentEase Nepal — Deployment Guide (Vercel + Render)

This guide walks you through deploying **RentEase Nepal** for free using:

| Component | Platform | Free Tier |
|-----------|----------|-----------|
| **Frontend** (React) | [Vercel](https://vercel.com) | Yes |
| **Backend** (Express API) | [Render](https://render.com) | Yes |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) | Yes |

> **Why two platforms?** Vercel is ideal for React frontends. The Express backend uses file uploads (Multer) and needs a persistent server, which Render provides on its free tier.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Architecture Overview](#architecture-overview)
3. [Step 1: MongoDB Atlas Setup](#step-1-mongodb-atlas-setup)
4. [Step 2: Deploy Backend on Render (Free)](#step-2-deploy-backend-on-render-free)
5. [Step 3: Deploy Frontend on Vercel (Free)](#step-3-deploy-frontend-on-vercel-free)
6. [Step 4: Google OAuth Configuration](#step-4-google-oauth-configuration)
7. [Environment Variables Reference](#environment-variables-reference)
8. [Local Development](#local-development)
9. [Troubleshooting](#troubleshooting)
10. [Security Fixes Applied](#security-fixes-applied)

---

## Prerequisites

- GitHub account with the **Rentease_Nepal** repository
- [Vercel account](https://vercel.com/signup) (sign up with GitHub)
- [Render account](https://render.com/register) (sign up with GitHub)
- [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas/register)
- [Google Cloud Console](https://console.cloud.google.com) project for OAuth (optional, for Google Sign-In)

---

## Architecture Overview

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Vercel        │  HTTPS  │   Render         │         │  MongoDB Atlas  │
│   (React App)   │ ──────► │   (Express API)  │ ──────► │  (Database)     │
│   rentease.     │         │   api.onrender   │         │                 │
│   vercel.app    │         │   .com           │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

---

## Step 1: MongoDB Atlas Setup

> **If your old MongoDB is not working**, follow the full guide: **[MONGODB_SETUP_GUIDE.md](./MONGODB_SETUP_GUIDE.md)**

That guide covers creating a new free Atlas account, cluster, database user, network access, connection string, and testing — step by step with screenshots-style instructions.

### Quick summary

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a **free M0 cluster**
3. Create a **database user** (save username and password)
4. **Network Access** → Allow `0.0.0.0/0` (required for Render)
5. Copy connection string and set database name to `rentease_nepal`:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/rentease_nepal?retryWrites=true&w=majority
```

6. Add to `server/.env` (local) and Render Environment (production):

```env
MONGO_URL=mongodb+srv://...
MONGO_DB_NAME=rentease_nepal
```

7. Test: run `npm run dev` in `server/` — you should see `MongoDB connected: rentease_nepal`

### Common fix for broken old database

If the previous cluster (`aadarshmishra70`) was deleted or credentials expired:

1. Create a **new cluster** in Atlas (do not reuse the old connection string)
2. Create a **new database user** with a new password
3. Update `MONGO_URL` in both local `.env` and Render
4. Redeploy the Render backend

See [MONGODB_SETUP_GUIDE.md](./MONGODB_SETUP_GUIDE.md) for detailed troubleshooting.

---

## Step 2: Deploy Backend on Render (Free)

### Option A: Using render.yaml (Recommended)

1. Push this repository to GitHub (if not already)
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **New +** → **Blueprint**
4. Connect your GitHub repo **Rentease_Nepal**
5. Render will detect `render.yaml` automatically
6. Add these environment variables when prompted:

   | Variable | Value |
   |----------|-------|
   | `MONGO_URL` | Your MongoDB Atlas connection string |
   | `MONGO_DB_NAME` | `rentease_nepal` |
   | `JWT_SECRET` | A long random string (e.g. generate with `openssl rand -hex 32`) |
   | `GOOGLE_CLIENT_ID` | Your Google OAuth client ID |
   | `GOOGLE_CLIENT_SECRET` | Your Google OAuth client secret |
   | `CLIENT_URL` | `https://your-app.vercel.app` (update after Vercel deploy) |

7. Click **Apply** and wait for deployment (~5 minutes)
8. Note your backend URL: `https://rentease-nepal-api.onrender.com` (or similar)

### Option B: Manual Setup

1. Go to Render Dashboard → **New +** → **Web Service**
2. Connect your GitHub repo
3. Configure:
   - **Name:** `rentease-nepal-api`
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables (same as above)
5. Click **Create Web Service**

### Important Notes for Render Free Tier

- The server **spins down after 15 minutes** of inactivity
- First request after idle may take **30–60 seconds** (cold start)
- Uploaded images are stored on the server disk and **may be lost** on redeploy — for production, consider Cloudinary or AWS S3

---

## Step 3: Deploy Frontend on Vercel (Free)

### Using the Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your **Rentease_Nepal** GitHub repository
4. Configure the project:

   | Setting | Value |
   |---------|-------|
   | **Framework Preset** | Create React App |
   | **Root Directory** | `client` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `build` |
   | **Install Command** | `npm install` |

5. Add **Environment Variables**:

   | Name | Value |
   |------|-------|
   | `REACT_APP_API_URL` | `https://rentease-nepal-api.onrender.com` (your Render backend URL) |
   | `REACT_APP_GOOGLE_CLIENT_ID` | Your Google OAuth client ID |

6. Click **Deploy**
7. After deployment, copy your Vercel URL (e.g. `https://rentease-nepal.vercel.app`)

### Update Backend CORS

Go back to Render and update the `CLIENT_URL` environment variable:

```
CLIENT_URL=https://rentease-nepal.vercel.app,http://localhost:3000
```

Redeploy the backend service.

### Using Vercel CLI (Alternative)

```bash
npm install -g vercel
cd client
vercel login
vercel --prod
```

Set environment variables in the Vercel dashboard or via CLI:

```bash
vercel env add REACT_APP_API_URL
vercel env add REACT_APP_GOOGLE_CLIENT_ID
```

---

## Step 4: Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (or create one)
3. Go to **APIs & Services** → **Credentials**
4. Edit your **OAuth 2.0 Client ID**
5. Add **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://your-app.vercel.app
   ```
6. Add **Authorized redirect URIs** (if needed):
   ```
   http://localhost:3000
   https://your-app.vercel.app
   ```
7. Copy the **Client ID** and **Client Secret** for your environment variables

---

## Environment Variables Reference

### Frontend (`client/.env`)

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### Backend (`server/.env`)

```env
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/rentease_nepal?retryWrites=true&w=majority
MONGO_DB_NAME=rentease_nepal
JWT_SECRET=your-secure-random-secret
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
CLIENT_URL=http://localhost:3000
PORT=3001
```

> Copy from `.env.example` files and fill in your values. **Never commit `.env` files to Git.**

---

## Local Development

### 1. Install dependencies

```bash
# Backend
cd server
npm install
cp .env.example .env
# Edit .env with your values

# Frontend
cd ../client
npm install
cp .env.example .env
# Edit .env with your values
```

### 2. Start the backend

```bash
cd server
npm run dev
# Server runs at http://localhost:3001
```

### 3. Start the frontend

```bash
cd client
npm start
# App opens at http://localhost:3000
```

---

## Troubleshooting

### MongoDB connection fails

- Follow [MONGODB_SETUP_GUIDE.md](./MONGODB_SETUP_GUIDE.md) to create a new database
- Ensure `MONGO_URL` has the correct username, password, and cluster hostname
- URL-encode special characters in passwords (`@` → `%40`, `#` → `%23`)
- Atlas → Network Access must include `0.0.0.0/0`
- Check Render logs for `MongoDB connection failed` messages
- Visit `/health` — should show `"database": "connected"`

### GitHub security alert emails

This project includes npm `overrides` in `client/package.json` to fix `nth-check` and `postcss` vulnerabilities. After pulling updates, run:

```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

### CORS errors in browser

- Ensure `CLIENT_URL` on Render includes your exact Vercel URL (with `https://`)
- No trailing slash in URLs
- Redeploy backend after changing `CLIENT_URL`

### API requests fail / Network error

- Check `REACT_APP_API_URL` in Vercel environment variables
- Verify backend is running: visit `https://your-api.onrender.com/health`
- Render free tier: wait 30–60s on first request after idle

### Images not loading

- Images are served from the backend (`/uploads/...`)
- Ensure `REACT_APP_API_URL` points to the correct backend
- On Render free tier, uploaded files may be lost after redeploy

### Google Sign-In not working

- Verify `REACT_APP_GOOGLE_CLIENT_ID` matches Google Console
- Add your Vercel domain to Authorized JavaScript origins
- Check browser console for OAuth errors

### Build fails on Vercel

- Set **Root Directory** to `client`
- Ensure Node version is 18+ (set in Vercel project settings)
- Check build logs for missing environment variables

---

## Security Fixes Applied

The following GitHub Dependabot alerts have been resolved:

| Package | Issue | Fix |
|---------|-------|-----|
| `nth-check` < 2.0.1 | CVE-2021-3803 (High) | Forced to `^2.1.1` via npm overrides |
| `postcss` < 8.4.31 | CVE-2023-44270, CVE-2024-41305 (Moderate) | Forced to `^8.4.38` via npm overrides |

These overrides are in `client/package.json` under the `"overrides"` section.

---

## Vercel Free Tier Limits

| Resource | Free Tier |
|----------|-----------|
| Bandwidth | 100 GB/month |
| Build minutes | 6,000/month |
| Serverless executions | 100,000/month |
| Custom domains | Yes |
| HTTPS | Automatic |
| Preview deployments | Yes (per PR) |

Perfect for personal projects and portfolios.

---

## Quick Checklist

- [ ] MongoDB Atlas cluster created — see [MongoDB Setup Guide](./docs/MONGODB_SETUP_GUIDE.md)
- [ ] Backend deployed on Render with all env vars
- [ ] Frontend deployed on Vercel with `REACT_APP_API_URL` set
- [ ] `CLIENT_URL` on Render updated with Vercel URL
- [ ] Google OAuth origins updated with Vercel domain
- [ ] Test login, register, browse listings, and create listing
- [ ] GitHub security alerts resolved (no more Dependabot emails)

---

For platform features and user documentation, see [PLATFORM_USER_GUIDE.md](./PLATFORM_USER_GUIDE.md).
