---
layout: home

hero:
  name: TrendiKnow
  text: 零样本股票趋势预测系统
  tagline: 基于 Chronos-2 / Toto-2.0 / TimesFM-2.5 三模型加权集成的股价走势预测平台
  image:
    src: /logo.png
    alt: TrendiKnow
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/introduction
    - theme: alt
      text: API 参考
      link: /guide/api
    - theme: alt
      text: GitHub
      link: https://github.com/Maicarons/trendiknow
      target: _blank

features:
  - title: 零样本预测
    details: 使用 Amazon Chronos-2、Datadog Toto-2.0、Google TimesFM-2.5 预训练模型，无需为每只股票单独训练，按权重集成输出分位数预测。
  - title: 多粒度预测
    details: 支持次日 5 分钟级（约 78 步）走势与未来 7 日日线预测，并返回中位数及上下置信界。
  - title: 多端覆盖
    details: Python/FastAPI 服务端 + Flutter 跨平台客户端 + Vue 3 管理后台，覆盖采集、预测、分发、运营全链路。
  - title: 静态数据分发
    details: 服务端每日定时生成 stocks_list / predictions / statistics / history 四份静态 JSON，客户端经 CDN 拉取，服务端压力小、可离线浏览。
  - title: 双时区调度
    details: APScheduler 在亚洲市场（15:01–15:30 北京时间）与美股市场（04:01–04:30 美东时间）双窗口自动执行预测与导出。
  - title: 完整可观测
    details: 内置鉴权、管理后台（看板/股票/用户/预测/分析）、回测服务、转折点识别、方向预测与胜率统计，并配套 23/23 单元测试。
---

## TrendiKnow 是什么

TrendiKnow 是一套**基于零样本时间序列预测模型**的股票趋势预测系统。它包含：

- **`trendiknow-server/`** — Python 3.10+ / FastAPI 预测服务端（深度学习模型、数据采集、定时调度、静态 JSON 分发、管理与鉴权 API）。
- **`trendiknow-uniclient/`** — Flutter 跨平台移动客户端（GetX + Hive + fl_chart），展示胜率、排行榜、热门股票与预测图表。
- **`trendiknow-admin/`** — Vue 3 + Element Plus 管理后台（看板、股票管理、用户管理、预测列表、数据分析）。

项目采用 **AGPLv3** 开源协议。

## 文档导航

| 模块 | 说明 |
| --- | --- |
| [项目简介](/guide/introduction) | 核心特性、技术栈、目录结构 |
| [系统架构](/guide/architecture) | 端到端数据流与分层架构 |
| [服务端开发](/guide/server) | 环境、模块、运行与测试 |
| [API 接口](/guide/api) | 鉴权 / 数据 / 管理三类接口 |
| [Flutter 客户端](/guide/client) | 客户端结构与运行 |
| [管理后台](/guide/admin) | 后台应用结构与部署 |
| [部署指南](/guide/deployment) | 服务端 / 客户端 / 后台 / 文档站点部署 |
| [国际化](/guide/i18n) | Crowdin 多语言配置 |
| [贡献指南](/guide/contributing) | Git 工作流与提交规范 |
| [常见问题](/guide/faq) | 已知问题与排查 |
