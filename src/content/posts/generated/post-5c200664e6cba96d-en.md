---
title: "From Bursty Arrivals to Random Access: Stochastic Models for Wireless Networks"
date: "2022-10-23"
math: true
description: "A connected treatment of Poisson and MMPP traffic, bursty arrivals, and ALOHA throughput models for wireless random access."
tags: ["stochastic-processes", "traffic-modeling", "mmpp", "aloha", "random-access"]
categories: ["Wireless and Networks"]
locale: "en"
slug: "stochastic-models-for-wireless-random-access"
sourceId: "post-5c200664e6cba96d"
translationKey: "post-5c200664e6cba96d"
generated: true
draft: false
---

Wireless access is shaped by two random mechanisms: packets arrive irregularly, and simultaneous transmissions may collide. A useful model must keep those mechanisms separate. The arrival model says **when work enters the system**; the access model says **which attempted transmissions succeed**. Combining them too early can produce an elegant formula for the wrong system.

## Start with the homogeneous Poisson model

Let $N(t)$ count arrivals by time $t$. A homogeneous Poisson process with rate $\lambda$ has stationary independent increments, so the number of arrivals in an interval of length $T$ obeys

$$
\Pr\{N(t+T)-N(t)=n\}=e^{-\lambda T}\frac{(\lambda T)^n}{n!},\qquad n=0,1,\ldots
$$

The increment has mean and variance $\lambda T$. This is a valuable baseline: it is simple, composable, and often adequate after aggregation. It is not a universal law of network traffic. Correlated sessions, synchronized applications, retransmissions, and sleep–wake cycles commonly create variance larger than the mean and correlation across intervals.

The first diagnostic is therefore empirical rather than philosophical: compare the sample mean and variance at several aggregation windows, inspect the autocorrelation of counts, and check whether the inferred rate stays stable over time. A Poisson fit at one time scale does not guarantee a Poisson process.

## Add burstiness with an MMPP

A Markov-modulated Poisson process (MMPP) makes the instantaneous arrival rate depend on a latent continuous-time Markov chain $J(t)$. For an $m$-state model, write its generator and state-dependent rates as

$$
Q=[q_{ij}],\qquad q_{ii}=-\sum_{j\ne i}q_{ij},\qquad
\Lambda=\operatorname{diag}(\lambda_1,\ldots,\lambda_m).
$$

When $J(t)=i$, arrivals occur at rate $\lambda_i$. If the chain is irreducible, its stationary distribution is obtained from

$$
\boldsymbol{\pi}Q=\boldsymbol{0},\qquad
\boldsymbol{\pi}\boldsymbol{1}=1,
$$

and the long-run mean arrival rate is

$$
\bar{\lambda}=\boldsymbol{\pi}\boldsymbol{\lambda}.
$$

The important gain is not merely a changing mean. Slow movement between low- and high-rate states induces correlated, overdispersed counts, while the Markov structure remains analytically manageable. A two-state MMPP is often enough to represent quiet and busy regimes; adding states should be justified by predictive improvement, not just a better in-sample fit.

An implementation must distinguish two models that are often confused:

- A continuous-time MMPP evolves $J(t)$ according to a generator $Q$ and may change state within an observation interval.
- A discrete-time Markov-modulated Poisson count model advances a transition matrix $P$ once per slot, then draws a Poisson count using that slot's state.

The second model can be a useful approximation, but it is not automatically a simulator for the first. The discretization interval and the relation between $P$ and $Q$ must be stated. Stationary probabilities should be solved with the normalization constraint, not extracted from an arbitrary null-space vector whose sign and scaling are uncontrolled.

## ALOHA: separate offered load from throughput

Normalize time by one packet duration and let $G$ denote the mean number of **attempts** per packet time, including retransmissions. Under the classical infinite-population Poisson model, a pure ALOHA packet succeeds only if no other attempt begins during a vulnerable period two packet times long. Thus

$$
P_{\mathrm{s}}=e^{-2G},\qquad S=G e^{-2G}.
$$

Differentiating gives the familiar maximum

$$
G^{\star}=\frac{1}{2},\qquad S_{\max}=\frac{1}{2e}\approx 0.184.
$$

Slotted ALOHA aligns attempts to slot boundaries, reducing the vulnerable period to one slot:

$$
P_{\mathrm{s}}=e^{-G},\qquad S=G e^{-G},\qquad
G^{\star}=1,\qquad S_{\max}=\frac{1}{e}\approx 0.368.
$$

These are benchmark curves, not deployment guarantees. They assume equal packet durations, independent Poisson attempts, a collision channel, and no capture, hidden terminals, channel errors, or multi-packet reception. Propagation delay changes the vulnerability geometry when it is not negligible relative to a packet time.

## Retransmissions close the feedback loop

New-arrival rate and attempt rate are not interchangeable. Failed packets join a backlog and generate future attempts; aggressive retransmission can increase $G$, cause more collisions, and enlarge the backlog again. In a finite-population model, the backlog size can be represented by a Markov chain. Its transition probabilities depend jointly on new-packet generation, retransmission policy, and the receiver's success law.

There is no general stability rule of the form “retransmission probability must be at least the new-packet probability.” Stability means that the coupled backlog process is positive recurrent under the specified traffic and service mechanism. It must be checked from the drift, the stationary chain, or another model-appropriate criterion.

If $B$ is the stationary mean number of backlogged packets and $S$ is the stationary admitted throughput, Little's law can yield

$$
\bar{D}=\frac{B}{S},
$$

but only when the system is stable, the averages exist, and the population and delay definitions are consistent. The equation cannot rescue an unstable simulation.

## Generalize the receiver rather than denying interference

Capture, successive interference cancellation, or a multi-antenna receiver may decode more than one packet in a slot. Represent this with a conditional success model $p_s(k\mid n)$: given $n$ simultaneous attempts, the probability that the decoded-packet count is $k$. The expected successes in that slot are

$$
\mathbb{E}[K\mid n]=\sum_{k=0}^{n} k\,p_s(k\mid n).
$$

This formulation is more honest than claiming that separate beams make competing packets non-interfering. The receiver model must still account for array degrees of freedom, signal-to-interference-plus-noise ratio, channel estimation, power imbalance, and implementation errors.

## A model-selection workflow

1. Define the observation scale, packet unit, retry policy, and what counts as a successful delivery.
2. Fit the simplest arrival model that reproduces the mean, dispersion, and correlation relevant to the decision.
3. Specify the receiver success law independently of the arrival process.
4. Close the retransmission loop and test stability before reporting delay.
5. Validate against traces using held-out count distributions, queue tails, throughput, and delay—not only mean load.

The goal is not the most elaborate stochastic process. It is the smallest model that preserves the mechanism behind the engineering conclusion.

## Further reading

- [Abramson, *The ALOHA System: Another Alternative for Computer Communications*](https://doi.org/10.1145/1478462.1478502)
- [Fischer and Meier-Hellstern, *The Markov-Modulated Poisson Process (MMPP) Cookbook*](https://doi.org/10.1016/0166-5316(93)90035-S)
- [Ward and Compton, *High Throughput Slotted ALOHA Packet Radio Networks with Adaptive Arrays*](https://doi.org/10.1109/26.221075)
- [Little, *A Proof for the Queuing Formula: L = λW*](https://doi.org/10.1287/opre.9.3.383)
