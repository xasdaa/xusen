# 许森 · 个人设计作品集

黑色首屏、鼠标跟随作品轨迹、直角窄间距瀑布流。

当前包含 30 组图片作品（77 张图片）及 1 个黑五预热视频。每组活动的横版、竖版与套餐画面集中展示，支持切换图片、查看原图和键盘左右切换。视频支持点击播放、暂停、拖动与全屏。

- `index.html`：页面与样式。
- `assets/portfolio.js`：瀑布流、项目相册与鼠标轨迹。
- `assets/works-data.js`：作品数据。
- `assets/works/manifest.json`：作品清单及原始文件名映射。
- `assets/works/originals/`：77 张原始作品图片，保持原文件内容。
- `assets/works/previews/`：首页使用的 WebP 预览图。
- `assets/black-friday-motion.mp4`：黑五预热官网视频。

## 部署

GitHub Pages 使用 `.github/workflows/pages.yml`。推送 `main` 后自动部署到 https://xasdaa.github.io/xusen/ 。

## 本地预览

使用静态 HTTP 服务打开仓库目录。视频服务应支持 `video/mp4` 类型和 HTTP Range 请求。

## 加载优化

- 首页按可视区域附近加载作品图片，并根据显示宽度选择 400 / 800 / 1280 像素预览。
- 鼠标轨迹使用 320 像素的小图，相册缩略图使用 160 像素版本。
- 视频作品使用静态首帧封面，仅点击播放后请求视频文件。
- 相册先显示轻量预览，“查看原图”保留完整原文件。
