---
title: The main() function in C programming
date: "2022-03-31"
description: "What is the main() function in the c programming language?"
tags: ['c programming']
---

## Overview

The `main()` function in a C program is a required component that must exist. The parentheses `( )` after `main` are to accept arguments. If there are no arguments that will be passed to the main function, we add `void` in the parentheses, so you know that nothing is being sent to main. Below is an example of a simple C application where nothing is being passed to main so we have added void:

```c
#include <stdio.h>

int main(void)
{
    printf("Hello, World!\n");
    return 0;
}
```

We add int to the beginning of `main` to declare an integer. Why an integer? Because at the end of the `main()` function, we are returning 0 which is an integer data type. `return` is how we identify if the application was successful at running. If the application returns a 0 exit code, then the operating system or application calling upon our application, will know the application exited successfully.

The code between the opening `{` and closing `}` braces is part of the `main` function and will be executed when main is called. `main` is the function that is called when the program runs for the first time. That is why the `main` function is a requirement component in C programming.
