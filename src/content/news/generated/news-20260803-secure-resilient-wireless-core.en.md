---
{
  "title": "Secure and resilient wireless systems: three evidence-backed directions",
  "locale": "en",
  "slug": "secure-resilient-wireless-core",
  "newsId": "news-20260803-secure-resilient-wireless-core",
  "translationKey": "news-20260803-secure-resilient-wireless-core",
  "generated": true,
  "date": "2026-08-03",
  "coverageStart": "2026-05-05",
  "coverageEnd": "2026-06-04",
  "module": "fields",
  "keywords": [
    "anti-jamming",
    "adversarial-wireless-learning",
    "reinforcement-learning",
    "physical-layer-security",
    "secure-6g",
    "learning-enabled-wireless",
    "resilient-wireless",
    "wireless-optimization",
    "non-terrestrial-networks"
  ],
  "authors": [
    "Muhammad Shahzad Arif",
    "Yuhang Shen",
    "Sami Muhaidat",
    "Paschalis C. Sofotasios",
    "Silvirianti",
    "Georges Kaddoum",
    "Mahdi Chehimi",
    "Mohammed Mahyoub",
    "Wael Jaafar",
    "Halim Yanikomeroglu"
  ],
  "subjectIds": [
    "muhammad-shahzad-arif",
    "sami-muhaidat",
    "paschalis-sofotasios"
  ],
  "workIds": [
    "doi-10-1109-jsac-2026-3700139",
    "doi-10-1109-jsac-2026-3691713",
    "arxiv-2605-03656"
  ],
  "coverTone": "slate",
  "coverKicker": "FIELD RETROSPECTIVE",
  "coverTitle": "From links to LEO infrastructure",
  "coverPoints": [
    "Adaptive jammers",
    "Resilient routing",
    "Slice risk"
  ],
  "description": "Compares resilience at three layers: learned anti-jamming links, smart-jamming-aware LEO routes, and cross-slice service-chain placement under modeled risk.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## Resilience changes meaning as the system grows

A wireless link, a satellite route, and a virtualized service chain can all fail under attack, but they fail in different ways. The link loses a useful policy, the route loses safe connectivity, and the service chain accumulates risky placements or disruptive migrations. Comparing recent work at these three layers shows why resilient wireless design needs a hierarchy of defenses rather than a single universal algorithm.

At the link, [Outsmarting the Smart](https://doi.org/10.1109/JSAC.2026.3700139) studies reinforcement-learning anti-jamming under black-box attack. Adaptive interaction-driven and optimization-driven jammers use the victim’s behavior to push it toward suboptimal operation, while the public abstract reports lower power use than conventional reactive jamming. The study exposes a basic weakness of learned control: a policy that adapts can also produce patterns an adversary learns to exploit.

## Routing through a moving and contested topology

The routing problem becomes harder in a LEO constellation because the topology is already changing before an attacker intervenes. A digital twin, federated learning, and quantum deep reinforcement learning are combined to optimize inter-satellite routes under smart jamming. Against selected numerical benchmarks, the public abstract reports 48.16% lower jamming success, 22.26% lower delay, and 6.17% higher energy efficiency. These figures do not come from live satellites or quantum hardware, but they show how route quality, security, and energy can be evaluated together.

## Keeping services safe after the route is chosen

Connectivity alone does not guarantee that the services carried over it are safely placed. The cross-slice service-function-chain study jointly optimizes co-location risk, CPU consumption, and VNF migration stability in a dynamic constellation. Its evaluated setting reports 40% lower co-location risk, 80% fewer avoidable migrations, and a 23-fold warm-start speedup compared with a greedy baseline. The risk score is a standards-inspired proxy, yet it captures a failure mode that route optimization alone misses: two sensitive functions may remain reachable while still being placed together in an undesirable way.

The three studies therefore describe complementary layers of resilience. Link policy must withstand behavioral exploitation; routing must react to a moving, jammed topology; service orchestration must manage security risk without constant migration. Their metrics should not be merged into one headline number, and all three still rely on numerical or simulated validation. Their combined value is architectural: they show where one layer’s successful decision becomes the next layer’s starting condition.

## Research notes

> ### Outsmarting the Smart: Intelligent Jamming Strategies Against AI-Empowered Anti-Jamming Frameworks
>
> - **Authors:** Muhammad Shahzad Arif, Yuhang Shen, Sami Muhaidat, Paschalis C. Sofotasios
> - **Status:** Published journal article
> - **Primary source:** [IEEE Journal on Selected Areas in Communications](https://doi.org/10.1109/JSAC.2026.3700139)
> **Evidence note:** The public abstract does not quantify every claim; validation is numerical benchmarking rather than an over-the-air deployment.
>
>
> ### Digital Twin-Assisted Federated Quantum Deep Reinforcement Learning for Resilient and Dynamic ISL Routing
>
> - **Authors:** Silvirianti, Georges Kaddoum, Mahdi Chehimi, Sami Muhaidat
> - **Status:** Published journal article
> - **Primary source:** [IEEE Journal on Selected Areas in Communications](https://doi.org/10.1109/JSAC.2026.3691713)
> **Evidence note:** The 48.16%, 22.26%, and 6.17% improvements are from model-based numerical experiments, not live satellite or quantum-hardware trials.
>
> ### Cross-Slice Co-Location Risk-Aware SFC Provisioning in Multi-Slice LEO Satellite Networks
>
> - **Authors:** Mohammed Mahyoub, Wael Jaafar, Sami Muhaidat, Halim Yanikomeroglu
> - **Status:** Preprint
> - **Primary source:** [arXiv:2605.03656](https://arxiv.org/abs/2605.03656)
> **Evidence note:** The standards-inspired risk score is an optimization proxy, and validation is simulated rather than operational.
