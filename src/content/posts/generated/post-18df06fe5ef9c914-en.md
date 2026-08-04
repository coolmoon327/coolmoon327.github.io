---
title: "Installing Plugins on Nintendo Switch Atmosphere"
date: "2022-10-23"
description: "A short guide to installing standard and overlay plugins on newer Atmosphere releases."
tags: ["nintendo-switch","atmosphere"]
categories: ["Technical Notes"]
locale: "en"
slug: "nintendo-switch-atmosphere-plugins"
sourceId: "post-18df06fe5ef9c914"
translationKey: "post-18df06fe5ef9c914"
generated: true
draft: false
---
# Installing Plugins

​ For most plugins, simply copy the `bro` file to the `switch` folder. Some plugins also require files under `atmosphere/contents`.

​ To use overlays, install `nx-ovlloader` and `ovlmenu`, then place the relevant overlay plugin in `switch/.overlays`.

​ Many plugin guides say to place files in the `titles` folder under `atmosphere`, but newer Atmosphere releases do not have that folder. Testing indicates that the contents intended for `titles` should instead be placed under `atmosphere/contents`.

​ For cheat-code plugins, see this [blog post](https://gbatemp.net/threads/cheat-codes-ams-and-sx-os-add-and-request.520293/).
