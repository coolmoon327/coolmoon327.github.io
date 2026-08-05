---
{
  "title": "Muhammad Shahzad Arif: how learned anti-jamming systems can be misled",
  "locale": "en",
  "slug": "shahzad-anti-jamming-retrospective",
  "newsId": "news-20260803-shahzad-anti-jamming-retrospective",
  "translationKey": "news-20260803-shahzad-anti-jamming-retrospective",
  "generated": true,
  "date": "2026-08-03",
  "coverageStart": "2024-11-17",
  "coverageEnd": "2026-06-04",
  "module": "interests",
  "keywords": [
    "anti-jamming",
    "adversarial-wireless-learning",
    "reinforcement-learning",
    "physical-layer-security",
    "secure-6g",
    "learning-enabled-wireless",
    "resilient-wireless"
  ],
  "authors": [
    "Muhammad Shahzad Arif",
    "Yuhang Shen",
    "Sami Muhaidat",
    "Paschalis C. Sofotasios",
    "Antonios Argyriou"
  ],
  "subjectIds": [
    "muhammad-shahzad-arif",
    "sami-muhaidat",
    "paschalis-sofotasios"
  ],
  "workIds": [
    "doi-10-1109-jsac-2026-3700139",
    "doi-10-1109-pimrc62392-2025-11275524",
    "doi-10-1109-mecom61498-2024-10881377"
  ],
  "focusSubjectId": "muhammad-shahzad-arif",
  "coverTone": "rose",
  "coverKicker": "COLLABORATOR RESEARCH",
  "coverTitle": "Stress-testing learned defenses",
  "coverPoints": [
    "Black-box jamming",
    "Bait tactics",
    "Sensing errors"
  ],
  "description": "Shows how black-box jammers, baited rewards, and sensing errors can undermine learned defenses across three public simulation studies.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## Perspective

The three studies form an attacker-centered progression: exploit a learned policy through black-box interaction, shape its observations and rewards, and then examine how imperfect sensing changes the attack surface.

## Outsmarting the Smart: Intelligent Jamming Strategies Against AI-Empowered Anti-Jamming Frameworks

**Authors:** Muhammad Shahzad Arif, Yuhang Shen, Sami Muhaidat, Paschalis C. Sofotasios

**Muhammad Shahzad Arif lens.** [Open the primary public record](https://doi.org/10.1109/JSAC.2026.3700139). The public abstract compares interaction-driven and optimization-driven reactive jammers against a reinforcement-learning anti-jamming link under black-box access. It reports that adaptive learning-driven jammers can push the intelligent link toward suboptimal operation while spending less power than conventional reactive jamming, making the work a direct stress test of learned wireless control.

**Muhammad Shahzad Arif lens.** **Evidence boundary.** The abstract does not provide exact deltas for every claim, and the evidence is numerical benchmarking rather than an over-the-air deployment.

## Bait Tactics: Misleading DRL-Based Cognitive Anti-Jamming Communications via Adversarial Learning

**Authors:** Muhammad Shahzad Arif, Sami Muhaidat, Paschalis C. Sofotasios

**Muhammad Shahzad Arif lens.** [Open the primary public record](https://doi.org/10.1109/PIMRC62392.2025.11275524). The study manipulates perceived state transitions and reward variance for a deep-reinforcement-learning anti-jamming agent that also exploits jamming energy through backscatter and harvesting. In the reported simulation, victim throughput falls by as much as 72% while the jammer saves as much as 67% power relative to standard reactive jamming.

**Muhammad Shahzad Arif lens.** **Evidence boundary.** Both percentages are scenario-specific simulation results and should not be read as field measurements or universal attack guarantees.

## Performance of AI-Empowered Anti-Jamming Communications under Hardware Impairments

**Authors:** Muhammad Shahzad Arif, Sami Muhaidat, Antonios Argyriou, Paschalis C. Sofotasios

**Muhammad Shahzad Arif lens.** [Open the primary public record](https://doi.org/10.1109/MECOM61498.2024.10881377). The simulations isolate sensing false alarms and missed detections in a reactive jammer. Under the studied learning setup, those imperfections can randomize the jammer pattern and make it more disruptive to an RL anti-jamming agent than an idealized jammer using the same resources, a useful warning that hardware errors do not always weaken an adversary.

**Muhammad Shahzad Arif lens.** **Evidence boundary.** The conclusion is tied to the paper’s sensing-error and learning model and does not cover every radio impairment or deployed waveform.
