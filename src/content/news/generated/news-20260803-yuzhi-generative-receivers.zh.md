---
{
  "title": "Yuzhi Yang：从无线供能边缘调度到扩散接收机",
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
## 观察视角

从合作者研究脉络来看，这组工作把经典随机优化与后续生成式接收机方向连接起来，呈现出从队列控制走向物理层结构化不确定性建模的变化。

## Energy-Efficient Online Scheduling for Wireless Powered Mobile Edge Computing Networks

**作者：** Xingqiu He, Chaoqun You, Yuzhi Yang, Zihan Chen, Yuhang Shen, Tony Q. S. Quek, Yue Gao

**状态：** 预印本

**Yuzhi Yang 视角。** [查看主要公开记录](https://arxiv.org/abs/2603.07984)。该预印本利用 Lyapunov 优化把随机的无线供能移动边缘调度问题转化为逐时隙决策。边际能效概念支撑“先松弛、再调整”的方法，卸载子问题则转化为指派问题；作者还给出时延与能耗之间的性能保证。

**证据边界。** 实践证据来自大量仿真，而不是已部署的无线供能边缘系统，因此稳健性受队列、信道和工作负载模型约束。

## Generative Diffusion Receivers: Achieving Pilot-Efficient MIMO-OFDM Communications

**作者：** Yuzhi Yang, Omar Alhussein, Atefeh Arani, Zhaoyang Zhang, Mérouane Debbah

**Yuzhi Yang 视角。** [查看主要公开记录](https://doi.org/10.1109/TNSE.2026.3657967)。该接收机把 MIMO-OFDM 信道估计建模为扩散过程，将信道先验、传统估计和“想象筛选”步骤结合起来。在每 64 个子载波使用 4 至 6 个导频、信噪比为 -4 至 0 dB 的仿真中，相对所选深度学习基线报告了最高约两倍的信道重构误差降低。

**证据边界。** 证据来自仿真，且更大的想象集合会增加计算量，因此导频效率并不等同于部署效率。

## Non-Identical Diffusion Models in MIMO-OFDM Channel Generation

**作者：** Yuzhi Yang, Omar Alhussein, Mérouane Debbah

**状态：** 预印本

**Yuzhi Yang 视角。** [查看主要公开记录](https://arxiv.org/abs/2509.01641)。该工作用逐元素时间指示器替代单一的全局扩散时间索引，以表示导频和子载波之间不均匀的可靠性。论文提出按维度的时间嵌入，并通过理论核查和 MIMO-OFDM 数值实验比较多种训练与生成方法。

**证据边界。** 公开记录是一篇修订预印本，效果来自数值实验而非射频平台实测。

## Diffusion Models for Wireless Transceivers: From Pilot-Efficient Channel Estimation to AI-Native 6G Receivers

**作者：** Yuzhi Yang, Sen Yan, Weijie Zhou, Brahim Mefgouda, Ridong Li, Zhaoyang Zhang, Mérouane Debbah

**状态：** 预印本

**Yuzhi Yang 视角。** [查看主要公开记录](https://arxiv.org/abs/2510.24495)。这篇教程型预印本解释扩散模型如何把粗略信道估计与信号处理结构结合起来，并给出一个接收机概念验证案例。其主要价值是梳理收发机设计路径和研究议程，而不是提供大规模实验基准。

**证据边界。** 公开证据只是概念验证，不能将其视为已经标准化或广泛验证的 AI 原生接收机架构。
