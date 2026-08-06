---
{
  "title": "Paschalis C. Sofotasios 教授：从实测信道走向可信链路设计",
  "locale": "zh",
  "slug": "paschalis-measurement-to-model",
  "newsId": "news-20260804-paschalis-measurement-to-model",
  "translationKey": "news-20260804-paschalis-measurement-to-model",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2024-04-16",
  "coverageEnd": "2025-08-25",
  "module": "advisors",
  "keywords": [
    "resource-allocation",
    "secure-6g",
    "wireless-communications",
    "physical-layer-security",
    "resilient-wireless",
    "energy-constrained-iot",
    "wireless-power-transfer",
    "learning-enabled-wireless",
    "ris",
    "noma"
  ],
  "authors": [
    "Athanasios P. Chrysologou",
    "Sotiris A. Tegos",
    "Panagiotis D. Diamantoulakis",
    "Nestor D. Chatzidiamantis",
    "Paschalis C. Sofotasios",
    "George K. Karagiannidis",
    "Esraa M. Ghourab",
    "Shimaa Naser",
    "Sami Muhaidat",
    "Lina Bariah",
    "Mahmoud Al-Qutayri",
    "Ernesto Damiani",
    "Mehmet C. Ilter",
    "Mikko Valkama",
    "Jyri Hämäläinen",
    "Nida Chaudhry",
    "Simon L. Cotton",
    "Nidhi Simmons",
    "Claudio R. C. M. Da Silva",
    "Okan Yurduseven",
    "Michail Matthaiou",
    "Trung Q. Duong",
    "Selina Shrestha",
    "Hany Elgala",
    "Maria Cecilia Luna Alvarado",
    "Carlos Rafael Nogueira da Silva",
    "Michel Daoud Yacoub",
    "Rawan Derbas"
  ],
  "subjectIds": [
    "paschalis-sofotasios",
    "sami-muhaidat"
  ],
  "workIds": [
    "doi-10-1109-tcomm-2024-3403502",
    "doi-10-1016-j-vehcom-2024-100774",
    "doi-10-1109-lcomm-2024-3393979",
    "doi-10-1109-pimrc59610-2024-10817218",
    "doi-10-1109-jiot-2024-3390443",
    "doi-10-1109-tcomm-2025-3581005",
    "doi-10-1109-tcomm-2025-3602357"
  ],
  "focusSubjectId": "paschalis-sofotasios",
  "coverTone": "ocean",
  "coverKicker": "PASCHALIS C. SOFOTASIOS",
  "coverTitle": "先测量，再让模型经得起假设检验",
  "coverPoints": [
    "实测信道",
    "非理想链路",
    "可信自适应"
  ],
  "description": "七项工作把信道测量和广义衰落分析，与能量受限通信、学习型调制、STAR-RIS 多址接入及车联网自适应安全连接起来。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 先弄清真实信道是什么样

Paschalis C. Sofotasios 教授近期工作的共同起点，是一个很朴素却常被简化的问题：通信系统究竟能在多大程度上相信自己的信道模型？要回答它，测量与分析缺一不可。实测数据告诉我们链路真正如何变化，数学模型则把这些变化转化为可以计算和优化的设计条件。这里收录的七项工作沿着这条路径，进一步延伸到速率分拆、射频能量采集、可重构智能表面、学习型调制、索引调制多址接入和车联网安全。

[Channel Measurements at 6.4 GHz for IEEE 802.11be WLAN](https://doi.org/10.1109/pimrc59610.2024.10817218) 没有先指定一个理想分布，而是从真实传播环境入手。研究在室内、室外以及视距、非视距场景中，对 6.425–6.445 GHz 之间的 256 个频点进行测量，进而提取路径损耗、大尺度与小尺度衰落以及相干时间等特征，并比较不同统计分布的拟合效果。结果当然只对应具体测量环境，却能为后续系统研究提供比“直接选一种常见衰落模型”更扎实的依据。

[Performance of RIS-Assisted Systems in Mixed Fading Conditions](https://doi.org/10.1109/tcomm.2025.3581005) 则从分析端向现实迈进一步。它允许可重构智能表面两侧的链路服从不同的广义衰落分布，包括 alpha-mu、kappa-mu 与扩展 eta-mu 等模型，并推导中断概率和符号错误率的精确、近似及渐近表达式。论文借此讨论衰落强度和表面单元数量如何影响性能。它的意义并不是用一个公式覆盖所有部署，而是避免为了便于计算，默认表面两侧具有完全相同的传播规律。

## 把非理想因素写进系统架构

当多个业务共享同一网络时，这种建模纪律尤为重要。[On the Coexistence of Heterogeneous Services in 6G Networks: An Imperfection-Aware RSMA Framework](https://doi.org/10.1109/tcomm.2024.3403502) 面向增强型移动宽带与大规模机器通信的共存，把正交接入与速率分拆多址结合起来。信道估计误差和非理想串行干扰消除并非事后补充，而是一开始就进入性能分析。论文得到的遍历速率平台说明：残余误差不会因为接入方案更复杂便自动消失，算法最终仍会遇到由物理不确定性决定的上限。

能量受限设备面对的是另一类“非理想”：节点必须先积攒足够能量，才有资格传输数据。[Energy Harvesting Meets Data-Oriented Communication: Delay-Outage Ratio Analysis](https://doi.org/10.1109/lcomm.2024.3393979) 因而研究一种面向数据的延迟中断率，把远场无线供能、充电时长、数据量、带宽和时限放进同一指标。它不只询问瞬时信道是否超过门限，而是关心指定数据能否在截止时间前送达。相应的解析结果和数值验证揭示了一个现实矛盾：充电占用时间，传输同样占用时间，两者必须在同一个时延预算内分配。

## 让学习保留正确的信息，也让攻击目标不断变化

团队在学习赋能通信上的工作，同样关注模型与任务是否真正匹配。[Autoencoder-Based Spatial Modulation for the Next Generation of Wireless Networks](https://doi.org/10.1109/jiot.2024.3390443) 提出三种用于空间调制的自编码器结构，其中两种分别通过相移键控标记和可学习嵌入显式保留天线索引，从而缓解发射天线高度相关时的性能退化。论文在所设定的 Rician 信道中显示出明显的误码性能改善；更值得保留的启发是，神经收发机不能只追求端到端拟合，还要确保网络表示没有丢掉接收端必须判断的离散空间信息。

即使不借助神经编码器，如何保留并识别索引信息仍然是关键。[Index Modulation Aided Non-Orthogonal Multiple Access in STAR-RIS-Assisted Networks](https://doi.org/10.1109/tcomm.2025.3602357) 按照预定义图样，把索引调制用户的信息映射到 STAR-RIS 的不同子表面，再利用基于接收信号能量的最大似然检测识别活跃子表面。公开摘要给出了 Beaulieu–Xie 衰落下的成对错误概率、误码率上界和可达速率分析。这项设计把“选择哪些子表面”变成多址传输的一部分；相应结论仍受论文设定的子表面划分、检测器和信道模型约束。

[Moving Target Defense Approach for Secure Relay Selection in Vehicular Networks](https://doi.org/10.1016/j.vehcom.2024.100774) 把自适应用在安全控制上。系统持续改变中继配置，并注入迷惑数据，使窃听者难以锁定一个长期不变的目标。论文将中继选择写成马尔可夫决策过程，设计两种深度强化学习方法，在窃听成功概率与有效数据占比之间权衡。这是在特定攻击者、观测和移动模型下得到的仿真结果，不能直接等同于普遍安全保证；但它清楚说明，网络拓扑和转发路径本身也可以成为主动防御手段。

## 从观测、分析到自适应形成闭环

纵观这些工作，测量、理论分析和机器学习并不是彼此替代的三种路线，而是一个前后相接的闭环。信道测量限定合理的传播范围，广义分布把分析从单一衰落假设中解放出来，显式考虑误差的公式告诉算法哪些瓶颈无法回避，机器学习则被用在难以手工构造的表示和控制策略上。这样一来，每个看起来很亮眼的数值提升，也都能被放回对应的信道、硬件、业务和威胁假设中理解。

对于未来的能量受限与安全无线系统，这种研究习惯与具体算法同样重要。可重构智能表面、自编码器或强化学习策略，只有在物理链路得到充分刻画、关键不确定性真正进入优化之后，才有机会成为可信的系统部件。这七篇论文恰好把这条逻辑链完整呈现出来。

## 研究札记

> ### On the Coexistence of Heterogeneous Services in 6G Networks: An Imperfection-Aware RSMA Framework
>
> - **作者：** Athanasios P. Chrysologou、Sotiris A. Tegos、Panagiotis D. Diamantoulakis、Nestor D. Chatzidiamantis、Paschalis C. Sofotasios、George K. Karagiannidis
> - **公开记录：** [IEEE Transactions on Communications](https://doi.org/10.1109/tcomm.2024.3403502)
> - **主要贡献：** 在异构业务共存的 OMA–RSMA 架构中，显式纳入信道估计误差与干扰消除残差并分析其影响。
> - **阅读提示：** 速率平台和业务权衡依赖论文设定的流量、衰落与残余干扰模型。
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
> ### Energy Harvesting Meets Data-Oriented Communication: Delay-Outage Ratio Analysis
>
> - **作者：** Mehmet C. Ilter、Paschalis C. Sofotasios、Mikko Valkama、Jyri Hämäläinen
> - **公开记录：** [IEEE Communications Letters](https://doi.org/10.1109/lcomm.2024.3393979)
> - **主要贡献：** 推导射频能量采集节点的延迟中断表达式，把充电、数据量、带宽和截止时间连接起来。
> - **阅读提示：** 该指标基于论文采用的远场供能和链路模型；能量来源或流量过程改变后，结论也可能变化。
>
> ---
>
> ### Channel Measurements at 6.4 GHz for IEEE 802.11be WLAN
>
> - **作者：** Nida Chaudhry、Simon L. Cotton、Nidhi Simmons、Claudio R. C. M. Da Silva、Okan Yurduseven、Paschalis C. Sofotasios、Michail Matthaiou、Trung Q. Duong
> - **公开记录：** [IEEE PIMRC 2024](https://doi.org/10.1109/pimrc59610.2024.10817218)
> - **主要贡献：** 利用室内外视距和非视距测量，刻画 6.4 GHz 附近的路径损耗、衰落和相干时间。
> - **阅读提示：** 拟合分布和参数描述的是本次测量地点与设备，不能直接代表所有 IEEE 802.11be 部署。
>
> ---
>
> ### Autoencoder-Based Spatial Modulation for the Next Generation of Wireless Networks
>
> - **作者：** Selina Shrestha、Shimaa Naser、Lina Bariah、Sami Muhaidat、Paschalis C. Sofotasios、Hany Elgala、Ernesto Damiani
> - **公开记录：** [IEEE Internet of Things Journal](https://doi.org/10.1109/jiot.2024.3390443)
> - **主要贡献：** 比较三种自编码器架构，其中两种通过显式或可学习表示保留天线索引信息。
> - **阅读提示：** 误码率收益取决于论文使用的 Rician 信道、天线相关性、调制方式和训练设置。
>
> ---
>
> ### Performance of RIS-Assisted Systems in Mixed Fading Conditions
>
> - **作者：** Maria Cecilia Luna Alvarado、Carlos Rafael Nogueira da Silva、Nidhi Simmons、Paschalis C. Sofotasios、Simon L. Cotton、Michel Daoud Yacoub
> - **公开记录：** [IEEE Transactions on Communications](https://doi.org/10.1109/tcomm.2025.3581005)
> - **主要贡献：** 针对可重构智能表面两侧服从多种广义衰落组合的链路，推导中断与符号错误性能。
> - **阅读提示：** 增加表面单元带来的收益，是在特定无源表面和信道模型下得到的解析及蒙特卡洛结果。
>
> ---
>
> ### Index Modulation Aided Non-Orthogonal Multiple Access in STAR-RIS-Assisted Networks
>
> - **作者：** Rawan Derbas、Shimaa Naser、Sami Muhaidat、Paschalis C. Sofotasios
> - **公开记录：** [IEEE Transactions on Communications](https://doi.org/10.1109/tcomm.2025.3602357)
> - **主要贡献：** 将索引调制用户的信息映射到 STAR-RIS 子表面，并在 Beaulieu–Xie 衰落下分析基于能量的检测、成对错误概率、误码率上界和可达速率。
> - **阅读提示：** 公开摘要支持上述系统结构与分析指标；其适用范围仍受论文设定的子表面划分、检测器和衰落模型约束。
