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
## An intelligent defender creates a new kind of target

Muhammad Shahzad Arif’s recent anti-jamming work asks what happens when the attacker stops being a fixed source of interference and starts studying the defender. A reinforcement-learning radio changes channels or operating modes from experience, but those decisions also reveal a policy. The three studies follow that attack surface from black-box behavioral exploitation, through manipulation of the learning signal, to the surprising effects of imperfect sensing.

[Outsmarting the Smart](https://doi.org/10.1109/JSAC.2026.3700139) starts with an adversary that has black-box access rather than the victim’s internal model. Interaction-driven and optimization-driven reactive jammers adapt to observed behavior and can push the learned anti-jamming link toward suboptimal operation. The public abstract also reports lower power consumption than conventional reactive jamming. A defender does not need to expose its parameters to leak useful information; repeated actions can be enough.

## Attacking what the agent believes

[Bait Tactics](https://doi.org/10.1109/PIMRC62392.2025.11275524) targets the agent’s perceived state transitions and reward variance. The victim is a deep-RL cognitive radio that can exploit jamming energy through backscatter and harvesting, so the attacker must influence both communication and learning. In the reported simulation, victim throughput falls by as much as 72%, while the jammer uses as much as 67% less power than standard reactive jamming. These are scenario-specific values, but they demonstrate that misleading experience can be more efficient than simply transmitting more interference.

The hardware-impairment paper then asks whether a jammer becomes harmless when its sensing is inaccurate. False alarms and missed detections do weaken its observation, yet they also randomize the interference pattern. Under the evaluated model, that randomness can make the jammer more disruptive to an RL defender than an idealized jammer using the same resources. An error on the attacking side can therefore act like an unintended form of adversarial diversity.

Together, the studies shift anti-jamming evaluation away from a contest against one fixed baseline. A credible learned defense should be tested against adaptive behavior, corrupted feedback, and uncertainty in the attacker itself. The current evidence is numerical and tied to specific learning and sensing models, so it does not establish universal attack success. It does, however, define a much harder and more realistic evaluation agenda.

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
