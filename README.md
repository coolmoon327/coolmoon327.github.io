# 个人导航页

## 部署教程

- QNAP：https://post.smzdm.com/p/ag82pkd3/

- 群晖：https://post.smzdm.com/p/adwlg5rn/

## 制作 icon

1. 使用 Image2Icon 工具，去除背景、变成 Big Sur APP 模式、导出为 PNG

2. 把导出的 PNG 再次导入该工具，Zoom 选项增大六次（点击 + 号六次），导出为 128*128 的 PNG

## 自动获取 IP 地址

1. 使用 python 爬取公网地址

2. 基于 `ori_index.html`，替换其中的域名，生成 `index.html`

3. 更新 github.io
