---
{
  "title": "Yuzhi Yang 博士：从无线供能边缘调度到扩散接收机",
  "locale": "zh",
  "slug": "yuzhi-generative-receivers",
  "newsId": "news-20260803-yuzhi-generative-receivers",
  "translationKey": "news-20260803-yuzhi-generative-receivers",
  "generated": true,
  "date": "2026-08-03",
  "coverageStart": "2025-06-23",
  "coverageEnd": "2026-03-09",
  "module": "interests",
  "keywords": [
    "wireless-powered-edge",
    "wireless-optimization",
    "energy-constrained-iot",
    "generative-wireless-receivers",
    "ai-native-wireless",
    "learning-enabled-wireless"
  ],
  "authors": [
    "Xingqiu He",
    "Chaoqun You",
    "Yuzhi Yang",
    "Zihan Chen",
    "Yuhang Shen",
    "Tony Q. S. Quek",
    "Yue Gao",
    "Omar Alhussein",
    "Atefeh Arani",
    "Zhaoyang Zhang",
    "Mérouane Debbah",
    "Sen Yan",
    "Weijie Zhou",
    "Brahim Mefgouda",
    "Ridong Li"
  ],
  "subjectIds": [
    "xingqiu-he",
    "yuzhi-yang-wireless",
    "merouane-debbah"
  ],
  "workIds": [
    "arxiv-2603-07984",
    "doi-10-1109-tnse-2026-3657967",
    "arxiv-2509-01641",
    "arxiv-2510-24495"
  ],
  "focusSubjectId": "yuzhi-yang-wireless",
  "coverTone": "violet",
  "coverKicker": "合作研究",
  "coverTitle": "生成模型结合信号处理",
  "coverPoints": [
    "导频效率",
    "不均匀可靠性",
    "边缘调度"
  ],
  "description": "从能量感知边缘调度走向刻画不均匀导频可靠性的扩散接收机，并将结论限定在公开仿真证据内。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 从队列控制走向信道重构

Yuzhi Yang 博士的这组工作呈现出一条清晰的方法演进路线：先以随机优化决定能量受限设备何时计算、何时卸载，再用生成模型从稀疏且可靠性不均的观测中恢复无线信道。应用对象虽然不同，背后的选择却一致——保留通信系统已有的结构知识，而不是把全部规律都交给通用学习模型从数据中自行寻找。

这条路线对 AI 原生无线系统尤其重要。队列演化、能量收支、导频位置和信道相关性都不是无关细节，而是可以缩小决策与推断空间的先验。四项工作分别通过 Lyapunov 控制、指派结构、扩散时间嵌入和信号处理约束，把这些先验写进算法。

## 无线能量约束下的在线控制

[Energy-Efficient Online Scheduling for Wireless Powered Mobile Edge Computing Networks](https://arxiv.org/abs/2603.07984) 研究任务队列、采集能量与信道条件持续变化的设备。Lyapunov 优化把长期时延—能耗目标化为逐时隙决策；边际能效进一步支撑“先松弛、再调整”的方法，卸载选择则被转化为指派问题。

论文给出的性能保证阐明了模型内的时延与能耗关系，并通过大量仿真考察调度器。这里处理不确定性的方式不是预测未来，而是依据当前队列和能量状态即时行动，同时用 Lyapunov 框架维持对长期目标的约束。

## 把扩散模型变成结构化无线接收机

[Generative Diffusion Receivers](https://doi.org/10.1109/TNSE.2026.3657967) 由 Yuzhi Yang 博士、Mérouane Debbah 教授等共同完成，它把信道估计处理为条件生成问题，将学习到的信道先验、传统估计与“想象筛选”步骤结合。在每 64 个子载波使用 4 至 6 个导频、信噪比为 -4 至 0 dB 的仿真中，相比所选深度学习基线，论文报告的信道重构误差最高降低约一半。

[Non-Identical Diffusion Models in MIMO-OFDM Channel Generation](https://arxiv.org/abs/2509.01641) 随后处理常规扩散表述中的一个细微失配。单一全局时间索引默认所有观测元素具有相同可靠性，但不同导频与子载波提供的信息可能并不均匀。逐元素指示器和按维度构造的时间嵌入能够直接表示这种差异，论文以理论分析和 MIMO-OFDM 数值实验检验了相应设计。

## 从估计器扩展为收发机设计图谱

[Diffusion Models for Wireless Transceivers](https://arxiv.org/abs/2510.24495) 将前述思路扩展为教程与研究议程。文章说明如何利用粗略信道估计来约束扩散过程，并让既有信号处理结构筛选生成结果，随后以概念验证接收机展示这一组合。三篇扩散工作连在一起，勾勒出一条清晰脉络：从具体的导频高效估计器，到更准确地描述非均匀可靠性，再到讨论生成模型在无线收发机中可能承担的角色。

现有证据仍以数值实验为主。扩大“想象”候选集合也会增加计算量，因此减少导频并不必然降低接收机的端到端成本或时延。要把这一路线视为得到广泛验证的接收机架构，仍需补充射频平台测量、统一基准、分布偏移下的稳健性以及面向硬件的复杂度研究。

## 研究札记

> ### Energy-Efficient Online Scheduling for Wireless Powered Mobile Edge Computing Networks
>
> **作者：** Xingqiu He, Chaoqun You, Yuzhi Yang, Zihan Chen, Yuhang Shen, Tony Q. S. Quek, Yue Gao
>
> **状态：** 预印本
>
> **主要来源：** [arXiv:2603.07984](https://arxiv.org/abs/2603.07984)
>
> **证据说明：** 论文给出时延与能耗的分析保证，并以大量仿真验证；尚未报告真实部署的无线供能或边缘计算平台，因此结论仍受所建模的队列、信道和工作负载约束。
>
> ### Generative Diffusion Receivers: Achieving Pilot-Efficient MIMO-OFDM Communications
>
> **作者：** Yuzhi Yang, Omar Alhussein, Atefeh Arani, Zhaoyang Zhang, Mérouane Debbah
>
> **状态：** 已发表论文
>
> **主要来源：** [IEEE DOI 记录](https://doi.org/10.1109/TNSE.2026.3657967)
>
> **证据说明：** 仿真在每 64 个子载波使用 4 至 6 个导频、信噪比为 -4 至 0 dB，并报告相较所选深度学习基线，重构误差最高降至约一半；更大的候选集合会增加计算量，且尚无射频平台部署结果。
>
> ### Non-Identical Diffusion Models in MIMO-OFDM Channel Generation
>
> **作者：** Yuzhi Yang, Omar Alhussein, Mérouane Debbah
>
> **状态：** 预印本
>
> **主要来源：** [arXiv:2509.01641](https://arxiv.org/abs/2509.01641)
>
> **证据说明：** 论证来自理论分析和 MIMO-OFDM 数值实验，公开记录尚未包含射频平台测量。
>
> ### Diffusion Models for Wireless Transceivers: From Pilot-Efficient Channel Estimation to AI-Native 6G Receivers
>
> **作者：** Yuzhi Yang, Sen Yan, Weijie Zhou, Brahim Mefgouda, Ridong Li, Zhaoyang Zhang, Mérouane Debbah
>
> **状态：** 预印本
>
> **主要来源：** [arXiv:2510.24495](https://arxiv.org/abs/2510.24495)
>
> **证据说明：** 这是一篇带有概念验证接收机的教程与设计议程，尚不是经过统一标准或广泛基准验证的 AI 原生接收机架构。
