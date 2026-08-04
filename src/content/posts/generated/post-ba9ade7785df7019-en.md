---
title: "Deploying Web SSH with Sshwifty"
date: "2022-10-23"
description: "A concise Sshwifty deployment workflow using a self-signed certificate and Docker."
tags: ["web-ssh","sshwifty","docker"]
categories: ["Systems"]
locale: "en"
slug: "sshwifty-web-ssh-deployment"
sourceId: "post-ba9ade7785df7019"
translationKey: "post-ba9ade7785df7019"
generated: true
draft: false
---
# Web SSH Deployment Process

## Generate a Key Pair

Run the following command over SSH after changing to the target directory. It generates a public-key certificate and a private-key file in the current directory.
`openssl req \ -newkey rsa:4096 -nodes -keyout domain.key -x509 -days 90 -out domain.crt`

## Deploy with Docker

`docker run --detach \ --restart always \ --publish 8182:8182 \ --env SSHWIFTY_DOCKER_TLSCERT="$(cat domain.crt)" \ --env SSHWIFTY_DOCKER_TLSCERTKEY="$(cat domain.key)" \ --name sshwifty \ niruix/sshwifty:latest`

## Potential Issues

- The certificate will expire. If you cannot access the page after a period of time, you need to reissue it.
- Access the service at <https://x.x.x.x:8182/>.
- Chrome does not trust self-signed certificates. Even after opening the page's details, it may offer no option to proceed. In that case, click a blank area of the page and type `thisisunsafe` directly on the keyboard; there is no input field. The page will refresh and open automatically.
