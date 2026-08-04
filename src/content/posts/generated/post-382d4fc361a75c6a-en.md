---
title: "A Genetic Approach to Web-Service Composition"
date: "2022-10-24"
description: "Paper notes on QoS-aware web-service composition using a skyline-initialized genetic algorithm in geo-distributed clouds."
tags: ["service-composition", "genetic-algorithm", "cloud-computing"]
categories: ["Research Notes"]
locale: "en"
slug: "genetic-web-service-composition"
sourceId: "post-382d4fc361a75c6a"
translationKey: "post-382d4fc361a75c6a"
generated: true
draft: false
---

# A genetic-based approach to web service composition in geo-distributed cloud environment

> <https://www.sciencedirect.com/science/article/pii/S0045790614002419>
>
> Computers and Electrical Engineering, 2015
>
> Dandan Wang, Yang Yang, Zhenqiang Mi, University of Science and Technology Beijing
>
> Highly cited, with some relevance to the problem

## Abstract

An important research problem in service composition is how to select the best candidate from a set of functionally equivalent services according to a Service Level Agreement (SLA).

The paper considers both service QoS and the cloud network environment, and proposes a service-composition model.

It also presents a Genetic Algorithm-based method for web-service composition that minimizes SLA violations.

## Contributions

1. We ﬁrst specify a realistic QoS-based composition model that allows us to consider the distributed network environment.
   1. Network QoS is considered in the service-composition problem.
   2. The model also applies to problems with multiple QoS criteria.
   3. It provides a way to calculate QoS in service composition.
2. A heuristic composition algorithm based on genetic algorithm to maximize user experience and minimize SLA violation is proposed to solve the problem in this work.
   1. Traditional graph-theoretic methods have extremely high complexity.
3. We use the notion of skyline to generate the initial population, which improve the solution quality and convergence speed.

## Definitions

### Cloud Services

- The **cloud architecture** includes three layers: **software layer, platform layer and infrastructure layer**.
- **QoS** of web services refers to various nonfunctional characteristics such as response time, throughput, availability, and reliability.
- In cloud environment, it is a challenge to search for an optimal and feasible composition path efﬁciently because the problem of **service composition** is an **NP-complete** problem.
- Cloud providers derive their **proﬁts** from the margin between the operational cost of infrastructure and the revenue generated from users. Therefore, cloud providers are interested in maximizing proﬁt and ensuring QoS for users to enhance their reputation in the marketplace. They are looking into solutions that can minimize the SLA (Service Level Agreements) violation.

### Atomic Services

- **Atomic service** is an independent unit to solve a particular task in a service computing system. Atomic services are published to brokers by service providers in order to be discovered.
  - **QoS of atomic services** can be provided by providers, computed based on execution and monitored by the users, or collected via users’ feedback in terms of the characteristic of each QoS criterion.
- A **service set** is a collection of atomic services with the same function but different QoS levels.
- In SOA, a **service level agreement** (SLA) is a legal contract between service provider and user.
  - An SLA is the basic agreement between a provider and a user concerning QoS—in other words, the baseline that QoS must satisfy.

## Modeling

- The service-composition model consists of **Service Discovery** and **Service Selection**.

  - Service discovery is functional: the atomic services in a service set must satisfy the task's functional requirements.
  - Service selection is non-functional, and QoS describes those non-functional properties.
- The performance of distributed service composition depends heavily on network performance. Network latency can be divided into latency **between atomic services** and latency **between an atomic service and the user**.

  - The delay between datacenters is measurable and predictable because that the number of datacenters for certain cloud provider is limited and stable.
  - The network delay between service and user can be obtained from the feedback of network and the information of execution monitoring.
- Three service-composition structures: **sequential**, **parallel** and **conditional**.

  - [Image omitted: third-party image]
  - [Image omitted: third-party image]
  - Our model clearly has a sequential structure.
- Optimization objectives and constraints:

  - the user experience can be optimized;
  - the QoS requirements described in SLA can be satisﬁed.

## Algorithm

- There are many well-known heuristic search methods, such as Tabu Search, Simulated Annealing and Genetic Algorithm. The authors select a **genetic algorithm**.

  - Genetic Algorithm is **population-based**, whereas Tabu Search and Simulated Annealing are individual-based.
  - The optimization of the parameters for Genetic Algorithm is **simpler** than other algorithms under our proposed model.
- Fitness function

  f(CS)=∑i=1oαi×ζi(CS)ζi−(CS)=Sqi−−qi−(CS)Sqi−ζi+(CS)=qi+(CS)−Sqi+Sqi+f(C S)=\sum\_{i=1}^{o} \alpha\_{i} \times \zeta\_{i}(C S) \\
  \begin{aligned} \zeta\_{i}^{-}(C S) &=\frac{S q\_{i}^{-}-q\_{i}^{-}(C S)}{S q\_{i}^{-}} \\
  \zeta\_{i}^{+}(C S) &=\frac{q\_{i}^{+}(C S)-S q\_{i}^{+}}{S q\_{i}^{+}} \end{aligned}
  f(CS)=i=1∑o​αi​×ζi​(CS)ζi−​(CS)ζi+​(CS)​=Sqi−​Sqi−​−qi−​(CS)​=Sqi+​qi+​(CS)−Sqi+​​​

  - SqSqSq is the QoS constraint, qqq is the QoS value, and αi\alpha\_iαi​ is the user's preference ratio for the iii-th QoS criterion (∑iαi=1\sum\_i\alpha\_i=1∑i​αi​=1).
  - The ﬁtness function must **promote** the increase of positive criteria and the decrease of negative criteria (two types of QoS criteria).

    - The **increase** of values for positive criteria is beneﬁcial for users, such as availability and reputation.
    - The **decrease** of values for negative criteria is beneﬁcial for users, such as time and price.
    - In the **evolution process**, the ﬁtness function can help to maximize positive criteria and minimize negative criteria.
  - The ﬁtness function needs to reﬂect **users’ preference**.

    - some users prefer service with high availability to short response time;
    - weights are assigned to QoS criteria to represent users’ preference.
- Encoding

  - Genome
    - **genomes** represent the possible choices available in the problem;
    - encode a **service composition** as a genome.
  - Gene
    - encode an **atomic service** as a gene in the genome.
- Initial population

  - Use the skyline concept to initialize one-fifth of the population, and initialize the rest randomly.
    - A **Skyline** set is a subset of a service set. A skyline set comprises the atomic services in a service set that are **non-dominated**.
    - An atomic service is **non-dominated** if no other service surpasses it on every QoS criterion.
  - Brokers maintain a list of the skyline set for each service set, which can be updated when atomic services change.
- Selection operator

  - Use roulette-wheel selection. In a population of size NNN, the probability of selecting the kkk-th individual is $ p\_{k}=\frac{f\_{k}}{\sum\_{j=1}^{N} f\_{j}} $.
  - Better genes have a higher probability of selection and are therefore more likely to be inherited.
- Crossover operator

  - Select parents randomly.
  - Split each parent into two parts and exchange the latter parts.
- Mutation operator

  - Randomly select a gene in the genome, then replace it with a random **atomic service** from its associated **service set**.
  - This helps avoid convergence to a local optimum.

## Evaluation

- Service-composition model
  - The modeling resembles our method and offers useful ideas.
    - We likewise assume that **service discovery** has already been implemented and focus mainly on **service composition**.
    - Our Scheduler does not complete the entire **service composition**. Instead, for sequential atomic services, the entity providing the current service selects the entity at the next level, while the Scheduler controls the eligible range during this process.
  - Several definitions from this paper are useful.
    - The most relevant definitions concern **atomic services**.
  - We can likewise use SLA-based constraints, although our optimization objective is not limited to user-preference-weighted QoS.
- Genetic algorithm
  - The algorithm itself has little value for our case.
  - The paper represents user preferences through weight α\alphaα in the objective and incorporates constraints into the objective through normalized ζ\zetaζ.
    - We can adopt this practice, but fff should be only one **multi-objective** term in the optimization objective. This term can satisfy constraints and improve user QoS.
      - These QoS considerations can support our pursuit of low latency when selecting a Provider.
      - The QoS design is also multi-objective. We could design QoS measures for the Depositary and Filestore to limit the range of storage nodes a Provider may select.
    - The main part of the objective should be **fairness** in node selection.
      - For storage resources, the objective should be **remaining egress bandwidth**.
        - Based on historical experience, estimate a Filestore's long-term egress bandwidth over a future interval, while requiring its current egress bandwidth to meet the QoS constraint.
        - For a Depositary that only serves instantaneous downloads, use current egress bandwidth directly.
      - For rendering resources, the objective should be the **network distance** between the resource and the user—the number of forwarding hops required to reach the user—subject to a rendering-capability constraint.
  - Following the paper, node reputation could also be introduced as part of QoS to account for an **endorsement system**.
    - Reputation configuration and dynamic maintenance would require endorsement by the Scheduler.
  - User preferences should be represented as a table, assigning different preferences to different service types such as FPS, ACT, and RPG.
    - The weight of reputation should be fixed, and Provider reputation should receive the largest weight.
    - The SLA should be a hard requirement. Users choose some parameters such as frame rate and resolution; the others map from the game type—or the specific game—to a preconfigured table, from which the corresponding QoS baseline is selected.
