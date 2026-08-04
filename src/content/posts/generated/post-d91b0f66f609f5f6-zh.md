---
title: "Koolshare 配置旁路由的坑"
date: "2022-12-17"
description: "关于 x86 路由器上 Koolshare 版本兼容、离线插件与 KoolClash 配置的笔记。"
tags: ["koolshare","bypass-router"]
categories: ["Networking"]
locale: "zh"
slug: "koolshare-bypass-router-configuration"
sourceId: "post-d91b0f66f609f5f6"
translationKey: "post-d91b0f66f609f5f6"
generated: true
draft: false
---
## Koolshare 版本问题

硬路由上目前没有遇到版本带来的毛病，基本都能装酷软商店，华硕的路由器刷机及其方便。

但是对于 X86 软路由而言，太新的 Koolshare 版本会有商店白屏的 BUG，目前使用的是较老的一个 16 版本。

## 安装第三方插件

在安装之前，需要先 ssh 进入到命令行后台，找到 `/koolshare/scriptsks_tar_install.sh` 文件，删除一段关键词匹配代码：

```
#detect_package(){
#       local TEST_WORD="$1"
#       local ILLEGAL_KEYWORDS="ss|ssr|shadowsocks|shadowsocksr|v2ray|trojan|clash|wireguard|koolss|brook"
#       local KEY_MATCH=$(echo "${TEST_WORD}" | grep -Eo "$ILLEGAL_KEYWORDS")

#       if [ -n "$KEY_MATCH" ]; then
#               echo_date =======================================================
#               echo_date "...........................${soft_name} ..........................."
#               echo_date ".....................koolshare............................................."
#               echo_date ".............................."
#               echo_date =======================================================
#               clean
#               exit 1
#       fi
#}
```

其中的省略号实际上是一段中文提示，无法被 vim 正确识别的乱码。可以使用 “koolshare” 对这段检测代码进行定位。

或者直接上传离线软件解除限制：remove\_restrictions.tar.gz

### Koolclash 的问题

Koolclash 的[使用教程](https://koolclash.js.org/#/usage?id=%e5%90%af%e5%8a%a8-clash)中提到，这个工具是需要自行在终端机上配置 `yaml` 文件的，clash 内部不支持修改。

它有两个工程：

- 源项目：[link removed]
- 新项目：[link removed]

现在使用的是来自新项目的工具，它更为完善且美观
