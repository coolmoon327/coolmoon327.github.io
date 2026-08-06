---
{
  "title": "Dr. Yuzhi Yang: placing intelligence where wireless structure can guide it",
  "locale": "en",
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
  "coverKicker": "WIRELESS AI",
  "coverTitle": "Keep the model, preserve the structure",
  "coverPoints": [
    "Big cloud and small edge models",
    "Propagation as computation",
    "Neural modules inside inference"
  ],
  "description": "Six works involving Dr. Yuzhi Yang connect edge-cloud generative AI, semantic sensing, RIS-assisted computation, channel estimation, beam control, and hybrid receivers.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## Wireless AI is a question of placement, not just model size

Saying that a wireless system “uses AI” reveals very little. Intelligence may sit in a cloud service, a compact edge model, a resource controller, the initial-access procedure, the channel estimator, or the receiver’s inference graph. Across six works released in 2024–2025, Dr. Yuzhi Yang and his co-authors explore several of these placements. The strongest common idea is not to replace communication theory with a neural network. It is to combine learned components with the structure already available in the service, channel, propagation environment, or probabilistic detector.

That distinction changes how the work should be read. A large generative model and a belief-propagation receiver both involve neural computation, but they face different latency, data, and reliability constraints. Likewise, deep reinforcement learning used for beam selection is a control mechanism, whereas a neural module inserted into an iterative receiver is an inference mechanism. Treating all of them as one generic “AI-enabled network” would hide the actual engineering choices.

## Intelligence can be divided between cloud capability and edge responsiveness

[An Edge-Cloud Collaboration Framework for Generative AI Service Provision With Synergetic Big Cloud Model and Small Edge Models](https://doi.org/10.1109/mnet.2024.3420755) starts at the service layer. A capable cloud model can provide broad knowledge and support distributed training, while smaller edge models can be adapted and deployed near users for task-specific service. The framework discusses this division through collaborative training and task-oriented deployment, with image generation as an application example. Its value lies in making model placement part of network design: inference quality, communication load, privacy, and response time cannot be optimized independently.

At the link level, [Efficient Design for NOMA Enabled Integrated Sensing and Semantic Communication](https://doi.org/10.1109/vtc2024-spring62846.2024.10683200) combines non-orthogonal multiple access with sensing and semantic transmission. The formulated objective is semantic energy efficiency subject to sensing and semantic-performance constraints. Fractional programming through a Dinkelbach-style transformation and iterative optimization coordinate beamforming and semantic parameters. This is a useful contrast with edge-cloud model placement: intelligence is no longer only a workload to host, but also changes what counts as a valuable transmitted result.

## Propagation and channel knowledge can become parts of computation

[Realizing Over-the-Air Neural Networks in RIS-Assisted MIMO Communication Systems](https://doi.org/10.1109/wcnc57260.2024.10571129) asks whether signal propagation itself can participate in neural computation. In the proposed RIS-assisted MIMO setting, transmitter, reconfigurable intelligent surface, and receiver operations are designed jointly to realize a neural-network mapping over the air. The approach is conceptually different from sending inputs to a conventional accelerator after reception: the wireless transformation is part of the computation. Public material supports the architecture and numerical study, not a claim that arbitrary neural networks already run on deployed RIS hardware.

The channel must still be learned well enough for such designs to be useful. [Semi-blind Channel Estimation Leveraging Frequency Correlation](https://doi.org/10.1109/wcnc57260.2024.10570521) combines a Bayesian iterative estimator with a neural mapping across frequency. Pilots anchor the estimate, probabilistic inference exploits the signal model, and learned frequency correlation helps recover channel information where direct observations are limited. The hybrid construction matters more than the label “semi-blind”: it allocates interpretable model-based work and learned interpolation to the parts each can handle.

## Control and inference benefit from different kinds of learning

[Efficient Initial Access Based on DRL-Empowered Beam Sweeping](https://doi.org/10.1109/twc.2024.3524305) uses deep reinforcement learning to reduce the search burden of initial access. Codebook-based and multi-sampling designs narrow a large beam-sweeping action space, and the evaluation uses DeepMIMO and QuaDRiGa channel data. Here the learned policy chooses where to search; it does not replace the physical meaning of a beam. Its practical promise therefore depends on how well training environments represent the geometry and mobility encountered after deployment.

[A Hybrid Inference Architecture Incorporating Neural Network With Belief Propagation for AI Receivers](https://doi.org/10.1109/twc.2025.3552818) takes almost the opposite route. Rather than unfolding an entire iterative receiver into a monolithic trainable network, it embeds neural functional units inside belief propagation. The probabilistic graph retains a known inference structure, while learned modules address relations that are difficult to model accurately. For semi-blind OFDM reception, this offers a more disciplined hybrid than an unconstrained end-to-end replacement, while still leaving training distribution, complexity, and hardware realization as important deployment questions.

The six works form a useful hierarchy. Put powerful general models in the cloud and responsive specialized models at the edge; define link objectives around task meaning as well as bits; exploit propagation when it can perform part of the mapping; retain Bayesian or graphical structure when it is trustworthy; and use reinforcement learning for sequential choices whose uncertainty genuinely calls for it. The recurring design principle is selective learning: the model should enter exactly where structure stops being sufficient, not where structure has merely been overlooked.

## Research notes

> ### An Edge-Cloud Collaboration Framework for Generative AI Service Provision With Synergetic Big Cloud Model and Small Edge Models
>
> - **Authors:** Yuqing Tian, Zhaoyang Zhang, Yuzhi Yang, Zirui Chen, Zhaohui Yang, Richeng Jin, Tony Q. S. Quek, Kai-Kit Wong
> - **Public record:** [IEEE Network](https://doi.org/10.1109/mnet.2024.3420755)
> - **What is established:** The framework coordinates a large cloud model and smaller edge models through distributed training and task-oriented deployment.
> - **Read with care:** The image-generation example illustrates the architecture; it does not establish universal quality, latency, or privacy gains for every generative service.
>
> ---
>
> ### Efficient Design for NOMA Enabled Integrated Sensing and Semantic Communication
>
> - **Authors:** Zhouxiang Zhao, Yating Tang, Yuzhi Yang, Yuanyuan Dong, Lexi Xu, Zhaohui Yang, Zhaoyang Zhang
> - **Public record:** [IEEE VTC-Spring 2024](https://doi.org/10.1109/vtc2024-spring62846.2024.10683200)
> - **What is established:** A semantic-energy-efficiency problem combines NOMA, sensing constraints, semantic requirements, and iterative resource optimization.
> - **Read with care:** Efficiency gains are tied to the selected semantic metric, channel model, sensing target, and numerical baselines.
>
> ---
>
> ### Realizing Over-the-Air Neural Networks in RIS-Assisted MIMO Communication Systems
>
> - **Authors:** Yuzhi Yang, Zhaoyang Zhang, Yuqing Tian, Zhaohui Yang, Richeng Jin, Lei Liu, Chongwen Huang
> - **Public record:** [IEEE WCNC 2024](https://doi.org/10.1109/wcnc57260.2024.10571129)
> - **What is established:** Transmitter, RIS, and receiver transformations are jointly designed to realize a neural mapping through a MIMO wireless channel.
> - **Read with care:** The work provides a technical design and numerical evaluation, not evidence of general-purpose neural inference on deployed RIS hardware.
>
> ---
>
> ### Semi-blind Channel Estimation Leveraging Frequency Correlation
>
> - **Authors:** Yuzhi Yang, Zhaoyang Zhang, Zirui Chen, Zhaohui Yang
> - **Public record:** [IEEE WCNC 2024](https://doi.org/10.1109/wcnc57260.2024.10570521)
> - **What is established:** Bayesian iterative estimation and a learned frequency-correlation mapping are combined to reduce reliance on direct pilot observations.
> - **Read with care:** Accuracy and pilot savings depend on the modeled channel, correlation, signal-to-noise conditions, and training distribution.
>
> ---
>
> ### Efficient Initial Access Based on DRL-Empowered Beam Sweeping
>
> - **Authors:** Jingze Che, Zhaoyang Zhang, Yuzhi Yang, Zhaohui Yang
> - **Public record:** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2024.3524305)
> - **What is established:** Codebook-based and multi-sampling deep-RL designs reduce the beam-search burden for initial access.
> - **Read with care:** Evaluation on DeepMIMO and QuaDRiGa data does not remove the need to test distribution shift, mobility, and real-time decision cost.
>
> ---
>
> ### A Hybrid Inference Architecture Incorporating Neural Network With Belief Propagation for AI Receivers
>
> - **Authors:** Yuzhi Yang, Zhaoyang Zhang, Zirui Chen, Zhaohui Yang, Lei Liu, Chongwen Huang, Mérouane Debbah
> - **Public record:** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2025.3552818)
> - **What is established:** Neural functional units are embedded in belief propagation to form a hybrid semi-blind OFDM receiver.
> - **Read with care:** Numerical receiver results do not by themselves settle training robustness, implementation complexity, or hardware efficiency.
