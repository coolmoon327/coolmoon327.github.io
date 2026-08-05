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
## When faster I/O overwhelms the cache

Modern network interfaces can deliver data so quickly that the bottleneck shifts away from the link itself. Packets arriving from the NIC compete for space in the CPU’s last-level cache, where uncontrolled bursts can evict application data and amplify memory traffic. The result is an awkward systems failure: a faster network path can make the processor’s data path less efficient.

[CEIO: A Cache-Efficient Network I/O Architecture for NIC-CPU Data Paths](https://doi.org/10.1145/3718958.3750488), coauthored by Zhuobin Huang, treats cache capacity as a resource that the NIC should actively protect. Instead of allowing receive traffic to enter the CPU path without restraint, the architecture brings feedback and buffering into the control loop between the NIC and the processor.

## Credits and elastic buffering at the NIC

CEIO combines NIC-driven credit flow control with an elastic on-NIC buffer. Credits regulate how much data may advance toward the CPU, while the buffer absorbs temporary mismatches between network arrival and host processing. The design aims to prevent network traffic from flooding the last-level cache without simply moving every delay into a fixed-size queue.

This is a meaningful architectural choice because cache interference is otherwise managed after packets have already consumed host resources. By acting at the NIC, CEIO coordinates ingress pressure with the processor’s ability to absorb data and can serve different software stacks without requiring each application to reinvent congestion control for the memory hierarchy.

## Measured gains and their scope

The paper evaluates CEIO on a two-server 200 Gb/s testbed using DPDK, RDMA, eRPC, and LineFS workloads. Against the selected prior approaches, it reports up to 2.9 times higher throughput, while P99.9 tail latency falls to as little as about 53% of the baseline value—a baseline-to-CEIO ratio of up to 1.9. The breadth of frameworks makes the result more informative than a single microbenchmark and shows that NIC-to-CPU cache pressure can affect several styles of high-performance I/O.

Those figures describe a controlled testbed rather than every possible deployment. Different NICs, processor cache hierarchies, workload mixes, and production-cluster contention may change both the bottleneck and the attainable gain. The work nevertheless demonstrates a useful systems principle: as line rates rise, network I/O design must manage not only bytes on the wire but also the cache footprint created when those bytes reach the host.

## Research notes

> ### CEIO: A Cache-Efficient Network I/O Architecture for NIC-CPU Data Paths
>
> **Authors:** Bowen Liu, Xinyang Huang, Qijing Li, Zhuobin Huang, Yijun Sun, Wenxue Li, Junxue Zhang, Ping Yin, Kai Chen
>
> **Status:** Published conference paper
>
> **Primary source:** [ACM DOI record](https://doi.org/10.1145/3718958.3750488)
>
> **Evidence note:** The reported gains—up to 2.9× higher throughput and P99.9 tail latency as low as about 53% of the baseline value (a baseline-to-CEIO ratio of up to 1.9)—come from a controlled two-server 200 Gb/s testbed with selected DPDK, RDMA, eRPC, and LineFS workloads. They do not establish identical gains across arbitrary NICs, CPUs, or production clusters.
