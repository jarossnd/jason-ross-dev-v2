---
title: How to Manage Linux Dotfiles with a Bare Git Repository and GitHub
date: "2026-11-01"
description: "Learn how to manage and back up Linux dotfiles using a bare Git repository and GitHub with HTTPS authentication. No symlinks required, with steps for restoring your configurations on Arch Linux."
tags: ['linux', 'arch-linux', 'git', 'github', 'dotfiles', 'tutorial']
---

## How I Manage My Linux Dotfiles with a Bare Git Repository and GitHub

Every time I install or reinstall Arch Linux, I find myself configuring many of the same things: my Zsh shell, terminal emulator, Git settings, Neovim, and various other applications.

Over time, I've customized these tools to work exactly how I like them. The problem is that those configurations are scattered throughout my home directory, and I don't particularly enjoy recreating them after a fresh Linux installation.

I wanted a simple way to back up my configuration files to GitHub, track changes over time, and restore them on another machine without manually copying files.

After reading Anand Iyer's article, [A Simpler Way to Manage Your Dotfiles](https://www.anand-iyer.com/blog/2018/a-simpler-way-to-manage-your-dotfiles/), I decided to try his approach of using a **bare Git repository**.

What I particularly liked about this method is that it doesn't require moving configuration files into a separate directory or creating symbolic links.

In this tutorial, I'll walk through how I set everything up on Arch Linux, including using GitHub CLI for HTTPS authentication instead of SSH.

### What Are Dotfiles?

In Linux, dotfiles are configuration files and directories that typically begin with a period (`.`), making them hidden by default.

Some examples from my setup include:

```text
~/
├── .zshrc
├── .gitconfig
└── .config/
    ├── alacritty/
    │   └── alacritty.toml
    └── nvim/
        └── init.lua
```

These files control how applications behave, what settings they use, and how my environment looks.

For example:

- `.zshrc` contains my Zsh shell configuration, aliases, and environment settings.
- `.gitconfig` contains my global Git configuration.
- `alacritty.toml` controls the appearance and behavior of my Alacritty terminal.
- `init.lua` configures my Neovim editor.

By tracking these files with Git, I can maintain a history of configuration changes and restore previous versions when necessary.

### Why Use a Bare Git Repository?

A common way to manage dotfiles is to create a dedicated directory, such as `~/dotfiles`, and move configuration files into it.

You then create symbolic links from their original locations to the files in that directory.

While this approach works, I wanted something simpler that didn't require managing symlinks.

A bare Git repository solves this problem.

Normally, a Git repository contains a hidden `.git` directory alongside your project's files.

A bare repository, on the other hand, stores Git's repository data without maintaining its own checked-out working directory.

The trick is to configure Git to use:

- **Git directory:** `$HOME/.dotfiles`
- **Working tree:** `$HOME`

This allows Git to manage selected configuration files directly from my home directory.

My configuration files remain where their applications expect to find them, while Git tracks their changes in a separate repository.

An important detail is that Git does not automatically upload my entire home directory. I explicitly choose which files to track.

### Step 1: Install Git and GitHub CLI

Since I'm running Arch Linux, I can install Git and GitHub CLI using Pacman:

```bash
sudo pacman -S git github-cli
```

Git handles version control, while GitHub CLI allows me to authenticate with GitHub without setting up SSH keys.

To verify both packages are installed:

```bash
git --version
gh --version
```

### Step 2: Create a Repository on GitHub

Before configuring anything locally, I created a new repository on GitHub.

You can do this by visiting:

[https://github.com/new](https://github.com/new)

I used the following settings:

- Repository name: `dotfiles`
- Visibility: Private
- README: Not initialized
- `.gitignore`: None
- License: None

I chose a private repository initially because configuration files sometimes contain personal information or machine-specific settings.

A private repository is not a substitute for keeping credentials out of Git, however. Passwords, authentication tokens, API keys, and other secrets should never be committed.

Once the repository was created, I was ready to configure Git locally.

### Step 3: Initialize a Bare Git Repository

Next, I opened my terminal and ran:

```bash
git init --bare "$HOME/.dotfiles"
```

This creates a new directory at:

```text
~/.dotfiles/
```

Unlike a normal Git repository, this directory stores the repository metadata rather than a separate working copy of my configurations.

My actual dotfiles remain in their original locations throughout my home directory.

### Step 4: Create a Dotfiles Alias

Typing the full Git command with a custom Git directory and working tree every time would be inconvenient.

Instead, I created a shell alias named `dotfiles`.

Since I use Zsh, I added the following line to my `~/.zshrc`:

```bash
alias dotfiles='git --git-dir=$HOME/.dotfiles --work-tree=$HOME'
```

I then reloaded my Zsh configuration:

```bash
source ~/.zshrc
```

Now I can run commands such as:

```bash
dotfiles status
```

Instead of:

```bash
git --git-dir=$HOME/.dotfiles --work-tree=$HOME status
```

This alias is the key to making the entire setup convenient.

Any time I want to perform a Git operation on my dotfiles, I use the `dotfiles` command instead of `git`.

For example:

```bash
dotfiles add
dotfiles commit
dotfiles push
dotfiles log
```

My existing Git repositories are unaffected because the alias explicitly points to the dotfiles repository.

### Step 5: Hide Untracked Files

Because my home directory is the working tree, running `dotfiles status` initially could display a huge number of untracked files.

I don't want Git reporting everything in my home directory, including documents, downloads, application caches, and other files that have nothing to do with my configurations.

Fortunately, Git has an option to hide untracked files from its status output:

```bash
dotfiles config --local status.showUntrackedFiles no
```

After running this command, `dotfiles status` primarily displays changes to files I'm already tracking.

**Important:** This doesn't prevent additional files from being added to the repository. It only changes how Git displays untracked files.

I can still explicitly add a new configuration file whenever I want.

### Step 6: Authenticate with GitHub Using HTTPS

For this setup, I decided to use **HTTPS authentication through GitHub CLI rather than SSH**.

GitHub CLI provides a convenient way to authenticate through a browser and configure Git to use those credentials.

First, I ran:

```bash
gh auth login
```

During the setup, I selected:

1. GitHub.com
2. HTTPS
3. Authenticate through a web browser

I followed the browser prompts to authorize GitHub CLI.

After authentication, I verified that I was signed in:

```bash
gh auth status
```

Next, I configured Git to use GitHub CLI as its credential helper:

```bash
gh auth setup-git
```

This allows Git to use my GitHub CLI authentication when communicating with GitHub over HTTPS.

I also explicitly configured GitHub CLI to prefer HTTPS:

```bash
gh config set git_protocol https --host github.com
```

This is useful because it ensures future Git operations initiated through GitHub CLI default to HTTPS instead of SSH.

No SSH key generation or manual key management is required.

### Step 7: Connect the Local Repository to GitHub

Now that GitHub authentication is configured, I need to connect my local bare repository to the remote repository.

I added the GitHub repository as my `origin` remote:

```bash
dotfiles remote add origin https://github.com/YOUR_USERNAME/dotfiles.git
```

Replace `YOUR_USERNAME` with your GitHub username.

Next, I configured the main branch:

```bash
dotfiles branch -M main
```

I verified the remote URL with:

```bash
dotfiles remote -v
```

The output should look similar to:

```text
origin  https://github.com/YOUR_USERNAME/dotfiles.git (fetch)
origin  https://github.com/YOUR_USERNAME/dotfiles.git (push)
```

Both URLs should use `https://`, not `git@github.com:`.

#### Switching from SSH to HTTPS

I originally tried using an SSH remote but encountered this error:

```text
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.
```

Rather than configuring SSH keys, I decided to use GitHub CLI with HTTPS.

If you've already configured your repository with an SSH remote, you don't need to recreate the repository.

Simply update the remote URL:

```bash
dotfiles remote set-url origin https://github.com/YOUR_USERNAME/dotfiles.git
```

Then run:

```bash
gh auth setup-git
```

Your existing commits and tracked files remain unchanged.

### Step 8: Add Configuration Files

With everything configured, I can start adding the configuration files I want to track.

First, I navigate to my home directory:

```bash
cd ~
```

Then I add my Zsh configuration:

```bash
dotfiles add .zshrc
```

I can also add my Git configuration:

```bash
dotfiles add .gitconfig
```

For Alacritty:

```bash
dotfiles add .config/alacritty/alacritty.toml
```

And for Neovim:

```bash
dotfiles add .config/nvim/
```

Git supports adding individual files or entire directories.

Before adding a directory, I recommend inspecting its contents to make sure it doesn't contain sensitive information, local caches, or unnecessary generated files.

I also avoid adding the `~/.dotfiles` directory itself because it contains Git's repository data.

### Step 9: Commit and Push to GitHub

After adding my configuration files, I can review what Git is tracking:

```bash
dotfiles status
```

I can inspect the staged changes before committing:

```bash
dotfiles diff --cached
```

Once I'm satisfied, I create my first commit:

```bash
dotfiles commit -m "Initial dotfiles configuration"
```

Finally, I push my changes to GitHub:

```bash
dotfiles push -u origin main
```

The `-u` option establishes the upstream branch so future pushes can use the shorter command:

```bash
dotfiles push
```

At this point, my selected configuration files are version-controlled and backed up in my GitHub repository.

### Step 10: Updating My Dotfiles

One of the biggest advantages of this setup is how easy it is to maintain.

For example, suppose I change my Alacritty terminal colors or add a new alias to `.zshrc`.

I can see which tracked files changed:

```bash
dotfiles status
```

I can inspect the differences:

```bash
dotfiles diff
```

Then stage the modified configuration files:

```bash
dotfiles add .zshrc
dotfiles add .config/alacritty/alacritty.toml
```

Commit the changes:

```bash
dotfiles commit -m "Update shell and terminal configuration"
```

And push them:

```bash
dotfiles push
```

That's it.

There are no symbolic links to update and no files to copy between directories.

Because Git keeps a history of my commits, I can also view previous changes:

```bash
dotfiles log --oneline
```

This is especially helpful when I change a configuration and something unexpectedly stops working.

### Step 11: Restoring Dotfiles on a Fresh Arch Linux Installation

The real benefit of maintaining dotfiles on GitHub becomes apparent when setting up a new machine or reinstalling Arch Linux.

Instead of recreating my configuration files manually, I can retrieve them from GitHub.

First, I install the required packages:

```bash
sudo pacman -S git github-cli
```

Next, I authenticate with GitHub:

```bash
gh auth login
```

I select HTTPS and complete the browser authentication process.

Then I configure the Git credential helper:

```bash
gh auth setup-git
```

Now I clone my dotfiles repository as a bare repository:

```bash
git clone --bare https://github.com/YOUR_USERNAME/dotfiles.git "$HOME/.dotfiles"
```

Because my `.zshrc` alias may not exist yet on this new installation, I temporarily define it in my current terminal session:

```bash
alias dotfiles='git --git-dir=$HOME/.dotfiles --work-tree=$HOME'
```

Before restoring anything, I make sure I have a backup of any existing configuration files.

Then I run:

```bash
dotfiles checkout
```

Git attempts to restore my tracked files to their original locations in my home directory.

#### Handling Existing Configuration Files

On a fresh installation, some applications may have already created default configuration files.

If those files would be overwritten, Git may refuse to check out the repository.

For example, the existing `.zshrc` may conflict with the version stored in GitHub.

In that case, I back up the existing file:

```bash
mv ~/.zshrc ~/.zshrc.backup
```

Then retry:

```bash
dotfiles checkout
```

If other files conflict, I back those up as well before continuing.

I don't recommend blindly deleting configuration files during restoration because they may contain settings I want to preserve.

Once the checkout succeeds, I restore the status configuration:

```bash
dotfiles config --local status.showUntrackedFiles no
```

Finally, I reload my Zsh configuration:

```bash
source ~/.zshrc
```

My tracked configuration files are now available in their expected locations.

Of course, the applications themselves still need to be installed. Restoring an Alacritty configuration doesn't automatically install Alacritty.

### Bonus: Backing Up Installed Arch Linux Packages

While managing dotfiles is useful, it doesn't capture the software installed on my machine.

To make rebuilding my Arch Linux environment easier, I also like the idea of saving my installed package lists.

Pacman can export explicitly installed packages from the official repositories:

```bash
pacman -Qqen > ~/pkglist.txt
```

I can also export explicitly installed foreign packages, which commonly include packages installed from the AUR:

```bash
pacman -Qqem > ~/aur-pkglist.txt
```

I can then add both lists to my dotfiles repository:

```bash
dotfiles add pkglist.txt aur-pkglist.txt
dotfiles commit -m "Save installed Arch Linux packages"
dotfiles push
```

These lists provide a useful starting point for reinstalling software after a fresh installation.

They aren't a full backup of the operating system, and they don't capture every dependency, external package source, system configuration, or service setting.

Still, combined with my dotfiles repository, they make rebuilding my environment considerably easier.

### Final Thoughts

I've experimented with different ways of managing my Linux environment, and I like how straightforward this bare Git repository approach is.

The biggest advantages for me are:

- No symbolic links to create or maintain.
- Configuration files stay in their original locations.
- Git tracks changes and provides version history.
- GitHub provides an off-machine copy of my configurations.
- GitHub CLI makes HTTPS authentication simple.
- I can restore my tracked configurations after reinstalling Arch Linux.
- The workflow uses regular Git commands through a convenient alias.

There are certainly other dotfile management tools available, including GNU Stow and chezmoi, but I appreciate that this approach doesn't require introducing another configuration management tool.

For now, a bare Git repository combined with GitHub is exactly what I need.

If you're looking for a simple way to manage your Linux dotfiles without dealing with symbolic links, this method is worth considering.

#### References

- [A Simpler Way to Manage Your Dotfiles — Anand Iyer](https://www.anand-iyer.com/blog/2018/a-simpler-way-to-manage-your-dotfiles/)
- [Git Documentation — git init](https://git-scm.com/docs/git-init)
- [GitHub CLI — Authentication](https://cli.github.com/manual/gh_auth_login)
- [GitHub CLI — Configure Git Authentication](https://cli.github.com/manual/gh_auth_setup-git)