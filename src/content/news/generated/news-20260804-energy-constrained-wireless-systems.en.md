---
{
  "title": "Energy-constrained wireless systems from textiles to programmable apertures",
  "locale": "en",
  "slug": "energy-constrained-wireless-systems",
  "newsId": "news-20260804-energy-constrained-wireless-systems",
  "translationKey": "news-20260804-energy-constrained-wireless-systems",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2024-04-26",
  "coverageEnd": "2025-06-03",
  "module": "fields",
  "keywords": [
    "battery-free-iot",
    "energy-constrained-iot",
    "wireless-power-transfer",
    "convex-optimization",
    "resource-allocation",
    "ris",
    "pinching-antennas",
    "zero-energy-wireless",
    "ambient-backscatter",
    "isac",
    "learning-enabled-wireless",
    "edge-and-fog-systems",
    "movable-antennas",
    "wireless-powered-edge"
  ],
  "authors": [
    "Weiye Xu",
    "Tony Li",
    "Yuntao Wang",
    "Xing-Dong Yang",
    "Te-Yen Wu",
    "Benjamin J. B. Deutschmann",
    "Ulrich Muehlmann",
    "Ahmet Kaplan",
    "Gilles Callebaut",
    "Thomas Wilding",
    "Bert Cox",
    "Liesbet Van der Perre",
    "Fredrik Tufvesson",
    "Erik G. Larsson",
    "Klaus Witrisal",
    "Amirhossein Azarbahram",
    "Onel L. A. López",
    "Bruno Clerckx",
    "Marco Di Renzo",
    "Matti Latva-Aho",
    "Yixuan Li",
    "Ji Wang",
    "Yuanwei Liu",
    "Zhiguo Ding",
    "Ahmad Massud Tota Khel",
    "Aissa Ikhlef",
    "Hongjian Sun",
    "Muhammad Ali Jamshed",
    "Yazdan Ahmad Qadri",
    "Ali Nauman",
    "Haejoon Jung",
    "Pengcheng Chen",
    "Yuxuan Yang",
    "Bin Lyu",
    "Zhen Yang",
    "Abbas Jamalipour"
  ],
  "subjectIds": [
    "zhiguo-ding"
  ],
  "workIds": [
    "doi-10-1145-3706598-3713100",
    "doi-10-1109-mwc-2025-3636246",
    "doi-10-1109-twc-2025-3645104",
    "doi-10-1109-lcomm-2025-3594663",
    "doi-10-1109-tgcn-2025-3578423",
    "doi-10-1109-jiot-2024-3394041",
    "doi-10-1109-jiot-2024-3437201"
  ],
  "coverTone": "rose",
  "coverKicker": "ENERGY-CONSTRAINED WIRELESS",
  "coverTitle": "Energy autonomy is an end-to-end problem",
  "coverPoints": [
    "Battery-free interfaces",
    "Near-field focusing",
    "Self-powered surfaces"
  ],
  "description": "Seven works connect battery-free interfaces, exposure-aware backscatter, measured power transfer, programmable apertures, SWIPT, and wireless-powered edge computing.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## Removing a battery moves the engineering problem elsewhere

“Battery-free” and “zero-energy” are useful ambitions, but neither means that a device operates without an energy source. Energy must still be coupled, harvested, stored briefly, and spent on sensing, communication, computation, or reconfiguration. The seven works here cover that chain at different scales: a textile interface without embedded batteries or integrated circuits, exposure-aware ambient backscatter, a measured large-aperture power link, waveform and RIS optimization, a pinching-antenna SWIPT system, an RIS that harvests interference to support its own operation, and a wireless-powered edge system with movable antennas. Their common lesson is that energy autonomy is an end-to-end balance, not a property that can be assigned to one component in isolation.

[BIT: Battery-free, IC-less and Wireless Smart Textile Interface and Sensing System](https://doi.org/10.1145/3706598.3713100) begins at the device. Multi-resonant textile circuits couple to an external coil for wireless power and sensing, while an equivalent-circuit model supports impedance-based signal estimation. Simulations and a user study show that the prototype concept can support multiple textile sensor types. The system removes rigid ICs, batteries, and connectors from the fabric, but it still relies on nearby reader infrastructure and near-field electromagnetic coupling.

## Aperture is both an efficiency resource and a safety constraint

[Physically Large Apertures for Wireless Power Transfer: Performance and Regulatory Aspects](https://doi.org/10.1109/mwc.2025.3636246) examines why near-field focusing changes the power budget. A physically large aperture can focus energy at a receiver location while limiting power density near the infrastructure. The authors report real-world sub-10-GHz measurements that deliver power in the milliwatt range while meeting the regulatory condition considered in the article, and they observe that multipath can aid the focus. These measurements are valuable because they connect array geometry with exposure limits; they do not imply distance-independent power delivery in every room or under every regulation.

[Electromagnetic Field Exposure-Aware AI Framework for Integrated Sensing and Communications-Enabled Ambient Backscatter Wireless Networks](https://doi.org/10.1109/jiot.2024.3394041) connects low-energy connectivity to another constraint: aggregate uplink electromagnetic-field exposure. In the modeled ambient-backscatter cellular network, integrated sensing and communications and power-domain NOMA share resources among proximity devices. The framework uses k-medoids with silhouette analysis for subcarrier allocation and optimization for user power allocation. Simulations report lower aggregate exposure than selected baselines. The result addresses exposure-aware resource allocation, while tag hardware measurements and a complete harvested-energy budget remain outside the reported evaluation.

The aperture and waveform must also match the rectifier. [Beamforming and Waveform Optimization for RF Wireless Power Transfer with Beyond Diagonal Reconfigurable Intelligent Surfaces](https://doi.org/10.1109/twc.2025.3645104) jointly designs a multicarrier waveform and RIS beamforming for a nonlinear rectifier. Its simulations show that the preferred subcarrier allocation changes with the rectifier’s operating regime and that beyond-diagonal surface coupling helps chiefly when non-line-of-sight components are significant. Energy transfer therefore cannot be optimized from propagation gain alone.

## Information and energy can share hardware, but they still compete

Prof. Zhiguo Ding co-authored [Pinching-Antenna Assisted Simultaneous Wireless Information and Power Transfer](https://doi.org/10.1109/lcomm.2025.3594663), which activates multiple pinching antennas along one waveguide. NOMA superposes information signals while the design jointly adjusts information-receiver power allocation and antenna positions to increase energy received by dedicated energy receivers. The authors separate the nonconvex problem into convex power allocation and position-search components. The public evidence supports a numerical performance gain over conventional systems, not a fabricated-waveguide experiment.

Prof. Zhiguo Ding also co-authored [Zero-Energy RIS-Assisted Communications With Noise Modulation and Interference-Based Energy Harvesting](https://doi.org/10.1109/tgcn.2025.3578423). Its RIS divides elements between reflecting desired signals and absorbing interference for harvested energy; because harvested power is random, the number of elements available for active beamforming is random as well. Analytical and simulation results show a useful low-to-moderate interference region and a communication penalty when interference becomes high. Here “zero-energy” refers to supporting RIS operation through harvested interference within the proposed architecture, not to eliminating energy consumption from the complete link.

[Movable-Antenna-Enhanced Wireless-Powered Mobile-Edge Computing Systems](https://doi.org/10.1109/jiot.2024.3437201) carries the accounting through to computation. A hybrid access point first transfers energy to wireless devices and then receives their offloaded tasks. Moving its antennas within an allowed region increases spatial degrees of freedom for both downlink charging and uplink offloading; the paper compares dynamic, semidynamic, and static positioning while also modeling nonlinear energy conversion and finite edge-computing capacity. Alternating optimization and a particle-swarm/local-search method are evaluated numerically. The reported computational-rate advantage is therefore evidence for the modeled joint design, not yet a measurement of the positioning mechanism or its motion overhead.

## Energy autonomy must be traced from field to function

These studies form a practical sequence. A battery-free interface specifies what the endpoint can do; exposure-aware access constrains how many devices share the field; a large aperture determines how much energy can be delivered safely; the waveform and surface determine what the rectifier harvests; SWIPT decides how information and energy share resources; a self-powered RIS must budget harvested energy against its own reconfiguration; and wireless-powered edge computing must also pay for offloading and processing. Any convincing zero-energy wireless design should make every conversion and operating assumption visible along that path.

## Research notes

> ### BIT: Battery-free, IC-less and Wireless Smart Textile Interface and Sensing System
>
> - **Authors:** Weiye Xu, Tony Li, Yuntao Wang, Xing-Dong Yang, Te-Yen Wu
> - **Public record:** [CHI 2025](https://doi.org/10.1145/3706598.3713100)
> - **What is established:** Multi-resonant textile circuits use near-field coupling for power and impedance-based sensing; the design is evaluated through simulation and a user study.
> - **Read with care:** Battery-free and IC-less describe the textile interface, which still depends on an external reader and coupling geometry.
>
> ---
>
> ### Physically Large Apertures for Wireless Power Transfer: Performance and Regulatory Aspects
>
> - **Authors:** Benjamin J. B. Deutschmann, Ulrich Muehlmann, Ahmet Kaplan, Gilles Callebaut, Thomas Wilding, Bert Cox, Liesbet Van der Perre, Fredrik Tufvesson, Erik G. Larsson, Klaus Witrisal
> - **Public record:** [IEEE Wireless Communications](https://doi.org/10.1109/mwc.2025.3636246)
> - **What is established:** Real-world sub-10-GHz measurements demonstrate regulatory-aware near-field focusing with received power in the milliwatt range in the studied setup.
> - **Read with care:** Power level, focusing benefit, and exposure compliance depend on aperture, range, environment, frequency, and the applicable limits.
>
> ---
>
> ### Beamforming and Waveform Optimization for RF Wireless Power Transfer with Beyond Diagonal Reconfigurable Intelligent Surfaces
>
> - **Authors:** Amirhossein Azarbahram, Onel L. A. López, Bruno Clerckx, Marco Di Renzo, Matti Latva-Aho
> - **Public record:** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2025.3645104)
> - **What is established:** The study jointly optimizes multicarrier waveform and beyond-diagonal RIS beamforming with a nonlinear rectifier model.
> - **Read with care:** The relative surface gain and power allocation results are numerical and vary with propagation and rectifier operating regime.
>
> ---
>
> ### Pinching-Antenna Assisted Simultaneous Wireless Information and Power Transfer
>
> - **Authors:** Yixuan Li, Ji Wang, Yuanwei Liu, Zhiguo Ding
> - **Public record:** [IEEE Communications Letters](https://doi.org/10.1109/lcomm.2025.3594663)
> - **What is established:** A single-waveguide pinching-antenna system jointly optimizes NOMA power allocation and antenna positions for information and energy receivers.
> - **Read with care:** The stated gain over conventional systems is numerical; the public abstract does not describe a hardware prototype.
>
> ---
>
> ### Zero-Energy RIS-Assisted Communications With Noise Modulation and Interference-Based Energy Harvesting
>
> - **Authors:** Ahmad Massud Tota Khel, Aissa Ikhlef, Zhiguo Ding, Hongjian Sun
> - **Public record:** [IEEE Transactions on Green Communications and Networking](https://doi.org/10.1109/tgcn.2025.3578423)
> - **What is established:** RIS elements are allocated between desired-signal reflection and interference harvesting, with analytical and simulated communication–energy trade-offs.
> - **Read with care:** The proposed RIS is energy-supported within its model; “zero-energy” does not mean that the end-to-end network consumes no power.

> ---
>
> ### Electromagnetic Field Exposure-Aware AI Framework for Integrated Sensing and Communications-Enabled Ambient Backscatter Wireless Networks
>
> - **Authors:** Muhammad Ali Jamshed, Yazdan Ahmad Qadri, Ali Nauman, Haejoon Jung
> - **Public record:** [IEEE Internet of Things Journal](https://doi.org/10.1109/jiot.2024.3394041)
> - **What is established:** The public abstract describes k-medoids and silhouette analysis for subcarrier allocation plus optimized user power allocation in an ISAC-enabled, power-domain-NOMA ambient-backscatter network.
> - **Read with care:** Lower aggregate uplink electromagnetic-field exposure is reported in simulation; the public evidence does not describe tag hardware measurements or a complete end-to-end energy-autonomy experiment.
>
> ---
>
> ### Movable-Antenna-Enhanced Wireless-Powered Mobile-Edge Computing Systems
>
> - **Authors:** Pengcheng Chen, Yuxuan Yang, Bin Lyu, Zhen Yang, Abbas Jamalipour
> - **Public record:** [IEEE Internet of Things Journal](https://doi.org/10.1109/jiot.2024.3437201)
> - **What is established:** The system jointly considers wireless charging, task offloading, movable-antenna positions, nonlinear energy conversion, and finite edge-computing capacity through alternating and hybrid search methods.
> - **Read with care:** The computational-rate gains are numerical; positioning delay, actuator energy, calibration, and hardware behavior are not established by the public abstract.
