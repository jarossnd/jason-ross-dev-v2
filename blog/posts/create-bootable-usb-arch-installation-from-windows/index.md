---
title: Create a Bootable USB Arch Installation from Windows
date: "2024-02-25"
description: "Here are my instructions on how to create a bootable USB drive containing the Arch installation from Windows."
tags: ['linux', 'arch-linux']
---

These steps are for anyone wanting to install Arch linux from a bootable USB flash drive and only have access to a Windows machine.

1. Download [Rufus](https://rufus.ie)
2. Download the [Arch Linux](https://archlinux.org) iso
3. Insert a USB drive that can be overwritten
4. Open the Rufus executable
5. Device = You USB flash drive
6. Boot selection = Click SELECT and browse to the Arch Linux iso image you downloaded
7. Click Start

![Rufus Screenshot Settings](assets/rufus-arch-linux-screenshot-01.png)

8. Keep Write in "ISO Image mode (Recommended) and click OK.

![Rufus Screenshot Warning](assets/rufus-arch-linux-screenshot-02.png)

9. Click YES, to download the newest version of Syslinux

![Rufus Screenshot Syslinux](assets/rufus-arch-linux-screenshot-03.png)

10. You will be warned about all data on the USB flash drive will be erased. Click OK if you have made sure you don't need the existing data.

![Rufus Screenshot Data Destroyed](assets/rufus-arch-linux-screenshot-04.png)

11. Wait for the ISO files to be copied

![Rufus Screenshot ISO Data Copy](assets/rufus-arch-linux-screenshot-05.png)

12. Once the copy is complete, the status will say Ready. Click on CLOSE and safely remove the USB drive from your machine.