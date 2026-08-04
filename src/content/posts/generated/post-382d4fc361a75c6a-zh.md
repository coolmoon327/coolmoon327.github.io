---
title: "地理分布式云环境中的遗传算法服务组合方法"
date: "2022-10-24"
description: "地理分布式云中使用 Skyline 初始化遗传算法进行 QoS 感知服务组合的论文笔记。"
tags: ["service-composition", "genetic-algorithm", "cloud-computing"]
categories: ["Research Notes"]
locale: "zh"
slug: "genetic-web-service-composition"
sourceId: "post-382d4fc361a75c6a"
translationKey: "post-382d4fc361a75c6a"
generated: true
draft: false
---

# A genetic-based approach to web service composition in geo-distributed cloud environment

> <https://www.sciencedirect.com/science/article/pii/S0045790614002419>
>
> Computers and Electrical Engineering 2015
>
> Dandan Wang, Yang Yang, Zhenqiang Mi 北京科技大学
>
> 被引用量大，问题有一定相关性

## 摘要

服务组合（Service Composition）中的一个重要研究问题是如何根据服务水平协议（Service Level Agreement，SLA）从一组功能等价的服务中选择最佳候选服务。

文章中将服务的 QoS 以及云端网络环境同时纳入考量，提出了一个服务组合模型。

该文章也提出了一种基于遗传算法（Genetic Algorithm）的网络服务组合方式，以最小化 SLA violations。

## 创新点

1. 首先定义了一个考虑分布式网络环境的、基于 QoS 的现实服务组合模型。
   1. 在服务组合问题中考虑了网络 QoS。
   2. 这个模型同样适合拥有多个 QoS criteria 的问题。
   3. 提供了一个在服务组合中计算 QoS 的方法。
2. 提出了一种基于遗传算法的启发式组合算法，通过最大化用户体验并最小化 SLA 违约来解决该问题。
   1. 传统图论方法的复杂度极大。
3. 使用 Skyline 的概念生成初始种群，以提升解的质量和收敛速度。

## 定义

### 云服务

- **云架构**包括三层：**软件层、平台层和基础设施层**。
- Web 服务的 **QoS** 指响应时间、吞吐量、可用性和可靠性等各种非功能特性。
- 在云环境中，由于**服务组合**是一个 **NP-complete** 问题，高效搜索最优且可行的组合路径是一项挑战。
- 云服务提供商的**利润**来自基础设施运营成本与用户收入之间的差额。因此，云服务提供商希望最大化利润，同时为用户确保 QoS，以提升其市场声誉；他们也在寻找能够尽量减少 SLA（Service Level Agreements）违约的方案。

### 原子服务

- **原子服务**是服务计算系统中用于解决特定任务的独立单元。服务提供商将原子服务发布给代理，以便被发现。
  - **原子服务的 QoS** 可以由提供商给出，也可以依据执行情况计算并由用户监控，或者按照各 QoS 指标的特征从用户反馈中收集。
- **服务集**是功能相同但 QoS 水平不同的原子服务集合。
- 在 SOA 中，**服务水平协议**（SLA）是服务提供商与用户之间的法律合同。
  - SLA 就是服务商与用户之间关于 QoS 的基本协定，或者说是 QoS 必须满足的基线。

## 建模

- 服务组合模型分为**服务发现**（Service Discovery）和**服务选择**（Service Selection）两部分。

  - 服务发现是 functional 的，要求服务集合里的原子服务满足任务的功能性要求。
  - 服务选择是 non-functional 的，QoS 描述的就是这种 non-functional 属性。
- 分布式服务组合的性能很大程度上取决于网络性能，网络延迟可以分为**原子服务之间的延迟**以及**原子服务与用户之间的延迟**两类。

  - 数据中心之间的时延可测量且可预测，因为特定云提供商的数据中心数量有限且稳定。
  - 服务与用户之间的网络时延可从网络反馈和执行监控信息中获得。
- 三种服务组合结构：**sequential**、**parallel** 和 **conditional**。

  - [Image omitted: third-party image]
  - [Image omitted: third-party image]
  - 很明显，我们的模型属于 sequential structure。
- 优化目标与约束：

  - 优化用户体验；
  - 满足 SLA 中描述的 QoS 要求。

## 算法

- 常见的启发式搜索方法包括禁忌搜索、模拟退火和遗传算法。作者从中选择了**遗传算法**。

  - 遗传算法是**基于种群**的方法，而禁忌搜索和模拟退火是基于个体的方法。
  - 在所提出的模型中，遗传算法参数的优化比其他算法**更简单**。
- Fitness function

  f(CS)=∑i=1oαi×ζi(CS)ζi−(CS)=Sqi−−qi−(CS)Sqi−ζi+(CS)=qi+(CS)−Sqi+Sqi+f(C S)=\sum\_{i=1}^{o} \alpha\_{i} \times \zeta\_{i}(C S) \\
  \begin{aligned} \zeta\_{i}^{-}(C S) &=\frac{S q\_{i}^{-}-q\_{i}^{-}(C S)}{S q\_{i}^{-}} \\
  \zeta\_{i}^{+}(C S) &=\frac{q\_{i}^{+}(C S)-S q\_{i}^{+}}{S q\_{i}^{+}} \end{aligned}
  f(CS)=i=1∑o​αi​×ζi​(CS)ζi−​(CS)ζi+​(CS)​=Sqi−​Sqi−​−qi−​(CS)​=Sqi+​qi+​(CS)−Sqi+​​​

  - SqSqSq 是 QoS 的约束，qqq 是 QoS 值，αi\alpha\_iαi​ 是用户对第 iii 种 QoS 的偏好比（∑iαi=1\sum\_i\alpha\_i=1∑i​αi​=1）。
  - Fitness function 必须促进正向指标增加、负向指标减少，也就是处理两类 QoS 指标。

    - 正向指标值增加对用户有利，例如可用性和声誉。
    - 负向指标值减少对用户有利，例如时间和价格。
    - 在进化过程中，fitness function 可以帮助最大化正向指标并最小化负向指标。
  - Fitness function 需要反映**用户偏好**。

    - 一些用户更偏好高可用性，而不是短响应时间。
    - 为 QoS 指标分配权重来表示用户偏好。
- Encoding

  - 基因组
    - **genomes** 表示问题中的各种可能选择。
    - 将一个**服务组合**编码为一个基因组。
  - 基因
    - 将**原子服务**编码为基因组中的基因。
- Initial population

  - 使用 Skyline 的概念初始化其中 1/5 的 population，其余的随机初始化。
    - **Skyline** set 是 service set 的一个子集，由服务集中所有**非支配**的原子服务构成。
    - 一个原子服务如果不存在另一个服务在所有 QoS 指标上都超过它，它就是 **non-dominated** 的。
  - Brokers 维护每个服务集的 Skyline 集合列表，并在原子服务变化时更新。
- Selection operator

  - 使用 roulette-wheel selection 策略，在大小为 NNN 的 population 中选择第 kkk 个 individual 的概率为 $ p\_{k}=\frac{f\_{k}}{\sum\_{j=1}^{N} f\_{j}} $。
  - 有更高的概率选到好的基因，好的基因也更可能遗传下去。
- Crossover operator

  - 随机挑选亲代。
  - 亲代被分割成两部分，后面部分进行交换。
- Mutation operator

  - 随机挑选基因组中的一个基因，然后用与它相关的**服务组**中的一个随机**原子服务**进行替换。
  - 能够避免收敛到局部最优点。

## 评价

- 服务组合模型
  - 建模和我们的方法接近，有借鉴意义。
    - 我们也是默认**服务发现**过程已经实现，主要在做**服务组合**。
    - 但我们不是在 Scheduler 完成整个**服务组合**，而是对 Sequential 的原子服务，上一级提供服务的实体自己选择下一级的实体，Scheduler 控制这一过程中的可选范围。
  - 有必要使用这篇论文中的一些定义。
    - 主要是**原子服务**相关内容。
  - 我们同样可以使用基于 SLA 的约束，但优化目标不局限于本文中带用户倾向的 QoS。
- 进化算法
  - 算法本身对我们而言没有太大价值。
  - 通过权重系数 α\alphaα 在优化目标中描述用户倾向，通过归一化计算 ζ\zetaζ 将约束放入优化目标。
    - 我们可以继承这种做法，但是 fff 应该只作为优化目标中的一个 **multi objective** 项，通过这个目标来满足约束、提升用户 QoS。
      - 这部分关于 QoS 的考虑，能够满足我们选择 Provider 时对延迟的追求。
      - 同时，这个 QoS 设计是多目标的，我们也可以设计一种关于 Depositary 和 Filestore 的 QoS，从而限制 Provider 的可选择存储节点范围。
    - 优化目标的主体部分应该是选择节点的**公平性**。
      - 对于存储资源，应该以**剩余出口带宽量**为目标。
        - 基于历史经验，估计 Filestore 在未来一段时间内的长期出口带宽，并需要当前出口带宽满足 QoS 约束。
        - 对于只会进行瞬时下载的 Depositary，则直接使用当前的出口带宽。
      - 对于渲染资源，应该按照资源与用户之间的**网络距离**（几跳转发能到达用户）为目标，需要满足渲染能力的约束。
  - 参考这篇论文，还可以引入关于各节点的 reputation 作为 QoS 的一部分，以实现对**背书系统**的考量。
    - reputation 的设置与动态维护，需要 Scheduler 进行背书。
  - 用户的偏好（preference）应该是一张表，按照不同的业务类型（fps、act、rpg）分配不一样的偏好。
    - reputation 的比重应该是固定的，Provider 的 reputation 权重应该是其中最大的。
    - SLA 应该是硬指标，其中的一部分由用户自己选择（帧率、分辨率），其他的由具体的游戏类型（或根据是哪个游戏）映射到一个预先配置的表中，然后找出对应的 QoS 基线。
