---
description: usbipd工具的使用
date: '2023-08-14'
author: 'pxx'
categories:
  - Linux
published: true
---



# wsl2挂载usb设备

## 1. 安装USBIPD-WIN 项目(win命令行运行)

```powershell
winget install --interactive --exact dorssel.usbipd-win 
```

## 2. 在Linux中安装USBIP工具和硬件数据库

在wsl中的Ubuntu运行：

```shell
sudo apt install linux-tools-generic hwdata
sudo update-alternatives --install /usr/local/bin/usbip usbip /usr/lib/linux-tools/*-generic/usbip 20
```

## 3. 添加USB设备到ubuntu

通过以**管理员模式打开 PowerShell** 并输入以下命令（win系统命令行）：

```powershell
PS C:\WINDOWS\system32> usbipd wsl list
BUSID  VID:PID    DEVICE                                                        STATE
2-1    1a86:7523  USB-SERIAL CH340 (COM8)                                       Not attached
2-4    046d:c53f  USB 输入设备                                                  Not attached
2-6    0c45:6a10  Integrated Webcam                                             Not attached
2-10   8087:0026  英特尔(R) 无线 Bluetooth(R)                                   Not attached
PS C:\WINDOWS\system32> usbipd wsl attach -b 2-4
PS C:\WINDOWS\system32> usbipd wsl list
BUSID  VID:PID    DEVICE                                                        STATE
2-1    1a86:7523  USB-SERIAL CH340 (COM8)                                       Not attached
2-4    046d:c53f  USB 输入设备                                                  Attached - WSL
2-6    0c45:6a10  Integrated Webcam                                             Not attached
2-10   8087:0026  英特尔(R) 无线 Bluetooth(R)                                   Not attached
```

【linux】查看对应设备是否加载成功

```shell
pxx@Relax:~$ lsusb
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 001 Device 003: ID 1a86:7523 QinHeng Electronics HL-340 USB-Serial adapter
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```

## 4. 卸载USB设备

```
usbipd wsl detach -b 2-4
```



