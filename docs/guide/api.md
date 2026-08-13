# API 接口

所有接口统一前缀 `/api/v1`，由 FastAPI 提供，交互式文档位于 `/docs`（Swagger UI）。

## 鉴权接口（`auth_routes.py`）

基于 JWT。注册 / 登录后拿到的 `access_token` 用于访问受保护的管理接口。

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/api/v1/register` | 注册，返回 `TokenResponse` |
| POST | `/api/v1/login` | 登录，返回 `TokenResponse` |
| GET | `/api/v1/me` | 获取当前用户信息 |
| POST | `/api/v1/change-password` | 修改密码 |

`TokenResponse` 形如：

```json
{ "access_token": "<jwt>", "token_type": "bearer" }
```

## 数据接口（`routes.py`，客户端主用）

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/snapshot/latest` | 获取最新数据快照（四份 JSON 的下载 URL 与时间戳） |
| GET | `/api/v1/stocks/{symbol}/details` | 股票基本信息 + 最新预测 |
| GET | `/api/v1/stocks/{symbol}/history` | 指定天数预测历史（`?days=30`） |
| POST | `/api/v1/statistics/view` | 上报浏览统计 `{ "symbol": "NVDA" }` |
| GET | `/api/v1/health` | 健康检查 `{ "status": "ok", "last_update": "..." }` |
| GET | `/api/v1/stocks/{symbol}/predict-direction` | 涨跌方向预测 `DirectionPrediction` |
| GET | `/api/v1/stocks/{symbol}/turning-points` | 拐点分析 `TurningPointsResponse` |
| GET | `/api/v1/stocks/{symbol}/win-rate` | 历史胜率 `WinRateResponse` |
| GET | `/api/v1/stocks/{symbol}/basic-info` | 股票基础信息 `StockBasicInfo` |
| GET | `/api/v1/stocks/{symbol}/chart/intraday` | 次日 5 分钟预测图表数据 |
| GET | `/api/v1/stocks/{symbol}/chart/daily` | 7 日日线预测图表数据 |
| GET | `/api/v1/stocks/{symbol}/backtest` | 策略回测结果 `BacktestResponse` |

## 管理接口（`admin_routes.py`，需 JWT）

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/admin/dashboard` | 运营看板汇总 |
| GET | `/api/v1/admin/users` | 用户列表（分页） |
| PUT | `/api/v1/admin/users/{user_id}` | 更新用户 |
| GET | `/api/v1/admin/stocks` | 股票列表 |
| POST | `/api/v1/admin/stocks` | 新增 / 更新股票 |
| DELETE | `/api/v1/admin/stocks/{symbol}` | 删除股票 |
| GET | `/api/v1/admin/predictions` | 预测记录列表 |
| POST | `/api/v1/admin/trigger-prediction` | 手动触发一次预测任务 |
| GET | `/api/v1/admin/analytics` | 数据分析 |

## 静态 JSON 文件

`json_exporter` 每日生成以下四份文件，供客户端经 CDN 拉取：

| 文件 | 内容 |
| --- | --- |
| `stocks_list.json` | 股票列表（代码、名称、市场、现价、涨跌幅、热度排名） |
| `predictions.json` | 最新预测（日内 78 步 + 7 日日线的中位数 / 上界 / 下界） |
| `statistics.json` | 总体胜率、7 天 / 30 天 / 历史排行榜、热门股票 |
| `history.json` | 最近 30 天预测历史（预测值 / 实际值 / 是否准确 / 误差） |

## 示例：获取最新快照

```bash
curl https://<your-host>/api/v1/snapshot/latest
```

```json
{
  "updated_at": "2026-08-12T16:00:00Z",
  "files": {
    "stocks_list": "https://cdn.trendiknow.com/data/stocks_list.json",
    "predictions": "https://cdn.trendiknow.com/data/predictions.json",
    "statistics": "https://cdn.trendiknow.com/data/statistics.json",
    "history": "https://cdn.trendiknow.com/data/history.json"
  }
}
```
