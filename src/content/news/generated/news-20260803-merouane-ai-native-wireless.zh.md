---
{
  "title": "Mérouane Debbah：从接收机到推理的 AI 原生无线证据",
  "locale": "zh",
  "slug": "merouane-ai-native-wireless",
  "newsId": "news-20260803-merouane-ai-native-wireless",
  "translationKey": "news-20260803-merouane-ai-native-wireless",
  "generated": true,
  "date": "2026-08-03",
  "coverageStart": "2025-02-28",
  "coverageEnd": "2026-03-02",
  "module": "interests",
  "keywords": [
    "physical-layer-security",
    "learning-enabled-wireless",
    "resilient-wireless",
    "wireless-optimization",
    "secure-6g",
    "generative-wireless-receivers",
    "ai-native-wireless",
    "semantic-communications",
    "edge-and-fog-systems"
  ],
  "authors": [
    "Li Yang",
    "Shimaa Naser",
    "Abdallah Shami",
    "Sami Muhaidat",
    "Lyndon Ong",
    "Mérouane Debbah",
    "Yuzhi Yang",
    "Omar Alhussein",
    "Atefeh Arani",
    "Zhaoyang Zhang",
    "Sen Yan",
    "Weijie Zhou",
    "Brahim Mefgouda",
    "Ridong Li",
    "Mohamed Amine Ferrag",
    "Abderrahmane Lakas"
  ],
  "subjectIds": [
    "sami-muhaidat",
    "merouane-debbah",
    "yuzhi-yang-wireless"
  ],
  "workIds": [
    "doi-10-1109-tcomm-2025-3547764",
    "doi-10-1109-tnse-2026-3657967",
    "arxiv-2509-01641",
    "arxiv-2510-24495",
    "arxiv-2602-08675",
    "arxiv-2603-02156"
  ],
  "focusSubjectId": "merouane-debbah",
  "coverTone": "violet",
  "coverKicker": "教授研究",
  "coverTitle": "不同尺度上的 AI 原生无线",
  "coverPoints": [
    "自动安全",
    "扩散接收机",
    "6G 推理"
  ],
  "description": "串联自动化 6G 安全、扩散接收机与小模型推理，并把数据集、仿真和概念验证证据与部署结论严格区分。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 观察视角

这六项工作的共同线索并非某一种 AI 技术，而是从自动化安全决策延伸到生成式接收机与小模型网络推理。真正值得比较的是各项工作如何定义证据：数据集、仿真、概念验证或基准测试。

## Towards Zero Touch Networks: Cross-Layer Automated Security Solutions for 6G Wireless Networks

**作者：** Li Yang, Shimaa Naser, Abdallah Shami, Sami Muhaidat, Lyndon Ong, Mérouane Debbah

**AI 原生无线视角。** [查看主要公开记录](https://doi.org/10.1109/TCOMM.2025.3547764)。该论文将漂移自适应在线学习与改进的 successive-halving AutoML 流程结合，用于物理层认证和跨层入侵检测。评估采用公开射频指纹数据与 CICIDS2017，因此贡献在于一个集成式自动安全流程，而不只是单一检测器。

**证据边界。** 验证仍基于数据集且只覆盖两类安全任务，不能据此认定已经实现自主零接触 6G 部署。

## Generative Diffusion Receivers: Achieving Pilot-Efficient MIMO-OFDM Communications

**作者：** Yuzhi Yang, Omar Alhussein, Atefeh Arani, Zhaoyang Zhang, Mérouane Debbah

**AI 原生无线视角。** [查看主要公开记录](https://doi.org/10.1109/TNSE.2026.3657967)。该接收机把 MIMO-OFDM 信道估计建模为扩散过程，将信道先验、传统估计和“想象筛选”步骤结合起来。在每 64 个子载波使用 4 至 6 个导频、信噪比为 -4 至 0 dB 的仿真中，相对所选深度学习基线报告了最高约两倍的信道重构误差降低。

**证据边界。** 证据来自仿真，且更大的想象集合会增加计算量，因此导频效率并不等同于部署效率。

## Non-Identical Diffusion Models in MIMO-OFDM Channel Generation

**作者：** Yuzhi Yang, Omar Alhussein, Mérouane Debbah

**状态：** 预印本

**AI 原生无线视角。** [查看主要公开记录](https://arxiv.org/abs/2509.01641)。该工作用逐元素时间指示器替代单一的全局扩散时间索引，以表示导频和子载波之间不均匀的可靠性。论文提出按维度的时间嵌入，并通过理论核查和 MIMO-OFDM 数值实验比较多种训练与生成方法。

**证据边界。** 公开记录是一篇修订预印本，效果来自数值实验而非射频平台实测。

## Diffusion Models for Wireless Transceivers: From Pilot-Efficient Channel Estimation to AI-Native 6G Receivers

**作者：** Yuzhi Yang, Sen Yan, Weijie Zhou, Brahim Mefgouda, Ridong Li, Zhaoyang Zhang, Mérouane Debbah

**状态：** 预印本

**AI 原生无线视角。** [查看主要公开记录](https://arxiv.org/abs/2510.24495)。这篇教程型预印本解释扩散模型如何把粗略信道估计与信号处理结构结合起来，并给出一个接收机概念验证案例。其主要价值是梳理收发机设计路径和研究议程，而不是提供大规模实验基准。

**证据边界。** 公开证据只是概念验证，不能将其视为已经标准化或广泛验证的 AI 原生接收机架构。

## 6G-Bench: An Open Benchmark for Semantic Communication and Network-Level Reasoning with Foundation Models in AI-Native 6G Networks

**作者：** Mohamed Amine Ferrag, Abderrahmane Lakas, Mérouane Debbah

**状态：** 预印本

[查看主要公开记录](https://arxiv.org/abs/2602.08675)。6G-Bench 将 30 个与标准化活动对齐的决策任务组织成五类能力。它从 113,475 个场景生成 10,000 道高难度选择题，经筛选和专家验证后保留 3,722 道，并在 22 个基础模型上报告了 0.22 到 0.82 的 pass@1。

**证据边界。** 该基准主要由生成式选择题构成，也只是当前模型的一次快照；在基准上得分高并不等同于能够安全控制真实网络。

## How Small Can 6G Reason? Scaling Tiny-to-Small Language Models for AI-Native Networks

**作者：** Mohamed Amine Ferrag, Abderrahmane Lakas, Mérouane Debbah

**状态：** 预印本

[查看主要公开记录](https://arxiv.org/abs/2603.02156)。该研究用 6G-Bench 评估 1.35 亿到 70 亿参数的模型，并报告在约 10 亿到 15 亿参数处出现明显稳定性转变。其 Edge Score 综合准确率、时延和内存，结果显示约 15 亿到 30 亿参数取得最佳平衡，而不是规模越大越好。

**证据边界。** 结论依赖单一基准和单查询推理剖析，硬件、量化方法与服务栈都可能改变所谓的边缘最优区间。
