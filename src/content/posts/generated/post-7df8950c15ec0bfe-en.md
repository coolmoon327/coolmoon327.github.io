---
title: "Variational Autoencoders and Their Applicability to BECEC"
date: "2022-10-24"
description: "A survey of GAN and autoencoder variants followed by an analysis of why VAE-style compression is poorly matched to BECEC observations."
tags: ["vae", "autoencoder", "generative-models", "becec"]
categories: ["Machine Learning"]
locale: "en"
slug: "variational-autoencoders-and-becec"
sourceId: "post-7df8950c15ec0bfe"
translationKey: "post-7df8950c15ec0bfe"
generated: true
draft: false
---

# Variational Autoencoders

## Abstract

Based on secondary sources from Zhihu rather than the original papers, this article surveys several of the principal generative models available at the time. It does not cover minor state-of-the-art variations. The models are introduced concisely in the order of their development, with an effort to list their strengths, weaknesses, underlying logic, and implementations.

The second part analyzes in detail the problems encountered when applying a VAE to BECEC. Both the design of the VAE itself and the characteristics of BECEC data make training the encoder difficult. More problematically, applications of VAEs and GANs concentrate on image processing, and I could not find ready-made code suitable for our use.

The article concludes by identifying the cause of BECEC's training problem and arguing that any kind of AE is unlikely to work effectively.

## Generative Models: Autoencoding and Adversarial Generation

[img omitted: source image unavailable]

Generative models developed along two paths: VAEs and GANs. Their results have complementary strengths and weaknesses. VAE-generated images are conventional but blurry, whereas GAN-generated images are sharp but prone to making things up. The reasons are:

- VAEs lack a good standard for judging whether a generated image is **good or bad**, and can only use MSE as a rough error measure.
- When a GAN's **discriminator D is not trained sufficiently**, the generator G can exploit it and may even fail to learn the training set.

Generative models most commonly use the following four types of networks:

1. **E: Encoder.** Given an image x, it encodes it as a latent variable z, which is intended to follow a Gaussian distribution. If a class c is also provided, the generated latent variable has higher quality and more randomness.
2. **G: Generator.** Given a latent variable z, such as random noise, it can generate a plausible image. If a class c is also supplied, the result will be a plausible image belonging to class c.
3. **C: Classifier.** Given an image x, it outputs the class c to which the image belongs.
4. **D: Discriminator.** Given an image x, it decides whether the image is real or “imagined by the computer.” GANs first introduced this network, which competes with G so that both improve.

It is worth noting that a GAN has no encoder, while an AE is generally used mainly for its decoder. BECEC aims to compress a base station's observation, so GANs do not provide a useful direction. AEs also present problems, which the next section analyzes in detail.

### Generative Adversarial Networks (GANs)

The essence of a GAN is to train a **generator G** and a **discriminator D** separately. D learns to recognize generated images by **minimizing** their scores and **maximizing** the scores of original images. G learns to produce images closer to the originals by **maximizing** the discriminator's score. The model is called generative-**adversarial** because D tries to recognize the “fraud,” while G tries to fool D. Their adversarial training eventually reaches a Nash equilibrium. G's input is typically **Gaussian noise**.

Common GAN models now tend toward DCGAN, where DC stands for Deep Convolutional. This architecture brings convolutional-neural-network techniques into adversarial generation, removes fully connected layers to create a **fully convolutional network**, and inserts batch normalization between layers to stabilize training. The **generator** uses a [transposed-convolution layer](https://www.cnblogs.com/wmr95/p/9551490.html), which can be understood as a form of deconvolution or upsampling.

The [evolution of GANs](https://mp.weixin.qq.com/s?__biz=MzIwMTc4ODE0Mw==&mid=2247484880&idx=1&sn=4b2e976cc715c9fe2d022ff6923879a8&chksm=96e9da50a19e5346307b54f5ce172e355ccaba890aa157ce50fda68eeaccba6ea05425f6ad76&scene=21#wechat_redirect) has mainly involved **rewriting D's loss function**. WGAN, for example, designs a neural-network method for calculating the **distance between distributions** based on the Wasserstein distance. It further simplifies this to scoring each batch of generated images; individual images cannot be scored alone, and original images no longer need to be supplied to calculate the distance. WGAN-GP introduces a gradient penalty: a **penalty term** in the loss enforces the Lipschitz constraint and prevents **D's loss** from falling to negative infinity.

CGAN instead **adds the label as a condition** to the GAN, allowing the class of a generated image to be specified. Its implementation is direct: dimensions representing condition c are added to the inputs of both G and D.

[img omitted: third-party image]

### Autoencoders (AEs)

An AE cascades an encoder and decoder and trains them using the difference between input and output as the loss. The resulting encoder compresses the input data with as little loss as possible.

A DAE is intended to denoise its input. It first **adds noise** to a clean input signal to create a corrupted signal, and then feeds the corrupted signal into a traditional autoencoder to reconstruct the original clean signal. The goal is to make the model more **robust** while [preventing the hidden layer from learning a meaningless identity function](https://zhuanlan.zhihu.com/p/150814670), somewhat like dropout.

Structurally, a VAE differs little from an AE. The key distinction is that its **latent variable z**, the encoding result, is sampled from a **Gaussian distribution** with a mean μ\muμ and variance σ\sigmaσ produced by encoder E. Whereas an AE's encoder outputs an n-dimensional z tensor, a VAE's encoder produces a 2n-dimensional tensor, half representing σ\sigmaσ and half μ\muμ. The word “variational” in VAE comes from the use of KL divergence and its properties in the derivation.

[img omitted: third-party image]

A VAE must ensure not only that the generated image is as close as possible to the original, but also that E's output approaches the **standard normal distribution** N(0,1)N(0,1)N(0,1). Its loss therefore includes a KL loss relative to N(0,1)N(0,1)N(0,1): Lμ,σ2=12∑i=1d(μ(i)2+σ(i)2−log⁡σ(i)2−1)\mathcal{L}\_{\mu, \sigma^{2}}=\frac{1}{2} \sum\_{i=1}^{d}\left(\mu\_{(i)}^{2}+\sigma\_{(i)}^{2}-\log \sigma\_{(i)}^{2}-1\right)Lμ,σ2​=21​∑i=1d​(μ(i)2​+σ(i)2​−logσ(i)2​−1). The following loss code shows this in practice:

```
recons_loss =F.mse_loss(recons, input)
kld_loss = torch.mean(-0.5 * torch.sum(1 + log_var - mu ** 2 - log_var.exp(), dim = 1), dim = 0)

if self.loss_type == 'H': # https://openreview.net/forum?id=Sy2fzU9gl
  loss = recons_loss + self.beta * kld_weight * kld_loss
elif self.loss_type == 'B': # https://arxiv.org/pdf/1804.03599.pdf
  self.C_max = self.C_max.to(input.device)
  C = torch.clamp(self.C_max/self.C_stop_iter * self.num_iter, 0, self.C_max.data[0])
  loss = recons_loss + self.gamma * kld_weight* (kld_loss - C).abs()
```

The VAE also has a conditional variant, CVAE. Implementing a CVAE requires changing only the KL loss so that E's output retains unit variance while its mean μ\muμ approaches a class-specific μc\mu^{c}μc: Lμ,σ2=12∑i=1d((μ(i)−μic)2+σ(i)2−log⁡σ(i)2−1)\mathcal{L}\_{\mu, \sigma^{2}}=\frac{1}{2} \sum\_{i=1}^{d}\left((\mu\_{(i)}-\mu\_{i}^{c})^{2}+\sigma\_{(i)}^{2}-\log \sigma\_{(i)}^{2}-1\right)Lμ,σ2​=21​∑i=1d​((μ(i)​−μic​)2+σ(i)2​−logσ(i)2​−1). Here, μc\mu^{c}μc is calculated from the input c by a neural network.

[img omitted: third-party image]

### E+G+C+D = **CVAE-GAN**

CVAE-GAN [combines the strengths](https://zhuanlan.zhihu.com/p/27966420) of CGAN and CVAE:

- A VAE has an original input x to guide G's training, ensuring at least that G learns the training set, so the first half uses an AE structure.
- A GAN's D provides a better standard for evaluating G, so G is ultimately trained using the evaluation y output by D.
- We must also ensure that the generated image really belongs to class c, so C is introduced to help evaluate G.

[img omitted: third-party image]

G's loss has three main components:

1. LG(img)L\_G(img)LG​(img): for z generated from x, G should reconstruct an x’ that is closer to x at the pixel level.
2. LG(C)L\_G(C)LG​(C): an image generated by G should be classified by C as belonging to c.
3. LG(D)L\_G(D)LG​(D): an image generated by G should be classified by D as a real image.

---

## Problems with Using a VAE in BECEC

BECEC's problem is that the state has too many dimensions. Fully connected layers in RL alone have difficulty extracting environmental information effectively, so training consistently converges to local optima that are not especially good. We therefore want an appropriate encoding scheme that compresses the observation while still allowing RL to train effectively. This creates two considerations:

1. Encoding: the scheme must encode, so a GAN cannot be used.
2. Effectiveness: RL requires similar environments to have similar states so that it can generalize; a compression scheme such as MD5 is therefore clearly unsuitable.

### The Essence of a VAE

First, we need to clarify that an AE extracts a latent variable z from an input x and then reconstructs x’ from z. The emphasis is on “extracting” and “reconstructing.” In some AE implementations, the encoder's output dimension is even larger than that of the original input x. An AE is not necessarily good at compression; its effectiveness is highly **dependent on the data's characteristics**.

An AE compresses and reconstructs, whereas we only want to compress data according to some criterion. Much of the AE's work is therefore **unnecessary**, which is exactly ML-DDPG's criticism. Yet ML-DDPG's own implementation is clumsy. Another report analyzes the severe problems it would encounter in BECEC. In brief, it would require roughly as much **time** to train as RL itself. Given that the critic already cannot be trained adequately, ML-DDPG—which uses almost the same structure and training method as a critic—would encounter the same **problems**.

In BECEC, what we actually want is a feature representation of each base station's **resource distribution and remaining capacity** over the next delta\_t slots. We do not need to extract every piece of information. In experiments with the simplest AE, even the information from 30 slots was **difficult to compress** into a 15-dimensional latent variable z, while an observation containing just 10 fully utilized slots was already very **difficult to train**. We would still prefer to keep the feature representation of a single base station within five dimensions.

This led us to investigate VAEs and some of their later variants. As summarized in the previous section, a VAE compresses input x into a tensor composed of **Gaussian noise** so that it can perform its original task: generating many data points similar to the training set from randomly sampled tensors z, thereby enlarging the dataset. In other words, current VAE development focuses mainly on producing a powerful generator G, not on improving encoder E. A VAE also has no need to minimize the dimension of z because compression is not its purpose; it aims to provide a method for generating target data from noise. In the VAE code I reviewed, z was always high-dimensional because otherwise G's generative ability was difficult to maintain. A high-dimensional z also does not greatly hinder use of G, because it merely requires generating more random numbers. Given the VAE's design and application scenarios, I have little hope that it can handle BECEC.

There is also no fundamental difference between a VAE and an AE, apart from the fact that VAEs are usually applied to image problems and use fully convolutional network structures. For an observation such as BECEC's, where convolution is not applicable, a custom fully connected VAE would be identical to an ordinary AE except that E produces n groups of {μ,σ}\{\mu,\sigma\}{μ,σ}. Thus, aside from introducing uncertainty to increase G's robustness, a VAE does not help train E. Based on this theoretical analysis, using an AE or a VAE for BECEC would have much the same result.

### The Input Distribution of the Observation

We have discussed the drawbacks of AEs and the experimental difficulty of using them in BECEC. We can now analyze more carefully why these problems occur.

First, consider the neural network's input. A BECEC observation consists of M base-station states and n\_tasks task states. Each task has only three state variables, u0u\_0u0​, α\alphaα, and www, while a base station has state information for delta\_t slots. The principal cause of the observation's excessive dimensionality is therefore the **base-station information**, which we want to compress. Our plan is to train a shared encoder that takes data from delta\_t slots and outputs no more than five features as the state of one base station in the observation.

[RL\_with\_encoder omitted: unsupported source image]

We therefore need to analyze the remaining CPU resources of each base station over delta\_t slots. The state designed in the BECEC paper included the resource price for each slot, but because that price is calculated directly from the remaining CPU resources, the two are duplicate information in practice; **only the remaining resources need to be retained**. Consider how resources in a new slot are updated:

1. Generate a random number in [0.5, 1.25] representing the fraction of total resources required by tasks in the new slot.
2. Turn the portion above 100% into outsourced tasks and have base stations below 80% utilization assist with them.

There is **no relationship** between resource utilization in old and new slots. The AE's training data is essentially delta\_t random values sampled from [0.5, 1] \* Capacity. Each base station's Capacity is fixed, so the AE is being asked to compress a sequence of samples from a **uniform distribution**. About one third of the values merely equal Capacity. Even when incoming outsourced tasks are assigned, the character of these slots changes little; only the proportion equal to Capacity increases.

We can analyze the entropy of this data. More than one third of the values are fixed at Capacity, so that portion has zero entropy. The remaining two thirds come from a uniform distribution, so their entropy can be regarded as **two thirds of the entropy of the uniform distribution**. It is unsurprising that an AE cannot compress the data effectively: it is simply noise with one third of its values fixed. A VAE turns input data into a tensor of Gaussian noise and then reconstructs the original data from that tensor. In BECEC, that means **compressing approximately uniform noise into Gaussian noise**, which is plainly infeasible. Even replacing the fully connected layers with NLP methods would not make me expect a VAE to train successfully.

While carrying out this analysis, I suddenly understood why BECEC's RL fails to learn well: the same excessive-entropy problem is responsible. Most of the observation consists of M\*delta\_t random numbers. State transitions are also overly random, and a **critic learns changes in state** through TD error. If consecutive states have too little continuity, it is easy to see why the critic cannot learn. The **actor does not face this problem**, because it needs to consider only the effect of the current environmental state. This explains why the actor's loss curve appears normal while the critic remains highly unstable. Perhaps the critic should focus more on immediate returns.

We have further evidence that the critic failed because **environmental updates were too random**. In our September experiments, RL beat the heuristic algorithm only after both the number of base stations and the length of delta\_t were reduced substantially, although the heuristic performed better when both used assistance. In October, we restored delta\_t to 30 without changing the number of base stations, and RL performance collapsed to roughly that of a random policy. When delta\_t is small, **many slots become fully allocated**, creating a strong **correlation** between consecutive state updates. For example, if the actor assigns a task to BS0, that base station's state may become almost entirely Capacity. If the actor assigns a task to an incorrect, fully loaded BS3, that base station immediately drops the task. Actions strongly influence state updates in this environment, so the critic can learn to some extent. When delta\_t is large, however, delivering a task merely **selects a few values among hundreds of random numbers and changes them to Capacity**. Consecutive state updates still appear almost unrelated to the action.

At this point, I realized another problem. The system schedules only after accumulating n\_tasks tasks, and it samples an observation only then. Consequently, the relationship between consecutive states can be either strong or weak. If the system takes a long time to accumulate enough tasks, the states may be separated by more than delta\_t slots and therefore be **completely unrelated**. This method of collecting observations creates another substantial challenge for critic training.

Problems now identified with the critic:

1. The critic network underfits.
2. The environment is so random that state transitions cannot be learned.
3. Each state is sampled only after n\_tasks tasks have accumulated, so two states may themselves be completely unrelated.
