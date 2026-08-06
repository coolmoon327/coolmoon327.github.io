---
{
  "title": "从检测到业务恢复：抗干扰系统的完整防线",
  "locale": "zh",
  "slug": "anti-jamming-resilience-stack",
  "newsId": "news-20260804-anti-jamming-resilience-stack",
  "translationKey": "news-20260804-anti-jamming-resilience-stack",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2024-07-16",
  "coverageEnd": "2025-07-28",
  "module": "fields",
  "keywords": [
    "anti-jamming",
    "learning-enabled-wireless",
    "resilient-wireless",
    "adversarial-wireless-learning",
    "noma",
    "ris",
    "reinforcement-learning",
    "wireless-communications",
    "isac",
    "resource-allocation"
  ],
  "authors": [
    "Aladin Djuhera",
    "Vlad C. Andrei",
    "Xinyang Li",
    "Ullrich J. Mönich",
    "Holger Boche",
    "Walid Saad",
    "Maice Costa",
    "Yalin E. Sagduyu",
    "Ghazal Asemian",
    "Mohammadreza Amini",
    "Burak Kantarci",
    "Amir Mehrabian",
    "Georges Kaddoum",
    "Luliang Jia",
    "Nan Qi",
    "Zhe Su",
    "Feihuang Chu",
    "Shengliang Fang",
    "Kai-Kit Wong",
    "Chan-Byoung Chae",
    "Yihui Chen",
    "Helin Yang",
    "Xiaoyu Ou",
    "Yifu Jiang",
    "Zehui Xiong"
  ],
  "subjectIds": [],
  "workIds": [
    "doi-10-1109-tifs-2025-3594107",
    "doi-10-1109-iccworkshops59551-2024-10615460",
    "doi-10-1109-icc52391-2025-11161445",
    "doi-10-1109-tcomm-2025-3587046",
    "doi-10-1109-tcomm-2025-3592583",
    "doi-10-1109-comst-2024-3482973",
    "doi-10-1109-lwc-2024-3496437"
  ],
  "coverTone": "violet",
  "coverKicker": "抗干扰与无线韧性",
  "coverTitle": "发现、诱导、抑制，再恢复业务",
  "coverPoints": [
    "攻击下的学习系统",
    "协作感知",
    "面向业务的恢复"
  ],
  "description": "七项工作把抗干扰扩展为一条完整链路：防御建模、检测、方向估计、诱饵、可编程传输、资源分配以及业务恢复。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 有韧性的链路不能只把干扰功率压低

干扰并不是一种固定噪声。攻击者可能寻找传输时机、专门破坏时效性数据，也可能污染模型参数，或迫使接收机在信道知识不足时工作。因此，完整防线需要一系列能力：先选对描述攻防关系的模型，再判断干扰是否具有恶意、估计它来自哪里，让攻击者难以选中最关键的时刻，重新塑造链路，并确认最终业务仍然可用。这里的七项研究分别覆盖这条链路的不同环节。它们的指标不能直接横向拼接，却共同给出了比单一干扰后信干噪比更有用的抗干扰图景。

[Game Theory and Reinforcement Learning for Anti-Jamming Defense in Wireless Communications: Current Research, Challenges, and Solutions](https://doi.org/10.1109/comst.2024.3482973) 先为防御方法建立一张地图。综述梳理了贝叶斯博弈、Stackelberg 博弈、随机博弈、零和博弈及图博弈等模型，也讨论 Q 学习、多臂老虎机、深度强化学习与迁移强化学习，并比较各类方法的长处、局限及相互结合的可能性。综述本身不是一套可以直接部署的防御方案，但它有助于区分三类问题：哪些假设描述对手，哪些反馈来自无线环境，哪些决策必须在运行中学习。

[R-SFLLM: Jamming Resilient Framework for Split Federated Learning with Large Language Models](https://doi.org/10.1109/tifs.2025.3594107) 从业务失效出发。论文把干扰造成的嵌入误差与学习损失发散联系起来，再利用无线感知估计干扰来向，并联合控制波束成形、用户调度和资源分配；训练时注入可控噪声，则用于提高模型对参数扰动的容忍度。公开摘要显示，在所选语言与视觉语言任务上，性能接近无干扰基线。相较只看链路，这类评估更接近业务结果，但仍只是特定模型、数据集和攻击条件下的实验，不是对所有分拆学习系统的保证。

## 面对自适应攻击者，也可以让它找错目标

[Timely NextG Communications with Decoy Assistance against Deep Learning-based Jamming](https://doi.org/10.1109/iccworkshops59551.2024.10615460) 假设干扰器用学习模型检测传输，同时受到平均功率预算约束。诱饵消息的作用，是让它把能量浪费在错误时刻。功率控制形成两难：更强的发射有利于交付，却也可能更容易被对手识别。论文同时考察信息年龄与可靠性，强调一个经常被忽略的问题——即使数据最终成功送达，如果更新到得太晚，抗干扰方案仍可能没有保住时效性业务。

[Anti-Jamming Resource Allocation for Integrated Sensing and Communications Based on Game-Guided Reinforcement Learning](https://doi.org/10.1109/lwc.2024.3496437) 把耦合的通感一体化防御拆成两类决策：功率控制写成马尔可夫决策过程，信道选择写成 Stackelberg 博弈，作者还给出了均衡存在性证明。在此基础上，深度强化学习方法同时权衡通信速率与有效感知功率，并满足通信和感知约束。仿真相对所选基线取得了改进，但结论仍依赖设定的干扰动态、信道间干扰、奖励函数和系统参数。

[Active RIS-Assisted URLLC NOMA-Based 5G Network with FBL under Jamming Attacks](https://doi.org/10.1109/icc52391.2025.11161445) 直接改造传输链路。主动 RIS 服务于有限码长和动态业务下的超可靠低时延 NOMA 系统。仿真中，建模的 RIS 阵元从 4 增加到 400 时，信号与干扰加噪声比提高 13.64%；联合优化码长和分组到达率后，能效提高 31.68%。这些数字只对应给定系统模型，还没有包含真实主动表面的全部器件噪声、控制开销和时延组成。

## 协作让“发现干扰”和“抑制干扰”可以分开设计

Amir Mehrabian 与 Georges Kaddoum 的两项工作分别处理协作防御的前后阶段。[Cooperative Jamming Detection Using Low-Rank Structure of Received Signal Matrix](https://doi.org/10.1109/tcomm.2025.3592583) 利用接收信号矩阵的低秩结构构造似然比检测器，并分别考虑友方节点、干扰器数量以及噪声和信道统计知识不同的情形。论文还讨论分析阈值和蒙特卡洛阈值设置。虽然检测性能来自仿真，但不同情形明确指出每一种检测器究竟需要多少先验信息。

[Enhancing Resilience Against Jamming Attacks: A Cooperative Anti-Jamming Method Using Direction Estimation](https://doi.org/10.1109/tcomm.2025.3587046) 则让多个感知节点利用导频估计干扰信道方向，再进行空间抑制。公开摘要显示，在强干扰且感知节点明显多于干扰节点时，方案相对无干扰情形仅退化 0.7 dB；它也可以扩展到多个干扰器，但会消耗空间自由度。条件本身非常重要：协作确实提供了空间信息，可一旦导频、感知多样性或相干时间不足，优势也会收缩。

## 韧性最终要由端到端业务来证明

未来的抗干扰结论可以按层次逐项检查：博弈或学习模型要说明防御者能够观察什么、干扰器如何反应以及目标函数如何定义；检测器应说明依赖哪些噪声与信道统计；方向估计应说明导频和感知节点需求；链路调整要计入表面噪声、控制成本和有限码长；学习型或时效性业务则必须使用自身的损失、精度或信息新鲜度指标。只有当攻击影响一直被控制到链路最终承载的服务，才能说系统真正具有韧性。

## 研究札记

> ### R-SFLLM: Jamming Resilient Framework for Split Federated Learning with Large Language Models
>
> - **作者：** Aladin Djuhera, Vlad C. Andrei, Xinyang Li, Ullrich J. Mönich, Holger Boche, Walid Saad
> - **公开记录：** [IEEE Transactions on Information Forensics and Security](https://doi.org/10.1109/tifs.2025.3594107)
> - **可确认内容：** 框架将嵌入误差关联到学习损失，使用感知辅助波束与资源控制，并在语言和视觉语言任务中测试对抗训练。
> - **阅读提示：** 接近基线的业务性能只对应所测模型、数据集、资源策略和干扰条件。
>
> ---
>
> ### Timely NextG Communications with Decoy Assistance against Deep Learning-based Jamming
>
> - **作者：** Maice Costa, Yalin E. Sagduyu
> - **公开记录：** [IEEE ICC Workshops 2024](https://doi.org/10.1109/iccworkshops59551.2024.10615460)
> - **可确认内容：** 工作以信息年龄和可靠性为目标，评估诱饵传输与功率控制对学习型检测干扰器的作用。
> - **阅读提示：** 效果取决于干扰器分类器、功率预算、信道假设以及诱饵开销。
>
> ---
>
> ### Active RIS-Assisted URLLC NOMA-Based 5G Network with FBL under Jamming Attacks
>
> - **作者：** Ghazal Asemian, Mohammadreza Amini, Burak Kantarci
> - **公开记录：** [IEEE ICC 2025](https://doi.org/10.1109/icc52391.2025.11161445)
> - **可确认内容：** 仿真联合研究主动 RIS 规模与幅度、有限码长、分组到达、时延和能效。
> - **阅读提示：** 13.64% 的信干噪比改进和 31.68% 的能效改进对应论文选定的参数变化，未包含全部硬件实现成本。
>
> ---
>
> ### Enhancing Resilience Against Jamming Attacks: A Cooperative Anti-Jamming Method Using Direction Estimation
>
> - **作者：** Amir Mehrabian, Georges Kaddoum
> - **公开记录：** [IEEE Transactions on Communications](https://doi.org/10.1109/tcomm.2025.3587046)
> - **可确认内容：** 协作感知节点从导频估计干扰信道方向，并在强干扰和快衰落下进行空间抑制。
> - **阅读提示：** 0.7 dB 退化对应强干扰且感知节点明显多于干扰器的条件；多个干扰器会消耗自由度。
>
> ---
>
> ### Cooperative Jamming Detection Using Low-Rank Structure of Received Signal Matrix
>
> - **作者：** Amir Mehrabian, Georges Kaddoum
> - **公开记录：** [IEEE Transactions on Communications](https://doi.org/10.1109/tcomm.2025.3592583)
> - **可确认内容：** 接收信号低秩结构支撑似然比检测器及多种统计知识条件下的阈值设置方法。
> - **阅读提示：** 检测增益来自仿真；不同情形可能需要噪声、信道或无干扰信号分布知识来设定阈值。

> ---
>
> ### Game Theory and Reinforcement Learning for Anti-Jamming Defense in Wireless Communications: Current Research, Challenges, and Solutions
>
> - **作者：** Luliang Jia, Nan Qi, Zhe Su, Feihuang Chu, Shengliang Fang, Kai-Kit Wong, Chan-Byoung Chae
> - **公开记录：** [IEEE Communications Surveys & Tutorials](https://doi.org/10.1109/comst.2024.3482973)
> - **可确认内容：** 公开摘要说明，这篇综述系统梳理博弈论与强化学习抗干扰方法，并比较其优缺点、结合方式及后续研究问题。
> - **阅读提示：** 综述汇总的是不同模型与实验条件下的既有研究，并非在同一平台验证的一套防御；本文依据公开摘要整理，没有重新核验综述涉及的每篇全文。
>
> ---
>
> ### Anti-Jamming Resource Allocation for Integrated Sensing and Communications Based on Game-Guided Reinforcement Learning
>
> - **作者：** Yihui Chen, Helin Yang, Xiaoyu Ou, Yifu Jiang, Zehui Xiong
> - **公开记录：** [IEEE Wireless Communications Letters](https://doi.org/10.1109/lwc.2024.3496437)
> - **可确认内容：** 工作把功率控制建模为马尔可夫决策过程，把信道选择建模为 Stackelberg 博弈，并评估面向通信与感知目标的博弈引导深度强化学习方法。
> - **阅读提示：** 对干扰和信道间干扰的抵抗效果来自仿真，依赖设定的通感一体化模型、干扰器行为、约束与对比方案。
