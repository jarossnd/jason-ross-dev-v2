---
title: "Git switch branch filename too long error"
date: "2026-04-23"
description: "How I recently solved an issue when switching branching using Git and received filename too long error message"
tags: ["git"]
---

## Overview

I created a new branch and when switching to the new branch I received an error saying "Filename too long".

```powershell
git branch new-branch

git switch new-branch

error: cannot stat 'PII': Filename too long
error: cannot stat 'PII': Filename too long
error: cannot stat 'PII': Filename too long
error: cannot stat 'PII': Filename too long
error: The following untracked working tree files would be overwritten by checkout:
```

## Resolution

Open Terminal as an Administrator and run the following:

```powershell
git config --global core.longpaths true
```