---
title: "Information Theory and Coding Theory"
date: "2022-10-23"
description: "Study notes on entropy, source and channel coding, rate-distortion theory, block codes, LDPC codes, and network information theory."
tags: ["information-theory","coding-theory"]
categories: ["Study Notes"]
locale: "en"
slug: "information-theory-and-coding-notes"
sourceId: "post-4db7d1730178fb6b"
translationKey: "post-4db7d1730178fb6b"
generated: true
draft: false
---
# I. Introduction

- Three fundamental elements of the objective world: matter, energy, and information
- Information refers to the states and laws governing the motion of various entities (i.e., 'knowledge' about their motion)
- Quantitatively, information equals the reduction in 'uncertainty' before and after communication
- Information theory utilizes ** mathematical statistical methods ** to study information
- Characterize communication systems: efficiency, reliability, and security

  - Information compression   Information error correction   Information encryption
  - Enhance ** efficiency ** ——  Source coding (the more ** independent ** the different code symbols, the better; high correlation leads to redundancy)
    - Obtain more information per unit time  ——  Coding efficiency  =  Effective number of code symbols  /  Total number of code symbols
  - Enhance ** reliability ** ——  Channel coding (the more ** correlated ** the different code symbols, the better; correlation enables error correction when errors occur)
    - Add parity bits to reduce the bit error rate (as long as there is noise, the bit error rate cannot reach 0）
    - Validity and reliability often conflict; in practice, a balance must be pursued
  - Enhance ** security ** ——  encryption coding
- 1948 Shannon's   "A Mathematical Theory of Communication"  ——  emergence of information theory

  - Clarify that the object transmitted by communication systems is information
  - Provide a scientific quantitative description of information
  - Propose the concept of information entropy (entropy is a statistical measure)
- Three types of information: syntactic, semantic, and pragmatic
- The fundamental problem of communication: to reproduce at one point exactly or approximately the message selected at another point
- Information  -  message  -  signal
- Information theory addresses two fundamental problems in communication theory

  - The value of critical data compression (entropy)
  - The value of critical communication transmission rate (channel capacity)
- Source (modeled as a probability space)

  - Discrete source
  - Continuous source
    - Discrete-time continuous source
    - Waveform source or analog source
  - Source encoder: converts source messages into symbols to improve transmission efficiency
  - Channel encoder: adds redundant symbols to source-encoded symbols to enhance transmission reliability
  - Modulator: Converts the symbols output by the encoder into a form suitable for channel transmission
- Channel (Transition Probability Modeling)

  - Noiseless / Noisy Channel
    - Additive, Multiplicative AWGN
  - Discrete / Discrete-Time Continuous / Waveform Channel
  - Memoryless / Memory Channel
- Shannon Information Theory

  - Narrow-Sense Information Theory (This Course): Source, channel, and coding issues; the core is three coding theorems
    - The measurement of source information is the primary issue in information theory
    - Lossless Coding Theorem (Shannon's First Theorem)
    - Regarding channel capacity and reliable information transmission  ——  Noisy Channel Coding Theorem (Shannon's Second Theorem)
    - Information Rate-Distortion Theory  ——  Lossy Source Coding Theorem (Shannon's Third Theorem)
  - Generalized Information Theory: Includes all aspects related to signal processing
- Shannon's Three Major Theorems

# II. Information Content and Entropy

## Average Self-Information  ——  Entropy

- The average self-information of a source: also known as the entropy of the source  X , source entropy characterizes the overall features of the source ** on average**
  - **Information Content** I(xi)=log(1p(xi))=−log(p(xi))I(x\_i)=log(\frac{1}{p(x\_i)})=-log(p(x\_i))I(xi​)=log(p(xi​)1​)=−log(p(xi​))
    - Smaller probability implies greater uncertainty
    - The numerical value indicates how many  bit  are needed to describe that symbol
    - To find the information content of an event, one calculates its probability and then takes −log-log−log
  - **Information entropy** H(X)=E(I(X))=∑p(xi)I(xi)=−∑p(xi)log(p(xi))H(X)=E(I(X))=\sum p(x\_i)I(x\_i)=-\sum p(x\_i)log(p(x\_i))H(X)=E(I(X))=∑p(xi​)I(xi​)=−∑p(xi​)log(p(xi​))
    - Entropy represents the average uncertainty / of the source, i.e., the average information amount
    - The magnitude indicates the number of  bit  for the average code length
    - If a source is deterministic with a single outcome  p(xi)=1p(x\_i)=1p(xi​)=1 , then the entropy is 0
    - **Entropy is maximized under equal probability ** (the concave property of entropy)
- The uniqueness theorem of information entropy (which proves that the logarithm is the unique mathematical representation of entropy)
  - Continuity
  - Monotonically increasing under equal probability
  - Additivity
- Unit of entropy: bit/ symbol (or  bit/ symbol-time)
  - This indicates that, on average, transmitting this amount of uncertainty requires  n   bit  to encode a single symbol
  - That is,  2n2^n2n  states are needed to describe this magnitude of uncertainty
  - Information rate (bit/s) can be calculated by dividing entropy by the average generation time per symbol
- When  H(x)H(x)H(x)  is not followed by a distribution, it indicates that an entropy (fixed to two terms) is represented using parameter  xxx , for example:H(D)=−Dlog2D−(1−D)log2(1−D)H(D)=-Dlog\_2D-(1-D)log\_2(1-D)H(D)=−Dlog2​D−(1−D)log2​(1−D)

## Extension of entropy

- Conditional entropy
  - Conditional self-information I(xi∣yj)=−log(p(xi∣yj))I(x\_i|y\_j)=-log(p(x\_i|y\_j))I(xi​∣yj​)=−log(p(xi​∣yj​))
  - H(X∣yj)=−∑ip(xi∣yj)log(p(xi∣yj))H(X|y\_j)=-\sum\_i p(x\_i|y\_j)log(p(x\_i|y\_j))H(X∣yj​)=−∑i​p(xi​∣yj​)log(p(xi​∣yj​))
  - H(X∣Y)=−∑i,jp(xi,yj)log(p(xi∣yj))H(X|Y)=-\sum\_{i,j} p(x\_i,y\_j)log(p(x\_i|y\_j))H(X∣Y)=−∑i,j​p(xi​,yj​)log(p(xi​∣yj​))
    - Note that  p  here refers to joint probability, not conditional probability
    - H(X∣Y)=∑jp(yj)H(X∣yj)=−∑jp(yj)p(xi∣yj)log(p(xi∣yj))H(X|Y) = \sum\_jp(y\_j)H(X|y\_j) = -\sum\_jp(y\_j)p(x\_i|y\_j)log(p(x\_i|y\_j))H(X∣Y)=∑j​p(yj​)H(X∣yj​)=−∑j​p(yj​)p(xi​∣yj​)log(p(xi​∣yj​))
  - H(X+Y∣X)=H(Y∣X)H(X+Y|X) = H(Y|X)H(X+Y∣X)=H(Y∣X)
    - XXX、YYY When independent,H(Y∣X)=H(Y)H(Y|X) = H(Y)H(Y∣X)=H(Y)，H(X+Y∣X)=H(Y)H(X+Y|X) = H(Y)H(X+Y∣X)=H(Y)
  - H(X∣Y)≤min(H(X),H(Y))H(X|Y) \leq min(H(X), H(Y))H(X∣Y)≤min(H(X),H(Y))
- Joint Entropy (Co-entropy)
  - Joint Self-Information I(xi,yj)=−log(p(xi,yj))I(x\_i,y\_j)=-log(p(x\_i,y\_j))I(xi​,yj​)=−log(p(xi​,yj​))
  - H(X,Y)=−∑i,jp(xi,yj)log(p(xi,yj))H(X,Y)=-\sum\_{i,j} p(x\_i,y\_j)log(p(x\_i,y\_j))H(X,Y)=−∑i,j​p(xi​,yj​)log(p(xi​,yj​))
    - The only difference from conditional entropy lies in the self-information component
  - H(X+Y,X)=H(X)+H(Y)H(X+Y,X) = H(X) + H(Y)H(X+Y,X)=H(X)+H(Y)
  - H(X,Y)≤H(X)+H(Y)H(X,Y) \leq H(X) + H(Y)H(X,Y)≤H(X)+H(Y)
    - XXX、YYY Equality holds when independent
  - H(X,Y)≥max(H(X),H(Y))H(X,Y) \geq max(H(X),H(Y))H(X,Y)≥max(H(X),H(Y))
- Joint Entropy, Entropy, Conditional Entropy
  - H(XY)=H(X)+H(Y∣X)=H(Y)+H(X∣Y)H(XY) = H(X) + H(Y|X) = H(Y) + H(X|Y)H(XY)=H(X)+H(Y∣X)=H(Y)+H(X∣Y)
    - Comparing with the formula for joint probability, it essentially involves changing multiplication to addition (the effect of logarithms)
  - H(XYZ)=H(X)+H(Y∣X)+H(Z∣XY)H(XYZ)=H(X)+H(Y|X)+H(Z|XY)H(XYZ)=H(X)+H(Y∣X)+H(Z∣XY)
  - H(XY∣Z)=H(X∣Z)+H(Y∣XZ)H(XY|Z) = H(X|Z) + H(Y|XZ)H(XY∣Z)=H(X∣Z)+H(Y∣XZ)
    - For the proof of the chain rule, refer to  2.13(b); expand directly using the definition

## Properties of Entropy

- Non-negativity
- Symmetry: The order of variables does not affect the value of entropy
- Extremality: When probabilities are equal,H(X)max=log2NH(X)\_{max}=log\_2NH(X)max​=log2​N
- Conditional entropy is no greater than **any individual** source entropy, with equality when the sources are independent
  - The more conditions applied to conditional entropy, the smaller the entropy value
- The joint entropy is no greater than the sum of all ** individual ** source entropies **, with equality holding when they are mutually independent **
- Extensibility: When newly added messages in the source have low probability, entropy remains unchanged
- Determinacy: If any probability component is  1 and the rest are 0, then entropy is 0
- Additivity

## Relative Entropy and Conditional Relative Entropy

- Cross-Entropy H(P,Q)=−∑xP(x)logQ(x)H(P,Q)=-\sum\_{x} P(x)logQ(x)H(P,Q)=−∑x​P(x)logQ(x)
- Relative Entropy (KL divergence KL ) D(P∣∣Q)=∑xP(x)logP(x)Q(x)D(P||Q)=\sum\_xP(x)log\frac{P(x)}{Q(x)}D(P∣∣Q)=∑x​P(x)logQ(x)P(x)​
  - The relative entropy is equivalent to the difference in information entropy between two probability distributions (the distance between probability distributions).
  - Relative entropy measures the inefficiency when the true distribution is  P  and the assumed distribution is  Q 
    - If the true distribution is  P and the used distribution is  Q, then  H(P)+D(P∣∣Q)H(P)+D(P||Q)H(P)+D(P∣∣Q)  bits are required to describe this random variable.
    - Relative entropy is the amount of information required to describe Q when using P 
  - Relative entropy is asymmetric and does not satisfy the triangle inequality. D(P∣∣Q)≠D(Q∣∣P)D(P||Q) \neq D(Q||P)D(P∣∣Q)=D(Q∣∣P)
- Conditional relative entropy D(P(y∣x)∣∣Q(y∣x))=∑xp(x)∑yP(y∣x)logP(y∣x)Q(y∣x)D(P(y|x)||Q(y|x))=\sum\_xp(x)\sum\_yP(y|x)log\frac{P(y|x)}{Q(y|x)}D(P(y∣x)∣∣Q(y∣x))=∑x​p(x)∑y​P(y∣x)logQ(y∣x)P(y∣x)​
  - Joint relative entropy  =  Relative entropy  +  Conditional relative entropy

## Mutual information (interaction entropy)

- Information content of mutual information I(xi;yj)=I(xi)−I(xi∣yj)=log2p(xi∣yj)p(xi)I(x\_i;y\_j)=I(x\_i)-I(x\_i|y\_j)=log\_2\frac{p(x\_i|y\_j)}{p(x\_i)}I(xi​;yj​)=I(xi​)−I(xi​∣yj​)=log2​p(xi​)p(xi​∣yj​)​

  - Information before observing the output  -  Information after observing the output
- $ I(X;y\_j)=\sum\_ip(x\_i|y\_j)log\_2\frac{p(x\_i|y\_j)}{p(x\_i)} $

  - Given yjy\_jyj​ the information about XXX 
- Average mutual information I(X;Y)I(X;Y)I(X;Y)

  - Y For X：I(X;Y)=∑i∑jp(xi,yj)I(xi;yj)=∑i∑jp(xi,yj)log2p(xi∣yj)p(xi)I(X;Y)=\sum\_i\sum\_jp(x\_i,y\_j)I(x\_i;y\_j)=\sum\_i\sum\_jp(x\_i,y\_j)log\_2\frac{p(x\_i|y\_j)}{p(x\_i)}I(X;Y)=∑i​∑j​p(xi​,yj​)I(xi​;yj​)=∑i​∑j​p(xi​,yj​)log2​p(xi​)p(xi​∣yj​)​

    - Study the uncertainty of the source before and after observing the output
    - Given YYY when, regarding XXX the amount of information
    - I(X;Y)=D(p(x,y)∣∣p(x)p(y))I(X;Y) = D(p(x,y)||p(x)p(y))I(X;Y)=D(p(x,y)∣∣p(x)p(y))
  - X For Y：I(Y;X)=∑i∑jp(xi,yj)I(yj;xi)=∑i∑jp(xi,yj)log2p(yj∣xi)p(yj)I(Y;X)=\sum\_i\sum\_jp(x\_i,y\_j)I(y\_j;x\_i)=\sum\_i\sum\_jp(x\_i,y\_j)log\_2\frac{p(y\_j|x\_i)}{p(y\_j)}I(Y;X)=∑i​∑j​p(xi​,yj​)I(yj​;xi​)=∑i​∑j​p(xi​,yj​)log2​p(yj​)p(yj​∣xi​)​

    - Study the uncertainty of the destination before and after observing the input
  - **They are equal **, indicating how much information is transmitted by the communication system (the reduction in uncertainty after passing through the system)
  - If  I(X;Y)=I(X;Z)I(X;Y)=I(X;Z)I(X;Y)=I(X;Z), it indicates that the mapping of  Y→ZY \rightarrow ZY→Z  incurs no information loss

    - According to the data processing inequality, any processing of data cannot increase entropy; there are only two cases: loss or no loss
- I(X;Y)=H(X)−H(X∣Y)I(X;Y)=H(X)-H(X|Y)I(X;Y)=H(X)−H(X∣Y)

  - When the channel quality is excellent, it will not exceed the information entropy of the input itself.
  - When the channel quality is extremely poor, no information is transmitted, and the conditional entropy equals the input entropy.
  - Comparing with the formula for joint entropy, we find that the right-hand side of the joint entropy formula involves addition, whereas here it involves subtraction.
- I(X;Y)=H(X)+H(Y)−H(XY)I(X;Y)=H(X)+H(Y)-H(XY)I(X;Y)=H(X)+H(Y)−H(XY)

  - H(X)+H(Y)H(X)+H(Y)H(X)+H(Y) The degree of uncertainty of the entire system before communication
  - H(XY)H(XY)H(XY) The degree of uncertainty of the entire system after communication
  - **It is 0 when the two variables are independent and H(X)H(X)H(X) when they are fully correlated.**
- Property

  - Non-negativity
  - Symmetry
  - Extremality
    - I(X;Y)≤H(X)I(X;Y) \leq H(X)I(X;Y)≤H(X)
    - I(X;Y)≤H(Y)I(X;Y) \leq H(Y)I(X;Y)≤H(Y)
  - Additivity
- Multivariate Conditional Mutual Information (Chain Rule)

  - I(X;Y∣Z)=H(X∣Z)−H(X∣Y,Z)=H(Y∣Z)−H(Y∣X,Z)=∑x∑y∑zp(x,y,z)logp(x∣y,z)p(x∣z)I(X;Y|Z)=H(X|Z)-H(X|Y,Z)=H(Y|Z)-H(Y|X,Z)=\sum\_x\sum\_y\sum\_zp(x,y,z)log\frac{p(x|y,z)}{p(x|z)}I(X;Y∣Z)=H(X∣Z)−H(X∣Y,Z)=H(Y∣Z)−H(Y∣X,Z)=∑x​∑y​∑z​p(x,y,z)logp(x∣z)p(x∣y,z)​
  - I(X;YZ)=H(X)−H(X∣YZ)=H(YZ)−H(YZ∣X)I(X;YZ)=H(X)-H(X|YZ)=H(YZ)-H(YZ|X)I(X;YZ)=H(X)−H(X∣YZ)=H(YZ)−H(YZ∣X)
  - I(X;YZ)=I(X;Y)+I(X;Z∣Y)=I(X;Z)+I(X;Y∣Z)I(X;YZ)=I(X;Y)+I(X;Z|Y)=I(X;Z)+I(X;Y|Z)I(X;YZ)=I(X;Y)+I(X;Z∣Y)=I(X;Z)+I(X;Y∣Z)
  - I(XY;Z)=I(X;Z∣Y)+I(Z;Y)I(XY;Z)=I(X;Z|Y)+I(Z;Y)I(XY;Z)=I(X;Z∣Y)+I(Z;Y)
- Other Computational Correlations

  - $ \begin{aligned} I\left(X\_{1}, X\_{2} ; Y\right) &=I\left(X\_{1} ; Y\right)+I\left(X\_{2} ; Y \mid X\_{1}\right) = I\left(X\_{2} ; Y\right)+I\left(X\_{1} ; Y \mid X\_{2}\right) \end{aligned} $
  - I(X;X)=H(X)I(X;X)=H(X)I(X;X)=H(X)

## Information Inequalities

- Basic Inequality:lnx≤x−1ln x \leq x-1lnx≤x−1

  - When extracting the content from  log , you can use log2A≤log2e∗(A−1)log\_2 A \leq log\_2e\*(A-1)log2​A≤log2​e∗(A−1)
- Jensen Inequality: f  is a convex function,Ef(x)≥f(EX)Ef(x)\geq f(EX)Ef(x)≥f(EX)

  - Used to extract convex operations from within the summation symbol, for example ∑ipilog2qi≤log2∑ipiqi\sum\_{i}p\_ilog\_2q\_i \leq log\_2\sum\_ip\_iq\_i∑i​pi​log2​qi​≤log2​∑i​pi​qi​
- Information Divergence Inequality:D(P∣∣Q)≥0D(P||Q)\geq 0D(P∣∣Q)≥0

  - Equality holds when the distributions are identical
  - It can be deduced that I(X;Y)≥0I(X;Y) \geq 0I(X;Y)≥0
  - To determine the magnitude relationship between two entropies  H(X)H(X)H(X)、H(Y)H(Y)H(Y) , one may consider using I(X;Y)=H(X)−H(X∣Y)>0I(X;Y)=H(X)-H(X|Y)>0I(X;Y)=H(X)−H(X∣Y)>0
- Maximum Entropy Theorem:H(X)≤log∣X∣H(X) \leq log|X|H(X)≤log∣X∣
- **Fano The inequality **：Pe≥H(X∣Y)−1log(∣X∣−1)Pe \geq \frac{H(X|Y)-1}{log(|X|-1)}Pe≥log(∣X∣−1)H(X∣Y)−1​（∣X∣|X|∣X∣  is the dimension of  X )

  - which addresses the relationship between the conditional entropy at the receiver and the bit error rate,Pe=P(X^≠X)P\_e=P(\hat{X} \neq X)Pe​=P(X^=X)
  - H(X∣Y)H(X|Y)H(X∣Y) the smaller it is, the smaller the bit error rate  Pe  of the communication system
    - For  0  representing the ability to completely infer the input after seeing the output, then Pe = 0
  - H(Pe)+Pelog⁡(∣X∣−1)≥H(X∣Y)H\left(P\_{e}\right)+P\_{e} \log (|X|-1) \geq H(X \mid Y)H(Pe​)+Pe​log(∣X∣−1)≥H(X∣Y)
    - H(Pe)H\left(P\_{e}\right)H(Pe​) is the uncertainty of the bit error rate
- Triangle Inequality

  - H(X∣Y)+H(Y∣Z)≥H(X∣Z)H(X \mid Y)+H(Y \mid Z) \geq H(X \mid Z)H(X∣Y)+H(Y∣Z)≥H(X∣Z)

    - The more conditions used, the smaller the entropy; the more variables combined, the larger the entropy
  - H(X∣Y)/H(XY)+H(Y∣Z)/H(YZ)≥H(X∣Z)/H(XZ)H(X \mid Y) / H(X Y)+H(Y \mid Z) / H(Y Z) \geq H(X \mid Z) / H(X Z)H(X∣Y)/H(XY)+H(Y∣Z)/H(YZ)≥H(X∣Z)/H(XZ)

    - Multiply the denominator to combine
    - ab≥a−cb−c\frac{a}{b} \geq \frac{a-c}{b-c}ba​≥b−ca−c​ or aa+c≥bb+c∣a>b\frac{a}{a+c} \geq \frac{b}{b+c}|\_{a>b}a+ca​≥b+cb​∣a>b​

## Relative Entropy and Convexity of Entropy

- The relative entropy  D(p∥q)D(p \| q)D(p∥q)  is a convex function with respect to the probability distribution pair  (p,q)(\mathrm{p}, \mathrm{q})(p,q) 
- The entropy  H(p)\mathrm{H}(\mathrm{p})H(p)  is a concave function
- Mutual information  I(xi;yj)I(x\_i;y\_j)I(xi​;yj​)  is a concave function of the source  p(xi)p(x\_i)p(xi​)  and a convex function of the channel  p(yi∣xi)p(y\_i|x\_i)p(yi​∣xi​)   —— ** Channel capacity ** and ** distortion function**
  - For a fixed channel  p(yi∣xi)p(y\_i|x\_i)p(yi​∣xi​), varying the input  p(xi)p(x\_i)p(xi​), if mutual information has an upper bound (i.e., there exists an input that achieves the maximum value), then the function of mutual information with respect to the source  p(xi)p(x\_i)p(xi​)  is concave (and vice versa)
  - In other words, when concave, there must exist a signal form that maximizes the communication capacity of the channel (i.e., maximizes mutual information)
- Addressing the problems of ** compression limit ** and ** transmission limit **

## Principle of Non-Increasing Information

- Theorem :  If  $ X \rightarrow Y \rightarrow Z $, then

  I(X;Y)≥I(X;Z)I(X;Y)≥I(X;Y∣Z)\begin{array}{l}
  I(X ; Y) \geq I(X ; Z) \\
  I(X ; Y) \geq I(X ; Y \mid Z)
  \end{array}
  I(X;Y)≥I(X;Z)I(X;Y)≥I(X;Y∣Z)​
- Each operation necessarily reduces the information content.

  - No superior data processing operation can improve the inference derived from the data!
  - Any processing of observed data results in information loss and absolutely cannot increase information!
- Data processing transforms signals, data, or messages into more useful forms, but it absolutely cannot and does not create new information.

## Entropy of Continuous Random Variables

- H(X)=Hc(X)−logΔH(X) = H\_c(X) - log\DeltaH(X)=Hc​(X)−logΔ
  - The entropy of a continuous random variable is ** infinite **, so differential entropy is used for description.
  - The first term is called differential entropy, and the second term is called absolute entropy.
- Differential Entropy
  - $H\_{c}(X)=-\int\_{-\infty}^{\infty} f(x) \log f(x) d x $
  - Generally, only differential entropy is considered, because the subsequent  Δ\DeltaΔ  is related to the sampling rate / precision; the finer the discretization, the higher the entropy of the random variable, which can even approach infinity.
  - Differential entropy is not necessarily non-negative!
- Joint entropy
  - Hc(XY)=−∬R2p(xy)log⁡2p(xy)dxdyH\_{c}(X Y)=-\iint\_{R^{2}} p(x y) \log \_{2} p(x y) d x d yHc​(XY)=−∬R2​p(xy)log2​p(xy)dxdy
- Conditional entropy
  - Hc(Y/X)=−∬R2p(xy)log⁡2p(y/x)dxdyH\_{c}(Y / X)=-\iint\_{R^{2}} p(x y) \log \_{2} p(y / x) d x d yHc​(Y/X)=−∬R2​p(xy)log2​p(y/x)dxdy
  - Hc(X/Y)=−∬R2p(xy)log⁡2p(x/y)dxdyH\_{c}(X / Y)=-\iint\_{R^{2}} p(x y) \log \_{2} p(x / y) d x d yHc​(X/Y)=−∬R2​p(xy)log2​p(x/y)dxdy
- The entropy of a uniform distribution depends only on the interval, the entropy of a Gaussian distribution depends only on the variance, and the entropy of an exponential distribution depends only on the mean.
  - The entropy of a Gaussian distribution is maximized and is widely used (see the expression for the Gaussian distribution and the calculation method for  I(X;Y)=−12ln(1−ρ2)I(X;Y)=-\frac{1}{2}ln(1-\rho^2)I(X;Y)=−21​ln(1−ρ2)  in the book). P36）
- The **maximum entropy theorem** for continuous sources (solved using the Lagrange multiplier method)
  - For a continuous source with limited ** peak power **, the uniform distribution  —— ** achieves maximum entropy **.
    - Theorem  1: If the peak value of a continuous random variable  $ X $  does not exceed  $ M $, then the differential entropy  $ X $  of  h≤log⁡2Mh \leq \log 2 Mh≤log2M  satisfies equality if and only if  $ p(x) $  follows a uniform distribution.
  - For a continuous source with limited ** average power **, the Gaussian distribution  —— ** achieves maximum entropy **.
    - Given the entropy power, the entropy value can be directly calculated (see book). P40）
  - The maximum entropy theorem for continuous sources with mean ** and variance ** is the exponential distribution  —— **, which has maximum entropy **
- Average mutual information
  - $I(X ; Y)=E \log \frac{f(Y \mid X)}{f(Y)}=E \log \frac{f(X, Y)}{f(X) f(Y)} $
    - I(x;y)=logPXY(x,y)PX(x)PY(y)I(x;y) = log\frac{P\_{XY}(x,y)}{P\_X(x)P\_Y(y)}I(x;y)=logPX​(x)PY​(y)PXY​(x,y)​ As in the discrete case
  - $ I(X ; Y)=H\_{c}(X)+H\_{c}(Y)-H\_{c}(X Y) $

## Entropy rate of a random process

- Entropy rate

  - H(X)=lim⁡n→∞1nH(X1,X2,…,Xn)H(X)=\lim \_{n \rightarrow \infty} \frac{1}{n} H\left(X\_{1}, X\_{2}, \ldots, X\_{n}\right)H(X)=limn→∞​n1​H(X1​,X2​,…,Xn​)
    - The right side is the joint entropy of random variables at  n  time instants
  - $ H^{\prime}(X)=\lim *{n \rightarrow x} H\left(X* \mid X\_{n-1}, X\_{n-2}, \ldots, X\_{1}\right) $
- For a discrete stationary source  —— , the probability distribution of each dimension is independent of the time origin

  - Two-dimensional stationary distribution $ p\left(x\_{i} x\_{i+1}\right)=p\left(\begin{array}{ll}x\_{j} x\_{j+1}\end{array}\right) $
  - $H\left(X\_{2} / X\_{1}\right) \leqslant H\_{2}(\bar{X}) \leqslant H(X) $
    - Average symbol entropy $ H\_{N}(\overline{X})=\frac{H\left(X\_{1} X\_{2} \cdots X\_{N}\right)}{N} $
    - Both conditional entropy and average symbol entropy are non-increasing functions with respect to  N  (HN≤HN−1H\_N \leq H\_{N-1}HN​≤HN−1​）
  - Limit entropy (limit information content) of a discrete stationary source **: **$ H(\mathrm{X})=\lim *{N \rightarrow \infty} H*(\bar{X})=H^{\prime}(\mathrm{X})=\lim *{N \rightarrow \infty} H\left(X* / X\_{1} X\_{2} \cdots X\_{N-1}\right) $
    - For a discrete stationary source, when considering dependencies of infinite length, the ** average ** symbol entropy and conditional entropy both non-increasingly converge uniformly to the information entropy ** (limiting entropy) of the stationary source **.
    - The limit entropy represents the average amount of information provided by each symbol emitted by a discrete stationary memory source. Accurate calculation is difficult; one can select a not-too-large  N  to compute its approximate value **.**。
- Discrete memory source  ——  Markov source

  - **Discriminate ** Markov source
    1. Completeness: $ \sum\_{a\_{k} \in A} p\left(a\_{k} | E\_{i}\right)=1 $ (independent of earlier states)
    2. Mutual exclusivity: $ p\left(s\_{l}=E\_{j} \quad | x\_{l}=a\_{k}, \quad s\_{l-1}=E\_{i}\right)=\left{\begin{array}{l}0 \ 1\end{array}\right. $ (the previous state and the emitted symbol ** uniquely ** determine the current state)
  - Homogeneous Markov chain: $ p\left(s\_{l}=E\_{j} | s\_{l-1}=E\_{i}\right)=p\left(E\_{j} | E\_{i}\right) $, independent of time  $ l $ 
  - mmm m-th order Markov source: At a certain moment  nnn, the probability of a symbol appearing depends only on the preceding  mmm  symbols; these preceding  mmm  symbols can be regarded as the state of the source at  nnn  moment.
  - The **limiting entropy** of an $ m $-th order Markov source, $ H\_{\infty} $, equals its $ m $-th order **conditional entropy**, denoted by $ H\_{m+1} $
- **Calculate the conditional entropy of the ** Markov source

  1. Assume state  $ E\_{i}=\left(a\_{k\_{1}} a\_{k\_{2}} \cdots a\_{k\_{m}}\right) $, where the source is in state $ E\_{i} $
  2. Write down the one-step transition probability $ p\left(E\_{j} | E\_{i}\right)$
  3. Solve for the steady-state probabilities $ p\left(E\_{i}\right)\left(i=1,2, \cdots, q^{m}\right) $

     - Construct the system of equations p(Ej)=∑i=1qmp(Ei)p(Ej∣Ei)(j=1,2,⋯ ,qm)p\left(E\_{j}\right)=\sum\_{i=1}^{q^{m}} p\left(E\_{i}\right) p\left(E\_{j} | E\_{i}\right) \quad\left(j=1,2, \cdots, q^{m}\right)p(Ej​)=∑i=1qm​p(Ei​)p(Ej​∣Ei​)(j=1,2,⋯,qm)
     - Subject to the conditions p(Ej)>0,∑j=1qmp(Ej)=1p\left(E\_{j}\right)>0, \quad \sum\_{j=1}^{q^{m}} p\left(E\_{j}\right)=1p(Ej​)>0,∑j=1qm​p(Ej​)=1
  4. $ \begin{aligned} H\_{\infty}=H\_{m+1} =-\sum\_{i=1}{q{m}} \sum\_{k=1}^{q} p\left(E\_{i}\right) p\left(a\_{k} | E\_{i}\right) \log p\left(a\_{k} | E\_{i}\right) =-\sum\_{i=1}{q{m}} p\left(E\_{i}\right) \sum\_{k=1}^{q} p\left(a\_{k} | E\_{i}\right) \log p\left(a\_{k} | E\_{i}\right) \end{aligned} $
  5. Solve for the probability distribution after reaching steady state $ p\left(a\_{k}\right)=\sum\_{i=1}{q{m}} p\left(E\_{i}\right) p\left(a\_{k} / E\_{i}\right) $

# III. Lossless Source Coding (Compression Limit)

​ The purpose of coding is to improve efficiency; pursuing efficiency means maximizing information / so that fewer symbols can be used for transmission.

​ The number of codewords must first exceed the number of source symbols, otherwise not all symbols can be represented.

​ **Compression-limited ** researches how to describe the uncertainty of a source with fewer codewords.

​ Source coding:L‾≥Hr(X)\overline{L} \geq H\_r(X)L≥Hr​(X)

## Overview of source coding

- Two main categories of source coding: lossless and lossy
  - Lossless coding: The entropy of ** remains unchanged before and after encoding.**
  - Lossy coding: Primarily targets continuous symbols, involving the rate-distortion function. R(D)
- Relative **rate** of entropy
  - The ratio of the actual information entropy of a source to the maximum entropy with the same symbol set.
  - $ \eta=\frac{H}{H\_{\max }} $
  - Redundancy of entropy  = 1 -  relative rate of entropy:$ r=1-\frac{H}{H\_{\max }}=\frac{H\_{\max }-H}{H\_{\max }} $
- Fixed-length codes and variable-length codes
- Codeword, symbol, sequence of symbols
  - A symbol sequence of length LLL -> a **codeword** consisting of NNN **code symbols**
  - There are  DDD  types of symbols, with the number of bits per symbol being logDlogDlogD
  - Number of bits in the codeword NlogDNlogDNlogD
  - Average information entropy per symbol H(U)H(U)H(U)
  - Information entropy of the symbol sequence LH(U)LH(U)LH(U)
  - NlogD>=LH(U)NlogD >= LH(U)NlogD>=LH(U)

## Equal-length asymptotically lossless source coding

- Fixed length: The length of the encoded codewords is the same
- Number of messages to be encoded: $ \mathrm{M} = K^{L} $

  - K K represents the number of source symbols, and L  represents the length of the source sequence
- **A uniquely decodable code ** exists if and only if: $ \mathrm{D}^{\mathrm{N}} \geq K^{L}, \mathrm{~N} \geq \frac{\mathrm{L} \log \mathrm{K}}{\log \mathrm{D}} $

  - DDD Number of code symbols, $ \mathrm{N} $  code length, $ \mathrm{N} / \mathrm{L} $  average number of code symbols required per source symbol
- Entropy  $ \mathrm{H}(\mathrm{U}) $  is a statistical average; only when  L  is infinite does the average information content per symbol of a specific source output sequence equal the entropy.

  - LLL When finite, the average information content per symbol fluctuates around  $ \mathrm{H}(\mathrm{U}) $ . Choose  L  sufficiently long such that  $ \mathrm{Nlog} \mathrm{D} \geq \mathrm{L}\left[H(U)+\varepsilon\_{\mathrm{L}}\right] $， $ \varepsilon\_{\mathrm{L}} $  and  $ \mathrm{L} $  are related positive numbers.
    When  $ \mathrm{L} \rightarrow \infty $ , then  $ \varepsilon\_{\mathrm{L}} \rightarrow 0 $, so as not to reduce efficiency.
  - H(U)≤logKH(U) \leq logKH(U)≤logK, equality holds for uniform distribution; therefore, when the aforementioned necessary and sufficient conditions are met, it necessarily satisfies  N≥LH(U)log⁡D\mathrm{~N} \geq \frac{\mathrm{L} H(U)}{\log \mathrm{D}} N≥logDLH(U)​
- Typical sequence AEP：**Sample average**and**Statistical average**are close

  - Typical events occur more frequently.
    - The probability of an individual atypical sequence is not necessarily lower than that of an individual typical sequence, but the total probability of all atypical sequences tends to 0 as  LLL  increases. 0
  - Satisfies the law of large numbers:$ lim\_{L \rightarrow \infty} \mathrm{P}\left[\left|\frac{\mathrm{I}\_L}{L}-\mathrm{H}(\mathrm{U})\right| \leq \varepsilon\right] \geq 1-\varepsilon $
    - $ \mathrm{I}*L=\sum*^{L}-\log \mathrm{P}\left(\mathrm{u}\_{l}\right) ，，，L$ is the sequence length
    - Weak Law of Large Numbers: As the sequence length increases, the total probability of the set composed of   typical sequences tends to 1
    - The difference between the strong and weak laws lies in whether the total probability is "definitely  1" or "approaches  1”（limlimlim  (whether inside or outside  PPP )"
  - **Asymptotically Lossless **: Only encode ** typical sequences **; as  LLL  approaches infinity, other sequences almost never occur, thus resulting in no distortion
- Weak  $ \varepsilon $- Typical Sequence Set

  - Typical Sequence Set:TU( L,ε)={uL:H(U)−ε≤IL≤H(U)+ε}\mathrm{T}\_{U}(\mathrm{~L}, \varepsilon)=\left\{u\_{L}: H(U)-\varepsilon \leq \mathrm{I}\_{\mathrm{L}} \leq H(U)+\varepsilon\right\}TU​( L,ε)={uL​:H(U)−ε≤IL​≤H(U)+ε}
  - Asymptotic Equipartition Property: Given a specific sequence  $ \mathrm{u}*{1} u* \cdots u\_{L} $  output by a discrete memoryless stationary source, for any given  $ \varepsilon $  and  $ \delta $, , an integer  $ L $ can be found such that when  $ L>L\_{0} $  holds Pr⁡{∣−log⁡2P(U1U2⋯UL)L−H(U)∣≤ε}≥1−δ\operatorname{Pr}\left\{\left|-\frac{\log \_{2} P\left(U\_{1} U\_{2} \cdots U\_{L}\right)}{L}-H(U)\right| \leq \varepsilon\right\} \geq 1-\deltaPr{∣∣∣∣​−Llog2​P(U1​U2​⋯UL​)​−H(U)∣∣∣∣​≤ε}≥1−δ
  - The occurrence probabilities of typical sequences are approximately equal **, and the average information amount per source symbol in each sequence is close to the ** source entropy **, and the sum of probabilities of all typical sequences asymptotically approaches ** 1
  - The total number of typical sequences is approximately  2LH(U)2^{LH(U)}2LH(U), the occurrence probability of a specific typical sequence is  2−LH(U)2^{-LH(U)}2−LH(U), and the proportion occupied by typical sequences α=2LH(U)−LlogK\alpha = 2^{LH(U)-LlogK}α=2LH(U)−LlogK
- Encoding ** Rate** $ \mathrm{R} = \frac {\mathrm{N}} {\mathrm{L} } log\mathrm{D} \ 比特/符号$

  - Source sequence length  LLL, codeword length  NNN, alphabet size of the codeword  DDD, total number of codewords M=DNM=D^NM=DN
  - RRR Represents the average number of  bit  (information entropy  /  average code length) bits required to encode a single source symbol. As long as  LLL  is sufficiently long,  RRR  can approach the source entropy arbitrarily closely H(U)H(U)H(U)
- Encoding **efficiency** $ \eta=\frac{H(U)}{R} \leq 1 $

  - (Before encoding) Average**Symbol**bits per / (After encoding) Average**Code element**bits per
- Fixed-length source coding theorem R≥H(U)R \geq H(U)R≥H(U)

  - Positive theorem  ：$ \forall \varepsilon>0，，， \delta>0 $: If the encoding rate  $ \mathrm{R} \geq H(U)+\varepsilon $ ， , then when  $ L $  is sufficiently large, the decoding error probability ,  $ P\_{e}<\delta $
  - Converse theorem: $ \forall \varepsilon>0 $, if  $R \leq H(U)-2 \varepsilon $, then the decoding error probability  $ P\_{e}>0 $, and as   increases with  $ L $ , it approaches  1, meaning that decoding fails with probability 1 
  - **Source entropy is the theoretical limit of source compression! ** ——  There exists an encoding method such that when  LLL  is sufficiently large, NlogD≥LH(U)NlogD \geq LH(U)NlogD≥LH(U), and the error probability  PeP\_ePe​  can be made arbitrarily small

## Variable-length lossless source coding

- Variable-length coding: The length of the encoded codeword varies
- **The necessary and sufficient condition for the existence of a uniquely decodable code ** is the inequality  —— Kraft 

  - $ \sum\_{i=1}^{n} r^{-k\_{i}} \leq 1 $
  - nnn a source symbol, rrr  code symbols, each codeword length  kkk (bits are treated as binary code symbols r=2r=2r=2）
  - This is only a sufficient condition; codes satisfying the inequality  Kraft  are not necessarily uniquely decodable
- The noiseless source coding theorem  —— **, also known as Shannon's first theorem**

  - $ H\_r(U) \leq \frac {\overline{l}\_N}{N} \leq H\_r(U) + \frac{1}{N}$
  - If the average codeword length per source symbol  l‾NN\frac {\overline{l}\_N}{N}NlN​​  is greater than the source entropy  Hr(U)H\_r(U)Hr​(U), then a lossless code can always be found
  - As the source sequence length  NNN  approaches infinity, the average codeword length  l‾\overline{l}l  approaches the source entropy  Hr(U)H\_r(U)Hr​(U), and the coding efficiency  η\etaη  approaches 100%
  - The length of the source symbol sequence for variable-length coding  NNN  can be much smaller than that for fixed-length coding, with a lower bound on coding efficiency $ \eta\_{c}=\frac{H(U)}{\bar{l} \log r}>\frac{H\_{r}(U)}{H\_{r}(U)+\frac{1}{N}} $
- Optimal code: ** has the shortest average codeword length **

  - This is a constrained optimization problem where the objective is the average codeword length and the constraint is the inequality  Kraft 
    - minKˉ=∑ipikimin \quad \bar{K} = \sum\_ip\_ik\_iminKˉ=∑i​pi​ki​
    - $sub \quad\sum\_{i=1}^{n} D^{-k\_{i}} \leq 1 $
  - **The optimal average codeword length ** Kˉ∗=−∑pilog⁡Dpi=HD(X)\bar{K}^{\*}=-\sum p\_{i} \log \_{D} p\_{i}=H\_{D}(X)Kˉ∗=−∑pi​logD​pi​=HD​(X) (the optimal average codeword length is the smallest integer greater than or equal to the source entropy, which is a **)**）
  - Assign shorter codewords to symbols with higher probabilities and longer codewords to those with lower probabilities, thereby minimizing the average codeword length.
  - Huffman The encoding is optimal.
- Huffman Encoding

  1. Arrange the  n  messages emitted by the source in descending order of their probabilities.
  2. Assign  1  and  0  code symbols to the two messages with the smallest probabilities, respectively, and sum their probabilities to treat them as the probability of a new message.
  3. Re-sort and repeat the above encoding process.
  4. During the backward traversal along the coding branches for each message, sequentially collect the assigned code symbols to form the corresponding codewords.
  5. Calculate the average codeword length  Kˉ=∑ipiki\bar{K} = \sum\_ip\_ik\_iKˉ=∑i​pi​ki​  and the source entropy. H(X)H(X)H(X)
  6. Obtain the information transmission rate  R=H(X)Kˉ  bits per / code symbol, R=\frac{H(X)}{\bar{K}} \  bits per / code symbol, R=KˉH(X)​  bits per / code symbol, and the encoding efficiency. η=R∗100%\eta = R\*100\%η=R∗100%
     - Here,  RRR  is ambiguous; it represents  ppt . In some contexts, it refers to the coding rate. R=KˉlogDR = \bar{K}logDR=KˉlogD，η=H(X)R\eta=\frac{H(X)}{R}η=RH(X)​

# IV. Channel Capacity (Transmission Limit)

​ Essentially a mathematical optimization problem: cost function  maxI(X;Y)max \quad I(X;Y)maxI(X;Y), optimization variable  p(xi)p(x\_i)p(xi​), fixed p(yi∣xi)p(y\_i|x\_i)p(yi​∣xi​)。

​ The transmission limit is the maximum amount of information that the channel can transmit

​ Gaussian Channel C=Wlog(1+SNR)C = W log(1+SNR)C=Wlog(1+SNR)

## Discrete Memoryless Channel and Capacity Calculation

- The channel model is described by ** transition ** probability  p(yi∣xi)p(y\_i|x\_i)p(yi​∣xi​) 

  - The source uses ** prior ** probability p(xi)p(x\_i)p(xi​)
  - The destination  p(yi)p(y\_i)p(yi​)  uses the law of total probability for calculation
  - **Posterior ** probability  p(xi∣yi)p(x\_i|y\_i)p(xi​∣yi​)  represents inferring the input based on the output
- Capacity: the amount of information transmitted over the channel

  - Use interaction entropy / average mutual information  I(X;Y)=H(X)−H(X∣Y)I(X;Y)=H(X)-H(X|Y)I(X;Y)=H(X)−H(X∣Y)  to describe the information transmitted over the channel
  - I(X;Y)I(X;Y)I(X;Y) is a concave function of  p(xi)p(x\_i)p(xi​) . Clearly, there exists a maximum source distribution that allows the channel capacity to reach its maximum value
- Channel modeling  —— ** Channel matrix**

  - K input,J output (K row J column)
  - Each row represents the probability of transitioning from the same input to different outputs (summing to 1）
  - Each column represents the probability of different inputs ** transitioning ** to the same output
- Symmetric channel

  - Symmetric with respect to input: each row is a permutation of the first row
    - H(Y∣X)=H(Y∣X=k)H(Y|X) = H(Y|X=k)H(Y∣X)=H(Y∣X=k)
  - Symmetric with respect to output: each column is a permutation of the first column
    - The sum of probabilities in each column is the same
  - Permutation: Same values, shuffled order
  - Symmetric: Symmetric in both rows and columns
  - Quasi-symmetric: Symmetric with respect to rows, asymmetric with respect to columns
- Channel capacity

  - C=max⁡q={q(x),x∈{0,1,⋯ ,K−1}}I(X;Y)C=\max \_{q=\{q(x), x \in\{0,1, \cdots, K-1\}\}} I(X ; Y)C=maxq={q(x),x∈{0,1,⋯,K−1}}​I(X;Y)
  - Optimal distribution: The input distribution that maximizes the average mutual information per symbol
  - Channel capacity is independent of the source; it is solely a function of the channel transition probabilities
  - $ I\left(x\_{k} ; y\_{j}\right) $ Non-average mutual information
  - $ I\left(x\_{k} ; Y\right) 、 I\left(X ; y\_{j}\right) $ Semi-average mutual information
  - Necessary and sufficient conditions for achieving channel capacity  C 

    - Input probability vector $ Q=\left{Q\_{0}, Q\_{1}, \cdots, Q\_{K}\right} $ Achieve transition probability as $ {p(j \mid k)} $ of DMC capacity of $ C $ necessary and sufficient condition is

      I(x=k;Y)=C∀k,Qk>0I(x=k;Y)≤C∀k,Qk=0\begin{array}{lll}
      I(x=k ; Y)=C & \forall k, Q\_{k}>0 \\
      I(x=k ; Y) \leq C & \forall k, Q\_{k}=0
      \end{array}
      I(x=k;Y)=CI(x=k;Y)≤C​∀k,Qk​>0∀k,Qk​=0​
    - I(X;Y)=∑kQkI(x=k;Y)=∑kQkC=CI(X;Y)=\sum\_kQ\_kI(x=k ; Y)=\sum\_kQ\_kC=CI(X;Y)=∑k​Qk​I(x=k;Y)=∑k​Qk​C=C
  - A brute-force solution method for **: **$ C = max\_k I(x\_k;Y) = max\_k \sum\_j P(y\_j \mid x\_k) \log \frac{P(y\_j \mid x\_k)}{P(x\_k)} $

    - Essentially, it utilizes the fact that  CCC  is the maximum mutual information among all  XXX 
    - Another simple approach is to identify the source symbol  H(Y∣x)H(Y|x)H(Y∣x)  whose  xxx is significantly smaller than others (for example, its state transition vector approaches the maximum entropy theorem), and directly set its  P(x)=0P(x)=0P(x)=0 to reduce computational complexity.
- **Symmetric ** DMC  channel

  - **Equal-probability input ** achieves the optimal input distribution, at which point the output is also uniformly distributed
  - $ C = H(|Y|) - H(Y|x\_k) =\log J+\sum\_j P(y\_j \mid x\_k) \log P(y\_j \mid x\_k) $
    - JJJ It represents the size of the output
- **Quasi-symmetric ** DMC  channel

  - The optimal input distribution is also an ** uniform distribution**
  - **Using equal-probability distribution to calculate average mutual information during exams yields the channel capacity for **
  - $ C = I(x\_k;Y) = \sum\_j P(y\_j \mid x\_k) \log \frac{P(y\_j \mid x\_k)}{\frac{1}{K} \sum\_i P(y\_j \mid x\_i)} $
    - KKK It represents the size of the input
- Binary ** symmetric deletion ** channel d

  - [Image omitted: third-party image]
  - **When the equiprobable distribution ** P(x0)=P(x1)=12P(x\_0)=P(x\_1)=\frac{1}{2}P(x0​)=P(x1​)=21​  holds, it takes $ C=\left(1-\varepsilon\_{1}-\varepsilon\_{2}\right) \log \left(1-\varepsilon\_{1}-\varepsilon\_{2}\right)+\varepsilon\_{2} \log \varepsilon\_{2}-\left(1-\varepsilon\_{1}\right) \log \frac{1-\varepsilon\_{1}}{2} $
  - Binary pure deletion channel ε2=0\varepsilon\_2 = 0ε2​=0，C=1−ε1C = 1 - \varepsilon\_1C=1−ε1​
- General binary channel

  1. Let the probability of one be  α\alphaα ; then the other is 1−α1-\alpha1−α
  2. Calculate P(x,y)P(x,y)P(x,y)、P(y)P(y)P(y)
  3. Calculate $ I(X;Y) = H(Y) - H(Y|X) $
  4. Solve  $ \frac{\partial \boldsymbol{I}(\boldsymbol{X} ; \boldsymbol{Y})}{\partial \alpha}=0 $ to obtain α\alphaα
  5. Substitute  α\alphaα  to obtain I(X;Y)I(X;Y)I(X;Y)
- General discrete channel (** will be tested on **, substitute formula)

  - Premise: The channel matrix is invertible
  1. **Write ** row by row to form  KKK  equations  $ \sum\_{j} P(y\_j \mid x\_k) \beta\_{j}=\sum\_{j} P(y\_j \mid x\_k) \log P(y\_j \mid x\_k) $, and solve for $ \beta\_j $
  2. Calculate the channel capacity $ C=\log \left(\sum\_{j} 2^{\beta\_{j}}\right) $
  3. Calculate  $ w\_{j}=2^{\beta\_{j}-C} $ (output distribution)
  4. **Write ** column by column to form  JJJ  equations  $ w\_{j}=\sum\_{k} Q\_{k} P(y\_j \mid x\_k) $, and solve for  QkQ\_kQk​ (input distribution)
  5. Verify  Qk≥0Q\_k \geq 0Qk​≥0; otherwise, set  Qk=0Q\_k = 0Qk​=0, remove the corresponding ** row ** from the transition matrix, and re-solve
- The ** output distribution at channel capacity is uniquely **. Any input distribution that yields this output distribution is optimal, achieving mutual information equal to the channel capacity.

  - The optimal ** input distribution is not uniquely **

## Time-discrete memoryless continuous channel and capacity calculation

- Memoryless channel: Channel state transition probability density $ p(\boldsymbol{y} \mid \boldsymbol{x})=\prod\_{n=1}^{N} p\left(y\_{n} \mid x\_{n}\right) $
- Stable (constant-parameter) channel:$ p\left(y\_{n} \mid x\_{n}\right)=p\left(y\_{m} \mid x\_{m}\right) $
- **Additive noise ** channel

  - The output is obtained from the input through noise interference; therefore, ** interference constitutes a description of the channel.**
  - If the conditional probability density of a continuous channel satisfies  $ p(y \mid x)=p(y-x)=p(z)，，，x$  and  $ z $  being mutually independent, it is called an additive noise channel, where  $ z=y-x $  is referred to as additive noise.
  - Additive refers to the addition of entropy:H(Y∣X)=H(Z)H(Y|X)=H(Z)H(Y∣X)=H(Z)，I(X;Y)=H(Y)−H(Z)I(X;Y)=H(Y)-H(Z)I(X;Y)=H(Y)−H(Z)
    - Determining the channel capacity involves finding the maximum value of  H(Y)H(Y)H(Y)  over all input distributions.
    - Finding the ** channel capacity ** can be transformed into finding C=H(Y)−H(Z)C = H(Y) - H(Z)C=H(Y)−H(Z)
  - Given channel interference, if the input power is unrestricted, I(X;Y)I(X;Y)I(X;Y)  can be arbitrarily large.
- **Average power-constrained ** additive noise channel

  - From the maximum entropy theorem  ——  power-constrained, ** Gaussian distribution ** achieves maximum entropy
  - The noise at each time instant is Gaussian with mean  0 and identical variance.
    - C=12log⁡(1+Sσ2)C=\frac{1}{2} \log \left(1+\frac{S}{\sigma^{2}}\right)C=21​log(1+σ2S​)
    - $ S $ represents the upper limit of the average input power, where $ \sigma^{2} $  is the variance of zero-mean Gaussian noise.
    - The optimal input distribution is a Gaussian distribution with mean  0  and variance  $ \mathrm{S} $ 
  - The noise at each time instant is Gaussian with mean  0 but different variances.
    - C=∑n=1N12log⁡(1+Snσn2),∑n=1NSn=SC=\sum\_{n=1}^N\frac{1}{2} \log \left(1+\frac{S\_n}{\sigma\_n^{2}}\right), \quad \sum\_{n=1}^NS\_n=SC=∑n=1N​21​log(1+σn2​Sn​​),∑n=1N​Sn​=S
    - Capacity of independent parallel channels  —— ** Water-filling theorem**
      - The total signal power is constrained, requiring the determination of a power allocation strategy.
      - Channel ** allocation ** strategy to maximize the total channel capacity / information amount
      - BBB is a threshold (constant), which can be regarded as a "water level"
        - When  $ \sigma\_{n}^{2}<B $ , select ,  $ \sigma\_{n}^{2}+S\_{n}=B $
        - When  $ \sigma\_{n}^{2}>B $ , select $ S\_{n}=0 $
      - $ B=\frac{S+\sum\_{j=m+1}^{N} \sigma\_{j}^{2}}{N-m} $
        - The power of the first  mmm  channels does not exceed the threshold  BBB, so no energy is allocated.
      - $ C=\sum\_{n: \sigma\_{n}^{2}<B} \frac{1}{2} \log \frac{B}{\sigma\_{n}^{2}} $
    - Water-filling process
      1. Sort the interference strength  σn2\sigma\_n^2σn2​  in descending order
      2. Start attempting calculation from  m=0m=0m=0  $ B=\frac{S+\sum\_{j=m+1}^{N} \sigma\_{j}^{2}}{N-m} $
      3. If  σm2≥B\sigma\_{m}^2 \geq Bσm2​≥B, then increase  mmm  and recalculate  BBB (which is equivalent to removing σm2\sigma\_{m}^2σm2​）
      4. If  σm2<B\sigma\_{m}^2 < Bσm2​<B, calculate  Sn=B−σn2∣n>mS\_n=B-\sigma\_n^2|\_{n > m}Sn​=B−σn2​∣n>m​  and Sn=0∣n≤mS\_n = 0|\_{n \leq m}Sn​=0∣n≤m​
      5. Calculate $ C=\sum\_{n=m+1}^{N} \frac{1}{2} \log \frac{B}{\sigma\_{n}^{2}} = \frac{1}{2}log\frac{B{N-m}}{\prod\_{n=m+1}N\sigma\_n^2}$
- Entropy power

  - Entropy power is a lower bound:$ \bar{\sigma}^{2}=\frac{1}{2 \pi e} e^{2 H(X)} \leq \sigma^2$
  - $ \frac{1}{2} \log \_{2}\left(1+\frac{S}{\bar{\sigma}^{2}}\right) \leq C \leq \frac{1}{2} \log \_{2}\left(\frac{S+\sigma{2}}{\bar{\sigma}{2}}\right) $
  - Given noise ** power **, the ** Gaussian interference is the worst-case interference**
    - Therefore, it is appropriate to assume that the noise is Gaussian.
    - Moreover, Gaussian noise is convenient for analysis, and Gaussian noise is also prevalent in practice.

## Waveform Channels and Capacity Calculation

- Waveform Channel

  - When both the input and output of a channel are random processes  $ {x(t)} $  and  $ {y(t)} $ , this channel is referred to as a ** waveform channel ** or ** time-continuous channel.**
  - If the channel output is  $ y(t)=x(t)+z(t) $, and  $ z(t)$  and  $ x(t) $  are mutually independent, it is called an ** additive waveform channel.**
- Shannon's Formula

  - For an additive Gaussian white noise channel with average input power  $ \leq S $ and two-sided interference power spectral density  $ N\_{0} / 2 $ , if the input  $ x(t) $  is constrained within  $ 0 \leq t \leq T $, then

    C=Wlog⁡(1+SN0W)C=W \log \left(1+\frac{S}{N\_{0} W}\right)
    C=Wlog(1+N0​WS​)
  - The channel capacity is achieved when the source signal follows a ** Gaussian distribution **
  - The channel capacity of non-Gaussian noise waveform channels takes the capacity of the Gaussian additive channel as its ** lower bound.**

    - R<CGaussian <CoR<C\_{ Gaussian }<C\_oR<C Gaussian​<Co​
    - It can be calculated whether Gaussian noise can transmit data at a rate of  RRR , but it cannot determine whether it is achievable under other noise conditions.
  - C When fixed, increasing the bandwidth allows the signal-to-noise ratio  SNR=SN0WSNR=\frac{S}{N\_{0} W}SNR=N0​WS​  to be reduced, meaning the two are interchangeable.

    - Error correction coding and other ** spread spectrum ** methods can be adopted to reduce transmit power while ensuring transmission reliability.
    - Reducing  SNR  enables communication concealment

# V. Channel Coding Theorem

​ **Channel coding**by adding redundancy to enhance**reliability**, while**source coding**is to reduce redundancy to enhance**efficiency**。

## Definition of Channel Encoder

- (n,M)(n, M)(n,M) Code
  - nnn is the codeword length after encoding, and M=2nRM=2^{nR}M=2nR  is the number of codewords
  - Encoding function: $ f:{1,2, \cdots, M} \rightarrow \mathcal{X}^{n} $
  - Decoding function: $ g: \mathcal{Y}^{n} \rightarrow{1,2, \cdots, M} $
  - Message set: $ \mathcal{W}={1,2, \ldots, M} $
  - Codeword: $ f(1), f(2), \cdots, f(M) $
  - Error rate
    - **The maximum ** error probability  λmax\lambda\_{max}λmax​  is the maximum of the error probabilities  λw\lambda\_{w}λw​  of all codewords.
    - **The average ** error probability  PeP\_ePe​  is the average of the error probabilities  λw\lambda\_{w}λw​  of all codewords.
  - Code rate:$ R=\frac{1}{n} \log M \ 比特/传输$
    - **Asymptotically achievable **: When the encoded codeword length  nnn  is sufficiently large (i.e., when there are enough parity bits), the maximum error probability  λmax\lambda\_{max}λmax​  can be made smaller than any given positive value.

## Jointly typical sequence

- Typical sequence Aε(n)A\_{\varepsilon}^{(n)}Aε(n)​

  - The uncertainty calculated from samples is close to the entropy of its distribution
    - $ -\frac{1}{n} \log p\left(x\_{1}, x\_{2}, \ldots, x\_{n}\right) \in[H(X)-\varepsilon, H(X)+\varepsilon] $
    - **Whether it is typical  ——  The entropy estimated by samples is close to its statistical expectation**
  - The probability of occurrence is sufficiently large
    - $ \operatorname{pr}\left(A\_{\varepsilon}^{(n)}\right)>1-\epsilon $ When  $ n $  is sufficiently large
  - The number of elements satisfies
    - $ \left|A\_{\varepsilon}^{(n)}\right| \leq 2^{n(H(X)+\varepsilon)} $
    - $ \left|A\_{\varepsilon}^{(n)}\right| \geq(1-\epsilon) 2^{n(H(X)-\varepsilon)} $ When  $ n $  is sufficiently large
- Jointly typical sequence

  - distributed according to $ p(x, y) $ jointly typical sequences of $ \left{\left(x^{n}, y^{n}\right)\right} $ the set formed by $ A\_{\varepsilon}^{(n)} $, whose empirical entropy and true entropy $ \varepsilon $ are close to forming $ n $ a set composed of long sequences
    - Both are typical, and their sample-calculated joint entropy is close to the true joint entropy of the distribution
    - H(x1x2)≤H(x1)+H(x2)H(x\_1x\_2) \leq H(x\_1)+H(x\_2)H(x1​x2​)≤H(x1​)+H(x2​) Not all combinations of typical sequences are jointly typical.
  - **Whether it is jointly typical  ——  is estimated using the sample joint entropy close to its statistical expectation.**
  - The combination of any two typical sequences is not necessarily a jointly typical sequence.
    - Probability is related to  I(X;Y)I(X;Y)I(X;Y) :$ \frac{2^{n H(X, Y)}}{2^{n H(X)} 2^{n H(y)}}=2^{-n I(X ; Y)} $
- Conditionally typical sequence

  - When  $ P\_{Y \mid X}{n}\left(y \mid x{n}\right)=\prod\_{i=1} P\_{Y \mid X}\left(y\_{i} \mid x\_{i}\right) $, the conditionally typical sequence for given  $ X^{n}, Y^{n} $  is

    AE(n)(PXY∣xn)={yn:(xn,yn)∈AE(n)(PXY)}A\_{\mathcal{E}}^{(n)}\left(P\_{X Y} \mid x^{n}\right)=\left\{y^{n}:\left(x^{n}, y^{n}\right) \in A\_{\mathcal{E}}^{(n)}\left(P\_{X Y}\right)\right\}
    AE(n)​(PXY​∣xn)={yn:(xn,yn)∈AE(n)​(PXY​)}
- Typical sequences are mainly used for ** typical sequence decoding **, and can be used to analyze bit error rate, etc.

## Channel Coding Theorem

- Input X and Output Y must be**Jointly Typical**Sequence

  - One  X  can correspond to multiple typical  Y, but not any combination is jointly typical; only a finite number of  Y  are jointly typical with  X 
  - At most  $ 2^{n I(Y \mid X)} $  distinguishable  n -length sequences can be transmitted
- **Shannon's second theorem ** ——  states that for a discrete memoryless channel, all code rates less than the channel capacity  CCC  are achievable

  - Direct theorem: For any code rate  R<CR<CR<C, there exists an  (2nR,n)(2^{nR},n)(2nR,n)  code sequence whose maximum error probability λn→0\lambda^{n}\to0λn→0
  - Converse theorem: Any code sequence satisfying λn→0\lambda^{n}\to0λn→0 that (2nR,n)(2^{nR},n)(2nR,n) must haveR<CR<CR<C
  - The channel coding theorem is an existence theorem of the ** type**
- Joint typical decoding

  1. Encode message  W=[1,2nR]W=[1,2^{nR}]W=[1,2nR]  into Xn(W)X^{n}(W)Xn(W)
  2. Upon receiving  YnY^nYn, if  $ \left(X^{n}(\widehat{W}), Y^{n}\right) $  is jointly typical, decode the received sequence  YnY^nYn  as Xn(W^)X^{n}(\widehat{W})Xn(W)
  3. A decoding error is declared when  $ W \neq \widehat{W} $  or another  $ \left(X{n}\left(W\right), Y^{n}\right)$  is jointly typical
  - When  nnn  is sufficiently large, the bit error rate is 0
- Differences Among Three Coding Methods

  - Maximum a posteriori: traverse yjy\_jyj​ Select p(xi∣yj)p(x\_i|y\_j)p(xi​∣yj​) the largest xix\_ixi​, as a pair of codes (bit error rate may be lower than maximum likelihood)
  - Maximum relief: Traverse  $x\_i $ , select the  p(yj∣xi)p(y\_j|x\_i)p(yj​∣xi​)  with the largest  yjy\_jyj​ as a pair of codes (the optimal method that minimizes error probability)
  - Joint typicality: Encode randomly according to a certain distribution; the receiver traverses  xix\_ixi​  and selects  (xi,yj)(x\_i,y\_j)(xi​,yj​)  as jointly typical with  xix\_ixi​  for decoding (which is asymptotically optimal).
- Summary

  - The channel coding theorem states that as the codeword length approaches infinity, reliable communication can be achieved, meaning the bit error rate tends to 0. 0
  - The proof method for the direct theorem is existential rather than constructive.
  - Issues with Random Coding Schemes::
    - Encoding and decoding require substantial computation (probability calculations).
    - Large storage capacity is required.
  - When  n  is sufficiently large, if codewords are selected randomly, they are likely to be good codes.
  - The number of  0，1  in good codes is almost equal.

## Source-Channel Separation Theorem

- Source coding: data compression,$ \mathrm{R}>\mathrm{H} $
- Channel coding: data transmission,$ \mathrm{R}<\mathrm{C} $
- A stationary ergodic source can be transmitted over a channel if and only if its entropy rate is less than the channel capacity.

  - If  $ V\_{1}, V\_{2}, \ldots, V\_{n} $  is a random process on a finite alphabet satisfying  AEP  and  $ H(V)<C $ , then there exists a source-channel code such that the error probability $ \operatorname{Pr}(\widehat{V^{n}} \neq V^{n}) \rightarrow 0 $
  - Conversely, for any stationary random process, if  $ H(V)>C $, then the error probability is far from  0, and thus it cannot be transmitted through the channel   with an arbitrarily low error probability
- The joint source-channel separation theorem encourages us to consider source coding problems independently from channel coding problems.

  - Separate encoders and joint encoders can achieve the same code rate.

# VI. Rate-Distortion Function

​ The entropy of a continuous random variable is infinite. Use ** lossy coding ** to represent the information of a source with infinite information content using finite-length codewords.

​ Entropy compression: Still seeks the lower bound of the average code length, but no longer  L>HL>HL>H; instead, it studies how much the source information can be compressed under conditions that allow a certain degree of distortion.

​ Rate (transmission rate / coding rate) is related to code length; the longer the code length, the higher the rate. Rate and average mutual information (bit/ symbol) are essentially the same thing. Minimizing the rate is equivalent to minimizing the entropy after encoding.

​ Under lossy conditions, the distortion caused by encoding can be viewed as interference when passing through ** test channel **

## Distortion Measure

- Distortion measure  ——  the 'quality' of the source representation

  - Given a rate, find the minimum achievable expected distortion.
  - Given a distortion level, find the minimum description rate.
  - If entropy changes, distortion must have occurred.
    - By the data processing inequality, any processing of data can only result in a loss of information.
- Vector quantization

  - The symbol  $ X \in \mathcal{X} $  can take continuous or discrete values.
  - The quantized result  $ \widehat{x} $  is discrete-valued. When  $ x $  is discrete-valued, we have $ |\widehat{x}| \ll|x| $
- Rate-distortion encoder and decoder

  - Source : $ X\_{i} \sim p(x) $
  - The encoder :  encodes the  $ n $ -length source sequence  $ X^{n}=\left{X\_{1}, X\_{2}, \ldots X\_{n}\right} $  into a sequence of length  $ n R $ bit , denoted as $ f\_{n}\left(X^{n}\right) $
    - Rate  RRR, compression ratio H/RH/RH/R
  - The decoder :  maps  $ f\_{n}\left(X^{n}\right) $  to the  $ n $ -length source sequence $ \widehat{X}^{n}=\left{X\_{1}, X\_{2}, \ldots X\_{n}\right} $
- Distortion measure: A mapping from the product space of the source alphabet and reproduction alphabet to the set of non-negative real numbers

  - **Hamming distortion **: equal source and reconstructed symbols are  0, unequal are 1
    - Distortion entropy  =  Bit error rate entropy
  - Squared error distortion: similar to MSE

## Rate-distortion theorem

- Rate-distortion function

  - A rate-distortion pair $ (R, D) $ is **achievable** if there exists a rate-distortion code $ \left(2^{n R}, n\right) $ whose encoding and decoding functions $ \left(f\_{n}, g\_{n}\right) $ satisfy the **fidelity criterion**:

    lim⁡n→∞E (X1:n,X^1:n) ≤D→Σx,x^p(x)p(x^∣x)d(x,x^)≤D\lim \_{n \rightarrow \infty} E \ (X\_{1: n}, \hat{X}\_{1: n}) \ \leq D \quad \rightarrow \quad \Sigma\_{x, \widehat{x}} p(x) p(\hat{x} \mid x) d(x, \hat{x}) \leq D
    n→∞lim​E (X1:n​,X^1:n​) ≤D→Σx,x​p(x)p(x^∣x)d(x,x^)≤D

    - $ D $ Is the maximum distortion allowed at code rate  $ R $ 
    - Encoding and decoding are constrained by average distortion, bit error rate is constrained by the distortion function
    - Fidelity criterion ** Objective **: Under the constraint of limited distortion (distortion-limited), reduce the code rate so that distortion just satisfies the constraint
  - Rate-distortion: For a given distortion upper bound  $ D $, satisfying  $ (R, D) $  included in all rates  $ R $  of the source's rate-distortion region, the ** infimum ** is called ** rate-distortion function**

    - R(I)(D)=min⁡p(x^∣x):Σx,x^p(x)p(x^∣x)d(x,x^)≤DI(X;X^)R^{(I)}(D)=\min \_{p(\hat{x} \mid x): \Sigma\_{x, \widehat{x}} p(x) p(\hat{x} \mid x) d(x, \hat{x}) \leq D} I(X ; \hat{X})R(I)(D)=minp(x^∣x):Σx,x​p(x)p(x^∣x)d(x,x^)≤D​I(X;X^), the smaller the bit rate, the larger the error
    - Among III minimum value is taken from the joint distribution that $ p(x, \hat{x})=p(x) p(\hat{x} \mid x) $ satisfies the expected distortion constraint for all**conditional distributions** $ p(\hat{x} \mid x) $
  - Distortion rate: For a given bit rate $ R $, satisfying $ (R, D) $ contained in all distortion upper bounds within the source's rate-distortion region $ \mathrm{D} $ 's**infimum**is called**distortion-rate function**
- Comparison of the two optimization objectives  I(x;x^)I(x;\hat{x})I(x;x^)  I(X;Y)=∑xp(x)∑x^p(x^∣x)log2p(x^∣x)p(x)I(X;Y)=\sum\_{x} p(x) \sum\_{\hat x}p(\hat x|x)log\_2\frac{p(\hat x|x)}{p(x)}I(X;Y)=∑x​p(x)∑x^​p(x^∣x)log2​p(x)p(x^∣x)​

  - Channel capacity: C=maxp(x)I(x;x^)C = max\_{p(x)} I(x;\hat{x})C=maxp(x)​I(x;x^) —— ** transmission limit ** problem
    - How to design source coding so that the amount of transmitted information reaches the maximum capacity of the channel
  - Rate-distortion: R(D)=minp(x^∣x)I(x;x^),dˉ≤DR(D)=min\_{p(\hat{x}|x)} I(x;\hat{x}), \bar d \leq DR(D)=minp(x^∣x)​I(x;x^),dˉ≤D —— ** compression limit ** problem (another compression limit problem is lossless coding)
    - The amount of information a channel can transmit is limited. How to compress effectively so that the encoded source satisfies the fidelity criterion and the entropy of the encoded information is as small as possible
    - Here,  III  refers to the amount of information transmitted before and after lossy encoding, describing the "test channel"
- The fidelity set  $ \mathcal{F}*{D}=\left{q(\hat{X} \mid X): \bar d(q)=\sum* \sum\_{\hat{x}} p(x) q(\hat{x} \mid x) d(x, \hat{x}) \leq D\right} ，，，q$  is a conditional probability distribution

  - The fidelity set is the set of all**average distortion** $\bar d(q) $ less than**distortion upper bound** $ D $ conditional probability distributions**that satisfy** $ q(\hat{x} \mid x) $ 
  - Information**Rate-distortion function**Can be denoted as R(I)(D)=min⁡q∈FDI(q)R^{(I)}(D)=\min \_{q \in \mathcal{F}\_{D}} I(q)R(I)(D)=minq∈FD​​I(q) —— $ R^{(I)}(D) $ Is the conditional distribution $ q^{*} $ Under, satisfying $ d\left(q^{*}\right) \leq $ $ D $ The minimum information rate $ I\left(q^{\*}\right) $
- Under the condition that ** fidelity criterion ** is satisfied:

  - If the information rate  R∣R>H(X)R|\_{R>H(X)}R∣R>H(X)​  output by the source exceeds the channel's transmission capacity  CCC, the source must be compressed to obtain  X^\hat XX^, such that  R(D)<CR(D)<CR(D)<C dˉ(q)<D\bar d(q)<Ddˉ(q)<D
  - **The source coding problem ** refers to: for a given source  p(x)p(x)p(x) and a defined distortion function  d(x,x^)d(x,\hat x)d(x,x^), the goal is to minimize the encoded information rate  RRR  as much as possible, using the fewest code symbols to transmit source information, finding the lower bound of the information rate  RRR , and improving the efficiency ** of communication.**
- Treat the lossy source codec as a hypothetical channel ** with interference ** (equivalent noise channel, test channel), and study the rate-distortion source coding problem using methods for analyzing channel transmission

  - **The set of allowable test channels ** ：$ P\_{D}=\left{\mathrm{p}\left(y\_{j} \mid x\_{i}\right): \bar{d} \leq D\right} ，，，\bar d=\sum\_{x} \sum\_{\hat{x}} p(x) q(\hat{x} \mid x) d(x, \hat{x})$
  - The set of prohibited test channels:$ P\_{\mathrm{T}}=\left{\mathrm{p}\left(y\_{j} \mid x\_{i}\right): \bar{d}>D\right} $
- R(D)R(D)R(D) **domain**

  - DminD\_{min}Dmin​ and R(Dmin)R(D\_{min})R(Dmin​)
    - $R(D)*{max} = R(D*) $, in practice, it must also satisfy R(D)<CR(D)<CR(D)<C
    - $ D\_{\min }=\sum\_i p\left(x\_{i}\right) \min *{j} d\left(x*, y\_{j}\right) $multiply the minimum  ddd  of each row in the distortion matrix by the source distribution
      - when there is at least one  0，** per row and at most one  0  per column in the distortion matrix, ** holds, otherwise  $ R(0) = H(X) $ does not hold R(0)<H(X)R(0)<H(X)R(0)<H(X)
      - distortion  DDD  and error rate  PeP\_ePe​  are not necessarily identical; when  R(0)<H(X)R(0)<H(X)R(0)<H(X) , it is possible to have distortion equal to  0  while the bit error rate is non-zero for  0, allowing certain symbols to be merged into one
  - DmaxD\_{max}Dmax​ and R(Dmax)R(D\_{max})R(Dmax​)
    - R(D)min=0R(D)\_{min}=0R(D)min​=0 when all test channels  P(yj∣xi)P(y\_j|x\_i)P(yj​∣xi​)  correspond to the minimum average distortion  dˉ\bar ddˉ  DmaxD\_{max}Dmax​
      - R(Dmax)=I(X;Y)=0R(D\_{max})=I(X;Y)=0R(Dmax​)=I(X;Y)=0, implying mutual independence P(yj∣xi)=P(yj)P(y\_j|x\_i)=P(y\_j)P(yj​∣xi​)=P(yj​)
    - $ D\_{\max }=\min *{j} \sum* P(x\_i) d(x\_i, y\_j) $multiply each column of the distortion matrix by the source distribution and take the ** minimum**
- binary source X ~ Bernoulli§

  - $ R(D)=\left{\begin{array}{cc}H§-H(D) & \text { if } 0 \leq D \leq \min {p, 1-p} \ 0 & \text { if } D>\min {p, 1-p}\end{array}\right. $
- Information Rate-Distortion Theorem

  - Achievability: For any distortion and any  R>R(D)R>R(D)R>R(D), the existence of a rate-distortion code sequence with rate  RRR  and asymptotic distortion  DDD 
    - Distortion-typical: Based on the joint typicality of ** and **, add the condition of  `随机序列间的失真=期望失真` 
  - Converse theorem: If a rate less than R(D)R(D)R(D) is used to describe XXX, then it is impossible to achieve a distortion smaller than DDD 

## Calculation of rate-distortion

- If the transition probability is easy to express, calculate directly R(D)=min⁡p(x^∣x):Σx,x^p(x)p(x^∣x)d(x,x^)≤DI(X;X^)R(D)=\min \_{p(\hat{x} \mid x): \Sigma\_{x, \widehat{x}} p(x) p(\hat{x} \mid x) d(x, \hat{x}) \leq D} I(X ; \hat{X})R(D)=minp(x^∣x):Σx,x​p(x)p(x^∣x)d(x,x^)≤D​I(X;X^)

  1. Let  dˉ=D\bar d = Ddˉ=D, use  DDD  to represent p(x^∣x)p(\hat x|x)p(x^∣x)

     - When the optimal solution is reached, it lies on the constraint boundary
  2. Solve for  p(x^,x)p(\hat x,x)p(x^,x), and then calculate  p(x^)p(\hat x)p(x^)  and p(x∣x^)p(x|\hat x)p(x∣x^)
  3. Calculate  R(D)=I(X;X^)=H(X)−H(X∣X^)R(D)=I(X;\hat X)=H(X)-H(X|\hat X)R(D)=I(X;X^)=H(X)−H(X∣X^), and set the derivative with respect to  p(x^∣x)p(\hat x|x)p(x^∣x)  to 0
  4. Define the domain $ D\_{\min }=\sum\_i p\left(x\_{i}\right) \min *{j} d\left(x*, y\_{j}\right) ，，， D\_{\max }=\min *{j} \sum* P(x\_i) d(x\_i, y\_j) $
- Parametric expression of the rate-distortion function for a discrete source

  1. Iterate  yjy\_jyj​ to find $ D\_{\max }=\min *{j} \sum* P(x\_i) d(x\_i, y\_j) $
     - Input  xix\_ixi​, output  yjy\_jyj​，QQQ  is the input distribution, ddd  is the given distance function
  2. List  J  equations  $ \sum\_{i} \lambda\_{i} P(x\_{i}) \mathrm{e}^{s d\left(x\_{i}, y\_{j}\right)}=1 $ to solve for λi\lambda\_iλi​
     - sss is the slope of the  R(D)R(D)R(D)  function, used here as an intermediate parameter
  3. Use $ \lambda\_{i}=(\sum\_{j} P(y\_{j}) \mathrm{e}^{s d(x\_{i}, y\_{j})})^{-1}$, with 2 results combined to obtain P(yj)P(y\_j)P(yj​) the parameterized sss expression
     - Can further solve for P(yj∣xi)=P(yj)λiesd(xi,yj)P(y\_j|x\_i)=P(y\_j)\lambda\_ie^{sd(x\_i,y\_j)}P(yj​∣xi​)=P(yj​)λi​esd(xi​,yj​)
  4. Solve for the average loss $ D\_{s}=\sum\_{i} \sum\_{j} P(x\_{i}) P(y\_{j}) \lambda\_{i} \mathrm{e}^{s d(x\_{i}, y\_{j})} d(x\_{i}, y\_{j}) $, and invert to obtain the expression in terms of DsD\_sDs​ representation sss expression
  5. Solve for the rate-distortion function $ R(D\_{s})=s D\_{s}+\sum\_{i} P(x\_{i}) \ln \lambda\_{i} $
  6. Specify the domain
- For the simple case of a ** Bernoulli distribution **, the rate-distortion function can be solved directly using its definition.

  1. The objective  $ R(D)=\min *{P(v \mid u) \in P*{D}} I(U ; V) $  is not straightforward to solve using optimization methods.
  2. By  I(U;V)=H(U)−H(U∣V)⩾H(U)−H(Pe)=H(p)−H(Pe)I(U ; V)=H(U)-H(U \mid V) \geqslant H(U)-H\left(P\_{\mathrm{e}}\right)=H(p)-H\left(P\_{\mathrm{e}}\right)I(U;V)=H(U)−H(U∣V)⩾H(U)−H(Pe​)=H(p)−H(Pe​), find the lower bound of mutual information.

     - From the  Fano  inequality,$ H(U \mid V) \leqslant H\left(P\_{\mathrm{e}}\right)+P\_{\mathrm{e}} \log (2-1) = H\left(P\_{\mathrm{e}}\right)$
  3. Establish the connection between  $ P\_{\mathrm{e}}=P(U \neq V) $  and average distortion. $ H\left(P\_{\mathrm{e}}\right) \leqslant H\left(\frac{D}{\alpha}\right) $

     - When  α\alphaα  represents  d(u,v)∣u≠vd(u, v)|\_{u \neq v}d(u,v)∣u=v​ ,$ \bar{d}=\sum\_{u} \sum\_{v} P(u, v) d(u, v)=\alpha P(u \neq v)=\alpha P\_{\mathrm{e}} \leqslant D $
     - By discussing the values of  PPP , it can be seen that  H(P)H(P)H(P)  is an increasing function, so the less-than sign is taken.
     - For specific problems, this inequality needs to be ** re-solved ** (different problems can start solving from this step).
  4. The rate-distortion function is obtained. R(D)=I(U;V)min=H(p)−H(Dα)R(D) = I(U ; V)\_{min}=H(p)-H\left(\frac{D}{\alpha}\right)R(D)=I(U;V)min​=H(p)−H(αD​)

     - The output distribution is  {p,1−p}\{p,1-p\}{p,1−p}, and the transition probability is  D/αD/\alphaD/α  (the transition probability represents the error probability).
     - When  H(x)H(x)H(x)  is not followed by a distribution, it indicates that the entropy (fixed to two terms) is represented using parameter  xxx , for example:H(D)=−Dlog2D−(1−D)log2(1−D)H(D)=-Dlog\_2D-(1-D)log\_2(1-D)H(D)=−Dlog2​D−(1−D)log2​(1−D)
  5. Provide the domain and prove that the lower bound is achievable

     - If it is not achievable, directly use the definition of mutual information
- BA Algorithm

## Rate-distortion function of Gaussian sources

- Domain of continuous sources

  - $ D\_{\min } =\int\_{-\infty}^{\infty} q(u) \inf \_{v} d(u, v) \mathrm{d} u $

    - If  d(u,v)d(u,v)d(u,v)  can take  0, then  DminD\_{min}Dmin​  is  0 (generally 0）
  - $ D\_{\max } =\inf *{v} \int*^{\infty} q(u) d(u, v) \mathrm{d} u $

    - For  $ d(u, v)=(u-v)^{2} $,  DmaxD\_{max}Dmax​  is essentially calculating the variance
    - Gaussian source Dmax=σ2D\_{max}=\sigma^2Dmax​=σ2
- Rate-distortion function of independent and identically distributed Gaussian sources  N(0,σ2)N(0,\sigma^2)N(0,σ2)  under mean square error:$ R(D)=\left{\begin{array}{ll}\frac{1}{2} \log \frac{\sigma^{2}}{D}, & 0 \leq \mathrm{D} \leq \sigma^{2} \ 0, & \mathrm{D}>\sigma^{2}\end{array}\right. $
- Transmission rate increases by  1 bit，SNR  for every 6dB

# 7. Linear Block Codes

​ The purpose of channel coding is to improve the reliability of transmission in communication systems, and its task is to construct good codewords that exchange maximum anti-interference performance for minimum redundancy cost

​ Codeword  =  Information bits  +  Check bits / Parity bits C=[x1,x2,...,xk,y1,y2,...,yk]C = [x\_1, x\_2, ..., x\_k, y\_1, y\_2, ..., y\_k]C=[x1​,x2​,...,xk​,y1​,y2​,...,yk​]

​ Check bits are completely derived from information bits:H(y1y2∣x1x2x3)=0H(y\_1y\_2|x\_1x\_2x\_3) = 0H(y1​y2​∣x1​x2​x3​)=0

## Channel Coding Theorem for Noisy Discrete Channels

- Shannon's Second Theorem: As long as  R < C, there exists an error-correcting code with rate  R 
- Error-correcting codes possess error detection and correction capabilities because check codes (parity codes) are appended to the information codes
- The introduction of check codes reduces the transmission efficiency of the channel
- Error types: Random errors  +  Burst errors
- Error detection before error correction: Error-detecting codes  +  Error-correcting codes

## Linear block codes

- Channel coding
  - Block code: The parity bits of a codeword are related only to the information bits
  - Convolutional code: The parity bits are related not only to the information bits of the current codeword but also to other information bits
- Linear code: There is a linear relationship between information bits and parity bits
- Code weight: Refers to the number of "1" in a codeword
- Code distance: The distance between two codewords / the number of differing symbols
- Hamming weight: The Hamming weight of any codeword can be regarded as the Hamming distance between that codeword and the  0  codeword
- (𝑁,𝐾) Block code: Every  K  information digits form a group, from which  N  encoded digits are calculated to constitute a block; one block is also called a codeword
  - Bit rate:K/N
  - Check bits:R = N-K
  - Coding efficiency = k / n
- A  [n, k]  linear block code has  qkq^kqk  codewords, while a  n -length array has  qnq^nqn  types of codewords
- Using  [n, k, d]  to describe a linear block code, d  is the minimum Hamming distance
  - [n, M, d] Represents any code with  M  codewords
  - [n, k, d] The minimum Hamming distance equals the minimum weight of non-zero codewords

## Generator matrix

- Encoding problem: Given parameters n、k, how to determine based on k  information bits n-k  parity bits
- **Generator matrix** G

  - Code word C1∗n=m1∗kGk∗nC\_{1\*n}=m\_{1\*k}G\_{k\*n}C1∗n​=m1∗k​Gk∗n​
  - m={m1,..,mk}m = \{m\_1,..,m\_k\}m={m1​,..,mk​}
  - G The ** preceding ** k  rows and  k  columns of the code form an identity matrix.
- Systematic encoding of the code

  - There is no essential difference between non-systematic codes and systematic codes. The generator matrix can be transformed into a systematic code form through elementary row operations, without changing the code rate.
  - It will change the encoding results, so after using systematic  H  to obtain  G , you should still adjust according to the order of each column in  H  before systematization. G
- **Parity-check matrix** H

  - C1∗n∗H(n−k)∗nT=01∗(n−k)C\_{1\*n}\*H\_{(n-k)\*n}^T=0\_{1\*(n-k)}C1∗n​∗H(n−k)∗nT​=01∗(n−k)​
  - H The ** subsequent ** r  rows and  r  columns of the parity-check matrix form an identity matrix (r=n-k）
  - Each row represents a ** parity check equation **: describing the correspondence between each parity bit and information bits, which sum to  ->  0
- Relationship between the generator matrix and the parity-check matrix:GHT=0T→GH^T=0^T \rightarrowGHT=0T→ $ \left{\begin{aligned} \mathbf{G}*{S} &=\left[\begin{array}{ll}\mathbf{I}* & \mathbf{Q}*{k \times r}\end{array}\right] \ \mathbf{H}* &=\left[\begin{array}{ll}\left(-\mathbf{Q}*{k \times r}\right)^{T} & \mathbf{I}*\end{array}\right] \end{aligned}\right. $

  - HHH The first part of the generator matrix under  GF(2)  is given by QTQ^TQT
- The information bits of a code can be viewed as the parity-check bits of its **dual code**. The generator matrix of the (7, 3) code is the parity-check matrix of the (7, 4) code.
- The error-correcting capability of block codes is limited, constrained by the minimum Hamming distance.

## Q Decoding on a symmetric channel.

- Decoding criteria: Maximum likelihood decoding  =  Minimum Hamming distance decoding.
  - Maximize the channel transition probability. $ p(\mathbf{y} \mid \mathbf{x})=p(\mathbf{Z}) =(1-(p-1) \varepsilon)^{n}\left(\frac{\varepsilon}{1-(p-1) \varepsilon}\right)^{W\_{H}(\mathbf{y}-\mathbf{x})} $
- Syndrome decoding.
  - Syndrome:$ S^T=H Y{T}=H\left(X+Z^{T}\right)=H Z^{T} $
    - ZZZ is the **error pattern**; a 1 at a position indicates an error in that position.
      - The syndrome is determined solely by the error pattern.
      - For binary codes, the syndrome is the sum of the columns in the parity-check matrix  HHH  corresponding to the erroneous bits.
    - For a given error pattern  ZZZ , the number of corresponding syndrome  ST=HYTS^T=HY^TST=HYT  associated with the ** error pattern ** is equal to the number of ** allowable codewords **, both being 2k2^k2k
      - Because the syndromes of  Zm=Xm+Z ∣ m∈[1,2k]Z\_m=X\_m+Z \ | \ m \in [1, 2^k]Zm​=Xm​+Z ∣ m∈[1,2k]  are all identical SmT=H(Xm+Z)T=HZTS^T\_m=H(X\_m+Z)^T=HZ^TSmT​=H(Xm​+Z)T=HZT
    - The number of correct decoding cases equals the number of syndromes; when calculating the probability ** of correct decoding **, first focus on the syndrome
  - Decoding process
    1. Calculate the syndrome  $ s=H Y^{T} $ to determine the error pattern
    2. Given the syndrome $ s $ find the most likely error pattern, i.e., the corresponding weight $ W\_{H}(Z) $ of the error pattern $ Z\_{0} $, such that $ p\left(Z\_{0}\right) $ is maximized
    3. Output $ \hat{X}=Y-Z\_{0} $

## Basic theorem in standard array decoding

- Decoding rule

  - The number of codewords  $ 2^{\mathrm{k}} $ divides the  $ 2^{\mathrm{n}} $  possible received vectors into  $ 2^{\mathrm{k}} $  mutually disjoint subsets  $ D\_{\mathrm{i}} $ $ \left(\mathrm{i}=1,2, \cdots, 2^{\mathrm{k}}\right) $ , such that each codeword  $ \mathrm{v}*{\mathrm{i}} $  is contained in one of the subsets  $ \mathrm{D}*{\mathrm{i}} $ , establishing a one-to-one correspondence between each subset and a codeword
  - If the received vector  $ r $  is in  $ D\_{i} $ , then  $ r $  is decoded as column  $ v\_{i} $; decoding is correct if and only if  $ r $  lies in the subset  $ D\_{i} $  corresponding to the transmitted codeword.
- Standard array

  - Valid codewords: In the first row of the standard array, these are the codewords corresponding to  $ 2^k $  information bits; all  0  valid codewords are arranged on the far left.
  - Invalid codewords: Erroneous codewords, specifically the  2n−2k2^n-2^k2n−2k  codewords outside the set of valid codewords.
  - Coset: Admissible Codewords XXX To add**Coset Leader** z0z\_0z0​ Forming a New Set of Codewords (Each Row is a Coset)

    - The forbidden codeword corresponding to each valid codeword in the all-zero first column is the **coset leader** (the all-zero valid codeword is also the first codeword of the coset leader).
    - The number of rows in the coset and the number of syndromes are both  2n−k2^{n-k}2n−k, and the coset leaders should be set according to ** syndrome **
  - Prioritize matching invalid codewords with the minimum weight; the valid codeword in the corresponding column is the decoding result.

## Minimum distance and error-correction capability

- Code  $ C=\left{x\_{1}, x\_{2}, \cdots, x\_{M}\right} $  can correct all errors with a number of non-zero elements less than or equal to  $ \mathrm{t} $   zzz if and only if $ t \leq\left|\frac{d\_{\min }-1}{2}\right| $
- Let CCC be a linear block code,HHH be its parity-check matrix, then CCC can correct**single**error-correcting code's**necessary and sufficient condition**is (1)(1)(1) HHH has no column vector consisting entirely of 0 and any two column vectors of (2)(2)(2) HHH are distinct
- The binary Hamming code  $ \left(2r-1,2r-1-r\right) $ ——  is a linear code capable of correcting all single errors.
  - Among all binary linear codes with  rrr  parity bits, it has the highest coding efficiency.
  - The minimum weight is  3 (Hamming codes can only correct three errors).
  - The columns of the parity-check matrix are HHH the rrr distinct linearly independent non-zero bit combinations 2r−12^r-12r−1 of 0 the

# 8. Low-Density Parity-Check Codes LDPC

## Overview

- LDPC Code Definition
  - Each row represents a parity-check equation constraint, containing  p  code symbols; each row contains  p   1 (far fewer than the number of columns). n）
  - Each column represents a code symbol participating in  r  parity-check equations; each column contains  r   1 (far fewer than the number of rows). l）
  - Any two parity-check equations share at most one common codeword symbol, and no two rows / and two columns have more than one identical position. 1
- LDPC A code is a linear block code with the low-density property of a parity-check code.
  - Low density: The sparse characteristic of the parity-check matrix  —— H  contains fewer  1  elements.
  - Supplement: Underdetermined   Well-determined   Overdetermined
    - An underdetermined system has infinitely many solutions, with fewer equations than unknowns.
    - When the unknowns are sparse, an underdetermined system is solvable.
- LDPC Approaching the Shannon limit C=Wlog(1+SNR)C=Wlog(1+SNR)C=Wlog(1+SNR)
- Regular LDPC (n, r, p)
  - p Null space of the  r -constant  H  matrix
  - Each row has  p  elements 1
  - Each column has  r  elements 1

## Tanner Tanner graph encoding

- Tanner Graph
  - The parity-check matrix constructs a bipartite graph with two vertex sets: the symbol vertex set (columns) on top and the check node set (rows) on the bottom
  - A check node represents a parity-check equation. When a check node  sjs\_jsj​  contains a code bit  viv\_ivi​ , the corresponding symbol node and check node are connected by an edge
  - LDPC Any cycle of length  L  in the code satisfies  L≥6L\geq6L≥6 , and  LLL  is a multiple of  2 
    - Any two parity-check equations share at most one common code bit.  -> LLL  cannot be 4
  - We want more large cycles and fewer small cycles
    - The symbols forming the cycle must not allow all- 1  or all- 0  configurations to be checked
    - LLL The larger it is, the smaller the probability that the code bits are all  1  or all  0 
- Construction
  - Gallaer Construction: Column permutation via computer search
  - Code construction method based on row and column splitting of /

## Bit-flipping decoding

- Decoding process
  1. Compute all parity checks; if all parity checks are  0 , stop decoding
  2. For each bit of the received sequence iii, calculate the number of parity check equations containing that bit**that are in error, denoted as**. fif\_ifi​
  3. Select bits where  fif\_ifi​  exceeds parameter  σ\sigmaσ  to form set  SSS, then flip the bits in  SSS 
  4. Repeat steps  1-4  until all parity checks equal  0  or the maximum number of iterations is reached
- First draw the  Tanner  graph, then observe  fif\_ifi​  for more intuitive understanding
- Intermediate steps may be incorrectly flipped; if  σ\sigmaσ  is chosen well, it is more likely to correct all intermediate step errors in the end.

# 9. Network Information Theory

​ Network  ——  many-to-many channel  ——  considers the problem of communication between multiple nodes.

​ Problem solved: Distributed source coding (data compression), distributed communication (finding the network capacity region).

​ Compression should not only consider the redundancy of the current signal itself but can also leverage correlations among multiple users to jointly compress them.

## Multi-user channel

- Multiple domains: time  TDMA, frequency  FDMA, code  CDMA, space. SDMA
  - The wider the symbol / (time) width, the narrower the spectral bandwidth.
- Core problem of signal processing.
  - Noise handling:y(t)=s(t)+v(t)y(t) = s(t) + v(t)y(t)=s(t)+v(t)
  - Multi-user separation:y(t)=∑isi(t)+v(t)y(t) = \sum\_is\_i(t) + v(t)y(t)=∑i​si​(t)+v(t)
- Channel transfer matrix: describes the mutual interference and noise interference between multiple users / nodes
- Multi-user channel
  - Channel capacity  C  — The boundary of the region in multi-dimensional space; when the information transmission rate is within the region, effective coding exists
  - Problem: Find the ** channel capacity region **——  to determine the ** boundary ** of the region in multi-dimensional space; when the information transmission rate is within the channel capacity region, effective coding exists
- Generalized channel capacity: In a communication network, all sources transmit information error-free at transmission rates lower than the channel capacity (as 𝑛→∞)
- Joint typicality
  - The probability that randomly selected sequence pairs are jointly typical is approximately $ 2^{-n I(X ; Y)} $
  - X:2nH(X)X: 2^{nH(X)}X:2nH(X)  n  typical sequences of length n
  - Y:2nH(Y)Y: 2^{nH(Y)}Y:2nH(Y)  n  typical sequences of length n
  - XY:2nH(XY)XY: 2^{nH(XY)}XY:2nH(XY) A typical sequence of length  n 

## Multiple-access channel

- Definition: Multiple sources to a single destination, with no cooperation among the sources for / communication
- Objective:

  - To maximize the error-free transmission rate from multiple sources to the destination
  - Analyze the relationship between  $ I\left(X\_{1} X\_{2} ; Y\right) $  and each source's transmission rate  R1，R2 , as well as the corresponding encoding and decoding methods
- Channel capacity region: A transmission rate vector is achievable (as the codeword length approaches infinity, the bit error rate approaches 0) 0）
- $ I\left(X\_{1} X\_{2} ; Y\right) $ Is the multiple-access ** channel transmission rate **, , but it cannot be directly maximized on  $ p\left(x\_{1}, x\_{2}\right) $ , because this requires  X1  and  X2  to communicate with each other (conditional: $ X\_{1} \perp X\_{2} $ ）
- Inter-user interference: Each source needs to handle the noise between the source and the destination, but each source must treat ** from other sources as noise ** for processing
- Multiple-access channel

  - Discrete memoryless multiple-access channel code  $ \operatorname{MAC}\left(\left(2^{n R\_{1}}, 2^{n R\_{2}}\right), n\right) $ 
  - Theorem  ——  The capacity region of the multiple-access channel is the closure of the set of all achievable ** rate pairs **  $ \left(R\_{1}, R\_{2}\right) $  satisfying the following inequalities:

    R1≤I(X1;Y∣X2)=H(X1∣X2)−H(X1∣X2Y)R2≤I(X2;Y∣X1)=H(X2∣X1)−H(X2∣X1Y)R1+R2≤I(X1,X2;Y)=H(X1X2)−H(X1X2∣Y)\begin{array}{c}
    R\_{1} \leq I\left(X\_{1} ; Y \mid X\_{2}\right) = H(X\_1|X\_2) - H(X\_1|X\_2Y) \\
    R\_{2} \leq I\left(X\_{2} ; Y \mid X\_{1}\right) = H(X\_2|X\_1) - H(X\_2|X\_1Y) \\
    R\_{1}+R\_{2} \leq I\left(X\_{1}, X\_{2} ; Y\right) = H(X\_1X\_2) - H(X\_1X\_2|Y)
    \end{array}
    R1​≤I(X1​;Y∣X2​)=H(X1​∣X2​)−H(X1​∣X2​Y)R2​≤I(X2​;Y∣X1​)=H(X2​∣X1​)−H(X2​∣X1​Y)R1​+R2​≤I(X1​,X2​;Y)=H(X1​X2​)−H(X1​X2​∣Y)​

    - Describes the three edges of the capacity region on the coordinate axes formed by  R1 R2 
    - Chain rule:H(XY)=H(X)+H(Y∣X)H(XY)=H(X)+H(Y|X)H(XY)=H(X)+H(Y∣X)

      ​ --> $ \begin{aligned} I\left(X\_{1}, X\_{2} ; Y\right) &=I\left(X\_{1} ; Y\right)+I\left(X\_{2} ; Y \mid X\_{1}\right) = I\left(X\_{2} ; Y\right)+I\left(X\_{1} ; Y \mid X\_{2}\right) \end{aligned} $

      ​ --> $ I\left(X\_{1}, X\_{2} ; Y\right) \geq \max \left{I\left(X\_{1} ; Y \mid X\_{2}\right), I\left(X\_{2} ; Y \mid X\_{1}\right)\right}$
    - X1 and X2 are **independent**: I(X1;Y∣X2)=I(X1;YX2)I\left(X\_{1} ; Y \mid X\_{2}\right)=I(X\_1;YX\_2)I(X1​;Y∣X2​)=I(X1​;YX2​)
    - **Conclusion**：$ \max \left{I\left(X\_{1} ; Y \mid X\_{2}\right), I\left(X\_{2} ; Y \mid X\_{1}\right)\right} \leq I\left(X\_{1}, X\_{2} ; Y\right) \leq I\left(X\_{1} ; Y \mid X\_{2}\right)+I\left(X\_{2} ; Y \mid X\_{1}\right) $

      - The left inequality indicates that the figure below is generally not a triangle
      - The right inequality indicates that the figure below is generally not a quadrilateral (equality holds when ** and ** are independent)
  - Four corner points and channel capacity:

    - $ C\_{1}=\max *{p*\left(x\_{1}\right) p\_{2}\left(x\_{2}\right)} I\left(X\_{1} ; Y \mid X\_{2}\right) $
    - $ C\_{2}=\max *{p*\left(x\_{1}\right) p\_{2}\left(x\_{2}\right)} I\left(X\_{2} ; Y \mid X\_{1}\right) $
    - $ C\_{12}=\max *{p*\left(x\_{1}\right) p\_{2}\left(x\_{2}\right)} I\left(X\_{1} X\_{2} ; Y\right) $
  - [Image omitted: third-party image]
- Calculation process

  1. Iterate over H(X2)=0H(X\_2)=0H(X2​)=0 that P(X2)P(X\_2)P(X2​), let I(X1;Y∣X2)I(X\_1;Y|X\_2)I(X1​;Y∣X2​) achieve the maximum value
     - After fixing  X2X\_2X2​ , provide a new channel matrix and use the method from Chapter 4 to find a  P(X1)P(X\_1)P(X1​)  such that  RRR  reaches the channel capacity. CCC
  2. Fix the  X1X\_1X1​ obtained above, and use the same method to find the one that maximizes  I(X2;Y)I(X\_2;Y)I(X2​;Y) , P(X2)P(X\_2)P(X2​)
     - By using  R1+R2≤I(X1X2;Y)≤R(Y)R\_1+R\_2 \leq I(X\_1X\_2;Y) \leq R(Y)R1​+R2​≤I(X1​X2​;Y)≤R(Y), calculate  R(Y)R(Y)R(Y)  to quickly determine whether  I(X2;Y)I(X\_2;Y)I(X2​;Y)  is 0
  3. I(X1X2;Y)=I(X2;Y)+I(X1;Y∣X2)I(X\_1X\_2;Y) = I(X\_2;Y) + I(X\_1;Y|X\_2)I(X1​X2​;Y)=I(X2​;Y)+I(X1​;Y∣X2​)
  4. Use the same method as for  1、2  to find the other two points.
- Binary Symmetric Channel  ——  quadrilateral,

  - [Image omitted: third-party image]
- Binary Multiplication Channel  Y=X1X2Y=X\_1X\_2Y=X1​X2​ ——  triangle,C1=C2=1C\_1=C\_2=1C1​=C2​=1

  - [Image omitted: third-party image]
- Binary Erasure Multiple Access Channel  Y=X1+X2Y=X\_1+X\_2Y=X1​+X2​ ——  pentagon,C1=C2=1C\_1=C\_2=1C1​=C2​=1，C12=log3=1.5C\_{12}=log3=1.5C12​=log3=1.5

  - [Image omitted: third-party image]
- MAC Achievability Theorem

## Gaussian Multiple Access Channel

- Gaussian multiple-access channel

  - $ Y=g\_{1} X\_{1}+g\_{2} X\_{2}+Z $ where  $ g\_{i} $  is the channel gain and $ Z $  is Gaussian noise
  - At transmission time  $ i $,  Yi=g1Xi1+g2Xi2+ZiY\_{i}=g\_{1} X\_{i}^{1}+g\_{2} X\_{i}^{2}+Z\_{i}Yi​=g1​Xi1​+g2​Xi2​+Zi​，$ Z\_{i} $  is independent of the channel input.
  - The average power of the signal  P1、P2  is constrained
  - Define the channel capacity function  $ C(S) \triangleq \frac{1}{2} \log (1+S) $，  where  $ S $  is the signal-to-noise ratio
  - The upper bound can be expressed as (with noise power normalized to 1）
    - $ R\_{1} \leq C\left(\frac{P\_{1}}{N}\right)=C\left(S\_{1}\right) $
    - $ R\_{2} \leq C\left(\frac{P\_{2}}{N}\right)=C\left(S\_{2}\right) $
    - $ R\_{1}+R\_{2} \leq C\left(\frac{P\_{1}+P\_{2}}{N}\right)=C\left(S\_{1}+S\_{2}\right) $
- Decoding is considered in two steps

  - The receiver treats transmitter  1  as part of the noise, and first decodes the codeword of transmitter  2 
    - $ C\_{12} - C\_1 = C\left(\frac{P\_{2}}{P\_{1}+N}\right) ，，，R\_2$ If less than this value, the error probability can be made arbitrarily small
  - Subtract the successfully decoded transmitter  2 
    - If  R1≤C(P1N)R\_{1} \leq C\left(\frac{P\_{1}}{N}\right)R1​≤C(NP1​​) , then correct decoding is possible
- Commonly adopts**time division multiplexing**communication method, but this method is not the optimal solution

  - Either  1  transmits, or  2  transmits
  - If each transmitter occupies **half** of the transmission time, the achievable capacity region is a **triangle truncated from the original region**
  - When only one user transmits, the power can be increased:
    - $ R\_{1} \leq \frac{\alpha}{2} \log \left(1+\frac{P\_{1}}{\alpha \sigma^{2}}\right) $
    - $ R\_{2} \leq \frac{(1-\alpha)}{2} \log \left(1+\frac{P\_{2}}{(1-\alpha) \sigma^{2}}\right) $
    - α\alphaα  1  represents the proportion of transmission time occupied
    - In this case, the shape is similar to a sector, where $ \alpha=\frac{P\_{1}}{P\_{2}+P\_{1}} $  is the tangent point between the sector and the pentagon
- For ** frequency division multiplexing ** communication systems, the transmission rate of each transmitter depends on the bandwidth allowed for transmission

  - $ R\_{1} \leq \frac{W\_{1}}{2} \log \left(1+\frac{P\_{1}}{W\_{1} N\_{0}}\right) $
  - $ R\_{2} \leq \frac{W\_{2}}{2} \log \left(1+\frac{P\_{2}}{W\_{2} N\_{0}}\right) $
  - Total bandwidth W=W1+W2W=W\_1+W\_2W=W1​+W2​
  - The shape is also similar to a sector
- Under**the same average power constraint,**Time Division Multiple Access (TDMA) and**Frequency Division Multiple Access (FDMA)**achieve information transmission rates that are both**less than**the theoretical capacity region, but can both achieve the rate**at**the maximum value**(tangent point) given by the theoretical capacity region, while**Code Division Multiple Access (CDMA)**achievable rate region is consistent with**the theoretical capacity**region.**Under**the same average power constraint,**Time Division Multiple Access (TDMA) and Frequency Division Multiple Access (FDMA) achieve information transmission rates that are both less than the theoretical capacity region, but can both achieve the rate at the maximum value (tangent point) given by the theoretical capacity region, while Code Division Multiple Access (CDMA)'s achievable rate region is consistent with the theoretical capacity region.
- [Image omitted: source image unavailable]

## Correlated source coding

- Shannon's first theorem  Rx+Ry≥H(X)+H(Y)R\_{x}+R\_{y} \geq H(X)+H(Y)Rx​+Ry​≥H(X)+H(Y)  is relaxed to $ R\_{x}+R\_{y} \geq H(X, Y) $
- Slepian & Wolf Theorem: When sources are correlated, even when only individual sources can be compressed, the joint entropy can still be achieved.

  - X -> H(X)
  - Y -> H(Y|X) < H(Y)
- Two encoders, one decoder

  - Core: Joint encoding without joint input
- Achievable rate region:

  ​ R1≥H(X∣X)R2≥H(Y∣X)R1+R2≥H(X,Y)\begin{aligned} R\_{1} & \geq H(X \mid X) \\ R\_{2} & \geq H(Y \mid X) \\ R\_{1}+R\_{2} & \geq H(X, Y) \end{aligned}R1​R2​R1​+R2​​≥H(X∣X)≥H(Y∣X)≥H(X,Y)​

# X. Convolutional Codes

## (n, k, m) Convolutional Codes (n, k, m)

- Within the constraint length of convolutional codes, successive groups are closely related; m  represents coding memory.
- Convolutional codes fully utilize the correlation among groups, and n  and  k  can be relatively small numbers
  - Performance is generally better than that of block codes
- Correlation
  - In convolutional codes,  (m+1)∗n(m + 1) \* n(m+1)∗n  code symbols are correlated
    - **Constraint length** nA=n(m+1)n\_A=n(m+1)nA​=n(m+1)
    - 1 bit The maximum number of information bits that can affect the encoder output
  - In block codes,  n  code symbols are correlated
- **Coding efficiency** R=k/nR = k / nR=k/n
  - The ratio of information bits to codeword length
- Encoder
  - Series/Parallel converter: parallelization k Information elements
  - Shift register: stores the most recent  m  group of information bits
  - Add the  m+1  group of information bits by summing each corresponding information element

## Description method

- Circuit diagram

  - Information bits from adjacent time intervals are tapped to obtain codewords
  - Tap coefficients determine which information bits are summed
- Generates sequence / generator polynomial ggg

  - Generator polynomial: determines the relationship between the generated codeword and the  m+1m+1m+1  group of information bits
  - The input is **convolved** with the generator to obtain the encoded output
    - Equivalent to shifting the generator according to the position of  1  in the input sequence, and summing all shift results
  - Multiple output streams obtained from convolution with multiple generators are interleaved by ** and **, then merged into a single stream
    - For example, interleaving  (1,2,3)(1,2,3)(1,2,3)  and  (4,5,6)(4,5,6)(4,5,6)  yields (14,25,36)(14,25,36)(14,25,36)
- Generator matrix GGG

  - The first row is nnn a generator**interleaved**sequence, each subsequent row is**identical to**the preceding row (all complete), but shifted right by nnn positions
  - If the input sequence  u  is infinitely long, then  G  is a semi-infinite matrix
  - By dividing  G  into groups of  nnn  columns via interleaving and multiplying the input sequence by  G, the same result as convolution with the generator can be obtained
- Generator polynomial

  - The power of the delay operator  DDD  represents the number of time units delayed for a specific bit in the sequence relative to the starting bit
    - DDD One delay corresponds to D2D^2D2 ; two delays correspond to …
  - Generation Process
    1. Write the generator polynomial  u(D)u(D)u(D) of the input sequence, and the generator polynomial matrix G(D)G(D)G(D)
    2. Solve  v(D)=u(D)G(D)v(D)=u(D)G(D)v(D)=u(D)G(D) using modulo-2 addition
    3. Convert  v(D)v(D)v(D)  into an interleaved codeword
- State Diagram

  - A state diagram is a graph that reflects the state transition relationships of the ** register ** in the encoder. It describes the encoding process by using the states of the registers in the encoder and their transitions as they change with the input sequence.
  - First, determine the state transition equation and the output equation
  - State Transition Table
    - Record the next state to which each ** state ** will transition under different ** inputs **, as well as the corresponding output codeword.
      - The state refers to the previous  mmm  inputs, understood as the current value of the registers
      - Each column represents an input, and each row represents a state.
      - (i,j)(i,j)(i,j) An element indicates that when the state is  σj\sigma\_jσj​  and input  uiu\_iui​  is applied, it transitions to the next state, along with the corresponding encoded output.
  - Trellis diagram
    - Any encoded output sequence corresponds to a unique path in the trellis diagram.
    - Different inputs result in different paths; however, paths cannot be drawn arbitrarily but must satisfy the state transition branches.

## Viterbi decoding algorithm

- **Maximum likelihood ** decoding principle
  - Minimize Hamming distance
  - Clarify the relationship between maximum likelihood and joint typicality?
- In**the grid graph**'s**all paths**find the one with the minimum Hamming distance between the encoded output sequence and the received sequence
  - Draw the grid diagram layer by layer, accumulating the Hamming distance along the path.
    - The state metric is the Hamming distance of the path.
  - If multiple paths reach a point in the grid diagram, retain the one with the smallest Hamming distance.
