---
{
  "title": "Dr. Xingqiu He: online edge scheduling and predictive LEO handover",
  "locale": "en",
  "slug": "xingqiu-edge-and-leo",
  "newsId": "news-20260803-xingqiu-edge-and-leo",
  "translationKey": "news-20260803-xingqiu-edge-and-leo",
  "generated": true,
  "date": "2026-08-03",
  "coverageStart": "2026-03-09",
  "coverageEnd": "2026-03-09",
  "module": "interests",
  "keywords": [
    "wireless-powered-edge",
    "wireless-optimization",
    "energy-constrained-iot",
    "non-terrestrial-networks",
    "learning-enabled-wireless"
  ],
  "authors": [
    "Xingqiu He",
    "Chaoqun You",
    "Yuzhi Yang",
    "Zihan Chen",
    "Yuhang Shen",
    "Tony Q. S. Quek",
    "Yue Gao",
    "Zijie Ying"
  ],
  "subjectIds": [
    "xingqiu-he",
    "yuzhi-yang-wireless"
  ],
  "workIds": [
    "arxiv-2603-07984",
    "arxiv-2603-07987"
  ],
  "focusSubjectId": "xingqiu-he",
  "coverTone": "mint",
  "coverKicker": "COLLABORATOR RESEARCH",
  "coverTitle": "Optimization across edge and orbit",
  "coverPoints": [
    "Wireless power",
    "Online scheduling",
    "Predictive handover"
  ],
  "description": "Pairs queue-aware wireless-powered edge scheduling with predictive LEO handover, highlighting optimization structure and the absence of operational deployment evidence.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## Turning predictable structure into online decisions

The recent work of Dr. Xingqiu He spans two systems that appear far apart: energy-constrained computing at the network edge and handover among fast-moving low-Earth-orbit satellites. Their common thread is more fundamental than the application domain. Both ask how a controller can act online when future conditions are unavailable, while still exploiting the structure that the system does reveal.

In one case, that structure lies in queue dynamics and the accounting of harvested energy. In the other, it comes from orbital motion and comparatively stable channel evolution. Treating these regularities as algorithmic resources turns uncertainty from an excuse for purely reactive control into something a scheduler can manage deliberately.

## Keeping edge queues stable with finite energy

[Energy-Efficient Online Scheduling for Wireless Powered Mobile Edge Computing Networks](https://arxiv.org/abs/2603.07984) addresses devices whose energy supply, task arrivals, and wireless conditions vary from slot to slot. Lyapunov optimization converts the long-term latency-energy problem into per-slot control, while marginal energy efficiency supports a relax-then-adjust procedure and reduces offloading to an assignment problem.

The resulting scheduler comes with stated latency-energy guarantees under the modeled assumptions. Its broader contribution is methodological: a difficult stochastic program becomes a sequence of tractable decisions without assuming that the controller knows the future. The current validation is extensive simulation rather than a deployed wireless-power and edge system.

## Planning a satellite handover before it is urgent

[PreHO: Predictive Handover for LEO Satellite Networks](https://arxiv.org/abs/2603.07987) applies a complementary idea to satellite mobility. Instead of waiting for a conventional trigger and then reacting, PreHO uses predictable satellite trajectories and relatively stable channels to plan the next handover in advance. Alternating optimization and dynamic programming organize the choice across candidate satellites and time.

Evaluations driven by real-world data report lower signaling overhead and handover latency than the selected reactive schemes. That evidence supports the value of prediction under the tested traces, but it is not an operational satellite-network deployment. Abrupt propagation changes, ephemeris errors, or other unmodeled dynamics could weaken the regularity on which advance planning depends.

## A coherent research direction

Together, the two studies show how online optimization can be strengthened by identifying what is predictable: conservation and queueing relationships at the edge, and motion at orbital scale. The details differ, yet the design principle is consistent—separate the enduring system structure from the instantaneous uncertainty, then build a controller whose computational steps match that separation.

## Research notes

> ### Energy-Efficient Online Scheduling for Wireless Powered Mobile Edge Computing Networks
>
> **Authors:** Xingqiu He, Chaoqun You, Yuzhi Yang, Zihan Chen, Yuhang Shen, Tony Q. S. Quek, Yue Gao
>
> **Status:** Preprint
>
> **Primary source:** [arXiv:2603.07984](https://arxiv.org/abs/2603.07984)
>
> **Evidence note:** Analytical latency-energy guarantees are paired with extensive simulations; no deployed wireless-power or edge-computing system is reported, so the findings remain bounded by the modeled queues, channels, and workloads.
>
> ### PreHO: Predictive Handover for LEO Satellite Networks
>
> **Authors:** Xingqiu He, Zijie Ying, Chaoqun You, Yue Gao
>
> **Status:** Preprint
>
> **Primary source:** [arXiv:2603.07987](https://arxiv.org/abs/2603.07987)
>
> **Evidence note:** The evaluation uses real-world-data-driven traces rather than an operational satellite deployment. Its reported gains depend on motion and channel predictability that may weaken under unmodeled dynamics.
