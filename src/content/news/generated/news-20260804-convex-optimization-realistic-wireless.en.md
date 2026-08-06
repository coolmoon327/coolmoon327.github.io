---
{
  "title": "Convex optimization inside realistic wireless design",
  "locale": "en",
  "slug": "convex-optimization-realistic-wireless",
  "newsId": "news-20260804-convex-optimization-realistic-wireless",
  "translationKey": "news-20260804-convex-optimization-realistic-wireless",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2024-02-16",
  "coverageEnd": "2025-08-28",
  "module": "fields",
  "keywords": [
    "convex-optimization",
    "learning-enabled-wireless",
    "ris",
    "resource-allocation",
    "wireless-power-transfer",
    "isac"
  ],
  "authors": [
    "Fenghao Zhu",
    "Xinquan Wang",
    "Chongwen Huang",
    "Zhaohui Yang",
    "Xiaoming Chen",
    "Ahmed Al Hammadi",
    "Zhaoyang Zhang",
    "Chau Yuen",
    "Mérouane Debbah",
    "Wentao Zhou",
    "Di Zhang",
    "Inkyu Lee",
    "M. W. Shabir",
    "M. Di Renzo",
    "A. Zappone",
    "Amirhossein Azarbahram",
    "Onel L. A. López",
    "Bruno Clerckx",
    "Marco Di Renzo",
    "Matti Latva-Aho",
    "Chaoying Huang",
    "Wen Chen",
    "Qingqing Wu",
    "Xusheng Zhu",
    "Zhendong Li",
    "Ying Wang",
    "Jinhong Yuan",
    "Yannan Chen",
    "Yi Feng",
    "Xiaoyang Li",
    "Licheng Zhao",
    "Kaiming Shen"
  ],
  "subjectIds": [
    "merouane-debbah"
  ],
  "workIds": [
    "doi-10-1109-twc-2024-3435023",
    "doi-10-1109-twc-2024-3363766",
    "doi-10-1109-lwc-2025-3529778",
    "doi-10-1109-twc-2025-3645104",
    "doi-10-1109-tcomm-2025-3649710",
    "doi-10-1109-twc-2025-3556301"
  ],
  "coverTone": "amber",
  "coverKicker": "CONVEX OPTIMIZATION",
  "coverTitle": "Structure survives the nonconvex model",
  "coverPoints": [
    "Robust precoding",
    "Physics-aware RIS",
    "Near-field power transfer"
  ],
  "description": "Six works show how convex subproblems, fractional programming, successive approximations, manifold methods, and physical models cooperate in practical wireless optimization.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## Convex optimization rarely appears alone—and that is its strength

Realistic wireless design problems are commonly nonconvex: unit-modulus surface coefficients, coupled beamformers, nonlinear rectifiers, uncertain channels, and near-field propagation all resist a single closed-form solution. Yet convex optimization remains central because useful structure often survives inside the larger problem. The six works in this collection do not apply one shared solver. They combine convex subproblems and approximations with fractional programming, weighted-MMSE updates, manifold geometry, meta-learning, electromagnetic constraints, and alternating optimization. That variety shows what convex methods are best at: turning part of an otherwise difficult design into a tractable step whose assumptions can be inspected.

[Robust Beamforming for RIS-aided Communications: Gradient-based Manifold Meta Learning](https://doi.org/10.1109/twc.2024.3435023), co-authored by Prof. Mérouane Debbah, starts from coupled base-station precoding and RIS phase control. Instead of feeding channel state directly into a pretrained network, it feeds optimization gradients into neural networks and constrains RIS phases through a differential regulator. The public abstract reports faster convergence and a spectral-efficiency improvement over selected traditional approaches in numerical tests. This is not convex optimization in isolation; it is an example of learning being wrapped around manifold-constrained optimization rather than replacing the problem geometry.

## Robust designs begin by modeling what the transmitter does not know

Limited feedback creates a different form of structure. In [Robust Precoding Designs for Multiuser MIMO Systems with Limited Feedback](https://doi.org/10.1109/twc.2024.3363766), also co-authored by Prof. Mérouane Debbah, quantization errors degrade multiuser rates. The authors approximate second-order statistics of the quantized channel and derive non-iterative robust MMSE and iterative robust WMMSE precoders. The public abstract reports improvements over traditional designs in simulation. The essential point is not that WMMSE solves every uncertainty problem, but that a usable statistical approximation can convert missing channel precision into an explicit robust objective.

## Physical consistency changes the feasible set

An RIS is not merely a vector of independent phase knobs. [Electromagnetically Consistent Optimization Algorithms for the Global Design of RIS](https://doi.org/10.1109/lwc.2025.3529778), co-authored by Prof. Mérouane Debbah, models the surface as an inhomogeneous impedance boundary. Several resulting nonconvex problems are reformulated as sequences of linear quadratically constrained or semidefinite programs. The public abstract states polynomial complexity for these approximations and monotonic convergence of the objective. Those properties concern the proposed sequence and model; they do not turn the original nonconvex global design into a universal convex program.

The same discipline appears in [Beamforming and Waveform Optimization for RF Wireless Power Transfer with Beyond Diagonal Reconfigurable Intelligent Surfaces](https://doi.org/10.1109/twc.2025.3645104). Beamforming, multicarrier waveform design, a nonlinear rectifier, and a beyond-diagonal RIS are optimized together through semidefinite programming and successive convex approximation. The simulations show that beyond-diagonal coupling is useful when non-line-of-sight components matter, while it provides no advantage over a diagonal RIS in the studied pure far-field line-of-sight case without mutual coupling. A richer hardware model is valuable precisely because it also reveals where the extra degrees of freedom do not help.

## Propagation regime can simplify one case and complicate another

[Dual-IRS Aided Near-/Hybrid-Field SWIPT: Passive Beamforming and Independent Antenna Power Splitting Design](https://doi.org/10.1109/tcomm.2025.3649710) compares near-field and hybrid-field formulations for simultaneous wireless information and power transfer. The near-field problem uses alternating optimization, Lagrange duality, and difference-of-convex programming. In the hybrid-field model, the authors identify an invariance that permits a convex transformation and closed-form asymptotic analysis. This contrast is instructive: tractability is not only a property of the algorithm; it can emerge from the propagation model and variable coupling.

[Fast Fractional Programming for Multi-Cell Integrated Sensing and Communications](https://doi.org/10.1109/twc.2025.3556301) tackles a different source of cost: massive-array beamforming across several ISAC cells. The familiar WMMSE update can be understood through fractional programming for a weighted objective combining communication data rates and sensing Fisher information. Repeated inversion of large antenna-dimensional matrices makes the conventional update expensive. The proposed nonhomogeneous bound avoids those large inversions, and its connection to projected gradient permits Nesterov acceleration. This establishes an algorithmic route to lower-cost updates under the stated model; real-time performance on deployed massive-array hardware remains a separate engineering question.

Across the six works, convex optimization is neither a decorative label nor a promise of global optimality. Its role is to preserve certifiable structure inside a system that may also require approximation, learning, or alternating updates. A careful reader should therefore ask three questions of every result: which subproblem is genuinely convex, what approximation connects it to the original model, and whether the physical assumptions survive the intended deployment.

## Research notes

> ### Robust Beamforming for RIS-aided Communications: Gradient-based Manifold Meta Learning
>
> - **Authors:** Fenghao Zhu, Xinquan Wang, Chongwen Huang, Zhaohui Yang, Xiaoming Chen, Ahmed Al Hammadi, Zhaoyang Zhang, Chau Yuen, Mérouane Debbah
> - **Public record:** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2024.3435023)
> - **What is established:** Gradient-fed neural modules and manifold constraints jointly update base-station precoding and RIS phases without pretraining.
> - **Read with care:** The reported 7.31% spectral-efficiency gain and 23-fold convergence speedup are numerical comparisons in the authors’ selected dynamic settings.
>
> ---
>
> ### Robust Precoding Designs for Multiuser MIMO Systems with Limited Feedback
>
> - **Authors:** Wentao Zhou, Di Zhang, Mérouane Debbah, Inkyu Lee
> - **Public record:** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2024.3363766)
> - **What is established:** An approximation to quantized-channel second-order statistics supports robust MMSE and WMMSE precoder designs.
> - **Read with care:** Rate improvements are simulation-based and depend on the limited-feedback and quantization model.
>
> ---
>
> ### Electromagnetically Consistent Optimization Algorithms for the Global Design of RIS
>
> - **Authors:** M. W. Shabir, Marco Di Renzo, A. Zappone, Mérouane Debbah
> - **Public record:** [IEEE Wireless Communications Letters](https://doi.org/10.1109/lwc.2025.3529778)
> - **What is established:** Surface-impedance design problems are approximated by sequences of linearly quadratically constrained or semidefinite programs with stated polynomial complexity and monotonic objective convergence.
> - **Read with care:** These guarantees concern the proposed approximations under the electromagnetic model, not unrestricted global optimality for arbitrary RIS hardware.
>
> ---
>
> ### Beamforming and Waveform Optimization for RF Wireless Power Transfer with Beyond Diagonal Reconfigurable Intelligent Surfaces
>
> - **Authors:** Amirhossein Azarbahram, Onel L. A. López, Bruno Clerckx, Marco Di Renzo, Matti Latva-Aho
> - **Public record:** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2025.3645104)
> - **What is established:** Semidefinite and successive-convex-approximation methods jointly design beamforming and multicarrier waveforms for a nonlinear rectifier and beyond-diagonal RIS.
> - **Read with care:** The relative benefit over a diagonal RIS changes with line-of-sight conditions and the modeled mutual coupling; validation is numerical.
>
> ---
>
> ### Dual-IRS Aided Near-/Hybrid-Field SWIPT: Passive Beamforming and Independent Antenna Power Splitting Design
>
> - **Authors:** Chaoying Huang, Wen Chen, Qingqing Wu, Xusheng Zhu, Zhendong Li, Ying Wang, Jinhong Yuan
> - **Public record:** [IEEE Transactions on Communications](https://doi.org/10.1109/tcomm.2025.3649710)
> - **What is established:** Near-field and hybrid-field SWIPT receive different optimization treatments, including a convex transformation enabled by a channel-gain invariance in the hybrid-field model.
> - **Read with care:** Performance gains over selected schemes come from numerical evaluation of the stated dual-IRS and power-splitting models.

> ---
>
> ### Fast Fractional Programming for Multi-Cell Integrated Sensing and Communications
>
> - **Authors:** Yannan Chen, Yi Feng, Xiaoyang Li, Licheng Zhao, Kaiming Shen
> - **Public record:** [IEEE Transactions on Wireless Communications](https://doi.org/10.1109/twc.2025.3556301)
> - **What is established:** A nonhomogeneous bound and fractional-programming formulation avoid repeated large matrix inversions in multi-cell massive-array ISAC beamforming, with a projected-gradient connection used for acceleration.
> - **Read with care:** The public abstract establishes the formulation and algorithmic relationship; it does not report a hardware implementation or an end-to-end real-time deployment benchmark.
