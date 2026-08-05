---
title: "安全扩展 Linux 存储：分区、LVM 与文件系统"
date: "2022-11-30"
math: false
description: "以安全边界为先，解释 Linux 存储扩容中分区、LVM 与文件系统各层的职责和操作顺序。"
tags: ["linux-storage", "lvm", "filesystems", "operations"]
categories: ["Systems Engineering"]
locale: "zh"
slug: "growing-linux-storage-safely"
sourceId: "post-df90f0e1c99f710f"
translationKey: "post-df90f0e1c99f710f"
generated: true
draft: false
---

Linux 根文件系统能否安全扩容，关键在于先弄清存储链路，再按正确顺序逐层扩大。命令本身并不复杂，难点是准确确认目标磁盘、分区、物理卷、卷组、逻辑卷和文件系统，不能把任何一层认错。

## 先理清存储层次

采用 LVM 的文件系统通常沿着下面这条链路组织：

1. 虚拟化平台或物理磁盘提供底层块设备容量。
2. 分区划定其中交给 LVM 使用的空间。
3. LVM 物理卷（PV）把这个分区纳入卷组（VG）。
4. VG 再把可用的物理区段（extent）分配给逻辑卷（LV）。
5. ext4、XFS 等文件系统建立在 LV 之上。
6. 挂载点（根文件系统通常是 `/`）最终把文件系统提供给应用使用。

[Red Hat LVM 文档](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/configuring_and_managing_logical_volumes/basic-logical-volume-management)采用的也是这一 PV–VG–LV 模型。某一层容量变大后，上层并不会自动获得这些新增空间。

## 动手前先确认哪些情况必须停下

不要一上来就打开分区工具。应先制作应用一致的备份，并实际确认它可以恢复。如果操作涉及根磁盘、远程访问、加密、RAID、多路径或快照，导致故障后的恢复路径不够确定，就应安排维护窗口。

遇到以下任一情况，都应先停下来，查找与当前平台和存储结构相匹配的专用流程：

- 无法唯一确认目标设备或 LV；
- 磁盘报告错误，或 RAID 已经降级；
- 磁盘与 LVM 之间还夹着 LUKS、硬件 RAID、精简置备或其他存储层；
- 文件系统既不是 ext4，也不是 XFS；
- 计划中的操作会缩小或移动现有分区。

本文只讨论扩容。LVM 快照不能代替备份，也不应通过删除并重建正在使用的分区来完成扩容。

## 1. 记录现有布局并保护数据

修改前，先把当前各层的对应关系完整记录下来：

```bash
sudo lsblk -f
sudo pvs
sudo vgs
sudo lvs -a -o +devices
findmnt /
df -hT /
```

记录 `/` 实际对应的源设备、文件系统类型、LV 和 VG 名称、PV 设备以及分区编号，并把这些输出与备份记录保存在一起。下文出现的设备名都只是占位符，绝不能直接照抄到真实机器上。

## 2. 判断空间卡在哪一层

- 如果 `vgs` 已显示足够的空闲区段，说明磁盘、分区和 PV 的容量已经到位，可以直接处理 LV。
- 如果虚拟磁盘或物理磁盘已经变大，但承载 LVM 的分区仍是原来的大小，就要先扩展现有分区，再让 PV 识别新增空间。
- 如果新增容量来自另一块磁盘，必须先确认目标设备为空，再创建新的 PV 并加入正确的 VG。这与扩展原有分区是两类不同操作。
- 如果 `/` 根本不在 LVM 上，后续 PV、VG 和 LV 步骤都不适用。

结论必须同时经过 `lsblk` 与 LVM 报告交叉确认。不要根据教程示例，也不要根据另一台机器的旧配置去猜设备名。

## 3. 扩展现有分区

底层虚拟磁盘或物理设备扩容后，[growpart](https://manpages.ubuntu.com/manpages/jammy/man1/growpart.1.html) 可以保持分区起始位置不变，把现有分区向后扩展到相邻的未分配空间。如果系统没有这个命令，应安装发行版中提供 `growpart` 的软件包。

执行前，把下面两个占位符替换为第一步确认并记录的真实值：

```bash
DISK=/dev/sdX
PARTITION_NUMBER=N

sudo growpart "$DISK" "$PARTITION_NUMBER"
sudo lsblk -f
```

只有在 `lsblk` 显示目标分区起点未变、容量确实增大后，才能继续。如果内核没有识别新的分区边界，应停止操作，按平台文档执行设备重新扫描或维护重启，不能临时改用 `fdisk` 试探处理。

## 4. 调整 LVM 物理卷

分区扩展完成后，LVM 仍可能只看到原来的 PV 容量。[pvresize](https://manpages.ubuntu.com/manpages/jammy/man8/pvresize.8.html) 用来更新 LVM 对可用物理区段的识别：

```bash
PV_PARTITION=/dev/sdXN

sudo pvresize "$PV_PARTITION"
sudo pvs
sudo vgs
```

确认新增空间已经出现在目标 VG 的空闲区段中。即使命令返回成功，如果操作的是错误 PV，结果仍然是错的；因此必须再次把设备名和 VG 名称与最初记录的基线逐项核对。

## 5. 同时扩展逻辑卷与文件系统

只做扩容时，应优先使用 `lvextend`，不要选用同时支持缩容的通用调整命令。根据 [lvextend 文档](https://manpages.ubuntu.com/manpages/jammy/man8/lvextend.8.html)，`-r` 选项会在扩大 LV 后，让 LVM 继续扩展其中的文件系统。

如果一个 VG 同时承载多个 LV，应明确指定本次要增加多少容量：

```bash
LV_PATH=/dev/mapper/vg-lv

sudo lvextend -r -L +10G "$LV_PATH"
sudo lvs
df -hT /
```

只有在明确决定让该 LV 占用全部剩余空间时，才使用所有空闲区段：

```bash
sudo lvextend -r -l +100%FREE "$LV_PATH"
```

如果 LV 已经扩展，但文件系统扩展失败，不要原样重跑命令。先查看 `lvs`、`findmnt` 以及文件系统工具给出的诊断信息；此时很可能是 LV 已经变大，而文件系统还停留在原来的容量。

## 6. 区分 ext4 与 XFS

当系统中的 LVM 工具支持目标文件系统时，`lvextend -r` 是首选的一体化操作。不过，底层文件系统工具的调用方式并不相同：

- 对于 ext4，[resize2fs](https://manpages.ubuntu.com/manpages/jammy/man8/resize2fs.8.html) 接收文件系统所在的块设备，并支持在线扩展已经挂载的 ext4 文件系统。
- 对于 XFS，[xfs_growfs](https://manpages.ubuntu.com/manpages/jammy/man8/xfs_growfs.8.html) 用来扩展已挂载的文件系统，传入的是挂载点，而不是 LV 路径。

因此，进行任何手动补救之前，都要先用 `findmnt -no FSTYPE,SOURCE,TARGET /` 确认文件系统类型。两种工具不能同时运行，也不能互相替代。

## 7. 验证每一层

操作完成后，再执行一次完整盘点：

```bash
sudo lsblk -f
sudo pvs
sudo vgs
sudo lvs -a -o +devices
findmnt /
df -hT /
```

此时，磁盘和分区应显示扩展后的容量，PV 应把新增空间交给 VG，LV 应达到计划大小，`df` 也应显示文件系统新增的可用空间。结束维护窗口之前，还要检查系统日志和应用运行状态。

## 常见错误

- 扩大虚拟磁盘后，忘了继续扩展分区或更新 PV。
- 在还需要为其他 LV 或快照保留空间的 VG 中使用 `100%FREE`。
- 凭记忆填写 mapper 路径，而不是使用 `findmnt` 报告的实际源设备。
- 对 XFS 运行 `resize2fs`，或把 LV 设备而非挂载点传给 `xfs_growfs`。
- 看到命令返回成功就认为已经完成，却没有把最终状态与基线逐层核对。
