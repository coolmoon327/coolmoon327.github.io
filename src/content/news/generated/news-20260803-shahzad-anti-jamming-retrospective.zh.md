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
## 智能防御本身也会暴露新的攻击面

Muhammad Shahzad Arif 近期的抗干扰工作，把攻击者从“固定发射噪声的设备”变成了“会观察防御者的智能体”。强化学习无线系统会根据经验切换信道或调整工作方式，但一连串决策也会暴露策略规律。三项研究依次考察黑盒行为利用、学习信号操纵，以及感知缺陷带来的反常影响。

[Outsmarting the Smart](https://doi.org/10.1109/JSAC.2026.3700139)中的对手不需要读取受害模型内部参数，只需通过黑盒交互观察链路行为。交互驱动与优化驱动的反应式干扰器据此持续适应，把学习型抗干扰链路推向次优状态；公开摘要还报告了低于传统反应式干扰的功率消耗。由此可见，参数不公开并不意味着策略没有泄露信息，重复行为本身就可能被利用。

## 攻击智能体所相信的“经验”

[Bait Tactics](https://doi.org/10.1109/PIMRC62392.2025.11275524)把目标转向智能体感知到的状态转移和奖励方差。受害者是一套能够通过反向散射与能量采集利用干扰能量的深度强化学习认知无线系统，因此攻击同时影响通信过程和学习过程。在论文仿真中，受害链路吞吐量最高下降 72%，干扰器相对标准反应式干扰最高节省 67% 功率。数值虽然只属于特定场景，却说明误导经验可能比单纯增加干扰功率更有效。

硬件非理想因素研究随后提出一个反常问题：感知不准的干扰器是否一定更弱？虚警和漏检确实让观测变差，却也会把干扰模式随机化。在论文采用的模型下，这种随机性反而使强化学习防御者更难掌握规律，使用相同资源的不完美干扰器可能比理想化干扰器造成更强破坏。攻击方的误差，甚至会意外形成一种“对抗多样性”。

三项工作共同把抗干扰评估从“对付一个固定基线”推进到更困难的情形。可信的学习型防御，需要同时面对会适应的行为、被污染的反馈，以及攻击者自身的不确定性。现有结果仍是受具体学习和感知模型约束的数值证据，不能解释成普遍攻击成功率；但它们已经明确指出，下一代抗干扰系统应该接受怎样的压力测试。

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
