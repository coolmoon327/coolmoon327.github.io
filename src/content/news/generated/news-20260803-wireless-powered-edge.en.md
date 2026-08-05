---
{
  "title": "Online scheduling for wireless-powered edge computing: balancing latency and energy",
  "locale": "en",
  "slug": "wireless-powered-edge",
  "newsId": "news-20260803-wireless-powered-edge",
  "translationKey": "news-20260803-wireless-powered-edge",
  "generated": true,
  "date": "2026-08-03",
  "coverageStart": "2026-03-09",
  "coverageEnd": "2026-03-09",
  "module": "fields",
  "keywords": [
    "wireless-powered-edge",
    "wireless-optimization",
    "energy-constrained-iot"
  ],
  "authors": [
    "Xingqiu He",
    "Chaoqun You",
    "Yuzhi Yang",
    "Zihan Chen",
    "Yuhang Shen",
    "Tony Q. S. Quek",
    "Yue Gao"
  ],
  "subjectIds": [
    "xingqiu-he",
    "yuzhi-yang-wireless"
  ],
  "workIds": [
    "arxiv-2603-07984"
  ],
  "coverTone": "mint",
  "coverKicker": "FIELD UPDATE",
  "coverTitle": "Energy and latency in one queueing model",
  "coverPoints": [
    "Wireless power",
    "Lyapunov control",
    "Simulation"
  ],
  "description": "Explains a Lyapunov-based online scheduler for wireless-powered edge computing and separates its stated latency-energy guarantees from simulation-only validation.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## When harvested energy becomes a scheduling constraint

Wireless-powered mobile edge computing asks a difficult question: how should a device decide whether to compute locally or offload a task when both its workload and its available energy change over time? Harvested energy cannot be treated as an unlimited battery, yet delaying every task until conditions are ideal causes queues to grow. The scheduler must therefore balance energy consumption against latency without knowing future arrivals or channel states.

The preprint [Energy-Efficient Online Scheduling for Wireless Powered Mobile Edge Computing Networks](https://arxiv.org/abs/2603.07984) formulates that tension as a stochastic control problem. Rather than solving one large plan with perfect future information, it uses Lyapunov optimization to translate long-term queue stability and energy objectives into decisions that can be taken in each time slot.

## From a coupled problem to tractable decisions

The key step is decomposition. A marginal-energy-efficiency measure supports a relax-then-adjust procedure for local computing and offloading, while the offloading decision itself becomes an assignment problem. This structure matters because it turns a mixed, time-coupled optimization problem into subproblems with recognizable algorithmic form instead of leaving an online controller to search the full decision space at every slot.

The analysis states performance guarantees connecting latency and energy use, and the simulations test the scheduler across modeled queues, wireless channels, and workloads. The result is most useful as a principled bridge between stochastic-network theory and implementable per-slot control: it explains not only what to optimize, but also how the original coupling can be broken without discarding the long-term objective.

## What the result does—and does not—establish

The work provides a clear analytical and simulation-based case for online scheduling under wireless energy constraints. Its guarantees apply within the stated queueing, channel, and workload models; the public evidence does not include a deployed wireless-power and edge-computing platform. Questions such as energy-transfer inefficiency, hardware overhead, model mismatch, and behavior under operational traffic therefore remain open for system-level validation.

## Research notes

> ### Energy-Efficient Online Scheduling for Wireless Powered Mobile Edge Computing Networks
>
> **Authors:** Xingqiu He, Chaoqun You, Yuzhi Yang, Zihan Chen, Yuhang Shen, Tony Q. S. Quek, Yue Gao
>
> **Status:** Preprint
>
> **Primary source:** [arXiv:2603.07984](https://arxiv.org/abs/2603.07984)
>
> **Evidence note:** The paper presents analytical latency-energy guarantees and extensive simulations. It does not report a deployed wireless-power or edge-computing system, so the conclusions remain tied to the modeled queues, channels, and workloads.
