---
title: "Monitoring CPU Temperature in Proxmox VE"
date: "2022-10-23"
description: "A practical guide to exposing lm-sensors readings in the Proxmox VE web interface."
tags: ["proxmox", "cpu-temperature", "lm-sensors"]
categories: ["Systems"]
locale: "en"
slug: "proxmox-cpu-temperature-monitoring"
sourceId: "post-c37e9c9baa73c1e6"
translationKey: "post-c37e9c9baa73c1e6"
generated: true
draft: false
---

# Monitoring CPU Temperature in Proxmox

## Configure the APT Network Environment

Configure DNS and package sources so that `apt update` can run successfully.

## Install and Configure the Plugin

```
 # 安装
 apt-get install lm-sensors

 # 查询并配置可用传感器的内核模块
 # 全部默认即可
 sensors-detect

 # 查看温度
 sensors
```

Record the names of the available sensors so that you can modify the configuration later.

## Configure the Web Display

### 1. Back Up the Files

```
cp /usr/share/perl5/PVE/API2/Nodes.pm /usr/share/perl5/PVE/API2/Nodes.pm.bak
cp /usr/share/pve-manager/js/pvemanagerlib.js /usr/share/pve-manager/js/pvemanagerlib.js.bak
```

### 2. Modify the Front-End Display Options

Open `vi /usr/share/perl5/PVE/API2/Nodes.pm`, locate `pveversion`, start a new line below it, and enter:

```
        $res->{thermalstate} = `sensors`;
```

(Those are backticks, not quotation marks.)

[Image omitted: third-party image]

## 3. Modify the Page Layout

Open `vi /usr/share/pve-manager/js/pvemanagerlib.js`, locate `pveversion`, and add the following code below it:

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

Customize the lines inside `renderer` according to the number of cores you want to display.

[Image omitted: third-party image]

Remember to run “sensors” first to see which sensors are available, and then modify the configuration. Here is another configuration for an X570 system:

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

### 4. Refresh the Interface

Restart the web manager:

```
systemctl restart pveproxy
```

Force-refresh the browser with Ctrl+F5 on Windows or Command+Shift+R on macOS.

[Image omitted: third-party image]
