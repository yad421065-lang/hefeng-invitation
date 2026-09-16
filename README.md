# 和风传媒 · 主播启程邀请函

包含信封开启动效、正式邀请内页、个性化编辑、输入/手写签名与 PNG 回执下载。适配手机和电脑。

## 发布到 GitHub Pages

1. 在 GitHub 新建 Public 仓库，建议名称 `hefeng-invitation`。
2. 将此压缩包解压，把 `index.html`、`styles.css`、`app.js`、`assets` 文件夹及其余文件上传到仓库根目录。不要直接上传 ZIP；不要把整个外层文件夹套在根目录里。
3. 点击 Commit changes 保存。
4. 打开仓库 Settings → Pages。
5. Source 选 Deploy from a branch，Branch 选 main，目录选 /(root)，点击 Save。
6. 等待 Pages 发布完成，在该页面点击 Visit site；复制显示的 github.io 网站链接分享。仓库链接是源码页面，不是邀请函网址。

## 个性化

- 网页内「定制邀请」修改仅对当前页面会话有效，刷新后恢复默认。
- 要让接收者看到固定的专属内容，请编辑 app.js 内的 invitationData：name、id、trait、start、issue，保存并提交后会重新发布。
- 日期使用 YYYY-MM-DD。issue 默认为浏览器当天日期，可以改为固定日期字符串。
- 默认 XX 和真实特点提示文字需在正式发送前替换。

## 回执

回执在访问者浏览器内生成，支持下载 PNG；不会自动保存到服务器或发送给公司。访问者下载后需要自行交给和风对接人。

## 图片

封面为提供的参考图；内页三幅场景为使用内置 image_gen.imagegen 生成的合作愿景插画。完整生成提示词见 image-prompts.json。

## 文件

- index.html：网页结构和正文
- styles.css：视觉样式与动效
- app.js：交互与回执生成
- assets/：封面及内页图片
- .nojekyll：按静态文件发布

GitHub Pages 官方文档：https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
