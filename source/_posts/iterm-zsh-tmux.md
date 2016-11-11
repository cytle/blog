---
title: iterm+zsh+tmux
date: 2016-09-25 15:38:13
tags: zsh tmux unix vim
---

![效果](/uploads/iterm-zsh-tmux/效果.png)


## tmux

```shell
sudo apt-get install tmux
```

## YADR

```shell
sudo apt-get install rake

# install YADR
# http://www.agileventures.org/articles/setting-up-yadr-on-ubuntu
sh -c "`curl -fsSL https://raw.githubusercontent.com/skwp/dotfiles/master/install.sh`"

nautilus ~/.yadr/fonts/
```

终端配色方案修改为`solarized`

编辑 > 编辑配置文件 > 颜色

![终端配置](/uploads/iterm-zsh-tmux/终端配置.png)


## tmux-powerline

[tmux-powerline](https://github.com/erikw/tmux-powerline)

```shell
TMUX_POWERLINE_PATH=~/.tmux-powerline
git clone https://github.com/erikw/tmux-powerline.git $TMUX_POWERLINE_PATH
```

编辑`.tmux.conf`

```shell
set-option -g status on
set-option -g status-interval 2
set-option -g status-justify "centre"
set-option -g status-left-length 60
set-option -g status-right-length 90
set-option -g status-left "#(~/path/to/tmux-powerline/powerline.sh left)"
set-option -g status-right "#(~/path/to/tmux-powerline/powerline.sh right)"

set-window-option -g window-status-current-format "#[fg=colour235, bg=colour27]⮀#[fg=colour255, bg=colour27] #I ⮁ #W #[fg=colour27, bg=colour235]⮀"

# You can toggle the visibility of the statusbars
bind C-[ run '~/path/to/tmux-powerline/mute_powerline.sh left'      # Mute left statusbar.
bind C-] run '~/path/to/tmux-powerline/mute_powerline.sh right'     # Mute right statusbar.
```

### 配置城市

...


## 参考
[The Text Triumvirate](http://www.drbunsen.org/the-text-triumvirate/)

[YADR](https://github.com/skwp/dotfiles)
