---
title: Updating your Arch Keyring
date: "2022-06-04"
description: "I went to update my Arch system today but received errors. The solution was to update the Arch keyring."
tags: ["linux"]
---

I went to update an Arch based system today that was several months outdated. I received the following after running `sudo pacman -Syu`:

```
(237/237) checking keys in keyring
downloading required keys...
:: Import PGP key 0F65C7D881506130, "Maxime Gauduin <alucryd@archlinux.org>"? [Y/n]
(237/237) checking package integrity
error: libinih: key "95220BE99CE6FF778AE0DC670F65C7D881506130" is unknown
:: Import PGP key 95220BE99CE6FF778AE0DC670F65C7D881506130? [Y/n]
error: key "95220BE99CE6FF778AE0DC670F65C7D881506130" could not be looked up remotely
:: File /var/cache/pacman/pkg/libinih-55-2-x86_64.pkg.tar.zst is corrupted (invalid or corrupted package (PGP s
Do you want to delete it? [Y/n]
error: failed to commit transaction (invalid or corrupted package)
Errors occurred, no packages were upgraded.
```

I attempted to run `sudo pacman -Syu` again and received:

```
Total Download Size:      0.02 MiB
Total Installed Size:  2422.29 MiB
Net Upgrade Size:        -0.96 MiB

:: Proceed with installation? [Y/n]
:: Retrieving packages...
 libinih-55-2-x86_64
(237/237) checking keys in keyring
downloading required keys...
:: Import PGP key 0F65C7D881506130, "Maxime Gauduin <alucryd@archlinux.org>"? [Y/n] n
error: required key missing from keyring
error: failed to commit transaction (unexpected error)
Errors occurred, no packages were upgraded.
```

The solution to this problem is to update `archlinux-keyring`:

```bash
sudo pacman -S archlinux-keyring
```

I was now able to update my system without issues!