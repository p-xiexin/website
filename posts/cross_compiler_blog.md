---
description: cross compile tools introduction
date: '2025-11-16'
author: 'pxx'
categories:
  - 其他
published: true
---

# 交叉编译器介绍

[Arm GNU Toolchain Downloads – Arm Developer](https://developer.arm.com/downloads/-/arm-gnu-toolchain-downloads)

## 什么是交叉编译器?

在嵌入式开发和跨平台开发中,我们经常会遇到这样的场景:在一台强大的x86架构Linux工作站上开发代码,但最终这些代码需要运行在ARM架构的树莓派或STM32微控制器上。这时候,普通的编译器就无法满足需求了,我们需要使用交叉编译器。

交叉编译器(Cross Compiler)是一种特殊的编译工具,它运行在一个平台上(称为宿主机或主机,Host),但生成的可执行文件却是为另一个平台(称为目标机或目标平台,Target)设计的。这种"在A平台编译,给B平台运行"的能力,就是"交叉"这个词的由来。

为什么需要交叉编译?主要有以下几个原因:

**性能考虑**: 嵌入式设备通常性能有限,在设备上直接编译可能需要几个小时甚至不可行,而在强大的开发机上交叉编译只需几分钟。

**资源限制**: 很多嵌入式系统没有足够的存储空间安装完整的编译工具链,甚至可能没有操作系统。

**开发效率**: 在熟悉的开发环境中工作,使用强大的IDE和调试工具,远比在受限的嵌入式环境中开发效率高。

## 交叉编译器的命名规则

交叉编译器的命名看起来很复杂,但实际上遵循着清晰的逻辑。典型的交叉编译器名称格式如下:

```
<arch>-<vendor>-<os>-<abi>-<tool>
```

让我们通过几个实际例子来理解每个部分的含义:

### 示例1: arm-none-eabi-gcc

这是一个非常常见的用于ARM Cortex-M系列微控制器(如STM32)的交叉编译器:

- **arch (架构)**: `arm` - 表示目标平台是ARM架构
- **vendor (供应商)**: `none` - 表示没有特定供应商,这是一个通用工具链
- **os (操作系统)**: `eabi` - 这里稍微特殊,`eabi`代表Embedded Application Binary Interface,表示这是为裸机(bare-metal)嵌入式系统设计的,没有操作系统
- **tool (工具)**: `gcc` - 表示这是GCC编译器

这个工具链适用于STM32、LPC等不运行Linux的ARM Cortex-M微控制器。

### 示例2: aarch64-linux-gnu-gcc

这是用于64位ARM Linux系统的交叉编译器:

- **arch**: `aarch64` - 表示64位ARM架构(ARM64)
- **vendor**: (隐含为通用)
- **os**: `linux` - 目标平台运行Linux操作系统
- **abi**: `gnu` - 使用GNU标准的应用程序二进制接口
- **tool**: `gcc` - GCC编译器

这个工具链适用于树莓派4(64位模式)、RK3588等运行Linux的ARM64设备。

### 示例3: x86_64-w64-mingw32-gcc

这是在Linux上为Windows编译程序的交叉编译器:

- **arch**: `x86_64` - 64位x86架构
- **vendor**: `w64` - 表示64位Windows
- **os**: `mingw32` - Minimalist GNU for Windows,Windows环境
- **tool**: `gcc` - GCC编译器

### 命名与宿主机、目标机的关系

这里需要特别注意:**交叉编译器的名称只描述目标平台,不包含宿主机信息**。

- **宿主机(Host)**: 运行编译器的机器,可能是x86_64 Linux、Windows等
- **目标机(Target)**: 编译出的程序将要运行的机器

例如,`arm-none-eabi-gcc`这个名称告诉我们:
- 编译出的程序将运行在ARM裸机系统上(目标机)
- 但它没有告诉我们这个编译器本身运行在哪个平台上(宿主机)

同一个目标平台,可能有多个针对不同宿主机的交叉编译器版本:
- `arm-none-eabi-gcc` for Linux x86_64
- `arm-none-eabi-gcc` for Windows x86_64
- `arm-none-eabi-gcc` for macOS

它们的名字相同,但实际是不同的可执行文件,分别在不同的宿主系统上运行,但都生成相同的ARM裸机代码。

## 如何选择合适的交叉编译器

选择交叉编译器需要同时考虑宿主机和目标机两个维度。

### 第一步:明确目标平台

首先要搞清楚代码最终运行在什么设备上:

**裸机微控制器(如STM32系列)**:
- STM32F103(Cortex-M3): 需要 `arm-none-eabi-gcc`
- STM32H7(Cortex-M7): 需要 `arm-none-eabi-gcc`
- 这些芯片不运行操作系统,直接在硬件上运行

**ARM Linux设备**:
- RK3588(ARM64): 需要 `aarch64-linux-gnu-gcc` 或 `aarch64-none-linux-gnu-gcc`
- 树莓派4(64位): 需要 `aarch64-linux-gnu-gcc`
- 树莓派3(32位): 需要 `arm-linux-gnueabihf-gcc`

关键区别在于:
- 有操作系统 → 名称中包含`linux`
- 裸机系统 → 名称中包含`none-eabi`
- 64位ARM → `aarch64`
- 32位ARM → `arm`

### 第二步:确定宿主机平台

接下来要根据开发环境选择对应的工具链安装包:

**宿主机是Linux系统**:

对于Ubuntu/Debian,可以使用apt安装:
```bash
# 为STM32等裸机ARM开发
sudo apt-get install gcc-arm-none-eabi

# 为ARM64 Linux设备开发(如RK3588)
sudo apt-get install gcc-aarch64-linux-gnu

# 为32位ARM Linux设备开发
sudo apt-get install gcc-arm-linux-gnueabihf
```

也可以下载官方预编译包,选择`linux`或`linux-x86_64`版本。

**宿主机是Windows系统**:

需要下载Windows版本的工具链:

对于STM32开发,从ARM官网下载`gcc-arm-none-eabi-*-win32.exe`或`.zip`文件。这些工具链通常自带MinGW环境,可以直接在Windows上运行。

也可以使用MSYS2或Cygwin环境,然后在这些类Unix环境中安装交叉编译器。

**宿主机是macOS系统**:

可以使用Homebrew安装:
```bash
brew install arm-none-eabi-gcc
brew install aarch64-elf-gcc
```

或者下载macOS版本的预编译包。

### 实际案例分析

**案例1: 在Linux上为STM32开发**

- 宿主机: Ubuntu 22.04 x86_64
- 目标平台: STM32F407(ARM Cortex-M4,裸机)
- 需要的工具链: `gcc-arm-none-eabi` (Linux版本)

安装方式:
```bash
sudo apt-get install gcc-arm-none-eabi gdb-arm-none-eabi
```

验证安装:
```bash
arm-none-eabi-gcc --version
```

**案例2: 在Windows上为RK3588开发Linux应用**

- 宿主机: Windows 11 x86_64
- 目标平台: RK3588(ARM64,运行Linux)
- 需要的工具链: `aarch64-linux-gnu-gcc` (Windows版本)

可以选择:
1. 使用WSL(Windows Subsystem for Linux),在WSL中按Linux方式安装
2. 下载Linaro或ARM官方提供的Windows版本工具链
3. 使用芯片厂商提供的SDK中自带的交叉编译器

**案例3: 在Linux上为Windows编译程序**

- 宿主机: Ubuntu x86_64
- 目标平台: Windows x86_64
- 需要的工具链: `x86_64-w64-mingw32-gcc`

安装方式:
```bash
sudo apt-get install mingw-w64
```

## 工具链的组成

一个完整的交叉编译工具链不仅仅是编译器,通常包括:

- **编译器**: `xxx-gcc`, `xxx-g++` - 将源代码编译成目标代码
- **汇编器**: `xxx-as` - 将汇编代码转换成机器码
- **链接器**: `xxx-ld` - 将目标文件链接成可执行文件
- **调试器**: `xxx-gdb` - 远程调试工具
- **二进制工具**: `xxx-objcopy`, `xxx-objdump`, `xxx-size` 等 - 用于处理和分析二进制文件
- **标准库**: C标准库和运行时支持

所有这些工具都使用相同的前缀,例如`arm-none-eabi-*`,确保它们协同工作。

## 常见陷阱和注意事项

**库的兼容性**: 交叉编译时链接的库必须是为目标平台编译的,不能使用宿主机的库。例如,在Linux上为STM32编译时,不能链接`/usr/lib`中的库。

**字节序问题**: ARM通常是小端序,某些PowerPC是大端序,处理二进制数据时需要注意。

**浮点ABI**: ARM有多种浮点ABI(`hard`, `soft`, `softfp`),工具链名称中的`hf`表示hard float,选择时要与目标系统匹配。

**系统调用差异**: 裸机系统(eabi)和Linux系统的系统调用完全不同,代码不能混用。

## 总结

选择交叉编译器的核心是理解两个概念:

1. **宿主机(Host)**: 在哪里编译 - 决定了下载哪个版本的安装包
2. **目标机(Target)**: 代码在哪里运行 - 决定使用哪个工具链

工具链的命名直接反映了目标平台的特征:架构、操作系统类型、ABI规范。掌握了这套命名规则,就能轻松找到所需的工具链,无论是为STM32这样的微控制器开发,还是为RK3588这样的应用处理器开发Linux程序。

记住:同一个目标平台可能有多个不同宿主机版本的工具链,但它们的名字是相同的,都描述的是目标平台的特征。选择时,先看目标平台确定工具链名称,再根据宿主机选择对应的安装包版本。