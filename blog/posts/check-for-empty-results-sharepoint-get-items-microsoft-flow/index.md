---
title: Check for Empty Results SharePoint Get Items in Microsoft Flow
date: "2022-09-05"
description: "Create a condition to check for empty SharePoint list items in Microsoft Flow"
tags: ["sharepoint-online", "microsoft-flow"]
---

## Overview

In Microsoft Flow, I have a SharePoint Get Items action that will query a SharePoint list for monthly bills that have a due date of today. The Flow will then send a high priority email to remind me to pay the bill.

![Microsoft Flow Get Items](/assets/microsoft-flow-sharepoint-get-items.png)

However, I do not want an email when no bills have a due date of today so I needed to create a condition in the logic to not email me if Get Items has an empty value. Here is the expression I created in my condition `empty(body('Get_items')?['value'])`.

![Microsoft Flow condition for empty sharepoint list items](/assets/microsoft-flow-condition-get-items-empty-body.png)