---
title: "通过 VLAN 单线复用将光猫 IPTV 桥接到路由器"
date: "2024-01-04"
description: "通过 VLAN Trunk 在光猫与路由器之间用一根网线承载互联网与桥接 IPTV 流量的配置方法。"
tags: ["iptv", "vlan", "router"]
categories: ["Networking"]
locale: "zh"
slug: "bridge-iptv-over-vlan-single-cable"
sourceId: "post-7b6200b25e232fdd"
translationKey: "post-7b6200b25e232fdd"
generated: true
draft: false
---

> 该方案仅适用于 IPTV 链路的转发，不能使用 M3U。
> 该网络环境已经实现了光猫的桥接化，并由路由器进行 PPPoE 拨号。

**1. 原理**：利用 VLAN 技术，将光猫的多个端口桥接到路由器上的不同端口，于是就能用路由器同时连接上网设备与 IPTV 设备。

**2. 过程**：
(a) 获取光猫的超级账号和超级密码，可以给负责自家宽带的运营商师傅打电话询问。

(b) 在光猫上对网络流（INTERNET）与 IPTV 流（OTHER）分别设置桥接模式的 VLAN（1337 和 43）。

![光猫 INTERNET VLAN 桥接配置](/assets/blog/generated/nas-import/dan-xian-fu-yong-tong-guo-vlan-jiang-guang-mao-de-iptv-qiao-jie-dao-lu-you-qi-sh/image-001.png)

![光猫 IPTV VLAN 桥接配置](/assets/blog/generated/nas-import/dan-xian-fu-yong-tong-guo-vlan-jiang-guang-mao-de-iptv-qiao-jie-dao-lu-you-qi-sh/image-002.png)

(c) 将两个 VLAN 配置在一个与路由器直连的端口上，该端口成为 Trunk 链路的接口。

![光猫 Trunk 端口 VLAN 配置](/assets/blog/generated/nas-import/dan-xian-fu-yong-tong-guo-vlan-jiang-guang-mao-de-iptv-qiao-jie-dao-lu-you-qi-sh/image-003.png)

(d) 在华硕路由器上配置 IPTV，选择“手动设置”，分别将 INTERNET 和 IPTV 的 VLAN 填到自己希望配置的端口上。DHCP 选“RFC3442 & Microsoft”。Udpxy 还没有搞懂怎么使用。

![华硕路由器 IPTV VLAN 设置](/assets/blog/generated/nas-import/dan-xian-fu-yong-tong-guo-vlan-jiang-guang-mao-de-iptv-qiao-jie-dao-lu-you-qi-sh/image-004.png)

(e) 将 IPTV 设备连接到路由器配置了 IPTV VLAN 的接口上即可使用。

**3. 问题与缺陷**：仅能实现 IPTV 与 INTERNET 的单线复用，以及 IPTV 的桥接，之后进一步研究如何实现组播。
