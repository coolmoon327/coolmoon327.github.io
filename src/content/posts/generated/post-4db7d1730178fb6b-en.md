---
title: "Information Theory for Wireless Systems: Entropy, Capacity, and Coding"
date: "2022-10-23"
description: "A structured path from entropy and mutual information to channel capacity and practical coding ideas for wireless systems."
tags: ["information-theory","channel-capacity","coding-theory","wireless-communications"]
categories: ["Wireless and Networks"]
locale: "en"
slug: "information-theory-for-wireless-systems"
sourceId: "post-4db7d1730178fb6b"
translationKey: "post-4db7d1730178fb6b"
generated: true
draft: false
math: true
---


Information theory answers two questions that recur throughout wireless-system design: **how compactly can a source be represented, and how rapidly can its information be conveyed with a prescribed reliability?** It does not prescribe a waveform, code, or scheduler. Instead, it supplies limits against which those designs can be judged.

The useful path is short: uncertainty becomes entropy; the reduction of uncertainty across an observation becomes mutual information; maximizing mutual information defines channel capacity; coding turns those asymptotic limits into an engineering problem.

## From uncertainty to mutual information

For a discrete random variable $X$ with probability mass function $p(x)$, entropy in bits is

$$
H(X)=-\sum_{x}p(x)\log_2 p(x).
$$

Entropy is an average, not the information carried by every individual outcome. A deterministic source has zero entropy, while a uniform distribution over a fixed finite alphabet has the largest entropy. For a source with memory, the relevant quantity is its **entropy rate**, because correlations make the average information per new symbol smaller than the entropy of an isolated symbol.

Side information changes uncertainty through the chain rule:

$$
H(X,Y)=H(X)+H(Y\mid X), \qquad H(X\mid Y)\le H(X).
$$

The second inequality is the correct general statement: conditioning cannot increase discrete entropy on average. It does **not** imply $H(X\mid Y)\le H(Y)$. Mutual information measures the average reduction in uncertainty:

$$
I(X;Y)=H(X)-H(X\mid Y)=\sum_{x,y}p(x,y)\log_2\frac{p(x,y)}{p(x)p(y)}.
$$

This is also the Kullback–Leibler divergence between the joint distribution and the product of its marginals. KL divergence is nonnegative, but it is not a metric: it is asymmetric and does not obey the triangle inequality.

If $X\to Y\to Z$ is a Markov chain, post-processing obeys the data-processing inequality:

$$
I(X;Z)\le I(X;Y).
$$

This says that processing cannot create information about $X$ that was absent from $Y$. It does not say that every transformation must lose information; equality is possible when the transformation preserves everything in $Y$ that is relevant to $X$.

## Compression: entropy is a limit, not a file size

For a stationary memoryless source, lossless source coding can make the expected description rate approach the entropy:

$$
R_{\mathrm{source}}\ge H(X).
$$

Huffman coding is optimal among prefix codes for a known symbol distribution, but arithmetic coding and modern entropy coders can approach the limit more closely over long sequences. The theorem is asymptotic: finite blocks, model mismatch, framing, and random access all add overhead.

Lossy compression replaces exact reconstruction with an agreed distortion measure. The rate–distortion function asks for the least mutual information between the source and its reconstruction that satisfies an average distortion constraint. The choice of distortion measure is therefore part of the system specification; a numerically small error need not correspond to a perceptually or operationally small error.

## Transmission: capacity is an optimization over inputs

For a memoryless channel $p(y\mid x)$, capacity is

$$
C=\max_{p(x)} I(X;Y).
$$

Capacity belongs to the channel model and its constraints, not to one arbitrary input distribution. The noisy-channel coding theorem states that rates below $C$ can achieve an error probability approaching zero as blocklength grows, whereas reliable communication above $C$ is impossible under the same model. This is an existence result; it does not promise a practical finite-length code with zero error.

For a real discrete-time additive white Gaussian noise channel with average signal power $P$ and noise variance $N$, the capacity per real channel use is

$$
C=\frac{1}{2}\log_2\!\left(1+\frac{P}{N}\right).
$$

The familiar bandwidth form follows after accounting for the number of signal dimensions per second. The formula exposes a central wireless trade-off: power, bandwidth, coding rate, and latency can compensate for one another only within the assumptions of the channel model.

In a multiuser channel, a single scalar capacity is usually replaced by a **capacity region**. For example, a two-user multiple-access channel constrains each user's rate and their sum. Treating the other user as noise can be a valid receiver strategy, but successive interference cancellation or joint decoding may reach rate pairs that this simpler strategy cannot.

## Coding turns a limit into a design

A binary linear block code maps $k$ information bits to an $n$-bit codeword. Its rate is $k/n$, and a parity-check matrix $H$ defines valid codewords through

$$
Hc^{\mathsf T}=0 \quad \text{over } \mathrm{GF}(2).
$$

Adding structured redundancy lowers the raw code rate but lets a decoder distinguish likely transmitted codewords from noisy observations. Minimum distance explains bounded-distance decoding for short algebraic codes; sparse factor graphs enable iterative decoding for LDPC codes; successive-cancellation ideas underlie polar coding. Modern wireless standards select codes by use case rather than declaring one family universally best.

A useful coding study therefore reports more than bit-error rate. It should state blocklength, information length, decoder, iteration or list limits, modulation, channel model, latency, and energy per information bit. Comparing curves without these conditions can make two fundamentally different operating points look equivalent.

## A practical reasoning loop

For a wireless link, information theory is most useful as a disciplined sequence:

1. Define the source, channel, side information, and operational constraints.
2. Choose the performance quantity: lossless rate, distortion, outage, error probability, or a multiuser rate region.
3. Compute or bound mutual information under an explicit input distribution.
4. Optimize the distribution or resource allocation only over physically admissible choices.
5. Select a finite-length code and decoder, then measure the gap to the bound.
6. Recheck assumptions when mobility, fading uncertainty, short packets, interference, or security changes the model.

The resulting bound is neither a simulation result nor a product specification. It is a reference point: it separates limitations imposed by the model from losses introduced by estimation, signaling, algorithms, and implementation.

## Further reading

- [Claude Shannon, “A Mathematical Theory of Communication”](https://doi.org/10.1002/j.1538-7305.1948.tb01338.x)
- [Thomas Cover’s selected papers on network information theory](https://isl.stanford.edu/~cover/network-info.html)
- [3GPP TS 38.212: NR multiplexing and channel coding](https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3214)
