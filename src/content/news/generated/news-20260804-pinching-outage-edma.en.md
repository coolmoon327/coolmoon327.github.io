---
{
  "title": "Pinching antennas under blockage: outage-constrained EDMA",
  "locale": "en",
  "slug": "pinching-outage-edma",
  "newsId": "news-20260804-pinching-outage-edma",
  "translationKey": "news-20260804-pinching-outage-edma",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2026-07-21",
  "coverageEnd": "2026-07-21",
  "module": "interests",
  "keywords": [
    "pinching-antennas",
    "noma",
    "wireless-optimization",
    "resilient-wireless"
  ],
  "authors": [
    "Weihao Mao",
    "Yang Lu",
    "Yanqing Xu",
    "Zhiguo Ding"
  ],
  "subjectIds": [
    "zhiguo-ding"
  ],
  "workIds": [
    "arxiv-2607-18738"
  ],
  "coverTone": "amber",
  "coverKicker": "PINCHING ANTENNAS",
  "coverTitle": "A recent access-control preprint",
  "coverPoints": [
    "Blockage",
    "Power allocation",
    "Explicit caveats"
  ],
  "description": "Studies blockage-aware EDMA with outage constraints, PGD, and SCA, clearly limiting near-optimality to the preprint’s tested numerical settings.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## Designing access when line of sight can disappear

Pinching-antenna systems are often introduced through favorable line-of-sight geometry: movable radiating points create short, controllable paths to users. Real environments are less cooperative. Objects can block the direct path, scattering can create uncertain alternatives, and signal power decays while traveling inside the waveguide. A design optimized for one nominal channel may therefore fail precisely when flexible access is most needed.

[Outage-Constrained Environment Division Multiple Access for Pinching-Antenna Systems](https://arxiv.org/abs/2607.18738) incorporates those uncertainties through statistical rate-outage constraints. Antenna deployment and transmit power are chosen jointly, so the system must decide both where to create effective radiation points and how to allocate power while limiting the probability that user rates fall below their targets.

## Exact analysis for two users

The paper first studies a two-user setting and derives exact outage expressions under line-of-sight blockage, non-line-of-sight scattering, and in-waveguide attenuation. This case provides more than a small numerical example: it exposes how propagation uncertainty and waveguide loss enter the reliability calculation before the problem is expanded to more users.

With those expressions in place, PGD is used to search the joint deployment and power-allocation space. The resulting design makes outage probability an explicit engineering constraint rather than a statistic inspected only after optimizing a deterministic channel.

## Scaling the formulation without hiding the approximation

Exact outage calculations become difficult as the user count grows. The multi-user formulation therefore uses a Chernoff approximation to obtain a tractable representation and successive convex approximation to update the design. This trades exactness for computational accessibility while keeping blockage, scattering, and attenuation inside the optimization.

Simulation results indicate that the proposed methods can approach the selected numerical benchmarks in the tested settings. They do not establish universal near-optimality, and the multi-user conclusions inherit the assumptions of the Chernoff and convex approximations. Hardware measurements, empirical blockage statistics, and larger-scale control experiments remain necessary to determine how accurately the modeled outage constraints describe an operating system.

## Research notes

> ### Outage-Constrained Environment Division Multiple Access (EDMA) for Pinching-Antenna Systems
>
> **Authors:** Weihao Mao, Yang Lu, Yanqing Xu, Zhiguo Ding
>
> **Status:** Preprint
>
> **Primary source:** [arXiv:2607.18738](https://arxiv.org/abs/2607.18738)
>
> **Evidence note:** The paper derives exact two-user outage expressions, applies PGD, and uses a Chernoff approximation with successive convex approximation for multiple users. Results are simulation- and model-based; near-optimality is limited to the tested settings, and the scalable formulation trades exactness for tractability.
