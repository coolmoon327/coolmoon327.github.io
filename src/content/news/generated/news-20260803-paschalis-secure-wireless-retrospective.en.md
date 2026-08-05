---
{
  "title": "Prof. Paschalis C. Sofotasios: secure wireless systems under explicit assumptions",
  "locale": "en",
  "slug": "paschalis-secure-wireless-retrospective",
  "newsId": "news-20260803-paschalis-secure-wireless-retrospective",
  "translationKey": "news-20260803-paschalis-secure-wireless-retrospective",
  "generated": true,
  "date": "2026-08-03",
  "coverageStart": "2024-11-17",
  "coverageEnd": "2026-06-04",
  "module": "advisors",
  "keywords": [
    "anti-jamming",
    "adversarial-wireless-learning",
    "reinforcement-learning",
    "physical-layer-security",
    "secure-6g",
    "learning-enabled-wireless",
    "resilient-wireless",
    "ris",
    "wireless-optimization"
  ],
  "authors": [
    "Muhammad Shahzad Arif",
    "Yuhang Shen",
    "Sami Muhaidat",
    "Paschalis C. Sofotasios",
    "Antonios Argyriou",
    "Khalid AlHamdani",
    "Shimaa Naser"
  ],
  "subjectIds": [
    "muhammad-shahzad-arif",
    "sami-muhaidat",
    "paschalis-sofotasios"
  ],
  "workIds": [
    "doi-10-1109-jsac-2026-3700139",
    "doi-10-1109-pimrc62392-2025-11275524",
    "doi-10-1109-mecom61498-2024-10881377",
    "doi-10-1109-lwc-2025-3530823"
  ],
  "focusSubjectId": "paschalis-sofotasios",
  "coverTone": "ocean",
  "coverKicker": "ADVISOR RESEARCH",
  "coverTitle": "Security under explicit assumptions",
  "coverPoints": [
    "Anti-jamming",
    "Hardware limits",
    "RIS"
  ],
  "description": "Examines learned jamming, sensing imperfections, and RIS time reversal through public numerical evidence, with hardware and field-validation limits stated explicitly.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## Security improves when the assumptions become harder

A useful thread through the recent work of Prof. Paschalis C. Sofotasios is the decision to make inconvenient assumptions visible. A learning-based anti-jamming system may face an adversary that adapts to its policy; the jammer’s sensing hardware may be imperfect; and a reconfigurable surface may not have enough physical freedom to realize an ideal response. Once those constraints enter the model, “intelligent” no longer means automatically robust. It becomes a claim that has to be tested against a specific opponent, channel, and implementation budget.

The anti-jamming studies follow that logic from deliberate attack to accidental impairment. [Outsmarting the Smart](https://doi.org/10.1109/JSAC.2026.3700139) considers a black-box adversary observing an RL-controlled wireless link. Interaction-driven and optimization-driven reactive jammers adapt to the victim rather than following a fixed pattern. The public abstract reports that these learning-enabled strategies can steer the link toward suboptimal operation while using less power than conventional reactive jamming. The important lesson is not one universal loss figure, but the fact that a policy can reveal enough behavioral structure to become a target.

## When the observation itself becomes the attack surface

[Bait Tactics](https://doi.org/10.1109/PIMRC62392.2025.11275524) pushes the attack inside the agent’s learning signal. By manipulating perceived state transitions and reward variance, the jammer misleads a deep-RL anti-jamming agent that also uses hostile energy for backscatter and harvesting. In the reported simulation, victim throughput drops by as much as 72%, while the jammer saves as much as 67% power relative to standard reactive jamming. Those values belong to the paper’s scenario, but they show why evaluating only average link performance can miss a strategic vulnerability in the learning loop.

The hardware-impairment study reaches a less intuitive conclusion. False alarms and missed detections make a reactive jammer less accurate, yet the resulting randomness can make its pattern harder for the RL defender to learn. Under the evaluated sensing-error and learning model, an imperfect jammer can therefore disrupt the agent more effectively than an idealized jammer using the same resources. Hardware error is not always a benign weakness; in an adaptive system, it can change the distribution in a way that frustrates prediction.

## Physical limits can also simplify the design

The same assumption-first approach appears in [Time Reversal in RIS-Aided Environments](https://doi.org/10.1109/LWC.2025.3530823). The paper studies frequency-selective channels, time-reversal precoding, bit-error rate, and diversity under several reflection configurations. Its public abstract reports that maximizing aperture gain at the strongest tap performs comparably to the studied optimal RIS configuration because the surface has limited degrees of freedom. That result is valuable for a different reason: acknowledging the physical limit suggests a simpler design whose performance is close to the more elaborate benchmark.

Across these papers, robustness is not presented as a label attached to AI or RIS. It is built by asking what the adversary can observe, what the sensor can misread, and what the hardware can actually control. The available evidence is analytical or numerical rather than an over-the-air campaign, but the modeling discipline is already useful: a security claim becomes more credible when the conditions under which it can fail are part of the design.

## Research notes

> ### Outsmarting the Smart: Intelligent Jamming Strategies Against AI-Empowered Anti-Jamming Frameworks
>
> - **Authors:** Muhammad Shahzad Arif, Yuhang Shen, Sami Muhaidat, Paschalis C. Sofotasios
> - **Status:** Published journal article
> - **Primary source:** [IEEE Journal on Selected Areas in Communications](https://doi.org/10.1109/JSAC.2026.3700139)
> **Evidence note:** The public abstract does not quantify every reported improvement or loss; the evidence is numerical benchmarking rather than an over-the-air deployment.
>
> ### Bait Tactics: Misleading DRL-Based Cognitive Anti-Jamming Communications via Adversarial Learning
>
> - **Authors:** Muhammad Shahzad Arif, Sami Muhaidat, Paschalis C. Sofotasios
> - **Status:** Published conference paper
> - **Primary source:** [IEEE PIMRC](https://doi.org/10.1109/PIMRC62392.2025.11275524)
> **Evidence note:** The 72% throughput loss and 67% jammer-power saving are scenario-specific simulation results, not field measurements or universal guarantees.
>
> ### Performance of AI-Empowered Anti-Jamming Communications under Hardware Impairments
>
> - **Authors:** Muhammad Shahzad Arif, Sami Muhaidat, Antonios Argyriou, Paschalis C. Sofotasios
> - **Status:** Published conference paper
> - **Primary source:** [IEEE MECOM](https://doi.org/10.1109/MECOM61498.2024.10881377)
> **Evidence note:** The conclusion follows from the evaluated sensing-error and learning model and does not cover every radio impairment or deployed waveform.
>
> ### Time Reversal in RIS-Aided Environments
>
> - **Authors:** Khalid AlHamdani, Shimaa Naser, Sami Muhaidat, Paschalis C. Sofotasios
> - **Status:** Published journal article
> - **Primary source:** [IEEE Wireless Communications Letters](https://doi.org/10.1109/LWC.2025.3530823)
> **Evidence note:** Validation is analytical and simulation-based; no hardware prototype or measured channel campaign is reported.
