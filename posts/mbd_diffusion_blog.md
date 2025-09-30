---
description: Model-Based Diffusion论文解读
date: '2025-09-24'
author: 'pxx'
categories:
  - Optimal Control
published: true
---



# 论文《Model-Based Diffusion for Trajectory Optimization》代码实现解析

## 1. DDPM 与 MBD 的对比

传统的 DDPM（Denoising Diffusion Probabilistic Model）是一种数据驱动的生成模型。它包含一个真实存在的 **前向扩散过程**：从训练数据采样，然后逐步加噪直到变成高斯分布。反向扩散则通过神经网络学习 score function $s(x,t) = ∇_x \log p(x_t)$，从噪声中逐步还原出原始数据。

在 DDPM 中，反向更新公式为：
$$
Y_{t-1} = \frac{1}{\sqrt{\alpha_t}} \Big(Y_t - \frac{1-\alpha_t}{\sqrt{1-\bar{\alpha}_t}}\, \epsilon_\theta(Y_t, t) \Big) + \sigma_t z,
$$
其中 $\epsilon_\theta$ 是通过监督学习训练出的神经网络预测噪声，等价于学习 score function $\nabla_x \log p(x_t)$。

MBD 的形式与之相似：

$$
Y^{(i-1)} = \frac{1}{\sqrt{\alpha_i}}\Big( Y^{(i)} + (1-\alpha_i) \, \nabla_{Y^{(i)}} \log p_i(Y^{(i)}) \Big),
$$

但这里的梯度不再是神经网络输出，而是通过 reward 加权样本得到的“模型驱动 score”。换言之，DDPM 的 score 来自数据分布的学习，而 MBD 的 score 来自环境动力学和奖励反馈。

MBD（Model-Based Diffusion）虽然借鉴了扩散模型的形式，但核心机制完全不同。这里并不存在真正意义上的前向扩散，因为没有一个“真实数据分布”可供参考。所谓“前向扩散”只是人为设定的一组噪声调度参数 $(α, β)$，用于控制反向优化时的噪声尺度。MBD 的 score function 不依赖神经网络，而是通过 **模型 rollout + reward 加权采样** 来获得。这意味着它是 **模型驱动的、无监督的优化过程**。

## 2. 扩散参数的设定

论文和代码中扩散参数的设定如下：
$$
\bar{α}_i = \prod_{j=1}^i α_j, \quad σ_i = \sqrt{1 - \bar{α}_i}.
$$
代码实现：

```python
# ---------- 扩散 schedule（与论文 Eq.(3) 对应） ----------
# betas：线性调度
betas = jnp.linspace(args.beta0, args.betaT, args.Ndiffuse)   # β_t
alphas = 1.0 - betas                                          # α_t = 1 - β_t
alphas_bar = jnp.cumprod(alphas)                              # ᾱ_t = ∏_{k<=t} α_k (论文 Eq.(3) 中的 ᾱ_i)
sigmas = jnp.sqrt(1 - alphas_bar)                             # σ_t = sqrt(1 - ᾱ_t)，在论文中作为 p_{i|0} 的方差成分

# YN 是初始的 normalized Y^{(N)} —— 在此实现里设为 0（对应从 N 步噪声均值开始采样）。
Yi = YN
Ybars = []
```
这些参数不代表任何真实的数据生成过程，而是作为退火噪声调度，保证反向迭代逐步收敛。

## 3. 轨迹采样

在反向更新的每一步，需要从分布 $φ_i(Y(0))$ 采样候选轨迹：
$$
Y^{(0)} \sim ϕ_i ∝ p(Y^{(i)}|Y^{(0)}).
$$
代码实现：
```python
# Yi 是当前状态 Y(i) 从均值 Ybar_i 恢复Y^(i)
Yi = Ybar_i * jnp.sqrt(alphas_bar[i])
# （对应论文 Eq.(3) 条件分布的均值项：√ᾱ_i * Y(0)）

# === 从 φ_i（论文第 4 部分定义的分布）采样 Y(0) 候选样本 ===
# 论文中定义 φ_i(Y(0)) ∝ p_i|0(Y(i) | Y(0))
# φ_i 是以 (Yi / sqrt(alpha_bar[i])) 为均值、方差为 (1/ᾱ_i - 1)I 的分布的同义变形；
# 一个常用的简化是使用 σ = sqrt(1 - ᾱ_i) 来近似标准差（在论文实验实现中使用该采样）
rng, Y0s_rng = jax.random.split(rng)
# eps_u: shape (Nsample, Hsample, Nu)
eps_u = jax.random.normal(Y0s_rng, (args.Nsample, args.Hsample, Nu))
# Y0s ~ N(Ybar_i, σ_i^2 I)：这里用 Ybar_i（即 Yi / sqrt(alpha_bar[i]） 作为均值）
# 这一步实现了论文中 Monte-Carlo 对积分的采样：Y(0) ∈ ϕ_i(·) 
Y0s = eps_u * sigmas[i] + Ybar_i # Yi / sqrt(ᾱ_i)
# 限幅到 [-1,1] 是实现细节（避免极端动作），可视具体任务调整
Y0s = jnp.clip(Y0s, -1.0, 1.0)
```
这里 clip 到 [-1,1] 是实现上的安全措施，避免极端动作。

## 4. rollout 计算得分

对采样得到的每条轨迹，使用环境模型进行 rollout，得到累计 reward：
```python
# === 用模型（环境仿真）评估每条样本轨迹的回报 / 似然 ===
# rollout_us 会对每个 Y0s（shape: Hsample x Nu）做一次 "shooting"（把动作序列输入 dynamics，得到 states & rewards）
# vmap 使得可并行地对所有样本（args.Nsample 条）进行 rollout
# rewss: shape (Nsample, Hsample) / qs: 状态轨迹/其它信息（实现依赖）
rewss, qs = jax.vmap(rollout_us, in_axes=(None, 0))(state_init, Y0s)

# 综合每条样本的 reward（例如对时序求平均或求最终回报，取决于 rollout_us 的实现）
# rews shape: (Nsample,)
rews = rewss.mean(axis=-1)
```
reward 会被标准化后映射到 log 概率：
$$
\log p_0 ∝ \frac{r - μ_r}{σ_r λ},
$$
其中 $μ_r, σ_r$ 是 reward 的均值与标准差，$λ$ 为温度系数：

```python
# 为了数值稳定，把 reward 正则化成零均值单位方差（近似把 reward 映射到 log-likelihood）
# 论文中 p0(Y(0)) ∝ exp(-J(Y(0))/λ)，实现上我们往往把 reward 与 J 的负相关关系利用起来：
# 这里做 (rews - mean) / std / temp_sample，最后会用于 softmax 得到权重
rew_std = rews.std()
rew_std = jnp.where(rew_std < 1e-4, 1.0, rew_std)  # 防止标准差过小
rew_mean = rews.mean()
# logp0 是对模型驱动下的“log-likelihood”的经验估计（非归一化）
# 这一步等价于把 reward 映射到 p0 的 log 槽： log p0 ∝ reward / λ  （论文 Eq.(2) 的实现形式）
# - 减均值 / 除方差 → reward 标准化 防止 softmax 溢出
# - 再除温度 λ (temp_sample) → 控制 softmax 权重的平滑度
logp0 = (rews - rew_mean) / rew_std / args.temp_sample
```
这样做的好处是数值稳定，并能让 reward 在不同批次之间可比较。

## 5. 示范轨迹融合

若存在示范轨迹，论文提出混合分布：
$$
p'_0 = (1-η) p_{model} + η p_{demo}.
$$
代码实现逻辑：

```python
# === 若启用示范 (demo)，按论文 Eq.(11)-(13) 合并示范信息 ===
# 论文里给出：p'0 ∝ (1-η) p_model + η p_demo，并通过 max/predicate 来选择信任演示还是模型（见 Eq.(12)-(13)）
if args.enable_demo:
    # env.eval_xref_logpd(qs) 应返回与演示（xref）相关的 log-prob 或相对分数
    xref_logpds = jax.vmap(env.eval_xref_logpd)(qs)
    xref_logpds = xref_logpds - xref_logpds.max()  # 数值稳定化
    # logpdemo: 归一化的 demo 似然估计（加上 env.rew_xref 作为示范质量项）
    logpdemo = (
        (xref_logpds + env.rew_xref - rew_mean) / rew_std / args.temp_sample
    )
    # demo_mask: 当 demo 比模型更可信时，选用 demo 的 log-likelihood（对应 Eq.(12)）
    demo_mask = logpdemo > logp0
    logp0 = jnp.where(demo_mask, logpdemo, logp0)
    # 进一步标准化（实现细节）：这步会使得后续 softmax 得到数值稳定的权重
    logp0 = (logp0 - logp0.mean()) / logp0.std() / args.temp_sample
```
当示范的得分高于模型样本时，优先使用示范。

## 6. softmax 加权更新

将 log 概率通过 softmax 转换为权重，并据此计算候选轨迹的加权均值：
```python
# === 计算权重并得到加权的 Ybar (论文 Eq.(9b) / Eq.(10d) / Eq.(13)) ===
# weights = softmax(logp0) (归一化后近似 p0(Y(0)) / normalizer)
weights = jax.nn.softmax(logp0)  # shape: (Nsample,)
# Ybar 是对采样 Y0s 的加权平均：∑ w_n * Y0s_n （论文中 Ȳ(0)）
# 注意 einsum 索引：n: sample idx, nij 对应每条样本的 (Hsample x Nu)
Ybar = jnp.einsum("n,nij->ij", weights, Y0s)  # shape: (Hsample, Nu)
# NOTE: 这里注释原代码写了 "NOTE: update only with reward"，意味着只用 reward(或 model-likelihood) 来做权重
```
这样得到的 $Ybar$ 作为“最佳轨迹均值”参与下一步更新。

## 7. MC 梯度下降

论文 Eq.(6) 给出基于 Monte Carlo 的 score function 估计：
$$
s(Y^{(i)}) = \frac{1}{1-\bar{α}_i}\Big(-Y^{(i)} + \sqrt{\bar{α}_i} \mathbb{E}[Y^{(0)}]\Big).
$$
代码对应：

```python
    # === 根据论文 Eq.(7c) 用 Monte-Carlo 估计得到 score（∇_{Y(i)} log p_i(Y(i))） ===
    # 论文公式（7c）:
    # ∇_{Y(i)} log p_i(Y(i)) = -Y(i)/(1-ᾱ_i) + √ᾱ_i/(1-ᾱ_i) * E_{Y(0)∼ϕ_i}[Y(0) p0(Y(0))] / Z
    # 在实现中，Ybar 即近似 E[Y(0) p0]/Z
    score = 1 / (1.0 - alphas_bar[i]) * (-Yi + jnp.sqrt(alphas_bar[i]) * Ybar)
    # 这等价于论文 Eq.(9a)/(10c) 的 Monte-Carlo 估计结果（把分子/分母合并到 Ybar）

    # === Monte-Carlo score-ascent / reverse update（论文 Eq.(6)） ===
    # 论文 Eq.(6)：
    # Y^{(i-1)} = 1/√α_i ( Y^{(i)} + (1 - ᾱ_i) ∇_{Y(i)} log p_i(Y(i)) )
    Yim1 = 1 / jnp.sqrt(alphas[i]) * (Yi + (1.0 - alphas_bar[i]) * score)

    # 为了在下一轮中继续采样 φ_{i-1}（其均值为 Y^{(i-1)} / √ᾱ_{i-1}），把 Yim1 转换为 normalized form
    Ybar_im1 = Yim1 / jnp.sqrt(alphas_bar[i - 1])
```
这一步类似梯度下降：reward 高的轨迹使得反向更新朝着更优方向收敛。

## 8. 完整流程总结

1. 初始化随机轨迹 $Y^N \sim \mathcal{N}(0,I)$。
2. 对 i 从 N 到 1：
   - 从分布 $ϕ_i$ 采样候选轨迹 Y(0)；
   - rollout 计算 reward；
   - 将 reward 转换为 log 概率；
   - 若有示范，融合 p_demo；
   - 使用 softmax 加权更新轨迹均值；
   - 根据 MC score function 更新 Y(i-1)。
3. 最终得到高 reward 的轨迹。

与 DDPM 类似，MBD 使用了“扩散—反扩散”的框架。但它并不是从数据中学习 score，而是通过模型和奖励信号直接优化轨迹，体现了 **从生成建模到决策优化的转变**。



## 参考文献

[1] PAN C, YI Z, SHI G, 等. Model-Based Diffusion for Trajectory Optimization[A/OL]. arXiv, 2024[2025-09-09]. http://arxiv.org/abs/2407.01573. DOI:[10.48550/arXiv.2407.01573](https://doi.org/10.48550/arXiv.2407.01573).

[2] SONG Y, SOHL-DICKSTEIN J, KINGMA D P, 等. Score-Based Generative Modeling through Stochastic Differential Equations[A/OL]. arXiv, 2021[2025-04-02]. http://arxiv.org/abs/2011.13456. DOI:[10.48550/arXiv.2011.13456](https://doi.org/10.48550/arXiv.2011.13456).

[3] HO J, JAIN A, ABBEEL P. Denoising Diffusion Probabilistic Models[A/OL]. arXiv, 2020[2024-10-21]. http://arxiv.org/abs/2006.11239.

[4] [(12 封私信) 一文解释 Diffusion Model (二) Score-based SDE 理论推导 - 知乎](https://zhuanlan.zhihu.com/p/589106222)
