---
{
  "title": "Zhuobin Huang：改变系统边界，让状态迁移不再拖住执行",
  "locale": "zh",
  "slug": "zhuobin-removing-systems-stalls",
  "newsId": "news-20260804-zhuobin-removing-systems-stalls",
  "translationKey": "news-20260804-zhuobin-removing-systems-stalls",
  "generated": true,
  "date": "2026-08-04",
  "coverageStart": "2024-04-18",
  "coverageEnd": "2025-03-25",
  "module": "interests",
  "keywords": [
    "distributed-and-gpu-systems",
    "edge-and-fog-systems"
  ],
  "authors": [
    "Xingda Wei",
    "Zhuobin Huang",
    "Tianle Sun",
    "Yingyi Hao",
    "Rong Chen",
    "Mingcong Han",
    "Jinyu Gu",
    "Haibo Chen",
    "Fangming Lu",
    "Minyu Wu",
    "Mingyu Wu"
  ],
  "subjectIds": [
    "zhuobin-huang-zobin"
  ],
  "workIds": [
    "doi-10-1145-3731569-3764813",
    "doi-10-1145-3627703-3629568",
    "doi-10-1145-3725986"
  ],
  "focusSubjectId": "zhuobin-huang-zobin",
  "coverTone": "amber",
  "coverKicker": "分布式与 GPU 系统",
  "coverTitle": "迁移状态，不必停下有效工作",
  "coverPoints": [
    "用远程内存取代序列化",
    "并发完成 GPU 检查点",
    "让操作系统参与协调"
  ],
  "description": "三篇由 Zhuobin Huang 参与的论文通过重构运行时与操作系统的边界，消除状态迁移和 GPU 恢复中的长时间停顿。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 有些漫长等待，并没有完成任何有效业务

分布式应用经常停在一些人们已经习以为常的边界上：无服务器函数先把对象序列化，下游函数再重新构造；GPU 进程则在制作检查点时暂停，等待庞大的设备状态完成复制。这些停顿并不是应用算法必然付出的成本，而是因为一个子系统无法直接使用另一个子系统维护的状态表示。

Zhuobin Huang 参与的三篇论文，分别处理两类代价很高的系统边界。RMMap 用远程内存映射取代无服务器工作流中的序列化与反序列化；PhoenixOS 把协调能力移入操作系统，并对推测执行进行验证，让 GPU 检查点和恢复能够与有效计算重叠。二者背后有一个共同判断：当状态搬运已经成为主要瓶颈时，继续优化复制程序的收益有限，改变“由谁负责完成状态转换”往往更有效。

## 远程内存映射可以绕过对象重建

[Serialization/Deserialization-free State Transfer in Serverless Workflows](https://doi.org/10.1145/3627703.3629568) 从一个十分突出的实测瓶颈出发：在作者研究的工作负载中，序列化与反序列化最多可占状态传输时间的 95%。RMMap 不再让下游函数等待一份重新构造的对象，而是通过远程内存映射直接访问上游状态。操作系统、语言运行时、RDMA 传输和无服务器平台共同配合，使数据不必先变成消息，再在另一端复制成第二份对象。

论文在 Knative 上用真实工作流进行评估。在所测配置中，工作流性能最高达到 2.6 倍，资源利用率最高达到 86.3%。这些最大值只能用于相应负载和集群，不能当成所有无服务器平台的固定收益。更有普遍意义的发现是：如果编程接口与运行时仍然强制序列化，仅仅加入零拷贝或 RDMA，依旧无法消除对象重建的开销。

[Towards Serialization/Deserialization-free State Transfer in Serverless Workflows](https://doi.org/10.1145/3725986) 是同一 RMMap 研究路线的期刊扩展，不应因为 DOI 不同就被包装成第二项独立发明。它继续深化原有系统设计：将状态传输转化为对远程后备内存的共享访问，并让多个软件层共同维持这一抽象。把会议论文和期刊论文放在一起阅读，有助于看清系统如何走向完整；将两篇论文的性能数字相加，则没有意义。

## GPU 恢复期间，应用也可以继续前进

[PhoenixOS: Concurrent OS-level GPU Checkpoint and Restore with Validated Speculation](https://doi.org/10.1145/3731569.3764813) 处理另一类状态问题。传统检查点与恢复往往让应用长时间暂停，因为 GPU 状态体量大、设备操作具有异步性，内存内容还可能持续改变。PhoenixOS 被设计成操作系统级的 GPU 进程并发检查点与恢复服务：状态传输期间不必停止全部有效计算，而是允许执行继续，并验证这段推测执行是否能够安全保留。

为此，系统组合了多种机制。内核参数帮助判断哪些状态可能被使用或修改，运行时二进制插桩则捕捉静态信息无法确定的行为；软写时复制避免立即复制全部内容，重新复制修补抓取过程中发生变化的数据，按需恢复则只在状态真正被使用时将其带回关键路径。论文在所选后续任务中，相对对比的 `cuda-checkpoint` 路径获得了数量级改进。这一结果在相应条件下十分显著，但要进入生产环境，仍需覆盖更多 GPU API、负载、故障时机和驱动版本。

## 两条路线都在重新划分状态的管理责任

RMMap 与 PhoenixOS 面向不同硬件，也处在不同生命周期事件中，却发现了相似的抽象问题。无服务器运行时之所以打包状态，是因为下游代码不能直接访问生产者的内存表示；GPU 检查点工具之所以暂停进程，是因为应用推进与状态抓取被设定为互斥操作。两项设计都让操作系统成为更积极的参与者：提供受保护的共享访问抽象、追踪变化，并协调过去只能通过复制和暂停连接起来的组件。

这并不意味着所有复制都应被删除。序列化带来隔离、可移植性和稳定表示；全程暂停的检查点也更容易推理其一致性。真正的贡献在于，论文指出这些保证何时贵得不成比例，并给出另一种可选设计。面对时延敏感的无服务器工作流和大体量 GPU 状态，重构抽象边界能够收回的时间，是更快的序列化器或更聪明的调度器无法完全补回的。

## 研究札记

> ### PhoenixOS: Concurrent OS-level GPU Checkpoint and Restore with Validated Speculation
>
> - **作者：** Xingda Wei, Zhuobin Huang, Tianle Sun, Yingyi Hao, Rong Chen, Mingcong Han, Jinyu Gu, Haibo Chen
> - **公开记录：** [ACM Symposium on Operating Systems Principles](https://doi.org/10.1145/3731569.3764813)
> - **可确认内容：** 验证式推测、变化追踪、重新复制和按需恢复共同实现操作系统级 GPU 并发检查点与恢复。
> - **阅读提示：** 数量级改进来自所选检查点路径和工作负载；更广泛的设备与软件兼容性仍需部署验证。
>
> ---
>
> ### Serialization/Deserialization-free State Transfer in Serverless Workflows
>
> - **作者：** Fangming Lu, Xingda Wei, Zhuobin Huang, Rong Chen, Mingyu Wu, Haibo Chen
> - **公开记录：** [ACM EuroSys 2024](https://doi.org/10.1145/3627703.3629568)
> - **可确认内容：** RMMap 以远程内存映射取代序列化交接，并由操作系统、运行时、RDMA 与无服务器平台协同实现。
> - **阅读提示：** 95% 的瓶颈占比、2.6 倍性能上限和 86.3% 利用率上限均属于论文负载与测试环境。
>
> ---
>
> ### Towards Serialization/Deserialization-free State Transfer in Serverless Workflows
>
> - **作者：** Xingda Wei, Fangming Lu, Zhuobin Huang, Rong Chen, Mingyu Wu, Haibo Chen
> - **公开记录：** [ACM Transactions on Computer Systems](https://doi.org/10.1145/3725986)
> - **可确认内容：** 期刊论文扩展了 RMMap 的无服务器工作流免序列化状态传输路线。
> - **阅读提示：** 它深化的是同一套核心系统，不是对 EuroSys 工作的独立复现。
