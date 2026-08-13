# 系统架构

TrendiKnow 采用「服务端预测 + 静态分发 + 多端消费」的架构，把重型的深度学习推理集中在服务端，客户端与后台通过轻量的 JSON / REST 接口获取数据，从而把算力成本与运维复杂度压到最低。

## 端到端数据流

```
                ┌─────────────────────────────────────────────┐
                │            trendiknow-server (FastAPI)        │
                │                                               │
  行情源         │   data_collector  ──►  DuckDB (价格/预测历史)  │
  yfinance  ───►│        │                                      │
  AkShare       │        ▼                                      │
  (A股/港股预留) │   predictor + ensemble  (Chronos-2/Toto-2.0/   │
                │                     TimesFM-2.5 三模型集成)     │
                │        │                                      │
                │        ▼                                      │
                │   prediction_service / turning_point /        │
                │   backtest / win_rate                         │
                │        │                                      │
                │        ▼                                      │
                │   scheduler (双时区窗口) ──► json_exporter     │
                └───────────────┬───────────────────────────────┘
                                 │ 生成 4 份静态 JSON
                                 ▼
                          CDN / 静态托管
                 ┌───────────────┴────────────────┐
                 ▼                                 ▼
        trendiknow-uniclient (Flutter)     trendiknow-admin (Vue3)
         经 Hive 缓存 + 图表展示            运营看板 / 用户 / 股票管理
                 │                                 │
                 └────────── REST API (/api/v1) ───┘
                      (snapshot / details / auth / admin)
```

## 分层职责

### 服务端（trendiknow-server）

| 层 | 模块 | 职责 |
| --- | --- | --- |
| 采集层 | `services/data_collector.py` | 从 yfinance / AkShare 拉取 5 分钟线与日线，增量更新、清洗校验 |
| 模型层 | `models/chronos_loader.py`、`models/predictor.py`、`models/ensemble.py` | 加载三类模型，按权重集成，输出统一分位预测；显存自适应 + fallback |
| 业务层 | `services/prediction_service.py`、`turning_point_service.py`、`backtest_service.py` | 执行完整预测流程、拐点识别、回测、胜率计算 |
| 存储层 | `database/duckdb_client.py` | DuckDB 持久化股票、价格、预测、浏览统计 |
| 分发层 | `services/json_exporter.py` | 每日生成 4 份静态 JSON |
| 调度层 | `scheduler.py` | APScheduler 双时区时间窗口触发生成 |
| 接口层 | `api/routes.py`、`api/auth_routes.py`、`api/admin_routes.py` | 数据 / 鉴权 / 管理三类 REST 接口 |

### 客户端（trendiknow-uniclient）

GetX 负责状态管理与路由，Hive 做本地缓存，下载服务每日拉取最新静态 JSON 并经 fl_chart 渲染预测图表。涨跌配色遵循**中国习惯：红涨绿跌**（`utils/color_convention.dart`）。

### 管理后台（trendiknow-admin）

Vue 3 + Element Plus 单页应用，Pinia 管理鉴权状态，Vue Router 控制页面，ECharts 绘制分析图表，通过 Axios 调用 `/api/v1/admin/*` 接口。

## 关键设计决策

- **为何零样本**：无需逐股训练，扩展新股（A 股 / 港股）成本低、上线快。
- **为何静态 JSON 而非实时 API**：客户端无需高频请求；CDN 加速、服务端压力小、可离线浏览历史。
- **DuckDB 而非 MySQL**：零配置、单文件、分析查询快；当日活 > 10 万或需分布式时再迁移 MySQL。
- **GetX 而非 Provider/Bloc**：代码量少、内置路由与依赖注入、响应式简洁。
- **三模型集成而非单模型**：通过权重融合降低单一模型的偏差与不确定性，部分模型不可用时自动重新归一化权重，全不可用时回退到统计随机游走预测。
