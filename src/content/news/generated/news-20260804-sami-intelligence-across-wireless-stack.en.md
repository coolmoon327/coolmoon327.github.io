---
{
  "title": "Prof. Sami Muhaidat: placing intelligence across the wireless stack",
  "locale": "en",
  "slug": "sami-intelligence-across-wireless-stack",
  "newsId": "news-20260804-sami-intelligence-across-wireless-stack",
  "translationKey": "news-20260804-sami-intelligence-across-wireless-stack",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2024-04-16",
  "coverageEnd": "2025-09-12",
  "module": "advisors",
  "keywords": [
    "physical-layer-security",
    "resilient-wireless",
    "learning-enabled-wireless",
    "wireless-communications",
    "secure-6g",
    "energy-constrained-iot",
    "reinforcement-learning",
    "resource-allocation",
    "convex-optimization",
    "edge-and-fog-systems",
    "semantic-communications",
    "ris",
    "noma"
  ],
  "authors": [
    "Esraa M. Ghourab",
    "Shimaa Naser",
    "Sami Muhaidat",
    "Lina Bariah",
    "Mahmoud Al-Qutayri",
    "Ernesto Damiani",
    "Paschalis C. Sofotasios",
    "Selina Shrestha",
    "Hany Elgala",
    "Li Yang",
    "Mirna El Rajab",
    "Abdallah Shami",
    "Abubakar S. Ali",
    "Ahmed A. Al-Habob",
    "Octavia A. Dobre",
    "Latif U. Khan",
    "Maher Guizani",
    "Moussa Ayyash",
    "Omar Erak",
    "Omar Alhussein",
    "Hatem Abou-Zeid",
    "Mehdi Bennis",
    "Maryam Tariq",
    "Raneem Abdelrahim",
    "Rawan Derbas"
  ],
  "subjectIds": [
    "paschalis-sofotasios",
    "sami-muhaidat"
  ],
  "workIds": [
    "doi-10-1016-j-vehcom-2024-100774",
    "doi-10-1109-jiot-2024-3390443",
    "doi-10-1109-tnsm-2024-3376631",
    "doi-10-1109-ojcoms-2024-3398718",
    "doi-10-1109-tce-2025-3587176",
    "doi-10-1109-ojcoms-2026-3676928",
    "doi-10-1109-gcwkshps68340-2025-11591108",
    "doi-10-1109-tcomm-2025-3602357"
  ],
  "focusSubjectId": "sami-muhaidat",
  "coverTone": "violet",
  "coverKicker": "SAMI MUHAIDAT",
  "coverTitle": "Intelligence belongs where the uncertainty enters",
  "coverPoints": [
    "Autonomous security",
    "Edge learning",
    "Reconfigurable detection"
  ],
  "description": "Eight works place learning and optimization at distinct interfaces, from adaptive network defense and spatial modulation to edge training, semantic coding, and structured signal detection.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## Intelligence is not one layer of a network

The 2024–2025 work of Prof. Sami Muhaidat does not treat “AI for wireless” as a single algorithmic category. The selected papers place intelligence at markedly different points: an automated security pipeline chooses and tunes models, a moving-target defense changes the attacker’s environment, a controller directs an unmanned aerial vehicle, edge devices and servers divide a learning workload, a semantic encoder removes redundant tokens, and a detector searches a structured signal space. Read together, they ask a more precise question than whether machine learning should be used: where does uncertainty enter the system, and which decisions genuinely need adaptation?

[Enabling AutoML for Zero-Touch Network Security: Use-Case Driven Analysis](https://doi.org/10.1109/tnsm.2024.3376631) addresses the network-management end of that question. Zero-touch operation requires security functions that can select, configure, and update machine-learning pipelines with limited manual intervention. The article organizes how automated machine learning can support intrusion detection and defenses against adversarial machine learning, using security use cases to expose both the promise and the remaining operational risks. Its contribution is a structured analysis, not evidence that today’s AutoML systems can autonomously secure every network.

[Moving Target Defense Approach for Secure Relay Selection in Vehicular Networks](https://doi.org/10.1016/j.vehcom.2024.100774) turns adaptation into an active security mechanism. Relay configurations change over time and deceptive data are introduced so that an eavesdropper cannot depend on a stationary target. The authors formulate relay selection as a Markov decision process and evaluate two deep reinforcement learning agents that trade interception probability against the fraction of genuine data delivered. This remains a simulation result under the stated attacker, observation, and mobility models. Its broader contribution is to make reconfiguration itself part of the defense, rather than asking a fixed topology to withstand every threat.

## Learning policies where dynamics resist a closed form

At the control layer, [Deep Reinforcement Learning for Energy-Efficient Data Dissemination Through UAV Networks](https://doi.org/10.1109/ojcoms.2024.3398718) jointly considers device grouping and association, UAV movement, and the energy consumed by both the aircraft and ground devices. The environment is expressed as a Markov decision process and solved with a double deep Q-network alongside problem-specific heuristics. Because future contacts and conditions are not known in advance, a learned policy is a natural tool; the numerical evaluation nevertheless remains tied to the paper’s mobility, radio, and energy models.

[QoS-Enabled Wireless Split Federated Learning: A Reinforcement Learning and Optimization Approach](https://doi.org/10.1109/tce.2025.3587176) moves adaptation into distributed training. Split federated learning divides neural-network execution across devices and infrastructure, which makes task offloading, radio allocation, and device computation inseparable from latency requirements. The paper combines a dueling deep Q-network with optimization steps to handle the resulting mixed-integer nonlinear problem. This hybrid construction matters: reinforcement learning chooses across a changing discrete system, while analytical optimization handles structure that does not need to be relearned from scratch.

## Compress meaning without hiding the communication budget

The representation itself becomes adaptive in [Adaptive Token Merging for Efficient Transformer Semantic Communication at the Edge](https://doi.org/10.1109/ojcoms.2026.3676928). The proposed method merges tokens at runtime without retraining the underlying transformer and uses Bayesian multi-objective optimization to trade accuracy against computation and communication cost. The public preprint reports sizeable reductions in floating-point operations and transmitted data on the evaluated image-classification and visual-question-answering tasks. Those figures are benchmark-specific, but the architectural lesson is general: semantic communication should expose a controllable rate–utility knob rather than assuming every token has equal value.

This also clarifies how the UAV and split-learning papers relate to semantic coding. All three are resource-allocation problems, but at different interfaces. One schedules motion and contacts, another partitions training and wireless resources, and the third decides which internal representations are worth carrying across the edge. “Learning-enabled” is therefore useful only when the object being learned—and the budget it changes—remain explicit.

## Preserve signal structure at the physical layer

Three physical-layer studies rely more heavily on communication structure. [Autoencoder-Based Spatial Modulation for the Next Generation of Wireless Networks](https://doi.org/10.1109/jiot.2024.3390443) develops three neural transceiver formulations, including two that preserve antenna-index information through an explicit phase-shift-keying signature or a learned embedding. That representation matters when correlated transmit antennas make the discrete spatial choice difficult to recover. The reported error-rate gains come from the paper’s Rician-channel simulations; the more durable lesson is that end-to-end learning still needs a representation aligned with the decision the receiver must make.

[Hybrid Quantum-Classical Maximum-Likelihood Detection via Grover Adaptive Search for RIS-Assisted Broadband Wireless Systems](https://doi.org/10.1109/gcwkshps68340.2025.11591108) maps maximum-likelihood detection to a quadratic unconstrained binary optimization problem. A classical minimum-mean-square-error estimate initializes the search threshold, after which Grover adaptive search explores candidate solutions. Simulations approach maximum-likelihood performance with fewer stated search queries, but the study does not report an end-to-end deployment on quantum hardware; it should be read as an algorithmic formulation and complexity investigation.

[Index Modulation Aided Non-Orthogonal Multiple Access in STAR-RIS-Assisted Networks](https://doi.org/10.1109/tcomm.2025.3602357) embeds user information in the active sub-surface index of a simultaneous transmitting and reflecting reconfigurable intelligent surface. It develops energy-based maximum-likelihood detection and analyzes pairwise error, bit-error bounds, and achievable rate before checking the expressions through Monte Carlo simulation. Here, the receiver is not a generic classifier. It is designed around the index-modulated NOMA signal and the controllable propagation geometry.

The common design habit across all eight works is to keep intelligence accountable to a specific interface. Automation manages security pipelines; adaptive reconfiguration changes the attacker’s problem; reinforcement learning handles sequential uncertainty; optimization preserves known structure; semantic compression exposes an application-level trade-off; and learned or search-based detection remains grounded in the signal model. That separation makes the collection more coherent—and more useful—than a broad claim that AI will simply replace conventional wireless design.

## Research notes

> ### Enabling AutoML for Zero-Touch Network Security: Use-Case Driven Analysis
>
> - **Authors:** Li Yang, Mirna El Rajab, Abdallah Shami, Sami Muhaidat
> - **Public record:** [IEEE Transactions on Network and Service Management](https://doi.org/10.1109/tnsm.2024.3376631)
> - **What is established:** The article analyzes AutoML components and use cases for autonomous intrusion detection and adversarial-machine-learning defenses in zero-touch networks.
> - **Read with care:** It is a use-case-driven survey and analysis; it does not establish unattended security across arbitrary production networks.
>
> ---
>
> ### Deep Reinforcement Learning for Energy-Efficient Data Dissemination Through UAV Networks
>
> - **Authors:** Abubakar S. Ali, Ahmed A. Al-Habob, Shimaa Naser, Lina Bariah, Octavia A. Dobre, Sami Muhaidat
> - **Public record:** [IEEE Open Journal of the Communications Society](https://doi.org/10.1109/ojcoms.2024.3398718)
> - **What is established:** The paper formulates joint UAV movement, device classification, and association as an MDP and evaluates a DDQN-based solution with heuristics.
> - **Read with care:** Energy savings are numerical results under the selected flight, traffic, and wireless assumptions.
>
> ---
>
> ### QoS-Enabled Wireless Split Federated Learning: A Reinforcement Learning and Optimization Approach
>
> - **Authors:** Latif U. Khan, Maher Guizani, Sami Muhaidat, Moussa Ayyash
> - **Public record:** [IEEE Transactions on Consumer Electronics](https://doi.org/10.1109/tce.2025.3587176)
> - **What is established:** A dueling-DDQN and optimization framework jointly handles offloading, wireless resources, and device computation under latency constraints.
> - **Read with care:** Convergence and QoS comparisons are simulation-based and depend on the network and learning workloads used in evaluation.
>
> ---
>
> ### Adaptive Token Merging for Efficient Transformer Semantic Communication at the Edge
>
> - **Authors:** Omar Erak, Omar Alhussein, Hatem Abou-Zeid, Mehdi Bennis, Sami Muhaidat
> - **Public record:** [IEEE Open Journal of the Communications Society](https://doi.org/10.1109/ojcoms.2026.3676928)
> - **What is established:** Runtime token merging and Bayesian multi-objective optimization are evaluated as a training-free way to reduce transformer computation and communication.
> - **Read with care:** The reported accuracy, FLOP, and bandwidth trade-offs come from the selected models, tasks, and edge scenarios.
>
> ---
>
> ### Hybrid Quantum-Classical Maximum-Likelihood Detection via Grover Adaptive Search for RIS-Assisted Broadband Wireless Systems
>
> - **Authors:** Maryam Tariq, Raneem Abdelrahim, Omar Alhussein, Sami Muhaidat
> - **Public record:** [IEEE GLOBECOM Workshops 2025](https://doi.org/10.1109/gcwkshps68340.2025.11591108)
> - **What is established:** Maximum-likelihood detection is mapped to QUBO and combined with a classical MMSE initialization and Grover adaptive search in simulation.
> - **Read with care:** This is not evidence of a practical quantum receiver or a hardware speedup; it is an algorithmic and query-complexity study.
>
> ---
>
> ### Index Modulation Aided Non-Orthogonal Multiple Access in STAR-RIS-Assisted Networks
>
> - **Authors:** Rawan Derbas, Shimaa Naser, Sami Muhaidat, Paschalis C. Sofotasios
> - **Public record:** [IEEE Transactions on Communications](https://doi.org/10.1109/tcomm.2025.3602357)
> - **What is established:** The work conveys information through STAR-RIS sub-surface indices and derives detection, error, and rate results validated by Monte Carlo simulation.
> - **Read with care:** Performance follows the paper’s channel knowledge, surface partition, receiver, and interference assumptions.
>
> ---
>
> ### Moving Target Defense Approach for Secure Relay Selection in Vehicular Networks
>
> - **Authors:** Esraa M. Ghourab, Shimaa Naser, Sami Muhaidat, Lina Bariah, Mahmoud Al-Qutayri, Ernesto Damiani, Paschalis C. Sofotasios
> - **Public record:** [Vehicular Communications](https://doi.org/10.1016/j.vehcom.2024.100774)
> - **What is established:** Adaptive relay selection and deceptive-data control are formulated as an MDP and evaluated with two deep reinforcement learning designs.
> - **Read with care:** Security improvement is demonstrated in simulation under the paper’s eavesdropper, observation, and mobility assumptions.
>
> ---
>
> ### Autoencoder-Based Spatial Modulation for the Next Generation of Wireless Networks
>
> - **Authors:** Selina Shrestha, Shimaa Naser, Lina Bariah, Sami Muhaidat, Paschalis C. Sofotasios, Hany Elgala, Ernesto Damiani
> - **Public record:** [IEEE Internet of Things Journal](https://doi.org/10.1109/jiot.2024.3390443)
> - **What is established:** Three autoencoder architectures are evaluated, including two that preserve antenna-index information through explicit or learned representations.
> - **Read with care:** Error-rate gains are numerical and depend on the tested Rician channels, antenna correlation, modulation, and training setup.
