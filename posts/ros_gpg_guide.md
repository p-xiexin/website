---
description: ROS 官方 GPG 密钥过期问题的完整解决方案与多架构迁移指南
date: '2025-12-01'
author: 'pxx'
categories:
  - ROS

published: true
---

# ROS 官方 GPG 密钥过期与迁移指南

2025 年 6 月 1 日，ROS（Robot Operating System）官方使用的旧版 GPG 公钥 **F42ED6FBAB17C654** 正式过期。此后，所有仍依赖旧密钥的系统在执行 `sudo apt update` 时都会遇到签名验证失败的问题，错误信息通常显示为 `NO_PUBKEY F42ED6FBAB17C654` 或 `EXPKEYSIG F42ED6FBAB17C654`。

本文将系统性地说明密钥过期的背景、迁移方法,以及在不同架构和网络环境下可能遇到的问题。文中讨论的内容同时适用于 ROS1 和 ROS2,因为问题的核心在于 apt 仓库的签名机制本身。

## 密钥过期的背景

ROS 官方仓库使用的签名密钥设有固定有效期,这次密钥过期并非突发事件,而是正常的安全维护流程。官方已在多个渠道发布了相关公告和迁移指南:

- GitHub 官方 issue 讨论:[https://github.com/ros/rosdistro/issues/46260](https://github.com/ros/rosdistro/issues/46260)
- Discourse 官方迁移指南:[https://discourse.openrobotics.org/t/ros-signing-key-migration-guide/43937](https://discourse.openrobotics.org/t/ros-signing-key-migration-guide/43937)
- 新版密钥文件:[https://github.com/ros/rosdistro/blob/master/ros.asc](https://github.com/ros/rosdistro/blob/master/ros.asc)

根据这些官方信息,旧密钥已无法满足 apt 的签名校验要求,所有用户都需要迁移到新版密钥,并采用新的 `signed-by` 格式配置软件源。

## 安装新版 GPG 密钥

首先需要清理可能残留的旧密钥。即使系统中没有安装旧密钥,执行以下命令也不会产生副作用:

```bash
sudo apt-key del F42ED6FBAB17C654 2>/dev/null || true
```

接下来下载并安装新密钥。新密钥应当存放在系统的标准密钥环目录中:

```bash
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.asc \
  -o /usr/share/keyrings/ros-archive-keyring.gpg
```

下载完成后可以验证文件是否正确生成,新密钥文件大小约为 2.4 KB:

```bash
ls -lh /usr/share/keyrings/ros-archive-keyring.gpg
```

## 配置 ROS 软件源

在配置软件源时,需要使用新的 `signed-by` 参数明确指定密钥文件路径。以下命令会自动识别系统架构和发行版代号,适用于 amd64、arm64、armhf 等不同架构,以及 Ubuntu 18.04 (bionic)、20.04 (focal)、22.04 (jammy)、24.04 (noble) 等不同版本。

### 官方源配置(推荐)

官方源是最稳定可靠的选择。这里使用 HTTP 协议而非 HTTPS,主要是因为国内网络环境下 HTTPS 连接容易出现证书验证问题,而软件包的安全性已由 GPG 签名保证:

```bash
sudo sh -c 'echo "deb [arch=$(dpkg --print-architecture) \
  signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] \
  http://packages.ros.org/ros/ubuntu $(lsb_release -cs) main" \
  > /etc/apt/sources.list.d/ros-latest.list'
```

### 国内镜像源的现状

清华大学和中国科学技术大学都提供了 ROS 的镜像服务,但截至本文撰写时,这些镜像尚未完成新签名文件的同步。如果尝试使用这些镜像,apt 更新时仍会报告签名验证失败。

清华 TUNA 镜像配置方式如下,但暂时无法正常使用:

```bash
sudo sh -c '. /etc/lsb-release && echo "deb [arch=$(dpkg --print-architecture) \
  signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] \
  https://mirrors.tuna.tsinghua.edu.cn/ros/ubuntu/ $DISTRIB_CODENAME main" \
  > /etc/apt/sources.list.d/ros-latest.list'
```

中科大 USTC 镜像同样存在同步延迟问题:

```bash
sudo sh -c '. /etc/lsb-release && echo "deb [arch=$(dpkg --print-architecture) \
  signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] \
  https://mirrors.ustc.edu.cn/ros/ubuntu/ $DISTRIB_CODENAME main" \
  > /etc/apt/sources.list.d/ros-latest.list'
```

### 更新软件包索引

完成软件源配置后,更新 apt 索引:

```bash
sudo apt update
```

如果更新过程中仍然出现错误,可以检查以下几个方面:系统中是否仍然残留旧密钥、是否错误使用了 HTTPS 导致证书验证失败、是否选用了尚未完成同步的国内镜像。

## 国内镜像与官方源的差异

国内镜像完全依赖官方源的同步,当官方更新密钥时,这种依赖关系会导致短期内的不可用。具体来说,官方源会立即更新签名文件 (InRelease/Release.gpg),而镜像源的同步通常滞后数小时甚至数天。在这段滞后期内,镜像源的签名文件仍然使用旧密钥,导致 apt 校验失败。

因此,在密钥轮换期间,国内用户安装 ROS 时推荐直接使用官方源的 HTTP 模式。虽然下载速度可能不如镜像源,但可以避免因同步延迟导致的安装失败。

## 不同架构下的密钥有效性差异

值得注意的是,在 2025 年 12 月初,旧密钥在不同架构下表现出明显差异。在 amd64 平台的桌面 PC 上,即使使用旧密钥仍然可以正常安装 ROS 包,但在 Jetson Orin NX 等 arm64 设备上,旧密钥已经完全失效。

这种差异源于 ROS 多架构仓库的同步机制。ROS 官方仓库为不同架构维护独立的目录结构,包括 binary-amd64、binary-arm64、binary-armhf 等。每个架构目录对应的签名文件生成时间并不一致,密钥过期后,arm64 的签名文件较早地全部切换到新密钥,而 amd64 目录中部分旧签名文件仍然存在。

从维护优先级来看,amd64 是 ROS 的主要使用架构,其构建链路更为复杂,旧签名文件的清理也相对缓慢。相比之下,arm64 的更新节奏更快,旧签名文件更早被移除。此外,国内网络环境的复杂性也会产生影响,不同架构可能解析到不同的 CDN 节点,部分节点如果尚未同步最新签名,旧密钥可能仍然有效。

但需要强调的是,这种"暂时性可用"并非官方支持的状态。随着 ROS buildfarm 持续更新,各架构的签名文件最终都会统一切换到新密钥,旧密钥迟早会在所有平台上完全失效。

## 旧密钥暂时可用的原因

综合来看,旧密钥在某些系统上仍能使用的原因包括:部分 CDN 节点的签名文件仍保留旧签名、apt 在特定情况下会接受"过期但匹配"的密钥、不同架构的签名文件更新时间存在差异,以及国内部分 CDN 节点的同步延迟。这些都是临时现象,不应作为继续使用旧密钥的理由。

## 迁移建议总结

ROS 官方旧密钥已于 2025 年 6 月 1 日过期,所有用户都应当尽快完成迁移。迁移过程包括删除旧密钥、下载安装新版 ros.asc 密钥文件,以及使用 `signed-by` 参数重新配置 apt 软件源。

鉴于国内镜像目前均未完成同步,建议优先使用官方源的 HTTP 模式。对于 amd64 平台,即使旧密钥暂时仍能使用,这也只是仓库同步滞后导致的临时现象,不应继续依赖。对于 Jetson 等 arm64 设备,新密钥已是必需的。

及时完成密钥迁移,不仅能够避免后续的安装和更新问题,也是维护系统安全性的必要措施。