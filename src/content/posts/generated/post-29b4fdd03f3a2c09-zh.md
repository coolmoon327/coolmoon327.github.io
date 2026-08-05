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

好用的科研工作台，不是安装列表最长的 Mac，而是在硬盘损坏、更换电脑或连接计算服务器后，仍能保持工作来源与过程完整的系统。我的原则很简单：基础能力优先使用系统原生方案，工具链尽量声明化；只有某个专用软件承担了清晰、不可替代的职责，才把它加入工作流。

## 围绕故障来设计工作台

### 文件管理：原生优先

Finder 已能完成日常文件组织和移动：同一卷内拖动默认移动；跨卷拖动时按住 Command，可以明确要求移动。Apple 的[文件管理快捷键说明](https://support.apple.com/en-us/102650)记录了这一行为。因此，我不会只为模仿 Windows 式剪切粘贴而安装 Finder 替代品。

更重要的是项目布局。每个科研项目使用独立目录，包含源文件、数据说明、脚本、图片和简短的构建说明。大型数据可以放在别处，但项目必须记录其来源、完整性校验方式以及结果再生成方法。

### 加密与恢复

启用 [FileVault](https://support.apple.com/guide/mac-help/protect-data-on-your-mac-with-filevault-mh11785/mac)，并把恢复方式保存在启动盘之外。加密能保护遗失的电脑，却不能代替备份。

用加密的 [Time Machine 备份](https://support.apple.com/en-us/104984)承担日常恢复，同时为不可替代的论文、源数据和凭据保留独立副本。备份只有通过恢复测试才可信：把一个小项目恢复到临时位置，确认源文件、文献库、图片和构建说明均完整可用。

### 跨平台交换盘

只在 Mac 上使用的工作盘，应选择与当前 macOS 相适配的原生格式。只有可移动磁盘确实需要同时被 macOS 和 Windows 写入时，才使用 ExFAT；Apple 将其列为 [Windows 兼容格式](https://support.apple.com/en-us/101830)。这种磁盘适合作为交换介质，不应成为唯一存档，因为“方便携带”和“备份可靠”是两项不同的需求。

## 让工具链可以重建

[Homebrew Bundle](https://docs.brew.sh/Brew-Bundle-and-Brewfile) 可以把个人软件清单变成可审阅的 `Brewfile`。一个精简的科研配置可以从下面开始：

```ruby
brew "git"
brew "ripgrep"
brew "pandoc"
cask "visual-studio-code"
cask "iina"
```

用一条命令检查或恢复：

```bash
brew bundle check || brew bundle
```

可以把 `Brewfile` 与工作站说明一起提交，但不要把它误认为精确的环境锁。Homebrew 是滚动发布的软件包管理器，其官方文档明确说明 Brewfile 没有用于固定任意版本的锁文件机制。可复现实验仍应按需要使用项目级环境、版本记录、容器或归档构建镜像。

## 分离本地编辑与远程执行

使用 [VS Code Profiles](https://code.visualstudio.com/docs/configure/profiles) 隔离论文写作、系统维护与软件开发所需的扩展和设置。Profile 是便利层，不能取代随项目提交的配置。

对于不熟悉的代码仓库，先在 [Workspace Trust 限制模式](https://code.visualstudio.com/docs/editing/workspaces/workspace-trust)中检查任务、设置和扩展，再决定是否信任。面对计算密集型任务，[Remote - SSH](https://code.visualstudio.com/docs/remote/ssh) 可让编辑器留在本地，而命令与远程扩展在数据旁执行。SSH 配置只应保存主机别名和身份文件引用，不应写入密码；项目机密也应置于仓库之外。

## 让可选软件各司其职

- [IINA](https://github.com/iina/iina) 是定位明确的开源媒体播放器，适合检查录像和演示材料，不负责管理科研资产。
- [Alfred](https://www.alfredapp.com/) 可以通过搜索和经过设计的 Workflow 减少导航成本。应自动化重复决策，而不是制造难以审计的黑盒链条。
- [Parallels Desktop](https://www.parallels.com/products/desktop/resources/) 适合作为确有需要的 Windows 专用软件或设备工具的兼容边界。依赖它之前，应核对当前主机芯片、客户机系统、许可证和硬件透传限制；虚拟机本身既不是备份，也不天然构成可复现的科研环境。

## 每季度做一次恢复演练

每隔几个月，我会检查这套工作台能否在不依赖记忆的情况下回答五个问题：

1. Mac 丢失后，能否从经过测试的备份恢复？
2. 能否从受审阅的软件清单重建必要应用？
3. 每篇在写论文能否从干净的检出版本完成构建？
4. 远程工作能否避免把敏感数据复制到临时位置？
5. 删除过时应用时，能否确认没有隐藏依赖随之断裂？

这份清单比“应用程序”目录里的图标数量更能衡量科研工作台的质量。
