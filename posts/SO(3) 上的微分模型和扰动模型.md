---
description: 简单分析李群上微分模型和扰动模型的差异
date: '2025-12-04'
author: 'pxx'
categories:
  - 其他
published: true
---



# SO(3) 上的求导与扰动模型区别解析

> **微分模型重在理论精确性；扰动模型重在工程实用性。**

## 一、旋转矩阵求导的基本性质

根据旋转矩阵的正交性质：

$$
R R^\top = I
$$

对两边同时求导可得：

$$
\dot{R} R^\top + R \dot{R}^\top = \dot{R} R^\top + (\dot{R} R^\top)^\top = 0
$$

因此：

$$
\dot{R} R^\top = -(\dot{R} R^\top)^\top
$$

这说明矩阵 $\dot{R} R^\top$ 是一个反对称矩阵，记为：

$$
\dot{R}(t) R^\top(t) = [\Phi(t)]_\times
=
\begin{bmatrix}
0 & -\Phi_3 & \Phi_2 \\
\Phi_3 & 0 & -\Phi_1 \\
-\Phi_2 & \Phi_1 & 0
\end{bmatrix}
$$

于是有：

$$
\dot{R}(t) = [\Phi(t)]_\times R(t)
$$

同理可推导：

$$
R^\top \dot{R} = [\omega]_\times
$$

即对旋转矩阵 $R \in \mathrm{SO}(3)$ 求导相当于右乘一个反对称矩阵 $[\omega]_\times$：

$$
\dot{R} = R [\omega]_\times \in T_R \mathrm{SO}(3)
$$

当 $\omega$ 是常数时，上式构成一个常微分方程 (ODE)，其解为：

$$
R(t) = R_0 \exp([\omega]_\times t)
$$

## 二、为什么普通求导不再适用

### 1. 欧氏空间中的求导

在普通的欧氏空间 $\mathbb{R}^n$ 中，导数是很直接的：

$$
\frac{\mathrm{d}f(x)}{\mathrm{d}x}
= \lim_{\Delta x \to 0} \frac{f(x + \Delta x) - f(x)}{\Delta x}.
$$

这是基于“加法”的定义：点和增量都在同一个线性空间内。

### 2. 李群 $\mathrm{SO}(3)$ 不是欧氏空间

但旋转矩阵 $R \in \mathrm{SO}(3)$ 满足：

$$
R R^\top = I, \quad \det(R)=1.
$$

这意味着它**不在一个线性空间内**，不能随便加减：

$$
R + \Delta R \notin \mathrm{SO}(3).
$$

所以不能直接用欧氏意义上的“导数”，因为“加上一个小量”后就离开了流形。

因此，需要使用**李群—李代数**的方式在流形上进行推导。

## 三、两种模型：微分模型与扰动模型

> 注意区分**旋转矩阵动力学方程中的“时间导数”** 和 **指数映射（李群参数化）下的“扰动导数（偏导数）”**。
>  **核心区别**
>
> 1. 变量角色不同：前者是运动学方程，描述的是**刚体随时间的旋转变化率**；而扰动是**参数化变量**。
> 2. 导数目标不同：前者关心「旋转怎样随时间演化」；后者关心「旋转后的点怎样随参数变化」。

### 1. 微分模型（Differential Model）

微分模型直接在李代数上定义导数。考虑：

$$
f(\phi) = \exp([\phi]_\times) p
$$

对 $\phi$ 求导：

$$
\begin{aligned}
\frac{\partial \bigl(\exp(\phi^\wedge)p\bigr)}{\partial \phi}
&= \lim_{\delta \phi \to 0}
   \frac{\exp\!\bigl((\phi + \delta \phi)^\wedge\bigr)p
         - \exp(\phi^\wedge)p}{\delta \phi} \\
&= \lim_{\delta \phi \to 0}
   \frac{\exp\!\bigl((J_l \delta \phi)^\wedge\bigr)\exp(\phi^\wedge)p
         - \exp(\phi^\wedge)p}{\delta \phi} \\
&= \lim_{\delta \phi \to 0}
   \frac{(I + (J_l \delta \phi)^\wedge)\exp(\phi^\wedge)p
         - \exp(\phi^\wedge)p}{\delta \phi} \\
&= \lim_{J_l \delta \phi \to 0}
   \frac{(J_l \delta \phi)^\wedge \exp(\phi^\wedge)p}{\delta \phi}
= -(Rp)^\wedge J_l
\end{aligned}
$$

上面第四行到第五行将反对称符号看作叉乘，因此出现了符号变化。  
微分模型的结果最后需要计算一个雅可比矩阵 $J_l$，计算较为复杂，因此工程中较少使用。

&gt; **本质**：在李代数上求导，反映“参数扰动对旋转结果的影响”，理论上更严格。

### 2. 扰动模型（Perturbation Model）

扰动模型在李群上引入小扰动。  
这种方法直接在旋转矩阵上乘上一个小旋转，而不是在李代数上加小量。

左扰动模型为：

$$
R' = \exp([\delta \phi]_\times) R
$$

于是：

$$
\begin{aligned}
\frac{\partial (Rp)}{\partial \varphi}
&= \lim_{\varphi \to 0}
   \frac{\exp(\varphi^\wedge) R p - R p}{\varphi} \\
&= \lim_{\varphi \to 0}
   \frac{(I + \varphi^\wedge) R p - R p}{\varphi} \\
&= \lim_{\varphi \to 0}
   \frac{\varphi^\wedge R p}{\varphi}
= \lim_{\varphi \to 0} \frac{-(R p)^\wedge \varphi}{\varphi}
= -(R p)^\wedge
\end{aligned}
$$

&gt; **本质**：在李群上定义扰动，对应真实旋转的小量变化，更符合工程直觉。

## 四、理论上的对比总结

- **微分模型**：  
  “我在李代数上加一点点参数，看看旋转结果变化多少。”

- **扰动模型**：  
  “我在当前姿态上再旋转一点点，看看结果怎么变。”

两者的区别在于“加小量”的位置不同：  
前者在参数空间（李代数）中加，后者在群空间（李群）中乘。

- 微分模型在李代数上定义导数，数学上更严谨，但需要处理李雅可比矩阵。
- 扰动模型在李群上施加小旋转，线性化更直观，工程上几乎总是采用。
- 理论推导时常使用微分模型，但在实际代码实现（如 EKF、优化、控制中）使用扰动模型。

| 对比项         | 微分模型                | 扰动模型               |
| :------------- | :---------------------- | :--------------------- |
| 导数定义位置   | 李代数上定义            | 李群上定义             |
| 操作空间       | $\phi \in \mathbb{R}^3$ | $R \in \mathrm{SO}(3)$ |
| 是否需要雅可比 | 需要 $J_l(\phi)$        | 不需要                 |
| 数学严谨性     | 理论上更严格            | 工程上近似但有效       |
| 小量解释       | 李代数扰动              | 李群上的小旋转扰动     |
| 推导复杂度     | 较复杂                  | 更简洁直观             |

## 五、工程应用差异

| 应用场景             | 推荐模型 | 原因                 |
| -------------------- | -------- | -------------------- |
| 理论推导、符号微分   | 微分模型 | 严格遵守流形微分定义 |
| EKF / UKF 线性化     | 扰动模型 | 形式简单，便于线性化 |
| SLAM / VIO 优化      | 扰动模型 | 左/右扰动更新方便    |
| 控制器与姿态误差传播 | 扰动模型 | 与误差状态模型一致   |

在实际工程中，例如姿态估计或优化中，我们经常写：

$$
R \leftarrow \exp([\delta \phi]_\times) R
$$

这正是基于**扰动模型**的思想。

## 参考文献

[1] SOLÀ J, DERAY J, ATCHUTHAN D. A micro Lie theory for state estimation in robotics[A/OL]. arXiv, 2021[2023-12-11]. http://arxiv.org/abs/1812.01537. DOI:[10.48550/arXiv.1812.01537](https://doi.org/10.48550/arXiv.1812.01537).

[2] BARFOOT T D. State Estimation for Robotics[M/OL]. 1 版. Cambridge University Press, 2017[2023-12-11]. https://www.cambridge.org/core/product/identifier/9781316671528/type/book. DOI:[10.1017/9781316671528](https://doi.org/10.1017/9781316671528).
