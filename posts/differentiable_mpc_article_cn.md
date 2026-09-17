---
description: 可微分模型预测控制方法的梯度推导
date: '2026-02-03'
author: 'pxx'
categories:
  - Optimal Control
published: true
column:
  name: 最优控制

---



# 可微分MPC的推导逻辑：从 KKT 隐式微分到 Zero-Constrained LQR

## 摘要

可微分模型预测控制（Differentiable MPC, DMPC）的核心思想，是把传统 MPC 从“不可微的优化黑箱”改写为“可嵌入端到端学习系统中的可微策略层”。它并不是简单地把 iLQR 或 box-DDP 的全部迭代过程展开后做反向传播，而是在求解器收敛到固定点后，对该固定点处的局部凸近似问题进行隐式微分。这样一来，原本复杂的“穿过优化器反传”的问题，被转化为一次结构化、可高效求解的线性二次控制问题。本文基于 Brandon Amos 等人在 *Differentiable MPC for End-to-end Planning and Control* 中的思路，对可微分 MPC 的推导链条做一个尽量完整而清晰的梳理。

## 1. 为什么需要可微分 MPC

传统 MPC 的优势在于：它显式利用系统模型、约束和滚动优化机制，因而在安全性、可解释性和控制结构方面具有天然优势。但它也有一个突出问题：优化器本身通常被当作黑箱使用，难以直接嵌入梯度学习框架。于是，一旦我们希望根据任务损失自动调整动力学参数、代价函数参数，或者把规划器嵌入更大的神经网络系统中，就会立刻遇到“梯度无法穿过 MPC 求解过程”的障碍。

可微分 MPC 的意义，正是在这里体现出来。它试图保留 MPC 对结构、模型和约束的利用能力，同时获得端到端学习的可训练性。换句话说，DMPC 不是用神经网络替代 MPC，而是把 MPC 本身变成一个可学习模块。

## 2. 从可微分 LQR 开始：把最优控制写成一个优化层

理解 DMPC，最自然的入口其实不是非线性 MPC，而是有限时域 LQR。因为 LQR 本质上是一个带线性动力学约束的凸二次规划。将状态与控制拼成阶段变量

$$
\tau_t = \begin{bmatrix}x_t \\ u_t\end{bmatrix},
$$

则 LQR 可写为

$$
\min_{\{\tau_t\}_{t=1}^T} \sum_{t=1}^T \left( \frac12 \tau_t^\top C_t \tau_t + c_t^\top \tau_t \right)
$$

并满足线性动力学约束

$$
x_{t+1} = F_t \tau_t + f_t, \qquad x_1 = x_{\text{init}}.
$$

由于目标是凸二次型、约束是线性的，这个问题的最优解由 KKT 条件唯一刻画。进一步看，经典的 Riccati 递推并不只是一个“控制算法技巧”，它本质上等价于高效求解这个稀疏 KKT 线性系统。

对每个动力学约束引入对偶变量（拉格朗日乘子）$\lambda_t$。拉格朗日函数可写成（论文式 (4)）：
$$
\mathcal L(\tau,\lambda)=\sum_{t=1}^T \frac12 \tau_t^\top C_t \tau_t
+\sum_{t=0}^{T-1}\lambda_t^\top\left(F_t\tau_t+f_t-x_{t+1}\right).
$$
最优解 $(\tau^\star,\lambda^\star)$ 必须满足：

1) 原始可行性：动力学约束成立  
2) 对偶可行性（这里都是等式约束所以没额外不等式条件）  
3) 驻点条件（对 $\tau_t$ 的梯度为零）：

$$
\nabla_{\tau_t}\mathcal L(\tau^\star,\lambda^\star)=0,
$$

论文把它展开成式 (5)，并把整体写成一个稀疏的 **KKT 线性方程组**：
$$
K
\begin{bmatrix}
\vdots\\
\tau_t^\star\\
\lambda_t^\star\\
\vdots
\end{bmatrix}
=
-\begin{bmatrix}
\vdots\\
c_t\\
f_t\\
\vdots
\end{bmatrix},
$$
即论文式 (6)。

> 关键点：**求解 LQR（Riccati 递推）本质上等价于高效求解这个 KKT 稀疏线性系统。**

这一步非常关键。因为只要把 LQR 视作一个“由 argmin 隐式定义的层”，就可以不去显式写出最优解关于参数的解析式，而是直接对 KKT 条件做隐式微分。

## 3. LQR 为什么可微：反向传播等价于“再解一次 LQR”

设外部任务损失为 $\ell(\tau^\star_{1:T})$，我们真正关心的是

$$
\frac{\partial \ell}{\partial \theta}
= \frac{\partial \ell}{\partial \tau^\star}
\frac{\partial \tau^\star}{\partial \theta},
$$

其中 $\theta = \{C,c,F,f\}$ 表示 LQR 的参数。难点在于，$\tau^\star$ 不是显式函数，而是“解优化问题得到的结果”。

解决方法是：对 KKT 条件隐式求导，引入反向变量 $(d^\star\tau, d^\star\lambda)$。

把 KKT 系统抽象成
$$
g(z,\theta)=0,\quad z=\begin{bmatrix}\tau^\star\\ \lambda^\star\end{bmatrix}.
$$
对它微分：
$$
\frac{\partial g}{\partial z}\,dz + \frac{\partial g}{\partial \theta}\,d\theta=0.
$$

如果直接算 $d\tau^\star/d\theta$ 会很麻烦。更常见的做法是引入“伴随变量/反向量”，最后会落到论文里的结论：只要解下面这个线性系统就能拿到需要的反向量 $(d^\star\tau, d^\star\lambda)$：
$$
K
\begin{bmatrix}
\vdots\\
d^\star\tau_t\\
d^\star\lambda_t\\
\vdots
\end{bmatrix}
=
-\begin{bmatrix}
\vdots\\
\nabla_{\tau_t^\star}\ell\\
0\\
\vdots
\end{bmatrix},
$$
这就是论文式 (9)。

注意看：左边还是同一个 $K$！  
所以它**等价于再解一次 LQR**：把原来 LQR 里的线性项 $c_t$ 替换成 $\nabla_{\tau_t^\star}\ell$，把 $f_t$ 置零

> - 正向：解 LQR 得到 $\tau^\star$。  
> - 反向：把“外部损失对轨迹的梯度”当成新的线性项，再解一次“同结构”的 LQR，得到 $d^\star\tau$、$d^\star\lambda$。  
>   这就像“优化层”的反向传播。

有了 $d^\star\tau,d^\star\lambda$，梯度对各参数怎么写？论文给出了直接公式（式 (8)）：
$$
\nabla_{C_t}\ell=\frac12\left(d^\star\tau_t\otimes\tau_t^\star+\tau_t^\star\otimes d^\star\tau_t\right),\quad
\nabla_{c_t}\ell=d^\star\tau_t
$$

$$
\nabla_{F_t}\ell=d^\star\lambda_{t+1}\otimes\tau_t^\star+\lambda_{t+1}^\star\otimes d^\star\tau_t,\quad
\nabla_{f_t}\ell=d^\star\lambda_t,
$$

以及对初值也能得到
$$
\nabla_{x_{\text{init}}}\ell=d^\star\lambda_0.
$$
这里 $\otimes$ 是外积（得到矩阵梯度）。这些式子本质上是：  

- $C_t,c_t$ 出现在目标里 → 梯度由“最优轨迹”和“反向轨迹”组合出来；  
- $F_t,f_t$ 出现在约束里 → 梯度涉及对偶变量 $\lambda^\star$ 与反向对偶 $d^\star\lambda$。

因为反向那一步解的是**同一个 KKT 结构**（同一个 $K$），所以：

- 可以复用正向 Riccati 分解/因子分解；
- 反向开销接近再跑一次 LQR，而不是“展开很多步迭代再反传”。

于是，对参数的梯度可以直接写成由“正向最优轨迹”和“反向伴随轨迹”组合而成的外积形式。这也是可微分 LQR 的核心：**反传不再依赖对求解器逐步展开，而是依赖对最优性条件的隐式微分。**

## 4. 从 LQR 推广到 MPC：难点在于非线性与控制约束

真实 MPC 问题通常不是 LQR，而是

$$
\tau^*_{1:T} = \arg\min_{\tau_{1:T}} \sum_{t=1}^T C_{\theta,t}(\tau_t)
$$

满足

$$
x_1 = x_{\text{init}}, \qquad x_{t+1} = f_{\theta,t}(\tau_t), \qquad \underline u \le u_t \le \overline u.
$$

这里既有非线性代价，也有非线性动力学，还存在控制输入的 box 约束。因此这个问题一般是非凸的，无法像 LQR 那样一次性得到一个全局可微的闭式结构。

论文采用的思路，是沿用 iLQR / DDP 的标准做法：在当前轨迹附近对代价做二阶泰勒展开，对动力学做一阶线性化，从而得到一个局部凸的 box-constrained QP 子问题。

1. 代价函数二阶近似

$$
\begin{aligned}
\tilde C_{\theta,t}^i(\tau_t)
&\approx
C_{\theta,t}(\tau_t^i)
+ (p_t^i)^\top (\tau_t - \tau_t^i) \\
&\quad + \frac12 (\tau_t - \tau_t^i)^\top H_t^i (\tau_t - \tau_t^i)
\end{aligned}
$$

$$
p_t^i = \nabla_{\tau_t} C_{\theta,t}(\tau_t^i), \quad
H_t^i = \nabla^2_{\tau_t} C_{\theta,t}(\tau_t^i)
$$

2. 动力学一阶近似

$$
x_{t+1}
\approx
f_{\theta,t}(\tau_t^i)
+ F_t^i (\tau_t - \tau_t^i)
$$

$$
F_t^i = \nabla_{\tau_t} f_{\theta,t}(\tau_t^i)
$$

若第 $i$ 次迭代轨迹为 $\tau^i$，则可构造局部近似
$$
\tilde C^i_{\theta,t}(\tau_t), \qquad \tilde f^i_{\theta,t}(\tau_t),
$$

并求解对应的局部 QP。若迭代最终收敛到固定点

$$
\tau^{i+1} = \tau^i = \tau^\star,
$$

那么该固定点处的局部凸近似，就精确刻画了原始非线性 MPC 在这一点附近的局部最优结构。于是，原问题的微分可以转化为“对固定点处的局部 QP 做隐式微分”。

## 5. 带 box 约束 QP 的隐式微分：激活约束会在反向中被冻结

为了处理控制饱和，论文先研究一个更一般的 box-QP：

$$
x^* = \arg\min_x \frac12 x^\top Qx + p^\top x
\quad
\text{s.t. } Ax=b,\; \underline x \le x \le \overline x.
$$

在最优点处，如果某些不等式约束被激活，那么这些激活的不等式可以等价写成等式约束 $\tilde Gx = \tilde h$。

对 box 约束来说，$\tilde G$ 很简单：

- 如果第 $i$ 维下界激活：加一行 $e_i^\top$，右边是 $\underline x_i$
- 如果第 $j$ 维上界激活：加一行 $e_j^\top$，右边是 $\overline x_j$

这里 $e_i$ 是第 $i$ 个标准基向量（只有第 $i$ 个分量是 1，其它是 0）。则 KKT 系统为
$$
\begin{bmatrix}
Q & A^\top & \tilde G^\top \\
A & 0 & 0 \\
\tilde G & 0 & 0
\end{bmatrix}
\begin{bmatrix}
x^* \\ \lambda^* \\ \tilde\nu^*
\end{bmatrix}
=
-
\begin{bmatrix}
p \\ b \\ \tilde h
\end{bmatrix}
$$

于是原问题在局部上可以改写成一个等式约束 QP，其最优性由扩展 KKT 系统给出。

更重要的是，对这个 KKT 系统做隐式微分后，可以得到一个与正向同结构的反向线性系统。这个反向系统等价于一个新的二次规划：

$$
d_x^* = \arg\min_{d_x}
\frac12 d_x^\top Q d_x + (\nabla_{x^*}\ell)^\top d_x
$$

满足

$$
A d_x = 0, \qquad d_{x,i} = 0 \;\; \text{if } x_i^* \text{ 位于边界}.
$$

这句话的物理意义非常清楚：**如果某一维在正向求解中已经顶到了边界，那么在反向扰动中，这一维就不能再变化。** 也就是说，激活的 box 约束在反向传播中会把对应方向“冻结”起来。

## 6. 可微分 MPC 的关键一步：反向传播变成 zero-constrained LQR

把前面的 box-QP 结论代回固定点处的 MPC，就得到整篇论文最漂亮的一步：反向传播等价于求解一个 zero-constrained LQR。

具体来说，在固定点处，局部二次代价 Hessian $H_t^n$ 对应于 box-QP 中的 $Q$，线性化动力学 $F_t^n$ 对应于等式约束矩阵 $A$，而轨迹变量则对应于整段 $\tau_{1:T}$。于是反向问题可以写成

$$
d\tau^*_{1:T}
= \arg\min_{d\tau_{1:T}}
\sum_{t=1}^T
\left(
\frac12 d\tau_t^\top H_t^n d\tau_t
+ (\nabla_{\tau_t^*}\ell)^\top d\tau_t
\right)
$$

满足

$$
dx_1 = 0, \qquad dx_{t+1} = F_t^n d\tau_t,
$$

以及

$$
du_{t,i} = 0 \quad \text{若 } u_{t,i}^* \text{ 在边界上}.
$$

这就是所谓的 **zero-constrained LQR**：它本质上仍然是一个 LQR，只不过那些在正向中饱和的控制维度，在反向中被置零。于是，MPC 的反向传播再次回到了“再解一次结构化 LQR”的框架中。

至此，DMPC 的推导主线就完整了：

1. 将非线性 MPC 通过 iLQR / box-DDP 转化为固定点处的局部凸 QP；
2. 将带 box 约束的 QP 写成激活约束下的 KKT 系统；
3. 对 KKT 条件做隐式微分；
4. 将反向问题重新解释为一个带冻结控制维度的 LQR；
5. 复用正向分解，高效获得对模型参数和代价参数的梯度。

## 9. 结语

这套方法最大的价值，在于它避免了“展开整个优化过程”所带来的时间和显存开销。与把 iLQR 迭代全部 unroll 再做反向传播相比，固定点隐式微分的反向过程只需要一次额外的结构化求解，并且还能复用正向阶段已经得到的分解结果。因此，它在计算上更高效，也更适合与学习模块耦合。

从应用角度看，DMPC 允许我们直接根据任务损失去学习动力学与代价函数，而不是只做独立的系统辨识。论文中的实验也表明，这种方式不仅比展开式反传更高效，而且在模仿学习任务中，相比普通神经网络策略具有更好的样本效率；在专家不可实现的情形下，直接优化任务损失也优于把系统辨识作为替代目标的做法。

当然，这一方法并非没有条件。它依赖一个关键假设：**求解器应当收敛到固定点**。如果 iLQR / box-DDP 尚未收敛，或者由于动力学由神经网络参数化而导致固定点根本不存在，那么固定点处的隐式微分就不再成立。此时若仍直接套用上述推导，得到的梯度可能是错误的。论文对此给出的替代方案，是将求解器视为计算图并进行展开式求导，但这样做的代价会随着迭代步数线性增长。

因此，可微分 MPC 的实质并不是“任何 MPC 求解器都能无条件可微”，而是：**在固定点存在且可被稳定求得时，我们可以把反向传播重新组织成一次高效、结构化的最优控制求解。**

可微分 MPC 最值得关注的地方，不只是“它能反传”，而是它揭示了一种更深层的观点：最优控制器并不一定只能作为学习系统外部的黑箱模块存在；只要从最优性条件出发，它完全可以被视为一个结构化的可微层。Amos 等人的工作给出的关键启发是，MPC 的可微性并不来自对迭代过程的蛮力展开，而是来自对固定点处 KKT 结构的准确把握。

## 参考文献

1. Amos B, Jimenez I, Sacks J, et al. *Differentiable MPC for End-to-end Planning and Control*. NeurIPS, 2018.
2. Tassa Y, Mansard N, Todorov E. *Control-Limited Differential Dynamic Programming*. ICRA, 2014.
