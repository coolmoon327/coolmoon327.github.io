---
{
  "title": "夹持天线：公开证据目前能支持什么",
  "locale": "zh",
  "slug": "pinching-antenna-foundations",
  "newsId": "news-20260803-pinching-antenna-foundations",
  "translationKey": "news-20260803-pinching-antenna-foundations",
  "generated": true,
  "date": "2026-08-03",
  "coverageStart": "2024-12-03",
  "coverageEnd": "2025-07-17",
  "module": "interests",
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
  "coverTone": "amber",
  "coverKicker": "研究兴趣",
  "coverTitle": "先看基础，再谈热度",
  "coverPoints": [
    "波导模型",
    "优化",
    "安全"
  ],
  "description": "从波导建模、位置规则和保密设计建立夹持天线基线，同时说明现有证据主要仍是分析与仿真。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 观察视角

把这些论文放在一起阅读，可以先建立夹持天线系统的基础语言——波导辐射、位置结构、多址接入与保密通信——再去判断后续原型工作的意义。

## Flexible-Antenna Systems: A Pinching-Antenna Perspective

**作者：** Zhiguo Ding, Robert Schober, H. Vincent Poor

**夹持天线领域视角。** [查看主要公开记录](https://doi.org/10.1109/TCOMM.2025.3555866)。这篇基础工作把介质颗粒建模为波导上的可重构辐射点。单波导分析强调视距与路径损耗控制，同一馈源上的多个夹持点共享信号并由此引出 NOMA；多波导情形则关联到 MISO 干扰信道，并给出相应的可达条件。

**证据边界。** 证据来自分析和计算机仿真，公开摘要没有验证实际耦合损耗、控制开销、信道获取或硬件原型。

## Analytical Optimization for Antenna Placement in Pinching-Antenna Systems

**作者：** Zhiguo Ding, H. Vincent Poor

**状态：** 预印本

**夹持天线领域视角。** [查看主要公开记录](https://arxiv.org/abs/2507.13307)。该预印本针对若干 OMA 与 NOMA 目标推导闭式天线放置规则。在论文模型中，公平型 OMA 选择对所有用户有利的位置，而高信噪比下的贪心 OMA 与公平型 NOMA 往往偏向距离波导最近的用户。

**证据边界。** 这些结论依赖特定目标和信道假设，高信噪比结果属于渐近结论，且目前仍是一版预印本。

## Pinching-Antenna Systems for Physical Layer Security

**作者：** Kaidi Wang, Zhiguo Ding, Naofal Al-Dhahir

**夹持天线领域视角。** [查看主要公开记录](https://doi.org/10.1109/LWC.2025.3624885)。该快报利用幅度控制增强合法链路，并通过相位对齐削弱窃听者。方法用联盟博弈激活离散的预安装夹持点，再以 Shapley 值与边际贡献量化各天线作用；仿真相对联盟价值基线报告了保密速率增益。

**证据边界。** 模型假设掌握信道信息并采用离散候选位置，证据是篇幅受限的仿真，没有真实对手或硬件实验。
