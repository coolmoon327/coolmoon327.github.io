---
{
  "title": "Mérouane Debbah 教授：从接收机到推理的 AI 原生无线证据",
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
## 当人工智能进入无线系统的不同层次

Mérouane Debbah 教授近期参与的这组工作，恰好说明了“AI 原生无线”为什么不能被简化成给通信系统外挂一个模型。这里的人工智能落在不同位置：有的负责让安全机制随环境变化而更新，有的直接进入信道估计与接收机，还有的尝试衡量模型能否理解网络级决策。六项工作放在一起，更容易看清这一方向的层次，也能看出不同结论分别建立在什么证据之上。

零接触网络首先面对的是一个很现实的问题：检测器训练完成后，数据分布仍会变化。相关工作把漂移自适应在线学习和逐次减半式 AutoML 结合起来，同时处理物理层认证和跨层入侵检测。公开射频指纹数据与 CICIDS2017 的实验说明，这套方法能够把监测、模型选择和更新串成完整流程。它证明的是两类安全任务上的自动化能力，而不是已经建成了端到端自主运行的 6G 网络。

## 从稀疏导频走向生成式接收机

另一组工作把学习模型推到了信号处理链路内部。[生成式扩散接收机](https://doi.org/10.1109/TNSE.2026.3657967)将 MIMO-OFDM 信道估计写成扩散过程：先由传统方法给出粗略估计，再结合信道先验生成候选结果，最后通过“想象筛选”选择较优解。在每 64 个子载波仅使用 4 至 6 个导频、信噪比为 -4 至 0 dB 的仿真中，相对所选深度学习基线，信道重构误差最高可降至约一半。这个结果抓住了导频不足的痛点，不过候选集合扩大后，计算负担也会随之上升。

[Non-Identical Diffusion Models in MIMO-OFDM Channel Generation](https://arxiv.org/abs/2509.01641) 进一步放宽了“所有位置不确定性相同”的假设。单一全局扩散时间索引被逐元素时间指示器取代，模型由此可以分别描述不同导频和子载波的可靠性；按维度设计的时间嵌入，则把这种差异真正带入训练与生成过程。论文给出了理论核查和 MIMO-OFDM 数值实验。随后发表的[无线收发机扩散模型教程](https://arxiv.org/abs/2510.24495)把这些方法放回完整的接收机设计框架，解释学习先验如何与传统信号处理结构配合。现阶段的公开结果仍以数值验证和概念验证为主，真正落到射频平台后，时延、内存和计算量能否承受，仍是关键问题。

## 从处理信号转向理解网络

最后两项工作把研究尺度从波形和信道扩展到网络推理。[6G-Bench](https://arxiv.org/abs/2602.08675)围绕 30 项与标准化活动对应的决策任务，划分出五类能力。项目从 113,475 个场景生成 10,000 道高难度选择题，经过筛选和专家核验后保留 3,722 道，并在 22 个基础模型上得到 0.22 至 0.82 的 pass@1。它为比较不同模型提供了统一坐标，但生成式选择题毕竟只是代理任务，不能直接等同于对真实网络的安全控制。

[小模型能把 6G 推理做到什么程度](https://arxiv.org/abs/2603.02156)沿用这一基准，评估了参数量从 1.35 亿到 70 亿的模型。结果显示，稳定性在约 10 亿至 15 亿参数附近出现明显变化；把准确率、时延和内存合并为 Edge Score 后，约 15 亿至 30 亿参数的模型给出了最好的综合平衡，而不是规模越大越好。这个观察让边缘侧部署有了更具体的模型区间，不过量化方案、硬件和服务栈变化后，最优点也可能随之移动。

这组工作真正有价值的地方，在于它把宏大的“AI 原生”拆成了一系列可以检验的问题：安全模型能否持续适应，生成先验能否节省导频，小模型能否在资源受限条件下完成网络推理。每一步的证据都有边界，但把这些步骤连起来，下一阶段需要打通的接口和工程约束也就更清楚了。

## 研究札记

> ### Towards Zero Touch Networks: Cross-Layer Automated Security Solutions for 6G Wireless Networks
>
> - **作者：** Li Yang, Shimaa Naser, Abdallah Shami, Sami Muhaidat, Lyndon Ong, Mérouane Debbah
> - **状态：** 已发表期刊论文
> - **主要来源：** [IEEE Transactions on Communications](https://doi.org/10.1109/TCOMM.2025.3547764)
> **证据说明：** 在公开射频指纹数据与 CICIDS2017 上验证两类安全任务，尚不能代表已经实现完整的自主零接触 6G 部署。
>
> ### Generative Diffusion Receivers: Achieving Pilot-Efficient MIMO-OFDM Communications
>
> - **作者：** Yuzhi Yang, Omar Alhussein, Atefeh Arani, Zhaoyang Zhang, Mérouane Debbah
> - **状态：** 已发表期刊论文
> - **主要来源：** [IEEE Transactions on Network Science and Engineering](https://doi.org/10.1109/TNSE.2026.3657967)
> **证据说明：** 结果来自仿真，且扩大想象集合会增加计算量；导频效率尚不能直接等同于部署效率。
>
> ### Non-Identical Diffusion Models in MIMO-OFDM Channel Generation
>
> - **作者：** Yuzhi Yang, Omar Alhussein, Mérouane Debbah
> - **状态：** 预印本
> - **主要来源：** [arXiv:2509.01641](https://arxiv.org/abs/2509.01641)
> **证据说明：** 修订稿提供理论和数值验证，尚无射频平台实测结果。
>
> ### Diffusion Models for Wireless Transceivers: From Pilot-Efficient Channel Estimation to AI-Native 6G Receivers
>
> - **作者：** Yuzhi Yang, Sen Yan, Weijie Zhou, Brahim Mefgouda, Ridong Li, Zhaoyang Zhang, Mérouane Debbah
> - **状态：** 预印本
> - **主要来源：** [arXiv:2510.24495](https://arxiv.org/abs/2510.24495)
> **证据说明：** 接收机案例属于概念验证，还不能据此认定已经形成标准化或广泛验证的架构。
>
> ### 6G-Bench: An Open Benchmark for Semantic Communication and Network-Level Reasoning with Foundation Models in AI-Native 6G Networks
>
> - **作者：** Mohamed Amine Ferrag, Abderrahmane Lakas, Mérouane Debbah
> - **状态：** 预印本
> - **主要来源：** [arXiv:2602.08675](https://arxiv.org/abs/2602.08675)
> **证据说明：** 任务以生成式选择题为主，基准得分不能直接解释为能够安全控制真实网络。
>
> ### How Small Can 6G Reason? Scaling Tiny-to-Small Language Models for AI-Native Networks
>
> - **作者：** Mohamed Amine Ferrag, Abderrahmane Lakas, Mérouane Debbah
> - **状态：** 预印本
> - **主要来源：** [arXiv:2603.02156](https://arxiv.org/abs/2603.02156)
> **证据说明：** 边缘侧最佳区间来自单一基准和单查询推理剖析，硬件、量化和服务方式都会影响结论。
