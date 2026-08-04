---
title: "信息论与编码理论"
date: "2022-10-23"
description: "涵盖熵、信源与信道编码、率失真理论、分组码、LDPC 码和网络信息论的学习笔记。"
tags: ["information-theory","coding-theory"]
categories: ["Study Notes"]
locale: "zh"
slug: "information-theory-and-coding-notes"
sourceId: "post-4db7d1730178fb6b"
translationKey: "post-4db7d1730178fb6b"
generated: true
draft: false
---
# 一、绪论

- 客观世界三大要素：物质、能量、信息
- 信息是指各个事物运动的状态及规律（关于事物运动的“知识”）
- 信息从数量上等于通信前后“不确定性”的消除量
- 信息论——利用**数理统计方法**研究信息
- 描述通信系统：有效、可靠、安全

  - 信息压缩 信息纠错 信息加密
  - 提高**有效性** —— 信源编码（不同码元越**独立**越好，相关性大了就会有冗余）
    - 单位时间内获取更多的信息量 —— 编码效率 = 有效码元数 / 总码元数
  - 提高**可靠性** —— 信道编码（不同码元越**相关**越好，一旦出错有相关性才能纠正）
    - 加入校验位以降低误码率（只要有噪声，误码率就不可能到 0）
    - 有效性与可靠性往往矛盾，实际中需要追求一种平衡
  - 提高**安全性** —— 加密编码
- 1948 香农 “通信的数学理论” —— 信息论的出现

  - 阐明通信系统传递的对象就是信息
  - 对信息给予科学的定量描述
  - 提出了信息熵的概念（熵就是一个统计量）
- 三种信息：语法、语义、语用
- 通信的基本问题：在一点精确地或近似地恢复令一点的信息
- 信息 - 消息 - 信号
- 信息论解决通信理论的两个基本问题

  - 临界数据压缩的值（熵）
  - 临界通信传输速率的值（信道容量）
- 信源（概率空间建模）

  - 离散信源
  - 连续信源
    - 离散时间连续信源
    - 波形信源或模拟信源
  - 信源编码器：将信源消息变成符号，提高传输有效性
  - 信道编码器：给信源编码符号增加冗余符号，提高传输可靠性
  - 调制器：将编码器输出的符号变成适合信道传输的形式
- 信道（转移概率建模）

  - 无噪声/有噪声信道
    - 加性、乘性 AWGN
  - 离散/离散时间连续/波形信道
  - 无记忆/有记忆信道
- 香农信息论

  - 狭义信息论（本课程）：信源、信道及编码问题，核心是三个编码定理
    - 关于信源信息的度量是信息论的首要问题
    - 无失真编码定理（香农第一定理）
    - 关于信道容量与信息的可靠传输 —— 有噪信道编码定理（香农第二定理）
    - 信息率失真理论 —— 限失真信源编码定理（香农第三定理）
  - 广义信息论：包括所有与信号处理相关的
- 香农三大定理

# 二、信息量和熵

## 平均自信息量 —— 熵

- 信源的平均自信息量：又称为信源 X 的熵，信源熵是在平均意义上表征信源的**总体特征**
  - **信息量** I(xi)=log(1p(xi))=−log(p(xi))I(x\_i)=log(\frac{1}{p(x\_i)})=-log(p(x\_i))I(xi​)=log(p(xi​)1​)=−log(p(xi​))
    - 概率越小，不确定性越大
    - 数值大小表示需要多少 bit 来描述该符号
    - 求一个事件的信息量，就是求它的概率，然后取 −log-log−log
  - **信息熵** H(X)=E(I(X))=∑p(xi)I(xi)=−∑p(xi)log(p(xi))H(X)=E(I(X))=\sum p(x\_i)I(x\_i)=-\sum p(x\_i)log(p(x\_i))H(X)=E(I(X))=∑p(xi​)I(xi​)=−∑p(xi​)log(p(xi​))
    - 熵就是信源的平均不确定性/平均信息量
    - 数值大小表示平均码长的 bit 数
    - 如果一个信源是确定的，有一个 p(xi)=1p(x\_i)=1p(xi​)=1 ，那么熵就是 0
    - **等概率时熵最大**（熵的上凸特性）
- 信息熵的唯一性定理（证明了对数是熵的唯一数学表示）
  - 连续性
  - 等概率时单调递增
  - 可加性
- 熵的单位：bit/符号（或者 bit/符号时间）
  - 表示对于平均每个符号，传输这么大的不确定性需要 n 个 bit 去编码一个符号
  - 也就是需要 2n2^n2n 种状态去描述这么大的不确定性
  - 信息速率（bit/s）可以用熵除以平均每个符号的生成时间来求
- 当 H(x)H(x)H(x) 后面跟的不是一个分布时，说明是用参数 xxx 来表示一个熵（固定为两项），比如：H(D)=−Dlog2D−(1−D)log2(1−D)H(D)=-Dlog\_2D-(1-D)log\_2(1-D)H(D)=−Dlog2​D−(1−D)log2​(1−D)

## 熵的扩展

- 条件熵
  - 条件自信息量 I(xi∣yj)=−log(p(xi∣yj))I(x\_i|y\_j)=-log(p(x\_i|y\_j))I(xi​∣yj​)=−log(p(xi​∣yj​))
  - H(X∣yj)=−∑ip(xi∣yj)log(p(xi∣yj))H(X|y\_j)=-\sum\_i p(x\_i|y\_j)log(p(x\_i|y\_j))H(X∣yj​)=−∑i​p(xi​∣yj​)log(p(xi​∣yj​))
  - H(X∣Y)=−∑i,jp(xi,yj)log(p(xi∣yj))H(X|Y)=-\sum\_{i,j} p(x\_i,y\_j)log(p(x\_i|y\_j))H(X∣Y)=−∑i,j​p(xi​,yj​)log(p(xi​∣yj​))
    - 注意这里的 p 是联合概率，不是条件概率
    - H(X∣Y)=∑jp(yj)H(X∣yj)=−∑jp(yj)p(xi∣yj)log(p(xi∣yj))H(X|Y) = \sum\_jp(y\_j)H(X|y\_j) = -\sum\_jp(y\_j)p(x\_i|y\_j)log(p(x\_i|y\_j))H(X∣Y)=∑j​p(yj​)H(X∣yj​)=−∑j​p(yj​)p(xi​∣yj​)log(p(xi​∣yj​))
  - H(X+Y∣X)=H(Y∣X)H(X+Y|X) = H(Y|X)H(X+Y∣X)=H(Y∣X)
    - XXX、YYY 独立时，H(Y∣X)=H(Y)H(Y|X) = H(Y)H(Y∣X)=H(Y)，H(X+Y∣X)=H(Y)H(X+Y|X) = H(Y)H(X+Y∣X)=H(Y)
  - H(X∣Y)≤min(H(X),H(Y))H(X|Y) \leq min(H(X), H(Y))H(X∣Y)≤min(H(X),H(Y))
- 联合熵（共熵）
  - 联合自信息量 I(xi,yj)=−log(p(xi,yj))I(x\_i,y\_j)=-log(p(x\_i,y\_j))I(xi​,yj​)=−log(p(xi​,yj​))
  - H(X,Y)=−∑i,jp(xi,yj)log(p(xi,yj))H(X,Y)=-\sum\_{i,j} p(x\_i,y\_j)log(p(x\_i,y\_j))H(X,Y)=−∑i,j​p(xi​,yj​)log(p(xi​,yj​))
    - 与条件熵的区别仅在自信息量部分
  - H(X+Y,X)=H(X)+H(Y)H(X+Y,X) = H(X) + H(Y)H(X+Y,X)=H(X)+H(Y)
  - H(X,Y)≤H(X)+H(Y)H(X,Y) \leq H(X) + H(Y)H(X,Y)≤H(X)+H(Y)
    - XXX、YYY 独立时取等
  - H(X,Y)≥max(H(X),H(Y))H(X,Y) \geq max(H(X),H(Y))H(X,Y)≥max(H(X),H(Y))
- 联合熵、熵、条件熵
  - H(XY)=H(X)+H(Y∣X)=H(Y)+H(X∣Y)H(XY) = H(X) + H(Y|X) = H(Y) + H(X|Y)H(XY)=H(X)+H(Y∣X)=H(Y)+H(X∣Y)
    - 对比联合概率的公式，其实就是把相乘变成相加（对数的效果）
  - H(XYZ)=H(X)+H(Y∣X)+H(Z∣XY)H(XYZ)=H(X)+H(Y|X)+H(Z|XY)H(XYZ)=H(X)+H(Y∣X)+H(Z∣XY)
  - H(XY∣Z)=H(X∣Z)+H(Y∣XZ)H(XY|Z) = H(X|Z) + H(Y|XZ)H(XY∣Z)=H(X∣Z)+H(Y∣XZ)
    - 链式法则的证明参考 2.13(b)，直接用定义展开

## 熵的性质

- 非负性
- 对称性：次序变更不影响熵的值
- 极值性：等概率时，H(X)max=log2NH(X)\_{max}=log\_2NH(X)max​=log2​N
- 条件熵不大于**任一**信源熵，相互独立时取等
  - 条件熵的条件越多，熵值越小
- 联合熵不大于**所有**信源熵**相加**，相互独立时取等
- 扩展性：信源含有的新增消息为小概率时，熵不变
- 确定性：任一概率分量为 1，其余为0，则熵为 0
- 可加性

## 相对熵与条件相对熵

- 交叉熵 H(P,Q)=−∑xP(x)logQ(x)H(P,Q)=-\sum\_{x} P(x)logQ(x)H(P,Q)=−∑x​P(x)logQ(x)
- 相对熵（KL 散度） D(P∣∣Q)=∑xP(x)logP(x)Q(x)D(P||Q)=\sum\_xP(x)log\frac{P(x)}{Q(x)}D(P∣∣Q)=∑x​P(x)logQ(x)P(x)​
  - 相对熵等价于两个概率分布信息熵的差值（概率分布的距离）
  - 相对熵度量当真实分布为 P 而假定分布为 Q 时的无效性
    - 如果真实分布为 P，使用的分布为 Q，则需要构造 H(P)+D(P∣∣Q)H(P)+D(P||Q)H(P)+D(P∣∣Q) 比特来描述这个随机变量
    - 相对熵就是用 Q 来描述 P 时所需要付出的信息量
  - 相对熵是非对称的，不满足三角不等式 D(P∣∣Q)≠D(Q∣∣P)D(P||Q) \neq D(Q||P)D(P∣∣Q)=D(Q∣∣P)
- 条件相对熵 D(P(y∣x)∣∣Q(y∣x))=∑xp(x)∑yP(y∣x)logP(y∣x)Q(y∣x)D(P(y|x)||Q(y|x))=\sum\_xp(x)\sum\_yP(y|x)log\frac{P(y|x)}{Q(y|x)}D(P(y∣x)∣∣Q(y∣x))=∑x​p(x)∑y​P(y∣x)logQ(y∣x)P(y∣x)​
  - 联合相对熵 = 相对熵 + 条件相对熵

## 平均互信息（交互熵）

- 互信息量 I(xi;yj)=I(xi)−I(xi∣yj)=log2p(xi∣yj)p(xi)I(x\_i;y\_j)=I(x\_i)-I(x\_i|y\_j)=log\_2\frac{p(x\_i|y\_j)}{p(x\_i)}I(xi​;yj​)=I(xi​)−I(xi​∣yj​)=log2​p(xi​)p(xi​∣yj​)​

  - 看到输出之前的信息量 - 看到输出后的信息量
- $ I(X;y\_j)=\sum\_ip(x\_i|y\_j)log\_2\frac{p(x\_i|y\_j)}{p(x\_i)} $

  - 已知 yjy\_jyj​ 时，关于 XXX 的信息量
- 平均互信息 I(X;Y)I(X;Y)I(X;Y)

  - Y 对 X：I(X;Y)=∑i∑jp(xi,yj)I(xi;yj)=∑i∑jp(xi,yj)log2p(xi∣yj)p(xi)I(X;Y)=\sum\_i\sum\_jp(x\_i,y\_j)I(x\_i;y\_j)=\sum\_i\sum\_jp(x\_i,y\_j)log\_2\frac{p(x\_i|y\_j)}{p(x\_i)}I(X;Y)=∑i​∑j​p(xi​,yj​)I(xi​;yj​)=∑i​∑j​p(xi​,yj​)log2​p(xi​)p(xi​∣yj​)​

    - 看到输出前后，研究信源的不确定程度
    - 已知 YYY 时，关于 XXX 的信息量
    - I(X;Y)=D(p(x,y)∣∣p(x)p(y))I(X;Y) = D(p(x,y)||p(x)p(y))I(X;Y)=D(p(x,y)∣∣p(x)p(y))
  - X 对 Y：I(Y;X)=∑i∑jp(xi,yj)I(yj;xi)=∑i∑jp(xi,yj)log2p(yj∣xi)p(yj)I(Y;X)=\sum\_i\sum\_jp(x\_i,y\_j)I(y\_j;x\_i)=\sum\_i\sum\_jp(x\_i,y\_j)log\_2\frac{p(y\_j|x\_i)}{p(y\_j)}I(Y;X)=∑i​∑j​p(xi​,yj​)I(yj​;xi​)=∑i​∑j​p(xi​,yj​)log2​p(yj​)p(yj​∣xi​)​

    - 看到输入前后，研究信宿的不确定程度
  - **二者相等**，表示通信系统传输了多少信息量（通过系统后，不确定性的减少量）
  - 如果 I(X;Y)=I(X;Z)I(X;Y)=I(X;Z)I(X;Y)=I(X;Z)，说明 Y→ZY \rightarrow ZY→Z 的映射没有信息损失

    - 由信息量不增定理，对数据进行任何处理不可能熵增，只有损失与不损失两种情况
- I(X;Y)=H(X)−H(X∣Y)I(X;Y)=H(X)-H(X|Y)I(X;Y)=H(X)−H(X∣Y)

  - 信道极好时，不会超过输入本身的信息熵
  - 信道极差时，不传输任何信息量，条件熵与输入熵相等
  - 对照联合熵的公式，发现联合熵的右式是相加，这里是相减
- I(X;Y)=H(X)+H(Y)−H(XY)I(X;Y)=H(X)+H(Y)-H(XY)I(X;Y)=H(X)+H(Y)−H(XY)

  - H(X)+H(Y)H(X)+H(Y)H(X)+H(Y) 通信前，整个系统的不确定程度
  - H(XY)H(XY)H(XY) 通信后，整个系统的不确定程度
  - **二者独立时取 0，完全相关时取 H(X)H(X)H(X)**
- 性质

  - 非负性
  - 对称性
  - 极值性
    - I(X;Y)≤H(X)I(X;Y) \leq H(X)I(X;Y)≤H(X)
    - I(X;Y)≤H(Y)I(X;Y) \leq H(Y)I(X;Y)≤H(Y)
  - 可加性
- 多变量条件互信息量（链式法则）

  - I(X;Y∣Z)=H(X∣Z)−H(X∣Y,Z)=H(Y∣Z)−H(Y∣X,Z)=∑x∑y∑zp(x,y,z)logp(x∣y,z)p(x∣z)I(X;Y|Z)=H(X|Z)-H(X|Y,Z)=H(Y|Z)-H(Y|X,Z)=\sum\_x\sum\_y\sum\_zp(x,y,z)log\frac{p(x|y,z)}{p(x|z)}I(X;Y∣Z)=H(X∣Z)−H(X∣Y,Z)=H(Y∣Z)−H(Y∣X,Z)=∑x​∑y​∑z​p(x,y,z)logp(x∣z)p(x∣y,z)​
  - I(X;YZ)=H(X)−H(X∣YZ)=H(YZ)−H(YZ∣X)I(X;YZ)=H(X)-H(X|YZ)=H(YZ)-H(YZ|X)I(X;YZ)=H(X)−H(X∣YZ)=H(YZ)−H(YZ∣X)
  - I(X;YZ)=I(X;Y)+I(X;Z∣Y)=I(X;Z)+I(X;Y∣Z)I(X;YZ)=I(X;Y)+I(X;Z|Y)=I(X;Z)+I(X;Y|Z)I(X;YZ)=I(X;Y)+I(X;Z∣Y)=I(X;Z)+I(X;Y∣Z)
  - I(XY;Z)=I(X;Z∣Y)+I(Z;Y)I(XY;Z)=I(X;Z|Y)+I(Z;Y)I(XY;Z)=I(X;Z∣Y)+I(Z;Y)
- 其他计算相关

  - $ \begin{aligned} I\left(X\_{1}, X\_{2} ; Y\right) &=I\left(X\_{1} ; Y\right)+I\left(X\_{2} ; Y \mid X\_{1}\right) = I\left(X\_{2} ; Y\right)+I\left(X\_{1} ; Y \mid X\_{2}\right) \end{aligned} $
  - I(X;X)=H(X)I(X;X)=H(X)I(X;X)=H(X)

## 信息不等式

- 基础不等式：lnx≤x−1ln x \leq x-1lnx≤x−1

  - 当需要将 log 中的内容提出来时，可以使用 log2A≤log2e∗(A−1)log\_2 A \leq log\_2e\*(A-1)log2​A≤log2​e∗(A−1)
- Jensen 不等式：f 是一个下凸函数，Ef(x)≥f(EX)Ef(x)\geq f(EX)Ef(x)≥f(EX)

  - 用于将求和符号里面的凸运算提出来，比如 ∑ipilog2qi≤log2∑ipiqi\sum\_{i}p\_ilog\_2q\_i \leq log\_2\sum\_ip\_iq\_i∑i​pi​log2​qi​≤log2​∑i​pi​qi​
- 信息散度不等式：D(P∣∣Q)≥0D(P||Q)\geq 0D(P∣∣Q)≥0

  - 分布一样时等号成立
  - 可以推出 I(X;Y)≥0I(X;Y) \geq 0I(X;Y)≥0
  - 判断两个熵 H(X)H(X)H(X)、H(Y)H(Y)H(Y) 之间的大小关系，可以考虑用 I(X;Y)=H(X)−H(X∣Y)>0I(X;Y)=H(X)-H(X|Y)>0I(X;Y)=H(X)−H(X∣Y)>0
- 最大熵定理：H(X)≤log∣X∣H(X) \leq log|X|H(X)≤log∣X∣
- **Fano 不等式**：Pe≥H(X∣Y)−1log(∣X∣−1)Pe \geq \frac{H(X|Y)-1}{log(|X|-1)}Pe≥log(∣X∣−1)H(X∣Y)−1​（∣X∣|X|∣X∣ 是 X 的维度）

  - 回答了接收端条件熵与误码率的关系，Pe=P(X^≠X)P\_e=P(\hat{X} \neq X)Pe​=P(X^=X)
  - H(X∣Y)H(X|Y)H(X∣Y) 越小，通信系统的误码率 Pe 越小
    - 为 0 代表看见输出后能够完全推断出输入，则 Pe = 0
  - H(Pe)+Pelog⁡(∣X∣−1)≥H(X∣Y)H\left(P\_{e}\right)+P\_{e} \log (|X|-1) \geq H(X \mid Y)H(Pe​)+Pe​log(∣X∣−1)≥H(X∣Y)
    - H(Pe)H\left(P\_{e}\right)H(Pe​) 是误码率的不确定性
- 三角不等式

  - H(X∣Y)+H(Y∣Z)≥H(X∣Z)H(X \mid Y)+H(Y \mid Z) \geq H(X \mid Z)H(X∣Y)+H(Y∣Z)≥H(X∣Z)

    - 利用条件越多熵越小，联合越多熵越大
  - H(X∣Y)/H(XY)+H(Y∣Z)/H(YZ)≥H(X∣Z)/H(XZ)H(X \mid Y) / H(X Y)+H(Y \mid Z) / H(Y Z) \geq H(X \mid Z) / H(X Z)H(X∣Y)/H(XY)+H(Y∣Z)/H(YZ)≥H(X∣Z)/H(XZ)

    - 放大分母以合并
    - ab≥a−cb−c\frac{a}{b} \geq \frac{a-c}{b-c}ba​≥b−ca−c​ 或 aa+c≥bb+c∣a>b\frac{a}{a+c} \geq \frac{b}{b+c}|\_{a>b}a+ca​≥b+cb​∣a>b​

## 相对熵、熵的凸性

- 相对熵 D(p∥q)D(p \| q)D(p∥q) 是概率分布对 (p,q)(\mathrm{p}, \mathrm{q})(p,q) 的下凸函数
- 熵 H(p)\mathrm{H}(\mathrm{p})H(p) 为上凸函数
- 互信息 I(xi;yj)I(x\_i;y\_j)I(xi​;yj​) 是信源 p(xi)p(x\_i)p(xi​) 的上凸函数，是信道 p(yi∣xi)p(y\_i|x\_i)p(yi​∣xi​) 的下凸函数 —— **信道容量**与**失真函数**
  - 固定信道 p(yi∣xi)p(y\_i|x\_i)p(yi​∣xi​)，改变输入 p(xi)p(x\_i)p(xi​)，若互信息存在一个上界（有一种输入使之取到最大值），则说互信息关于信源 p(xi)p(x\_i)p(xi​) 的函数是上凸的（反之亦然）
  - 或者说，上凸时必然有一种信号形式能让该信道的通信能力达到最大（互信息最大）
- 回答**压缩限**和**传输限**的问题

## 信息量不增原理

- 定理: 如果 $ X \rightarrow Y \rightarrow Z $，则

  I(X;Y)≥I(X;Z)I(X;Y)≥I(X;Y∣Z)\begin{array}{l}
  I(X ; Y) \geq I(X ; Z) \\
  I(X ; Y) \geq I(X ; Y \mid Z)
  \end{array}
  I(X;Y)≥I(X;Z)I(X;Y)≥I(X;Y∣Z)​
- 每做一次操作都必然使信息量降低

  - 不存在对数据的优良操作能使从数据中所获得的推理得到改善！
  - 对于观测得到的数据做任何处理都会带来信息损失，绝对不会使信息增加！
- 数据处理会把信号、数据或消息变成更为有用的形式，但是绝对不会也不能创造新的信息。

## 连续随机变量的熵

- H(X)=Hc(X)−logΔH(X) = H\_c(X) - log\DeltaH(X)=Hc​(X)−logΔ
  - 连续随机变量的熵是**无限大**的，因此使用微分熵来描述
  - 第一项称为微分熵，第二项称为绝对熵
- 微分熵
  - $H\_{c}(X)=-\int\_{-\infty}^{\infty} f(x) \log f(x) d x $
  - 一般只考察微分熵，因为后面的 Δ\DeltaΔ 与采样率/精度有关，划分越精细，随机变量的熵甚至能达到无穷
  - 微分熵不具有非负性！
- 联合熵
  - Hc(XY)=−∬R2p(xy)log⁡2p(xy)dxdyH\_{c}(X Y)=-\iint\_{R^{2}} p(x y) \log \_{2} p(x y) d x d yHc​(XY)=−∬R2​p(xy)log2​p(xy)dxdy
- 条件熵
  - Hc(Y/X)=−∬R2p(xy)log⁡2p(y/x)dxdyH\_{c}(Y / X)=-\iint\_{R^{2}} p(x y) \log \_{2} p(y / x) d x d yHc​(Y/X)=−∬R2​p(xy)log2​p(y/x)dxdy
  - Hc(X/Y)=−∬R2p(xy)log⁡2p(x/y)dxdyH\_{c}(X / Y)=-\iint\_{R^{2}} p(x y) \log \_{2} p(x / y) d x d yHc​(X/Y)=−∬R2​p(xy)log2​p(x/y)dxdy
- 均匀分布的熵只与分布间隔有关，高斯分布的熵只与方差有关，指数分布的熵只与均值有关
  - 高斯分布的熵不确定最大，用的比较多（高斯分布的表达式以及 I(X;Y)=−12ln(1−ρ2)I(X;Y)=-\frac{1}{2}ln(1-\rho^2)I(X;Y)=−21​ln(1−ρ2) 的求法见书 P36）
- 连续信源的**最大熵定理** (使用拉格朗日方法求解)
  - 限**峰值功率**最大熵定理 —— **均匀分布**的连续信源具最大熵
    - 定理 1：若连续随机变量 $ X $ 的峰值不超过 $ M $，则 $ X $ 的微分熵 h≤log⁡2Mh \leq \log 2 Mh≤log2M 当且仅当 $ p(x) $ 为均匀分布时等号成立。
  - 限**平均功率**的最大熵定理 —— **高斯分布**的连续信源具最大熵
    - 给定熵功率，可以直接求出熵值（书 P40）
  - 限**均值**的最大熵定理 —— **指数分布**的连续信源具最大熵
- 平均互信息量
  - $I(X ; Y)=E \log \frac{f(Y \mid X)}{f(Y)}=E \log \frac{f(X, Y)}{f(X) f(Y)} $
    - I(x;y)=logPXY(x,y)PX(x)PY(y)I(x;y) = log\frac{P\_{XY}(x,y)}{P\_X(x)P\_Y(y)}I(x;y)=logPX​(x)PY​(y)PXY​(x,y)​ 与离散的情况一样
  - $ I(X ; Y)=H\_{c}(X)+H\_{c}(Y)-H\_{c}(X Y) $

## 随机过程熵率

- 熵率

  - H(X)=lim⁡n→∞1nH(X1,X2,…,Xn)H(X)=\lim \_{n \rightarrow \infty} \frac{1}{n} H\left(X\_{1}, X\_{2}, \ldots, X\_{n}\right)H(X)=limn→∞​n1​H(X1​,X2​,…,Xn​)
    - 右边是 n 个时刻随机变量的联合熵
  - $ H^{\prime}(X)=\lim *{n \rightarrow x} H\left(X* \mid X\_{n-1}, X\_{n-2}, \ldots, X\_{1}\right) $
- 离散平稳信源 —— 各维概率分布与时间起点无关

  - 二维平稳分布 $ p\left(x\_{i} x\_{i+1}\right)=p\left(\begin{array}{ll}x\_{j} x\_{j+1}\end{array}\right) $
  - $H\left(X\_{2} / X\_{1}\right) \leqslant H\_{2}(\bar{X}) \leqslant H(X) $
    - 平均符号熵 $ H\_{N}(\overline{X})=\frac{H\left(X\_{1} X\_{2} \cdots X\_{N}\right)}{N} $
    - 条件熵与平均符号熵都是关于 N 的不增函数（HN≤HN−1H\_N \leq H\_{N-1}HN​≤HN−1​）
  - 离散平稳信源的**极限熵**（极限信息量）：$ H(\mathrm{X})=\lim *{N \rightarrow \infty} H*(\bar{X})=H^{\prime}(\mathrm{X})=\lim *{N \rightarrow \infty} H\left(X* / X\_{1} X\_{2} \cdots X\_{N-1}\right) $
    - 离散平稳信源，当考虑依赖关系为无限长时，**平均**符号熵和条件熵都非递增地一致趋于**平稳信源的信息熵**（极限熵）。
    - 极限熵代表了离散平稳有记忆信源平均每发一个符号所提供的信息量。准确计算困难，可选取不是很大的 N 计算其**近似值**。
- 离散有记忆信源 —— 马尔可夫信源

  - **判别**马尔可夫信源
    1. 完备性：$ \sum\_{a\_{k} \in A} p\left(a\_{k} | E\_{i}\right)=1 $（与更早的状态无关）
    2. 互斥性：$ p\left(s\_{l}=E\_{j} \quad | x\_{l}=a\_{k}, \quad s\_{l-1}=E\_{i}\right)=\left{\begin{array}{l}0 \ 1\end{array}\right. $（前一个状态与发出的符号**唯一**决定当前状态）
  - 齐次马尔可夫链：$ p\left(s\_{l}=E\_{j} | s\_{l-1}=E\_{i}\right)=p\left(E\_{j} | E\_{i}\right) $，与时刻 $ l $ 无关
  - mmm 阶马尔可夫信源：在某一时刻 nnn，符号出现的概率仅与前面已出现的 mmm 个符号有关，可以把这前面 mmm 个符号序列看成信源在 nnn 时刻所处的状态
  - $ m $ 阶马尔可夫信源的**极限熵** $ H\_{\infty} $ 就等于 $ m $ 阶**条件熵**，记为 $ H\_{m+1} $
- **求解**马尔可夫信源条件熵

  1. 设状态 $ E\_{i}=\left(a\_{k\_{1}} a\_{k\_{2}} \cdots a\_{k\_{m}}\right) $，信源处于状态 $ E\_{i} $
  2. 写出单步转移概率 $ p\left(E\_{j} | E\_{i}\right)$
  3. 求解稳态概率 $ p\left(E\_{i}\right)\left(i=1,2, \cdots, q^{m}\right) $

     - 构建方程组 p(Ej)=∑i=1qmp(Ei)p(Ej∣Ei)(j=1,2,⋯ ,qm)p\left(E\_{j}\right)=\sum\_{i=1}^{q^{m}} p\left(E\_{i}\right) p\left(E\_{j} | E\_{i}\right) \quad\left(j=1,2, \cdots, q^{m}\right)p(Ej​)=∑i=1qm​p(Ei​)p(Ej​∣Ei​)(j=1,2,⋯,qm)
     - 满足条件 p(Ej)>0,∑j=1qmp(Ej)=1p\left(E\_{j}\right)>0, \quad \sum\_{j=1}^{q^{m}} p\left(E\_{j}\right)=1p(Ej​)>0,∑j=1qm​p(Ej​)=1
  4. $ \begin{aligned} H\_{\infty}=H\_{m+1} =-\sum\_{i=1}{q{m}} \sum\_{k=1}^{q} p\left(E\_{i}\right) p\left(a\_{k} | E\_{i}\right) \log p\left(a\_{k} | E\_{i}\right) =-\sum\_{i=1}{q{m}} p\left(E\_{i}\right) \sum\_{k=1}^{q} p\left(a\_{k} | E\_{i}\right) \log p\left(a\_{k} | E\_{i}\right) \end{aligned} $
  5. 求解稳态后的概率分布 $ p\left(a\_{k}\right)=\sum\_{i=1}{q{m}} p\left(E\_{i}\right) p\left(a\_{k} / E\_{i}\right) $

# 三、无失真信源编码（压缩限）

​ 编码的目的是提高有效性，追求有效性就是让信息最大化/用比较少的符号就能传输。

​ 码字的个数首先需要大于信源符号的个数，否则无法表示完所有符号。

​ **压缩限**研究的是如何用更少的编码描述信源的不确定性。

​ 信源编码：L‾≥Hr(X)\overline{L} \geq H\_r(X)L≥Hr​(X)

## 信源编码概述

- 两大类信源编码：无失真与限失真
  - 无失真编码：编码前后**熵不发生变化**
  - 限失真编码：主要针对连续信元，率失真函数 R(D)
- 熵的**相对率**
  - 信源的实际信息熵与具有同样符号集的最大熵的比值
  - $ \eta=\frac{H}{H\_{\max }} $
  - 熵的冗余度 = 1 - 熵的相对率：$ r=1-\frac{H}{H\_{\max }}=\frac{H\_{\max }-H}{H\_{\max }} $
- 等长码与变长码
- 码字、码元、符号序列
  - 长为 LLL 的符号序列 -> NNN 个**码元**组成的**码字**
  - 有 DDD 种码元，每码元的比特数为 logDlogDlogD
  - 码字的比特数 NlogDNlogDNlogD
  - 平均每符号的信息熵 H(U)H(U)H(U)
  - 符号序列的信息熵 LH(U)LH(U)LH(U)
  - NlogD>=LH(U)NlogD >= LH(U)NlogD>=LH(U)

## 等长渐进无失真信源编码

- 定长：编码后的码字长度相同
- 待编码消息个数： $ \mathrm{M} = K^{L} $

  - K 为信源符号个数，L 为信源序列长度
- **唯一可译码**存在充要条件： $ \mathrm{D}^{\mathrm{N}} \geq K^{L}, \mathrm{~N} \geq \frac{\mathrm{L} \log \mathrm{K}}{\log \mathrm{D}} $

  - DDD 码元数，$ \mathrm{N} $ 码长，$ \mathrm{N} / \mathrm{L} $ 每个信源符号所需的平均码元数
- 熵值 $ \mathrm{H}(\mathrm{U}) $ 是统计平均值，仅当 L 无限时，一个具体信源输出序列的平均每符号的信息量才等于熵

  - LLL 有限时，平均每符号的信息量在 $ \mathrm{H}(\mathrm{U}) $ 附近摆动应选 L 足够长使得 $ \mathrm{Nlog} \mathrm{D} \geq \mathrm{L}\left[H(U)+\varepsilon\_{\mathrm{L}}\right] $， $ \varepsilon\_{\mathrm{L}} $ 与 $ \mathrm{L} $ 有关的正数
    当 $ \mathrm{L} \rightarrow \infty $ 时有 $ \varepsilon\_{\mathrm{L}} \rightarrow 0 $，才能不降低效率
  - H(U)≤logKH(U) \leq logKH(U)≤logK，均匀分布时取等，因此前述充要条件满足时，一定满足  N≥LH(U)log⁡D\mathrm{~N} \geq \frac{\mathrm{L} H(U)}{\log \mathrm{D}} N≥logDLH(U)​
- 典型序列 AEP：**样本平均**与**统计平均**比较接近

  - 典型的事件出现比较多
    - 个别非典型序列的概率不一定比个别典型序列的概率低，但是非典型序列出现的概率总和随 LLL 的增大趋于 0
  - 满足大数定理：$ lim\_{L \rightarrow \infty} \mathrm{P}\left[\left|\frac{\mathrm{I}\_L}{L}-\mathrm{H}(\mathrm{U})\right| \leq \varepsilon\right] \geq 1-\varepsilon $
    - $ \mathrm{I}*L=\sum*^{L}-\log \mathrm{P}\left(\mathrm{u}\_{l}\right) ，，，L$ 是序列长度
    - 弱大数定律：随着序列长度的增加， 常见序列构成的集合的总体概率趋于 1
    - 强弱大数的区别在于总体概率是“一定是 1”还是“趋近于 1”（limlimlim 在 PPP 里面还是外面）
  - **渐进无失真**：只对**典型序列**进行编码，当 LLL 趋紧无穷时，其他序列几乎不发生，也就没有失真了
- 弱 $ \varepsilon $-典型序列集

  - 典型序列集：TU( L,ε)={uL:H(U)−ε≤IL≤H(U)+ε}\mathrm{T}\_{U}(\mathrm{~L}, \varepsilon)=\left\{u\_{L}: H(U)-\varepsilon \leq \mathrm{I}\_{\mathrm{L}} \leq H(U)+\varepsilon\right\}TU​( L,ε)={uL​:H(U)−ε≤IL​≤H(U)+ε}
  - 渐进等同分割性质：设离散无记忆稳恒信源输出的一个特定序列 $ \mathrm{u}*{1} u* \cdots u\_{L} $ 则任给对 $ \varepsilon $ 和 $ \delta $, 可以找到一个整数 $ L $，使当 $ L>L\_{0} $ 有 Pr⁡{∣−log⁡2P(U1U2⋯UL)L−H(U)∣≤ε}≥1−δ\operatorname{Pr}\left\{\left|-\frac{\log \_{2} P\left(U\_{1} U\_{2} \cdots U\_{L}\right)}{L}-H(U)\right| \leq \varepsilon\right\} \geq 1-\deltaPr{∣∣∣∣​−Llog2​P(U1​U2​⋯UL​)​−H(U)∣∣∣∣​≤ε}≥1−δ
  - 典型序列的出现概**率近于相等**，且每个序列中一个信源符号的平均信息量接近于**信源熵**，且所有典型序列的概率和渐近为 1
  - 典型序列的总数约为 2LH(U)2^{LH(U)}2LH(U)，特定典型序列的出现概率为 2−LH(U)2^{-LH(U)}2−LH(U)，典型序列所占比重 α=2LH(U)−LlogK\alpha = 2^{LH(U)-LlogK}α=2LH(U)−LlogK
- 编码**速率** $ \mathrm{R} = \frac {\mathrm{N}} {\mathrm{L} } log\mathrm{D} \ 比特/符号$

  - 信源序列长度 LLL，码字长度 NNN，码字的字母表大小 DDD，码字总数 M=DNM=D^NM=DN
  - RRR 表示平均单个信源符号编码所需要的 bit 数（信息熵 / 平均码长），只要 LLL 够长 RRR 就能无限接近于信源熵 H(U)H(U)H(U)
- 编码**效率** $ \eta=\frac{H(U)}{R} \leq 1 $

  - (编码前) 平均**符号**的比特数 / (编码后) 平均**码元**的比特数
- 等长信源编码定理 R≥H(U)R \geq H(U)R≥H(U)

  - 正定理 ：$ \forall \varepsilon>0，，， \delta>0 $，如果编码速率 $ \mathrm{R} \geq H(U)+\varepsilon $ ， 那么当 $ L $ 足够大时, 译码错误概率 $ P\_{e}<\delta $
  - 逆定理：$ \forall \varepsilon>0 $，如果 $R \leq H(U)-2 \varepsilon $，那么译码错误概率 $ P\_{e}>0 $，且随 着 $ L $ 的增加趋于 1，即译码以概率1 出错
  - **信源熵是信源压缩的理论极限！** —— 存在编码方法，当 LLL 足够大时，NlogD≥LH(U)NlogD \geq LH(U)NlogD≥LH(U)，错误概率 PeP\_ePe​ 任意小

## 变长无失真信源编码

- 变长编码：编码后的码字长度可变
- **唯一可译码**存在的充要条件 —— Kraft 不等式

  - $ \sum\_{i=1}^{n} r^{-k\_{i}} \leq 1 $
  - nnn 个信源符号，rrr 种码元，各码字长度 kkk（比特就是看作二进制码元 r=2r=2r=2）
  - 仅是存在条件，满足 Kraft 不等式的码不一定唯一可译码
- 无失真变长编码定理 —— **香农第一定理**

  - $ H\_r(U) \leq \frac {\overline{l}\_N}{N} \leq H\_r(U) + \frac{1}{N}$
  - 信源单个符号对应的平均码长 l‾NN\frac {\overline{l}\_N}{N}NlN​​ 大于信源熵 Hr(U)H\_r(U)Hr​(U)，则一定能找到无失真编码
  - 信源序列长度 NNN 趋近无穷时，平均码长 l‾\overline{l}l 趋近信源熵 Hr(U)H\_r(U)Hr​(U)，编码效率 η\etaη 趋近 100%
  - 变长编码的信源符号序列长度 NNN 可以比定长编码小很多，有编码效率下界 $ \eta\_{c}=\frac{H(U)}{\bar{l} \log r}>\frac{H\_{r}(U)}{H\_{r}(U)+\frac{1}{N}} $
- 最优码：**平均码长最短**的码字

  - 是一种约束优化问题，目标是平均码长，约束是 Kraft 不等式
    - minKˉ=∑ipikimin \quad \bar{K} = \sum\_ip\_ik\_iminKˉ=∑i​pi​ki​
    - $sub \quad\sum\_{i=1}^{n} D^{-k\_{i}} \leq 1 $
  - **最优平均码长** Kˉ∗=−∑pilog⁡Dpi=HD(X)\bar{K}^{\*}=-\sum p\_{i} \log \_{D} p\_{i}=H\_{D}(X)Kˉ∗=−∑pi​logD​pi​=HD​(X)（最优平均码长是大于等于信源熵的最小**整数**）
  - 将概率大的信息符号编以短的码字，概率小的符号编以长的码字，使得平均码字长度最短
  - Huffman 编码是最优的
- Huffman 编码

  1. 把信源发出的 n 个消息按其概率递减次序排列
  2. 把概率最小的两个消息分别编成 1 和 0 码元，并对这两个消息的概率求和，作为一个新消息的概率
  3. 重新进行排序，并重复上述编码过程
  4. 在各个消息编码方向线的逆行程中，顺序地取下所编出的码元，构成相对的代码组
  5. 求平均码长 Kˉ=∑ipiki\bar{K} = \sum\_ip\_ik\_iKˉ=∑i​pi​ki​ 与信源熵 H(X)H(X)H(X)
  6. 得到信息传输速率 R=H(X)Kˉ 比特/码元R=\frac{H(X)}{\bar{K}} \ 比特/码元R=KˉH(X)​ 比特/码元，编码效率 η=R∗100%\eta = R\*100\%η=R∗100%
     - 实际上这里的 RRR 有歧义，这是 ppt 的表示方法，有的地方是编码速率 R=KˉlogDR = \bar{K}logDR=KˉlogD，η=H(X)R\eta=\frac{H(X)}{R}η=RH(X)​

# 四、信道容量（传输限）

​ 本质是一个数学优化问题：代价函数 maxI(X;Y)max \quad I(X;Y)maxI(X;Y)，优化变量 p(xi)p(x\_i)p(xi​)，固定 p(yi∣xi)p(y\_i|x\_i)p(yi​∣xi​)。

​ 传输限就是信道最大能传输的信息量

​ 高斯信道 C=Wlog(1+SNR)C = W log(1+SNR)C=Wlog(1+SNR)

## 离散无记忆信道及容量计算

- 信道的模型用**转移**概率 p(yi∣xi)p(y\_i|x\_i)p(yi​∣xi​) 来描述

  - 信源使用**先验**概率 p(xi)p(x\_i)p(xi​)
  - 信宿 p(yi)p(y\_i)p(yi​) 使用全概率公式求解
  - **后验**概率 p(xi∣yi)p(x\_i|y\_i)p(xi​∣yi​) 表示根据输出推测输入
- 容量：信道上传输了多少信息量

  - 使用交互熵/平均互信息 I(X;Y)=H(X)−H(X∣Y)I(X;Y)=H(X)-H(X|Y)I(X;Y)=H(X)−H(X∣Y) 描述信道上传输的信息
  - I(X;Y)I(X;Y)I(X;Y) 是 p(xi)p(x\_i)p(xi​) 的上凸函数，很明显有一种最大的信源分布，能够让信道容量取到最大值
- 信道的建模 —— **信道矩阵**

  - K 个输入，J 个输出（K 行 J 列）
  - 每一行表示同一个输入转移到不同输出的概率（和为 1）
  - 每一列表示不同输入**转移**到同一个输出的概率
- 对称信道

  - 关于输入对称：每一行都是第一行的一个置换
    - H(Y∣X)=H(Y∣X=k)H(Y|X) = H(Y|X=k)H(Y∣X)=H(Y∣X=k)
  - 关于输出对称：每一列都是第一列的一个置换
    - 每一列的概率之和相同
  - 置换：值相同，顺序打乱
  - 对称：行和列都对称
  - 准对称：关于行对称，关于列不对称
- 信道容量

  - C=max⁡q={q(x),x∈{0,1,⋯ ,K−1}}I(X;Y)C=\max \_{q=\{q(x), x \in\{0,1, \cdots, K-1\}\}} I(X ; Y)C=maxq={q(x),x∈{0,1,⋯,K−1}}​I(X;Y)
  - 最佳分布：使每个符号含有的平均互信息量最大的输入分布
  - 信道容量与信源无关，只是信道转移概率的函数
  - $ I\left(x\_{k} ; y\_{j}\right) $ 非平均互信息量
  - $ I\left(x\_{k} ; Y\right) 、 I\left(X ; y\_{j}\right) $ 半平均互信息量
  - 达到信道容量 C 的充要条件

    - 输入概率矢量 $ Q=\left{Q\_{0}, Q\_{1}, \cdots, Q\_{K}\right} $ 达到转移概率为 $ {p(j \mid k)} $ 的 DMC 的容量 $ C $ 的充要条件为

      I(x=k;Y)=C∀k,Qk>0I(x=k;Y)≤C∀k,Qk=0\begin{array}{lll}
      I(x=k ; Y)=C & \forall k, Q\_{k}>0 \\
      I(x=k ; Y) \leq C & \forall k, Q\_{k}=0
      \end{array}
      I(x=k;Y)=CI(x=k;Y)≤C​∀k,Qk​>0∀k,Qk​=0​
    - I(X;Y)=∑kQkI(x=k;Y)=∑kQkC=CI(X;Y)=\sum\_kQ\_kI(x=k ; Y)=\sum\_kQ\_kC=CI(X;Y)=∑k​Qk​I(x=k;Y)=∑k​Qk​C=C
  - 一种**暴力求解**方法：$ C = max\_k I(x\_k;Y) = max\_k \sum\_j P(y\_j \mid x\_k) \log \frac{P(y\_j \mid x\_k)}{P(x\_k)} $

    - 本质上就是利用 CCC 是所有 XXX 中最大的互信息
    - 还有一种简单的用法，找到 H(Y∣x)H(Y|x)H(Y∣x) 明显比别人小的信源符号 xxx（比如它的状态转移向量接近最大熵定理），直接令其 P(x)=0P(x)=0P(x)=0，降低计算难度
- **对称** DMC 信道

  - **等概率输入**是取到最佳输入分布，此时输出也等概
  - $ C = H(|Y|) - H(Y|x\_k) =\log J+\sum\_j P(y\_j \mid x\_k) \log P(y\_j \mid x\_k) $
    - JJJ 是输出的大小
- **准对称** DMC 信道

  - 最佳输入分布也是**等概分布**
  - **考试**时用等概率分布算平均互信息量，就是信道容量
  - $ C = I(x\_k;Y) = \sum\_j P(y\_j \mid x\_k) \log \frac{P(y\_j \mid x\_k)}{\frac{1}{K} \sum\_i P(y\_j \mid x\_i)} $
    - KKK 是输入的大小
- 二元**对称删除**信道 d

  - [Image omitted: third-party image]
  - **等概分布** P(x0)=P(x1)=12P(x\_0)=P(x\_1)=\frac{1}{2}P(x0​)=P(x1​)=21​ 时，取到 $ C=\left(1-\varepsilon\_{1}-\varepsilon\_{2}\right) \log \left(1-\varepsilon\_{1}-\varepsilon\_{2}\right)+\varepsilon\_{2} \log \varepsilon\_{2}-\left(1-\varepsilon\_{1}\right) \log \frac{1-\varepsilon\_{1}}{2} $
  - 二元纯删除信道 ε2=0\varepsilon\_2 = 0ε2​=0，C=1−ε1C = 1 - \varepsilon\_1C=1−ε1​
- 一般二元信道

  1. 令其中一个的概率是 α\alphaα 另一个就是 1−α1-\alpha1−α
  2. 计算 P(x,y)P(x,y)P(x,y)、P(y)P(y)P(y)
  3. 计算 $ I(X;Y) = H(Y) - H(Y|X) $
  4. 求解 $ \frac{\partial \boldsymbol{I}(\boldsymbol{X} ; \boldsymbol{Y})}{\partial \alpha}=0 $，得到 α\alphaα
  5. 代入 α\alphaα 得到 I(X;Y)I(X;Y)I(X;Y)
- 一般离散信道（**会考**，代公式）

  - 前提：信道矩阵可逆
  1. **按行**写出 KKK 个方程 $ \sum\_{j} P(y\_j \mid x\_k) \beta\_{j}=\sum\_{j} P(y\_j \mid x\_k) \log P(y\_j \mid x\_k) $，并求解出 $ \beta\_j $
  2. 计算信道容量 $ C=\log \left(\sum\_{j} 2^{\beta\_{j}}\right) $
  3. 计算 $ w\_{j}=2^{\beta\_{j}-C} $（输出分布）
  4. **按列**写出 JJJ 个方程 $ w\_{j}=\sum\_{k} Q\_{k} P(y\_j \mid x\_k) $，并求解出 QkQ\_kQk​（输入分布）
  5. 验证 Qk≥0Q\_k \geq 0Qk​≥0，否则令 Qk=0Q\_k = 0Qk​=0，删去转移矩阵对应**行**，重新求解
- 达到信道容量时的**输出分布是唯一**的。任何导致这一输出分布的输入分布都是最佳分布，可以使互信息达到信道容量。

  - 最佳**输入分布不是唯一**的

## 时间离散的无记忆连续信道及容量计算

- 无记忆信道：信道状态转移概率密度 $ p(\boldsymbol{y} \mid \boldsymbol{x})=\prod\_{n=1}^{N} p\left(y\_{n} \mid x\_{n}\right) $
- 平稳（恒参）信道：$ p\left(y\_{n} \mid x\_{n}\right)=p\left(y\_{m} \mid x\_{m}\right) $
- **加性噪声**信道

  - 输入经过噪声干扰得到输出，因此**干扰就是对信道的描述**
  - 若连续信道的条件概率密度满足 $ p(y \mid x)=p(y-x)=p(z)，，，x$ 与 $ z $ 相互独立就称它为可加噪声信道，其中 $ z=y-x $ 称作加性噪声
  - 加性指的是熵的加：H(Y∣X)=H(Z)H(Y|X)=H(Z)H(Y∣X)=H(Z)，I(X;Y)=H(Y)−H(Z)I(X;Y)=H(Y)-H(Z)I(X;Y)=H(Y)−H(Z)
    - 求信道容量就在于对所有的输入分布求 H(Y)H(Y)H(Y) 的最大值
    - 求**信道容量**可以转化为求 C=H(Y)−H(Z)C = H(Y) - H(Z)C=H(Y)−H(Z)
  - 信道干扰给定下，若输入功率不受限制，I(X;Y)I(X;Y)I(X;Y) 可为任意大
- **平均功率受限**可加噪声信道

  - 来自最大熵定理 —— 功率受限，**高斯分布**取到最大熵
  - 各时刻噪声都是均值为 0，方差相同的高斯噪声
    - C=12log⁡(1+Sσ2)C=\frac{1}{2} \log \left(1+\frac{S}{\sigma^{2}}\right)C=21​log(1+σ2S​)
    - $ S $ 是输入平均功率的上限，$ \sigma^{2} $ 是零均值高斯噪声的方差
    - 最佳输入分布就是均值为 0 、方差为 $ \mathrm{S} $ 的高斯型分布
  - 各时刻噪声都是均值为 0，但方差不同的高斯噪声
    - C=∑n=1N12log⁡(1+Snσn2),∑n=1NSn=SC=\sum\_{n=1}^N\frac{1}{2} \log \left(1+\frac{S\_n}{\sigma\_n^{2}}\right), \quad \sum\_{n=1}^NS\_n=SC=∑n=1N​21​log(1+σn2​Sn​​),∑n=1N​Sn​=S
    - 独立并行信道容量 —— **注水定理**
      - 总的信号功率受限，需要找到一种功率分配策略
      - 信道的**分配**策略，使总的信道容量/信息量取最大值
      - BBB 是一个门限（常数），可以看作“水平面”
        - 当 $ \sigma\_{n}^{2}<B $ 时, 选 $ \sigma\_{n}^{2}+S\_{n}=B $
        - 当 $ \sigma\_{n}^{2}>B $ 时，选 $ S\_{n}=0 $
      - $ B=\frac{S+\sum\_{j=m+1}^{N} \sigma\_{j}^{2}}{N-m} $
        - 前 mmm 个信道功率没超过门限 BBB，不分配能量
      - $ C=\sum\_{n: \sigma\_{n}^{2}<B} \frac{1}{2} \log \frac{B}{\sigma\_{n}^{2}} $
    - 注水过程
      1. 将干扰强度 σn2\sigma\_n^2σn2​ 从大到小排序
      2. 从 m=0m=0m=0 开始尝试计算 $ B=\frac{S+\sum\_{j=m+1}^{N} \sigma\_{j}^{2}}{N-m} $
      3. 如果 σm2≥B\sigma\_{m}^2 \geq Bσm2​≥B，则让 mmm 增大，并重新计算 BBB（相当于去掉了 σm2\sigma\_{m}^2σm2​）
      4. 如果 σm2<B\sigma\_{m}^2 < Bσm2​<B，计算 Sn=B−σn2∣n>mS\_n=B-\sigma\_n^2|\_{n > m}Sn​=B−σn2​∣n>m​ 与 Sn=0∣n≤mS\_n = 0|\_{n \leq m}Sn​=0∣n≤m​
      5. 计算 $ C=\sum\_{n=m+1}^{N} \frac{1}{2} \log \frac{B}{\sigma\_{n}^{2}} = \frac{1}{2}log\frac{B{N-m}}{\prod\_{n=m+1}N\sigma\_n^2}$
- 熵功率

  - 熵功率是一个下界：$ \bar{\sigma}^{2}=\frac{1}{2 \pi e} e^{2 H(X)} \leq \sigma^2$
  - $ \frac{1}{2} \log \_{2}\left(1+\frac{S}{\bar{\sigma}^{2}}\right) \leq C \leq \frac{1}{2} \log \_{2}\left(\frac{S+\sigma{2}}{\bar{\sigma}{2}}\right) $
  - 给定噪声**功率**的情况下，**高斯干扰是最坏的干扰**
    - 所以假定噪声为高斯比较合适
    - 且高斯噪声方便分析，实际中的高斯噪声也多

## 波形信道及容量计算

- 波形信道

  - 若信道的输入和输出都是随机过程 $ {x(t)} $ 和 $ {y(t)} $ 时，这个信道称之为**波形信道**或**时间连续信道**
  - 若信道输出 $ y(t)=x(t)+z(t) $，且 $ z(t)$ 和 $ x(t) $ 相互独立，就称**可加波形信道**
- 香农公式

  - 输入平均功率 $ \leq S $，干扰双边功率谱密度为 $ N\_{0} / 2 $ 的可加高斯白噪声，若输入 $ x(t) $ 限制在 $ 0 \leq t \leq T $，则

    C=Wlog⁡(1+SN0W)C=W \log \left(1+\frac{S}{N\_{0} W}\right)
    C=Wlog(1+N0​WS​)
  - 当信源信号为**高斯分布**时达到信道容量
  - 对非高斯噪声波形信道的信道容量是以高斯加性信道的容量为**下限值**

    - R<C高斯<CoR<C\_{高斯}<C\_oR<C高斯​<Co​
    - 可以算出高斯噪声能否传输速率为 RRR 的数据，但不能判断其他噪声下能否实现
  - C 一定时，带宽增大，信躁比 SNR=SN0WSNR=\frac{S}{N\_{0} W}SNR=N0​WS​ 可降低，即两者可以互换

    - 可以采用纠错编码等**扩展频谱**方法，来降低发射功率，同时可保证传输可靠性
    - 降低 SNR 可以隐蔽通信

# 五、信道编码定理

​ **信道编码**通过加入冗余性来提升**可靠性**，而**信源编码**是降低冗余性来提升**有效性**。

## 信道编码器的定义

- (n,M)(n, M)(n,M) 码
  - nnn 是编码后的码长，M=2nRM=2^{nR}M=2nR 是码字的数量
  - 编码方程： $ f:{1,2, \cdots, M} \rightarrow \mathcal{X}^{n} $
  - 译码方程： $ g: \mathcal{Y}^{n} \rightarrow{1,2, \cdots, M} $
  - 消息集： $ \mathcal{W}={1,2, \ldots, M} $
  - 码字： $ f(1), f(2), \cdots, f(M) $
  - 错误率
    - **最大**错误概率 λmax\lambda\_{max}λmax​ 是所有码字的错误概率 λw\lambda\_{w}λw​ 取最大
    - **平均**错误概率 PeP\_ePe​ 是所有码字的错误概率 λw\lambda\_{w}λw​ 求平均
  - 码率：$ R=\frac{1}{n} \log M \ 比特/传输$
    - **渐进可达**：编码后的码长 nnn 足够大时（校验位足够多时），使得最大错误概率 λmax\lambda\_{max}λmax​ 可以小于任意给定正值

## 联合典型序列

- 典型序列 Aε(n)A\_{\varepsilon}^{(n)}Aε(n)​

  - 使用样本算出的不确定性接近其分布的熵值
    - $ -\frac{1}{n} \log p\left(x\_{1}, x\_{2}, \ldots, x\_{n}\right) \in[H(X)-\varepsilon, H(X)+\varepsilon] $
    - **描述是否典型 —— 用样本估计的熵与其统计期望接近**
  - 出现概率够大
    - $ \operatorname{pr}\left(A\_{\varepsilon}^{(n)}\right)>1-\epsilon $ 当 $ n $ 足够大
  - 元素的个数满足
    - $ \left|A\_{\varepsilon}^{(n)}\right| \leq 2^{n(H(X)+\varepsilon)} $
    - $ \left|A\_{\varepsilon}^{(n)}\right| \geq(1-\epsilon) 2^{n(H(X)-\varepsilon)} $ 当 $ n $ 足够大
- 联合典型序列

  - 服从分布 $ p(x, y) $ 的联合典型序列 $ \left{\left(x^{n}, y^{n}\right)\right} $ 所构成的集合 $ A\_{\varepsilon}^{(n)} $，满足其经验熵与真实熵 $ \varepsilon $ 接近构成 $ n $ 长序列构成的集合
    - 二者都典型，且它们样本算出的联合熵与分布真实的联合熵接近
    - H(x1x2)≤H(x1)+H(x2)H(x\_1x\_2) \leq H(x\_1)+H(x\_2)H(x1​x2​)≤H(x1​)+H(x2​) 不是所有典型序列的组合都是联合典型的
  - **描述是否联合典型 —— 用样本估计的联合熵与其统计期望接近**
  - 随便两个典型序列的组合并不一定是联合典型序列
    - 概率与 I(X;Y)I(X;Y)I(X;Y) 有关：$ \frac{2^{n H(X, Y)}}{2^{n H(X)} 2^{n H(y)}}=2^{-n I(X ; Y)} $
- 条件典型序列

  - 当 $ P\_{Y \mid X}{n}\left(y \mid x{n}\right)=\prod\_{i=1} P\_{Y \mid X}\left(y\_{i} \mid x\_{i}\right) $，对于给定的 $ X^{n}, Y^{n} $ 的条件典型序列是

    AE(n)(PXY∣xn)={yn:(xn,yn)∈AE(n)(PXY)}A\_{\mathcal{E}}^{(n)}\left(P\_{X Y} \mid x^{n}\right)=\left\{y^{n}:\left(x^{n}, y^{n}\right) \in A\_{\mathcal{E}}^{(n)}\left(P\_{X Y}\right)\right\}
    AE(n)​(PXY​∣xn)={yn:(xn,yn)∈AE(n)​(PXY​)}
- 典型序列主要用于**典型序列译码**，可以分析误码率等

## 信道编码定理

- 输入 X 与输出 Y 之间必定是**联合典型**序列

  - 一个 X 可以对应多个典型的 Y，但不是任意的组合都是联合典型，只有有限个 Y 才和 X 是联合典型的
  - 至多可以传输 $ 2^{n I(Y \mid X)} $ 个可区分的 n 长序列
- **香农第二定理** —— 对于离散无记忆信道，小于信道容量 CCC 的所有码率都是可达的

  - 正定理：即对任意码率 R<CR<CR<C，存在一个 (2nR,n)(2^{nR},n)(2nR,n) 码序列，它的最大误差概率 λn→0\lambda^{n}\to0λn→0
  - 逆定理：任何满足 λn→0\lambda^{n}\to0λn→0 的 (2nR,n)(2^{nR},n)(2nR,n) 码序列必定有R<CR<CR<C
  - 信道编码定理是一种**存在性定理**
- 联合典型译码

  1. 将消息 W=[1,2nR]W=[1,2^{nR}]W=[1,2nR] 编码为 Xn(W)X^{n}(W)Xn(W)
  2. 接收到 YnY^nYn，如果 $ \left(X^{n}(\widehat{W}), Y^{n}\right) $ 是联合典型，则将接收序列 YnY^nYn 译码为 Xn(W^)X^{n}(\widehat{W})Xn(W)
  3. 当 $ W \neq \widehat{W} $ 或有其他 $ \left(X{n}\left(W\right), Y^{n}\right)$ 是联合典型时，认为译码错误
  - 当 nnn 足够大时，误码率为 0
- 三种编码的区别

  - 最大后验：遍历 yjy\_jyj​ 选用 p(xi∣yj)p(x\_i|y\_j)p(xi​∣yj​) 最大的 xix\_ixi​，作为一对编码（误码率可能比最大释然更低）
  - 最大释然：遍历 $x\_i $ 选用 p(yj∣xi)p(y\_j|x\_i)p(yj​∣xi​) 最大的 yjy\_jyj​，作为一对编码（错误概率达到最小的最优方法）
  - 联合典型：按照某种分布随机编码，接收方遍历 xix\_ixi​ 选用 (xi,yj)(x\_i,y\_j)(xi​,yj​) 是联合典型的 xix\_ixi​ 进行译码（是渐进最优的）
- 总结

  - 信道编码定理说明长的码长趋于无限长时，可以实现可靠通信，既误码率趋于 0
  - 正定理的证明方法是存在性，而不是构造性的
  - 随机编码方案存在的问题:
    - 编码与译码需要大量的计算（概率计算）
    - 需要存储容量大
  - 当 n 充分大，如果码字是随机选取，则大概率为好码
  - 好码中 0，1 个数几乎是相等的

## 信源信道分离定理

- 信源编码：数据压缩，$ \mathrm{R}>\mathrm{H} $
- 信道编码：数据传输，$ \mathrm{R}<\mathrm{C} $
- 能够通过信道传输平稳遍历信源当且仅当它的熵率小于信道容量

  - 如果 $ V\_{1}, V\_{2}, \ldots, V\_{n} $ 为有限字母表上满足 AEP 和 $ H(V)<C $ 的随机过程，则存在一个信源信道编码使得误差概率 $ \operatorname{Pr}(\widehat{V^{n}} \neq V^{n}) \rightarrow 0 $
  - 反之，对任意平稳随机过程，如果 $ H(V)>C $，那么误差概率远离 0，从而不可住以任意低的误差概率通过信 道发送这个过程
- 联合信源信道分离定理促使我们将信源编码问题从信道编码问题中独立出来考虑

  - 分离编码器与联合编码器能够达到相同的码率

# 六、率失真函数

​ 连续随机变量的熵无限大，使用**限失真编码**以有限长的码字表示信息量无限的信源

​ 熵压缩：依旧追求的是平均码长的下界，但不再是 L>HL>HL>H，而是研究允许一定程度失真条件下，能够把信源信息压缩到什么程度

​ 率（传输速率/码率）和码长有关，码长越长率越大，率与平均互信息（bit/符号）本质是一个东西，让码率最小就是让编码后的熵最小

​ 在限失真下，编码造成的失真可以看作为经过**试验信道**时的干扰

## 失真测度

- 失真度量 —— 信源表示的“优良程度”

  - 给定码率，求可达到的最小期望失真
  - 给定失真，求最小描述码率
  - 熵发生变化，则一定发生了失真
    - 由信息不增原理，只要对数据做了处理只可能会对信息量造成损失
- 矢量量化

  - 符号 $ X \in \mathcal{X} $ 可以是连续取值或离散取值
  - 量化结果 $ \widehat{x} $ 为离散取值，当 $ x $ 是离散取值时有 $ |\widehat{x}| \ll|x| $
- 率失真编码器与解码器

  - 信源 : $ X\_{i} \sim p(x) $
  - 编码器: 将 $ n $ 长信源序列 $ X^{n}=\left{X\_{1}, X\_{2}, \ldots X\_{n}\right} $ 编码为长度为 $ n R $ bit 的序列，表示为 $ f\_{n}\left(X^{n}\right) $
    - 码率 RRR，压缩率 H/RH/RH/R
  - 译码器: 将 $ f\_{n}\left(X^{n}\right) $ 映射为 $ n $ 长信源序列 $ \widehat{X}^{n}=\left{X\_{1}, X\_{2}, \ldots X\_{n}\right} $
- 失真测度：从信源字母表与再生字母表的乘积空间到非负实数集上的映射

  - **汉明失真**：信源与再生字母相等为 0，不等为 1
    - 失真的熵 = 误码率的熵
  - 平方误差失真：类似 MSE

## 率失真定理

- 率失真函数

  - 率-失真对 $ (R, D) $ 是**可达**的 -> 存在一种 $ \left(2^{n R}, n\right) $ 率失真码其编译码函数分别为 $ \left(f\_{n}, g\_{n}\right) $ 需要满足**保真度准则**：

    lim⁡n→∞E (X1:n,X^1:n) ≤D→Σx,x^p(x)p(x^∣x)d(x,x^)≤D\lim \_{n \rightarrow \infty} E \ (X\_{1: n}, \hat{X}\_{1: n}) \ \leq D \quad \rightarrow \quad \Sigma\_{x, \widehat{x}} p(x) p(\hat{x} \mid x) d(x, \hat{x}) \leq D
    n→∞lim​E (X1:n​,X^1:n​) ≤D→Σx,x​p(x)p(x^∣x)d(x,x^)≤D

    - $ D $ 是在码率 $ R $ 上允许的最大失真
    - 编译码受到平均失真的限制，误码率受到失真函数的限制
    - 保真度准则**目的**：在失真有限的约束下（限失真），减小码率让失真刚好满足约束
  - 率失真：对于给定的失真上限 $ D $，满足 $ (R, D) $ 包含于信源的率失真区域中的所有码率 $ R $ 的**下确界**称为**率失真函数**

    - R(I)(D)=min⁡p(x^∣x):Σx,x^p(x)p(x^∣x)d(x,x^)≤DI(X;X^)R^{(I)}(D)=\min \_{p(\hat{x} \mid x): \Sigma\_{x, \widehat{x}} p(x) p(\hat{x} \mid x) d(x, \hat{x}) \leq D} I(X ; \hat{X})R(I)(D)=minp(x^∣x):Σx,x​p(x)p(x^∣x)d(x,x^)≤D​I(X;X^)，码率越小误差越大
    - 其中 III 的最小值取自使联合分布 $ p(x, \hat{x})=p(x) p(\hat{x} \mid x) $ 满足期望失真限制的所有**条件分布** $ p(\hat{x} \mid x) $
  - 失真率：对于给定的码率 $ R $，满足 $ (R, D) $ 包含于信源的率失真区域中的所有失真上限 $ \mathrm{D} $ 的**下确界**称为**失真率函数**
- 两处优化目标 I(x;x^)I(x;\hat{x})I(x;x^) 的对比 I(X;Y)=∑xp(x)∑x^p(x^∣x)log2p(x^∣x)p(x)I(X;Y)=\sum\_{x} p(x) \sum\_{\hat x}p(\hat x|x)log\_2\frac{p(\hat x|x)}{p(x)}I(X;Y)=∑x​p(x)∑x^​p(x^∣x)log2​p(x)p(x^∣x)​

  - 信道容量：C=maxp(x)I(x;x^)C = max\_{p(x)} I(x;\hat{x})C=maxp(x)​I(x;x^) —— **传输限**问题
    - 如何设计信源编码，使传递的信息量达到信道能承载的最大值
  - 率失真：R(D)=minp(x^∣x)I(x;x^),dˉ≤DR(D)=min\_{p(\hat{x}|x)} I(x;\hat{x}), \bar d \leq DR(D)=minp(x^∣x)​I(x;x^),dˉ≤D —— **压缩限**问题（另一个压缩限问题是无失真编码）
    - 信道能够传输的信息量是有限的，如何良好的压缩，使编码后的信源满足保真度准则，且编码后的信息熵尽可能小
    - 这里的 III 是指限失真编码前后传递的信息量，形容的是“试验信道”
- 保真度集合 $ \mathcal{F}*{D}=\left{q(\hat{X} \mid X): \bar d(q)=\sum* \sum\_{\hat{x}} p(x) q(\hat{x} \mid x) d(x, \hat{x}) \leq D\right} ，，，q$ 是条件概率分布

  - 保真度集合是满足**平均失真** $\bar d(q) $ 小于**失真上限** $ D $ 的所有**条件概率** $ q(\hat{x} \mid x) $ 构成的集合
  - 信息**率失真函数**可以记为 R(I)(D)=min⁡q∈FDI(q)R^{(I)}(D)=\min \_{q \in \mathcal{F}\_{D}} I(q)R(I)(D)=minq∈FD​​I(q) —— $ R^{(I)}(D) $ 是条件分布 $ q^{*} $ 下，满足 $ d\left(q^{*}\right) \leq $ $ D $ 的最小信息率 $ I\left(q^{\*}\right) $
- 在满足**保真度准则**条件下：

  - 如果信源输出的信息率 R∣R>H(X)R|\_{R>H(X)}R∣R>H(X)​ 大于信道的传输能力 CCC，须对信源进行压缩得到 X^\hat XX^，使 R(D)<CR(D)<CR(D)<C，且 dˉ(q)<D\bar d(q)<Ddˉ(q)<D
  - **信源压缩问题**就是对于给定的信源 p(x)p(x)p(x)，又定义了失真函数 d(x,x^)d(x,\hat x)d(x,x^)，希望使编码后的信息率 RRR 尽可能小，尽可能用最少的码符号来传送信源信息，寻找信息率 RRR 的下限，提高通信的**有效性**
- 把有失真的信源编译码器看作有干扰的**假想信道**（等效噪声信道、试验信道），用分析信道传输的方法研究限失真信源编码问题

  - **允许**试验信道集合 ：$ P\_{D}=\left{\mathrm{p}\left(y\_{j} \mid x\_{i}\right): \bar{d} \leq D\right} ，，，\bar d=\sum\_{x} \sum\_{\hat{x}} p(x) q(\hat{x} \mid x) d(x, \hat{x})$
  - 禁用试验信道集合：$ P\_{\mathrm{T}}=\left{\mathrm{p}\left(y\_{j} \mid x\_{i}\right): \bar{d}>D\right} $
- R(D)R(D)R(D) 的**定义域**

  - DminD\_{min}Dmin​ 和 R(Dmin)R(D\_{min})R(Dmin​)
    - $R(D)*{max} = R(D*) $，实际中还要满足 R(D)<CR(D)<CR(D)<C
    - $ D\_{\min }=\sum\_i p\left(x\_{i}\right) \min *{j} d\left(x*, y\_{j}\right) $，失真矩阵每一行取最小的 ddd 与信源分布相乘
      - 当失真矩阵中每行至少一个 0，**每列最多一个 0 时**，才有 $ R(0) = H(X) $，否则 R(0)<H(X)R(0)<H(X)R(0)<H(X)
      - 失真 DDD 与误码 PeP\_ePe​ 不一定是一样的，当 R(0)<H(X)R(0)<H(X)R(0)<H(X) 时，满足失真为 0 而误码率不为 0，某些符号可以合并成一个
  - DmaxD\_{max}Dmax​ 和 R(Dmax)R(D\_{max})R(Dmax​)
    - R(D)min=0R(D)\_{min}=0R(D)min​=0 时，所有试验信道 P(yj∣xi)P(y\_j|x\_i)P(yj​∣xi​) 对应的平均失真 dˉ\bar ddˉ 的最小值就是 DmaxD\_{max}Dmax​
      - R(Dmax)=I(X;Y)=0R(D\_{max})=I(X;Y)=0R(Dmax​)=I(X;Y)=0，意味着相互独立 P(yj∣xi)=P(yj)P(y\_j|x\_i)=P(y\_j)P(yj​∣xi​)=P(yj​)
    - $ D\_{\max }=\min *{j} \sum* P(x\_i) d(x\_i, y\_j) $，失真矩阵的每一列与信源分布分别相乘取**最小**
- 二元信源 X ~ Bernoulli§

  - $ R(D)=\left{\begin{array}{cc}H§-H(D) & \text { if } 0 \leq D \leq \min {p, 1-p} \ 0 & \text { if } D>\min {p, 1-p}\end{array}\right. $
- 信息率失真定理

  - 可达性：对于任意失真以及任意的 R>R(D)R>R(D)R>R(D)，具有码率 RRR 和渐近失真 DDD 的率失真码序列的存在性
    - 失真典型：在**联合典型**的基础上，加上 `随机序列间的失真=期望失真` 的条件
  - 逆定理：如果用小于 R(D)R(D)R(D) 的码率描述 XXX, 则不能达到比 DDD 小的失真

## 率失真的计算

- 如果容易表示转移概率，直接求 R(D)=min⁡p(x^∣x):Σx,x^p(x)p(x^∣x)d(x,x^)≤DI(X;X^)R(D)=\min \_{p(\hat{x} \mid x): \Sigma\_{x, \widehat{x}} p(x) p(\hat{x} \mid x) d(x, \hat{x}) \leq D} I(X ; \hat{X})R(D)=minp(x^∣x):Σx,x​p(x)p(x^∣x)d(x,x^)≤D​I(X;X^)

  1. 令 dˉ=D\bar d = Ddˉ=D，用 DDD 来表示 p(x^∣x)p(\hat x|x)p(x^∣x)

     - 取到最优解时，处于约束边界
  2. 求解 p(x^,x)p(\hat x,x)p(x^,x)，进而计算 p(x^)p(\hat x)p(x^) 和 p(x∣x^)p(x|\hat x)p(x∣x^)
  3. 计算 R(D)=I(X;X^)=H(X)−H(X∣X^)R(D)=I(X;\hat X)=H(X)-H(X|\hat X)R(D)=I(X;X^)=H(X)−H(X∣X^)，并令对 p(x^∣x)p(\hat x|x)p(x^∣x) 的导数为 0
  4. 给出定义域 $ D\_{\min }=\sum\_i p\left(x\_{i}\right) \min *{j} d\left(x*, y\_{j}\right) ，，， D\_{\max }=\min *{j} \sum* P(x\_i) d(x\_i, y\_j) $
- 离散信源率失真函数的参量表达式

  1. 遍历 yjy\_jyj​，找出 $ D\_{\max }=\min *{j} \sum* P(x\_i) d(x\_i, y\_j) $
     - 输入 xix\_ixi​，输出 yjy\_jyj​，QQQ 是输入分布，ddd 是给定的距离函数
  2. 列出 J 个方程 $ \sum\_{i} \lambda\_{i} P(x\_{i}) \mathrm{e}^{s d\left(x\_{i}, y\_{j}\right)}=1 $，求出 λi\lambda\_iλi​
     - sss 是 R(D)R(D)R(D) 函数的斜率，在此作为中间参数
  3. 使用 $ \lambda\_{i}=(\sum\_{j} P(y\_{j}) \mathrm{e}^{s d(x\_{i}, y\_{j})})^{-1}$，与 2 的结果联立，得到 P(yj)P(y\_j)P(yj​) 的含参 sss 表达式
     - 可以进一步求 P(yj∣xi)=P(yj)λiesd(xi,yj)P(y\_j|x\_i)=P(y\_j)\lambda\_ie^{sd(x\_i,y\_j)}P(yj​∣xi​)=P(yj​)λi​esd(xi​,yj​)
  4. 求解平均损失 $ D\_{s}=\sum\_{i} \sum\_{j} P(x\_{i}) P(y\_{j}) \lambda\_{i} \mathrm{e}^{s d(x\_{i}, y\_{j})} d(x\_{i}, y\_{j}) $，并反解得到用 DsD\_sDs​ 表示 sss 的表达式
  5. 求解率失真函数 $ R(D\_{s})=s D\_{s}+\sum\_{i} P(x\_{i}) \ln \lambda\_{i} $
  6. 给出定义域
- 对于**伯努利分布**这种简单的情况，可以直接用率失真函数的定义求解

  1. 目标 $ R(D)=\min *{P(v \mid u) \in P*{D}} I(U ; V) $ 不好直接用最优化方法求解
  2. 通过 I(U;V)=H(U)−H(U∣V)⩾H(U)−H(Pe)=H(p)−H(Pe)I(U ; V)=H(U)-H(U \mid V) \geqslant H(U)-H\left(P\_{\mathrm{e}}\right)=H(p)-H\left(P\_{\mathrm{e}}\right)I(U;V)=H(U)−H(U∣V)⩾H(U)−H(Pe​)=H(p)−H(Pe​)，寻找交互熵的下界

     - 由 Fano 不等式，$ H(U \mid V) \leqslant H\left(P\_{\mathrm{e}}\right)+P\_{\mathrm{e}} \log (2-1) = H\left(P\_{\mathrm{e}}\right)$
  3. 找到 $ P\_{\mathrm{e}}=P(U \neq V) $ 与平均失真的联系 $ H\left(P\_{\mathrm{e}}\right) \leqslant H\left(\frac{D}{\alpha}\right) $

     - 当 α\alphaα 表示 d(u,v)∣u≠vd(u, v)|\_{u \neq v}d(u,v)∣u=v​ 时，$ \bar{d}=\sum\_{u} \sum\_{v} P(u, v) d(u, v)=\alpha P(u \neq v)=\alpha P\_{\mathrm{e}} \leqslant D $
     - 通过讨论 PPP 的取值，可知 H(P)H(P)H(P) 是增函数，因此取小于号
     - 具体问题下，该不等式需要**重新求解**（不同的题从这一步开始做即可）
  4. 得到率失真函数 R(D)=I(U;V)min=H(p)−H(Dα)R(D) = I(U ; V)\_{min}=H(p)-H\left(\frac{D}{\alpha}\right)R(D)=I(U;V)min​=H(p)−H(αD​)

     - 输出分布为 {p,1−p}\{p,1-p\}{p,1−p}，转移概率为 D/αD/\alphaD/α （转移概率表示出错的概率）
     - 当 H(x)H(x)H(x) 后面跟的不是一个分布时，说明是用参数 xxx 来表示一个熵（固定为两项），比如：H(D)=−Dlog2D−(1−D)log2(1−D)H(D)=-Dlog\_2D-(1-D)log\_2(1-D)H(D)=−Dlog2​D−(1−D)log2​(1−D)
  5. 给出定义域，并证明下界可达

     - 如果不可达，则直接用平均互信息的定义来做
- BA 算法

## 高斯信源的率失真函数

- 连续信源的定义域

  - $ D\_{\min } =\int\_{-\infty}^{\infty} q(u) \inf \_{v} d(u, v) \mathrm{d} u $

    - 如果 d(u,v)d(u,v)d(u,v) 能取 0，则 DminD\_{min}Dmin​ 为 0（一般都是 0）
  - $ D\_{\max } =\inf *{v} \int*^{\infty} q(u) d(u, v) \mathrm{d} u $

    - 对于 $ d(u, v)=(u-v)^{2} $，其实 DmaxD\_{max}Dmax​ 就是在求方差
    - 高斯信源 Dmax=σ2D\_{max}=\sigma^2Dmax​=σ2
- 均方误差下独立同分布的高斯信源 N(0,σ2)N(0,\sigma^2)N(0,σ2) 的率失真函数：$ R(D)=\left{\begin{array}{ll}\frac{1}{2} \log \frac{\sigma^{2}}{D}, & 0 \leq \mathrm{D} \leq \sigma^{2} \ 0, & \mathrm{D}>\sigma^{2}\end{array}\right. $
- 传输速率每增加 1 bit，SNR 提高 6dB

# 七、线性分组码

​ 信道编码目的是提高通信系统传输的可靠性，任务是构造出以最小冗余度代价换取最大抗干扰性能的好的码字

​ 码字 = 信息位 + 校验位/监督位 C=[x1,x2,...,xk,y1,y2,...,yk]C = [x\_1, x\_2, ..., x\_k, y\_1, y\_2, ..., y\_k]C=[x1​,x2​,...,xk​,y1​,y2​,...,yk​]

​ 校验位完全由信息位推出：H(y1y2∣x1x2x3)=0H(y\_1y\_2|x\_1x\_2x\_3) = 0H(y1​y2​∣x1​x2​x3​)=0

## 有扰离散信道的信道编码定理

- 香农第二定理：只要 R < C，就存在速率为 R 的纠错码
- 纠错编码之所以具有检错和纠错能力，是因为在信息码之外附加了校验码（监督码）
- 校验码的引入，降低了信道的传输效率
- 错误类型：随机错误 + 突发错误
- 先检错后纠错：检错码 + 纠错码

## 线性分组码

- 信道编码
  - 分组码：一个码字的校验位只与信息位有关系
  - 卷积码：校验位不仅与当前码字的信息位有关系，还和其他信息位有关系
- 线性码：信息位与校验位是线性关系
- 码重：指码字中所含“1”的数目
- 码距：两个码字之间的距离/不相同的码元个数
- 汉明重量：任一码字的汉明重量都可以看作是该码字与 0 码字间的汉明距离
- (𝑁,𝐾) 分组码：每 K 个信息数字为一组，计算出 N 个编码数字构成一个分组，一个分组又称为一个码字
  - 码率：K/N
  - 校验位：R = N-K
  - 编码效率 = k / n
- 一个 [n, k] 线性分组码有 qkq^kqk 个码字，而 n 长数组有 qnq^nqn 种码字
- 使用 [n, k, d] 描述线性分组码，d 是最小码距
  - [n, M, d] 表示码字数目为 M 的任何码
  - [n, k, d] 最小码距等于非零码字的最小重量

## 生成矩阵

- 编码问题：给定参数 n、k，如何根据 k 个信息比特来确定 n-k 个校验比特
- **生成矩阵** G

  - 码字 C1∗n=m1∗kGk∗nC\_{1\*n}=m\_{1\*k}G\_{k\*n}C1∗n​=m1∗k​Gk∗n​
  - m={m1,..,mk}m = \{m\_1,..,m\_k\}m={m1​,..,mk​}
  - G 的**前** k 行 k 列是单位矩阵
- 码的系统化

  - 非系统码与系统码无本质区别，其生成矩阵可以通过矩阵的初等变换，转换为系统码形式，其码率不会改变
  - 会改变编码结果，因此在用系统化的 H 求出 G 后，还应该按照系统化前 H 中每列的顺序调整 G
- **校验矩阵** H

  - C1∗n∗H(n−k)∗nT=01∗(n−k)C\_{1\*n}\*H\_{(n-k)\*n}^T=0\_{1\*(n-k)}C1∗n​∗H(n−k)∗nT​=01∗(n−k)​
  - H 的**后** r 行 r 列是单位矩阵（r=n-k）
  - 每一行是一个**校验方程**：描述每一个校验位与信息位的对应关系 -> 相加为 0
- 生成矩阵与校验矩阵的关系：GHT=0T→GH^T=0^T \rightarrowGHT=0T→ $ \left{\begin{aligned} \mathbf{G}*{S} &=\left[\begin{array}{ll}\mathbf{I}* & \mathbf{Q}*{k \times r}\end{array}\right] \ \mathbf{H}* &=\left[\begin{array}{ll}\left(-\mathbf{Q}*{k \times r}\right)^{T} & \mathbf{I}*\end{array}\right] \end{aligned}\right. $

  - HHH 的第一部分在 GF(2) 下就是 QTQ^TQT
- 一个码的信息位可以看作其**对偶码**的校验位 -> (7, 3) 码的生成矩阵是 (7, 4) 码的校验矩阵
- 分组码的纠错能力是有限的，限制与最小码距相关

## Q 进制对称信道上的译码

- 译码准则：极大释然译码 = 最小汉明距离译码
  - 使信道转移概率最大 $ p(\mathbf{y} \mid \mathbf{x})=p(\mathbf{Z}) =(1-(p-1) \varepsilon)^{n}\left(\frac{\varepsilon}{1-(p-1) \varepsilon}\right)^{W\_{H}(\mathbf{y}-\mathbf{x})} $
- 伴随式译码
  - 伴随式：$ S^T=H Y{T}=H\left(X+Z^{T}\right)=H Z^{T} $
    - ZZZ 是**错误图样**，第几位为 1 则该位有误
      - 伴随式仅由错误图样决定
      - 对二元码，伴随式是 HHH 阵中与错误码元对应列之和
    - 对某一个错误图样 ZZZ 而言，伴随式 ST=HYTS^T=HY^TST=HYT 对应的**错误图样**的数量与**许用码字的**数量相同，都是 2k2^k2k
      - 因为 Zm=Xm+Z ∣ m∈[1,2k]Z\_m=X\_m+Z \ | \ m \in [1, 2^k]Zm​=Xm​+Z ∣ m∈[1,2k] 的伴随式都是一样的 SmT=H(Xm+Z)T=HZTS^T\_m=H(X\_m+Z)^T=HZ^TSmT​=H(Xm​+Z)T=HZT
    - 伴随式有多少个，就有多少个可以正确译码的情况，求**正确译码概率**时首先关注伴随式
  - 译码过程
    1. 计算伴随式 $ s=H Y^{T} $，确定错误图案
    2. 在给定伴随式 $ s $ 寻找最有可能的错误图案，即相应重量 $ W\_{H}(Z) $ 最小的错误图案 $ Z\_{0} $，使 $ p\left(Z\_{0}\right) $ 最大
    3. 输出 $ \hat{X}=Y-Z\_{0} $

## 标准阵列译码中的基本定理

- 译码规则

  - 码字的个数 $ 2^{\mathrm{k}} $，将 $ 2^{\mathrm{n}} $ 个可能的接收向量划分为 $ 2^{\mathrm{k}} $ 个互不相交的子集合 $ D\_{\mathrm{i}} $ $ \left(\mathrm{i}=1,2, \cdots, 2^{\mathrm{k}}\right) $ ，使得码字 $ \mathrm{v}*{\mathrm{i}} $ 包含在其中一个子集 $ \mathrm{D}*{\mathrm{i}} $ 中，这样每个子集和码字一一对应
  - 如果接收向量 $ r $ 在 $ D\_{i} $ 中，则将 $ r $ 译码成列 $ v\_{i} $，当且仅当 $ r $ 位于与传输码字相对应的子集 $ D\_{i} $ 中，译码才是正确的
- 标准阵列

  - 许用码字：在标准阵列的第一行，是 $ 2^k $ 种信息位对应的码字，全 0 的许用码字排在最左边
  - 禁用码字：错误的码字，许用码字之外的 2n−2k2^n-2^k2n−2k 个码字
  - 陪集：许用码字 XXX 为加上**陪集首** z0z\_0z0​ 组成的新码字集合（每一行是一个陪集）

    - 第一列全 0 的许用码字对应的禁用码字就是**陪集首**（全 0 的许用码字也是陪集首的第一个码字）
    - 陪集的行数和伴随式的数量相同，都是 2n−k2^{n-k}2n−k，应该按照**伴随式**来设置陪集首
  - 优先匹配重量最小的禁用码字，对应列的许用码字就是译码结果

## 最小码距和纠错能力

- 码 $ C=\left{x\_{1}, x\_{2}, \cdots, x\_{M}\right} $ 能纠正所有非零个数小于等于 $ \mathrm{t} $ 的错误 zzz，当且仅当 $ t \leq\left|\frac{d\_{\min }-1}{2}\right| $
- 设 CCC 是一个线性分组码，HHH 是它的校验矩阵，那么 CCC 能够纠正**单个**错误的纠错码的**充要条件**是 (1)(1)(1) HHH 中没有元素全为 0 的列矢量，且 (2)(2)(2) HHH 的任意两个列矢量都不相同
- 二元汉明码 $ \left(2r-1,2r-1-r\right) $ —— 能纠正所有单个错误的线性码
  - 校验位数为 rrr 的所有二元线性码中编码效率最高的码
  - 最小重量为 3（汉明码只能纠正三个错误）
  - 校验矩阵 HHH 的列就是 rrr 个 bit 的 2r−12^r-12r−1 种线性无关的非 0 组合

# 八、低密度奇偶校验码 LDPC

## 概述

- LDPC 码定义
  - 每一行表示一个校验方程约束，包含 p 个码元，每一行含有 p 个 1（远远低于列数 n）
  - 每一列表示一个码元参加 r 个校验方程，每一列含有 r 个 1（远远低于行数 l）
  - 任意两个校验方程包含至多一个相同码元，没有任何两行/两列具有超过一个相同位置的 1
- LDPC 码是一种线性分组码，具有低密度性质的奇偶校验码
  - 低密度：校验矩阵的稀疏特性 —— H 中含有 1 的个数较少
  - 补充：欠定 适定 超定
    - 欠定是有无穷解，方程个数比未知数少
    - 当未知数稀疏时，欠定方程可解
- LDPC 接近香农极限 C=Wlog(1+SNR)C=Wlog(1+SNR)C=Wlog(1+SNR)
- 正则 LDPC (n, r, p)
  - p 与 r 为常数的 H 矩阵的零空间
  - 每一行都有 p 个 1
  - 每一列都有 r 个 1

## Tanner 图编码

- Tanner 图
  - 校验矩阵构造一个二分图，两个顶点集：码元顶点集（列）在上面，校验节点集（行）在下面
  - 校验节点表示一个校验方程，当校验节点 sjs\_jsj​ 中含有码元比特 viv\_ivi​ 时，对应的码元节点与校验节点之间使用一条线相连
  - LDPC 码的任意一个长为 L 的环，满足 L≥6L\geq6L≥6 ，且 LLL 是 2 的倍数
    - 任意两个校验方程包含至多一个相同码元 -> LLL 不能为 4
  - 希望大环多，小环少
    - 环所在的码元，不能校验它们的全 1 和全 0 的情况
    - LLL 越大，不能校验的码元全取 1 或 0 的可能性越小
- 构造
  - Gallaer 构造：通过计算机搜索的方式进行列置换
  - 通过行/列分裂的码构造方法

## 比特翻转译码

- 译码过程
  1. 计算所有奇偶校验和，如果所有的奇偶校验和都为 0 ，则停止译码
  2. 对于接收序列的每个比特位 iii，计算含该位的**奇偶校验方程错误**的个数，记为 fif\_ifi​
  3. 选取 fif\_ifi​ 大于参数 σ\sigmaσ 的的比特位，组成集合 SSS，然后将 SSS 的比特位翻转
  4. 重复 1-4 步，直至所有的奇偶校验和等于 0 或者达到最大迭代次数
- 先绘制 Tanner 图，再观察 fif\_ifi​ 比较直观
- 中间步骤可能会错误翻转，如果 σ\sigmaσ 选得够好，最终更有可能把中间步骤的错误全部纠正

# 九、网络信息论

​ 网络 —— 多对多的信道 —— 考虑多个节点间通信的问题

​ 解决问题：分布式信源编码（数据压缩），分布式通信（找出网络的容量区域）

​ 压缩不仅要考虑当前信号自己的冗余度，也可以结合多个用户的相关性，将它们联合起来作压缩

## 多用户信道

- 多域：时 TDMA、频 FDMA、码 CDMA、空 SDMA
  - 符号/码元宽度（时间）越宽，频谱带宽越窄
- 信号处理核心问题
  - 处理噪声：y(t)=s(t)+v(t)y(t) = s(t) + v(t)y(t)=s(t)+v(t)
  - 分离多用户：y(t)=∑isi(t)+v(t)y(t) = \sum\_is\_i(t) + v(t)y(t)=∑i​si​(t)+v(t)
- 信道转移矩阵：描述多个用户/节点间相互干涉与噪声干扰
- 多用户信道
  - 信道容量 C ——多维空间中的区域的边界，信息传输率在区域中时，存在有效的编码
  - 问题：寻找**信道容量域**—— 确定多维空间中的区域的**边界**，信息传输率在信道容量域中时，存在有效的编码
- 广义信道容量：通信网中所有信源以低于信道容量的传输速率无差错传输信息 (as 𝑛→∞)
- 联合典型
  - 随机选取的序列对是联合典型的概率大约为 $ 2^{-n I(X ; Y)} $
  - X:2nH(X)X: 2^{nH(X)}X:2nH(X) 个长为 n 的典型序列
  - Y:2nH(Y)Y: 2^{nH(Y)}Y:2nH(Y) 个长为 n 的典型序列
  - XY:2nH(XY)XY: 2^{nH(XY)}XY:2nH(XY) 个长为 n 的典型序列

## 多接入信道

- 定义：多个信源到一个信宿，信源间无合作/通信
- 目标：

  - 使得多信源到信宿间的无差错的传输速率尽可能大
  - 分析 $ I\left(X\_{1} X\_{2} ; Y\right) $ 与各个信源传输速率 R1，R2 的关系，以及相应的编译码方法
- 信道容量区域：传输率向量是可以可达的（当编码长度趋于无限大时，误码率趋于 0）
- $ I\left(X\_{1} X\_{2} ; Y\right) $ 是多接入**信道传输率**, 但是不能直接在 $ p\left(x\_{1}, x\_{2}\right) $ 上对其最大化，因为这需要 X1 与 X2 相互通信（条件: $ X\_{1} \perp X\_{2} $ ）
- 用户间干扰：各个信源都需要处理信源与信宿间的噪声，但是各个信源都需要将**其他信源视为噪声**来处理
- 多址接入信道

  - 离散无记忆多接入信道 $ \operatorname{MAC}\left(\left(2^{n R\_{1}}, 2^{n R\_{2}}\right), n\right) $ 码
  - 定理 —— 多接入信道的容量区域为所有**可达**码率对 $ \left(R\_{1}, R\_{2}\right) $ 的组成集合的闭包，满足如下不等式：

    R1≤I(X1;Y∣X2)=H(X1∣X2)−H(X1∣X2Y)R2≤I(X2;Y∣X1)=H(X2∣X1)−H(X2∣X1Y)R1+R2≤I(X1,X2;Y)=H(X1X2)−H(X1X2∣Y)\begin{array}{c}
    R\_{1} \leq I\left(X\_{1} ; Y \mid X\_{2}\right) = H(X\_1|X\_2) - H(X\_1|X\_2Y) \\
    R\_{2} \leq I\left(X\_{2} ; Y \mid X\_{1}\right) = H(X\_2|X\_1) - H(X\_2|X\_1Y) \\
    R\_{1}+R\_{2} \leq I\left(X\_{1}, X\_{2} ; Y\right) = H(X\_1X\_2) - H(X\_1X\_2|Y)
    \end{array}
    R1​≤I(X1​;Y∣X2​)=H(X1​∣X2​)−H(X1​∣X2​Y)R2​≤I(X2​;Y∣X1​)=H(X2​∣X1​)−H(X2​∣X1​Y)R1​+R2​≤I(X1​,X2​;Y)=H(X1​X2​)−H(X1​X2​∣Y)​

    - 描述了 R1 R2 构成的坐标轴上容量区域的三个边
    - 链式法则：H(XY)=H(X)+H(Y∣X)H(XY)=H(X)+H(Y|X)H(XY)=H(X)+H(Y∣X)

      ​ --> $ \begin{aligned} I\left(X\_{1}, X\_{2} ; Y\right) &=I\left(X\_{1} ; Y\right)+I\left(X\_{2} ; Y \mid X\_{1}\right) = I\left(X\_{2} ; Y\right)+I\left(X\_{1} ; Y \mid X\_{2}\right) \end{aligned} $

      ​ --> $ I\left(X\_{1}, X\_{2} ; Y\right) \geq \max \left{I\left(X\_{1} ; Y \mid X\_{2}\right), I\left(X\_{2} ; Y \mid X\_{1}\right)\right}$
    - X1 与 X2 **独立**：I(X1;Y∣X2)=I(X1;YX2)I\left(X\_{1} ; Y \mid X\_{2}\right)=I(X\_1;YX\_2)I(X1​;Y∣X2​)=I(X1​;YX2​)
    - **结论**：$ \max \left{I\left(X\_{1} ; Y \mid X\_{2}\right), I\left(X\_{2} ; Y \mid X\_{1}\right)\right} \leq I\left(X\_{1}, X\_{2} ; Y\right) \leq I\left(X\_{1} ; Y \mid X\_{2}\right)+I\left(X\_{2} ; Y \mid X\_{1}\right) $

      - 左边的不等式说明下图一般不是三角形
      - 右边的不等式说明下图一般不是四边形（**独立**时取等）
  - 四个拐点与信道容量：

    - $ C\_{1}=\max *{p*\left(x\_{1}\right) p\_{2}\left(x\_{2}\right)} I\left(X\_{1} ; Y \mid X\_{2}\right) $
    - $ C\_{2}=\max *{p*\left(x\_{1}\right) p\_{2}\left(x\_{2}\right)} I\left(X\_{2} ; Y \mid X\_{1}\right) $
    - $ C\_{12}=\max *{p*\left(x\_{1}\right) p\_{2}\left(x\_{2}\right)} I\left(X\_{1} X\_{2} ; Y\right) $
  - [Image omitted: third-party image]
- 计算过程

  1. 遍历满足 H(X2)=0H(X\_2)=0H(X2​)=0 的 P(X2)P(X\_2)P(X2​)，让 I(X1;Y∣X2)I(X\_1;Y|X\_2)I(X1​;Y∣X2​) 取到最大值
     - 将 X2X\_2X2​ 固定后，给出新的信道矩阵，并用第四章的方法找到一个 P(X1)P(X\_1)P(X1​) 使 RRR 达到信道容量 CCC
  2. 固定上面求到的 X1X\_1X1​，用同样的方法求出令 I(X2;Y)I(X\_2;Y)I(X2​;Y) 取到最大值的 P(X2)P(X\_2)P(X2​)
     - 可以通过 R1+R2≤I(X1X2;Y)≤R(Y)R\_1+R\_2 \leq I(X\_1X\_2;Y) \leq R(Y)R1​+R2​≤I(X1​X2​;Y)≤R(Y)，算出 R(Y)R(Y)R(Y) 来快速判断 I(X2;Y)I(X\_2;Y)I(X2​;Y) 是否为 0
  3. I(X1X2;Y)=I(X2;Y)+I(X1;Y∣X2)I(X\_1X\_2;Y) = I(X\_2;Y) + I(X\_1;Y|X\_2)I(X1​X2​;Y)=I(X2​;Y)+I(X1​;Y∣X2​)
  4. 使用与 1、2 一样的方法求到另外两个点
- 独立二元对称信道 —— 四边形

  - [Image omitted: third-party image]
- 二元乘法信道 Y=X1X2Y=X\_1X\_2Y=X1​X2​ —— 三角形，C1=C2=1C\_1=C\_2=1C1​=C2​=1

  - [Image omitted: third-party image]
- 二元删除多接入信道 Y=X1+X2Y=X\_1+X\_2Y=X1​+X2​ —— 五边形，C1=C2=1C\_1=C\_2=1C1​=C2​=1，C12=log3=1.5C\_{12}=log3=1.5C12​=log3=1.5

  - [Image omitted: third-party image]
- MAC 可达性定理

## 高斯多接入信道

- 高斯多接入信道

  - $ Y=g\_{1} X\_{1}+g\_{2} X\_{2}+Z $ 其中 $ g\_{i} $ 为信道增益，$ Z $ 为高斯噪声
  - 传输时刻 $ i $，有 Yi=g1Xi1+g2Xi2+ZiY\_{i}=g\_{1} X\_{i}^{1}+g\_{2} X\_{i}^{2}+Z\_{i}Yi​=g1​Xi1​+g2​Xi2​+Zi​，$ Z\_{i} $ 与信道输入独立。
  - 信号的平均功率 P1、P2 受限
  - 定义信道容量函数 $ C(S) \triangleq \frac{1}{2} \log (1+S) $， 其中 $ S $ 为信噪比
  - 上界可以表述为（噪声功率归一化为 1）
    - $ R\_{1} \leq C\left(\frac{P\_{1}}{N}\right)=C\left(S\_{1}\right) $
    - $ R\_{2} \leq C\left(\frac{P\_{2}}{N}\right)=C\left(S\_{2}\right) $
    - $ R\_{1}+R\_{2} \leq C\left(\frac{P\_{1}+P\_{2}}{N}\right)=C\left(S\_{1}+S\_{2}\right) $
- 译码考虑成两步

  - 接收端将发送器 1 看成噪声的一部分，先将发送器 2 的码字译码出来
    - $ C\_{12} - C\_1 = C\left(\frac{P\_{2}}{P\_{1}+N}\right) ，，，R\_2$ 小于该值说明错误概率可达任意小
  - 将已成功译出的发送端 2 “减去”
    - 若 R1≤C(P1N)R\_{1} \leq C\left(\frac{P\_{1}}{N}\right)R1​≤C(NP1​​) 则能正确译码
- 常采用**时分多路**通信方式，但该方式不是最佳的方案

  - 要么 1 发送，要么 2 发送
  - 若两发送端各占**一半**的传送时间，可达容量区域是从原区域中截取的**三角形**
  - 只有一个用户传送，功率可以变大：
    - $ R\_{1} \leq \frac{\alpha}{2} \log \left(1+\frac{P\_{1}}{\alpha \sigma^{2}}\right) $
    - $ R\_{2} \leq \frac{(1-\alpha)}{2} \log \left(1+\frac{P\_{2}}{(1-\alpha) \sigma^{2}}\right) $
    - α\alphaα 是 1 所占的发射时间比例
    - 此时是类似扇形的形状，$ \alpha=\frac{P\_{1}}{P\_{2}+P\_{1}} $ 是扇形与五边形的切点
- 对于**频分多路**通信方式，每个发送器的传输速率依赖于所允许传输的带宽

  - $ R\_{1} \leq \frac{W\_{1}}{2} \log \left(1+\frac{P\_{1}}{W\_{1} N\_{0}}\right) $
  - $ R\_{2} \leq \frac{W\_{2}}{2} \log \left(1+\frac{P\_{2}}{W\_{2} N\_{0}}\right) $
  - 总带宽 W=W1+W2W=W\_1+W\_2W=W1​+W2​
  - 也是类似扇形的形状
- 在**相同的平均功率约束**下，**时分多址**和**频分多址**可达到的信息传输速率均**小于**理论给出的容量域，但都可使速率**达到**理论容量域所给的**最大值**（切点），而**码分多址**的可达速率域与**理论容量**域一致
- [Image omitted: source image unavailable]

## 相关信源编码

- 将香农第一定理 Rx+Ry≥H(X)+H(Y)R\_{x}+R\_{y} \geq H(X)+H(Y)Rx​+Ry​≥H(X)+H(Y) 放缩到 $ R\_{x}+R\_{y} \geq H(X, Y) $
- Slepian & Wolf 定理：当信源是相关的情况下，即使仅能只对各自信源进行压缩时，也能达到联合熵

  - X -> H(X)
  - Y -> H(Y|X) < H(Y)
- 两个编码器，一个译码器

  - 核心：联合编码而无联合输入
- 可达码率区域：

  ​ R1≥H(X∣X)R2≥H(Y∣X)R1+R2≥H(X,Y)\begin{aligned} R\_{1} & \geq H(X \mid X) \\ R\_{2} & \geq H(Y \mid X) \\ R\_{1}+R\_{2} & \geq H(X, Y) \end{aligned}R1​R2​R1​+R2​​≥H(X∣X)≥H(Y∣X)≥H(X,Y)​

# 十、卷积码

## (n, k, m) 卷积码

- 在卷积码的约束长度内，前后各组是密切相关的，m 是编码记忆
- 卷积码充分利用了各组之间的相关性，n 和 k 可以用比较小的数
  - 性能一般比分组码好
- 关联性
  - 卷积码 (m+1)∗n(m + 1) \* n(m+1)∗n 个码元相关
    - **约束长度** nA=n(m+1)n\_A=n(m+1)nA​=n(m+1)
    - 1 bit 的信息对编码器输出可以造成影响的最大数目
  - 分组码 n 个码元相关
- **编码效率** R=k/nR = k / nR=k/n
  - 信息位数与码长之比
- 编码器
  - 串/并转换器：并行化 k 个信息元
  - 移位寄存器：存储最近的 m 组信息位
  - 把 m+1 组信息位按照每个信息元对应相加

## 描述方式

- 电路图

  - 相邻一段时间的信息位，抽头得到码字
  - 抽头系数决定哪些信息位会求和
- 生成序列/生成元 ggg

  - 生成元：决定生产的码字与 m+1m+1m+1 组信息位的关系
  - 输入与生成元作**卷积**就能得到编码输出
    - 相当于按照输入序列中 1 的位置来移位生成元，并将所有移位结果相加
  - 多个生成元卷积得到的多条输出流，**交织**后合并成一个流
    - 比如 (1,2,3)(1,2,3)(1,2,3) 交织 (4,5,6)(4,5,6)(4,5,6) 得到 (14,25,36)(14,25,36)(14,25,36)
- 生成矩阵 GGG

  - 第一行是 nnn 个生成元**交织**后的序列，后面的每一行都**恒等于**前面的行（都是完整的），但向右移了 nnn 位
  - 若输入序列 u 为无限长，则 G 为半无限矩阵
  - 将 G 按交织分为 nnn 列一组，输入序列乘以 G，就能得到与生成元卷积相同的结果
- 生成多项式

  - 延迟算子 DDD 的幂次表示序列中的某一位相对于起始位延迟的时间单位数
    - DDD 延迟一次，D2D^2D2 延迟两次 …
  - 生成过程
    1. 写出输入序列的生成多项式 u(D)u(D)u(D)，生成多项式矩阵 G(D)G(D)G(D)
    2. 求解 v(D)=u(D)G(D)v(D)=u(D)G(D)v(D)=u(D)G(D)，使用模二加
    3. 将 v(D)v(D)v(D) 转为交织后的编码
- 状态图

  - 状态图就是反映编码器中**寄存器**存储状态转移的关系图，它用编码器中寄存器的状态及其随输入序列而发生的转移关系来描述编码过程
  - 需要先确定状态转移方程与输出方程
  - 状态转移表
    - 记录各**状态**在不同**输入**下，会转移的下个状态，以及对应的输出码字
      - 状态就是之前的 mmm 个输入，理解为寄存器的当前值
      - 每一列表示一个输入，每一行表示一个状态状态
      - (i,j)(i,j)(i,j) 元素表示状态为 σj\sigma\_jσj​ 时，输入 uiu\_iui​ 后转移到到下一个状态，以及此时的编码输出
  - 网格图
    - 任何一个编码输出序列都对应着网格图中的唯一条路径
    - 不同的输入有不同的路径，但不能任意画路径，必须满足状态转移的分支

## 维特比译码算法

- **极大似然**译码原则
  - 应汉明距离最小
  - 辨明极大释然和联合典型的关系？
- 在**网格图**的**所有路径**中找出编码输出序列与接收序列汉明距离最小的那一条
  - 逐层绘制网格图，累加路径上的汉明距离
    - 状态度量就是路径的汉明距离
  - 网格图某点如果有多个路径到达，保留汉明距离最小的那条
