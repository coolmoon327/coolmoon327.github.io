---
{
  "title": "Prof. Zhiguo Ding: foundations, placement, and security for pinching antennas",
  "locale": "en",
  "slug": "zhiguo-pinching-foundations",
  "newsId": "news-20260803-zhiguo-pinching-foundations",
  "translationKey": "news-20260803-zhiguo-pinching-foundations",
  "generated": true,
  "date": "2026-08-03",
  "coverageStart": "2024-12-03",
  "coverageEnd": "2025-07-17",
  "module": "advisors",
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
  "focusSubjectId": "zhiguo-ding",
  "coverTone": "amber",
  "coverKicker": "ADVISOR RESEARCH",
  "coverTitle": "An early pinching-antenna research arc",
  "coverPoints": [
    "System model",
    "Placement rules",
    "Secrecy"
  ],
  "description": "Traces pinching antennas from a waveguide system model through closed-form placement and secrecy control, before the field’s latest prototype claims.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## Building a research line from first principles

The early pinching-antenna work of Prof. Zhiguo Ding illustrates how a new hardware idea can be developed into a research program. The sequence matters. Before optimizing a device, the communication model has to say what a pinch radiates and how several pinches interact. Before claiming adaptive placement, one has to identify the structure of a good location. Before discussing secure transmission, the model has to explain which spatial controls distinguish a legitimate receiver from an eavesdropper.

The first paper treats dielectric particles on a waveguide as reconfigurable radiating points. For one waveguide, location changes line-of-sight geometry and path loss. Multiple pinches sharing a feed motivate NOMA, while multiple waveguides connect the system to a MISO interference channel with stated achievability conditions. This step gives the research line its common language: waveguide propagation, shared excitation, and position-dependent radiation.

## Turning the model into an interpretable design

The placement paper then asks which of those locations should be used. Rather than relying only on numerical optimization, it derives closed-form antenna-placement rules for several OMA and NOMA objectives. Fairness-oriented OMA chooses a location that benefits the user set under the stated model; at high SNR, greedy OMA and fairness-oriented NOMA tend toward the user closest to the waveguide. The formulas make the tradeoff visible and provide a reference against which more elaborate algorithms can later be judged.

The security letter adds a new objective without discarding that structure. Amplitude control is used to reinforce the intended link, phase alignment to suppress the eavesdropper, and a coalition game to activate a subset of discrete pre-installed pinching points. Shapley values and marginal contributions then describe how individual antennas support the coalition. Simulated secrecy-rate gains show that placement can become a security resource, not merely a coverage tool.

Viewed as a research trajectory, the contribution is the progression from abstraction to design rule to application. Prof. Zhiguo Ding’s papers establish analytical handles that make later hardware and network studies easier to interpret. They do not yet settle coupling loss, acquisition overhead, control latency, or real adversarial behavior, but they define the questions a convincing prototype will have to answer.

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
