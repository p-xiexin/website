---
description: 如何在完全无法联网的 Windows 系统中成功安装和使用 WSL2
date: '2025-08-6'
author: 'pxx'
categories:
  - 其他
published: true

---

# 完全离线环境下安装和使用 WSL2

> 本文记录如何在 **完全无法联网的 Windows 系统**中成功安装和使用 WSL2，包括解决 Docker Desktop 报错 `Your version of WSL is too old` 的问题。
> 整体过程亲测有效，适用于公司内网、断网环境或安全隔离场景。

## 什么是 WSL2？

[安装 WSL | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/install)

WSL（Windows Subsystem for Linux）是微软为 Windows 10/11 用户提供的类原生 Linux 环境。WSL2 是 WSL 的第二代架构，它与传统的 WSL1 最大的区别是：

- WSL2 使用 **真正的 Linux 内核**；
- 提供更完整的系统调用兼容性（能跑 Docker 等）；
- 性能提升，尤其在文件 I/O 和容器方面。

## 第一种方法：使用 `.appxbundle` 安装-失败

目前在网上搜索到的方案都是去微软官网下载 Ubuntu 的 `.appxbundle` 包，然后在断网环境下双击安装。

 [store.rg-adguard.net](https://store.rg-adguard.net/) 

| 文件名                            | 说明                         |
| --------------------------------- | ---------------------------- |
| `ubuntu_2004.2021.825.0_x64.appx` | Ubuntu 主包                  |
| `Microsoft.VCLibs.x64.14.00.appx` | 运行库依赖                   |
| `Microsoft.UI.Xaml.2.4.appx`      | 图形界面依赖（部分版本需要） |

这个方式可以启动 Ubuntu 图标，也能跑出一个终端，但最后会发现：

> 一运行就出现：
>
> ```
> Windows 无法访问 c:\Program Files\WindowsApps\CanonicalGroup.Ubuntu...\ubuntu2004.exe
> 网络不可用 / 无法联网 / 安装失败 / 无法初始化发行版
> ```

这是因为：

- `.appxbundle` 安装的只是 **壳子**，本质上是一个 UWP 安装框架；
- 真正的 rootfs、配置、WSL 实体是需要 **联网初始化时自动拉取的**；
- 离线环境下无法拉取资源，导致启动失败，甚至打不开终端；

所以，**无法在离线环境中使用 `.appxbundle` 安装 WSL2 发行版**。

## 正确方法：使用 WSL 注册和 RootFS 手动安装

在离线环境下，应该采用更底层但更可靠的方式：

### 步骤一：确保系统已安装 WSL 支持

安装 WSL 所需功能（可在联网机器上手动下载并拷贝）：

启用以下 Windows 可选功能：

- Hyper-V
- Virtual Machine Platform
- Windows Subsystem for Linux

打开 PowerShell（管理员）运行：

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

### 步骤二：下载 Linux 内核更新包

https://aka.ms/wsl2kernel

```bash
msiexec /i D:\WSL2Offline\wsl_update_x64.msi
```

### 步骤三：下载 Ubuntu RootFS

从官方 Ubuntu 镜像站（或其他 Linux 发行版）下载 tar.gz 格式的根文件系统（RootFS）：

- https://cloud-images.ubuntu.com/wsl/
- 选择你想要的版本（如 Jammy 是 Ubuntu 22.04）

将下载一个文件如：

```
ubuntu-jammy-wsl-amd64-rootfs.tar.gz
```

将其拷贝到离线系统中。

### 步骤四：手动注册 WSL 发行版

使用 `wsl --import` 命令手动安装：

```bash
wsl --import Ubuntu22 D:\WSL\Ubuntu22 D:\install\ubuntu-jammy-wsl-amd64-rootfs.tar.gz --version 2
```

参数说明：

- `Ubuntu22`： WSL 分发名
- `D:\WSL\Ubuntu22`：数据目录（建议放在非系统盘）
- `tar.gz`：刚下载的 rootfs 文件

安装完成后，输入以下命令启动：

```bash
wsl -d Ubuntu22
```

现在就可以在**完全离线环境中启动了一个真正的 WSL2 Linux 环境**！

### Docker Desktop 提示 `Your version of WSL is too old`

虽然使用 rootfs 成功安装了 WSL2，但当运行 Docker Desktop 时，仍然可能会看到这个报错：

> ```
> Your version of WSL is too old.
> ```

这是因为：

- Docker Desktop 依赖 **WSL2 内核驱动（`wsl2-linux-kernel`）**；
- Windows 默认附带的是老版本内核（如 4.x 或 5.10.16.3）；
- Docker 需要的是更高版本（如 5.15+）才能运行容器引擎。

**解决方法：离线升级 WSL2 内核**

1. 前往 GitHub 官方项目下载最新内核二进制：

   [Releases · microsoft/WSL](https://github.com/microsoft/WSL/releases)

2. 在离线机器上运行 MSI 安装包即可更新内核版本。

3. 重启 WSL，再次打开 Docker Desktop 即可。

## 方法三：在联网电脑上安装后导出

首先在microsoft store中直接下载，完成后打开命令行：

```powershell
wsl -l -v
```

假设叫：`Ubuntu`，导出为 tar 包

```powershell
wsl --export Ubuntu D:\wsl-backup\ubuntu.tar
```

卸载当前 WSL（释放 C 盘空间）

```powershell
wsl --unregister Ubuntu
```

然后再需要安装wsl的电脑上：

```powershell
mkdir D:\WSL\Ubuntu
```

导入：

```powershell
wsl --import Ubuntu D:\WSL\Ubuntu D:\wsl-backup\ubuntu.tar
```

启动并验证

```powershell
wsl -d Ubuntu
wsl --set-default Ubuntu #设置默认Ubuntu
```

导入后进如wsl是 `root`用户，可以通过以下方式修改：

```bash
whoami
```

如果是 `root`，编辑：

```bash
sudo nano /etc/wsl.conf
```

写入：

```ini
[user]
default=你的用户名
```

然后：

```powershell
wsl --shutdown
wsl -d Ubuntu
```
