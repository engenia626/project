# 小满·见微 V29 — GitHub Pages 版

这是一个纯静态网页项目，可以部署到 GitHub Pages。网页资源均使用相对路径，适用于 `https://<用户名>.github.io/<仓库名>/` 这种项目站点地址。

## 本版更新

- 飞行段固定使用用户指定的 `assets/action_3.png`，不增加飞行帧轮播。
- 荷塘段（世界进度约 0.82–4.58）改为凌空飞行：从近岸起飞，越过桥影和荷塘，在远岸下降。
- 桥保留为背景景物，不再作为小满的行走路径。
- 原有 8 帧走路序列、快走、跳跃、三项观察任务、背景音乐、水环境声和亭子提示音保留。
- 行走脚步音效继续移除。
- 保留此前前景素材与透明度调整。

## 部署到 GitHub Pages

1. 在 GitHub 新建一个仓库，例如 `xiaoman-jianwei`。
2. 将本压缩包**解压后的全部内容**上传到仓库根目录。注意：`index.html` 必须直接位于仓库根目录，不能再套一层文件夹。
3. 推送到 `main` 分支后，仓库中的 `.github/workflows/pages.yml` 会自动部署。
4. 首次部署时，进入仓库 **Settings → Pages**，将 Build and deployment 的 Source 设为 **GitHub Actions**。
5. 等待 Actions 中 `Deploy Xiaoman to GitHub Pages` 运行成功，即可通过页面给出的地址访问。

## 后续更新

修改网页或替换素材后，将改动提交并推送到 `main` 分支。GitHub Actions 会自动重新部署，访问链接保持不变。

## 本地预览

Windows 可双击 `start_windows.bat`，然后访问 `http://127.0.0.1:8020/`。

也可以在项目根目录运行：

```bash
python -m http.server 8020
```

## 注意

- 这是静态站点，不需要 Node.js 后端。
- 2D 长卷和角色动画在本地资源中运行。
- 3D 模型预览使用 Three.js CDN，打开该部分时需要网络连接。
- `assets/resource_library_batches/` 保存之前整理的素材批次压缩包，供后续维护；网页主体不依赖这些 ZIP 文件。


## 推荐上传方式

项目内的 `assets/xiaoman_final.glb` 约 44 MB。GitHub 网页端单文件上传限制较低，因此建议使用 **GitHub Desktop** 或 Git 命令推送，不要在网页里逐个拖文件。

Git 命令示例（先在 GitHub 创建空仓库，并将 `<用户名>`、`<仓库名>` 替换成自己的信息）：

```bash
git init
git branch -M main
git remote add origin https://github.com/<用户名>/<仓库名>.git
git add .
git commit -m "Publish Xiaoman V29"
git push -u origin main
```

如果已经有仓库，则先 Clone，再把本项目全部内容复制到克隆目录中，提交并 Push 即可。


## V29.1 飞行动作修订

- 飞行阶段固定显示 `assets/action_3.png`，不再轮播 `fly_0.png` 至 `fly_7.png`。
- 删除未使用的飞行序列图片，保留飞行路径、飞行高度和其他页面功能不变。
