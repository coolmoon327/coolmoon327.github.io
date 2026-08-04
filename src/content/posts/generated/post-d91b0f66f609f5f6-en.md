---
title: "Koolshare Bypass-Router Configuration Notes"
date: "2022-12-17"
description: "Notes on Koolshare version compatibility, offline plugins, and KoolClash configuration on x86 routers."
tags: ["koolshare","bypass-router"]
categories: ["Networking"]
locale: "en"
slug: "koolshare-bypass-router-configuration"
sourceId: "post-d91b0f66f609f5f6"
translationKey: "post-d91b0f66f609f5f6"
generated: true
draft: false
---
## Koolshare Version Issues

No version-related problems have appeared on hardware routers; they can generally install the Koolshare software center, and flashing ASUS routers is straightforward.

On x86 software routers, however, newer Koolshare releases may leave the store on a blank white screen. The setup described here uses an older version 16 release.

## Installing Third-Party Plugins

Before installation, connect to the command line over SSH, locate `/koolshare/scriptsks_tar_install.sh`, and remove the keyword-matching block shown below:

```
#detect_package(){
#       local TEST_WORD="$1"
#       local ILLEGAL_KEYWORDS="ss|ssr|shadowsocks|shadowsocksr|v2ray|trojan|clash|wireguard|koolss|brook"
#       local KEY_MATCH=$(echo "${TEST_WORD}" | grep -Eo "$ILLEGAL_KEYWORDS")

#       if [ -n "$KEY_MATCH" ]; then
#               echo_date =======================================================
#               echo_date "...........................${soft_name} ..........................."
#               echo_date ".....................koolshare............................................."
#               echo_date ".............................."
#               echo_date =======================================================
#               clean
#               exit 1
#       fi
#}
```

The ellipsis in the excerpt replaces a Chinese message that `vim` displayed as garbled text. Search for `koolshare` to locate this detection block.

Alternatively, upload the offline package that removes the restriction: remove\_restrictions.tar.gz

### Koolclash Issues

The KoolClash [usage guide](https://koolclash.js.org/#/usage?id=%e5%90%af%e5%8a%a8-clash) notes that its `yaml` configuration must be edited manually in a terminal; Clash itself does not provide that editing interface.

It has two projects:

- Source project:[link removed]
- New project:[link removed]

The tool from the new project is now in use, which is more comprehensive and visually appealing.
