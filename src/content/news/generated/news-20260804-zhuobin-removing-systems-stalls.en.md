---
{
  "title": "Zhuobin Huang: removing stalls by changing systems boundaries",
  "locale": "en",
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
  "coverKicker": "DISTRIBUTED + GPU SYSTEMS",
  "coverTitle": "Move state without stopping useful work",
  "coverPoints": [
    "Remote memory instead of serialization",
    "Concurrent GPU checkpointing",
    "Operating-system cooperation"
  ],
  "description": "Three publications involving Zhuobin Huang remove state-transfer and GPU-recovery stalls by redesigning the boundary between runtimes and operating systems.",
  "draft": false,
  "hidden": false,
  "archived": false
}
---
## Some of the longest delays perform no useful application work

Distributed applications often pause at boundaries that programmers have learned to accept: a serverless function serializes an object before another function can reconstruct it, or a GPU process stops while its state is copied for checkpointing. These pauses are not intrinsic to the application’s algorithm. They arise because one subsystem cannot directly use the state representation maintained by another.

Three publications involving Zhuobin Huang address that mismatch at two demanding boundaries. The RMMap line removes serialization and deserialization from serverless state transfer by exposing remote state through memory mapping. PhoenixOS lets GPU checkpoint and restore overlap with useful execution by moving coordination into the operating system and validating speculative progress. Both designs make a similar wager: when state movement dominates, optimizing the copier is less powerful than changing who owns the transition.

## Remote memory mapping can replace object reconstruction

[Serialization/Deserialization-free State Transfer in Serverless Workflows](https://doi.org/10.1145/3627703.3629568) begins from a sharply measured bottleneck. In the workloads studied by the authors, serialization and deserialization can account for up to 95% of state-transfer time. RMMap instead lets a downstream function access upstream state through a remote memory-mapping abstraction. The design coordinates the operating system, language runtime, RDMA transport, and serverless platform so that data need not be converted into a message and rebuilt as a second object before use.

The paper evaluates RMMap with real-world workflows on Knative. Under its tested configurations, it reaches up to 2.6-fold higher workflow performance and up to 86.3% resource utilization. Those maxima should remain attached to the evaluated workloads and cluster rather than treated as universal constants. The deeper result is architectural: zero-copy or RDMA support alone cannot remove reconstruction overhead if the programming and runtime abstractions still insist on serialization.

[Towards Serialization/Deserialization-free State Transfer in Serverless Workflows](https://doi.org/10.1145/3725986) is the extended journal study of the same RMMap research line. It should not be counted as a separate invention merely because it has a different DOI. Its role is to develop the system argument beyond the earlier conference publication: state transfer is treated as shared access to remotely backed memory, with cooperation spanning the software stack. Reading the two together is more informative than adding their performance figures as if they were independent replications.

## GPU recovery can proceed while the application keeps moving

[PhoenixOS: Concurrent OS-level GPU Checkpoint and Restore with Validated Speculation](https://doi.org/10.1145/3731569.3764813) turns to a different state problem. Conventional checkpoint and restore can impose long application pauses because GPU state is large, device operations are asynchronous, and memory may continue to change. PhoenixOS is presented as an operating-system service for concurrent GPU process checkpoint and restore. Rather than freeze all useful work for the entire transfer, it permits execution to overlap with state capture and validates the speculative interval.

The design combines several mechanisms. Kernel arguments identify state that is likely to be used or modified, while runtime binary instrumentation observes behavior that static information cannot settle. Soft copy-on-write preserves a usable checkpoint image without eagerly duplicating everything; recopies repair data changed during capture; on-demand restore brings state back when it is needed instead of forcing the whole image onto the critical path. The paper’s evaluation finds orders-of-magnitude improvements over the compared `cuda-checkpoint` path in selected downstream tasks. The result is substantial within those conditions, but production adoption would also have to test broader GPU APIs, workloads, failure timing, and driver generations.

## The shared contribution is a new ownership model for state

RMMap and PhoenixOS operate on different hardware and lifecycle events, yet they diagnose a common failure of abstraction. Serverless runtimes package state because downstream code cannot address the producer’s memory representation. GPU checkpoint tools stop execution because application progress and state capture are treated as mutually exclusive. In both cases, the operating system becomes an active participant: it supplies a protected shared-access abstraction, tracks change, and coordinates components that were previously separated by copies and pauses.

This does not mean every copy should be removed. Serialization provides isolation, portability, and a stable representation; stop-the-world checkpointing can be easier to reason about. The research contribution is to show when those guarantees are disproportionately expensive and to provide another design point. For latency-sensitive serverless workflows and large GPU states, changing the abstraction boundary can recover time that no scheduler or faster serializer could fully reclaim.

## Research notes

> ### PhoenixOS: Concurrent OS-level GPU Checkpoint and Restore with Validated Speculation
>
> - **Authors:** Xingda Wei, Zhuobin Huang, Tianle Sun, Yingyi Hao, Rong Chen, Mingcong Han, Jinyu Gu, Haibo Chen
> - **Public record:** [ACM Symposium on Operating Systems Principles](https://doi.org/10.1145/3731569.3764813)
> - **What is established:** Validated speculation, change tracking, recopy, and on-demand restoration enable concurrent OS-level GPU checkpoint and restore.
> - **Read with care:** Orders-of-magnitude improvements are measured against the selected checkpoint path and workloads; broader device and software compatibility remains a deployment question.
>
> ---
>
> ### Serialization/Deserialization-free State Transfer in Serverless Workflows
>
> - **Authors:** Fangming Lu, Xingda Wei, Zhuobin Huang, Rong Chen, Mingyu Wu, Haibo Chen
> - **Public record:** [ACM EuroSys 2024](https://doi.org/10.1145/3627703.3629568)
> - **What is established:** RMMap replaces serialized handoff with a remote memory-mapping abstraction co-designed across the OS, runtime, RDMA transport, and serverless platform.
> - **Read with care:** The stated 95% bottleneck, 2.6-fold performance maximum, and 86.3% utilization maximum belong to the paper’s workloads and testbed.
>
> ---
>
> ### Towards Serialization/Deserialization-free State Transfer in Serverless Workflows
>
> - **Authors:** Xingda Wei, Fangming Lu, Zhuobin Huang, Rong Chen, Mingyu Wu, Haibo Chen
> - **Public record:** [ACM Transactions on Computer Systems](https://doi.org/10.1145/3725986)
> - **What is established:** The journal publication extends the RMMap line of serialization-free state transfer in serverless workflows.
> - **Read with care:** It develops the same core system rather than constituting an independent replication of the EuroSys work.
