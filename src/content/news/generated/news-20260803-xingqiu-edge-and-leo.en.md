---
{
  "title": "Xingqiu He: online edge scheduling and predictive LEO handover",
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
## Perspective

These two works share an online decision-making perspective across very different systems: queue-aware energy scheduling at the edge and motion-aware handover in orbit.

## Energy-Efficient Online Scheduling for Wireless Powered Mobile Edge Computing Networks

**Authors:** Xingqiu He, Chaoqun You, Yuzhi Yang, Zihan Chen, Yuhang Shen, Tony Q. S. Quek, Yue Gao

**Status:** Preprint

**Xingqiu He lens.** [Open the primary public record](https://arxiv.org/abs/2603.07984). The preprint turns a stochastic wireless-powered mobile-edge scheduling problem into per-slot decisions through Lyapunov optimization. Marginal energy efficiency supports a relax-then-adjust method, and the offloading subproblem becomes an assignment problem; the authors also state latency-energy performance guarantees.

**Xingqiu He lens.** **Evidence boundary.** The practical evidence is extensive simulation, not a deployed wireless-power and edge-computing system, so robustness is bounded by the modeled queues, channels, and workloads.

## PreHO: Predictive Handover for LEO Satellite Networks

**Authors:** Xingqiu He, Zijie Ying, Chaoqun You, Yue Gao

**Status:** Preprint

[Open the primary public record](https://arxiv.org/abs/2603.07987). PreHO exploits the predictable motion and comparatively stable channels of LEO systems to plan handovers before they are triggered. The optimization alternates between subproblems and uses dynamic programming, while evaluations driven by real-world data report lower signaling overhead and handover latency than reactive schemes.

**Evidence boundary.** The evaluation is trace- or data-driven rather than an operational satellite-network deployment, and the method relies on predictability assumptions that may degrade under unmodeled dynamics.
