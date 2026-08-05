---
title: "QoS-Aware Service Composition in Geo-Distributed Clouds"
date: "2022-10-24"
description: "A clear formulation of QoS-aware service composition and the role of genetic search in geo-distributed cloud workflows."
tags: ["service-composition","quality-of-service","geo-distributed-cloud","openraas"]
categories: ["Cloud and Edge Systems"]
locale: "en"
slug: "qos-aware-service-composition-in-geo-distributed-clouds"
sourceId: "post-382d4fc361a75c6a"
translationKey: "post-382d4fc361a75c6a"
generated: true
draft: false
math: true
---

A composite cloud service is often a workflow rather than one endpoint. Each stage may have several functionally equivalent providers, deployed in different locations and offering different latency, cost, capacity, availability, or reputation. The system must choose one candidate per stage while satisfying an SLA across the **whole path**.

That last phrase is essential. Selecting the locally fastest service at every stage can still produce a slow workflow when the chosen services communicate over poor inter-datacenter links. QoS-aware composition is therefore a joint selection problem over service properties and network conditions.

## Separate discovery from selection

Suppose a workflow contains $L$ abstract tasks. Functional discovery first constructs a candidate set $\mathcal{S}_i$ for each task $i$. Nonfunctional selection then chooses

$$
x=(x_1,\ldots,x_L), \qquad x_i\in\mathcal{S}_i.
$$

This separation prevents a common modeling mistake: an optimization algorithm should not choose a service that fails the required interface or semantics merely because its QoS score is attractive. Functional compatibility defines the search space; QoS ranks feasible compositions inside that space.

The number of possible sequential compositions is

$$
|\mathcal{X}|=\prod_{i=1}^{L}|\mathcal{S}_i|.
$$

Even moderate candidate sets therefore produce a large combinatorial search space. Branching, parallel, and conditional workflows add aggregation rules and decision dependencies, so the workflow structure must be part of the model rather than an afterthought.

## Aggregate QoS over the path

For a sequential workflow, an explicit latency model should include both execution and network delay:

$$
T(x)=\sum_{i=1}^{L}t_i(x_i)
+\sum_{i=0}^{L}d_i(x_i,x_{i+1}),
$$

where $t_i$ is service time and $d_i$ is the network delay between consecutive placements; $x_0$ and $x_{L+1}$ can represent the user-facing ingress and egress. If the system measures only service response time but ignores transfer delay, the model is not geo-aware in an operational sense.

Other attributes aggregate differently. Additive cost and independent component availability are commonly modeled as

$$
C(x)=\sum_{i=1}^{L}c_i(x_i),
\qquad
A(x)=\prod_{i=1}^{L}a_i(x_i).
$$

The availability product assumes independent failures. Shared datacenters, networks, power domains, or software dependencies violate that assumption; correlated-failure models are needed when resilience matters. Throughput is often limited by a bottleneck rather than added, while parallel-branch latency may be governed by a maximum. Each QoS attribute needs an aggregation law derived from the workflow.

An SLA can impose hard bounds such as $T(x)\le \overline{T}$, $C(x)\le \overline{C}$, and $A(x)\ge \underline{A}$. Preferences then rank solutions that already satisfy those requirements. Mixing a hard SLA with arbitrary penalty weights can hide violations: a numerically good score is not the same as a feasible service contract.

## Normalize before combining criteria

Latency and availability have different units and opposite directions. A scalar objective must first map each attribute to a dimensionless, consistently oriented quantity. The normalization range should come from declared bounds or the current candidate population, and the treatment of outliers and missing measurements should be explicit.

A weighted sum is easy to optimize and explain, but the weights encode a policy decision. They do not make conflicting objectives disappear, and they may fail to recover non-convex portions of a Pareto frontier. When several trade-offs are genuinely useful, a multiobjective method can return a set of non-dominated compositions for a later policy decision.

The input data also have time semantics. Service time, queue depth, and network latency may change faster than the composition can be deployed. A scheduler should record measurement age, use robust summaries or uncertainty bounds, and avoid claiming precision that the telemetry cannot support.

## Why skyline filtering helps

Within one functionally equivalent service set, candidate $u$ dominates candidate $v$ when $u$ is no worse in every selected QoS dimension and strictly better in at least one. A **skyline** retains only non-dominated candidates.

Skyline filtering can reduce obviously inferior choices and can seed a search with diverse high-quality candidates. It is not universally safe as a global preprocessing rule. A service that looks dominated locally may connect much better to the previous or next stage, so network-dependent attributes must be included in the comparison or evaluated after placement context is known.

This distinction is especially important in geo-distributed systems: service QoS belongs to a node, while network QoS belongs to a pair of placements and may be asymmetric.

## Genetic search as a transparent heuristic

A genetic algorithm offers a simple representation for the combinatorial problem:

- A chromosome contains one selected candidate index per workflow task.
- The initial population mixes random feasible compositions with skyline-informed seeds.
- Selection favors better feasible solutions while retaining diversity.
- Crossover exchanges compatible workflow segments.
- Mutation replaces one task's candidate with another member of the same functional set.
- Repair or feasibility-preserving operators handle hard constraints where possible.

The fitness function should be auditable: normalized QoS terms, preference weights, and every constraint treatment must be reported. Roulette-wheel selection assumes a nonnegative scale with meaningful relative magnitudes; rank or tournament selection is often easier to control when raw scores can be negative or tightly clustered.

Genetic search does not certify a global optimum. Its output depends on encoding, population size, initialization, operators, stopping criteria, and randomness. A credible evaluation therefore compares against simple baselines, reports feasibility rate and objective distribution over multiple seeds, and measures runtime as the candidate-set size grows. Exact or bounded solutions on small instances help quantify the heuristic gap.

## Connection to OpenRaaS

The public [OpenRaaS repository](https://github.com/zobinHuang/OpenRaaS) describes a decentralized Resource-as-a-Service platform that separates an application's runtime environment, persistent files, and rendering or computation. Its published architecture distinguishes a coordinating MasterNode from Computor, Filestore, and Depository worker roles.

In that public context, composition is not merely choosing interchangeable web APIs. It can also mean selecting cooperating resource roles whose placement affects startup delay, transfer cost, and user-facing latency. The architecture provides a concrete reason to model network QoS alongside node QoS: a Computor, Filestore, and Depository form a path, not three independent rankings.

The repository establishes the system roles and deployment concept; it does not by itself establish that a particular genetic scheduler is optimal or that specific SLA improvements have been achieved. Such claims require a defined workload, a reproducible implementation, and comparative measurements.

## A reproducible evaluation checklist

1. Publish the workflow graph and every candidate set.
2. Define units and aggregation laws for each QoS attribute.
3. Separate hard SLA feasibility from soft preferences.
4. Record how and when node and network metrics were measured.
5. State the chromosome, operators, repair rules, parameters, and random seeds.
6. Compare with random selection, greedy selection, and an exact or bounded method where tractable.
7. Report feasibility, objective values, tail latency, runtime, and variability—not only the best run.
8. Test stale telemetry, unavailable services, and correlated failures.

The central lesson is broader than one search algorithm: a composition method is only as strong as its workflow model, QoS aggregation, feasibility rules, and evidence. Heuristics can search a large space efficiently, but they cannot repair an ambiguous objective or an invalid SLA model.

## Further reading

- [Wang, Yang, and Mi, “A genetic-based approach to web service composition in geo-distributed cloud environment”](https://doi.org/10.1016/j.compeleceng.2014.10.008)
- [OpenRaaS public repository](https://github.com/zobinHuang/OpenRaaS)
- [Deb et al., “A Fast and Elitist Multiobjective Genetic Algorithm: NSGA-II”](https://doi.org/10.1109/4235.996017)
