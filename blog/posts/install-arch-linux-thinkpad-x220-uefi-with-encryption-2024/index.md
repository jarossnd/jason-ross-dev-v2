---
title: Install Arch Linux on a Thinkpad x220 UEFI with Encryption
date: "2024-12-16"
description: "In this post I am installing Arch Linux on my Thinkpad x220 using UEFI and disk encryption."
tags: ['linux']
---

## Overview

I've installed Arch Linux hundreds of times but I figured I would do a thorough documentation update on this again. I don't think I have done a guide using both UEFI mode and disk encryption so I am going to do that here. The hardware I am using is a Thinkpad x220. Always refer to the official Arch Linux documenation for updates and if you are stuck. Enjoy!

## Downloading and Verifying Arch Linux

Head over to https://archlinux.org and click on Download to download the ISO from BitTorrent or a HTTP mirror. It is currently December 2024 as I am writing this article so I am going to download archlinux-2024.12.01-x86_64.iso.

### Verifying on Linux or Mac

```
gpg --keyserver-options auto-key-retrieve --verify archlinux-2024.12.01-x86_64.iso.sig
```

### Verifying on Windows

Since I am downloading Arch from a Windows machine, I am going to verify the download using Gpg4win which can be found [here](https://www.gnupg.org/download/index.html).

```
C:\Users\JasonRoss\Downloads>gpg --keyserver-options auto-key-retrieve --verify archlinux-2024.12.01-x86_64.iso.sig
gpg: assuming signed data in 'archlinux-2024.12.01-x86_64.iso'
gpg: Signature made 11/30/24 23:50:47 Central Standard Time
gpg:                using EDDSA key 3E80CA1A8B89F69CBA57D98A76A5EF9054449A5C
gpg:                issuer "pierre@archlinux.org"
gpg: C:\\Users\\JasonRoss\\AppData\\Roaming\\gnupg\\trustdb.gpg: trustdb created
gpg: key 7F2D434B9741E8AC: public key "Pierre Schmitz <pierre@archlinux.org>" imported
gpg: Total number processed: 1
gpg:               imported: 1
gpg: no ultimately trusted keys found
gpg: key 76A5EF9054449A5C: public key "Pierre Schmitz <pierre@archlinux.org>" imported
gpg: Total number processed: 1
gpg:               imported: 1
gpg: Good signature from "Pierre Schmitz <pierre@archlinux.org>" [unknown]
gpg:                 aka "Pierre Schmitz <pierre@archlinux.de>" [unknown]
gpg: WARNING: The key's User ID is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
Primary key fingerprint: 3E80 CA1A 8B89 F69C BA57  D98A 76A5 EF90 5444 9A5C
```

If you are on an existing Arch installation you can use run:

```
pacman-key -v archlinux-2024.12.01-x86_64.iso.sig
```

## Creating a Bootable USB with Arch Linux

On Linux you can use the `dd` command:

```
dd bs=4M if=/path/to/archlinux.iso of=/dev/sdx status=progress && sync
```

On Windows, you can use Rufus and I wrote an article [here](https://www.jasonross.dev/create-bootable-usb-arch-installation-from-windows/) with instructinos.

## Boot into the Arch USB Live Environment

Turn on the Thinkpad then find and press the blue ThinkVantage button. The laptop will beep once and then present a menu with options:

```
Start up Interrupt Menu
Press one of the following keys to continue

ESC to resume normal startup
F1  to enter the BIOS Setup Utility
F12 to choose a temporary startup device
<CTRL-P> to enter the Management Engine setup screen

Press ENTER to pause ...
```

Press F1 to enter the BIOS Setup Utility.

Navigate to Startup then arrow down to UEFI/Legacy Boot and press your enter key to change the option to UEFI Only. Press enter to confirm and then F10 to save and exit the BIOS. Turn off the machine.

Plug in the bootable USB drive and turn the machine on again. Press the blue ThinkVantage button again and this time we will press F12 to choose a temporary setup device which will be the bootable USB drive you imaged in the previous section.

```
Arch Linux install medium (x86_64, UEFI)
Arch Linux install medium (x86_64, UEFI) with speech
Memtest86+
EFI Shell
Boot Into Firmware Interface
```

## Verify the Boot Mode

Run the following ls command to ensure that our system is detecting UEFI and we will run the below command to confirm that the directory does exist. If it does not exist, the system may not be booted in UEFI mode. After running the below command, you should get back a bunch of text containing GUIDs.

```bash
ls /sys/firmware/efi/efivars
```

## Set the Keyboard Layout

The default keyboard layout is US so skip this step if you are in the United States. You can find the available keyboard layouts by running the following:

```
localectl list-keymaps
```

Once you have found your keybaord, run the loadkeys command to set your keyboard layout:

```
loadkeys de-latin1
```
## Internet Connection

I typically don't need to do anything here as I am connected via ethernet cable prior to booting up the machine. You will need an internet connection to download packages from the internet. If you want to confirm your network connection run:

```
ip link
```

Run the ping utility command to confirm you are getting a response from a webserver:

```
ping archlinux.org -c 5
```

If necessary, use `iwctl` to setup your wireless connection.

## System Clock

Update the system clock by running:

```
timedatectl set-ntp true
```

This will set your date and time to update remotely using network time protocol.







## Partition the Drive

5. cfdisk

6. Create EFI partition:
    - New
    - 300M
    - Type
    - EFI System
    - Write

7. Create `/root` partition:
    - Select free space
    - New
    - 30G
    - Linux filesystem
    - Write

8. Create `/home` partition:
    - Select free space
    - New
    - Use rest of the space
    - Linux filesystem
    - Write

9. Create the filesystems:
    - `fdisk -l` to view the partitions for the next step
    - `mkfs.fat -F32 /dev/sda1`
    - `mkfs.ext4 /dev/sda2`
    - `mkfs.ext4 /dev/sda3`
    - 

10. Create the `/root` and `/home` directories:
    - `mount /dev/sda2 /mnt`
    - `mkdir /mnt/home`
    - `mount /dev/sda3 /mnt/home`



4. Go to [https://archlinux.org/mirrorlist](https://archlinux.org/mirrorlist) and find the closest mirror that supports HTTPS:
    - Add the mirrors on top of the `/etc/pacman.d/mirrorlist` file.
    - `Server = https://mirror.arizona.edu/archlinux/$repo/os/$arch` (United States)




11. Install Arch linux base packages:
    - Use the following if you want to include VIM:
    - `pacstrap -i /mnt base linux linux-firmware sudo vim`
    - Use the following if you want to also include Nano:
    - `pacstrap -i /mnt base linux linux-firmware sudo nano vim`

12. Generate the `/etc/fstab` file:
    - `genfstab -U -p /mnt >> /mnt/etc/fstab`

13. Chroot into installed system:
    - `arch-chroot /mnt`

14. Find available time zones:
    - `timedatectl list-timezones`
    
15. Set the timezone:
    - `ln -sf /usr/share/zoneinfo/America/Chicago /etc/localtime`
    - or `timedatectl set-timezone America/Chicago`

16. Update the Hardware clock:
    - `hwclock --systohc`

17. Set your hostname and configure hosts
    - `echo myhostname > /etc/hostname`
    - Update `/etc/hosts` with the following:

```
127.0.0.1	localhost
::1		localhost
127.0.1.1	myhostname.localdomain	myhostname
```

18. Set the root password
    - `passwd`

19. Let's enable the network
    - If you don't do this before your reboot you won't have internet connection
    - `pacman -S networkmanager`
    - `systemctl enable NetworkManager`

20. Install boot manager and other needed packages:
    - `pacman -S grub efibootmgr dosfstools openssh os-prober mtools linux-headers linux-lts linux-lts-headers`

21. Set locale:
    - `sed -i 's/#en_US.UTF-8/en_US.UTF-8/g' /etc/locale.gen` (uncomment en_US.UTF-8)
    - `locale-gen`

22. Enable root login via SSH:
    - `sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/g' /etc/ssh/sshd_config`
    - `systemctl enable sshd.service`
    - `passwd` (for changing the root password)

23. Create EFI boot directory:
    - `mkdir /boot/EFI`
    - `mount /dev/sda1 /boot/EFI`

24. Install GRUB on EFI mode:
    - `grub-install --target=x86_64-efi --bootloader-id=grub_uefi --recheck`

25. Setup locale for GRUB:
    - `cp /usr/share/locale/en\@quot/LC_MESSAGES/grub.mo /boot/grub/locale/en.mo`

26. Write GRUB config:
    - `grub-mkconfig -o /boot/grub/grub.cfg`

27. Create swap file:
    - `fallocate -l 2G /swapfile`
    - `chmod 600 /swapfile`
    - `mkswap /swapfile`
    - `echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab`

28. Exit, unmount and reboot:
    - `exit`
    - `umount -a`
    - `reboot`


Thanks for visiting!

