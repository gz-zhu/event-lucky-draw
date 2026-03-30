# 🎰 Event Lucky Draw

A beautiful lucky draw app for events — with prize tiers, winner records, CSV import, and festive animations.

抽選アプリ。賞ごとに当選者を抽選・記録できます。CSV インポート、紙吹雪、彩燈アニメーション付き。

---

## ✨ Features / 機能

- 🏆 Multiple prize tiers (1st, 2nd, 3rd …)
- 👥 Set winner count per prize
- 📂 Import participant list via CSV file
- 📋 Winner records panel with CSV export
- 🎊 Confetti + festive lights animation
- 💾 Auto-saves settings in browser (localStorage)
- 🖼️ Custom background image support

---

## 🚀 Deployment Guide / デプロイガイド

### ✅ Step 0 — Install required tools / 必要ツールのインストール

#### 1. Node.js

**Windows:**
1. Go to https://nodejs.org
2. Download the **LTS** version (recommended)
3. Run the installer — keep all default settings and click Next
4. Restart your terminal after installation

**Mac:**
1. Go to https://nodejs.org
2. Download the **LTS** version
3. Run the `.pkg` installer

Verify / 確認:
```bash
node -v    # should show v18.x.x or higher
```

---

#### 2. Yarn

After Node.js is installed, open terminal and run:

Node.js インストール後、ターミナルで実行：
```bash
npm install -g yarn
```

Verify / 確認:
```bash
yarn -v    # should show 1.x.x
```

---

#### 3. Git

**Windows:**
1. Go to https://git-scm.com
2. Download and run the installer
3. Keep all default settings and click Next throughout

**Mac:**
Open terminal and run:
```bash
xcode-select --install
```

Verify / 確認:
```bash
git --version
```

---

> ✅ Once all three show version numbers, you are ready to proceed.
>
> 3つ全てバージョン番号が表示されたら、次のステップへ進めます。

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

> ⏳ This may take 1–2 minutes. Wait until it finishes.
>
> 1〜2 分かかる場合があります。完了まで待ってください。

---

### 🔨 Step 3 — Build the project / プロジェクトをビルド

```bash
yarn build
```

All output files will be generated in the `/dist` folder.

ビルドされたファイルは `/dist` フォルダに出力されます。

---

### 🌐 Step 4 — Deploy / デプロイ

Choose one of the options below / 以下のいずれかを選んでください：

---

#### Option A — Netlify (Recommended / 推奨) ⭐

Free, no server required. 無料、サーバー不要。

1. Go to https://netlify.com and sign up for free
2. Click **"Add new site"** → **"Deploy manually"**
3. Drag and drop the entire `/dist` folder into the upload area
4. Done! You'll get a public URL instantly.

---

1. https://netlify.com にアクセスして無料登録
2. **"Add new site"** → **"Deploy manually"** をクリック
3. `/dist` フォルダ全体をアップロードエリアにドラッグ＆ドロップ
4. 完了！すぐに公開 URL が発行されます。

---

#### Option B — GitHub Pages

1. Push this repo to your own GitHub account
2. Go to your repo → **Settings** → **Pages**
3. Set source to **"Deploy from a branch"** → branch: `main`, folder: `/dist`
4. Wait 1–2 minutes, then access `https://yourusername.github.io/event-lucky-draw`

---

1. このリポジトリを自分の GitHub アカウントにプッシュ
2. リポジトリ → **Settings** → **Pages** へ移動
3. ソースを **"Deploy from a branch"** → ブランチ: `main`、フォルダ: `/dist` に設定
4. 1〜2 分後にアクセス可能

---

#### Option C — Local preview / ローカルで確認

```bash
yarn start
```

Open your browser at / ブラウザで開く: `http://localhost:8888`

---

## 🎮 How to Use / 使い方

### 1. Add participants / 参加者を追加

Click ⚙️ **Settings** (top right) → **Name List**

**Option A** — Paste names manually, one per line:
```
Alice
Bob
Charlie
```

**Option B** — Click **Upload CSV** and select a `.csv` file.
The first column will be used as names. CSV の第一列が名前として読み込まれます。

Click **Save** when done.

---

### 2. Configure prizes / 賞を設定

In Settings → **Prize Settings**:

- Enter prize name (e.g. "Grand Prize")
- Set winner count
- Click **+ Add Prize** to add more tiers
- Click **Save**

---

### 3. Draw! / 抽選！

1. Click a prize button at the top of the screen
2. Click **Draw** to start spinning
3. The winner is revealed with confetti 🎊

---

### 4. View & export records / 記録の確認とエクスポート

Click the ✅ icon (top right) to open the records panel.

- **Export CSV** — download all winners as a spreadsheet
- **Clear** — reset all records

---

## 🖼️ Changing the Background / 背景画像の変更

Replace the file at:
```
src/assets/images/Cover.jpg
```
with your own image (JPG or PNG), keeping the same filename. Then rebuild:
```bash
yarn build
```

---

## ❓ Troubleshooting / よくある問題

| Problem | Solution |
|---------|----------|
| `node -v` shows error | Install Node.js from https://nodejs.org |
| `yarn install` fails | Run `npm install -g yarn` first |
| Page blank after build | Make sure you uploaded `/dist`, not the root folder |
| CSV names not loading | Check that names are in the **first column** |
| Settings not saving | Make sure your browser allows localStorage |

---

## 🛠️ Tech Stack / 技術スタック

TypeScript · Pug · SCSS · Webpack · Web Animations API · AudioContext API

---

## 📄 License

Based on [random-name-picker](https://github.com/icelam/random-name-picker) by [Ice Lam](https://github.com/icelam), MIT License.

---

## 👤 Maintainer

**gz-zhu** — [github.com/gz-zhu](https://github.com/gz-zhu)