# 🎰 Event Lucky Draw

A beautiful lucky draw app for events — prize tiers, winner records, CSV import, and festive animations.

抽選アプリ。賞ごとに当選者を抽選・記録できます。CSV インポート、紙吹雪、彩燈アニメーション付き。

---

## ✨ Features / 機能

- 🏆 Multiple prize tiers (1st, 2nd, 3rd …) with configurable winner count
- 📂 Import participant list via CSV or paste directly
- 📋 Winner records with timestamp and draw seed — exportable as CSV
- 🎊 Confetti + star + festive lights animations
- 📺 Separate display page for projector / big screen (`/display.html`)
- 🔢 Draw seed shown per draw for full auditability
- 🔒 Automatic winner name masking after draw (privacy protection)
- 🚫 Auto-deduplication — past winners removed from participant pool automatically
- ⚡ Interruption recovery — restores the pool if browser closes mid-draw
- 🕐 Live clock and date display
- ⏱ Per-prize countdown timer with auto-draw option
- 🖥️ Fullscreen mode
- 💾 All settings auto-saved in your browser
- 🔊 Sound effects (spinning + win fanfare)
- 👁 Name list privacy tools — mask, shuffle, merge duplicates

---

## 📦 How Data is Stored

> **All data is saved in your browser's `localStorage` on the machine running the draw.**

- No account or cloud setup required
- Settings, name list, prize records — everything lives in the browser on your computer
- Clearing browser data will erase all records (export CSV first if needed)

### Display page sync

`/display.html` reads from the same `localStorage` and refreshes automatically every 2 seconds.

**This means:**
- ✅ Open both pages in the **same browser on the same machine** → display syncs live
- ❌ Open display on a **different device or browser** → it will not receive updates (no data is shared across machines in the base configuration)

> **Tip for events:** Run the main draw page on the operator's laptop. Open `/display.html` in a second window or browser tab on the same laptop, then extend that display to a projector or secondary screen.

---

## ⚡ Quick Commands / よく使うコマンド

```bash
# Start local dev server / ローカル起動
yarn start

# Build for production / 本番ビルド
yarn build

# Install dependencies / 依存関係インストール
yarn install
```

> 🌐 Local preview runs at: **http://localhost:8888**

**Upload changes to GitHub:**
```bash
git add .
git commit -m "describe what changed"
git push
```

---

## 🚀 Deployment Guide / デプロイガイド

For full deployment instructions (local / Vercel / custom domain), see the guide for your language:

| Language | File |
|----------|------|
| 中文 | [DEPLOY_GUIDE_ZH.md](./DEPLOY_GUIDE_ZH.md) |
| English | [DEPLOY_GUIDE_EN.md](./DEPLOY_GUIDE_EN.md) |
| 日本語 | [DEPLOY_GUIDE_JA.md](./DEPLOY_GUIDE_JA.md) |

---

## 🎮 How to Use / 使い方

### 1. Add participants / 参加者を追加
Click ⚙️ **Settings** (top right) → **Name List**

Paste names one per line, or click **Upload CSV** to import a `.csv` file.
(First column of CSV will be used as names.)

> Any name that has already won a prize is automatically removed from the pool on import.

Use the toolbar buttons to **shuffle**, **merge duplicates**, **mask names**, or **clear** the list.

Click **Save**.

### 2. Set up prizes / 賞を設定
In Settings → **Prize Settings**: set name and winner count per prize. Click **Save**.

### 3. Open the display page on a projector
Click the **📺 Display** link (bottom right of the page) to open `display.html` in a new tab **on the same computer**.

Extend or mirror that tab to your projector or secondary screen. The display page shows live winners, upcoming prizes, participant stats, and a clock — synced automatically as long as it runs in the same browser.

### 4. Draw / 抽選
Click a prize button to select it → Click **Draw** → Winner appears 🎊

### 5. Auto Draw (Countdown)
In Settings → **Countdown Timer**: assign a duration to a prize.
When the countdown bar appears, enable **Auto** — the draw will trigger automatically when time runs out.

### 6. Records / 記録
Click ✅ icon (top right) → view all winners with timestamps → **Export CSV** to download.

---

## 🖼️ Change Background / 背景を変更

Replace `src/assets/images/Cover.jpg` with your own image (same filename), then rebuild:
```bash
yarn build
```

---

## ❓ Troubleshooting / よくある問題

### ❌ `node -v` shows v20 / v22 (wrong version)
Reinstall Node.js **v18.x** from:
- Windows: `https://nodejs.org/download/release/v18.20.4/node-v18.20.4-x64.msi`
- Mac (Intel): `https://nodejs.org/download/release/v18.20.4/node-v18.20.4.pkg`
- Mac (M1/M2): `https://nodejs.org/download/release/v18.20.4/node-v18.20.4-arm64.pkg`

### ❌ `yarn install` fails
```bash
# Windows:
rmdir /s /q node_modules
yarn install

# Mac:
rm -rf node_modules
yarn install
```

### ❌ `yarn` is not recognized
```bash
npm install -g yarn
```
Close and reopen terminal.

### ❌ Page is blank after deployment
Run `yarn build` first, then upload the `/dist` folder.

### ❌ Display page not updating
Make sure both the main page and display page are open in the **same browser on the same computer**.

### ❌ Settings lost after closing browser
Do not use private/incognito mode. Export your winner records as CSV before closing.

---

## 🛠️ Tech Stack

TypeScript · Pug · SCSS · Webpack · Web Animations API · AudioContext API · Canvas API

---

## 📄 License

Based on [random-name-picker](https://github.com/icelam/random-name-picker) by [Ice Lam](https://github.com/icelam), MIT License.

---

## 👤 Maintainer

**gz-zhu** — [github.com/gz-zhu](https://github.com/gz-zhu)
