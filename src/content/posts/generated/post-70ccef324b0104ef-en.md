---
title: "Using KNN with DDPG for Discrete Actions"
date: "2022-10-24"
description: "Notes on the Wolpertinger architecture, its differences from DDPG, implementation changes, and observed results."
tags: ["wolpertinger", "ddpg", "discrete-actions"]
categories: ["AI"]
locale: "en"
slug: "wolpertinger-ddpg-discrete-actions"
sourceId: "post-70ccef324b0104ef"
translationKey: "post-70ccef324b0104ef"
generated: true
draft: false
---

# Using KNN with DDPG for Discrete Actions

> Based on [Deep Reinforcement Learning in Large Discrete Action Spaces](https://arxiv.org/pdf/1512.07679.pdf), Google DeepMind, 2016
>
> A PyTorch implementation of the Wolpertinger Architecture

## Differences from DDPG

[Image omitted: third-party image]

- The Wolpertinger Architecture uses an Actor-Critic structure, but **action selection** does not rely on the Actor alone.
  1. The Actor takes the state as input and produces a continuous vector. KNN then finds the **K discrete vectors** in the action space that are **closest** to it.
  2. The Critic takes the state and one of those discrete vectors as input. After K passes, it produces K Q-values.
  3. The discrete vector corresponding to the **largest** Q-value becomes the **action**.
- The replay buffer stores the discrete action vector that was ultimately **executed**, just as in ordinary DDPG.
  - The Critic can therefore be trained directly from the state and action in the buffer when calculating Q.
- Training the Critic requires care when generating the **target Q-value**.
  - At line 13 of Algorithm 2, the action supplied to QtargetQ\_{target}Qtarget​ comes from πtarget\pi\_{target}πtarget​, which includes both ActortragetActor\_{traget}Actortraget​ and CritictargetCritic\_{target}Critictarget​.
  - Training then proceeds through ordinary gradient descent on the Critic loss.
- The Actor can still be trained by **backpropagating directly through the Q-value**.
  - $ \begin{aligned} \nabla\_{\theta} f\_{\theta^{\pi}} \approx \mathbb{E}*{f{\prime}}\left[\left.\nabla\_{\theta{\pi}} Q*{\theta^{Q}}(\mathbf{s}, \hat{\mathbf{a}})\right|*{\hat{\mathbf{a}}}=f*(\mathbf{s})\right] =\mathbb{E}*{f^{\prime}}\left[\nabla*{\hat{\mathbf{a}}} Q\_{\theta^{Q}}\left(\mathbf{s}, f\_{\theta}(\mathbf{s})\right) \cdot \nabla\_{\theta^{\pi}} f\_{\theta^{\pi}}(\mathbf{s}) \mid\right] \end{aligned} $
  - DDPG's Actor follows the same gradient expression. Because Actor and Critic connect directly, backpropagation can start from the Q-value produced by the Critic—and can even be allowed to update the Critic network at that point.
  - In the Wolpertinger Architecture, KNN sits between Actor and Critic and the largest of K Critic Q-values is selected. However, according to line 15 of Algorithm 2, a is taken from the Actor when differentiating Q, so training is no different from DDPG.

[Image omitted: third-party image]

## Implementation

- The Wolpertinger Architecture implementation provides a separate select\_action module.

  1. Select a proto\_action with the conventional ddpg\_select\_action.
  2. Find the K nearest neighbors of the proto\_action.
  3. Use the Critic to calculate the Q-values of the K neighbors.
  4. Find the Argmax and return its neighboring Action.
  - This entire process uses the latest networks rather than the Target networks.
- update\_policy is no different from DDPG.

  - Q is calculated from the state and **discrete action** recorded in the buffer.
  - The target Q-value is calculated from the proto\_action produced by ActortargetActor\_{target}Actortarget​. At that point, CritictargetCritic\_{target}Critictarget​ receives a **continuous action**.
    - This **does not follow line 13 of Algorithm 2**.
  - The Actor is trained by backpropagating directly through Q. At that point, CriticCriticCritic receives a **continuous action**.
    - This is not a problem.

## Changes Required in the D4PG Code

- The goal is to separate the Wolpertinger Architecture into an independent module so that it can later be applied to other policy-based code.
  - Following the Wolpertinger reference code, the main work is to implement a new select\_action and the K-means computation.
  - The reference code does not fully implement the required changes to training and should be studied further.
  - Watch whether Distributional Q calculations in D4PG are affected.
- The paper's use of K nearest neighbors implicitly encodes actions. **Do we also need an encoding?**
  - For example, encode 20 base stations as five binary outputs.
  - The final decision was still to use ordinary encoding.

1. Reimplement K-means in action\_space.py without using a Cartesian product.
   1. Refactor rebuild\_flann so that it maps the neural-network output [-1., 1.] to M+1 discrete values [0, M].
   2. Unlike the original program, the action space is [0, M], so p\_in must be normalized into discrete values.
   3. Continue to return two sets of results: one corresponding to the network output [-1., 1.], and one corresponding to the real action [0, M].
2. Replace the Actor's tanh + cat directly with nn.Softsign().
3. Port the wolp\_action function.
   1. Replace the uses of to\_tensor and to\_numpy.
   2. Handle the Critic with distributional processing.
4. Add select\_action.
   1. Replace self.actor.get\_action(state) in agent.py with select\_action, while also giving the agent access to the Critic network.
   2. Add a wolp option that treats the Actor output as a proto-action and then obtains the best action through wolp\_action.
   3. Add select\_target\_action, returning a raw action.
5. Modify \_update\_step.
   1. Add a wolp option so that the target Critic receives Wolpertinger's raw action.
   2. The replay-buffer action comes from Wolpertinger's output.

## Experimental Results

1. Results improved somewhat, but the improvement was negligible when the action dimension was large.
   - The enumerable range becomes smaller. It is easy to see that, for the same KNN count, each dimension of a two-dimensional action has a larger enumeration range than each dimension of a three-dimensional action.
2. Performance declined severely and training became slow.
3. The final design emits N\*M action values and converts them through N softmax groups into N one-hot groups. Both speed and results were more reliable than with Wolpertinger.
