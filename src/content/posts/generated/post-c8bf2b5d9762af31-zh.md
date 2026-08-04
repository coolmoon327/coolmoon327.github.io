---
title: "最优化理论与算法课程重点"
date: "2022-10-23"
description: "涵盖凸性、线性与对偶规划、无约束方法及约束最优化的课程重点笔记。"
tags: ["optimization", "linear-programming", "convex-optimization"]
categories: ["Mathematics"]
locale: "zh"
slug: "optimization-theory-course-notes"
sourceId: "post-c8bf2b5d9762af31"
translationKey: "post-c8bf2b5d9762af31"
generated: true
draft: false
---

# 最优化理论与算法

## 一、最优化问题与数学基础

- 方向导数 = 梯度 \* 单位方向，正负表示上升与下降
- 最速下降的步伐 t=−gT∗PPT∗H∗Pt = \frac{-g^T\*P}{P^T\*H\*P}t=PT∗H∗P−gT∗P​
- 泰勒展开

f(X)=f(X0)+∇f(X0)T(X−X0)+12(X−X0)T∇2f(X0)(X−X0)+o(∥X−X0∥2)\begin{aligned} f(\boldsymbol{X}) &=f\left(\boldsymbol{X}^{0}\right) \\ &+\nabla f\left(\boldsymbol{X}^{0}\right)^{T}\left(\boldsymbol{X}-\boldsymbol{X}^{0}\right) \\ &+\frac{1}{2}\left(\boldsymbol{X}-\boldsymbol{X}^{0}\right)^{T} \nabla^{2} f\left(\boldsymbol{X}^{0}\right)\left(\boldsymbol{X}-\boldsymbol{X}^{0}\right) \\ &+o\left(\left\|\boldsymbol{X}-\boldsymbol{X}^{0}\right\|^{2}\right) \end{aligned}
f(X)​=f(X0)+∇f(X0)T(X−X0)+21​(X−X0)T∇2f(X0)(X−X0)+o(∥∥∥​X−X0∥∥∥​2)​

- 驻点 + 半正定 <–> 局部极小点
- 凸集的**交**是凸集，**并**可以不是，两个凸集对应元素的**数值加减**得到的集合也是凸集
- 凸集的定义是对于任何两个点的，但实际上对于任意有限点的**凸组合**也一定在凸集内
- 凸函数主要用 Hesse 矩阵的**半定性**证明，半定可以用**顺序主子式**是否大于等于 0 看
- 部分题型也可以用凸函数的定义来证明：凸组合的函数值<=函数值的凸组合凸组合的函数值 <= 函数值的凸组合凸组合的函数值<=函数值的凸组合
- 凸规划的**目标函数值**和**可行域**都是凸的，凸规划的 KT 点直接就是最优值（局部最优就是全局最优），不需要判断二阶必要条件
- 目标函数值为严格凸函数时，最优解唯一，可以用来回答考试中的某个大题

## 二、线性规划

> 无穷个最优解：超过约束个数的判别数为0
>
> 无最优解（无穷解）：判别数 > 0 但对应的列向量全部 <= 0
>
> 无解：大M法无最优解
>
> 无可行解：两阶段法的最优解包含人工变量、大M法的最优解包含人工变量

- 形如 AX>=bAX >= bAX>=b 的约束称为平凡约束
- 一般地，线性规划的数学模型都是目标取 min，使用非平凡约束，决策变量非负
- 标准型（b 非负）

[Image omitted: third-party image]

- 标准化方法

[Image omitted: third-party image]

- 判别数 σj=CITPj−cj\sigma\_{j}=\boldsymbol{C}\_{\boldsymbol{I}}^{T} \boldsymbol{P}\_{j}-c\_{j}σj​ 决定了哪些变量需要入基，全部判别数<=0全部判别数 <= 0全部判别数<=0 说明找到了最优解
- 判别数大于 0，但对应的向量全小于等于 0，说明**无最优解**（解为负无穷）
- 基变量的判别数为 0，非基变量的取值为 0，取 0 的判别数的个数大于约束个数时，说明有**无穷多个最优解**（解在可行域的边上）
- 主元选择

  - 判别数最大的列 jjj
  - bi/Pi,jb\_i/P\_{i,j}bi​/Pi,j​ 大于 0 且最小的行 iii
- 修正单纯形法的区别

  - 选择最左边的正判别数列
  - 多个行满足条件时，选择最上面的那一行
- 两阶段法：引入人工变量，第一阶段消掉人工变量，第二阶段以上一阶段的最终状态开始进行普通单纯形求解
- 初始基没有消掉人工变量：

  - 人工变量不全为 0，说明原规划**无可行解**
  - 人工变量全为 0，此时对应的 b 肯定为 0
    - 该行的系数不全为 0，可以**强行换基**
    - 该行的系数全为 0 说明与其他约束线性相关，直接**删去该行**即可
- 大 M 法：在目标中加入人工变量项，并设置一个极大的系数 M

  - 人工变量不全为 0：原规划**无可行解**
  - 无最优解：原规划**无解**（这里的无解是否就是无最优解？）
- 使用修正单纯形法快速更新单纯形表：

  - 以当前单纯形表为基础，判断几步后的基变量是哪几个（假设是 x2x\_2x2​ 和 x5x\_5x5​）
  - 选择几步后基变量对应的列向量，做成 BBB 矩阵（B=[P2,P3]B = [P\_2, P\_3]B=[P2​,P3​）
  - 对 BBB 矩阵求逆得到 B−1B^{-1}B−1
  - 用 B−1B^{-1}B−1 乘上当前单纯形表中的任意列，就是几步后单纯形表中的列
  - 判别数 σj=CBTB−1Pj−cj\sigma\_{j}=\boldsymbol{C}\_{\boldsymbol{B}}^{T} \boldsymbol{B}^{-1} \boldsymbol{P}\_{j}-c\_{j}σj​

## 三、对偶线性规划

- 变换规则

[Image omitted: third-party image]

- 弱对偶定理：min>=maxmin >= maxmin>=max

  - 一个有无界解，则另一个无可行解
  - 除此以外，两个规划的解的存在情况应该一样
- 强对偶定理：二者最优值相等

  - 对偶规划的最优解可直接用 (CBTB−1)T\left(\boldsymbol{C}\_{\boldsymbol{B}}^{T} \boldsymbol{B}^{-1}\right)^{T}(CBT​B−1)T 求出
  - 对偶规划的最优解就是原规划**松弛变量判别数的相反数**
- 互补松弛定理：其中一个规划的变量不为 0，则其**对偶约束**取等
- 对偶单纯形法

  - 要找出全部 判别数<=0判别数 <= 0判别数<=0 的初始正则解
  - 允许 b 为负
  - 其实就是单纯形表的转置
    - 先找 b 的第一个负分量所在行 iii
    - 再找 判别数/系数判别数 / 系数判别数/系数 最小的列 jjj
    - 换基和普通的方法一样

## 四、无约束最优化

- 求一元函数 φ(t)=f(Xk+tPk)\varphi(t)=f\left(\boldsymbol{X}^{k}+t \boldsymbol{P}^{k}\right)φ(t)=f(Xk+tPk) 极小点的迭代法称为**一维搜索**或直线搜索。
  - 优点：在下降方向下降最多；求一元函数极值容易
  - 缺点：计算量大
  - 前后两次迭代方向相互**垂直**（前一个梯度与后一个梯度垂直）
- 收敛速度 lim⁡k→∞∥Xk+1−X⋆∥∥Xk−X⋆∥=β\lim \_{k \rightarrow \infty} \frac{\left\|\boldsymbol{X}^{k+1}-\boldsymbol{X}^{\star}\right\|}{\left\|\boldsymbol{X}^{k}-\boldsymbol{X}^{\star}\right\|}=\betalimk→∞​∥Xk−X⋆∥∥Xk+1−X⋆∥​=β
  - β=0\beta = 0β=0 超线性收敛
    - 分母次数为 ppp 时，若依旧存在不为无穷的极值，则为 ppp 阶收敛
  - β=1\beta = 1β=1 次线性收敛
  - β\betaβ 线性收敛
- 二次收敛性：一个算法用于求解具有正定矩阵的二次函数 f(X)=12XTAX+bTX+cf(\boldsymbol{X})=\frac{1}{2} \boldsymbol{X}^{T} \boldsymbol{A} \boldsymbol{X}+\boldsymbol{b}^{T} \boldsymbol{X}+cf(X)=21​XTAX+bTX+c 时，在有限步内可以达到它的极小点。
- 终止准则：相邻迭代点之间、相邻函数值之间的距离未有太大改善，或是梯度足够小
- 黄金分割法（黄金分割比 5−12\frac{\sqrt{5}-1}{2}25​−1​）

[Image omitted: third-party image]

- Fibonacci 法

  - 列出 Fibonacci 级数：F\_0 = 1, F\_1 = 1, F\_2 = 2, F\_3 = 3,F\_4 = 5,...
  - 计算 搜索区间长度/目标精度搜索区间长度 / 目标精度搜索区间长度/目标精度，找到比该值大且最接近的 Fibonacci 数（收敛比=1Fn收敛比 = \frac{1}{F\_n}收敛比=Fn​1​）
  - Fn−2Fn\frac{F\_{n-2}}{F\_n}Fn​Fn−2​​ 和 $$\frac{F\_{n-1}}{F\_n}$$ 就是黄金分割法中 t1t\_1t1​、t2t\_2t2​ 两点在搜索区间上对应的比例
  - 使用和黄金分割法一样的思路找下一个区间，并进行迭代（n 的取值依次减小）
- 三点二次插值法

  - 在目标函数上随便找三个点，用它们构造出二次函数
  - 取二次函数的极值作为新点，求出该新点对应的目标函数值
  - 在这四个点中，找出三个连着且两边高中间低的点，迭代
- 非精确一维搜索：只保证每次搜索时目标函数有满意的下降

  - Goldstein：避免 ttt 取在区间的两个端点附近，导致改进量不大
    - 最佳步长可能在可接受区间外
  - Wolfe：保留 Goldstein 的上限约束，让可接受点处的切线斜率大于或等于初始斜率的 σ\sigmaσ 倍
  - Armijo：f(Xk+βmkτPk)≤f(Xk)+ρβmkτ∇f(Xk)TPkf\left(\boldsymbol{X}^{k}+\beta^{m\_{k}} \tau \boldsymbol{P}^{k}\right) \leq f\left(\boldsymbol{X}^{k}\right)+\rho \beta^{m\_{k}} \tau \nabla f\left(\boldsymbol{X}^{k}\right)^{T} \boldsymbol{P}^{k}f(Xk+βmk​τPk)≤f(Xk)+ρβmk​τ∇f(Xk)TPk
- 最速下降法

  - P=−gP=-gP=−g
  - t=−gT∗PPT∗H∗Pt = \frac{-g^T\*P}{P^T\*H\*P}t=PT∗H∗P−gT∗P​
  - X′=X+tPX' = X + tPX′=X+tP
  - 相邻两次迭代的方向相互垂直，收敛速度开始快后面慢
- 牛顿法：对目标函数泰勒展开后得到一个二次函数去近似目标函数，求极值

  - P=−H−1gP=-H^{-1}gP=−H−1g
  - X′=X+PX' = X +PX′=X+P
  - 有**二次收敛性**与二阶收敛速度
  - 要求初始点在极小点的邻域（可能开始慢后面快），Hesse 矩阵正定（否则用最速下降法）
  - 牛顿方向不一定是下降方向
    - 与梯度接近垂直时，应该使用最速下降法
    - 上山方向时，应该取反方向作为搜索方向，进行一维搜索
- 共轭方向法：牛顿法和最速下降法的折衷

  - 具有**二次收敛性**
  - 共轭：XTQY=0X^TQY=0XTQY=0
  - 向量组共轭就是内部元素两两共轭，且必然线性无关
  - 共轭梯度法：本质是找新的方向与上一次的方向共轭

    - 当前梯度与以前的方向垂直，所有梯度两两垂直，所有方向两两共轭，必是下山方向[Image omitted: third-party image]
  - 拟牛顿法：用变尺度矩阵和 Hesse 矩阵的逆近似

    - 对称秩一
    - 对称秩二：在 SR1 的基础上，想办法让正定性传递下去
      - DFP 算法——正定遗传性、复杂度高
      - 在第 n 步（Hn−1H^{n-1}Hn−1，此处 H 和前面不一样，因此用 G 表示 Hesse）时就已经完成了搜索，此时与 G−1G^{-1}G−1 只差个系数，第 n+1 步（HnH^{n}Hn）的变尺度矩阵就是 G−1G^{-1}G−1
    - Broyden 校正公式时 SR1 和 SR2 的加权组合
    - Huang 校正公式自由度更大
    - BFGGS 是求解器中的默认选择，比 DFP 有更好的数值稳定性（误差不容易随迭代变大），更适合不正定的一般优化问题，但本质是一样的
  - 信赖域方法

    min⁡qk(S)=f(Xk)+(gk)TS+12STGkSs.t.∥S∥≤hk.\min \quad q^{k}(\boldsymbol{S})=f\left(\boldsymbol{X}^{k}\right)+\left(\boldsymbol{g}^{k}\right)^{T} \boldsymbol{S}+\frac{1}{2} \boldsymbol{S}^{T} \boldsymbol{G}^{k} \boldsymbol{S} \\
    s.t. \quad
    \|S\| \leq h^{k} .
    minqk(S)=f(Xk)+(gk)TS+21​STGkSs.t.∥S∥≤hk.

    Δfk=f(Xk)−f(Xk+Sk)Δqk=f(Xk)−qk(Sk)rk=Δfk/Δqk\Delta f^{k}=f\left(\boldsymbol{X}^{k}\right)-f\left(\boldsymbol{X}^{k}+\boldsymbol{S}^{k}\right)\\
    \Delta q^{k}=f\left(\boldsymbol{X}^{k}\right)-q^{k}\left(\boldsymbol{S}^{k}\right)\\
    r^{k}=\Delta f^{k} / \Delta q^{k}
    Δfk=f(Xk)−f(Xk+Sk)Δqk=f(Xk)−qk(Sk)rk=Δfk/Δqk

    - rrr 接近 0 则说明逼近差，缩小 hhh：hk+1=∣∣Sk∣∣/4h^{k+1}=||S^k||/4hk+1=∣∣Sk∣∣/4
    - rrr 接近 1 则说明逼近好，或者约束为紧，增大 hhh：hk+1=2∗hkh^{k+1}=2\*h^khk+1=2∗hk
    - 有总体收敛性和二阶收敛速度

## 约束最优化

- 最优性条件

  - 正则解：积极约束线性无关
    - 最优性的前提
  - 一阶必要条件

  ∇f(X⋆)=∑i∈I(X⋆)λi⋆∇gi(X⋆)+∑j=1lμj⋆∇hj(X⋆)λi⋆≥0,i=1,2,⋯ ,mλi⋆gi(X⋆)=0,i=1,2,⋯ ,mgi(X⋆)≥0,i=1,2,⋯ ,mhj(X⋆)=0,j=1,2,⋯ ,l\nabla f\left(\boldsymbol{X}^{\star}\right)=\sum\_{i \in \mathcal{I}\left(\boldsymbol{X}^{\star}\right)} \lambda\_{i}^{\star} \nabla g\_{i}\left(\boldsymbol{X}^{\star}\right)+\sum\_{j=1}^{l} \mu\_{j}^{\star} \nabla h\_{j}\left(\boldsymbol{X}^{\star}\right)\\
  \lambda\_{i}^{\star} \geq 0, \quad i=1,2, \cdots, m \\
  \lambda\_{i}^{\star} g\_{i}\left(\boldsymbol{X}^{\star}\right)=0, \quad i=1,2, \cdots, m \\
  g\_{i}\left(\boldsymbol{X}^{\star}\right) \geq 0, \quad i=1,2, \cdots, m \\
  h\_{j}\left(\boldsymbol{X}^{\star}\right)=0, \quad j=1,2, \cdots, l
  ∇f(X⋆)=i∈I(X⋆)∑​λi⋆​∇gi​(X⋆)+j=1∑l​μj⋆​∇hj​(X⋆)λi⋆​≥0,i=1,2,⋯,mλi⋆​gi​(X⋆)=0,i=1,2,⋯,mgi​(X⋆)≥0,i=1,2,⋯,mhj​(X⋆)=0,j=1,2,⋯,l

  - 二阶充分条件
    - 凸优化直接满足，5-1-10 内部是正定矩阵也满足
    - 这里的 F 其实就是可行方向
      - **紧**的不等约束，lambda 取 0 时只需要方向导数与约束同号，否则就要求方向导数为 0
      - 等式约束要求方向导数为 0[Image omitted: third-party image]
  - 惩罚函数法

    - 基本思想: 若当前迭代点不满足可行性或有不满足可行性的趋势，则对其函数值添加一个比较大的数字（惩罚项），迫使迭代点在极小化的过程中向可行区域靠近或满足可行性。
    - 优缺点: **算法简单**，可以用求解**无约束优化问题**的方法求解约束优化问题，然而**罚因子选择困难**，容易出现**数值不稳定**情形；外点法通常得到的解**不满足可行性**，而内点法满足；外点法可以处理所有约束，而内点法只能处理**不等式约束**。
    - 外点罚函数法

      - 罚函数：P(X,mk)=f(X)+mk(∑i=1m(min⁡{gi(X),0})2+∑j=1l(hj(X))2)P\left(\boldsymbol{X}, m\_{k}\right)=f(\boldsymbol{X})+m\_{k}\left(\sum\_{i=1}^{m}\left(\min \left\{g\_{i}(\boldsymbol{X}), 0\right\}\right)^{2}+\sum\_{j=1}^{l}\left(h\_{j}(\boldsymbol{X})\right)^{2}\right)P(X,mk​)=f(X)+mk​(∑i=1m​(min{gi​(X),0})2+∑j=1l​(hj​(X))2)
      - 对其求导，并讨论哪些约束不满足，得到 X 关于 m 的表达式
      - 令 m 取无穷，得到最终的 X 取值
    - 内点罚函数法

      - 罚函数

        P(X,rk)=f(X)+rk∑i=1m1gi(X)P\left(\boldsymbol{X}, r\_{k}\right)=f(\boldsymbol{X})+r\_{k} \sum\_{i=1}^{m} \frac{1}{g\_{i}(\boldsymbol{X})}P(X,rk​)=f(X)+rk​∑i=1m​gi​(X)1​

        P(X,rk)=f(X)−rk∑i=1mln⁡gi(X)P\left(\boldsymbol{X}, r\_{k}\right)=f(\boldsymbol{X})-r\_{k} \sum\_{i=1}^{m} \ln g\_{i}(\boldsymbol{X})P(X,rk​)=f(X)−rk​∑i=1m​lngi​(X)

        P(X,rk)=f(X)+rk∑i=1m1(gi(X))2P\left(\boldsymbol{X}, r\_{k}\right)=f(\boldsymbol{X})+r\_{k} \sum\_{i=1}^{m} \frac{1}{\left(g\_{i}(\boldsymbol{X})\right)^{2}}P(X,rk​)=f(X)+rk​∑i=1m​(gi​(X))21​
      - 对其求导，得到 X 关于 r 的表达式
      - 令 r 取 0，得到最终的 X 取值
  - 乘子法（只考一个不等式约束）

    - 乘子罚函数： ϕ(X,W,σ)=f(X)+12σ∑i=1m(wi+12−wi2)\phi(\boldsymbol{X}, \boldsymbol{W}, \sigma)=f(\boldsymbol{X})+\frac{1}{2 \sigma} \sum\_{i=1}^{m}\left(w\_{i+1}^{2}-w\_{i}^{2}\right)ϕ(X,W,σ)=f(X)+2σ1​∑i=1m​(wi+12​−wi2​)
    - 乘子更新：wik+1=max⁡{0,wik−σgi(Xk)},i=1,⋯ ,m.w\_{i}^{k+1}=\max \left\{0, w\_{i}^{k}-\sigma g\_{i}\left(\boldsymbol{X}^{k}\right)\right\}, i=1, \cdots, m.wik+1​=max{0,wik​−σgi​(Xk)},i=1,⋯,m.
    - 分情况讨论，对罚函数求导，得到 X 关于 w 的表达式
    - 带入 w 的更新公式，讨论 w 收敛到哪个值，再反过来求出 X
  - Rosen 梯度投影法

    - 思想：若当前迭代点到负梯度方向不是可行方向，则将其投影到积极约束的交线上，从而使其成为下降可行方向[Image omitted: third-party image]
