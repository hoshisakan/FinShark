# FinShark Frontend Guide

這份文件介紹 `frontend` 專案的用途、檔案結構與啟動方式。

## 專案用途

`frontend` 是 FinShark 的 React + Vite 前端，負責：
- 使用者登入與註冊
- 顯示股票清單（Dashboard）
- 股票搜尋與新增
- Portfolio 新增/刪除與列表
- Comment 新增/刪除與列表

前端透過 `VITE_API_URL` 串接後端 API。

## 目錄與檔案說明

以下以「目前有維護價值的原始碼/設定檔」為主，不包含 `node_modules`、`dist` 等產物。

### 根目錄

- `frontend/.env`
  - 前端環境變數，目前使用：
  - `VITE_API_URL=http://localhost:5187/api/`

- `frontend/package.json`
  - 專案套件與腳本：
  - `npm run dev`：啟動開發伺服器
  - `npm run build`：TypeScript 編譯 + Vite build
  - `npm run lint`：ESLint 檢查
  - `npm run preview`：預覽 build 結果

- `frontend/package-lock.json`
  - npm 鎖定檔，確保安裝版本一致。

- `frontend/index.html`
  - Vite 單頁應用入口 HTML。

- `frontend/vite.config.ts`
  - Vite 設定（目前啟用 React plugin）。

- `frontend/tsconfig.json`
  - TypeScript 專案參考（app/node）。

- `frontend/tsconfig.app.json`
  - 前端應用（`src`）的 TypeScript 設定。

- `frontend/tsconfig.node.json`
  - Node/Vite 設定檔的 TypeScript 設定。

### `src` 原始碼

- `src/main.tsx`
  - 前端進入點，掛載 React root，包上 `AuthProvider`。

- `src/App.tsx`
  - 根組件，依登入狀態切換：
  - 已登入 -> `Dashboard`
  - 未登入 -> `LoginPage`

- `src/index.css`
  - 全域基礎樣式（字型、body、reset 類設定）。

- `src/App.css`
  - 頁面版型樣式（登入、Dashboard、表格、panel、表單等）。

#### Context

- `src/Context/AuthContext.tsx`
  - 管理登入狀態（user/token/isAuthenticated）
  - 提供 `login/register/logout`
  - 將 token/user 存到 `localStorage`

#### Models

- `src/Models/AppUser.ts`
  - 使用者相關型別（`AppUser`, `AuthUser`）。

- `src/Models/Stock.ts`
  - 股票與留言型別（`Stock`, `Comment`）。

#### Services

- `src/Services/ApiService.ts`
  - Axios 共用實例
  - 讀取 `VITE_API_URL` 做 baseURL
  - Request interceptor：自動加 `Authorization: Bearer <token>`
  - Response interceptor：401 時清理本地 token/user

- `src/Services/AuthService.ts`
  - `login` / `register` API 呼叫（`/account/*`）。

- `src/Services/StockService.ts`
  - 取得股票列表、新增股票（`/stock`）。

- `src/Services/PortfolioService.ts`
  - 讀取/新增/刪除 portfolio（`/portfolio`）。

- `src/Services/CommentService.ts`
  - 讀取/新增/刪除 comment（`/comment`）。

#### Pages / Components

- `src/Pages/LoginPage.tsx`
  - 登入與註冊共用頁
  - 含密碼規則檢查與錯誤提示。

- `src/Pages/Dashboard.tsx`
  - 主頁：
  - 股票搜尋與列表
  - 新增股票
  - Portfolio 管理
  - Comment 管理

- `src/Components/StockList.tsx`
  - 股票表格元件，支援選取股票（供 Comments 區塊使用）。

- `src/assets/react.svg`
  - Vite 預設資產（可刪除，不影響功能）。

## 啟動方式

## 1) 前置條件

- Node.js 18+（建議 LTS）
- npm 9+
- 後端 API 可用（預設 `http://localhost:5187`）

## 2) 安裝依賴

在 `frontend` 目錄執行：

```bash
npm install
```

## 3) 確認環境變數

檢查 `frontend/.env`：

```env
VITE_API_URL=http://localhost:5187/api/
```

> 若後端 port 改變，只需更新這一行。

## 4) 啟動開發模式

```bash
npm run dev
```

啟動後通常會是：
- `http://localhost:5173`

## 5) 建置與預覽（可選）

```bash
npm run build
npm run preview
```

## 常見問題

- 前端顯示 API 錯誤
  - 確認後端已啟動
  - 確認 `.env` 的 `VITE_API_URL` 正確
  - 改完 `.env` 需重啟 `npm run dev`

- 登入後仍拿不到授權資料
  - 確認後端 `login` 回傳有 `token`
  - 確認瀏覽器 `localStorage` 有 `auth_token`

- 401 一直出現
  - token 可能過期或無效，請重新登入
  - `ApiService` 在 401 會清掉本地登入資訊
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
