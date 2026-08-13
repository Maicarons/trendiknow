# 贡献指南

欢迎提交 Issue 与 Pull Request。

## Git 工作流

```bash
# 1. 从 main 切出功能分支
git checkout -b feature/amazing-feature

# 2. 开发并提交
git add .
git commit -m "feat: add amazing feature"

# 3. 推送到远程
git push origin feature/amazing-feature

# 4. 在 GitHub 开启 Pull Request，Code Review 通过后合并到 main
```

## 提交规范（Conventional Commits）

| 前缀 | 含义 |
| --- | --- |
| `feat` | 新功能 |
| `fix` | 修复缺陷 |
| `docs` | 文档变更 |
| `refactor` | 重构（无功能变化） |
| `test` | 增加 / 修改测试 |
| `chore` | 构建 / 依赖等杂项 |

示例：`feat: 添加港股数据支持`、`fix: 修复预测结果 NaN 问题`、`docs: 更新 API 文档`。

## 代码质量

各子项目使用对应工具做静态检查：

**服务端（Python）**

```bash
black app/        # 格式化
flake8 app/       # Lint
mypy app/         # 类型检查
pytest tests/     # 测试（CI 用 TRENDIKNOW_SKIP_HEAVY_MODELS=1 跳过重型模型）
```

**客户端（Dart / Flutter）**

```bash
flutter analyze
dart format lib/
```

**管理后台（TypeScript / Vue）**

```bash
npm run build     # 内含 vue-tsc 类型检查
```

## 敏感信息

- 模型文件（GB 级）**不要提交**（已在各 `.gitignore` 排除）。
- `.env` 含敏感配置，**切勿提交**；只提交 `.env.example` 模板。
- DuckDB 的 `.db` 文件已排除。
