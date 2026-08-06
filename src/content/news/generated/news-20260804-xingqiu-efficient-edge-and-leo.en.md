---
{
  "title": "Dr. Xingqiu He: removing avoidable work across edge and satellite systems",
  "locale": "en",
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
  "coverKicker": "EDGE + NON-TERRESTRIAL SYSTEMS",
  "coverTitle": "Remove the work the network never needed",
  "coverPoints": [
    "Reuse completed computation",
    "Spend freshness deliberately",
    "Prepare mobility before handover"
  ],
  "description": "Five works involving Dr. Xingqiu He connect computation reuse, age-aware scheduling, green O-RAN, semantic satellite slicing, and planned mobility.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## Efficiency begins by questioning the work itself

Many network optimizers start from a fixed workload and ask how to schedule it faster. Across five works published or made public in 2024–2025, Dr. Xingqiu He and his co-authors repeatedly move the question one level earlier. Does a task need to be recomputed? Does every result need the same freshness? Must every radio unit stay active? Should a satellite handover wait for a link to deteriorate before preparation begins? This shift matters because the largest saving may come from removing avoidable work rather than accelerating it.

The systems span collaborative edge computing, mobile edge scheduling, O-RAN, semantic satellite access, and low-Earth-orbit mobility. Their mechanisms are consequently different: caching and continuous optimization, post-decision-state reinforcement learning, channel-aware activation, semantic resource abstraction, and signal prediction. The coherent thread is architectural. Each design exposes structure that a conventional scheduler would otherwise treat as an immutable cost.

## Reuse and freshness change what an edge scheduler must serve

[Exploiting Storage for Computing: Computation Reuse in Collaborative Edge Computing](https://doi.org/10.1109/infocom52122.2024.10621100) treats stored results as a computing resource. If neighboring edge servers receive tasks whose results can be reused, caching a completed output can remove execution altogether. The work divides the response-time problem into caching and scheduling components, using bisection for the former and projected gradient descent with backtracking for the latter. Its central contribution is not merely another cache policy: it makes computation reuse part of the resource model.

[Age-Based Scheduling for Mobile Edge Computing: A Deep Reinforcement Learning Approach](https://doi.org/10.1109/tmc.2024.3370101) asks when a newly completed result is actually useful. In event-driven mobile edge computing, processing time belongs inside the freshness calculation, so a policy that only minimizes queueing or transmission delay can still deliver stale information. The paper formulates an age-based Markov decision process and combines post-decision-state structure with deep reinforcement learning. Known dynamics are handled explicitly, while learning is reserved for the uncertain part of the environment. Reuse and age therefore attack complementary waste: one avoids duplicate execution, and the other avoids spending resources on results whose timing no longer serves the application.

## Infrastructure can scale with demand instead of remaining fully awake

[GreenRAN: A Channel-Aware Green O-RAN Framework for NextG Mobile Systems](https://doi.org/10.1109/infocom55648.2025.11044706) carries the same discipline into radio infrastructure. Its channel-aware framework first determines which radio units should remain active, then consolidates workloads across central and distributed units while preserving the modeled quality-of-service requirements. Expressing the design through O-RAN rApp and xApp components is important: energy management is connected to an operational control architecture rather than left as an isolated optimization problem. The evaluations support the framework under the tested traffic and channel settings; wider deployment would still need to account for switching overhead, traffic surprises, and vendor-specific constraints.

Satellite access adds a different form of elasticity. [SemSAN: Semantic Satellite Access Network Slicing for NextG Non-Terrestrial Networks](https://doi.org/10.1109/icc51166.2024.10622974) does not assume that every task consumes resources in proportion to raw bits alone. It uses semantic compression tolerance and model-size equivalence to describe how much service a task truly needs, then applies an online greedy allocation mechanism. In the studied setting, that semantic abstraction lets a slice trade representation fidelity, computation, and communication resources while supporting more tasks or reducing energy. The result is not permission to discard application meaning; it shows that the service contract can be richer than a fixed throughput target.

## Predictable motion should be used before connectivity breaks

Low-Earth-orbit constellations move rapidly, but their motion is not arbitrary. [PHandover: Parallel Handover in Mobile Satellite Network](https://doi.org/10.1109/tmc.2025.3582245) replaces a purely measurement-triggered sequence with a plan-based process. Machine-learning signal prediction helps schedule preparation, and compatible handover steps can proceed in parallel while retaining compatibility with the studied 5G core architecture. The experimental comparison finds a 21-fold reduction in handover latency against the evaluated schemes. That number belongs to the paper’s implementation and test conditions, but it makes a larger systems point concrete: predictable topology should be turned into lead time.

Taken together, these works suggest a practical order for optimization. First eliminate duplicated computation. Then define how fresh a result must be, wake only the infrastructure required to deliver it, express application value more precisely than raw traffic volume, and prepare predictable mobility transitions in advance. Reinforcement learning appears in this program, but it is not the organizing principle. The organizing principle is to reveal structure before asking an algorithm to search.

## Research notes

> ### Exploiting Storage for Computing: Computation Reuse in Collaborative Edge Computing
>
> - **Authors:** Xingqiu He, Chaoqun You, Tony Q. S. Quek
> - **Public record:** [IEEE INFOCOM 2024](https://doi.org/10.1109/infocom52122.2024.10621100)
> - **What is established:** Cached results are incorporated into a joint caching-and-scheduling design for cross-server computation reuse.
> - **Read with care:** Response-time gains depend on task similarity, cacheability, and the network model used in the numerical evaluation.
>
> ---
>
> ### Age-Based Scheduling for Mobile Edge Computing: A Deep Reinforcement Learning Approach
>
> - **Authors:** Xingqiu He, Chaoqun You, Tony Q. S. Quek
> - **Public record:** [IEEE Transactions on Mobile Computing](https://doi.org/10.1109/tmc.2024.3370101)
> - **What is established:** An age-aware MDP combines post-decision-state structure with deep reinforcement learning for event-driven edge scheduling.
> - **Read with care:** The freshness objective and learned policy are evaluated under the paper’s modeled arrivals, processing, and wireless dynamics.
>
> ---
>
> ### GreenRAN: A Channel-Aware Green O-RAN Framework for NextG Mobile Systems
>
> - **Authors:** Chaoqun You, Xingqiu He, Yao Sun, Gang Feng, Tony Q. S. Quek
> - **Public record:** [IEEE INFOCOM 2025](https://doi.org/10.1109/infocom55648.2025.11044706)
> - **What is established:** Channel-aware radio-unit activation is coordinated with central/distributed-unit workload consolidation through an O-RAN framework.
> - **Read with care:** Energy and quality-of-service results come from the evaluated prototype and scenarios, not every O-RAN deployment.
>
> ---
>
> ### PHandover: Parallel Handover in Mobile Satellite Network
>
> - **Authors:** Jiasheng Wu, Shaojie Su, Wenjun Zhu, Xiong Wang, Jingjing Zhang, Xingqiu He, Yue Gao
> - **Public record:** [IEEE Transactions on Mobile Computing](https://doi.org/10.1109/tmc.2025.3582245)
> - **What is established:** Signal prediction, planned scheduling, and parallelized procedures form a 5G-core-compatible satellite handover design.
> - **Read with care:** The 21-fold handover-latency reduction is relative to the selected schemes and the paper’s experimental conditions.
>
> ---
>
> ### SemSAN: Semantic Satellite Access Network Slicing for NextG Non-Terrestrial Networks
>
> - **Authors:** Chaoqun You, Xingqiu He, Yajing Zhang, Kun Guo, Yue Gao, Tony Q. S. Quek
> - **Public record:** [IEEE ICC 2024](https://doi.org/10.1109/icc51166.2024.10622974)
> - **What is established:** Semantic compression tolerance and model-size equivalence enter an online satellite-slice allocation method.
> - **Read with care:** Task-support and energy benefits depend on the semantic models, resource assumptions, and applications used in evaluation.
