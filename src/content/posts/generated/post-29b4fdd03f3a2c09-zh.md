---
title: "研究者的 macOS 工作台：工具、自动化与取舍"
date: "2022-10-23"
math: false
description: "围绕科研、写作与开发构建可持续的 macOS 工作台，关注工作流、自动化与工具取舍，而非软件堆砌。"
tags: ["macos", "research-workflow", "developer-tools", "automation"]
categories: ["Research Practice"]
locale: "zh"
slug: "researcher-macos-workstation"
sourceId: "post-29b4fdd03f3a2c09"
translationKey: "post-29b4fdd03f3a2c09"
generated: true
draft: false
---

真正好用的科研工作台，不是软件装得最多的 Mac，而是即使硬盘损坏、换了电脑，或需要连接计算服务器，仍能说清资料从哪里来、工作过程如何复现。我的原则很简单：基础功能优先使用系统自带方案，工具链尽量用可审阅的配置来描述；只有某款专用软件确实解决了一个边界清楚的问题，才把它纳入日常工作流。

## 从故障出发设计工作台

### 文件管理：原生优先

Finder 已能胜任日常的文件整理与移动：在同一个磁盘卷内拖动文件，默认就是移动；跨磁盘卷拖动时按住 Command，则可明确要求移动。Apple 的[文件管理快捷键说明](https://support.apple.com/en-us/102650)也记录了这一行为。因此，我不会仅仅为了模仿 Windows 的剪切粘贴习惯，就另外安装 Finder 替代工具。

比文件管理工具更重要的是项目目录本身。每个科研项目都放在独立目录中，其中包括源文件、数据说明、脚本、图表以及简短的构建说明。大型数据可以存放在其他位置，但项目中必须写明数据来源、完整性校验方法，以及如何重新生成结果。

### 加密与恢复

启用 [FileVault](https://support.apple.com/guide/mac-help/protect-data-on-your-mac-with-filevault-mh11785/mac)，并把恢复方式保存在启动盘之外。磁盘加密可以保护遗失的电脑，但不能替代备份。

日常恢复可以交给加密的 [Time Machine 备份](https://support.apple.com/en-us/104984)，同时还要为无法替代的论文、源数据和凭据保留一份独立副本。备份是否可靠，不能只看任务是否显示成功，还要实际做一次恢复测试：把一个小项目恢复到临时位置，确认源文件、文献库、图表和构建说明都完整可用。

### 跨平台交换盘

只在 Mac 上使用的工作盘，应选择适合当前 macOS 版本的原生格式。只有可移动磁盘确实需要同时供 macOS 和 Windows 写入时，才考虑 ExFAT；Apple 将其列为 [Windows 兼容格式](https://support.apple.com/en-us/101830)。这类磁盘适合交换文件，不适合作为唯一存档，因为“跨平台可读写”和“备份可靠”解决的是两个不同的问题。

## 让工具链可以重建

[Homebrew Bundle](https://docs.brew.sh/Brew-Bundle-and-Brewfile) 可以把个人软件清单整理成可审阅的 `Brewfile`。一份精简的科研工作站配置可以从下面这些条目开始：

```ruby
brew "git"
brew "ripgrep"
brew "pandoc"
cask "visual-studio-code"
cask "iina"
```

可以先检查依赖是否齐全，缺少时再自动安装：

```bash
brew bundle check || brew bundle
```

`Brewfile` 可以和工作站说明一起纳入版本管理，但它不能精确锁定整套环境。Homebrew 采用滚动更新，官方文档也明确说明，Brewfile 没有用于固定任意版本的锁文件机制。要保证实验可复现，仍需根据项目情况使用独立环境、版本记录、容器或归档构建镜像。

## 分离本地编辑与远程执行

可以用 [VS Code Profiles](https://code.visualstudio.com/docs/configure/profiles) 分开管理论文写作、系统维护和软件开发所需的扩展与设置。Profile 只是提高日常使用效率的工具，不能取代项目仓库中应当明确记录的配置。

打开陌生代码仓库时，先使用 [Workspace Trust 受限模式](https://code.visualstudio.com/docs/editing/workspaces/workspace-trust)检查其中的任务、设置和扩展，再决定是否授予信任。遇到计算密集型任务，[Remote - SSH](https://code.visualstudio.com/docs/remote/ssh) 可以让编辑器继续运行在本地，而命令和远程扩展在数据所在的服务器上执行。SSH 配置中只应保存主机别名和身份文件引用，不应写入密码；项目机密同样应放在仓库之外。

## 给每款可选软件划清职责

- [IINA](https://github.com/iina/iina) 是一款定位明确的开源媒体播放器，适合查看录像和演示材料，但不承担科研资料管理。
- [Alfred](https://www.alfredapp.com/) 可以借助搜索和精心设计的 Workflow 减少来回切换与查找。适合自动化的是重复动作，而不是把需要判断的多步流程藏进难以审计的黑盒。
- [Parallels Desktop](https://www.parallels.com/products/desktop/resources/) 适合承载确实只能在 Windows 中运行的软件或设备工具。决定依赖它之前，应核对主机芯片、客户机系统、许可证和硬件透传限制；虚拟机本身既不是备份，也不会自动带来可复现的科研环境。

## 每季度做一次恢复演练

每隔几个月，我都会做一次小型恢复演练，看看这套工作台能否在不依赖个人记忆的情况下回答五个问题：

1. Mac 丢失后，能否从经过测试的备份恢复？
2. 能否依据审阅过的软件清单重新安装必要应用？
3. 每篇正在撰写的论文，能否从一个全新检出的副本完成构建？
4. 远程工作时，能否避免把敏感数据复制到临时目录？
5. 删除过时应用前，能否确认没有其他工作流暗中依赖它？

与“应用程序”目录里装了多少软件相比，这五个问题更能说明一套科研工作台是否可靠。
