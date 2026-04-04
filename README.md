# 🎰 Event Lucky Draw

A beautiful lucky draw app for events — prize tiers, winner records, CSV import, and festive animations.

抽選アプリ。賞ごとに当選者を抽選・記録できます。CSV インポート、紙吹雪、彩燈アニメーション付き。

---

## ✨ Features / 機能

- 🏆 Multiple prize tiers (1st, 2nd, 3rd …) with configurable winner count
- 📂 Import participant list via CSV
- 📋 Winner records with timestamp and draw seed — exportable as CSV
- 🎊 Confetti + star + festive lights animations
- 🔥 Firebase real-time sync — winners update across all devices instantly
- 📺 Separate display page for projector / big screen (`/display.html`)
- 🔢 Draw seed shown per draw for full auditability
- 🔒 Automatic winner name masking after draw (privacy protection)
- 🚫 Auto-deduplication — past winners removed from participant pool automatically
- ⚡ Interruption recovery — restores the pool if browser closes mid-draw
- 🕐 Live clock and date display
- 🖥️ Fullscreen mode
- 💾 Auto-saves all settings in browser
- 🖼️ Custom background image support
- 🔊 Sound effects (spinning + win fanfare)
- 🚦 Buttons locked during spin to prevent draw errors

---

## ⚡ Quick Commands / よく使うコマンド

```bash
# Start local dev server / ローカル起動
yarn start

# Build for production / 本番ビルド
yarn build

# Install dependencies / 依存関係インストール
yarn install

# Force reinstall (when things break) / 再インストール
rmdir /s /q node_modules && yarn install   # Windows
rm -rf node_modules && yarn install        # Mac
```

**Upload changes to GitHub / GitHub に更新をアップロード:**
```bash
git add .
git commit --no-verify -m "describe what changed"
git push
```

**Common commit message prefixes:**

| Prefix | Use for |
|--------|---------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `style:` | Visual changes |
| `docs:` | README / documentation |
| `chore:` | Maintenance |

> 🌐 Local preview runs at: **http://localhost:8888**

---

## 🚀 Deployment Guide / デプロイガイド

For full deployment instructions (Vercel + Firebase + custom domain), see the guide for your language:

| Language | File |
|----------|------|
| 中文 | [DEPLOY_GUIDE_ZH.md](./DEPLOY_GUIDE_ZH.md) |
| English | [DEPLOY_GUIDE_EN.md](./DEPLOY_GUIDE_EN.md) |
| 日本語 | [DEPLOY_GUIDE_JA.md](./DEPLOY_GUIDE_JA.md) |

**Quick local preview:**
```bash
yarn start
```
Open: **http://localhost:8888**

---

## 🎮 How to Use / 使い方

### 1. Add participants / 参加者を追加
Click ⚙️ **Settings** (top right) → **Name List**

Paste names one per line, or click **Upload CSV** to import a `.csv` file.
(First column of CSV will be used as names.)

> Any name that has already won a prize is automatically removed from the pool on import.

Click **Save**.

### 2. Set up prizes / 賞を設定
In Settings → **Prize Settings**: set name and winner count per prize. Click **Save**.

### 3. (Optional) Open the display page on a projector / 大画面表示
Click the **📺 Display** link (top of the page) to open `display.html` in a new tab.
Put this tab on a projector or secondary screen — it shows live winners, upcoming prizes, participant stats, and a clock, all synced in real time via Firebase.

### 4. Draw / 抽選
Click a prize button to select it → Click **Draw** → Winner appears 🎊

The winner's name is partially masked immediately after the draw (privacy).
A **draw seed** is shown for auditability.

### 5. Records / 記録
Click ✅ icon (top right) → view all winners with timestamps → **Export CSV** to download.

---

## 🖼️ Change Background / 背景を変更

Replace `src/assets/images/Cover.jpg` with your own image (same filename), then:
```bash
yarn build
```

---

## ❓ Troubleshooting / よくある問題と解決策

---

### ❌ `node -v` shows v20 / v22 / v24 (wrong version)

**Option A — Uninstall and reinstall:**
- Windows: Control Panel → Uninstall Node.js → reinstall v18 from link above
- Mac: `sudo rm -rf /usr/local/{bin/{node,npm},lib/node_modules/npm,lib/node}` then reinstall

**Option B — Use nvm:**
```bash
nvm install 18
nvm use 18
node -v  # should show v18.x.x
```

---

### ❌ `yarn install` fails with `node-sass` error

```
error /node_modules/node-sass: Command failed
```

Check Node version first:
```bash
node -v  # must be v18.x.x
```

Then try:
```bash
# Windows:
rmdir /s /q node_modules
yarn install

# Mac:
rm -rf node_modules
yarn install
```

---

### ❌ `yarn` is not recognized

```bash
npm install -g yarn
```
Close and reopen terminal.

---

### ❌ `webpack` is not recognized after `yarn install`

```bash
# Windows:
rmdir /s /q node_modules
yarn install
yarn build

# Mac:
rm -rf node_modules
yarn install
yarn build
```

---

### ❌ `git` is not recognized

- Windows: Download from https://git-scm.com/download/win and reinstall
- Close and reopen terminal after install

---

### ❌ Page is blank after deployment

Make sure you uploaded the `/dist` folder (not the root project folder).
Run `yarn build` first if `/dist` doesn't exist.

---

### ❌ CSV file not loading names correctly

- Open your CSV in Excel
- Make sure names are in **Column A** (first column)
- Save as `.csv` format and try again

---

### ❌ Settings not saving after refresh

- Try Chrome browser
- Make sure you are not in private/incognito mode

---

## 🛠️ Tech Stack

TypeScript · Pug · SCSS · Webpack · Web Animations API · AudioContext API · Canvas API

---

## 📄 License

Based on [random-name-picker](https://github.com/icelam/random-name-picker) by [Ice Lam](https://github.com/icelam), MIT License.

---

## 👤 Maintainer

**gz-zhu** — [github.com/gz-zhu](https://github.com/gz-zhu)