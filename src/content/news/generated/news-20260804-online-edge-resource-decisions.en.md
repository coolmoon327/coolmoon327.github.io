---
{
  "title": "Online decisions across wireless edge systems",
  "locale": "en",
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
  "coverKicker": "ONLINE EDGE OPTIMIZATION",
  "coverTitle": "Act now without pretending to know the future",
  "coverPoints": [
    "Queue-aware control",
    "Two timescales",
    "Computation reuse"
  ],
  "description": "Seven works connect Lyapunov control, privacy-aware IIoT offloading, UAV edge service, federated-learning timescales, spatiotemporal scheduling, learned offloading, and computation reuse.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## Edge systems must decide before the future is known

An edge scheduler sees only the jobs, channels, batteries, privacy exposure, and queues available now, while the quality of its decision may not be clear until much later. Online optimization addresses that mismatch without assuming an oracle for future arrivals. The seven works collected here use several different tools—Lyapunov control, convex optimization, game theory, heuristics, imitation learning, deep reinforcement learning, and caching. They should not all be collapsed into one algorithmic category. What unites them is the system question: how can an edge network make timely local decisions while respecting long-term energy, delay, privacy, or cost objectives?

[Energy-Efficient Federated Edge Learning with Streaming Data: A Lyapunov Optimization Approach](https://doi.org/10.1109/tcomm.2024.3443731) makes the time dependence explicit. New training samples arrive randomly, wireless resources vary, and devices face long-term energy constraints. A drift-plus-penalty controller chooses participating devices, computation capacity, bandwidth, and transmit power in each round. The paper also analyzes convergence with heterogeneous data and time-varying objectives. Its simulations show improved learning and energy efficiency against selected baselines, but the result remains tied to the assumed queue and arrival model.

[Combining Lyapunov Optimization With Actor–Critic Networks for Privacy-Aware IIoT Computation Offloading](https://doi.org/10.1109/jiot.2024.3357110) adds a state variable that is often left implicit. The framework accumulates a modeled privacy amount for each industrial-IoT user; once a threshold is exceeded, selected offloaded data are processed locally so that the accumulated amount can be reduced. Lyapunov optimization is used to keep the data queue stable and control long-run energy, while an actor–critic network learns the offloading policy at low stated computational complexity. Simulations support queue stability and lower energy under the specified privacy mechanism. They do not establish that the scalar privacy measure captures every real inference attack or regulatory requirement.

## Queueing structure turns long horizons into per-slot decisions

[QoE Maximization for Multiple-UAV-Assisted Multi-Access Edge Computing via an Online Joint Optimization Approach](https://doi.org/10.1109/ton.2025.3581531) considers disaster areas where terrestrial edge infrastructure may be unavailable. The original trajectory, offloading, and resource problem is future-dependent and NP-hard. Lyapunov optimization converts it into per-slot problems, then game-theoretic and convex methods solve the resulting stages. The public abstract reports at least 10% higher user QoE than the evaluated deep-RL algorithms. That comparison does not make Lyapunov control universally better than RL; it shows the value of exploiting problem structure in this particular constrained setting.

[A Two-Timescale Approach for Wireless Federated Learning with Parameter Freezing and Power Control](https://doi.org/10.1109/tmc.2025.3557838) separates a slowly changing parameter-freezing decision from faster transmit-power control. Convergence analysis links both to an energy budget, and Lyapunov decomposition yields online policies. The design demonstrates why timescale selection is part of modeling: not every variable needs to be reconsidered on every channel or training update.

## Spatial structure and learned policies solve different bottlenecks

[Spatiotemporal Non-Uniformity-Aware Online Task Scheduling in Collaborative Edge Computing for Industrial Internet of Things](https://doi.org/10.1109/tmc.2025.3567615) handles uneven demand across factories and over time. A graph represents spatial relationships, Lyapunov optimization decomposes the long-term problem, hierarchical heuristics tackle the NP-hard per-slot subproblems, and imitation learning accelerates their execution. This is an online-optimization pipeline with a learned accelerator—not a reinforcement-learning controller.

[Joint Task Offloading and Channel Allocation in Spatial-Temporal Dynamic for MEC Networks](https://doi.org/10.1109/tii.2025.3563531) takes another route. Task dependencies are first prioritized, channel allocation is expressed as a grouped knapsack problem, and a double-dueling deep-Q network makes offloading decisions using the allocation outcome as part of its feedback. Here reinforcement learning is central to the dynamic offloading policy. The paper’s simulation results support adaptability in the studied applications, while leaving real-time training cost and out-of-distribution behavior as deployment questions.

## Sometimes the best computation is the one not repeated

Dr. Xingqiu He co-authored [Exploiting Storage for Computing: Computation Reuse in Collaborative Edge Computing](https://doi.org/10.1109/infocom52122.2024.10621100), which adds a structural alternative to continual rescheduling. Results of previously executed tasks are cached and reused across neighboring edge servers. The response-time problem is divided into caching and scheduling: bisection searches caching decisions, while projected gradient descent with backtracking handles scheduling. This study is not an online-control method in the same sense as drift-plus-penalty scheduling. It belongs in the collection because reuse changes the workload that any future online controller must serve.

The practical synthesis is therefore broader than choosing a solver. Queueing methods enforce long-term budgets, explicit privacy state can trigger local processing, timescale separation avoids needless churn, graphs represent where demand appears, learned policies address hard dynamic choices, and caching removes duplicate work. A credible edge system should assign each of these tools to the bottleneck it actually resolves—and measure decision latency as carefully as task latency.

## Research notes

> ### Energy-Efficient Federated Edge Learning with Streaming Data: A Lyapunov Optimization Approach
>
> - **Authors:** Chung-Hsuan Hu, Zheng Chen, Erik G. Larsson
> - **Public record:** [IEEE Transactions on Communications](https://doi.org/10.1109/tcomm.2024.3443731)
> - **What is established:** Drift-plus-penalty control jointly selects devices, computation capacity, bandwidth, and transmit power under streaming data and long-term energy constraints.
> - **Read with care:** Learning and energy improvements are simulation results under the paper’s stochastic arrivals, wireless model, and baselines.
>
> ---
>
> ### QoE Maximization for Multiple-UAV-Assisted Multi-Access Edge Computing via an Online Joint Optimization Approach
>
> - **Authors:** Long He, Geng Sun, Zemin Sun, Qingqing Wu, Jiawen Kang, Dusit Niyato, Zhu Han, Victor C. M. Leung
> - **Public record:** [IEEE Transactions on Networking](https://doi.org/10.1109/ton.2025.3581531)
> - **What is established:** A Lyapunov transformation and two-stage game/convex solver jointly control task offloading, resources, and UAV trajectories.
> - **Read with care:** The reported 10% or greater QoE advantage is against selected DRL methods in simulation, not a universal algorithm ranking.
>
> ---
>
> ### A Two-Timescale Approach for Wireless Federated Learning with Parameter Freezing and Power Control
>
> - **Authors:** Jinhao Ouyang, Yuan Liu, Hang Liu
> - **Public record:** [IEEE Transactions on Mobile Computing](https://doi.org/10.1109/tmc.2025.3557838)
> - **What is established:** The work jointly controls parameter freezing and transmit power through convergence analysis and a two-timescale Lyapunov decomposition.
> - **Read with care:** The online policies and performance comparison depend on the modeled energy budget, transmission reliability, and federated-learning task.
>
> ---
>
> ### Spatiotemporal Non-Uniformity-Aware Online Task Scheduling in Collaborative Edge Computing for Industrial Internet of Things
>
> - **Authors:** Yang Li, Xing Zhang, Yukun Sun, Wenbo Wang, Bo Lei
> - **Public record:** [IEEE Transactions on Mobile Computing](https://doi.org/10.1109/tmc.2025.3567615)
> - **What is established:** Graph modeling, Lyapunov decomposition, hierarchical heuristics, and imitation learning address spatially uneven, time-varying IIoT demand.
> - **Read with care:** The learned component accelerates a scheduling pipeline; the abstract does not identify it as a reinforcement-learning policy.
>
> ---
>
> ### Joint Task Offloading and Channel Allocation in Spatial-Temporal Dynamic for MEC Networks
>
> - **Authors:** Tianyi Shi, Tiankui Zhang, Jonathan Loo, Rong Huang, Yapeng Wang
> - **Public record:** [IEEE Transactions on Industrial Informatics](https://doi.org/10.1109/tii.2025.3563531)
> - **What is established:** Task-priority and grouped-knapsack steps feed channel-allocation feedback to a double-dueling deep-Q offloading policy.
> - **Read with care:** Delay–energy and adaptability results are from comprehensive simulations rather than a production MEC deployment.
>
> ---
>
> ### Exploiting Storage for Computing: Computation Reuse in Collaborative Edge Computing
>
> - **Authors:** Xingqiu He, Chaoqun You, Tony Q. S. Quek
> - **Public record:** [IEEE INFOCOM 2024](https://doi.org/10.1109/infocom52122.2024.10621100)
> - **What is established:** Cross-server computation reuse is decomposed into caching and scheduling, solved through bisection and projected gradient descent with backtracking.
> - **Read with care:** Response-time reductions are numerical and rely on the assumed similarity and reuse of tasks across neighboring edge servers.

> ---
>
> ### Combining Lyapunov Optimization With Actor–Critic Networks for Privacy-Aware IIoT Computation Offloading
>
> - **Authors:** Guowen Wu, Xihang Chen, Yizhou Shen, Zhiqi Xu, Hong Zhang, Shigen Shen, Shui Yu
> - **Public record:** [IEEE Internet of Things Journal](https://doi.org/10.1109/jiot.2024.3357110)
> - **What is established:** The framework combines a thresholded cumulative-privacy state, local processing, Lyapunov queue and energy control, and an actor–critic offloading policy.
> - **Read with care:** Stability and energy results are simulation-based; the public abstract does not establish that the defined privacy amount covers all leakage mechanisms, attacks, or compliance obligations.
