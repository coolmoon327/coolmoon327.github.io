---
{
  "title": "Zhiguo Ding 教授：从环境物联网到无线供能边缘计算的能量账本",
  "locale": "zh",
  "slug": "zhiguo-energy-aware-multiple-access",
  "newsId": "news-20260804-zhiguo-energy-aware-multiple-access",
  "translationKey": "news-20260804-zhiguo-energy-aware-multiple-access",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2024-03-05",
  "coverageEnd": "2025-06-03",
  "module": "advisors",
  "keywords": [
    "learning-enabled-wireless",
    "noma",
    "resource-allocation",
    "ambient-backscatter",
    "energy-constrained-iot",
    "physical-layer-security",
    "pinching-antennas",
    "wireless-power-transfer",
    "ris",
    "zero-energy-wireless",
    "wireless-powered-edge",
    "wireless-communications"
  ],
  "authors": [
    "Yushen Lin",
    "Kaidi Wang",
    "Zhiguo Ding",
    "Athanasios P. Chrysologou",
    "Nestor D. Chatzidiamantis",
    "Alexandros-Apostolos A. Boulogeorgos",
    "Yixuan Li",
    "Ji Wang",
    "Yuanwei Liu",
    "Ahmad Massud Tota Khel",
    "Aissa Ikhlef",
    "Hongjian Sun",
    "Lu Lv",
    "Hao Luo",
    "Long Yang",
    "Arumugam Nallanathan",
    "Naofal Al-Dhahir",
    "Jian Chen",
    "Chongjun Ouyang",
    "Zhaolin Wang",
    "Jiaqi Xu",
    "Xidong Mu"
  ],
  "subjectIds": [
    "zhiguo-ding"
  ],
  "workIds": [
    "doi-10-1109-twc-2024-3447833",
    "doi-10-1109-twc-2025-3577446",
    "doi-10-1109-tvt-2025-3609450",
    "doi-10-1109-lcomm-2025-3594663",
    "doi-10-1109-tgcn-2025-3578423",
    "doi-10-1109-twc-2024-3503582",
    "doi-10-1109-mwc-001-2400493"
  ],
  "focusSubjectId": "zhiguo-ding",
  "coverTone": "amber",
  "coverKicker": "ZHIGUO DING",
  "coverTitle": "多址接入也是一笔能量账",
  "coverPoints": [
    "环境反向散射",
    "无线供能",
    "学习与边缘计算"
  ],
  "description": "七项工作通过联合资源核算，把 NOMA、环境反向散射、连续孔径、无线供能、可重构智能表面、边缘计算和联邦学习连接起来。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 接入决策也决定终端有没有能量发射

Zhiguo Ding 教授近期的这些工作，把多址接入与能量流动放在同一个系统里考虑。传统上行链路通常默认终端已经拥有可调节的发射功率；环境物联网设备可能只能反射周围已有载波，无线供能终端需要先采能再传输，就连名义上的无源表面也要消耗控制能量。在这样的系统里，谁在什么资源上传输、采用怎样的干扰结构，不只影响速率，还直接决定通信能否长期维持。

[BackCom Assisted Hybrid NOMA Uplink Transmission for Ambient IoT](https://doi.org/10.1109/twc.2025.3577446) 把反向散射通信与主动上行放进同一种混合 NOMA 设计。优化目标是降低主动终端的总上行功率，同时考虑低功耗环境设备如何调制并反射周围信号。论文先分析双用户情形，再分别用全局方法和逐次凸近似处理多用户问题。这个建模方式的重要之处在于，反向散射并非一条与主系统互不相关的旁路，它会实实在在改变共享上行中的干扰和功率分配。

## 可靠性与保密性面对的是同一组干扰

重复利用环境能量，并不会自动得到可靠链路。[On the Reliability and Security of Ambient Backscatter Uplink NOMA Networks](https://doi.org/10.1109/tvt.2025.3609450) 在反向散射设备与主动 NOMA 上行共存的条件下，分析中断概率和截获概率，并同时考虑理想与非理想串行干扰消除以及人工噪声。高信噪比分析显示，残余干扰在部分条件下会带来性能平台或非零极限；一味增加发射功率，无法消除所有错误和泄露风险。

这一点对环境通信尤其关键。允许频谱与能量复用的信号叠加，既可能帮助合法接收机区分用户，也可能在消除不彻底时成为障碍，还可能经过设计后削弱窃听者。论文的结论建立在明确的信道与攻击者模型上，并由分析和仿真支撑；它带来的普遍启发是，干扰既不是纯粹的坏事，也不会天然带来收益，关键在于不同节点能否观测、消除或采集它。

## 可重构结构让空间本身参与能量分配

三项研究进一步把物理孔径或传播环境写进资源分配。[CAPA: Continuous-Aperture Arrays for Revolutionizing 6G Wireless Communications](https://doi.org/10.1109/mwc.001.2400493) 不再把天线表示为离散阵元，而是考虑在电大尺寸孔径上连续分布电流。文章回顾已有原型，介绍电子、光学与声学三类实现路径，给出连续电流波束成形方法，并通过数值实验比较容量及分集—复用特性。它兼具教程、架构设计和早期数值验证，并未证明连续孔径已经能直接替代成熟阵列；真正值得注意的是，孔径如何表示也会改变空间资源的分配方式。

[Pinching-Antenna Assisted Simultaneous Wireless Information and Power Transfer](https://doi.org/10.1109/lcomm.2025.3594663) 研究沿波导布置可移动辐射点的夹持天线，并通过优化这些辐射点的位置，同时服务信息传输与无线供能。这样一来，能量和有效信号落在何处，也成为可控制的空间变量。数值结果展示了这种新自由度的潜力，但实际波导损耗、移动机构、信道获取和控制开销仍需硬件实验回答。

[Zero-Energy RIS-Assisted Communications With Noise Modulation and Interference-Based Energy Harvesting](https://doi.org/10.1109/tgcn.2025.3578423) 则尝试让可重构智能表面从入射干扰中获取自身运行所需的能量，并在通信方案中引入噪声调制。通常需要抑制的干扰，在这里既可能成为能源，也可能成为可利用的信号组成。论文在解析模型中讨论了实现能量平衡的条件；“零能耗”指的是所设定采能与消耗模型下的能量中性，而不是硬件在任何环境中都完全不耗电。

更完整的边缘计算闭环出现在 [RIS-Assisted Wireless Powered MEC: Multiple Access Design and Resource Allocation](https://doi.org/10.1109/twc.2024.3503582) 中。接入点先为终端供能，终端随后把任务卸载到边缘，可重构智能表面则调整传播环境。论文比较 NOMA、OMA 和混合接入方式，并联合优化时隙、功率、相位以及能量回收机会，以降低接入点能耗。它最有价值的地方是把账算全：下行充电、上行卸载、干扰与边缘任务无法各自独立优化。

## 学习任务同样要服从无线资源约束

[Rethinking Clustered Federated Learning in NOMA Enhanced Wireless Networks](https://doi.org/10.1109/twc.2024.3447833) 把这种资源约束带入分布式学习。本地数据非独立同分布时，单一全局模型可能难以泛化，因此论文先利用带有 Dirichlet 表示的谱聚类对客户端分组，再为不同组匹配子信道，并通过优化得到功率分配。仿真同时观察学习准确率、收敛过程和通信资源，说明“更快完成聚合”与“得到更好的模型”不能被当成同一件事。

把七项工作串起来，可以看到一条清楚的演进路径。环境反向散射复用既有电波，安全分析追问还有谁能从中获益，连续孔径、可移动辐射点和可重构表面重新组织空间资源，无线供能边缘计算闭合“充电—卸载”循环，联邦学习则把无线调度与数据异质性联系起来。NOMA 或可重构技术在这里都是手段；真正的目标，是让有限的孔径、能量、频谱、计算和信息在同一个系统中合理流动。

## 研究札记

> ### Rethinking Clustered Federated Learning in NOMA Enhanced Wireless Networks
>
> - **作者：** Yushen Lin、Kaidi Wang、Zhiguo Ding
> - **公开记录：** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2024.3447833)
> - **主要贡献：** 将面向数据分布的客户端聚类，与 NOMA 子信道匹配和功率优化结合用于联邦学习。
> - **阅读提示：** 准确率和收敛收益依赖所选数据划分、聚类表示、信道模型及对比方法。
>
> ---
>
> ### BackCom Assisted Hybrid NOMA Uplink Transmission for Ambient IoT
>
> - **作者：** Zhiguo Ding
> - **公开记录：** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2025.3577446)
> - **主要贡献：** 针对环境设备通过反向散射通信的混合上行，建立主动终端总发射功率最小化问题。
> - **阅读提示：** 全局与近似求解都建立在论文采用的信道知识、解码顺序和反向散射模型上。
>
> ---
>
> ### On the Reliability and Security of Ambient Backscatter Uplink NOMA Networks
>
> - **作者：** Athanasios P. Chrysologou、Nestor D. Chatzidiamantis、Alexandros-Apostolos A. Boulogeorgos、Zhiguo Ding
> - **公开记录：** [IEEE Transactions on Vehicular Technology](https://doi.org/10.1109/tvt.2025.3609450)
> - **主要贡献：** 在理想和非理想干扰消除下分析中断与截获概率，并研究人工噪声设计。
> - **阅读提示：** 安全结论依赖论文的信道状态、窃听者和人工噪声假设，验证方式为理论分析与仿真。
>
> ---
>
> ### Pinching-Antenna Assisted Simultaneous Wireless Information and Power Transfer
>
> - **作者：** Yixuan Li、Ji Wang、Yuanwei Liu、Zhiguo Ding
> - **公开记录：** [IEEE Communications Letters](https://doi.org/10.1109/lcomm.2025.3594663)
> - **主要贡献：** 优化波导上可移动辐射点的位置，用于同时无线信息与能量传输。
> - **阅读提示：** 结果来自解析夹持天线信道下的数值研究，定位、损耗与控制开销仍需要硬件验证。
>
> ---
>
> ### Zero-Energy RIS-Assisted Communications With Noise Modulation and Interference-Based Energy Harvesting
>
> - **作者：** Ahmad Massud Tota Khel、Aissa Ikhlef、Zhiguo Ding、Hongjian Sun
> - **公开记录：** [IEEE Transactions on Green Communications and Networking](https://doi.org/10.1109/tgcn.2025.3578423)
> - **主要贡献：** 把可重构智能表面的干扰采能与噪声调制结合，并分析能量中性通信条件。
> - **阅读提示：** “零能耗”表示给定模型内的能量平衡，不等于表面在任何环境中都没有物理功耗。
>
> ---
>
> ### RIS-Assisted Wireless Powered MEC: Multiple Access Design and Resource Allocation
>
> - **作者：** Lu Lv、Hao Luo、Long Yang、Zhiguo Ding、Arumugam Nallanathan、Naofal Al-Dhahir、Jian Chen
> - **公开记录：** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2024.3503582)
> - **主要贡献：** 比较 NOMA、OMA 与混合方案，并联合优化充电、卸载、时间、功率和表面资源。
> - **阅读提示：** 能耗降低是在特定计算、能量回收和可重构表面模型下得到的优化与仿真结果。
>
> ---
>
> ### CAPA: Continuous-Aperture Arrays for Revolutionizing 6G Wireless Communications
>
> - **作者：** Yuanwei Liu、Chongjun Ouyang、Zhaolin Wang、Jiaqi Xu、Xidong Mu、Zhiguo Ding
> - **公开记录：** [IEEE Wireless Communications](https://doi.org/10.1109/mwc.001.2400493)
> - **可确认内容：** 回顾 CAPA 原型，介绍三类硬件实现路线，构造连续电流波束成形方法，并同离散阵列进行数值比较。
> - **阅读提示：** 文章结合教程、架构与数值证据，部署成本、校准、损耗和大规模硬件控制仍待解决。
