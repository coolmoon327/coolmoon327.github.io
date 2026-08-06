---
{
  "title": "Anti-jamming resilience from detection to application recovery",
  "locale": "en",
  "slug": "anti-jamming-resilience-stack",
  "newsId": "news-20260804-anti-jamming-resilience-stack",
  "translationKey": "news-20260804-anti-jamming-resilience-stack",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2024-07-16",
  "coverageEnd": "2025-07-28",
  "module": "fields",
  "keywords": [
    "anti-jamming",
    "learning-enabled-wireless",
    "resilient-wireless",
    "adversarial-wireless-learning",
    "noma",
    "ris",
    "reinforcement-learning",
    "wireless-communications",
    "isac",
    "resource-allocation"
  ],
  "authors": [
    "Aladin Djuhera",
    "Vlad C. Andrei",
    "Xinyang Li",
    "Ullrich J. Mönich",
    "Holger Boche",
    "Walid Saad",
    "Maice Costa",
    "Yalin E. Sagduyu",
    "Ghazal Asemian",
    "Mohammadreza Amini",
    "Burak Kantarci",
    "Amir Mehrabian",
    "Georges Kaddoum",
    "Luliang Jia",
    "Nan Qi",
    "Zhe Su",
    "Feihuang Chu",
    "Shengliang Fang",
    "Kai-Kit Wong",
    "Chan-Byoung Chae",
    "Yihui Chen",
    "Helin Yang",
    "Xiaoyu Ou",
    "Yifu Jiang",
    "Zehui Xiong"
  ],
  "subjectIds": [],
  "workIds": [
    "doi-10-1109-tifs-2025-3594107",
    "doi-10-1109-iccworkshops59551-2024-10615460",
    "doi-10-1109-icc52391-2025-11161445",
    "doi-10-1109-tcomm-2025-3587046",
    "doi-10-1109-tcomm-2025-3592583",
    "doi-10-1109-comst-2024-3482973",
    "doi-10-1109-lwc-2024-3496437"
  ],
  "coverTone": "violet",
  "coverKicker": "ANTI-JAMMING RESILIENCE",
  "coverTitle": "Detect, misdirect, suppress, recover",
  "coverPoints": [
    "Learning under attack",
    "Cooperative sensing",
    "Application-level recovery"
  ],
  "description": "Seven works treat anti-jamming as a chain spanning defense models, detection, direction estimation, decoys, programmable links, resource allocation, and application performance.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## A resilient link must do more than lower interference power

Jamming is not one fixed impairment. An attacker may detect transmission opportunities, target time-sensitive packets, perturb model parameters, or force a receiver to operate with poor channel knowledge. A resilient system therefore needs a chain of capabilities: choose a defense model, detect that interference is malicious, learn or estimate where it comes from, prevent the attacker from choosing the most damaging moment, reshape the link, and verify that the application still works. The seven studies gathered here cover different parts of that chain. Their metrics are not interchangeable, but their combination gives a much more useful account of anti-jamming design than a single post-mitigation SINR value.

[Game Theory and Reinforcement Learning for Anti-Jamming Defense in Wireless Communications: Current Research, Challenges, and Solutions](https://doi.org/10.1109/comst.2024.3482973) supplies a map of the decision problem before any particular defense is chosen. The survey organizes anti-jamming work across Bayesian, Stackelberg, stochastic, zero-sum, and graphical game models, as well as Q-learning, multi-armed bandits, deep reinforcement learning, and transfer learning. It also compares the strengths and limits of those families and discusses ways to combine strategic modeling with learned adaptation. A taxonomy is not itself a deployable defense, but it clarifies which assumptions concern the adversary, which concern environmental feedback, and which must be learned online.

[R-SFLLM: Jamming Resilient Framework for Split Federated Learning with Large Language Models](https://doi.org/10.1109/tifs.2025.3594107) begins from application failure. It relates jamming-induced embedding errors to learning-loss divergence, then uses wireless sensing to estimate jammer directions and jointly controls beamforming, scheduling, and resources. Controlled noise during training further improves tolerance to perturbed parameters in the evaluated language and vision-language models. The public abstract reports performance close to the unjammed baseline across selected tasks and datasets. This is stronger than a link-only evaluation, but it remains an experimental study of chosen models and attack settings rather than a guarantee for all split-learning systems.

## An adaptive attacker can be denied a useful target

[Timely NextG Communications with Decoy Assistance against Deep Learning-based Jamming](https://doi.org/10.1109/iccworkshops59551.2024.10615460) considers a jammer that detects transmissions with a learned classifier and has an average power budget. Decoy messages are intended to make it spend energy at the wrong time. Power control creates a trade-off: stronger transmission can improve delivery yet also make a packet easier for the adversary to identify. By evaluating information age as well as reliability, the study highlights that an anti-jamming action can preserve packet delivery while still failing a time-sensitive application if updates arrive too late.

[Anti-Jamming Resource Allocation for Integrated Sensing and Communications Based on Game-Guided Reinforcement Learning](https://doi.org/10.1109/lwc.2024.3496437) divides a coupled ISAC defense between two models. Power control becomes a Markov decision process, while channel selection is formulated as a Stackelberg game for which the authors establish the existence of an equilibrium. The resulting deep-RL method seeks a weighted balance between communication rate and effective sensing power under communication and sensing requirements. Simulations report improvements over selected baselines, but the evidence remains tied to the modeled jammer dynamics, inter-channel interference, reward, and system parameters.

[Active RIS-Assisted URLLC NOMA-Based 5G Network with FBL under Jamming Attacks](https://doi.org/10.1109/icc52391.2025.11161445) modifies the link itself. Active RIS elements support an ultra-reliable low-latency NOMA system under finite blocklength and dynamic traffic. The simulations report a 13.64% signal-to-jamming-plus-noise-ratio improvement when the modeled RIS grows from 4 to 400 elements, and a 31.68% energy-efficiency improvement after optimizing blocklength and packet arrival rate. These numbers are useful within the stated system model; they do not capture hardware noise, control overhead, or every latency component of a real active surface.

## Cooperation can separate detection from suppression

Two works by Amir Mehrabian and Georges Kaddoum divide cooperative defense into complementary stages. [Cooperative Jamming Detection Using Low-Rank Structure of Received Signal Matrix](https://doi.org/10.1109/tcomm.2025.3592583) uses the low-rank structure of received signals and likelihood-ratio tests to detect jamming under several assumptions about friendly nodes, jammers, noise statistics, and channel information. It also discusses analytical and Monte Carlo threshold setting. Detection performance is simulated, but the explicit cases make clear which prior information each detector requires.

[Enhancing Resilience Against Jamming Attacks: A Cooperative Anti-Jamming Method Using Direction Estimation](https://doi.org/10.1109/tcomm.2025.3587046) then uses cooperating sensing nodes to estimate the jammer-channel direction from pilots and suppress interference. Under severe jamming, the public abstract reports a 0.7 dB gap from the no-jamming case when sensing nodes substantially outnumber jammers, with extensions to multiple jammers at a cost in degrees of freedom. The condition is crucial: cooperation creates spatial information, but its advantage shrinks when pilots, sensing diversity, or coherence time are insufficient.

## Resilience is an end-to-end property

These works suggest a layered test for future anti-jamming claims. A game or learning formulation should state what the defender observes, how the jammer reacts, and what objective is optimized. Detection should state what noise and channel statistics it assumes. Direction estimation should state its pilot and sensing-node requirements. Link adaptation should account for surface noise, control cost, and finite blocklength. Learned or time-sensitive applications should be evaluated in their own loss, accuracy, or freshness metric. A defense is resilient only when the attacker’s effect is controlled all the way to the service the link was built to deliver.

## Research notes

> ### R-SFLLM: Jamming Resilient Framework for Split Federated Learning with Large Language Models
>
> - **Authors:** Aladin Djuhera, Vlad C. Andrei, Xinyang Li, Ullrich J. Mönich, Holger Boche, Walid Saad
> - **Public record:** [IEEE Transactions on Information Forensics and Security](https://doi.org/10.1109/tifs.2025.3594107)
> - **What is established:** The framework links embedding error to learning loss, uses sensing-assisted beamforming and resource control, and tests adversarial training on language and vision-language tasks.
> - **Read with care:** Close-to-baseline application performance is experimental and specific to the tested models, datasets, resource policies, and jamming conditions.
>
> ---
>
> ### Timely NextG Communications with Decoy Assistance against Deep Learning-based Jamming
>
> - **Authors:** Maice Costa, Yalin E. Sagduyu
> - **Public record:** [IEEE ICC Workshops 2024](https://doi.org/10.1109/iccworkshops59551.2024.10615460)
> - **What is established:** Decoy transmissions and power control are evaluated against a learned detector-jammer using information age and reliability objectives.
> - **Read with care:** Effectiveness depends on the jammer’s classifier, power budget, channel assumptions, and the overhead assigned to decoys.
>
> ---
>
> ### Active RIS-Assisted URLLC NOMA-Based 5G Network with FBL under Jamming Attacks
>
> - **Authors:** Ghazal Asemian, Mohammadreza Amini, Burak Kantarci
> - **Public record:** [IEEE ICC 2025](https://doi.org/10.1109/icc52391.2025.11161445)
> - **What is established:** Active-RIS size, amplitude, finite blocklength, packet arrivals, latency, and energy efficiency are jointly studied in simulation under jamming.
> - **Read with care:** The 13.64% SJNR and 31.68% energy-efficiency improvements follow the paper’s selected parameter changes and do not include every hardware implementation cost.
>
> ---
>
> ### Enhancing Resilience Against Jamming Attacks: A Cooperative Anti-Jamming Method Using Direction Estimation
>
> - **Authors:** Amir Mehrabian, Georges Kaddoum
> - **Public record:** [IEEE Transactions on Communications](https://doi.org/10.1109/tcomm.2025.3587046)
> - **What is established:** Cooperating sensing nodes estimate jammer-channel direction from pilots and enable spatial suppression under strong and fast-fading jamming.
> - **Read with care:** The reported 0.7 dB degradation assumes severe jamming and substantially more sensing nodes than jammers; multiple jammers consume degrees of freedom.
>
> ---
>
> ### Cooperative Jamming Detection Using Low-Rank Structure of Received Signal Matrix
>
> - **Authors:** Amir Mehrabian, Georges Kaddoum
> - **Public record:** [IEEE Transactions on Communications](https://doi.org/10.1109/tcomm.2025.3592583)
> - **What is established:** Low-rank received-signal structure supports likelihood-ratio detectors and threshold procedures for several levels of statistical knowledge.
> - **Read with care:** Detection gains are simulation-based, and threshold setting may require noise, channel, or jamming-free distribution information depending on the case.

> ---
>
> ### Game Theory and Reinforcement Learning for Anti-Jamming Defense in Wireless Communications: Current Research, Challenges, and Solutions
>
> - **Authors:** Luliang Jia, Nan Qi, Zhe Su, Feihuang Chu, Shengliang Fang, Kai-Kit Wong, Chan-Byoung Chae
> - **Public record:** [IEEE Communications Surveys & Tutorials](https://doi.org/10.1109/comst.2024.3482973)
> - **What is established:** The public abstract describes a survey of game-theoretic and reinforcement-learning defenses, their strengths and limitations, possible combinations, and open research directions.
> - **Read with care:** This is a synthesis of prior research rather than a single defense validated in one common experimental setting; the present article relies on the public abstract, not a full-text re-analysis of every surveyed work.
>
> ---
>
> ### Anti-Jamming Resource Allocation for Integrated Sensing and Communications Based on Game-Guided Reinforcement Learning
>
> - **Authors:** Yihui Chen, Helin Yang, Xiaoyu Ou, Yifu Jiang, Zehui Xiong
> - **Public record:** [IEEE Wireless Communications Letters](https://doi.org/10.1109/lwc.2024.3496437)
> - **What is established:** The study models power control as a Markov decision process and channel selection as a Stackelberg game, then evaluates a game-guided deep-RL allocation method for communication and sensing objectives.
> - **Read with care:** The reported resistance to jamming and inter-channel interference is simulation-based and depends on the specified ISAC model, jammer behavior, constraints, and baselines.
