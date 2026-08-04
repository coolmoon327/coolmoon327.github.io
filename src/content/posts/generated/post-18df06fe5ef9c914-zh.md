---
title: "NS 大气层系统安装插件"
date: "2022-10-23"
description: "在新版大气层系统中安装普通插件与浮窗插件的简要指南。"
tags: ["nintendo-switch","atmosphere"]
categories: ["Technical Notes"]
locale: "zh"
slug: "nintendo-switch-atmosphere-plugins"
sourceId: "post-18df06fe5ef9c914"
translationKey: "post-18df06fe5ef9c914"
generated: true
draft: false
---
# 安装插件

​ 一般的插件直接将 bro 文件复制到 switch 文件夹下即可，部分插件需要在 atmosphere/contents 目录下添加文件。

​ 如果想要使用浮窗，需要安装 nx-ovlloader 与 ovlmenu，然后要将对应工具的浮窗插件放到 switch/.overlays 目录。

​ 在大部分插件的介绍中，它们会告诉你将它放到 atmosphere 目录中的 titles 目录下，而比较新的大气层系统是没有 titles 文件夹的。经测试，在新的大气层系统中应该将 titles 的内容转移到 atmosphere/contents 目录下。

​ 金手指插件详见[博客](https://gbatemp.net/threads/cheat-codes-ams-and-sx-os-add-and-request.520293/)。
