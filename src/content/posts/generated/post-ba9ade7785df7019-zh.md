---
title: "Web SSH 部署流程"
date: "2022-10-23"
description: "使用自签名证书和 Docker 部署 Sshwifty 的简要流程。"
tags: ["web-ssh","sshwifty","docker"]
categories: ["Systems"]
locale: "zh"
slug: "sshwifty-web-ssh-deployment"
sourceId: "post-ba9ade7785df7019"
translationKey: "post-ba9ade7785df7019"
generated: true
draft: false
---
# Web SSH 部署流程

## 生成公钥

在 ssh 中运行下面命令，记得先 cd 到目标目录，运行完后会在当前目录生成公钥与私钥两个文件
`openssl req \ -newkey rsa:4096 -nodes -keyout domain.key -x509 -days 90 -out domain.crt`

## 部署 docker

`docker run --detach \ --restart always \ --publish 8182:8182 \ --env SSHWIFTY_DOCKER_TLSCERT="$(cat domain.crt)" \ --env SSHWIFTY_DOCKER_TLSCERTKEY="$(cat domain.key)" \ --name sshwifty \ niruix/sshwifty:latest`

## 潜在问题

- 证书会过期，如果一段时间后无法进入页面需要重新进行签发
- 用 <https://x.x.x.x:8182/> 进行访问
- chrome 浏览器不会通过私自签发的证书，即使点了页面中的 details 也不会出现进入的选项，这时候要点击页面的空白处，键盘直接敲 `thisisunsafe`（不需要在哪个框里输入），然后就会自动刷新进入页面
