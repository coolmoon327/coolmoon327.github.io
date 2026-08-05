---
title: "A Researcher’s macOS Workstation: Tools, Automation, and Trade-offs"
date: "2022-10-23"
math: false
description: "A curated macOS workstation for research, writing, and development, with emphasis on durable workflows rather than app collecting."
tags: ["macos", "research-workflow", "developer-tools", "automation"]
categories: ["Research Practice"]
locale: "en"
slug: "researcher-macos-workstation"
sourceId: "post-29b4fdd03f3a2c09"
translationKey: "post-29b4fdd03f3a2c09"
generated: true
draft: false
---

A useful research workstation is not the Mac with the longest application list. It is the one that can lose a disk, move to a new machine, or connect to a compute server without losing the provenance of the work. My current rule is simple: use the operating system for fundamentals, keep the toolchain declarative, and install a specialist app only when it owns a clearly defined job.

## Design the workstation around failure

### Files: native first

Finder already handles ordinary file organization and movement. Within a volume, dragging moves an item; when crossing volumes, holding Command while dragging explicitly requests a move. That behavior is documented in Apple’s [keyboard shortcuts for file management](https://support.apple.com/en-us/102650). I therefore avoid installing a Finder replacement merely to imitate Windows-style cut and paste.

The more important decision is the project layout. Each research project gets one directory with source, data documentation, scripts, figures, and a short build note. Large datasets may live elsewhere, but the project records where they came from, how their integrity is checked, and how results are regenerated.

### Encryption and recovery

Enable [FileVault](https://support.apple.com/guide/mac-help/protect-data-on-your-mac-with-filevault-mh11785/mac) and store the recovery method somewhere other than the startup disk. Encryption protects a lost computer; it does not replace a backup.

Use encrypted [Time Machine backups](https://support.apple.com/en-us/104984) for routine recovery, then keep an independent copy of irreplaceable manuscripts, source data, and credentials. A backup is credible only after a test restore: recover a small project to a temporary location and verify that its source, bibliography, figures, and build instructions are complete.

### Interchange disks

For a Mac-only working disk, use a native format appropriate to the macOS version. Use ExFAT only when a removable disk must be writable by both macOS and Windows; Apple identifies it as a [Windows-compatible format](https://support.apple.com/en-us/101830). Treat such a disk as an interchange medium, not the sole archive, because portability is a different requirement from backup integrity.

## Make the toolchain rebuildable

[Homebrew Bundle](https://docs.brew.sh/Brew-Bundle-and-Brewfile) turns a personal application inventory into a reviewable `Brewfile`. A compact research profile might begin like this:

```ruby
brew "git"
brew "ripgrep"
brew "pandoc"
cask "visual-studio-code"
cask "iina"
```

Restore or check it with one command:

```bash
brew bundle check || brew bundle
```

Commit the `Brewfile` with workstation notes, but do not mistake it for an exact environment lock. Homebrew is a rolling-release package manager, and its own documentation explicitly says that Brewfile has no lock-file mechanism for pinning arbitrary versions. Reproducible experiments still need project-level environments, version records, containers, or archival build images as appropriate.

## Split local editing from remote execution

Use [VS Code Profiles](https://code.visualstudio.com/docs/configure/profiles) to keep research writing, systems work, and software development from accumulating one shared extension set. A profile is a convenience layer, not a substitute for configuration checked into each project.

Open unfamiliar repositories in [Workspace Trust restricted mode](https://code.visualstudio.com/docs/editing/workspaces/workspace-trust) until tasks, settings, and extensions have been reviewed. For compute-heavy work, [Remote - SSH](https://code.visualstudio.com/docs/remote/ssh) keeps the editor local while commands and remote extensions run beside the data. SSH configuration should contain host aliases and identity references—not passwords—and project secrets should stay outside the repository.

## Give optional apps one clear job

- [IINA](https://github.com/iina/iina) is a focused, open-source media player; it is useful for inspecting recordings and demonstrations, not for managing research assets.
- [Alfred](https://www.alfredapp.com/) can reduce navigation friction through search and deliberate workflows. Automate repeated decisions, not opaque chains that become impossible to audit.
- [Parallels Desktop](https://www.parallels.com/products/desktop/resources/) is a compatibility boundary for a genuinely Windows-only application or device tool. Verify the current host-chip, guest-OS, licensing, and hardware-passthrough constraints before depending on it; a virtual machine is neither a backup nor a reproducible scientific environment by itself.

## A quarterly recovery drill

Every few months, I ask whether the workstation can answer five questions without relying on memory:

1. Can a lost Mac be replaced from tested backups?
2. Can the essential applications be reconstructed from a reviewed inventory?
3. Can each active paper build from a clean checkout?
4. Can remote work continue without copying sensitive data into ad-hoc locations?
5. Can an obsolete app be removed without breaking a hidden dependency?

That checklist is a better measure of a research workstation than the number of icons in the Applications folder.
