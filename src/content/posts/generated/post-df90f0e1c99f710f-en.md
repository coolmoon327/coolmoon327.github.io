---
title: "Expanding the Ubuntu Server Root Volume"
date: "2022-11-30"
description: "A practical overview of disks, LVM, partitioning, and the steps for expanding an Ubuntu Server root filesystem."
tags: ["ubuntu-server","lvm","storage"]
categories: ["Systems"]
locale: "en"
slug: "ubuntu-server-root-volume-expansion"
sourceId: "post-df90f0e1c99f710f"
translationKey: "post-df90f0e1c99f710f"
generated: true
draft: false
---
## Related Tools

1. LVM
   - Supports dynamic expansion.
   - LVM is virtual. To resize the physical partition, boot from another disk and use `gparted` to adjust the size of `/`.
   - Install the `lvextend` command with `apt-get install lvm2`.
2. fdisk
   - Used for partition management.
   - `fdisk -l` lists the partition table.
   - `fdisk /dev/sda` manages partitions on `sda`. Common commands include `n` to create a partition, `d` to delete one, `t` to change its type, and `p` to print the partition table. Print the table first so you know the target partition's **number**.

## Hard Drive Management

- Block devices: Connect a new hard drive to the machine.
- Disk partitioning: Divide the block device into one or more fixed-size partitions; a single partition may also occupy the entire disk.
- **Create physical volumes (PV)**: Following LVM's model, create a physical volume from each disk partition.
- **Create a volume group (VG)**: A new physical volume is like a bottle of water. Add it to the VG's larger pool to increase the available hardware space.
  Only free space in the same volume group can be used by `lvextend`.
- **Create logical volumes (LV)**: Allocating disk space is like taking a scoop of water from the VG pool. That allocated space is a logical volume.
- File system: Create a file system, such as ext4, on the LV.
- Mount point: Mount the formatted LV at a directory to access it.

The middle three layers are introduced by LVM; the others belong to traditional disk management. For more detail, see [this LVM tutorial](https://linux.cn/article-3218-1.html).

## Expanding the Root Directory

### 1. Understand the Ubuntu Server Partition Layout

Use `lsblk` to inspect the partition layout and identify the LVM details associated with `/`, such as the volume group `ubuntu--vg` and logical volume `ubuntu--vg-ubuntu--lv`.

Use `df -h` to inspect file-system usage and locate the target logical volume at `/dev/mapper/ubuntu--vg-ubuntu--lv`.

Use `vgdisplay` for detailed volume-group information. Pay attention to the `Free` space: if it is `0`, add another physical volume to the VG before expanding the logical volume mounted at `/`.

### 2. Expand the Disk

First add storage to the Ubuntu Server system; a new block device will appear.

For an Ubuntu virtual machine, you can resize the virtual disk directly, although this may trigger an `fdisk` warning described at the end of this article.

### 3. LVM Partition

> Assume the original disk is expanded directly and appears as `sda` in Ubuntu. Use `parted -l` to complete the repair.

- Run `fdisk /dev/sda`, use `n` to create a partition, accept the defaults, and record the new partition number, such as `sda4`.
- Use `t` to change the new partition's type. Enter partition number `4` and select the code for `Linux LVM`; the code varies by environment, so use `L` to list it. In the original setup it was decimal 31.
- Use `p` to confirm the partition layout. If it is correct, use `w` to save and exit.

`fdisk` does not modify the partition table until `w` is executed, so you can safely inspect and revise the pending changes before saving.

### 4. Expand the Logical Volume

At this point the new space is partitioned, but no LVM volume has been created. Now use the identifiers recorded earlier.

- Create a PV on the new partition: `pvcreate /dev/sda4`
- Add the PV to the target VG: `vgextend ubuntu--vg /dev/sda4`
- Confirm the VG details: `vgdisplay`
- Expand the target LV:
  - To a specified size: `lvresize -L 20G /dev/mapper/ubuntu--vg-ubuntu--lv`
  - Using all remaining free space: `lvresize -l +100%FREE /dev/mapper/ubuntu--vg-ubuntu--lv`
- Resize the file system: `resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv`
- Confirm the expansion: `df -h`

## Potential Issues

1. After resizing a virtual disk externally, `fdisk` may report that the partition-table header does not match the disk's actual size.
   - Run `parted -l`; when prompted to repair it, select `fix`.
   - If no repair prompt appears, rerun the command with `sudo` privileges.
