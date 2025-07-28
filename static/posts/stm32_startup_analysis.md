---
description: stm32启动过程详解
date: '2025-07-28'
author: 'pxx'
categories:
  - MCU
published: true
---



# STM32启动过程详解：从上电到main()的完整历程

在嵌入式开发中，很多初学者习惯性地认为程序是从main()函数开始执行的。但实际上，在main()函数被调用之前，系统已经悄悄地完成了大量的初始化工作。以STM32为例，探究这个神秘的启动过程。

## 1. 硬件复位：一切的开始

当STM32芯片上电或者复位引脚被拉低时，芯片内部的复位电路开始工作。这个过程中，所有的寄存器都被设置为默认值，CPU核心进入复位状态。

复位完成后，STM32的ARM Cortex-M内核会自动执行一个固定的启动序列。这个序列是硬件层面的，不需要任何软件干预。CPU会自动从内存地址0x00000000开始读取启动信息。

STM32的启动过程有一个独特之处：它不是从传统的"复位地址"开始执行代码，而是从中断向量表开始。在ARM Cortex-M架构中，内存地址0x00000000处存放的不是第一条指令，而是栈指针的初始值。紧接着的0x00000004地址存放的才是复位中断处理程序的地址。

这种设计体现了ARM的智慧：在执行任何代码之前，先确保栈指针被正确设置。因为即使是最简单的函数调用也需要栈的支持。

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

## 2. 启动代码的精密编排

当CPU读取到复位向量后，程序跳转到Reset_Handler标签处开始执行。这个Reset_Handler就是我们常说的启动代码（startup code），通常位于startup_stm32xxxx.s文件中。

### 系统时钟

启动代码的第一个重要任务是配置系统时钟。STM32芯片复位后默认使用内部RC振荡器（HSI），频率通常只有8MHz或16MHz。但现代STM32芯片的性能远不止于此，它们需要更高的工作频率来发挥最佳性能。

```assembly
Reset_Handler:
    ; 首先设置栈指针（虽然硬件已经设置了，但这里再次确认）
    ldr sp, =_estack
    
    ; 调用系统时钟配置函数
    bl SystemInit
    
    ; 继续后续初始化...
```

SystemInit()函数是用C语言编写的，它负责配置PLL（锁相环）、选择时钟源、设置分频器等。这个过程就像为整个系统装上了一颗强劲的心脏，让所有外设都能以最佳速度运行。

### 内存数据段和BSS段初始化

接下来，启动代码需要准备C语言运行环境。C程序中的全局变量和静态变量需要被正确初始化，这涉及到两个重要的内存段：

**数据段（.data section）的复制过程**

数据段包含了所有已初始化的全局变量和静态变量。这些变量的初始值在编译时就确定了，存储在Flash存储器中。但C程序运行时需要访问的是RAM中的副本，因为Flash通常是只读的。

```assembly
; 复制数据段从Flash到RAM
ldr r0, =_sdata      ; RAM中数据段的起始地址
ldr r1, =_edata      ; RAM中数据段的结束地址
ldr r2, =_sidata     ; Flash中数据段初始值的地址

movs r3, #0
b LoopCopyDataInit

CopyDataInit:
    ldr r4, [r2, r3]     ; 从Flash读取数据
    str r4, [r0, r3]     ; 写入到RAM
    adds r3, r3, #4      ; 移动到下一个字

LoopCopyDataInit:
    adds r4, r0, r3      ; 计算当前地址
    cmp r4, r1           ; 是否到达结束地址
    bcc CopyDataInit     ; 如果没有，继续复制
```

这个过程就像搬家一样，把所有的"家具"（初始化的变量）从"仓库"（Flash）搬到"新家"（RAM）。

**BSS段的清零**

BSS段包含了所有未初始化的全局变量和静态变量。按照C语言标准，这些变量应该被初始化为0。但它们在编译时并不占用Flash空间，只在RAM中分配空间。

```assembly
; 清零BSS段
ldr r2, =_sbss       ; BSS段起始地址
ldr r4, =_ebss       ; BSS段结束地址
movs r3, #0          ; 清零值
b LoopFillZerobss

FillZerobss:
    str r3, [r2], #4     ; 写入0并递增地址

LoopFillZerobss:
    cmp r2, r4           ; 是否到达结束地址
    bcc FillZerobss      ; 如果没有，继续清零
```

### 浮点单元的准备工作

对于带有FPU（浮点处理单元）的STM32芯片，启动代码还需要启用浮点运算功能。这涉及到设置CPACR（协处理器访问控制寄存器）来允许访问浮点协处理器。

```assembly
; 启用FPU (如果存在)
ldr r0, =0xE000ED88    ; CPACR寄存器地址
ldr r1, [r0]
orr r1, r1, #(0xF << 20) ; 设置CP10和CP11的访问权限
str r1, [r0]
dsb                    ; 数据同步屏障
isb                    ; 指令同步屏障
```

## 3. C运行时环境的最终准备

完成了硬件层面的初始化后，启动代码开始为C语言程序创建运行环境。这个过程包括几个关键步骤：

### 全局构造函数的调用

在C++程序中，全局对象的构造函数需要在main()函数之前被调用。即使在C程序中，某些特殊的初始化函数（如__attribute__((constructor))标记的函数）也需要在此时执行。

```assembly
; 调用全局构造函数（如果存在）
ldr r0, =__preinit_array_start
ldr r1, =__preinit_array_end
bl __libc_init_array
```

### 标准库的初始化

如果程序使用了C标准库（如printf、malloc等函数），这些库函数的内部数据结构也需要被初始化。这通常由__libc_init_array()函数完成。

### 栈溢出保护的设置

在调试版本中，启动代码可能会在栈的底部设置特殊的标记值，用于检测栈溢出。这是一个重要的调试功能，可以帮助开发者及早发现栈溢出问题。

## 4. main()函数进入

经过了这一系列复杂的初始化过程，系统终于准备好运行用户代码了。此时，启动代码会调用main()函数：

```assembly
; 最终跳转到main函数
bl main

; 如果main函数返回，进入无限循环
b .
```

这个看似简单的"bl main"指令，实际上标志着系统从启动阶段转入正常运行阶段的重要时刻。
