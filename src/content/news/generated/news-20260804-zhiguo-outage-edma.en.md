---
{
  "title": "Prof. Zhiguo Ding: outage-constrained EDMA for pinching antennas",
  "locale": "en",
  "slug": "zhiguo-outage-edma",
  "newsId": "news-20260804-zhiguo-outage-edma",
  "translationKey": "news-20260804-zhiguo-outage-edma",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2026-07-21",
  "coverageEnd": "2026-07-21",
  "module": "advisors",
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
  "focusSubjectId": "zhiguo-ding",
  "coverTone": "amber",
  "coverKicker": "RECENT ADVISOR WORK",
  "coverTitle": "Blockage-aware access design",
  "coverPoints": [
    "Outage constraints",
    "EDMA",
    "Simulation"
  ],
  "description": "Summarizes outage-constrained pinching-antenna EDMA under blockage, scattering, and attenuation, with approximation and simulation limits kept visible.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## Bringing propagation uncertainty into the design

Pinching antennas offer unusual spatial control, but that freedom is useful only if the access strategy remains reliable when propagation departs from an ideal line-of-sight model. In a recent contribution involving Prof. Zhiguo Ding, [Outage-Constrained Environment Division Multiple Access for Pinching-Antenna Systems](https://arxiv.org/abs/2607.18738) moves the design toward that harder setting.

The work models line-of-sight blockage, non-line-of-sight scattering, and attenuation along the waveguide, then places a statistical rate-outage constraint around the resulting uncertainty. Deployment and power allocation are optimized together. For Prof. Zhiguo Ding’s broader pinching-antenna research, this extends configurable access from nominal geometry toward reliability-aware operation.

## Building from exact expressions to scalable algorithms

The analytical development is deliberately staged. Exact outage expressions are first derived for two users, making the effects of blockage, scattering, and waveguide loss visible without an additional approximation layer. PGD then provides a way to optimize placement and power within that setting.

For multiple users, the exact formulation becomes harder to manipulate. A Chernoff approximation produces a tractable outage representation, and successive convex approximation is used to update the design. This sequence—from exact small-system analysis to approximate multi-user optimization—makes the source of scalability clear and also shows where precision is surrendered.

## Reliability as the next layer of the research program

The simulations report performance close to the selected numerical references in the scenarios studied. The more durable contribution is the formulation: environmental uncertainty becomes part of antenna deployment and access control rather than an afterthought evaluated against a design optimized for nominal channels.

The work remains analytical and numerical. Claims of near-optimal behavior are specific to the tested settings, and the multi-user result depends on the chosen probability bound and convex approximation. Hardware validation with measured blockage, scattering, and waveguide variation would be the next step in determining whether the reliability gains persist outside the model.

## Research notes

> ### Outage-Constrained Environment Division Multiple Access (EDMA) for Pinching-Antenna Systems
>
> **Authors:** Weihao Mao, Yang Lu, Yanqing Xu, Zhiguo Ding
>
> **Status:** Preprint
>
> **Primary source:** [arXiv:2607.18738](https://arxiv.org/abs/2607.18738)
>
> **Evidence note:** Exact outage expressions are derived for two users before PGD and a Chernoff/successive-convex-approximation construction are used for larger settings. The evidence is analytical and simulated; near-optimality is scenario-specific and the multi-user result relies on approximation.
