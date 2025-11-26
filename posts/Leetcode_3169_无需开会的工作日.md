---
description: 算法题"无需开会的工作日"
date: '2025-07-11'
author: 'pxx'
categories:
  - Algorithms
published: false
---



# [3169. 无需开会的工作日](https://leetcode.cn/problems/count-days-without-meetings/)

给你一个正整数 `days`，表示员工可工作的总天数（从第 1 天开始）。另给你一个二维数组 `meetings`，长度为 `n`，其中 `meetings[i] = [start_i, end_i]` 表示第 `i` 次会议的开始和结束天数（包含首尾）。

返回员工可工作且没有安排会议的天数。

**注意：**会议时间可能会有重叠。

 

**示例 1：**

**输入：**days = 10, meetings = [[5,7],[1,3],[9,10]]

**输出：**2

**解释：**

第 4 天和第 8 天没有安排会议。

**示例 2：**

**输入：**days = 5, meetings = [[2,4],[1,3]]

**输出：**1

**解释：**

第 5 天没有安排会议。

**示例 3：**

**输入：**days = 6, meetings = [[1,6]]

**输出：**0

**解释：**

所有工作日都安排了会议。

 

**提示：**

- `1 <= days <= 109`
- `1 <= meetings.length <= 105`
- `meetings[i].length == 2`
- `1 <= meetings[i][0] <= meetings[i][1] <= days`



## 方法一：暴力标记 + 哈希表

### **思路解释：**

- 遍历每个会议 `[start, end]`，将每个会议日期 `j` 放入哈希表 `plan` 中（用布尔值表示是否被占用）。
- 由于 `unordered_map` 自动去重，最终 `plan.size()` 就表示总共被会议覆盖的不同天数。
- 最后返回 `days - plan.size()` 即为没有会议的天数。

### **代码：**

```cpp
unordered_map<int, bool> plan;
for (int i = 0; i < meetings.size(); i++) {
    for (int j = meetings[i][0]; j <= meetings[i][1]; j++) {
        plan[j] = true;
    }
}
return days - plan.size();
```

### **复杂度分析：**

- 最坏情况下：`O(k)`，其中 `k` 是所有会议区间长度之和（注意不是会议个数）。
- 空间复杂度：`O(k)`（用于哈希表 `plan`）



##  方法二：区间合并 + 排序（基于 sweep line 思想）

### **思路解释：**

- 首先按会议区间起点排序。
- 遍历所有会议区间，按逻辑合并重叠或相邻的区间。
- 每次遇到新不相交的区间，计算前一个合并区间的长度并从 `days` 中减去。
- 最后再减去最后一个合并区间的长度，得到无会议的天数。

### **代码：**

```cpp
class Solution {
public:
    int countDays(int days, vector<vector<int>>& meetings) {
        ranges::sort(meetings);
        int start = 1, end = 0;
        for (auto& p : meetings) {
            if (p[0] > end) {
                days -= end - start + 1;
                start = p[0];
            }
            end = max(end, p[1]);
        }
        days -= end - start + 1;
        return days;
    }
};
```

### **复杂度分析：**

- 排序：`O(n log n)`，其中 `n` 是会议个数；
- 遍历合并区间：`O(n)`；
- 总体复杂度：**`O(n log n)`**
- 空间复杂度：**`O(1)`（忽略排序时的临时空间）**

## 其他

| 对比点          | `std::sort`               | `ranges::sort`（C++20+）             |
| --------------- | ------------------------- | ------------------------------------ |
| 引入标准        | C++98                     | C++20                                |
| 语法            | 需要写 `.begin(), .end()` | 直接传容器                           |
| 支持 projection | ❌                         | ✅ 支持（key 映射）                   |
| 可读性          | 中等                      | ✅ 更现代语义、代码更清晰             |
| 支持容器类型    | 所有随机访问容器          | 要求容器支持 `std::ranges::sortable` |

如果**没有提供自定义比较函数**，那么 C++ 会自动使用默认的 `<` 运算符比较 `vector<int>`。对于 `vector<int>` 来说，**默认的 `<` 运算符采用的是**：

> **字典序（lexicographical order）比较**

也就是：

- 先比较第一个元素（左端点）；
- 如果第一个元素相同，再比较第二个元素；
- 依此类推……
