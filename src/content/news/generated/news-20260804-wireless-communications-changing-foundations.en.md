---
{
  "title": "Wireless communications when the radio itself becomes programmable",
  "locale": "en",
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
  "coverKicker": "WIRELESS COMMUNICATIONS",
  "coverTitle": "The radio becomes part of the algorithm",
  "coverPoints": [
    "Continuous apertures",
    "Shape-changing arrays",
    "Task-aware links"
  ],
  "description": "Ten works connect continuous and shape-changing apertures, unconventional receivers, pinching-antenna sensing, wireless foundation models, uncertainty, and task-aware links.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## The radio is becoming part of the algorithm

Classical link design often begins with a fixed antenna array, a familiar receiver chain, and a target such as rate or reliability. The ten works collected here loosen all three assumptions. They treat current distributions, array shape, radiating position, sensing physics, learned representations, and even acceptable error as design variables. The result is not one candidate air interface. It is a change in where wireless engineering draws the boundary between hardware, propagation, signal processing, and the task that ultimately consumes the link.

## From discrete elements to controllable apertures

Continuous-aperture arrays replace a finite list of antenna weights with a current distribution over an electrically large surface. [CAPA: Continuous-Aperture Arrays for Revolutionizing 6G Wireless Communications](https://doi.org/10.1109/mwc.001.2400493), co-authored by Prof. Zhiguo Ding, introduces this architecture through an existing prototype, electronic, optical, and acoustic implementation routes, and beamforming methods that differ from those for spatially discrete arrays. Its numerical comparisons motivate CAPA through capacity and diversity–multiplexing behavior, while its open problems make clear that electromagnetic realization and communication-theoretic abstraction still have to meet.

[Continuous-Aperture Array (CAPA)-Based Wireless Communications: Capacity Characterization](https://doi.org/10.1109/twc.2025.3579677) supplies a more focused analytical foundation. It derives capacity results for single- and two-user uplink and downlink models, including capacity-achieving current distributions and uplink–downlink transformations. One finding is deliberately sobering: under the studied channel and aperture models, capacity approaches a finite limit as the aperture grows. A larger physical surface can create more useful spatial structure, but it does not repeal the assumptions that bound the channel.

A flexible array makes geometry itself adjustable. [Flexible Antenna Arrays for Wireless Communications: Modeling and Performance Evaluation](https://doi.org/10.1109/twc.2025.3545305), co-authored by Prof. Mérouane Debbah, models changes in element position and orientation caused by rotation, bending, and folding, then combines them with several precoding strategies. The reported gains depend on the simulated configuration. The durable idea is that mechanical shape can join beamforming as a coordinated variable instead of remaining a fixed packaging decision.

## New sensing mechanisms make space an active resource

[Rydberg Atomic Quantum Receivers for Classical Wireless Communication and Sensing](https://doi.org/10.1109/mwc.015.2400381), also co-authored by Prof. Mérouane Debbah, shifts attention from the aperture to the receiver. It reviews how electromagnetically induced transparency and Autler–Townes splitting can translate an RF field into an optical readout, surveys early experiments, and outlines SISO and MIMO integration. The article maps mechanisms and integration questions; it does not show that atomic receivers can already replace conventional commercial front ends.

Pinching-antenna systems make the radiating points along a dielectric waveguide reconfigurable. [Integrated Sensing and Communications for Pinching-Antenna Systems (PASS)](https://doi.org/10.1109/lcomm.2025.3619778) separates transmission and echo reception across two waveguides, then uses penalty-based alternating optimization to raise target illumination power while preserving communication quality of service. Its simulations also report that equal power allocation can approach optimized allocation in the tested setting. [Cramér-Rao Bounds for Integrated Sensing and Communications in Pinching-Antenna Systems](https://doi.org/10.1109/pimrc62392.2025.11274872) asks the complementary estimation question: for a bistatic link with waveguide-mounted pinching antennas and a uniform linear receive array, how accurately can range and direction be inferred? Closed-form Cramér–Rao lower bounds retain amplitude, phase, and non-uniform placement effects. Numerical centimeter-level ranging and sub-degree angular resolution describe the paper’s model and comparisons, not a deployed sensing guarantee.

Together, the atomic-receiver and PASS studies illustrate two different ways to make the surrounding field useful. One changes how an RF field is observed; the other changes where it is excited and how its echo is collected. Both require the physical mechanism to remain visible in the signal model.

## Foundation models and task-aware links move the other boundary

The design space also expands above the physical layer. [WirelessGPT: A Generative Pre-Trained Multi-Task Learning Framework for Wireless Communication](https://doi.org/10.1109/mnet.2025.3579496) uses unsupervised pretraining on large wireless-channel datasets to learn a shared representation for communication and sensing tasks. The public abstract describes an initial model of roughly 80 million parameters, limited fine-tuning for downstream tasks, and numerical improvements over selected conventional and smaller-model baselines. Those results establish a multi-task research prototype, not universal transfer across channels, hardware, or deployment domains.

[Large Multi-Modal Models (LMMs) as Universal Foundation Models for AI-Native Wireless Systems](https://doi.org/10.1109/mnet.2024.3427313) takes a broader architectural route. It connects multimodal sensing, physical grounding through causal reasoning and retrieval, and adaptation through environment feedback and neuro-symbolic reasoning. Preliminary experiments examine grounding and mathematical responses, but the paper is primarily a framework and research agenda. Read beside WirelessGPT, it separates two questions that are easy to conflate: whether a representation transfers across measured wireless tasks, and whether a general model remains grounded enough to reason about the physical system it is asked to control.

Neither learning framework removes uncertainty. [Uncertainty Awareness in Wireless Communications and Sensing](https://doi.org/10.1109/mcom.001.2400714) organizes uncertainty arising from incomplete models, scarce data, imperfect measurements, limited computation, and environmental evolution. It links these sources to architectural diversity, robust signal processing, risk-informed optimization, and trustworthy machine learning. This taxonomy is useful precisely because a larger model or a richer aperture can fail for different reasons; robustness begins by naming which uncertainty is present.

At the application boundary, [Approximate Wireless Communication for Lossy Gradient Updates in IoT Federated Learning](https://doi.org/10.1109/jiot.2024.3488377) asks whether every corrupted gradient bit deserves correction or retransmission. Its receiver masks implausible gradient values and uses Gray coding to protect significant bits in high-order modulation. In the reported simulations, it reaches similar learning objectives with half the air time of the compared error-correction and retransmission scheme. The figure is specific to the tested task and channel, but the principle is broader: when downstream error tolerance can be measured, link quality should be judged partly by task outcome rather than bit fidelity alone.

## Wider freedom demands more explicit evidence

These works enlarge wireless design from both directions. Continuous, flexible, and pinching apertures make the electromagnetic interface programmable; atomic sensing changes the receiver mechanism; foundation models and approximate communication make representation and task utility explicit. Each added degree of freedom also adds an assumption that can fail. Capacity bounds, estimation bounds, simulation baselines, public experiments, and application metrics therefore need to remain distinguishable. The most credible path is not to optimize everything in one opaque loop, but to connect physical mechanisms, learned models, uncertainty, and task value through interfaces whose evidence can still be inspected.

## Research notes

> ### Continuous-Aperture Array (CAPA)-Based Wireless Communications: Capacity Characterization
>
> - **Authors:** Boqun Zhao, Chongjun Ouyang, Xingqi Zhang, Yuanwei Liu
> - **Public record:** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2025.3579677)
> - **What is established:** The public abstract describes analytical capacity results, multiuser uplink and downlink characterizations, and numerical comparisons with spatially discrete arrays.
> - **Read with care:** The finite capacity limit and array comparisons follow the paper’s analytical channel and aperture models; they are not measurements of every possible CAPA implementation.
>
> ---
>
> ### Flexible Antenna Arrays for Wireless Communications: Modeling and Performance Evaluation
>
> - **Authors:** Songjie Yang, Jiancheng An, Yue Xiu, Wanting Lyu, Boyu Ning, Zhongpei Zhang, Mérouane Debbah, Chau Yuen
> - **Public record:** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2025.3545305)
> - **What is established:** The work models rotated, bent, and folded arrays and evaluates shape-aware precoding for several antenna-pattern and sector configurations.
> - **Read with care:** The rate improvements come from the authors’ numerical scenarios and should not be treated as geometry-independent gains.
>
> ---
>
> ### Rydberg Atomic Quantum Receivers for Classical Wireless Communication and Sensing
>
> - **Authors:** Tierui Gong, Aveek Chandra, Chau Yuen, Yong Liang Guan, Rainer Dumke, Chong Meng Samson See, Mérouane Debbah, Lajos Hanzo
> - **Public record:** [IEEE Wireless Communications](https://doi.org/10.1109/mwc.015.2400381)
> - **What is established:** The article reviews atomic sensing mechanisms, modulation and optical-readout schemes, early experiments, and possible classical SISO/MIMO integration.
> - **Read with care:** It is a tutorial and research roadmap, not an end-to-end comparison with conventional commercial receivers.
>
> ---
>
> ### Uncertainty Awareness in Wireless Communications and Sensing
>
> - **Authors:** Shixiong Wang, Wei Dai, Jianyong Sun, Zongben Xu, Geoffrey Ye Li
> - **Public record:** [IEEE Communications Magazine](https://doi.org/10.1109/mcom.001.2400714)
> - **What is established:** The article classifies several sources of uncertainty and surveys architectural, computational, and operational responses.
> - **Read with care:** Its categories organize a broad literature; they do not certify one method as robust across all communication and sensing deployments.
>
> ---
>
> ### Approximate Wireless Communication for Lossy Gradient Updates in IoT Federated Learning
>
> - **Authors:** Xiang Ma, Haijian Sun, Rose Qingyang Hu, Yi Qian
> - **Public record:** [IEEE Internet of Things Journal](https://doi.org/10.1109/jiot.2024.3488377)
> - **What is established:** The bit-masking and Gray-coding design exploits gradient error tolerance; the public abstract reports comparable learning objectives with 50% of the air time used by the selected baseline.
> - **Read with care:** The air-time result is simulation-based and depends on the tested model, modulation, error process, and comparison scheme.
>
> ---
>
> ### WirelessGPT: A Generative Pre-Trained Multi-Task Learning Framework for Wireless Communication
>
> - **Authors:** Tingting Yang, Ping Zhang, Mengfan Zheng, Yuxuan Shi, Liwen Jing, Jianbo Huang, Nan Li
> - **Public record:** [IEEE Network](https://doi.org/10.1109/mnet.2025.3579496)
> - **What is established:** The public abstract describes unsupervised pretraining on large wireless-channel datasets, an initial roughly 80-million-parameter model, and adaptation to communication and sensing tasks with limited fine-tuning.
> - **Read with care:** The reported gains are numerical comparisons on the authors’ selected datasets, tasks, and baselines; they do not establish deployment-wide transfer.
>
> ---
>
> ### CAPA: Continuous-Aperture Arrays for Revolutionizing 6G Wireless Communications
>
> - **Authors:** Yuanwei Liu, Chongjun Ouyang, Zhaolin Wang, Jiaqi Xu, Xidong Mu, Zhiguo Ding
> - **Public record:** [IEEE Wireless Communications](https://doi.org/10.1109/mwc.001.2400493)
> - **What is established:** The article presents the CAPA architecture, reviews a prototype and three material-based implementation routes, proposes continuous-current beamforming methods, and reports numerical comparisons with discrete arrays.
> - **Read with care:** Prototype review, modeling, and numerical results occupy different evidence levels; the article does not demonstrate every proposed implementation as one deployed system.
>
> ---
>
> ### Large Multi-Modal Models (LMMs) as Universal Foundation Models for AI-Native Wireless Systems
>
> - **Authors:** Shengzhe Xu, Christo Kurisummoottil Thomas, Omar Hashash, Nikhil Muralidhar, Walid Saad, Naren Ramakrishnan
> - **Public record:** [IEEE Network](https://doi.org/10.1109/mnet.2024.3427313)
> - **What is established:** The paper proposes a wireless-centric LMM framework built around multimodal data, physical grounding, retrieval and causal reasoning, environment feedback, and neuro-symbolic reasoning, with preliminary evaluations.
> - **Read with care:** It is principally a vision and architecture paper; the public evidence does not establish a general-purpose production model across wireless domains.
>
> ---
>
> ### Integrated Sensing and Communications for Pinching-Antenna Systems (PASS)
>
> - **Authors:** Zheng Zhang, Zhaolin Wang, Xidong Mu, Bingtao He, Jian Chen, Yuanwei Liu
> - **Public record:** [IEEE Communications Letters](https://doi.org/10.1109/lcomm.2025.3619778)
> - **What is established:** The public abstract describes a two-waveguide ISAC architecture, penalty-based alternating optimization of illumination power under communication quality-of-service constraints, and numerical baseline comparisons.
> - **Read with care:** The performance and equal-power observation are simulation results for the stated PASS geometry and channel model, not hardware measurements.
>
> ---
>
> ### Cramér-Rao Bounds for Integrated Sensing and Communications in Pinching-Antenna Systems
>
> - **Authors:** Dimitrios Bozanis, Vasilis K. Papanikolaou, Sotiris A. Tegos, George K. Karagiannidis
> - **Public record:** [IEEE PIMRC 2025](https://doi.org/10.1109/pimrc62392.2025.11274872)
> - **What is established:** The paper derives closed-form range and direction Cramér–Rao lower bounds for a bistatic PAS link while retaining amplitude, phase, and non-uniform antenna-placement effects, then evaluates them numerically.
> - **Read with care:** Centimeter-level ranging, sub-degree angular resolution, and hardware-efficiency comparisons are model-based numerical findings rather than an over-the-air validation.
