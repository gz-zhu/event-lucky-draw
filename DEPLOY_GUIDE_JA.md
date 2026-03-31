# 🚀 Event Lucky Draw — 完全デプロイガイド

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

---

## ステップ 5：Firebase のセットアップ（クロスデバイス同期に必須）

> ⚠️ 必ず自分の Firebase プロジェクトを作成してください。そうしないとデータが他のユーザーと共有されます。

1. https://console.firebase.google.com へアクセス
2. **Add project** → 名前を入力 → Google Analytics を無効化 → **Create project**
3. 左側メニュー：**Realtime Database** → **Create database** → **テストモードで開始** → **有効にする**
4. 左側メニュー：歯車アイコン → **プロジェクトの設定** → 下にスクロールして **Your apps** → `</>` をクリック → アプリ名を入力 → **Register app**
5. `firebaseConfig` オブジェクトをコピー

`src/assets/js/PrizeManager.ts` を開き、以下を探す：
```typescript
const firebaseConfig = {
  apiKey: 'AIzaSy...',
  ...
};
```
自分の `firebaseConfig` に置き換える。

---

## ステップ 6：カスタマイズ

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

## ステップ 7：再ビルドとプッシュ

変更のたびに実行：
```bash
yarn build
git add .
git commit --no-verify -m "feat: customize for my event"
git push
```

Vercel が自動的に再デプロイします。

---

## ステップ 8：カスタムドメインの設定

### 8-1. DNS を Cloudflare に移管（推奨）

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

### 8-2. Cloudflare に DNS レコードを追加

Cloudflare → **DNS** → **Add record**：
```
Type:   CNAME
Name:   draw
Target: cname.vercel-dns.com
Proxy:  OFF（灰色の雲マーク、オレンジではない）
TTL:    Auto
```

### 8-3. Vercel にドメインを紐付け

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
git commit --no-verify -m "変更内容を説明"
git push
# Vercel が自動再デプロイ
```

---

## よくある問題

| 問題 | 解決方法 |
|------|----------|
| `node -v` が v20 以上を表示 | Node.js 18.x を再インストール |
| `yarn install` が失敗 | `rmdir /s /q node_modules` 後に再インストール |
| Vercel デプロイが失敗 | 設定で Node.js Version を 20.x に変更 |
| display ページが同期しない | 自分の Firebase 設定を使用しているか確認 |
| ドメインが反映されない | DNS の反映に最大 48 時間かかる |
