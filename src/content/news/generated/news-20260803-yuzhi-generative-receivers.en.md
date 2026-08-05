---
{
  "title": "Yuzhi Yang: from wireless-powered edge scheduling to diffusion receivers",
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
## Perspective

Viewed as a collaborator profile, the selection connects classical stochastic optimization with a later generative-receiver line, showing a shift from queue control to structured uncertainty modeling at the physical layer.

## Energy-Efficient Online Scheduling for Wireless Powered Mobile Edge Computing Networks

**Authors:** Xingqiu He, Chaoqun You, Yuzhi Yang, Zihan Chen, Yuhang Shen, Tony Q. S. Quek, Yue Gao

**Status:** Preprint

**Yuzhi Yang lens.** [Open the primary public record](https://arxiv.org/abs/2603.07984). The preprint turns a stochastic wireless-powered mobile-edge scheduling problem into per-slot decisions through Lyapunov optimization. Marginal energy efficiency supports a relax-then-adjust method, and the offloading subproblem becomes an assignment problem; the authors also state latency-energy performance guarantees.

**Yuzhi Yang lens.** **Evidence boundary.** The practical evidence is extensive simulation, not a deployed wireless-power and edge-computing system, so robustness is bounded by the modeled queues, channels, and workloads.

## Generative Diffusion Receivers: Achieving Pilot-Efficient MIMO-OFDM Communications

**Authors:** Yuzhi Yang, Omar Alhussein, Atefeh Arani, Zhaoyang Zhang, Mérouane Debbah

**Yuzhi Yang lens.** [Open the primary public record](https://doi.org/10.1109/TNSE.2026.3657967). The receiver treats MIMO-OFDM channel estimation as a diffusion process that combines channel priors with conventional estimation and an imagination-screening step. In simulation, with four to six pilots per 64 subcarriers and SNR from -4 to 0 dB, it reports up to a twofold reduction in channel-reconstruction error versus selected deep-learning baselines.

**Yuzhi Yang lens.** **Evidence boundary.** The evidence is simulated and larger imagination sets increase computation, so pilot efficiency does not by itself establish deployment efficiency.

## Non-Identical Diffusion Models in MIMO-OFDM Channel Generation

**Authors:** Yuzhi Yang, Omar Alhussein, Mérouane Debbah

**Status:** Preprint

**Yuzhi Yang lens.** [Open the primary public record](https://arxiv.org/abs/2509.01641). This work replaces one global diffusion time index with element-wise indicators so the model can represent uneven reliability across pilots and subcarriers. It proposes dimension-wise time embeddings and evaluates several training and generation methods with theoretical checks and numerical MIMO-OFDM experiments.

**Yuzhi Yang lens.** **Evidence boundary.** The public record is a revised preprint, and its reported effectiveness is numerical rather than measured on a radio platform.

## Diffusion Models for Wireless Transceivers: From Pilot-Efficient Channel Estimation to AI-Native 6G Receivers

**Authors:** Yuzhi Yang, Sen Yan, Weijie Zhou, Brahim Mefgouda, Ridong Li, Zhaoyang Zhang, Mérouane Debbah

**Status:** Preprint

**Yuzhi Yang lens.** [Open the primary public record](https://arxiv.org/abs/2510.24495). This tutorial-style preprint explains how diffusion models can combine rough channel estimates with signal-processing structure, then supplies a proof-of-concept receiver case study. Its main value is the transceiver design map and research agenda rather than a broad experimental benchmark.

**Yuzhi Yang lens.** **Evidence boundary.** The public evidence is a proof of concept, not a standardized or broadly validated AI-native receiver architecture.
