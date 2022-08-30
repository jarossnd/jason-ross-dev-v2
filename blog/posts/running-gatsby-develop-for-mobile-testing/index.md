---
title: Running Gatsby Develop for Mobile Testing
date: "2022-07-25"
description: "Running Gatsby Develop on a desktop or laptop is easy to do and then you can test through your desktop web browser. But what if you want to test your website on a mobile device without pushing changes to Git first?"
tags: ['gatsbyjs', 'javascript', 'debug']
---

## Overview

You developed a website in Gatsby and through `gatsby develop`, you have tested the website on a desktop web browser. You resize the browser to test responsiveness for smaller screens and so far so good. You even go as far as opening the device toolbar in web developer tools and selecting the various screen sizes. Everything looks good so you check in your changes and push your changes to your Git repository. Upon testing on an actual physical mobile device, you notice some bugs with sizing and responsiveness that you didn’t catch during testing on a desktop.

## Solution

When you run `gatsby develop`, it will start a HTTP server on localhost. If you want to test on a mobile device on the same network, you will not be able to connect to localhost from a mobile device. We can change this by adding some parameters to `gatsby develop`. Take the following command for example:

`gatsby develop -H 0.0.0.0 -p 8000 -o`

The `-H` (--host) sets the host that the website will be hosted on. This will be your IP address that you router assigns you through DHCP if you are using dynamic routing or if you are using static routing and not through DHCP, the website will be service from whatever IP address you get from running `ipconfig` on Windows or `ifconfig` on Linux / MacOS.

The `-p` (--port) specifies the port number that that you want to use. I also use `-o` (--open) which will open the site in your default web browser.
