---
title: Updating the "First Publish Date" column in SharePoint Online
date: "2022-07-27"
description: "How to use SharePoint PowerShell PnP to update read-only column First Publish Date"
tags: ['sharepoint', 'powershell']
---

## Overview

I worked on an issue today where some translated site pages had the "First Published Date" metadata missing when the page was translated from the original language. The original page had the "First Published Date" metadata, it just was not coming over when the page was translated and published. I'm not going to go into the root cause of this problem but instead wanted to share how someone would go about updating the "First Published Date" metadata after the fact without having to re-create the page. This is because the column cannot be modified in the UI since the field is read-only.

Below is a screenshot showing that the Before-Again.aspx page is missing the "First Published Date" metadata:

![Site Pages Library Missing First Published Date](/assets/sitepages-library-pl-missing-first-publish-date.png)

We need to know the ID of the page so it might be helpful to add the ID column to your Site Pages view to easily identify the page ID.

![Site Pages Library with ID column added to the view](/assets/sitepages-library-pl-id-column.png)

Below is PnP PowerShell to update the First Published Date field. You first need to know the ID of the page. You will need to set the `$myPageID` variable to equal the ID of the page you want to update the metadata.

```PowerShell
Connect-PnPOnline -Url https://<tenantName>.sharepoint.com/sites/<siteName> -UseWebLogin

$myPageID = 9

(Get-PnPListItem -List 'SitePages' -Id $myPageID | Select -ExpandProperty FieldValues).Get_Item("FirstPublishedDate")

$myDate = Get-Date "27 July 2022"

Set-PnPListItem -List 'SitePages' -Identity $myPageID -Values @{"FirstPublishedDate"=$myDate}
```

Below is the end result of the column now having the date. Notice that the time is set to midnight, you can include a time if you want but I left it at midnight so I could easily identify which pages I had updated the metadata with PowerShell.

![Site Pages Library with ID column added to the view](/assets/sitepages-library-pl-has-first-published-after-ps.png)
