---
{
  "title": "Prof. Sami Muhaidat: resilient learning across links, slices, and satellites",
  "locale": "en",
  "slug": "sami-resilient-6g-retrospective",
  "newsId": "news-20260803-sami-resilient-6g-retrospective",
  "translationKey": "news-20260803-sami-resilient-6g-retrospective",
  "generated": true,
  "date": "2026-08-03",
  "coverageStart": "2024-11-17",
  "coverageEnd": "2026-06-04",
  "module": "advisors",
  "keywords": [
    "anti-jamming",
    "adversarial-wireless-learning",
    "reinforcement-learning",
    "physical-layer-security",
    "secure-6g",
    "learning-enabled-wireless",
    "resilient-wireless",
    "wireless-optimization",
    "non-terrestrial-networks",
    "ris"
  ],
  "authors": [
    "Muhammad Shahzad Arif",
    "Yuhang Shen",
    "Sami Muhaidat",
    "Paschalis C. Sofotasios",
    "Antonios Argyriou",
    "Silvirianti",
    "Georges Kaddoum",
    "Mahdi Chehimi",
    "Li Yang",
    "Shimaa Naser",
    "Abdallah Shami",
    "Lyndon Ong",
    "Mérouane Debbah",
    "Mohammed Mahyoub",
    "Wael Jaafar",
    "Halim Yanikomeroglu",
    "Khalid AlHamdani"
  ],
  "subjectIds": [
    "muhammad-shahzad-arif",
    "sami-muhaidat",
    "paschalis-sofotasios",
    "merouane-debbah"
  ],
  "workIds": [
    "doi-10-1109-jsac-2026-3700139",
    "doi-10-1109-pimrc62392-2025-11275524",
    "doi-10-1109-mecom61498-2024-10881377",
    "doi-10-1109-jsac-2026-3691713",
    "doi-10-1109-tcomm-2025-3547764",
    "arxiv-2605-03656",
    "doi-10-1109-lwc-2025-3530823"
  ],
  "focusSubjectId": "sami-muhaidat",
  "coverTone": "violet",
  "coverKicker": "ADVISOR RESEARCH",
  "coverTitle": "Resilience across network layers",
  "coverPoints": [
    "Adversarial learning",
    "LEO routing",
    "Zero touch"
  ],
  "description": "Connects adversarial links, automated security, LEO routing, slice risk, and RIS while keeping every reported gain tied to its evaluation setting.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## Resilience has to survive changes at every layer

The recent portfolio of Prof. Sami Muhaidat spans anti-jamming links, automated security, satellite routing, service-chain placement, and RIS-aided propagation. Those subjects look far apart until they are viewed through one systems question: what continues to work when the environment, adversary, or infrastructure changes? The answer cannot be expressed by one metric. At the link it may mean resisting an adaptive jammer; in a constellation it may mean preserving routes and services; at the physical layer it may mean accepting the true degrees of freedom of the channel-control hardware.

The three anti-jamming studies show why a learned policy must be tested against more than a fixed opponent. Black-box interaction allows adaptive jammers to infer exploitable behavior and drive an RL link toward suboptimal operation while using less power than conventional reactive jamming. Bait tactics go further by manipulating perceived state transitions and reward variance. In that simulation, victim throughput falls by as much as 72% while jammer power drops by as much as 67% relative to standard reactive jamming. Even sensing errors matter in an unexpected way: false alarms and missed detections can randomize a reactive jammer enough to make it harder for the defender to learn than an idealized pattern.

## Moving from a protected link to resilient infrastructure

At constellation scale, [digital-twin-assisted federated quantum deep reinforcement learning](https://doi.org/10.1109/JSAC.2026.3691713) jointly optimizes dynamic LEO inter-satellite routing under smart jamming. The public abstract reports 48.16% lower jamming success, 22.26% lower delay, and 6.17% higher energy efficiency than selected benchmarks. These are model-based numerical gains rather than an operational satellite trial, but they connect security with routing dynamics instead of treating jamming as an isolated link event.

The zero-touch security work addresses another kind of change: data drift across physical-layer authentication and cross-layer intrusion detection. Drift-adaptive online learning and successive-halving AutoML form an integrated update workflow evaluated on public RF-fingerprinting data and CICIDS2017. The result does not prove an autonomous 6G network, yet it demonstrates how security components can be selected and refreshed instead of remaining static.

A complementary LEO study focuses on where virtual network functions are placed. Its optimization balances cross-slice co-location risk, CPU use, and migration stability in a changing constellation. Against a greedy baseline, the evaluated setting reports 40% lower risk, 80% fewer avoidable migrations, and a 23-fold warm-start speedup. Here resilience means avoiding security-sensitive co-location without creating an unstable service chain.

## Respecting the physical layer beneath the intelligence

The RIS time-reversal paper returns to the radio channel. It studies frequency-selective propagation, bit-error rate, and diversity under several reflection configurations. Because the RIS has limited degrees of freedom, maximizing aperture gain at the strongest tap performs comparably to the studied optimal configuration. That observation is a useful counterweight to increasingly complex learning frameworks: resilience also depends on choosing a control problem the hardware can actually realize.

Across the portfolio, Prof. Sami Muhaidat’s work treats resilience as a chain of coupled decisions rather than a property of one algorithm. Adaptive attacks, drifting data, moving satellites, migration costs, and constrained surfaces each expose a different failure mode. The evidence is largely analytical, dataset-based, or simulated, but the layered view makes the next validation challenge clear: these mechanisms ultimately have to coexist in systems where failures propagate across the same boundaries the papers currently study one at a time.

## Research notes

> ### Outsmarting the Smart: Intelligent Jamming Strategies Against AI-Empowered Anti-Jamming Frameworks
>
> - **Authors:** Muhammad Shahzad Arif, Yuhang Shen, Sami Muhaidat, Paschalis C. Sofotasios
> - **Status:** Published journal article
> - **Primary source:** [IEEE Journal on Selected Areas in Communications](https://doi.org/10.1109/JSAC.2026.3700139)
> **Evidence note:** The public abstract does not quantify every claim; validation is numerical benchmarking rather than an over-the-air deployment.
>
> ### Bait Tactics: Misleading DRL-Based Cognitive Anti-Jamming Communications via Adversarial Learning
>
> - **Authors:** Muhammad Shahzad Arif, Sami Muhaidat, Paschalis C. Sofotasios
> - **Status:** Published conference paper
> - **Primary source:** [IEEE PIMRC](https://doi.org/10.1109/PIMRC62392.2025.11275524)
> **Evidence note:** The 72% throughput loss and 67% jammer-power saving are specific to the reported simulation scenario.
>
> ### Performance of AI-Empowered Anti-Jamming Communications under Hardware Impairments
>
> - **Authors:** Muhammad Shahzad Arif, Sami Muhaidat, Antonios Argyriou, Paschalis C. Sofotasios
> - **Status:** Published conference paper
> - **Primary source:** [IEEE MECOM](https://doi.org/10.1109/MECOM61498.2024.10881377)
> **Evidence note:** The conclusion follows from the evaluated sensing-error and learning model and does not cover every radio impairment or waveform.

> ### Digital Twin-Assisted Federated Quantum Deep Reinforcement Learning for Resilient and Dynamic ISL Routing
>
> - **Authors:** Silvirianti, Georges Kaddoum, Mahdi Chehimi, Sami Muhaidat
> - **Status:** Published journal article
> - **Primary source:** [IEEE Journal on Selected Areas in Communications](https://doi.org/10.1109/JSAC.2026.3691713)
> **Evidence note:** The reported 48.16% lower jamming success, 22.26% lower delay, and 6.17% higher energy efficiency come from model-based numerical experiments, not live satellite or quantum-hardware trials.
>
> ### Towards Zero Touch Networks: Cross-Layer Automated Security Solutions for 6G Wireless Networks
>
> - **Authors:** Li Yang, Shimaa Naser, Abdallah Shami, Sami Muhaidat, Lyndon Ong, Mérouane Debbah
> - **Status:** Published journal article
> - **Primary source:** [IEEE Transactions on Communications](https://doi.org/10.1109/TCOMM.2025.3547764)
> **Evidence note:** Public RF-fingerprinting and CICIDS2017 datasets validate two security tasks, not a fully autonomous zero-touch 6G deployment.
>
> ### Cross-Slice Co-Location Risk-Aware SFC Provisioning in Multi-Slice LEO Satellite Networks
>
> - **Authors:** Mohammed Mahyoub, Wael Jaafar, Sami Muhaidat, Halim Yanikomeroglu
> - **Status:** Preprint
> - **Primary source:** [arXiv:2605.03656](https://arxiv.org/abs/2605.03656)
> **Evidence note:** Co-location risk is a standards-inspired optimization proxy, and all reported results come from simulation rather than an operational constellation.
>
> ### Time Reversal in RIS-Aided Environments
>
> - **Authors:** Khalid AlHamdani, Shimaa Naser, Sami Muhaidat, Paschalis C. Sofotasios
> - **Status:** Published journal article
> - **Primary source:** [IEEE Wireless Communications Letters](https://doi.org/10.1109/LWC.2025.3530823)
> **Evidence note:** The analysis and simulations are not accompanied by a hardware prototype or measured channel campaign.
