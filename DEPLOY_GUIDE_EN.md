# 🚀 Event Lucky Draw — Complete Deployment Guide

---

## Step 1: Install Required Tools

### Node.js 18.x (Must be version 18)

| OS | Download |
|------|----------|
| Windows 64-bit | https://nodejs.org/download/release/v18.20.4/node-v18.20.4-x64.msi |
| Mac (Intel) | https://nodejs.org/download/release/v18.20.4/node-v18.20.4.pkg |
| Mac (M1/M2) | https://nodejs.org/download/release/v18.20.4/node-v18.20.4-arm64.pkg |

Verify after installation:
```bash
node -v   # Must show v18.x.x
```

### Git
- Windows: https://git-scm.com/download/win
- Mac: Run `xcode-select --install` in terminal

### Yarn
```bash
npm install -g yarn
yarn -v   # Should show 1.x.x
```

---

## Step 2: Get the Code and Build

```bash
git clone https://github.com/gz-zhu/event-lucky-draw.git
cd event-lucky-draw
yarn install
yarn build
```

When you see `Done`, the build is successful.

---

## Step 3: Upload to Your Own GitHub

1. Sign up at https://github.com
2. Click **+** (top right) → **New repository**
3. Enter a name (e.g. `my-lucky-draw`) → **Create repository** (do not check any initialization options)
4. Run:

```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/my-lucky-draw.git
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy to Vercel

1. Go to https://vercel.com → Sign in with GitHub
2. **Add New Project** → Select `my-lucky-draw`
3. Configure:
   - **Framework Preset**: Other
   - **Build Command**: `yarn build`
   - **Output Directory**: `dist`
4. Click **Deploy**
5. After deployment → **Settings** → **General** → **Node.js Version** → Change to **20.x** → **Save**
6. Go to **Deployments** → click `...` on the latest entry → **Redeploy**

After successful deployment, you will get a URL like:
```
https://my-lucky-draw.vercel.app
```

---

## Step 5: Set Up Your Own Firebase (Required for Cross-Device Sync)

> ⚠️ You must create your own Firebase project. Otherwise, data will be shared with others.

1. Go to https://console.firebase.google.com
2. **Add project** → Enter a name → Disable Google Analytics → **Create project**
3. Left sidebar: **Realtime Database** → **Create database** → **Start in test mode** → **Enable**
4. Left sidebar: Gear icon → **Project settings** → Scroll down to **Your apps** → Click `</>` → Enter app name → **Register app**
5. Copy the `firebaseConfig` object

Open `src/assets/js/PrizeManager.ts`, find:
```typescript
const firebaseConfig = {
  apiKey: 'AIzaSy...',
  ...
};
```
Replace with your own `firebaseConfig`.

---

## Step 6: Customize Content

### Change Background Image
Replace this file (keep the same filename):
```
src/assets/images/Cover.jpg
```

### Change Event Title
Open `src/pages/landing.pug`, find:
```pug
h1.title-text Lucky Draw
```
Change to your event name.

### Change Default Prizes
Open `src/assets/js/PrizeManager.ts`, find:
```typescript
this.prizes = [
  { id: '1', name: '1st Prize', count: 1, winners: [] },
  { id: '2', name: '2nd Prize', count: 2, winners: [] },
  { id: '3', name: '3rd Prize', count: 5, winners: [] },
];
```
Change to your own prizes.

---

## Step 7: Rebuild and Push

Run after every change:
```bash
yarn build
git add .
git commit --no-verify -m "feat: customize for my event"
git push
```

Vercel will automatically redeploy.

---

## Step 8: Set Up Custom Domain

### 8-1. Transfer DNS to Cloudflare (Recommended)

1. Sign up at https://cloudflare.com (free)
2. **Add a Site** → Enter your domain → Select **Free**
3. After Cloudflare scans DNS, click **Continue**
4. Note the two Nameservers Cloudflare provides, e.g.:
   ```
   nina.ns.cloudflare.com
   rick.ns.cloudflare.com
   ```
5. Go to your domain registrar (Hostinger etc.) → **Nameservers** → Replace with Cloudflare's NS
6. Wait 24–48 hours for propagation

### 8-2. Add DNS Record in Cloudflare

Cloudflare → **DNS** → **Add record**:
```
Type:   CNAME
Name:   draw
Target: cname.vercel-dns.com
Proxy:  OFF (gray cloud, not orange)
TTL:    Auto
```

### 8-3. Bind Domain in Vercel

1. Vercel → Project → **Settings** → **Domains**
2. Enter `draw.yourdomain.com` → **Add**
3. Wait for **Valid Configuration** status
4. SSL is configured automatically

---

## Access After Setup

```
https://draw.yourdomain.com              ← Main draw page
https://draw.yourdomain.com/display.html ← Display screen
```

---

## Daily Update Commands

```bash
yarn build
git add .
git commit --no-verify -m "describe changes"
git push
# Vercel redeploys automatically
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `node -v` shows v20+ | Reinstall Node.js 18.x |
| `yarn install` fails | Run `rmdir /s /q node_modules` then reinstall |
| Vercel deploy fails | Set Node.js Version to 20.x in settings |
| Display page not syncing | Ensure you are using your own Firebase config |
| Domain not working | DNS propagation can take up to 48 hours |
