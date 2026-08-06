---
{
  "title": "Physical-layer security beyond a single secrecy-rate curve",
  "locale": "en",
  "slug": "physical-layer-security-design-space",
  "newsId": "news-20260804-physical-layer-security-design-space",
  "translationKey": "news-20260804-physical-layer-security-design-space",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2024-01-24",
  "coverageEnd": "2025-11-28",
  "module": "fields",
  "keywords": [
    "physical-layer-security",
    "ris",
    "resource-allocation",
    "convex-optimization",
    "isac",
    "semantic-communications",
    "pinching-antennas",
    "wireless-communications",
    "noma",
    "learning-enabled-wireless"
  ],
  "authors": [
    "Jun Liu",
    "Gang Yang",
    "Yuanwei Liu",
    "Xiangyun Zhou",
    "Hongjiang Lei",
    "Sha Zhou",
    "Xinhu Chen",
    "Imran Shafique Ansari",
    "Yun Li",
    "Gaofeng Pan",
    "Mohamed-Slim Alouini",
    "Lingyun Xu",
    "Bowen Wang",
    "Huiyong Li",
    "Ziyang Cheng",
    "Kun Chen-Hu",
    "Petar Popovski",
    "Hamid Amiriara",
    "Mahtab Mirmohseni",
    "Ahmed Elzanaty",
    "Yi Ma",
    "Rahim Tafazolli",
    "Ahmet Muaz Aktas",
    "Sefa Kayraklik",
    "Sultangali Arzykulov",
    "Galymzhan Nauryzbayev",
    "Ibrahim Hokelek",
    "Ali Gorcin",
    "Guangyu Zhu",
    "Xidong Mu",
    "Li Guo",
    "Shibiao Xu",
    "Naofal Al-Dhahir",
    "Chengjun Jiang",
    "Chensi Zhang",
    "Chongwen Huang",
    "Jianhua Ge",
    "Mérouane Debbah",
    "Chau Yuen",
    "Zihan Song",
    "Yang Lu",
    "Xianhao Chen",
    "Bo Ai",
    "Zhangdui Zhong",
    "Dusit Niyato"
  ],
  "subjectIds": [
    "merouane-debbah"
  ],
  "workIds": [
    "doi-10-1109-twc-2024-3430328",
    "doi-10-1109-jiot-2024-3370161",
    "doi-10-1109-lwc-2024-3382035",
    "doi-10-1109-tcomm-2024-3427325",
    "doi-10-1109-tccn-2025-3589577",
    "doi-10-1109-tvt-2026-3709369",
    "doi-10-1109-tcomm-2025-3621084",
    "doi-10-1109-jiot-2024-3416319",
    "doi-10-1109-tvt-2024-3442167"
  ],
  "coverTone": "violet",
  "coverKicker": "PHYSICAL-LAYER SECURITY",
  "coverTitle": "Security starts with the threat model",
  "coverPoints": [
    "Near-field concealment",
    "Defensive surfaces",
    "Measured artificial noise"
  ],
  "description": "Nine works show how geometry, programmable surfaces, sensing and semantic objectives, learned beamforming, and measurements reshape physical-layer security.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## Security begins by stating what the adversary can observe

Physical-layer security is often summarized by one quantity—secrecy rate, secrecy capacity, or secrecy outage probability. Those metrics are useful only after the adversary, propagation regime, side information, and legitimate service have been defined. The nine works here make that dependence explicit. They range from near-field covert transmission, millimeter-wave rate-splitting, and pinching-antenna beamforming to sensing systems, semantic communication, learned beamforming, defensive surfaces, and a software-defined-radio testbed. Read together, they show a field moving from abstract wiretap links toward security mechanisms embedded in increasingly specific wireless systems.

[RIS Empowered Near-Field Covert Communications](https://doi.org/10.1109/twc.2024.3430328) studies an extremely large reconfigurable intelligent surface that assists Alice while Willie attempts to detect the transmission. The authors jointly design hybrid beamforming and surface coefficients, using weighted-MMSE, manifold optimization, and an ADMM-based procedure. Their numerical results attribute an advantage to near-field focusing, including cases in which the detector and receiver lie in the same angular direction. The result relies on the modeled geometry and detector assumptions; it does not imply that near-field operation makes a transmission inherently undetectable.

## Geometry can protect a link—and create a new attack surface

At millimeter-wave frequencies, [On Secure mmWave RSMA Systems](https://doi.org/10.1109/jiot.2024.3370161) takes an analytical route. It derives secrecy outage expressions for a two-user rate-splitting multiple-access system under different overlaps between resolvable paths in the main and wiretap channels, then checks those expressions by Monte Carlo simulation. The work is useful because it connects a security metric to sparse propagation structure instead of treating the eavesdropper channel as an interchangeable random variable.

[Pinching-Antenna Systems (PASS)-Enabled Secure Wireless Communications](https://doi.org/10.1109/tcomm.2025.3621084) makes the radiating geometry adjustable along dielectric waveguides. For a single waveguide, its position-wise tuning is designed to combine the legitimate signal constructively at the intended user and destructively at the eavesdropper. Multiple-waveguide variants add artificial noise and distinguish waveguide-division from waveguide-multiplexing architectures, using successive convex approximation and, in one case, particle-swarm search within the optimization. The results are numerical for one legitimate user and one eavesdropper; they establish a design mechanism under that threat model rather than immunity to broader attacks.

Programmable surfaces themselves can also be adversarial. [Defensive Reconfigurable Intelligent Surface (D-RIS) Based on Non-Reciprocal Channel Links](https://doi.org/10.1109/tcomm.2024.3427325) formulates a “RIS-in-the-middle” attacker that introduces a strong alternative channel for eavesdropping and false-data injection. Its countermeasure uses a defensive surface to create a non-reciprocal link, together with associated estimation, precoding, and combining procedures. The paper therefore reframes an RIS from a passive coverage aid into either an attack component or a protocol-level defense, depending on who controls it.

The same surface can mediate several legitimate objectives at once. [Exploiting RIS in Secure Beamforming Design for NOMA-Assisted Integrated Sensing and Communication](https://doi.org/10.1109/jiot.2024.3416319), co-authored by Prof. Mérouane Debbah, treats the sensing target as a potential eavesdropper while radar and NOMA signals travel over direct and reflected links. It jointly designs base-station beamformers and RIS phases under transmit-power, communication-quality, and sensing-quality constraints, using alternating optimization with successive convex approximation. Its reported security and detection advantages are simulation results for the stated NOMA-ISAC model, not evidence that adding a surface automatically secures a sensing network.

## Sensing and meaning introduce competing objectives

Security becomes a multi-service problem when the same waveform must communicate and sense. [Enhancing Physical Layer Security in Dual-Function Radar-Communication Systems with Hybrid Beamforming Architecture](https://doi.org/10.1109/lwc.2024.3382035) maximizes the minimum legitimate-user rate while constraining radar SINR, eavesdropping rate, hardware, and power under imperfect channel and target-location knowledge. Its integrated sensing-and-security symbol and alternating beamformer design are evaluated numerically, so the contribution is an architecture and optimization method rather than a hardware demonstration.

[A Physical Layer Security Framework for IRS-Assisted Integrated Sensing and Semantic Communication Systems](https://doi.org/10.1109/tccn.2025.3589577) adds semantic communication and a potentially malicious sensing target. Artificial noise, a dedicated sensing signal, wiretap coding, base-station beamforming, and surface phases are coordinated against a semantic secrecy-rate objective and a Cramér–Rao sensing bound. The reported 5 dB sensing improvement over maximum-ratio transmission belongs to the authors’ simulated multi-objective setup, but it illustrates why “more secrecy” and “better sensing” cannot be optimized independently.

## Learned solvers and measurements expose different validation gaps

[A Deep Learning Framework for Physical-Layer Secure Beamforming](https://doi.org/10.1109/tvt.2024.3442167) replaces repeated numerical solution with learned mappings from channel vectors to beamforming and artificial-noise vectors. Its SecCNN and SecGNN models are trained without labeled optimal solutions; the graph model explicitly distinguishes user roles, and the framework evaluates transfer across system utilities as well as optimality, scale, inference time, and stability. These numerical tests examine whether a neural solver can approximate a structured design problem. They do not establish robustness to channel shift, adversarial inputs, or hardware mismatch.

[RIS-Assisted Physical Layer Security: Artificial Noise-Driven Optimization and Measurements](https://doi.org/10.1109/tvt.2026.3709369) partitions a surface so that one segment steers the communication signal toward the legitimate receiver while another steers artificial noise toward the eavesdropper. It combines phase and power-allocation algorithms with simulations and a software-defined-radio testbed. That experimental component makes the work distinct from the other eight, although the public abstract alone does not establish general performance across environments, attackers, and RIS hardware.

The broader lesson is that physical-layer security cannot be separated from the system being secured. Near-field and pinching-antenna geometry change what the receiver and eavesdropper observe; sparse paths change outage analysis; programmable surfaces alter both offense and defense; sensing and semantic tasks add objectives that secrecy alone cannot capture. Learned solvers can reduce online computation, but they add their own distribution and validation assumptions. Progress therefore depends as much on transparent threat and channel models—and on measurements that stress them—as on improving a single optimization curve.

## Research notes

> ### RIS Empowered Near-Field Covert Communications
>
> - **Authors:** Jun Liu, Gang Yang, Yuanwei Liu, Xiangyun Zhou
> - **Public record:** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2024.3430328)
> - **What is established:** The paper jointly designs hybrid beamformers and an extremely large RIS for near-field covert rate, with numerical comparisons against far-field and benchmark schemes.
> - **Read with care:** Covert performance depends on the assumed geometry, channel knowledge, detector, and optimization model; the public abstract describes simulation rather than an over-the-air trial.
>
> ---
>
> ### On Secure mmWave RSMA Systems
>
> - **Authors:** Hongjiang Lei, Sha Zhou, Xinhu Chen, Imran Shafique Ansari, Yun Li, Gaofeng Pan, Mohamed-Slim Alouini
> - **Public record:** [IEEE Internet of Things Journal](https://doi.org/10.1109/jiot.2024.3370161)
> - **What is established:** Analytical secrecy-outage expressions cover several overlaps between resolvable main- and wiretap-channel paths, with Monte Carlo validation.
> - **Read with care:** The results characterize the stated two-user mmWave RSMA model and passive-eavesdropper scenarios, not all mmWave multiple-access systems.
>
> ---
>
> ### Enhancing Physical Layer Security in Dual-Function Radar-Communication Systems with Hybrid Beamforming Architecture
>
> - **Authors:** Lingyun Xu, Bowen Wang, Huiyong Li, Ziyang Cheng
> - **Public record:** [IEEE Wireless Communications Letters](https://doi.org/10.1109/lwc.2024.3382035)
> - **What is established:** The work introduces an integrated sensing-and-security symbol and alternating hybrid-beamforming design under imperfect channel and target-location knowledge.
> - **Read with care:** Its claimed superiority is based on numerical simulation within the proposed architecture and constraints.
>
> ---
>
> ### Defensive Reconfigurable Intelligent Surface (D-RIS) Based on Non-Reciprocal Channel Links
>
> - **Authors:** Kun Chen-Hu, Petar Popovski
> - **Public record:** [IEEE Transactions on Communications](https://doi.org/10.1109/tcomm.2024.3427325)
> - **What is established:** The paper defines a RIS-in-the-middle attack and develops non-reciprocal defensive-RIS estimation, precoding, and combining techniques.
> - **Read with care:** Robustness is analyzed through achievable secrecy rate and fake-data detection probability under the paper’s attack and channel models.
>
> ---
>
> ### A Physical Layer Security Framework for IRS-Assisted Integrated Sensing and Semantic Communication Systems
>
> - **Authors:** Hamid Amiriara, Mahtab Mirmohseni, Ahmed Elzanaty, Yi Ma, Rahim Tafazolli
> - **Public record:** [IEEE Transactions on Cognitive Communications and Networking](https://doi.org/10.1109/tccn.2025.3589577)
> - **What is established:** The framework jointly treats semantic secrecy and sensing accuracy through artificial noise, a sensing signal, wiretap coding, beamforming, and IRS phases.
> - **Read with care:** The sensing–security trade-off and reported 5 dB comparison are simulation results tied to the selected baseline and model.
>
> ---
>
> ### RIS-Assisted Physical Layer Security: Artificial Noise-Driven Optimization and Measurements
>
> - **Authors:** Ahmet Muaz Aktas, Sefa Kayraklik, Sultangali Arzykulov, Galymzhan Nauryzbayev, Ibrahim Hokelek, Ali Gorcin
> - **Public record:** [IEEE Transactions on Vehicular Technology](https://doi.org/10.1109/tvt.2026.3709369)
> - **What is established:** The authors partition the RIS between communication-signal and artificial-noise steering, optimize phases and power, and evaluate the design in simulation and on an SDR-based testbed.
> - **Read with care:** The public abstract describes promising secrecy-capacity gains but does not support a universal deployment claim across hardware and attack conditions.
>
> ---
>
> ### Pinching-Antenna Systems (PASS)-Enabled Secure Wireless Communications
>
> - **Authors:** Guangyu Zhu, Xidong Mu, Li Guo, Shibiao Xu, Yuanwei Liu, Naofal Al-Dhahir
> - **Public record:** [IEEE Transactions on Communications](https://doi.org/10.1109/tcomm.2025.3621084)
> - **What is established:** The public abstract describes position tuning for single-waveguide secure transmission and artificial-noise-assisted waveguide-division and waveguide-multiplexing designs for multiple waveguides.
> - **Read with care:** Secrecy improvements are numerical results for the paper’s one-user, one-eavesdropper channel and architecture assumptions; they are not a general attack-resistance guarantee.
>
> ---
>
> ### Exploiting RIS in Secure Beamforming Design for NOMA-Assisted Integrated Sensing and Communication
>
> - **Authors:** Chengjun Jiang, Chensi Zhang, Chongwen Huang, Jianhua Ge, Mérouane Debbah, Chau Yuen
> - **Public record:** [IEEE Internet of Things Journal](https://doi.org/10.1109/jiot.2024.3416319)
> - **What is established:** The work jointly designs base-station beamformers and RIS phases for secure NOMA-ISAC under transmit-power, communication-quality, and sensing-quality constraints, with numerical evaluation.
> - **Read with care:** The sensing target’s eavesdropping role, channel knowledge, and reported gains follow the paper’s model and selected baselines; no hardware experiment is described in the public abstract.
>
> ---
>
> ### A Deep Learning Framework for Physical-Layer Secure Beamforming
>
> - **Authors:** Zihan Song, Yang Lu, Xianhao Chen, Bo Ai, Zhangdui Zhong, Dusit Niyato
> - **Public record:** [IEEE Transactions on Vehicular Technology](https://doi.org/10.1109/tvt.2024.3442167)
> - **What is established:** SecCNN and SecGNN learn unsupervised mappings from channel vectors to beamforming and artificial-noise vectors; numerical evaluation covers optimality, scalability, inference time, stability, and transfer across utilities.
> - **Read with care:** The evidence is numerical and does not demonstrate robustness to unmodeled channel distributions, adversarial manipulation, or radio-frequency hardware effects.
