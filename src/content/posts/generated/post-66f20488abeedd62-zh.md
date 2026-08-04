---
title: "多智能体强化学习笔记"
date: "2022-10-23"
description: "关于 MARL 设置、CTDE、价值分解、基准环境以及 MAPPO 目标与技巧的笔记。"
tags: ["multi-agent-reinforcement-learning","mappo"]
categories: ["Study Notes"]
locale: "zh"
slug: "multi-agent-reinforcement-learning-notes"
sourceId: "post-66f20488abeedd62"
translationKey: "post-66f20488abeedd62"
generated: true
draft: false
---
# 分类

## 调度方式

- centrilized：合作游戏，直接扩展单智能体 RL，所有智能体共享策略
- decentralized：每个智能体最优化自己独立的环境回报
  - IPPO

## 算法思路

- centralized training and decentralized execution (CTDE)：使用 Actor-Critic 框架，通过集中式的 Critic 纵览大局
  - MADDPG
  - COMA：multi-agent PG methods
  - QMix
- value decomposition (VD)
  - value-decomposed Q-learning

# 问题

1. instability
2. high variance
   - 使用大的 batch size 降低 PG 的方差

# 环境

## MDP

- Decentralized partially observable Markov decision processes (DEC-POMDP) shared rewards. A DEC-POMDP is defined by ⟨S,A,O,R,P,n,γ⟩.S\langle\mathcal{S}, \mathcal{A}, O, R, P, n, \gamma\rangle . \mathcal{S}⟨S,A,O,R,P,n,γ⟩.S is the state space. A\mathcal{A}A is the shared action space for each agent. oi=O(s;i)o\_{i}=O(s ; i)oi​=O(s;i) is the local observation for agent iii at global state sss. P(s′∣s,A)P\left(s^{\prime} \mid s, A\right)P(s′∣s,A) denotes the transition probability from SSS to S′S^{\prime}S′ given the joint action A=(a1,…,an)A=\left(a\_{1}, \ldots, a\_{n}\right)A=(a1​,…,an​) for all nnn agents. R(s,A)R(s, A)R(s,A) denotes the shared reward function. γ\gammaγ is the discount factor. Since most of the benchmark environments contain homogeneous agents, we utilize parameter sharing: each agent uses a shared policy πθ(ai∣oi)\pi\_{\theta}\left(a\_{i} \mid o\_{i}\right)πθ​(ai​∣oi​) parameterized by θ\thetaθ to produce its action aia\_{i}ai​ from its local observation oio\_{i}oi​, and optimizes its discounted accumulated reward J(θ)=Eat,st[∑tγtR(st,at)]J(\theta)=\mathbb{E}\_{a^{t}, s^{t}}\left[\sum\_{t} \gamma^{t} R\left(s^{t}, a^{t}\right)\right]J(θ)=Eat,st​[∑t​γtR(st,at)].

## GYM

- multi-agent particle-world environment (MPE)
- Starcraft multi-agent challenge (SMAC)
- Hanabi challenge

# MAPPO

## 描述

​ 既是有集中式价值函数的 CTDE 算法，也是有分布式价值函数的分布学习算法 —— 既有一套 CTDE 式的网络，也允许各个智能体自己有一套独立的网络。

​ 能有效解决 [PPO](https://openai.com/blog/openai-baselines-ppo/) 这类 on-policy 方法样本效率（sample efficient）低的问题 —— 使用重要性采样来学习以前的经验。

## 思路

​ 像 PPO 一样训练策略 πθ\pi\_\thetaπθ​ 与值函数 Vϕ(s)V\_\phi(s)Vϕ​(s)。用于在训练中降低方差的 Vϕ(s)V\_\phi(s)Vϕ​(s) 具有全局视野，让 MAPPO 成为了 CTDE 结构。这些网络可以被分发给每一个智能体，智能体也可以再保留两个独立的网络。

​ 使用五个对 MAPPO 重要的技巧来调整网络：value normalization, value function inputs, training data usage, policy and value clipping, and death masking。

## 技巧

1. Utilize value normalization to stabilize value learning.
2. Include agent-speciﬁc features in the global state and check that these features do not make the state dimension substantially higher.
3. Avoid using too many training epochs and do not split data into mini-batches.
4. For the best PPO performance, tune the clipping ratio ϵ\epsilonϵ as a trade-off between training stability and fast convergence.
5. Use zero states with agent ID as the value input for dead agents.

## 优化目标

1. Actor 网络

L(θ)=[1Bn∑i=1B∑k=1nmin⁡(rθ,i(k)Ai(k),clip⁡(rθ,i(k),1−ϵ,1+ϵ)Ai(k))]+σ1Bn∑i=1B∑k=1nS[πθ(oi(k)))]\left.L(\theta)=\left[\frac{1}{B n} \sum\_{i=1}^{B} \sum\_{k=1}^{n} \min \left(r\_{\theta, i}^{(k)} A\_{i}^{(k)}, \operatorname{clip}\left(r\_{\theta, i}^{(k)}, 1-\epsilon, 1+\epsilon\right) A\_{i}^{(k)}\right)\right]+\sigma \frac{1}{B n} \sum\_{i=1}^{B} \sum\_{k=1}^{n} S\left[\pi\_{\theta}\left(o\_{i}^{(k)}\right)\right)\right]
L(θ)=[Bn1​i=1∑B​k=1∑n​min(rθ,i(k)​Ai(k)​,clip(rθ,i(k)​,1−ϵ,1+ϵ)Ai(k)​)]+σBn1​i=1∑B​k=1∑n​S[πθ​(oi(k)​))]

where $ r\_{\theta, i}{(k)}=\frac{\pi\_{\theta}\left(a\_{i} \mid o\_{i}^{(k)}\right)}{\pi\_{\theta\_{o l d}}{\left(a\_{i}^{(k)} \mid o\_{i}^{(k)}\right)}} \cdot A\_{i}^{(k)} $ is computed using the GAE method, $ S $ is the policy entropy, and $ \sigma $ is the entropy coefficient hyperparameter.

2. Critic 网络

L(ϕ)=1Bn∑i=1B∑k=1n(max⁡[(Vϕ(si(k))−R^i)2,(clip⁡(Vϕ(si(k)),Vϕold(si(k))−ε,Vϕold(si(k))+ε)−R^i)2]L(\phi)=\frac{1}{B n} \sum\_{i=1}^{B} \sum\_{k=1}^{n}\left(\max \left[\left(V\_{\phi}\left(s\_{i}^{(k)}\right)-\hat{R}\_{i}\right)^{2},\left(\operatorname{clip}\left(V\_{\phi}\left(s\_{i}^{(k)}\right), V\_{\phi\_{o l d}}\left(s\_{i}^{(k)}\right)-\varepsilon, V\_{\phi\_{o l d}}\left(s\_{i}^{(k)}\right)+\varepsilon\right)-\hat{R}\_{i}\right)^{2}\right]\right.
L(ϕ)=Bn1​i=1∑B​k=1∑n​(max[(Vϕ​(si(k)​)−R^i​)2,(clip(Vϕ​(si(k)​),Vϕold​​(si(k)​)−ε,Vϕold​​(si(k)​)+ε)−R^i​)2]

where R^i\hat{R}\_{i}R^i​ is the discounted reward-to-go. BBB refers to the batch size and nnn refers to the number of agents.
