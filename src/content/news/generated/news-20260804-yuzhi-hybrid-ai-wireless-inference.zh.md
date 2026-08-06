---
{
  "title": "Yuzhi Yang 博士：让学习进入无线系统，也让结构继续发挥作用",
  "locale": "zh",
  "slug": "yuzhi-hybrid-ai-wireless-inference",
  "newsId": "news-20260804-yuzhi-hybrid-ai-wireless-inference",
  "translationKey": "news-20260804-yuzhi-hybrid-ai-wireless-inference",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2024-01-03",
  "coverageEnd": "2025-03-26",
  "module": "interests",
  "keywords": [
    "edge-and-fog-systems",
    "learning-enabled-wireless",
    "isac",
    "noma",
    "semantic-communications",
    "ris",
    "wireless-communications",
    "reinforcement-learning"
  ],
  "authors": [
    "Yuqing Tian",
    "Zhaoyang Zhang",
    "Yuzhi Yang",
    "Zirui Chen",
    "Zhaohui Yang",
    "Richeng Jin",
    "Tony Q. S. Quek",
    "Kai-Kit Wong",
    "Zhouxiang Zhao",
    "Yating Tang",
    "Yuanyuan Dong",
    "Lexi Xu",
    "Lei Liu",
    "Chongwen Huang",
    "Jingze Che",
    "Mérouane Debbah"
  ],
  "subjectIds": [
    "merouane-debbah",
    "yuzhi-yang-wireless"
  ],
  "workIds": [
    "doi-10-1109-mnet-2024-3420755",
    "doi-10-1109-vtc2024-spring62846-2024-10683200",
    "doi-10-1109-wcnc57260-2024-10571129",
    "doi-10-1109-wcnc57260-2024-10570521",
    "doi-10-1109-twc-2024-3524305",
    "doi-10-1109-twc-2025-3552818"
  ],
  "focusSubjectId": "yuzhi-yang-wireless",
  "coverTone": "ocean",
  "coverKicker": "无线智能",
  "coverTitle": "引入模型，也保留结构",
  "coverPoints": [
    "云端大模型与边缘小模型",
    "让传播参与计算",
    "把神经模块嵌入推断"
  ],
  "description": "六项工作连接云边生成式 AI、语义通感、RIS 辅助计算、信道估计、波束控制与混合接收机。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 无线智能首先要回答“模型放在哪里”

一句“系统使用了 AI”，几乎没有说明任何具体设计。智能可能来自云端服务、边缘小模型、资源控制器、初始接入流程、信道估计器，也可能被嵌入接收机的推断图中。Yuzhi Yang 博士及合作者在 2024—2025 年公开的六项工作覆盖了这些不同位置。贯穿其中的并不是让神经网络取代通信理论，而是把学习能力与业务、信道、传播环境或概率推断中已经存在的结构结合起来。

这一差别决定了我们应当怎样理解这些研究。云端生成式大模型与基于置信传播的接收机都包含神经计算，却面对完全不同的时延、数据和可靠性约束。深度强化学习用于波束选择时属于序贯控制；神经模块进入迭代接收机时则属于信号推断。若统称为“AI 赋能网络”，真正关键的工程取舍反而会被抹平。

## 云端能力与边缘响应可以各司其职

[An Edge-Cloud Collaboration Framework for Generative AI Service Provision With Synergetic Big Cloud Model and Small Edge Models](https://doi.org/10.1109/mnet.2024.3420755) 从服务层讨论模型分工。能力更强的云端大模型提供通用知识并支持协同训练，体量较小的边缘模型则在用户附近承担特定任务。论文围绕分布式训练与任务导向部署搭建框架，并以图像生成为例说明工作方式。它真正提出的问题是：模型部署本身就是网络设计的一部分，生成质量、通信量、隐私和响应时间无法各自独立优化。

到了链路层，[Efficient Design for NOMA Enabled Integrated Sensing and Semantic Communication](https://doi.org/10.1109/vtc2024-spring62846.2024.10683200) 将非正交多址接入（NOMA）、感知与语义通信放入同一设计。目标是在感知和语义性能约束下提高语义能效，再通过 Dinkelbach 式变换和迭代优化协调波束成形与语义参数。与云边模型部署相比，这里的智能不只是一份等待安置的计算负载，它还改变了“什么样的传输结果才有价值”。

## 无线传播与信道知识也可以成为计算的一部分

[Realizing Over-the-Air Neural Networks in RIS-Assisted MIMO Communication Systems](https://doi.org/10.1109/wcnc57260.2024.10571129) 研究信号传播能否直接参与神经计算。在论文的可重构智能表面（RIS）辅助 MIMO 系统中，发射端、RIS 与接收端被联合设计，用无线变换实现神经网络映射。它与“接收后再把数据送入普通加速器”有本质区别：信道和可控传播环境本身承担了部分计算。公开材料支持这一架构及其数值实验，但不能据此宣称任意神经网络已经能够在实际 RIS 硬件上通用运行。

要让这类系统可靠工作，信道信息仍需足够准确。[Semi-blind Channel Estimation Leveraging Frequency Correlation](https://doi.org/10.1109/wcnc57260.2024.10570521) 将贝叶斯迭代估计与跨频率的神经映射结合起来。导频为估计提供锚点，概率推断利用已知信号模型，学习到的频率相关性则补足直接观测有限的位置。混合设计的价值不在“半盲”这个标签本身，而在于合理分工：可解释的模型负责有把握的部分，学习模块处理难以准确写出的频域关系。

## 序贯控制和信号推断需要不同的学习方式

[Efficient Initial Access Based on DRL-Empowered Beam Sweeping](https://doi.org/10.1109/twc.2024.3524305) 用深度强化学习降低初始接入的波束搜索负担。基于码本和多重采样的两类设计压缩了庞大的扫描动作空间，实验采用 DeepMIMO 与 QuaDriGa 信道数据。学习策略在这里决定“接下来搜哪里”，并没有取代波束背后的物理含义。因此，它能否进入实际系统，很大程度上取决于训练环境能否覆盖部署后的几何结构与移动变化。

[A Hybrid Inference Architecture Incorporating Neural Network With Belief Propagation for AI Receivers](https://doi.org/10.1109/twc.2025.3552818) 走的是近乎相反的路线。论文没有把整个迭代接收机展开成一个庞大的端到端网络，而是将神经功能单元嵌入置信传播。概率图保留已知的推断结构，学习模块则刻画难以精确建模的关系。对于半盲 OFDM 接收，这种组合比无约束的整体替换更克制；训练分布、计算复杂度和硬件实现仍是进一步部署必须回答的问题。

六项工作由此形成了清晰的层次：让通用能力强的大模型留在云端，让响应快的小模型靠近用户；定义链路目标时同时考虑任务含义；传播环境能够完成部分映射时就利用它；概率模型与图结构仍然可靠时就保留它们；只有真正存在序贯不确定性的选择，才交给强化学习。共同原则可以概括为“选择性使用学习”：模型应当进入现有结构无法充分描述的位置，而不是进入那些尚未被认真利用的位置。

## 研究札记

> ### An Edge-Cloud Collaboration Framework for Generative AI Service Provision With Synergetic Big Cloud Model and Small Edge Models
>
> - **作者：** Yuqing Tian, Zhaoyang Zhang, Yuzhi Yang, Zirui Chen, Zhaohui Yang, Richeng Jin, Tony Q. S. Quek, Kai-Kit Wong
> - **公开记录：** [IEEE Network](https://doi.org/10.1109/mnet.2024.3420755)
> - **可确认内容：** 框架通过分布式训练与任务导向部署，协调云端大模型和边缘小模型。
> - **阅读提示：** 图像生成用于说明架构，不能证明所有生成式服务都能获得相同的质量、时延或隐私收益。
>
> ---
>
> ### Efficient Design for NOMA Enabled Integrated Sensing and Semantic Communication
>
> - **作者：** Zhouxiang Zhao, Yating Tang, Yuzhi Yang, Yuanyuan Dong, Lexi Xu, Zhaohui Yang, Zhaoyang Zhang
> - **公开记录：** [IEEE VTC-Spring 2024](https://doi.org/10.1109/vtc2024-spring62846.2024.10683200)
> - **可确认内容：** 论文将 NOMA、感知约束、语义要求与迭代资源优化纳入语义能效问题。
> - **阅读提示：** 能效收益依赖所选语义指标、信道模型、感知目标与数值对比方案。
>
> ---
>
> ### Realizing Over-the-Air Neural Networks in RIS-Assisted MIMO Communication Systems
>
> - **作者：** Yuzhi Yang, Zhaoyang Zhang, Yuqing Tian, Zhaohui Yang, Richeng Jin, Lei Liu, Chongwen Huang
> - **公开记录：** [IEEE WCNC 2024](https://doi.org/10.1109/wcnc57260.2024.10571129)
> - **可确认内容：** 发射端、RIS 与接收端变换被联合设计，通过 MIMO 无线信道实现神经映射。
> - **阅读提示：** 论文给出技术设计与数值验证，并不等同于已在实际 RIS 硬件上实现通用神经推断。
>
> ---
>
> ### Semi-blind Channel Estimation Leveraging Frequency Correlation
>
> - **作者：** Yuzhi Yang, Zhaoyang Zhang, Zirui Chen, Zhaohui Yang
> - **公开记录：** [IEEE WCNC 2024](https://doi.org/10.1109/wcnc57260.2024.10570521)
> - **可确认内容：** 贝叶斯迭代估计与学习得到的频率相关映射结合，减少对直接导频观测的依赖。
> - **阅读提示：** 精度与导频节省依赖论文所用信道、相关性、信噪比和训练分布。
>
> ---
>
> ### Efficient Initial Access Based on DRL-Empowered Beam Sweeping
>
> - **作者：** Jingze Che, Zhaoyang Zhang, Yuzhi Yang, Zhaohui Yang
> - **公开记录：** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2024.3524305)
> - **可确认内容：** 基于码本和多重采样的深度强化学习设计降低了初始接入的波束搜索负担。
> - **阅读提示：** DeepMIMO 与 QuaDriGa 数据上的结果不能替代对分布变化、移动性和实时决策开销的实测。
>
> ---
>
> ### A Hybrid Inference Architecture Incorporating Neural Network With Belief Propagation for AI Receivers
>
> - **作者：** Yuzhi Yang, Zhaoyang Zhang, Zirui Chen, Zhaohui Yang, Lei Liu, Chongwen Huang, Mérouane Debbah
> - **公开记录：** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2025.3552818)
> - **可确认内容：** 神经功能单元被嵌入置信传播，形成用于半盲 OFDM 接收的混合推断架构。
> - **阅读提示：** 数值接收结果尚不足以回答训练鲁棒性、实现复杂度和硬件效率问题。
