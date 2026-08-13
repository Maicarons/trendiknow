// 构建后处理：为 VitePress 叶子页补 X/index.html 重定向页，修复 GitHub Pages 硬刷新 404。
// GitHub Pages 对 /X/ 只会找 X/index.html；VitePress 叶子页产物是 X.html，故直链 404。
// 重定向页（非整页复制）几乎零体积、不碰源文件、自动覆盖未来新增页面。
import { readdirSync, statSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname, relative, basename, extname } from 'node:path'

const dist = process.argv[2] || '.vitepress/dist'
let created = 0
let skipped = 0

function walk(dir) {
  for (const e of readdirSync(dir)) {
    const f = join(dir, e)
    const s = statSync(f)
    if (s.isDirectory()) {
      walk(f)
      continue
    }
    if (extname(f) !== '.html') continue
    const n = basename(f, '.html')
    if (n === 'index' || n === '404') {
      skipped++
      continue
    }
    const t = join(dirname(f), n, 'index.html')
    if (existsSync(t)) {
      skipped++
      continue
    }
    mkdirSync(join(dirname(f), n), { recursive: true })
    const rel = relative(join(dirname(f), n), f).split('\\').join('/') // ../X.html
    writeFileSync(
      t,
      `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">` +
        `<title>正在跳转…</title><meta http-equiv="refresh" content="0; url=${rel}"></head>` +
        `<body><p>正在跳转到 <a href="${rel}">文档页面</a>…</p>` +
        `<script>location.replace("${rel}")</script></body></html>`
    )
    created++
  }
}

walk(dist)
console.log(`[fix-leaf-html] 新建 ${created} 个重定向 index.html，跳过 ${skipped} 个`)
