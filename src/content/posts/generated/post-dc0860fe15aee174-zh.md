---
title: "马尔可夫调制泊松过程"
date: "2022-10-24"
description: "介绍 MMPP 的定义、排队应用、矩阵表示与 NumPy 实现。"
tags: ["mmpp", "markov-chain", "queueing-theory"]
categories: ["Research Notes"]
locale: "zh"
slug: "markov-modulated-poisson-process"
sourceId: "post-dc0860fe15aee174"
translationKey: "post-dc0860fe15aee174"
generated: true
draft: false
---

# MMPP

## 目标问题

Markov-modulated Poisson process (MMPP) 可以用于解决多个随机过程的**叠加**问题（superposition），因为它定性地模拟了时变的到达率，并捕获了到达间隔时间之间的一些重要相关性，同时仍然保持了分析上的可处理性。

通常，MMPP 描述的是排队系统的输入，可以建模 MMPP/G/1 排队系统。

## 定义

MMPP 是一种双随机泊松过程，到达率使用 λ∗(J(t))\lambda^\*(J(t))λ∗(J(t)) 描述，其中 $$J(t)$$ 是 m-状态的不可约马尔可夫过程。根据 m-状态不可约连续时间马尔可夫链，可以通过改变泊松过程的到达率来构造 MMPP，比如当马尔可夫链处于状态 iii 时，柏松的到达率对应为 $$\lambda(i)$$。

MMPP 通过使用无穷小生成元 Q 的 m-状态连续时间马尔可夫链和 m 个柏松到达率 λ1,λ2,…,λm\lambda\_{1}, \lambda\_{2}, \ldots, \lambda\_{m}λ1​,λ2​,…,λm​ 来描述：

Q=[−σ1σ12⋯σ1mσ21−σ2⋯σ2m⋮⋮⋱⋮σm1σm2⋯−σm]σi=∑j=1j≠imσijΛ=diag⁡(λ1,λ2,…,λm)λ=(λ1,λ2,…,λm)T\begin{aligned}
Q &=\left[\begin{array}{cccc}
-\sigma\_{1} & \sigma\_{12} & \cdots & \sigma\_{1 m} \\
\sigma\_{21} & -\sigma\_{2} & \cdots & \sigma\_{2 m} \\
\vdots & \vdots & \ddots & \vdots \\
\sigma\_{m 1} & \sigma\_{m 2} & \cdots & -\sigma\_{m}
\end{array}\right] \\
\sigma\_{i} &=\sum\_{j=1 \atop j \neq i}^{m} \sigma\_{i j} \\
\Lambda &=\operatorname{diag}\left(\lambda\_{1}, \lambda\_{2}, \ldots, \lambda\_{m}\right) \\
\lambda &=\left(\lambda\_{1}, \lambda\_{2}, \ldots, \lambda\_{m}\right)^{\mathrm{T}}
\end{aligned}
Qσi​Λλ​=⎣⎢⎢⎢⎢⎡​−σ1​σ21​⋮σm1​​σ12​−σ2​⋮σm2​​⋯⋯⋱⋯​σ1m​σ2m​⋮−σm​​⎦⎥⎥⎥⎥⎤​=j=ij=1​∑m​σij​=diag(λ1​,λ2​,…,λm​)=(λ1​,λ2​,…,λm​)T​

在对 MMPP 的描述中，我们假定它是齐次的，也就是说 QQQ 和 Λ\LambdaΛ 不随时间改变。

值得注意的是，MMPP 并非更新过程，而是马尔可夫更新过程，他只在特殊的情况下进行更新。因为 MMPP 的到达时间间隔不是指数级的，而是取决于前次到达与本次到达的状态，因此 MMPP 使用马氏状态与到达时间间隔共同描述更新序列 {(Jn,Xn),n⩾0}\left\{\left(J\_{n}, X\_{n}\right), n \geqslant 0\right\}{(Jn​,Xn​),n⩾0}。

## 代码实现

```
import numpy as np

class LinearSolver:
    @classmethod
    def AX_equal_b(self, A, b):
        """求解非齐次方程 AX = b"""
        ans = np.linalg.inv(A).dot(b)
        return ans

    @classmethod
    def AX_equal_0(self, A):
        """求解齐次方程 AX = 0"""
        def solution(U):
            # find the eigenvalues and eigenvector of U(transpose).U
            e_vals, e_vecs = np.linalg.eig(np.dot(U.T, U))
            # extract the eigenvector (column) associated with the minimum eigenvalue
            return e_vecs[:, np.argmin(e_vals)]
        ans = solution(A)
        return ans

    @classmethod
    def rank(self, A):
        """获得矩阵的迹"""
        return np.linalg.matrix_rank(A)

class MMPP:
    def __init__(self, max_load_internal=5) -> None:
        self.state_num = 3
        num = self.state_num
        self.trans_mat = np.array([[0. for _ in range(num)] for _ in range(num)])   # 转移概率矩阵
        self.init_dist = np.array([0. for _ in range(num)])     # 初始分布
        self.steady_dist = np.array([0. for _ in range(num)])   # 稳态分布

        # 这里需要控制 lam 的随机值和 r * max_load_internal 处于同一量级（简单的做法是让其均值为该数）
        r = 0.2
        # self.state_lambda = np.array([(1. * np.random.randint(0, 1000)/500. * (max_load_internal * r)) for _ in range(num)])
        self.state_lambda = np.array([0. for _ in range(num)])
        for i in range(num):
            self.state_lambda[i] = (i+1) * (max_load_internal * r) / 2.

        self.mean_arrival = 0.

        self.state = -1

        self.reset_params()

    def generate_arrivals(self):
        # 输出当前状态下到达的事件个数
        lam = self.state_lambda[self.state]
        arrivals = np.random.poisson(lam=lam)
        return arrivals

    def next_state(self):
        num = self.state_num
        i = self.state
        self.state = num    # 给个初值，以免 r 取到 1.
        r = np.random.randint(0, 1000) * 1. / 1000.
        now_ = 0.
        for j in range(num):
            next_ = now_ + self.trans_mat[i][j]
            if now_ <= r < next_:
                self.state = j
                break
            now_ = next_

    def reset_state(self):
        num = self.state_num
        self.state = num    # 给个初值，以免 r 取到 1.
        r = np.random.randint(0, 1000) * 1. / 1000.
        now_ = 0.
        for j in range(num):
            next_ = now_ + self.init_dist[j]
            if now_ <= r < next_:
                self.state = j
                break
            now_ = next_

    def reset_params(self):
        num = self.state_num
        # 生成转移矩阵
        rank = 0
        while rank != num:
            for i in range(num):
                p = []
                for j in range(num):
                    p.append(np.random.randint(0, 1000))
                for j in range(num):
                    self.trans_mat[i][j] = 1. * p[j] / sum(p)
            rank = LinearSolver.rank(self.trans_mat)
        # 生成初始分布
        p = []
        for j in range(num):
            p.append(np.random.randint(0, 1000))
        for j in range(num):
            self.init_dist[j] = 1. * p[j] / sum(p)

        self.cal_steady_dist()
        self.cal_mean_arrival()
        self.reset_state()

    def cal_steady_dist(self):
        num = self.state_num
        I = np.eye(num)
        A = (self.trans_mat - I).T
        X = LinearSolver.AX_equal_0(A=A)
        for j in range(num):
            self.steady_dist[j] = X[j] / sum(X)

        next_dist = self.steady_dist.dot(self.trans_mat)
        if sum(abs(next_dist - self.steady_dist)) > 0.1:
            print(f"Someting is wrong when calculating the steady states distribution! \n A: {A} \n rank of A:{LinearSolver.rank(A)};  rank of trans: {LinearSolver.rank(self.trans_mat)} \n X: {self.steady_dist} \n dot: {A.dot(self.steady_dist)}")

    def cal_mean_arrival(self):
        self.mean_arrival = 0.
        num = self.state_num
        for j in range(num):
            self.mean_arrival += self.steady_dist[j] * self.state_lambda[j]
```
