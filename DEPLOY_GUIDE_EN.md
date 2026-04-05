# 🚀 Event Lucky Draw — Complete Deployment Guide

This guide walks you through deploying your own lucky draw system from scratch.

**What you'll get:**
- 🏆 Multiple prize tiers with configurable names and winner counts
- 📂 Bulk import participants via CSV
- 📋 Winner records with timestamps and draw seeds — exportable as CSV
- 📺 Display page (`/display.html`) for projector / big screen — live winners and stats
- 🔢 Draw seed shown per draw for full auditability
- 🔒 Automatic winner name masking (privacy protection)
- 🚫 Auto-deduplication — past winners removed from the pool automatically
- ⚡ Interruption recovery — restores the pool if browser closes mid-draw
- 🎊 Confetti + star + festive lights animations

---

## 📦 How Data is Stored (Important)

> **All data is saved in your browser's `localStorage` on the machine running the draw.**

- No account or cloud setup required
- Settings, name list, prize records — everything lives in the browser on your computer
- Clearing browser data will erase all records (export CSV first if needed)

### Display page sync

`/display.html` reads from the same `localStorage` and refreshes automatically every 2 seconds.

**This means:**
- ✅ Open both pages in the **same browser on the same machine** → display syncs live
- ❌ Open display on a **different device or browser** → it will not receive updates (no data is shared across machines)

> **Tip for events:** Run the main draw page on the operator's laptop. Open `/display.html` in a second window or browser tab on the same laptop, then extend that display to a projector or secondary screen.

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

### Local preview

```bash
yarn start
```

Open your browser and go to `http://localhost:8888` to use the app locally with full functionality.

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

> **Note for Vercel deployments:** Each user's browser stores its own `localStorage`. Always open both the main draw page and the display page in the **same browser on the same computer** to ensure sync works correctly.

---

## Step 5: Customize Content

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

## Step 6: Rebuild and Push

Run after every change:
```bash
yarn build
git add .
git commit -m "feat: customize for my event"
git push
```

Vercel will automatically redeploy.

---

## Step 7: Set Up Custom Domain

### 7-1. Transfer DNS to Cloudflare (Recommended)

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

### 7-2. Add DNS Record in Cloudflare

Cloudflare → **DNS** → **Add record**:
```
Type:   CNAME
Name:   draw
Target: cname.vercel-dns.com
Proxy:  OFF (gray cloud, not orange)
TTL:    Auto
```

### 7-3. Bind Domain in Vercel

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
git commit -m "describe changes"
git push
# Vercel redeploys automatically
```

---

## How to Use the App

### 1. Add participants
Click ⚙️ **Settings** (top right) → **Name List**

Paste names one per line, or click **Upload CSV** to import a `.csv` file (first column used as names).

> Past winners are automatically removed from the pool on import.

Click **Save**.

### 2. Set up prizes
Settings → **Prize Settings**: enter prize name and winner count per prize → **Save**.

### 3. Open the display page on a projector
Click the **📺 Display** link (bottom right of the page) to open `display.html` in a new tab.

**Must be on the same computer:** Put this tab on a projector or secondary screen — it shows live winners, upcoming prizes, participant stats, and a clock, synced automatically.

### 4. Draw
Click a prize button to select it → Click **Draw** → Winner appears 🎊

The winner's name is partially masked after the draw (privacy). A draw seed is shown for auditability.

### 5. Records and export
Click the ✅ icon (top right) → view all winners with timestamps → **Export CSV** to download.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `node -v` shows v20+ | Reinstall Node.js 18.x |
| `yarn install` fails | Run `rmdir /s /q node_modules` then reinstall |
| Vercel deploy fails | Set Node.js Version to 20.x in settings |
| Display page not syncing | Make sure both pages are open in the **same browser on the same computer** |
| Domain not working | DNS propagation can take up to 48 hours |
| Settings lost after closing browser | Do not use private/incognito mode; export CSV before closing |

---

## Advanced: Cross-Device Sync (Self-Directed)

If you need the display page to sync across different devices, you can explore integrating Firebase Realtime Database or another real-time data store. The codebase includes a Firebase interface that is not enabled by default — feel free to extend it for your use case.
