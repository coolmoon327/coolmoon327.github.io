---
{
  "title": "安全与韧性无线系统：三个有证据支撑的方向",
  "locale": "zh",
  "slug": "secure-resilient-wireless-core",
  "newsId": "news-20260803-secure-resilient-wireless-core",
  "translationKey": "news-20260803-secure-resilient-wireless-core",
  "generated": true,
  "date": "2026-08-03",
  "coverageStart": "2026-05-05",
  "coverageEnd": "2026-06-04",
  "module": "fields",
  "keywords": [
    "anti-jamming",
    "adversarial-wireless-learning",
    "reinforcement-learning",
    "physical-layer-security",
    "secure-6g",
    "learning-enabled-wireless",
    "resilient-wireless",
    "wireless-optimization",
    "non-terrestrial-networks"
  ],
  "authors": [
    "Muhammad Shahzad Arif",
    "Yuhang Shen",
    "Sami Muhaidat",
    "Paschalis C. Sofotasios",
    "Silvirianti",
    "Georges Kaddoum",
    "Mahdi Chehimi",
    "Mohammed Mahyoub",
    "Wael Jaafar",
    "Halim Yanikomeroglu"
  ],
  "subjectIds": [
    "muhammad-shahzad-arif",
    "sami-muhaidat",
    "paschalis-sofotasios"
  ],
  "workIds": [
    "doi-10-1109-jsac-2026-3700139",
    "doi-10-1109-jsac-2026-3691713",
    "arxiv-2605-03656"
  ],
  "coverTone": "slate",
  "coverKicker": "领域回顾",
  "coverTitle": "从链路到低轨基础设施",
  "coverPoints": [
    "自适应干扰",
    "韧性路由",
    "切片风险"
  ],
  "description": "比较三个层次的韧性：学习型抗干扰链路、感知智能干扰的低轨路由，以及模型化风险下的跨切片服务链放置。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 系统尺度一变，“韧性”的含义也会变化

无线链路、卫星路由和虚拟化服务链都可能在攻击下失效，但失效方式并不相同：链路可能学到错误策略，路由可能失去安全连通性，服务链则可能形成高风险共址或频繁迁移。把三个层次的近期工作放在一起，可以看出韧性无线系统需要的是分层防线，而不是一个包打天下的算法。

链路层的 [Outsmarting the Smart](https://doi.org/10.1109/JSAC.2026.3700139)研究黑盒攻击下的强化学习抗干扰。交互驱动与优化驱动的自适应干扰器从受害链路的行为中寻找规律，把它推向次优状态；公开摘要还指出，其功率消耗低于传统反应式干扰。学习控制的两面性由此显现：策略能够适应环境，也会留下可供对手学习的模式。

## 在持续运动且存在对抗的拓扑中选路

低轨星座本身就在不断变化，攻击出现后，路由问题更加复杂。相关工作把数字孪生、联邦学习和量子深度强化学习结合起来，在智能干扰下优化星间路由。相对所选数值基线，公开摘要报告了 48.16% 的干扰成功率下降、22.26% 的时延下降和 6.17% 的能效提升。这些结果不是来自真实卫星或量子硬件，但它们把路由质量、安全与能耗放进了同一个评估框架。

## 路由建立之后，服务仍可能放错位置

连通并不等于服务部署安全。跨切片服务功能链工作同时优化共址风险、CPU 使用和虚拟网络功能迁移稳定性。在论文评估环境中，相对贪心基线，共址风险下降 40%，可避免迁移减少 80%，热启动速度提高 23 倍。风险分数是受标准原则启发的代理指标，却抓住了单纯路由优化看不到的问题：两个敏感功能即使都可达，也可能因为被放在一起而产生风险。

三项研究对应的防线彼此衔接：链路策略要抵抗行为利用，路由要适应运动和干扰，服务编排还要在安全风险与迁移代价之间取舍。三类指标不能拼成一个漂亮的总分，现有证据也都以数值或仿真为主；但它们共同给出了清晰架构——上一层做出的“成功”决定，往往只是下一层问题的起点。

## 研究札记

> ### Outsmarting the Smart: Intelligent Jamming Strategies Against AI-Empowered Anti-Jamming Frameworks
>
> - **作者：** Muhammad Shahzad Arif, Yuhang Shen, Sami Muhaidat, Paschalis C. Sofotasios
> - **状态：** 已发表期刊论文
> - **主要来源：** [IEEE Journal on Selected Areas in Communications](https://doi.org/10.1109/JSAC.2026.3700139)
> **证据说明：** 公开摘要没有量化所有结论；验证属于数值基准测试，并非空口部署。
>
>
> ### Digital Twin-Assisted Federated Quantum Deep Reinforcement Learning for Resilient and Dynamic ISL Routing
>
> - **作者：** Silvirianti, Georges Kaddoum, Mahdi Chehimi, Sami Muhaidat
> - **状态：** 已发表期刊论文
> - **主要来源：** [IEEE Journal on Selected Areas in Communications](https://doi.org/10.1109/JSAC.2026.3691713)
> **证据说明：** 48.16%、22.26% 和 6.17% 的改进来自模型驱动数值实验，不是真实卫星或量子硬件试验。
>
> ### Cross-Slice Co-Location Risk-Aware SFC Provisioning in Multi-Slice LEO Satellite Networks
>
> - **作者：** Mohammed Mahyoub, Wael Jaafar, Sami Muhaidat, Halim Yanikomeroglu
> - **状态：** 预印本
> - **主要来源：** [arXiv:2605.03656](https://arxiv.org/abs/2605.03656)
> **证据说明：** 受标准原则启发的风险分数属于优化代理指标，验证来自仿真而非运营系统。
