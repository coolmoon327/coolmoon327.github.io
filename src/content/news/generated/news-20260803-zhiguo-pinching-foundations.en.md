---
{
  "title": "Zhiguo Ding: foundations, placement, and security for pinching antennas",
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
## Perspective

This advisor-focused reading follows how one research line is built: first define the system, then derive interpretable placement rules, and finally introduce secrecy objectives.

## Flexible-Antenna Systems: A Pinching-Antenna Perspective

**Authors:** Zhiguo Ding, Robert Schober, H. Vincent Poor

**Zhiguo Ding foundations lens.** [Open the primary public record](https://doi.org/10.1109/TCOMM.2025.3555866). This foundation paper models dielectric particles as reconfigurable radiating points on a waveguide. Its single-waveguide analysis emphasizes line-of-sight and path-loss control; multiple pinches on one feed share a signal and motivate NOMA, while the multi-waveguide case is related to a MISO interference channel with stated achievability conditions.

**Zhiguo Ding foundations lens.** **Evidence boundary.** The evidence is analytical and simulation-based. Practical coupling loss, control overhead, channel acquisition, and a hardware prototype are outside the public abstract’s validation.

## Analytical Optimization for Antenna Placement in Pinching-Antenna Systems

**Authors:** Zhiguo Ding, H. Vincent Poor

**Status:** Preprint

**Zhiguo Ding foundations lens.** [Open the primary public record](https://arxiv.org/abs/2507.13307). The preprint derives closed-form antenna-placement rules for several OMA and NOMA objectives. Under its model, fairness-oriented OMA selects a location beneficial to all users, while high-SNR greedy OMA and fairness-oriented NOMA tend toward the user nearest the waveguide.

**Zhiguo Ding foundations lens.** **Evidence boundary.** The conclusions depend on specific objectives and channel assumptions; the high-SNR statements are asymptotic and the record remains a single-version preprint.

## Pinching-Antenna Systems for Physical Layer Security

**Authors:** Kaidi Wang, Zhiguo Ding, Naofal Al-Dhahir

**Zhiguo Ding foundations lens.** [Open the primary public record](https://doi.org/10.1109/LWC.2025.3624885). The letter uses amplitude control to strengthen the intended link and phase alignment to degrade an eavesdropper. A coalition game selects discrete pre-installed pinches, while Shapley and marginal-contribution values quantify each antenna’s role; simulation reports secrecy-rate gains over a coalition-value baseline.

**Zhiguo Ding foundations lens.** **Evidence boundary.** The model assumes channel knowledge and discrete candidate positions, and the evidence is letter-scale simulation without a real adversary or hardware experiment.
