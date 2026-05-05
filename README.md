# Beyond South 2026 — 南向無界

2026/06/15 於台南歸仁資安大樓舉辦的企業年會官方網站。

線上版本：https://www.beyondsouth-tw.com

---

## 一分鐘認識這個專案

- **靜態網站**：React + TypeScript + Vite，build 出單一 HTML 檔
- **三個頁面**：首頁（`/`）、活動背景（`/background`）、報名頁（`/register`），都用 HashRouter
- **Host**：GitHub Pages（直接從 repo 根目錄 serve `index.html`）
- **網域**：Gandi 管理 DNS，CNAME 指向 GitHub Pages

## 技術棧

| 類別 | 用什麼 |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 6 + `vite-plugin-singlefile`（所有 JS/CSS inline 進一個 HTML）|
| 樣式 | Tailwind CSS v4（自訂顏色定義在 `src/index.css` 的 `@theme`）|
| 路由 | react-router-dom v7（HashRouter，URL 會帶 `#/`）|
| 動畫 | motion v12（注意：有 bug，見下方 ⚠️ 說明） |
| 圖示 | lucide-react |

## 專案結構

```
beyondsouth/
├── src/
│   ├── main.tsx              入口
│   ├── App.tsx               路由設定 + 全站浮動 CTA
│   ├── index.css             Tailwind theme 顏色 + motion CSS workaround
│   ├── pages/
│   │   ├── Home.tsx          首頁（hero、講者、議程、六大議題）
│   │   ├── Background.tsx    活動背景頁
│   │   └── Register.tsx      報名頁
│   ├── components/
│   │   ├── BackgroundCanvas.tsx  背景粒子動畫
│   │   └── FloatingCTA.tsx       右下角浮動報名按鈕
│   └── lib/utils.ts          cn() className 合併
├── template.html             ← Vite build 的乾淨入口模板
├── index.html                ← Build 產物（部署用，~478KB）
├── 404.html                  ← 同 index.html 的副本（GH Pages SPA fallback）
├── CNAME                     ← www.beyondsouth-tw.com
├── package.json
└── vite.config.ts
```

---

## 本地開發

```bash
npm install
npm run dev      # 開發伺服器 http://localhost:3000
npm run build    # 產生 dist/index.html，自動複製到 root index.html + 404.html
npm run lint     # tsc --noEmit 型別檢查
npm run preview  # 預覽 build 結果
```

---

## 部署流程

GitHub Pages 直接從 `main` 分支 root serve，所以部署就是：

```bash
npm run build           # 重 build（會自動更新 index.html、404.html）
git add -A
git commit -m "..."
git push
```

1–2 分鐘後 https://www.beyondsouth-tw.com 就會更新。

---

## 內容更新指南

### 1️⃣ 講者陣容（從 Google Sheet 動態載入）

**Sheet 設定**：
1. 在 Google Sheet 第一列填欄位名（必填 `name`，其他可選）：
   ```
   name, title, company, topic, session, photo, quote, instagram, linkedin, twitter, facebook
   ```
2. 「檔案 → 共用 → 發佈到網路」→ 選「逗號分隔值 (.csv)」→ 拿到網址，形如：
   ```
   https://docs.google.com/spreadsheets/d/e/.../pub?gid=0&single=true&output=csv
   ```

**告訴網站去哪抓**（兩種方式）：

- **方式 A（推薦）**：把網址填到 [src/pages/Home.tsx:13](src/pages/Home.tsx) 的 `GOOGLE_SHEET_CSV_URL`，重 build push
- **方式 B（不改檔案）**：開瀏覽器 DevTools → Console → 貼這行：
   ```js
   localStorage.setItem('bs26_sheet_url', '你的CSV網址')
   ```
   然後重整頁面

### 2️⃣ 講者照片

- **路線 A（最省力）**：照片放 Google Drive，設定為「知道連結的使用者皆可檢視」，把分享連結直接貼到 Sheet 的 `photo` 欄位。程式裡 `normalizePhoto()` 會自動轉成可用的圖片 URL
- **路線 B（最穩定）**：用 ImgBB / Cloudinary / imgur 等圖床，把直連網址（結尾 `.jpg`/`.png`）貼到 `photo` 欄位

⚠️ **不要把照片放 `public/speakers/`**——會破壞單檔部署流程。

### 3️⃣ 報名連結（Accupass URL）

**目前寫在兩個地方**，要改記得兩處都更新：
- [src/components/FloatingCTA.tsx:9](src/components/FloatingCTA.tsx) — 右下角浮動按鈕
- [src/pages/Background.tsx:154](src/pages/Background.tsx) — 活動背景頁底部「立即報名年會」按鈕

### 4️⃣ 議程／六大議題／文案

直接改 [src/pages/Home.tsx](src/pages/Home.tsx) 對應區塊的陣列資料（agenda、sessions 等都在 JSX 裡的 `[ ... ].map(...)` 結構）。

### 5️⃣ 倒數計時目標日期

- 首頁倒數：[src/pages/Home.tsx:47](src/pages/Home.tsx) `new Date('2026-06-15T09:00:00+08:00')`
- 報名頁倒數：[src/pages/Register.tsx:14](src/pages/Register.tsx) `new Date('2026-05-01T00:00:00+08:00')`

---

## ⚠️ 維護注意事項（很重要）

### Build pipeline 的 template/output 循環

Root 的 `index.html` 是**部署成品（~478KB）**，但 Vite build 也需要一個 HTML 入口檔。為了解決衝突，有一個獨立的 `template.html`（12 行的乾淨模板）。

`npm run build` 會自動：
1. 把 `template.html` 複製成 `index.html`（Vite 才找得到 entry）
2. 跑 `vite build` → 產出 `dist/index.html`
3. 把 `dist/index.html` 複製回 `index.html` 跟 `404.html`

**❌ 不要手動編輯 root 的 `index.html`**——下次 build 會被覆蓋。要改 HTML head 改 [template.html](template.html)，要改畫面內容改 src/。

### Motion 動畫的 CSS workaround

`src/index.css` 底下有這段：

```css
[style*="opacity: 0"][style*="transform"] {
  opacity: 1 !important;
  transform: none !important;
}
```

這是 motion v12 + React 19 + production build 的相容性 bug 救援——所有 `<motion.X>` 元件 build 後會卡在 `initial={opacity:0}` 永不 animate，導致整頁文字隱形。這條 CSS 強制讓它顯示。

代價是失去進場動畫，但內容能看到。等 motion 修好相容性後可以拿掉這條 CSS。

### Tailwind v4 的 `bg-bg-alt/50` 不會編譯

`bg-bg-alt` 因為色名跟 `bg-` prefix 衝突，opacity modifier 不會產生對應 utility。如果需要透明深色背景，用 arbitrary value：

```jsx
<div className="bg-[#0d0d1f]/50">  {/* OK */}
<div className="bg-bg-alt/50">     {/* ❌ 不會生效 */}
```

---

## 常見問題

**Q：點某個按鈕後頁面變黑？**
A：通常是 motion 動畫 bug。確認 `src/index.css` 底部的 workaround CSS 還在。

**Q：講者照片載不出來？**
A：檢查 (1) Google Drive 圖片權限是否設成「任何知道連結的人皆可檢視」、(2) Sheet 的 `photo` 欄位網址是否完整、(3) 網路可不可以連到 `lh3.googleusercontent.com`。

**Q：dev 跑得起來但 build 後不一樣？**
A：99% 是因為手動編輯了 root `index.html`。改 src/，跑 `npm run build`。

**Q：要在報名頁也加浮動按鈕？**
A：[src/App.tsx](src/App.tsx) 裡 `<FloatingCTA />` 已經放在 `<Routes>` 之外，所有頁面都會顯示，不用個別加。
