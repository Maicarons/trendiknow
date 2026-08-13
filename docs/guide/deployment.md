# 部署指南

## 服务端

### 直接运行（开发 / 单机）

```bash
cd trendiknow-server
pip install -r requirements.txt
cp .env.example .env      # 填写配置
python -c "from app.database.duckdb_client import init_db; init_db()"
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Docker

```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
docker build -t trendiknow-server .
docker run -d -p 8000:8000 --env-file .env trendiknow-server
```

### Nginx 反向代理 + Systemd（生产）

- 用 Nginx 将 `api.trendiknow.com` 反代到 `127.0.0.1:8000`，并转发 `/api` 与静态 JSON 路径。
- 用 Systemd 管理 `uvicorn` 进程，配置开机自启与崩溃重启。

## 客户端

```bash
cd trendiknow-uniclient
flutter pub get
flutter build apk --release     # Android
flutter build ios --release      # iOS（Xcode 归档）
flutter build web --release      # Web → build/web/ 部署到 Nginx / CDN
```

## 管理后台

```bash
cd trendiknow-admin
npm install
npm run build                  # 输出 dist/
# 将 dist/ 部署到 Nginx / CDN，并反代 /api/v1 到服务端解决跨域
```

## 文档站点（本 VitePress 站）

文档站点通过 **GitHub Actions** 自动构建并发布到 **GitHub Pages**，无需手动推送 `gh-pages` 分支。

- 工作流文件：`.github/workflows/deploy.yml`
- 站点地址：`https://maicarons.github.io/trendiknow/`
- 本地预览：

```bash
cd docs
npm install
npm run docs:dev        # 开发预览
npm run docs:build      # 构建（含 GitHub Pages 直链 404 修复）
```

### 本地构建产物 404 修复说明

GitHub Pages 对 `/guide/introduction/` 只会找 `introduction/index.html`，而 VitePress 叶子页产物是 `introduction.html`，导致**硬刷新 / 直链 / 外部分享**时 404。构建脚本 `docs/tools/fix-leaf-html.mjs` 会在每次 `docs:build` 后，为每个叶子页补一个极小的 `X/index.html` 重定向页（指向 `../X.html`），彻底解决该问题且零体积膨胀。详见 [常见问题](/guide/faq)。
