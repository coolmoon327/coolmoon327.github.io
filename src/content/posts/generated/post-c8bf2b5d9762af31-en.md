---
title: "Optimization Theory and Algorithms: Course Notes"
date: "2022-10-23"
description: "Study notes on convexity, linear and dual programming, unconstrained methods, and constrained optimization."
tags: ["optimization", "linear-programming", "convex-optimization"]
categories: ["Mathematics"]
locale: "en"
slug: "optimization-theory-course-notes"
sourceId: "post-c8bf2b5d9762af31"
translationKey: "post-c8bf2b5d9762af31"
generated: true
draft: false
---

# Optimization Theory and Algorithms

## I. Optimization Problems and Mathematical Foundations

- Directional derivative = gradient \* unit direction; the sign indicates ascent or descent.
- The steepest-descent step is t=−gT∗PPT∗H∗Pt = \frac{-g^T\*P}{P^T\*H\*P}t=PT∗H∗P−gT∗P​.
- Taylor expansion

f(X)=f(X0)+∇f(X0)T(X−X0)+12(X−X0)T∇2f(X0)(X−X0)+o(∥X−X0∥2)\begin{aligned} f(\boldsymbol{X}) &=f\left(\boldsymbol{X}^{0}\right) \\ &+\nabla f\left(\boldsymbol{X}^{0}\right)^{T}\left(\boldsymbol{X}-\boldsymbol{X}^{0}\right) \\ &+\frac{1}{2}\left(\boldsymbol{X}-\boldsymbol{X}^{0}\right)^{T} \nabla^{2} f\left(\boldsymbol{X}^{0}\right)\left(\boldsymbol{X}-\boldsymbol{X}^{0}\right) \\ &+o\left(\left\|\boldsymbol{X}-\boldsymbol{X}^{0}\right\|^{2}\right) \end{aligned}
f(X)​=f(X0)+∇f(X0)T(X−X0)+21​(X−X0)T∇2f(X0)(X−X0)+o(∥∥∥​X−X0∥∥∥​2)​

- A stationary point plus positive semidefiniteness <–> a local minimum.
- The **intersection** of convex sets is convex, while their **union** need not be. A set obtained by numerical addition or subtraction of corresponding elements of two convex sets is also convex.
- A convex set is defined using any two points, but every **convex combination** of any finite collection of points also lies in the set.
- Convexity of a function is mainly proved through the **semidefiniteness** of its Hessian matrix. Semidefiniteness can be checked by whether the **leading principal minors** are greater than or equal to zero.
- Some problems can also be proved from the definition of a convex function: value at a convex combination <= convex combination of the function valuesvalue at a convex combination <= convex combination of the function valuesvalue at a convex combination<=convex combination of the function values.
- In convex programming, both the **objective-function values** and the **feasible region** are convex. A KT point of a convex program is directly optimal—a local optimum is a global optimum—so there is no need to test the second-order necessary condition.
- When the objective is strictly convex, the optimal solution is unique. This can be used to answer one of the major exam questions.

## II. Linear Programming

> Infinitely many optimal solutions: the number of reduced costs equal to 0 exceeds the number of constraints.
>
> No optimal solution (unbounded solution): a reduced cost > 0, but every entry in its corresponding column vector is <= 0.
>
> No solution: the Big-M method has no optimal solution.
>
> No feasible solution: the optimum of the two-phase method contains artificial variables, or the optimum of the Big-M method contains artificial variables.

- A constraint of the form AX>=bAX >= bAX>=b is called a trivial constraint.
- In general, a linear-programming model minimizes its objective, uses nontrivial constraints, and requires nonnegative decision variables.
- Standard form, with nonnegative b

[Image omitted: third-party image]

- Standardization method

[Image omitted: third-party image]

- The reduced cost σj=CITPj−cj\sigma\_{j}=\boldsymbol{C}\_{\boldsymbol{I}}^{T} \boldsymbol{P}\_{j}-c\_{j}σj​ determines which variables enter the basis. When all reduced costs<=0all reduced costs <= 0all reduced costs<=0, the optimal solution has been found.
- A reduced cost greater than 0 whose corresponding vector has all entries less than or equal to 0 means there is **no optimal solution**; the solution is negative infinity.
- A basic variable has reduced cost 0, and a nonbasic variable has value 0. If the number of zero reduced costs exceeds the number of constraints, there are **infinitely many optimal solutions** along an edge of the feasible region.
- Pivot selection

  - Choose the column jjj with the largest reduced cost.
  - Choose the row iii with positive and smallest bi/Pi,jb\_i/P\_{i,j}bi​/Pi,j​.
- Differences in the revised simplex method

  - Select the leftmost positive reduced-cost column.
  - When multiple rows satisfy the condition, select the topmost row.
- Two-phase method: introduce artificial variables, eliminate them in phase one, and begin an ordinary simplex solution from the final state of phase one in phase two.
- If the initial basis has not eliminated the artificial variables:

  - If the artificial variables are not all 0, the original program has **no feasible solution**.
  - If the artificial variables are all 0, their corresponding b values must be 0.
    - If the row's coefficients are not all 0, the basis can be **forcibly changed**.
    - If every coefficient in the row is 0, the row is linearly dependent on other constraints and can simply be **deleted**.
- Big-M method: add artificial-variable terms to the objective and assign an extremely large coefficient M.

  - Artificial variables not all 0: the original program has **no feasible solution**.
  - No optimal solution: the original program has **no solution**. Is “no solution” here the same as “no optimal solution”?
- Use the revised simplex method to update the simplex tableau quickly:

  - Starting from the current tableau, determine which variables will be basic after several steps—suppose x2x\_2x2​ and x5x\_5x5​.
  - Take the columns corresponding to those future basic variables and form matrix BBB, where B=[P2,P3]B = [P\_2, P\_3]B=[P2​,P3​].
  - Invert BBB to obtain B−1B^{-1}B−1.
  - Multiplying any column in the current tableau by B−1B^{-1}B−1 gives that column in the future tableau.
  - Reduced cost σj=CBTB−1Pj−cj\sigma\_{j}=\boldsymbol{C}\_{\boldsymbol{B}}^{T} \boldsymbol{B}^{-1} \boldsymbol{P}\_{j}-c\_{j}σj​.

## III. Dual Linear Programming

- Transformation rules

[Image omitted: third-party image]

- Weak duality theorem: min>=maxmin >= maxmin>=max.

  - If one problem has an unbounded solution, the other has no feasible solution.
  - Apart from that case, the existence of solutions should be the same for both programs.
- Strong duality theorem: their optimal values are equal.

  - The dual program's optimal solution can be obtained directly from (CBTB−1)T\left(\boldsymbol{C}\_{\boldsymbol{B}}^{T} \boldsymbol{B}^{-1}\right)^{T}(CBT​B−1)T.
  - The dual program's optimal solution is the negative of the reduced costs of the original program's **slack variables**.
- Complementary-slackness theorem: if a variable in one program is nonzero, its **dual constraint** holds with equality.
- Dual simplex method

  - Find an initial regular solution for which all reduced costs<=0reduced costs <= 0reduced costs<=0.
  - Negative b values are allowed.
  - It is essentially the transpose of the simplex tableau.
    - First find the row iii containing the first negative component of b.
    - Then find the column jjj with the smallest reduced cost/coefficientreduced cost / coefficientreduced cost/coefficient ratio.
    - Change the basis as in the ordinary method.

## IV. Unconstrained Optimization

- An iterative method for finding a minimum of the one-variable function φ(t)=f(Xk+tPk)\varphi(t)=f\left(\boldsymbol{X}^{k}+t \boldsymbol{P}^{k}\right)φ(t)=f(Xk+tPk) is called a **one-dimensional search** or line search.
  - Advantage: descends as much as possible along the descent direction; finding the extremum of a one-variable function is easy.
  - Disadvantage: high computational cost.
  - Two successive iteration directions are mutually **orthogonal**; the preceding gradient is orthogonal to the following gradient.
- Convergence rate lim⁡k→∞∥Xk+1−X⋆∥∥Xk−X⋆∥=β\lim \_{k \rightarrow \infty} \frac{\left\|\boldsymbol{X}^{k+1}-\boldsymbol{X}^{\star}\right\|}{\left\|\boldsymbol{X}^{k}-\boldsymbol{X}^{\star}\right\|}=\betalimk→∞​∥Xk−X⋆∥∥Xk+1−X⋆∥​=β
  - β=0\beta = 0β=0: superlinear convergence.
    - If the denominator has power ppp and there is still a finite limit, the convergence is of order ppp.
  - β=1\beta = 1β=1: sublinear convergence.
  - β\betaβ: linear convergence.
- Quadratic convergence: when an algorithm is used to solve a quadratic function with a positive-definite matrix, f(X)=12XTAX+bTX+cf(\boldsymbol{X})=\frac{1}{2} \boldsymbol{X}^{T} \boldsymbol{A} \boldsymbol{X}+\boldsymbol{b}^{T} \boldsymbol{X}+cf(X)=21​XTAX+bTX+c, it can reach the minimum in finitely many steps.
- Stopping criteria: little improvement in the distance between successive iterates, little improvement in successive function values, or a sufficiently small gradient.
- Golden-section method, with golden ratio 5−12\frac{\sqrt{5}-1}{2}25​−1​.

[Image omitted: third-party image]

- Fibonacci method

  - List the Fibonacci sequence: F\_0 = 1, F\_1 = 1, F\_2 = 2, F\_3 = 3,F\_4 = 5,...
  - Calculate search-interval length/target precisionsearch-interval length / target precisionsearch-interval length/target precision, then find the nearest larger Fibonacci number; convergence ratio=1Fnconvergence ratio = \frac{1}{F\_n}convergence ratio=Fn​1​.
  - Fn−2Fn\frac{F\_{n-2}}{F\_n}Fn​Fn−2​​ and $$\frac{F\_{n-1}}{F\_n}$$ are the proportions corresponding to points t1t\_1t1​ and t2t\_2t2​ in the search interval in the golden-section method.
  - Use the same idea as golden-section search to find the next interval and iterate, decreasing n each time.
- Three-point quadratic interpolation

  - Select any three points on the objective function and use them to construct a quadratic function.
  - Take the extremum of the quadratic as a new point and evaluate the objective there.
  - Among the four points, find three consecutive points whose middle value is lower than the two outer values, and iterate.
- Inexact one-dimensional search: only guarantees a satisfactory decrease in the objective at each search.

  - Goldstein: prevents ttt from lying close to either endpoint, where improvement would be small.
    - The best step may lie outside the acceptable interval.
  - Wolfe: retains Goldstein's upper-bound constraint and requires the tangent slope at an acceptable point to be greater than or equal to σ\sigmaσ times the initial slope.
  - Armijo: f(Xk+βmkτPk)≤f(Xk)+ρβmkτ∇f(Xk)TPkf\left(\boldsymbol{X}^{k}+\beta^{m\_{k}} \tau \boldsymbol{P}^{k}\right) \leq f\left(\boldsymbol{X}^{k}\right)+\rho \beta^{m\_{k}} \tau \nabla f\left(\boldsymbol{X}^{k}\right)^{T} \boldsymbol{P}^{k}f(Xk+βmk​τPk)≤f(Xk)+ρβmk​τ∇f(Xk)TPk.
- Steepest-descent method

  - P=−gP=-gP=−g
  - t=−gT∗PPT∗H∗Pt = \frac{-g^T\*P}{P^T\*H\*P}t=PT∗H∗P−gT∗P​
  - X′=X+tPX' = X + tPX′=X+tP
  - Successive iteration directions are orthogonal; convergence is fast initially and slow later.
- Newton's method: use a quadratic function obtained from a Taylor expansion of the objective to approximate that objective, then find its extremum.

  - P=−H−1gP=-H^{-1}gP=−H−1g
  - X′=X+PX' = X +PX′=X+P
  - Has **quadratic convergence** and a second-order convergence rate.
  - Requires an initial point near the minimum—possibly slow at first and fast later—and a positive-definite Hessian; otherwise use steepest descent.
  - A Newton direction is not necessarily a descent direction.
    - When it is nearly perpendicular to the gradient, use steepest descent.
    - When it points uphill, take the opposite direction as the search direction and perform a one-dimensional search.
- Conjugate-direction method: a compromise between Newton's method and steepest descent.

  - Has **quadratic convergence**.
  - Conjugacy: XTQY=0X^TQY=0XTQY=0.
  - A conjugate set of vectors contains pairwise-conjugate elements and is necessarily linearly independent.
  - Conjugate-gradient method: fundamentally seeks a new direction conjugate to the preceding one.

    - The current gradient is orthogonal to previous directions, all gradients are pairwise orthogonal, all directions are pairwise conjugate, and the direction is necessarily downhill.[Image omitted: third-party image]
  - Quasi-Newton method: use a variable-metric matrix to approximate the inverse Hessian.

    - Symmetric rank one.
    - Symmetric rank two: extending SR1, find a way to preserve positive definiteness.
      - DFP algorithm—hereditary positive definiteness, high complexity.
      - By step n, Hn−1H^{n-1}Hn−1—H here differs from the previous notation, so G denotes the Hessian—has completed the search and differs from G−1G^{-1}G−1 only by a coefficient. At step n+1, the variable-metric matrix HnH^{n}Hn is G−1G^{-1}G−1.
    - The Broyden correction is a weighted combination of SR1 and SR2.
    - The Huang correction provides greater freedom.
    - BFGGS is the default choice in solvers. It has better numerical stability than DFP—errors are less likely to grow with iteration—and is more suitable for general indefinite optimization problems, though the underlying idea is the same.
  - Trust-region method

    min⁡qk(S)=f(Xk)+(gk)TS+12STGkSs.t.∥S∥≤hk.\min \quad q^{k}(\boldsymbol{S})=f\left(\boldsymbol{X}^{k}\right)+\left(\boldsymbol{g}^{k}\right)^{T} \boldsymbol{S}+\frac{1}{2} \boldsymbol{S}^{T} \boldsymbol{G}^{k} \boldsymbol{S} \\
    s.t. \quad
    \|S\| \leq h^{k} .
    minqk(S)=f(Xk)+(gk)TS+21​STGkSs.t.∥S∥≤hk.

    Δfk=f(Xk)−f(Xk+Sk)Δqk=f(Xk)−qk(Sk)rk=Δfk/Δqk\Delta f^{k}=f\left(\boldsymbol{X}^{k}\right)-f\left(\boldsymbol{X}^{k}+\boldsymbol{S}^{k}\right)\\
    \Delta q^{k}=f\left(\boldsymbol{X}^{k}\right)-q^{k}\left(\boldsymbol{S}^{k}\right)\\
    r^{k}=\Delta f^{k} / \Delta q^{k}
    Δfk=f(Xk)−f(Xk+Sk)Δqk=f(Xk)−qk(Sk)rk=Δfk/Δqk

    - If rrr is close to 0, the approximation is poor; reduce hhh: hk+1=∣∣Sk∣∣/4h^{k+1}=||S^k||/4hk+1=∣∣Sk∣∣/4.
    - If rrr is close to 1, the approximation is good, or the constraint is active; increase hhh: hk+1=2∗hkh^{k+1}=2\*h^khk+1=2∗hk.
    - Has global convergence and a second-order convergence rate.

## Constrained Optimization

- Optimality conditions

  - Regular solution: active constraints are linearly independent.
    - A prerequisite for optimality.
  - First-order necessary conditions

  ∇f(X⋆)=∑i∈I(X⋆)λi⋆∇gi(X⋆)+∑j=1lμj⋆∇hj(X⋆)λi⋆≥0,i=1,2,⋯ ,mλi⋆gi(X⋆)=0,i=1,2,⋯ ,mgi(X⋆)≥0,i=1,2,⋯ ,mhj(X⋆)=0,j=1,2,⋯ ,l\nabla f\left(\boldsymbol{X}^{\star}\right)=\sum\_{i \in \mathcal{I}\left(\boldsymbol{X}^{\star}\right)} \lambda\_{i}^{\star} \nabla g\_{i}\left(\boldsymbol{X}^{\star}\right)+\sum\_{j=1}^{l} \mu\_{j}^{\star} \nabla h\_{j}\left(\boldsymbol{X}^{\star}\right)\\
  \lambda\_{i}^{\star} \geq 0, \quad i=1,2, \cdots, m \\
  \lambda\_{i}^{\star} g\_{i}\left(\boldsymbol{X}^{\star}\right)=0, \quad i=1,2, \cdots, m \\
  g\_{i}\left(\boldsymbol{X}^{\star}\right) \geq 0, \quad i=1,2, \cdots, m \\
  h\_{j}\left(\boldsymbol{X}^{\star}\right)=0, \quad j=1,2, \cdots, l
  ∇f(X⋆)=i∈I(X⋆)∑​λi⋆​∇gi​(X⋆)+j=1∑l​μj⋆​∇hj​(X⋆)λi⋆​≥0,i=1,2,⋯,mλi⋆​gi​(X⋆)=0,i=1,2,⋯,mgi​(X⋆)≥0,i=1,2,⋯,mhj​(X⋆)=0,j=1,2,⋯,l

  - Second-order sufficient conditions
    - Convex optimization satisfies them directly; a positive-definite matrix inside 5-1-10 also satisfies them.
    - Here, F is the feasible direction.
      - For an **active** inequality constraint, when lambda is 0 the directional derivative only needs the same sign as the constraint; otherwise the directional derivative must be 0.
      - Equality constraints require the directional derivative to be 0.[Image omitted: third-party image]
  - Penalty-function method

    - Basic idea: if the current iterate is infeasible or tends toward infeasibility, add a relatively large number—a penalty term—to its function value, forcing the iterates toward or into the feasible region during minimization.
    - Advantages and disadvantages: the **algorithm is simple**, and constrained problems can be solved using methods for **unconstrained optimization**. However, the **penalty factor is difficult to choose**, and numerical instability can arise. An exterior-point method normally yields a solution that **does not satisfy feasibility**, while an interior-point method does; exterior-point methods can handle all constraints, whereas interior-point methods can handle only **inequality constraints**.
    - Exterior penalty-function method

      - Penalty function: P(X,mk)=f(X)+mk(∑i=1m(min⁡{gi(X),0})2+∑j=1l(hj(X))2)P\left(\boldsymbol{X}, m\_{k}\right)=f(\boldsymbol{X})+m\_{k}\left(\sum\_{i=1}^{m}\left(\min \left\{g\_{i}(\boldsymbol{X}), 0\right\}\right)^{2}+\sum\_{j=1}^{l}\left(h\_{j}(\boldsymbol{X})\right)^{2}\right)P(X,mk​)=f(X)+mk​(∑i=1m​(min{gi​(X),0})2+∑j=1l​(hj​(X))2)
      - Differentiate it, discuss which constraints are violated, and obtain X as an expression in m.
      - Let m tend to infinity to obtain the final value of X.
    - Interior penalty-function method

      - Penalty functions

        P(X,rk)=f(X)+rk∑i=1m1gi(X)P\left(\boldsymbol{X}, r\_{k}\right)=f(\boldsymbol{X})+r\_{k} \sum\_{i=1}^{m} \frac{1}{g\_{i}(\boldsymbol{X})}P(X,rk​)=f(X)+rk​∑i=1m​gi​(X)1​

        P(X,rk)=f(X)−rk∑i=1mln⁡gi(X)P\left(\boldsymbol{X}, r\_{k}\right)=f(\boldsymbol{X})-r\_{k} \sum\_{i=1}^{m} \ln g\_{i}(\boldsymbol{X})P(X,rk​)=f(X)−rk​∑i=1m​lngi​(X)

        P(X,rk)=f(X)+rk∑i=1m1(gi(X))2P\left(\boldsymbol{X}, r\_{k}\right)=f(\boldsymbol{X})+r\_{k} \sum\_{i=1}^{m} \frac{1}{\left(g\_{i}(\boldsymbol{X})\right)^{2}}P(X,rk​)=f(X)+rk​∑i=1m​(gi​(X))21​
      - Differentiate it to express X in terms of r.
      - Let r approach 0 to obtain the final value of X.
  - Multiplier method, with only one inequality constraint on the exam

    - Multiplier penalty function: ϕ(X,W,σ)=f(X)+12σ∑i=1m(wi+12−wi2)\phi(\boldsymbol{X}, \boldsymbol{W}, \sigma)=f(\boldsymbol{X})+\frac{1}{2 \sigma} \sum\_{i=1}^{m}\left(w\_{i+1}^{2}-w\_{i}^{2}\right)ϕ(X,W,σ)=f(X)+2σ1​∑i=1m​(wi+12​−wi2​)
    - Multiplier update: wik+1=max⁡{0,wik−σgi(Xk)},i=1,⋯ ,m.w\_{i}^{k+1}=\max \left\{0, w\_{i}^{k}-\sigma g\_{i}\left(\boldsymbol{X}^{k}\right)\right\}, i=1, \cdots, m.wik+1​=max{0,wik​−σgi​(Xk)},i=1,⋯,m.
    - Discuss cases, differentiate the penalty function, and obtain X as an expression in w.
    - Substitute the w update formula, determine the value to which w converges, and then solve back for X.
  - Rosen's gradient-projection method

    - Idea: if the negative-gradient direction from the current iterate is not feasible, project it onto the intersection of the active constraints so that it becomes a feasible descent direction.[Image omitted: third-party image]
