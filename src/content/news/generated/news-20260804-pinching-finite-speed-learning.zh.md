---
{
  "title": "有限速度夹持天线遇上联邦学习",
  "locale": "zh",
  "slug": "pinching-finite-speed-learning",
  "newsId": "news-20260804-pinching-finite-speed-learning",
  "translationKey": "news-20260804-pinching-finite-speed-learning",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2026-07-26",
  "coverageEnd": "2026-07-26",
  "module": "interests",
  "keywords": [
    "pinching-antennas",
    "learning-enabled-wireless",
    "wireless-optimization"
  ],
  "authors": [
    "Kaidi Wang",
    "Daniel K C So",
    "Zhiguo Ding"
  ],
  "subjectIds": [
    "zhiguo-ding"
  ],
  "workIds": [
    "arxiv-2607-23595"
  ],
  "coverTone": "mint",
  "coverKicker": "夹持天线",
  "coverTitle": "移动约束进入学习过程",
  "coverPoints": [
    "执行约束",
    "设备选择",
    "仿真"
  ],
  "description": "把有限天线速度引入联邦学习的设备选择与位置优化，并明确收敛和信息年龄增益都来自仿真。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 可移动天线无法瞬间到位

夹持天线的一项重要能力，是沿波导移动辐射点以获得更有利的位置。然而，如果模型把移动过程设为瞬时完成，优化算法便享受了位置变化带来的收益，却没有支付实现这项变化所需的时间。在每一轮都包含本地计算和无线上传的联邦学习中，即便较短的重定位延迟，也可能改变设备选择及其更新的新鲜程度。

[Age-of-Information Aware Federated Learning with Finite Speed Pinching Antenna](https://arxiv.org/abs/2607.23595) 将这段时间直接纳入学习循环。天线每轮只能移动有限距离，因此参与设备、可达位置、本地训练、上传时长和信息年龄不再分属互不相关的优化层，而是形成一个耦合决策。

## 协同设计移动、参与和信息新鲜度

论文采用联盟博弈选择参与设备，再通过分支定界法在可行区域内确定天线位置。两阶段方法对应问题本身的结构：离散选择决定本轮接收哪些设备的更新，受约束的空间搜索则决定辐射点能在给定时间内到达哪里。

信息年龄能够刻画等待造成的更新贬值。向信道更有利的位置移动或许会缩短上传时间，但移动过远也会占用本轮时间，并可能拖延其他参与设备。该模型把这项权衡明确化，不再默认通信质量可以在没有执行代价的情况下得到改善。

## 仿真结果与尚未计入的硬件代价

仿真结果显示，相比所选方案，所提设计能够加快学习收敛并降低总信息年龄。这说明物理移动限制会改变学习系统的调度逻辑，也解释了为什么把位置与训练过程分开优化可能遗漏重要时延来源。

现有证据仍来自模型与仿真。分支定界法解决的是定义好的位置可行域内问题，并不表示整个端到端学习系统都获得全局最优。仿真也没有测量执行器能耗、定位误差、机械磨损、感知时延，以及移动和确认真实天线位置所需的控制开销。只有把这些成本纳入硬件实验，才能判断有限速度位置优化在实际系统中是否真正有益。

## 研究札记

> ### Age-of-Information Aware Federated Learning with Finite Speed Pinching Antenna
>
> **作者：** Kaidi Wang, Daniel K C So, Zhiguo Ding
>
> **状态：** 预印本
>
> **主要来源：** [arXiv:2607.23595](https://arxiv.org/abs/2607.23595)
>
> **证据说明：** 论文以联盟博弈选择设备，并用分支定界法在定义好的可行区域内优化位置；仿真报告了更快的收敛和更低的总信息年龄，但未包含实测执行器能耗、定位误差、机械成本或硬件实验。
