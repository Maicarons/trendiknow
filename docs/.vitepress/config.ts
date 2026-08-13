import { defineConfig } from 'vitepress'

// 站点部署在 GitHub Pages 项目站点：https://maicarons.github.io/trendiknow/
// 因此 base 必须设为仓库名 trendiknow/，否则资源与路由会 404。
export default defineConfig({
  base: '/trendiknow/',
  title: 'TrendiKnow',
  description: '基于零样本时间序列预测模型的股票趋势预测系统',
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: '指南', link: '/guide/introduction' },
      { text: 'API 参考', link: '/guide/api' },
      {
        text: 'GitHub',
        link: 'https://github.com/Maicarons/trendiknow',
        target: '_blank',
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '入门',
          items: [
            { text: '项目简介', link: '/guide/introduction' },
            { text: '系统架构', link: '/guide/architecture' },
          ],
        },
        {
          text: '服务端',
          items: [
            { text: '服务端开发', link: '/guide/server' },
            { text: 'API 接口', link: '/guide/api' },
          ],
        },
        {
          text: '客户端',
          items: [{ text: 'Flutter 客户端', link: '/guide/client' }],
        },
        {
          text: '管理后台',
          items: [{ text: '管理后台', link: '/guide/admin' }],
        },
        {
          text: '部署与运维',
          items: [
            { text: '部署指南', link: '/guide/deployment' },
            { text: '国际化', link: '/guide/i18n' },
          ],
        },
        {
          text: '参与贡献',
          items: [
            { text: '贡献指南', link: '/guide/contributing' },
            { text: '常见问题', link: '/guide/faq' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Maicarons/trendiknow' },
    ],
    search: {
      provider: 'local',
    },
    docFooter: { prev: false, next: false },
    outline: { label: '本页目录' },
    lastUpdatedText: '最后更新',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
  },
  // VitePress 只读取顶层 vite 字段作为 Vite 配置；提高分块告警阈值避免本地搜索索引告警。
  vite: {
    build: { chunkSizeWarningLimit: 2000 },
  },
})
