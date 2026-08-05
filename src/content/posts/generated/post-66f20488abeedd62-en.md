---
title: "Multi-Agent Reinforcement Learning in Practice: CTDE, MAPPO, and System Design"
date: "2022-10-23"
description: "A practical view of multi-agent reinforcement learning through CTDE, MAPPO, coordination challenges, and implementation choices."
tags: ["multi-agent-reinforcement-learning", "ctde", "mappo", "system-design"]
categories: ["Reinforcement Learning"]
locale: "en"
slug: "multi-agent-reinforcement-learning-in-practice"
sourceId: "post-66f20488abeedd62"
translationKey: "post-66f20488abeedd62"
generated: true
draft: false
math: true
---

Multi-agent reinforcement learning (MARL) is not simply single-agent reinforcement learning repeated several times. Each agent sees only part of the system, its actions change the learning problem faced by the others, and a team reward rarely reveals which decision was responsible for success or failure. The useful engineering question is therefore not “Which acronym should I implement?” but “What information may be used during training, what must remain local at execution, and where should coordination be represented?”

## Start with the decision process

A cooperative task is often described as a decentralized partially observable Markov decision process (Dec-POMDP):

$$
\mathcal{M} = \left\langle \mathcal{S}, \{\mathcal{A}_i\}_{i=1}^{n}, P, R, \{\mathcal{O}_i\}_{i=1}^{n}, O, \gamma \right\rangle .
$$

At time $t$, agent $i$ receives a local observation $o_t^i$, chooses $a_t^i$, and participates in the joint action $\mathbf{a}_t=(a_t^1,\ldots,a_t^n)$. In a fully cooperative problem, the policies optimize a shared return:

$$
J(\theta)=\mathbb{E}_{\tau\sim\pi_\theta}\left[\sum_{t=0}^{T-1}\gamma^t r_t\right].
$$

The Markov state $s_t$ may be available to a simulator or training system without being observable by any individual actor. When an observation is not sufficient for control, an actor can condition on an action-observation history, commonly through a recurrent network. Partial observability is a state-information problem; it is not, by itself, evidence that the underlying dynamics are unstable.

Three difficulties dominate practice:

- **Learning non-stationarity.** From one agent's viewpoint, the transition data change as the other policies change.
- **Credit assignment.** A shared reward does not identify an individual action's contribution.
- **Combinatorial scale.** Joint observation and action spaces grow rapidly with the number of agents.

## CTDE is an information boundary

Centralized training with decentralized execution (CTDE) separates what can be learned from what can be used online. During training, a critic or mixing network may consume global state, joint actions, or other agents' observations. During execution, actor $i$ must choose from its permitted local information only.

This boundary gives several algorithm families:

| Family | Training signal | Execution rule | Main trade-off |
| --- | --- | --- | --- |
| Independent policy optimization | Per-agent value estimate from local data | Local policy | Simple and scalable, but treats changing teammates as part of the environment |
| Centralized actor-critic | Central critic with joint or global context | Local actor | Rich training signal, but critic size and credit assignment can become difficult |
| Value factorization | A joint value assembled from per-agent utilities | Local greedy choices | Efficient decentralized action selection, but the factorization restricts representable joint values |

MADDPG and COMA are centralized-critic examples. VDN and QMIX factorize a team value; QMIX imposes monotonicity so that local greedy choices agree with the centralized argmax. MAPPO instead applies PPO-style policy optimization with a centralized value function. These are different structural choices, not a single ranking from “less” to “more” centralized.

Parameter sharing is also optional. It is effective when agents are homogeneous and the task is approximately permutation-symmetric. Agent identifiers, role features, or separate heads are needed when identical observations should legitimately lead to different actions. Sharing one policy across heterogeneous agents merely hides a modeling mismatch.

## MAPPO remains an on-policy method

MAPPO collects rollouts with the current behavior policy, estimates advantages with a centralized critic, and performs a bounded number of PPO updates on that newly collected batch. For agent $i$, the probability ratio is

$$
r_t^i(\theta)=\frac{\pi_\theta(a_t^i\mid o_t^i)}{\pi_{\theta_{\mathrm{old}}}(a_t^i\mid o_t^i)}.
$$

Its clipped surrogate can be written as

$$
L_{\mathrm{clip}}(\theta)=\mathbb{E}_t\left[\min\left(r_t^i(\theta)\hat A_t^i,\operatorname{clip}\left(r_t^i(\theta),1-\epsilon,1+\epsilon\right)\hat A_t^i\right)\right].
$$

A common advantage estimator uses the centralized value input $x_t^i$:

$$
\hat A_t^i=\sum_{\ell=0}^{T-t-1}(\gamma\lambda)^\ell\delta_{t+\ell}^i,\qquad
\delta_t^i=r_t+\gamma V_\phi(x_{t+1}^i)-V_\phi(x_t^i).
$$

The ratio corrects the small policy change made while optimizing the current rollout. It does **not** turn MAPPO into replay-buffer-based off-policy learning. Multiple epochs over a fresh batch are proximal data reuse within one policy update; old trajectories are discarded once they are too far from the behavior policy. MAPPO's reported sample efficiency is an empirical result on the studied benchmarks, not evidence that the algorithm is off-policy.

The MAPPO study highlights several implementation choices that matter together:

- normalize value targets when return scales vary;
- give the critic useful global and agent-specific features without blindly concatenating every tensor;
- limit update epochs and tune minibatching, because excessive reuse makes the batch stale;
- tune the clipping threshold jointly with the number of epochs;
- mask unavailable actions, and represent inactive or dead agents consistently, including an identity signal when required.

These are benchmark-backed practices, not universal constants. Episode length, recurrent-state handling, reward scale, and environment parallelism can change the best setting.

## A system-design checklist

### Observation and execution contract

Write down exactly what each actor can observe at deployment. Test the exported actor with global-state tensors removed. If history matters, reset recurrent state only at real episode boundaries and mask padded timesteps in every loss.

### Critic design

Add global features because they explain future return, not because they are available. Compare a local critic, a compact centralized critic, and a full-state critic. A critic whose training loss decreases while policy performance degrades may be exploiting information that does not produce a useful advantage signal.

### Batch semantics

Store behavior log-probabilities, value predictions, masks, agent activity, and recurrent states at collection time. Recompute neither behavior probabilities nor masks after policies have changed. Report environment steps, not only gradient steps, when comparing sample efficiency.

### Evaluation

Use held-out seeds and at least three views of performance: team return, task success, and per-agent behavior or workload. Evaluate deterministic and stochastic policies separately. A high mean can conceal coordination collapse on a subset of scenarios.

## Debugging by failure mode

- If return oscillates after each update, reduce epochs or clip range and inspect policy KL.
- If the critic fits but actors do not coordinate, inspect counterfactual credit signals or compare value factorization.
- If agents collapse to identical behavior, verify that role or identity information is observable.
- If training succeeds only with the global state at execution, the CTDE boundary has been violated.
- If scaling the number of agents breaks learning, profile joint-tensor growth before increasing network width.

The most reliable MARL baseline is the simplest one that respects the execution information boundary. MAPPO is valuable precisely because it shows how far a carefully implemented on-policy baseline can go; it should not be described as off-policy merely because it reuses a rollout for several proximal updates.

## Further reading

- [The Surprising Effectiveness of PPO in Cooperative, Multi-Agent Games](https://arxiv.org/abs/2103.01955)
- [Official MAPPO implementation](https://github.com/marlbenchmark/on-policy)
- [Multi-Agent Actor-Critic for Mixed Cooperative-Competitive Environments](https://arxiv.org/abs/1706.02275)
- [Counterfactual Multi-Agent Policy Gradients](https://arxiv.org/abs/1705.08926)
- [QMIX: Monotonic Value Function Factorisation for Deep Multi-Agent Reinforcement Learning](https://proceedings.mlr.press/v80/rashid18a.html)
