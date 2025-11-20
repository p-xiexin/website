---
description: stm32启动过程详解
date: '2025-07-28'
author: 'pxx'
categories:
  - MCU
published: true

---

# STM32启动过程详解：从上电到main()的完整历程

在嵌入式开发中，很多初学者习惯性地认为程序是从main()函数开始执行的。但实际上，在main()函数被调用之前，系统已经悄悄地完成了大量的初始化工作。

```
上电复位
   ↓
取出 MSP = _estack
取出 PC  = Reset_Handler
   ↓
Reset_Handler:
   1) 复制 .data
   2) 清零 .bss
   3) SystemInit → 配置时钟
   4) 调用 main
```

## 1. 硬件复位：一切的开始

当STM32芯片上电或者复位引脚被拉低时，芯片内部的复位电路开始工作。这个过程中，所有的寄存器都被设置为默认值，CPU核心进入复位状态。

复位完成后，STM32的ARM Cortex-M内核会自动执行一个固定的启动序列。这个序列是硬件层面的，不需要任何软件干预。CPU会自动从内存地址0x00000000开始读取启动信息。

STM32的启动过程有一个独特之处：它不是从传统的"复位地址"开始执行代码，而是从中断向量表开始。在ARM Cortex-M架构中，内存地址0x00000000处存放的不是第一条指令，而是栈指针的初始值。紧接着的0x00000004地址存放的才是复位中断处理程序的地址。

这种设计体现了ARM的智慧：在执行任何代码之前，先确保栈指针被正确设置。因为即使是最简单的函数调用也需要栈的支持。CPU需要一个栈来保存“现场”，确保能够正确的进入中断服务程序（ISR）进行处理。因此，栈指针的初始值必须指向一个有效的内存区域，通常是内存中的某个高地址（即栈顶）。

```assembly
; 典型的STM32中断向量表开始部分
.section .isr_vector,"a",%progbits
.type g_pfnVectors, %object
.size g_pfnVectors, .-g_pfnVectors

g_pfnVectors:
  .word  _estack                    ; 0x00000000: 栈顶指针
  .word  Reset_Handler              ; 0x00000004: 复位中断处理程序
  .word  NMI_Handler                ; 0x00000008: NMI中断处理程序
  .word  HardFault_Handler          ; 0x0000000C: 硬件错误中断处理程序
  ; ... 更多中断向量
```

这里 `_estack` 在链接脚本中由 `RAM` 段的最高地址定义（一般是 0x20020000）。

```asm
_estack = ORIGIN(RAM) + LENGTH(RAM);
```

## 2. Reset_Handler：真正的启动流程核心

当CPU读取到复位向量后，程序跳转到Reset_Handler标签处开始执行。这个Reset_Handler就是我们常说的启动代码（startup code），通常位于startup_stm32xxxx.s文件中。

这里以`startup_stm32f40_41xxx.s`为例说明：

```asm
/**
 * @brief  This is the code that gets called when the processor first
 *          starts execution following a reset event. Only the absolutely
 *          necessary set is performed, after which the application
 *          supplied main() routine is called. 
 * @param  None
 * @retval : None
*/

    .section  .text.Reset_Handler
  .weak  Reset_Handler
  .type  Reset_Handler, %function
Reset_Handler:  

/* Copy the data segment initializers from flash to SRAM */  
  movs  r1, #0 准备一个寄存器 r1，初始值为 0，用于复制/清零循环。
  b  LoopCopyDataInit 
```

在 ARM/GCC 的汇编里，**section（段）就是编译出来的程序在内存中的分类区域**，比如：

- `.text` → 存放代码（只读）
- `.data` → 存放初始化的全局变量
- `.bss`  → 存放未初始化的全局变量

这个语句：

```asm
.section .text.Reset_Handler
```

意思是：

- 新建（或切换到）一个名为 `.text.Reset_Handler` 的 **代码段**
- 后面写的指令会放到这个段中
- 链接脚本会把这个段安排到 Flash 的恰当位置（通常靠近 `.text`）

### 2.1 复制.data段

```asm
CopyDataInit:
  ldr  r3, =_sidata        ; r3 = Flash 中 .data 初始值的起始地址（源地址）
  ldr  r3, [r3, r1]        ; 从 _sidata + offset(r1) 取 4 字节到 r3
  str  r3, [r0, r1]        ; 将 r3 写入到 _sdata + offset(r1)（SRAM 目的地址）
  adds  r1, r1, #4         ; offset += 4，准备复制下一个字（32bit）
    
LoopCopyDataInit:
  ldr  r0, =_sdata         ; r0 = SRAM 中 .data 区域的起始地址（目的地址）
  ldr  r3, =_edata         ; r3 = SRAM 中 .data 区域的结束地址
  adds  r2, r0, r1         ; r2 = 当前目的地址 = _sdata + offset
  cmp  r2, r3              ; 判断目的地址是否到达 .data 末尾
  bcc  CopyDataInit        ; 若 r2 < r3，继续复制下一个字
  
  ldr  r2, =_sbss          ; r2 = .bss 段起始地址，为后续清零做准备
  b  LoopFillZerobss       ; 跳转去执行清零 .bss

```

- `.data` 段包含**已初始化的全局变量与静态变量**。
- 在 Flash 中这些变量的初始值存放在 `_sidata`。
- 启动时必须把这些初始值复制到 SRAM 中的 `_sdata ~ _edata`。

执行动作：

1. 使用 `r1` 作为偏移量。
2. 从 Flash 的 `_sidata + r1` 读取 4 字节。
3. 写到 SRAM 的 `_sdata + r1`。
4. 偏移递增，直到达到 `_edata` 为止。

整个过程确保程序中诸如：

```c
int a = 5;
static int b = 9;
```

这些变量在 RAM 中得到正确初始化。

### 2.2 清零.bss段（未初始化的全局变量）

```asm
/* Zero fill the bss segment. */
FillZerobss:
  movs r3, #0              ; r3 = 0
  str  r3, [r2], #4        ; 将 0 写入当前地址，同时 r2 += 4

LoopFillZerobss:
  ldr  r3, =_ebss          ; r3 = .bss 的结束地址
  cmp  r2, r3              ; 是否到达 bss 结束？
  bcc  FillZerobss         ; 未到结束则继续写 0
```

`.bss` 段存放**未初始化的全局变量与静态变量**。

```c
int counter;
static int flag;
```

C 语言标准要求这些变量在程序启动前必须自动置 0。

执行动作：

1. 从 `_sbss` 开始。
2. 每次写入一个字（4 字节）为 0。
3. 写满到 `_ebss`。

这确保所有未初始化变量都从 `0` 开始运行。

### 2.3 调用 SystemInit()（配置系统时钟等）

启动代码的第一个重要任务是配置系统时钟。STM32芯片复位后默认使用内部RC振荡器（HSI），频率通常只有8MHz或16MHz。但现代STM32芯片的性能远不止于此，它们需要更高的工作频率来发挥最佳性能。

```assembly
/* Call the clock system intitialization function.*/
  bl  SystemInit   
/* Call the application's entry point.*/
  bl  main   ; 跳转执行 C 程序入口 main()
  bx  lr     ; main 返回
.size  Reset_Handler, .-Reset_Handler
```

SystemInit()函数是用C语言编写的（位于 system_stm32f4xx.c），它负责配置PLL（锁相环）、选择时钟源、设置分频器等。这个过程就像为整个系统装上了一颗强劲的心脏，让所有外设都能以最佳速度运行。

### 2.4 默认中断

```asm
/**
 * @brief  This is the code that gets called when the processor receives an 
 *         unexpected interrupt.  This simply enters an infinite loop, preserving
 *         the system state for examination by a debugger.
 * @param  None     
 * @retval None       
*/

/* 默认中断处理函数：进入无限循环，便于调试 */
.section .text.Default_Handler,"ax",%progbits
Default_Handler:
Infinite_Loop:
  b Infinite_Loop
  .size Default_Handler, .-Default_Handler
```

当发生未定义的中断/异常时，执行无限循环，所有未定义的中断都跳到这里，保持现场供调试器检查。

### 2.5 中断向量表

```asm
/* 中断向量表，需放在物理地址 0x00000000 */
.section .isr_vector,"a",%progbits
.type  g_pfnVectors, %object
.size  g_pfnVectors, .-g_pfnVectors


g_pfnVectors:
  .word _estack
  .word Reset_Handler
  .word NMI_Handler
  .word HardFault_Handler
  …
```

`"a"` = **allocatable**（需要分配内存）

`%progbits` 表示：

> 段中包含普通的程序内容（比如常量、代码、数据等）。

与之相对的是 `%nobits` → 不需要储存（如 `.bss` 清零段）。

ISR 表是实际的数据（地址列表），所以属于 **progbits**。

## 3. 其他

| 关键字            | 用途                 |
| ----------------- | -------------------- |
| `.section`        | 放入指定段           |
| `.word`           | 放入 4 字节常量      |
| `.global`         | 对其他文件可见       |
| `.weak`           | 弱符号，可被覆盖     |
| `.type`           | 说明这是个函数或对象 |
| `.thumb_set a, b` | 让符号 a 等同于 b    |
| `ldr rX, =符号`   | 取地址（伪指令）     |
| `b`、`bl`         | 跳转、函数调用       |
| `str`、`ldr`      | 内存存/取            |
| `cmp` + 条件跳转  | 判断循环             |

### 3.1 文件头部与编译器设置

```asm
.syntax unified
.cpu cortex-m4
.fpu softvfp
.thumb
```

- **.syntax unified**：启用 ARM 的 Unified 汇编语法（ARM/Thumb 共用风格）。
- **.cpu cortex-m4**：告诉汇编器目标 CPU 是 Cortex-M4。
- **.fpu softvfp**：使用软件浮点（编译器不生成硬件 FPU 指令）。
- **.thumb**：使用 Thumb 指令集（32/16 位混合，更省空间）。

这些只是告诉编译器要用什么风格解释后面的指令。

### 3.2 声明全局符号

```asm
.global  g_pfnVectors
.global  Default_Handler
```

- **.global**：声明这些符号在其他文件可见（类似 C 的 `extern`）。

### 3.3 导入链接脚本中的段地址

```asm
.word _sidata
.word _sdata
.word _edata
.word _sbss
.word _ebss
```

- **.word**：放置一个 32 位数（这里是地址）。
- 这些符号来自 *链接脚本*，用于初始化 `.data` 和 `.bss`。

### 3.4 所有中断处理函数做弱定义（weak alias）

例如：

```asm
.weak NMI_Handler
.thumb_set NMI_Handler,Default_Handler
```

- **.weak**：允许用户在 C 文件里重新定义同名函数。
- **.thumb_set A, B**：让符号 A 指向符号 B（类似 C 的 `#define A B`）。

## 4. 总结

1. **向量表必须放在 Flash 起始地址**
2. `Reset_Handler` 负责初始化 C 运行环境
3. `.data` 必须复制，`.bss` 必须清零
4. `SystemInit()` 配置系统时钟，是性能的基础
5. 链接脚本决定所有内存地址和布局
6. 最终跳转到用户的 `main()` 执行
