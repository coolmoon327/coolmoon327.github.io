---
title: "Markov-Modulated Poisson Process"
date: "2022-10-24"
description: "An introduction to MMPP definitions, queueing applications, matrix notation, and a NumPy implementation."
tags: ["mmpp", "markov-chain", "queueing-theory"]
categories: ["Research Notes"]
locale: "en"
slug: "markov-modulated-poisson-process"
sourceId: "post-dc0860fe15aee174"
translationKey: "post-dc0860fe15aee174"
generated: true
draft: false
---

# MMPP

## Target Problem

The Markov-modulated Poisson process (MMPP) can be used to address the **superposition** of multiple stochastic processes. It qualitatively models a time-varying arrival rate and captures important correlations between interarrival times while remaining analytically tractable.

An MMPP commonly describes the input to a queueing system and can be used to model an MMPP/G/1 queue.

## Definition

An MMPP is a doubly stochastic Poisson process whose arrival rate is described by λ∗(J(t))\lambda^\*(J(t))λ∗(J(t)), where $$J(t)$$ is an irreducible m-state Markov process. An MMPP can be constructed by changing the Poisson arrival rate according to an irreducible, continuous-time, m-state Markov chain. For example, when the Markov chain is in state iii, the corresponding Poisson arrival rate is $$\lambda(i)$$.

An MMPP is described by an m-state continuous-time Markov chain with infinitesimal generator Q and m Poisson arrival rates λ1,λ2,…,λm\lambda\_{1}, \lambda\_{2}, \ldots, \lambda\_{m}λ1​,λ2​,…,λm​:

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

When describing an MMPP, we assume that it is homogeneous—that is, QQQ and Λ\LambdaΛ do not change over time.

It is worth noting that an MMPP is not a renewal process but a Markov renewal process; it becomes a renewal process only in special cases. Its interarrival times are not exponentially distributed, but instead depend on the states at the previous and current arrivals. An MMPP therefore describes the renewal sequence jointly through the Markov state and the interarrival time: {(Jn,Xn),n⩾0}\left\{\left(J\_{n}, X\_{n}\right), n \geqslant 0\right\}{(Jn​,Xn​),n⩾0}.

## Implementation

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
