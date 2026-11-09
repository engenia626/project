# 小满·见微

《小满·见微》互动长卷网页项目。

## 项目状态

- 正式仓库：`engenia626/project`
- 当前目标版本：V29.1（飞行阶段固定使用 `assets/action_3.png`，不轮播飞行帧）
- 飞行期间不播放行走脚步音效。
- **完整网站文件尚未上传，GitHub Pages 尚未上线。**

## 部署结构

将 V29.1 工程包解压后，把网站根目录中的全部文件上传到仓库根目录，必须包含：
- `index.html`
- `app.js`、`style.css`
- 完整的 `assets/` 资源目录
- `.github/workflows/pages.yml`
- `.nojekyll`

不要只上传 ZIP 文件；GitHub Pages 需要实际的网站文件和资源目录。

## GitHub Pages

仓库设置中选择 **Settings → Pages → Build and deployment → Source: GitHub Actions**。上传完整网站后，`Deploy Xiaoman to GitHub Pages` 工作流会在推送到 `main` 时自动部署。

预期网址：`https://engenia626.github.io/project/`

## 版本约定

- 荷塘上空飞行固定使用 `assets/action_3.png`，不增加飞行帧轮播。
- 保留原有走路、快走和跳跃动作。
- 移除行走触发的脚步音效。
- 后续更新只修改本仓库，不再放入个人作品集仓库。
