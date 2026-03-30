# 🎰 Event Lucky Draw

A beautiful lucky draw app for events — prize tiers, winner records, CSV import, and festive animations.

抽選アプリ。賞ごとに当選者を抽選・記録できます。CSV インポート、紙吹雪、彩燈アニメーション付き。

---

## ✨ Features / 機能

- 🏆 Multiple prize tiers (1st, 2nd, 3rd …)
- 👥 Set winner count per prize
- 📂 Import participant list via CSV file
- 📋 Winner records panel with CSV export
- 🎊 Confetti + festive lights animation
- 💾 Auto-saves settings in browser
- 🖼️ Custom background image support
- 📺 Live winner ticker bar at the top

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

---

### ✅ Step 0 — Install required tools / 必要ツールのインストール

---

#### 1. Node.js — ⚠️ Must be version 18.x / 必ずバージョン 18.x を使用

> ⚠️ **This project only works with Node.js 18.x.**
> Do NOT install v20, v22, or v24 — they are incompatible.
>
> ⚠️ **このプロジェクトは Node.js 18.x のみ対応しています。**
> v20、v22、v24 はインストールしないでください。

**Download Node.js 18 LTS directly:**

| OS | Link |
|----|------|
| Windows (64-bit) | https://nodejs.org/download/release/v18.20.4/node-v18.20.4-x64.msi |
| Mac (Intel) | https://nodejs.org/download/release/v18.20.4/node-v18.20.4.pkg |
| Mac (Apple Silicon M1/M2) | https://nodejs.org/download/release/v18.20.4/node-v18.20.4-arm64.pkg |

**Windows install steps:**
1. Download the `.msi` file above
2. Double-click to run the installer
3. Keep all default settings → click **Next** → **Install**
4. **Restart your terminal** after installation

**Mac install steps:**
1. Download the `.pkg` file above
2. Double-click to run the installer
3. Follow the prompts → click **Continue** → **Install**

**Verify / 確認:**
```bash
node -v
# Must show: v18.x.x
```

If it shows v20 or higher, see the troubleshooting section below.

---

#### 2. Yarn

Open terminal and run:
```bash
npm install -g yarn
```

**Verify / 確認:**
```bash
yarn -v
# Should show: 1.x.x
```

---

#### 3. Git

**Windows:**
1. Go to https://git-scm.com/download/win
2. Download and run the installer
3. Keep all default settings → click **Next** throughout

**Mac:**
```bash
xcode-select --install
```

**Verify / 確認:**
```bash
git --version
```

---

> ✅ Once all three show version numbers, proceed to Step 1.

---

### 📦 Step 1 — Get the code / コードを取得

```bash
git clone https://github.com/gz-zhu/event-lucky-draw.git
cd event-lucky-draw
```

---

### 📥 Step 2 — Install dependencies / 依存関係をインストール

```bash
yarn install
```

> ⏳ This may take 2–5 minutes. Wait until you see "Done".

---

### 🔨 Step 3 — Build / ビルド

```bash
yarn build
```

Output files will be in the `/dist` folder.

---

### 🌐 Step 4 — Deploy / デプロイ

#### Option A — Netlify ⭐ (Recommended)

1. Go to https://netlify.com → Sign up free
2. Click **"Add new site"** → **"Deploy manually"**
3. Drag and drop the entire `/dist` folder
4. Done! Public URL is generated instantly.

#### Option B — Local preview only

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

Click **Save**.

### 2. Set up prizes / 賞を設定
In Settings → **Prize Settings**: set name and winner count per prize. Click **Save**.

### 3. Draw / 抽選
Click a prize button → Click **Draw** → Winner appears 🎊

### 4. Records / 記録
Click ✅ icon (top right) → view all winners → **Export CSV** to download.

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