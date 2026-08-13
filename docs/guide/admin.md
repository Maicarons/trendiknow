# 管理后台

`trendiknow-admin` 是面向运营人员的 Web 管理后台，基于 Vue 3 构建，用于查看数据看板、管理股票与用户、触发预测任务以及数据分析。

## 技术栈

- **Vue 3** + **Vite** — 前端框架与构建工具
- **Vue Router 4** — 页面路由
- **Pinia** — 状态管理（鉴权状态等）
- **Element Plus** — UI 组件库
- **ECharts / vue-echarts** — 图表
- **Axios** — HTTP 客户端
- **UnoCSS** — 原子化 CSS

## 目录结构

```
src/
├── main.ts              # 应用入口（挂载 router / pinia / Element Plus）
├── App.vue              # 根组件
├── router/index.ts      # 路由表（含登录守卫）
├── stores/auth.ts       # Pinia 鉴权 store（token / 用户信息）
├── api/
│   ├── client.ts        # Axios 实例（统一拦截器、注入 JWT）
│   ├── auth.ts          # 登录 / 用户信息
│   ├── dashboard.ts     # 看板数据
│   ├── stocks.ts        # 股票增删改查
│   └── users.ts         # 用户管理
├── layouts/AdminLayout.vue   # 后台整体布局（侧边栏 + 顶栏）
├── components/
│   ├── SidebarMenu.vue
│   └── HeaderBar.vue
└── views/
    ├── login/LoginView.vue
    ├── dashboard/DashboardView.vue   # 运营看板
    ├── stocks/StockListView.vue      # 股票管理
    ├── predictions/PredictionListView.vue  # 预测记录
    ├── users/UserListView.vue        # 用户管理
    ├── analytics/AnalyticsView.vue   # 数据分析
    └── settings/SettingsView.vue     # 设置
```

## 页面

| 页面 | 路由 | 说明 |
| --- | --- | --- |
| 登录 | `/login` | 管理员登录，成功后写入 Pinia 与本地存储 |
| 看板 | `/dashboard` | 核心指标汇总（总体胜率、活跃股票、用户增长等） |
| 股票管理 | `/stocks` | 股票列表、新增 / 编辑 / 删除，调用 `/api/v1/admin/stocks` |
| 预测记录 | `/predictions` | 查看历史预测，可手动触发预测任务 |
| 用户管理 | `/users` | 用户分页列表、编辑，调用 `/api/v1/admin/users` |
| 数据分析 | `/analytics` | ECharts 图表展示趋势与分布 |
| 设置 | `/settings` | 后台基础设置 |

## 运行与构建

```bash
cd trendiknow-admin

# 安装依赖
npm install

# 开发（默认 http://localhost:5173）
npm run dev

# 类型检查 + 生产构建
npm run build        # 输出 dist/

# 本地预览构建产物
npm run preview
```

构建产物 `dist/` 为纯静态文件，可部署到任意静态托管（Nginx / CDN / GitHub Pages）。后台通过 `src/api/client.ts` 中的基址访问服务端 `/api/v1/admin/*`，生产环境通常配合 Nginx 反向代理解决跨域。
