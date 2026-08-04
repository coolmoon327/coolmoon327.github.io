---
title: "ALOHA Throughput Estimation Methods"
date: "2022-10-23"
description: "A derivation and comparison of throughput models for basic ALOHA, Slotted ALOHA, and an MBAA-based system."
tags: ["aloha","wireless-networking"]
categories: ["Networking"]
locale: "en"
slug: "aloha-throughput-estimation"
sourceId: "post-5c200664e6cba96d"
translationKey: "post-5c200664e6cba96d"
generated: true
draft: false
---
# Throughput Estimation for the ALOHA Protocol

> ALOHA[1]^{[1]}[1] Protocol: In a wireless channel, requests are transmitted immediately upon arrival, without regard for channel occupancy or packet delivery status.
>
> Throughput  SSS: The average number of packets successfully transmitted per unit time.

## I. Throughput Estimation Method in Courseware

### 1.1 Research Hypotheses

​ In Chapter 5 of the "Wireless Internet" course, strong assumptions are made regarding the application scenarios for the  ALOHA  protocol; these assumptions lack generality.

​ First, assume that the packets transmitted by  ALOHA  are of fixed length, i.e., define the packet transmission delay as ** unit time**。

​ Secondly, assuming all communication nodes are distributed along a straight line, the distance between the two farthest communication stations at either end is  η\etaη, and the 'distance traveled by electromagnetic waves per unit time' is defined as ** units of distance **. Maximum transmission delay =η÷1=η maximum transmission delay  = \eta \div 1 = \eta maximum transmission delay=η÷1=η。

​ Next, assume that the location of the node issuing a packet transmission request is an independent random variable uniformly distributed within [0,η][0,η][0,η].

​ Finally, assume that packet transmission requests arrive according to a Poisson process with an average rate of GGG.

### 1.2 Research Methodology

​ Based on the aforementioned assumptions, a spatiotemporal distribution model can be used to model the request arrival process of the  ALOHA  protocol.

​ The spatiotemporal distribution model uses time ttt as the horizontal axis and spatial distance ddd as the vertical axis. Unit time is the packet transmission delay, and unit distance is the distance an electromagnetic wave travels in one unit of time. Each point (t,d)(t, d)(t,d) represents a request arriving at time ttt at a communication station located at distance ddd. A unit area corresponds to G/ηG/\etaG/η arriving requests. Because requests arrive according to a Poisson process, the probability that an area AAA contains nnn requests is:

P{N(A)=n}=e−GηA(GηA)nn!\boldsymbol{P}\{\boldsymbol{N}(\boldsymbol{A})=\boldsymbol{n}\}=e^{-\frac{G}{\eta} \boldsymbol{A}} \frac{\left(\frac{\boldsymbol{G}}{\boldsymbol{\eta}} \boldsymbol{A}\right)^{\boldsymbol{n}}}{\boldsymbol{n} !}
P{N(A)=n}=e−ηG​An!(ηG​A)n​

​ For a specific point on the spatiotemporal graph—that is, a given transmission request—a conical region with an area of 2η2\eta2η can be drawn. Every other point inside this region causes a collision, so it is called the collision cone (Collision Cone). The probability that a given packet transmission request succeeds can therefore be characterized by the number of requests arriving inside the collision cone being 0:

PS=P{N(A)=n}∣A=2η,n=0=e−GηA(GηA)nn!∣A=2η,n=0=e−2GP\_{S}=\left.P\{N(A)=n\}\right|\_{A=2 \eta, n=0}=\left.e^{-\frac{G}{\eta} A} \frac{\left(\frac{G}{\eta} A\right)^{n}}{n !}\right|\_{A=2 \eta, n=0}=e^{-2 G}
PS​=P{N(A)=n}∣A=2η,n=0​=e−ηG​An!(ηG​A)n​∣∣∣∣∣∣∣​A=2η,n=0​=e−2G

​ Throughput can be described as the number of arriving packets per unit time multiplied by the successful transmission rate, i.e.:

S=GPS=Ge−2GS=G P\_{S}=G e^{-2 G}
S=GPS​=Ge−2G

### 1.3 Theoretical Throughput Performance

​ In the basic  ALOHA  protocol, based on the throughput calculation formula mentioned in the previous subsection, its maximum value can be derived: when  G=0.5G = 0.5G=0.5 , we have Smax=1/2e=0.18S\_{max} = 1/2e = 0.18Smax​=1/2e=0.18。

​ One improvement method requires network nodes to transmit data only at the beginning of each time slot; this is the  Slotted-ALOHA  protocol. Assuming the time slot length is  1+η1+\eta1+η, which is the sum of transmission delay and propagation delay, the collision cone area is  A=η∗(1+η)A = \eta \* (1+\eta)A=η∗(1+η). Substituting into the aforementioned throughput calculation formula yields the theoretical optimal throughput for  S-ALOHA :

PS=e−G(1+η) P\_{S}=e^{-G(1+\eta)}
PS​=e−G(1+η)

S=GPS=Ge−G(1+η) S=G P\_{S}=G e^{-G(1+\eta)}
S=GPS​=Ge−G(1+η)

Smax⁡=1e(1+η)S\_{\max }=\frac{1}{e(1+\eta)}
Smax​=e(1+η)1​

​ During communication, propagation delay = propagation distance / wireless-signal propagation speed. ALOHA applications typically do not involve very long communication distances, so propagation delay can be neglected relative to transmission delay. In this case, Smax=1/eS\_{max}=1/eSmax​=1/e, which doubles the throughput of the basic protocol.

## II. Throughput Calculation Methods for the  ALOHA  Protocol in Related Papers

​ After reviewing several  ALOHA  related papers, the author of  [High Throughput Slotted ALOHA Packet Radio Networks with Adaptive Arrays](https://ieeexplore.ieee.org/abstract/document/221075)[2]^{[2]}[2]  provided a detailed mathematical description of the throughput of the  ALOHA  protocol. This paper will briefly interpret the relevant parts of this literature and compare them with the throughput calculation method presented in the courseware.

### 2.1 S-ALOHA with an MBAA

​ In the Multi-Beam Adaptive Array (Multiple-Beam Adaptive Array，MBAA), any beam can receive packets from any user, and each beam adaptively responds to all packets transmitted in each time slot. Each packet is captured by a single beam and is not interfered with by other competing packets. Therefore, the MBAA  system can receive multiple packets within one time slot without increasing bandwidth resources, while achieving performance improvements similar to  CSMA  without requiring all stations to monitor the channel.

​ One intuitive way to understand an MBAA is to consider a receiver with multiple antennas. Different beams capture different ALOHA information streams, so the signals captured by the antennas are weighted and summed, with each set of weights defining an output mode. Adjusting the weights to maximize output SINR steers a beam toward the target signal while suppressing competing signals. To capture several data streams simultaneously, the receiver maintains several sets of weights, each corresponding to the information stream captured by one beam. In this reception mode, ALOHA gains some interference resistance: **even when several requests lie within the spatiotemporal model's collision cone, transmission does not necessarily fail, and the throughput calculation is therefore substantially different.**

### 2.2 Research Assumptions

​ In this paper, it is assumed that a finite number of  M  terminals send packets to the  MBAA  receiver. At the beginning of each time slot, the blocked status of each terminal depends on whether it has successfully completed the transmission of its previous packet. At the end of each time slot, all terminals immediately receive feedback regarding the packet transmission status.

​ Additionally, the paper assumes single-packet buffering, meaning that blocked terminals do not generate new messages until retransmission is complete (arriving messages are placed in the buffer).

​ In each time slot, each unblocked terminal has a probability of  pnp\_npn​  to generate a new message, and each blocked terminal has a probability of  prp\_rpr​  to retransmit. Clearly,  pr≥pnp\_r \geq p\_npr​≥pn​  is required to ensure the stability of the communication system.

### 2.3 Research Methods

​ Based on the above assumptions, the paper constructs a Markov chain  XkX\_kXk​, representing the number of blocked terminals at the beginning of time slot  kkk , with an upper limit equal to the number of terminals in the network. MMM。

​ Let  nt=nn+nrn\_t=n\_n+n\_rnt​=nn​+nr​  denote the number of packets transmitted in a given time slot  ttt , nnn\_nnn​  be the number of new packets, and nrn\_rnr​  be the number of retransmitted packets. Clearly, both the number of new packets and the number of retransmitted packets follow a  Bernoulli  distribution, yielding:

Qr(l∣i)=Pr⁡{nr=l∣Xk=i}=(il)prl(1−pr)i−lQ\_{r}(l \mid i)=\operatorname{Pr}\left\{n\_{r}=l \mid X\_{k}=i\right\}=\left(\begin{array}{l}i \\ l\end{array}\right) p\_{r}^{l}\left(1-p\_{r}\right)^{i-l}
Qr​(l∣i)=Pr{nr​=l∣Xk​=i}=(il​)prl​(1−pr​)i−l

Qn(l∣i)=Pr⁡{nn=l∣Xk=i}=(M−il)pnl(1−pn)M−i−l\begin{aligned} Q\_{n}(l \mid i) &=\operatorname{Pr}\left\{n\_{n}=l \mid X\_{k}=i\right\} =\left(\begin{array}{c}M-i \\ l\end{array}\right) p\_{n}^{l}\left(1-p\_{n}\right)^{M-i-l} \end{aligned}
Qn​(l∣i)​=Pr{nn​=l∣Xk​=i}=(M−il​)pnl​(1−pn​)M−i−l​

Qt(l∣i)=Pr⁡{nt=l∣Xk=i}=∑s=0lQn(s∣i)Qr(l−s∣i)Q\_{t}(l \mid i)=\operatorname{Pr}\left\{n\_{t}=l \mid X\_{k}=i\right\}=\sum\_{s=0}^{l} Q\_{n}(s \mid i) Q\_{r}(l-s \mid i)
Qt​(l∣i)=Pr{nt​=l∣Xk​=i}=s=0∑l​Qn​(s∣i)Qr​(l−s∣i)

​ Consider a receiver using  KKK  beams in an  MBAA  system, which can receive up to  KKK  packets simultaneously. Therefore, given a system state of  iii , the possible values for the next state are  j=i−min(i,K),...,i,...,Mj=i-min(i,K),...,i,...,Mj=i−min(i,K),...,i,...,M. Thus, the state transition probability can be expressed as Pi,j=Pr⁡{Xk+1=j∣Xk=i}P\_{i, j}=\operatorname{Pr}\left\{X\_{k+1}=j \mid X\_{k}=i\right\}Pi,j​=Pr{Xk+1​=j∣Xk​=i}：

Pi,j=0;i=K+1,⋯ ,M,j<i−K P\_{i, j}=0 ; \quad i=K+1, \cdots, M, \quad j<i-K
Pi,j​=0;i=K+1,⋯,M,j<i−K

Pi,i−t=∑m=0K−tQn(m∣i)∑l=tiQr(l∣i)Ps(m+t∣l+m,K)i=1,⋯ ,M,t=1,⋯ ,min⁡(i,K) \begin{aligned} P\_{i, i-t}=& \sum\_{m=0}^{K-t} Q\_{n}(m \mid i) \sum\_{l=t}^{i} Q\_{r}(l \mid i) P\_{s}(m+t \mid l+m, K) \\ i &=1, \cdots, M, \quad t=1, \cdots, \min (i, K) \end{aligned}
Pi,i−t​=i​m=0∑K−t​Qn​(m∣i)l=t∑i​Qr​(l∣i)Ps​(m+t∣l+m,K)=1,⋯,M,t=1,⋯,min(i,K)​

Pi,i+t=∑m=tK+tQn(m∣i)∑l=0iQr(l∣i)Ps(m−t∣l+m,K)i=0,⋯ ,M,t=0,1,⋯ ,M−i\begin{aligned} P\_{i, i+t}=& \sum\_{m=t}^{K+t} Q\_{n}(m \mid i) \sum\_{l=0}^{i} Q\_{r}(l \mid i) P\_{s}(m-t \mid l+m, K) \\ & i=0, \cdots, M, \quad t=0,1, \cdots, M-i \end{aligned}
Pi,i+t​=​m=t∑K+t​Qn​(m∣i)l=0∑i​Qr​(l∣i)Ps​(m−t∣l+m,K)i=0,⋯,M,t=0,1,⋯,M−i​

​ For the Markov chain XkX\_kXk​, this yields the transition-probability matrix P=[Pi,j]\boldsymbol{P}=[P\_{i,j}]P=[Pi,j​]. Solving π=πP\boldsymbol{\pi}=\boldsymbol{\pi P}π=πP gives the limiting probability distribution π=[π(0),π(1),⋯ ,π(M)]\boldsymbol{\pi}=[\pi(0), \pi(1), \cdots, \pi(M)]π=[π(0),π(1),⋯,π(M)]. The throughput when iii terminals are blocked is S(i)S(i)S(i):

S(i)=∑m=1KmPr⁡{m packets are successful ∣Xk=i}=∑m=1Km∑l=mMQt(l∣i)Ps(m∣l,K)\begin{aligned}
S(i) &=\sum\_{m=1}^{K} m \operatorname{Pr}\left\{m \text { packets are successful } \mid X\_{k}=i\right\} \\
&=\sum\_{m=1}^{K} m \sum\_{l=m}^{M} Q\_{t}(l \mid i) P\_{s}(m \mid l, K)
\end{aligned}
S(i)​=m=1∑K​mPr{m packets are successful ∣Xk​=i}=m=1∑K​ml=m∑M​Qt​(l∣i)Ps​(m∣l,K)​

​ The average throughput is  Sˉ=∑i=0MS(i)π(i)\bar{S}=\sum\_{i=0}^{M} S(i) \pi(i)Sˉ=∑i=0M​S(i)π(i), and the average number of blocked terminals is  Bˉ=∑i=0Miπ(i)\bar{B}=\sum\_{i=0}^{M} i \pi(i)Bˉ=∑i=0M​iπ(i). In a stable state, the system's average arrival rate equals the average service rate, meaning the throughput at the beginning of each time slot exactly matches the volume of newly generated packets. Thus, the average delay experienced by new packets can be expressed as Dˉ=BˉSˉin =BˉSˉ\bar{D}=\frac{\bar{B}}{\bar{S}\_{\text {in }}}=\frac{\bar{B}}{\bar{S}}Dˉ=Sˉin ​Bˉ​=SˉBˉ​。

## III. Summary and Evaluation

​ It is evident that the assumptions provided in the courseware are overly idealized, requiring all packets to be of fixed length, all communication stations to be arranged in a straight line, and assuming that signals from any station can be received by others, with any data packet appearing within the collision cone immediately deemed a transmission failure. In reality, common communication protocols often employ variable-length packets, and stations are distributed in three-dimensional space, making linear arrangements rare. Furthermore, wireless environments are far more complex than assumed; even if two stations cannot communicate directly, they may still interfere with each other. Therefore, although the collision cone modeling approach is simple and intuitive, it deviates significantly from actual wireless network conditions, and its results may differ substantially from measured values.

​ In contrast, the reference paper makes more reasonable assumptions and avoids assumptions about packet length and station locations. Its main assumption concerns retransmission: a station remains blocked until retransmission succeeds, generates no new packet while blocked, and retransmits continuously without backoff. This is reasonable in the paper's setting because an MBAA-based S-ALOHA receiver can receive several packets in the same time slot. Rather than modeling packet collisions directly, the paper treats the number of stations blocked by collisions in each time slot as a random variable and proves that it forms a Markov chain. This avoids much of the difficult collision modeling: solving the Markov process's state-transition equations yields the chain's limiting distribution, from which the throughput in each state and the system's average throughput follow. Overall, the assumptions better reflect a real environment, while treating collisions as random variables produces a more convincing theoretical result.

## References

[1] Abramson N. The ALOHA system: Another alternative for computer communications[C]//Proceedings of the November 17-19, 1970, fall joint computer conference. 1970: 281-285.

[2] J. Ward and R. T. Compton, “High throughput slotted ALOHA packet radio networks with adaptive arrays,” in IEEE Transactions on Communications, vol. 41, no. 3, pp. 460-470, March 1993, doi: 10.1109/26.221075.

[3] M. S. Gokturk, O. Ercetin and O. Gurbuz, “Throughput Analysis of ALOHA with Cooperative Diversity,” in IEEE Communications Letters, vol. 12, no. 6, pp. 468-470, June 2008, doi: 10.1109/LCOMM.2008.080174.
