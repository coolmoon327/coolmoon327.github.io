---
{
  "title": "Sami Muhaidat 教授：让智能出现在无线系统真正需要它的地方",
  "locale": "zh",
  "slug": "sami-intelligence-across-wireless-stack",
  "newsId": "news-20260804-sami-intelligence-across-wireless-stack",
  "translationKey": "news-20260804-sami-intelligence-across-wireless-stack",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2024-04-16",
  "coverageEnd": "2025-09-12",
  "module": "advisors",
  "keywords": [
    "physical-layer-security",
    "resilient-wireless",
    "learning-enabled-wireless",
    "wireless-communications",
    "secure-6g",
    "energy-constrained-iot",
    "reinforcement-learning",
    "resource-allocation",
    "convex-optimization",
    "edge-and-fog-systems",
    "semantic-communications",
    "ris",
    "noma"
  ],
  "authors": [
    "Esraa M. Ghourab",
    "Shimaa Naser",
    "Sami Muhaidat",
    "Lina Bariah",
    "Mahmoud Al-Qutayri",
    "Ernesto Damiani",
    "Paschalis C. Sofotasios",
    "Selina Shrestha",
    "Hany Elgala",
    "Li Yang",
    "Mirna El Rajab",
    "Abdallah Shami",
    "Abubakar S. Ali",
    "Ahmed A. Al-Habob",
    "Octavia A. Dobre",
    "Latif U. Khan",
    "Maher Guizani",
    "Moussa Ayyash",
    "Omar Erak",
    "Omar Alhussein",
    "Hatem Abou-Zeid",
    "Mehdi Bennis",
    "Maryam Tariq",
    "Raneem Abdelrahim",
    "Rawan Derbas"
  ],
  "subjectIds": [
    "paschalis-sofotasios",
    "sami-muhaidat"
  ],
  "workIds": [
    "doi-10-1016-j-vehcom-2024-100774",
    "doi-10-1109-jiot-2024-3390443",
    "doi-10-1109-tnsm-2024-3376631",
    "doi-10-1109-ojcoms-2024-3398718",
    "doi-10-1109-tce-2025-3587176",
    "doi-10-1109-ojcoms-2026-3676928",
    "doi-10-1109-gcwkshps68340-2025-11591108",
    "doi-10-1109-tcomm-2025-3602357"
  ],
  "focusSubjectId": "sami-muhaidat",
  "coverTone": "violet",
  "coverKicker": "SAMI MUHAIDAT",
  "coverTitle": "在不确定性出现的位置安排智能",
  "coverPoints": [
    "自治安全",
    "边缘学习",
    "可重构检测"
  ],
  "description": "八项工作把学习与优化分别放在主动网络防御、空间调制、边缘训练、语义编码和结构化信号检测等明确接口上。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 智能不是网络中的某一个固定层级

Sami Muhaidat 教授在 2024 至 2025 年间的这些工作，并没有把“人工智能赋能无线通信”当作同一种算法的重复应用。它们把智能放在截然不同的位置：自动化安全系统负责选择和调整模型，动态防御改变攻击者所面对的环境，无人机控制器决定飞行与服务顺序，终端和边缘服务器分担训练任务，语义编码器删去冗余 token，接收机则在具有明确结构的信号空间中搜索。把这些论文放在一起，更有意义的问题并不是“要不要用机器学习”，而是“不确定性在哪里进入系统，又有哪些决策确实需要动态适应”。

[Enabling AutoML for Zero-Touch Network Security: Use-Case Driven Analysis](https://doi.org/10.1109/tnsm.2024.3376631) 讨论的是网络管理一端。零接触运维希望安全功能尽量少依赖人工配置，因此模型选择、超参数调整和流水线更新都需要自动化。文章以入侵检测和对抗机器学习防御等场景为线索，梳理自动化机器学习可以承担的任务，也指出其落地时仍会面对数据漂移、攻击与运维可信度等问题。它提供的是系统化分析，而不是“现有 AutoML 已能独立守住所有网络”的结论。

[Moving Target Defense Approach for Secure Relay Selection in Vehicular Networks](https://doi.org/10.1016/j.vehcom.2024.100774) 把动态适应本身变成主动防御。系统不断更换中继配置，并注入迷惑数据，使窃听者难以依赖一个长期不变的目标。作者将中继选择写成马尔可夫决策过程，用两种深度强化学习方案权衡窃听成功概率和有效数据占比。结果来自论文所设攻击者、观测条件和移动模型下的仿真，不能直接等同于普遍安全保证；更重要的思路是，不再要求固定拓扑独自抵御所有威胁，而是把重配置纳入安全机制。

## 在难以解析描述的动态环境中学习策略

控制层的 [Deep Reinforcement Learning for Energy-Efficient Data Dissemination Through UAV Networks](https://doi.org/10.1109/ojcoms.2024.3398718) 同时考虑地面设备的分类与关联、无人机的移动，以及飞行器和终端两侧的能耗。论文把问题写成马尔可夫决策过程，利用双深度 Q 网络并结合针对问题结构设计的启发式方法求解。未来接触机会和环境状态无法预先完全掌握，因此学习策略在这里有明确用途；相应节能结果仍然属于论文设定的移动、无线和能源模型。

[QoS-Enabled Wireless Split Federated Learning: A Reinforcement Learning and Optimization Approach](https://doi.org/10.1109/tce.2025.3587176) 把动态适应引入分布式训练。拆分联邦学习把神经网络执行分布在终端与基础设施之间，任务卸载、无线资源和本地算力因此必须与时延服务质量联合考虑。论文用 dueling 深度 Q 网络处理随状态变化的离散选择，再用优化方法利用问题中已知的连续结构。这个组合很关键：不确定的部分交给强化学习，能明确建模的部分则无需让模型反复“重新发现”。

## 压缩语义，也要把计算与通信代价说清楚

[Adaptive Token Merging for Efficient Transformer Semantic Communication at the Edge](https://doi.org/10.1109/ojcoms.2026.3676928) 让神经网络内部表示也能按需调整。该方法无需重新训练基础 Transformer，便可在运行时合并 token，并通过贝叶斯多目标优化协调准确率、计算量和传输开销。公开预印本在图像分类和视觉问答实验中给出了显著的浮点运算量及通信量下降。这些数字依赖具体模型与数据集，但其架构启发更普遍：语义通信需要一个可调节的“信息效用—资源消耗”旋钮，而不能默认每个 token 都同等重要。

这样也能看清无人机、拆分学习和语义编码三类工作的联系。它们都是资源分配，却位于不同接口：无人机安排运动和接触，拆分学习协调训练位置与无线资源，token 合并决定哪些内部表示值得穿过边缘链路。因此，“学习赋能”只有在学习对象和资源预算都被明确写出来时，才真正具有技术含义。

## 在物理层保留信号自身的结构

另外三项物理层研究更强调通信模型本身。[Autoencoder-Based Spatial Modulation for the Next Generation of Wireless Networks](https://doi.org/10.1109/jiot.2024.3390443) 提出三种神经收发机结构，其中两种分别用相移键控标记和可学习嵌入保留天线索引。发射天线高度相关时，接收端更难恢复这一离散空间选择，因此表示方式本身就十分关键。文中的误码率改善来自所设 Rician 信道仿真；可以推广的启发是，端到端学习仍需围绕接收机真正要判决的变量来组织表示。

[Hybrid Quantum-Classical Maximum-Likelihood Detection via Grover Adaptive Search for RIS-Assisted Broadband Wireless Systems](https://doi.org/10.1109/gcwkshps68340.2025.11591108) 把最大似然检测转化为无约束二次二进制优化问题，先用经典最小均方误差估计设置初始搜索阈值，再由 Grover 自适应搜索寻找候选解。仿真显示其性能接近最大似然检测，并减少论文所计算的查询次数。不过，这项工作没有给出量子硬件上的端到端无线接收机，更适合被理解为算法映射和复杂度研究。

[Index Modulation Aided Non-Orthogonal Multiple Access in STAR-RIS-Assisted Networks](https://doi.org/10.1109/tcomm.2025.3602357) 则把用户信息写入同时透射与反射可重构智能表面的子表面索引。论文围绕这种结构设计基于能量的最大似然检测，并推导成对错误概率、误码率界和可达速率，再通过蒙特卡洛仿真核对分析结果。这里的接收机并非通用分类器，而是从索引调制 NOMA 信号和可控传播几何出发构造的。

八项工作共有的设计习惯，是让智能对一个明确的系统接口负责：自动化管理安全流水线，动态重配置改变攻击者的问题，强化学习处理序列决策中的不确定性，优化方法保留可利用的数学结构，语义压缩暴露任务效用与资源的权衡，而学习型或搜索型检测仍服从真实信号模型。这样的边界划分，比笼统宣称“人工智能将取代传统无线设计”更有解释力，也更接近工程实现。

## 研究札记

> ### Enabling AutoML for Zero-Touch Network Security: Use-Case Driven Analysis
>
> - **作者：** Li Yang、Mirna El Rajab、Abdallah Shami、Sami Muhaidat
> - **公开记录：** [IEEE Transactions on Network and Service Management](https://doi.org/10.1109/tnsm.2024.3376631)
> - **主要贡献：** 围绕零接触网络中的自治入侵检测与对抗机器学习防御，分析 AutoML 的组成与应用方式。
> - **阅读提示：** 这是基于用例的综述与分析，并未证明任意生产网络都能实现无人值守安全运维。
>
> ---
>
> ### Deep Reinforcement Learning for Energy-Efficient Data Dissemination Through UAV Networks
>
> - **作者：** Abubakar S. Ali、Ahmed A. Al-Habob、Shimaa Naser、Lina Bariah、Octavia A. Dobre、Sami Muhaidat
> - **公开记录：** [IEEE Open Journal of the Communications Society](https://doi.org/10.1109/ojcoms.2024.3398718)
> - **主要贡献：** 将无人机移动、设备分类和关联联合建模为马尔可夫决策过程，并评估基于 DDQN 的求解方案。
> - **阅读提示：** 节能效果是在特定飞行、业务和无线参数下得到的数值结果。
>
> ---
>
> ### QoS-Enabled Wireless Split Federated Learning: A Reinforcement Learning and Optimization Approach
>
> - **作者：** Latif U. Khan、Maher Guizani、Sami Muhaidat、Moussa Ayyash
> - **公开记录：** [IEEE Transactions on Consumer Electronics](https://doi.org/10.1109/tce.2025.3587176)
> - **主要贡献：** 用 dueling DDQN 与优化方法联合处理时延约束下的卸载、无线资源和终端计算配置。
> - **阅读提示：** 收敛与服务质量对比来自仿真，并依赖所选网络和学习任务。
>
> ---
>
> ### Adaptive Token Merging for Efficient Transformer Semantic Communication at the Edge
>
> - **作者：** Omar Erak、Omar Alhussein、Hatem Abou-Zeid、Mehdi Bennis、Sami Muhaidat
> - **公开记录：** [IEEE Open Journal of the Communications Society](https://doi.org/10.1109/ojcoms.2026.3676928)
> - **主要贡献：** 以运行时 token 合并和贝叶斯多目标优化，在无需训练的前提下降低 Transformer 的计算与通信成本。
> - **阅读提示：** 准确率、FLOP 与带宽之间的权衡来自论文选定的模型、任务和边缘场景。
>
> ---
>
> ### Hybrid Quantum-Classical Maximum-Likelihood Detection via Grover Adaptive Search for RIS-Assisted Broadband Wireless Systems
>
> - **作者：** Maryam Tariq、Raneem Abdelrahim、Omar Alhussein、Sami Muhaidat
> - **公开记录：** [IEEE GLOBECOM Workshops 2025](https://doi.org/10.1109/gcwkshps68340.2025.11591108)
> - **主要贡献：** 在仿真中把最大似然检测映射为 QUBO，并结合经典 MMSE 初始化与 Grover 自适应搜索。
> - **阅读提示：** 论文没有证明实用量子接收机或硬件加速效果，重点是算法构造和查询复杂度。
>
> ---
>
> ### Index Modulation Aided Non-Orthogonal Multiple Access in STAR-RIS-Assisted Networks
>
> - **作者：** Rawan Derbas、Shimaa Naser、Sami Muhaidat、Paschalis C. Sofotasios
> - **公开记录：** [IEEE Transactions on Communications](https://doi.org/10.1109/tcomm.2025.3602357)
> - **主要贡献：** 通过 STAR-RIS 子表面索引传递信息，并给出检测、错误性能与速率分析以及蒙特卡洛验证。
> - **阅读提示：** 性能取决于论文采用的信道知识、表面划分、接收机和干扰假设。
>
> ---
>
> ### Moving Target Defense Approach for Secure Relay Selection in Vehicular Networks
>
> - **作者：** Esraa M. Ghourab、Shimaa Naser、Sami Muhaidat、Lina Bariah、Mahmoud Al-Qutayri、Ernesto Damiani、Paschalis C. Sofotasios
> - **公开记录：** [Vehicular Communications](https://doi.org/10.1016/j.vehcom.2024.100774)
> - **主要贡献：** 将动态中继选择和迷惑数据控制写成马尔可夫决策过程，并评估两种深度强化学习方案。
> - **阅读提示：** 安全收益来自特定窃听者、观测条件和移动模型下的仿真实验。
>
> ---
>
> ### Autoencoder-Based Spatial Modulation for the Next Generation of Wireless Networks
>
> - **作者：** Selina Shrestha、Shimaa Naser、Lina Bariah、Sami Muhaidat、Paschalis C. Sofotasios、Hany Elgala、Ernesto Damiani
> - **公开记录：** [IEEE Internet of Things Journal](https://doi.org/10.1109/jiot.2024.3390443)
> - **主要贡献：** 比较三种自编码器架构，其中两种通过显式或可学习表示保留天线索引信息。
> - **阅读提示：** 误码率收益依赖论文使用的 Rician 信道、天线相关性、调制方式和训练设置。
