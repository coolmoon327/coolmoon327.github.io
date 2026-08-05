---
{
  "title": "Paschalis C. Sofotasios 教授：明确假设下的安全无线系统",
  "locale": "zh",
  "slug": "paschalis-secure-wireless-retrospective",
  "newsId": "news-20260803-paschalis-secure-wireless-retrospective",
  "translationKey": "news-20260803-paschalis-secure-wireless-retrospective",
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
    "ris",
    "wireless-optimization"
  ],
  "authors": [
    "Muhammad Shahzad Arif",
    "Yuhang Shen",
    "Sami Muhaidat",
    "Paschalis C. Sofotasios",
    "Antonios Argyriou",
    "Khalid AlHamdani",
    "Shimaa Naser"
  ],
  "subjectIds": [
    "muhammad-shahzad-arif",
    "sami-muhaidat",
    "paschalis-sofotasios"
  ],
  "workIds": [
    "doi-10-1109-jsac-2026-3700139",
    "doi-10-1109-pimrc62392-2025-11275524",
    "doi-10-1109-mecom61498-2024-10881377",
    "doi-10-1109-lwc-2025-3530823"
  ],
  "focusSubjectId": "paschalis-sofotasios",
  "coverTone": "ocean",
  "coverKicker": "导师研究",
  "coverTitle": "明确假设下的无线安全",
  "coverPoints": [
    "抗干扰",
    "硬件约束",
    "RIS"
  ],
  "description": "以公开数值证据审视学习型干扰、感知缺陷与 RIS 时间反演，并明确标出硬件和外场验证仍缺失。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 把不利条件写进模型，安全结论才更可信

Paschalis C. Sofotasios 教授近期参与的几项工作有一个共同特点：不回避那些会让系统表现变差的条件。强化学习抗干扰链路可能遇到会观察、会适应的对手；干扰器的感知硬件可能发生虚警和漏检；可重构智能表面的物理自由度也可能不足以实现理想控制。把这些限制明确写进模型后，“智能”便不再天然等于“稳健”，每一项安全结论都必须回答对手是谁、信道如何、硬件能够做到什么。

抗干扰研究首先考察主动适应的黑盒对手。[Outsmarting the Smart](https://doi.org/10.1109/JSAC.2026.3700139)中的交互驱动与优化驱动反应式干扰器，会根据强化学习链路的行为调整策略，而不是重复固定模式。公开摘要表明，这类学习型干扰能够以低于传统反应式干扰的功率，把智能链路推向次优状态。这里最值得关注的并非某个通用百分比，而是策略本身会泄露可供对手利用的行为规律。

## 学习信号也可能成为攻击入口

[Bait Tactics](https://doi.org/10.1109/PIMRC62392.2025.11275524)把攻击进一步推进到智能体的学习过程。干扰器操纵智能体感知到的状态转移和奖励方差，误导同时利用干扰能量进行反向散射与能量采集的深度强化学习抗干扰系统。在论文给定的仿真中，受害链路吞吐量最高下降 72%，干扰器相对标准反应式干扰最高节省 67% 功率。虽然这两个数值只适用于特定场景，却清楚说明了一个问题：只看平均链路性能，很可能发现不了学习闭环中的策略性漏洞。

硬件非理想因素带来的结果更反直觉。反应式干扰器出现虚警和漏检后，感知确实不再准确，但由此产生的随机模式反而可能更难被强化学习防御者掌握。在论文采用的感知误差与学习模型下，使用相同资源的不完美干扰器，甚至会比理想化干扰器造成更强破坏。对于自适应系统而言，硬件误差不一定只会削弱对手，它也可能改变数据分布，让预测和学习变得更困难。

## 承认物理限制，也能得到更简洁的方案

[Time Reversal in RIS-Aided Environments](https://doi.org/10.1109/LWC.2025.3530823)把同样的思路用于 RIS 辅助的频率选择性信道。论文设计时间反演预编码，并在多种反射配置下分析误码率和分集。公开摘要指出，由于 RIS 的可控自由度有限，在最强抽头处最大化孔径增益的方案，与论文研究的最优 RIS 配置表现接近。这个结论的意义不在于追求更复杂的控制，而在于承认物理上限之后，可以找到性能接近、实现更直接的设计。

这几项工作把“稳健”从宣传用语还原成一组可以检查的条件：对手能够看到什么，传感器可能看错什么，硬件实际上能够控制什么。现有证据主要来自分析和数值实验，还不是空口测试或大规模外场活动；但这种建模方式已经给出了清晰的研究准则——把失败条件纳入设计，安全结论才更经得起推敲。

## 研究札记

> ### Outsmarting the Smart: Intelligent Jamming Strategies Against AI-Empowered Anti-Jamming Frameworks
>
> - **作者：** Muhammad Shahzad Arif, Yuhang Shen, Sami Muhaidat, Paschalis C. Sofotasios
> - **状态：** 已发表期刊论文
> - **主要来源：** [IEEE Journal on Selected Areas in Communications](https://doi.org/10.1109/JSAC.2026.3700139)
> **证据说明：** 公开摘要没有为所有结论给出完整的精确差值，验证属于数值基准测试，并非空口部署。
>
> ### Bait Tactics: Misleading DRL-Based Cognitive Anti-Jamming Communications via Adversarial Learning
>
> - **作者：** Muhammad Shahzad Arif, Sami Muhaidat, Paschalis C. Sofotasios
> - **状态：** 已发表会议论文
> - **主要来源：** [IEEE PIMRC](https://doi.org/10.1109/PIMRC62392.2025.11275524)
> **证据说明：** 72% 的吞吐量下降与 67% 的干扰器功率节省来自特定仿真场景，不是外场测量或普遍保证。
>
> ### Performance of AI-Empowered Anti-Jamming Communications under Hardware Impairments
>
> - **作者：** Muhammad Shahzad Arif, Sami Muhaidat, Antonios Argyriou, Paschalis C. Sofotasios
> - **状态：** 已发表会议论文
> - **主要来源：** [IEEE MECOM](https://doi.org/10.1109/MECOM61498.2024.10881377)
> **证据说明：** 结论受论文采用的感知误差与学习模型约束，不能覆盖所有射频缺陷或已部署波形。
>
> ### Time Reversal in RIS-Aided Environments
>
> - **作者：** Khalid AlHamdani, Shimaa Naser, Sami Muhaidat, Paschalis C. Sofotasios
> - **状态：** 已发表期刊论文
> - **主要来源：** [IEEE Wireless Communications Letters](https://doi.org/10.1109/LWC.2025.3530823)
> **证据说明：** 验证来自分析与仿真，尚无硬件原型或实测信道活动。
