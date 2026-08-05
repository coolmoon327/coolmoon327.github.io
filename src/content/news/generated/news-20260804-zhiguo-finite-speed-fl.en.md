---
{
  "title": "Prof. Zhiguo Ding: federated learning with finite-speed pinching antennas",
  "locale": "en",
  "slug": "zhiguo-finite-speed-fl",
  "newsId": "news-20260804-zhiguo-finite-speed-fl",
  "translationKey": "news-20260804-zhiguo-finite-speed-fl",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2026-07-26",
  "coverageEnd": "2026-07-26",
  "module": "advisors",
  "keywords": [
    "pinching-antennas",
    "learning-enabled-wireless",
    "wireless-optimization"
  ],
  "authors": [
    "Kaidi Wang",
    "Daniel K C So",
    "Zhiguo Ding"
  ],
  "subjectIds": [
    "zhiguo-ding"
  ],
  "workIds": [
    "arxiv-2607-23595"
  ],
  "focusSubjectId": "zhiguo-ding",
  "coverTone": "mint",
  "coverKicker": "RECENT ADVISOR WORK",
  "coverTitle": "Replacing ideal motion with a constraint",
  "coverPoints": [
    "Finite speed",
    "Federated learning",
    "AoI"
  ],
  "description": "Summarizes finite-speed pinching-antenna federated learning, where coalition selection and branch-and-bound placement are evaluated only through simulation.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## Replacing ideal mobility with a physical constraint

In the pinching-antenna research program involving Prof. Zhiguo Ding, configurable placement is a source of performance gain: a radiating point can move along a waveguide to reshape the effective channel. [Age-of-Information Aware Federated Learning with Finite Speed Pinching Antenna](https://arxiv.org/abs/2607.23595) asks what happens when that movement is no longer idealized as instantaneous.

The answer changes the problem substantially. Once the antenna has a finite speed, repositioning consumes part of every federated-learning round. Device selection, antenna location, local computation, upload time, and the freshness of model updates become inseparable. This is a useful step in the research trajectory because it forces communication optimization to account for a physical action rather than treating geometry as a freely adjustable variable.

## Linking actuator time to learning freshness

The proposed method uses a coalition game to choose participating devices and a branch-and-bound procedure to locate the antenna within the round’s reachable region. This combination gives the discrete participation decision and the continuous placement decision separate algorithmic roles while preserving their coupling through time and information age.

For federated learning, information age is more than a networking metric. An update may be statistically useful when computed but less useful after a long movement and upload delay. The formulation therefore connects a mechanical limit at the antenna to the pace at which the global model receives current information.

## A more realistic model awaiting physical validation

Simulations report faster convergence and lower total information age against the selected comparison methods. The contribution is not simply a new optimizer; it demonstrates how removing one convenient physical assumption can reorder learning and communication decisions across an entire round.

The remaining gap is experimental. The public results do not include actuator power, movement uncertainty, wear, calibration, or the latency of measuring the new channel after repositioning. For Prof. Zhiguo Ding’s broader pinching-antenna work, a hardware implementation would reveal whether the modeled freshness gain survives the costs required to move, sense, and control a real radiating point.

## Research notes

> ### Age-of-Information Aware Federated Learning with Finite Speed Pinching Antenna
>
> **Authors:** Kaidi Wang, Daniel K C So, Zhiguo Ding
>
> **Status:** Preprint
>
> **Primary source:** [arXiv:2607.23595](https://arxiv.org/abs/2607.23595)
>
> **Evidence note:** Device selection uses a coalition game, while branch-and-bound optimizes placement within a finite-speed feasible region. Faster convergence and lower total information age are simulation results; measured actuator costs and hardware validation are not reported.
