# 许森 · 个人设计作品集

黑色首屏、鼠标跟随图片轨迹、直角窄间距瀑布流。首个作品是黑五预热官网视频，点击可播放、暂停、拖动和全屏。

## 文件

- `index.html`：页面、样式和交互。
- `assets/black-friday-motion.mp4`：本人视频作品。
- `assets/project-*.svg`：用于确认视觉方向的概念占位作品。

## 部署

GitHub Pages 使用 `.github/workflows/pages.yml` 自动部署。仓库 Settings → Pages 的 Source 应选择 GitHub Actions。每次推送 `main` 后会自动更新。

预期网址：https://xasdaa.github.io/xusen/

## 本地预览

使用任意静态 HTTP 服务打开仓库目录。视频服务需要支持 `video/mp4` 类型，推荐支持 HTTP Range 请求以方便拖动进度。

介绍文案、联系方式及概念占位作品仍可继续替换。
