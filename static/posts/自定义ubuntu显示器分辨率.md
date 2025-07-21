---
description: 在ubuntu上设置自定义的分辨率
date: '2025-04-22'
author: 'pxx'
categories:
  - Linux
published: true
---

> 起因是我在使用sunshine+moonlight进行串流的时候，ipad上的界面无法覆盖整个屏幕
> 直接说结论，使用nvidia显卡的话，使用`nvidia X server`改设置就可以，不用使用xrandr

在 Ubuntu 中添加自定义分辨率，一般可以按照以下步骤进行操作：

1. **查看当前显示设置**：
   打开终端并运行以下命令：
   ```bash
   xrandr
   ```
   这将显示当前显示器的分辨率以及支持的分辨率列表。

2. **创建自定义分辨率**：
   使用 `cvt` 命令生成一个新的分辨率模式。这里的使用ipad air的分辨率
   ```bash
   cvt 2360 1640
   ```
   输出类似于：
   ```
   # 2360x1640 59.94 Hz (CVT) hsync: 101.89 kHz; pclk: 328.50 MHz
    Modeline "2360x1640_60.00"  328.50  2360 2536 2792 3224  1640 1643 1653 1700 -hsync +vsync
   ```

3. **添加新模式**：
   使用 `xrandr` 添加新模式。复制上一步中的 `Modeline` 以后的部分，然后运行以下命令：
   ```bash
   xrandr --newmode "2360x1640_60.00"  328.50  2360 2536 2792 3224  1640 1643 1653 1700 -hsync +vsync
   ```

4. **将模式添加到显示器**：
   找到显示器的名称（比如 `HDMI-0` 或 `eDP-1`），然后将新模式添加到该显示器上：
   ```bash
   xrandr --addmode HDMI-0 "2360x1640_60.00"
   ```

   然而我在这里遇到了问题：
   ```bash
    X Error of failed request:  BadMatch (invalid parameter attributes)
      Major opcode of failed request:  140 (RANDR)
      Minor opcode of failed request:  18 (RRAddOutputMode)
      Serial number of failed request:  41
      Current serial number in output stream:  42
   ```
5. **修改显卡驱动配置文件**
   修改`/etc/X11/xorg.conf`(如果不存在该文件可以执行`sudo nvidia-xconfig`进行创建)
   按照以下修改
   ```conf
    Section "Screen"
        Identifier     "Screen0"
        Device         "Device0"
        Monitor        "Monitor0"
        DefaultDepth    24
        Option         "Stereo" "0"
        Option         "nvidiaXineramaInfoOrder" "DFP-0"
        Option         "metamodes" "HDMI-0: nvidia-auto-select +0+0 {viewportin=2360x1640}"
        Option         "SLI" "Off"
        Option         "MultiGPU" "Off"
        Option         "BaseMosaic" "off"
        SubSection     "Display"
            Depth       24
        EndSubSection   
    ```


6. **设置为当前显示模式**：
   最后，使用以下命令切换到新添加的分辨率：
   ```bash
   xrandr --output HDMI-1 --mode "2360x1640_60.00"
   ```

### 使自定义分辨率持久化
默认情况下，添加的自定义分辨率在重启后会丢失。要使其持久化，可以将相关命令添加到启动脚本中：

1. 打开终端并编辑 `~/.profile` 文件：
   ```bash
   nano ~/.profile
   ```

2. 在文件的末尾添加如下内容：
   ```bash
   xrandr --newmode "2360x1640_60.00"   141.00  1920 2040 2240 2560  1080 1083 1088 1120 -hsync +vsync
   xrandr --addmode HDMI-1 "2360x1640_60.00"
   ```

3. 保存并关闭文件。然后，重新启动系统或手动加载配置：
   ```bash
   source ~/.profile
   ```

