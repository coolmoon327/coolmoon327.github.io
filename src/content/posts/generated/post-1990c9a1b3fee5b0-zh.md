---
title: "MATLAB ARM64 闪退解决方案"
date: "2023-12-18"
description: "通过重建 Java 8 运行时依赖解决 MATLAB ARM64 启动闪退的简要记录。"
tags: ["matlab", "arm64", "macos"]
categories: ["Technical Notes"]
locale: "zh"
slug: "matlab-arm64-launch-crash-fix"
sourceId: "post-1990c9a1b3fee5b0"
translationKey: "post-1990c9a1b3fee5b0"
generated: true
draft: false
---

## 问题描述

安装好 MATLAB ARM64 版本后，一打开就闪退。

尝试过 Intel 的版本进行转译，能够正常安装与运行，但运行两分钟依旧闪退。

## 问题分析

1. 依赖问题：ARM64 版本需要依赖 [JAVA 8 JRE](https://corretto.aws/downloads/latest/amazon-corretto-8-aarch64-macos-jdk.pkg) 运行，安装完成后 MATLAB 可能依旧没有建立起正确的依赖关系。

## 解决方案

> 注意 MATLAB 路径，这里默认 `/Applications/MATLAB_R2023b.app`，酌情更改。

1. 重建 `matlab_jenv` 依赖

```
# 获取 JRE 路径
/usr/libexec/java_home -V

# 得到的路径后面加上 /jre
/Applications/MATLAB_R2023b.app/bin/matlab_jenv /Library/Java/JavaVirtualMachines/amazon-corretto-8.jdk/Contents/Home/jre
```

## 参考文献

[JAVA依赖问题](https://zhuanlan.zhihu.com/p/672042028)
