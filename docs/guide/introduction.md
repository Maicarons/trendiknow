# 项目简介

TrendiKnow 是一套**基于零样本时间序列预测模型的股票趋势预测系统**。所谓「零样本」，是指直接调用 Amazon Chronos-2、Datadog Toto-2.0、Google TimesFM-2.5 等预训练模型进行推理，无需针对某只股票单独训练，因此可以低成本扩展到新股（含 A 股 / 港股）。

系统由三个相互独立又彼此协作的部分组成。

## 核心特性

- **三模型加权集成**：Chronos-2（27.3%）、Toto-2.0（54.5%，含 2.5B/1B/313m 三档显存自适应）、TimesFM-2.5（18.2%）按权重集成，输出统一 9 档分位（0.1–0.9）。
- **多粒度预测**：次日 5 分钟级（约 78 步）走势 + 未来 7 日日线预测，返回中位数、上界、下界。
- **方向预测与转折点**：在基础预测之上提供 `predict-direction`（涨跌方向）与 `turning-points`（拐点）分析。
- **胜率 / 回测**：`win-rate` 统计历史预测准确率，`backtest` 提供策略回测结果。
- **静态 JSON 分发**：服务端每日生成 `stocks_list.json` / `predictions.json` / `statistics.json` / `history.json`，客户端经 CDN 拉取，可离线浏览历史。
- **双时区调度**：亚洲市场（15:01–15:30 北京时间）与美股市场（04:01–04:30 美东时间）双窗口自动执行。
- **鉴权与管理**：JWT 鉴权（注册 / 登录 / 改密），配套 Vue 管理后台做运营看板、用户与股票管理。
- **国际化**：客户端 UI 字符串与服务端股票名称通过 Crowdin 管理多语言。

## 技术栈

| 部分 | 技术 |
| --- | --- |
| 服务端 | Python 3.10+、FastAPI、PyTorch、GluonTS、DuckDB、APScheduler、yfinance / AkShare |
| 客户端 | Flutter 3.x、GetX、Hive、fl_chart、dio / http |
| 管理后台 | Vue 3、Vite、Vue Router、Pinia、Element Plus、ECharts、Axios |
| 文档 | VitePress（本站点） |

## 项目结构

```
trendiknow/
├── trendiknow-server/     # Python 预测服务端（FastAPI）
│   ├── app/
│   │   ├── main.py            # FastAPI 入口，挂载三个 router
│   │   ├── config.py          # Pydantic 配置
│   │   ├── models/            # 预测模型封装（predictor / chronos_loader / ensemble）
│   │   ├── services/          # 数据采集 / 预测 / 存储 / JSON 导出 / 回测 / 转折点
│   │   ├── database/          # DuckDB 数据层
│   │   ├── api/               # 路由：routes（数据）/ auth_routes / admin_routes
│   │   ├── auth/              # JWT 安全与依赖
│   │   ├── scheduler.py       # APScheduler 双时区定时任务
│   │   └── utils/             # 日志、常量
│   ├── data/                  # 模型、每日 JSON、缓存
│   ├── tests/                 # 23/23 单元测试
│   └── requirements.txt
│
├── trendiknow-uniclient/   # Flutter 跨平台客户端
│   └── lib/
│       ├── core/           # 常量 / 主题 / 路由
│       ├── models/         # stock / prediction / user
│       ├── services/       # api / hive / download / auth / stock_names
│       ├── controllers/    # home / list / profile / stock / auth
│       ├── views/          # home / list / detail / profile / rankings / about / auth / vip
│       ├── widgets/        # chart / backtest_chart / turning_points / paywall 等
│       ├── i18n/           # 多语言（Crowdin 源）
│       └── utils/          # 日期 / 数字 / 涨跌配色
│
├── trendiknow-admin/       # Vue 3 管理后台
│   └── src/
│       ├── api/            # auth / dashboard / stocks / users / client
│       ├── views/          # login / dashboard / stocks / predictions / users / analytics / settings
│       ├── stores/         # Pinia（auth 等）
│       ├── layouts/        # 后台布局
│       └── router/         # 路由
│
├── docs/                   # 本 VitePress 文档站
├── agent.md                # AI 开发指南（历史技术规范）
├── DEVELOPMENT.md          # 开发指南（历史）
├── CHECKLIST.md            # 初始化检查清单（历史）
├── README.md               # 项目说明
├── crowdin.yml             # Crowdin 多语言配置
└── LICENSE                 # AGPLv3
```

::: warning 历史文档已过时
`agent.md` / `DEVELOPMENT.md` / `CHECKLIST.md` 记录的是项目初始化阶段（2026-05-23）的状态，当时后端核心逻辑与客户端均「待开发」。实际上后端三模型集成与大部分客户端、全新的管理后台均已实现。请以本 VitePress 文档与代码为准。
:::

## 许可证

本项目采用 **AGPLv3** 许可证，详见根目录 [LICENSE](https://github.com/Maicarons/trendiknow/blob/main/LICENSE)。
