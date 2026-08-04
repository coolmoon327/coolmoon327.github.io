---
title: "解决 PVE 无法 apt update"
date: "2022-10-23"
description: "排查 Proxmox VE 网络、软件源、签名密钥与 APT 更新问题的笔记。"
tags: ["proxmox-ve","apt"]
categories: ["Systems"]
locale: "zh"
slug: "proxmox-apt-update-troubleshooting"
sourceId: "post-c21ce1c534b61a96"
translationKey: "post-c21ce1c534b61a96"
generated: true
draft: false
---
# Proxmox 无法正常连接网络

## 原因分析

1. PVE 的 DNS 不正常
2. 企业源有问题

## 设置 DNS

```
echo "nameserver [address removed]" >> /etc/resolv.conf
```

> **关于 [address removed]**
>
> [address removed] 是由 Cloudflare 运营的公共 [DNS 解析器](https://www.cloudflare.com/learning/dns/dns-server-types#recursive-resolver)，它提供了一种快速且私密的方式来浏览互联网。与大多数 DNS 解析器不同，[address removed] 不会将用户数据出售给广告商。此外，在经过测量后，[address removed] 被认为是可用的最快 DNS 解析器。

## 关闭企业源

要么直接删除 `/etc/apt/sources.list.d/pve-enterprise.list`；

要么在 `/etc/apt/sources.list.d/pve-enterprise.list` 文件中删掉或注释掉 `deb https://enterprise.proxmox.com/debian/pve stretch pve-enterprise`。

## 换源

```
# /etc/apt/sources.list

deb [link removed] stretch pve-no-subscription

# deb [link removed] bullseye main contrib

# deb [link removed] bullseye-updates main contrib

# security updates
# deb [link removed] bullseye-security main contrib

# debian aliyun source
deb https://mirrors.aliyun.com/debian buster main contrib non-free
deb https://mirrors.aliyun.com/debian buster-updates main contrib non-free
deb https://mirrors.aliyun.com/debian-security buster/updates main contrib non-free

# proxmox source
# deb [link removed] buster pve-no-subscription
deb https://mirrors.ustc.edu.cn/proxmox/debian/pve buster pve-no-subscription
```

```
echo "deb [link removed] stretch pve-no-subscription" > /etc/apt/sources.list.d/pve-install-repo.list
```

## 更新 GPG

```
wget [link removed] -O /etc/apt/trusted.gpg.d/proxmox-ve-release-5.x.gpg
```

## 更新软件源

```
apt update
```
