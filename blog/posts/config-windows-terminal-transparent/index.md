---
title: Configure the Windows Terminal have a Transparent Background
date: "2022-01-22"
description: "I show you how to configure the Windows Terminal so you can have a transparent background to make you feel like a l33t h3cks0r"
tags: ["powershell", "windows terminal"]
---

## Overview

To get full transparency to work in Windows Terminal, you need to be on Windows 11 and have Windows Terminal 1.12 or higher which is currently in preview.

![Windows Terminal Version Number](/assets/windows-terminal-version-number.png)

## Setting Transparency

Here is an example of Windows Terminal with a transparent background:

![Windows Terminal with Opacity](/assets/windows-terminal-transparent-example.png)

We need to edit the Windows Terminal settings.json file to configure transparency. To do this open the Windows Terminal settings:

![Windows Terminal Open Settings](/assets/windows-terminal-settings.png)

Now open the JSON file:

![Windows Termian Open JSON](/assets/windows-terminal-open-json-file.png)

You will need to add the `opacity` property to your profile. Below I am adding this setting to the default profile:

```JSON
[...]
   "defaults":
        {
            "opacity": 50
        },
        "list":
[...]
```

![Windows Terminal JSON settings Opacity](/assets/windows-terminal-transparent-settings-opacity.png)

You can configure the amount of opacity by changing the value. Use 0 for full opacity and increase the value for less opacity.

## Blurred Background

Depending on the type of desktop wallpaper, you may not want to use opacity but instead have a blurred background. This will allow your desktop wallpaper to appear but it is blurred which can help so you can still easily see text in the Windows Terminal.

![Windows Terminal useAcrylic](/assets/windows-terminal-useacrylic-example.png)

```JSON
[...]
        "defaults":
        {
            "acrylicOpacity": 0.65,
            "useAcrylic": true
        },
        "list":
[...]
```

![Windows Terminal JSON UseAcrylic](/assets/windows-terminal-useacrylic-settings.png)

If you want a transparent background in the Windows Terminal, I will show you how to do this in this post. The property name to set is called `useAcrylic`. We then use `acrylicOpacity` to set the opacity of the background.

![Windows Terminal Settings](/assets/windows-terminal-useacrylic-settings.png)

Set `acrylicOpacity` from 0.0-1.0 depending on the amount of opacity you want to use. The higher the value will be less opacity and the lower the value the more opacity.
