---
{
  "title": "Zhiguo Ding 教授：夹持天线的基础、放置与安全",
  "locale": "zh",
  "slug": "zhiguo-pinching-foundations",
  "newsId": "news-20260803-zhiguo-pinching-foundations",
  "translationKey": "news-20260803-zhiguo-pinching-foundations",
  "generated": true,
  "date": "2026-08-03",
  "coverageStart": "2024-12-03",
  "coverageEnd": "2025-07-17",
  "module": "advisors",
  "keywords": [
    "pinching-antennas",
    "movable-antennas",
    "noma",
    "wireless-optimization",
    "physical-layer-security"
  ],
  "authors": [
    "Zhiguo Ding",
    "Robert Schober",
    "H. Vincent Poor",
    "Kaidi Wang",
    "Naofal Al-Dhahir"
  ],
  "subjectIds": [
    "zhiguo-ding"
  ],
  "workIds": [
    "doi-10-1109-tcomm-2025-3555866",
    "arxiv-2507-13307",
    "doi-10-1109-lwc-2025-3624885"
  ],
  "focusSubjectId": "zhiguo-ding",
  "coverTone": "amber",
  "coverKicker": "导师研究",
  "coverTitle": "夹持天线早期研究脉络",
  "coverPoints": [
    "系统模型",
    "放置规则",
    "保密通信"
  ],
  "description": "从波导系统模型追踪到闭式位置优化与保密控制，为理解该领域最新原型结论提供可核查的基础。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 一条研究主线如何从基本问题长出来

Zhiguo Ding 教授早期的夹持天线工作，展示了一个新硬件概念如何逐步形成研究主线。顺序很重要：要优化设备，先得说明夹持点如何辐射、多个夹持点怎样相互作用；要谈自适应放置，先得找出优良位置背后的结构；要研究安全传输，还要说明哪些空间控制能够区分合法用户和窃听者。

第一项工作把波导上的介质单元抽象成可重构辐射点。单波导条件下，位置会改变视距几何与路径损耗；同一馈源上的多个夹持点共享信号，因此引出 NOMA；多波导系统又可以联系到 MISO 干扰信道，并讨论相应可达条件。经过这一步，波导传播、共享激励和位置相关辐射成为后续研究可以共同使用的语言。

## 从模型中提炼可解释的设计规律

位置优化工作接着回答“夹持点应该放在哪里”。它没有只给出数值算法，而是针对多种 OMA 和 NOMA 目标推导闭式放置规则。在论文模型下，公平型 OMA 会选择兼顾用户集合的位置；高信噪比时，贪心 OMA 和公平型 NOMA 则倾向最靠近波导的用户。这些公式把权衡关系直接摆在面前，也为以后更复杂的算法提供了可以比较的基线。

物理层安全论文在保留上述结构的同时加入新目标：幅度控制用于增强合法链路，相位对齐用于削弱窃听者，联盟博弈则从离散的预安装夹持点中选出激活集合。Shapley 值与边际贡献进一步解释每根天线怎样支撑整个联盟。仿真中的保密速率提升说明，位置不仅能改善覆盖，也可以成为安全资源。

从研究脉络看，关键贡献是完成了“系统抽象—设计规则—安全应用”的递进。Zhiguo Ding 教授的这组工作提供了清晰的分析抓手，使后续硬件和网络研究有据可循。耦合损耗、信道获取开销、控制时延和真实对抗行为尚未解决，但一套有说服力的原型应该回答什么，已经被这些基础工作界定得相当明确。

## 研究札记

> ### Flexible-Antenna Systems: A Pinching-Antenna Perspective
>
> - **作者：** Zhiguo Ding, Robert Schober, H. Vincent Poor
> - **状态：** 已发表期刊论文
> - **主要来源：** [IEEE Transactions on Communications](https://doi.org/10.1109/TCOMM.2025.3555866)
> **证据说明：** 分析和仿真尚未验证实际耦合损耗、控制开销、信道获取或硬件原型。
>
> ### Analytical Optimization for Antenna Placement in Pinching-Antenna Systems
>
> - **作者：** Zhiguo Ding, H. Vincent Poor
> - **状态：** 预印本
> - **主要来源：** [arXiv:2507.13307](https://arxiv.org/abs/2507.13307)
> **证据说明：** 放置结论依赖论文给定的目标与信道模型，其中高信噪比结果属于渐近结论。
>
> ### Pinching-Antenna Systems for Physical Layer Security
>
> - **作者：** Kaidi Wang, Zhiguo Ding, Naofal Al-Dhahir
> - **状态：** 已发表期刊论文
> - **主要来源：** [IEEE Wireless Communications Letters](https://doi.org/10.1109/LWC.2025.3624885)
> **证据说明：** 模型假设已知信道并采用离散候选位置，验证来自仿真，没有真实对手或硬件实验。
