---
title: "Multi-Agent Reinforcement Learning Notes"
date: "2022-10-23"
description: "Notes on MARL settings, CTDE, value decomposition, benchmark environments, and MAPPO objectives and techniques."
tags: ["multi-agent-reinforcement-learning","mappo"]
categories: ["Study Notes"]
locale: "en"
slug: "multi-agent-reinforcement-learning-notes"
sourceId: "post-66f20488abeedd62"
translationKey: "post-66f20488abeedd62"
generated: true
draft: false
---
# Classification

## Scheduling Method

- centralized: In cooperative games, directly extend single-agent RL and share one policy among all agents
- decentralized: Each agent independently optimizes its own environmental return
  - IPPO

## Algorithm Approach

- centralized training and decentralized execution (CTDE): Use an Actor-Critic framework with a centralized Critic that has a global view
  - MADDPG
  - COMA: multi-agent PG methods
  - QMix
- value decomposition (VD)
  - value-decomposed Q-learning

# Issues

1. instability
2. high variance
   - Use a large batch size to reduce the variance of PG

# Environment

## MDP

- Decentralized partially observable Markov decision processes (DEC-POMDP) shared rewards. A DEC-POMDP is defined by ⟨S,A,O,R,P,n,γ⟩.S\langle\mathcal{S}, \mathcal{A}, O, R, P, n, \gamma\rangle . \mathcal{S}⟨S,A,O,R,P,n,γ⟩.S is the state space. A\mathcal{A}A is the shared action space for each agent. oi=O(s;i)o\_{i}=O(s ; i)oi​=O(s;i) is the local observation for agent iii at global state sss. P(s′∣s,A)P\left(s^{\prime} \mid s, A\right)P(s′∣s,A) denotes the transition probability from SSS to S′S^{\prime}S′ given the joint action A=(a1,…,an)A=\left(a\_{1}, \ldots, a\_{n}\right)A=(a1​,…,an​) for all nnn agents. R(s,A)R(s, A)R(s,A) denotes the shared reward function. γ\gammaγ is the discount factor. Since most of the benchmark environments contain homogeneous agents, we utilize parameter sharing: each agent uses a shared policy πθ(ai∣oi)\pi\_{\theta}\left(a\_{i} \mid o\_{i}\right)πθ​(ai​∣oi​) parameterized by θ\thetaθ to produce its action aia\_{i}ai​ from its local observation oio\_{i}oi​, and optimizes its discounted accumulated reward J(θ)=Eat,st[∑tγtR(st,at)]J(\theta)=\mathbb{E}\_{a^{t}, s^{t}}\left[\sum\_{t} \gamma^{t} R\left(s^{t}, a^{t}\right)\right]J(θ)=Eat,st​[∑t​γtR(st,at)].

## GYM

- multi-agent particle-world environment (MPE)
- Starcraft multi-agent challenge (SMAC)
- Hanabi challenge

# MAPPO

## Description

​ MAPPO is both a CTDE algorithm with a centralized value function and a distributed-learning algorithm with decentralized value functions. It provides a CTDE-style network while also allowing each agent to maintain an independent network.

​ It can effectively address the low sample efficiency of on-policy methods such as [PPO](https://openai.com/blog/openai-baselines-ppo/) by using importance sampling to learn from earlier experience.

## Approach

​ Like PPO, MAPPO trains the policy πθ\pi\_\thetaπθ​ and the value function Vϕ(s)V\_\phi(s)Vϕ​(s). The Vϕ(s)V\_\phi(s)Vϕ​(s) used to reduce variance during training has a global view, making MAPPO a CTDE architecture. These networks can be distributed to every agent, while each agent may also retain two independent networks.

​ Five techniques are important when tuning MAPPO: value normalization, value function inputs, training data usage, policy and value clipping, and death masking.

## Techniques

1. Utilize value normalization to stabilize value learning.
2. Include agent-speciﬁc features in the global state and check that these features do not make the state dimension substantially higher.
3. Avoid using too many training epochs and do not split data into mini-batches.
4. For the best PPO performance, tune the clipping ratio ϵ\epsilonϵ as a trade-off between training stability and fast convergence.
5. Use zero states with agent ID as the value input for dead agents.

## Optimization Objective

1. Actor Network

L(θ)=[1Bn∑i=1B∑k=1nmin⁡(rθ,i(k)Ai(k),clip⁡(rθ,i(k),1−ϵ,1+ϵ)Ai(k))]+σ1Bn∑i=1B∑k=1nS[πθ(oi(k)))]\left.L(\theta)=\left[\frac{1}{B n} \sum\_{i=1}^{B} \sum\_{k=1}^{n} \min \left(r\_{\theta, i}^{(k)} A\_{i}^{(k)}, \operatorname{clip}\left(r\_{\theta, i}^{(k)}, 1-\epsilon, 1+\epsilon\right) A\_{i}^{(k)}\right)\right]+\sigma \frac{1}{B n} \sum\_{i=1}^{B} \sum\_{k=1}^{n} S\left[\pi\_{\theta}\left(o\_{i}^{(k)}\right)\right)\right]
L(θ)=[Bn1​i=1∑B​k=1∑n​min(rθ,i(k)​Ai(k)​,clip(rθ,i(k)​,1−ϵ,1+ϵ)Ai(k)​)]+σBn1​i=1∑B​k=1∑n​S[πθ​(oi(k)​))]

where $ r\_{\theta, i}{(k)}=\frac{\pi\_{\theta}\left(a\_{i} \mid o\_{i}^{(k)}\right)}{\pi\_{\theta\_{o l d}}{\left(a\_{i}^{(k)} \mid o\_{i}^{(k)}\right)}} \cdot A\_{i}^{(k)} $ is computed using the GAE method, $ S $ is the policy entropy, and $ \sigma $ is the entropy coefficient hyperparameter.

2. Critic Network

L(ϕ)=1Bn∑i=1B∑k=1n(max⁡[(Vϕ(si(k))−R^i)2,(clip⁡(Vϕ(si(k)),Vϕold(si(k))−ε,Vϕold(si(k))+ε)−R^i)2]L(\phi)=\frac{1}{B n} \sum\_{i=1}^{B} \sum\_{k=1}^{n}\left(\max \left[\left(V\_{\phi}\left(s\_{i}^{(k)}\right)-\hat{R}\_{i}\right)^{2},\left(\operatorname{clip}\left(V\_{\phi}\left(s\_{i}^{(k)}\right), V\_{\phi\_{o l d}}\left(s\_{i}^{(k)}\right)-\varepsilon, V\_{\phi\_{o l d}}\left(s\_{i}^{(k)}\right)+\varepsilon\right)-\hat{R}\_{i}\right)^{2}\right]\right.
L(ϕ)=Bn1​i=1∑B​k=1∑n​(max[(Vϕ​(si(k)​)−R^i​)2,(clip(Vϕ​(si(k)​),Vϕold​​(si(k)​)−ε,Vϕold​​(si(k)​)+ε)−R^i​)2]

where R^i\hat{R}\_{i}R^i​ is the discounted reward-to-go. BBB refers to the batch size and nnn refers to the number of agents.
