---
title: "Fixing MATLAB ARM64 Launch Crashes on macOS"
date: "2023-12-18"
description: "A focused note on resolving MATLAB ARM64 launch crashes by restoring its Java 8 runtime dependency."
tags: ["matlab", "arm64", "macos"]
categories: ["Technical Notes"]
locale: "en"
slug: "matlab-arm64-launch-crash-fix"
sourceId: "post-1990c9a1b3fee5b0"
translationKey: "post-1990c9a1b3fee5b0"
generated: true
draft: false
---

## Problem Description

After installing the ARM64 version of MATLAB, the application quits immediately whenever it is opened.

I also tried translating the Intel version. It installed and launched successfully, but still quit after running for two minutes.

## Analysis

1. Dependency issue: the ARM64 version requires [Java 8 JRE](https://corretto.aws/downloads/latest/amazon-corretto-8-aarch64-macos-jdk.pkg). Even after installation, MATLAB may not have established the dependency correctly.

## Solution

> Check the MATLAB path. The example assumes `/Applications/MATLAB_R2023b.app`; adjust it as needed.

1. Rebuild the `matlab_jenv` dependency

```
# 获取 JRE 路径
/usr/libexec/java_home -V

# 得到的路径后面加上 /jre
/Applications/MATLAB_R2023b.app/bin/matlab_jenv /Library/Java/JavaVirtualMachines/amazon-corretto-8.jdk/Contents/Home/jre
```

## References

[Java dependency issue](https://zhuanlan.zhihu.com/p/672042028)
