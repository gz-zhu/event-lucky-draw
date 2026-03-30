# 🎰 Event Lucky Draw

A simple and beautiful lucky draw app for events. Pick winners by prize tier with confetti animation and sound effects.

抽選アプリ。賞ごとに当選者を抽選できます。紙吹雪アニメーションとサウンドエフェクト付き。

---

## ✨ Features / 機能

- 🏆 Multiple prize tiers (1st, 2nd, 3rd prize, etc.)
- 🎯 Set how many winners per prize
- 🎊 Confetti animation + sound effects
- 📋 Winner records with CSV export
- 💾 Auto-saves settings in browser

---

## 🖥️ Preview / プレビュー

> Select a prize tier → Enter names → Click Draw → Winner appears!
>
> 賞を選ぶ → 名前を入力 → Drawをクリック → 当選者が表示！

---

## 🚀 Getting Started / はじめ方

### Requirements / 必要環境

- [Node.js](https://nodejs.org/) v18 or above / v18以上
- [Yarn](https://yarnpkg.com/) package manager

Check your versions / バージョン確認:
```bash
node -v
yarn -v
```

---

### Installation / インストール

**1. Clone this repository / リポジトリをクローン**
```bash
git clone https://github.com/gz-zhu/event-lucky-draw.git
cd event-lucky-draw
```

**2. Install dependencies / 依存関係をインストール**
```bash
yarn install
```

**3. Start development server / 開発サーバーを起動**
```bash
yarn start
```

Open your browser at / ブラウザで開く: `http://localhost:8080`

---

## 🎮 How to Use / 使い方

### Step 1 — Add names / 名前を追加
Click the ⚙️ **Settings** button (top right).  
右上の ⚙️ **Settings** ボタンをクリック。

Paste your participant list, one name per line:  
参加者リストを貼り付け（1行に1名）:
```
Alice
Bob
Charlie
Diana
```

### Step 2 — Set up prizes / 賞を設定
In Settings → **Prize Settings**, set the prize name and number of winners.  
Settings → **Prize Settings** で、賞の名前と当選者数を設定。

Click **Save** when done. / 完了したら **Save** をクリック。

### Step 3 — Draw! / 抽選！
1. Click a prize button (1st Prize / 2nd Prize …) to select it  
   賞ボタン（1st Prize / 2nd Prize …）をクリックして選択
2. Click **Draw** to start spinning  
   **Draw** をクリックして抽選開始
3. The winner is displayed with confetti 🎊  
   当選者が紙吹雪とともに表示されます 🎊

### Step 4 — View records / 記録を確認
Click the ✅ **Records** button (top right) to see all winners.  
右上の ✅ **Records** ボタンで全当選者を確認。

Click **Export CSV** to download results.  
**Export CSV** で結果をダウンロード。

---

## 🏗️ Build for Production / 本番ビルド

```bash
yarn build
```

Output files will be in the `/dist` folder.  
ビルドされたファイルは `/dist` フォルダに出力されます。

---

## 🛠️ Tech Stack / 技術スタック

| | |
|---|---|
| Language | TypeScript |
| Template | Pug |
| Style | SCSS |
| Bundler | Webpack |
| Animation | Web Animations API |
| Sound | AudioContext API |

---

## 📄 License

This project is based on [random-name-picker](https://github.com/icelam/random-name-picker) by [Ice Lam](https://github.com/icelam), licensed under the [MIT License](./LICENSE).

---

## 👤 Maintainer

**gz-zhu** — [github.com/gz-zhu](https://github.com/gz-zhu)