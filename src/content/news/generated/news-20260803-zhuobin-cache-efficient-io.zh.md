---
{
  "title": "Zhuobin Huang：让网卡到 CPU 的路径更具缓存效率",
  "locale": "zh",
  "slug": "zhuobin-cache-efficient-io",
  "newsId": "news-20260803-zhuobin-cache-efficient-io",
  "translationKey": "news-20260803-zhuobin-cache-efficient-io",
  "generated": true,
  "date": "2026-08-03",
  "coverageStart": "2025-08-06",
  "coverageEnd": "2025-08-06",
  "module": "interests",
  "keywords": [
    "distributed-and-gpu-systems",
    "edge-and-fog-systems"
  ],
  "authors": [
    "Bowen Liu",
    "Xinyang Huang",
    "Qijing Li",
    "Zhuobin Huang",
    "Yijun Sun",
    "Wenxue Li",
    "Junxue Zhang",
    "Ping Yin",
    "Kai Chen"
  ],
  "subjectIds": [
    "zhuobin-huang-zobin"
  ],
  "workIds": [
    "doi-10-1145-3718958-3750488"
  ],
  "focusSubjectId": "zhuobin-huang-zobin",
  "coverTone": "slate",
  "coverKicker": "合作研究",
  "coverTitle": "来自 SIGCOMM 的系统证据",
  "coverPoints": [
    "网卡流控",
    "弹性缓冲",
    "200 Gb/s 测试床"
  ],
  "description": "解释 CEIO 的网卡侧信用机制与弹性缓冲，并将吞吐量和尾时延增益限定在两服务器 200 Gb/s 测试床内。",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## 观察视角

这项系统工作的关键，是把缓存保护前移到网卡控制环路中，并用具体框架与工作负载验证这一设计选择。

## CEIO: A Cache-Efficient Network I/O Architecture for NIC-CPU Data Paths

**作者：** Bowen Liu, Xinyang Huang, Qijing Li, Zhuobin Huang, Yijun Sun, Wenxue Li, Junxue Zhang, Ping Yin, Kai Chen

[查看主要公开记录](https://doi.org/10.1145/3718958.3750488)。CEIO 通过网卡侧信用流控和弹性片上缓冲，保护网卡到 CPU 数据路径中的末级缓存。在论文的两服务器、200 Gb/s 测试床上，针对 DPDK、RDMA、eRPC 和 LineFS 工作负载，相对所选先前方案报告了最高 2.9 倍的吞吐量提升与最高 1.9 倍的尾时延改善。

**证据边界。** 结果来自受控的两服务器测试床与特定工作负载，不能保证在任意网卡、CPU 或生产集群中得到相同增益。
