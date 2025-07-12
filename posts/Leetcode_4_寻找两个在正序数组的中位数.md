---
description: 算法题"寻找两个正序数组的中位数"
date: '2025-07-12'
author: 'pxx'
categories:
  - Algorithms
published: true
---

# [4. 寻找两个正序数组的中位数](https://leetcode.cn/problems/median-of-two-sorted-arrays/)

给定两个大小分别为 `m` 和 `n` 的正序（从小到大）数组 `nums1` 和 `nums2`。请你找出并返回这两个正序数组的 **中位数** 。

算法的时间复杂度应该为 `O(log (m+n))` 。

 

**示例 1：**

```
输入：nums1 = [1,3], nums2 = [2]
输出：2.00000
解释：合并数组 = [1,2,3] ，中位数 2
```

**示例 2：**

```
输入：nums1 = [1,2], nums2 = [3,4]
输出：2.50000
解释：合并数组 = [1,2,3,4] ，中位数 (2 + 3) / 2 = 2.5
```

 

**提示：**

- `nums1.length == m`
- `nums2.length == n`
- `0 <= m <= 1000`
- `0 <= n <= 1000`
- `1 <= m + n <= 2000`
- `-106 <= nums1[i], nums2[i] <= 106`





## 思路解析：

- 题目指出时间复杂度应该是`O(log (m+n))`，那么应该是分而治之的思想，首先想到二分搜索；
- 接下来思考中位数的意义：将数组分成两个部分，其中一个数组中的任何一个数都不小于（或者不大于）另一个数组中的任何数字；
- 从算法角度理解，中位数就是在**划分两个有序数组的合并序列**时，使得：
  - 左部分的最大值 ≤ 右部分的最小值；
  - 左右两部分的长度相等；



## 方法一：中位数削减法（递归）

**初步想法：**每次比较两个数组的中位数，然后在某一半区间内淘汰不可能包含中位数的部分**。**

1. **两个数组分别取中位数，并分成两个部分**
   - 每个数组都按照中位数划分为左半部分和右半部分。
2. **比较中位数**
   - 如果一个数组的中位数较小，则它可能属于最终结果的左半部分；
   - 另一个数组的中位数较大，则它可能属于右半部分；
   - **操作：**中位数小的数组往后移 *n* 位，中位数大的数组往前移 *n* 位（n的选择以长度小的数组为准）

### 错误代码：

```cpp
class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        return findMedianRecursive(nums1, nums2);
    }

private:
    double findMedianRecursive(vector<int>& A, vector<int>& B) {
        int n = A.size();
        int m = B.size();

        // 始终保证 A 是较短的数组
        if (n > m) return findMedianRecursive(B, A);

        // 边界情况
        if (n == 0) return getMedian(B);
        if (n == 1) {
            if (m == 1) return (A[0] + B[0]) / 2.0;
            return getMedianWithOneElement(A[0], B);
        }
        if (n == 2) {
            if (m == 2) return getMedianSortedFour(A[0], A[1], B[0], B[1]);
            return getMedianWithTwoElements(A[0], A[1], B);
        }

        int midA = n / 2;
        int midB = m / 2;
        int medA = A[midA];
        int medB = B[midB];

        // 削减的长度
        if (medA <= medB) {
            // 保留 A 的后半段和 B 的前半段
            vector<int> newA(A.begin() + midA, A.end());
            vector<int> newB(B.begin(), B.begin() + m - midA);
            return findMedianRecursive(newA, newB);
        } else {
            // 保留 A 的前半段和 B 的后半段
            vector<int> newA(A.begin(), A.begin() + n - midA);
            vector<int> newB(B.begin() + midA, B.end());
            return findMedianRecursive(newA, newB);
        }
    }

    double getMedian(vector<int>& arr) {
        int n = arr.size();
        if (n % 2 == 1) return arr[n / 2];
        else return (arr[n / 2 - 1] + arr[n / 2]) / 2.0;
    }

    double getMedianWithOneElement(int x, vector<int>& arr) {
        int n = arr.size();
        if (n == 1) {
            return (x + arr[0]) / 2.0;
        }
        if (n == 2) {
            return getMedianSortedThree(x, arr[0], arr[1]);
        }

        int mid = n / 2;
        if (n % 2 == 1) {
            return getMedianSortedThree(x, arr[mid - 1], arr[mid + 1]);
        } else {
            return getMedianSortedFour(x, arr[mid - 2], arr[mid - 1], arr[mid]);
        }
    }

    double getMedianWithTwoElements(int x, int y, vector<int>& arr) {
        int n = arr.size();
        if (n % 2 == 1) {
            int mid = n / 2;
            return getMedianSortedFour(x, y, arr[mid - 1], arr[mid + 1]);
        } else {
            int mid = n / 2;
            return getMedianSortedFour(x, y, arr[mid - 1], arr[mid]);
        }
    }

    double getMedianSortedThree(int a, int b, int c) {
        vector<int> tmp = {a, b, c};
        sort(tmp.begin(), tmp.end());
        return tmp[1];
    }

    double getMedianSortedFour(int a, int b, int c, int d) {
        vector<int> tmp = {a, b, c, d};
        sort(tmp.begin(), tmp.end());
        return (tmp[1] + tmp[2]) / 2.0;
    }
};

```

```
nums1 = [1,2,3,4,5]
nums2 = [6,7,8,9,10,11,12,13,14,15,16,17]
```

但是在数组长度不相等，且差距较大的情况下，“对称地取中位数后裁剪”的思路会失效，尤其是每次裁剪 `midA` 长度，但 `A.size()` 和 `B.size()` 的比例不一致时，**中位数会被错误地排除在外**。可以转为寻找两个有序数组中第 `k` 小的数：

### 复杂度分析：

- 时间复杂度: 由于每次都将搜索空间缩小一半，递归深度为**对数级别**，因此：`O(log min(n, m))`
- 空间复杂度: `O(log min(n, m))`（递归栈空间） 或 `O(1)`（如果改为迭代）

## 方法二：单数组上的二分

Leetcode官方给出了一种方法，本质上与上面的方法一样，但是更加简洁， 转换的关键思想：**将“中位数比较递归”变成“单数组上的二分”** 

将两个有序数组 `A` 和 `B` 划分为：

```
left_A  |  right_A
left_B  |  right_B
```

合并为：

```
left_part  |  right_part
```

只要满足以下两个条件：

1. `max(left_part) ≤ min(right_part)`
2. `len(left_part) == len(right_part)`（偶数）或 `len(left_part) == len(right_part) + 1`（奇数）

那么中位数就可以从 `left_part` 最大值 和 `right_part` 最小值推导出来。

### 推导：

我们希望 **合并后的左半部分（left_part）长度为总长度的一半**，所以设：
$$
i+j= \left\lfloor \frac{m + n + 1}{2} \right\rfloor
$$
其中 `i` 是 A 左半部分的元素个数，`j` 是 B 左半部分的元素个数。

这个公式的意义：

- 当总长度为偶数时，`(m + n) / 2` 是中间点；
- 当总长度为奇数时，`(m + n + 1) / 2` 是左半部分应该多一个元素的长度（向下取整）。

于是有：
$$
j= \left\lfloor \frac{m + n + 1}{2} \right\rfloor - i
$$
这就是我们要在二分中维持的平衡关系：**给定 i，可以唯一确定 j，使得左右元素个数平衡**。

为了简化实现，规定 `m ≤ n`，即让 A 是较短数组，若不满足 `m ≤ n`，交换 A 和 B 即可。

这样在 `[0, m]` 范围内枚举所有 i 时，j 由公式自动确定，总是落在 `[0, n]` 之内，**避免 j 越界问题**。=

所以我们需要做的是：

在$ [0, m]$中找到$i$，使得：
$$
B[j - 1] \leq A[i] \quad \text{且} \quad A[i - 1] \leq B[j]，其中\ j = \left\lfloor \frac{m + n + 1}{2} \right\rfloor - i
$$
等价于：

在 $[0, m]$ 中找到**最大的** $i$，使得：
$$
A[i - 1] \leq B[j]，\quad \text{其中} \ j = \left\lfloor \frac{m + n + 1}{2} \right\rfloor - i
$$

### 代码

```cpp
class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        if (nums1.size() > nums2.size()) {
            return findMedianSortedArrays(nums2, nums1);
        }
        
        int m = nums1.size();
        int n = nums2.size();
        int left = 0, right = m;
        // median1：前一部分的最大值
        // median2：后一部分的最小值
        int median1 = 0, median2 = 0;

        while (left <= right) {
            // 前一部分包含 nums1[0 .. i-1] 和 nums2[0 .. j-1]
            // 后一部分包含 nums1[i .. m-1] 和 nums2[j .. n-1]
            int i = (left + right) / 2;
            int j = (m + n + 1) / 2 - i;

            // nums_im1, nums_i, nums_jm1, nums_j 分别表示 nums1[i-1], nums1[i], nums2[j-1], nums2[j]
            int nums_im1 = (i == 0 ? INT_MIN : nums1[i - 1]);
            int nums_i = (i == m ? INT_MAX : nums1[i]);
            int nums_jm1 = (j == 0 ? INT_MIN : nums2[j - 1]);
            int nums_j = (j == n ? INT_MAX : nums2[j]);

            if (nums_im1 <= nums_j) {
                median1 = max(nums_im1, nums_jm1);
                median2 = min(nums_i, nums_j);
                left = i + 1;
            } else {
                right = i - 1;
            }
        }

        return (m + n) % 2 == 0 ? (median1 + median2) / 2.0 : median1;
    }
};
```

