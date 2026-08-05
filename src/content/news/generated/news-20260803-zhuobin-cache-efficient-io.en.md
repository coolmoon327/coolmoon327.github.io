---
{
  "title": "Zhuobin Huang: making NIC-to-CPU paths cache-efficient",
  "locale": "en",
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
  "coverKicker": "COLLABORATOR RESEARCH",
  "coverTitle": "Systems evidence from SIGCOMM",
  "coverPoints": [
    "NIC flow control",
    "Elastic buffering",
    "200 Gb/s testbed"
  ],
  "description": "Explains CEIO’s NIC-side credits and elastic buffering, including reported throughput and tail-latency gains from a bounded two-server 200 Gb/s testbed.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## Perspective

The systems contribution is best understood as moving cache protection into the NIC control loop and validating that decision against concrete frameworks and workloads.

## CEIO: A Cache-Efficient Network I/O Architecture for NIC-CPU Data Paths

**Authors:** Bowen Liu, Xinyang Huang, Qijing Li, Zhuobin Huang, Yijun Sun, Wenxue Li, Junxue Zhang, Ping Yin, Kai Chen

[Open the primary public record](https://doi.org/10.1145/3718958.3750488). CEIO protects the last-level cache on NIC-to-CPU paths with NIC-driven credit flow control and an elastic on-NIC buffer. In the paper’s two-server, 200 Gb/s evaluation with DPDK, RDMA, eRPC, and LineFS workloads, it reports up to 2.9× higher throughput and up to a 1.9× improvement in tail latency over selected prior approaches.

**Evidence boundary.** The results come from a controlled two-server testbed and chosen workloads; they do not establish the same gains across arbitrary NICs, CPUs, or production clusters.
