---
title: My Neovim Setup on Windows in 2024
date: "2024-05-13"
description: "Yes, you can use Vim on Windows and here is my setup and configuration for your consumption."
tags: ['windows-terminal', 'vim']
---

## Overview

How to set up Neovim on a Windows 11 OS in 2024.

## Terminal

Neovim runs in a Terminal, and you can use any terminal of your choice. I personally use Windows Terminal and as of this writing, it is on version 1.19. You can download it [here](https://aka.ms/terminal) or preview from [here](https://aka.ms/terminal-preview)].

Once you have Terminal installed, make it the default terminal application in settings:

![Default Terminal Application](/assets/default-terminal-application.png)

## Install Neovim

Next we will insatll Neovim using `winget` by typing the following into Terminal:

```PowerShell
winget install Neovim.Neovim
```

Restart the terminal and type `nvim` and you will see the Neovim welcome page:

![Neovim Startup](/assets/neovim-startup.png)

While this article isn't how to use Neovim, if you have never used it before, here are a few quick commands for your reference so you can get around Neovim:

Insert Mode: `i`

Command Mode: `ESC`

Quit Neovim: `:q <enter>`

Quit without Saving: `:q! <enter>`

Save the file: `:w <enter>`

Navigation: `h` `j` `k` `l`

Save the file to a new path: `:w new_name <enter>`

## Python

Some plugins will require Python so next we will install Python and make sure it is working with Neovim. Download Python from [here](https://www.python.org/downloads/) and during the setup process, make sure to add python.exe to PATH:

![Add python.exe to PATH](/assets/add-python-to-PATH.png)

Restart the Terminal if you had it open during the installation of Python otherwise you will receive an error saying `pip` is not recongized in the next step. Run the following to install `pynvim`:

```PowerShell
pip install pynvim
```

Now add the following line to your `init.vim` file pointing to the Python executable:

```Bash
let g:python3_host_prog='C:\Users\<USERNAME>\AppData\Local\Programs\Python\Python312/python.exe'
```

## Seting up your vimrc file

On Windows you init.vim (aka vimrc) file will be located in the following location `%localappdata%\nvim\init.vim`. You will need to create the nvim folder and the init.vim file if it doesn't already exist.

## Install vim-plug

Next, we will install `vim-plug` which is a package manager for Neovim. Open a PowerShell terminal and run:

```PowerShell
md ~\AppData\Local\nvim\autoload
$uri = 'https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim'
(New-Object Net.WebClient).DownloadFile(
  $uri,
  $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath(
    "~\AppData\Local\nvim\autoload\plug.vim"
  )
)
```

Example:

![Nevim Plug Manager Install](/assets/nvim-plug-manager-install.gif)

## Configure Neovim

Now we need to find which directory we should place our init.vim file which is where we will store the Neovim config. In Neovim, we can run `:echo stdpath('config')` to find the location as seen below:

![Neovim Startup](/assets/nvim-find-config-path.gif)

Create a file called `init.vim` in the directory where you ran `:echo stdpath('config')`. For example:

`nvim C:\Users\<profile>\AppData\Local\nvim\init.vim`

Then paste the following config:

```vim
call plug#begin('~/AppData/Local/nvim/plugged')
" below are some vim plugins for demonstration purpose.
" add the plugin you want to use here.
Plug 'joshdick/onedark.vim'
Plug 'iCyMind/NeoSolarized'
Plug 'iamcco/markdown-preview.nvim', { 'do': 'cd app && yarn install'  }

Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'
call plug#end()
```

Example:

![](/assets/nvim-create-init-vim-file.gif)

Save the file, quit Neovim and restart. Run `:PlugInstall` to installed the plugs:

![](/assets/nvim-plug-install.gif)


In the previous section, we installed vim-plug to manage our Neovim plugins. Now, we will finish configuring the init.vim file with our customizations:

Go back and edit our init.vim file by running the following in the PowerShell terminal:

`nvim c:\users\JasonRoss\AppData\Local\nvim\init.vim`

Delete all lines in the file and paste the following:

```vim
" Jason Ross Neovim Config
" https://www.jasonross.dev

set encoding=UTF-8

call plug#begin()
Plug 'nvim-lua/plenary.nvim'
Plug 'nvim-telescope/telescope.nvim'
Plug 'christoomey/vim-tmux-navigator'
Plug 'bling/vim-airline'
Plug 'norcalli/nvim-colorizer.lua'
Plug 'alvan/vim-closetag'
Plug 'Xuyuanp/nerdtree-git-plugin'
Plug 'tiagofumo/vim-nerdtree-syntax-highlight'
Plug 'airblade/vim-gitgutter'
" File Searching
Plug 'junegunn/fzf', { 'dir': '~/.fzf', 'do': './install --all' }
Plug 'junegunn/fzf.vim'

" Language Client
Plug 'neoclide/coc.nvim', {'branch': 'release'}
let g:coc_global_extensions = ['coc-emmet', 'coc-css', 'coc-html', 'coc-json', 'coc-prettier', 'coc-tsserver', 'coc-highlight']
" TypeScript Highlighting
Plug 'leafgarland/typescript-vim'
Plug 'peitalin/vim-jsx-typescript'

" File Search
Plug 'junegunn/fzf', { 'dir': '~/.fzf', 'do': './install --all' }
Plug 'junegunn/fzf.vim'

" Markdown Preview
Plug 'iamcco/markdown-preview.nvim', { 'do': 'cd app && yarn install'  }

Plug 'dracula/vim' "theme
Plug 'EdenEast/nightfox.nvim'
Plug 'projekt0n/github-nvim-theme'
Plug 'folke/tokyonight.nvim', { 'branch': 'main' }
Plug 'scrooloose/nerdtree' "nerdtree
Plug 'ryanoasis/vim-devicons' "icons for nerdtree
call plug#end()
"Config Section

" START General Settings
  " Line number configuration
   set number
   set relativenumber
   " Tab configuration
   set smarttab
   set cindent
   set tabstop=2
   set shiftwidth=2
   set expandtab
   " Allow mouse clicks
   set mouse=a
   " Change the escape key to jk
   inoremap jk <Esc>
   tnoremap jk <C-\><C-n>
   " Disable commenting on new line
   autocmd FileType * setlocal formatoptions-=c formatoptions-=r formatoptions-=o
  " Set Backup
  set backup
" END General Settings

" START FILE SEARCHING
  "CTRL+P to allow file searching
  "CTRL+T to open it in a new tab.
  "CTRL+S to open below (split view).
  "CTRL+T to open to the side (vertical split).
  "Enter to open it in the currently selected panel.
  nnoremap <C-p> :FZF<CR>
  let g:fzf_action = {
    \ 'ctrl-t': 'tab split',
    \ 'ctrl-s': 'split',
    \ 'ctrl-v': 'vsplit'
    \}
"END FILE SEARCHING


" START dracula/vim theme config
"  if (has("termguicolors"))
"   set termguicolors
"  endif
"  syntax enable
" colorscheme duskfox
" colorscheme dracula
" colorscheme github_*
" END dracula/vim theme config
" colorscheme tokyonight
"let g:storm = {'colorscheme': 'tokyonight'}
"set background=dark
"colorscheme nightfox
colorscheme duskfox

" START NERDTree Config
  let g:NERDTreeShowHidden = 1
  let g:NERDTreeMinimalUI = 1
  let g:NERDTreeIgnore = []
  let g:NERDTreeStatusline = ''
  " Automaticaly close nvim if NERDTree is only thing left open
  autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTree") && b:NERDTree.isTabTree()) | q | endif
  " Toggle
  nnoremap <silent> <C-b> :NERDTreeToggle<CR>
  autocmd VimEnter * NERDTree
" END NERDTree Config
"
" " open new split panes to right and below
set splitright
set splitbelow

" START Keybindings for split navigation
  " Use Ctrl+hjkl to move between split/vsplit panels
  tnoremap <C-h> <C-\><C-n><C-w>h
  tnoremap <C-j> <C-\><C-n><C-w>j
  tnoremap <C-k> <C-\><C-n><C-w>k
  tnoremap <C-l> <C-\><C-n><C-w>l
  map <C-h> <C-w>h
  map <C-j> <C-w>j
  map <C-k> <C-w>k
  map <C-l> <C-w>l
" END Keyboardings for split navigation

  " turn terminal to normal mode with escape
  tnoremap <Esc> <C-\><C-n>
  " start terminal in insert mode
  au BufEnter * if &buftype == 'terminal' | :startinsert | endif
  " open terminal on ctrl+n
  function! OpenTerminal()
    split term://bash
    resize 10
  endfunction
  nnoremap <c-n> :call OpenTerminal()<CR>
" END Integrated Terminal Config

" START clipboard settings
  " allow copy all lines :%y to work
  set clipboard+=unnamedplus
" END clipboard settings

"set guifont=FiraCode\ Nerd\ Font:h11
set guifont=SpaceMono\ Nerd\ Font:h13
" required if using https://github.com/bling/vim-airline
let g:airline_powerline_fonts=1

func! WordProcessor()
  " movement changes
  map j gj
  map k gk
  " formatting text
  setlocal formatoptions=1
  setlocal noexpandtab
  setlocal wrap
  setlocal linebreak
  " spelling and thesaurus
  setlocal spell spelllang=en_us
  set thesaurus+=/home/test/.vim/thesaurus/mthesaur.txt
  " complete+=s makes autocompletion search the thesaurus
  set complete+=s
endfu
com! WP call WordProcessor()

let g:ctrlp_user_command = ['.git/', 'git --git-dir=%s/.git ls-files -oc --exclude-standard']
```

Quit Neovim and open again. It will open with an error message which is expected because we have not run `:PlugInstall` since we copy and pasted the latest config. Once you have finished running `:PlugInstall`, restart Neovim and you should now see the customizations:

![](/assets/nvim-with-customizations-but-no-icons.png)

## Installing NerdFont

The file manager you see on the left side is a plugin called NerdTree. We are also using vim-devicons which should put the appropriate icon next to our files and folders in NerdTree. As you can see from the screenshot above, there are no icons, just boxes. This is because we need a special font to display the icons. We will fix that by installing a compatible font on our machine and set that font in our PowerShell Terminal profile:

I am going to use [SpaceMono](https://www.nerdfonts.com/font-downloads). Open the zip file and install `Space Mono Nerd Font Complete Windows Compatible.ttf`.

1. Open Windows Terminal Preview
2. Settings
3. + Add a new profile
4. Name: nvim
5. Command line: %SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe
6. Starting directory: %USERPROFILE%
7. Appearance > Font face: SpaceMono NF

This is an example of NerdTree working with icons:

![](/assets/nvim-nerdtree-icons.png)
