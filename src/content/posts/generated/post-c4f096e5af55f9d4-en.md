---
title: "Setting Up a Windows Storage Pool"
date: "2022-12-14"
description: "Three quick steps for resetting disks and creating a Windows Storage Spaces pool."
tags: ["windows","storage-spaces"]
categories: ["Systems"]
locale: "en"
slug: "windows-storage-pool-setup"
sourceId: "post-c4f096e5af55f9d4"
translationKey: "post-c4f096e5af55f9d4"
generated: true
draft: false
---
1. In PowerShell, run `get-physicaldisk` and identify the drives you want to add to the pool.
2. Run `Reset-PhysicalDisk -FriendlyName "XXXX"` for the selected drive.
3. Open Control Panel > System and Security > Storage Spaces > Create a new pool and storage space.
