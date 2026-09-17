# CMake 学习笔记

> 学习视频：[基于VSCode和CMake实现C/C++开发 | Linux篇](https://www.bilibili.com/video/BV1fy4y1b7TC?p=17&vd_source=eac89beacf4b5ecfa9a66e7ebc9bd301)

## 前言

- **CMake**是一个**跨平台**的安装**编译工具**，可以用简单的语句来描述所有平台的安装（编译过程）
- CMake可以说已经成为**大部分C++开源项目的标配**



## 语法特性介绍
1. 基本语法格式：指令（参数1 参数2...）
    - *参数使用括弧括起*
    - *参数之间使用空格或分号隔开*
2. 指令是大小写无关的，参数和变量是大小写相关的**
3. 变量使用`&{}`方式取值，但是在IF控制语句中是直接使用变量名




## 重要指令和CMake常用变量

- **指定CMake的最小版本要求**
    - 语法：**cmake_minimum_required(VERSION versionNumber[FATAL_ERROR])**

    ```cmake
    # CMake最小版本要求为2.8.3
    cmake_minimum_required(VERSION 2.8.3)
    ```

- **定义工程名称，并可指定工程支持的语言**
    - 语法：**project(projectname[CXX][C][java])**

    ```cmake
    # 指定的工程名为HELLOWORLD
    project(HELLOWORD)
    ```

- **显式地定义变量**
    - 语法：**set(VAR [VALUE][CACHE TYPE DOCSTRING[FORCE]])**

    ```cmake
    # 定义SRC变量，其值为main.cpp hello.cpp
    set(SRC sayhello.cpp hello.cpp)
    ```

- **向工程添加多个特定的头文件搜索路径**-->相当于指定g++编译器的-I参数
    - 语法：**include_directories([AFTER|BEFORE][SYSTEM]dir1 dir2)**

    ```cmake
    # 将 /usr/include/myincludefolder 和 ./include添加到头文件搜索路径
    include_directories(/usr/include/myincludefolder ./lib)
    ```

- **向多个工程添加多个特定的库文件搜索路径**-->相当于指定g++编译器的-L参数

    ```cmake
    # 将/usr/lib/mylibfolder 和 ./lib 添加到库文件搜索路径
    link_directories(/usr/lib/mylibfolder ./lib)
    ```

- **生成库文件**
    - 语法：**add_library(libname[SHARED|STATIC|MODULE][EXCLUDE_FROM_ALL]source1 source2...)**

    ```cmake
    # 通过变量 SRC 生成 libhello.so 共享库
    add_library(hello SHARED ${SRC})
    ```

- **添加编译参数**
    - 语法：**add_compile_options(`<option>`...)**

    ```cmake
    # 添加编译参数 -wall -std=c++11
    add_compile_options(-wall -std=c++11 -o2)
    ```
  
- **生成可执行文件**
    - 语法：**add_executable(exename source1 source2...)

    ```cmake
    # 编译main.cpp生成可执行文件main
    add_executable(main main.cpp)
    ```

- **为target添加需要联接的共享库**-->相当于指定g++编译器的-l参数
    - 语法：**target_link_libraries(target library1<debug | optimized> library2...)**

    ```cmake
    # 将hello动态库文件链接到可执行文件main
    target_link_libraries(main hello)
    ```

- **向当前工程添加存放源文件的子目录，并可以指定中间二进制和目标二进制存放的位置**
    - 语法：**add_subdirectory(source_dir [binary_dir][EXCLUDE_FROM_ALL])**

    ```cmake
    # 添加src子目录，src中需有一个CMakeLists.txt
    add_subdirectory(src)
    ```

- **发现一个目录下所有的源代码文件并将列表存储在一个变量中，这个指令临时被用来自动构建源文件列表**
    - 语法：**aux_source_directory(dir VARIABLE)**

    ```cmake
    # 定义SRC变量，其值为当前目录下所有源代码文件
    aux_source_directory(. SRC)
    # 编译SRC变量所代表的的源代码文件，生成main可执行文件
    add_executable(main ${SRC})
    ```

---

- **CMAKE_C_FLAGS gcc编译选项**
  **CMAKE_CXX_FLAGS g++编译选项**

    ```cmake
    # 在CMAKE_CXX_FLAGS编译选项后追加 -std=c++11
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")
    ```

- **CMAKE_BUILD_TYPE 编译类型（Debug，Release）**

    ```cmake
    # 设定编译类型为debug，调试时需要选择debug
    set(CMAKE_BUILD_TYPE Debug)
    # 设定编译类型为release，发布时需要选择release
    set(CMAKE_BUILD_TYPE Release)
    ```

- **CMAKE_BINARY_DIR**
  **PROJECT_BINARY_DIR**
  **`<projectname>`_BINARY_DIR**
    1. 这三个变量指代的内容一致；
    2. 如果是 out-of-source 编译，指的是工程编译发生的目录；
    3. 如果是 in source build，指的就是工程顶层目录；
    4. PROJECT_BINARY_DIR跟其他指令稍有区别，不过暂时可以理解为他们是一致的。


- **CMAKE_SOURCE_DIR**
  **PROJECT_SOURCE_DIR**
  **`<projectname>`_SOURCE_DIR**
    1. 这三个变量指代的内容是一致的，不论采用何种编译方式，都是工程顶层目录；
    2. 也就是在 in source build 时，他跟CMAKE_BINARY_DIR等变量一致；
    3. PROJECT_SOURCE_DIR跟其他指令稍有区别，不过暂时可以理解为他们是一致的。

- **CMAKE_C_COMPILER：指定C编译器**
- **CMAKE_CXX_COMPILER：指定C++编译器**
- **EXECUTABLE_OUTPUT_PATH：可执行文件输出的存放路径**
- **LIBRARY_OUTPUT_PATH：库文件输出的存放路径**

---

## 实际使用积累

### 使用`PRIVATE`关键字链接库

```cmake
# 将目标联接到pthread库
target_link_libraries(${IMAGE2VIDEO_PROJECT_NAME} PRIVATE pthread )
# 将目标链接到opencv库
target_link_libraries(${IMAGE2VIDEO_PROJECT_NAME} PRIVATE ${OpenCV_LIBS})
```

- 关键字 "PRIVATE" 表示链接仅用于该目标本身，而不用于任何依赖于它的目标。
<br>
- pthread 库是用于 POSIX 线程的库，它提供了轻量级机制来在单个进程内创建多个执行线程。该库提供了函数和数据类型来处理线程，例如创建线程、同步线程和管理线程属性。

    通过链接到 pthread 库，程序可以使用库提供的函数和数据类型来实现多线程功能，例如任务的并发执行或数据的并行处理。
<br>
- ${OpenCV_LIBS} 是一个变量，其中包含需要链接的 OpenCV 库的名称。