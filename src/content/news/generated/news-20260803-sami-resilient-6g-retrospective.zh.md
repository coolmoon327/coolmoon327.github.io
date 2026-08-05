---
{
  "title": "Sami Muhaidat 教授：跨链路、切片与卫星的韧性学习",
  "locale": "zh",
  "slug": "sami-resilient-6g-retrospective",
  "newsId": "news-20260803-sami-resilient-6g-retrospective",
  "translationKey": "news-20260803-sami-resilient-6g-retrospective",
  "generated": true,
  "date": "2026-08-03",
  "coverageStart": "2024-11-17",
  "coverageEnd": "2026-06-04",
  "module": "advisors",
  "keywords": [
    "anti-jamming",
    "adversarial-wireless-learning",
    "reinforcement-learning",
    "physical-layer-security",
    "secure-6g",
    "learning-enabled-wireless",
    "resilient-wireless",
    "wireless-optimization",
    "non-terrestrial-networks",
    "ris"
  ],
  "authors": [
    "Muhammad Shahzad Arif",
    "Yuhang Shen",
    "Sami Muhaidat",
    "Paschalis C. Sofotasios",
    "Antonios Argyriou",
    "Silvirianti",
    "Georges Kaddoum",
    "Mahdi Chehimi",
    "Li Yang",
    "Shimaa Naser",
    "Abdallah Shami",
    "Lyndon Ong",
    "Mérouane Debbah",
    "Mohammed Mahyoub",
    "Wael Jaafar",
    "Halim Yanikomeroglu",
    "Khalid AlHamdani"
  ],
  "subjectIds": [
    "muhammad-shahzad-arif",
    "sami-muhaidat",
    "paschalis-sofotasios",
    "merouane-debbah"
  ],
  "workIds": [
    "doi-10-1109-jsac-2026-3700139",
    "doi-10-1109-pimrc62392-2025-11275524",
    "doi-10-1109-mecom61498-2024-10881377",
    "doi-10-1109-jsac-2026-3691713",
    "doi-10-1109-tcomm-2025-3547764",
    "arxiv-2605-03656",
    "doi-10-1109-lwc-2025-3530823"
  ],
  "focusSubjectId": "sami-muhaidat",
  "coverTone": "violet",
  "coverKicker": "导师研究",
  "coverTitle": "跨网络层的韧性",
  "coverPoints": [
    "对抗学习",
    "低轨路由",
    "零接触安全"
  ],
  "description": "连接对抗链路、自动安全、低轨路由、切片风险与 RIS，并将每项增益严格限定在论文各自的评估设置中。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 韧性不是单层指标，而是一条跨层链路

Sami Muhaidat 教授近期参与的工作横跨抗干扰链路、自动化安全、卫星路由、服务链放置和 RIS 辅助传播。把这些方向串起来的是同一个系统问题：环境、对手或基础设施发生变化时，哪些能力还能维持？答案不可能只有一个指标。链路层关注能否抵抗会学习的干扰器，星座网络关注路由与服务是否连续，物理层则必须面对硬件真正拥有多少可控自由度。

三项抗干扰研究首先说明，强化学习策略不能只和固定模式的对手比较。黑盒交互足以让自适应干扰器识别可利用的行为规律，以低于传统反应式干扰的功率把链路推向次优状态。诱饵攻击又把目标转向智能体感知到的状态转移和奖励方差；在论文仿真中，受害链路吞吐量最高下降 72%，干扰器功率相对标准反应式干扰最高节省 67%。即使是虚警和漏检，也可能让干扰模式变得更随机，从而比理想化模式更难被防御者学会。

## 从保护一条链路扩展到维护基础设施

在星座尺度上，[数字孪生辅助的联邦量子深度强化学习](https://doi.org/10.1109/JSAC.2026.3691713)面向智能干扰联合优化动态低轨卫星星间路由。公开摘要相对所选基线报告了 48.16% 的干扰成功率下降、22.26% 的时延下降和 6.17% 的能效提升。这些结果来自模型驱动的数值实验，还不是运营卫星试验，但它们把安全与路由变化放进了同一个问题。

零接触安全工作处理的是另一种变化：物理层认证与跨层入侵检测中的数据漂移。漂移自适应在线学习和逐次减半式 AutoML 组成模型更新流程，并在公开射频指纹数据与 CICIDS2017 上验证。它尚未证明整张 6G 网络能够自主运行，却展示了安全组件如何持续选择、替换和更新，而不是训练一次便长期不变。

另一项低轨研究关注虚拟网络功能应当放在哪里。优化同时考虑跨切片共址风险、CPU 使用和迁移稳定性；在论文评估环境中，相对贪心基线报告了 40% 的风险下降、80% 的可避免迁移减少和 23 倍的热启动加速。这里的韧性，不只是“能运行”，还包括避免安全敏感的共址关系，同时防止服务链频繁抖动。

## 智能算法之下仍是受限的物理系统

RIS 时间反演论文把问题重新拉回无线信道。研究在频率选择性环境中比较多种反射配置下的误码率和分集。由于 RIS 的自由度有限，在最强抽头处最大化孔径增益的方案，与论文中的最优配置表现接近。面对越来越复杂的学习框架，这个结果提供了重要提醒：控制目标首先得是硬件真正能够实现的。

从整体上看，Sami Muhaidat 教授的这些工作没有把韧性归结为某一种算法，而是把它拆成相互关联的决策。自适应攻击、数据漂移、卫星运动、迁移代价和表面控制限制，各自暴露不同的失效方式。现有证据主要来自分析、公开数据集和仿真；下一步更难也更重要的问题，是让这些机制在同一系统中协同工作，并验证故障会怎样跨层传播。

## 研究札记

> ### Outsmarting the Smart: Intelligent Jamming Strategies Against AI-Empowered Anti-Jamming Frameworks
>
> - **作者：** Muhammad Shahzad Arif, Yuhang Shen, Sami Muhaidat, Paschalis C. Sofotasios
> - **状态：** 已发表期刊论文
> - **主要来源：** [IEEE Journal on Selected Areas in Communications](https://doi.org/10.1109/JSAC.2026.3700139)
> **证据说明：** 公开摘要没有量化所有结论；验证属于数值基准测试，并非空口部署。
>
> ### Bait Tactics: Misleading DRL-Based Cognitive Anti-Jamming Communications via Adversarial Learning
>
> - **作者：** Muhammad Shahzad Arif, Sami Muhaidat, Paschalis C. Sofotasios
> - **状态：** 已发表会议论文
> - **主要来源：** [IEEE PIMRC](https://doi.org/10.1109/PIMRC62392.2025.11275524)
> **证据说明：** 72% 的吞吐量下降与 67% 的干扰器功率节省只适用于论文给定的仿真场景。
>
> ### Performance of AI-Empowered Anti-Jamming Communications under Hardware Impairments
>
> - **作者：** Muhammad Shahzad Arif, Sami Muhaidat, Antonios Argyriou, Paschalis C. Sofotasios
> - **状态：** 已发表会议论文
> - **主要来源：** [IEEE MECOM](https://doi.org/10.1109/MECOM61498.2024.10881377)
> **证据说明：** 结论受论文采用的感知误差与学习模型约束，不能覆盖所有射频缺陷或波形。

> ### Digital Twin-Assisted Federated Quantum Deep Reinforcement Learning for Resilient and Dynamic ISL Routing
>
> - **作者：** Silvirianti, Georges Kaddoum, Mahdi Chehimi, Sami Muhaidat
> - **状态：** 已发表期刊论文
> - **主要来源：** [IEEE Journal on Selected Areas in Communications](https://doi.org/10.1109/JSAC.2026.3691713)
> **证据说明：** 干扰成功率下降 48.16%、时延下降 22.26%、能效提升 6.17% 均来自模型驱动的数值实验，不是真实卫星或量子硬件试验。
>
> ### Towards Zero Touch Networks: Cross-Layer Automated Security Solutions for 6G Wireless Networks
>
> - **作者：** Li Yang, Shimaa Naser, Abdallah Shami, Sami Muhaidat, Lyndon Ong, Mérouane Debbah
> - **状态：** 已发表期刊论文
> - **主要来源：** [IEEE Transactions on Communications](https://doi.org/10.1109/TCOMM.2025.3547764)
> **证据说明：** 公开射频指纹数据与 CICIDS2017 验证了两类安全任务，并不代表完整的自主零接触 6G 部署。
>
> ### Cross-Slice Co-Location Risk-Aware SFC Provisioning in Multi-Slice LEO Satellite Networks
>
> - **作者：** Mohammed Mahyoub, Wael Jaafar, Sami Muhaidat, Halim Yanikomeroglu
> - **状态：** 预印本
> - **主要来源：** [arXiv:2605.03656](https://arxiv.org/abs/2605.03656)
> **证据说明：** 共址风险是受标准原则启发的优化代理指标，所有结果来自仿真而非运营星座。
>
> ### Time Reversal in RIS-Aided Environments
>
> - **作者：** Khalid AlHamdani, Shimaa Naser, Sami Muhaidat, Paschalis C. Sofotasios
> - **状态：** 已发表期刊论文
> - **主要来源：** [IEEE Wireless Communications Letters](https://doi.org/10.1109/LWC.2025.3530823)
> **证据说明：** 分析和仿真尚未得到硬件原型或实测信道活动的支持。
