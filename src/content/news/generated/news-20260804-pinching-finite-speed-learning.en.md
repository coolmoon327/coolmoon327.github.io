---
{
  "title": "Finite-speed pinching antennas meet federated learning",
  "locale": "en",
  "slug": "pinching-finite-speed-learning",
  "newsId": "news-20260804-pinching-finite-speed-learning",
  "translationKey": "news-20260804-pinching-finite-speed-learning",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2026-07-26",
  "coverageEnd": "2026-07-26",
  "module": "interests",
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
  "coverTone": "mint",
  "coverKicker": "PINCHING ANTENNAS",
  "coverTitle": "Mobility becomes part of learning",
  "coverPoints": [
    "Actuation limit",
    "Device selection",
    "Simulation"
  ],
  "description": "Introduces finite antenna speed into federated-learning device selection and placement, while keeping convergence and age gains labeled as simulation results.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## A movable antenna cannot teleport

Much of the appeal of a pinching antenna comes from moving a radiating point to a favorable position along a waveguide. If that movement is modeled as instantaneous, however, the optimization receives a benefit without paying the time needed to obtain it. In federated learning, where every round includes local computation and wireless upload, even a modest repositioning delay can change which devices are worth selecting and how fresh their updates remain.

[Age-of-Information Aware Federated Learning with Finite Speed Pinching Antenna](https://arxiv.org/abs/2607.23595) places that missing time directly inside the learning loop. The antenna can travel only a finite distance in each round, so device participation, feasible position, local training, upload duration, and information age become parts of one coupled decision rather than separate optimization layers.

## Co-designing movement, participation, and freshness

The paper uses a coalition game to select participating devices and branch-and-bound optimization to determine antenna placement within the feasible region. The two stages reflect the structure of the problem: a discrete choice decides whose updates should enter the round, while a constrained spatial search decides where the radiating point can move in the available time.

Information age provides a useful objective because a device update can become less valuable while it waits. Repositioning toward a favorable channel may shorten upload time, yet moving too far consumes part of the round and may delay other participants. The proposed formulation makes this tension explicit instead of assuming that communication quality can be improved at zero actuation cost.

## Simulation results and the missing hardware costs

In simulation, the proposed design reports faster learning convergence and lower total information age than the selected alternatives. These results show how a physical mobility limit can alter learning-system scheduling and why optimizing placement independently of training may miss an important source of delay.

The evidence remains model-based. Branch-and-bound establishes the placement result within the defined feasible region, not global optimality for the entire end-to-end learning system. The simulations also do not measure actuator energy, position error, mechanical wear, sensing latency, or the control overhead required to move and verify a real antenna. A hardware study would need to account for those costs before finite-speed placement can be judged operationally beneficial.

## Research notes

> ### Age-of-Information Aware Federated Learning with Finite Speed Pinching Antenna
>
> **Authors:** Kaidi Wang, Daniel K C So, Zhiguo Ding
>
> **Status:** Preprint
>
> **Primary source:** [arXiv:2607.23595](https://arxiv.org/abs/2607.23595)
>
> **Evidence note:** A coalition game selects devices and branch-and-bound optimizes placement within the defined feasible region. Simulations report faster convergence and lower total information age; measured actuator energy, positioning error, mechanical cost, and hardware experiments are not included.
