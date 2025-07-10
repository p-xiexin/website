---
description: 算法题"无重复字符的最长子串"
date: '2025-07-10'
author: 'pxx'
categories:
  - Algorithms
published: true
---

# [Leetcode 3： 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)
给定一个字符串 `s` ，请你找出其中不含有重复字符的 **最长 子串** 的长度。

 

**示例 1:**

```
输入: s = "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

**示例 2:**

```
输入: s = "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
```

**示例 3:**

```
输入: s = "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
```

 

**提示：**

- `0 <= s.length <= 5 * 104`
- `s` 由英文字母、数字、符号和空格组成



```cpp
class Solution {
public:
    int lengthOfLongestSubstring(string s) {

    }
};
```

##  题目解析

本题要求找出一个字符串中 **不包含重复字符的最长子串的长度**。这是一个经典的子串扫描问题。在暴力法中可以枚举所有可能的子串并检查是否有重复字符，但这会导致时间复杂度高达 O(n³)。为了更高效地处理，引入一种叫做 **滑动窗口（Sliding Window）** 的技术。

滑动窗口就是维护一个区间 `[start, end]`，在字符串上从左到右滑动，动态维护当前子串的状态。在这个窗口内保证其 **不含重复字符**，当出现重复时就向右缩小窗口，以保持窗口合法。通过这种方式，可以在线性时间内找到满足条件的最长子串。

------

## 方法一：队列维护滑动窗口

### 解题思路：

使用一个队列来显式维护当前不含重复字符的子串窗口。每遇到一个字符，如果它未出现在窗口中，就加入队尾；若出现重复，就不断从队首弹出字符，直到重复字符被移除。每一步都更新当前窗口长度并维护最大值。

### 错误方法：

```cpp
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        std::deque<char> windows;
        size_t  max = 0;

        for(char c : s){
            if (!windows.empty() && c == windows.back()) {
                max = std::max(windows.size(), max);
                windows.clear();
            }
            if(find(windows.begin(), windows.end(), c) != windows.end()){
                windows.pop_front();
            }
            windows.push_back(c);
        }
        return std::max(windows.size(), max);
    }
};
```

### 代码：

```cpp
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        std::deque<char> windows;
        size_t  max = 0;

        for(char c : s){
            // 注释部分与下面的while等效
            // if(find(windows.begin(), windows.end(), c) != windows.end()){
            //     while(c != windows.front()){
            //         windows.pop_front();
            //     }
            //     windows.pop_front();
            // }
            while (find(windows.begin(), windows.end(), c) != windows.end()) {
                windows.pop_front();
            }
            windows.push_back(c);
            max = std::max(windows.size(), max);
        }
        return max;
    }
};
```

### 复杂度分析：

- 时间复杂度：O(n²)，因为 `find()` 操作在最坏情况下是线性的。
- 空间复杂度：对于纯 ASCII，空间复杂度可以视为 **O(1)**；对于更大字符集，则是 **O(n)**。最坏情况下队列中存储所有不重复字符。

------

## 方法二：双指针+哈希表记录字符索引

### 解题思路：

使用 `unordered_map<char, int>` 哈希表来记录每个字符上一次出现的位置。当遍历字符串时，如果当前字符在窗口内重复，就将窗口左边界 `start` 移动到重复字符的下一位置，从而跳过重复部分。每次维护窗口长度并更新最大值。

```cpp
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> lastSeen;
        int maxLen = 0;
        int start = 0;

        for (int end = 0; end < s.length(); ++end) {
            char c = s[end];
            if (lastSeen.count(c) && lastSeen[c] >= start) {
                start = lastSeen[c] + 1;
            }
            lastSeen[c] = end;
            maxLen = max(maxLen, end - start + 1);
        }

        return maxLen;
    }
};
```

### 复杂度分析：

- 时间复杂度：O(n)，每个字符最多访问两次。
- 空间复杂度：对于纯 ASCII，空间复杂度可以视为 **O(1)**；对于更大字符集，则是 **O(n)**。

------

## 方法三：双指针 + 计数数组(针对ASCII )

### 解题思路：

使用两个指针 `start` 和 `end` 表示滑动窗口，用一个固定大小的布尔数组（或整型数组）来标记字符是否在窗口中出现过。当遇到重复字符时，就右移左指针，并清除其标记。这种方式特别适用于 ASCII 字符集的场景，代码简洁、效率极高。

### 代码：

```cpp
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        vector<bool> exist(128, false);
        int maxLen = 0;
        int start = 0;

        for (int end = 0; end < s.length(); ++end) {
            while (exist[s[end]]) {
                exist[s[start]] = false;
                start++;
            }
            exist[s[end]] = true;
            maxLen = max(maxLen, end - start + 1);
        }

        return maxLen;
    }
};
```

### 复杂度分析：

- 时间复杂度：O(n)，每个字符最多处理两次。
- 空间复杂度：O(1)，固定数组大小（128）用于 ASCII 字符。

## 其他

`find` 是 C++ STL 中的一个通用查找函数，定义在头文件 `<algorithm>` 中。它可以用于在任意范围（如容器、数组、字符串等）中查找一个特定的值，返回的是 **第一个等于该值的元素的位置**（迭代器）。

```cpp
template<class InputIterator, class T>
InputIterator find(InputIterator first, InputIterator last, const T& val);
```

- **`first`**：起始迭代器
- **`last`**：结束迭代器（不包含，指向容器末尾之后 的一个位置，**不存储任何有效元素**，用于标记范围的终点
- **`val`**：要查找的目标值
- 返回值是：**第一个等于 val 的迭代器**，若没找到则返回 `last`

| 特性           | `std::deque`                                | `std::queue`                           |
| -------------- | ------------------------------------------- | -------------------------------------- |
| 所属头文件     | `<deque>`                                   | `<queue>`                              |
| 底层结构       | 双端数组（双端队列）                        | 封装的容器适配器（默认基于 `deque`）   |
| 是否能随机访问 | ✅ 支持 `[]` 和迭代器                        | ❌ 不支持（只有 `front()` 和 `back()`） |
| 允许插入的位置 | ✅ 两端都可插入（`push_front`, `push_back`） | ❌ 只能从尾部入队 `push()`              |
| 允许删除的位置 | ✅ 两端都可删除（`pop_front`, `pop_back`）   | ❌ 只能从头部出队 `pop()`               |
| 适用场景       | 双端访问、滑动窗口、缓存                    | 单纯的先进先出（FIFO）队列             |
