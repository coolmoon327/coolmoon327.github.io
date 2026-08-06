---
{
  "title": "Prof. Paschalis C. Sofotasios: from measured channels to dependable link models",
  "locale": "en",
  "slug": "paschalis-measurement-to-model",
  "newsId": "news-20260804-paschalis-measurement-to-model",
  "translationKey": "news-20260804-paschalis-measurement-to-model",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2024-04-16",
  "coverageEnd": "2025-08-25",
  "module": "advisors",
  "keywords": [
    "resource-allocation",
    "secure-6g",
    "wireless-communications",
    "physical-layer-security",
    "resilient-wireless",
    "energy-constrained-iot",
    "wireless-power-transfer",
    "learning-enabled-wireless",
    "ris",
    "noma"
  ],
  "authors": [
    "Athanasios P. Chrysologou",
    "Sotiris A. Tegos",
    "Panagiotis D. Diamantoulakis",
    "Nestor D. Chatzidiamantis",
    "Paschalis C. Sofotasios",
    "George K. Karagiannidis",
    "Esraa M. Ghourab",
    "Shimaa Naser",
    "Sami Muhaidat",
    "Lina Bariah",
    "Mahmoud Al-Qutayri",
    "Ernesto Damiani",
    "Mehmet C. Ilter",
    "Mikko Valkama",
    "Jyri Hämäläinen",
    "Nida Chaudhry",
    "Simon L. Cotton",
    "Nidhi Simmons",
    "Claudio R. C. M. Da Silva",
    "Okan Yurduseven",
    "Michail Matthaiou",
    "Trung Q. Duong",
    "Selina Shrestha",
    "Hany Elgala",
    "Maria Cecilia Luna Alvarado",
    "Carlos Rafael Nogueira da Silva",
    "Michel Daoud Yacoub",
    "Rawan Derbas"
  ],
  "subjectIds": [
    "paschalis-sofotasios",
    "sami-muhaidat"
  ],
  "workIds": [
    "doi-10-1109-tcomm-2024-3403502",
    "doi-10-1016-j-vehcom-2024-100774",
    "doi-10-1109-lcomm-2024-3393979",
    "doi-10-1109-pimrc59610-2024-10817218",
    "doi-10-1109-jiot-2024-3390443",
    "doi-10-1109-tcomm-2025-3581005",
    "doi-10-1109-tcomm-2025-3602357"
  ],
  "focusSubjectId": "paschalis-sofotasios",
  "coverTone": "ocean",
  "coverKicker": "PASCHALIS C. SOFOTASIOS",
  "coverTitle": "Measure first, then make the model earn its assumptions",
  "coverPoints": [
    "Measured channels",
    "Imperfect links",
    "Dependable adaptation"
  ],
  "description": "Seven works connect channel measurement and generalized fading analysis with energy-aware communication, learned modulation, STAR-RIS multiple access, and adaptive vehicular security.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## Begin with the channel that actually exists

The recent work of Prof. Paschalis C. Sofotasios is held together by a practical question: how much confidence should a communication design place in its channel model? A useful answer needs both ends of the chain. Measurements reveal how a real link behaves, while tractable analysis turns that behavior into design rules. The 2024–2025 papers gathered here then carry those rules into rate splitting, radio-frequency energy harvesting, reconfigurable surfaces, learned modulation, index-modulated multiple access, and vehicular security.

[Channel Measurements at 6.4 GHz for IEEE 802.11be WLAN](https://doi.org/10.1109/pimrc59610.2024.10817218) starts from observed propagation rather than an idealized distribution. Its indoor and outdoor campaigns cover line-of-sight and non-line-of-sight settings over 256 frequencies between 6.425 and 6.445 GHz. The paper extracts path-loss, large-scale fading, small-scale fading, and coherence-time behavior, then compares candidate statistical fits. Those results belong to the reported environments, but they give later system models a firmer empirical basis than a convenient fading law chosen in isolation.

[Performance of RIS-Assisted Systems in Mixed Fading Conditions](https://doi.org/10.1109/tcomm.2025.3581005) works in the opposite direction. It develops outage and symbol-error analysis for reconfigurable intelligent surface links whose two hops can follow different generalized fading families, including alpha-mu, kappa-mu, and extended eta-mu models. Exact, approximate, and asymptotic expressions expose how fading severity and the number of surface elements affect the studied links. The value is not that one formula describes every deployment; it is that mixed propagation conditions can be examined without silently forcing both sides of the surface into the same statistical mold.

## Treat imperfections as part of the architecture

That discipline becomes especially important when several services share a network. [On the Coexistence of Heterogeneous Services in 6G Networks: An Imperfection-Aware RSMA Framework](https://doi.org/10.1109/tcomm.2024.3403502) combines orthogonal access with rate-splitting multiple access for enhanced mobile broadband and massive machine-type traffic. Imperfect channel estimates and imperfect successive interference cancellation are included in the performance analysis rather than appended after the scheme is designed. The resulting ergodic-rate floors are a reminder that more sophisticated access cannot outrun residual uncertainty indefinitely.

Energy-limited devices introduce a different kind of imperfection: a packet cannot be delivered until energy has first been accumulated. [Energy Harvesting Meets Data-Oriented Communication: Delay-Outage Ratio Analysis](https://doi.org/10.1109/lcomm.2024.3393979) therefore studies a delay-outage ratio that couples far-field wireless power transfer, charging time, payload size, bandwidth, and the communication deadline. This data-oriented metric makes a subtle but useful shift. It asks whether a requested amount of information arrives on time, not merely whether the instantaneous radio link exceeds a threshold. Analytical expressions and numerical corroboration then show how energy acquisition and data delivery compete within one latency budget.

## Learn the right representation, and move the attack surface

The same concern with model mismatch appears in the team’s learning-enabled work. [Autoencoder-Based Spatial Modulation for the Next Generation of Wireless Networks](https://doi.org/10.1109/jiot.2024.3390443) develops three autoencoder formulations for spatial modulation. Two explicitly encode antenna-index information—through a phase-shift-keying signature or a learned embedding—to reduce the degradation caused by highly correlated transmit antennas. The reported Rician-channel simulations show substantial gains for the proposed formulations, but the durable idea is broader: a neural transceiver should be given a representation that preserves the discrete spatial decision it must recover.

That representation question also arises without a neural encoder. [Index Modulation Aided Non-Orthogonal Multiple Access in STAR-RIS-Assisted Networks](https://doi.org/10.1109/tcomm.2025.3602357) maps information for an index-modulated user across STAR-RIS subsurfaces according to a predefined pattern. An energy-based maximum-likelihood detector then infers the active subsurface indices from received-signal energy. The public abstract reports pairwise-error, bit-error upper-bound, and achievable-rate analysis under Beaulieu–Xie fading. This makes index selection part of the multiple-access design, but the reported characterization remains tied to the paper’s STAR-RIS partition and channel assumptions.

[Moving Target Defense Approach for Secure Relay Selection in Vehicular Networks](https://doi.org/10.1016/j.vehcom.2024.100774) uses adaptation for security rather than modulation. It changes the relay configuration over time and injects deceptive data so that an eavesdropper cannot rely on a stationary target. The relay-selection problem is formulated as a Markov decision process, and two deep reinforcement learning agents balance the probability of interception against the fraction of genuine data delivered. This is a simulation-based defense under the paper’s attacker and mobility assumptions, not a universal guarantee. Its importance lies in treating network reconfiguration itself as a security control.

## A coherent path from observation to adaptation

Across these works, measurement, analysis, and learning are not competing research styles. They form a sequence. Channel campaigns delimit plausible propagation behavior; generalized distributions extend analysis beyond one favored fading model; impairment-aware formulas reveal the floors that algorithms must respect; and learning is introduced where a representation or control policy is genuinely difficult to handcraft. That sequence also keeps strong numerical results in proportion: each gain remains attached to its channel, hardware, traffic, and threat assumptions.

For future energy-constrained and secure wireless systems, this habit matters as much as any individual technique. A reconfigurable surface, autoencoder, or reinforcement learning policy becomes credible only when the physical link has been characterized and its uncertainty survives into the optimization. These seven papers make that connection unusually visible.

## Research notes

> ### On the Coexistence of Heterogeneous Services in 6G Networks: An Imperfection-Aware RSMA Framework
>
> - **Authors:** Athanasios P. Chrysologou, Sotiris A. Tegos, Panagiotis D. Diamantoulakis, Nestor D. Chatzidiamantis, Paschalis C. Sofotasios, George K. Karagiannidis
> - **Public record:** [IEEE Transactions on Communications](https://doi.org/10.1109/tcomm.2024.3403502)
> - **What is established:** The paper analyzes a hybrid OMA–RSMA architecture for heterogeneous services while explicitly including channel-estimation and interference-cancellation errors.
> - **Read with care:** The rate floors and service trade-offs follow the stated traffic, fading, and residual-interference models.
>
> ---
>
> ### Moving Target Defense Approach for Secure Relay Selection in Vehicular Networks
>
> - **Authors:** Esraa M. Ghourab, Shimaa Naser, Sami Muhaidat, Lina Bariah, Mahmoud Al-Qutayri, Ernesto Damiani, Paschalis C. Sofotasios
> - **Public record:** [Vehicular Communications](https://doi.org/10.1016/j.vehcom.2024.100774)
> - **What is established:** The work formulates adaptive relay selection and deceptive-data control as an MDP and evaluates two deep reinforcement learning designs.
> - **Read with care:** The security improvement is demonstrated in simulation under the paper’s eavesdropper, observation, and mobility assumptions.
>
> ---
>
> ### Energy Harvesting Meets Data-Oriented Communication: Delay-Outage Ratio Analysis
>
> - **Authors:** Mehmet C. Ilter, Paschalis C. Sofotasios, Mikko Valkama, Jyri Hämäläinen
> - **Public record:** [IEEE Communications Letters](https://doi.org/10.1109/lcomm.2024.3393979)
> - **What is established:** Analytical delay-outage expressions connect charging, payload, bandwidth, and deadline constraints for RF-energy-harvesting nodes.
> - **Read with care:** The metric is evaluated for the paper’s far-field power-transfer and link model; other energy sources or traffic processes can change the balance.
>
> ---
>
> ### Channel Measurements at 6.4 GHz for IEEE 802.11be WLAN
>
> - **Authors:** Nida Chaudhry, Simon L. Cotton, Nidhi Simmons, Claudio R. C. M. Da Silva, Okan Yurduseven, Paschalis C. Sofotasios, Michail Matthaiou, Trung Q. Duong
> - **Public record:** [IEEE PIMRC 2024](https://doi.org/10.1109/pimrc59610.2024.10817218)
> - **What is established:** Indoor and outdoor LOS/NLOS measurements support empirical path-loss, fading, and coherence-time characterizations around 6.4 GHz.
> - **Read with care:** The fitted distributions and parameters describe the measured locations and setup, not every IEEE 802.11be deployment.
>
> ---
>
> ### Autoencoder-Based Spatial Modulation for the Next Generation of Wireless Networks
>
> - **Authors:** Selina Shrestha, Shimaa Naser, Lina Bariah, Sami Muhaidat, Paschalis C. Sofotasios, Hany Elgala, Ernesto Damiani
> - **Public record:** [IEEE Internet of Things Journal](https://doi.org/10.1109/jiot.2024.3390443)
> - **What is established:** Three autoencoder architectures are evaluated, including two that preserve antenna-index information through explicit or learned representations.
> - **Read with care:** The reported error-rate gains are numerical and depend on the tested Rician channels, correlation, modulation, and training setup.
>
> ---
>
> ### Performance of RIS-Assisted Systems in Mixed Fading Conditions
>
> - **Authors:** Maria Cecilia Luna Alvarado, Carlos Rafael Nogueira da Silva, Nidhi Simmons, Paschalis C. Sofotasios, Simon L. Cotton, Michel Daoud Yacoub
> - **Public record:** [IEEE Transactions on Communications](https://doi.org/10.1109/tcomm.2025.3581005)
> - **What is established:** The paper derives outage and symbol-error results for RIS-assisted links whose hops follow several combinations of generalized fading models.
> - **Read with care:** The benefits attributed to additional RIS elements are analytical and Monte Carlo results within the assumed passive-surface and channel models.
>
> ---
>
> ### Index Modulation Aided Non-Orthogonal Multiple Access in STAR-RIS-Assisted Networks
>
> - **Authors:** Rawan Derbas, Shimaa Naser, Sami Muhaidat, Paschalis C. Sofotasios
> - **Public record:** [IEEE Transactions on Communications](https://doi.org/10.1109/tcomm.2025.3602357)
> - **What is established:** The work maps an index-modulated user’s information across STAR-RIS subsurfaces and analyzes energy-based detection through pairwise error, a bit-error upper bound, and achievable rate under Beaulieu–Xie fading.
> - **Read with care:** The public abstract supports the architecture and reported metrics; their applicability remains bounded by the stated STAR-RIS partition, detector, and fading model.
