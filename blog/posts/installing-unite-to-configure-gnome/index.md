---
title: Installing Unite to Configure Gnome
date: "2026-01-17"
description: "Here are the steps I used to intall Unite on Arch Linux to configure Gnome."
tags: ['gnome', 'arch-linux']
---

## GNOME – Install & Configure Unite Extension (Arch Linux)

### 1. Install AUR Helper (yay)

```bash
sudo pacman -S --needed git base-devel
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
```

This rebuilds yay against your current system libraries so it can run normally.


### 2. Install Unite from AUR

```bash
yay -S gnome-shell-extension-unite
```



The extension installs to:

```swift
/usr/share/gnome-shell/extensions/unite@hardpixel.eu
```

### 3. Restart GNOME Shell

Because GNOME on Wayland cannot reload the shell using `Alt + F2 → r`, you must:

Log out → Log back in

This allows GNOME to detect new system-wide extensions.

### 4. Verify Unite Installed

```bash
gnome-extensions list
```

```css
unite@hardpixel.eu
```

### 5. Enable the Unite Extension

```bash
gnome-extensions enable unite@hardpixel.eu
```

### 6. Open Unite Preferences (Settings)

```bash
gnome-extensions prefs unite@hardpixel.eu
```

### 7. Optional: Install GNOME Extensions App (GUI)

```bash
sudo pacman -S gnome-shell-extensions gnome-shell-extension-appindicator
```