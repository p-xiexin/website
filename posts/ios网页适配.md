---
description: 让用户把你的网站像原生 App 一样，直接从主屏幕启动，并且带上自定义图标和启动页体验。
date: '2025-07-12'
author: 'pxx'
categories:
  - Web
published: true
---

# 如何让你的 SvelteKit 网站完美适配 GitHub Pages 和 iOS 主屏幕


我们开发的 SvelteKit 应用，计划托管在 GitHub Pages 上。
部署在子路径（如 `https://username.github.io/website/`）下，需要确保：

* 网站资源（JS、CSS、图片）都能正常加载，路径正确。
* 图标、启动画面等 PWA 体验在 iOS Safari 上友好，支持“添加到主屏幕”功能。

同时保证本地开发体验流畅，不被生产路径配置影响。



## 遇到的主要问题与解决思路

### 1. GitHub Pages 子路径下资源路径错误

**问题：**
部署后页面静态资源无法加载，且页面图标路径不对，导致图标显示失败。

**分析：**
SvelteKit + Vite 构建默认将资源路径写成根路径（`/robot.png`），而 GitHub Pages 子路径下应该是 `/website/robot.png`。
开发环境和生产环境的路径差异需要灵活区分。

**解决方案：**

* 在 `vite.config.js` 里配置 `base`：

```ts
base: process.env.NODE_ENV === 'production' ? '/website/' : '/',
```

* 在 `svelte.config.js` 里配置：

```ts
paths: {
  base: process.env.NODE_ENV === 'production' ? '/website' : '',
  assets: process.env.NODE_ENV === 'production' ? '/website' : ''
}
```

* 在 `app.html` 中，静态资源路径写成：

```html
<link rel="icon" href="%sveltekit.assets%/robot.png" />
<link rel="apple-touch-icon" href="%sveltekit.assets%/robot.png" />
```

`%sveltekit.assets%` 会自动根据环境切换路径，保证资源路径正确。

* 组件内使用：

```svelte
<script>
  import { base } from '$app/paths';
</script>

<img src="{base}/images/logo.png" alt="Logo" />
```

---

### 2. iOS Safari 添加到主屏幕的适配

**问题：**
iOS Safari 添加到主屏幕后，网站图标显示不正确，体验不佳。

**分析：**
iOS 依赖特定 meta 标签和图标文件，且不支持 Web Manifest 的所有功能。
需要单独处理 `apple-touch-icon`，并设置合适的 meta 标签。

**解决方案：**

* 在 `app.html` 的 `<head>` 中添加：

```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="p-xiexin" />
<link rel="apple-touch-icon" href="%sveltekit.assets%/icons/apple-touch-icon.png" />
```

* 准备多尺寸的 `apple-touch-icon`，放置在 `static/icons/`。

* 添加标准的 `manifest.webmanifest` 文件，并引用：

```html
<link rel="manifest" href="%sveltekit.assets%/manifest.webmanifest" />
```

* 确保访问站点为 HTTPS，且用户主动添加到主屏幕。






这次遇到的 Base 路径和 iOS 主屏幕适配问题，都是部署现代 Web 应用时常见的坑。
理解并正确配置路径和 PWA 相关 meta 标签，不仅能保证多环境无缝切换，还能提升移动端用户体验。

希望这篇分享能帮到正在做类似部署的你！有任何问题欢迎交流。

