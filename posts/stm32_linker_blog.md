---
description: stm32链接脚本
date: '2025-11-20'
author: 'pxx'
categories:
  - MCU
published: true
---

# 了解STM32链接脚本：从代码到硬件的桥梁

在上一篇文章中，我们深入分析了STM32F4的启动代码如何初始化硬件、设置堆栈和跳转到main函数。你可能会好奇，启动代码是从哪里获得这些内存地址的？为什么堆栈要放在RAM的末尾？为什么要把初始化数据从FLASH复制到RAM？这一切的答案都藏在一个文件里——**链接脚本**。链接脚本是连接编译和运行的桥梁，它定义了代码和数据在内存中的布局。

## 什么是链接脚本？

链接脚本是一个文本文件，它告诉链接器（linker）如何将目标文件中的各个段（section）组织和放置到最终的可执行文件中。对于微控制器来说，这是一个至关重要的配置文件，因为不同类型的内存有不同的特性和用途。

简单来说，链接脚本就是代码和硬件之间的"翻译官"。

让我们从编译流程开始理解链接脚本的角色。当我们编写C代码或汇编代码后，编译器和汇编器会将其转换为目标文件（.o文件）。这些目标文件包含了机器码和符号表，但它们还不能直接运行在微控制器上——这是因为目标文件中使用的地址都是相对地址或待定地址，需要一个**链接器**（Linker）来最终确定。

链接脚本的作用就是指导链接器完成以下工作：

1. **内存区域划分**：告诉链接器系统中有哪些内存，每个内存的起始地址和大小是多少
2. **段的分配**：决定每个代码段和数据段应该放在哪个内存区域
3. **符号定义**：为启动代码和运行时代码创建必要的全局符号
4. **地址计算**：自动计算各个段的加载地址和执行地址
5. **内存检查**：验证代码和数据的总大小是否超过可用内存

## STM32F407的内存架构

在深入链接脚本之前，我们先了解STM32F407的内存布局：

- **CCMRAM（核心耦合内存）**：64KB，位于0x10000000，访问速度最快，但容量最小
- **RAM（主存储器）**：128KB，位于0x20000000，通用易用的工作内存
- **FLASH（程序存储器）**：1024KB，位于0x8000000，存储程序代码和常量

每种内存都有自己的用途。FLASH是持久化存储，断电后数据不丢失；RAM是易失性存储，用于动态分配和栈操作；CCMRAM虽然容量小，但速度最快，适合实时性要求高的应用。

## 整体结构

STM32CubeIDE生成的链接脚本通常包括以下几个主要部分：

```ld
/* 1. 入口点定义 */
ENTRY(Reset_Handler)

/* 2. 全局符号定义 */
_estack = ORIGIN(RAM) + LENGTH(RAM);
_Min_Heap_Size = 0x200;
_Min_Stack_Size = 0x400;

/* 3. 内存区域定义 */
MEMORY { ... }

/* 4. 段的分配和布局 */
SECTIONS { ... }
```

## 链接脚本的关键部分

在整个链接脚本中，我们看到很多使用`PROVIDE`或`PROVIDE_HIDDEN`的地方。让我们理解这个重要概念。

`PROVIDE`的作用是：如果某个符号还没有被定义（比如在任何目标文件中都没有定义），那么链接脚本就定义这个符号，赋予它一个特定的值。如果这个符号已经被定义过，`PROVIDE`就不做任何事情。

这对于编写可移植的启动代码非常有用。启动代码可以使用`__init_array_start`这样的符号，而不用担心它们是否真的被定义了。如果用户的代码没有C++全局对象，这个符号可能不存在，但`PROVIDE`会创建一个空的定义。

`PROVIDE_HIDDEN`与`PROVIDE`类似，只是创建的符号对动态链接器隐藏。

### 0. 入口点和启动符号

```ld
ENTRY(Reset_Handler)
```

这一行告诉链接器，程序的入口点是`Reset_Handler`函数。链接器会找到这个符号在代码中的位置，并将其地址写入可执行文件的头部。当微控制器复位时，硬件会跳转到FLASH的起始地址加上一个偏移量，这个偏移量就指向了`Reset_Handler`。

```ld
_estack = ORIGIN(RAM) + LENGTH(RAM);
```

它动态计算RAM的末尾地址。假设RAM从0x20000000开始，大小为128KB（0x20000），那么`_estack`就被计算为0x20000000 + 0x20000 = 0x20020000。在启动代码中，我们看到：

```assembly
ldr   sp, =_estack
```

这条指令加载的就是这个动态计算出的地址。链接器在链接时会将`=_estack`替换为实际的地址值。这样做的好处是，如果你改变了链接脚本中RAM的大小，启动代码无需修改，因为`_estack`会自动重新计算。

```ld
_Min_Heap_Size = 0x200;     /* 512字节 */
_Min_Stack_Size = 0x400;    /* 1024字节 */
```

这些符号定义了堆和栈的最小需求大小。这些值是可以根据应用需求调整的。例如，如果你的程序需要大量动态分配内存，就应该增加`_Min_Heap_Size`。链接脚本会根据这些值进行内存检查，如果堆栈空间不足，链接器会报错。

### 1. 内存定义

```
MEMORY
{
  CCMRAM (xrw) : ORIGIN = 0x10000000, LENGTH = 64K
  RAM (xrw)    : ORIGIN = 0x20000000, LENGTH = 128K
  FLASH (rx)   : ORIGIN = 0x8000000,  LENGTH = 1024K
}
```

这部分声明了系统中可用的内存区域。括号中的属性表示访问权限：

CCMRAM是STM32F4的一个特殊功能。CCM代表"Core Coupled Memory"，它与CPU的数据路径直接相连，不需要通过系统总线，因此访问速度比普通RAM快得多。这使得CCMRAM非常适合存储性能关键的代码或数据，比如中断处理程序的关键部分或频繁访问的数据结构。

注意FLASH只有**rx**权限（只读可执行），这符合其本质——程序代码必须可执行，但在运行时不应被修改。

### 2. SECTIONS块：段的布局

SECTIONS块是链接脚本最复杂也最重要的部分，它详细定义了代码和数据如何分配到各个内存区域。

#### 中断向量表段

```ld
.isr_vector :
{
  . = ALIGN(4);
  KEEP(*(.isr_vector))
  . = ALIGN(4);
} >FLASH
```

这个段必须放在FLASH的绝对最前面。当STM32F4启动时，硬件会读取FLASH起始地址处的数据，第一个字（4字节）应该是栈顶地址，第二个字应该是复位处理程序的地址。这就是中断向量表。

让我们分解这个语法：

- `. = ALIGN(4);`：确保当前位置按4字节对齐。这很重要因为中断向量表中的地址都应该是4字节边界
- `KEEP(*(.isr_vector))`：KEEP命令确保即使启用了垃圾回收（某些编译器选项会移除未使用的段），这个段也不会被移除。`*(.isr_vector)`表示来自所有输入文件的.isr_vector段都会被包含进来
- `>FLASH`：指定这个段存储在FLASH中

在启动代码中，中断向量表通常被定义为一个数组：

```c
const uint32_t isr_vector[112] __attribute__((section(".isr_vector"))) = {
    (uint32_t)&_estack,           /* 栈顶地址 */
    (uint32_t)Reset_Handler,      /* 复位处理程序 */
    (uint32_t)NMI_Handler,        /* NMI异常处理程序 */
    /* ... 更多异常处理程序 ... */
};
```

`__attribute__((section(".isr_vector")))`这个GCC扩展告诉编译器将这个数组放在.isr_vector段中，链接脚本会将其链接到FLASH的最开始。

#### 代码段

```ld
.text :
{
  . = ALIGN(4);
  *(.text)
  *(.text*)
  *(.glue_7)
  *(.glue_7t)
  *(.eh_frame)

  KEEP (*(.init))
  KEEP (*(.fini))

  . = ALIGN(4);
  _etext = .;
} >FLASH
```

这个段包含所有可执行代码：

- `*(.text)`和`*(.text*)`：来自所有输入文件的.text和.text.开头的段。编译器生成的所有函数代码都在.text段中
- `*(.glue_7)`和`*(.glue_7t)`：这些是ARM编译器生成的"胶合代码"，用于在ARM和Thumb指令集之间切换。当代码从ARM切换到Thumb（或反过来）时，需要这些过渡代码
- `*(.eh_frame)`：异常处理帧信息，用于C++异常处理和栈展开
- `KEEP (*(.init))`和`KEEP (*(.fini))`：C++全局构造函数和析构函数的代码，KEEP确保它们不被移除

最后一行`_etext = .;`创建了一个符号，标记代码段的末尾。启动代码或其他部分可能会使用这个符号。这里的`.`代表当前链接位置。

#### 只读数据段

```ld
.rodata :
{
  . = ALIGN(4);
  *(.rodata)
  *(.rodata*)
  . = ALIGN(4);
} >FLASH
```

.rodata（read-only data）段存储所有不可修改的常量数据：

- 字符串字面量：`const char *str = "Hello";`
- 常数数组：`const int primes[] = {2, 3, 5, 7};`
- 常数结构体：`const Config cfg = {...};`

将这些数据放在FLASH中可以节省宝贵的RAM空间。当代码需要这些常量时，CPU直接从FLASH读取。

#### ARM扩展信息段

```ld
.ARM.extab   : {
  . = ALIGN(4);
  *(.ARM.extab* .gnu.linkonce.armextab.*)
  . = ALIGN(4);
} >FLASH

.ARM : {
  . = ALIGN(4);
  __exidx_start = .;
  *(.ARM.exidx*)
  __exidx_end = .;
  . = ALIGN(4);
} >FLASH
```

这两个段是ARM特定的数据，用于异常处理和栈展开。当发生异常时，系统需要这些信息来正确地展开栈。`__exidx_start`和`__exidx_end`符号标记了异常索引表的边界，运行时代码会使用这些符号。

#### 初始化数组段

```ld
.preinit_array :
{
  . = ALIGN(4);
  PROVIDE_HIDDEN (__preinit_array_start = .);
  KEEP (*(.preinit_array*))
  PROVIDE_HIDDEN (__preinit_array_end = .);
  . = ALIGN(4);
} >FLASH

.init_array :
{
  . = ALIGN(4);
  PROVIDE_HIDDEN (__init_array_start = .);
  KEEP (*(SORT(.init_array.*)))
  KEEP (*(.init_array*))
  PROVIDE_HIDDEN (__init_array_end = .);
  . = ALIGN(4);
} >FLASH

.fini_array :
{
  . = ALIGN(4);
  PROVIDE_HIDDEN (__fini_array_start = .);
  KEEP (*(SORT(.fini_array.*)))
  KEEP (*(.fini_array*))
  PROVIDE_HIDDEN (__fini_array_end = .);
  . = ALIGN(4);
} >FLASH
```

这三个段对于C++程序至关重要。它们存储了全局对象构造函数和析构函数的指针：

- `.preinit_array`：前期初始化函数（通常由系统库使用）
- `.init_array`：初始化函数，包含全局对象的构造函数
- `.fini_array`：终止函数，包含全局对象的析构函数

启动代码会遍历这些数组，依次调用其中的函数指针：

```c
typedef void (*func_ptr)(void);

extern func_ptr __init_array_start;
extern func_ptr __init_array_end;

for (func_ptr *f = &__init_array_start; f < &__init_array_end; f++) {
    (*f)();  /* 调用每个全局对象的构造函数 */
}
```

这样，即使在嵌入式环境中，C++全局对象也能正确地初始化。

#### 初始化数据的处理

这是链接脚本最重要的部分，值得深入讨论。

考虑以下C代码：

```c
int counter = 42;
static uint8_t table[256] = {0, 1, 2, ..., 255};
const char *message = "System Started";
```

这些是初始化的全局变量。在程序启动时，它们需要有特定的初始值。但这里有一个问题：

1. 如果这些变量存储在RAM中（程序运行时需要快速访问），那么掉电后数据就会丢失
2. 如果这些变量存储在FLASH中，我们就无法修改它们（比如`counter++`会失败）

C语言中的通用解决方案是：

- 初始化数据在FLASH中存储一份"镜像"（模板）
- 程序启动时，将这份镜像从FLASH复制到RAM
- 运行时对RAM中的副本进行修改

这正是链接脚本和启动代码要做的事情。

```ld
_sidata = LOADADDR(.data);

.data :
{
  . = ALIGN(4);
  _sdata = .;
  *(.data)
  *(.data*)

  . = ALIGN(4);
  _edata = .;

} >RAM AT> FLASH
```

这里的关键语法是`>RAM AT> FLASH`。让我们分解：

- `>RAM`：VMA（Virtual Memory Address），即运行时地址。这告诉链接器，在程序运行时，.data段的地址应该在RAM中
- `AT> FLASH`：LMA（Load Memory Address），即加载地址。这告诉链接器，在可执行文件中，.data段的实际内容应该存储在FLASH中

换句话说，`.data`段在可执行文件和FLASH中位于`_sidata`地址，但在运行时应该被映射到RAM中的`_sdata`地址。

三个符号的含义：

- `_sidata`：FLASH中初始化数据的起始地址（Source In DAta）
- `_sdata`：RAM中初始化数据的起始地址（Start DATa）
- `_edata`：RAM中初始化数据的结束地址（End DATa）

对于C++程序，这个机制尤其重要。全局对象的成员变量需要被正确初始化：

```cpp
class Logger {
public:
    Logger() : level(INFO), initialized(true) {}
    
private:
    int level = INFO;
    bool initialized = false;
};

Logger g_logger;  /* 全局对象 */
```

当程序启动时，链接器会在FLASH中创建`g_logger`对象的初始状态镜像。启动代码通过上述复制机制将其复制到RAM，然后再调用构造函数来进行额外的初始化。

#### 未初始化数据段（BSS段）

```ld
. = ALIGN(4);
.bss :
{
  _sbss = .;
  __bss_start__ = _sbss;
  *(.bss)
  *(.bss*)
  *(COMMON)

  . = ALIGN(4);
  _ebss = .;
  __bss_end__ = _ebss;
} >RAM
```

BSS（Block Started by Symbol）段存储所有未初始化或初始化为0的全局变量：

```c
int uninitialized_var;           /* 存放在.bss中 */
static int static_var;            /* 存放在.bss中 */
int zero_initialized_var = 0;    /* 通常也存放在.bss中 */
```

为什么要特别处理.bss段？因为没有必要在FLASH中存储一份全零的数据副本。相反，链接脚本只记录.bss段在RAM中的位置和大小，启动代码会快速地将这个区域清零：

```c
/* 伪代码 */
for (uint32_t *p = &_sbss; p < &_ebss; p++) {
    *p = 0;
}
```

这比从FLASH复制更快更高效。在实际的启动代码中，通常使用memset函数或优化的汇编代码来完成这个操作。

链接脚本定义了四个符号：

- `_sbss`：BSS段的起始地址
- `__bss_start__`：同上（不同的命名约定）
- `_ebss`：BSS段的结束地址
- `__bss_end__`：同上

`*(COMMON)`这一行很重要。COMMON符号是未初始化全局变量的一种特殊格式，某些编译器会产生这种格式的符号。这一行确保这些符号也被包含在.bss段中。

#### 堆栈的布局和检查

```ld
._user_heap_stack :
{
  . = ALIGN(8);
  PROVIDE ( end = . );
  PROVIDE ( _end = . );
  . = . + _Min_Heap_Size;
  . = . + _Min_Stack_Size;
  . = ALIGN(8);
} >RAM
```

这个段本身不会被加载到芯片中（你不会在最终的二进制文件中看到它的内容）。它的作用是在链接时进行内存检查。

让我们跟踪链接器在处理这个段时会做什么：

1. 当前位置`.`在.bss段结束之后
2. `PROVIDE ( end = . ); PROVIDE ( _end = . );`创建符号`end`和`_end`，指向堆栈区域的开始（某些库函数会使用这个符号）
3. `. = . + _Min_Heap_Size;`：当前位置向前移动512字节（堆的最小大小）
4. `. = . + _Min_Stack_Size;`：当前位置再向前移动1024字节（栈的最小大小）
5. 最后进行8字节对齐

关键问题是：这个段的结束地址是否超过了RAM的末尾？

在我们的例子中：

- RAM从0x20000000开始，大小128KB，末尾是0x20020000
- 如果.data+.bss的总大小是50KB，那么堆栈区域从0x2000C800开始
- 堆栈总大小是512 + 1024 = 1536字节
- 堆栈区域的末尾是0x2000CD80，远小于0x20020000

所以没有问题。但如果.data+.bss的总大小超过100KB，那么堆栈区域会超出RAM范围，链接器会报错：

```
error: region 'RAM' overflowed by X bytes
```

这是一个非常有用的机制，可以在链接时就发现内存不足的问题。

#### 垃圾回收

```ld
/DISCARD/ :
{
  libc.a ( * )
  libm.a ( * )
  libgcc.a ( * )
}

.ARM.attributes 0 : { *(.ARM.attributes) }
```

`/DISCARD/`段指示链接器丢弃某些内容：

- `libc.a ( * )`：标准C库的所有内容
- `libm.a ( * )`：数学库的所有内容
- `libgcc.a ( * )`：GCC运行时库的所有内容

为什么要丢弃这些库？因为在嵌入式系统中：

1. **空间限制**：微控制器的FLASH通常在1-2MB，而这些库可能占用几百KB，这对总程序大小是一个严重的威胁
2. **功能冗余**：嵌入式系统通常不需要这些库的所有功能。比如stdio库中有printf/scanf等函数，但在没有操作系统的环境中这些函数很难有用
3. **硬件不支持**：某些库函数依赖于操作系统或硬件特性，在裸机环境中根本无法工作

当然，代价是我们需要手动实现某些功能。比如，如果需要使用printf，通常需要自己实现一个简化版本，通过UART输出到调试终端。

```ld
.ARM.attributes 0 : { *(.ARM.attributes) }
```

这一行保留ARM属性信息，这些属性记录了二进制文件的特性（比如指令集版本、浮点支持等），有些工具会用到这些信息。

## 完整的内存布局示例

让我们通过一个具体的例子来理解整个布局。假设我们有以下代码：

```c
/* 代码段 */
void main(void) { /* ... */ }

/* 只读数据 */
const char welcome[] = "Welcome to STM32F4";
const int table[] = {1, 2, 3, 4, 5};

/* 初始化的全局变量 */
int counter = 42;
volatile uint32_t *uart_base = (volatile uint32_t *)0x40011000;

/* 未初始化的全局变量 */
uint8_t buffer[512];
int status;

/* 本地变量和临时数据存在栈中 */
void function(void) {
    int local_var;
    // ...
}
```

链接后的内存布局会像这样（假设程序代码+常量共30KB）：

**FLASH（0x8000000 - 0x8100000）**

```
0x8000000: 中断向量表（0.5KB）
0x8000200: 代码段（约20KB）
0x8005000: 常量数据（约10KB）
0x8007A00: 初始化数据镜像（counter、uart_base等，约100字节）
```

**RAM（0x20000000 - 0x20020000）**

```
0x20000000: 初始化数据副本（100字节）
0x20000064: 未初始化数据（buffer等，约600字节）
0x20000300: 堆区（默认512字节）
0x20000500: 栈区（默认1024字节）
（剩余空间可用于动态分配）
0x2001FF00: 栈底（这是最坏情况，向下增长）
```

启动代码会：

1. 将0x8007A00处的数据复制到0x20000000
2. 将0x20000064到0x20000300清零
3. 设置栈指针为0x20020000
4. 跳转到Reset_Handler，最终执行main

## 常见问题和优化

### 问题1：栈溢出

如果`_Min_Stack_Size`太小，程序的栈指针可能会越界，导致程序崩溃。可以通过增加这个值来解决，但要注意不要超过可用的RAM。

### 问题2：堆碎片化

频繁分配和释放不同大小的内存会导致堆碎片化。在资源受限的嵌入式系统中，最好使用静态分配或内存池。

### 优化：使用CCMRAM

对于实时性要求高的代码，可以将关键函数或数据放在CCMRAM中：

```c
uint8_t critical_data[256] __attribute__((section(".ccmram")));
```

然后在链接脚本中添加相应的.ccmram段定义。

## 总结

链接脚本虽然看似复杂，但其核心思想很简单——定义内存区域，声明数据段，指定它们的位置和初始化方式。理解链接脚本能帮助你：

- 优化内存使用，充分利用不同类型的内存
- 调试内存相关的问题
- 为特殊应用场景（如bootloader、OTA升级）定制内存布局
- 更好地理解嵌入式系统的启动过程

