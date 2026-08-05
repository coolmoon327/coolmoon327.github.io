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
## 当天线位置也成为可控变量

传统阵列的辐射单元通常固定不动，系统只能调整相位、幅度等参数。夹持天线改变了这个前提：沿波导布置的介质单元可以形成可重构辐射点，几何位置因此直接进入通信设计。这个概念很直观，但要判断后续原型和性能结论是否可靠，首先需要一套能够分析、能够比较的基础模型。

Zhiguo Ding 教授牵头的基础论文给出了这套起点。在单波导场景中，夹持点位置通过视距几何和路径损耗影响接收功率；同一馈源驱动多个夹持点时，它们共享同一信号，因此可以用 NOMA 的思路理解。扩展到多波导后，系统又与 MISO 干扰信道建立联系，并能讨论相应的可达条件。这样一来，“把辐射点移到用户附近”不再只是形象描述，而变成了可以推导的通信模型。

## 从几何模型走向放置规则

位置成为控制量之后，自然要问：每次都做复杂数值搜索是否必要？[夹持天线位置解析优化](https://arxiv.org/abs/2507.13307)针对多种 OMA 和 NOMA 目标推导了闭式规则。在论文假设下，强调公平性的 OMA 会选择兼顾所有用户的位置；高信噪比时，贪心 OMA 与公平型 NOMA 则往往偏向最靠近波导的用户。它的价值在于把优化结构直接揭示出来，而不是把位置选择交给一个不可解释的黑箱。不过，这些结论仍取决于具体目标、信道假设以及高信噪比渐近条件。

## 用空间自由度服务保密通信

物理层安全工作进一步考察：灵活的辐射位置能否拉开合法用户与窃听者之间的信道差距。论文一方面利用幅度控制增强合法链路，另一方面通过相位对齐削弱窃听者；随后用联盟博弈从离散的预安装夹持点中选择激活集合，再以 Shapley 值和边际贡献衡量每根天线的作用。仿真相对联盟价值基线给出了保密速率提升。

三项工作由此形成了一条完整的基础链路：先定义波导辐射系统，再提炼位置优化规律，最后把几何自由度引入保密设计。它们同样提醒我们，实际耦合损耗、信道获取、控制开销和硬件实测仍未被分析与仿真解决。现有成果已经搭好了理论平台，但能否走向部署，最终还要由实验回答。

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
