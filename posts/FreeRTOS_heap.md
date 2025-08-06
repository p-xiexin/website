---
description: FreeRTOS 内存管理概述
date: '2025-08-04'
author: 'pxx'
categories:
  - RTOS
published: true
---

# FreeRTOS 内存管理

> 从 FreeRTOSV9.0.0 开始,内核对象可以在编译时静态分配,也可以在运行时动态分配,无需包含堆内存管理器
>
> 在 FreeRTOSConfig.h 中将  `configSUPPORT_DYNAMIC_ALLOCATION` 设置为 1 或者未定义时才需要 heap_n.c 文件。

## 1 为什么 RTOS 要自己管理内存？  

C 语言把内存抽象成四大区域：  

| 区域                         | 生命周期            | 典型用途                       | 谁管理               |
| ---------------------------- | ------------------- | ------------------------------ | -------------------- |
| **代码段** (.text)           | 程序启动 → 结束     | 机器指令                       | 编译器/链接器        |
| **全局/静态区** (.data/.bss) | 同上                | 全局变量、static               | 编译器/链接器        |
| **栈 (stack)**               | 进入函数 → 函数返回 | 局部变量、返回地址、寄存器现场 | **CPU + 编译器自动** |
| **堆 (heap)**                | malloc → free       | 动态数组、对象、链表节点       | **程序员**           |

在裸机时代，一般直接拿一块全局数组当“堆”：  
```c
static uint8_t ucHeap[1024];
```
FreeRTOS 中的“任务”、“队列”、“信号量”等被称为内核对象。为了让这些对象易于使用，FreeRTOS 采用了**运行时动态分配内存**的方式，而不是编译时静态分配。这样做可以简化使用流程，减少资源浪费，同时让内核更灵活、适应不同任务数量和资源需求的变化。

但一旦任务、队列、信号量同时向你要内存，就必须回答三个问题：  

1. 谁来切割？  
2. 谁来回收？  
3. 碎片怎么办？  

而在嵌入式实时系统中，不能随便用 `malloc()` 和 `new`，因为它们执行时间不可控、易产生内存碎片，多次申请和释放不同大小的内存后，堆中会产生很多小的、非连续的可用空间。嵌入式系统 RAM 很小，这种碎片化很容易让系统“明明有空闲内存却无法使用”，影响系统稳定性与实时性。应使用 FreeRTOS 提供的专用内存管理接口和机制来替代。

## 2 五大方案速览  

> 官方统计：heap_4 在 Cortex-M 上 1 ms 可分配/释放 10 kB 约 **1000 次**，碎片 < 1%。

| 方案       | 适用场景                         | 方法                                                         |
| ---------- | -------------------------------- | ------------------------------------------------------------ |
| **heap_1** | 静态任务，多任务创建后不再释放   | 内部维护一个递增指针，每次 `pvPortMalloc()` 就从堆中划一块；<br />不提供 `vPortFree()` 实现。 |
| **heap_2** | 少量释放需求的项目               | 链表管理空闲内存块；分配时找适配块，释放时将空闲块重新加入链表。包装 `stdlib`，带线程保护 |
| **heap_3** | 快速验证，非正式发布             | 直接使用标准 C 库的 `malloc()` 和 `free()`；                 |
| **heap_4** | **推荐使用，适用于绝大多数项目** | 与 `heap_2` 类似，但加入**合并空闲块**功能；能减少碎片、长期运行更稳定。 |
| **heap_5** | 多块不连续 RAM                   | 用户可以配置多个内存区域（比如 SRAM1、SRAM2）；动态管理这些段内存块，并合并空闲块。 |

在嵌入式开发中，**用 FreeRTOS 提供的 `pvPortMalloc()` 和 `vPortFree()` 代替 `malloc` 和 `free`**，这些函数由 FreeRTOS 控制，可替换实现，确保适配实时需求。

## 3 静态分配策略 
在 V9.0.0 之前，FreeRTOS 默认用 `pvPortMalloc()` 在运行时为所有内核对象（任务、队列、信号量、事件组、软件定时器等）申请 RAM，因此必须携带五种 heap 实现之一。  
**从 V9.0.0 起**，官方引入了 **可选静态分配** 策略：  

- 新增配置宏 `configSUPPORT_STATIC_ALLOCATION`  
- 新增 `configSUPPORT_DYNAMIC_ALLOCATION`  
二者可独立开关，从而**允许构建“零堆”项目**。

### 3.1 示例：静态创建任务

| 步骤           | 操作要点           | 代码片段                                                     |
| -------------- | ------------------ | ------------------------------------------------------------ |
| ① 配置宏       | `FreeRTOSConfig.h` | `#define configSUPPORT_STATIC_ALLOCATION 1` <br> `#define configSUPPORT_DYNAMIC_ALLOCATION 0` |
| ② 实现回调     | 必须提供           | `void vApplicationGetIdleTaskMemory(...)` <br> `void vApplicationGetTimerTaskMemory(...)` |
| ③ 使用静态 API | 创建对象           | `xTaskCreateStatic()` <br> `xQueueCreateStatic()` <br> `xEventGroupCreateStatic()` … |

```c
static StackType_t xIdleStack[configMINIMAL_STACK_SIZE];
static StaticTask_t xIdleTCB;

void vApplicationGetIdleTaskMemory( StaticTask_t **ppxIdleTaskTCBBuffer,
                                    StackType_t **ppxIdleTaskStackBuffer,
                                    uint32_t *pulIdleTaskStackSize )
{
    *ppxIdleTaskTCBBuffer   = &xIdleTCB;
    *ppxIdleTaskStackBuffer = xIdleStack;
    *pulIdleTaskStackSize   = configMINIMAL_STACK_SIZE;
}
```

### 3.2 与动态API的对比

| 动态 API                   | 静态 API                         | 额外参数                        |
| :------------------------- | :------------------------------- | :------------------------------ |
| `xTaskCreate()`            | `xTaskCreateStatic()`            | 任务栈数组指针 + TCB 缓冲区指针 |
| `xQueueCreate()`           | `xQueueCreateStatic()`           | 队列存储区指针 + 静态结构体指针 |
| `xSemaphoreCreateBinary()` | `xSemaphoreCreateBinaryStatic()` | 同上                            |
| `xEventGroupCreate()`      | `xEventGroupCreateStatic()`      | 同上                            |

FreeRTOS 把两套 API 设计成**“开关独立”**：

- `configSUPPORT_STATIC_ALLOCATION = 1` → 允许使用 `xTaskCreateStatic()` 等静态 API；  
- `configSUPPORT_DYNAMIC_ALLOCATION = 1` → 允许使用 `xTaskCreate()` 等动态 API；  

因此可以在 **同一个工程**里同时打开两个宏，**按需调用**：

```c
/* 动态创建一个任务 */
xTaskCreate( vTaskCode, "DynTask", 256, NULL, 2, NULL );

/* 静态创建另一个任务 */
static StackType_t xStk[256];
static StaticTask_t xTCB;
xTaskCreateStatic( vTask2Code, "StaTask", 256, NULL, 1, xStk, &xTCB );
```

只要 **把两种实现都链接进工程**（`heap_x.c` + 静态 API 源码）即可。  
关闭 `configSUPPORT_DYNAMIC_ALLOCATION` 只是**禁止动态 API 编译通过**，并不会影响静态 API 的使用。

## 4 解剖 heap_4.c 

### 4.1 数据结构  
```c
typedef struct BlockLink
{
    size_t xBlockSize;          /* 高 bit0 = 1 表示空闲 */
    struct BlockLink *pxNextFreeBlock;
} BlockLink_t;
```
- **空闲块**串成单向链表，按地址升序排列；  
- **已分配块**直接返回用户指针，无需额外控制块。

### 4.2 分配算法  
1. **首次适应 (first fit)**：从头遍历链表，找到第一块 ≥ 请求大小的空闲块；  
2. **切割剩余**：若剩余 ≥ `heapMINIMUM_BLOCK_SIZE`，分裂成两块；  
3. **合并邻居**：释放时检查前后块是否空闲，**合并成更大块**。

### 4.3 关键源码（精简版）

| 步骤/概念                      | 含义                                                     |
| ------------------------------ | -------------------------------------------------------- |
| `Align()`                      | 对齐操作，确保内存块符合系统对齐要求（比如8字节对齐）    |
| `metadataOverhead`             | 每个块的控制信息（如：大小、空闲标志、链表指针）         |
| `SplitBlock()`                 | 把一个大块切分为两块，一块用于分配，另一块继续作为空闲块 |
| `CoalesceAdjacentFreeBlocks()` | 若释放的块前后有空闲块，就合并成更大的空闲块             |

```c
1: heap ← HeapRegion()                                      ▷ 初始化整块堆内存区域
2: freeList ← InitializeFreeList(heap)                      ▷ 构建初始的空闲链表，指向整个堆空间

3: function malloc(requestedSize)                           ▷ 分配指定大小的内存块
4:     blockSize ← Align(requestedSize + metadataOverhead)  ▷ 加上元信息大小，并按字节对齐
5:     prev ← NULL                                           ▷ 用于遍历空闲链表：记录前一个块
6:     curr ← freeList.head                                  ▷ 从空闲链表头开始遍历
7:     while curr ≠ NULL do
8:         if curr.size ≥ blockSize then                     ▷ 找到第一个足够大的空闲块
9:             if curr.size - blockSize ≥ MinimumBlockSize then
10:                 newBlock ← SplitBlock(curr, blockSize)   ▷ 分裂出剩余空闲部分
11:                 InsertFreeBlock(newBlock)                ▷ 剩余部分重新插入空闲链表
12:             end if
13:             RemoveBlockFromFreeList(curr, prev)          ▷ 从空闲链表中移除被分配的块
14:             return curr.memoryStart                      ▷ 返回可用内存地址
15:         end if
16:         prev ← curr                                      ▷ 移动指针
17:         curr ← curr.next
18:     end while
19:     return NULL                                          ▷ 没有足够内存，分配失败
20: end function

21: function free(pointer)                                   ▷ 释放指定内存地址对应的内存块
22:     block ← GetBlockFromPointer(pointer)                 ▷ 获取完整的内存块（包含元信息）
23:     InsertBlockIntoFreeList(block)                       ▷ 插入空闲链表中
24:     CoalesceAdjacentFreeBlocks()                         ▷ 合并相邻空闲块，防止内存碎片
25: end function

```


## 5 如何替换默认堆？  

### 5.1 在 `FreeRTOSConfig.h` 中
```c
#define configTOTAL_HEAP_SIZE    ( 32 * 1024 )
#define configUSE_HEAP_SCHEME    4        /* 选用 heap_4 */
```
### 5.2 自定义 RAM 区域（heap_5）
```c
HeapRegion_t xHeapRegions[] =
{
    { ( uint8_t * ) 0x20000000, 0x10000 }, /* SRAM1 */
    { ( uint8_t * ) 0x30000000, 0x08000 }, /* SRAM2 */
    { NULL,                     0 }        /* 结束标记 */
};
vPortDefineHeapRegions( xHeapRegions );
```

