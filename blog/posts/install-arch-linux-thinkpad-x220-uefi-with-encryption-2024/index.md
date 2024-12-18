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

### Existing Arch installation

```
pacman-key -v archlinux-2024.12.01-x86_64.iso.sig
```

### Other Linux distriubtions

```
gpg --keyserver-options auto-key-retrieve --verify archlinux-2024.12.01-x86_64.iso.sig
```

### MacOS

I don't believe MacOS comes with gpg out of the box so I will install it with a package manager called Brew then run gpg:

```
brew install gnupg pinentry-mac
gpg --keyserver-options auto-key-retrieve --verify archlinux-2024.12.01-x86_64.iso.sig
```

### Windows

Windows does not come with gpg so we can download Gpg4win which can be found [here](https://www.gnupg.org/download/index.html).

```
gpg --keyserver-options auto-key-retrieve --verify archlinux-2024.12.01-x86_64.iso.sig
```

## Creating a Bootable USB with Arch Linux

On Linux you can use the `dd` command:

```
dd bs=4M if=/path/to/archlinux.iso of=/dev/sdx status=progress && sync
```

On Windows, you can use Rufus and I wrote an article [here](https://www.jasonross.dev/create-bootable-usb-arch-installation-from-windows/) with those instructions.

## Boot into the Arch USB Live Environment

Power on the Thinkpad then find and press the blue ThinkVantage button. The laptop will beep once and then present a menu with options:

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

```shellsession
root@archiso ~ # ls /sys/firmware/efi/efivars
```

## Set the Keyboard Layout

The default keyboard layout is US so skip this step if you are in the United States. You can find the available keyboard layouts by running the following:

```shellsession
root@archiso ~ # localectl list-keymaps
```

Once you have found your keybaord, run the loadkeys command to set your keyboard layout:

```shellsession
root@archiso ~ # loadkeys de-latin1
```

## Internet Connection

### Wired

I typically don't need to do anything here as I am connected via ethernet cable prior to booting up the machine. You will need an internet connection to download packages from the internet. If you want to confirm your network connection run:

```shellsession
root@archiso ~ # ip link
```

Run the ping utility command to confirm you are getting a response from a web server:

```shellsession
root@archiso ~ # ping archlinux.org -c 5
```

If necessary, use `iwctl` to setup your wireless connection.

### Wireless

```shellsession
root@archiso ~ # iwctl
```

```shellsession
[iwd]# device list
```

```text
                            Devices
-----------------------------------------------------------------
Name      Address           Powered        Adapter     Mode
-----------------------------------------------------------------
wlan0    00:00:00:00:00:00    on              phy0      station
```

```shellsession
[iwd]# station wlan0 scan
```

Next we will scan for Wifi networks

```shellsession
[iwd]# station wlan0 get-networks
```

```text
                      Available networks
-----------------------------------------------------------------
Network name                  Security                   Signal
-----------------------------------------------------------------
WIFI_NAME_01                   Open                       ****
WIFI_NAME_02                   8021x                      ****
WIFI_NAME_03                   psk                        ****
WIFI_NAME_04                   psk                        *
```

Connect to the Wifi network by using `station name connect <SSID>`. I am going to connect to WIFI_NAME_03:

```shellsession
[iwd]# station wlan0 connect WIFI_NAME_03
```
```text
Type the network passphrase for WIFI_NAME_03 psk.
Passphrase: *****************
```

Exit iwctl by 

```shellsession
[iwd]# exit
```

Run the ping utility command to confirm you are getting a response from a web server:

```shellsession
root@archiso ~ # ping archlinux.org -c 5
```

## System Clock

Update the system clock by running:

```shellsession
root@archiso ~ # timedatectl set-ntp true
```

This will set your date and time to update remotely using network time protocol.

## Partition the Drive

I am going to run lsblk which will list block devices so we can see storage devices and their partitions.

```shellsession
$ lsblk
```

This particular SSD had Arch Linux installed previously which is why some of the drives already have partitions. Devices with the name of rom, loop or airootfs can be ignored. sdb is my flashdrive which contains the Arch Linux installation media. That leaves sda which is my SSD and that is what I am going to configure. Your device name may be different.

```text
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
loop0    7:0    0   535M  1 loop /run/archiso/sfs/airootfs
sda      8:0    0 931.5G  0 disk
├─sda1   8:1    0     4G  0 part /run/archiso/bootmnt
└─sda2   8:2    0 927.5G  0 part
sdb      8:16   1  28.7G  0 disk
└─sda2   8:17   1  28.7G  0 part
```

I am going to create two partitions on the sda drive. Partition number 1 will be our boot partition and partition number 2 will contain our LUKS2 encrypted partition containing root, swap and our home directly in their own logical volumes.

```shellsession
$ fdisk /dev/sda
```

```text
Welcome to fdisk (util-linux 2.40.2).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

Command(m for help):
```

```text
Command (m for help): g
Created a new GPT disklabel (GUID: C3336B91-E685-447F-90BA-BFE9CB5863C5).
The device contains 'dos' signature and it will be removed by a write command. See fdisk(8) man page and --wipe option for more details.
```

```text
Command (m for help): n
Partition number (1-128, default 1): 1
First section (2048-1953525134, default 2048): 
Last sector, +/-sectors or +/-size{K,M,G,T,P} (2024-1953525134), default 1953523711): +512 MB

Created a new partition 1 of type 'Linux filesystem' and of size 488 MiB.
```

```text
Command (m for help) t
Selected partition 1
Partition type or alias (type L to list all): 1
Changed type of partition 'Linux filesystem' to 'EFI System'.
```

Creating the second partition:

```text
Command (m for help): n
Partition number (2-128, default 2): 2
First section (1001472-1953525134, default 1001472): 
Last sector, +/-sectors or +/-size{K,M,G,T,P} (1001472-1953525134), default 1953523711):

Created a new partition 2 of type 'Linux filesystem' and of size 931 GiB.
```

Press w to write our changes and quite from the fdisk utility.

```test
Command (m for help): w
The partition table has been altered.
Calling ioctl() to re-read partition table.
Syncing disks.
```

Run the lsblk utility to confirm the two partitions were created:

```shellsession
root@archiso ~ # lsblk /dev/sda
```

```text
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda      8:0    0 931.5G  0 disk
├─sda1   8:1    0   488M  0 part
└─sda2   8:2    0   931G  0 part
```

## Drive Encryption using LUKS

We are going to encrypt the second partition using the cryptsetup utility. The second partition is where our root partition and home directory will be stored. We don't want to encrypt partition 1 otherwise the machine won't boot.

```shellsession
root@archiso ~ # cryptsetup luksFormat /dev/sda2
```

```text
WARNING!
========
This will overwrite data on /dev/sda2 irrevocably.

Are you sure? (Type 'yes' in capital letters): YES
```

Next, you will create a passphrase that you will use to unencrypt the drive:

```text
Enter passphrase for /dev/sda2: 
Verify passphrase:
cryptsetup luksFormat /dev/sda2  19.57s user 0.64 system 25% cpu 1:19.05 total
```

## Creating Volumes

Unencrypt the drive we just encrypted so we can create our volumes:

```shellsession
root@archiso ~ # cryptsetup open /dev/sda2 cryptlvm
```

Enter your passphrase that you created earlier to encrypt the partition:

```text
Enter passphrase for /dev/sda2: 
Verify passphrase:
cryptsetup open /dev/sda2 cryptlvm  6.79s user 0.16s system 124% cpu 5.581 total
```

Create a physical volume using pvcreate:

```shellsession
root@archiso ~ # pvcreate /dev/mapper/cryptlvm
```

```text
Physical volume "/dev/mapper/cryptlvm" successfully created.
```

Create a volume group called vg0:

```shellsession
root@archiso ~ # vgcreate vg0 /dev/mapper/cryptlvm
```

```text
Volume group "vg0" successfully created
```

Next we will create 3 logical volumes for root, swap, and home:

```shellsession
root@archiso ~ # lvcreate -L 50G vg0 -n root
root@archiso ~ # lvcreate -L 8G vg0 -n swap
root@archiso ~ # lvcreate -L 872G vg0 -n home
```

Run lsblk to confirm the volumes have been created successfully:

```shellsession
root@archiso ~ # lsblk /dev/sda
```

```text
NAME               MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda                  8:0    0 931.5G  0 disk
├─sda1               8:1    0   488M  0 part
└─sda2               8:2    0   931G  0 part
  └─cryptlvm       254:0    0   931G  0 crypt 
    ├─vg0-root     254:1    0    50G  0 lvm   
    ├─vg0-swap     254:2    0     8G  0 lvm   
    └─vg0-home     254:3    0   872G  0 lvm
```

## Formatting the Partitions

```shellsession
root@archiso ~ # mkfs.fat -F32 /dev/sda1
```

```text
mkfs.fat 4.2 (2021-01-31)
```

```shellsession
root@archiso ~ # mkfs.ext4 /dev/vg0/root
root@archiso ~ # mkfs.ext4 /dev/vg0/home
```

```shellsession
root@archiso ~ # mkswap /dev/vg0/swap
```

```shellsession
root@archiso ~ # swapon /dev/vg0/swap
```

## Mounting the File System

```shellsession
root@archiso ~ # mount /dev/vg0/root /mnt
```

```shellsession
root@archiso ~ # mkdir /mnt/boot
root@archiso ~ # mount /dev/sda1 /mnt/boot
```

## Select the Mirrors

```shellsession
root@archiso ~ # pacman -Syy
```

```shellsession
root@archiso ~ # pacman -S pacman-contrib
```

```shellsession
root@archiso ~ # curl -s "https://www.archlinux.org/mirrorlist/?country=US&protocol=https&use_mirror_status=on" | sed -e 's/^#Server/Server/' -e '/^#/d' | rankmirrors -n 5 - > /etc/pacman.d/mirrorlist
```

## Install Packages

```shellsession
root@archiso ~ # $ pacstrap /mnt base linux linux-firmware neovim wpa_supplicant dhcpcd cryptsetup lvm2 efibootmgr intel-ucode

```



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

