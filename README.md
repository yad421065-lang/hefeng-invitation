# 和风传媒 · 主播启程邀请函

包含信封开启动效、正式邀请内页、个性化编辑、输入/手写签名与 PNG 回执下载。适配手机和电脑。

## 发布到 GitHub Pages

1. 在 GitHub 新建 Public 仓库，建议名称 `hefeng-invitation`。
2. 将此压缩包解压，把 `index.html`、`styles.css`、`app.js`、`assets` 文件夹及其余文件上传到仓库根目录。不要直接上传 ZIP；不要把整个外层文件夹套在根目录里。
3. 点击 Commit changes 保存。
4. 打开仓库 Settings → Pages。
5. Source 选 Deploy from a branch，Branch 选 main，目录选 /(root)，点击 Save。
6. 等待 Pages 发布完成，在该页面点击 Visit site；复制显示的 github.io 网站链接分享。仓库链接是源码页面，不是邀请函网址。

## 个性化与分享

1. 打开网页，点击「定制邀请」，填写称呼、编号、真实特点与两个日期。
2. 点击「保存并生成专属链接」，再点击「复制专属邀请链接」，将完整链接发给对应的人。
3. 每个链接携带生成时的全部定制信息。刷新、换设备或由另一人打开，都会还原该封邀请；给下一人重新定制不会改变之前发出的链接。
4. 请保存每个人对应的完整链接。仅发送不带 `?invite=...` 的主页网址会显示通用邀请。修改已有内容后，需要重新复制并发送新链接，旧链接仍保留旧内容。

链接使用带版本的 UTF-8/Base64URL 数据，无须登录、数据库或本机存储。链接中的数据未加密，持有链接的人都能查看邀请；不要把密码或其他秘密填入邀请内容。姓名、编号、特点与日期会被校验，回执、签名不包含在分享链接中。

## 回执

回执在访问者浏览器内生成，支持下载 PNG；不会自动保存到服务器或发送给公司。访问者下载后需要自行交给和风对接人。

## 图片

封面为提供的参考图；内页三幅场景为使用内置 image_gen.imagegen 生成的合作愿景插画。完整生成提示词见 image-prompts.json。

## 文件

- index.html：网页结构和正文
- styles.css：视觉样式与动效
- app.js：交互与回执生成
- invitation-link.mjs：专属邀请链接编码、读取与验证
- assets/：封面及内页图片
- .nojekyll：按静态文件发布

GitHub Pages 官方文档：https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
