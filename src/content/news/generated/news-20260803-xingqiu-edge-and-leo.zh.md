---
{
  "title": "Xingqiu He 博士：在线边缘调度与预测式低轨切换",
  "locale": "zh",
  "slug": "xingqiu-edge-and-leo",
  "newsId": "news-20260803-xingqiu-edge-and-leo",
  "translationKey": "news-20260803-xingqiu-edge-and-leo",
  "generated": true,
  "date": "2026-08-03",
  "coverageStart": "2026-03-09",
  "coverageEnd": "2026-03-09",
  "module": "interests",
  "keywords": [
    "wireless-powered-edge",
    "wireless-optimization",
    "energy-constrained-iot",
    "non-terrestrial-networks",
    "learning-enabled-wireless"
  ],
  "authors": [
    "Xingqiu He",
    "Chaoqun You",
    "Yuzhi Yang",
    "Zihan Chen",
    "Yuhang Shen",
    "Tony Q. S. Quek",
    "Yue Gao",
    "Zijie Ying"
  ],
  "subjectIds": [
    "xingqiu-he",
    "yuzhi-yang-wireless"
  ],
  "workIds": [
    "arxiv-2603-07984",
    "arxiv-2603-07987"
  ],
  "focusSubjectId": "xingqiu-he",
  "coverTone": "mint",
  "coverKicker": "合作研究",
  "coverTitle": "跨边缘与轨道的优化",
  "coverPoints": [
    "无线供能",
    "在线调度",
    "预测切换"
  ],
  "description": "并列呈现队列感知的无线供能边缘调度与预测式低轨切换，突出优化结构，也说明仍缺少运营部署证据。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 从系统规律中提取在线决策依据

Xingqiu He 博士近期的两项工作横跨两个看似相距甚远的系统：能量受限的边缘计算，以及高速运动的低轨卫星切换。二者真正一致之处并非应用场景，而是它们提出的控制问题——在无法预知未来的情况下，如何利用系统已经显露的规律作出在线决策。

无线供能边缘计算的规律来自队列演化与能量收支；低轨网络的规律则来自轨道运动和相对稳定的信道变化。将这些规律转化为算法中的已知结构，控制器便不必等问题发生后再被动响应，而能在不确定环境中提前组织决策。

## 用有限能量维持边缘队列

[Energy-Efficient Online Scheduling for Wireless Powered Mobile Edge Computing Networks](https://arxiv.org/abs/2603.07984) 研究能量供应、任务到达和无线条件均随时隙变化的设备。Lyapunov 优化把长期的时延—能耗问题化为逐时隙控制，边际能效又支撑“先松弛、再调整”的求解流程，并将卸载部分归结为指派问题。

论文在模型假设下给出时延与能耗的性能保证。更重要的是，它说明了如何在不掌握未来信息的前提下，把随机优化问题拆成一系列可处理的即时决策。当前验证来自大量仿真，尚未进入真实部署的无线供能边缘系统。

## 在切换变得紧迫之前规划轨道连接

[PreHO: Predictive Handover for LEO Satellite Networks](https://arxiv.org/abs/2603.07987) 将相近的思想用于卫星移动性管理。它不等传统条件触发后再执行切换，而是根据可预测的卫星轨迹和相对稳定的信道预先规划连接。交替优化与动态规划共同组织候选卫星和时间上的选择。

基于真实数据的评估显示，相比所选反应式方案，PreHO 能够降低信令开销和切换时延。这些结果支持预测式规划在测试轨迹中的价值，但尚不等同于运营卫星网络的部署证据；突发传播变化、轨道信息误差及其他未建模动态，都可能削弱方法依赖的可预测性。

## 两项工作的共同方法

这两项研究共同说明，在线优化的关键并不只是应对随机性，还要辨认其中哪些部分可以利用：边缘系统中的守恒关系与队列规律，以及轨道尺度上的运动规律。具体算法各不相同，但设计原则一致——先把稳定结构与瞬时不确定性分开，再让控制器的计算步骤与这种分离相匹配。

## 研究札记

> ### Energy-Efficient Online Scheduling for Wireless Powered Mobile Edge Computing Networks
>
> **作者：** Xingqiu He, Chaoqun You, Yuzhi Yang, Zihan Chen, Yuhang Shen, Tony Q. S. Quek, Yue Gao
>
> **状态：** 预印本
>
> **主要来源：** [arXiv:2603.07984](https://arxiv.org/abs/2603.07984)
>
> **证据说明：** 论文给出时延与能耗的分析保证，并通过大量仿真验证；尚未报告真实部署的无线供能或边缘计算系统，因此结论仍受队列、信道和工作负载模型约束。
>
> ### PreHO: Predictive Handover for LEO Satellite Networks
>
> **作者：** Xingqiu He, Zijie Ying, Chaoqun You, Yue Gao
>
> **状态：** 预印本
>
> **主要来源：** [arXiv:2603.07987](https://arxiv.org/abs/2603.07987)
>
> **证据说明：** 评估采用真实数据驱动的轨迹，而非运营卫星网络部署；所报告的收益依赖运动与信道的可预测性，遇到未建模动态时可能下降。
