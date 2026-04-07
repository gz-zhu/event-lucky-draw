# 🚀 Event Lucky Draw — 完整部署指南

這份指南帶你從零開始，完整部署屬於自己的活動抽獎系統 — 本地使用、雲端部署、自訂網域。

---

## 📦 資料儲存說明（請先閱讀）

> **所有資料儲存在執行抽獎的電腦瀏覽器的 `localStorage` 中，無需帳號或雲端服務。**

- 設定、名單、獎項設定、得獎紀錄均存於本機瀏覽器。
- 清除瀏覽器資料會清除所有紀錄 — **清除前請先匯出 CSV 備份**。

### 大屏展示頁同步說明

`/display.html` 每 2 秒讀取同一份 `localStorage`。

- ✅ 在**同一台電腦的同一個瀏覽器**開啟主頁和展示頁 → 展示頁即時同步
- ❌ 在**另一台裝置或另一個瀏覽器**開啟展示頁 → 無法同步（`localStorage` 不跨裝置共享）

> **活動建議：** 在操作者的筆電上開啟主頁，在同一筆電的另一分頁開啟 `/display.html`，再將該視窗延伸至投影機或第二螢幕。

---

## 現場操作重點

- 參加者名單與草稿會自動保留在同一瀏覽器中，所以重新整理、誤關頁面或突然斷電後，回到同一台電腦同一個瀏覽器仍可恢復。
- 名單區下方會即時顯示統計資訊：輸入筆數、實際獎池人數、重複筆數、已中獎排除數。
- 倒數計時屬於一次性設定；若啟用 Auto 並在歸零後自動抽獎，該次倒數會在抽獎後自動清除。
- 倒數進行時，其他獎項按鈕與 Settings 會被鎖定，避免現場誤操作。
- 抽選時間可在 Settings 內用 `5 秒` 為單位調整。

---

## 第一步：安裝必要工具

### Node.js 18.x（必須是版本 18）

| 作業系統 | 下載連結 |
|---------|----------|
| Windows 64-bit | https://nodejs.org/download/release/v18.20.4/node-v18.20.4-x64.msi |
| Mac (Intel) | https://nodejs.org/download/release/v18.20.4/node-v18.20.4.pkg |
| Mac (M1/M2) | https://nodejs.org/download/release/v18.20.4/node-v18.20.4-arm64.pkg |

安裝完後驗證：
```bash
node -v   # 必須顯示 v18.x.x
```

### Git
- Windows：https://git-scm.com/download/win
- Mac：在終端機執行 `xcode-select --install`

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

看到 `Done` 代表建置成功，`/dist` 資料夾即為可部署的檔案。

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

> **Vercel 使用注意：** 每個使用者的瀏覽器各自儲存自己的 `localStorage`。請在**同一台電腦**上開啟主頁和展示頁，確保同步正常運作。

---

## 第五步：客製化內容

### 語言切換
系統內建語言切換功能（頁面左下角 🌐 地球圖示）。點擊可選擇 **English**、**繁體中文** 或 **日本語**，選擇會自動記憶，大屏展示頁（`/display.html`）也會同步套用相同語言。

無需修改任何程式碼即可切換語言。

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
改為自己的活動名稱。也可以在 Settings → **Draw Title** 即時修改。

### 更改預設獎項
開啟 `src/assets/js/PrizeManager.ts`，找到：
```typescript
this.prizes = [
  { id: '1', name: '1st Prize', count: 1, winners: [] },
  { id: '2', name: '2nd Prize', count: 2, winners: [] },
  { id: '3', name: '3rd Prize', count: 5, winners: [] },
];
```
改為自己的獎項名稱與人數。也可以在 Settings → **Prize Settings** 即時新增或修改。

---

## 第六步：重新建置並上傳

每次修改程式碼後執行：
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
4. 記下 Cloudflare 提供的兩個 Nameserver，例如：
   ```
   nina.ns.cloudflare.com
   rick.ns.cloudflare.com
   ```
5. 前往域名商（Hostinger、GoDaddy 等）→ **Nameservers** → 改為 Cloudflare 的兩個 NS
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
https://draw.你的網域.com/display.html ← 大屏展示頁（投影機）
```

---

## 使用方式

### 1. 新增參加者
點擊右上角 ⚙️ **Settings** → **Name List** → 逐行貼上名字，或點擊 **Upload CSV** 匯入。

CSV 支援多欄位，每列所有欄位會合併為一筆名字。

使用工具列進行**洗牌**、**遮蔽所有名字**、**合併重複**、**清除**。點擊 **Save**。
可先看名單下方統計區，確認目前真正可進入抽選的獎池人數。

已得獎者在匯入時自動從名單中移除。

### 2. 設定獎項
Settings → **Prize Settings** → 輸入獎項名稱與得獎人數。
可選填預定開獎時間與獎品說明（顯示於大屏展示頁）。點擊 **Save**。

### 3. 設定倒數計時（選填）
Settings → **Countdown Timer** → 為指定獎項設定倒數時長。
在倒數進度條上開啟 **Auto**，時間到時自動執行抽獎。
倒數一旦開始，其他獎項和設定操作會暫時鎖定，直到倒數結束或取消。

### 4. 開啟大屏展示頁
點擊右下角 **📺 Display** 連結，在新分頁開啟（**必須在同一台電腦**）。
將該視窗延伸至投影機或大螢幕。

展示頁顯示：即時得獎名單、獎項列表（含預定開獎時間）、參加人數統計、即時時鐘。

### 5. 抽獎
點擊獎項按鈕選擇獎項 → 點擊 **Draw** → 得獎者出現 🎊

抽獎後姓名自動遮蔽（隱私保護），並顯示抽獎種子供事後稽核。

### 6. 查看及匯出紀錄
點擊右上角 ✅ 圖示 → 查看所有得獎者（含時間戳記與抽獎種子）→ **Export CSV**。

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

## 常見問題

| 問題 | 解決方法 |
|------|----------|
| `node -v` 顯示 v20 以上 | 重新安裝上方提供的 Node.js 18.x |
| `yarn install` 失敗 | 刪除 `node_modules` 資料夾，再重新執行 `yarn install` |
| `yarn` 指令無法識別 | 執行 `npm install -g yarn`，重新開啟終端機 |
| Vercel 部署失敗 | 在 Vercel 專案設定中將 Node.js Version 改為 **20.x** |
| 展示頁資料不同步 | 確認主頁和展示頁在**同一台電腦的同一個瀏覽器**開啟 |
| 網域未生效 | DNS 最長需要 48 小時才能生效 |
| 關閉瀏覽器後設定消失 | 不要使用無痕模式；關閉前請先匯出 CSV |
| 部署後頁面空白 | 先執行 `yarn build`，再 push — Vercel 從 `/dist` 資料夾部署 |

---

## 進階：跨裝置同步

若需要讓展示頁在另一台裝置上同步，本系統已內建 Firebase Realtime Database 介面。預設不強制啟用，可在 `src/assets/js/PrizeManager.ts` 中填入自己的 Firebase 專案憑證來啟用。
