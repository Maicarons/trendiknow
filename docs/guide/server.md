# 服务端开发

`trendiknow-server` 是系统的预测核心：负责行情采集、三模型集成预测、定时调度、静态 JSON 分发以及鉴权与管理 API。

## 环境要求

- Python 3.10+（实测 3.14.3 可用）
- 8 GB+ RAM；启用 GPU 推理建议 8 GB+ 显存（Toto-2.0 2.5B 需 9.8 GB，自动回退小档或 CPU mmap）
- 已验证环境：Windows 11 / PyTorch 2.11.0+cu128 / CUDA 12.8 / RTX 4060 Laptop

## 安装

```bash
cd trendiknow-server

# 1. 虚拟环境
python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows

# 2. 基础依赖
pip install -r requirements.txt

# 3. 模型相关额外包（按需，来自 Git 源）
pip install "git+https://github.com/DataDog/toto"        # Toto-2.0
pip install "git+https://github.com/google-research/timesfm"  # TimesFM-2.5
pip install gluonts --no-deps
pip install lightning
```

## 配置

```bash
cp .env.example .env
# 编辑 .env：数据库路径、模型路径、股票列表、API 主机/端口等
```

`.env` 关键项（示例）：

```ini
DATABASE_PATH=./data/trendiknow.db
MODEL_PATH=./data/models
STOCKS_US=QQQ,NVDA,AAPL,TSLA,GOOGL,MSFT,AMD
API_HOST=0.0.0.0
API_PORT=8000
```

## 预训练模型

| 模型 | 文件大小 | 加载方式 | 备注 |
| --- | --- | --- | --- |
| Toto-2.0-2.5B | 9.8 GB | safetensors mmap → CPU | GPU 显存不足时回退 |
| Toto-2.0-1B | 3.9 GB | safetensors → CUDA | 显存自适应 |
| Toto-2.0-313m | 1.2 GB | safetensors → CUDA | 显存自适应 |
| Chronos-2 | 456 MB | Chronos2Pipeline → CUDA | Amazon 出品 |
| TimesFM-2.5 | 883 MB | mmap + load_state_dict → CUDA | Google 出品 |

- 模型文件较大，**切勿提交到 Git**（已在 `.gitignore` 排除）。
- Toto 按 2.5B → 1B → 313m 顺序检测可用显存，自动选最大可放下档位；全放不下则 CPU mmap。安全系数 1.3×。
- yfinance 直连可能被墙，需配置代理（见 [常见问题](/guide/faq)）。

## 初始化与运行

```bash
# 初始化数据库与 Schema
python -c "from app.database.duckdb_client import init_db; init_db()"

# 启动服务（开发热重载）
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# 访问交互式 API 文档
# http://localhost:8000/docs
```

## 模块说明

| 模块 | 文件 | 职责 |
| --- | --- | --- |
| 入口 | `app/main.py` | 创建 FastAPI 应用，挂载 `auth` / `admin` / `api` 三个 router，配置 CORS |
| 配置 | `app/config.py` | Pydantic 配置类 |
| 模型封装 | `app/models/predictor.py`、`chronos_loader.py`、`ensemble.py` | 单模型预测、加载器、三模型加权集成 |
| 采集 | `app/services/data_collector.py` | yfinance / AkShare 5 分钟线 + 日线，增量更新、校验 |
| 预测业务 | `app/services/prediction_service.py` | 串联采集→预测→存储的完整流程 |
| 拐点 / 回测 | `app/services/turning_point_service.py`、`backtest_service.py` | 拐点识别、策略回测 |
| 存储 | `app/services/storage_service.py` | DuckDB 落库与统计更新 |
| 分发 | `app/services/json_exporter.py` | 生成 4 份静态 JSON |
| 调度 | `app/scheduler.py` | 双时区窗口触发预测与导出 |
| 鉴权 | `app/auth/security.py`、`dependencies.py` | JWT 签发与依赖注入 |
| 接口 | `app/api/routes.py`、`auth_routes.py`、`admin_routes.py` | 数据 / 鉴权 / 管理路由 |

## 测试

```bash
# 跳过重型模型加载，仅跑单元测试（推荐 CI / 本地快速验证）
TRENDIKNOW_SKIP_HEAVY_MODELS=1 python -m pytest tests/ -v
```

当前 **23/23 单元测试全部通过**，覆盖 DuckDB 数据层、集成预测器、JSON 导出、预测模型四个模块。完整测试与集成验证见 `trendiknow-server/TEST_REPORT.md`。

## 手动触发一次预测

```bash
python -c "from app.scheduler import PredictionScheduler; PredictionScheduler().run_now()"
```
