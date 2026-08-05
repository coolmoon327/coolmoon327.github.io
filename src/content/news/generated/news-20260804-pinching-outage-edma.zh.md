---
{
  "title": "遮挡环境下的夹持天线：中断约束 EDMA",
  "locale": "zh",
  "slug": "pinching-outage-edma",
  "newsId": "news-20260804-pinching-outage-edma",
  "translationKey": "news-20260804-pinching-outage-edma",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2026-07-21",
  "coverageEnd": "2026-07-21",
  "module": "interests",
  "keywords": [
    "pinching-antennas",
    "noma",
    "wireless-optimization",
    "resilient-wireless"
  ],
  "authors": [
    "Weihao Mao",
    "Yang Lu",
    "Yanqing Xu",
    "Zhiguo Ding"
  ],
  "subjectIds": [
    "zhiguo-ding"
  ],
  "workIds": [
    "arxiv-2607-18738"
  ],
  "coverTone": "amber",
  "coverKicker": "夹持天线",
  "coverTitle": "近期接入控制预印本",
  "coverPoints": [
    "遮挡",
    "功率分配",
    "明确局限"
  ],
  "description": "研究带中断约束的遮挡感知 EDMA、PGD 与 SCA，并将“接近最优”严格限定在预印本测试的数值设置中。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 当视距链路随时可能消失

夹持天线系统常从有利的视距几何出发：可移动辐射点能够为用户形成较短且可控的传播路径。真实环境却不会始终配合。物体可能阻断直达路径，散射会产生不确定的替代路径，信号在波导内传播时也会持续衰减。只针对一个标称信道优化的方案，很可能在系统最需要灵活接入时失效。

[Outage-Constrained Environment Division Multiple Access for Pinching-Antenna Systems](https://arxiv.org/abs/2607.18738) 通过统计速率中断约束纳入这些不确定性。论文联合决定天线部署与发射功率：系统既要选择在哪里形成有效辐射点，也要分配发射功率，使用户速率低于目标值的概率保持在约束范围内。

## 从双用户精确分析开始

论文先研究双用户场景，并在视距遮挡、非视距散射和波导内衰减条件下推导精确中断表达式。这不仅是一个小规模数值案例，它还揭示了传播不确定性和波导损耗如何进入可靠性计算，为后续扩展到更多用户建立分析基准。

得到精确表达式后，论文利用 PGD 搜索联合部署与功率分配方案。中断概率由此成为设计时直接满足的工程约束，而不是在确定性信道优化结束后才检查的附加统计量。

## 在多用户扩展中明确近似代价

随着用户数量增加，精确计算中断概率会迅速变得困难。多用户方法因此采用 Chernoff 近似获得可处理的表达式，再通过逐次凸近似更新设计。它以一定精度代价换取计算可行性，同时仍将遮挡、散射和波导衰减保留在优化问题中。

仿真显示，所提方法在测试设置下能够接近选定的数值基准，但这并不代表对任意场景都接近最优；多用户结论也继承了 Chernoff 近似与凸化步骤的假设。要判断所建中断约束能否准确描述运行中的系统，仍需硬件测量、真实遮挡统计和更大规模的控制实验。

## 研究札记

> ### Outage-Constrained Environment Division Multiple Access (EDMA) for Pinching-Antenna Systems
>
> **作者：** Weihao Mao, Yang Lu, Yanqing Xu, Zhiguo Ding
>
> **状态：** 预印本
>
> **主要来源：** [arXiv:2607.18738](https://arxiv.org/abs/2607.18738)
>
> **证据说明：** 论文推导双用户精确中断表达式，采用 PGD，并以 Chernoff 近似和逐次凸近似处理多用户问题；结果来自模型与仿真，“接近最优”仅适用于测试设置，可扩展方案则以精确性换取可求解性。
