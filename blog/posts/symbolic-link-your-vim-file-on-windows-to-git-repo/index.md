---
title: Symbolic link your Vim config file on windows to your Git repo
date: "2022-10-07"
description: "If you store your Windows Vim config file in your Git repro, symbolic link it so you don't have to manually copy!"
tags: ['vim']
---

## Overview

On my Windows machine, my Vim config is stored here: `~\AppData\Local\nvim\init.vim`.

However, I keep my Vim init file in a Git repro so I have access to it on multiple machines. My local git repo is located here: `~\repos\windows-config\nvim\init.vim`.

Whenever I do a Git `pull` to update my repo, I would have to manually copy my init.vim file from my Git repo to my home directory. One way around this would be to use a PowerShell or Batch file to copy the file for me. However, this is still to much work.

There is a Command Prompt (cmd) command called `mklink` to create a symbolic link. The symbolic link will be created created here `~\AppData\Local\nvim\init.vim` and point to `~\repos\windows-config\nvim\init.vim`. This way I never have to manually copy the file again!

The `mklink` only works in Command Prompt. Windows PowerShell will not be able to find this command without some configuration. Here is how I created a symbolic link:

Command:
`
mklink "C:\Users\<profile>\AppData\Local\nvim\init.vim" "C:\Users\<profile>\repos\windows-config\nvim\init.vim"
`

Output:
`symbolic link created for C:\Users\<profile>\AppData\Local\nvim\init.vim <<===>> C:\Users\<profile>\repos\windows-config\nvim\init.vim`

When running a DIR command against `C:\Users\<profile>\AppData\Local\nvim`, you will see SYMLINK:

```text
C:\Users\<profile>\AppData\Local\nvim>dir
 Volume in drive C has no label.
 Volume Serial Number is <S/N>

 Directory of C:\Users\<profile>\AppData\Local\nvim

10/07/2022  09:39 AM    <DIR>          .
10/07/2022  07:07 AM    <DIR>          ..
10/03/2022  09:15 AM    <DIR>          autoload
10/07/2022  09:39 AM    <SYMLINK>      init.vim [C:\Users\<profile>\repos\windows-config\nvim\init.vim]
10/06/2022  03:15 PM             2,126 init.vim.bak
10/07/2022  09:13 AM             2,130 init.vim~
10/03/2022  09:16 AM    <DIR>          plugged
               3 File(s)          4,256 bytes
               4 Dir(s)  52,845,723,648 bytes free
```