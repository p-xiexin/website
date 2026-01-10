---
description: 流形上旋转误差的选取思路与推导
date: '2025-08-26'
author: 'pxx'
categories:
  - 其他
published: true
---

# 旋转误差函数定义的选择依据

在机器人学、计算机视觉和控制理论中，准确度量两个旋转之间的差异是一个基础且重要的问题。常见的旋转误差函数形式为：

$$
\Psi(R, R_d) = \frac{1}{2}\text{tr}[I - R_d^T R]
$$
这个看似简单的公式背后蕴含着深刻的数学原理。本文将深入探讨这一误差函数定义的选择依据，从传统方法的局限性出发，逐步推导出这一优雅的解决方案。

## 1. 传统旋转表示的缺陷

在讨论基于旋转矩阵的误差函数之前，我们需要理解为什么传统的旋转表示方法存在根本性问题。最常用的两种旋转表示——欧拉角和四元数——虽然在某些场景下有其优势，但在设计通用的误差函数时都存在难以克服的缺陷。

### 欧拉角的根本问题

欧拉角是最直观的旋转表示方法，使用三个角度 $(\alpha, \beta, \gamma)$ 来描述三维空间中的旋转。这种表示方法的直观性使其在工程应用中广受欢迎，但其数学性质却存在严重缺陷。

最著名的问题是奇异性，也称为万向锁现象。当中间轴的旋转角度接近 $\pm 90°$ 时，系统实际上失去了一个旋转自由度。这不仅仅是数值问题，而是表示方法本身的内在缺陷：
- 无穷多种欧拉角组合可以表示同一个旋转
- 角速度的计算在奇异点附近变得不稳定
- 插值和路径规划可能产生意外的运动

更深层的问题在于欧拉角到旋转矩阵的映射具有高度非线性特征。即使在远离奇异点的区域，小的角度变化也可能导致旋转矩阵的剧烈变化，这使得基于欧拉角的误差度量缺乏一致性。

当我们尝试设计误差函数时，简单的角度差值 $|\alpha_1 - \alpha_2| + |\beta_1 - \beta_2| + |\gamma_1 - \gamma_2|$ 无法准确反映真实的旋转差异。这是因为不同轴的旋转贡献并不等价，而且旋转的组合具有非交换性——绕X轴后绕Y轴旋转与绕Y轴后绕X轴旋转的结果截然不同。

### 四元数表示的局限性

四元数 $q = q_0 + q_1 i + q_2 j + q_3 k$ 成功避免了欧拉角的奇异性问题，这使其在现代机器人学和计算机图形学中得到广泛应用。然而，四元数在误差函数设计方面也面临独特的挑战。

最重要的问题是双重覆盖特性：任何旋转都可以用两个相反的四元数 $q$ 和 $-q$ 来表示。这种一对二的映射关系在设计误差函数时造成了根本性困难。当我们计算两个旋转之间的"距离"时，必须选择合适的符号来避免不连续性。这不仅增加了计算复杂度，还可能在路径规划中造成不期望的跳跃现象。

除了双重覆盖问题，四元数的几何直觉性也不如旋转矩阵清晰。虽然四元数有着优雅的数学结构，但其物理意义相对抽象，四元数乘法的规则比矩阵乘法更加复杂。更重要的是，四元数与角速度之间的关系需要额外的转换步骤，而在控制系统中，角速度往往是直接可测的物理量。

从实现角度看，四元数还面临约束维护的问题。单位四元数的约束条件 $\|q\| = 1$ 在数值计算过程中可能因舍入误差而被破坏，需要周期性的归一化处理。这在长期运行的系统中可能积累误差，影响系统的稳定性。

## 2. 流形上的姿态误差

### 2.1 旋转群的流形结构

旋转矩阵构成特殊正交群 $SO(3)$：
$$
SO(3) = \{R \in \mathbb{R}^{3 \times 3} : R^T R = I, \det(R) = 1\}
$$

这是一个3维光滑流形，嵌入在9维欧氏空间中。在这个流形上设计误差函数需要考虑其内在几何结构。

### 2.2 设计要求

一个良好的旋转误差函数应满足：

**数学性质**：

1. **非负性**：$\Psi(R, R_d) \geq 0$
2. **唯一最小值**：$\Psi(R, R_d) = 0$ 当且仅当 $R = R_d$
3. **连续性**：在整个 $SO(3)$ 上连续可微
4. **旋转不变性**：$\Psi(QR, QR_d) = \Psi(R, R_d)$ 对任意 $Q \in SO(3)$

**工程要求**：
1. **计算高效**：避免复杂的超越函数和特征值分解
2. **数值稳定**：在所有旋转范围内保持数值稳定性
3. **几何直觉**：与物理上的旋转角度有明确关系
4. **优化友好**：便于梯度计算和优化算法

### 2.3 流形上的距离度量

在黎曼流形上，自然的距离度量是测地距离。对于 $SO(3)$，两个旋转之间的测地距离正比于它们的相对旋转角度：
$$
d(R_1, R_2) = \|\log(R_1^T R_2)\|
$$

然而，对数映射的计算涉及特征值分解和反三角函数，计算代价高且数值敏感。我们需要寻找既保持几何意义又计算简单的替代方案。

## 3. 回顾旋转矩阵迹的性质

考虑两个旋转 $R$ 和 $R_d$ 之间的相对旋转： $$\Delta R = R_d^T R$$

设 $\Delta R$ 对应的旋转角度为 $\theta_e$，那么： $$\text{tr}(\Delta R) = 1 + 2\cos\theta_e$$

### 3.1 方法一：基于罗德里格公式的推导

罗德里格公式将轴角表示 $(\mathbf{n}, \theta)$（其中 $\|\mathbf{n}\| = 1$）转换为旋转矩阵：

$$
R = I + \sin\theta [\mathbf{n}]_\times + (1-\cos\theta)[\mathbf{n}]_\times^2
$$

其中 $[\mathbf{n}]_\times$ 是反对称矩阵：
$$
[\mathbf{n}]_\times = \begin{bmatrix} 
0 & -n_3 & n_2 \\ 
n_3 & 0 & -n_1 \\ 
-n_2 & n_1 & 0 
\end{bmatrix}
$$

**计算旋转矩阵的迹**：
$$
\text{tr}(R) = \text{tr}(I) + \sin\theta \cdot \text{tr}([\mathbf{n}]_\times) + (1-\cos\theta) \cdot \text{tr}([\mathbf{n}]_\times^2)
$$

利用反对称矩阵的性质：
- $\text{tr}(I) = 3$
- $\text{tr}([\mathbf{n}]_\times) = 0$（反对称矩阵迹为零）
- $\text{tr}([\mathbf{n}]_\times^2) = \text{tr}\begin{pmatrix} -n_2^2-n_3^2 & n_1n_2 & n_1n_3 \\ n_1n_2 & -n_1^2-n_3^2 & n_2n_3 \\ n_1n_3 & n_2n_3 & -n_1^2-n_2^2 \end{pmatrix} = -2(n_1^2+n_2^2+n_3^2) = -2$

因此：
$$
\text{tr}(R) = 3 + 0 + (1-\cos\theta)(-2) = 3 - 2(1-\cos\theta) = 1 + 2\cos\theta
$$

### 3.2 方法二：基于特征值的推导

旋转矩阵的特征值具有特殊结构。对于绕轴 $\mathbf{n}$ 旋转角度 $\theta$ 的旋转矩阵，其特征值为：
$$
\lambda_1 = 1, \quad \lambda_2 = e^{i\theta}, \quad \lambda_3 = e^{-i\theta}
$$

**证明**：

- $\lambda_1 = 1$ 对应旋转轴方向，该方向向量保持不变
- $\lambda_2, \lambda_3 = \cos\theta \pm i\sin\theta$ 对应垂直于旋转轴的平面内的复共轭特征值

**计算迹**：
$$
\text{tr}(R) = \lambda_1 + \lambda_2 + \lambda_3 = 1 + e^{i\theta} + e^{-i\theta}
$$
$$
= 1 + \cos\theta + i\sin\theta + \cos\theta - i\sin\theta = 1 + 2\cos\theta
$$

两种方法得到相同结果：
$$
\boxed{\text{tr}(R) = 1 + 2\cos\theta}
$$

## 4. 选择 $1-\cos\theta$ 作为误差度量的依据

### 4.1 几何直觉

考虑两个旋转 $R$ 和 $R_d$ 之间的相对旋转：
$$
\Delta R = R_d^T R
$$

设 $\Delta R$ 对应的旋转角度为 $\theta_e$，那么：
$$
\text{tr}(\Delta R) = 1 + 2\cos\theta_e
$$

**为什么选择 $1-\cos\theta_e$ 作为误差度量？**

1. **边界条件**：
   - 当 $\theta_e = 0$（无误差）时：$1-\cos(0) = 0$
   - 当 $\theta_e = \pi$（最大误差）时：$1-\cos(\pi) = 2$

2. **单调性**：
   $1-\cos\theta$ 在 $[0, \pi]$ 区间内单调递增，误差随角度增大而增大

3. **光滑性**：
   函数在整个定义域内连续可微，适合优化算法

4. **物理意义**：
   $1-\cos\theta$​ 可以理解为旋转"偏离程度"的度量，具有清晰的几何解释

**证明**

由于：
$$
1 - \cos(\|\boldsymbol{\phi}_e\|) = 1 - \frac{\text{tr}(R_d^T R) - 1}{2} = \frac{3 - \text{tr}(R_d^T R)}{2}
$$

我们得到：
$$
f(\|\boldsymbol{\phi}_e\|) = \frac{1}{2}[3 - \text{tr}(R_d^T R)] = \frac{1}{2}\text{tr}[I - R_d^T R]
$$

### 4.2 小角度近似分析

当旋转角度较小时，使用泰勒展开：
$$1-\cos\theta \approx 1-(1-\frac{\theta^2}{2}+\frac{\theta^4}{24}-\cdots) = \frac{\theta^2}{2} - \frac{\theta^4}{24} + \cdots$$

一阶近似：$1-\cos\theta \approx \frac{\theta^2}{2}$

这说明在小角度情况下，我们的误差函数与角度误差的平方成正比，符合二次型Lyapunov函数的要求，适合控制系统设计。

### 4.3 梯度特性

当旋转矩阵的变化表示为 $\delta R = R\hat{\eta}$ 对于 $\eta \in \mathbb{R}^3$ 时，误差函数的导数由下式给出。这里 $\hat{\eta}$ 是一个微小的旋转扰动，$R\hat{\eta}$ 表示这个扰动在 $R$ 作用下的结果。

$$
\begin{align}
\text{D}_R\Psi(R, R_d) \cdot R\hat{\eta} 
&= -\tfrac{1}{2}\text{tr}\!\left(R_d^T R \hat{\eta}\right) \\
&= \tfrac{1}{2}\left(R_d^T R - R^T R_d\right)^\vee \cdot \eta
\end{align}
$$
这个公式的物理意义是，它给出了旋转误差函数关于 $R$ 的梯度，这个梯度指向了误差减少的方向。在优化过程中，我们可以通过沿着这个梯度方向调整 $R$ 来最小化误差函数 $\Psi(R, R_d)$。这个梯度的表达式也表明了误差函数的选择是合理的，因为它的梯度直接对应于我们直观理解的旋转误差向量。其中 vee map $\vee : \text{so}(3) \rightarrow \mathbb{R}^3$ 是 hat map 的逆。

这里使用了迹（trace）运算的性质:

> 1. 矩阵乘积的迹在循环置换下不变：对于任何 $x, y \in \mathbb{R}^3$，有 $-\frac{1}{2}\text{tr}[\hat{x}\hat{y}] = x^T y$​​。
>
> 2. 对任意矩阵 $A \in \mathbb{R}^{3\times 3}$，有恒等式：
>    $$
>    \operatorname{tr}(A \hat{\eta}) = - (A - A^T)^\vee \cdot \eta.
>    $$
>    证明思路如下：  
>    - 记 $\hat{\eta}$ 是由向量 $\eta \in \mathbb{R}^3$ 构造的反对称矩阵，即  $\hat{\eta}x = \eta \times x$。  
>    - 因此 $\operatorname{tr}(A \hat{\eta}) = \operatorname{tr}\!\left(\tfrac{1}{2}(A - A^T)\hat{\eta}\right)$，  
>      因为对称部分与 $\hat{\eta}$ 的乘积迹为零。  
>    - 利用反对称矩阵与向量的对应关系，得到$\operatorname{tr}(A \hat{\eta}) = - (A - A^T)^\vee \cdot \eta.$
>

基于此，姿态跟踪误差 $e_R$ 被选择为：
$$
e_R = \frac{1}{2}(R_d^T R - R^T R_d)^\vee.
$$

## 参考文献

[1] BARFOOT T D. State Estimation for Robotics[M/OL]. 1 版. Cambridge University Press, 2017[2023-12-11]. https://www.cambridge.org/core/product/identifier/9781316671528/type/book. DOI:[10.1017/9781316671528](https://doi.org/10.1017/9781316671528).

[2] LEE T, LEOK M, MCCLAMROCH N H. Geometric tracking control of a quadrotor UAV on SE(3)[C/OL]//49th IEEE Conference on Decision and Control (CDC). Atlanta, GA: IEEE, 2010: 5420-5425[2024-09-29]. http://ieeexplore.ieee.org/document/5717652/. DOI:[10.1109/CDC.2010.5717652](https://doi.org/10.1109/CDC.2010.5717652).
