---
title: "Windows 配置硬盘池"
date: "2022-12-14"
description: "重置磁盘并创建 Windows 存储空间池的三个简要步骤。"
tags: ["windows","storage-spaces"]
categories: ["Systems"]
locale: "zh"
slug: "windows-storage-pool-setup"
sourceId: "post-c4f096e5af55f9d4"
translationKey: "post-c4f096e5af55f9d4"
generated: true
draft: false
---
1. 在 poweshell 里输入 `get-physicaldisk` 找到希望组建池的硬盘
2. 继续输入 `Reset-PhysicalDisk -FriendlyName "XXXX"`
3. 控制面板>系统和安全>存储空间>创建新的池和存储空间
