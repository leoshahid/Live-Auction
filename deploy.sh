#!/bin/bash

# 🚀 Live Auction System Deployment Script
# This script helps you deploy your application to GitHub and Vercel

echo "🚗 Live Auction System - Deployment Script"
echo "=========================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please run 'git init' first."
    exit 1
fi

# Check if remote origin is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No remote origin found."
    echo "Please create a GitHub repository and add it as origin:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/live-auction-system.git"
    echo ""
    read -p "Press Enter to continue after adding the remote..."
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Found uncommitted changes. Committing them..."
    git add .
    git commit -m "Update before deployment"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Code pushed to GitHub successfully!"
echo ""
echo "🌐 Next Steps:"
echo "1. Go to https://vercel.com and sign up with GitHub"
echo "2. Import your repository"
echo "3. Set root directory to: auction-simulcast"
echo "4. Set build command to: npm run build"
echo "5. Set output directory to: build"
echo "6. Add environment variables:"
echo "   - REACT_APP_API_URL=https://your-backend-url.railway.app/api"
echo "   - REACT_APP_WS_URL=https://your-backend-url.railway.app"
echo ""
echo "🔧 Backend Environment Variables:"
echo "   - MONGODB_URI=mongodb+srv://shahidtechtics:1RNb9n6ElkWZQ6rC@cluster0.jcvthiv.mongodb.net/auction_system?retryWrites=true&w=majority&appName=Cluster0"
echo "   - JWT_SECRET=live-auction-system-2024-super-secret-jwt-key-production-ready"
echo "   - CORS_ORIGIN=https://your-frontend-domain.vercel.app"
echo ""
echo "🔧 For backend deployment:"
echo "1. Go to https://railway.app and sign up with GitHub"
echo "2. Deploy from your repository"
echo "3. Set root directory to: auction-backend"
echo "4. Add environment variables (see DEPLOYMENT.md)"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🎉 Happy deploying!" 