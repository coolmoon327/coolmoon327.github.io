---
{
  "title": "当无线通信开始重新设计无线电本身",
  "locale": "zh",
  "slug": "wireless-communications-changing-foundations",
  "newsId": "news-20260804-wireless-communications-changing-foundations",
  "translationKey": "news-20260804-wireless-communications-changing-foundations",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2024-01-30",
  "coverageEnd": "2025-05-02",
  "module": "fields",
  "keywords": [
    "wireless-communications",
    "movable-antennas",
    "isac",
    "learning-enabled-wireless",
    "ai-native-wireless",
    "convex-optimization",
    "pinching-antennas"
  ],
  "authors": [
    "Boqun Zhao",
    "Chongjun Ouyang",
    "Xingqi Zhang",
    "Yuanwei Liu",
    "Songjie Yang",
    "Jiancheng An",
    "Yue Xiu",
    "Wanting Lyu",
    "Boyu Ning",
    "Zhongpei Zhang",
    "Mérouane Debbah",
    "Chau Yuen",
    "Tierui Gong",
    "Aveek Chandra",
    "Yong Liang Guan",
    "Rainer Dumke",
    "Chong Meng Samson See",
    "Lajos Hanzo",
    "Shixiong Wang",
    "Wei Dai",
    "Jianyong Sun",
    "Zongben Xu",
    "Geoffrey Ye Li",
    "Xiang Ma",
    "Haijian Sun",
    "Rose Qingyang Hu",
    "Yi Qian",
    "Tingting Yang",
    "Ping Zhang",
    "Mengfan Zheng",
    "Yuxuan Shi",
    "Liwen Jing",
    "Jianbo Huang",
    "Nan Li",
    "Zhaolin Wang",
    "Jiaqi Xu",
    "Xidong Mu",
    "Zhiguo Ding",
    "Shengzhe Xu",
    "Christo Kurisummoottil Thomas",
    "Omar Hashash",
    "Nikhil Muralidhar",
    "Walid Saad",
    "Naren Ramakrishnan",
    "Zheng Zhang",
    "Bingtao He",
    "Jian Chen",
    "Dimitrios Bozanis",
    "Vasilis K. Papanikolaou",
    "Sotiris A. Tegos",
    "George K. Karagiannidis"
  ],
  "subjectIds": [
    "merouane-debbah",
    "zhiguo-ding"
  ],
  "workIds": [
    "doi-10-1109-twc-2025-3579677",
    "doi-10-1109-twc-2025-3545305",
    "doi-10-1109-mwc-015-2400381",
    "doi-10-1109-mcom-001-2400714",
    "doi-10-1109-jiot-2024-3488377",
    "doi-10-1109-mnet-2025-3579496",
    "doi-10-1109-mwc-001-2400493",
    "doi-10-1109-mnet-2024-3427313",
    "doi-10-1109-lcomm-2025-3619778",
    "doi-10-1109-pimrc62392-2025-11274872"
  ],
  "coverTone": "ocean",
  "coverKicker": "无线通信",
  "coverTitle": "无线电本身也成为算法的一部分",
  "coverPoints": [
    "连续孔径",
    "形态可变阵列",
    "面向任务的链路"
  ],
  "description": "十项工作串起连续与柔性孔径、原子接收机、夹持天线感知、无线基础模型、不确定性和面向任务的链路。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 无线电本身也开始进入算法

传统无线链路通常先确定天线阵列和接收机，再围绕速率、可靠性等指标优化。这里的十项工作却不断移动这条边界：孔径上的电流可以连续调节，阵列能够弯折，辐射点可以沿波导改变位置，接收机甚至可以借助原子能级读取射频场；再往上，学习模型的表示方式和应用允许的误差也成为链路设计的一部分。它们没有指向唯一的“下一代空口”，而是在重新回答一个更基础的问题：无线系统里究竟有哪些东西可以被共同设计。

## 从离散阵元走向可控孔径

连续孔径阵列不再用有限个权重描述天线，而是在大尺寸表面上直接处理连续电流分布。Zhiguo Ding 教授参与的 [CAPA: Continuous-Aperture Arrays for Revolutionizing 6G Wireless Communications](https://doi.org/10.1109/mwc.001.2400493) 从已有原型出发，介绍电子、光学和声学材料对应的三类实现路径，并讨论有别于离散阵列的连续电流波束成形。文章以数值结果比较容量和分集–复用表现，同时列出尚待解决的问题。它给出的是一套架构、实现选项与研究议程，而不是已经定型的单一硬件方案。

[Continuous-Aperture Array (CAPA)-Based Wireless Communications: Capacity Characterization](https://doi.org/10.1109/twc.2025.3579677) 为这种变化提供了一块信息论基础。论文研究连续孔径上、下行单用户和双用户系统，给出容量、容量实现方式以及上行与下行之间的变换关系。数值结果也提醒人们保持克制：在文中的模型下，孔径尺寸不断增加时，容量会逐渐逼近有限上界，并不会无限增长。

## 几何与感知机制成为可控资源

连续孔径改变的是电流如何表示，柔性阵列改变的则是几何结构本身。Mérouane Debbah 教授参与的 [Flexible Antenna Arrays for Wireless Communications: Modeling and Performance Evaluation](https://doi.org/10.1109/twc.2025.3545305) 对旋转、弯曲和折叠引起的阵元位置与朝向变化进行建模，并把这些自由度与多种预编码方式结合。论文中的增益来自特定数值场景，不能直接套用到任何部署；更重要的意义在于，阵列形态不再是机械设计结束后才交给通信算法的既定条件。

Mérouane Debbah 教授参与的另一项工作 [Rydberg Atomic Quantum Receivers for Classical Wireless Communication and Sensing](https://doi.org/10.1109/mwc.015.2400381) 把边界推向接收机物理机制。文章介绍利用电磁诱导透明和 Autler–Townes 分裂把射频信号转换为光学读出的里德堡原子接收机，梳理早期实验，并讨论它与经典 SISO、MIMO 系统的结合方式。这并不意味着原子接收机已经可以取代成熟的射频前端，而是把原理、已有能力和工程整合难点放在同一张路线图上。

夹持天线系统则允许沿介质波导调整辐射点的位置。[Integrated Sensing and Communications for Pinching-Antenna Systems (PASS)](https://doi.org/10.1109/lcomm.2025.3619778) 采用两条波导分工：一条发射通信与感知信号，另一条接收目标回波；算法在满足通信服务质量的同时提高目标照射功率。公开摘要中的数值结果还显示，在所测设置下，等功率分配可以接近优化分配。[Cramér-Rao Bounds for Integrated Sensing and Communications in Pinching-Antenna Systems](https://doi.org/10.1109/pimrc62392.2025.11274872) 进一步追问这种结构能够提供怎样的估计精度。论文面向由波导夹持天线照射、均匀线阵接收的双基地链路，推导联合距离与方向估计的闭式克拉美–罗下界，并保留各辐射点的幅度、相位和非均匀位置影响。厘米级测距和亚角度分辨率来自论文模型下的数值结果，不能当作真实部署中的无条件保证。

原子接收机与夹持天线分别改变了“如何观察射频场”和“在何处激励并收集回波”。两类研究都说明，只有把具体物理机制保留在信号模型里，新的自由度才有可解释的意义。

## 基础模型与应用价值重新定义链路目标

[WirelessGPT: A Generative Pre-Trained Multi-Task Learning Framework for Wireless Communication](https://doi.org/10.1109/mnet.2025.3579496) 使用大规模无线信道数据进行无监督预训练，希望为通信和感知任务提取共享表示。公开摘要描述了一个约八千万参数的初始模型，下游任务只需有限微调，并在选定基线下取得数值改进。这些证据支持“多任务无线基础模型原型”这一判断，却还不足以说明模型能够跨越不同信道、硬件和部署环境稳定迁移。

[Large Multi-Modal Models (LMMs) as Universal Foundation Models for AI-Native Wireless Systems](https://doi.org/10.1109/mnet.2024.3427313) 讨论的范围更宽。其框架把多模态感知、因果推理与检索、真实物理环境中的符号对应关系，以及基于环境反馈和神经符号推理的自适应联系起来。论文给出初步实验，但主体仍是架构构想和研究议程。把它与 WirelessGPT 并读，可以区分两个常被混在一起的问题：一种表示能否迁移到多个无线任务，以及一个通用模型能否始终理解自己正在控制的物理系统。

硬件自由度越多，对模型不确定性的忽略就越危险。[Uncertainty Awareness in Wireless Communications and Sensing](https://doi.org/10.1109/mcom.001.2400714) 将问题归纳为物理知识不完整、数据不足、测量误差、计算资源受限和环境变化等来源，并讨论多样性与自适应架构、鲁棒信号处理、风险感知优化和可信机器学习等应对方式。文章真正提供的是一套组织问题的方法，以及鲁棒性与最优性之间不可回避的取舍，而不是一个适用于所有系统的万能方案。

到了应用层，[Approximate Wireless Communication for Lossy Gradient Updates in IoT Federated Learning](https://doi.org/10.1109/jiot.2024.3488377) 追问：传输梯度时，每一个错误比特是否都值得纠正或重传？其接收端会限制异常梯度值，并用格雷码增强高阶调制中高有效位的天然保护。公开摘要显示，在所测学习任务与信道条件下，该方法用对比方案一半的空口时间达到相近学习目标。这个数字不能脱离实验设置泛化，但它说明了一条很有价值的原则：当下游任务的容错能力可以衡量时，链路可靠性也应由任务结果来检验。

## 更大的设计空间需要更清楚的接口

这些工作同时从物理层下方和应用层上方扩展无线系统。连续、柔性和夹持孔径让电磁接口可编程，原子感知改变接收机制，基础模型与近似通信则把表示和任务价值带入设计。每增加一个自由度，也会多出一组可能失效的假设。因此，容量界、估计界、仿真基线、公开实验和应用指标必须彼此区分。可靠的系统不应把一切变量塞进不可解释的联合优化，而应让物理机制、学习模型、不确定性和任务收益之间的接口始终能够被检查。

## 研究札记

> ### Continuous-Aperture Array (CAPA)-Based Wireless Communications: Capacity Characterization
>
> - **作者：** Boqun Zhao, Chongjun Ouyang, Xingqi Zhang, Yuanwei Liu
> - **公开记录：** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2025.3579677)
> - **可确认内容：** 公开摘要给出了连续孔径系统的闭式容量分析、多用户上行与下行刻画，以及与离散阵列的数值比较。
> - **阅读提示：** 有限容量上界和阵列比较都建立在论文给定的孔径与信道模型上，并不等同于对所有连续孔径硬件的实测结论。
>
> ---
>
> ### Flexible Antenna Arrays for Wireless Communications: Modeling and Performance Evaluation
>
> - **作者：** Songjie Yang, Jiancheng An, Yue Xiu, Wanting Lyu, Boyu Ning, Zhongpei Zhang, Mérouane Debbah, Chau Yuen
> - **公开记录：** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2025.3545305)
> - **可确认内容：** 工作建模了旋转、弯曲和折叠阵列，并在多种方向图和扇区配置下评估形态感知预编码。
> - **阅读提示：** 文中速率增益来自作者设定的数值场景，不应被理解为与几何和传播环境无关的固定提升。
>
> ---
>
> ### Rydberg Atomic Quantum Receivers for Classical Wireless Communication and Sensing
>
> - **作者：** Tierui Gong, Aveek Chandra, Chau Yuen, Yong Liang Guan, Rainer Dumke, Chong Meng Samson See, Mérouane Debbah, Lajos Hanzo
> - **公开记录：** [IEEE Wireless Communications](https://doi.org/10.1109/mwc.015.2400381)
> - **可确认内容：** 文章介绍原子感知机制、调制与读出方案、早期实验研究，以及与经典 SISO/MIMO 系统的潜在结合方式。
> - **阅读提示：** 这是一篇教程与研究路线综述，不是原子接收机和商用传统接收机之间的完整端到端原型对比。
>
> ---
>
> ### Uncertainty Awareness in Wireless Communications and Sensing
>
> - **作者：** Shixiong Wang, Wei Dai, Jianyong Sun, Zongben Xu, Geoffrey Ye Li
> - **公开记录：** [IEEE Communications Magazine](https://doi.org/10.1109/mcom.001.2400714)
> - **可确认内容：** 文章梳理多类不确定性来源，并综述架构、计算与运行层面的应对方法。
> - **阅读提示：** 这些分类用于组织广泛文献，并不能证明某一种方法在所有通信与感知部署中都足够鲁棒。
>
> ---
>
> ### Approximate Wireless Communication for Lossy Gradient Updates in IoT Federated Learning
>
> - **作者：** Xiang Ma, Haijian Sun, Rose Qingyang Hu, Yi Qian
> - **公开记录：** [IEEE Internet of Things Journal](https://doi.org/10.1109/jiot.2024.3488377)
> - **可确认内容：** 所提比特掩蔽和格雷码设计利用了梯度的误差容忍能力；公开摘要显示，其达到相近学习目标时只使用所选对比方案 50% 的空口时间。
> - **阅读提示：** 空口时间结果来自仿真，并受到模型、调制、误差过程和对比方法的共同影响。
>
> ---
>
> ### WirelessGPT: A Generative Pre-Trained Multi-Task Learning Framework for Wireless Communication
>
> - **作者：** Tingting Yang, Ping Zhang, Mengfan Zheng, Yuxuan Shi, Liwen Jing, Jianbo Huang, Nan Li
> - **公开记录：** [IEEE Network](https://doi.org/10.1109/mnet.2025.3579496)
> - **可确认内容：** 公开摘要描述了基于大规模无线信道数据的无监督预训练、约八千万参数的初始模型，以及通过有限微调适配通信和感知任务。
> - **阅读提示：** 性能改进来自作者选定的数据、任务和基线，不能证明模型已经具备跨部署环境的普遍迁移能力。
>
> ---
>
> ### CAPA: Continuous-Aperture Arrays for Revolutionizing 6G Wireless Communications
>
> - **作者：** Yuanwei Liu, Chongjun Ouyang, Zhaolin Wang, Jiaqi Xu, Xidong Mu, Zhiguo Ding
> - **公开记录：** [IEEE Wireless Communications](https://doi.org/10.1109/mwc.001.2400493)
> - **可确认内容：** 文章介绍 CAPA 架构，回顾一个已有原型和三类材料实现路径，提出连续电流波束成形方法，并给出与离散阵列的数值比较。
> - **阅读提示：** 原型回顾、建模和数值结果属于不同层次的证据；文章没有把所有建议方案实现为同一套部署系统。
>
> ---
>
> ### Large Multi-Modal Models (LMMs) as Universal Foundation Models for AI-Native Wireless Systems
>
> - **作者：** Shengzhe Xu, Christo Kurisummoottil Thomas, Omar Hashash, Nikhil Muralidhar, Walid Saad, Naren Ramakrishnan
> - **公开记录：** [IEEE Network](https://doi.org/10.1109/mnet.2024.3427313)
> - **可确认内容：** 论文提出面向无线系统的 LMM 框架，将多模态数据、物理对应关系、检索与因果推理、环境反馈和神经符号推理联系起来，并给出初步评估。
> - **阅读提示：** 其主要贡献是愿景和架构；公开证据不足以证明已经形成跨无线领域通用的生产级模型。
>
> ---
>
> ### Integrated Sensing and Communications for Pinching-Antenna Systems (PASS)
>
> - **作者：** Zheng Zhang, Zhaolin Wang, Xidong Mu, Bingtao He, Jian Chen, Yuanwei Liu
> - **公开记录：** [IEEE Communications Letters](https://doi.org/10.1109/lcomm.2025.3619778)
> - **可确认内容：** 公开摘要描述两波导通感一体化架构、通信服务质量约束下的目标照射功率交替优化，以及与基线的数值比较。
> - **阅读提示：** 性能与等功率分配结论都来自给定 PASS 几何和信道模型下的仿真，并非硬件实测。
>
> ---
>
> ### Cramér-Rao Bounds for Integrated Sensing and Communications in Pinching-Antenna Systems
>
> - **作者：** Dimitrios Bozanis, Vasilis K. Papanikolaou, Sotiris A. Tegos, George K. Karagiannidis
> - **公开记录：** [IEEE PIMRC 2025](https://doi.org/10.1109/pimrc62392.2025.11274872)
> - **可确认内容：** 论文为双基地 PAS 链路推导距离与方向估计的闭式克拉美–罗下界，保留幅度、相位和非均匀天线位置影响，并进行数值评估。
> - **阅读提示：** 厘米级测距、亚角度分辨率和硬件用量比较属于模型驱动的数值结果，而非空口验证。
