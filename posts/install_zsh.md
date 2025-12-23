---
description: shell美化方案
date: '2023-08-04'
author: 'pxx'
categories:
  - Linux
published: true
---

## Zsh 安装与配置指南

### 1. 安装 Zsh

在 Ubuntu 系统上，通过以下命令安装 Zsh：

```bash
sudo apt-get install zsh
```

安装完成后，检查系统支持的 shell：

```bash
cat /etc/shells
```

### 2. 设置 Zsh 为默认 Shell

使用以下命令设置 Zsh 为默认 shell：

```bash
chsh -s /bin/zsh
```

检查是否设置成功：

```bash
echo $SHELL
```

### 3. 安装 Oh My Zsh

确保已安装 git，然后使用以下命令安装 Oh My Zsh：

```bash
sh -c "$(wget https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"
```

安装完成后，同意使用 Oh My Zsh 的配置模板覆盖已有的 `.zshrc` 文件。

### 4. 配置 Zsh

打开配置文件：

```bash
vim ~/.zshrc
```

#### 4.1 添加插件

在 `~/.zshrc` 文件中添加插件：

```bash
plugins=(git command-not-found)
```

#### 4.2 修改主题

Oh My Zsh 提供了多种内置主题，您可以选择并修改它们。

##### 1. ys 主题

找到并修改配置文件中的主题行：

```bash
ZSH_THEME="ys"
```

保存并退出后，重新加载配置文件：

```bash
source ~/.zshrc
```

##### 2. Powerlevel10k 主题

首先，使用 git 克隆 Powerlevel10k 主题：

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

然后修改 `.zshrc` 文件：

```bash
ZSH_THEME="powerlevel10k/powerlevel10k"
```

执行以下命令使配置生效：

```bash
source ~/.zshrc
```

根据提示配置主题。

### 5. 配置插件

#### 5.1 自动补全插件：zsh-autosuggestions

使用以下命令安装 zsh-autosuggestions 插件：

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions.git $ZSH_CUSTOM/plugins/zsh-autosuggestions
```

然后在 `~/.zshrc` 中启用该插件：

```bash
plugins=(git zsh-autosuggestions)
```