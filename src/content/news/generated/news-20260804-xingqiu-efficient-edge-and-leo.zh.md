---
{
  "title": "Xingqiu He 博士：从边缘计算到卫星网络，先消除本不必付出的代价",
  "locale": "zh",
  "slug": "xingqiu-efficient-edge-and-leo",
  "newsId": "news-20260804-xingqiu-efficient-edge-and-leo",
  "translationKey": "news-20260804-xingqiu-efficient-edge-and-leo",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2024-01-08",
  "coverageEnd": "2025-07-10",
  "module": "interests",
  "keywords": [
    "edge-and-fog-systems",
    "resource-allocation",
    "reinforcement-learning",
    "energy-constrained-iot",
    "wireless-communications",
    "non-terrestrial-networks",
    "semantic-communications"
  ],
  "authors": [
    "Xingqiu He",
    "Chaoqun You",
    "Tony Q. S. Quek",
    "Yao Sun",
    "Gang Feng",
    "Jiasheng Wu",
    "Shaojie Su",
    "Wenjun Zhu",
    "Xiong Wang",
    "Jingjing Zhang",
    "Yue Gao",
    "Yajing Zhang",
    "Kun Guo"
  ],
  "subjectIds": [
    "xingqiu-he"
  ],
  "workIds": [
    "doi-10-1109-infocom52122-2024-10621100",
    "doi-10-1109-tmc-2024-3370101",
    "doi-10-1109-infocom55648-2025-11044706",
    "doi-10-1109-tmc-2025-3582245",
    "doi-10-1109-icc51166-2024-10622974"
  ],
  "focusSubjectId": "xingqiu-he",
  "coverTone": "slate",
  "coverKicker": "边缘与非地面网络",
  "coverTitle": "先删掉网络本来就不必做的事",
  "coverPoints": [
    "复用已有计算结果",
    "按信息价值安排时效",
    "在切换前准备好移动性"
  ],
  "description": "五项工作串起计算复用、时效感知调度、绿色 O-RAN、语义卫星切片与计划式移动性管理。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 真正的效率，往往始于重新审视工作量

不少网络优化从一份既定任务清单出发，研究怎样把它们排得更快。Xingqiu He 博士及合作者在 2024—2025 年公开的五项工作，却多次把问题往前推了一步：一项任务是否必须重新计算？每个结果是否都要同样新鲜？所有无线单元是否必须一直开启？卫星链路已经可以预测时，切换准备还要不要等到信号恶化才开始？一旦这些前提被重新检查，最大的节省可能并非来自加速，而是来自取消本可避免的工作。

这些研究跨越协同边缘计算、移动边缘调度、O-RAN、语义卫星接入与低轨卫星移动性管理，所用方法自然不止一种：缓存与连续优化、结合后决策状态的强化学习、信道感知启停、语义资源抽象和信号预测。真正把它们连在一起的，是对系统结构的主动利用——先把原本隐藏的规律显露出来，再决定哪些事情值得交给算法求解。

## 复用与时效性共同改写边缘调度的任务清单

[Exploiting Storage for Computing: Computation Reuse in Collaborative Edge Computing](https://doi.org/10.1109/infocom52122.2024.10621100) 把已经存下来的结果当成计算资源。相邻边缘服务器若收到可复用结果的相似任务，就没有必要再次执行。论文将响应时间优化拆成缓存与调度两部分，分别采用二分搜索和带回溯的投影梯度下降。这里值得注意的不只是多了一种缓存策略，而是计算复用从应用层技巧进入了资源模型：调度器面对的任务量，不再被视为不可改变的常数。

[Age-Based Scheduling for Mobile Edge Computing: A Deep Reinforcement Learning Approach](https://doi.org/10.1109/tmc.2024.3370101) 进一步追问，一个刚完成的结果是否还来得及发挥价值。在事件驱动的移动边缘计算中，处理时间也会消耗信息新鲜度；只压缩排队或传输时延，仍可能把已经过时的结果送到用户。论文建立基于信息年龄的马尔可夫决策过程，将后决策状态结构与深度强化学习结合：已知的系统演化直接计算，不确定部分再交给学习。计算复用减少“重复做”，时效调度避免“做完却太晚”，二者处理的是两种互补的浪费。

## 基础设施不必在低负载时保持全速运转

[GreenRAN: A Channel-Aware Green O-RAN Framework for NextG Mobile Systems](https://doi.org/10.1109/infocom55648.2025.11044706) 将同样的思路带到无线接入基础设施。框架先根据信道和业务情况选择需要保持工作的无线单元，再在中央单元与分布式单元之间整合负载，同时满足模型中的服务质量要求。设计以 O-RAN 的 rApp 和 xApp 组件落地，使节能控制与可运行的网络架构相连，而不是停留在孤立的数学问题中。实验支持它在所测流量和信道条件下的有效性；真实部署仍需继续评估启停开销、突发业务与设备差异。

卫星接入面对的弹性则来自任务本身。[SemSAN: Semantic Satellite Access Network Slicing for NextG Non-Terrestrial Networks](https://doi.org/10.1109/icc51166.2024.10622974) 不再只按原始比特量估算资源，而是用语义压缩容忍度与模型规模等价关系描述任务真正需要的服务，再通过在线贪心方法完成资源分配。在论文设定下，切片可以在表达质量、计算量与通信开销之间进行更细致的取舍，从而支持更多任务或降低能耗。这并不意味着可以随意舍弃语义，而是说明服务约束可以比固定吞吐率更贴近应用价值。

## 轨道运动既然可预测，连接中断前就应开始准备

低轨星座移动得很快，但轨迹并非随机。[PHandover: Parallel Handover in Mobile Satellite Network](https://doi.org/10.1109/tmc.2025.3582245) 将传统的测量触发流程改造成计划式流程：用机器学习预测信号并安排准备时机，让可以并行的步骤提前推进，同时保持与论文所用 5G 核心网架构的兼容。实验中，相较所选方案，切换时延缩短至二十一分之一。这个数字只属于论文实现与测试条件，但它清楚说明了一件事：确定性较强的拓扑变化，应当被转换成准备时间。

把五项工作放在一起，可以得到一套很务实的优化顺序：先消除重复计算，再定义结果究竟需要多新鲜；只唤醒提供服务所需的基础设施，用比原始流量更准确的方式表达应用价值，并在可预测的移动发生之前准备连接迁移。强化学习在其中发挥作用，却不是全文的中心。真正的中心是：先利用结构缩小问题，再让算法搜索余下的部分。

## 研究札记

> ### Exploiting Storage for Computing: Computation Reuse in Collaborative Edge Computing
>
> - **作者：** Xingqiu He, Chaoqun You, Tony Q. S. Quek
> - **公开记录：** [IEEE INFOCOM 2024](https://doi.org/10.1109/infocom52122.2024.10621100)
> - **可确认内容：** 论文将缓存结果纳入缓存—调度联合设计，实现跨边缘服务器的计算复用。
> - **阅读提示：** 响应时间收益依赖任务相似度、结果可缓存性与数值实验所用网络模型。
>
> ---
>
> ### Age-Based Scheduling for Mobile Edge Computing: A Deep Reinforcement Learning Approach
>
> - **作者：** Xingqiu He, Chaoqun You, Tony Q. S. Quek
> - **公开记录：** [IEEE Transactions on Mobile Computing](https://doi.org/10.1109/tmc.2024.3370101)
> - **可确认内容：** 基于信息年龄的马尔可夫决策过程结合后决策状态与深度强化学习，处理事件驱动的边缘调度。
> - **阅读提示：** 新鲜度目标和学习策略均在论文设定的到达、处理与无线动态中进行评估。
>
> ---
>
> ### GreenRAN: A Channel-Aware Green O-RAN Framework for NextG Mobile Systems
>
> - **作者：** Chaoqun You, Xingqiu He, Yao Sun, Gang Feng, Tony Q. S. Quek
> - **公开记录：** [IEEE INFOCOM 2025](https://doi.org/10.1109/infocom55648.2025.11044706)
> - **可确认内容：** 信道感知的无线单元启停与中央/分布式单元负载整合被纳入同一 O-RAN 框架。
> - **阅读提示：** 能耗和服务质量结论来自所评估原型与场景，不能直接外推到所有 O-RAN 部署。
>
> ---
>
> ### PHandover: Parallel Handover in Mobile Satellite Network
>
> - **作者：** Jiasheng Wu, Shaojie Su, Wenjun Zhu, Xiong Wang, Jingjing Zhang, Xingqiu He, Yue Gao
> - **公开记录：** [IEEE Transactions on Mobile Computing](https://doi.org/10.1109/tmc.2025.3582245)
> - **可确认内容：** 信号预测、计划式调度与并行流程共同组成兼容所测 5G 核心网的卫星切换设计。
> - **阅读提示：** 二十一倍切换时延改进仅相对论文所选方案与实验条件成立。
>
> ---
>
> ### SemSAN: Semantic Satellite Access Network Slicing for NextG Non-Terrestrial Networks
>
> - **作者：** Chaoqun You, Xingqiu He, Yajing Zhang, Kun Guo, Yue Gao, Tony Q. S. Quek
> - **公开记录：** [IEEE ICC 2024](https://doi.org/10.1109/icc51166.2024.10622974)
> - **可确认内容：** 语义压缩容忍度与模型规模等价关系被纳入在线卫星切片资源分配。
> - **阅读提示：** 任务承载和节能效果依赖所用语义模型、资源假设与应用设置。
