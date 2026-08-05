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

只有按正确顺序扩展每一层，Linux 根文件系统的扩容才是安全的。命令本身并不长；真正重要的是准确识别磁盘、分区、物理卷、卷组、逻辑卷和文件系统。

## 从存储层次开始理解

一个基于 LVM 的文件系统通常包含以下链路：

1. 虚拟化平台或物理磁盘提供块存储容量。
2. 分区可以限定分配给 LVM 的空间。
3. LVM 物理卷（PV）把该分区交给卷组（VG）管理。
4. VG 向逻辑卷（LV）分配物理区域。
5. ext4 或 XFS 等文件系统位于 LV 之上。
6. 挂载点（通常是 `/`）把文件系统呈现给应用。

[Red Hat LVM 文档](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/configuring_and_managing_logical_volumes/basic-logical-volume-management)描述了相同的 PV–VG–LV 模型。只扩展某一层，并不会自动让上层看到新增空间。

## 扩容前必须停止的情况

不要从分区编辑器开始。首先制作应用一致的备份，并确认备份可以恢复。如果根磁盘、远程访问、加密、RAID、多路径或快照会让恢复过程变得不确定，应安排维护窗口。

出现以下任一情况时，应停止操作并查找与平台匹配的专用流程：

- 无法唯一确定目标设备或 LV；
- 磁盘报告错误，或 RAID 已经降级；
- 磁盘与 LVM 之间还存在 LUKS、硬件 RAID、精简配置或其他存储层；
- 文件系统既不是 ext4，也不是 XFS；
- 计划中的操作会缩小或移动现有分区。

本文只讨论扩容，不把 LVM 快照当作备份，也不建议删除并重建正在使用的分区。

## 1. 记录当前布局并保护数据

修改前先保存完整的映射关系：

```bash
sudo lsblk -f
sudo pvs
sudo vgs
sudo lvs -a -o +devices
findmnt /
df -hT /
```

记录 `/` 对应的准确源设备、文件系统类型、LV 与 VG 名称、PV 设备和分区编号，并把输出与备份记录放在一起。下文的设备名只是占位符，不能直接照抄。

## 2. 判断究竟是哪一层缺少空间

- 如果 `vgs` 已经显示足够的空闲区域，说明磁盘、分区和 PV 都已经足够大，可直接进入 LV 扩容步骤。
- 如果虚拟磁盘或物理磁盘已经变大，但 LVM 分区尚未扩展，应先扩大现有分区，再调整 PV。
- 如果容量来自一块新磁盘，只有确认目标设备为空之后，才能创建新 PV 并加入指定 VG；这与扩展现有分区是两种不同操作。
- 如果 `/` 不在 LVM 上，PV、VG 和 LV 步骤均不适用。

应同时用 `lsblk` 和 LVM 报告交叉确认结论，不能根据示例或另一台机器的历史配置猜测设备名。

## 3. 扩展现有分区

扩大底层虚拟磁盘或物理设备后，[growpart](https://manpages.ubuntu.com/manpages/jammy/man1/growpart.1.html) 可以在保留起始边界的前提下，把一个现有分区扩展到相邻的未分配空间。如果系统中没有该命令，应安装发行版提供 `growpart` 的软件包。

把下面两个占位符替换为第一步记录的值：

```bash
DISK=/dev/sdX
PARTITION_NUMBER=N

sudo growpart "$DISK" "$PARTITION_NUMBER"
sudo lsblk -f
```

只有当 `lsblk` 显示目标分区起点不变且容量增大时，才能继续。如果内核没有识别新的分区边界，应停止操作，并采用平台文档规定的重新扫描或维护重启流程，而不是临时使用 `fdisk` 猜测处理。

## 4. 调整 LVM 物理卷

此时分区可能已经变大，但 LVM 仍然看到旧的 PV 容量。[pvresize](https://manpages.ubuntu.com/manpages/jammy/man8/pvresize.8.html) 会更新 LVM 对可用物理区域的认知：

```bash
PV_PARTITION=/dev/sdXN

sudo pvresize "$PV_PARTITION"
sudo pvs
sudo vgs
```

确认目标 VG 已经出现新增空闲空间。即使命令执行成功，作用于错误 PV 仍然是错误操作，因此必须把设备名和 VG 名称与基线记录再次比对。

## 5. 同时扩展逻辑卷与文件系统

扩容时更安全的命令是 `lvextend`，而不是同时具备缩容能力的通用调整命令。根据 [lvextend 文档](https://manpages.ubuntu.com/manpages/jammy/man8/lvextend.8.html)，`-r` 选项会在扩展 LV 后请求 LVM 一并扩大文件系统。

如果同一 VG 被多个 LV 共享，应明确分配需要的容量：

```bash
LV_PATH=/dev/mapper/vg-lv

sudo lvextend -r -L +10G "$LV_PATH"
sudo lvs
df -hT /
```

只有确定要让该 LV 使用全部剩余空间时，才使用所有空闲区域：

```bash
sudo lvextend -r -l +100%FREE "$LV_PATH"
```

如果 LV 已经扩展而文件系统扩展失败，不要盲目重复命令。应先检查 `lvs`、`findmnt` 和文件系统工具的诊断信息；此时 LV 可能已经变大，只是文件系统尚未扩大。

## 6. 区分 ext4 与 XFS

当系统安装的 LVM 工具支持目标文件系统时，`lvextend -r` 是首选的一体化操作，但底层工具的接口并不相同：

- 对 ext4 而言，[resize2fs](https://manpages.ubuntu.com/manpages/jammy/man8/resize2fs.8.html) 作用于文件系统所在的块设备，并支持对已挂载 ext4 文件系统进行在线扩容。
- 对 XFS 而言，[xfs_growfs](https://manpages.ubuntu.com/manpages/jammy/man8/xfs_growfs.8.html) 扩展已挂载的文件系统，参数是挂载点，而不是 LV 路径。

因此，在任何手动补救操作前，都应先用 `findmnt -no FSTYPE,SOURCE,TARGET /` 确认类型。不要同时运行两种文件系统工具，也不要相互替代。

## 7. 验证每一层

操作完成后重新执行完整盘点：

```bash
sudo lsblk -f
sudo pvs
sudo vgs
sudo lvs -a -o +devices
findmnt /
df -hT /
```

磁盘与分区应显示扩展后的容量，PV 应把空间交给 VG，LV 应达到计划大小，`df` 应显示文件系统新增的可用空间。关闭维护窗口前，还应检查系统日志与应用健康状态。

## 常见错误

- 扩大虚拟磁盘后，忘记继续处理分区或 PV 层。
- 在还需要为其他 LV 或快照保留空间的 VG 中使用 `100%FREE`。
- 使用记忆中的 mapper 路径，而不是 `findmnt` 报告的实际源设备。
- 对 XFS 运行 `resize2fs`，或把 LV 设备而非挂载点传给 `xfs_growfs`。
- 只因为命令返回成功就认为完成，而没有把最终状态与基线逐层对比。
