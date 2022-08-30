---
title: Authenticating to GitHub in the Terminal in Arch Linux
date: "2022-04-07"
description: "How to authenticate to GitHub in the Terminal in Arch Linux so you can make changes to your private repos!"
tags: ["git", "linux", "linux-config"]
---

## Overview

This is a quick article on how to easily authenticate  to GitHub in a terminal on Arch Linux.

## Prerequisites

This article assumes you already have Git installed. If not, run:

```
sudo pacman -S git
```

## Authenticate to GitHub

We will use the GitHub Command Line Interface (CLI) to authenticate. We must first install `github-cli` from the AUR:

```
sudo pacman -S github-cli
```

I always create my repos folder in my home folder:

```
mkdir ~/repos
cd ~/repos
```

Now run:

```
gh auth login
```

and choose

```
> GitHub.com
```

You will then be prompted to copy a code and open your browser window where you will type in your GitHub credentials. Once you are logged in, you will paste the code you received from the terminal into the browser. Once done, click on authorize and then that is it!
