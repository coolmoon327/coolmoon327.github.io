---
title: "连续动作空间中的安全层方法"
date: "2022-10-23"
description: "总结一种预测约束并调整动作的安全层方法，用于连续动作空间中的安全探索。"
tags: ["safe-reinforcement-learning", "safety-layer", "continuous-control"]
categories: ["AI"]
locale: "zh"
slug: "safety-layer-continuous-action-spaces"
sourceId: "post-608126d88cfd54ab"
translationKey: "post-608126d88cfd54ab"
generated: true
draft: false
---

# Safe Exploration in Continuous Action Spaces

> \*\*简单介绍CMDP：\*\*在 MDP 的基础上，CMDP 设置了一系列约束回报函数，并类似 MDP 的回报函数，CMDP 对每个约束回报进行了折现，要求所有策略的这些折现值不超过对应的阈值。至于最优化目标，CMDP 依旧是采用的 MDP 的折现回报最大化。

## 一、研究背景

​ 在某些RL的训练场景下，存在一些绝不能违背的约束条件，往往需要从一开始部署就避免危险操作。

## 二、目标问题

​ 该论文的目标是在**连续**行为空间上，实现一个**不违反任何约束**的带约束强化学习算法。而这个目标在**离散**的动作空间中比在**连续**的行为空间中更容易实现。

​ 在物理问题中，通常会遇到**观测量局限于安全范围**的问题，比如数据中心采集到的温度与气压数据总是低于阈值，这类数据被称为**安全信号 safety signals**（也就是约束回报函数的值），需要探索出它们的平滑性（从安全状态渐渐逼近阈值的变化趋势），来避免危险行为。

​ 通常，安全的探索过程需要使用一系列已知的长期经验（long-term consequences）进行**预训练**。如何在**外部经验不充足**的条件下训练一个安全的强化学习模型，也是该论文的研究重点。

​ 本文是第一个在策略层面直接解决状态安全性问题的工作，而且可以使用任意日志数据进行训练，能够应用于连续的控制算法中，也不受特定的算法局限（不仅可以用于 RL 中）。

## 三、核心方法

​ ***简单来说，该论文就是训练了一个神经网络来预测某种策略是否满足约束，并用它来构造一个安全层，通过安全层来调整可能超出约束的行为。***

​ 除了 CMDP 最基本的元组 $ (\mathcal{S}, \mathcal{A}, P, R, \gamma, \mathcal{C}) $ 外，作者定义了一组**安全信号** $ \overline{\mathcal{C} }=\left{\bar{c}*{i}: \mathcal{S} \rightarrow \mathbb{R} \mid i \in[K]\right} $，是对 C={ci:S×A→R∣i∈[K]}{\mathcal{C} }=\left\{ {c}\_{i}: \mathcal{S} \times \mathcal{A} \rightarrow \mathbb{R} \mid i \in[K]\right\}C={ci​:S×A→R∣i∈[K]} 的简写，有 $ \bar{c}*\left(s^{\prime}\right) \triangleq c\_{i}(s, a) $。

### a）线性安全信号模型

​ 在没有先验知识的情况下，智能体会在训练前期使用随机策略来选择行为以进行探索，这是很难满足约束要求的。然而用先验知识训练智能体是非常低效且不稳定的，本文作者选择使用预先采集的**单步经验**来对**安全信号**进行学习。并且，作者使用了一种更加优雅的构造方式：

cˉi(s′)≜ci(s,a)≈cˉi(s)+g(s;wi)⊤a\bar{c}\_{i}\left(s^{\prime}\right) \triangleq c\_{i}(s, a) \approx \bar{c}\_{i}(s)+g\left(s ; w\_{i}\right)^{\top} a
cˉi​(s′)≜ci​(s,a)≈cˉi​(s)+g(s;wi​)⊤a

​ 其中 wiw\_iwi​ 是神经网络的权重，网络 g(s;wi)g(s;w\_i)g(s;wi​) 使用状态 sss 作为输入，并输出一个与行为 aaa 同样维度的列向量。该表达式可以看作对 ci(s,a)c\_i(s,a)ci​(s,a) 在 aaa 下的**一阶展开**近似，能够表示行为 sss 的安全信号 cic\_ici​ 对行为 aaa 的敏感性。该预测层可以被表示为下图：

[img omitted: third-party image]
