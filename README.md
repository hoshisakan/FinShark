# FinShark

FinShark 是一個完整的全端股票追蹤專案，包含：
- `frontend`：React + Vite 前端（登入/註冊、Dashboard、Stocks、Comments、Portfolio）
- `api`：ASP.NET Core Web API（JWT + Identity + EF Core + SQL Server）
- `reverse_proxy`：Nginx（HTTPS、反向代理 `/api`、靜態檔掛載）
- `mssql`：SQL Server 2022

---

## 技術棧

- Frontend: React 19, Vite 7, TypeScript, Axios
- Backend: .NET 8, ASP.NET Core, EF Core, ASP.NET Identity, JWT
- Infra: Docker Compose, Nginx, MSSQL 2022

---

## 專案架構

```text
FinShark/
├─ frontend/                # React + Vite 前端
├─ api/                     # ASP.NET Core Web API
├─ conf/nginx/              # Nginx 設定與 Dockerfile
├─ conf/mssql/              # MSSQL Dockerfile
├─ certs/nginx/             # HTTPS 憑證
├─ docker-compose.yml
└─ .env                     # Docker 服務與網路參數
```

---

## Docker 服務說明

`docker-compose.yml` 目前包含 4 個服務：

1. `reverse_proxy`（Nginx）
   - 掛載：
     - `./conf/nginx/conf.d` -> `/etc/nginx/conf.d`
     - `./certs/nginx` -> `/etc/nginx/ssl`
     - `./frontend/dist` -> `/usr/share/nginx/html`
   - 對外：
     - `80`（HTTP，轉 HTTPS）
     - `443`（HTTPS）
   - 路由重點（`server_https.conf`）：
     - `/` -> React 靜態檔（`try_files ... /index.html`）
     - `/api` -> proxy 到 `api:5187`

2. `frontend`
   - Node 容器跑 `vite` dev server
   - 對外 `5173:5173`
   - 主要用於開發除錯（生產環境可只用 Nginx + dist）

3. `api`
   - ASP.NET Core API
   - 對外 `5187:5187`
   - 使用 `appsettings.json` 連線 `mssql:1433`

4. `mssql`
   - SQL Server 2022
   - 對外 `1439:1433`
   - volume 掛載資料、備份、logs、secrets

---

## 關鍵設定檔

### 根目錄 `.env`（Docker 編排）

常用參數：
- Nginx: `NGINX_HTTP_OUTER_PORT`, `NGINX_HTTPS_OUTER_PORT`
- Frontend: `FRONTEND_OUTER_PORT`, `FRONTEND_INNER_PORT`
- API: `API_OUTER_PORT`, `API_INNER_PORT`, `ASPNETCORE_ENVIRONMENT`
- DB: `MSSQL_OUTER_PORT`, `MSSQL_SA_PASSWORD`

### `frontend/.env`（前端 API Base URL）

目前：

```env
VITE_API_URL=http://localhost:5187/api/
```

若使用 Nginx HTTPS 同源部署，建議改為：

```env
VITE_API_URL=https://localhost/api/
```

或相對路徑：

```env
VITE_API_URL=/api/
```

### `api/Program.cs`

- JWT 驗證與授權
- CORS policy `AllowReactApp`
- Swagger（Development 環境）
- Controllers 路由啟用

---

## 快速啟動（Docker 全套）

1. 進入專案根目錄：

```bash
cd FinShark
```

2. 前端先建置靜態檔（給 Nginx 掛載）：

```bash
cd frontend
npm install
npm run build
cd ..
```

3. 啟動全部服務：

```bash
docker compose up -d --build
```

4. 檢查服務：

```bash
docker compose ps
docker compose logs -f reverse_proxy
docker compose logs -f api
docker compose logs -f mssql
```

5. 存取入口：
- 網站：`https://localhost`
- API（經 Nginx）：`https://localhost/api/...`
- API（直連）：`http://localhost:5187/...`

---

## 本機分開啟動（不走完整 Docker）

### 後端 API

```bash
cd api
dotnet restore
dotnet run
```

### 前端

```bash
cd frontend
npm install
npm run dev
```

預設前端網址：`http://localhost:5173`

---

## API 路由摘要

- Account
  - `POST /api/account/register`
  - `POST /api/account/login`
- Stock
  - `GET /api/stock`（需要 JWT）
  - `POST /api/stock`
  - `PUT /api/stock/{id}`
  - `DELETE /api/stock/{id}`
- Comment
  - `GET /api/comment`
  - `POST /api/comment/{stockId}`
  - `PUT /api/comment/{id}`
  - `DELETE /api/comment/{id}`
- Portfolio
  - `GET /api/portfolio`（需要 JWT）
  - `POST /api/portfolio?symbol=...`（需要 JWT）
  - `DELETE /api/portfolio?symbol=...`（需要 JWT）

---

## 常見問題

### 1) 前端打 API 出現 CORS

- 前端 origin 與 `Program.cs` CORS 白名單不一致
- 建議改成同源呼叫：`VITE_API_URL=https://localhost/api/`

### 2) `405 Method Not Allowed`

- 常見是路徑少了 `/api` 或 HTTP method 不對
- 例如登入必須是 `POST /api/account/login`

### 3) `ERR_EMPTY_RESPONSE`（5173）

- 容器內 Vite 未對外監聽（需 `--host 0.0.0.0`）

---

## 畫面展示

### 1. Dashboard 上半部（搜尋 / Create Stock / Stocks List）

![Dashboard-1](./images/1.png)

### 2. Dashboard 下半部（Portfolio / Comments）

![Dashboard-2](./images/2.png)
