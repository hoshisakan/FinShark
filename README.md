# FinShark

FinShark 是一個以 ASP.NET Core Web API 實作的股票追蹤後端服務，使用 JWT 驗證、ASP.NET Identity、Entity Framework Core 與 SQL Server。

目前專案已提供 Docker 化配置（API + MSSQL），可快速在本機透過 `docker compose` 啟動整套環境。

## 技術棧

- .NET 8 (`api/api.csproj`)
- ASP.NET Core Web API (Controllers)
- Entity Framework Core + SQL Server
- ASP.NET Identity
- JWT Bearer Authentication
- Swagger / OpenAPI (`Development` 環境)
- Docker / Docker Compose

## 專案結構

- `api/`：Web API 主程式與商業邏輯
  - `Program.cs`：DI 註冊、Swagger、JWT、DbContext、Repository 設定
  - `Controllers/`
    - `AccountController`：註冊/登入
    - `StockController`：股票 CRUD 與查詢
    - `CommentController`：股票評論 CRUD
    - `PortfolioController`：使用者投資組合管理
  - `Data/ApplicationDBContext.cs`：EF Core DbContext + Identity role seed
  - `Migrations/`：資料庫 migration
- `docker-compose.yml`：API 與 MSSQL 服務編排
- `Dockerfile`：API 容器建置（Ubuntu + .NET SDK + publish）
- `conf/mssql/Dockerfile`：MSSQL 容器鏡像定義
- `.env`：Docker 參數（port、network、DB 帳密、ASPNETCORE_* 等）

## API 路由概覽

- `POST /api/account/register`
- `POST /api/account/login`
- `GET /api/stock`（需授權）
- `GET /api/stock/{id}`
- `POST /api/comment/{stockId}`
- `GET /api/portfolio`（需授權）
- `POST /api/portfolio?symbol={symbol}`（需授權）

## Docker 架構說明

`docker-compose.yml` 會啟動兩個服務：

- `api`
  - 由根目錄 `Dockerfile` 建置
  - 容器名稱：`finshark_api`
  - 對外 port：`${API_OUTER_PORT}`（預設 `5187`）
  - 依賴 `mssql`
- `mssql`
  - 由 `conf/mssql/Dockerfile` 建置（基於 `mcr.microsoft.com/mssql/server:2022-latest`）
  - 容器名稱：`finshark_mssql`
  - 對外 port：`${MSSQL_OUTER_PORT}`（預設 `1439`）
  - 資料 volume 已掛載至 `./data/mssql/mssql_data`

## 快速啟動（推薦）

1. 進入專案根目錄：

```bash
cd FinShark
```

2. 檢查 `.env` 參數（至少確認以下值）：
- `ASPNETCORE_ENVIRONMENT`
- `API_OUTER_PORT` / `API_INNER_PORT`
- `MSSQL_SA_PASSWORD`
- `MSSQL_OUTER_PORT` / `MSSQL_INNER_PORT`

3. 啟動服務：

```bash
docker compose up --build -d
```

4. 查看狀態：

```bash
docker compose ps
docker compose logs -f api
docker compose logs -f mssql
```

5. 驗證 API：
- `http://localhost:5187/swagger`（若環境為 Development）

## 本機直接執行（不透過 Docker）

1. 先確保 MSSQL 可連線（可用本機 SQL Server，或改用 docker 的 mssql）
2. 調整 `api/appsettings.json` 連線字串
3. 執行：

```bash
cd api
dotnet restore
dotnet run
```

預設本機執行網址可參考 `api/Properties/launchSettings.json`：
- `http://localhost:5187`
- `https://localhost:7032`

## 資料庫 Migration

專案已包含 migration 檔案（`api/Migrations`）。

若需更新資料庫：

```bash
cd api
dotnet ef database update
```

## 設定注意事項

- `api/appsettings.json` 目前預設使用 Docker 服務名稱 `mssql` 作為主機：
  - `Server=mssql,1433;...`
- 若本機直接跑 API 且 DB 不在 Docker 網路，請改成實際主機（例如 `localhost,1439`）。
- `.env` 目前含敏感資訊（例如 `MSSQL_SA_PASSWORD`、JWT 設定），正式環境請務必更換。

## 常見問題排查

### 1) `專案無法執行` / API 無法連線 DB

- 確認 `mssql` 容器是否已啟動
- 確認 API 連線字串目標是否正確（Docker 內用 `mssql`，本機用 `localhost`）
- 確認 SQL port 對映是否衝突（`1439:1433`）

### 2) Swagger 開不起來

- `Program.cs` 只在 `Development` 啟用 Swagger
- `.env` 若設定 `ASPNETCORE_ENVIRONMENT=Production`，Swagger 不會啟動

### 3) JWT 驗證失敗

- 確認 `appsettings.json` 的 `Jwt:Issuer`、`Audience`、`SigningKey` 一致
- `Authorization` header 必須使用 `Bearer <token>`

## 常用命令

```bash
# 啟動
docker compose up --build -d

# 停止
docker compose down

# 查看日誌
docker compose logs -f api
docker compose logs -f mssql

# 重新建置 API
docker compose build api
docker compose up -d api
```
