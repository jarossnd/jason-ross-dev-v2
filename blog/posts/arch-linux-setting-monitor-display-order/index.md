---
title: Setting Monitor Display Order in Arch Linux
date: "2022-04-07"
description: "Setting the monitor display order in Arch Linux using Xrandr for a multi-monitor setup"
tags: ["linux", "linux-config"]
---

## Overview

I recently reimaged my machine with a fresh install of Arch Linux. I found myself having to look up the proper command to set my monitor order since I didn't remember all the parameters that needed to be used. I decided to create a quick blog post so I can reference my own content in the future when setting monitor display order. This should work for many different Linux distros and not just Arch Linux.

## Setting Display Order

The first thing you need to do is run `xrandr` which will display your current monitor configuration along with what your monitors are called. I have 1 34" LG monitor using HDMI and a second HP monitor using DVI. Here is my output:

```
Screen 0: minimum 320 x 200, current 4480 x 1080, maximum 16384 x 16384
DVI-D-1 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis) 553mm x 311mm
   1920x1080     60.00*+  59.96    59.93  
   1680x1050     59.95    59.88  
   1400x1050     59.98  
   1600x900      59.95    60.00    59.82  
   1280x1024     60.02  
   1440x900      59.90  
   1400x900      59.96    59.88  
   1280x960      60.00  
   1440x810      59.97  
   1368x768      59.88    59.85  
   1280x800      59.99    59.97    59.81    59.91  
   1280x720      60.00    59.99    59.86    60.00    59.74  
   1024x768      60.04    70.07    60.00  
   960x720       60.00  
   928x696       60.05  
   896x672       60.01  
   1024x576      59.95    59.96    59.90    59.82  
   960x600       59.93    60.00  
   960x540       59.96    59.99    59.63    59.82  
   800x600       70.00    65.00    60.00    60.32    56.25  
   840x525       60.01    59.88  
   864x486       59.92    59.57  
   700x525       59.98  
   800x450       59.95    59.82  
   640x512       60.02  
   700x450       59.96    59.88  
   640x480       60.00    59.94  
   720x405       59.51    58.99  
   720x400       70.08  
   684x384       59.88    59.85  
   640x400       59.88    59.98  
   640x360       59.86    59.83    59.84    59.32  
   512x384       70.07    60.00  
   512x288       60.00    59.92  
   480x270       59.63    59.82  
   400x300       60.32    56.34  
   432x243       59.92    59.57  
   320x240       60.05  
   360x202       59.51    59.13  
   320x180       59.84    59.32  
VGA-1 disconnected (normal left inverted right x axis y axis)
HDMI-1 connected 2560x1080+1920+0 (normal left inverted right x axis y axis) 798mm x 334mm
   2560x1080     59.98*+  74.99    50.00  
   3840x2160     30.00    25.00    24.00    29.97    23.98  
   2560x1600     59.97  
   2560x1440     59.95  
   2048x1536     60.00  
   1920x1440     75.00    60.00  
   1856x1392     75.00    60.01  
   1792x1344     75.00    60.01  
   2048x1152     59.98    59.90    59.91  
   1920x1200     59.88    59.95  
   1920x1080     59.97    59.96    60.00    50.00    59.94    59.93  
   1600x1200     75.00    70.00    65.00    60.00  
   1680x1050     59.95    59.88  
   1400x1050     74.76    59.98  
   1600x900      59.99    59.94    59.95    60.00    59.82  
   1280x1024     75.02    60.02  
   1400x900      59.96    59.88  
   1280x960      60.00  
   1440x810      60.00    59.97  
   1368x768      59.88    59.85  
   1280x800      59.99    59.97    59.81    59.91  
   1152x864      75.00  
   1280x720      60.00    59.99    59.86    60.00    50.00    59.94    59.74  
   1024x768      75.05    60.04    75.03    70.07    60.00  
   960x720       75.00    60.00  
   928x696       75.00    60.05  
   896x672       75.05    60.01  
   1024x576      59.95    59.96    59.90    59.82  
   960x600       59.93    60.00  
   832x624       74.55  
   960x540       59.96    59.99    59.63    59.82  
   800x600       75.00    70.00    65.00    60.00    72.19    75.00    60.32    56.25  
   840x525       60.01    59.88  
   864x486       59.92    59.57  
   720x576       50.00  
   700x525       74.76    59.98  
   800x450       59.95    59.82  
   720x480       60.00    59.94  
   640x512       75.02    60.02  
   700x450       59.96    59.88  
   640x480       60.00    75.00    72.81    75.00    60.00    59.94  
   720x405       59.51    58.99  
   684x384       59.88    59.85  
   640x400       59.88    59.98  
   576x432       75.00  
   640x360       59.86    59.83    59.84    59.32  
   512x384       75.03    70.07    60.00  
   512x288       60.00    59.92  
   416x312       74.66  
   480x270       59.63    59.82  
   400x300       72.19    75.12    60.32    56.34  
   432x243       59.92    59.57  
   320x240       72.81    75.00    60.05  
   360x202       59.51    59.13  
   320x180       59.84    59.32  
```

There are two issues for me with this output:

1. My `HDMI-1` (LG 34") identifier should be on the left side of `DVI-D-1`
2. The `HDMI-1` monitor should be the primary monitor instead of `DVI-D-1`

Let's fix issue #1 first by setting the correct monitor order:

```
xrandr --output HDMI-1 --left-of DVI-D-1
```

The monitors should now be in the correct order. Next, let's set the correct primary monitor:

```
xrandr --output HDMI-1 --primary
```

If you had a lot of windows open, you might see the windows move since you changed which monitor was the primary.

If you wanted to run both command in one line, it would look like this:

```
xrandr --output HDMI-1 --primary --left-of DVI-D-1
```

## Saving the Config

If you were to restart your machine, the xrandr settings you just configured will not be saved. To save these settings, I add the command we built above to my xinitrc file. On my system, my xinitrc file is stored in ~/.config/x11/xinitrc. Here is how I configured it:

Before:

```bash
#!/bin/sh

# xinitrc runs automatically when you run startx.

# There are some small but important commands that need to be run when we start
# the graphical environment. There is a link to this file in ~/.xprofile
# because that file is run automatically if someone uses a display manager
# (login screen) and so they are needed there. To prevent doubling up commands,
# I source them here with the line below.

if [ -f "${XDG_CONFIG_HOME:-$HOME/.config}/x11/xprofile" ]; then
	. "${XDG_CONFIG_HOME:-$HOME/.config}/x11/xprofile"
else
	. "$HOME/.xprofile"
fi

ssh-agent dwm
```

After:

```bash
#!/bin/sh

# xinitrc runs automatically when you run startx.

# There are some small but important commands that need to be run when we start
# the graphical environment. There is a link to this file in ~/.xprofile
# because that file is run automatically if someone uses a display manager
# (login screen) and so they are needed there. To prevent doubling up commands,
# I source them here with the line below.

if [ -f "${XDG_CONFIG_HOME:-$HOME/.config}/x11/xprofile" ]; then
	. "${XDG_CONFIG_HOME:-$HOME/.config}/x11/xprofile"
else
	. "$HOME/.xprofile"
fi

xrandr --output HDMI-1 --primary --left-of DVI-D-1

ssh-agent dwm
```

Since I'm running dwm, it is important that I put the xrandr line above `ssh-agent dwm` otherwise it will not work.


That is all you need to do to set the monitor order in Arch Linux.