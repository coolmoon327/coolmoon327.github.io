---
title: "Ubuntu Server 根目录扩容"
date: "2022-11-30"
description: "介绍磁盘、LVM、分区以及扩容 Ubuntu Server 根文件系统的实用步骤。"
tags: ["ubuntu-server","lvm","storage"]
categories: ["Systems"]
locale: "zh"
slug: "ubuntu-server-root-volume-expansion"
sourceId: "post-df90f0e1c99f710f"
translationKey: "post-df90f0e1c99f710f"
generated: true
draft: false
---
## 相关工具

1. LVM
   - 可以实现动态扩容
   - 是虚拟的，想要物理扩容需要通过另一个启动盘使用 `gparted` 调整 `/` 的大小
   - `lvextend` 命令可以通过 `apt-get install lvm2` 安装
2. fdisk
   - 用于分区管理
   - `fdisk -l` 可列出分区表
   - `fdisk /dev/sda` 可管理 `sda` 的分区，常用命令包括 `n` 新建分区，`d` 删除分区，`t` 更改分区格式，`p` 打印分区表（记得先打印分区表，搞清楚目标分区的**编号**）

## 硬盘管理

- 块设备：给机器插上新的硬盘。
- 硬盘分区：把块设备分成多个分区（1个分区用尽整块磁盘也可以，无所谓），每个分区的大小也是固定的。
- **创建物理卷（PV）**：按照LVM的规则，把每个硬盘分区创建为一个物理卷（physical volume）。
- **创建卷池（VG）**：新建的物理卷就像一桶矿泉水，把它们加入到一个VG大池子里面，这样池子里的水（硬件空间）就会变多。
  只有在同一卷池里的空间，才能用 `lvextend` 扩容
- **创建逻辑卷（LV）**：想要划分一块硬盘空间拿来使用，只需要从VG里面取一瓢水出来即可，这个划分出来的硬盘空间叫做一个LV（logical volume）。
- 文件系统：现在可以对LV制作文件系统，比如：ext4格式。
- 挂载目录：现在可以把在做好文件系统的LV挂载到某个目录，就可以访问了。

中间三个是 LVM 新增的，其他部分是传统硬盘管理的内容。LVM 教程详见 [博客](https://linux.cn/article-3218-1.html)。

## 根目录扩容

### 1. 了解 ubuntu server 的分区结构

可以使用 `lsblk` 工具查看，并把握 `/` 目录相关的 LVM 信息，比如卷池名 `ubuntu--vg`，逻辑卷名 `ubuntu--vg-ubuntu--lv`

通过 `df -h` 命令查看文件系统的占用信息，找到目标卷池的位置为 `/dev/mapper/ubuntu--vg-ubuntu--lv`

进一步还可以用 `vgdisplay` 命令查看具体的卷池信息，需要注意其中的 `Free` 空间大小，如果是 0，则需要往卷池中加入其他物理卷才能给 `/` 的逻辑卷扩容

### 2. 扩容磁盘

首先需要为 ubuntu server 加装新的存储空间，系统中会多出一个块设备。

如果是 ubuntu 虚拟机，可以直接调整虚拟机的磁盘大小，不过会引起 `fdisk` 的报错，详见本文最后。

### 3. LVM 分区

> 假设我们直接对原始硬盘进行扩容，ubuntu 中对应为 `sda` 磁盘，用 `parted -l` 完成修复

- 使用 `fdisk /dev/sda` 配置 `sda` 磁盘，用 `n` 指令新建一个分区，全选默认，记下新分区的编号 `sda4`
- 继续用 `t` 指令修改上述新建分区的文件系统，输入新分区的编号 `4`，选择 `Linux LVM` 对应的代码（不同系统环境可能不一样，用 `L` 查看，我配的时候是十进制 31）
- 使用 `p` 指令确认分区结构，无误后用 `w` 指令保存并退出

`fdisk` 在执行 `w` 指令之前都不会真正修改文件系统，非常安全，可以大胆尝试

### 4. 逻辑扩容

现在只对新的空间进行了分区，还没有创建卷，现在就要用到我们之前记录的那些卷号信息了

- 在新分区上创建一个 PV：`pvcreate /dev/sda4`
- 将该 PV 加入到目标 VG：`vgextend ubuntu--vg /dev/sda4`
- 确认 VG 信息：`vgdisplay`
- 扩容目标 LV：
  - 指定大小：`lvresize -L 20G /dev/mapper/ubuntu--vg-ubuntu--lv`
  - 将全部剩余空间扩容进去：`lvresize -l +100%FREE /dev/mapper/ubuntu--vg-ubuntu--lv`
- 更新文件系统：`resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv`
- 确认扩容完成：`df -h`

## 潜在问题

1. 虚拟机系统从外部调整磁盘大小后，`fdisk` 会提示表头信息与实际大小不符
   - 使用 `parted -l` 会弹出是否修复的询问，选择 `fix`
   - 如果没有修复询问，使用 `sudo` 权限执行
