# 常见问题

## 模型与推理

### Q: Toto-2.0 加载大文件时报 segfault？

Windows 上对 2.5B（9.8 GB）这类大文件使用 `safetensors.torch.load_file` 会在 C 层崩溃。已通过 `safetensors.safe_open` **内存映射（mmap）加载到 CPU** 规避；显存不足时 Toto 自动回退到 CPU mmap，并按 2.5B → 1B → 313m 顺序选择能放入显存的最大档位（安全系数 1.3×）。

### Q: TimesFM-2.5 加载报 `proxies` 关键字参数错误？

`from_pretrained` 的兼容性问题。已改为 **mmap + `load_state_dict` 手动加载**，再移至 GPU。

### Q: Toto-2 预测报输入维度错误？

Toto-2 要求输入长度为其上下文的整数倍（32 的倍数）。已实现**自动 padding + mask** 处理，无需手动对齐。

### Q: yfinance 拉取数据失败 / 超时？

部分地区直连 yfinance 被墙。需在环境中**配置代理**后再运行数据采集。

### Q: 预测结果为 NaN？

- 检查输入数据是否有缺失值；
- 确认历史数据时间跨度足够（建议至少 30 天）；
- 验证数据归一化。

## 调度

### Q: 定时任务未执行？

```python
# 检查时区配置是否正确
from datetime import datetime
from zoneinfo import ZoneInfo
print(datetime.now(ZoneInfo("America/New_York")))
print(datetime.now(ZoneInfo("Asia/Shanghai")))
```

定时任务仅在对应市场窗口内（亚洲 15:01–15:30、美股 04:01–04:30）触发；也可 `PredictionScheduler().run_now()` 手动执行。

## 客户端

### Q: JSON 下载失败？

检查网络、CDN URL 可达性，并查看 HTTP 状态码。`DownloadService` 仅在跨日时重新拉取，避免频繁请求。

### Q: 图表渲染异常？

确认数据格式正确（时间戳、数值范围合理），数据点建议 < 100。

### Q: Hive 数据丢失？

确认已调用 `Hive.initFlutter()`，且各 Box 名称一致；避免在主线程执行大量 IO。

## 文档站点（VitePress + GitHub Pages）

### Q: 部署后站内点击正常，但硬刷新 / 直链某个页面 404？

这是 GitHub Pages 与 VitePress 产物命名不匹配导致的经典问题：

- VitePress 叶子页产物是 `X.html`（如 `introduction.html`）；
- GitHub Pages 对 `/guide/introduction/` 只会找 `introduction/index.html`，找不到就 404。

已在构建脚本中通过 `docs/tools/fix-leaf-html.mjs` 修复：每次 `docs:build` 后，为每个叶子页生成极小的 `X/index.html` 重定向页（指向 `../X.html`）。该方案不改动源文件、零体积膨胀，并自动覆盖未来新增页面。若修改文档后直链仍 404，请重新执行 `npm run docs:build`。

::: tip 友情 404 页
本站点已配置 `docs/404.md`，未知路径会返回带导航的友好 404 页面，而不是白屏。
:::
