# 🚀 Event Lucky Draw — 完全デプロイガイド

このガイドでは、ゼロから自分だけの抽選システムを構築・デプロイする手順を説明します。

**このシステムでできること：**
- 🏆 複数の賞を設定し、名前と当選人数を自由にカスタマイズ
- 📂 CSV で参加者を一括インポート
- 📋 当選記録（タイムスタンプ・抽選シード付き）を CSV でエクスポート
- 📺 大画面表示ページ (`/display.html`) — プロジェクター向け、当選者をリアルタイム表示
- 🔢 毎回の抽選で抽選シードを表示（監査対応）
- 🔒 当選者の名前を自動マスキング（プライバシー保護）
- 🚫 自動重複排除 — すでに当選した参加者は名簿から自動的に除外
- ⚡ 中断復旧 — ブラウザが途中で閉じた場合も名簿を復元可能
- 🎊 紙吹雪 + 星 + 彩燈アニメーション

---

## 📦 データの保存方法（重要）

> **すべてのデータは、抽選を実行しているコンピュータのブラウザの `localStorage` に保存されます。**

- アカウントやクラウドサービスは不要
- 設定・名簿・当選記録 — すべてそのコンピュータのブラウザ内に保存
- ブラウザデータを削除するとすべての記録が消えます（事前に CSV でエクスポートしてください）

### 大画面表示ページの同期について

`/display.html` は 2 秒ごとに同じ `localStorage` を読み取り、自動的に更新されます。

**これが意味すること：**
- ✅ **同じコンピュータの同じブラウザ**でメインページと表示ページを開く → リアルタイム同期
- ❌ **別のデバイスや別のブラウザ**で表示ページを開く → 同期されない（`localStorage` はデバイス間で共有されません）

> **イベントでの推奨設定：** 操作者のノートパソコンでメインの抽選ページを開き、同じノートパソコンの別のウィンドウまたはタブで `/display.html` を開いてから、そのウィンドウをプロジェクターやサブスクリーンに拡張表示します。

---

## ステップ 1：必要なツールのインストール

### Node.js 18.x（必ずバージョン 18 を使用）

| OS | ダウンロード |
|------|----------|
| Windows 64-bit | https://nodejs.org/download/release/v18.20.4/node-v18.20.4-x64.msi |
| Mac (Intel) | https://nodejs.org/download/release/v18.20.4/node-v18.20.4.pkg |
| Mac (M1/M2) | https://nodejs.org/download/release/v18.20.4/node-v18.20.4-arm64.pkg |

インストール後に確認：
```bash
node -v   # v18.x.x が表示されること
```

### Git
- Windows：https://git-scm.com/download/win
- Mac：ターミナルで `xcode-select --install` を実行

### Yarn
```bash
npm install -g yarn
yarn -v   # 1.x.x が表示されること
```

---

## ステップ 2：コードの取得とビルド

```bash
git clone https://github.com/gz-zhu/event-lucky-draw.git
cd event-lucky-draw
yarn install
yarn build
```

`Done` が表示されればビルド成功です。

### ローカルプレビュー

```bash
yarn start
```

ブラウザで `http://localhost:8888` を開くと、ローカル環境で全機能を使用できます。

---

## ステップ 3：自分の GitHub にアップロード

1. https://github.com でアカウントを作成
2. 右上の **+** → **New repository**
3. 名前を入力（例：`my-lucky-draw`）→ **Create repository**（初期化オプションはチェックしない）
4. 以下を実行：

```bash
git remote remove origin
git remote add origin https://github.com/ユーザー名/my-lucky-draw.git
git branch -M main
git push -u origin main
```

---

## ステップ 4：Vercel へのデプロイ

1. https://vercel.com へアクセス → GitHub でログイン
2. **Add New Project** → `my-lucky-draw` を選択
3. 以下を設定：
   - **Framework Preset**：Other
   - **Build Command**：`yarn build`
   - **Output Directory**：`dist`
4. **Deploy** をクリック
5. デプロイ完了後 → **Settings** → **General** → **Node.js Version** → **20.x** に変更 → **Save**
6. **Deployments** → 最新の項目の `...` → **Redeploy**

デプロイ成功後、以下のような URL が発行されます：
```
https://my-lucky-draw.vercel.app
```

> **Vercel 利用時の注意：** デプロイ後、各ユーザーのブラウザにはそれぞれの `localStorage` が存在します。同期を正しく機能させるには、メインページと表示ページを必ず**同じコンピュータの同じブラウザ**で開いてください。

---

## ステップ 5：カスタマイズ

### 背景画像の変更
以下のファイルを同名で置き換える：
```
src/assets/images/Cover.jpg
```

### イベントタイトルの変更
`src/pages/landing.pug` を開き、以下を探す：
```pug
h1.title-text Lucky Draw
```
自分のイベント名に変更する。

### デフォルト賞の変更
`src/assets/js/PrizeManager.ts` を開き、以下を探す：
```typescript
this.prizes = [
  { id: '1', name: '1st Prize', count: 1, winners: [] },
  { id: '2', name: '2nd Prize', count: 2, winners: [] },
  { id: '3', name: '3rd Prize', count: 5, winners: [] },
];
```
自分の賞に変更する。

---

## ステップ 6：再ビルドとプッシュ

変更のたびに実行：
```bash
yarn build
git add .
git commit -m "feat: customize for my event"
git push
```

Vercel が自動的に再デプロイします。

---

## ステップ 7：カスタムドメインの設定

### 7-1. DNS を Cloudflare に移管（推奨）

1. https://cloudflare.com で無料アカウントを作成
2. **Add a Site** → ドメインを入力 → **Free** を選択
3. DNS スキャン完了後 **Continue** をクリック
4. Cloudflare が提供する 2 つの Nameserver を控える：
   ```
   nina.ns.cloudflare.com
   rick.ns.cloudflare.com
   ```
5. ドメイン管理会社（Hostinger 等）→ **Nameservers** → Cloudflare の NS に変更
6. 24〜48 時間待つ

### 7-2. Cloudflare に DNS レコードを追加

Cloudflare → **DNS** → **Add record**：
```
Type:   CNAME
Name:   draw
Target: cname.vercel-dns.com
Proxy:  OFF（灰色の雲マーク、オレンジではない）
TTL:    Auto
```

### 7-3. Vercel にドメインを紐付け

1. Vercel → プロジェクト → **Settings** → **Domains**
2. `draw.あなたのドメイン.com` を入力 → **Add**
3. **Valid Configuration** が表示されるまで待つ
4. SSL は自動で設定される

---

## 設定完了後のアクセス

```
https://draw.あなたのドメイン.com              ← 抽選メインページ
https://draw.あなたのドメイン.com/display.html ← 大画面表示ページ
```

---

## 日常的な更新コマンド

```bash
yarn build
git add .
git commit -m "変更内容を説明"
git push
# Vercel が自動再デプロイ
```

---

## アプリの使い方

### 1. 参加者を追加
右上の ⚙️ **Settings** → **Name List** を開く

名前を 1 行ずつ貼り付けるか、**Upload CSV** で `.csv` ファイルをインポート（1 列目が名前として使用されます）。

> すでに当選した参加者はインポート時に自動的に除外されます。

**Save** をクリック。

### 2. 賞を設定
Settings → **Prize Settings**：賞の名前と当選人数を入力 → **Save**。

### 3. プロジェクターに大画面表示を映す
ページ右下の **📺 Display** リンクをクリックして `display.html` を新しいタブで開く。

**同じコンピュータで操作する必要があります：** このタブをプロジェクターやサブスクリーンに映すと、当選者一覧・次の賞・参加者統計・時計がリアルタイムで表示されます。

### 4. 抽選
賞ボタンをクリックして選択 → **Draw** をクリック → 当選者が登場 🎊

抽選後は当選者の名前が自動的にマスキングされます（プライバシー保護）。抽選シードも表示されます。

### 5. 記録とエクスポート
右上の ✅ アイコンをクリック → 全当選者（タイムスタンプ付き）を確認 → **Export CSV** でダウンロード。

---

## よくある問題

| 問題 | 解決方法 |
|------|----------|
| `node -v` が v20 以上を表示 | Node.js 18.x を再インストール |
| `yarn install` が失敗 | `rmdir /s /q node_modules` 後に再インストール |
| Vercel デプロイが失敗 | 設定で Node.js Version を 20.x に変更 |
| display ページが同期しない | メインページと表示ページが**同じコンピュータの同じブラウザ**で開かれているか確認 |
| ドメインが反映されない | DNS の反映に最大 48 時間かかる |
| ブラウザを閉じると設定が消える | プライベート/シークレットモードは使用しない。閉じる前に CSV でエクスポートする |

---

## 上級者向け：クロスデバイス同期（自己研究）

別のデバイスで表示ページを同期させたい場合は、Firebase Realtime Database などのリアルタイムデータベースの統合を検討してください。コードベースには Firebase インターフェースが含まれていますが、デフォルトでは無効化されています。ご自身のユースケースに合わせて拡張してください。
