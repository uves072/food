# Free External Hosting Guide - Food Ordering App

## 📦 What We Need to Deploy:
1. **Backend** - FastAPI (Python)
2. **Frontend** - Expo App (React Native)
3. **Database** - MongoDB

---

## 🎯 Best Free Hosting Combination

### Option 1: Railway + Vercel + MongoDB Atlas (Recommended)
- **Backend**: Railway.app (Free $5 credit monthly)
- **Frontend**: Vercel (Unlimited free)
- **Database**: MongoDB Atlas (512MB free forever)

### Option 2: Render + Vercel + MongoDB Atlas
- **Backend**: Render.com (Free tier)
- **Frontend**: Vercel (Unlimited free)
- **Database**: MongoDB Atlas (512MB free forever)

---

## 🗄️ Step 1: Database Setup (MongoDB Atlas - Free Forever)

### Create Account:
1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Sign up (Google/Email)
3. Choose **Free M0** cluster
4. Select region (closest to you)
5. Cluster name: `food-ordering-db`
6. Click "Create"

### Get Connection String:
1. Click **"Connect"**
2. Choose **"Connect your application"**
3. Copy connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/food_ordering?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your credentials

### Security Setup:
1. **Database Access**: Create user with password
2. **Network Access**: Add IP `0.0.0.0/0` (allow from anywhere)

---

## 🔧 Step 2: Backend Deployment (Railway.app)

### A. Prepare Backend Files

**Create: `/app/backend/railway.json`**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn server:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Create: `/app/backend/Procfile`**
```
web: uvicorn server:socket_app --host 0.0.0.0 --port $PORT
```

**Update: `/app/backend/server.py`** (Add at top)
```python
import os
PORT = int(os.environ.get("PORT", 8001))
```

**Update: Run command** (at bottom of server.py)
```python
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(socket_app, host="0.0.0.0", port=PORT)
```

### B. Deploy to Railway

1. **Visit**: https://railway.app
2. **Sign up** with GitHub
3. Click **"New Project"**
4. Choose **"Deploy from GitHub repo"**
5. Connect your GitHub account
6. Push code to GitHub first:

```bash
cd /app
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

7. Select repository
8. Railway will auto-detect Python
9. **Add Environment Variables**:
   - `MONGO_URL`: Your MongoDB Atlas connection string
   - `DB_NAME`: `food_ordering`
   - `PORT`: `8001`

10. Click **"Deploy"**
11. Get your backend URL: `https://your-app.up.railway.app`

### Railway Free Tier Limits:
- $5 credit per month (enough for small apps)
- 500 hours/month
- Auto-sleeps after 15 mins of inactivity

---

## 🚀 Step 3: Frontend Deployment (Vercel)

### A. Prepare Frontend

**Update: `/app/frontend/.env.production`**
```
EXPO_PUBLIC_BACKEND_URL=https://your-backend.up.railway.app
```

**Create: `/app/frontend/vercel.json`**
```json
{
  "buildCommand": "npx expo export -p web",
  "outputDirectory": "dist",
  "devCommand": "npx expo start --web",
  "framework": "nextjs"
}
```

### B. Deploy to Vercel

**Method 1: Vercel CLI (Recommended)**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd /app/frontend
vercel

# Follow prompts:
# - Project name: food-ordering-app
# - Directory: ./
# - Build command: npx expo export -p web
# - Output directory: dist

# Production deployment
vercel --prod
```

**Method 2: Vercel Website**
1. Visit: https://vercel.com
2. Sign up with GitHub
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Configure:
   - Framework: Other
   - Build Command: `npx expo export -p web`
   - Output Directory: `dist`
   - Root Directory: `frontend`
6. Add Environment Variables:
   - `EXPO_PUBLIC_BACKEND_URL`: Your Railway backend URL
7. Click **"Deploy"**

### Get Your Live URL:
- Vercel will give you: `https://your-app.vercel.app`
- Free custom domain support
- Auto SSL certificate

---

## 🔄 Alternative Option 2: Render.com

### Backend on Render (Free Tier)

1. **Visit**: https://render.com
2. Sign up
3. Click **"New +"** → **"Web Service"**
4. Connect GitHub repo
5. Configure:
   - **Name**: food-ordering-backend
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:socket_app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free
6. Add Environment Variables:
   - `MONGO_URL`: Your MongoDB connection string
   - `DB_NAME`: food_ordering
7. Click **"Create Web Service"**

**Render Free Tier:**
- Sleeps after 15 mins of inactivity
- Wakes up on first request (takes 30 seconds)
- 750 hours/month free

---

## 📱 Step 4: Mobile App (Expo Updates)

### Update Backend URL in Mobile App

**File: `/app/frontend/utils/api.ts`**
```typescript
const BACKEND_URL = 'https://your-backend.up.railway.app';
const API_BASE = `${BACKEND_URL}/api`;
```

### Rebuild APK (if needed)
```bash
cd /app/frontend
eas build --platform android --profile production
```

---

## 🔗 Final Setup Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Backend deployed to Railway/Render
- [ ] Backend URL working: `https://your-backend.railway.app/api/health`
- [ ] Frontend deployed to Vercel
- [ ] Frontend URL working: `https://your-app.vercel.app`
- [ ] Environment variables configured
- [ ] Test customer flow (menu → cart → order)
- [ ] Test admin login
- [ ] Test real-time orders

---

## 🎯 Quick Deployment Commands

```bash
# 1. Push to GitHub
cd /app
git init
git add .
git commit -m "Food ordering app"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main

# 2. Deploy Backend (Railway)
# → Go to railway.app
# → New Project → Deploy from GitHub
# → Select repo → Add env variables → Deploy

# 3. Deploy Frontend (Vercel)
cd /app/frontend
npm install -g vercel
vercel login
vercel --prod

# 4. Test
curl https://your-backend.railway.app/api/health
open https://your-app.vercel.app
```

---

## 💡 Pro Tips

### Keep Free Apps Active:
1. **Use Cron Jobs** to ping your backend every 10 minutes:
   - UptimeRobot.com (free monitoring)
   - Cron-job.org (free cron service)

2. **Ping URL**:
   ```
   https://your-backend.railway.app/api/health
   ```

### Custom Domain (Free):
- **Vercel**: Supports custom domains (free SSL)
- **Railway**: Supports custom domains (free SSL)

---

## 🆓 Cost Summary

| Service | Cost | Limits |
|---------|------|--------|
| MongoDB Atlas | FREE forever | 512MB storage |
| Railway | $5 credit/month | 500 hours/month |
| Render | FREE | Sleeps after 15 mins |
| Vercel | FREE | Unlimited deployments |
| **Total** | **₹0 / $0** | **Perfect for restaurants** |

---

## 🔧 Troubleshooting

### Backend not working?
```bash
# Check logs on Railway dashboard
# Or test locally:
curl https://your-backend.railway.app/api/health
```

### Frontend not loading?
- Check build logs on Vercel
- Verify EXPO_PUBLIC_BACKEND_URL is correct
- Check browser console for errors

### Database connection issues?
- Verify MongoDB connection string
- Check IP whitelist (0.0.0.0/0)
- Test connection:
```bash
mongosh "your-connection-string"
```

---

## 🚀 You're Live!

After deployment:
- **Customer URL**: https://your-app.vercel.app/customer/menu
- **Admin URL**: https://your-app.vercel.app/admin/login
- **Backend API**: https://your-backend.railway.app/api

**Print QR codes pointing to customer URL and place on tables!**

---

## 📞 Need Help?

If stuck:
1. Check Railway/Vercel deployment logs
2. Test backend API with Postman
3. Verify all environment variables
4. Check MongoDB connection

**Your app will be 100% FREE and live 24/7!** 🎉
