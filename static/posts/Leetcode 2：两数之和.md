---
description: 算法题"两数相加"
date: '2025-07-09'
author: 'pxx'
categories:
  - Algorithms
published: true
---

# Leetcode 2：两数相加

给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。
![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2021/01/02/addtwonumber1.jpg)

- 示例 1：

  > 输入：l1 = [2,4,3], l2 = [5,6,4]
  > 输出：[7,0,8]
  > 解释：342 + 465 = 807.

- 示例 2：

  > 输入：l1 = [0], l2 = [0]
  > 输出：[0]

- 示例 3：

  > 输入：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
  > 输出：[8,9,9,9,0,0,0,1]



提示：

- 每个链表中的节点数在范围 [1, 100] 内
- 0 <= Node.val <= 9
- 题目数据保证列表表示的数字不含前导零



## 题目分析

**题意：**
链表 `2 -> 4 -> 3` 表示数字 342（逆序），链表 `5 -> 6 -> 4` 表示数字 465。

现在要求这两个数字相加，返回一个链表，仍然是逆序形式表示的和。

## 关键点

1. **逆序存储**
    链表的头节点是个位，第二个节点是十位，依次类推。
2. **进位处理**
    两位相加如果超过10，需要向高位进1。
3. **链表长度可能不等**
    两个链表可能长度不同，要考虑短链表处理完后，长链表还剩余的部分。
4. **可能产生新的高位**
    例如：`5 + 5 = 10`，结果链表最后要新增一个节点表示进位的1。

## 答案

### 方法一：初始化头节点，while 中更新的是 `next`

这种方法通过预先创建一个值为 0 的虚拟头节点（dummy node），避免了在处理第一个节点时进行特殊判断。指针 `curr` 用于构建结果链表，初始指向 dummy 节点。在每一次循环中，我们取出两个链表当前节点的值并加上进位 `carry`，然后创建一个新节点，将当前位的结果存入其中，并将其接到 `curr->next`。循环继续推进两个链表的指针，并根据结果更新 `carry`。最终，整个结果链表会挂在 `dummy->next` 上，返回时跳过 dummy 节点即可。该方法逻辑清晰，适合绝大多数链表构造场景。

```cpp
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode* dummy = new ListNode(0); // Dummy head node
        ListNode* curr = dummy;
        int carry = 0;

        while (l1 || l2 || carry) {
            int val1 = l1 ? l1->val : 0;
            int val2 = l2 ? l2->val : 0;
            int sum = val1 + val2 + carry;

            carry = sum / 10;
            curr->next = new ListNode(sum % 10);
            curr = curr->next;

            if (l1) l1 = l1->next;
            if (l2) l2 = l2->next;
        }

        return dummy->next; // Skip the dummy node
    }
};
```

------

### 方法二：初始化空节点指针，while 中更新当前节点

另一种做法是初始化时不预设任何节点，而是在循环中动态判断是否是第一个节点。如果当前是第一个节点，则将其赋值给 `head` 和 `curr`；否则，直接创建新节点挂到 `curr->next` 并更新指针。这个方法相比使用 dummy 节点稍微更复杂一些，因为需要手动判断链表是否为空，但它避免了多余的占位节点，也不用在最后返回时跳过 dummy。整体逻辑上略微紧凑一些，但在链表构建逻辑熟练后也很好掌握。

```cpp
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode* head = nullptr;
        ListNode* curr = nullptr;
        int carry = 0;

        while (l1 || l2 || carry) {
            int val1 = l1 ? l1->val : 0;
            int val2 = l2 ? l2->val : 0;
            int sum = val1 + val2 + carry;
            carry = sum / 10;

            ListNode* node = new ListNode(sum % 10);
            if (!head) {
                head = curr = node;  // First node
            } else {
                curr->next = node;
                curr = curr->next;
            }

            if (l1) l1 = l1->next;
            if (l2) l2 = l2->next;
        }

        return head;
    }
};
```

### 错误思路

**在每一次循环中**都创建了一个新的节点，并把 `res / 10`（即进位）写入其中。即使这个进位是 `0`，也会新建一个节点。

```cpp
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
		ListNode* head = new ListNode(0);
		ListNode* curr = head;

		while(l1 || l2){
			int val1 = l1 ? l1->val : 0;
			int val2 = l2 ? l2->val : 0;

			int res = val1 + val2 + curr->val;
			curr->val = res % 10;

            curr->next = new ListNode(res / 10);
            curr = curr->next;

			if(l1) l1 = l1->next;
			if(l2) l2 = l2->next;
		}
		return head;
    }
};
```





## 其他

`nullptr` 是 **C++11 引入的关键字**，类型明确、安全可靠。

`NULL` 是 **一个宏**，本质是整数 `0`，类型不明确，容易引发函数重载歧义。

```cpp
void func(int);         // Overload 1
void func(char*);       // Overload 2

func(NULL);             // 错！调用 func(int) 而不是 func(char*)
func(nullptr);          // 正确，调用 func(char*)
```

解释：`NULL` 是 `0`，会选择 `int` 版本；而 `nullptr` 是专用的空指针类型，自动匹配指针版本。
