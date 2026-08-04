---
title: "Bridging IPTV to a Router over VLAN on One Cable"
date: "2024-01-04"
description: "A practical VLAN trunk configuration for carrying Internet and bridged IPTV traffic between an optical modem and a router over one cable."
tags: ["iptv", "vlan", "router"]
categories: ["Networking"]
locale: "en"
slug: "bridge-iptv-over-vlan-single-cable"
sourceId: "post-7b6200b25e232fdd"
translationKey: "post-7b6200b25e232fdd"
generated: true
draft: false
---

> This setup only forwards the IPTV link; it cannot use M3U.
> The optical modem in this network has already been placed in bridge mode, and the router performs PPPoE dialing.

**1. Principle:** Use VLAN technology to bridge multiple ports on the optical modem to different ports on the router. The router can then connect both Internet devices and IPTV devices at the same time.

**2. Procedure:**
(a) Obtain the optical modem's administrator account and password. You can call the carrier technician responsible for your home broadband and ask for them.

(b) On the optical modem, configure bridge-mode VLANs for the Internet stream (`INTERNET`) and IPTV stream (`OTHER`), using VLAN IDs 1337 and 43 respectively.

![Optical modem Internet VLAN bridge configuration](/assets/blog/generated/nas-import/dan-xian-fu-yong-tong-guo-vlan-jiang-guang-mao-de-iptv-qiao-jie-dao-lu-you-qi-sh/image-001.png)

![Optical modem IPTV VLAN bridge configuration](/assets/blog/generated/nas-import/dan-xian-fu-yong-tong-guo-vlan-jiang-guang-mao-de-iptv-qiao-jie-dao-lu-you-qi-sh/image-002.png)

(c) Configure both VLANs on one port connected directly to the router. That port becomes the interface for the trunk link.

![Optical modem trunk-port VLAN configuration](/assets/blog/generated/nas-import/dan-xian-fu-yong-tong-guo-vlan-jiang-guang-mao-de-iptv-qiao-jie-dao-lu-you-qi-sh/image-003.png)

(d) Configure IPTV on the ASUS router. Select “Manual Setting,” then assign the `INTERNET` and `IPTV` VLANs to the ports you want to use. Select “RFC3442 & Microsoft” for DHCP. I have not yet figured out how to use Udpxy.

![ASUS router IPTV VLAN settings](/assets/blog/generated/nas-import/dan-xian-fu-yong-tong-guo-vlan-jiang-guang-mao-de-iptv-qiao-jie-dao-lu-you-qi-sh/image-004.png)

(e) Connect the IPTV device to the router port configured with the IPTV VLAN, and it should work.

**3. Problems and limitations:** This setup only provides single-cable multiplexing for IPTV and Internet, together with IPTV bridging. Further study is needed to support multicast.
