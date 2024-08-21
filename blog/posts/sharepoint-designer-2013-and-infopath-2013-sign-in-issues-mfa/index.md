---
title: SharePoint Designer and InfoPath 2013 Sign-in Issues Modern Authentication
date: "2024-08-20"
description: "An article on how to get SharePoint Designer 2013 and InfoPath 2013 to work with modern authentication."
tags: ['sharepoint-online', 'ms-office']
---

## Overview

SharePoint Designer and InfoPath Designer 2013 are old technologies that some individuals and organizations use. Office 2013 was shipped with modern authentication turned on. The first version of Microsoft Office that did that was Office 2016. Most users have multi-factor authentication turned on with the work and school account. That said, when trying to log into SharePoint Designer or InfoPath they might receive an error message saying: "Your account is in a bad state. Please sign-in to this account online to address the issue."

## Resolution

To get SharePoint Designer and InfoPath working you first need to make sure you have all the Office 2013 updates. Go into Windows Updates and make sure you have installed all Office 2013 updates. Make sure to also check optional updates. Reboot the machine and check again. I cannot recall how many times someone has told me they have all the updates, but they don’t when I visually watch them check. With a base install of an Office 2013 product there will be a minimum of 75 updates that will come down from windows updates including Service Packs, CU’s, and hotfixes. If you do not have all the updates, modern authentication isn’t going to work correctly.

Next, you need to update the Windows registery to enable ADAL. ADAL stands for Active Directory Authentication Library and is needed to get modern authentication to work in Office 2013. To enable ADAL, you need to create a REG_DWORD `HKCU\SOFTWARE\Microsoft\Office\15.0\Common\Identity\EnableADAL` and give it a value of `1` to enable.
