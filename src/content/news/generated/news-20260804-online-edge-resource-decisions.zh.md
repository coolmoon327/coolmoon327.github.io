---
{
  "title": "无线边缘系统如何在不知道未来时作出在线决策",
  "locale": "zh",
  "slug": "online-edge-resource-decisions",
  "newsId": "news-20260804-online-edge-resource-decisions",
  "translationKey": "news-20260804-online-edge-resource-decisions",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2024-01-08",
  "coverageEnd": "2025-05-07",
  "module": "fields",
  "keywords": [
    "edge-and-fog-systems",
    "online-optimization",
    "resource-allocation",
    "convex-optimization",
    "reinforcement-learning"
  ],
  "authors": [
    "Chung-Hsuan Hu",
    "Zheng Chen",
    "Erik G. Larsson",
    "Long He",
    "Geng Sun",
    "Zemin Sun",
    "Qingqing Wu",
    "Jiawen Kang",
    "Dusit Niyato",
    "Zhu Han",
    "Victor C. M. Leung",
    "Jinhao Ouyang",
    "Yuan Liu",
    "Hang Liu",
    "Yang Li",
    "Xing Zhang",
    "Yukun Sun",
    "Wenbo Wang",
    "Bo Lei",
    "Tianyi Shi",
    "Tiankui Zhang",
    "Jonathan Loo",
    "Rong Huang",
    "Yapeng Wang",
    "Xingqiu He",
    "Chaoqun You",
    "Tony Q. S. Quek",
    "Guowen Wu",
    "Xihang Chen",
    "Yizhou Shen",
    "Zhiqi Xu",
    "Hong Zhang",
    "Shigen Shen",
    "Shui Yu"
  ],
  "subjectIds": [
    "xingqiu-he"
  ],
  "workIds": [
    "doi-10-1109-tcomm-2024-3443731",
    "doi-10-1109-ton-2025-3581531",
    "doi-10-1109-tmc-2025-3557838",
    "doi-10-1109-tmc-2025-3567615",
    "doi-10-1109-tii-2025-3563531",
    "doi-10-1109-infocom52122-2024-10621100",
    "doi-10-1109-jiot-2024-3357110"
  ],
  "coverTone": "slate",
  "coverKicker": "在线边缘优化",
  "coverTitle": "不假装知道未来，也要现在作决定",
  "coverPoints": [
    "队列感知控制",
    "双时间尺度",
    "计算复用"
  ],
  "description": "七项工作串起 Lyapunov 控制、隐私感知工业物联网卸载、无人机边缘服务、联邦学习时间尺度、时空调度、学习型卸载与计算复用。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 边缘系统必须在未来到来之前作决定

边缘调度器只能看到眼前的任务、信道、电量、隐私暴露和队列，一次决定究竟好不好，却可能很久以后才显现。在线优化不假设能够预知未来，而是正面处理这种错位。这里的七项工作使用了 Lyapunov 控制、凸优化、博弈、启发式算法、模仿学习、深度强化学习和缓存等不同工具，不能全部归入同一种算法。它们真正共有的问题是：如何及时处理本地变化，同时守住长期能耗、时延、隐私和成本目标？

[Energy-Efficient Federated Edge Learning with Streaming Data: A Lyapunov Optimization Approach](https://doi.org/10.1109/tcomm.2024.3443731) 把时间变化直接写进模型。训练样本随机到达，无线资源不断变化，终端还要满足长期能量约束。漂移加惩罚控制器在每轮决定参与设备、计算能力、带宽和发射功率；论文还分析异构数据与时变目标下的收敛。仿真显示学习效果和能效优于所选基线，但结论仍依赖队列与到达过程假设。

[Combining Lyapunov Optimization With Actor–Critic Networks for Privacy-Aware IIoT Computation Offloading](https://doi.org/10.1109/jiot.2024.3357110) 加入了一项常被忽略的系统状态。框架为每个工业物联网用户累计一个建模的隐私量；一旦超过阈值，部分原本要卸载的数据改为本地处理，从而降低累计值。Lyapunov 优化负责稳定数据队列并控制长期能耗，演员—评论家（actor–critic）网络则以较低的计算复杂度学习卸载策略。仿真支持给定隐私机制下的队列稳定与能耗下降，但一个标量隐私量并不能自动覆盖现实中的所有推断攻击和合规要求。

## 排队结构把长期目标转换成逐时隙决策

[QoE Maximization for Multiple-UAV-Assisted Multi-Access Edge Computing via an Online Joint Optimization Approach](https://doi.org/10.1109/ton.2025.3581531) 面向地面基础设施可能损坏的灾区。无人机轨迹、任务卸载和资源分配构成依赖未来且 NP 难的问题；Lyapunov 优化先将其转成逐时隙问题，再由博弈和凸优化分阶段求解。公开摘要显示，相对所评估的深度强化学习方法，用户体验至少提高 10%。这不能证明 Lyapunov 控制普遍优于强化学习，只说明在这组约束下利用已知结构很有价值。

[A Two-Timescale Approach for Wireless Federated Learning with Parameter Freezing and Power Control](https://doi.org/10.1109/tmc.2025.3557838) 将变化较慢的参数冻结决策与变化较快的发射功率控制分开。收敛分析把二者与能量预算联系起来，再通过 Lyapunov 分解得到在线策略。这里最值得注意的是时间尺度本身：不是每一个变量都需要跟着每次信道或训练更新重新计算。

## 空间结构与学习策略解决的是不同瓶颈

[Spatiotemporal Non-Uniformity-Aware Online Task Scheduling in Collaborative Edge Computing for Industrial Internet of Things](https://doi.org/10.1109/tmc.2025.3567615) 处理工厂之间和不同时段都不均匀的请求。图模型描述空间关系，Lyapunov 优化拆解长期问题，分层启发式算法处理 NP 难的逐时隙子问题，模仿学习再用于加速执行。这是一套含学习加速器的在线优化流程，并不是强化学习控制器。

[Joint Task Offloading and Channel Allocation in Spatial-Temporal Dynamic for MEC Networks](https://doi.org/10.1109/tii.2025.3563531) 选择了另一条路：先评估任务依赖的优先级，把信道分配写成分组背包问题，再用双重决斗深度 Q 网络决定卸载，并将信道分配结果作为环境反馈。这里，强化学习是动态卸载策略的核心。仿真支持其在所测应用中的适应性，而实时训练代价和分布外行为仍是部署时需要回答的问题。

## 最省的计算，可能是不要再算一遍

Xingqiu He 博士参与的 [Exploiting Storage for Computing: Computation Reuse in Collaborative Edge Computing](https://doi.org/10.1109/infocom52122.2024.10621100) 提供了持续重调度之外的结构性办法：缓存已经完成的任务结果，让相邻边缘服务器复用。总体响应时间问题被拆成缓存和调度两部分，前者用二分搜索，后者用带回溯的投影梯度下降处理。它与漂移加惩罚并不是同一种在线控制方法；之所以适合放在这里，是因为计算复用会直接改变未来在线控制器面对的工作量。

因此，真正的系统设计并不是在几个求解器之间二选一。排队方法维持长期预算，显式隐私状态可以触发本地处理，时间尺度分离避免无谓抖动，图结构表达请求出现在哪里，学习策略处理难以显式求解的动态选择，缓存则直接消除重复任务。每一种工具都应对应一个清楚的瓶颈，而且算法作决定所花的时间，也必须像任务时延一样被认真计算。

## 研究札记

> ### Energy-Efficient Federated Edge Learning with Streaming Data: A Lyapunov Optimization Approach
>
> - **作者：** Chung-Hsuan Hu, Zheng Chen, Erik G. Larsson
> - **公开记录：** [IEEE Transactions on Communications](https://doi.org/10.1109/tcomm.2024.3443731)
> - **可确认内容：** 漂移加惩罚控制在流式数据和长期能量约束下，联合决定设备、计算能力、带宽和发射功率。
> - **阅读提示：** 学习与能效改进来自论文随机到达、无线模型和对比方案下的仿真。
>
> ---
>
> ### QoE Maximization for Multiple-UAV-Assisted Multi-Access Edge Computing via an Online Joint Optimization Approach
>
> - **作者：** Long He, Geng Sun, Zemin Sun, Qingqing Wu, Jiawen Kang, Dusit Niyato, Zhu Han, Victor C. M. Leung
> - **公开记录：** [IEEE Transactions on Networking](https://doi.org/10.1109/ton.2025.3581531)
> - **可确认内容：** Lyapunov 转换与博弈/凸优化两阶段求解器共同控制卸载、资源和无人机轨迹。
> - **阅读提示：** 至少 10% 的用户体验优势只针对仿真中的所选深度强化学习方法，并非普遍算法排名。
>
> ---
>
> ### A Two-Timescale Approach for Wireless Federated Learning with Parameter Freezing and Power Control
>
> - **作者：** Jinhao Ouyang, Yuan Liu, Hang Liu
> - **公开记录：** [IEEE Transactions on Mobile Computing](https://doi.org/10.1109/tmc.2025.3557838)
> - **可确认内容：** 收敛分析与双时间尺度 Lyapunov 分解共同支撑参数冻结和发射功率控制。
> - **阅读提示：** 在线策略及其性能比较依赖能量预算、传输可靠性与联邦学习任务模型。
>
> ---
>
> ### Spatiotemporal Non-Uniformity-Aware Online Task Scheduling in Collaborative Edge Computing for Industrial Internet of Things
>
> - **作者：** Yang Li, Xing Zhang, Yukun Sun, Wenbo Wang, Bo Lei
> - **公开记录：** [IEEE Transactions on Mobile Computing](https://doi.org/10.1109/tmc.2025.3567615)
> - **可确认内容：** 图建模、Lyapunov 分解、分层启发式算法与模仿学习共同处理时空不均匀的工业物联网请求。
> - **阅读提示：** 学习模块用于加速调度流程；公开摘要没有把它描述成强化学习策略。
>
> ---
>
> ### Joint Task Offloading and Channel Allocation in Spatial-Temporal Dynamic for MEC Networks
>
> - **作者：** Tianyi Shi, Tiankui Zhang, Jonathan Loo, Rong Huang, Yapeng Wang
> - **公开记录：** [IEEE Transactions on Industrial Informatics](https://doi.org/10.1109/tii.2025.3563531)
> - **可确认内容：** 任务优先级和分组背包步骤把信道分配结果反馈给双重决斗深度 Q 网络卸载策略。
> - **阅读提示：** 时延—能耗与适应性结论来自充分仿真，不是生产级 MEC 部署结果。
>
> ---
>
> ### Exploiting Storage for Computing: Computation Reuse in Collaborative Edge Computing
>
> - **作者：** Xingqiu He, Chaoqun You, Tony Q. S. Quek
> - **公开记录：** [IEEE INFOCOM 2024](https://doi.org/10.1109/infocom52122.2024.10621100)
> - **可确认内容：** 跨服务器计算复用被拆成缓存和调度，并分别以二分搜索和带回溯的投影梯度下降处理。
> - **阅读提示：** 响应时间降幅来自数值实验，并依赖相邻边缘服务器之间任务相似和结果可复用的假设。

> ---
>
> ### Combining Lyapunov Optimization With Actor–Critic Networks for Privacy-Aware IIoT Computation Offloading
>
> - **作者：** Guowen Wu, Xihang Chen, Yizhou Shen, Zhiqi Xu, Hong Zhang, Shigen Shen, Shui Yu
> - **公开记录：** [IEEE Internet of Things Journal](https://doi.org/10.1109/jiot.2024.3357110)
> - **可确认内容：** 框架把带阈值的累计隐私状态、本地处理、Lyapunov 队列与能耗控制，以及演员—评论家卸载策略结合起来。
> - **阅读提示：** 稳定性与能耗结论来自仿真；公开摘要不能证明所定义的隐私量覆盖所有泄露机制、攻击和合规要求。
