---
{
  "title": "真实无线模型中的凸优化究竟做了什么",
  "locale": "zh",
  "slug": "convex-optimization-realistic-wireless",
  "newsId": "news-20260804-convex-optimization-realistic-wireless",
  "translationKey": "news-20260804-convex-optimization-realistic-wireless",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2024-02-16",
  "coverageEnd": "2025-08-28",
  "module": "fields",
  "keywords": [
    "convex-optimization",
    "learning-enabled-wireless",
    "ris",
    "resource-allocation",
    "wireless-power-transfer",
    "isac"
  ],
  "authors": [
    "Fenghao Zhu",
    "Xinquan Wang",
    "Chongwen Huang",
    "Zhaohui Yang",
    "Xiaoming Chen",
    "Ahmed Al Hammadi",
    "Zhaoyang Zhang",
    "Chau Yuen",
    "Mérouane Debbah",
    "Wentao Zhou",
    "Di Zhang",
    "Inkyu Lee",
    "M. W. Shabir",
    "M. Di Renzo",
    "A. Zappone",
    "Amirhossein Azarbahram",
    "Onel L. A. López",
    "Bruno Clerckx",
    "Marco Di Renzo",
    "Matti Latva-Aho",
    "Chaoying Huang",
    "Wen Chen",
    "Qingqing Wu",
    "Xusheng Zhu",
    "Zhendong Li",
    "Ying Wang",
    "Jinhong Yuan",
    "Yannan Chen",
    "Yi Feng",
    "Xiaoyang Li",
    "Licheng Zhao",
    "Kaiming Shen"
  ],
  "subjectIds": [
    "merouane-debbah"
  ],
  "workIds": [
    "doi-10-1109-twc-2024-3435023",
    "doi-10-1109-twc-2024-3363766",
    "doi-10-1109-lwc-2025-3529778",
    "doi-10-1109-twc-2025-3645104",
    "doi-10-1109-tcomm-2025-3649710",
    "doi-10-1109-twc-2025-3556301"
  ],
  "coverTone": "amber",
  "coverKicker": "凸优化",
  "coverTitle": "非凸模型中依然存在可利用的结构",
  "coverPoints": [
    "鲁棒预编码",
    "物理一致 RIS",
    "近场能量传输"
  ],
  "description": "六项工作展示凸子问题、分式规划、逐次近似、流形方法与物理模型如何在实际无线优化中协同工作。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 凸优化很少单独出现，这恰恰是它的价值

真实无线设计通常是非凸的：单位模约束的表面系数、相互耦合的波束成形、非线性整流器、不确定信道和近场传播，都很难由一个闭式解包办。凸优化仍然处在核心位置，是因为困难问题内部往往保留着可利用的结构。这里的六项工作没有共享同一套求解器，而是把凸子问题和逐次近似与分式规划、加权 MMSE、流形几何、元学习、电磁约束和交替优化组合起来。凸方法真正擅长的，是把复杂设计中的一部分变成可处理、可检查假设的步骤。

Mérouane Debbah 教授参与的 [Robust Beamforming for RIS-aided Communications: Gradient-based Manifold Meta Learning](https://doi.org/10.1109/twc.2024.3435023) 从基站预编码与 RIS 相位耦合问题出发。它没有把信道状态信息直接送入预训练网络，而是把预编码矩阵和相位矩阵的梯度交给神经网络，并通过微分调节器约束 RIS 相位。公开摘要给出了相对所选传统方法的收敛速度和频谱效率数值改进。这不是一项孤立的凸优化工作，更准确地说，它把学习机制包在流形约束优化周围，而没有抹去原问题的几何结构。

## 鲁棒设计要先把“未知”写进模型

反馈受限带来了另一类结构。Mérouane Debbah 教授参与的 [Robust Precoding Designs for Multiuser MIMO Systems with Limited Feedback](https://doi.org/10.1109/twc.2024.3363766) 关注信道量化误差造成的多用户速率下降。作者近似量化信道状态信息的二阶统计量，进而构造非迭代鲁棒 MMSE 与迭代鲁棒 WMMSE 预编码。公开摘要中的改进来自仿真。关键不在于 WMMSE 能解决所有不确定性，而在于一项可用的统计近似，能够把“缺少精确信道”转化为明确的鲁棒目标。

## 物理一致性会直接改变可行域

RIS 并不只是彼此独立的一组相位旋钮。Mérouane Debbah 教授参与的 [Electromagnetically Consistent Optimization Algorithms for the Global Design of RIS](https://doi.org/10.1109/lwc.2025.3529778) 把表面建模为非均匀阻抗边界，并将多个非凸问题重新表述为一系列线性二次约束程序或半定程序。公开摘要说明这些近似具有多项式复杂度，目标值单调收敛。这里的保证针对特定近似序列和电磁模型，并不意味着原始非凸问题已经被普遍转化为凸问题。

[Beamforming and Waveform Optimization for RF Wireless Power Transfer with Beyond Diagonal Reconfigurable Intelligent Surfaces](https://doi.org/10.1109/twc.2025.3645104) 延续了这种克制。论文联合设计波束成形、多载波波形、非线性整流器和超对角 RIS，并使用半定规划与逐次凸近似。仿真显示，在非视距分量较强时，超对角结构能够优于对角 RIS；而在不考虑互耦的纯远场视距条件下，两者性能相同。更丰富的硬件模型不仅说明额外自由度何时有用，也明确展示它何时没有收益。

## 传播区域不同，问题的难点也会改变

[Dual-IRS Aided Near-/Hybrid-Field SWIPT: Passive Beamforming and Independent Antenna Power Splitting Design](https://doi.org/10.1109/tcomm.2025.3649710) 分别建立近场与混合场双 IRS 同时无线信息与能量传输模型。近场问题借助交替优化、拉格朗日对偶和差分凸规划处理；混合场模型中则出现一种信道增益不随相位变化的性质，使问题能够转换成凸形式，并进一步做闭式渐近分析。这个对比很有启发性：可解性不只取决于算法，也可能来自传播条件的建模方式和变量耦合关系。

[Fast Fractional Programming for Multi-Cell Integrated Sensing and Communications](https://doi.org/10.1109/twc.2025.3556301) 处理的是另一类成本：多小区大规模阵列下的通感一体化波束成形。针对通信数据率与感知 Fisher 信息加权目标，常用的 WMMSE 更新可以用分式规划重新解释；但在天线规模很大时，反复求解高维矩阵逆会迅速变得昂贵。作者利用非齐次界避开这类大矩阵求逆，并根据算法与投影梯度的联系引入 Nesterov 加速。这为降低迭代计算量提供了清楚的算法路径，能否在真实大规模阵列上实时运行仍是另一项工程问题。

综合这六项工作来看，凸优化既不是装饰性的标签，也不自动承诺全局最优。它保留下来的，是复杂系统中仍可验证的一部分结构，而其他部分可能需要近似、学习或交替更新。阅读这类结果时，最重要的三个问题是：哪一个子问题真正凸，近似如何把它与原问题连接起来，以及物理假设能否延续到预期部署环境。

## 研究札记

> ### Robust Beamforming for RIS-aided Communications: Gradient-based Manifold Meta Learning
>
> - **作者：** Fenghao Zhu, Xinquan Wang, Chongwen Huang, Zhaohui Yang, Xiaoming Chen, Ahmed Al Hammadi, Zhaoyang Zhang, Chau Yuen, Mérouane Debbah
> - **公开记录：** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2024.3435023)
> - **可确认内容：** 由梯度驱动的神经模块与流形约束共同更新基站预编码和 RIS 相位，无需预训练。
> - **阅读提示：** 7.31% 的频谱效率改进和 23 倍收敛加速来自作者选定动态场景中的数值比较。
>
> ---
>
> ### Robust Precoding Designs for Multiuser MIMO Systems with Limited Feedback
>
> - **作者：** Wentao Zhou, Di Zhang, Mérouane Debbah, Inkyu Lee
> - **公开记录：** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2024.3363766)
> - **可确认内容：** 对量化信道二阶统计量的近似支撑了鲁棒 MMSE 与 WMMSE 预编码设计。
> - **阅读提示：** 速率改进来自仿真，并依赖反馈受限与量化误差模型。
>
> ---
>
> ### Electromagnetically Consistent Optimization Algorithms for the Global Design of RIS
>
> - **作者：** M. W. Shabir, Marco Di Renzo, A. Zappone, Mérouane Debbah
> - **公开记录：** [IEEE Wireless Communications Letters](https://doi.org/10.1109/lwc.2025.3529778)
> - **可确认内容：** 表面阻抗设计被近似为一系列线性二次约束程序或半定程序，并给出多项式复杂度与目标值单调收敛性质。
> - **阅读提示：** 保证针对电磁模型下的近似方法，并不等于任意 RIS 硬件的无约束全局最优。
>
> ---
>
> ### Beamforming and Waveform Optimization for RF Wireless Power Transfer with Beyond Diagonal Reconfigurable Intelligent Surfaces
>
> - **作者：** Amirhossein Azarbahram, Onel L. A. López, Bruno Clerckx, Marco Di Renzo, Matti Latva-Aho
> - **公开记录：** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2025.3645104)
> - **可确认内容：** 半定规划和逐次凸近似用于联合设计非线性整流器与超对角 RIS 下的波束和多载波波形。
> - **阅读提示：** 相对对角 RIS 的收益随视距条件和互耦模型变化，验证来自数值实验。
>
> ---
>
> ### Dual-IRS Aided Near-/Hybrid-Field SWIPT: Passive Beamforming and Independent Antenna Power Splitting Design
>
> - **作者：** Chaoying Huang, Wen Chen, Qingqing Wu, Xusheng Zhu, Zhendong Li, Ying Wang, Jinhong Yuan
> - **公开记录：** [IEEE Transactions on Communications](https://doi.org/10.1109/tcomm.2025.3649710)
> - **可确认内容：** 近场与混合场 SWIPT 采用不同求解方法；混合场模型中的信道增益不变性允许凸转换。
> - **阅读提示：** 相对所选方案的性能增益来自给定双 IRS 与独立功率分流模型的数值评估。

> ---
>
> ### Fast Fractional Programming for Multi-Cell Integrated Sensing and Communications
>
> - **作者：** Yannan Chen, Yi Feng, Xiaoyang Li, Licheng Zhao, Kaiming Shen
> - **公开记录：** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2025.3556301)
> - **可确认内容：** 工作利用非齐次界与分式规划，在多小区大规模阵列通感波束成形中避开反复求解大矩阵逆，并依据投影梯度联系进行加速。
> - **阅读提示：** 公开摘要能够确认问题表述和算法关系，但没有给出硬件实现或端到端实时部署基准。
