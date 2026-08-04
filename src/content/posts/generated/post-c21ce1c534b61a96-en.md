---
title: "Troubleshooting APT Update Failures on Proxmox VE"
date: "2022-10-23"
description: "Troubleshooting notes for Proxmox VE network, repository, signing-key, and APT update issues."
tags: ["proxmox-ve","apt"]
categories: ["Systems"]
locale: "en"
slug: "proxmox-apt-update-troubleshooting"
sourceId: "post-c21ce1c534b61a96"
translationKey: "post-c21ce1c534b61a96"
generated: true
draft: false
---
# Proxmox VE Cannot Connect to the Network

## Cause Analysis

1. PVE's DNS configuration is incorrect
2. Issues with the enterprise repository

## Configure DNS

```
echo "nameserver [address removed]" >> /etc/resolv.conf
```

> **About [address removed]**
>
> [address removed] is a public [DNS resolver](https://www.cloudflare.com/learning/dns/dns-server-types#recursive-resolver) operated by Cloudflare. It provides a fast and private way to browse the internet. Unlike most DNS resolvers, [address removed] does not sell user data to advertisers. Measurements have also identified [address removed] as the fastest available DNS resolver.

## Disable enterprise source

Either delete `/etc/apt/sources.list.d/pve-enterprise.list` directly;

or remove or comment out `deb https://enterprise.proxmox.com/debian/pve stretch pve-enterprise` in `/etc/apt/sources.list.d/pve-enterprise.list`.

## Change Repositories

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

## Update GPG

```
wget [link removed] -O /etc/apt/trusted.gpg.d/proxmox-ve-release-5.x.gpg
```

## Update Software Sources

```
apt update
```
