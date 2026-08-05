---
title: "Growing Linux Storage Safely: Partitions, LVM, and Filesystems"
date: "2022-11-30"
math: false
description: "A safety-first mental model and procedure for extending Linux storage across partitions, LVM layers, and filesystems."
tags: ["linux-storage", "lvm", "filesystems", "operations"]
categories: ["Systems Engineering"]
locale: "en"
slug: "growing-linux-storage-safely"
sourceId: "post-df90f0e1c99f710f"
translationKey: "post-df90f0e1c99f710f"
generated: true
draft: false
---

Growing a Linux root filesystem is safe only when each storage layer is expanded in the correct order. The commands are short; identifying the right disk, partition, physical volume, volume group, logical volume, and filesystem is the real work.

## Start with the storage layers

An LVM-backed filesystem normally follows this chain:

1. The hypervisor or physical disk provides block capacity.
2. A partition may bound the space assigned to LVM.
3. The LVM physical volume (PV) exposes that partition to a volume group (VG).
4. The VG supplies extents to a logical volume (LV).
5. A filesystem such as ext4 or XFS occupies the LV.
6. A mount point, often `/`, exposes the filesystem to applications.

The [Red Hat LVM documentation](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/configuring_and_managing_logical_volumes/basic-logical-volume-management) describes the same PV–VG–LV model. Space added at one layer is not automatically visible to the layers above it.

## Stop conditions before you resize

Do not begin with a partition editor. First make an application-consistent backup and verify that it can be restored. Schedule a maintenance window when the root disk, remote access, encryption, RAID, multipath, or snapshots make recovery less predictable.

Stop and obtain a platform-specific procedure if any of these conditions is true:

- the target device or LV cannot be identified unambiguously;
- the disk reports errors or degraded RAID;
- LUKS, hardware RAID, thin provisioning, or another storage layer sits between the disk and LVM;
- the filesystem is neither ext4 nor XFS;
- the proposed change would shrink or move an existing partition.

This article covers growth only. It does not treat an LVM snapshot as a backup and does not recommend deleting and recreating a live partition.

## 1. Record the current layout and protect the data

Capture the complete mapping before changing anything:

```bash
sudo lsblk -f
sudo pvs
sudo vgs
sudo lvs -a -o +devices
findmnt /
df -hT /
```

Record the exact source shown for `/`, its filesystem type, the LV and VG names, the PV device, and the partition number. Save this output with the backup record. Device names in the examples below are placeholders, not values to copy.

## 2. Decide which layer lacks space

- If `vgs` already reports enough free extents, the disk, partition, and PV are large enough; skip directly to the LV step.
- If the virtual or physical disk is larger but its LVM partition has not grown, extend the existing partition and then resize the PV.
- If capacity comes from a new disk, create a new PV and add it to the intended VG only after verifying the device is empty. That is a different operation from extending an existing partition.
- If `/` is not on LVM, the PV, VG, and LV steps do not apply.

Check the conclusion against both `lsblk` and the LVM reports. Never infer a device name from an example or from a previous machine.

## 3. Grow the existing partition

After expanding the underlying virtual disk or physical device, [growpart](https://manpages.ubuntu.com/manpages/jammy/man1/growpart.1.html) can extend one existing partition into adjacent unallocated space while preserving its starting boundary. Install the distribution package that provides `growpart` if the command is unavailable.

Replace both placeholders with values recorded in the first step:

```bash
DISK=/dev/sdX
PARTITION_NUMBER=N

sudo growpart "$DISK" "$PARTITION_NUMBER"
sudo lsblk -f
```

Proceed only if `lsblk` shows the expected partition with the same start and a larger size. If the kernel does not expose the new boundary, stop and use the platform's documented rescan or maintenance-reboot procedure instead of improvising with `fdisk`.

## 4. Resize the LVM physical volume

The partition may now be larger while LVM still sees the old PV size. [pvresize](https://manpages.ubuntu.com/manpages/jammy/man8/pvresize.8.html) updates LVM's view of the available extents:

```bash
PV_PARTITION=/dev/sdXN

sudo pvresize "$PV_PARTITION"
sudo pvs
sudo vgs
```

Confirm that the intended VG now reports additional free space. A successful command against the wrong PV is still the wrong change, so compare the device and VG names with the captured baseline.

## 5. Extend the logical volume and filesystem together

The safer growth command is `lvextend`, not a generic resize command that can also shrink a volume. Its `-r` option asks LVM to grow the filesystem after extending the LV, as documented by [lvextend](https://manpages.ubuntu.com/manpages/jammy/man8/lvextend.8.html).

Allocate a deliberate amount when the VG is shared by several LVs:

```bash
LV_PATH=/dev/mapper/vg-lv

sudo lvextend -r -L +10G "$LV_PATH"
sudo lvs
df -hT /
```

Use all remaining free extents only when that allocation is intentional:

```bash
sudo lvextend -r -l +100%FREE "$LV_PATH"
```

Do not rerun the command blindly if filesystem growth fails after the LV was extended. First inspect `lvs`, `findmnt`, and the filesystem-specific diagnostic output; the LV may already be larger even though the filesystem is not.

## 6. Distinguish ext4 from XFS

`lvextend -r` is the preferred single transaction when the installed LVM tooling supports the filesystem. The underlying tools still have different interfaces:

- For ext4, [resize2fs](https://manpages.ubuntu.com/manpages/jammy/man8/resize2fs.8.html) grows the filesystem on its block device and supports online growth for a mounted ext4 filesystem.
- For XFS, [xfs_growfs](https://manpages.ubuntu.com/manpages/jammy/man8/xfs_growfs.8.html) grows a mounted filesystem and is given the mount point rather than the LV path.

Therefore, identify the type with `findmnt -no FSTYPE,SOURCE,TARGET /` before any manual recovery step. Never run both filesystem tools, and never substitute one for the other.

## 7. Verify every layer

Repeat the inventory after the operation:

```bash
sudo lsblk -f
sudo pvs
sudo vgs
sudo lvs -a -o +devices
findmnt /
df -hT /
```

The disk and partition should show the expanded capacity, the PV should expose it to the VG, the LV should have the intended size, and `df` should show the filesystem's usable space. Also check the system log and application health before closing the maintenance window.

## Common mistakes

- Expanding the virtual disk but forgetting the partition or PV layer.
- Consuming `100%FREE` in a VG that must retain space for another LV or snapshot.
- Using a remembered mapper path instead of the source reported by `findmnt`.
- Running `resize2fs` on XFS or passing an LV device to `xfs_growfs` instead of its mount point.
- Treating a successful command as proof without comparing the final state to the baseline.
