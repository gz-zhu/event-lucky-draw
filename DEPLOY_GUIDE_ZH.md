# 🚀 Event Lucky Draw — 完整部署指南

這份指南將帶你從零開始，完整部署一個屬於自己的活動抽獎系統。

**系統功能一覽：**
- 🏆 多獎項設定，可自訂獎項名稱與人數
- 📂 CSV 批次匯入參加者名單
- 📋 得獎紀錄含時間戳記與抽獎種子，可匯出 CSV
- 📺 大屏展示頁 (`/display.html`) — 投影機專用，顯示即時得獎資訊
- 🔢 每次抽獎顯示抽獎種子，供事後稽核
- 🔒 得獎者姓名自動遮蔽（隱私保護）
- 🚫 自動排重 — 已得獎者不會再次出現在名單中
- ⚡ 中斷復原 — 瀏覽器意外關閉後可還原名單
- 🎊 彩帶 + 星星 + 彩燈動畫

---

## 📦 資料儲存說明（重要）

> **所有資料儲存在執行抽獎的那台電腦的瀏覽器 `localStorage` 中。**

- 不需要帳號或雲端服務
- 設定、名單、得獎紀錄 — 全部存在該電腦的瀏覽器裡
- 清除瀏覽器資料會清除所有紀錄（請先匯出 CSV 備份）

### 大屏展示頁同步說明

`/display.html` 每 2 秒讀取同一份 `localStorage`，**自動同步更新**。

**這代表：**
- ✅ 在**同一台電腦的同一個瀏覽器**開啟主頁和展示頁 → 展示頁即時同步
- ❌ 在**另一台裝置或另一個瀏覽器**開啟展示頁 → 無法同步（`localStorage` 不跨裝置共享）

> **活動建議：** 在操作者的筆電上開啟主頁抽獎，在同一筆電的另一個視窗或分頁開啟 `/display.html`，再將該視窗延伸投影到大螢幕或投影機。

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

### 本地預覽

```bash
yarn start
```

開啟瀏覽器前往 `http://localhost:8888`，即可在本地端使用完整功能。

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

> **Vercel 使用注意：** 部署到 Vercel 後，每個使用者的瀏覽器各自儲存自己的 `localStorage`。因此請在**同一台電腦**上開啟主頁和展示頁，確保同步正常運作。

---

## 第五步：客製化內容

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

## 第六步：重新建置並上傳

每次修改完執行：
```bash
yarn build
git add .
git commit -m "feat: 客製化活動內容"
git push
```

Vercel 會自動重新部署。

---

## 第七步：設定自訂網域

### 7-1. 將 DNS 轉移到 Cloudflare（推薦）

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

### 7-2. 在 Cloudflare 新增 DNS 記錄

Cloudflare → **DNS** → **Add record**：
```
Type:   CNAME
Name:   draw
Target: cname.vercel-dns.com
Proxy:  關閉（灰色雲朵，不是橘色）
TTL:    Auto
```

### 7-3. 在 Vercel 綁定網域

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
git commit -m "說明改了什麼"
git push
# Vercel 自動重新部署
```

---

## 部署完成後的使用方式

### 1. 新增參加者
點擊右上角 ⚙️ **Settings** → **Name List**

逐行貼上名字，或點擊 **Upload CSV** 匯入 `.csv` 檔案（第一欄為名字）。

> 已得獎者會在匯入時自動從名單中移除。

點擊 **Save**。

### 2. 設定獎項
Settings → **Prize Settings**：輸入獎項名稱與人數 → **Save**。

### 3. 開啟展示頁投影到大螢幕
點擊頁面右下角的 **📺 Display** 連結，在新分頁開啟大屏展示頁。

**必須在同一台電腦上操作：** 將此分頁投影到大螢幕，即時顯示得獎名單、即將開獎的獎項、參加人數統計、時鐘。

### 4. 抽獎
點擊獎項按鈕選擇獎項 → 點擊 **Draw** → 得獎者出現 🎊

抽獎後姓名自動遮蔽（隱私保護），並顯示抽獎種子供稽核。

### 5. 紀錄與匯出
點擊右上角 ✅ 圖示 → 查看所有得獎者（含時間戳記）→ **Export CSV** 下載。

---

## 常見問題

| 問題 | 解決方法 |
|------|----------|
| `node -v` 顯示 v20 以上 | 重新安裝 Node.js 18.x |
| `yarn install` 失敗 | 執行 `rmdir /s /q node_modules` 再重新安裝 |
| Vercel 部署失敗 | 在設定中將 Node.js Version 改為 20.x |
| 展示頁資料不同步 | 確認主頁和展示頁在**同一台電腦的同一個瀏覽器**開啟 |
| 網域未生效 | DNS 最長需要 48 小時才能生效 |
| 關閉瀏覽器後設定消失 | 不要使用無痕模式；關閉前請先匯出 CSV |

---

## 進階擴展：跨裝置同步（自行研究）

若需要讓展示頁在另一台裝置上同步，可研究整合 Firebase Realtime Database 或其他即時資料庫。本版本的程式碼中保留了 Firebase 的介面，但預設未啟用，請自行探索。
