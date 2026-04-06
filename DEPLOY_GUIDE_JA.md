# 🚀 Event Lucky Draw — 完全デプロイガイド

このガイドでは、イベント用の抽選システムをゼロから構築する手順を説明します — ローカル使用・クラウドデプロイ・カスタムドメイン設定まで。

---

## 📦 データの保存方法（最初にお読みください）

> **すべてのデータは抽選を実行しているマシンのブラウザ `localStorage` に保存されます。アカウントやクラウド設定は不要です。**

- 設定・名前リスト・賞設定・当選記録はすべてそのコンピューターのブラウザに保存されます。
- ブラウザデータを消去するとすべての記録が失われます — **消去前にCSVをエクスポートしてください**。

### 表示ページの同期

`/display.html` は同じ `localStorage` から2秒ごとに読み込みます。

- ✅ **同じマシンの同じブラウザ**でメインページと表示ページを開く → リアルタイム同期
- ❌ **別のデバイスまたは別のブラウザ**で表示ページを開く → 同期不可（`localStorage` は端末間で共有されません）

> **イベントのヒント：** オペレーターのノートPCでメインページを操作し、同じPCの別タブで `/display.html` を開いて、そのウィンドウをプロジェクターや外部モニターに拡張してください。

---

## ステップ1：必要なツールをインストール

### Node.js 18.x（バージョン18が必須）

| OS | ダウンロード |
|----|-------------|
| Windows 64-bit | https://nodejs.org/download/release/v18.20.4/node-v18.20.4-x64.msi |
| Mac (Intel) | https://nodejs.org/download/release/v18.20.4/node-v18.20.4.pkg |
| Mac (M1/M2) | https://nodejs.org/download/release/v18.20.4/node-v18.20.4-arm64.pkg |

インストール後に確認：
```bash
node -v   # v18.x.x と表示される必要があります
```

### Git
- Windows: https://git-scm.com/download/win
- Mac: ターミナルで `xcode-select --install` を実行

### Yarn
```bash
npm install -g yarn
yarn -v   # 1.x.x と表示されれば成功
```

---

## ステップ2：コードを取得してビルド

```bash
git clone https://github.com/gz-zhu/event-lucky-draw.git
cd event-lucky-draw
yarn install
yarn build
```

`Done` が表示されればビルド成功です。`/dist` フォルダがデプロイ可能なファイルです。

### ローカルプレビュー

```bash
yarn start
```

ブラウザで `http://localhost:8888` を開くと、すべての機能をローカルで使用できます。

---

## ステップ3：自分のGitHubにアップロード

1. https://github.com でアカウントを作成
2. **+**（右上）→ **New repository**
3. 名前を入力（例: `my-lucky-draw`）→ **Create repository**（初期化オプションはチェックしない）
4. 以下を実行：

```bash
git remote remove origin
git remote add origin https://github.com/あなたのユーザー名/my-lucky-draw.git
git branch -M main
git push -u origin main
```

---

## ステップ4：Vercelにデプロイ

1. https://vercel.com にアクセス → GitHubアカウントでサインイン
2. **Add New Project** → `my-lucky-draw` を選択
3. 以下を設定：
   - **Framework Preset**: Other
   - **Build Command**: `yarn build`
   - **Output Directory**: `dist`
4. **Deploy** をクリック
5. デプロイ後 → **Settings** → **General** → **Node.js Version** → **20.x** に変更 → **Save**
6. **Deployments** → 最新の項目の `...` → **Redeploy**

デプロイ成功後、以下のようなURLが発行されます：
```
https://my-lucky-draw.vercel.app
```

> **注意：** 各ユーザーのブラウザはそれぞれの `localStorage` を持ちます。メインページと表示ページは必ず**同じコンピューターの同じブラウザ**で開いてください。

---

## ステップ5：コンテンツをカスタマイズ

### 言語の切り替え
アプリには言語切り替え機能が内蔵されています（メインページ左下の 🌐 地球アイコン）。クリックして **English**、**繁體中文**、**日本語** から選択できます。選択は自動保存され、表示ページ（`/display.html`）も同じ言語に切り替わります。

コードの変更は不要です。

### 背景画像を変更
以下のファイルを差し替えます（ファイル名は変更しない）：
```
src/assets/images/Cover.jpg
```

### イベントタイトルを変更
`src/pages/landing.pug` を開いて以下を見つけます：
```pug
h1.title-text Lucky Draw
```
自分のイベント名に変更してください。Settings → **Draw Title** でリアルタイムに変更することもできます。

### デフォルト賞を変更
`src/assets/js/PrizeManager.ts` を開いて以下を見つけます：
```typescript
this.prizes = [
  { id: '1', name: '1st Prize', count: 1, winners: [] },
  { id: '2', name: '2nd Prize', count: 2, winners: [] },
  { id: '3', name: '3rd Prize', count: 5, winners: [] },
];
```
自分の賞名と当選人数に変更してください。Settings → **Prize Settings** でリアルタイムに追加・編集することもできます。

---

## ステップ6：リビルドしてプッシュ

コードを変更するたびに実行します：
```bash
yarn build
git add .
git commit -m "feat: イベント用にカスタマイズ"
git push
```

Vercelが自動的に再デプロイします。

---

## ステップ7：カスタムドメインを設定

### 7-1. DNSをCloudflareに移管（推奨）

1. https://cloudflare.com で無料アカウントを作成
2. **Add a Site** → ドメインを入力 → **Free** を選択
3. CloudflareがDNSをスキャン後、**Continue** をクリック
4. Cloudflareが提供する2つのネームサーバーを控えます（例）：
   ```
   nina.ns.cloudflare.com
   rick.ns.cloudflare.com
   ```
5. ドメイン登録業者（Hostinger、GoDaddy等）→ **Nameservers** → Cloudflareのものに変更
6. 反映まで24〜48時間待ちます

### 7-2. CloudflareでDNSレコードを追加

Cloudflare → **DNS** → **Add record**：
```
Type:   CNAME
Name:   draw
Target: cname.vercel-dns.com
Proxy:  OFF（オレンジではなくグレーの雲マーク）
TTL:    Auto
```

### 7-3. VercelでドメインをバインドNumber

1. Vercel → プロジェクト → **Settings** → **Domains**
2. `draw.あなたのドメイン.com` を入力 → **Add**
3. **Valid Configuration** が表示されるまで待つ
4. SSL証明書は自動で設定されます

---

## 設定完了後のアクセスURL

```
https://draw.あなたのドメイン.com              ← メイン抽選ページ
https://draw.あなたのドメイン.com/display.html ← プロジェクター用表示ページ
```

---

## アプリの使い方

### 1. 参加者を追加
右上の ⚙️ **Settings** → **Name List** → 1行1名で貼り付けるか **Upload CSV** でインポート。

CSVは複数列に対応 — 各行のすべての列が1つの名前として結合されます。

ツールバーで**シャッフル**・**全名前をマスキング**・**重複統合**・**クリア**が可能。**Save** をクリック。

過去の当選者は自動的にリストから除外されます。

### 2. 賞を設定
Settings → **Prize Settings** → 賞の名前と当選人数を入力。
予定抽選時間と賞品説明（表示ページに反映）はオプションで設定可能。**Save** をクリック。

### 3. カウントダウンを設定（任意）
Settings → **Countdown Timer** → 任意の賞に時間を割り当て。
カウントダウンバーの **Auto** をオンにすると、タイムアップ時に自動抽選。

### 4. 表示ページを開く
右下の **📺 Display** リンクをクリック → 新しいタブで開く（**同じコンピューターで必須**）。
そのウィンドウをプロジェクターや外部スクリーンに拡張。

表示ページには：リアルタイム当選名、賞リスト（予定時刻付き）、参加人数統計、リアルタイム時計が表示されます。

### 5. 抽選
賞ボタンをクリックして選択 → **Draw** をクリック → 当選者が登場 🎊

当選者の名前は抽選後にマスキングされます（プライバシー保護）。ドローシードが表示されます。

### 6. 記録を確認・エクスポート
右上の ✅ アイコン → タイムスタンプとシード付きで全当選者を確認 → **Export CSV**。

---

## 日常的な更新コマンド

```bash
yarn build
git add .
git commit -m "変更内容を説明"
git push
# Vercelが自動的に再デプロイ
```

---

## トラブルシューティング

| 問題 | 解決方法 |
|------|----------|
| `node -v` がv20以上を表示 | 上記リンクからNode.js 18.xを再インストール |
| `yarn install` が失敗 | `node_modules` フォルダを削除して `yarn install` を再実行 |
| `yarn` コマンドが認識されない | `npm install -g yarn` を実行後、ターミナルを再起動 |
| Vercelデプロイが失敗 | VercelプロジェクトのNode.jsバージョンを **20.x** に変更 |
| 表示ページが同期しない | メインページと表示ページを**同じコンピューターの同じブラウザ**で開く |
| ドメインが有効にならない | DNS反映に最大48時間かかる場合があります |
| ブラウザを閉じると設定が消える | プライベートモードを使用しない；閉じる前にCSVをエクスポート |
| デプロイ後にページが空白 | 先に `yarn build` を実行してからプッシュ — Vercelは `/dist` からデプロイ |

---

## 上級者向け：クロスデバイス同期

別のデバイスで表示ページを同期させる必要がある場合、このシステムにはFirebase Realtime Databaseの統合インターフェースが内蔵されています。デフォルトでは強制されません — `src/assets/js/PrizeManager.ts` に自分のFirebaseプロジェクトの認証情報を入力することで有効化できます。
