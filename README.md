# 🎰 Event Lucky Draw

> **Language / 語言 / 言語：**
> [English](#english) | [繁體中文](#繁體中文) | [日本語](#日本語)

---

# English

A stylish lucky draw app for live events — animated slot reel, prize tiers, winner records, CSV import, and festive effects.

## ✨ Features

**Draw**
- 🎰 Animated slot reel with marquee light-bulb chasing effect on the border
- 🏆 Multiple prize tiers — configurable name, winner count, scheduled draw time, and description
- 🔀 Name masking during spin; winner name revealed after animation ends
- 🔢 Draw seed shown per draw for full auditability
- 🚫 Auto-deduplication — past winners are automatically removed from the pool
- ⚡ Interruption recovery — restores the participant pool if the browser closes mid-draw
- 🎚 Dynamic spin speed — adjusts automatically based on participant count and remaining slots

**Participants**
- 📂 Import via CSV (multi-column support) or paste names directly
- 🔧 Name list toolbar: shuffle, mask all names, merge duplicates, clear

**Countdown & Auto Draw**
- ⏱ Per-prize countdown timer — configure duration in Settings
- 🤖 Auto Draw mode — draw triggers automatically when countdown reaches zero

**Display & Records**
- 📺 Separate display page (`/display.html`) for projector / big screen
- 📋 Winner records with timestamps and draw seeds — exportable as CSV
- 🕐 Live clock and date on display page
- 🔒 Winner name masking after draw (privacy protection)

**UI & Extras**
- 🌐 Built-in language switcher — English / 繁體中文 / 日本語 (persisted across sessions)
- 🎊 Confetti + twinkling stars + festive light animations
- 🔊 Sound effects (spinning reel + win fanfare)
- 🖥 Fullscreen mode
- ✏️ Editable Draw Title shown on both main and display pages
- 💾 All settings auto-saved in browser (`localStorage`)
- ⚠️ Confirmation dialog on page close to prevent accidental data loss

---

## 📦 How Data is Stored

> All data is saved in your browser's `localStorage` on the machine running the draw. No account or cloud setup required.

- Settings, name list, prize configurations, and winner records all live in the browser on your computer.
- Clearing browser data will erase records — **export CSV before clearing**.

### Display page sync

`/display.html` reads from the same `localStorage` and refreshes every 2 seconds.

- ✅ Open both pages in the **same browser on the same machine** → display syncs live
- ❌ Open display on a **different device or browser** → no sync (data is not shared across machines)

> **Event tip:** Run the draw on the operator's laptop. Open `/display.html` in a second tab on the same laptop, then extend that tab to a projector or secondary screen.

---

## ⚡ Quick Commands

```bash
yarn install      # Install dependencies
yarn start        # Start dev server → http://localhost:8888
yarn build        # Build for production → /dist
```

**Push changes to GitHub:**
```bash
git add .
git commit -m "describe what changed"
git push
```

---

## 🚀 Deployment Guide

Full step-by-step instructions for local use, Vercel deployment, and custom domain setup:

| Language | File |
|----------|------|
| English | [DEPLOY_GUIDE_EN.md](./DEPLOY_GUIDE_EN.md) |
| 繁體中文 | [DEPLOY_GUIDE_ZH.md](./DEPLOY_GUIDE_ZH.md) |
| 日本語 | [DEPLOY_GUIDE_JA.md](./DEPLOY_GUIDE_JA.md) |

---

## 🎮 How to Use

### 1. Add participants
Settings (⚙️ top right) → **Name List** → paste names one per line, or click **Upload CSV**.
Use the toolbar to shuffle, mask, merge duplicates, or clear the list. Click **Save**.

### 2. Configure prizes
Settings → **Prize Settings** → set name and winner count per prize → **Save**.
Optionally set a scheduled draw time and description shown on the display page.

### 3. Set up a countdown (optional)
Settings → **Countdown Timer** → assign a duration to any prize.
Enable **Auto** on the countdown bar to trigger the draw automatically when time runs out.

### 4. Open the display page
Click the **📺 Display** link (bottom right) to open `display.html` in a new tab **on the same computer**.
Extend that window to a projector or secondary screen.

### 5. Draw
Click a prize button → click **Draw** → winner appears 🎊

### 6. View and export records
Click the ✅ icon (top right) → view all winners with timestamps → **Export CSV**.

---

## 🖼 Customize

**Background image:** Replace `src/assets/images/Cover.jpg` (keep the filename), then run `yarn build`.

**Default prizes:** Edit `src/assets/js/PrizeManager.ts` → `this.prizes = [...]`.

**Event title:** Edit the default in `src/pages/landing.pug`, or change it live in Settings → Draw Title.

---

## 🛠 Tech Stack

TypeScript · Pug · SCSS · Webpack 5 · Web Animations API · AudioContext API · Canvas API · Firebase (optional)

---

## 📄 License

Based on [random-name-picker](https://github.com/icelam/random-name-picker) by [Ice Lam](https://github.com/icelam) — MIT License.

**Maintainer:** [gz-zhu](https://github.com/gz-zhu)

---

---

# 繁體中文

一款專為現場活動設計的抽獎系統 — 動態拉霸轉輪、多獎項設定、得獎紀錄、CSV 匯入，搭配彩燈跑馬燈等節慶特效。

## ✨ 功能一覽

**抽獎核心**
- 🎰 動態拉霸轉輪，邊框搭載跑馬燈閃燈效果
- 🏆 多獎項設定 — 可自訂獎項名稱、得獎人數、預定開獎時間、獎品說明
- 🔀 轉動期間名字遮蔽，動畫結束後揭曉得獎者
- 🔢 每次抽獎顯示抽獎種子，可事後稽核
- 🚫 自動排重 — 已得獎者自動從名單移除
- ⚡ 中斷復原 — 瀏覽器意外關閉後可還原名單
- 🎚 動態轉速 — 根據參加人數與剩餘名額自動調整

**參加者管理**
- 📂 支援 CSV 多欄位匯入，或直接貼上名字
- 🔧 名單工具列：洗牌、遮蔽、合併重複、清除

**倒數計時與自動抽獎**
- ⏱ 每個獎項可單獨設定倒數計時
- 🤖 開啟「自動」模式，倒數歸零時自動執行抽獎

**展示頁與紀錄**
- 📺 獨立大屏展示頁（`/display.html`），投影機專用
- 📋 得獎紀錄含時間戳記與抽獎種子，可匯出 CSV
- 🕐 展示頁顯示即時時鐘
- 🔒 抽獎後自動遮蔽得獎者姓名（隱私保護）

**介面與其他**
- 🎊 彩帶 + 星空閃爍 + 彩燈動畫
- 🌐 內建語言切換 — English / 繁體中文 / 日本語（設定自動記憶）
- 🎊 彩帶 + 星空閃爍 + 彩燈動畫
- 🔊 音效（轉輪聲 + 得獎提示音）
- 🖥 全螢幕模式
- ✏️ 可編輯活動標題，同步顯示於主頁與展示頁
- 💾 所有設定自動儲存至瀏覽器（`localStorage`）
- ⚠️ 離開頁面前的確認提示，防止意外遺失資料

---

## 📦 資料儲存說明

> 所有資料儲存在執行抽獎的電腦瀏覽器的 `localStorage` 中，無需帳號或雲端服務。

- 設定、名單、獎項設定、得獎紀錄均存於本機瀏覽器。
- 清除瀏覽器資料會清除紀錄 — **清除前請先匯出 CSV**。

### 大屏展示頁同步

`/display.html` 每 2 秒讀取同一份 `localStorage`。

- ✅ 在**同一台電腦的同一個瀏覽器**開啟主頁和展示頁 → 展示頁即時同步
- ❌ 在**另一台裝置或另一個瀏覽器**開啟展示頁 → 無法同步

> **活動建議：** 在操作者的筆電上開啟主頁，在同一筆電的另一分頁開啟 `/display.html`，再將該視窗延伸至投影機或第二螢幕。

---

## ⚡ 常用指令

```bash
yarn install      # 安裝依賴套件
yarn start        # 啟動開發伺服器 → http://localhost:8888
yarn build        # 建置正式版本 → /dist
```

**推送到 GitHub：**
```bash
git add .
git commit -m "說明改了什麼"
git push
```

---

## 🚀 部署指南

完整的本地使用、Vercel 部署、自訂網域設定說明：

| 語言 | 檔案 |
|------|------|
| 繁體中文 | [DEPLOY_GUIDE_ZH.md](./DEPLOY_GUIDE_ZH.md) |
| English | [DEPLOY_GUIDE_EN.md](./DEPLOY_GUIDE_EN.md) |
| 日本語 | [DEPLOY_GUIDE_JA.md](./DEPLOY_GUIDE_JA.md) |

---

## 🎮 使用方式

### 1. 新增參加者
點擊右上角 ⚙️ **Settings** → **Name List** → 逐行貼上名字，或點擊 **Upload CSV** 匯入。
使用工具列進行洗牌、遮蔽、合併重複、清除。點擊 **Save**。

### 2. 設定獎項
Settings → **Prize Settings** → 輸入獎項名稱與得獎人數 → **Save**。
可選填預定開獎時間與獎品說明，顯示於大屏展示頁。

### 3. 設定倒數計時（選填）
Settings → **Countdown Timer** → 為指定獎項設定倒數時長。
在倒數進度條上開啟 **Auto**，時間到時自動抽獎。

### 4. 開啟大屏展示頁
點擊右下角 **📺 Display** 連結，在新分頁開啟（**必須在同一台電腦**）。
將該視窗延伸至投影機或大螢幕。

### 5. 抽獎
點擊獎項按鈕 → 點擊 **Draw** → 得獎者出現 🎊

### 6. 查看及匯出紀錄
點擊右上角 ✅ 圖示 → 查看所有得獎者（含時間戳記）→ **Export CSV**。

---

## 🖼 客製化

**背景圖片：** 替換 `src/assets/images/Cover.jpg`（保持檔名），再執行 `yarn build`。

**預設獎項：** 編輯 `src/assets/js/PrizeManager.ts` → `this.prizes = [...]`。

**活動標題：** 編輯 `src/pages/landing.pug` 中的預設值，或在 Settings → Draw Title 即時修改。

---

## 🛠 技術棧

TypeScript · Pug · SCSS · Webpack 5 · Web Animations API · AudioContext API · Canvas API · Firebase（選配）

---

## 📄 授權

基於 [Ice Lam](https://github.com/icelam) 的 [random-name-picker](https://github.com/icelam/random-name-picker) — MIT License。

**維護者：** [gz-zhu](https://github.com/gz-zhu)

---

---

# 日本語

ライブイベント向けのスタイリッシュな抽選アプリ — アニメーションスロットリール、複数賞設定、当選記録、CSVインポート、マーキーイルミネーション演出付き。

## ✨ 機能一覧

**抽選**
- 🎰 アニメーションスロットリール（縁取りに流れるイルミネーション演出）
- 🏆 複数の賞ティア — 名前・当選人数・予定抽選時間・説明を個別設定
- 🔀 スピン中は名前をマスキング、アニメーション終了後に当選者名を公開
- 🔢 各抽選にドローシードを表示（事後検証対応）
- 🚫 自動重複排除 — 当選者は次回から自動的に除外
- ⚡ 中断復元 — ブラウザが予期せず閉じても参加者リストを復元
- 🎚 ダイナミックスピン速度 — 参加人数と残席数に応じて自動調整

**参加者管理**
- 📂 CSVインポート（複数列対応）または直接貼り付け
- 🔧 ツールバー：シャッフル、マスキング、重複統合、クリア

**カウントダウンと自動抽選**
- ⏱ 賞ごとにカウントダウンタイマーを設定可能
- 🤖 オートモード — タイムアップで自動抽選実行

**表示ページと記録**
- 📺 プロジェクター／大型スクリーン向け専用表示ページ（`/display.html`）
- 📋 タイムスタンプ・シード付き当選記録 — CSVエクスポート対応
- 🕐 表示ページにリアルタイム時計を表示
- 🔒 抽選後に当選者名を自動マスキング（プライバシー保護）

**UIとその他**
- 🎊 紙吹雪 + 星空キラキラ + イルミネーションアニメーション
- 🌐 言語切り替え内蔵 — English / 繁體中文 / 日本語（設定は自動保存）
- 🎊 紙吹雪 + 星空キラキラ + イルミネーションアニメーション
- 🔊 効果音（スロット音 + 当選ファンファーレ）
- 🖥 フルスクリーンモード
- ✏️ 編集可能なイベントタイトル（メインページと表示ページに反映）
- 💾 全設定をブラウザに自動保存（`localStorage`）
- ⚠️ ページを閉じる前の確認ダイアログ（データ消失防止）

---

## 📦 データの保存方法

> すべてのデータは抽選を実行しているマシンのブラウザ `localStorage` に保存されます。アカウントやクラウド設定は不要です。

- 設定・名前リスト・賞設定・当選記録はすべてそのコンピューターのブラウザに保存されます。
- ブラウザデータを消去するとすべての記録が失われます — **消去前にCSVをエクスポートしてください**。

### 表示ページの同期

`/display.html` は同じ `localStorage` から2秒ごとに読み込みます。

- ✅ **同じマシンの同じブラウザ**でメインページと表示ページを開く → リアルタイム同期
- ❌ **別のデバイスまたは別のブラウザ**で表示ページを開く → 同期不可

> **イベントのヒント：** オペレーターのノートPCでメインページを操作し、同じPCの別タブで `/display.html` を開いて、そのタブをプロジェクターや外部モニターに拡張してください。

---

## ⚡ よく使うコマンド

```bash
yarn install      # 依存関係をインストール
yarn start        # 開発サーバー起動 → http://localhost:8888
yarn build        # 本番ビルド → /dist
```

**GitHubにプッシュ：**
```bash
git add .
git commit -m "変更内容を説明"
git push
```

---

## 🚀 デプロイガイド

ローカル使用・Vercelデプロイ・カスタムドメイン設定の詳細手順：

| 言語 | ファイル |
|------|----------|
| 日本語 | [DEPLOY_GUIDE_JA.md](./DEPLOY_GUIDE_JA.md) |
| English | [DEPLOY_GUIDE_EN.md](./DEPLOY_GUIDE_EN.md) |
| 繁體中文 | [DEPLOY_GUIDE_ZH.md](./DEPLOY_GUIDE_ZH.md) |

---

## 🎮 使い方

### 1. 参加者を追加
右上の ⚙️ **Settings** → **Name List** → 1行1名で貼り付けるか **Upload CSV** でインポート。
ツールバーでシャッフル・マスキング・重複統合・クリアが可能。**Save** をクリック。

### 2. 賞を設定
Settings → **Prize Settings** → 賞の名前と当選人数を入力 → **Save**。
予定抽選時間と賞品説明（表示ページに反映）はオプションで設定可能。

### 3. カウントダウンを設定（任意）
Settings → **Countdown Timer** → 任意の賞に時間を割り当て。
カウントダウンバーの **Auto** をオンにすると、タイムアップ時に自動抽選。

### 4. 表示ページを開く
右下の **📺 Display** リンクをクリックして新しいタブで開く（**同じコンピューターで必須**）。
そのウィンドウをプロジェクターや外部スクリーンに拡張。

### 5. 抽選
賞ボタンをクリックして選択 → **Draw** をクリック → 当選者が登場 🎊

### 6. 記録を確認・エクスポート
右上の ✅ アイコン → タイムスタンプ付きで全当選者を確認 → **Export CSV**。

---

## 🖼 カスタマイズ

**背景画像：** `src/assets/images/Cover.jpg` を差し替え（ファイル名は維持）、`yarn build` を実行。

**デフォルト賞設定：** `src/assets/js/PrizeManager.ts` の `this.prizes = [...]` を編集。

**イベントタイトル：** `src/pages/landing.pug` のデフォルト値を編集するか、Settings → Draw Title でリアルタイム変更。

---

## 🛠 技術スタック

TypeScript · Pug · SCSS · Webpack 5 · Web Animations API · AudioContext API · Canvas API · Firebase（オプション）

---

## 📄 ライセンス

[Ice Lam](https://github.com/icelam) の [random-name-picker](https://github.com/icelam/random-name-picker) をベースに — MIT License。

**メンテナー：** [gz-zhu](https://github.com/gz-zhu)
