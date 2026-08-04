---
title: "在 Proxmox VE 中监控 CPU 温度"
date: "2022-10-23"
description: "在 Proxmox VE Web 界面中显示 lm-sensors 温度读数的实践指南。"
tags: ["proxmox", "cpu-temperature", "lm-sensors"]
categories: ["Systems"]
locale: "zh"
slug: "proxmox-cpu-temperature-monitoring"
sourceId: "post-c37e9c9baa73c1e6"
translationKey: "post-c37e9c9baa73c1e6"
generated: true
draft: false
---

# Proxmox 监控 CPU 温度

## 配置 APT 网络环境

进行 DNS 设置与换源等操作确保能够正确执行 `apt update`

## 安装与配置插件

```
 # 安装
 apt-get install lm-sensors

 # 查询并配置可用传感器的内核模块
 # 全部默认即可
 sensors-detect

 # 查看温度
 sensors
```

记录能用的传感器名称，方便之后修改配置。

## 配置 Web 显示

### 1. 备份

```
cp /usr/share/perl5/PVE/API2/Nodes.pm /usr/share/perl5/PVE/API2/Nodes.pm.bak
cp /usr/share/pve-manager/js/pvemanagerlib.js /usr/share/pve-manager/js/pvemanagerlib.js.bak
```

### 2. 修改前端显示选项

`vi /usr/share/perl5/PVE/API2/Nodes.pm` 定位 `pveversion`，在下面起一行输入：

```
        $res->{thermalstate} = `sensors`;
```

（注意不是引号，而是反引号）

[Image omitted: third-party image]

## 3. 修改页面布局

`vi /usr/share/pve-manager/js/pvemanagerlib.js` 定位 `pveversion`，在下面增加代码：

```
        {
            itemId: 'thermal',
            colspan: 2,
            printBar: false,
            title: gettext('CPU Temperature'),
            textField: 'thermalstate',
            renderer:function(value){
                const c0 = value.match(/Core 0.*?\+([\d\.]+)?/)[1];
                const c1 = value.match(/Core 1.*?\+([\d\.]+)?/)[1];
                const c2 = value.match(/Core 2.*?\+([\d\.]+)?/)[1];
                const c3 = value.match(/Core 3.*?\+([\d\.]+)?/)[1];
                return `Core: ${c0} | ${c1} | ${c2} | ${c3}`
            },
        },
```

根据想要展示的核心数量，可以自定义 `renderer` 中间的几行。

[Image omitted: third-party image]

注意，需要先使用 “sensors” 查看有哪些传感器，再进行修改。另一组 x570 的配置如下：

```
        {
            itemId: 'thermal',
            colspan: 2,
            printBar: false,
            title: gettext('CPU Temperature'),
            textField: 'thermalstate',
            renderer:function(value){
                const ssd = value.match(/Composite:.*?\+([\d\.]+)?/)[1];
                const cpu1 = value.match(/Tctl:.*?\+([\d\.]+)?/)[1];
                const cpu2 = value.match(/Tccd1:.*?\+([\d\.]+)?/)[1];
                return `CPU (Tctl): ${cpu1} | CPU (Tccd1): ${cpu2} | NVME: ${ssd}`
            },
        },
```

### 4. 刷新界面

重启 Web 管理器：

```
systemctl restart pveproxy
```

Windows 下使用 Ctrl+F5，macOS 下使用 Commend+Shift+R 强制刷新浏览器

[Image omitted: third-party image]
