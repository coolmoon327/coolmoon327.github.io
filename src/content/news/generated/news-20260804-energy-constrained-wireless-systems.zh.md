---
{
  "title": "从智能织物到可编程孔径：能量受限无线系统的完整链路",
  "locale": "zh",
  "slug": "energy-constrained-wireless-systems",
  "newsId": "news-20260804-energy-constrained-wireless-systems",
  "translationKey": "news-20260804-energy-constrained-wireless-systems",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2024-04-26",
  "coverageEnd": "2025-06-03",
  "module": "fields",
  "keywords": [
    "battery-free-iot",
    "energy-constrained-iot",
    "wireless-power-transfer",
    "convex-optimization",
    "resource-allocation",
    "ris",
    "pinching-antennas",
    "zero-energy-wireless",
    "ambient-backscatter",
    "isac",
    "learning-enabled-wireless",
    "edge-and-fog-systems",
    "movable-antennas",
    "wireless-powered-edge"
  ],
  "authors": [
    "Weiye Xu",
    "Tony Li",
    "Yuntao Wang",
    "Xing-Dong Yang",
    "Te-Yen Wu",
    "Benjamin J. B. Deutschmann",
    "Ulrich Muehlmann",
    "Ahmet Kaplan",
    "Gilles Callebaut",
    "Thomas Wilding",
    "Bert Cox",
    "Liesbet Van der Perre",
    "Fredrik Tufvesson",
    "Erik G. Larsson",
    "Klaus Witrisal",
    "Amirhossein Azarbahram",
    "Onel L. A. López",
    "Bruno Clerckx",
    "Marco Di Renzo",
    "Matti Latva-Aho",
    "Yixuan Li",
    "Ji Wang",
    "Yuanwei Liu",
    "Zhiguo Ding",
    "Ahmad Massud Tota Khel",
    "Aissa Ikhlef",
    "Hongjian Sun",
    "Muhammad Ali Jamshed",
    "Yazdan Ahmad Qadri",
    "Ali Nauman",
    "Haejoon Jung",
    "Pengcheng Chen",
    "Yuxuan Yang",
    "Bin Lyu",
    "Zhen Yang",
    "Abbas Jamalipour"
  ],
  "subjectIds": [
    "zhiguo-ding"
  ],
  "workIds": [
    "doi-10-1145-3706598-3713100",
    "doi-10-1109-mwc-2025-3636246",
    "doi-10-1109-twc-2025-3645104",
    "doi-10-1109-lcomm-2025-3594663",
    "doi-10-1109-tgcn-2025-3578423",
    "doi-10-1109-jiot-2024-3394041",
    "doi-10-1109-jiot-2024-3437201"
  ],
  "coverTone": "rose",
  "coverKicker": "能量受限无线系统",
  "coverTitle": "能量自治必须算完整本账",
  "coverPoints": [
    "无电池接口",
    "近场聚焦",
    "自供能智能表面"
  ],
  "description": "七项工作串起无电池接口、暴露感知反向散射、无线供能实测、可编程孔径、SWIPT 与无线供能边缘计算。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 去掉电池，并不会让能量问题消失

“无电池”和“零能耗”是有价值的目标，但都不意味着设备不再需要能量。能量仍要被耦合、采集、短时保存，再用于感知、通信、计算或器件重构。这里的七项工作分布在这条链路的不同位置：不嵌入电池和芯片的织物接口、兼顾电磁场暴露的环境反向散射、经过实测的大孔径供能链路、波形与 RIS 联合优化、夹持天线辅助的同时无线信息与能量传输、利用干扰能量维持自身工作的 RIS，以及配有可移动天线的无线供能边缘系统。它们共同说明，能量自治是一笔端到端收支账，不能只看某一个器件。

[BIT: Battery-free, IC-less and Wireless Smart Textile Interface and Sensing System](https://doi.org/10.1145/3706598.3713100) 从终端入手。织物中的多谐振电路与外部线圈进行近场耦合，完成无线供能和感知；等效电路模型则支撑基于阻抗变化的信号估计。仿真和用户研究展示了多种织物传感器的可行性。系统确实去掉了织物内部的刚性芯片、电池和连接器，但仍依赖附近的读写基础设施与耦合几何。

## 孔径既决定效率，也受到安全规范约束

[Physically Large Apertures for Wireless Power Transfer: Performance and Regulatory Aspects](https://doi.org/10.1109/mwc.2025.3636246) 讨论近场聚焦为何会改变供能预算。相对接收距离足够大的物理孔径可以把功率密度峰值聚焦到设备位置，同时降低基础设施附近的功率密度。作者在 10 GHz 以下开展真实测量，并在文章采用的规范条件下将接收功率提高到毫瓦量级，同时观察到多径对聚焦的帮助。实测把阵列几何与人体暴露限制联系起来，但并不意味着任何房间、任何规范下都能获得与距离近似无关的供能。

[Electromagnetic Field Exposure-Aware AI Framework for Integrated Sensing and Communications-Enabled Ambient Backscatter Wireless Networks](https://doi.org/10.1109/jiot.2024.3394041) 把低能耗接入与另一项约束联系起来：多个近距离设备造成的上行电磁场暴露总量。在建模的环境反向散射蜂窝网络中，通感一体化与功率域 NOMA 共同为终端分配资源；框架以 k-medoids 和轮廓系数分析分配子载波，再优化用户发射功率。仿真相对所选基线降低了总暴露量。这项结果说明资源分配可以显式纳入暴露约束，但反向散射标签的硬件测量和完整采能收支仍不在所报告的评估范围内。

孔径和波形还必须适配整流器。[Beamforming and Waveform Optimization for RF Wireless Power Transfer with Beyond Diagonal Reconfigurable Intelligent Surfaces](https://doi.org/10.1109/twc.2025.3645104) 针对非线性整流器，联合设计多载波波形和 RIS 波束。仿真显示，整流器工作区间会改变子载波功率分配；超对角 RIS 的优势主要出现在非视距分量较强时。由此可见，无线能量传输不能只按传播增益优化。

## 信息与能量可以共用硬件，但仍要争夺资源

Zhiguo Ding 教授参与的 [Pinching-Antenna Assisted Simultaneous Wireless Information and Power Transfer](https://doi.org/10.1109/lcomm.2025.3594663) 在一根介质波导上激活多枚夹持天线。系统使用非正交多址接入叠加信息信号，并联合调整信息接收者的功率分配和天线位置，以提高能量接收者获得的功率。作者把非凸问题拆成凸功率分配与位置搜索两个部分。公开资料支持数值性能增益，但没有给出波导硬件实验。

Zhiguo Ding 教授参与的 [Zero-Energy RIS-Assisted Communications With Noise Modulation and Interference-Based Energy Harvesting](https://doi.org/10.1109/tgcn.2025.3578423) 则让 RIS 的一部分阵元反射期望信号，另一部分吸收干扰并采集能量。采集功率具有随机性，可用于波束成形的阵元数量也随之变化。分析和仿真显示，低到中等干扰区间存在兼顾供能与通信的空间，干扰过强时通信性能会受限。这里的“零能耗”是指在所提架构中用干扰采能支撑 RIS 工作，并不是整条链路不再消耗能量。

[Movable-Antenna-Enhanced Wireless-Powered Mobile-Edge Computing Systems](https://doi.org/10.1109/jiot.2024.3437201) 把能量核算继续延伸到计算。混合接入点先向无线设备传输能量，再接收设备卸载的任务；天线可以在限定区域内移动，以同时改善下行供能和上行卸载的空间自由度。论文比较动态、半动态和静态三种位置策略，并把非线性能量转换与边缘服务器有限算力纳入模型，再通过交替优化及粒子群—局部搜索混合算法求解。计算速率优势来自数值实验，尚不能代表真实定位机构的移动开销和校准误差。

## 从电磁场到实际功能，每一次转换都要算清楚

这些工作可以连成一条完整路径：无电池接口规定终端能做什么，暴露感知接入限制多少设备能够共享电磁场，大孔径决定能否在规范允许下把足够能量送到目标，波形和表面决定整流器真正得到多少，SWIPT 处理信息与能量的资源竞争，自供能 RIS 还要在采集能量和自身重构之间平衡，无线供能边缘计算则必须继续支付卸载与处理的能量成本。可信的零能耗无线设计，应当让这条路径上的每次能量转换和工作假设都清晰可见。

## 研究札记

> ### BIT: Battery-free, IC-less and Wireless Smart Textile Interface and Sensing System
>
> - **作者：** Weiye Xu, Tony Li, Yuntao Wang, Xing-Dong Yang, Te-Yen Wu
> - **公开记录：** [CHI 2025](https://doi.org/10.1145/3706598.3713100)
> - **可确认内容：** 多谐振织物电路通过近场耦合实现供能和阻抗感知，方案经过仿真与用户研究评估。
> - **阅读提示：** 无电池、无芯片描述的是织物接口；系统仍依赖外部读写器和耦合条件。
>
> ---
>
> ### Physically Large Apertures for Wireless Power Transfer: Performance and Regulatory Aspects
>
> - **作者：** Benjamin J. B. Deutschmann, Ulrich Muehlmann, Ahmet Kaplan, Gilles Callebaut, Thomas Wilding, Bert Cox, Liesbet Van der Perre, Fredrik Tufvesson, Erik G. Larsson, Klaus Witrisal
> - **公开记录：** [IEEE Wireless Communications](https://doi.org/10.1109/mwc.2025.3636246)
> - **可确认内容：** 10 GHz 以下的真实测量展示了兼顾规范限制的近场聚焦，并在所测环境中获得毫瓦量级接收功率。
> - **阅读提示：** 功率、聚焦收益和规范符合性都依赖孔径、距离、环境、频率及适用限值。
>
> ---
>
> ### Beamforming and Waveform Optimization for RF Wireless Power Transfer with Beyond Diagonal Reconfigurable Intelligent Surfaces
>
> - **作者：** Amirhossein Azarbahram, Onel L. A. López, Bruno Clerckx, Marco Di Renzo, Matti Latva-Aho
> - **公开记录：** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2025.3645104)
> - **可确认内容：** 工作在非线性整流器模型下联合优化多载波波形和超对角 RIS 波束。
> - **阅读提示：** 智能表面的相对收益与功率分配结果来自数值实验，并随传播和整流器工作区间变化。
>
> ---
>
> ### Pinching-Antenna Assisted Simultaneous Wireless Information and Power Transfer
>
> - **作者：** Yixuan Li, Ji Wang, Yuanwei Liu, Zhiguo Ding
> - **公开记录：** [IEEE Communications Letters](https://doi.org/10.1109/lcomm.2025.3594663)
> - **可确认内容：** 单波导夹持天线系统联合优化 NOMA 功率分配与天线位置，为信息和能量接收者服务。
> - **阅读提示：** 相对传统系统的增益来自数值结果；公开摘要未描述硬件原型。
>
> ---
>
> ### Zero-Energy RIS-Assisted Communications With Noise Modulation and Interference-Based Energy Harvesting
>
> - **作者：** Ahmad Massud Tota Khel, Aissa Ikhlef, Zhiguo Ding, Hongjian Sun
> - **公开记录：** [IEEE Transactions on Green Communications and Networking](https://doi.org/10.1109/tgcn.2025.3578423)
> - **可确认内容：** RIS 阵元在期望信号反射与干扰采能之间分配，并通过分析和仿真研究通信—能量取舍。
> - **阅读提示：** 所提 RIS 在模型内实现能量自给；“零能耗”不表示端到端网络完全不耗电。

> ---
>
> ### Electromagnetic Field Exposure-Aware AI Framework for Integrated Sensing and Communications-Enabled Ambient Backscatter Wireless Networks
>
> - **作者：** Muhammad Ali Jamshed, Yazdan Ahmad Qadri, Ali Nauman, Haejoon Jung
> - **公开记录：** [IEEE Internet of Things Journal](https://doi.org/10.1109/jiot.2024.3394041)
> - **可确认内容：** 公开摘要描述了通感一体化、功率域 NOMA 环境反向散射网络中的子载波聚类与用户功率优化方法。
> - **阅读提示：** 总上行电磁场暴露下降来自仿真；公开资料没有给出标签硬件测量或完整的端到端能量自治实验。
>
> ---
>
> ### Movable-Antenna-Enhanced Wireless-Powered Mobile-Edge Computing Systems
>
> - **作者：** Pengcheng Chen, Yuxuan Yang, Bin Lyu, Zhen Yang, Abbas Jamalipour
> - **公开记录：** [IEEE Internet of Things Journal](https://doi.org/10.1109/jiot.2024.3437201)
> - **可确认内容：** 系统联合考虑无线供能、任务卸载、可移动天线位置、非线性能量转换与有限边缘算力，并采用交替优化和混合搜索方法。
> - **阅读提示：** 计算速率增益来自数值实验；公开摘要不能确认定位时延、执行器能耗、校准误差和硬件行为。
