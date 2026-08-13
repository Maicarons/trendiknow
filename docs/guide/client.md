# Flutter 客户端

`trendiknow-uniclient` 是跨平台移动客户端（Android / iOS / Web / 桌面），负责展示胜率、排行榜、热门股票与预测图表，并通过本地缓存实现离线浏览。

## 技术栈

- **Flutter 3.x** — 跨平台 UI
- **GetX** — 状态管理 + 路由 + 依赖注入
- **Hive / hive_flutter** — 本地轻量存储
- **fl_chart** — 预测图表（折线 / 柱状）
- **dio / http** — 网络请求

## 目录结构

```
lib/
├── main.dart              # 应用入口（GetX + Hive 初始化）
├── core/
│   ├── constants.dart     # 常量（API 基址、CDN 基址、初始股票）
│   ├── theme.dart         # 主题（浅色 / 深色，红涨绿跌）
│   ├── routes.dart        # 路由表
│   └── color_convention.dart  # 涨跌配色（红涨绿跌，中国习惯）
├── models/                # stock / prediction / user
├── services/
│   ├── api_service.dart       # REST 请求封装
│   ├── hive_service.dart      # 本地缓存
│   ├── download_service.dart  # 每日静态 JSON 同步
│   ├── auth_service.dart      # 登录 / 注册
│   └── stock_names_service.dart  # 股票名称多语言
├── controllers/           # home / list / profile / stock / auth
├── views/
│   ├── home/              # 主页：胜率卡片 + 排行榜 + 热门股票
│   ├── list/              # 列表页：搜索 / 排序 / 市场筛选
│   ├── detail/            # 详情页：预测图表 + 历史准确率
│   ├── profile/           # 个人页：设置 / 关于
│   ├── rankings/          # 排行榜页
│   ├── auth/              # 登录 / 注册
│   ├── vip/               # 会员 / 付费墙
│   ├── about/             # 关于
│   └── shell.dart         # 底部导航外壳
├── widgets/               # chart / backtest_chart / turning_points / direction / paywall / loading / error
├── i18n/                  # 多语言（Crowdin 源，见 国际化）
└── utils/                 # 日期 / 数字格式化
```

## 关键设计

- **每日同步**：`DownloadService.syncDailyData()` 检查本地最后更新日期，仅在跨日时拉取四份静态 JSON 并写入 Hive，避免频繁请求。
- **红涨绿跌**：`color_convention.dart` 将「上涨 / 成功」映射为红色、「下跌 / 失败」映射为绿色，符合中国用户习惯（与美国惯例相反）。
- **响应式 UI**：每个页面对应一个 GetX Controller，使用 `Obx` / `FutureBuilder` 响应状态变化。

## 运行与构建

```bash
cd trendiknow-uniclient

# 安装依赖
flutter pub get

# 开发运行（Web 便于调试）
flutter run -d chrome

# 构建发布版
flutter build apk --release     # Android：build/app/outputs/flutter-apk/app-release.apk
flutter build ios --release     # iOS：Xcode 归档后提交 App Store Connect
flutter build web --release     # Web：build/web/ 可部署到 Nginx / CDN
```

## 代码质量

```bash
flutter analyze      # 静态分析
dart format lib/     # 格式化
```
