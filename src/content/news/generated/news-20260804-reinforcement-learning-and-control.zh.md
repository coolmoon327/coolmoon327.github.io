---
{
  "title": "强化学习何时值得进入无线控制闭环",
  "locale": "zh",
  "slug": "reinforcement-learning-and-control",
  "newsId": "news-20260804-reinforcement-learning-and-control",
  "translationKey": "news-20260804-reinforcement-learning-and-control",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2024-01-30",
  "coverageEnd": "2025-04-02",
  "module": "fields",
  "keywords": [
    "edge-and-fog-systems",
    "reinforcement-learning",
    "resource-allocation",
    "convex-optimization",
    "online-optimization",
    "ai-native-wireless",
    "isac",
    "learning-enabled-wireless",
    "wireless-communications",
    "anti-jamming",
    "resilient-wireless",
    "physical-layer-security"
  ],
  "authors": [
    "Mintae Kim",
    "Hoon Lee",
    "Sangwon Hwang",
    "Mérouane Debbah",
    "Inkyu Lee",
    "Wanting Yang",
    "Zehui Xiong",
    "Song Guo",
    "Shiwen Mao",
    "Dong In Kim",
    "Rasika Vijithasena",
    "Rafaela Scaciota",
    "Mehdi Bennis",
    "Sumudu Samarakoon",
    "Ruoyang Chen",
    "Changyan Yi",
    "Fuhui Zhou",
    "Jiawen Kang",
    "Yuan Wu",
    "Dusit Niyato",
    "Jinhao Ouyang",
    "Yuan Liu",
    "Hang Liu",
    "Tingting Yang",
    "Ping Zhang",
    "Mengfan Zheng",
    "Yuxuan Shi",
    "Liwen Jing",
    "Jianbo Huang",
    "Nan Li",
    "Luliang Jia",
    "Nan Qi",
    "Zhe Su",
    "Feihuang Chu",
    "Shengliang Fang",
    "Kai-Kit Wong",
    "Chan-Byoung Chae",
    "Zihan Song",
    "Yang Lu",
    "Xianhao Chen",
    "Bo Ai",
    "Zhangdui Zhong",
    "Yihui Chen",
    "Helin Yang",
    "Xiaoyu Ou",
    "Yifu Jiang",
    "Shengzhe Xu",
    "Christo Kurisummoottil Thomas",
    "Omar Hashash",
    "Nikhil Muralidhar",
    "Walid Saad",
    "Naren Ramakrishnan"
  ],
  "subjectIds": [
    "merouane-debbah"
  ],
  "workIds": [
    "doi-10-1109-jiot-2024-3447090",
    "doi-10-1109-tmc-2025-3560582",
    "doi-10-1109-pimrc59610-2024-10817284",
    "doi-10-1109-tmc-2025-3582755",
    "doi-10-1109-tmc-2025-3557838",
    "doi-10-1109-mnet-2025-3579496",
    "doi-10-1109-comst-2024-3482973",
    "doi-10-1109-tvt-2024-3442167",
    "doi-10-1109-lwc-2024-3496437",
    "doi-10-1109-mnet-2024-3427313"
  ],
  "coverTone": "mint",
  "coverKicker": "强化学习",
  "coverTitle": "只把结构解决不了的部分交给学习",
  "coverPoints": [
    "多智能体协作",
    "混合求解器",
    "非强化学习在线控制"
  ],
  "description": "十项工作区分策略学习、博弈引导控制、物理层学习求解器、基础模型与解析在线优化在无线系统中的不同职责。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 强化学习是一种设计选择，不是“会自适应”的同义词

信道、任务负载、移动状态和能量预算都在变化，无线系统必须连续决策，强化学习因此很有吸引力。但动态调整不自动等于强化学习，使用神经网络也不代表系统一定在学习策略。这里的十项工作从多智能体和博弈引导策略，延伸到学习型波束成形、无线基础模型，以及完全不用强化学习的在线优化。真正需要回答的是：已知结构被充分利用后，是否还存在值得通过反馈学习的决策？把这些职责分开，直接关系到可解释性、训练代价以及算法能够合理承诺什么。

Mérouane Debbah 教授参与的 [Cooperative Multi-Agent Deep Reinforcement Learning Methods for UAV-aided Mobile Edge Computing Networks](https://doi.org/10.1109/jiot.2024.3447090) 是典型的强化学习核心方案。无人机与地面物联网设备只能看到部分网络状态，却要各自决定轨迹、资源分配和任务卸载。不同的策略网络分别产生任务决策和协作消息，图注意力结构则让系统能够适应不同数量的设备。公开摘要显示，其数值结果优于所选传统方法，但尚不能据此证明它对所有部署变化或智能体间通信故障都足够稳健。

## 让学习处理组合决策，让优化利用数学结构

Mérouane Debbah 教授参与的 [Efficient Multi-user Offloading of Personalized Diffusion Models: A DRL-Convex Hybrid Solution](https://doi.org/10.1109/tmc.2025.3560582) 对两类工具作了明确分工。个性化扩散模型推理被拆成边缘端批处理的共享阶段和用户端个性化阶段，切分点也需要选择。由此形成的广义二次指派问题被转换成决策序列：深度强化学习负责具有组合性质的自适应选择，凸优化负责可利用数学结构的部分。这样的描述比笼统称为“AI 求解器”更准确，因为它说明了究竟是哪部分复杂性需要学习。

[Resource Optimization for Tail-Based Control in Wireless Networked Control Systems](https://doi.org/10.1109/pimrc59610.2024.10817284) 是一个更宽的混合控制栈：Lyapunov 优化负责传感调度，高斯过程回归负责状态预测与不确定性估计，强化学习策略负责尾部敏感的控制目标。公开摘要显示，山地车控制实验中，相对四种对比变体，通信与控制资源的总体成本降低 22%。强化学习确实存在，但它既不是调度器，也不是不确定性模型；如果把整套系统简单归入端到端强化学习，反而会遮住排队、预测和控制理论的作用。

## 长期学习可以建立在短期结构化决策之上

[Federated Digital Twin Construction via Distributed Sensing: A Game-Theoretic Online Optimization with Overlapping Coalitions](https://doi.org/10.1109/tmc.2025.3582755) 采用了更分层的方式。云端与边缘服务器之间的任务分派、边缘服务器与传感器之间的组合，先被建模成匹配博弈和重叠联盟博弈，并通过专门算法得到短期均衡；随后再用深度强化学习处理数字孪生持续演化、通信代价和能耗下的长期决策。学习模块位于博弈分解之上，而不是把已有结构全部替换掉。

对照项 [A Two-Timescale Approach for Wireless Federated Learning with Parameter Freezing and Power Control](https://doi.org/10.1109/tmc.2025.3557838) 则没有使用强化学习。作者观察到部分模型参数会在训练收敛前提前稳定，于是联合决定冻结哪些参数、为不稳定参数分配多少发射功率，并满足能量预算。Lyapunov 优化将问题分解到两个时间尺度，直接导出在线策略。它同样能够随系统变化而调整，这恰好说明“在线”“学习驱动”和“强化学习”应当保留各自明确的技术含义。

## 先用博弈说明对抗关系，再让策略适应动态环境

[Game Theory and Reinforcement Learning for Anti-Jamming Defense in Wireless Communications: Current Research, Challenges, and Solutions](https://doi.org/10.1109/comst.2024.3482973) 为这种区分提供了系统地图。文章一方面梳理贝叶斯、Stackelberg、随机、零和与图博弈等抗干扰模型，另一方面比较 Q-learning、多臂老虎机、深度强化学习和迁移强化学习，并讨论二者如何结合。它是一篇综述，能够建立分类、比较优缺点，却不能证明某一种方案可以击败所有干扰者。其方法论价值在于：在训练策略之前，先用博弈明确参与者、信息条件和均衡目标。

[Anti-Jamming Resource Allocation for Integrated Sensing and Communications Based on Game-Guided Reinforcement Learning](https://doi.org/10.1109/lwc.2024.3496437) 把这种分工落到通感一体化系统。信道选择被写成 Stackelberg 博弈并给出均衡，功率控制则建模为马尔可夫决策过程，由深度强化学习处理。目标是在干扰下平衡通信速率与有效感知功率。文中的优势来自特定干扰者、信道间干扰和通感约束下的仿真；它说明博弈可以约束战略关系，而学习负责吸收难以预先掌握的动态部分。

## 基础模型、学习型求解器与控制策略并不是同一件事

[WirelessGPT: A Generative Pre-Trained Multi-Task Learning Framework for Wireless Communication](https://doi.org/10.1109/mnet.2025.3579496) 通过大规模无线信道数据预训练，为通信与感知任务提取共享表示。[Large Multi-Modal Models as Universal Foundation Models for AI-Native Wireless Systems](https://doi.org/10.1109/mnet.2024.3427313) 则提出更宽的框架，把多模态感知、物理符号落地、检索、因果推理和环境反馈联系起来。前者报告了约八千万参数的初始模型及下游数值收益，后者以设计愿景为主并给出初步实验。二者都不天然等于强化学习控制器；真正要检验的是，模型能否把物理与跨层结构迁移到新任务，同时不掩盖分布变化和验证成本。

[A Deep Learning Framework for Physical-Layer Secure Beamforming](https://doi.org/10.1109/tvt.2024.3442167) 更聚焦具体任务。SecCNN 与 SecGNN 通过无监督训练，把信道信息映射为波束成形和人工噪声向量，其中图模型还区分不同用户角色。数值实验比较最优性、规模适应、推断时延、稳定性和不同效用间的迁移。这是一种面向结构化物理层问题的学习型映射，而非基于交互奖励的序贯策略。把它与强化学习论文并列，恰好能看清“神经网络求解器”和“策略学习器”的边界。

## 能利用的结构先利用，必须从反馈中学的部分再学习

这组工作给出了一套更克制的设计顺序：先判断问题究竟需要表示学习、监督或无监督近似、在线优化，还是基于反馈的策略；再找出可分解、凸、排队、控制或博弈结构，只让学习接手剩余的高维、部分可观测或组合决策；最后检验设备、任务、攻击者和信道离开训练分布后会发生什么。强化学习最有说服力的角色，不是给所有神经模块统一贴标签，而是在其他层次仍清晰可见的前提下补上其中一环。

## 研究札记

> ### Cooperative Multi-Agent Deep Reinforcement Learning Methods for UAV-aided Mobile Edge Computing Networks
>
> - **作者：** Mintae Kim, Hoon Lee, Sangwon Hwang, Mérouane Debbah, Inkyu Lee
> - **公开记录：** [IEEE Internet of Things Journal](https://doi.org/10.1109/jiot.2024.3447090)
> - **可确认内容：** 多个策略网络在部分可观测条件下同时学习协作消息与无人机/终端决策，图注意力用于适配不同设备规模。
> - **阅读提示：** 性能优势来自与所选方法的数值比较，并非真实多无人机系统部署结果。
>
> ---
>
> ### Efficient Multi-user Offloading of Personalized Diffusion Models: A DRL-Convex Hybrid Solution
>
> - **作者：** Wanting Yang, Zehui Xiong, Song Guo, Shiwen Mao, Dong In Kim, Mérouane Debbah
> - **公开记录：** [IEEE Transactions on Mobile Computing](https://doi.org/10.1109/tmc.2025.3560582)
> - **可确认内容：** 工作拆分个性化扩散推理，并结合深度强化学习与凸优化，处理多用户卸载和切分点选择。
> - **阅读提示：** 时延—精度收益与复杂度比较来自所建模的资源、用户和推理过程。
>
> ---
>
> ### Resource Optimization for Tail-Based Control in Wireless Networked Control Systems
>
> - **作者：** Rasika Vijithasena, Rafaela Scaciota, Mehdi Bennis, Sumudu Samarakoon
> - **公开记录：** [IEEE PIMRC 2024](https://doi.org/10.1109/pimrc59610.2024.10817284)
> - **可确认内容：** 系统结合 Lyapunov 传感调度、高斯过程状态预测和强化学习控制；山地车实验中总体成本相对四种变体降低 22%。
> - **阅读提示：** 这是一套混合控制方案，并非纯强化学习优化器；降幅只对应文中的实验抽象。
>
> ---
>
> ### Federated Digital Twin Construction via Distributed Sensing: A Game-Theoretic Online Optimization with Overlapping Coalitions
>
> - **作者：** Ruoyang Chen, Changyan Yi, Fuhui Zhou, Jiawen Kang, Yuan Wu, Dusit Niyato
> - **公开记录：** [IEEE Transactions on Mobile Computing](https://doi.org/10.1109/tmc.2025.3582755)
> - **可确认内容：** 匹配博弈与重叠联盟博弈处理短期分派，深度强化学习模块面向数字孪生质量与成本的长期决策。
> - **阅读提示：** 公开摘要支持仿真有效性，但不能将收敛或部署结论扩展到所建分层博弈之外。
>
> ---
>
> ### A Two-Timescale Approach for Wireless Federated Learning with Parameter Freezing and Power Control
>
> - **作者：** Jinhao Ouyang, Yuan Liu, Hang Liu
> - **公开记录：** [IEEE Transactions on Mobile Computing](https://doi.org/10.1109/tmc.2025.3557838)
> - **可确认内容：** 收敛分析支撑参数冻结与发射功率的联合设计，并通过双时间尺度 Lyapunov 分解得到在线策略。
> - **阅读提示：** 这是优化驱动的自适应方法，而非强化学习；优势来自所测联邦学习环境。
>
> ---
>
> ### Game Theory and Reinforcement Learning for Anti-Jamming Defense in Wireless Communications: Current Research, Challenges, and Solutions
>
> - **作者：** Luliang Jia、Nan Qi、Zhe Su、Feihuang Chu、Shengliang Fang、Kai-Kit Wong、Chan-Byoung Chae
> - **公开记录：** [IEEE Communications Surveys & Tutorials](https://doi.org/10.1109/comst.2024.3482973)
> - **可确认内容：** 系统梳理主要抗干扰博弈模型和强化学习路线，比较各自优缺点并讨论融合方式。
> - **阅读提示：** 这是研究综述与议程，并未证明某一种博弈—强化学习方案能够应对所有干扰者。
>
> ---
>
> ### Anti-Jamming Resource Allocation for Integrated Sensing and Communications Based on Game-Guided Reinforcement Learning
>
> - **作者：** Yihui Chen、Helin Yang、Xiaoyu Ou、Yifu Jiang、Zehui Xiong
> - **公开记录：** [IEEE Wireless Communications Letters](https://doi.org/10.1109/lwc.2024.3496437)
> - **可确认内容：** 用具有均衡的 Stackelberg 博弈建模信道选择，并以 MDP 和深度强化学习处理干扰下的通感功率控制。
> - **阅读提示：** 性能收益依赖论文采用的干扰者、信道间干扰、信道与通感模型。
>
> ---
>
> ### WirelessGPT: A Generative Pre-Trained Multi-Task Learning Framework for Wireless Communication
>
> - **作者：** Tingting Yang、Ping Zhang、Mengfan Zheng、Yuxuan Shi、Liwen Jing、Jianbo Huang、Nan Li
> - **公开记录：** [IEEE Network](https://doi.org/10.1109/mnet.2025.3579496)
> - **可确认内容：** 在无线信道数据上进行无监督预训练，得到共享表示，并以少量微调评估多项通信与感知任务。
> - **阅读提示：** 收益属于所选数据、下游任务、模型规模和基线，不能据此推导普遍迁移能力。
>
> ---
>
> ### Large Multi-Modal Models as Universal Foundation Models for AI-Native Wireless Systems
>
> - **作者：** Shengzhe Xu、Christo Kurisummoottil Thomas、Omar Hashash、Nikhil Muralidhar、Walid Saad、Naren Ramakrishnan
> - **公开记录：** [IEEE Network](https://doi.org/10.1109/mnet.2024.3427313)
> - **可确认内容：** 提出面向无线系统的多模态基础模型架构，并报告初步的落地与推理实验。
> - **阅读提示：** 论文以设计愿景和早期证据为主，尚非跨任意无线领域的生产验证。
>
> ---
>
> ### A Deep Learning Framework for Physical-Layer Secure Beamforming
>
> - **作者：** Zihan Song、Yang Lu、Xianhao Chen、Bo Ai、Zhangdui Zhong、Dusit Niyato
> - **公开记录：** [IEEE Transactions on Vehicular Technology](https://doi.org/10.1109/tvt.2024.3442167)
> - **可确认内容：** SecCNN 与 SecGNN 学习从信道到波束成形及人工噪声的映射，并评估最优性、规模、推断时延、稳定性与迁移。
> - **阅读提示：** 证据来自数值实验，超出所测效用和信道分布后的部署鲁棒性仍需验证。
