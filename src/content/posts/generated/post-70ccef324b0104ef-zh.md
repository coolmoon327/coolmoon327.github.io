---
title: "使用 KNN 让 DDPG 选择离散动作"
date: "2022-10-24"
description: "整理 Wolpertinger 架构与 DDPG 的差异、实现修改及实验观察。"
tags: ["wolpertinger", "ddpg", "discrete-actions"]
categories: ["AI"]
locale: "zh"
slug: "wolpertinger-ddpg-discrete-actions"
sourceId: "post-70ccef324b0104ef"
translationKey: "post-70ccef324b0104ef"
generated: true
draft: false
---

# 使用 KNN 让 DDPG 选择 Discrete 行为

> 参考 [Deep Reinforcement Learning in Large Discrete Action Spaces](https://arxiv.org/pdf/1512.07679.pdf)，Google DeepMind，2016
>
> Wolpertinger Architecture 的 Pytorch 版本代码实现

## 与 DDPG 的差异

[Image omitted: third-party image]

- Wolpertinger Architecture 使用 Actor-Critic 结构，但**行为选择**不止靠 Actor 进行。
  1. Actor 输入状态，输出一组连续向量，经过 KNN 聚类出**K 组**行为空间中**最接近**的离散向量。
  2. Critic 输入状态和其中一组离散向量，遍历完 K 次，一共输出 K 个 Q 值。
  3. 找到**最大**的一个 Q 值，对应的离散向量就是**行为**。
- 经验回放池中存储最后**执行**的离散行为向量，和一般的 DDPG 一样。
  - 因此 Critic 网络的训练过程可以直接用 buffer 中的 state 和 action 来计算 Q。
- Critic 网络的训练需要注意 **Target Q 值**的生成。
  - 在 Algorithm 2 的 line 13 处，QtargetQ\_{target}Qtarget​ 网络输入的 Action 来自 πtarget\pi\_{target}πtarget​，其中同时包含 ActortragetActor\_{traget}Actortraget​ 与 CritictargetCritic\_{target}Critictarget​。
  - 训练过程就是一般的 Critic Loss 梯度下降。
- Actor 网络的训练依旧**可以直接用 Q 值反向传播**。
  - $ \begin{aligned} \nabla\_{\theta} f\_{\theta^{\pi}} \approx \mathbb{E}*{f{\prime}}\left[\left.\nabla\_{\theta{\pi}} Q*{\theta^{Q}}(\mathbf{s}, \hat{\mathbf{a}})\right|*{\hat{\mathbf{a}}}=f*(\mathbf{s})\right] =\mathbb{E}*{f^{\prime}}\left[\nabla*{\hat{\mathbf{a}}} Q\_{\theta^{Q}}\left(\mathbf{s}, f\_{\theta}(\mathbf{s})\right) \cdot \nabla\_{\theta^{\pi}} f\_{\theta^{\pi}}(\mathbf{s}) \mid\right] \end{aligned} $
  - DDPG 的 Actor 网络也遵循上述梯度表达式，由于 Actor 与 Critic 直接相连，可以直接从 Critic 输出的 Q 值开始反向传播（甚至允许此时的反向传播更新 Critic 网络）。
  - Wolpertinger Architecture 的 Actor 与 Critic 之间有一个 KNN，并且存在 K 个 Critic 输出的 Q 值中选最大的过程，不过根据 Algorithm 2 的 line 15，对 Q 求导时的 a 取自 Actor，训练过程与 DDPG 无异。

[Image omitted: third-party image]

## 代码实现

- Wolpertinger Architecture 的实现中，单独提供了一个 select\_action 模块。

  1. 用传统的 ddpg\_select\_action 选择 proto\_action。
  2. 找到 proto\_action 的 K 近邻。
  3. 用 Critic 计算生成 K 个近邻的 Q 值。
  4. 找到 Argmax，并返回对应的近邻 Action。
  - 以上过程全部使用最新的网络，而非 Target 网络。
- update\_policy 和 DDPG 没有区别。

  - Q 值使用 buffer 中记录的 state 与 **discrete action** 计算。
  - Target Q 值使用 ActortargetActor\_{target}Actortarget​ 求出的 proto\_action 计算，此时 CritictargetCritic\_{target}Critictarget​ 的输入是 **continuous action**。
    - **不符合 Algorithm 2 的 line 13**。
  - Actor 的训练直接使用 Q 值进行反向传播，此时 CriticCriticCritic 的输入是 **continuous action**。
    - 这是没有问题的。

## D4PG 代码中需要修改的地方

- 希望将 Wolpertinger Architecture 剥离出来，作为一个单独的模块，方便以后应用到其他 policy based 代码中。
  - 参考 Wolpertinger 的代码，主要工作就是实现新的 select\_action，以及 K-means 计算。
  - 参考代码没有完善训练过程的修改，应该适当研究一下。
  - 留心 D4PG 训练中关于 Distributional Q 的计算会不会有影响。
- 该文章使用 K 近邻的方式实际上暗含了对行为的编码，**我们是否也需要进行一种编码？**
  - 比如 20 个基站，二进制编码为 5 个输出。
  - 最终决定依旧使用 ordinary encoding。

1. 在 action\_space.py 中重新实现一个 K-means，不要使用笛卡尔积。
   1. 重构其中的 rebuild\_flann 函数，另其将 [-1., 1.] 的神经网络输出映射到 M+1 个离散数值 [0, M] 上。
   2. 与原程序不同的是，动作空间在 [0, M] 上，所以需要将 p\_in 给标准化成离散值。
   3. 最后还是输出两组结果，一个对应神经网络的输出 [-1., 1.]，一个对应真实的行为 [0, M]。
2. 将 Actor 的 tanh + cat 直接改为 nn.Softsign()。
3. 移植 wolp\_action 函数。
   1. 替换其中关于 to\_tensor 与 to\_numpy 的内容。
   2. critic 相关要进行 distributional 处理。
4. 增加 select\_action。
   1. 将 agent.py 中的 self.actor.get\_action(state) 改为 select\_action，同时要让 agent 持有 critic 网络。
   2. 提供 wolp 选项，将 actor 的输出作为 proto，然后用 wolp\_action 获取最佳的 action。
   3. 增加 select\_target\_action，输出 raw action。
5. 修改 \_update\_step。
   1. 提供 wolp 选项，让 target critic 的输入是 wolp 的 raw action。
   2. 经验池的 action 来自 wolp 的输出。

## 实验结果

1. 结果有一些提升，但是当 action 的维度较大时，提升聊胜于无。
   - 因为可以枚举的范围变小了，很容易想象在 knn 同样多的情况下，2 维度 action 每一维的枚举范围都比 3 维的大。
2. 性能下降非常厉害，训练速度缓慢。
3. 最终采用 action 输出 N\*M 个数，经过 N 组 softmax 变成 N 组 one-hot，发现性能与结果都比 wolp 可靠。
