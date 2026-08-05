---
{
  "title": "Xingqiu He：在线边缘调度与预测式低轨切换",
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
## 观察视角

这两项工作把同一种在线决策视角用于截然不同的系统：边缘侧的队列感知能量调度，以及轨道中的运动感知切换。

## Energy-Efficient Online Scheduling for Wireless Powered Mobile Edge Computing Networks

**作者：** Xingqiu He, Chaoqun You, Yuzhi Yang, Zihan Chen, Yuhang Shen, Tony Q. S. Quek, Yue Gao

**状态：** 预印本

**Xingqiu He 视角。** [查看主要公开记录](https://arxiv.org/abs/2603.07984)。该预印本利用 Lyapunov 优化把随机的无线供能移动边缘调度问题转化为逐时隙决策。边际能效概念支撑“先松弛、再调整”的方法，卸载子问题则转化为指派问题；作者还给出时延与能耗之间的性能保证。

**证据边界。** 实践证据来自大量仿真，而不是已部署的无线供能边缘系统，因此稳健性受队列、信道和工作负载模型约束。

## PreHO: Predictive Handover for LEO Satellite Networks

**作者：** Xingqiu He, Zijie Ying, Chaoqun You, Yue Gao

**状态：** 预印本

[查看主要公开记录](https://arxiv.org/abs/2603.07987)。PreHO 利用低轨系统可预测的卫星运动和相对稳定的信道，在触发前预先规划切换。优化采用交替求解与动态规划，基于真实数据驱动的评估相对反应式方案报告了更低的信令开销与切换时延。

**证据边界。** 评估是数据或轨迹驱动的，并非运营卫星网络部署；方法还依赖可预测性假设，遇到未建模动态时可能退化。
