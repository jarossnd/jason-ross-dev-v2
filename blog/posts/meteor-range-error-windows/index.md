---
title: Meteor Range Error in Windows
date: "2022-11-03"
description: "How I resolved a RangeError Maximum call stack size exceeded when trying to create a new Meteor project in Windows"
tags: ['meteor', 'javascript', 'debug']
---
## Meteor Range Error in Windows

I just installed Meteor for the first on this particular Windows machine I was using `npm install -g meteor`. Upon creating anew Meteor project, `meteor create meteor-todos-react`, I received the following error message:

```text
C:\Users\<profile>\AppData\Local\.meteor\packages\meteor-tool\2.8.0\mt-os.windows.x86_64\dev_bundle\lib\node_modules\meteor-promise\promise_server.js:218
      throw error;
      ^

RangeError: Maximum call stack size exceeded
(Use `node --trace-uncaught ...` to show where the exception was thrown)
PS C:\Users\<profile>\repos> node --version
v16.17.0
```

My solution was to delete the node_modules folder under my profile:

```PowerShell
cd ~
rmdir .\node_modules\
```

Once done, I ran the installer again: `npm install -g meteor`. I was now able to run `meteor create meteor-todos-react` without any error messages.