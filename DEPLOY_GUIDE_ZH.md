# 🚀 Event Lucky Draw — 完整部署指南

---

## 第一步：安裝必要工具

### Node.js 18.x（必須是版本 18）

| 作業系統 | 下載連結 |
|------|----------|
| Windows 64-bit | https://nodejs.org/download/release/v18.20.4/node-v18.20.4-x64.msi |
| Mac (Intel) | https://nodejs.org/download/release/v18.20.4/node-v18.20.4.pkg |
| Mac (M1/M2) | https://nodejs.org/download/release/v18.20.4/node-v18.20.4-arm64.pkg |

安裝完後驗證：
```bash
node -v   # 必須顯示 v18.x.x
```

### Git
- Windows：https://git-scm.com/download/win
- Mac：終端機執行 `xcode-select --install`

### Yarn
```bash
npm install -g yarn
yarn -v   # 應顯示 1.x.x
```

---

## 第二步：取得程式碼並建置

```bash
git clone https://github.com/gz-zhu/event-lucky-draw.git
cd event-lucky-draw
yarn install
yarn build
```

看到 `Done` 代表建置成功。

---

## 第三步：上傳到自己的 GitHub

1. 前往 https://github.com 註冊帳號
2. 右上角 **+** → **New repository**
3. 輸入名稱（如 `my-lucky-draw`）→ **Create repository**（不要勾選任何初始化選項）
4. 執行：

```bash
git remote remove origin
git remote add origin https://github.com/你的帳號/my-lucky-draw.git
git branch -M main
git push -u origin main
```

---

## 第四步：部署到 Vercel

1. 前往 https://vercel.com → 用 GitHub 帳號登入
2. **Add New Project** → 選擇 `my-lucky-draw`
3. 設定如下：
   - **Framework Preset**：Other
   - **Build Command**：`yarn build`
   - **Output Directory**：`dist`
4. 點擊 **Deploy**
5. 部署完成後 → **Settings** → **General** → **Node.js Version** → 改為 **20.x** → **Save**
6. 回到 **Deployments** → 最新一筆右側 `...` → **Redeploy**

部署成功後會得到網址，如：
```
https://my-lucky-draw.vercel.app
```

---

## 第五步：設定自己的 Firebase（跨裝置同步必須）

> ⚠️ 必須建立自己的 Firebase 專案，否則資料會與他人共享。

1. 前往 https://console.firebase.google.com
2. **Add project** → 輸入名稱 → 關閉 Google Analytics → **Create project**
3. 左側選單：**Realtime Database** → **Create database** → **以測試模式啟動** → **啟用**
4. 左側齒輪 → **專案設定** → 往下找 **Your apps** → 點 `</>` → 輸入應用程式名稱 → **Register app**
5. 複製 `firebaseConfig` 物件

開啟 `src/assets/js/PrizeManager.ts`，找到：
```typescript
const firebaseConfig = {
  apiKey: 'AIzaSy...',
  ...
};
```
替換成自己的 `firebaseConfig`。

---

## 第六步：客製化內容

### 更換背景圖片
替換以下檔案（保持相同檔名）：
```
src/assets/images/Cover.jpg
```

### 更改活動標題
開啟 `src/pages/landing.pug`，找到：
```pug
h1.title-text Lucky Draw
```
改為自己的活動名稱。

### 更改預設獎項
開啟 `src/assets/js/PrizeManager.ts`，找到：
```typescript
this.prizes = [
  { id: '1', name: '1st Prize', count: 1, winners: [] },
  { id: '2', name: '2nd Prize', count: 2, winners: [] },
  { id: '3', name: '3rd Prize', count: 5, winners: [] },
];
```
改為自己的獎項設定。

---

## 第七步：重新建置並上傳

每次修改完執行：
```bash
yarn build
git add .
git commit --no-verify -m "feat: 客製化活動內容"
git push
```

Vercel 會自動重新部署。

---

## 第八步：設定自訂網域

### 8-1. 將 DNS 轉移到 Cloudflare（推薦）

1. 前往 https://cloudflare.com 註冊免費帳號
2. **Add a Site** → 輸入網域 → 選擇 **Free**
3. Cloudflare 掃描完 DNS 後點 **Continue**
4. 記下 Cloudflare 給的兩個 Nameserver，例如：
   ```
   nina.ns.cloudflare.com
   rick.ns.cloudflare.com
   ```
5. 前往域名商（Hostinger 等）→ **Nameservers** → 改為 Cloudflare 的兩個 NS
6. 等待 24～48 小時生效

### 8-2. 在 Cloudflare 新增 DNS 記錄

Cloudflare → **DNS** → **Add record**：
```
Type:   CNAME
Name:   draw
Target: cname.vercel-dns.com
Proxy:  關閉（灰色雲朵，不是橘色）
TTL:    Auto
```

### 8-3. 在 Vercel 綁定網域

1. Vercel → 專案 → **Settings** → **Domains**
2. 輸入 `draw.你的網域.com` → **Add**
3. 等待顯示 **Valid Configuration**
4. SSL 憑證自動配置完成

---

## 設定完成後的訪問網址

```
https://draw.你的網域.com              ← 抽獎主頁
https://draw.你的網域.com/display.html ← 大屏展示頁
```

---

## 日常更新指令

```bash
yarn build
git add .
git commit --no-verify -m "說明改了什麼"
git push
# Vercel 自動重新部署
```

---

## 常見問題

| 問題 | 解決方法 |
|------|----------|
| `node -v` 顯示 v20 以上 | 重新安裝 Node.js 18.x |
| `yarn install` 失敗 | 執行 `rmdir /s /q node_modules` 再重新安裝 |
| Vercel 部署失敗 | 在設定中將 Node.js Version 改為 20.x |
| 展示頁資料不同步 | 確認使用了自己的 Firebase 設定 |
| 網域未生效 | DNS 最長需要 48 小時才能生效 |
