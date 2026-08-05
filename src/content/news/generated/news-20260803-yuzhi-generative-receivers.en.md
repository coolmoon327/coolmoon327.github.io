---
{
  "title": "Dr. Yuzhi Yang: from wireless-powered edge scheduling to diffusion receivers",
  "locale": "en",
  "slug": "yuzhi-generative-receivers",
  "newsId": "news-20260803-yuzhi-generative-receivers",
  "translationKey": "news-20260803-yuzhi-generative-receivers",
  "generated": true,
  "date": "2026-08-03",
  "coverageStart": "2025-06-23",
  "coverageEnd": "2026-03-09",
  "module": "interests",
  "keywords": [
    "wireless-powered-edge",
    "wireless-optimization",
    "energy-constrained-iot",
    "generative-wireless-receivers",
    "ai-native-wireless",
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
    "Omar Alhussein",
    "Atefeh Arani",
    "Zhaoyang Zhang",
    "Mérouane Debbah",
    "Sen Yan",
    "Weijie Zhou",
    "Brahim Mefgouda",
    "Ridong Li"
  ],
  "subjectIds": [
    "xingqiu-he",
    "yuzhi-yang-wireless",
    "merouane-debbah"
  ],
  "workIds": [
    "arxiv-2603-07984",
    "doi-10-1109-tnse-2026-3657967",
    "arxiv-2509-01641",
    "arxiv-2510-24495"
  ],
  "focusSubjectId": "yuzhi-yang-wireless",
  "coverTone": "violet",
  "coverKicker": "COLLABORATOR RESEARCH",
  "coverTitle": "Generative models meet signal processing",
  "coverPoints": [
    "Pilot efficiency",
    "Uneven reliability",
    "Edge scheduling"
  ],
  "description": "Follows a path from energy-aware edge scheduling to diffusion receivers that model uneven pilot reliability, with results limited to public simulations.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## From controlling queues to reconstructing channels

The selected work of Dr. Yuzhi Yang follows a striking methodological progression. It begins with stochastic optimization for deciding how energy-constrained devices should compute and offload, then moves into generative modeling for recovering wireless channels from sparse and uneven observations. The systems differ, but the mathematical instinct is consistent: preserve useful domain structure instead of asking a generic learning model to discover everything from data.

That continuity matters for AI-native wireless design. Queue evolution, energy balance, pilot placement, and channel correlation are not incidental details; they are prior knowledge that can narrow the decision or inference problem. The four works show several ways to encode that knowledge, from Lyapunov control and assignment structure to diffusion time embeddings and signal-processing-guided generation.

## Online control under wireless energy constraints

[Energy-Efficient Online Scheduling for Wireless Powered Mobile Edge Computing Networks](https://arxiv.org/abs/2603.07984) considers devices whose task queues, harvested energy, and channel conditions evolve over time. Lyapunov optimization converts the long-term latency-energy objective into per-slot decisions. Marginal energy efficiency then supports a relax-then-adjust method, and the offloading choice becomes an assignment problem.

The stated guarantees clarify the trade between delay and energy within the model, while extensive simulation examines the resulting scheduler. This part of the research uses analytical decomposition to make uncertainty manageable: rather than predict the future, the controller responds to the current queue and energy state while retaining a long-term performance objective.

## Diffusion as a structured wireless receiver

The later receiver work treats channel estimation as conditional generation. [Generative Diffusion Receivers](https://doi.org/10.1109/TNSE.2026.3657967), coauthored with Prof. Mérouane Debbah and others, combines a learned channel prior with a conventional estimate and an imagination-screening step. In simulations using four to six pilots across 64 subcarriers at signal-to-noise ratios from -4 to 0 dB, it reports up to a twofold reduction in channel-reconstruction error relative to the selected deep-learning baselines.

[Non-Identical Diffusion Models in MIMO-OFDM Channel Generation](https://arxiv.org/abs/2509.01641) then addresses a subtle mismatch in the usual formulation. A single global diffusion-time index assumes that all observed elements carry the same reliability, although pilots and subcarriers can be unequally informative. Element-wise indicators and dimension-wise time embeddings allow the generative process to represent that unevenness directly, with theoretical checks and numerical MIMO-OFDM experiments supporting the design.

## From an estimator to a transceiver design map

[Diffusion Models for Wireless Transceivers](https://arxiv.org/abs/2510.24495) broadens the argument into a tutorial and research agenda. It explains how rough channel estimates can condition a diffusion model while established signal-processing structure constrains the generated result, then illustrates the idea with a proof-of-concept receiver. Read together, the three diffusion papers move from a concrete pilot-efficient estimator, through a more faithful representation of non-identical reliability, to a general account of where generative models may fit in a wireless transceiver.

The evidence remains primarily numerical. Larger imagination sets also demand more computation, so reducing pilots does not automatically reduce end-to-end receiver cost or latency. Radio-platform measurements, standardized comparisons, robustness to distribution shift, and hardware-aware complexity studies are still needed before the approach can be treated as a broadly validated receiver architecture.

## Research notes

> ### Energy-Efficient Online Scheduling for Wireless Powered Mobile Edge Computing Networks
>
> **Authors:** Xingqiu He, Chaoqun You, Yuzhi Yang, Zihan Chen, Yuhang Shen, Tony Q. S. Quek, Yue Gao
>
> **Status:** Preprint
>
> **Primary source:** [arXiv:2603.07984](https://arxiv.org/abs/2603.07984)
>
> **Evidence note:** Analytical latency-energy guarantees and extensive simulations are reported, but no deployed wireless-power or edge-computing platform is included. The conclusions remain bounded by the modeled queues, channels, and workloads.
>
> ### Generative Diffusion Receivers: Achieving Pilot-Efficient MIMO-OFDM Communications
>
> **Authors:** Yuzhi Yang, Omar Alhussein, Atefeh Arani, Zhaoyang Zhang, Mérouane Debbah
>
> **Status:** Published article
>
> **Primary source:** [IEEE DOI record](https://doi.org/10.1109/TNSE.2026.3657967)
>
> **Evidence note:** Simulations use four to six pilots per 64 subcarriers at -4 to 0 dB and report up to a twofold reduction in reconstruction error against selected deep-learning baselines. Larger imagination sets increase computation, and no radio-platform deployment is reported.
>
> ### Non-Identical Diffusion Models in MIMO-OFDM Channel Generation
>
> **Authors:** Yuzhi Yang, Omar Alhussein, Mérouane Debbah
>
> **Status:** Preprint
>
> **Primary source:** [arXiv:2509.01641](https://arxiv.org/abs/2509.01641)
>
> **Evidence note:** The argument is supported by theory and numerical MIMO-OFDM experiments. The public record does not include measurements from a radio platform.
>
> ### Diffusion Models for Wireless Transceivers: From Pilot-Efficient Channel Estimation to AI-Native 6G Receivers
>
> **Authors:** Yuzhi Yang, Sen Yan, Weijie Zhou, Brahim Mefgouda, Ridong Li, Zhaoyang Zhang, Mérouane Debbah
>
> **Status:** Preprint
>
> **Primary source:** [arXiv:2510.24495](https://arxiv.org/abs/2510.24495)
>
> **Evidence note:** This is a tutorial and design agenda with a proof-of-concept receiver, not a standardized or broadly benchmarked AI-native receiver architecture.
