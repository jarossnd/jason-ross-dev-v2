---
title: Jason's VS Code Configuration in 2022
date: "2022-05-06"
description: "My VS Code theme, extensions and settings in 2022."
tags: ['vs-code']
---

## Overview

In this article I list my favorite VS Code theme, extensions and other settings I use. I also keep track of my latest VS Code settings [here](https://github.com/jarossnd/windows-config/blob/main/vscode.md).

## Theme

🔥 Cobalt2 Theme Official by Wes Bos 

## Extensions

- Auto Rename Tag
- C/C++
- Code Spell Checker
- ESLint
- GitHub Pull Requests and Issues
- GraphQL
- Hex Editor
- hexdump for VSCode
- Markdown All in One
- Markdown Preview Enhanced
- PowerShell
- vscode-styled-components

## Settings

```json
{
    "workbench.colorTheme": "Cobalt2",
    "security.workspace.trust.untrustedFiles": "open",
    "editor.fontSize": 14,
    "editor.fontFamily": "Consolas, 'Courier New', monospace",
    "files.exclude": {
        "**/.git": true,
        "**/.svn": true,
        "**/.hg": true,
        "**/CVS": true,
        "**/.DS_Store": true,
        "**/Thumbs.db": true
    }
}
```