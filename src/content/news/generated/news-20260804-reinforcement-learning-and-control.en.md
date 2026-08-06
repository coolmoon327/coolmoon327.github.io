---
{
  "title": "When reinforcement learning belongs in the wireless control loop",
  "locale": "en",
  "slug": "reinforcement-learning-and-control",
  "newsId": "news-20260804-reinforcement-learning-and-control",
  "translationKey": "news-20260804-reinforcement-learning-and-control",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2024-01-30",
  "coverageEnd": "2025-04-02",
  "module": "fields",
  "keywords": [
    "edge-and-fog-systems",
    "reinforcement-learning",
    "resource-allocation",
    "convex-optimization",
    "online-optimization",
    "ai-native-wireless",
    "isac",
    "learning-enabled-wireless",
    "wireless-communications",
    "anti-jamming",
    "resilient-wireless",
    "physical-layer-security"
  ],
  "authors": [
    "Mintae Kim",
    "Hoon Lee",
    "Sangwon Hwang",
    "Mérouane Debbah",
    "Inkyu Lee",
    "Wanting Yang",
    "Zehui Xiong",
    "Song Guo",
    "Shiwen Mao",
    "Dong In Kim",
    "Rasika Vijithasena",
    "Rafaela Scaciota",
    "Mehdi Bennis",
    "Sumudu Samarakoon",
    "Ruoyang Chen",
    "Changyan Yi",
    "Fuhui Zhou",
    "Jiawen Kang",
    "Yuan Wu",
    "Dusit Niyato",
    "Jinhao Ouyang",
    "Yuan Liu",
    "Hang Liu",
    "Tingting Yang",
    "Ping Zhang",
    "Mengfan Zheng",
    "Yuxuan Shi",
    "Liwen Jing",
    "Jianbo Huang",
    "Nan Li",
    "Luliang Jia",
    "Nan Qi",
    "Zhe Su",
    "Feihuang Chu",
    "Shengliang Fang",
    "Kai-Kit Wong",
    "Chan-Byoung Chae",
    "Zihan Song",
    "Yang Lu",
    "Xianhao Chen",
    "Bo Ai",
    "Zhangdui Zhong",
    "Yihui Chen",
    "Helin Yang",
    "Xiaoyu Ou",
    "Yifu Jiang",
    "Shengzhe Xu",
    "Christo Kurisummoottil Thomas",
    "Omar Hashash",
    "Nikhil Muralidhar",
    "Walid Saad",
    "Naren Ramakrishnan"
  ],
  "subjectIds": [
    "merouane-debbah"
  ],
  "workIds": [
    "doi-10-1109-jiot-2024-3447090",
    "doi-10-1109-tmc-2025-3560582",
    "doi-10-1109-pimrc59610-2024-10817284",
    "doi-10-1109-tmc-2025-3582755",
    "doi-10-1109-tmc-2025-3557838",
    "doi-10-1109-mnet-2025-3579496",
    "doi-10-1109-comst-2024-3482973",
    "doi-10-1109-tvt-2024-3442167",
    "doi-10-1109-lwc-2024-3496437",
    "doi-10-1109-mnet-2024-3427313"
  ],
  "coverTone": "mint",
  "coverKicker": "REINFORCEMENT LEARNING",
  "coverTitle": "Learn only what structure cannot settle",
  "coverPoints": [
    "Multi-agent coordination",
    "Hybrid solvers",
    "Non-RL online control"
  ],
  "description": "Ten works distinguish policy learning, game-guided control, learned physical-layer solvers, foundation models, and analytical online optimization across wireless systems.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## Reinforcement learning is a design choice, not a synonym for adaptation

Wireless systems make repeated decisions under changing channels, workloads, mobility, and energy budgets. That makes reinforcement learning attractive, but it does not make every adaptive controller—or every neural model—an RL system. The ten works collected here range from multi-agent and game-guided policies to learned beamformers, wireless foundation models, and an online optimizer that uses no RL at all. The important question is where feedback-driven policy learning adds value after known structure has been used. Keeping those roles separate matters for interpretability, training cost, and the guarantees a method can reasonably claim.

[Cooperative Multi-Agent Deep Reinforcement Learning Methods for UAV-aided Mobile Edge Computing Networks](https://doi.org/10.1109/jiot.2024.3447090), co-authored by Prof. Mérouane Debbah, is a clear RL-first design. A UAV and ground IoT devices act with partial observations while deciding trajectory, resource allocation, and offloading. Separate actors produce task decisions and learned coordination messages, and graph attention lets the architecture accommodate different numbers of devices. The public abstract reports better numerical performance than the selected conventional methods; it does not establish robustness to every deployment shift or communication failure between agents.

## Learning can handle the combinatorial layer while optimization handles structure

The division of labor is explicit in [Efficient Multi-user Offloading of Personalized Diffusion Models: A DRL-Convex Hybrid Solution](https://doi.org/10.1109/tmc.2025.3560582), also co-authored by Prof. Mérouane Debbah. Personalized diffusion inference is split between a batched shared model at the edge and user-specific models, with a variable split point. The resulting generalized quadratic assignment problem is turned into a decision sequence: deep reinforcement learning handles the adaptive combinatorial choice, while convex optimization handles a tractable portion of the problem. This is more informative than describing the whole solver as “AI-based,” because it identifies which complexity is learned and which is solved from mathematical structure.

[Resource Optimization for Tail-Based Control in Wireless Networked Control Systems](https://doi.org/10.1109/pimrc59610.2024.10817284) is a broader hybrid. It combines Lyapunov scheduling, Gaussian-process state prediction and uncertainty estimation, and an RL control policy for a tail-sensitive control objective. The abstract reports a 22% overall cost reduction over four evaluated variants in a mountain-car testbed. RL is present, but it is neither the scheduler nor the uncertainty model; treating the complete pipeline as a monolithic reinforcement learner would hide the roles played by queues, prediction, and control theory.

## Long-term adaptation can sit above short-term structured decisions

[Federated Digital Twin Construction via Distributed Sensing: A Game-Theoretic Online Optimization with Overlapping Coalitions](https://doi.org/10.1109/tmc.2025.3582755) uses an even more layered design. Cloud-to-edge assignments and sensor coalitions are first represented through matching and overlapping-coalition games, with dedicated algorithms producing short-term equilibria. A deep-RL component then extends this mechanism toward long-term decisions under evolving digital twins, communication costs, and energy use. The learning layer therefore operates above a game-theoretic decomposition rather than replacing it.

The counterexample is [A Two-Timescale Approach for Wireless Federated Learning with Parameter Freezing and Power Control](https://doi.org/10.1109/tmc.2025.3557838). It observes that some model parameters stabilize before training converges, then jointly controls which parameters to freeze and how much transmit power to use under an energy budget. Lyapunov optimization decomposes the problem across timescales and yields online policies. No reinforcement-learning agent is needed. The method still adapts to system evolution, which is precisely why “online,” “learning-enabled,” and “reinforcement learning” should remain separate technical labels.

## Games can expose the adversarial structure before a policy is learned

[Game Theory and Reinforcement Learning for Anti-Jamming Defense in Wireless Communications: Current Research, Challenges, and Solutions](https://doi.org/10.1109/comst.2024.3482973) provides a useful map of that distinction. It organizes Bayesian, Stackelberg, stochastic, zero-sum, and graphical anti-jamming games alongside Q-learning, bandits, deep RL, and transfer RL, then discusses where the two families can be combined. As a survey, it establishes a taxonomy and identifies limitations rather than proving one universal defense. Its main value here is methodological: a game can define who acts, what each side observes, and which equilibrium matters before a learner is asked to adapt.

[Anti-Jamming Resource Allocation for Integrated Sensing and Communications Based on Game-Guided Reinforcement Learning](https://doi.org/10.1109/lwc.2024.3496437) makes that division concrete. Channel selection is formulated as a Stackelberg game with a proved equilibrium, while power control becomes an MDP handled by deep reinforcement learning. The objective balances communication rate and effective sensing power under jamming. Reported advantages are simulation results for the modeled jammer, inter-channel interference, and ISAC constraints; they show how a game can constrain the strategic layer without pretending that the remaining dynamics are known.

## Foundation models and learned beamformers solve different problems

[WirelessGPT: A Generative Pre-Trained Multi-Task Learning Framework for Wireless Communication](https://doi.org/10.1109/mnet.2025.3579496) pretrains on large wireless-channel datasets to obtain a shared representation for communication and sensing tasks. [Large Multi-Modal Models as Universal Foundation Models for AI-Native Wireless Systems](https://doi.org/10.1109/mnet.2024.3427313) offers a broader architecture built around multimodal sensing, physical grounding, retrieval, causal reasoning, and environment feedback. The former reports an initial roughly 80-million-parameter model and downstream numerical gains; the latter combines a design vision with preliminary experiments. Neither is an RL controller by definition. Their shared issue is representation transfer: whether a model can carry useful physical and cross-layer structure into a new task without hiding domain shift or validation cost.

[A Deep Learning Framework for Physical-Layer Secure Beamforming](https://doi.org/10.1109/tvt.2024.3442167) is more task-specific. SecCNN and SecGNN map channel information to beamforming and artificial-noise vectors through unsupervised training, with the graph model distinguishing user roles. Numerical experiments examine optimality, scale, inference time, stability, and transfer between utilities. This is learned inference for a structured physical-layer problem, not sequential reward maximization. Placing it beside the RL papers makes the boundary visible: a neural network can approximate a mapping without becoming a policy that learns through interaction.

## Use learning where feedback matters and structure where it survives

Together, these works suggest a disciplined workflow. First decide whether the problem calls for representation learning, supervised or unsupervised approximation, online optimization, or a feedback-driven policy. Then expose separable, convex, queueing, control, or game structure before learning the residual high-dimensional or partially observed decision. Finally, test how the learned component behaves when agents, workloads, attackers, or channels differ from training. Reinforcement learning is most convincing here not as a label for every neural component, but as one layer in a system whose other layers remain explicit.

## Research notes

> ### Cooperative Multi-Agent Deep Reinforcement Learning Methods for UAV-aided Mobile Edge Computing Networks
>
> - **Authors:** Mintae Kim, Hoon Lee, Sangwon Hwang, Mérouane Debbah, Inkyu Lee
> - **Public record:** [IEEE Internet of Things Journal](https://doi.org/10.1109/jiot.2024.3447090)
> - **What is established:** Cooperative actors learn both coordination messages and UAV/device decisions under partial observation, with graph attention supporting varying device counts.
> - **Read with care:** The superiority claim comes from numerical evaluation against selected methods, not an operational multi-UAV deployment.
>
> ---
>
> ### Efficient Multi-user Offloading of Personalized Diffusion Models: A DRL-Convex Hybrid Solution
>
> - **Authors:** Wanting Yang, Zehui Xiong, Song Guo, Shiwen Mao, Dong In Kim, Mérouane Debbah
> - **Public record:** [IEEE Transactions on Mobile Computing](https://doi.org/10.1109/tmc.2025.3560582)
> - **What is established:** The work splits personalized diffusion inference and combines deep reinforcement learning with convex optimization for multi-user offloading and split-point selection.
> - **Read with care:** Latency–accuracy benefits and complexity comparisons are simulation results for the modeled resources, users, and inference process.
>
> ---
>
> ### Resource Optimization for Tail-Based Control in Wireless Networked Control Systems
>
> - **Authors:** Rasika Vijithasena, Rafaela Scaciota, Mehdi Bennis, Sumudu Samarakoon
> - **Public record:** [IEEE PIMRC 2024](https://doi.org/10.1109/pimrc59610.2024.10817284)
> - **What is established:** The pipeline combines Lyapunov sensor scheduling, Gaussian-process state prediction, and an RL controller; the evaluated mountain-car setting shows a 22% overall-cost reduction over four variants.
> - **Read with care:** This is a hybrid control stack, not a purely RL optimizer, and its measured reduction belongs to the stated experimental abstraction.
>
> ---
>
> ### Federated Digital Twin Construction via Distributed Sensing: A Game-Theoretic Online Optimization with Overlapping Coalitions
>
> - **Authors:** Ruoyang Chen, Changyan Yi, Fuhui Zhou, Jiawen Kang, Yuan Wu, Dusit Niyato
> - **Public record:** [IEEE Transactions on Mobile Computing](https://doi.org/10.1109/tmc.2025.3582755)
> - **What is established:** Matching and overlapping-coalition games address short-term assignments, while a deep-RL layer targets long-term digital-twin quality and cost.
> - **Read with care:** The public abstract supports simulation-based effectiveness, not convergence or deployment claims beyond the formulated hierarchical game.
>
> ---
>
> ### A Two-Timescale Approach for Wireless Federated Learning with Parameter Freezing and Power Control
>
> - **Authors:** Jinhao Ouyang, Yuan Liu, Hang Liu
> - **Public record:** [IEEE Transactions on Mobile Computing](https://doi.org/10.1109/tmc.2025.3557838)
> - **What is established:** Convergence analysis motivates online parameter-freezing and transmit-power policies obtained through two-timescale Lyapunov decomposition.
> - **Read with care:** This adaptive method is optimization-based rather than reinforcement learning; its reported advantage is experimental within the tested federated-learning setup.
>
> ---
>
> ### Game Theory and Reinforcement Learning for Anti-Jamming Defense in Wireless Communications: Current Research, Challenges, and Solutions
>
> - **Authors:** Luliang Jia, Nan Qi, Zhe Su, Feihuang Chu, Shengliang Fang, Kai-Kit Wong, Chan-Byoung Chae
> - **Public record:** [IEEE Communications Surveys & Tutorials](https://doi.org/10.1109/comst.2024.3482973)
> - **What is established:** The survey organizes major anti-jamming game models and RL families, compares their strengths and limits, and outlines combined approaches.
> - **Read with care:** It is a research synthesis and agenda, not evidence that one game–RL design defeats every jammer.
>
> ---
>
> ### Anti-Jamming Resource Allocation for Integrated Sensing and Communications Based on Game-Guided Reinforcement Learning
>
> - **Authors:** Yihui Chen, Helin Yang, Xiaoyu Ou, Yifu Jiang, Zehui Xiong
> - **Public record:** [IEEE Wireless Communications Letters](https://doi.org/10.1109/lwc.2024.3496437)
> - **What is established:** Channel selection is modeled as a Stackelberg game with an equilibrium, while an MDP and deep RL handle power control for communication and sensing under jamming.
> - **Read with care:** Performance gains are simulation-based and depend on the stated jammer, interference, channel, and ISAC models.
>
> ---
>
> ### WirelessGPT: A Generative Pre-Trained Multi-Task Learning Framework for Wireless Communication
>
> - **Authors:** Tingting Yang, Ping Zhang, Mengfan Zheng, Yuxuan Shi, Liwen Jing, Jianbo Huang, Nan Li
> - **Public record:** [IEEE Network](https://doi.org/10.1109/mnet.2025.3579496)
> - **What is established:** Unsupervised pretraining on wireless-channel data produces a shared representation evaluated across multiple communication and sensing tasks with limited fine-tuning.
> - **Read with care:** Reported gains belong to the selected data, downstream tasks, model scale, and baselines; they do not establish universal transfer.
>
> ---
>
> ### Large Multi-Modal Models as Universal Foundation Models for AI-Native Wireless Systems
>
> - **Authors:** Shengzhe Xu, Christo Kurisummoottil Thomas, Omar Hashash, Nikhil Muralidhar, Walid Saad, Naren Ramakrishnan
> - **Public record:** [IEEE Network](https://doi.org/10.1109/mnet.2024.3427313)
> - **What is established:** The article proposes a wireless-centric multimodal foundation-model architecture and reports preliminary grounding and reasoning experiments.
> - **Read with care:** This is primarily a design vision with early evidence, not a production validation across arbitrary wireless domains.
>
> ---
>
> ### A Deep Learning Framework for Physical-Layer Secure Beamforming
>
> - **Authors:** Zihan Song, Yang Lu, Xianhao Chen, Bo Ai, Zhangdui Zhong, Dusit Niyato
> - **Public record:** [IEEE Transactions on Vehicular Technology](https://doi.org/10.1109/tvt.2024.3442167)
> - **What is established:** SecCNN and SecGNN learn channel-to-beamforming and artificial-noise mappings and are evaluated for optimality, scale, inference time, stability, and transfer.
> - **Read with care:** The evidence is numerical; deployment robustness and generalization beyond the evaluated utilities and channel distributions remain open.
