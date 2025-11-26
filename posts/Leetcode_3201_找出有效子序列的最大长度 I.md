---
description: 算法题"找出有效子序列的最大长度 I"
date: '2025-07-16'
author: 'pxx'
categories:
  - Algorithms
published: false
---

# [3201. 找出有效子序列的最大长度 I](https://leetcode.cn/problems/find-the-maximum-length-of-valid-subsequence-i/)

给你一个整数数组 `nums`。

`nums` 的子序列 `sub` 的长度为 `x` ，如果其满足以下条件，则称其为 **有效子序列**：

- `(sub[0] + sub[1]) % 2 == (sub[1] + sub[2]) % 2 == ... == (sub[x - 2] + sub[x - 1]) % 2`

返回 `nums` 的 **最长的有效子序列** 的长度。

一个 **子序列** 指的是从原数组中删除一些元素（也可以不删除任何元素），剩余元素保持原来顺序组成的新数组。

 

**示例 1：**

**输入：** nums = [1,2,3,4]

**输出：** 4

**解释：**

最长的有效子序列是 `[1, 2, 3, 4]`。

**示例 2：**

**输入：** nums = [1,2,1,1,2,1,2]

**输出：** 6

**解释：**

最长的有效子序列是 `[1, 2, 1, 2, 1, 2]`。

**示例 3：**

**输入：** nums = [1,3]

**输出：** 2

**解释：**

最长的有效子序列是 `[1, 3]`。

 

**提示：**

- `2 <= nums.length <= 2 * 105`
- `1 <= nums[i] <= 107`



## 思路解析：

这题有两种策略可以生成最长有效子序列：

#### 1. **交错选择（奇偶交错）**：

构造子序列，使得两个数之和始终是同一个奇偶性。

- 比如交错奇偶：奇→偶→奇→偶 等

这个策略利用贪心地选当前元素，与前一个奇偶相反的组合来保证 `(a+b)%2` 恒定。

#### 2. **同奇偶全选（奇或偶）**：

如果只选偶数或只选奇数，那么任意两个相加都是偶数：

- 偶+偶 = 偶
- 奇+奇 = 偶

所以选同类数字，也能构成合法序列。



## 代码

```cpp
class Solution {
public:
    int maximumLength(vector<int>& nums) {
        int cross[2] = {}; // 交错策略：cross[0] 表示最后一个是偶数，cross[1] 表示最后一个是奇数
        int same[2] = {};  // 同奇偶策略：same[0] 统计偶数个数，same[1] 统计奇数个数

        for (int x : nums) {
            int parity = x % 2;
            cross[parity] = cross[1 - parity] + 1;
            same[parity]++;
        }

        return max({cross[0], cross[1], same[0], same[1]});
    }
};
```