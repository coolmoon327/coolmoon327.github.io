---
{
  "title": "Mérouane Debbah 教授：让学习跨越电波、网络与接收机物理",
  "locale": "zh",
  "slug": "merouane-learning-wave-receiver",
  "newsId": "news-20260804-merouane-learning-wave-receiver",
  "translationKey": "news-20260804-merouane-learning-wave-receiver",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2024-01-26",
  "coverageEnd": "2025-03-26",
  "module": "interests",
  "keywords": [
    "isac",
    "wireless-communications",
    "learning-enabled-wireless",
    "semantic-communications",
    "edge-and-fog-systems",
    "reinforcement-learning",
    "resource-allocation",
    "convex-optimization",
    "ris",
    "adversarial-wireless-learning",
    "resilient-wireless",
    "secure-6g",
    "movable-antennas",
    "noma",
    "physical-layer-security"
  ],
  "authors": [
    "Tierui Gong",
    "Aveek Chandra",
    "Chau Yuen",
    "Yong Liang Guan",
    "Rainer Dumke",
    "Chong Meng Samson See",
    "Mérouane Debbah",
    "Lajos Hanzo",
    "Bingyan Xie",
    "Yongpeng Wu",
    "Yuxuan Shi",
    "Wenjun Zhang",
    "Shuguang Cui",
    "Mintae Kim",
    "Hoon Lee",
    "Sangwon Hwang",
    "Inkyu Lee",
    "Fenghao Zhu",
    "Xinquan Wang",
    "Chongwen Huang",
    "Zhaohui Yang",
    "Xiaoming Chen",
    "Ahmed Al Hammadi",
    "Zhaoyang Zhang",
    "Bui Duc Son",
    "Nguyen Tien Hoa",
    "Trinh Van Chien",
    "Waqas Khalid",
    "Mohamed Amine Ferrag",
    "Wan Choi",
    "Xu Gan",
    "Jiguang He",
    "Songjie Yang",
    "Jiancheng An",
    "Yue Xiu",
    "Wanting Lyu",
    "Boyu Ning",
    "Zhongpei Zhang",
    "Wentao Zhou",
    "Di Zhang",
    "M. W. Shabir",
    "M. Di Renzo",
    "A. Zappone",
    "Wanting Yang",
    "Zehui Xiong",
    "Song Guo",
    "Shiwen Mao",
    "Dong In Kim",
    "Yuzhi Yang",
    "Zirui Chen",
    "Lei Liu",
    "Chengjun Jiang",
    "Chensi Zhang",
    "Jianhua Ge"
  ],
  "subjectIds": [
    "merouane-debbah",
    "yuzhi-yang-wireless"
  ],
  "workIds": [
    "doi-10-1109-mwc-015-2400381",
    "doi-10-1109-twc-2024-3409735",
    "doi-10-1109-jiot-2024-3447090",
    "doi-10-1109-twc-2024-3435023",
    "doi-10-1109-jiot-2024-3373808",
    "doi-10-1109-jsac-2024-3413989",
    "doi-10-1109-twc-2025-3545305",
    "doi-10-1109-twc-2024-3363766",
    "doi-10-1109-lwc-2025-3529778",
    "doi-10-1109-tmc-2025-3560582",
    "doi-10-1109-twc-2025-3552818",
    "doi-10-1109-jiot-2024-3416319"
  ],
  "focusSubjectId": "merouane-debbah",
  "coverTone": "mint",
  "coverKicker": "MÉROUANE DEBBAH",
  "coverTitle": "把接收机、传播环境和任务一起设计",
  "coverPoints": [
    "原子传感",
    "波域学习",
    "可信网络智能"
  ],
  "description": "十二项 2024 至 2025 年公开工作贯通新型接收机物理、形态可调阵列、安全传播设计、混合式 AI 推断、边缘控制与网络基础。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 无线智能正在跨越多层物理边界

为 Mérouane Debbah 教授选出的这组工作从 2024 年延伸至 2025 年，覆盖了一条相当完整的技术链：接收机如何感知电磁场，天线形态与可控环境如何共同塑造传播，神经网络怎样与已有信号模型分工，多个智能体如何协调边缘资源，以及在部署这些机制之前应如何分析大规模网络。这样的跨度并非简单堆叠热点。随着无线硬件逐渐可编程、学习方法进入协议栈，接收机物理、传播、计算与应用效用已经很难继续分开优化。

[Rydberg Atomic Quantum Receivers for Classical Wireless Communication and Sensing](https://doi.org/10.1109/mwc.015.2400381) 从物理前端出发，介绍如何利用电磁诱导透明和 Autler–Townes 分裂，把里德堡原子感受到的射频场转化为光学读出。文章梳理调制与测量方法、早期实验以及同经典 SISO、MIMO 系统结合的可能路径。它是一篇教程和研究路线梳理，并没有证明原子接收机已经能够直接替代商用射频前端；真正重要的是，连“感知无线信号的物理机制”也开始成为可重新选择的设计变量。

[Flexible Antenna Arrays for Wireless Communications: Modeling and Performance Evaluation](https://doi.org/10.1109/twc.2025.3545305) 则把阵列几何也变成可调变量。论文建模旋转、弯曲和折叠对阵元位置与朝向的影响，并在多种配置下评估形态感知预编码。文中的数值增益依赖天线方向图、扇区划分和传播条件，不能直接迁移到任意阵列。更值得注意的是其设计方式：机械形态与信号处理不再是先后衔接的两道工序，而是同一个通信问题中的耦合自由度。

## 让传播与信息表示共同适应环境

[Robust Beamforming for RIS-aided Communications: Gradient-based Manifold Meta Learning](https://doi.org/10.1109/twc.2024.3435023) 把控制能力移入信道。可重构智能表面的相位位于受约束的几何空间，而信道状态不准确又会让只针对单一条件优化的方案变得脆弱。论文将基于梯度的元学习与流形优化结合，使波束成形能够在不同信道条件间快速适应，同时不破坏表面相位约束。数值结果支持其在所测不确定性模型中的效果，但空口校准、表面控制和硬件误差仍是另外一组工程问题。

[Exploiting RIS in Secure Beamforming Design for NOMA-Assisted Integrated Sensing and Communication](https://doi.org/10.1109/jiot.2024.3416319) 进一步追问：如果感知目标同时可能窃听，传播控制应该怎样改变？论文在发射功率、通信服务质量和感知质量约束下交替更新基站波束与 RIS 相位，并在内部使用逐次凸近似和二阶锥结构。仿真支持所建模型中安全通信与目标检测目标的同步改善，但不能据此推导超出目标/窃听者、CSI、NOMA 和 RIS 假设的安全保证。更持久的意义，是把通信、感知和保密放进同一个传播控制问题。

另两项工作把这种控制背后的数学结构说得更清楚。[Robust Precoding Designs for Multiuser MIMO Systems With Limited Feedback](https://doi.org/10.1109/twc.2024.3363766) 近似量化信道的二阶统计量，据此构造鲁棒 MMSE 与 WMMSE 预编码；[Electromagnetically Consistent Optimization Algorithms for the Global Design of RIS](https://doi.org/10.1109/lwc.2025.3529778) 则从非均匀阻抗边界出发，把难解设计转化为一系列可处理的约束程序。两者都没有回避边界：前者的增益来自反馈受限模型下的仿真，后者所述单调收敛属于特定近似序列，并不等于任意 RIS 硬件上的无条件全局最优。

[Robust Image Semantic Coding with Learnable CSI Fusion Masking over MIMO Fading Channels](https://doi.org/10.1109/twc.2024.3409735) 则让待传输的信息表示随信道一起变化。系统不再对源数据中的每一位提供同等保护，而是学习图像的语义表示，并通过可学习掩码融合信道状态信息，使编解码器能够响应 MIMO 衰落，同时尽量保留有用视觉内容。实验验证的是给定数据集与信道条件下的鲁棒性，并非任何图像和任何链路上的普遍语义保真。不过，把它与 RIS 波束成形并列来看很有意思：一项工作学习如何塑造传播，另一项工作学习什么内容最值得穿过传播环境。

[A Hybrid Inference Architecture Incorporating Neural Network With Belief Propagation for AI Receivers](https://doi.org/10.1109/twc.2025.3552818) 保留的则是另一类结构。论文把神经功能单元嵌入置信传播，用学习模块刻画难以准确建模的关系，同时让概率图继续承担已知的推断逻辑。公开材料支持这一半盲 OFDM 接收架构及其数值评估；训练分布变化、实现复杂度和硬件效率仍需另行回答。重点并不是用神经网络替换整个接收机，而是把学习放到模型最薄弱的位置。

## 协同决策之外，还要正视学习系统怎样失效

在网络层，[Cooperative Multi-Agent Deep Reinforcement Learning Methods for UAV-aided Mobile Edge Computing Networks](https://doi.org/10.1109/jiot.2024.3447090) 面对的是多个移动智能体之间相互牵连的轨迹、卸载与资源决策。论文用协同多智能体深度强化学习处理耦合的状态和动作空间。这类问题中，集中优化可能迅速变得复杂，而完全独立的智能体又容易彼此冲突。仿真说明所提方法能够在设定的移动和工作负载模型中完成协调；真实部署还需进一步面对通信时延、安全约束和数据分布变化。

[Efficient Multi-User Offloading of Personalized Diffusion Models: A DRL-Convex Hybrid Solution](https://doi.org/10.1109/tmc.2025.3560582) 把同样的“选择性使用学习”原则带到边缘生成式推断。个性化扩散模型被拆成可批处理的共享阶段和面向用户的专属阶段；由此产生的广义二次指派问题又被分解为决策序列，让深度强化学习处理自适应的组合选择，让凸优化负责可解析利用的部分。时延、精度和复杂度结论依赖论文设定的用户、资源和推断过程；更普遍的启发是，即使一部分决策存在不确定性，也没有必要让模型重新学习已经清楚的数学结构。

学习本身也会引入新的攻击面。[Adversarial Attacks and Defenses in 6G Network-Assisted IoT Systems](https://doi.org/10.1109/jiot.2024.3373808) 系统梳理面向网络辅助物联网中机器学习组件的对抗攻击与防御，并用仿真案例补充说明。文章的价值在于，它没有把干净数据上的高准确率等同于可信的网络控制；逃逸、投毒和模型弱点需要与传统无线及协议威胁一同评估。论文给出的分类体系和实验可用于组织测试，但无法替任何单一防御方法作出面对自适应攻击者的普遍保证。

## 网络层基本规律仍是必要基线

[Coverage and Rate Analysis for Integrated Sensing and Communication Networks](https://doi.org/10.1109/jsac.2024.3413989) 为通感一体化提供系统层基础。论文利用随机几何，在感知与通信共享空间基础设施和无线资源时，刻画覆盖与速率行为。这类分析会主动抽象部分实现细节，以便看清整个网络的尺度规律和资源权衡，因此它与学习方法并不冲突，反而是重要参照：在把收益归功于自适应控制器之前，必须先理解网络几何、干扰和共享资源本身会产生什么结果。

合在一起看，这些工作给出了一种更克制的无线智能设计方式。新的接收机物理扩大可观测范围，柔性阵列与可重构表面扩大可控制范围，鲁棒与安全优化明确控制成立所依赖的假设，语义编码器与混合接收机则判断学习究竟在哪些位置能补足信息。多智能体和边缘学习处理相互耦合的决策，对抗研究检验这些策略是否可信，随机几何提供衡量改进所需的网络基线。最终得到的不是一个包办所有功能的“AI 原生无线电”，而是一组放置在物理、学习、优化、安全与通信理论交界处的清晰接口。

## 研究札记

> ### Rydberg Atomic Quantum Receivers for Classical Wireless Communication and Sensing
>
> - **作者：** Tierui Gong、Aveek Chandra、Chau Yuen、Yong Liang Guan、Rainer Dumke、Chong Meng Samson See、Mérouane Debbah、Lajos Hanzo
> - **公开记录：** [IEEE Wireless Communications](https://doi.org/10.1109/mwc.015.2400381)
> - **主要贡献：** 综述里德堡原子射频传感机理、读出与调制方法、已有实验以及同经典 SISO/MIMO 系统结合的方式。
> - **阅读提示：** 这是教程和研究路线梳理，并非一套与商用硬件进行端到端对比的原子接收机。
>
> ---
>
> ### Robust Image Semantic Coding with Learnable CSI Fusion Masking over MIMO Fading Channels
>
> - **作者：** Bingyan Xie、Yongpeng Wu、Yuxuan Shi、Wenjun Zhang、Shuguang Cui、Mérouane Debbah
> - **公开记录：** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2024.3409735)
> - **主要贡献：** 学习型图像编解码器通过掩码融合信道状态信息，并在 MIMO 衰落信道中进行评估。
> - **阅读提示：** 重建质量与鲁棒性取决于所测数据集、信道、CSI 精度和学习架构。
>
> ---
>
> ### Cooperative Multi-Agent Deep Reinforcement Learning Methods for UAV-aided Mobile Edge Computing Networks
>
> - **作者：** Mintae Kim、Hoon Lee、Sangwon Hwang、Mérouane Debbah、Inkyu Lee
> - **公开记录：** [IEEE Internet of Things Journal](https://doi.org/10.1109/jiot.2024.3447090)
> - **主要贡献：** 用协同多智能体深度强化学习处理彼此耦合的无人机轨迹、任务卸载和边缘资源决策。
> - **阅读提示：** 收益来自论文移动、观测、无线和计算假设下的仿真。
>
> ---
>
> ### Robust Beamforming for RIS-aided Communications: Gradient-based Manifold Meta Learning
>
> - **作者：** Fenghao Zhu、Xinquan Wang、Chongwen Huang、Zhaohui Yang、Xiaoming Chen、Ahmed Al Hammadi、Zhaoyang Zhang、Chau Yuen、Mérouane Debbah
> - **公开记录：** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2024.3435023)
> - **主要贡献：** 将基于梯度的元学习与流形约束优化结合，用于信道不确定条件下的鲁棒 RIS 波束成形。
> - **阅读提示：** 适应性结果来自数值实验，表面控制、信道获取和硬件失配仍需另行验证。
>
> ---
>
> ### Adversarial Attacks and Defenses in 6G Network-Assisted IoT Systems
>
> - **作者：** Bui Duc Son、Nguyen Tien Hoa、Trinh Van Chien、Waqas Khalid、Mohamed Amine Ferrag、Wan Choi、Mérouane Debbah
> - **公开记录：** [IEEE Internet of Things Journal](https://doi.org/10.1109/jiot.2024.3373808)
> - **主要贡献：** 综述网络辅助物联网中的对抗机器学习威胁与防御，并补充仿真案例。
> - **阅读提示：** 分类体系和部分实验不能保证任一防御在所有自适应攻击者或部署漂移下都保持鲁棒。
>
> ---
>
> ### Coverage and Rate Analysis for Integrated Sensing and Communication Networks
>
> - **作者：** Xu Gan、Chongwen Huang、Zhaohui Yang、Xiaoming Chen、Jiguang He、Zhaoyang Zhang、Chau Yuen、Yong Liang Guan、Mérouane Debbah
> - **公开记录：** [IEEE Journal on Selected Areas in Communications](https://doi.org/10.1109/jsac.2024.3413989)
> - **主要贡献：** 利用随机几何刻画感知与通信共享基础设施和资源时的网络覆盖与速率。
> - **阅读提示：** 结论来自论文设定的空间分布、传播、关联和干扰假设，而非具体现场部署。
>
> ---
>
> ### Flexible Antenna Arrays for Wireless Communications: Modeling and Performance Evaluation
>
> - **作者：** Songjie Yang、Jiancheng An、Yue Xiu、Wanting Lyu、Boyu Ning、Zhongpei Zhang、Mérouane Debbah、Chau Yuen
> - **公开记录：** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2025.3545305)
> - **主要贡献：** 建模旋转、弯曲与折叠阵列，并在多种方向图和扇区配置下评估形态感知预编码。
> - **阅读提示：** 速率增益来自作者设置的数值场景，不应被理解为与几何和传播环境无关的固定提升。
>
> ---
>
> ### Robust Precoding Designs for Multiuser MIMO Systems With Limited Feedback
>
> - **作者：** Wentao Zhou、Di Zhang、Mérouane Debbah、Inkyu Lee
> - **公开记录：** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2024.3363766)
> - **主要贡献：** 对量化信道二阶统计量进行近似，并据此设计鲁棒 MMSE 与 WMMSE 预编码。
> - **阅读提示：** 速率比较来自仿真，并依赖反馈受限与量化误差模型。
>
> ---
>
> ### Electromagnetically Consistent Optimization Algorithms for the Global Design of RIS
>
> - **作者：** M. W. Shabir、M. Di Renzo、A. Zappone、Mérouane Debbah
> - **公开记录：** [IEEE Wireless Communications Letters](https://doi.org/10.1109/lwc.2025.3529778)
> - **主要贡献：** 将表面阻抗设计近似为一系列约束程序，并给出多项式复杂度与目标值单调收敛性质。
> - **阅读提示：** 这些性质属于特定电磁模型下的近似方法，并非任意 RIS 硬件的无约束全局最优。
>
> ---
>
> ### Efficient Multi-User Offloading of Personalized Diffusion Models: A DRL-Convex Hybrid Solution
>
> - **作者：** Wanting Yang、Zehui Xiong、Song Guo、Shiwen Mao、Dong In Kim、Mérouane Debbah
> - **公开记录：** [IEEE Transactions on Mobile Computing](https://doi.org/10.1109/tmc.2025.3560582)
> - **主要贡献：** 拆分个性化扩散模型推断，并让深度强化学习与凸优化分别处理卸载决策中的不同部分。
> - **阅读提示：** 时延—精度收益与复杂度比较依赖所建模的资源、用户和推断过程。
>
> ---
>
> ### A Hybrid Inference Architecture Incorporating Neural Network With Belief Propagation for AI Receivers
>
> - **作者：** Yuzhi Yang、Zhaoyang Zhang、Zirui Chen、Zhaohui Yang、Lei Liu、Chongwen Huang、Mérouane Debbah
> - **公开记录：** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2025.3552818)
> - **主要贡献：** 把神经功能单元嵌入置信传播，构成面向半盲 OFDM 接收的混合推断架构。
> - **阅读提示：** 数值接收结果尚不足以回答训练鲁棒性、实现复杂度和硬件效率问题。
>
> ---
>
> ### Exploiting RIS in Secure Beamforming Design for NOMA-Assisted Integrated Sensing and Communication
>
> - **作者：** Chengjun Jiang、Chensi Zhang、Chongwen Huang、Jianhua Ge、Mérouane Debbah、Chau Yuen
> - **公开记录：** [IEEE Internet of Things Journal](https://doi.org/10.1109/jiot.2024.3416319)
> - **可确认内容：** 以交替优化联合逐次凸近似和二阶锥结构，在通信、感知和功率约束下协调基站波束与 RIS 相位。
> - **阅读提示：** 安全通信与目标检测收益来自所建目标/窃听者、CSI、NOMA 与 RIS 条件下的仿真。
