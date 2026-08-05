---
{
  "title": "无线供能边缘计算：在线调度如何兼顾时延与能耗",
  "locale": "zh",
  "slug": "wireless-powered-edge",
  "newsId": "news-20260803-wireless-powered-edge",
  "translationKey": "news-20260803-wireless-powered-edge",
  "generated": true,
  "date": "2026-08-03",
  "coverageStart": "2026-03-09",
  "coverageEnd": "2026-03-09",
  "module": "fields",
  "keywords": [
    "wireless-powered-edge",
    "wireless-optimization",
    "energy-constrained-iot"
  ],
  "authors": [
    "Xingqiu He",
    "Chaoqun You",
    "Yuzhi Yang",
    "Zihan Chen",
    "Yuhang Shen",
    "Tony Q. S. Quek",
    "Yue Gao"
  ],
  "subjectIds": [
    "xingqiu-he",
    "yuzhi-yang-wireless"
  ],
  "workIds": [
    "arxiv-2603-07984"
  ],
  "coverTone": "mint",
  "coverKicker": "领域动态",
  "coverTitle": "在同一队列模型中权衡能量与时延",
  "coverPoints": [
    "无线供能",
    "Lyapunov 控制",
    "仿真"
  ],
  "description": "解释无线供能边缘计算中的 Lyapunov 在线调度器，并区分其时延—能耗保证与仅由仿真提供的实践验证。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 当采集到的能量成为调度约束

无线供能移动边缘计算面临一项根本矛盾：设备的任务与可用能量都在随时间变化，但系统必须即时决定本地计算还是卸载。采集到的能量不能被当作取之不尽的电池；若一味等待理想的能量或信道条件，任务队列又会不断增长。因此，调度器必须在不知道未来到达过程和信道状态的情况下协调能耗与时延。

预印本 [Energy-Efficient Online Scheduling for Wireless Powered Mobile Edge Computing Networks](https://arxiv.org/abs/2603.07984) 将这一矛盾写成随机控制问题。它不依赖完整的未来信息去求解一份长期计划，而是利用 Lyapunov 优化，把长期队列稳定性和能量目标转化为每个时隙都能执行的决策。

## 将耦合问题拆成可解的在线决策

这项工作的关键在于问题分解。边际能效指标支撑“先松弛、再调整”的处理方式，本地计算与卸载由此得到可操作的决策结构，卸载子问题进一步转化为指派问题。这样的变换避免了控制器在每个时隙搜索全部组合，也保留了原问题对长期能耗和队列状态的关注。

论文给出了联系时延与能耗的性能保证，并在多种队列、无线信道和工作负载模型下开展仿真。它的价值不只是提出一个目标函数，更在于说明如何把跨时隙、强耦合的随机优化问题化为一组结构清晰的在线子问题，从而连接随机网络理论与可执行调度。

## 结论适用到哪里

现有结果为无线能量约束下的在线调度提供了完整的理论与仿真论证。不过，相关保证成立于论文设定的队列、信道和工作负载模型内，公开结果尚未包含真实部署的无线供能与边缘计算平台。能量传输效率、硬件开销、模型失配以及真实业务流量下的表现，仍需通过系统实验继续回答。

## 研究札记

> ### Energy-Efficient Online Scheduling for Wireless Powered Mobile Edge Computing Networks
>
> **作者：** Xingqiu He, Chaoqun You, Yuzhi Yang, Zihan Chen, Yuhang Shen, Tony Q. S. Quek, Yue Gao
>
> **状态：** 预印本
>
> **主要来源：** [arXiv:2603.07984](https://arxiv.org/abs/2603.07984)
>
> **证据说明：** 论文给出时延与能耗的分析保证，并以大量仿真验证方法；尚未报告真实部署的无线供能或边缘计算系统，因此结论仍受所建模的队列、信道与工作负载约束。
