---
description: dp解决字串匹配问题
date: '2026-03-20'
author: 'pxx'
categories:
  - Algorithms
published: false
---



# 正则表达式匹配（LeetCode 10）

[leetcode题目链接](https://leetcode.cn/problems/regular-expression-matching/)

给你一个字符串 `s` 和一个字符规律 `p`，请你来实现一个支持 `'.'` 和 `'*'` 的正则表达式匹配。

- `'.'` 匹配任意单个字符
- `'*'` 匹配零个或多个前面的那一个元素

返回一个布尔值，表示匹配是否覆盖整个输入字符串（而非部分）。

**示例 1：**

```
输入：s = "aa", p = "a"
输出：false
解释："a" 无法匹配 "aa" 整个字符串。
```

**示例 2:**

```
输入：s = "aa", p = "a*"
输出：true
解释：因为 '*' 代表可以匹配零个或多个前面的那一个元素, 在这里前面的元素就是 'a'。因此，字符串 "aa" 可被视为 'a' 重复了一次。
```

**示例 3：**

```
输入：s = "ab", p = ".*"
输出：true
解释：".*" 表示可匹配零个或多个（'*'）任意字符（'.'）。
```

## 题目分析

这题使用 DP，因为 `*` 带来了多种匹配可能，不能靠单一路径贪心解决；
DP 状态定义为“两个前缀是否匹配”，所以要开 `(m+1)*(n+1)` 来表示空前缀；

`dp[i][j]` 表示：`s` 的前 `i` 个字符，是否能被 `p` 的前 `j` 个字符完整匹配。

而 `dp` 使用前缀长度做下标，因此访问实际字符时总是 `s[i-1]` 和 `p[j-1]`。

## 答案

```cpp
class Solution {
public:
    bool isMatch(string s, string p) {
        int m = s.size(), n = p.size();
        vector<vector<bool>> dp(m + 1, vector<bool>(n + 1, false));
        dp[0][0] = true;

        auto matches = [&](int i, int j) -> bool {
            if (i == 0) return false;
            if (p[j - 1] == '.') return true;
            return s[i - 1] == p[j - 1];
        };

        for (int i = 0; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (p[j - 1] != '*') {
                    if (matches(i, j)) {
                        dp[i][j] = dp[i - 1][j - 1];
                    }
                } else {
                    dp[i][j] = (j >= 2 && dp[i][j - 2]);
                    if (j >= 2 && matches(i, j - 1)) {
                        dp[i][j] = dp[i][j] || dp[i - 1][j];
                    }
                }
            }
        }

        return dp[m][n];
    }
};
```

**注意**：不要用 Linux 通配符的直觉去理解这里的 `*`，因为正则里的 `a*` 表示前一个字符出现 **0 次或多次**，所以它本身就可以匹配空串。将此分支单独拿出来可以写成以下形式：

```cpp
for (int j = 2; j <= n; j++) {
    if (p[j - 1] == '*') {
        dp[0][j] = dp[0][j - 2];
    }
}
```

## 小结

1. 这题的关键在 `*`，表示前一个字符可以出现 0 次或多次，所以一旦遇到它，就会出现多种匹配分支，无法用简单的顺序扫描或贪心解决。由于这些分支中会反复遇到相同的匹配状态，因此适合用动态规划。

2. DP 定义为：`dp[i][j]` 表示 `s` 的前 `i` 个字符能否被 `p` 的前 `j` 个字符匹配。
   之所以数组大小是 `(m+1)*(n+1)`，是因为必须表示“前 0 个字符”，也就是空串和空模式。
3. 之所以代码里经常写 `s[i-1]`、`p[j-1]`，不是因为字符串从 1 开始，而是因为 DP 下标表示的是“前缀长度”。



