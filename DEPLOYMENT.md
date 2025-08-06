# 🚀 Deployment Guide

This guide will walk you through deploying your Live Auction System to GitHub and Vercel.

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier available)
- MongoDB Atlas account (for database)

## 🔗 Step 1: Create GitHub Repository

### Option A: Using GitHub Web Interface (Recommended)

1. **Go to GitHub.com** and sign in to your account
2. **Click the "+" icon** in the top right corner
3. **Select "New repository"**
4. **Fill in the details:**
   - Repository name: `live-auction-system`
   - Description: `Real-time auction platform built with MERN stack`
   - Make it **Public** (for free Vercel deployment)
   - **Don't** initialize with README (we already have one)
5. **Click "Create repository"**

### Option B: Using GitHub CLI (if installed)

```bash
# Install GitHub CLI first
brew install gh

# Login to GitHub
gh auth login

# Create repository
gh repo create live-auction-system --public --description "Real-time auction platform built with MERN stack"
```

## 📤 Step 2: Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/live-auction-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🌐 Step 3: Deploy Backend to Railway/Render

### Option A: Railway (Recommended)

1. **Go to [Railway.app](https://railway.app)** and sign up with GitHub
2. **Click "New Project"** → "Deploy from GitHub repo"
3. **Select your repository**
4. **Set the root directory** to `auction-backend`
5. **Add environment variables:**
   ```
   PORT=3001
   MONGODB_URI=mongodb+srv://shahidtechtics:1RNb9n6ElkWZQ6rC@cluster0.jcvthiv.mongodb.net/auction_system?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=live-auction-system-2024-super-secret-jwt-key-production-ready
   JWT_EXPIRE=24h
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   AUCTION_DURATION=300000
   BID_EXTENSION_TIME=30000
   ```
6. **Deploy** and note the generated URL

### Option B: Render

1. **Go to [Render.com](https://render.com)** and sign up
2. **Click "New"** → "Web Service"
3. **Connect your GitHub repository**
4. **Configure:**
   - Name: `live-auction-backend`
   - Root Directory: `auction-backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Add environment variables** (same as above)
6. **Deploy** and note the URL

## 🎨 Step 4: Deploy Frontend to Vercel

1. **Go to [Vercel.com](https://vercel.com)** and sign up with GitHub
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   - Framework Preset: `Create React App`
   - Root Directory: `auction-simulcast`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. **Add environment variables:**
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   REACT_APP_WS_URL=https://your-backend-url.railway.app
   ```
6. **Deploy**

## 🔧 Step 5: Update Frontend Configuration

After getting your backend URL, you need to update the frontend configuration:

### Update API Service
Edit `auction-simulcast/src/services/ApiService.ts`:

```typescript
// Change this line:
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// To your production backend URL:
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.railway.app';
```

### Update WebSocket Service
Edit `auction-simulcast/src/services/WebSocketService.ts`:

```typescript
// Change this line:
const SOCKET_URL = 'http://localhost:3001';

// To your production backend URL:
const SOCKET_URL = process.env.REACT_APP_WS_URL || 'https://your-backend-url.railway.app';
```

### Update Backend CORS
In your backend environment variables, update:
```
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

## 🗄️ Step 6: Set Up MongoDB Atlas

1. **Go to [MongoDB Atlas](https://mongodb.com/atlas)**
2. **Create a free cluster**
3. **Set up database access:**
   - Create a database user with read/write permissions
   - Note the username and password
4. **Set up network access:**
   - Add `0.0.0.0/0` to allow connections from anywhere
5. **Get connection string:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
6. **Add to backend environment variables:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auction_system
   ```

## 🌱 Step 7: Seed the Database

After your backend is deployed:

1. **Go to your backend deployment URL**
2. **Add `/api/health`** to check if it's running
3. **Seed the database** by visiting: `https://your-backend-url.railway.app/api/seed` (if you add this endpoint)

Or manually seed using MongoDB Compass or Atlas interface.

## 🔄 Step 8: Update and Redeploy

After making configuration changes:

```bash
# Commit your changes
git add .
git commit -m "Update configuration for production deployment"
git push

# Vercel will automatically redeploy
# Railway/Render will also auto-deploy
```

## ✅ Step 9: Test Your Deployment

1. **Visit your Vercel frontend URL**
2. **Test the login** with demo credentials:
   - Admin: `admin` / `admin123`
   - User: `john_doe` / `password123`
3. **Test real-time bidding** by opening multiple tabs
4. **Verify mobile responsiveness**

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure CORS_ORIGIN in backend matches your frontend URL exactly
   - Include protocol (https://)

2. **WebSocket Connection Issues**
   - Check if your backend supports WebSocket over HTTPS
   - Verify the WebSocket URL is correct

3. **Database Connection Issues**
   - Verify MongoDB Atlas network access allows connections from your backend
   - Check connection string format

4. **Environment Variables**
   - Ensure all environment variables are set correctly
   - Check for typos in variable names

### Debug Steps

1. **Check backend logs** in Railway/Render dashboard
2. **Check frontend console** for errors
3. **Verify API endpoints** are accessible
4. **Test WebSocket connection** manually

## 📱 Mobile Testing

1. **Test on different devices** using your Vercel URL
2. **Verify responsive design** works correctly
3. **Test touch interactions** and mobile menu
4. **Check performance** on slower connections

## 🔒 Security Considerations

1. **Use strong JWT secrets** in production
2. **Enable HTTPS** (automatic with Vercel/Railway)
3. **Set up proper CORS** origins
4. **Consider rate limiting** for production use
5. **Monitor logs** for suspicious activity

## 📊 Monitoring

1. **Set up Vercel Analytics** for frontend monitoring
2. **Use Railway/Render logs** for backend monitoring
3. **Monitor MongoDB Atlas** for database performance
4. **Set up alerts** for downtime

---

**🎉 Congratulations! Your Live Auction System is now deployed and ready for use!** 