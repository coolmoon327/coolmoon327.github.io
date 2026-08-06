---
{
  "title": "物理层安全不止一条保密速率曲线",
  "locale": "zh",
  "slug": "physical-layer-security-design-space",
  "newsId": "news-20260804-physical-layer-security-design-space",
  "translationKey": "news-20260804-physical-layer-security-design-space",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2024-01-24",
  "coverageEnd": "2025-11-28",
  "module": "fields",
  "keywords": [
    "physical-layer-security",
    "ris",
    "resource-allocation",
    "convex-optimization",
    "isac",
    "semantic-communications",
    "pinching-antennas",
    "wireless-communications",
    "noma",
    "learning-enabled-wireless"
  ],
  "authors": [
    "Jun Liu",
    "Gang Yang",
    "Yuanwei Liu",
    "Xiangyun Zhou",
    "Hongjiang Lei",
    "Sha Zhou",
    "Xinhu Chen",
    "Imran Shafique Ansari",
    "Yun Li",
    "Gaofeng Pan",
    "Mohamed-Slim Alouini",
    "Lingyun Xu",
    "Bowen Wang",
    "Huiyong Li",
    "Ziyang Cheng",
    "Kun Chen-Hu",
    "Petar Popovski",
    "Hamid Amiriara",
    "Mahtab Mirmohseni",
    "Ahmed Elzanaty",
    "Yi Ma",
    "Rahim Tafazolli",
    "Ahmet Muaz Aktas",
    "Sefa Kayraklik",
    "Sultangali Arzykulov",
    "Galymzhan Nauryzbayev",
    "Ibrahim Hokelek",
    "Ali Gorcin",
    "Guangyu Zhu",
    "Xidong Mu",
    "Li Guo",
    "Shibiao Xu",
    "Naofal Al-Dhahir",
    "Chengjun Jiang",
    "Chensi Zhang",
    "Chongwen Huang",
    "Jianhua Ge",
    "Mérouane Debbah",
    "Chau Yuen",
    "Zihan Song",
    "Yang Lu",
    "Xianhao Chen",
    "Bo Ai",
    "Zhangdui Zhong",
    "Dusit Niyato"
  ],
  "subjectIds": [
    "merouane-debbah"
  ],
  "workIds": [
    "doi-10-1109-twc-2024-3430328",
    "doi-10-1109-jiot-2024-3370161",
    "doi-10-1109-lwc-2024-3382035",
    "doi-10-1109-tcomm-2024-3427325",
    "doi-10-1109-tccn-2025-3589577",
    "doi-10-1109-tvt-2026-3709369",
    "doi-10-1109-tcomm-2025-3621084",
    "doi-10-1109-jiot-2024-3416319",
    "doi-10-1109-tvt-2024-3442167"
  ],
  "coverTone": "violet",
  "coverKicker": "物理层安全",
  "coverTitle": "先说清楚对手，再讨论安全",
  "coverPoints": [
    "近场隐蔽传输",
    "防御型智能表面",
    "人工噪声实测"
  ],
  "description": "九项工作展示传播几何、可编程表面、感知与语义目标、学习型波束成形和实测如何重塑物理层安全。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 安全问题的起点是对手究竟能看到什么

物理层安全常被压缩成一个指标：保密速率、保密容量或保密中断概率。然而，只有在对手能力、传播区域、先验信息和合法业务都被说清楚后，这些数字才有意义。这里的九项工作覆盖近场隐蔽传输、毫米波速率分拆、夹持天线波束成形、通感系统、语义通信、学习型波束成形、防御型智能表面以及软件无线电测试平台。它们共同反映出一个变化：物理层安全正在从抽象窃听信道走向嵌入具体无线系统的安全机制。

[RIS Empowered Near-Field Covert Communications](https://doi.org/10.1109/twc.2024.3430328) 研究超大规模可重构智能表面辅助下的隐蔽通信，合法发送方希望把信息送达接收方，同时避免被监测者发现。论文联合设计混合波束成形和表面反射系数，并分别使用加权 MMSE、流形优化和基于 ADMM 的方法处理子问题。数值结果把部分优势归因于近场聚焦，其中包括监测者与接收者角度相同的设置；但这一结论依赖具体几何和检测假设，不能被简化成“进入近场就天然无法检测”。

## 传播几何既能保护链路，也会带来新的攻击面

在毫米波系统中，[On Secure mmWave RSMA Systems](https://doi.org/10.1109/jiot.2024.3370161) 采用分析方法，研究两用户速率分拆多址系统中主信道与窃听信道可分辨路径的不同重合情况，推导保密中断概率并用蒙特卡洛仿真验证。它的价值在于把安全指标与毫米波稀疏路径结构联系起来，而不是把窃听信道当作可以随意替换的随机变量。

[Pinching-Antenna Systems (PASS)-Enabled Secure Wireless Communications](https://doi.org/10.1109/tcomm.2025.3621084) 通过沿介质波导调整夹持天线位置，让辐射几何也参与安全设计。在单波导场景中，逐个天线调节算法让合法信号在目标用户处相干叠加，同时在窃听者处产生相消效果；多波导设计进一步加入人工噪声，并区分波导分工和波导复用两类架构，求解过程中分别使用逐次凸近似等方法。公开结果来自单个合法用户与单个窃听者模型下的数值实验，能够说明这种机制如何工作，却不能替代更广泛攻击条件下的安全验证。

可编程表面也可能落入攻击者手中。[Defensive Reconfigurable Intelligent Surface (D-RIS) Based on Non-Reciprocal Channel Links](https://doi.org/10.1109/tcomm.2024.3427325) 描述了一种“RIS 中间人”攻击：对手借助智能表面制造质量更高的替代信道，进而窃听数据或注入虚假信息。论文提出由防御型 RIS 构造非互易链路，并配套设计信道估计、预编码和合并方法。由此，RIS 不再只是覆盖增强器件；控制权不同，它既可能成为攻击组件，也可能成为协议级防线。

同一块表面还可能同时协调多项合法任务。Mérouane Debbah 教授参与的 [Exploiting RIS in Secure Beamforming Design for NOMA-Assisted Integrated Sensing and Communication](https://doi.org/10.1109/jiot.2024.3416319) 把感知目标视为潜在窃听者，同时让雷达与 NOMA 信号沿直达和反射链路传播。论文在总发射功率、通信服务质量和感知质量约束下，联合设计基站波束成形与 RIS 相位，并以交替优化和逐次凸近似求解。公开摘要中的安全与检测优势来自给定 NOMA-ISAC 模型的仿真，不能被理解为“加入 RIS 就能自动获得安全性”。

## 感知与语义任务让目标之间出现竞争

同一波形还要承担感知任务时，安全设计就变成多业务协调。[Enhancing Physical Layer Security in Dual-Function Radar-Communication Systems with Hybrid Beamforming Architecture](https://doi.org/10.1109/lwc.2024.3382035) 在信道状态信息和目标位置都不完美的条件下，最大化合法用户最低速率，同时约束雷达信干噪比、窃听速率、硬件和功率。论文提出通感安全符号与交替波束成形算法，其结果来自数值仿真，因此主要贡献是架构与求解方法，而非硬件实证。

[A Physical Layer Security Framework for IRS-Assisted Integrated Sensing and Semantic Communication Systems](https://doi.org/10.1109/tccn.2025.3589577) 进一步加入语义通信和可能具有恶意的感知目标。人工噪声、专用感知信号、窃听编码、基站波束成形与表面相位共同服务于语义保密速率和克拉美–罗感知界两个目标。文中相对最大比传输的 5 dB 感知改进属于特定多目标仿真设置，但它清楚说明，“更安全”和“感知更准”不能各自独立优化。

## 学习型求解与硬件实测暴露不同的验证缺口

[A Deep Learning Framework for Physical-Layer Secure Beamforming](https://doi.org/10.1109/tvt.2024.3442167) 不再为每个信道反复求解优化问题，而是学习从信道向量到波束成形与人工噪声向量的映射。SecCNN 和 SecGNN 采用无监督训练，其中图模型会区分不同用户角色；评估还覆盖最优性、规模适应、推断时延、稳定性以及不同系统效用之间的迁移。这些数值实验检验了神经网络能否近似求解结构化安全设计，却没有证明模型面对信道分布变化、对抗输入或硬件偏差时仍然可靠。

[RIS-Assisted Physical Layer Security: Artificial Noise-Driven Optimization and Measurements](https://doi.org/10.1109/tvt.2026.3709369) 把 RIS 分成两部分：一部分将通信信号指向合法接收者，另一部分把人工噪声指向窃听者。论文联合优化相位和功率分配，并同时提供仿真与软件无线电测试平台结果。这种实验验证使它区别于前八项工作，不过，仅凭公开摘要仍不能断言该方案能够适配所有环境、攻击方式和 RIS 硬件。

整体来看，物理层安全始终与被保护的系统绑定：近场与夹持天线几何改变合法接收者和窃听者看到的信号，稀疏路径改变中断分析，可编程表面同时改变攻防手段，感知和语义业务又带来保密指标无法覆盖的新目标。学习型求解器能够减少在线计算，却也引入分布变化和验证方面的新假设。因此，进步不仅来自更高的一条优化曲线，也来自透明的威胁模型、信道假设，以及能够主动挑战这些假设的测量工作。

## 研究札记

> ### RIS Empowered Near-Field Covert Communications
>
> - **作者：** Jun Liu, Gang Yang, Yuanwei Liu, Xiangyun Zhou
> - **公开记录：** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2024.3430328)
> - **可确认内容：** 论文为近场隐蔽速率联合设计混合波束成形与超大规模 RIS，并与远场及多种基线进行数值比较。
> - **阅读提示：** 隐蔽性能取决于几何、信道知识、检测器和优化模型；公开摘要描述的是仿真，不是空口试验。
>
> ---
>
> ### On Secure mmWave RSMA Systems
>
> - **作者：** Hongjiang Lei, Sha Zhou, Xinhu Chen, Imran Shafique Ansari, Yun Li, Gaofeng Pan, Mohamed-Slim Alouini
> - **公开记录：** [IEEE Internet of Things Journal](https://doi.org/10.1109/jiot.2024.3370161)
> - **可确认内容：** 工作针对主信道与窃听信道可分辨路径的多种重合情况推导保密中断概率，并以蒙特卡洛仿真验证。
> - **阅读提示：** 结果对应给定的两用户毫米波 RSMA 与被动窃听设置，不覆盖所有毫米波多址系统。
>
> ---
>
> ### Enhancing Physical Layer Security in Dual-Function Radar-Communication Systems with Hybrid Beamforming Architecture
>
> - **作者：** Lingyun Xu, Bowen Wang, Huiyong Li, Ziyang Cheng
> - **公开记录：** [IEEE Wireless Communications Letters](https://doi.org/10.1109/lwc.2024.3382035)
> - **可确认内容：** 工作提出通感安全符号和交替混合波束成形设计，并考虑不完美信道与目标位置信息。
> - **阅读提示：** 其性能优势来自所提架构和约束下的数值仿真。
>
> ---
>
> ### Defensive Reconfigurable Intelligent Surface (D-RIS) Based on Non-Reciprocal Channel Links
>
> - **作者：** Kun Chen-Hu, Petar Popovski
> - **公开记录：** [IEEE Transactions on Communications](https://doi.org/10.1109/tcomm.2024.3427325)
> - **可确认内容：** 论文定义 RIS 中间人攻击，并提出基于非互易防御型 RIS 的估计、预编码和合并方法。
> - **阅读提示：** 鲁棒性通过给定攻防与信道模型下的保密速率和虚假数据检测概率进行分析。
>
> ---
>
> ### A Physical Layer Security Framework for IRS-Assisted Integrated Sensing and Semantic Communication Systems
>
> - **作者：** Hamid Amiriara, Mahtab Mirmohseni, Ahmed Elzanaty, Yi Ma, Rahim Tafazolli
> - **公开记录：** [IEEE Transactions on Cognitive Communications and Networking](https://doi.org/10.1109/tccn.2025.3589577)
> - **可确认内容：** 框架借助人工噪声、感知信号、窃听编码、波束成形和 IRS 相位，联合处理语义保密与感知精度。
> - **阅读提示：** 感知与安全的取舍以及 5 dB 对比结果均来自特定模型和基线下的仿真。
>
> ---
>
> ### RIS-Assisted Physical Layer Security: Artificial Noise-Driven Optimization and Measurements
>
> - **作者：** Ahmet Muaz Aktas, Sefa Kayraklik, Sultangali Arzykulov, Galymzhan Nauryzbayev, Ibrahim Hokelek, Ali Gorcin
> - **公开记录：** [IEEE Transactions on Vehicular Technology](https://doi.org/10.1109/tvt.2026.3709369)
> - **可确认内容：** 作者将 RIS 分别用于通信信号与人工噪声定向，优化相位和功率，并通过仿真及软件无线电平台评估。
> - **阅读提示：** 公开摘要支持“具有潜力”的实测改进，但不足以推导跨硬件、跨攻击条件的普遍部署结论。
>
> ---
>
> ### Pinching-Antenna Systems (PASS)-Enabled Secure Wireless Communications
>
> - **作者：** Guangyu Zhu, Xidong Mu, Li Guo, Shibiao Xu, Yuanwei Liu, Naofal Al-Dhahir
> - **公开记录：** [IEEE Transactions on Communications](https://doi.org/10.1109/tcomm.2025.3621084)
> - **可确认内容：** 公开摘要描述单波导场景中的位置调节，以及多波导场景中结合人工噪声的波导分工与波导复用设计。
> - **阅读提示：** 保密性能改进来自论文单用户、单窃听者信道与架构假设下的数值结果，并不构成一般性的抗攻击保证。
>
> ---
>
> ### Exploiting RIS in Secure Beamforming Design for NOMA-Assisted Integrated Sensing and Communication
>
> - **作者：** Chengjun Jiang, Chensi Zhang, Chongwen Huang, Jianhua Ge, Mérouane Debbah, Chau Yuen
> - **公开记录：** [IEEE Internet of Things Journal](https://doi.org/10.1109/jiot.2024.3416319)
> - **可确认内容：** 工作在发射功率、通信质量和感知质量约束下，为安全 NOMA-ISAC 联合设计基站波束成形与 RIS 相位，并进行数值评估。
> - **阅读提示：** 感知目标的窃听者设定、信道知识和性能收益均依赖论文模型与所选基线；公开摘要没有描述硬件实验。
>
> ---
>
> ### A Deep Learning Framework for Physical-Layer Secure Beamforming
>
> - **作者：** Zihan Song, Yang Lu, Xianhao Chen, Bo Ai, Zhangdui Zhong, Dusit Niyato
> - **公开记录：** [IEEE Transactions on Vehicular Technology](https://doi.org/10.1109/tvt.2024.3442167)
> - **可确认内容：** SecCNN 与 SecGNN 通过无监督训练学习从信道向量到波束成形和人工噪声向量的映射；数值评估覆盖最优性、可扩展性、推断时延、稳定性和跨效用迁移。
> - **阅读提示：** 现有证据为数值结果，没有验证未知信道分布、对抗操纵或射频硬件效应下的鲁棒性。
