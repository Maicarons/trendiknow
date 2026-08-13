# TrendiKnow

> 基于零样本时间序列预测（zero-shot time-series forecasting）的股票趋势预测系统文档站。

[![VitePress](https://img.shields.io/badge/docs-VitePress-41b883?logo=vuepress)](https://maicarons.github.io/trendiknow/)
[![License: AGPL v3](https://img.shields.io/badge/license-AGPL_v3-blue.svg)](LICENSE)

## 文档

本项目使用 **VitePress** 托管文档，并通过 GitHub Actions 自动部署到 GitHub Pages。

- 📖 在线文档：<https://maicarons.github.io/trendiknow/>
- 📁 文档源码：`docs/`

文档涵盖：项目简介、系统架构、服务端、API、Flutter 客户端、管理后台、部署、国际化、贡献指南与常见问题。

## 项目概览

TrendiKnow 由三个相互协作的模块组成：

| 模块 | 技术栈 | 说明 |
| --- | --- | --- |
| `trendiknow-server` | Python · FastAPI | 预测服务端：行情采集、三模型加权集成、存储、调度与分发 |
| `trendiknow-uniclient` | Flutter · GetX | 跨平台移动客户端 |
| `trendiknow-admin` | Vue 3 · Element Plus | 运营后台 |

各模块的架构、接口与部署细节见在线文档。

## 本地预览文档站

```bash
cd docs
npm install
npm run docs:dev      # 本地开发预览（热更新）
# 或
npm run docs:build    # 构建静态站点到 docs/.vitepress/dist
npm run docs:preview  # 预览构建产物
```

## 许可证

本项目以 [AGPL-3.0](LICENSE) 许可证开源。
