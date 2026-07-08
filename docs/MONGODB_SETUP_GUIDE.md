# MongoDB Atlas Setup Guide (Free Hosting)

This guide shows you how to create a **new MongoDB Atlas database from scratch** and connect it to RentEase Nepal. Use this if your old MongoDB cluster is deleted, expired, or no longer working.

MongoDB Atlas is MongoDB’s official cloud hosting service. The **free M0 tier** is enough for this project.

---

## Table of Contents

1. [What You Will Get](#what-you-will-get)
2. [Step 1: Create a MongoDB Atlas Account](#step-1-create-a-mongodb-atlas-account)
3. [Step 2: Create a Free Cluster](#step-2-create-a-free-cluster)
4. [Step 3: Create a Database User](#step-3-create-a-database-user)
5. [Step 4: Allow Network Access](#step-4-allow-network-access)
6. [Step 5: Get Your Connection String](#step-5-get-your-connection-string)
7. [Step 6: Add Connection String to Your App](#step-6-add-connection-string-to-your-app)
8. [Step 7: Test the Connection](#step-7-test-the-connection)
9. [Step 8: View Your Data in Atlas](#step-8-view-your-data-in-atlas)
10. [Troubleshooting](#troubleshooting)

---

## What You Will Get

| Item | Example |
|------|---------|
| Cloud database | MongoDB Atlas (free) |
| Database name | `rentease_admin` |
| Collections | `users`, `listings`, `bookings` (created automatically) |
| Connection string | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/rentease_admin` |

---

## Step 1: Create a MongoDB Atlas Account

1. Open [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up using:
   - **Google account**, or
   - **Email and password**
3. Verify your email if asked
4. Complete the short onboarding survey (you can skip optional questions)

---

## Step 2: Create a Free Cluster

1. After login, you will land on the **Atlas Dashboard**
2. Click **Build a Database** (or **Create** if this is your first cluster)
3. Choose **M0 FREE** (Shared cluster)
4. Select a cloud provider and region:
   - **Provider:** AWS (recommended)
   - **Region:** Choose one close to you (e.g. `Mumbai (ap-south-1)` for Nepal/India)
5. **Cluster Name:** keep default `Cluster0` or use `rentease-cluster`
6. Click **Create Deployment**
7. Wait 1–3 minutes for the cluster to finish creating

> **Free tier limits:** 512 MB storage, shared resources. Enough for development and small production use.

---

## Step 3: Create a Database User

When the cluster is ready, Atlas may show a **Security Quickstart** popup. If not, follow these steps manually.

1. Go to **Database Access** (left sidebar → Security → Database Access)
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Set credentials:
   - **Username:** `rentease_admin` (or any name you prefer)
   - **Password:** click **Autogenerate Secure Password** and **copy it somewhere safe**
5. Under **Database User Privileges**, select **Read and write to any database**
6. Click **Add User**

> **Important:** Save the username and password. You cannot view the password again later.

---

## Step 4: Allow Network Access

Your backend (local machine or Render) must be allowed to connect to Atlas.

1. Go to **Network Access** (left sidebar → Security → Network Access)
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere**
   - This adds `0.0.0.0/0` (required for Render, Vercel, and changing home networks)
4. Click **Confirm**

> For production with a fixed server IP, you can restrict access later. For Render’s free tier, `0.0.0.0/0` is required.

---

## Step 5: Get Your Connection String

1. Go to **Database** (left sidebar → Deployment → Database)
2. Click **Connect** on your cluster
3. Choose **Drivers**
4. Set:
   - **Driver:** Node.js
   - **Version:** 5.5 or later (any recent version works)
5. Copy the connection string. It looks like:

```
mongodb+srv://rentease_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

6. Replace `<password>` with the database user password you saved in Step 3
7. Add your database name before the `?`:

```
mongodb+srv://rentease_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/rentease_admin?retryWrites=true&w=majority
```

### If your password has special characters

URL-encode these characters in the password:

| Character | Replace with |
|-----------|--------------|
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `%` | `%25` |
| `/` | `%2F` |
| `:` | `%3A` |

**Example:**
- Password: `MyP@ss#123`
- Encoded: `MyP%40ss%23123`
- Full URL: `mongodb+srv://rentease_admin:MyP%40ss%23123@cluster0.xxxxx.mongodb.net/rentease_admin?retryWrites=true&w=majority`

---

## Step 6: Add Connection String to Your App

### For local development

1. Open `server/.env` (create it from `server/.env.example` if needed):

```bash
cd server
cp .env.example .env
```

2. Edit `server/.env`:

```env
MONGO_URL=mongodb+srv://rentease_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/rentease_admin?retryWrites=true&w=majority
MONGO_DB_NAME=rentease_admin
JWT_SECRET=your-secure-random-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
CLIENT_URL=http://localhost:3000
PORT=3001
```

3. Generate a JWT secret (optional but recommended):

```bash
openssl rand -hex 32
```

Paste the output as `JWT_SECRET`.

### For Render (production backend)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Open your **rentease-nepal-api** service
3. Go to **Environment**
4. Update or add:

| Key | Value |
|-----|-------|
| `MONGO_URL` | Your full connection string from Step 5 |
| `MONGO_DB_NAME` | `rentease_admin` |

5. Click **Save Changes**
6. Render will redeploy automatically

---

## Step 7: Test the Connection

### Test locally

```bash
cd server
npm install
npm run dev
```

**Success:** You should see:
```
MongoDB connected: rentease_admin
Server Port: 3001
```

**Failure:** You will see an error message explaining what went wrong.

### Test on Render

1. Open your Render service URL + `/health`:
   ```
   https://your-api.onrender.com/health
   ```
2. You should see:
   ```json
   { "status": "ok", "database": "connected" }
   ```

### Test with registration

1. Start frontend: `cd client && npm start`
2. Go to `http://localhost:3000/register`
3. Create a test account
4. If registration succeeds, MongoDB is working

---

## Step 8: View Your Data in Atlas

1. Go to MongoDB Atlas → **Database**
2. Click **Browse Collections** on your cluster
3. Select database **`rentease_admin`**
4. You will see collections such as:
   - `users` — registered accounts
   - `listings` — property listings
   - `bookings` — reservations

Data appears after you use the app (register, create listing, book, etc.).

---

## Troubleshooting

### Error: `MongoServerError: bad auth : Authentication failed`

- Username or password is wrong
- Password contains special characters — URL-encode them (see Step 5)
- You copied the password with extra spaces

**Fix:** Reset the database user password in Atlas → Database Access → Edit User → Edit Password.

---

### Error: `Could not connect to any servers in your MongoDB Atlas cluster`

- Network Access does not include `0.0.0.0/0`
- Cluster is still starting (wait 2–3 minutes)
- Wrong cluster hostname in connection string

**Fix:** Atlas → Network Access → Add `0.0.0.0/0`.

---

### Error: `querySrv ENOTFOUND` or `getaddrinfo ENOTFOUND`

- Connection string is malformed
- Cluster was deleted or paused

**Fix:** Create a new cluster and generate a new connection string.

---

### Old MongoDB cluster no longer works

Common reasons:
- Free cluster was deleted after long inactivity
- Atlas account was on a different email
- Password was changed or lost
- Cluster was paused and never resumed

**Fix:** Follow this guide from Step 2 to create a **new cluster** and update `MONGO_URL` everywhere (local `.env` and Render).

---

### App works locally but not on Render

- `MONGO_URL` not set on Render
- Old connection string still on Render
- Forgot to redeploy after changing env vars

**Fix:**
1. Render → your service → Environment
2. Update `MONGO_URL` and `MONGO_DB_NAME`
3. Manual Deploy → Deploy latest commit

---

### Database name: what to use?

This project uses `rentease_admin` by default. You can change it with the `MONGO_DB_NAME` environment variable.

- In connection string: `...mongodb.net/rentease_admin?retryWrites=...`
- In `.env`: `MONGO_DB_NAME=rentease_admin`

Both should match.

---

## Quick Checklist

- [ ] MongoDB Atlas account created
- [ ] Free M0 cluster created and running
- [ ] Database user created (username + password saved)
- [ ] Network Access allows `0.0.0.0/0`
- [ ] Connection string copied and password replaced
- [ ] Database name `rentease_admin` added to connection string
- [ ] `MONGO_URL` set in `server/.env` (local)
- [ ] `MONGO_URL` set in Render Environment (production)
- [ ] Backend starts without MongoDB errors
- [ ] Test registration works

---

## Next Steps

After MongoDB is working:

1. Deploy backend on Render — [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#step-2-deploy-backend-on-render-free)
2. Deploy frontend on Vercel — [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#step-3-deploy-frontend-on-vercel-free)
