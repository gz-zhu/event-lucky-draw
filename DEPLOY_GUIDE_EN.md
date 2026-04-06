# 🚀 Event Lucky Draw — Deployment Guide

This guide walks you through setting up your own lucky draw system from scratch — local use, cloud deployment, and custom domain.

---

## 📦 How Data is Stored (Read This First)

> **All data is saved in your browser's `localStorage` on the machine running the draw. No account or cloud setup required.**

- Settings, name list, prize configurations, and winner records all live in the browser on your computer.
- Clearing browser data will erase records — **export CSV before clearing**.

### Display page sync

`/display.html` reads from the same `localStorage` and refreshes every 2 seconds.

- ✅ Open both pages in the **same browser on the same machine** → display syncs live
- ❌ Open display on a **different device or browser** → no sync (data is not shared across machines)

> **Event tip:** Run the draw on the operator's laptop. Open `/display.html` in a second tab on the same laptop, then extend that tab to a projector or secondary screen.

---

## Step 1: Install Required Tools

### Node.js 18.x (must be version 18)

| OS | Download |
|----|----------|
| Windows 64-bit | https://nodejs.org/download/release/v18.20.4/node-v18.20.4-x64.msi |
| Mac (Intel) | https://nodejs.org/download/release/v18.20.4/node-v18.20.4.pkg |
| Mac (M1/M2) | https://nodejs.org/download/release/v18.20.4/node-v18.20.4-arm64.pkg |

Verify after installation:
```bash
node -v   # Must show v18.x.x
```

### Git
- Windows: https://git-scm.com/download/win
- Mac: run `xcode-select --install` in Terminal

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

When you see `Done`, the build is complete. The `/dist` folder contains the deployable files.

### Local preview

```bash
yarn start
```

Open `http://localhost:8888` in your browser to use the app locally with full functionality.

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

1. Go to https://vercel.com → sign in with GitHub
2. **Add New Project** → select `my-lucky-draw`
3. Configure:
   - **Framework Preset**: Other
   - **Build Command**: `yarn build`
   - **Output Directory**: `dist`
4. Click **Deploy**
5. After deployment → **Settings** → **General** → **Node.js Version** → change to **20.x** → **Save**
6. Go to **Deployments** → click `...` on the latest entry → **Redeploy**

After successful deployment, you will get a URL like:
```
https://my-lucky-draw.vercel.app
```

> **Note:** Each user's browser has its own `localStorage`. Always open both the main draw page and the display page in the **same browser on the same computer**.

---

## Step 5: Customize Content

### Change the background image
Replace this file (keep the same filename):
```
src/assets/images/Cover.jpg
```

### Change the default event title
Open `src/pages/landing.pug` and find:
```pug
h1.title-text Lucky Draw
```
Change it to your event name. You can also change it live in Settings → **Draw Title**.

### Change the default prizes
Open `src/assets/js/PrizeManager.ts` and find:
```typescript
this.prizes = [
  { id: '1', name: '1st Prize', count: 1, winners: [] },
  { id: '2', name: '2nd Prize', count: 2, winners: [] },
  { id: '3', name: '3rd Prize', count: 5, winners: [] },
];
```
Change to your own prize names and counts. You can also add or edit prizes live in Settings → **Prize Settings**.

---

## Step 6: Rebuild and Push

Run after every code change:
```bash
yarn build
git add .
git commit -m "feat: customize for my event"
git push
```

Vercel will automatically redeploy.

---

## Step 7: Set Up a Custom Domain

### 7-1. Transfer DNS to Cloudflare (recommended)

1. Sign up at https://cloudflare.com (free)
2. **Add a Site** → enter your domain → select **Free**
3. After Cloudflare scans your DNS, click **Continue**
4. Note the two nameservers Cloudflare provides, e.g.:
   ```
   nina.ns.cloudflare.com
   rick.ns.cloudflare.com
   ```
5. Go to your domain registrar (Hostinger, GoDaddy, etc.) → **Nameservers** → replace with Cloudflare's
6. Wait 24–48 hours for propagation

### 7-2. Add a DNS record in Cloudflare

Cloudflare → **DNS** → **Add record**:
```
Type:   CNAME
Name:   draw
Target: cname.vercel-dns.com
Proxy:  OFF (gray cloud, not orange)
TTL:    Auto
```

### 7-3. Bind the domain in Vercel

1. Vercel → project → **Settings** → **Domains**
2. Enter `draw.yourdomain.com` → **Add**
3. Wait for **Valid Configuration** status
4. SSL is configured automatically

---

## Your URLs After Setup

```
https://draw.yourdomain.com              ← Main draw page
https://draw.yourdomain.com/display.html ← Display screen for projector
```

---

## How to Use the App

### 1. Add participants
Settings (⚙️ top right) → **Name List** → paste names one per line, or click **Upload CSV**.

CSV import supports multiple columns — all columns are merged into a single name per row.

Use the toolbar to **shuffle**, **mask all names**, **merge duplicates**, or **clear** the list.

Click **Save**. Past winners are automatically removed from the pool on import.

### 2. Configure prizes
Settings → **Prize Settings** → enter name and winner count per prize.
Optionally set a scheduled draw time and prize description (shown on the display page).
Click **Save**.

### 3. Set up a countdown (optional)
Settings → **Countdown Timer** → assign a duration to any prize.
On the countdown bar, enable **Auto** to trigger the draw automatically when time runs out.

### 4. Open the display page
Click the **📺 Display** link (bottom right) → opens `display.html` in a new tab.
**Must be on the same computer.** Extend or mirror that tab to your projector or secondary screen.

The display page shows: live winners, prize list with scheduled times, participant stats, and a live clock.

### 5. Draw
Click a prize button to select it → click **Draw** → winner appears 🎊

The winner's name is masked after the draw (privacy). A draw seed is shown for auditability.

### 6. View and export records
Click the ✅ icon (top right) → view all winners with timestamps and draw seeds → **Export CSV**.

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

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `node -v` shows v20+ | Reinstall Node.js 18.x from the link above |
| `yarn install` fails | Delete `node_modules` folder, then run `yarn install` again |
| `yarn` is not recognized | Run `npm install -g yarn`, then reopen the terminal |
| Vercel deploy fails | Set Node.js Version to **20.x** in Vercel project settings |
| Display page not syncing | Both pages must be open in the **same browser on the same computer** |
| Domain not working | DNS propagation can take up to 48 hours |
| Settings lost after closing browser | Do not use private/incognito mode; export CSV before closing |
| Page is blank after deploy | Run `yarn build` first, then push — Vercel deploys from the `/dist` folder |

---

## Advanced: Cross-Device Sync

If you need the display page to sync across different devices, the codebase includes a Firebase Realtime Database integration. It is pre-configured but not required — enable it by providing your own Firebase project credentials in `src/assets/js/PrizeManager.ts`.
