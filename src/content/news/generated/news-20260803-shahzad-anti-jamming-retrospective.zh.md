---
{
  "title": "Muhammad Shahzad Arif：学习型抗干扰系统如何被误导",
  "locale": "zh",
  "slug": "shahzad-anti-jamming-retrospective",
  "newsId": "news-20260803-shahzad-anti-jamming-retrospective",
  "translationKey": "news-20260803-shahzad-anti-jamming-retrospective",
  "generated": true,
  "date": "2026-08-03",
  "coverageStart": "2024-11-17",
  "coverageEnd": "2026-06-04",
  "module": "interests",
  "keywords": [
    "anti-jamming",
    "adversarial-wireless-learning",
    "reinforcement-learning",
    "physical-layer-security",
    "secure-6g",
    "learning-enabled-wireless",
    "resilient-wireless"
  ],
  "authors": [
    "Muhammad Shahzad Arif",
    "Yuhang Shen",
    "Sami Muhaidat",
    "Paschalis C. Sofotasios",
    "Antonios Argyriou"
  ],
  "subjectIds": [
    "muhammad-shahzad-arif",
    "sami-muhaidat",
    "paschalis-sofotasios"
  ],
  "workIds": [
    "doi-10-1109-jsac-2026-3700139",
    "doi-10-1109-pimrc62392-2025-11275524",
    "doi-10-1109-mecom61498-2024-10881377"
  ],
  "focusSubjectId": "muhammad-shahzad-arif",
  "coverTone": "rose",
  "coverKicker": "合作研究",
  "coverTitle": "对学习型防御做压力测试",
  "coverPoints": [
    "黑盒干扰",
    "诱饵策略",
    "感知误差"
  ],
  "description": "通过三项公开仿真研究，说明黑盒干扰、奖励诱饵和感知误差如何削弱学习型无线防御。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 观察视角

三项工作构成一条以攻击者为中心的研究脉络：先通过黑盒交互利用学习策略，再操纵其观测与奖励，最后考察不完美感知如何改变攻击面。

## Outsmarting the Smart: Intelligent Jamming Strategies Against AI-Empowered Anti-Jamming Frameworks

**作者：** Muhammad Shahzad Arif, Yuhang Shen, Sami Muhaidat, Paschalis C. Sofotasios

**Muhammad Shahzad Arif 视角。** [查看主要公开记录](https://doi.org/10.1109/JSAC.2026.3700139)。公开摘要比较了交互驱动与优化驱动的反应式干扰器，并在黑盒访问条件下攻击强化学习抗干扰链路。结果表明，自适应学习型干扰器可将智能链路推向次优运行状态，同时比传统反应式干扰消耗更少功率，因此该工作可视为对学习型无线控制的一次直接压力测试。

**证据边界。** 摘要没有为每项结论给出完整的精确差值，证据来自数值基准测试，而不是空口部署。

## Bait Tactics: Misleading DRL-Based Cognitive Anti-Jamming Communications via Adversarial Learning

**作者：** Muhammad Shahzad Arif, Sami Muhaidat, Paschalis C. Sofotasios

**Muhammad Shahzad Arif 视角。** [查看主要公开记录](https://doi.org/10.1109/PIMRC62392.2025.11275524)。该研究通过操纵深度强化学习抗干扰智能体感知到的状态转移与奖励方差实施“诱饵”攻击，同时考虑利用干扰能量进行反向散射和能量采集。在论文给定的仿真中，受害链路吞吐量最高下降 72%，而干扰器相对标准反应式干扰最高节省 67% 功率。

**证据边界。** 这两个百分比都只适用于论文设定的仿真场景，不能视为空口测量或普遍攻击保证。

## Performance of AI-Empowered Anti-Jamming Communications under Hardware Impairments

**作者：** Muhammad Shahzad Arif, Sami Muhaidat, Antonios Argyriou, Paschalis C. Sofotasios

**Muhammad Shahzad Arif 视角。** [查看主要公开记录](https://doi.org/10.1109/MECOM61498.2024.10881377)。该仿真研究单独分析反应式干扰器中的感知虚警与漏检。在论文给定的学习设置下，这些缺陷会随机化干扰模式，使其在相同资源下反而比理想化干扰器更能破坏强化学习抗干扰智能体，提示硬件误差并不总会削弱对手。

**证据边界。** 结论受论文的感知误差与学习模型约束，不能覆盖所有射频缺陷或已部署波形。
