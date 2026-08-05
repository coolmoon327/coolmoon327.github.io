---
{
  "title": "Zhiguo Ding 教授：有限速度夹持天线下的联邦学习",
  "locale": "zh",
  "slug": "zhiguo-finite-speed-fl",
  "newsId": "news-20260804-zhiguo-finite-speed-fl",
  "translationKey": "news-20260804-zhiguo-finite-speed-fl",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2026-07-26",
  "coverageEnd": "2026-07-26",
  "module": "advisors",
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
  "focusSubjectId": "zhiguo-ding",
  "coverTone": "mint",
  "coverKicker": "近期导师研究",
  "coverTitle": "把理想移动改成实际约束",
  "coverPoints": [
    "有限速度",
    "联邦学习",
    "信息年龄"
  ],
  "description": "概述有限速度夹持天线联邦学习，其中联盟选择与分支定界位置优化目前只通过仿真评估。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 用物理约束取代理想移动

在 Zhiguo Ding 教授参与的夹持天线研究中，可配置位置是主要性能来源之一：辐射点能够沿波导移动，进而改变等效信道。[Age-of-Information Aware Federated Learning with Finite Speed Pinching Antenna](https://arxiv.org/abs/2607.23595) 进一步追问，当这种移动不再被理想化为瞬时完成时，系统设计会发生什么变化。

有限速度让问题发生了实质改变。重定位开始占用每一轮联邦学习的时间，设备选择、天线位置、本地计算、上传时长以及模型更新的新鲜程度由此无法彼此分离。它推动这条研究路线开始为真实物理动作付出代价，而不再把几何位置当作可以自由调整的变量。

## 将执行时间连接到学习新鲜度

论文用联盟博弈选择参与设备，再以分支定界法在本轮可达区域内确定天线位置。离散的参与决策与连续的位置决策各自获得合适的算法处理，同时通过时间和信息年龄保持耦合。

对联邦学习而言，信息年龄不仅是网络指标。一份更新在本地计算完成时或许很有价值，但经历较长的移动与上传后，其时效性便会下降。因此，该模型把天线的机械限制直接连接到全局模型接收新信息的速度。

## 更现实的模型仍需物理验证

仿真显示，相比所选方法，所提方案能够更快收敛并降低总信息年龄。这项工作的意义不止于提出一个新优化器，它还说明，去掉一项便利的物理假设，就可能重新排列一整轮学习与通信中的决策优先级。

尚待补足的是实验环节。公开结果没有计入执行器功耗、移动误差、机械磨损、校准过程，以及重定位后重新测量信道的时延。对 Zhiguo Ding 教授的夹持天线研究而言，硬件实现还需要回答：理论上的信息新鲜度收益，能否抵消移动、感知和控制真实辐射点所付出的成本。

## 研究札记

> ### Age-of-Information Aware Federated Learning with Finite Speed Pinching Antenna
>
> **作者：** Kaidi Wang, Daniel K C So, Zhiguo Ding
>
> **状态：** 预印本
>
> **主要来源：** [arXiv:2607.23595](https://arxiv.org/abs/2607.23595)
>
> **证据说明：** 设备选择采用联盟博弈，位置则通过分支定界法在有限速度对应的可行区域内优化；更快收敛与更低总信息年龄均来自仿真，尚未报告执行器实测成本或硬件验证。
