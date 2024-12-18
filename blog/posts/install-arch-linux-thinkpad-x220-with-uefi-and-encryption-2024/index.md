---
title: Install Arch Linux on a ThinkPad x220 with UEFI and Encryption
date: "2024-12-18"
description: "In this post I am installing Arch Linux on my ThinkPad x220 using UEFI and disk encryption. This article contains all steps from creating the installation media, paritioning the disk, and installing Arch Linux."
tags: ['linux', 'arch-linux', 'thinkpad']
---

## Overview

I've installed Arch Linux hundreds of times, but I figured I would do a thorough documentation update on this again. I don’t think I have done a guide using both UEFI mode and disk encryption, so I am going to do that here. The hardware I am using is a ThinkPad x220. Always refer to the official Arch Linux documentation for updates and if you are stuck. Enjoy!

## Downloading and Verifying Arch Linux

Head over to https://archlinux.org and click on Download to download the ISO from BitTorrent or a HTTP mirror. It is currently December 2024 as I am writing this article, so I am going to download archlinux-2024.12.01-x86_64.iso.

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

Power on the ThinkPad then find and press the blue ThinkVantage button. The laptop will beep once and then present a menu with options:

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

Navigate to the Startup tab then arrow down to UEFI/Legacy Boot and press your enter key to change the option to UEFI Only. Press enter to confirm and then F10 to save and exit the BIOS. Turn off the machine.

Insert your bootable USB drive and turn the machine on. Press the blue ThinkVantage button again and this time we will press F12 to choose a temporary setup device which will be the bootable USB drive you imaged in the previous section.

```
Arch Linux install medium (x86_64, UEFI)
Arch Linux install medium (x86_64, UEFI) with speech
Memtest86+
EFI Shell
Boot Into Firmware Interface
```

## Verify the Boot Mode

Run the following `ls` command to ensure that our system is detecting UEFI. If the directory does not exist the system may not be booted in UEFI mode. After running the command below, you should get back a bunch of text containing GUIDs.

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

### Wireless

We will use `iwctl` which is the internet wireless control utility to connect to the internet over wifi.

```shellsession
root@archiso ~ # iwctl
```

Run the command below to find your wireless network adapter and note the name of it. As you can see below, the name of mine is wlan0.

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

Now we will scan for wireless networks. Make sure to replace wlan0 with the actual name of your wireless adapter based on the above output.

```shellsession
[iwd]# station wlan0 scan
```

Once we are done scanning, we will now list the wireless networks.

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

Connect to the Wifi network you want to use by using `station name connect <SSID>`. I am going to connect to WIFI_NAME_03.

```shellsession
[iwd]# station wlan0 connect WIFI_NAME_03
```

And the passphrase if your wifi network has one.

```text
Type the network passphrase for WIFI_NAME_03 psk.
Passphrase: *****************
```

Exit the iwctl utility. 

```shellsession
[iwd]# exit
```

Run the ping utility command to confirm you are getting a response from a web server.

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

I am going to run `lsblk` which will list block devices so we can see storage devices and their partitions.

```shellsession
$ lsblk
```

This particular SSD had Arch Linux installed previously which is why some of the drives already have partitions. Devices with the name of rom, loop or airootfs can be ignored. The sdb drive is my flashdrive which contains the Arch Linux installation media. I know that because of the size. That leaves sda which is my SSD and that is what I am going to configure. Your device name may be different.

```text
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
loop0    7:0    0   535M  1 loop /run/archiso/sfs/airootfs
sda      8:0    0 931.5G  0 disk
├─sda1   8:1    0     4G  0 part /run/archiso/bootmnt
└─sda2   8:2    0 927.5G  0 part
sdb      8:16   1  28.7G  0 disk
└─sda2   8:17   1  28.7G  0 part
```

I am going to create two partitions on the sda drive. Partition number 1 will be our boot partition and partition number 2 will contain our LUKS2 encrypted partition containing root, swap, and our home directly in their own logical volumes.

The utility that will be used to manage our disk partitions is called `fdisk`. Run the `fdisk` utility below and pass along the name of the drive you will be using for the Arch Linux install.

```shellsession
$ fdisk /dev/sda
```

```text
Welcome to fdisk (util-linux 2.40.2).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

Command(m for help):
```

We will type `g` into the `fdisk` utility to create a new empty GPT (GUID Partition Table) partition table.

```text
Command (m for help): g
Created a new GPT disklabel (GUID: C3336B91-E685-447F-90BA-BFE9CB5863C5).
The device contains 'dos' signature and it will be removed by a write command. See fdisk(8) man page and --wipe option for more details.
```

Now type `n` to create a new partition. The partition number will be `1`. Leave the first section as the default 2048. Since this is going to be our boot partition, we only need 512 MB of space.

```text
Command (m for help): n
Partition number (1-128, default 1): 1
First section (2048-1953525134, default 2048): 
Last sector, +/-sectors or +/-size{K,M,G,T,P} (2024-1953525134), default 1953523711): +512 MB

Created a new partition 1 of type 'Linux filesystem' and of size 488 MiB.
```

Change the type of the partition to EFI System by typing in `t` and then `1`.

```text
Command (m for help) t
Selected partition 1
Partition type or alias (type L to list all): 1
Changed type of partition 'Linux filesystem' to 'EFI System'.
```

Create the second partition. After typing `n` leave the first section to the default and the last sector to the default to use the rest of the drive space.

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

We are going to encrypt the second partition using the `cryptsetup` utility. The second partition is where our root partition and home directory will be stored. We don't want to encrypt partition 1 otherwise the machine won't boot.

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

Create a physical volume using `pvcreate`:

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

Next, we will create 3 logical volumes for root, swap, and home:

```shellsession
root@archiso ~ # lvcreate -L 50G vg0 -n root
root@archiso ~ # lvcreate -L 8G vg0 -n swap
root@archiso ~ # lvcreate -L 872G vg0 -n home
```

Run `lsblk` to confirm the volumes have been created successfully:

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

For our boot partition we need to create the FAT (File Allocation Table) filesystem.

```shellsession
root@archiso ~ # mkfs.fat -F32 /dev/sda1
```

Once the above command is finished running you will get a message similar to the following:

```text
mkfs.fat 4.2 (2021-01-31)
```

Next we are going to create our Linux filesystem.

```shellsession
root@archiso ~ # mkfs.ext4 /dev/vg0/root
root@archiso ~ # mkfs.ext4 /dev/vg0/home
```

Now we are going to create swap which is essentially an extension of the system's physical memory when the RAM is full.

```shellsession
root@archiso ~ # mkswap /dev/vg0/swap
```

Turning swap on:

```shellsession
root@archiso ~ # swapon /dev/vg0/swap
```

## Mounting the File System

Next we are going to mount the file system so we can start the installation in the next sections.

```shellsession
root@archiso ~ # mount /dev/vg0/root /mnt
```

```shellsession
root@archiso ~ # mkdir /mnt/boot
root@archiso ~ # mount /dev/sda1 /mnt/boot
```

## Select the Mirrors

The installation media includes a mirror list located at /etc/pacman.d/mirrorlist. If you are using a relatively recent ISO image and are in the United States, updating the mirror list is generally unnecessary. However, if you are based in another region, possess outdated installation media, or encounter issues with mirrors, it is advisable to update the mirror list. Arch Linux offers an online utility for generating a mirror list available here: https://archlinux.org/mirrorlist/.

In the following section, I will demonstrate how to update the mirror list by downloading the latest list using CURL, selecting the top five mirrors, and proceeding to update the mirror list. Although I am located in the United States, users in other countries should generate a region-specific mirror list using the [Pacman Mirrorlist Generator](https://archlinux.org/mirrorlist/) tool.

Sync the pacman repository:

```shellsession
root@archiso ~ # pacman -Syy
```

Download the pacman-contrib package which will include the rankmirrors utility. The rankmirrors utility will rank the mirrors by their connection and opening speed which will give us the best download results when we go to download packages.

```shellsession
root@archiso ~ # pacman -S pacman-contrib
```

Download the mirror list, pass it to rankmirrors to find the top 5 fastest, then overwrite the existing mirror list. If you have a typo and do not do this correctly, you might overwrite the existing mirrorlist file with blank data and you will not be able to install any packages at all. You might want to back up /etc/pacman.d/mirrorlist or see what is in it prior to running the below command.

```shellsession
root@archiso ~ # curl -s "https://archlinux.org/mirrorlist/?country=US&protocol=https&ip_version=4&use_mirror_status=on" | sed -e 's/^#Server/Server/' -e '/^#/d' | rankmirrors -n 5 - > /etc/pacman.d/mirrorlist
```

## Install Packages

Start the installation of our packages. I am just going to go with the most needed as other packages can be installed at a later time.

```shellsession
root@archiso ~ # pacstrap /mnt base linux linux-firmware sudo vim networkmanager cryptsetup lvm2 efibootmgr intel-ucode
```

Note: I use vim so if you do not know how to use vim and want to use something like nano for the result of this article, make sure to include nano in your list of packages above.

## Fstab

Next, we will generate the fstab file which contains information about the filesystem and how it should be mounted and managed. Generate the `/etc/fstab` file by:

```shellsession
root@archiso ~ # genfstab -U /mnt >> /mnt/etc/fstab
```

## Chroot

Next, we will change root into the new system we just installed.

```shellsession
root@archiso ~ # arch-chroot /mnt
```

## Time

List available time zones to choose from:

```shellsession
[root@archiso /]# timedatectl list-timezones
```

Set the time zone of your choosing:

```shellsession
[root@archiso /]# timedatectl set-timezone US/Central
```

Run `hwclock` to generate /etc/adjtime:

```shellsession
[root@archiso /]# hwclock --systohc
```

## Localization

Edit /etc/locale.gen and uncomment en_US.UTF-8 UTF-8. You uncomment by remove the hashtag (#) in front of the locale. If you are not in the US, choose your appropriate locale.

```shellsession
[root@archiso /]# vim /etc/locale.gen
```

If you do not know how to use vim:

- j = down
- k = up
- h = left
- l = right

- i = insert mode so you can modify text
- esc = exit insert mode
- :w = write
- :q = quit

Generate the locales:

```shellsession
[root@archiso /]# locale-gen
```

```text
Generating locales...
  en_US.UTF-8... done
Generation complete.
```

## Network Configuration

Create your hostname file and set your hostname. I am going to set my host name to zeus. Replace zeus with whatever you would like to call your machine.

```shellsession
[root@archiso /]# echo zeus > /etc/hostname
```

Edit the host file using vim or nano:

```shellsession
[root@archiso /]# vim /etc/hosts
```

Next we will update `/etc/hosts` with the following:

```text
127.0.0.1	localhost
::1	    	localhost
127.0.1.1	zeus.localdomain	zeus
```

Enable the network manager services

```shellsession
systemctl enable NetworkManager
```

## Initramfs

We are going to edit mkinitcpio.conf. `mkinitcpio` is a utility to generate an initial ramdisk environment, also known as an initramfs (initial RAM filesystem). The purpose here is for booting the Linux kernel and preparing the system to mount the root filesystem. Initramfs will contain all the necessary files, drivers, and tools needed to initialize the system and moujnt the root filesystem before handing over to the operating system.

```shellsession
[root@archiso /]# vim /etc/mkinitcpio.conf
```

Find the line that starts with HOOKS (around line 55). It shoud look like this:

```text
HOOKS=(base udev autodetect microcode modconf kms keyboard keymap consolefont block filesystems fsck)
```

We need to add LVM (Logical Volume Manager) and also make sure that keyboard is before filesystem so that we can decrypt the partition with our passphrase. Update this line to the following:

```text
HOOKS=(base udev autodetect keyboard keymap modconf block encrypt lvm2 filesystems fsck)
```

Recreate the initramfs image:

```shellsession
[root@archiso /]# mkinitcpio -P
```

## Boot Loader

This next section can be a little difficult as there is a lot of typing but just remember we are just about to the finish line! Do not rush this section. Make sure there you have no typos otherwise the system will not boot. We are essentially going to create a boot loader script but first we need to find the UUID of the encrypted partition.

```shellsession
[root@archiso /]# vim /usr/local/sbin/mkefibootentry
```

Add the text below. The `blkid` command will grab the UUID for us (which the value is a long GUID) so that we don't have to manually type it. It will save the UUID in a variable called PARTUUID which will be used later in the script. Again, make sure there are no typos here!

```text
#!/bin/sh

PARTUUID=`blkid /dev/sda2 -s PARTUUID -o value`

efibootmgr \
  --disk /dev/sda --part 1 \
  --create --label "Arch Linux" \
  --loader /vmlinuz-linux \
  --unicode 'cryptdevice=PARTUUID='$PARTUUID':cryptlvm root=/dev/vg0/root rw initrd=\intel-ucode.img initrd=\initramfs-linux.img' \
  --verbose 
```

Make the script execuable my running chmod:

```shellsession
[root@archiso /]# chmod u+x /usr/local/sbin/mkefibootentry
```

Create the UEFI boot entry:

```shellsession
[root@archiso /]# mkefibootentry
```

## Root password

Set the root password by running:

```shellsession
[root@archiso /]# passwd
```

## Reboot

 Exit, unmount, and reboot:

 ```shellsession
exit
```

```shellsession
umount -R /mnt
```

```shellsession
reboot
```
