---
title: "ALOHA 协议中的吞吐量估计方法整理"
date: "2022-10-23"
description: "推导并比较基础 ALOHA、时隙 ALOHA 与基于 MBAA 的系统吞吐量模型。"
tags: ["aloha","wireless-networking"]
categories: ["Networking"]
locale: "zh"
slug: "aloha-throughput-estimation"
sourceId: "post-5c200664e6cba96d"
translationKey: "post-5c200664e6cba96d"
generated: true
draft: false
---
# ALOHA 协议中的吞吐量估计

> ALOHA[1]^{[1]}[1] 协议：在无线信道中，有请求到达就直接发送，不关心信道占用情况，也不关心分组送达情况。
>
> 吞吐量 SSS：单位时间内成功传输的分组的平均数目。

## 一、课件中的吞吐量估测方法

### 1.1 研究假设

​ 《无线互联网》课程的第五章中，对 ALOHA 协议对应用场景进行了比较强的假设，该假设不具有一般性。

​ 首先，假设 ALOHA 传输的分组为定长，也就是将分组传输的时延定义为**单位时间**。

​ 其次，假设所有通信节点都在一条直线上分布，一头一尾两个最远的通信站之间相距 η\etaη，并将“单位时间内电磁波传播的距离”定义为**单位距离**。最大传输时延=η÷1=η最大传输时延 = \eta \div 1 = \eta最大传输时延=η÷1=η。

​ 然后，假设分组传送请求的发出节点所处的位置为[0,η][0,η][0,η]内均匀分布的独立随机变量。

​ 最后，假设分组传送请求的到达过程为泊松过程，平均速率为 GGG 。

### 1.2 研究方法

​ 基于上述假定条件，可以使用时空分布模型对 ALOHA 协议的请求到达过程进行建模。

​ 时空分布模型以时间 ttt 为横坐标、空间距离 ddd 为纵坐标，单位时间为分组传输的时延，单位距离为单位时间内电磁波传播的距离。图中的每个点 (t,d)(t, d)(t,d) 代表一个在 ttt 时刻在距离为 ddd 的通信站上到达的请求。其中，单位面积表示空间内到达了 G/ηG/\etaG/η 个请求。考虑通信请求的到达是 Poison 过程，则面积 AAA 的区域内到达 nnn 个请求的概率为：

P{N(A)=n}=e−GηA(GηA)nn!\boldsymbol{P}\{\boldsymbol{N}(\boldsymbol{A})=\boldsymbol{n}\}=e^{-\frac{G}{\eta} \boldsymbol{A}} \frac{\left(\frac{\boldsymbol{G}}{\boldsymbol{\eta}} \boldsymbol{A}\right)^{\boldsymbol{n}}}{\boldsymbol{n} !}
P{N(A)=n}=e−ηG​An!(ηG​A)n​

​ 针对时空图上的某个点，也就是一个给定的传输请求，可以画出一个面积为 2η2\eta2η 的锥形空间，处于该锥内的所有其他点都会造成冲突，这就是冲突锥(Collision Cone)。因此，给定传送分组请求，其成功传输的概率可以用冲突锥内到达请求数量为 0 的方式来刻画：

PS=P{N(A)=n}∣A=2η,n=0=e−GηA(GηA)nn!∣A=2η,n=0=e−2GP\_{S}=\left.P\{N(A)=n\}\right|\_{A=2 \eta, n=0}=\left.e^{-\frac{G}{\eta} A} \frac{\left(\frac{G}{\eta} A\right)^{n}}{n !}\right|\_{A=2 \eta, n=0}=e^{-2 G}
PS​=P{N(A)=n}∣A=2η,n=0​=e−ηG​An!(ηG​A)n​∣∣∣∣∣∣∣​A=2η,n=0​=e−2G

​ 吞吐量可以被描述为单位时间的到达分组数乘上成功传输率，即：

S=GPS=Ge−2GS=G P\_{S}=G e^{-2 G}
S=GPS​=Ge−2G

### 1.3 理论吞吐性能

​ 在基础 ALOHA 协议中，针对上一小节中提到的吞吐量计算公式，可以得到其最有值：当 G=0.5G = 0.5G=0.5 时，有 Smax=1/2e=0.18S\_{max} = 1/2e = 0.18Smax​=1/2e=0.18。

​ 一种改善方法，是要求网络节点只在每个时隙的开始时刻才能发送数据，这就是 Slotted-ALOHA 协议。假定时隙长度为 1+η1+\eta1+η，即传输时延和传播时延之和，有冲突锥面积 A=η∗(1+η)A = \eta \* (1+\eta)A=η∗(1+η)。代入前述吞吐量计算公式可得 S-ALOHA 的理论最优吞吐量：

PS=e−G(1+η) P\_{S}=e^{-G(1+\eta)}
PS​=e−G(1+η)

S=GPS=Ge−G(1+η) S=G P\_{S}=G e^{-G(1+\eta)}
S=GPS​=Ge−G(1+η)

Smax⁡=1e(1+η)S\_{\max }=\frac{1}{e(1+\eta)}
Smax​=e(1+η)1​

​ 在通信过程中，传播时延 = 传播距离 / 无线信号传输速度，ALOHA 协议的应用场景往往不会有太远的通信距离，因此相较于传输时延，传播时延可以忽略不计。这种情况下，Smax=1/eS\_{max}=1/eSmax​=1/e，比基础算法提升了一倍吞吐性能。

## 二、相关论文中 ALOHA 协议的吞吐量计算方法

​ 查阅了几篇 ALOHA 相关文献，在 [High Throughput Slotted ALOHA Packet Radio Networks with Adaptive Arrays](https://ieeexplore.ieee.org/abstract/document/221075)[2]^{[2]}[2] 一文中作者对 ALOHA 协议的吞吐量进行了详细的数学描述。本文将在此粗略解读该文献的相关部分，并将之与课件中的吞吐量计算方式进行对比。

### 2.1 使用 MBAA 的 S-ALOHA 协议

​ 多波束自适应队列（Multiple-Beam Adaptive Array，MBAA）中，任何波束都可以接收来自任何用户的数据包，每个波束对每个时隙中传输的所有数据包都作出自适应的响应。每个包被一个单独的波束捕获，而不会被其他竞争包干扰。因此，MBAA 系统可以在一个时隙内接收多个包，而不用增加带宽资源，同时在不要求全部站点监听信道的情况下也有类似 CSMA 的性能提升。

​ 一种对 MBAA 通俗的理解是，在接收机中使用多个天线，我们希望用不同的波束来捕获不同的 ALOHA 信息流，于是对各天线的捕获信号进行了加权求和，一组权重对应一种输出模式。通过修改权重值最大化输出端 SINR 的方式，可以让阵列引导波束指向目标信号，并对其他竞争信号无效。如果希望同时捕获多个数据流，只需要在接收机同时维护多套权重队列，每一组权重对应一个波束所捕获的信息流输出。在这种接收模式下，ALOHA 协议可以拥有一定的抗干扰能力，因此**即使时空分布模型的冲突锥内出现多个请求，也不一定会导致传输失败，其吞吐量的计算方式也大不相同**。

### 2.2 研究假设

​ 该文章中，假设有限的 M 个终端将数据包发送到 MBAA 接收机上。每个时隙开始时，各终端的阻塞状态取决于它是否成功传输完毕上一个数据包。在每个时隙的最后，所有终端都能立即收到关于数据包传输情况的反馈。

​ 同时，该论文也进行了单包缓存的假设，即被阻塞的终端直到重传完毕前都不会生成新的报文（到达的报文放在缓存中）。

​ 在每个时隙中，各个未受阻塞的终端都有 pnp\_npn​ 的概率产生新的报文，受阻塞的终端都有 prp\_rpr​ 的概率进行重传。很明显需要 pr≥pnp\_r \geq p\_npr​≥pn​ 才能保障通信系统稳定。

### 2.3 研究方法

​ 基于上述假设，该论文构造出了马尔可夫链 XkX\_kXk​，表示在时隙 kkk 开始时的阻塞终端数，其上限为网络中的终端数量 MMM。

​ 用 nt=nn+nrn\_t=n\_n+n\_rnt​=nn​+nr​ 表示一个给定时隙 ttt 中传输的分组数，nnn\_nnn​ 是新分组数，nrn\_rnr​ 是重传分组数。很明显，新分组数和重传分组数都服从 Bernoulli 分布，有：

Qr(l∣i)=Pr⁡{nr=l∣Xk=i}=(il)prl(1−pr)i−lQ\_{r}(l \mid i)=\operatorname{Pr}\left\{n\_{r}=l \mid X\_{k}=i\right\}=\left(\begin{array}{l}i \\ l\end{array}\right) p\_{r}^{l}\left(1-p\_{r}\right)^{i-l}
Qr​(l∣i)=Pr{nr​=l∣Xk​=i}=(il​)prl​(1−pr​)i−l

Qn(l∣i)=Pr⁡{nn=l∣Xk=i}=(M−il)pnl(1−pn)M−i−l\begin{aligned} Q\_{n}(l \mid i) &=\operatorname{Pr}\left\{n\_{n}=l \mid X\_{k}=i\right\} =\left(\begin{array}{c}M-i \\ l\end{array}\right) p\_{n}^{l}\left(1-p\_{n}\right)^{M-i-l} \end{aligned}
Qn​(l∣i)​=Pr{nn​=l∣Xk​=i}=(M−il​)pnl​(1−pn​)M−i−l​

Qt(l∣i)=Pr⁡{nt=l∣Xk=i}=∑s=0lQn(s∣i)Qr(l−s∣i)Q\_{t}(l \mid i)=\operatorname{Pr}\left\{n\_{t}=l \mid X\_{k}=i\right\}=\sum\_{s=0}^{l} Q\_{n}(s \mid i) Q\_{r}(l-s \mid i)
Qt​(l∣i)=Pr{nt​=l∣Xk​=i}=s=0∑l​Qn​(s∣i)Qr​(l−s∣i)

​ 考虑在使用 KKK 个波束的 MBAA 接收机中，最多可以一次接收 KKK 个分组。因此，给定一个状态为 iii 的系统，下一个状态可能的取值为 j=i−min(i,K),...,i,...,Mj=i-min(i,K),...,i,...,Mj=i−min(i,K),...,i,...,M。于是，可以写出状态转移概率 Pi,j=Pr⁡{Xk+1=j∣Xk=i}P\_{i, j}=\operatorname{Pr}\left\{X\_{k+1}=j \mid X\_{k}=i\right\}Pi,j​=Pr{Xk+1​=j∣Xk​=i}：

Pi,j=0;i=K+1,⋯ ,M,j<i−K P\_{i, j}=0 ; \quad i=K+1, \cdots, M, \quad j<i-K
Pi,j​=0;i=K+1,⋯,M,j<i−K

Pi,i−t=∑m=0K−tQn(m∣i)∑l=tiQr(l∣i)Ps(m+t∣l+m,K)i=1,⋯ ,M,t=1,⋯ ,min⁡(i,K) \begin{aligned} P\_{i, i-t}=& \sum\_{m=0}^{K-t} Q\_{n}(m \mid i) \sum\_{l=t}^{i} Q\_{r}(l \mid i) P\_{s}(m+t \mid l+m, K) \\ i &=1, \cdots, M, \quad t=1, \cdots, \min (i, K) \end{aligned}
Pi,i−t​=i​m=0∑K−t​Qn​(m∣i)l=t∑i​Qr​(l∣i)Ps​(m+t∣l+m,K)=1,⋯,M,t=1,⋯,min(i,K)​

Pi,i+t=∑m=tK+tQn(m∣i)∑l=0iQr(l∣i)Ps(m−t∣l+m,K)i=0,⋯ ,M,t=0,1,⋯ ,M−i\begin{aligned} P\_{i, i+t}=& \sum\_{m=t}^{K+t} Q\_{n}(m \mid i) \sum\_{l=0}^{i} Q\_{r}(l \mid i) P\_{s}(m-t \mid l+m, K) \\ & i=0, \cdots, M, \quad t=0,1, \cdots, M-i \end{aligned}
Pi,i+t​=​m=t∑K+t​Qn​(m∣i)l=0∑i​Qr​(l∣i)Ps​(m−t∣l+m,K)i=0,⋯,M,t=0,1,⋯,M−i​

​ 于是就能获得马尔可夫链 XkX\_kXk​ 的转移概率矩阵 P=[Pi,j]\boldsymbol{P}=[P\_{i,j}]P=[Pi,j​]。通过求解 π=πP\boldsymbol{\pi}=\boldsymbol{\pi P}π=πP ，获得其极限概率分布 π=[π(0),π(1),⋯ ,π(M)]\boldsymbol{\pi}=[\pi(0), \pi(1), \cdots, \pi(M)]π=[π(0),π(1),⋯,π(M)]，于是就能求得 iii 个阻塞终端时的吞吐量 S(i)S(i)S(i)：

S(i)=∑m=1KmPr⁡{m packets are successful ∣Xk=i}=∑m=1Km∑l=mMQt(l∣i)Ps(m∣l,K)\begin{aligned}
S(i) &=\sum\_{m=1}^{K} m \operatorname{Pr}\left\{m \text { packets are successful } \mid X\_{k}=i\right\} \\
&=\sum\_{m=1}^{K} m \sum\_{l=m}^{M} Q\_{t}(l \mid i) P\_{s}(m \mid l, K)
\end{aligned}
S(i)​=m=1∑K​mPr{m packets are successful ∣Xk​=i}=m=1∑K​ml=m∑M​Qt​(l∣i)Ps​(m∣l,K)​

​ 平均吞吐量为 Sˉ=∑i=0MS(i)π(i)\bar{S}=\sum\_{i=0}^{M} S(i) \pi(i)Sˉ=∑i=0M​S(i)π(i)，平均阻塞终端数为 Bˉ=∑i=0Miπ(i)\bar{B}=\sum\_{i=0}^{M} i \pi(i)Bˉ=∑i=0M​iπ(i)。在稳定的状态下，系统的平均到达率等于平均服务率，也就是每个时隙开始时的吞吐量刚好和新的报文生成量相同。于是可以将新包经历的平均时延表示为 Dˉ=BˉSˉin =BˉSˉ\bar{D}=\frac{\bar{B}}{\bar{S}\_{\text {in }}}=\frac{\bar{B}}{\bar{S}}Dˉ=Sˉin ​Bˉ​=SˉBˉ​。

## 三、总结与评价

​ 不难看出，课件中给出的假设条件过于理想，要求各分组为定长，所有通信站点在一条直线上排布，考虑任意站点的信号都能被其他站点接收，当冲突锥内出现任何数据报就直接认定传输失败。现实中，常见的通信协议往往采用的是变长分组，并且站点都是在立体空间中分散的，几乎很难遇到直线排布的情况。另一方面，无线环境远比假设的复杂，即使两个站点间无法互相通信，它们也是可能产生干扰的。因此，使用冲突锥建模的方法虽然简单直观，但比较偏离无线网络环境的实际情况，其结果可能与测量值存在较大偏差。

​ 对比之下，参考论文中的假设相对合理，避开了关于分组长度、站点空间位置的假设，主要是对站点的重传策略进行了假设：要求站点在重传成功前一直处于阻塞状态，这期间不会传输新的数据报文，并且重传不会退避，将一直进行传输。这一假设在该文章的背景下也有其道理，毕竟使用 MBAA 的 S-ALOHA 协议在同一时隙内接收机可以同时接收多组报文。另一方面，该论文并不直接考虑报文间的冲突，而是将每个时隙因冲突而阻塞的站点数量看做一个随机变量，并证明该随机变量能构成马尔可夫链。于是，就能有效规避很多麻烦的建模，只用计算马尔可夫过程的状态转移方程，就能获得该链的极限状态分布，进而求得各状态的吞吐量与系统的平均吞吐量。总的来说，该论文在建模中的假设更加贴合真实环境，并通过建模随机过程来避免考虑如何发生冲突，而是将冲突本身看做随机变量，其理论结果也更有说服力。

## 参考文献参考文献参考文献

[1] Abramson N. The ALOHA system: Another alternative for computer communications[C]//Proceedings of the November 17-19, 1970, fall joint computer conference. 1970: 281-285.

[2] J. Ward and R. T. Compton, “High throughput slotted ALOHA packet radio networks with adaptive arrays,” in IEEE Transactions on Communications, vol. 41, no. 3, pp. 460-470, March 1993, doi: 10.1109/26.221075.

[3] M. S. Gokturk, O. Ercetin and O. Gurbuz, “Throughput Analysis of ALOHA with Cooperative Diversity,” in IEEE Communications Letters, vol. 12, no. 6, pp. 468-470, June 2008, doi: 10.1109/LCOMM.2008.080174.
