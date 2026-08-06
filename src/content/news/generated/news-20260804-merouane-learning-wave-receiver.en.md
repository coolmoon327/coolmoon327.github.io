---
{
  "title": "Prof. Mérouane Debbah: learning across waves, networks, and receiver physics",
  "locale": "en",
  "slug": "merouane-learning-wave-receiver",
  "newsId": "news-20260804-merouane-learning-wave-receiver",
  "translationKey": "news-20260804-merouane-learning-wave-receiver",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2024-01-26",
  "coverageEnd": "2025-03-26",
  "module": "interests",
  "keywords": [
    "isac",
    "wireless-communications",
    "learning-enabled-wireless",
    "semantic-communications",
    "edge-and-fog-systems",
    "reinforcement-learning",
    "resource-allocation",
    "convex-optimization",
    "ris",
    "adversarial-wireless-learning",
    "resilient-wireless",
    "secure-6g",
    "movable-antennas",
    "noma",
    "physical-layer-security"
  ],
  "authors": [
    "Tierui Gong",
    "Aveek Chandra",
    "Chau Yuen",
    "Yong Liang Guan",
    "Rainer Dumke",
    "Chong Meng Samson See",
    "Mérouane Debbah",
    "Lajos Hanzo",
    "Bingyan Xie",
    "Yongpeng Wu",
    "Yuxuan Shi",
    "Wenjun Zhang",
    "Shuguang Cui",
    "Mintae Kim",
    "Hoon Lee",
    "Sangwon Hwang",
    "Inkyu Lee",
    "Fenghao Zhu",
    "Xinquan Wang",
    "Chongwen Huang",
    "Zhaohui Yang",
    "Xiaoming Chen",
    "Ahmed Al Hammadi",
    "Zhaoyang Zhang",
    "Bui Duc Son",
    "Nguyen Tien Hoa",
    "Trinh Van Chien",
    "Waqas Khalid",
    "Mohamed Amine Ferrag",
    "Wan Choi",
    "Xu Gan",
    "Jiguang He",
    "Songjie Yang",
    "Jiancheng An",
    "Yue Xiu",
    "Wanting Lyu",
    "Boyu Ning",
    "Zhongpei Zhang",
    "Wentao Zhou",
    "Di Zhang",
    "M. W. Shabir",
    "M. Di Renzo",
    "A. Zappone",
    "Wanting Yang",
    "Zehui Xiong",
    "Song Guo",
    "Shiwen Mao",
    "Dong In Kim",
    "Yuzhi Yang",
    "Zirui Chen",
    "Lei Liu",
    "Chengjun Jiang",
    "Chensi Zhang",
    "Jianhua Ge"
  ],
  "subjectIds": [
    "merouane-debbah",
    "yuzhi-yang-wireless"
  ],
  "workIds": [
    "doi-10-1109-mwc-015-2400381",
    "doi-10-1109-twc-2024-3409735",
    "doi-10-1109-jiot-2024-3447090",
    "doi-10-1109-twc-2024-3435023",
    "doi-10-1109-jiot-2024-3373808",
    "doi-10-1109-jsac-2024-3413989",
    "doi-10-1109-twc-2025-3545305",
    "doi-10-1109-twc-2024-3363766",
    "doi-10-1109-lwc-2025-3529778",
    "doi-10-1109-tmc-2025-3560582",
    "doi-10-1109-twc-2025-3552818",
    "doi-10-1109-jiot-2024-3416319"
  ],
  "focusSubjectId": "merouane-debbah",
  "coverTone": "mint",
  "coverKicker": "MÉROUANE DEBBAH",
  "coverTitle": "Redesign the receiver, the channel, and the task together",
  "coverPoints": [
    "Atomic sensing",
    "Wave-domain learning",
    "Robust network intelligence"
  ],
  "description": "Twelve works made public in 2024–2025 connect new receiver physics, shape-adaptive arrays, secure propagation design, hybrid AI inference, edge control, and network fundamentals.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## Wireless intelligence now crosses several physical boundaries

The works selected for Prof. Mérouane Debbah, made public from 2024 into 2025, span an unusually wide chain: how a receiver senses an electromagnetic field, how antenna geometry and a controllable environment shape that field, how neural networks share inference with established signal models, how distributed agents coordinate edge resources, and how large networks should be analyzed before those mechanisms are deployed. The breadth is not accidental. As radios become programmable and learning enters the protocol stack, receiver physics, propagation, computation, and application value can no longer be optimized as isolated blocks.

[Rydberg Atomic Quantum Receivers for Classical Wireless Communication and Sensing](https://doi.org/10.1109/mwc.015.2400381) begins at the physical front end. The article explains how electromagnetically induced transparency and Autler–Townes splitting allow Rydberg atoms to translate radio-frequency fields into an optical readout. It surveys modulation and measurement methods, early experiments, and possible SISO and MIMO integration with classical wireless links. It is a tutorial and research roadmap, not evidence that an atomic receiver is already a drop-in replacement for commercial RF hardware. Its importance is that it makes the sensing mechanism itself a design variable.

[Flexible Antenna Arrays for Wireless Communications: Modeling and Performance Evaluation](https://doi.org/10.1109/twc.2025.3545305) makes the array geometry variable as well. It models how rotation, bending, and folding change element positions and orientations, then evaluates shape-aware precoding under several configurations. The numerical gains depend on those antenna patterns, sectors, and propagation assumptions. The durable shift is architectural: mechanical form and signal processing are treated as a coupled design problem rather than as two sequential engineering stages.

## Let propagation and representation adapt together

[Robust Beamforming for RIS-aided Communications: Gradient-based Manifold Meta Learning](https://doi.org/10.1109/twc.2024.3435023) moves control into the channel. Reconfigurable intelligent surface phases lie on a constrained geometric space, while imperfect channel state information makes a solution trained for one condition brittle. The proposed method combines gradient-based meta-learning with manifold optimization so that beamforming can adapt across channel conditions without discarding the surface’s phase constraints. Its numerical results support the method under the tested uncertainty models; over-the-air calibration and control remain separate engineering questions.

[Exploiting RIS in Secure Beamforming Design for NOMA-Assisted Integrated Sensing and Communication](https://doi.org/10.1109/jiot.2024.3416319) asks what happens when the sensing target may also eavesdrop. The base-station beams and RIS phases are alternated under transmit-power, communication-QoS, and sensing-quality constraints, with successive convex approximation and second-order-cone structure inside the update. The simulations support simultaneous improvements in the modeled secure communication and target detection objectives. They do not establish security beyond the assumed target, CSI, NOMA, and RIS models; the lasting contribution is to place communication, sensing, and secrecy inside one propagation-control problem.

Two companion studies make the mathematical structure of that control more explicit. [Robust Precoding Designs for Multiuser MIMO Systems With Limited Feedback](https://doi.org/10.1109/twc.2024.3363766) approximates the second-order statistics of quantized channels and uses them in robust MMSE and WMMSE precoders. [Electromagnetically Consistent Optimization Algorithms for the Global Design of RIS](https://doi.org/10.1109/lwc.2025.3529778) instead starts from an inhomogeneous impedance boundary and constructs tractable sequences of constrained programs. In both cases, the guarantee belongs to a stated model or approximation: the simulations do not make limited feedback harmless, and monotonic convergence of the RIS design sequence is not unrestricted global optimality for arbitrary hardware.

[Robust Image Semantic Coding with Learnable CSI Fusion Masking over MIMO Fading Channels](https://doi.org/10.1109/twc.2024.3409735) adapts the transmitted representation as well. Instead of protecting every source bit equally, the system learns an image representation and fuses channel-state information through a masking mechanism. This allows the encoder and decoder to respond to MIMO fading while preserving task-relevant visual content. The experiments establish robustness for the reported datasets and channel conditions, not universal semantic fidelity. Still, the pairing with RIS beamforming is revealing: one work learns how to shape propagation, while the other learns what should survive it.

[A Hybrid Inference Architecture Incorporating Neural Network With Belief Propagation for AI Receivers](https://doi.org/10.1109/twc.2025.3552818) keeps a different kind of structure intact. Neural functional units are embedded inside belief propagation for semi-blind OFDM reception, so learned components address relationships that resist accurate modeling while the probabilistic graph retains known inference logic. The public record supports the architecture and its numerical evaluation; training robustness, implementation cost, and hardware efficiency remain deployment questions. The point is not to replace a receiver wholesale, but to locate learning where the model is weakest.

## Coordinate decisions, but do not ignore how learning can fail

At the network level, [Cooperative Multi-Agent Deep Reinforcement Learning Methods for UAV-aided Mobile Edge Computing Networks](https://doi.org/10.1109/jiot.2024.3447090) considers several mobile agents whose trajectories, offloading choices, and resource decisions affect one another. Cooperative multi-agent deep reinforcement learning is used to manage the coupled state and action space. This is precisely where centralized optimization can become difficult and independent agents can work at cross-purposes. The simulations show the proposed coordination under the paper’s mobility and workload models, while real deployments would also need to absorb communication delay, safety constraints, and distribution shift.

[Efficient Multi-User Offloading of Personalized Diffusion Models: A DRL-Convex Hybrid Solution](https://doi.org/10.1109/tmc.2025.3560582) uses the same principle of selective learning for generative inference at the edge. It divides personalized diffusion execution between a batched shared model and user-specific stages, then turns the generalized quadratic assignment into a sequence in which deep reinforcement learning handles adaptive combinatorial choices and convex optimization handles the tractable part. The latency–accuracy and complexity results are tied to the modeled users, resources, and inference process. What transfers beyond that experiment is the separation of responsibilities: mathematical structure should not be relearned merely because one part of a decision is uncertain.

Learning also creates a new attack surface. [Adversarial Attacks and Defenses in 6G Network-Assisted IoT Systems](https://doi.org/10.1109/jiot.2024.3373808) organizes adversarial threats and defenses for machine-learning components in network-assisted IoT, then supplements the survey with simulation studies. The article is valuable because it does not equate high clean-data accuracy with trustworthy network control. Evasion, poisoning, and model-level weaknesses must be considered alongside conventional radio and protocol threats. The proposed taxonomy and experiments guide evaluation, but they do not certify any single defense against adaptive attackers.

## Network-level laws remain the necessary baseline

[Coverage and Rate Analysis for Integrated Sensing and Communication Networks](https://doi.org/10.1109/jsac.2024.3413989) supplies a system-level foundation for integrated sensing and communication. Using stochastic geometry, it characterizes coverage and rate behavior as sensing and communication functions share spatial infrastructure and radio resources. Such analysis deliberately abstracts away implementation detail to expose scaling and trade-offs across a network. It therefore complements, rather than competes with, learning-based designs: before an adaptive controller is credited with a gain, the underlying geometry, interference, and shared-resource baseline must be understood.

Together, these works suggest a disciplined way to approach “intelligent” wireless systems. New receiver physics expands what can be observed; flexible arrays and reconfigurable surfaces expand what can be controlled. Robust and secure optimization expose the assumptions behind that control, while semantic encoders and hybrid receivers decide where learning adds information rather than obscuring structure. Multi-agent and edge learning coordinate decisions that are too coupled for isolated policies, adversarial analysis tests whether those policies can be trusted, and stochastic geometry provides the network baseline against which improvement is measured. The result is not one monolithic AI-native radio. It is a set of carefully placed interfaces between physics, learning, optimization, security, and communication theory.

## Research notes

> ### Rydberg Atomic Quantum Receivers for Classical Wireless Communication and Sensing
>
> - **Authors:** Tierui Gong, Aveek Chandra, Chau Yuen, Yong Liang Guan, Rainer Dumke, Chong Meng Samson See, Mérouane Debbah, Lajos Hanzo
> - **Public record:** [IEEE Wireless Communications](https://doi.org/10.1109/mwc.015.2400381)
> - **What is established:** The article reviews Rydberg-atom RF sensing mechanisms, readout and modulation methods, experimental literature, and possible classical SISO/MIMO integration.
> - **Read with care:** It is a tutorial and roadmap, not a single end-to-end atomic receiver benchmark against commercial hardware.
>
> ---
>
> ### Robust Image Semantic Coding with Learnable CSI Fusion Masking over MIMO Fading Channels
>
> - **Authors:** Bingyan Xie, Yongpeng Wu, Yuxuan Shi, Wenjun Zhang, Shuguang Cui, Mérouane Debbah
> - **Public record:** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2024.3409735)
> - **What is established:** The learned image codec fuses channel-state information through masking and is evaluated over MIMO fading channels.
> - **Read with care:** Reconstruction and robustness results depend on the tested datasets, channel models, CSI quality, and learned architecture.
>
> ---
>
> ### Cooperative Multi-Agent Deep Reinforcement Learning Methods for UAV-aided Mobile Edge Computing Networks
>
> - **Authors:** Mintae Kim, Hoon Lee, Sangwon Hwang, Mérouane Debbah, Inkyu Lee
> - **Public record:** [IEEE Internet of Things Journal](https://doi.org/10.1109/jiot.2024.3447090)
> - **What is established:** Cooperative multi-agent deep reinforcement learning is developed for coupled UAV trajectory, offloading, and edge-resource decisions.
> - **Read with care:** Benefits are simulation results under the paper’s mobility, observation, wireless, and computation assumptions.
>
> ---
>
> ### Robust Beamforming for RIS-aided Communications: Gradient-based Manifold Meta Learning
>
> - **Authors:** Fenghao Zhu, Xinquan Wang, Chongwen Huang, Zhaohui Yang, Xiaoming Chen, Ahmed Al Hammadi, Zhaoyang Zhang, Chau Yuen, Mérouane Debbah
> - **Public record:** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2024.3435023)
> - **What is established:** The method combines gradient-based meta-learning and manifold-constrained optimization for robust RIS beamforming under channel uncertainty.
> - **Read with care:** Adaptation results are numerical; surface control, channel acquisition, and hardware mismatch need separate validation.
>
> ---
>
> ### Adversarial Attacks and Defenses in 6G Network-Assisted IoT Systems
>
> - **Authors:** Bui Duc Son, Nguyen Tien Hoa, Trinh Van Chien, Waqas Khalid, Mohamed Amine Ferrag, Wan Choi, Mérouane Debbah
> - **Public record:** [IEEE Internet of Things Journal](https://doi.org/10.1109/jiot.2024.3373808)
> - **What is established:** The paper surveys adversarial machine-learning threats and defenses for network-assisted IoT and adds simulation-based case studies.
> - **Read with care:** A taxonomy and selected experiments cannot guarantee robustness against every adaptive attacker or deployment shift.
>
> ---
>
> ### Coverage and Rate Analysis for Integrated Sensing and Communication Networks
>
> - **Authors:** Xu Gan, Chongwen Huang, Zhaohui Yang, Xiaoming Chen, Jiguang He, Zhaoyang Zhang, Chau Yuen, Yong Liang Guan, Mérouane Debbah
> - **Public record:** [IEEE Journal on Selected Areas in Communications](https://doi.org/10.1109/jsac.2024.3413989)
> - **What is established:** Stochastic-geometry analysis characterizes coverage and rate in networks that share infrastructure and resources between sensing and communication.
> - **Read with care:** The conclusions follow the paper’s spatial, propagation, association, and interference assumptions rather than a specific field deployment.
>
> ---
>
> ### Flexible Antenna Arrays for Wireless Communications: Modeling and Performance Evaluation
>
> - **Authors:** Songjie Yang, Jiancheng An, Yue Xiu, Wanting Lyu, Boyu Ning, Zhongpei Zhang, Mérouane Debbah, Chau Yuen
> - **Public record:** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2025.3545305)
> - **What is established:** The work models rotated, bent, and folded arrays and evaluates shape-aware precoding across several antenna-pattern and sector configurations.
> - **Read with care:** Reported rate improvements are numerical and should not be treated as geometry-independent gains.
>
> ---
>
> ### Robust Precoding Designs for Multiuser MIMO Systems With Limited Feedback
>
> - **Authors:** Wentao Zhou, Di Zhang, Mérouane Debbah, Inkyu Lee
> - **Public record:** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2024.3363766)
> - **What is established:** An approximation to quantized-channel second-order statistics supports robust MMSE and WMMSE precoder designs.
> - **Read with care:** The rate comparisons are simulation-based and depend on the limited-feedback and quantization model.
>
> ---
>
> ### Electromagnetically Consistent Optimization Algorithms for the Global Design of RIS
>
> - **Authors:** M. W. Shabir, M. Di Renzo, A. Zappone, Mérouane Debbah
> - **Public record:** [IEEE Wireless Communications Letters](https://doi.org/10.1109/lwc.2025.3529778)
> - **What is established:** Surface-impedance design problems are approximated by sequences of constrained programs with stated polynomial complexity and monotonic objective convergence.
> - **Read with care:** These properties concern the proposed approximations under the electromagnetic model, not unrestricted global optimality for arbitrary RIS hardware.
>
> ---
>
> ### Efficient Multi-User Offloading of Personalized Diffusion Models: A DRL-Convex Hybrid Solution
>
> - **Authors:** Wanting Yang, Zehui Xiong, Song Guo, Shiwen Mao, Dong In Kim, Mérouane Debbah
> - **Public record:** [IEEE Transactions on Mobile Computing](https://doi.org/10.1109/tmc.2025.3560582)
> - **What is established:** Personalized diffusion inference is split across edge and user-specific stages, with deep reinforcement learning and convex optimization assigned to different parts of the offloading decision.
> - **Read with care:** Latency–accuracy gains and complexity comparisons follow the modeled resources, users, and inference process.
>
> ---
>
> ### A Hybrid Inference Architecture Incorporating Neural Network With Belief Propagation for AI Receivers
>
> - **Authors:** Yuzhi Yang, Zhaoyang Zhang, Zirui Chen, Zhaohui Yang, Lei Liu, Chongwen Huang, Mérouane Debbah
> - **Public record:** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2025.3552818)
> - **What is established:** Neural functional units are embedded in belief propagation to form a hybrid semi-blind OFDM receiver.
> - **Read with care:** Numerical receiver results do not by themselves settle training robustness, implementation complexity, or hardware efficiency.
>
> ---
>
> ### Exploiting RIS in Secure Beamforming Design for NOMA-Assisted Integrated Sensing and Communication
>
> - **Authors:** Chengjun Jiang, Chensi Zhang, Chongwen Huang, Jianhua Ge, Mérouane Debbah, Chau Yuen
> - **Public record:** [IEEE Internet of Things Journal](https://doi.org/10.1109/jiot.2024.3416319)
> - **What is established:** Alternating optimization combines successive convex approximation and second-order-cone structure to coordinate base-station beamforming and RIS phases under communication, sensing, and power constraints.
> - **Read with care:** Secure-communication and target-detection gains are simulation results for the modeled target/eavesdropper, CSI, NOMA, and RIS assumptions.
