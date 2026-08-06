---
{
  "title": "Prof. Zhiguo Ding: energy-aware access from ambient IoT to wireless-powered edge computing",
  "locale": "en",
  "slug": "zhiguo-energy-aware-multiple-access",
  "newsId": "news-20260804-zhiguo-energy-aware-multiple-access",
  "translationKey": "news-20260804-zhiguo-energy-aware-multiple-access",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2024-03-05",
  "coverageEnd": "2025-06-03",
  "module": "advisors",
  "keywords": [
    "learning-enabled-wireless",
    "noma",
    "resource-allocation",
    "ambient-backscatter",
    "energy-constrained-iot",
    "physical-layer-security",
    "pinching-antennas",
    "wireless-power-transfer",
    "ris",
    "zero-energy-wireless",
    "wireless-powered-edge",
    "wireless-communications"
  ],
  "authors": [
    "Yushen Lin",
    "Kaidi Wang",
    "Zhiguo Ding",
    "Athanasios P. Chrysologou",
    "Nestor D. Chatzidiamantis",
    "Alexandros-Apostolos A. Boulogeorgos",
    "Yixuan Li",
    "Ji Wang",
    "Yuanwei Liu",
    "Ahmad Massud Tota Khel",
    "Aissa Ikhlef",
    "Hongjian Sun",
    "Lu Lv",
    "Hao Luo",
    "Long Yang",
    "Arumugam Nallanathan",
    "Naofal Al-Dhahir",
    "Jian Chen",
    "Chongjun Ouyang",
    "Zhaolin Wang",
    "Jiaqi Xu",
    "Xidong Mu"
  ],
  "subjectIds": [
    "zhiguo-ding"
  ],
  "workIds": [
    "doi-10-1109-twc-2024-3447833",
    "doi-10-1109-twc-2025-3577446",
    "doi-10-1109-tvt-2025-3609450",
    "doi-10-1109-lcomm-2025-3594663",
    "doi-10-1109-tgcn-2025-3578423",
    "doi-10-1109-twc-2024-3503582",
    "doi-10-1109-mwc-001-2400493"
  ],
  "focusSubjectId": "zhiguo-ding",
  "coverTone": "amber",
  "coverKicker": "ZHIGUO DING",
  "coverTitle": "Access design becomes energy accounting",
  "coverPoints": [
    "Ambient backscatter",
    "Wireless power",
    "Learning and edge computing"
  ],
  "description": "Seven works connect NOMA, ambient backscatter, continuous apertures, wireless power, reconfigurable surfaces, edge computing, and federated learning through joint resource accounting.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## When access design also decides who can afford to transmit

The recent work of Prof. Zhiguo Ding makes multiple access inseparable from energy flow. In a conventional uplink, power is a controllable resource already available at the terminal. Ambient Internet of Things devices may instead reflect an existing carrier, a wireless-powered terminal must harvest before it transmits, and a nominally passive surface still needs energy to operate. Once those constraints enter the model, deciding who transmits, on which resource, and with what interference pattern also decides whether communication is physically sustainable.

[BackCom Assisted Hybrid NOMA Uplink Transmission for Ambient IoT](https://doi.org/10.1109/twc.2025.3577446) places backscatter communication and active uplink transmission in the same hybrid NOMA design. The optimization minimizes total active-uplink power while accounting for the way low-power ambient devices modulate and reflect the surrounding signal. The paper develops a two-user analysis and then treats the multiuser problem with global and successive-convex-approximation approaches. The resulting comparison is useful because backscatter is not modeled as a separate side channel; it changes the interference and power allocation of the shared uplink.

## Reliability and secrecy share the same interference

Energy reuse does not automatically produce a dependable link. [On the Reliability and Security of Ambient Backscatter Uplink NOMA Networks](https://doi.org/10.1109/tvt.2025.3609450) studies outage and intercept probability when backscatter devices coexist with an active NOMA uplink. It analyzes both perfect and imperfect successive interference cancellation and includes artificial noise as a security mechanism. High-SNR behavior reveals floors or limiting constants under some residual-interference conditions: simply increasing transmit power cannot remove every failure mode.

This link between reliability and secrecy is especially important in ambient systems. The same superposition that enables spectrum and energy reuse may help a legitimate receiver separate users, disturb that separation when cancellation is imperfect, or be shaped to reduce an eavesdropper’s advantage. The paper’s gains are analytical and simulation results under explicit channel and eavesdropper models, but the design principle carries beyond them: interference is neither purely harmful nor automatically useful; its role depends on who can observe, cancel, and harvest it.

## Reconfigurable structures turn space into an energy resource

Three studies make the physical aperture or propagation environment part of resource allocation. [CAPA: Continuous-Aperture Arrays for Revolutionizing 6G Wireless Communications](https://doi.org/10.1109/mwc.001.2400493) replaces a spatially discrete antenna array with an electrically large aperture carrying a continuous current distribution. The article reviews an existing prototype, describes electronic, optical, and acoustic implementation paths, and develops current-distribution beamforming approaches before comparing capacity and diversity–multiplexing behavior numerically. It is a tutorial architecture and early design study, not evidence that continuous apertures are already a deployment-ready replacement for conventional arrays. Its relevance here is that even the aperture’s representation changes how spatial resources are allocated.

[Pinching-Antenna Assisted Simultaneous Wireless Information and Power Transfer](https://doi.org/10.1109/lcomm.2025.3594663) considers a waveguide whose radiating pinching points can be positioned to support simultaneous information and power transfer. By optimizing the placement of those radiators, the system can shape where energy and useful signal arrive. The numerical study introduces a promising spatial degree of freedom, while leaving real waveguide loss, positioning mechanisms, channel acquisition, and hardware control as practical questions rather than solved details.

[Zero-Energy RIS-Assisted Communications With Noise Modulation and Interference-Based Energy Harvesting](https://doi.org/10.1109/tgcn.2025.3578423) asks how a reconfigurable intelligent surface might power its own operation from incident interference. The surface harvests energy while noise modulation is used in the communication design, turning a quantity normally suppressed into both an energy source and a controllable signal component. The work demonstrates feasibility within its analytical model; “zero-energy” here means energy-neutral operation under the assumed harvested-power balance, not hardware that consumes no energy.

The broader edge-computing setting appears in [RIS-Assisted Wireless Powered MEC: Multiple Access Design and Resource Allocation](https://doi.org/10.1109/twc.2024.3503582). An access point first delivers energy, devices then offload computation, and a reconfigurable intelligent surface adjusts the radio environment. The study compares NOMA, OMA, and hybrid access while jointly allocating time, power, phase shifts, and energy-recycling opportunities to reduce access-point energy use. Its central contribution is the coupled accounting: downlink charging, uplink offloading, interference, and edge workload cannot be optimized independently.

## Learning traffic must also respect the radio budget

[Rethinking Clustered Federated Learning in NOMA Enhanced Wireless Networks](https://doi.org/10.1109/twc.2024.3447833) brings the same resource discipline to distributed learning. Non-identically distributed local data can make a single global model generalize poorly, so the paper first groups clients using spectral clustering informed by a Dirichlet representation. It then matches clusters to subchannels and derives power allocation through optimization. The reported simulations examine learning accuracy and convergence as well as communication resources, showing why “faster aggregation” and “better learning” should not be treated as interchangeable objectives.

Taken together, the seven papers describe a progression rather than a collection of access schemes. Ambient backscatter reuses existing waves; security analysis accounts for who else benefits from them; continuous apertures, movable radiators, and reconfigurable surfaces reshape spatial resources; wireless-powered edge computing closes the charging–offloading loop; and federated learning connects radio scheduling to statistical heterogeneity. In each case, NOMA or reconfiguration is a means, not the final objective. The real objective is to decide how scarce aperture, energy, spectrum, computation, and information should circulate through one system.

## Research notes

> ### Rethinking Clustered Federated Learning in NOMA Enhanced Wireless Networks
>
> - **Authors:** Yushen Lin, Kaidi Wang, Zhiguo Ding
> - **Public record:** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2024.3447833)
> - **What is established:** The work combines data-aware client clustering with NOMA subchannel matching and optimized power allocation for federated learning.
> - **Read with care:** Accuracy and convergence gains depend on the selected data partitions, clustering representation, channel model, and baselines.
>
> ---
>
> ### BackCom Assisted Hybrid NOMA Uplink Transmission for Ambient IoT
>
> - **Authors:** Zhiguo Ding
> - **Public record:** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2025.3577446)
> - **What is established:** The paper formulates active-uplink power minimization for a hybrid design in which ambient devices communicate through backscatter.
> - **Read with care:** Global and approximate solutions are evaluated within the assumed channel knowledge, decoding order, and backscatter model.
>
> ---
>
> ### On the Reliability and Security of Ambient Backscatter Uplink NOMA Networks
>
> - **Authors:** Athanasios P. Chrysologou, Nestor D. Chatzidiamantis, Alexandros-Apostolos A. Boulogeorgos, Zhiguo Ding
> - **Public record:** [IEEE Transactions on Vehicular Technology](https://doi.org/10.1109/tvt.2025.3609450)
> - **What is established:** Outage and intercept probabilities are analyzed under perfect and imperfect interference cancellation, including an artificial-noise design.
> - **Read with care:** Security conclusions use the paper’s channel-state, eavesdropper, and artificial-noise assumptions and are supported by analysis and simulation.
>
> ---
>
> ### Pinching-Antenna Assisted Simultaneous Wireless Information and Power Transfer
>
> - **Authors:** Yixuan Li, Ji Wang, Yuanwei Liu, Zhiguo Ding
> - **Public record:** [IEEE Communications Letters](https://doi.org/10.1109/lcomm.2025.3594663)
> - **What is established:** The study optimizes movable radiating points along a waveguide for simultaneous information and power transfer.
> - **Read with care:** Results are numerical under an analytical pinching-antenna channel; positioning, loss, and control overhead require hardware validation.
>
> ---
>
> ### Zero-Energy RIS-Assisted Communications With Noise Modulation and Interference-Based Energy Harvesting
>
> - **Authors:** Ahmad Massud Tota Khel, Aissa Ikhlef, Zhiguo Ding, Hongjian Sun
> - **Public record:** [IEEE Transactions on Green Communications and Networking](https://doi.org/10.1109/tgcn.2025.3578423)
> - **What is established:** The model combines interference-based energy harvesting at an RIS with noise modulation and analyzes energy-neutral communication conditions.
> - **Read with care:** “Zero-energy” denotes balance within the stated model, not a surface with zero physical consumption in every environment.
>
> ---
>
> ### RIS-Assisted Wireless Powered MEC: Multiple Access Design and Resource Allocation
>
> - **Authors:** Lu Lv, Hao Luo, Long Yang, Zhiguo Ding, Arumugam Nallanathan, Naofal Al-Dhahir, Jian Chen
> - **Public record:** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2024.3503582)
> - **What is established:** NOMA, OMA, and hybrid designs are evaluated with joint charging, offloading, time, power, and RIS resource allocation.
> - **Read with care:** Energy reductions are optimization and simulation results under the chosen computation, energy-recycling, and surface models.
>
> ---
>
> ### CAPA: Continuous-Aperture Arrays for Revolutionizing 6G Wireless Communications
>
> - **Authors:** Yuanwei Liu, Chongjun Ouyang, Zhaolin Wang, Jiaqi Xu, Xidong Mu, Zhiguo Ding
> - **Public record:** [IEEE Wireless Communications](https://doi.org/10.1109/mwc.001.2400493)
> - **What is established:** The article reviews a CAPA prototype, outlines three hardware implementation routes, develops continuous-current beamforming approaches, and reports numerical comparisons with discrete arrays.
> - **Read with care:** It combines tutorial, architecture, and numerical evidence; deployment cost, calibration, losses, and large-scale hardware control remain open.
