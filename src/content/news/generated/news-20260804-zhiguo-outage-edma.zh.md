---
{
  "title": "Zhiguo Ding 教授：面向夹持天线的中断约束 EDMA",
  "locale": "zh",
  "slug": "zhiguo-outage-edma",
  "newsId": "news-20260804-zhiguo-outage-edma",
  "translationKey": "news-20260804-zhiguo-outage-edma",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2026-07-21",
  "coverageEnd": "2026-07-21",
  "module": "advisors",
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
  "focusSubjectId": "zhiguo-ding",
  "coverTone": "amber",
  "coverKicker": "近期导师研究",
  "coverTitle": "考虑遮挡的接入设计",
  "coverPoints": [
    "中断约束",
    "EDMA",
    "仿真"
  ],
  "description": "概述遮挡、散射和衰减条件下的中断约束夹持天线 EDMA，并清楚保留近似方法与仿真证据的边界。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 将传播不确定性纳入系统设计

夹持天线能够提供不同于固定天线的空间控制能力，但只有在传播偏离理想视距模型时仍能维持可靠接入，这种自由度才真正有价值。Zhiguo Ding 教授参与的近期工作 [Outage-Constrained Environment Division Multiple Access for Pinching-Antenna Systems](https://arxiv.org/abs/2607.18738)，正是把设计推进到这一更困难的情形。

论文同时建模视距遮挡、非视距散射与波导内衰减，并用统计速率中断约束描述由此产生的不确定性，再联合优化部署和功率分配。对 Zhiguo Ding 教授的夹持天线研究而言，这一步让可配置接入从标称几何进一步走向面向可靠性的运行设计。

## 从精确表达式构建可扩展算法

论文按层次展开分析。双用户场景首先获得精确中断表达式，使遮挡、散射和波导损耗的作用在没有额外近似的情况下清楚呈现，随后用 PGD 优化相应的位置与功率。

用户数量增加后，精确形式变得难以处理。论文以 Chernoff 近似构造可求解的中断表达式，再通过逐次凸近似更新设计。这条从小规模精确分析到多用户近似优化的路线，既说明了可扩展性来自哪里，也明确了在哪一步牺牲精度。

## 让可靠性成为研究路线的下一层

仿真结果在所测试的场景中接近选定的数值参照。比具体数字更值得长期关注的是，这项工作把环境不确定性直接放进天线部署与接入控制，而不是先针对标称信道求解，再把可靠性当作事后检查项。

现有成果仍属于分析与数值研究。“接近最优”仅适用于所测试的设置，多用户结论也依赖所采用的概率界和凸近似。下一步需要在硬件上测量遮挡、散射和波导变化，检验模型外的真实扰动是否会削弱预期的可靠性收益。

## 研究札记

> ### Outage-Constrained Environment Division Multiple Access (EDMA) for Pinching-Antenna Systems
>
> **作者：** Weihao Mao, Yang Lu, Yanqing Xu, Zhiguo Ding
>
> **状态：** 预印本
>
> **主要来源：** [arXiv:2607.18738](https://arxiv.org/abs/2607.18738)
>
> **证据说明：** 论文先推导双用户精确中断表达式，再采用 PGD 以及面向更大规模场景的 Chernoff 近似和逐次凸近似；证据来自分析与仿真，“接近最优”受具体场景限制，多用户结果依赖近似。
