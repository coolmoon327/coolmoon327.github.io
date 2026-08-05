---
{
  "title": "Mérouane Debbah: evidence for AI-native wireless, from receivers to reasoning",
  "locale": "en",
  "slug": "merouane-ai-native-wireless",
  "newsId": "news-20260803-merouane-ai-native-wireless",
  "translationKey": "news-20260803-merouane-ai-native-wireless",
  "generated": true,
  "date": "2026-08-03",
  "coverageStart": "2025-02-28",
  "coverageEnd": "2026-03-02",
  "module": "interests",
  "keywords": [
    "physical-layer-security",
    "learning-enabled-wireless",
    "resilient-wireless",
    "wireless-optimization",
    "secure-6g",
    "generative-wireless-receivers",
    "ai-native-wireless",
    "semantic-communications",
    "edge-and-fog-systems"
  ],
  "authors": [
    "Li Yang",
    "Shimaa Naser",
    "Abdallah Shami",
    "Sami Muhaidat",
    "Lyndon Ong",
    "Mérouane Debbah",
    "Yuzhi Yang",
    "Omar Alhussein",
    "Atefeh Arani",
    "Zhaoyang Zhang",
    "Sen Yan",
    "Weijie Zhou",
    "Brahim Mefgouda",
    "Ridong Li",
    "Mohamed Amine Ferrag",
    "Abderrahmane Lakas"
  ],
  "subjectIds": [
    "sami-muhaidat",
    "merouane-debbah",
    "yuzhi-yang-wireless"
  ],
  "workIds": [
    "doi-10-1109-tcomm-2025-3547764",
    "doi-10-1109-tnse-2026-3657967",
    "arxiv-2509-01641",
    "arxiv-2510-24495",
    "arxiv-2602-08675",
    "arxiv-2603-02156"
  ],
  "focusSubjectId": "merouane-debbah",
  "coverTone": "violet",
  "coverKicker": "PROFESSOR RESEARCH",
  "coverTitle": "AI-native wireless at several scales",
  "coverPoints": [
    "Automated security",
    "Diffusion receivers",
    "6G reasoning"
  ],
  "description": "Tracks automated 6G security, diffusion receivers, and compact-model reasoning while separating dataset, simulation, and proof-of-concept evidence from deployment claims.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## Perspective

Across these six works, the common thread is not one AI technique but a progression from automated security decisions to generative receivers and compact-model network reasoning. The useful comparison is how each paper defines evidence: datasets, simulations, a proof of concept, or a benchmark.

## Towards Zero Touch Networks: Cross-Layer Automated Security Solutions for 6G Wireless Networks

**Authors:** Li Yang, Shimaa Naser, Abdallah Shami, Sami Muhaidat, Lyndon Ong, Mérouane Debbah

**AI-native wireless lens.** [Open the primary public record](https://doi.org/10.1109/TCOMM.2025.3547764). The paper combines drift-adaptive online learning with a successive-halving AutoML procedure for physical-layer authentication and cross-layer intrusion detection. Public RF-fingerprinting and CICIDS2017 datasets support the evaluation, so the contribution is an integrated automated-security workflow rather than only a single detector.

**AI-native wireless lens.** **Evidence boundary.** Validation remains dataset-based and covers two security tasks; it is not evidence of an autonomous zero-touch 6G deployment.

## Generative Diffusion Receivers: Achieving Pilot-Efficient MIMO-OFDM Communications

**Authors:** Yuzhi Yang, Omar Alhussein, Atefeh Arani, Zhaoyang Zhang, Mérouane Debbah

**AI-native wireless lens.** [Open the primary public record](https://doi.org/10.1109/TNSE.2026.3657967). The receiver treats MIMO-OFDM channel estimation as a diffusion process that combines channel priors with conventional estimation and an imagination-screening step. In simulation, with four to six pilots per 64 subcarriers and SNR from -4 to 0 dB, it reports up to a twofold reduction in channel-reconstruction error versus selected deep-learning baselines.

**AI-native wireless lens.** **Evidence boundary.** The evidence is simulated and larger imagination sets increase computation, so pilot efficiency does not by itself establish deployment efficiency.

## Non-Identical Diffusion Models in MIMO-OFDM Channel Generation

**Authors:** Yuzhi Yang, Omar Alhussein, Mérouane Debbah

**Status:** Preprint

**AI-native wireless lens.** [Open the primary public record](https://arxiv.org/abs/2509.01641). This work replaces one global diffusion time index with element-wise indicators so the model can represent uneven reliability across pilots and subcarriers. It proposes dimension-wise time embeddings and evaluates several training and generation methods with theoretical checks and numerical MIMO-OFDM experiments.

**AI-native wireless lens.** **Evidence boundary.** The public record is a revised preprint, and its reported effectiveness is numerical rather than measured on a radio platform.

## Diffusion Models for Wireless Transceivers: From Pilot-Efficient Channel Estimation to AI-Native 6G Receivers

**Authors:** Yuzhi Yang, Sen Yan, Weijie Zhou, Brahim Mefgouda, Ridong Li, Zhaoyang Zhang, Mérouane Debbah

**Status:** Preprint

**AI-native wireless lens.** [Open the primary public record](https://arxiv.org/abs/2510.24495). This tutorial-style preprint explains how diffusion models can combine rough channel estimates with signal-processing structure, then supplies a proof-of-concept receiver case study. Its main value is the transceiver design map and research agenda rather than a broad experimental benchmark.

**AI-native wireless lens.** **Evidence boundary.** The public evidence is a proof of concept, not a standardized or broadly validated AI-native receiver architecture.

## 6G-Bench: An Open Benchmark for Semantic Communication and Network-Level Reasoning with Foundation Models in AI-Native 6G Networks

**Authors:** Mohamed Amine Ferrag, Abderrahmane Lakas, Mérouane Debbah

**Status:** Preprint

[Open the primary public record](https://arxiv.org/abs/2602.08675). 6G-Bench organizes 30 standardization-aligned decision tasks into five capability groups. From 113,475 scenarios it generates 10,000 difficult multiple-choice items, retains 3,722 after filtering and expert validation, and reports pass@1 from 0.22 to 0.82 across 22 evaluated foundation models.

**Evidence boundary.** The benchmark is dominated by generated multiple-choice questions and a snapshot of current models; success on it is not the same as safe control of a live network.

## How Small Can 6G Reason? Scaling Tiny-to-Small Language Models for AI-Native Networks

**Authors:** Mohamed Amine Ferrag, Abderrahmane Lakas, Mérouane Debbah

**Status:** Preprint

[Open the primary public record](https://arxiv.org/abs/2603.02156). Using 6G-Bench, the study profiles models from 135 million to 7 billion parameters and reports a pronounced stability transition around 1 to 1.5 billion. Its Edge Score combines accuracy, latency, and memory, with roughly 1.5 to 3 billion parameters giving the best reported balance rather than monotonic gains from scale.

**Evidence boundary.** The conclusion depends on one benchmark and single-query inference profiles; hardware, quantization, and serving stacks can move the apparent edge sweet spot.
