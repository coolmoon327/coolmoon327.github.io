---
title: "Safety Layers for Continuous Action Spaces"
date: "2022-10-23"
description: "A summary of a safety-layer approach that predicts constraints and adjusts actions for safe exploration in continuous spaces."
tags: ["safe-reinforcement-learning", "safety-layer", "continuous-control"]
categories: ["AI"]
locale: "en"
slug: "safety-layer-continuous-action-spaces"
sourceId: "post-608126d88cfd54ab"
translationKey: "post-608126d88cfd54ab"
generated: true
draft: false
---

# Safe Exploration in Continuous Action Spaces

> \*\*Brief introduction to CMDPs:\*\* Building on an MDP, a CMDP defines a set of constrained reward functions. Like an MDP's reward function, the CMDP discounts each constrained reward and requires every policy's discounted values to remain below their corresponding thresholds. The optimization objective remains the maximization of the MDP's discounted return.

## I. Research Background

In some RL training settings, certain constraints must never be violated, and dangerous actions often need to be avoided from the very start of deployment.

## II. Target Problem

The paper aims to build a constrained reinforcement-learning algorithm for **continuous** action spaces that **does not violate any constraint**. This objective is easier to achieve in **discrete** action spaces than in **continuous** ones.

Physical problems often involve **observations confined to safe ranges**. For example, temperature and pressure readings collected in a data center may always remain below thresholds. Such measurements are called **safety signals** (that is, the values of constrained reward functions). Their smoothness—the trend by which a safe state gradually approaches a threshold—must be explored to avoid dangerous behavior.

Safe exploration commonly requires **pretraining** with a collection of known long-term consequences. Training a safe reinforcement-learning model when **external experience is insufficient** is another focus of the paper.

This is presented as the first work to address state safety directly at the policy level. It can train on arbitrary logged data, apply to continuous-control algorithms, and is not limited to a particular algorithm or even exclusively to RL.

## III. Core Method

***In short, the paper trains a neural network to predict whether a policy satisfies the constraints, uses it to construct a safety layer, and lets that layer adjust actions that might exceed the constraints.***

In addition to the basic CMDP tuple $ (\mathcal{S}, \mathcal{A}, P, R, \gamma, \mathcal{C}) $, the authors define a set of **safety signals** $ \overline{\mathcal{C} }=\left{\bar{c}*{i}: \mathcal{S} \rightarrow \mathbb{R} \mid i \in[K]\right} $, shorthand for C={ci:S×A→R∣i∈[K]}{\mathcal{C} }=\left\{ {c}\_{i}: \mathcal{S} \times \mathcal{A} \rightarrow \mathbb{R} \mid i \in[K]\right\}C={ci​:S×A→R∣i∈[K]}, with $ \bar{c}*\left(s^{\prime}\right) \triangleq c\_{i}(s, a) $.

### a) Linear Safety-Signal Model

Without prior knowledge, an agent uses a random policy early in training to select exploratory actions, which makes satisfying the constraints difficult. Training an agent with prior knowledge, however, is highly inefficient and unstable. The authors instead learn the **safety signals** from previously collected **one-step experiences**, using a more elegant construction:

cˉi(s′)≜ci(s,a)≈cˉi(s)+g(s;wi)⊤a\bar{c}\_{i}\left(s^{\prime}\right) \triangleq c\_{i}(s, a) \approx \bar{c}\_{i}(s)+g\left(s ; w\_{i}\right)^{\top} a
cˉi​(s′)≜ci​(s,a)≈cˉi​(s)+g(s;wi​)⊤a

Here, wiw\_iwi​ denotes the neural-network weights. The network g(s;wi)g(s;w\_i)g(s;wi​) takes state sss as input and outputs a column vector with the same dimensionality as action aaa. The expression can be viewed as a **first-order expansion** of ci(s,a)c\_i(s,a)ci​(s,a) with respect to aaa, representing the sensitivity of safety signal cic\_ici​ at state sss to action aaa. The prediction layer can be represented as follows:

[img omitted: third-party image]
