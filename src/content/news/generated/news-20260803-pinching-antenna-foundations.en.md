---
{
  "title": "Pinching antennas: what the public evidence establishes so far",
  "locale": "en",
  "slug": "pinching-antenna-foundations",
  "newsId": "news-20260803-pinching-antenna-foundations",
  "translationKey": "news-20260803-pinching-antenna-foundations",
  "generated": true,
  "date": "2026-08-03",
  "coverageStart": "2024-12-03",
  "coverageEnd": "2025-07-17",
  "module": "interests",
  "keywords": [
    "pinching-antennas",
    "movable-antennas",
    "noma",
    "wireless-optimization",
    "physical-layer-security"
  ],
  "authors": [
    "Zhiguo Ding",
    "Robert Schober",
    "H. Vincent Poor",
    "Kaidi Wang",
    "Naofal Al-Dhahir"
  ],
  "subjectIds": [
    "zhiguo-ding"
  ],
  "workIds": [
    "doi-10-1109-tcomm-2025-3555866",
    "arxiv-2507-13307",
    "doi-10-1109-lwc-2025-3624885"
  ],
  "coverTone": "amber",
  "coverKicker": "RESEARCH INTEREST",
  "coverTitle": "Foundation before hype",
  "coverPoints": [
    "Waveguide model",
    "Optimization",
    "Security"
  ],
  "description": "Builds a careful pinching-antenna baseline from waveguide modeling, placement rules, and secrecy design, all bounded by analytical or simulated evidence.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## Why position can become a radio control variable

A conventional antenna array is designed around radiators whose locations are fixed. A pinching-antenna system changes that premise: dielectric elements placed along a waveguide act as reconfigurable radiating points, so geometry becomes part of transmission design. The attraction is easy to see, but the technology needs a clear mathematical baseline before prototype results or performance claims can be judged.

The foundational paper led by Prof. Zhiguo Ding provides that baseline. In a single-waveguide setting, line-of-sight geometry and path loss connect the pinch locations to received power. Several pinches driven by the same feed share one signal, which naturally leads to a NOMA interpretation. With multiple waveguides, the model becomes related to a MISO interference channel and supports stated achievability conditions. This framework turns a visually intuitive idea—moving a radiation point closer to a user—into a communication model that can be analyzed.

## From system geometry to placement rules

Once location is a control variable, the next question is whether useful placements require a costly numerical search. [Analytical Optimization for Antenna Placement](https://arxiv.org/abs/2507.13307) derives closed-form rules for several OMA and NOMA objectives. Under the paper’s assumptions, fairness-oriented OMA chooses a position that benefits all users. At high SNR, greedy OMA and fairness-oriented NOMA tend to favor the user closest to the waveguide. The result is valuable because it exposes the structure of the optimization rather than treating placement as a black box, although the conclusions remain tied to the selected objective and channel model.

## Making geometry serve secrecy

The security paper asks whether the same spatial flexibility can separate a legitimate receiver from an eavesdropper. It combines amplitude control that strengthens the intended link with phase alignment that weakens the unintended one. A coalition game chooses among discrete, pre-installed pinching points, while Shapley values and marginal contributions quantify how much each active antenna adds. Simulations report secrecy-rate gains over a coalition-value baseline.

These three papers establish a coherent starting point for the field: a waveguide-based system model, interpretable placement structure, and a first physical-layer security design. They also show what is still missing. Practical coupling loss, channel acquisition, control overhead, and measured hardware behavior are not resolved by analytical and simulation results. The foundation is therefore substantial, but it should be read as the platform on which experiments must be built rather than as proof that the complete system is deployment-ready.

## Research notes

> ### Flexible-Antenna Systems: A Pinching-Antenna Perspective
>
> - **Authors:** Zhiguo Ding, Robert Schober, H. Vincent Poor
> - **Status:** Published journal article
> - **Primary source:** [IEEE Transactions on Communications](https://doi.org/10.1109/TCOMM.2025.3555866)
> **Evidence note:** The analysis and simulations do not validate practical coupling loss, control overhead, channel acquisition, or a hardware prototype.
>
> ### Analytical Optimization for Antenna Placement in Pinching-Antenna Systems
>
> - **Authors:** Zhiguo Ding, H. Vincent Poor
> - **Status:** Preprint
> - **Primary source:** [arXiv:2507.13307](https://arxiv.org/abs/2507.13307)
> **Evidence note:** The placement conclusions depend on the stated objectives and channel model; the high-SNR results are asymptotic.
>
> ### Pinching-Antenna Systems for Physical Layer Security
>
> - **Authors:** Kaidi Wang, Zhiguo Ding, Naofal Al-Dhahir
> - **Status:** Published journal article
> - **Primary source:** [IEEE Wireless Communications Letters](https://doi.org/10.1109/LWC.2025.3624885)
> **Evidence note:** The model assumes channel knowledge and discrete candidate positions, and validation is simulation-based without a real adversary or hardware experiment.
