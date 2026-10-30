import { TheoryTopic, UnitId, UnitInfo } from '../types/theory';

export const THEORY_TOPICS: TheoryTopic[] = [
  // ==========================================
  // UNIT I: OS OVERVIEW, SERVICES & ARCHITECTURES
  // ==========================================
  {
    id: 'u1-what-is-os',
    unitId: 'unit-1',
    unitNumber: 1,
    unitTitle: 'UNIT-I: OS Foundations, Architectures & RTOS',
    title: 'What is an Operating System? Functions of OS',
    shortSummary: 'Core definition of OS as an extended machine and resource allocator managing CPU, memory, I/O, and security.',
    animationType: 'os-services',
    keyTakeaways: [
      'An OS acts as an intermediary between computer hardware and user applications.',
      'Primary goals: convenience for users, efficient hardware operation, and fault isolation.',
      'Key functions: Process Management, Memory Management, Storage/File Management, Device I/O Control, and Security/Protection.',
    ],
    theorySections: [
      {
        heading: '1. Definition & Core Abstractions',
        content:
          'An Operating System (OS) is system software that manages computer hardware, software resources, and provides common services for computer programs. Without an OS, every application would need custom drivers for every keyboard, SSD, graphics card, and network chip.',
        bullets: [
          'Resource Allocator: Arbitrates conflicting requests for CPU time, RAM space, and disk bandwidth.',
          'Control Program: Prevents errors and improper use of the system via privileged CPU modes.',
          'Extended Virtual Machine: Presents a clean, uniform, and friendly interface (files, processes, sockets) over raw, messy hardware registers.',
        ],
        diagramAscii: `
+------------------------------------------------------+
|                  User Applications                   |
|        (Browsers, Database Engines, IDEs)            |
+------------------------------------------------------+
|        System Call Interface (POSIX, Win32)          |
+------------------------------------------------------+
|                 OPERATING SYSTEM                     |
|  [Process Mgmt] [Memory Mgmt] [VFS] [Device Drivers]  |
+------------------------------------------------------+
|               Bare Hardware Layer                    |
|          [CPU]   [RAM]   [NVMe SSD]   [NIC]          |
+------------------------------------------------------+
        `,
      },
      {
        heading: '2. Major Architectural Functions',
        content:
          'The kernel coordinates five essential subsystems: Processor Management (allocating execution slots), Main Memory Management (tracking free vs allocated frames), File System Management (hierarchical naming and persistent storage), Device Management (interrupt-driven I/O dispatch), and Protection/Security (enforcing user boundaries).',
      },
    ],
    industrialApplication: {
      company: 'Apple Inc.',
      industry: 'Consumer Electronics & Mobile Computing',
      systemName: 'Darwin / XNU Kernel (iOS & macOS)',
      tagline: 'Hybrid Mach/BSD kernel executing across 2+ billion active devices',
      challenge:
        'Managing hundreds of concurrent audio, camera, neural engine, and app threads while guaranteeing 120Hz smooth ProMotion rendering without thermal throttling.',
      solution:
        'Apple unified the Mach microkernel (for IPC, task scheduling, virtual memory) with BSD POSIX compliance and custom I/O Kit object-oriented device drivers to manage M-series unified memory.',
      architectureDetails: [
        'XNU hybrid architecture executes Mach message passing and BSD POSIX APIs in one single address space.',
        'Grand Central Dispatch (GCD) kernel-level workqueues replace manual thread pools.',
        'Thermal-aware Quality of Service (QoS) classes: User Interactive, User Initiated, Utility, Background.',
      ],
      techStack: ['C', 'C++', 'Mach 3.0', 'FreeBSD', 'ARM64 Assembly'],
      codeOrConfigSnippet: {
        language: 'c',
        title: 'macOS sysctl kernel QoS dispatch query',
        code: `// Query active thread QoS priority in Darwin
#include <pthread/qos.h>
#include <stdio.h>

void execute_render_task() {
    pthread_set_qos_class_self_np(QOS_CLASS_USER_INTERACTIVE, 0);
    // Render loop scheduled on high-frequency Performance cores (P-cores)
    printf("Thread assigned to P-Core with QOS_CLASS_USER_INTERACTIVE\\n");
}`,
      },
      metrics: [
        { label: 'Active Devices', value: '2.2B+' },
        { label: 'Display Frame Budget', value: '8.33 ms (120Hz)' },
        { label: 'Latency Reduction', value: '42%' },
      ],
    },
    examNotes: {
      frequentQuestions: [
        {
          question: 'What is the primary difference between an OS as a Resource Allocator and an Extended Machine?',
          answer:
            'As a Resource Allocator, the OS acts as a manager deciding how CPU time, RAM, and disk blocks are shared among competing tasks. As an Extended Machine, it provides high-level abstractions (files, processes, sockets) shielding users from raw hardware details.',
        },
        {
          question: 'List the four essential components of a computer system.',
          answer: 'Hardware (CPU, memory, I/O devices), Operating System, Application Programs, and Users.',
        },
      ],
    },
  },

  {
    id: 'u1-os-types',
    unitId: 'unit-1',
    unitNumber: 1,
    unitTitle: 'UNIT-I: OS Foundations, Architectures & RTOS',
    title: 'Types: Batch, Multiprogrammed, Time Sharing & Multiprocessor OS',
    shortSummary: 'Evolution of operating systems from punch-card batch systems to multiprogramming, time-sharing interactive OS, and modern SMP multicore systems.',
    animationType: 'os-types',
    keyTakeaways: [
      'Batch OS groups similar jobs into batches to reduce setup overhead; zero user interaction.',
      'Multiprogramming keeps the CPU continuously busy by switching to another job when current job waits for I/O.',
      'Time Sharing provides quick response times using fine-grained time-slicing (preemption).',
      'Multiprocessor (SMP) systems share bus, clock, and memory across multiple CPUs for high throughput and reliability.',
    ],
    theorySections: [
      {
        heading: '1. Batch Systems & Multiprogramming Evolution',
        content:
          'Early mainframes executed one batch of punch-cards at a time. The CPU spent up to 90% of its time idling while waiting for slow tape reads. Multiprogramming solved this by loading multiple programs into memory simultaneously. When Job A issues an I/O request, the OS switches the CPU to Job B.',
        bullets: [
          'Batch OS: High turnaround time, no interactive debugging, non-preemptive.',
          'Multiprogramming: High CPU utilization, keeps CPU busy, requires memory protection.',
          'Time Sharing: Logical extension where CPU switches rapidly between users (quantum ~10-100ms) giving each user the illusion of a dedicated machine.',
        ],
        diagramAscii: `
Multiprogramming Timeline:
CPU: |--- Job A ---|=== Job B ===|--- Job A ---|*** Job C ***|
I/O:               |--- Job A ---|             |=== Job B ===|
     (CPU never idles while I/O operations occur in background)
        `,
      },
      {
        heading: '2. Multiprocessor Systems (Symmetric vs Asymmetric)',
        content:
          'Multiprocessor systems (Tightly-coupled systems) feature 2 or more CPUs sharing a common physical memory and bus.',
        bullets: [
          'Symmetric Multiprocessing (SMP): Each processor runs an identical copy of the OS and can communicate with any peer. All modern servers use SMP.',
          'Asymmetric Multiprocessing (ASMP): Master-slave relationship; master CPU schedules and controls slave worker CPUs.',
          'Advantages: Increased throughput, cost-efficiency through shared peripherals, and graceful degradation (fault tolerance).',
        ],
      },
    ],
    industrialApplication: {
      company: 'Amazon Web Services (AWS)',
      industry: 'Cloud Infrastructure & High-Performance Computing',
      systemName: 'AWS Nitro System & EC2 SMP Instances',
      tagline: 'Powering multi-tenant SMP cloud servers with 128+ vCPUs',
      challenge:
        'Delivering predictable time-sharing CPU allocations for millions of virtual machines without "noisy neighbor" cache thrashing or hypervisor overhead.',
      solution:
        'AWS offloaded virtualization, storage (EBS), and networking (VPC) to dedicated Nitro ASIC cards, allowing 100% of host SMP processor cores and memory to run customer workloads directly.',
      architectureDetails: [
        'Dedicated PCIe Nitro cards execute hypervisor tasks in hardware.',
        'Host CPUs operate in pure Symmetric Multiprocessing (SMP) mode with zero hypervisor context switch steal time.',
        'NUMA (Non-Uniform Memory Access) node topology mapping prevents cross-socket bus contention.',
      ],
      techStack: ['Linux KVM', 'C', 'Rust', 'PCIe Custom ASICs', 'NUMA'],
      metrics: [
        { label: 'Hypervisor Overhead', value: '~0% Steal Time' },
        { label: 'Max Sockets / Cores', value: '4 Sockets / 128 Cores' },
        { label: 'Network Bandwidth', value: '200 Gbps Nitro VPC' },
      ],
    },
    examNotes: {
      keyDifferences: [
        {
          feature: 'Goal',
          itemA: 'Multiprogramming: Maximize CPU Utilization',
          itemB: 'Time-Sharing: Minimize Response Time for Interactive Users',
          difference: 'Multiprogramming switches only on I/O block; Time-sharing switches on timer interrupt.',
        },
        {
          feature: 'Symmetric vs Asymmetric',
          itemA: 'SMP: All CPUs are peers, any CPU runs OS code',
          itemB: 'ASMP: Master CPU runs OS, slave CPUs execute user tasks',
          difference: 'SMP provides higher fault tolerance and avoids master CPU bottlenecks.',
        },
      ],
      frequentQuestions: [
        {
          question: 'What is Spooling in Batch Operating Systems?',
          answer:
            'SPOOL stands for Simultaneous Peripheral Operations On-Line. It buffers job data onto disk from card readers so the CPU can read inputs at disk speeds rather than slow card reader speeds.',
        },
      ],
    },
  },

  {
    id: 'u1-rtos',
    unitId: 'unit-1',
    unitNumber: 1,
    unitTitle: 'UNIT-I: OS Foundations, Architectures & RTOS',
    title: 'Real Time Operating System (RTOS)',
    shortSummary: 'Deterministic systems where correctness depends not just on logical result but on meeting strict timing deadlines.',
    animationType: 'rtos-deadlines',
    keyTakeaways: [
      'RTOS guarantees execution within deterministic time bounds (latency and jitter).',
      'Hard RTOS: Missing a single deadline causes total system failure (e.g. airbag deployment, pacemakers).',
      'Soft RTOS: Missing deadlines causes quality degradation but not catastrophic failure (e.g. video streaming).',
      'Key mechanisms: Priority-based preemptive scheduling, bounded interrupt latency, and priority inversion mitigation (Priority Ceiling/Inheritance).',
    ],
    theorySections: [
      {
        heading: '1. Hard vs Soft Real-Time Systems',
        content:
          'Unlike general-purpose OSes (Linux/Windows) that optimize for average throughput, an RTOS optimizes for worst-case execution time (WCET).',
        bullets: [
          'Hard Real-Time: Deadline misses are catastrophic. Strict deterministic guarantees. Minimal or zero virtual memory (paging disabled to avoid page fault jitter).',
          'Soft Real-Time: Deadlines are desirable targets. Late results are acceptable with degraded QoS (e.g. dropped video frames).',
          'Firm Real-Time: Late results are completely useless, but do not inflict physical damage (e.g. financial algorithmic trade packet).',
        ],
        diagramAscii: `
Hard RTOS:   Task Arrival ----> [ Execution ] ----| Deadline |===> PASS
                                                 ^ (Miss = CATASTROPHIC FAILURE)

Soft RTOS:   Task Arrival ----> [ Execution ] ----| Deadline |---> OK (Degraded Quality)
        `,
      },
      {
        heading: '2. Priority Inversion & Inheritance Protocol',
        content:
          'Priority Inversion occurs when a lower-priority task holds a shared mutex resource needed by a high-priority task, while a medium-priority task preempts the low task, starving the high-priority task. Solution: Priority Inheritance Protocol temporarily elevates the low task priority.',
      },
    ],
    industrialApplication: {
      company: 'NASA / Jet Propulsion Laboratory (JPL)',
      industry: 'Aerospace & Deep Space Exploration',
      systemName: 'VxWorks RTOS on Mars Perseverance Rover',
      tagline: 'Managing 7 Minutes of Terror entry, descent, and landing on Mars',
      challenge:
        'Autonomous landing on Martian surface at 12,000 mph where Earth signals take 14 minutes of radio lag; sensor loops must react within sub-millisecond deadlines.',
      solution:
        'VxWorks hard real-time kernel runs deterministic pre-emptive priority scheduling with priority inheritance to prevent Mars Pathfinder-style priority inversion deadlocks.',
      architectureDetails: [
        'Deterministic Bounded Context Switch (< 1.2 microseconds on RAD750 radiation-hardened CPU).',
        'Direct hardware memory addressing; dynamic virtual memory paging disabled to eliminate TLB/page-fault jitter.',
        'Watchdog timers reset tasks if scheduling deadline breaches occur.',
      ],
      techStack: ['Wind River VxWorks', 'C', 'Assembly', 'BAE RAD750 PowerPC'],
      metrics: [
        { label: 'Descent Guidance Loop', value: '100 Hz Deterministic' },
        { label: 'Worst-Case Latency', value: '< 2.5 µs' },
        { label: 'Mission Reliability', value: '100% Zero Deadline Misses' },
      ],
    },
    examNotes: {
      frequentQuestions: [
        {
          question: 'What is the Priority Inversion problem in RTOS?',
          answer:
            'A scenario where a high-priority task is indirectly preempted by a medium-priority task because a low-priority task holds a shared lock required by the high-priority task. Solved by Priority Inheritance Protocol.',
        },
        {
          question: 'Why is Virtual Memory paging disabled in Hard RTOS?',
          answer:
            'Paging introduces unpredictable page faults that require mechanical or flash disk I/O, introducing non-deterministic delays (milliseconds) that cause hard deadline misses.',
        },
      ],
    },
  },

  {
    id: 'u1-distributed-os',
    unitId: 'unit-1',
    unitNumber: 1,
    unitTitle: 'UNIT-I: OS Foundations, Architectures & RTOS',
    title: 'Distributed Operating System',
    shortSummary: 'Loosely coupled systems presenting a collection of independent networked computers as a single unified computing system.',
    animationType: 'distributed-cluster',
    keyTakeaways: [
      'Manages a group of physically separate networked nodes and makes them appear as a single computer.',
      'Transparency: Access, Location, Migration, Replication, Concurrency, and Failure transparency.',
      'Loosely coupled: Nodes do not share physical memory or clock; coordinate via Remote Procedure Calls (RPC).',
      'Advantages: Resource sharing, computational speedup through parallelization, and high availability.',
    ],
    theorySections: [
      {
        heading: '1. Concept & Architectural Models',
        content:
          'A Distributed Operating System (DOS) provides network-wide resource sharing. Users execute programs without knowing where the physical CPU, memory, or disk storage is located in the cluster.',
        bullets: [
          'Location Transparency: File `/data/report.pdf` is accessed identically regardless of which physical storage server hosts it.',
          'Migration Transparency: Tasks can move across nodes for load balancing without interrupting client sessions.',
          'Failure Transparency: If Node 4 crashes, its tasks are automatically reassigned to Node 5 without client errors.',
        ],
        diagramAscii: `
+-----------------------------------------------------------+
|               Single System Image (DOS API)               |
+-----------------------------------------------------------+
  | (RPC)                 | (RPC)                 | (RPC)
+-------------+         +-------------+         +-------------+
|   Node 1    |         |   Node 2    |         |   Node 3    |
| [CPU] [RAM] |         | [CPU] [RAM] |         | [CPU] [RAM] |
+-------------+         +-------------+         +-------------+
       \\                       |                       /
        +========= High-Speed Cluster Network ========+
        `,
      },
    ],
    industrialApplication: {
      company: 'Google LLC',
      industry: 'Cloud Computing & Distributed Systems',
      systemName: 'Borg Cluster Management System (precursor to Kubernetes)',
      tagline: 'Orchestrating hundreds of thousands of jobs across millions of servers',
      challenge:
        'Coordinating planetary-scale search, YouTube streaming, and Ads workloads across hundreds of datacenters with continuous hardware server failures.',
      solution:
        'Borg acts as the distributed OS of Google datacenters. It schedules tasks, monitors health, isolates memory/CPU via Linux cgroups, and presents millions of cores as a unified pool.',
      architectureDetails: [
        'BorgMaster centralized coordinator with 5 Paxos consensus replicas.',
        'Borglet local daemon on each machine monitors health and launches containers.',
        'Predictive bin-packing scheduler packs batch and latency-sensitive jobs onto identical hardware.',
      ],
      techStack: ['C++', 'Paxos Protocol', 'Linux cgroups', 'Protocol Buffers'],
      metrics: [
        { label: 'Nodes per Cell', value: '10,000+ Servers' },
        { label: 'Cluster Utilization', value: '85%+' },
        { label: 'Container Starts', value: '2 Billion+ / week' },
      ],
    },
    examNotes: {
      keyDifferences: [
        {
          feature: 'Coupling',
          itemA: 'Network OS: Loosely coupled; users know remote node names (ssh user@node)',
          itemB: 'Distributed OS: Tightly transparent; single system image across cluster',
          difference: 'Distributed OS hides the existence of multiple machines from the user.',
        },
      ],
      frequentQuestions: [
        {
          question: 'What is Access Transparency in Distributed Systems?',
          answer:
            'Identical operations are used to access both local and remote resources without differing syntax or APIs.',
        },
      ],
    },
  },

  {
    id: 'u1-system-calls',
    unitId: 'unit-1',
    unitNumber: 1,
    unitTitle: 'UNIT-I: OS Foundations, Architectures & RTOS',
    title: 'System Calls – Concept, Types & Hardware Traps',
    shortSummary: 'The programmatic interface between user applications and the privileged kernel via dual-mode CPU rings and software interrupts.',
    animationType: 'system-call-trap',
    keyTakeaways: [
      'System calls are the only authorized gateway for user space (Ring 3) to request privileged hardware actions (Ring 0).',
      'Dual-Mode Operation: Mode bit in hardware (0 = Kernel Mode, 1 = User Mode) protects memory and CPU instructions.',
      'Mechanism: Application calls API -> Trap/Syscall instruction -> Mode bit flips to 0 -> Interrupt Vector Table lookup -> Kernel handler -> Sysret/Mode bit flips to 1.',
      'Six categories: Process Control, File Manipulation, Device Management, Information Maintenance, Communications, and Protection.',
    ],
    theorySections: [
      {
        heading: '1. Mechanism of System Call Execution',
        content:
          'CPUs enforce security boundaries via hardware privilege levels. User applications run in Ring 3 (unprivileged). When an application needs to read a file from disk, it invokes a software interrupt/trap (e.g. `syscall` on x86-64 or `svc` on ARM).',
        bullets: [
          '1. Application places system call number in register (e.g., `RAX = 1` for `sys_write` in Linux).',
          '2. Trap instruction triggers hardware privilege level change from Ring 3 to Ring 0.',
          '3. CPU switches to kernel stack, saves user Program Counter (PC) and registers.',
          '4. Kernel indexes System Call Table (`sys_call_table[RAX]`) and executes handler.',
          '5. Result code placed in `RAX`, `sysret` instruction restores user mode and resumes execution.',
        ],
        diagramAscii: `
[ USER SPACE (Ring 3) ]      |  [ KERNEL SPACE (Ring 0) ]
-----------------------------+-----------------------------
printf("Hello")              |
  |                          |
  v (C Standard Library)     |
write(fd, buf, count)        |
  | [RAX=1, RDI=fd, RSI=buf] |
  v                          |
+--------------------------+ |
|   SYSCALL (Trap Opcode)  |===> Mode Bit switches (1 -> 0)
+--------------------------+ |         |
                             |         v
                             |  sys_call_table[1] -> sys_write()
                             |         | (Driver writes to disk/display)
                             |         v
                             |  SYSRET (Mode Bit switches 0 -> 1)
                             |         |
Resume user code <===========+=========+
        `,
      },
      {
        heading: '2. Six Major Types of System Calls',
        content:
          'POSIX and Windows organize system calls into structured categories:',
        bullets: [
          'Process Control: `fork()`, `execve()`, `wait()`, `exit()`, `abort()`.',
          'File Manipulation: `open()`, `read()`, `write()`, `close()`, `unlink()`.',
          'Device Management: `ioctl()`, `read()`, `write()`.',
          'Information Maintenance: `getpid()`, `time()`, `alarm()`, `sysinfo()`.',
          'Communications: `pipe()`, `shmget()`, `socket()`, `connect()`.',
          'Protection: `chmod()`, `chown()`, `umask()`.',
        ],
      },
    ],
    industrialApplication: {
      company: 'Cloudflare & Linux Foundation',
      industry: 'High-Performance Edge Computing & Web Security',
      systemName: 'eBPF (Extended Berkeley Packet Filter) & io_uring',
      tagline: 'Processing millions of HTTP packets per second by optimizing syscall overhead',
      challenge:
        'Standard `read()` and `write()` system calls incur ~150-300 nanoseconds of CPU context switch latency per call, bottlenecking 100Gbps network servers.',
      solution:
        'Cloudflare and Linux kernel engineers created `io_uring` and eBPF. `io_uring` uses shared ring-buffers in kernel memory to submit and complete thousands of I/O operations without a single trap per call.',
      architectureDetails: [
        'Submission Queue (SQ) and Completion Queue (CQ) mapped into user address space.',
        'Zero-syscall asynchronous I/O batching reduces CPU mode-switch overhead by 90%.',
        'eBPF JIT compiler runs sandboxed C bytecode inside kernel packet hooks without userspace round-trips.',
      ],
      techStack: ['C', 'Linux Kernel 5.10+', 'io_uring', 'eBPF', 'x86-64 ASM'],
      codeOrConfigSnippet: {
        language: 'c',
        title: 'Linux x86-64 assembly system call dispatch',
        code: `section .data
    msg db "KernelLab OS", 10
    len equ $ - msg

section .text
    global _start

_start:
    mov rax, 1        ; sys_write syscall ID
    mov rdi, 1        ; stdout file descriptor
    mov rsi, msg      ; memory pointer
    mov rdx, len      ; buffer length
    syscall           ; Switch Ring 3 -> Ring 0 trap

    mov rax, 60       ; sys_exit syscall ID
    xor rdi, rdi      ; return code 0
    syscall`,
      },
      metrics: [
        { label: 'Syscall Context Latency', value: '180 ns' },
        { label: 'io_uring Throughput Gain', value: '+340%' },
        { label: 'Edge Packets Filtered', value: '45M packets/sec' },
      ],
    },
    examNotes: {
      frequentQuestions: [
        {
          question: 'Why are system calls invoked via software interrupts rather than normal function calls?',
          answer:
            'A regular function call (`call` instruction) cannot change the hardware CPU privilege mode bit from Ring 3 to Ring 0. Only a hardware trap or `syscall` instruction can validate permissions, flip the privilege mode, and jump to trusted kernel code.',
        },
        {
          question: 'What are the three general methods for passing parameters to a system call?',
          answer:
            '1. In CPU Registers (fastest, limited capacity). 2. In a Memory Block/Table with the address passed in a register. 3. Pushed onto the program Stack by the program and popped off by the OS.',
        },
      ],
    },
  },

  {
    id: 'u1-os-services',
    unitId: 'unit-1',
    unitNumber: 1,
    unitTitle: 'UNIT-I: OS Foundations, Architectures & RTOS',
    title: 'Different Services of Operating Systems',
    shortSummary: 'Comprehensive overview of OS services that benefit users (UI, Program Execution, I/O) and system efficiency (Resource Allocation, Accounting, Protection).',
    animationType: 'os-services',
    keyTakeaways: [
      'User-facing services: User Interface (CLI/GUI), Program Execution, I/O Operations, File-System Manipulation, and Communications.',
      'System-efficiency services: Resource Allocation, Accounting (metering), and Protection & Security.',
      'Error Detection occurs at hardware level (power failures, parity), memory level (bad addresses), and user level (arithmetic overflow).',
    ],
    theorySections: [
      {
        heading: '1. Classification of Kernel Services',
        content:
          'Operating System services fall into two broad pillars: services designed for user convenience and services designed to maintain system integrity and multi-tenant efficiency.',
        bullets: [
          'User Interface: CLI (Bash, Zsh), GUI (Aqua, GNOME), Touch / Voice interfaces.',
          'Program Execution: Loading executable binary segments (`.text`, `.data`, `.bss`) from disk into RAM, allocating stack/heap, and scheduling the initial thread.',
          'I/O Operations: Hiding raw device controllers behind clean block/character stream devices.',
          'File-System Manipulation: Directory creation, permissions, metadata tracking, and disk sector allocation.',
          'Communications: Inter-Process Communication (IPC) across shared memory or network sockets.',
          'Error Detection: CPU trap handlers for division by zero, page faults, bus errors, and hardware parity checks.',
          'Resource Allocation: Multitasking CPU scheduling, memory page management, and peripheral assignment.',
          'Accounting: Tracking resource usage for billing and performance diagnostics.',
          'Protection & Security: Enforcing access control lists (ACL) and process isolation.',
        ],
      },
    ],
    industrialApplication: {
      company: 'Datadog & New Relic',
      industry: 'Enterprise Cloud Observability & Infrastructure',
      systemName: 'OS Accounting & Performance Subsystems',
      tagline: 'Monitoring kernel telemetry across 500,000 corporate hosts',
      challenge:
        'Collecting microsecond-level CPU accounting, network packet counts, and memory leak telemetry without inducing more than 1% CPU overhead on customer servers.',
      solution:
        'Modern observability platforms read OS Accounting services directly via Linux `/proc/stat`, `/proc/meminfo`, and eBPF kernel hooks provided natively by the OS service layer.',
      architectureDetails: [
        'Reads kernel CPU tick counters (user, system, idle, iowait, irq).',
        'Aggregates memory cgroup accounting (RSS, page cache, swap).',
      ],
      techStack: ['Go', 'Linux /proc filesystem', 'eBPF', 'cgroups v2'],
      metrics: [
        { label: 'Metrics Polled / Second', value: '15 Billion' },
        { label: 'Kernel Agent Footprint', value: '< 25 MB RAM' },
      ],
    },
    examNotes: {
      frequentQuestions: [
        {
          question: 'What is the role of the Accounting service in modern operating systems?',
          answer:
            'Accounting keeps track of which users/processes use how much and what kinds of computer resources (CPU time, memory footprint, disk reads, network bytes). It is vital for cloud billing (AWS/Azure) and performance profiling.',
        },
      ],
    },
  },

  {
    id: 'u1-revision',
    unitId: 'unit-1',
    unitNumber: 1,
    unitTitle: 'UNIT-I: OS Foundations, Architectures & RTOS',
    title: 'Revised - Unit No. 1 (Quick Review & Exam Q&A)',
    shortSummary: 'High-yield summary, comparison charts, formula cheat-sheets, and top university viva questions for Unit I.',
    animationType: 'unit-revision',
    keyTakeaways: [
      'Mastered OS Definitions: Resource Allocator, Extended Machine, Control Program.',
      'Comparison: Batch vs Multiprogrammed vs Time-Sharing vs Multiprocessor (SMP).',
      'RTOS: Determinism, Hard vs Soft deadlines, Priority Inversion & Inheritance.',
      'Dual-Mode Operation: Ring 3 User Mode vs Ring 0 Kernel Mode via Trap instruction.',
    ],
    theorySections: [
      {
        heading: 'Comprehensive Unit 1 Knowledge Matrix',
        content:
          'Review this summary table before university semester exams or technical interviews:',
        bullets: [
          'OS Core: Acts as bridge between raw hardware and user code.',
          'Multiprogramming: CPU is never idle while I/O executes.',
          'Time Sharing: Uses time slicing (quantum) for interactive responsiveness.',
          'SMP: Multi-core, shared bus/memory, peer processors, high reliability.',
          'RTOS: Strict deterministic time bounds; Hard (zero misses allowed) vs Soft (graceful degradation).',
          'System Calls: Trap opcode switches CPU mode bit (1 -> 0) to invoke kernel routines.',
        ],
      },
    ],
    industrialApplication: {
      company: 'Red Hat / IBM',
      industry: 'Enterprise Linux Infrastructure',
      systemName: 'Red Hat Enterprise Linux (RHEL) Architecture',
      tagline: 'The de facto enterprise standard OS powering 90% of Fortune 500 banks',
      challenge:
        'Providing long-term 10-year stable ABI/API guarantees across enterprise financial transaction servers while patching zero-day vulnerabilities in kernel syscalls.',
      solution:
        'Red Hat uses rigorous POSIX conformance, deterministic realtime kernel patches (PREEMPT_RT), and strict dual-mode isolation to run mission-critical enterprise workloads.',
      architectureDetails: [
        'PREEMPT_RT real-time tree mainline integration.',
        'POSIX.1-2017 compliant system call interface.',
        'SELinux mandatory access control security model.',
      ],
      techStack: ['RHEL', 'Linux Kernel', 'SELinux', 'glibc', 'systemd'],
      metrics: [
        { label: 'Fortune 500 Adoption', value: '92%' },
        { label: 'Kernel ABI Support', value: '10+ Years Guaranteed' },
      ],
    },
    examNotes: {
      frequentQuestions: [
        {
          question: 'Compare Hard Real Time vs Soft Real Time systems with examples.',
          answer:
            'Hard RTOS: Absolute deterministic deadlines. A single deadline miss causes total failure (e.g. Airbag control, cardiac pacemaker). Soft RTOS: Deadlines are critical but late delivery degrades quality without catastrophe (e.g. VoIP call, live video streaming).',
        },
        {
          question: 'What happens in the CPU when a System Call is executed?',
          answer:
            '1. Parameters loaded into registers. 2. Trap/syscall opcode executed. 3. CPU flips mode bit from 1 to 0 (Kernel Mode). 4. User PC and stack pointer saved. 5. Execution jumps to interrupt vector table address. 6. Handler executes. 7. Sysret flips mode bit back to 1 and execution resumes.',
        },
      ],
    },
  },

  // ==========================================
  // UNIT II: PROCESSES, THREADS, IPC & SCHEDULING
  // ==========================================
  {
    id: 'u2-process-concept',
    unitId: 'unit-2',
    unitNumber: 2,
    unitTitle: 'UNIT-II: Processes, Threads, IPC & Scheduling Queues',
    title: 'Process: Process Concept & Process States',
    shortSummary: 'A process is a program in execution containing program code, counter, registers, stack, data, and heap across 5 active states.',
    animationType: 'process-lifecycle',
    keyTakeaways: [
      'A program is a passive entity (executable binary on disk); a process is an active entity with a Program Counter and resources.',
      'Process Memory Layout: Stack (local vars), Heap (dynamic allocations), Data (global/static vars), and Text (compiled machine code).',
      'The 5 Classic Process States: New -> Ready -> Running -> Waiting (Blocked) -> Terminated.',
    ],
    theorySections: [
      {
        heading: '1. Process Memory Anatomy',
        content:
          'When an executable binary is loaded into memory, the operating system creates a virtual address space split into four primary segments.',
        bullets: [
          'Text Section: Executable machine instructions; read-only and shared among multiple instances.',
          'Data Section: Initialized global and static variables.',
          'BSS Section: Uninitialized global/static variables (zero-initialized).',
          'Heap: Dynamically allocated memory at runtime via `malloc()` or `new`; grows upwards.',
          'Stack: Function call frames, local variables, return addresses; grows downwards towards heap.',
        ],
        diagramAscii: `
+---------------------------------------+ 0xFFFFFFFF (Max Virtual Memory)
|                STACK                  | (Grows Downward)
|       (Function frames, Locals)       |   |
|                   v                   |   v
+---------------------------------------+
|                   ^                   |
|                   |                   |   ^
|                 HEAP                  | (Grows Upward)
|        (malloc / dynamic memory)      |
+---------------------------------------+
|            DATA & BSS                 |
|      (Global / Static Variables)      |
+---------------------------------------+
|                 TEXT                  |
|        (Binary Machine Code)          |
+---------------------------------------+ 0x00000000
        `,
      },
      {
        heading: '2. The 5-State Process Machine',
        content:
          'As a process executes, it transitions through five distinct states managed by the kernel scheduler:',
        bullets: [
          'NEW: The process is being created (memory allocated, PCB initialized).',
          'READY: The process is loaded in RAM and waiting to be assigned to a CPU by the scheduler.',
          'RUNNING: Instructions are actively executing on a CPU core.',
          'WAITING (BLOCKED): Process is waiting for an I/O event, timer, or signal completion.',
          'TERMINATED: Execution completed; resources released, PCB retained briefly as zombie until parent calls `wait()`.',
        ],
      },
    ],
    industrialApplication: {
      company: 'Google Android Open Source Project (AOSP)',
      industry: 'Mobile Operating Systems & Embedded Systems',
      systemName: 'Android Zygote Process & Low Memory Killer (LMK)',
      tagline: 'Managing 3+ billion smartphone apps with instant cold-start times',
      challenge:
        'Starting an Android Java/Kotlin app from scratch takes seconds to load libraries and pre-warm classes, ruining user experience.',
      solution:
        'Android boots a master process called "Zygote" that pre-loads all core Android SDK classes. When a user launches an app, Zygote invokes `fork()` with Copy-on-Write (COW), spawning new app processes in under 50 milliseconds.',
      architectureDetails: [
        'Zygote pre-allocates ART runtime and 5,000+ framework classes.',
        'Linux `fork()` shares physical RAM pages between parent Zygote and child app until modified.',
        'Low Memory Killer daemon (lmkd) terminates cached background processes based on importance score (OOM_adj).',
      ],
      techStack: ['Android OS', 'Linux Kernel', 'Android Runtime (ART)', 'C++', 'Java'],
      metrics: [
        { label: 'Cold Start Time', value: '< 60 ms via COW fork' },
        { label: 'Memory Savings', value: '45% shared framework RAM' },
        { label: 'Active Devices', value: '3.6 Billion' },
      ],
    },
    examNotes: {
      frequentQuestions: [
        {
          question: 'What is the difference between a Program and a Process?',
          answer:
            'A program is a passive entity (file containing instructions stored on disk). A process is an active entity with a program counter, registers, stack, and execution state in memory.',
        },
        {
          question: 'What is a Zombie Process and how is it created?',
          answer:
            'A process that has finished execution (via `exit()`) but still has an entry in the process table so its parent can read its exit status code. It is removed once the parent calls `wait()`.',
        },
      ],
    },
  },

  {
    id: 'u2-pcb',
    unitId: 'unit-2',
    unitNumber: 2,
    unitTitle: 'UNIT-II: Processes, Threads, IPC & Scheduling Queues',
    title: 'Process Control Block (PCB)',
    shortSummary: 'The kernel data structure (task_struct in Linux) representing all information associated with a specific process.',
    animationType: 'process-lifecycle',
    keyTakeaways: [
      'The PCB is the manifest of a process in kernel memory.',
      'Contains: Process ID (PID), Process State, Program Counter (PC), CPU Registers, CPU Scheduling Information, Memory Limits, and I/O Status.',
      'In Linux, PCB is represented by `struct task_struct` in `<linux/sched.h>`.',
    ],
    theorySections: [
      {
        heading: '1. Anatomical Fields of a PCB',
        content:
          'Every process has an associated PCB in kernel memory. If a process is preempted, all its hardware register contents are copied into its PCB so it can resume later without data corruption.',
        bullets: [
          'Process Identifier (PID): Unique integer assigned by the OS.',
          'Process State: NEW, READY, RUNNING, WAITING, TERMINATED.',
          'Program Counter (PC): Memory address of the next instruction to execute.',
          'CPU Registers: Accumulator, index registers, stack pointer (SP), status flags.',
          'Memory Management Info: Page tables, segment tables, base and limit registers.',
          'Accounting Info: CPU time used, clock ticks elapsed, time limits.',
          'I/O Status Info: List of open file descriptors (fd table), allocated devices.',
        ],
        diagramAscii: `
+------------------------------------------------+
|             Process Control Block (PCB)        |
+------------------------------------------------+
| PID: 1042           | Priority: -5 (Nice: 10)  |
| State: READY        | Parent PID: 1001         |
+---------------------+--------------------------+
| Program Counter: 0x004018A0                    |
| Stack Pointer:   0x7FFE20B0                    |
| Registers: RAX=0x0, RBX=0x4F, RCX=0x10...      |
+------------------------------------------------+
| Memory Info: Page Table Base (CR3) = 0x8A000   |
| Open Files: fd 0 (stdin), fd 1 (stdout), fd 3  |
+------------------------------------------------+
        `,
      },
    ],
    industrialApplication: {
      company: 'Meta (Facebook)',
      industry: 'Social Media & Global Infrastructure',
      systemName: 'Linux task_struct & cgroups in Meta Data Centers',
      tagline: 'Inspecting millions of task_struct PCBs across thousands of hyperscale servers',
      challenge:
        'Detecting memory leaks and runaway server threads across thousands of multi-threaded web server instances without restarting servers.',
      solution:
        'Meta engineers inspect `struct task_struct` fields via Linux `/proc/<pid>/status` and eBPF probes to analyze CPU cycles, context switch frequencies, and memory limits in real time.',
      architectureDetails: [
        'Linux `task_struct` contains over 100 member variables in kernel memory.',
        'Control Groups (cgroups v2) link PCBs into hierarchical resource trees.',
      ],
      techStack: ['Linux Kernel', 'C', 'task_struct', 'cgroups v2', 'BPF'],
      metrics: [
        { label: 'PCB Kernel Size', value: '~4-6 KB per task' },
        { label: 'Concurrent Tasks / Host', value: '100,000+ threads' },
      ],
    },
    examNotes: {
      frequentQuestions: [
        {
          question: 'Where is the Process Control Block stored?',
          answer:
            'The PCB is stored in protected Kernel Space memory (not accessible to user space) to prevent unauthorized tampering.',
        },
      ],
    },
  },

  {
    id: 'u2-threads',
    unitId: 'unit-2',
    unitNumber: 2,
    unitTitle: 'UNIT-II: Processes, Threads, IPC & Scheduling Queues',
    title: 'Thread: Concept, Multithreading Models & Thread Types',
    shortSummary: 'A thread is a lightweight unit of CPU utilization comprising a thread ID, program counter, register set, and stack while sharing text, data, and open files.',
    animationType: 'thread-models',
    keyTakeaways: [
      'Threads share address space (code, data, heap, files) of the parent process, but retain private Stack and Registers.',
      'User-Level Threads (ULT) managed by user-space library; Kernel-Level Threads (KLT) directly managed by OS scheduler.',
      'Multithreading Models: Many-to-One (ULT), One-to-One (Linux clone/pthreads), Many-to-Many (hybrid).',
      'Benefits: Responsiveness, Resource Sharing, Economy (lower context switch cost), Scalability on multicore architectures.',
    ],
    theorySections: [
      {
        heading: '1. Process vs Thread Architecture',
        content:
          'Creating a process requires allocating a completely new virtual memory space, page tables, and file descriptors. Threads within the same process share these resources, making thread creation and context switching up to 10x-20x faster.',
        bullets: [
          'Shared by All Threads: Text (Code), Global Data, Heap (Dynamic RAM), Open File Descriptors.',
          'Private to Each Thread: Thread ID, Program Counter (PC), CPU Register State, Execution Call Stack.',
        ],
        diagramAscii: `
SINGLE PROCESS ADDRESS SPACE:
+-----------------------------------------------------------+
| [ Code / Text ]    [ Global Data ]    [ Dynamic Heap ]     |
+-----------------------------------------------------------+
| Thread 1 Stack  |  Thread 2 Stack  |  Thread 3 Stack      |
| Registers, PC   |  Registers, PC   |  Registers, PC       |
+-----------------+------------------+----------------------+
        `,
      },
      {
        heading: '2. Multithreading Models',
        content:
          'How user-space threads map to kernel-space execution units:',
        bullets: [
          'Many-to-One (M:1): Multiple user threads mapped to 1 kernel thread. Fast switching in user space, but if one thread makes a blocking system call, the ENTIRE process blocks.',
          'One-to-One (1:1): Each user thread maps to 1 kernel thread. True multicore parallelism! If one blocks, others continue. Used by Linux (`clone()`) and Windows.',
          'Many-to-Many (M:N): M user threads multiplexed over N kernel threads (M >= N). Highly flexible but complex scheduler coordination.',
        ],
      },
    ],
    industrialApplication: {
      company: 'Netflix Inc.',
      industry: 'Streaming Media & Cloud Microservices',
      systemName: 'Java Virtual Threads (Project Loom) & Netty',
      tagline: 'Handling millions of concurrent streaming requests with lightweight user threads',
      challenge:
        'Standard 1:1 OS threads consume ~1 MB stack memory each. A server handling 100,000 concurrent streaming connections would exhaust 100 GB RAM on thread stacks alone.',
      solution:
        'Netflix adopted Java 21 Virtual Threads (M:N multithreading). Millions of user-mode virtual threads are multiplexed onto a small pool of carrier OS kernel threads, eliminating thread starvation.',
      architectureDetails: [
        'Virtual thread stacks stored on the Java heap rather than native OS stack memory.',
        'Blocking socket reads automatically unmount the virtual thread from the carrier kernel thread.',
      ],
      techStack: ['Java 21 Virtual Threads', 'Linux epoll', 'Netty', 'C++'],
      metrics: [
        { label: 'Concurrent Threads', value: '1,000,000+ per node' },
        { label: 'Memory per Thread', value: '~1 KB (vs 1MB OS thread)' },
        { label: 'Throughput Increase', value: '+260%' },
      ],
    },
    examNotes: {
      keyDifferences: [
        {
          feature: 'OS Awareness',
          itemA: 'User-Level Threads (ULT): Kernel is unaware of threads',
          itemB: 'Kernel-Level Threads (KLT): OS kernel manages and schedules each thread',
          difference: 'ULT cannot achieve true multicore parallelism; if one ULT blocks, all block.',
        },
      ],
      frequentQuestions: [
        {
          question: 'Why is context switching between threads cheaper than between processes?',
          answer:
            'Because threads share the same address space. Context switching between threads does not require flushing the CPU Translation Lookaside Buffer (TLB) or swapping memory page tables.',
        },
      ],
    },
  },

  {
    id: 'u2-ipc',
    unitId: 'unit-2',
    unitNumber: 2,
    unitTitle: 'UNIT-II: Processes, Threads, IPC & Scheduling Queues',
    title: 'IPC: Inter-Process Communication & Real-World Examples',
    shortSummary: 'Mechanisms allowing separate processes with isolated memory to exchange data and synchronize: Shared Memory vs Message Passing.',
    animationType: 'ipc-mechanisms',
    keyTakeaways: [
      'Processes have isolated memory spaces; IPC allows them to communicate safely.',
      'Two fundamental models: Shared Memory (fastest, zero-copy, requires synchronization) and Message Passing (safe, kernel-mediated, ideal for distributed systems).',
      'IPC mechanisms: POSIX Shared Memory, UNIX Pipes, Named Pipes (FIFOs), Message Queues, UNIX Domain Sockets.',
    ],
    theorySections: [
      {
        heading: '1. Shared Memory vs Message Passing',
        content:
          'Operating systems provide two foundational paradigms for inter-process data exchange:',
        bullets: [
          'Shared Memory: A region of physical RAM is mapped into the virtual address space of two or more processes. Communication occurs at memory bus speeds with zero kernel context switches once established. Requires synchronization primitives (mutexes/semaphores) to prevent race conditions.',
          'Message Passing: Processes send and receive structured messages (`send()`, `receive()`) mediated by the kernel buffer queue. Slower due to system call copying overhead, but easier to program and works seamlessly across network nodes.',
        ],
        diagramAscii: `
SHARED MEMORY MODEL:
Process A [Virtual Mem] ---> \\
                              +===> [ PHYSICAL SHARED RAM ] (Zero Copy, Bus Speed)
Process B [Virtual Mem] ---> /

MESSAGE PASSING MODEL:
Process A ---> (syscall write) ---> [ KERNEL MESSAGE BUFFER ] ---> (syscall read) ---> Process B
        `,
      },
      {
        heading: '2. Examples of IPC Systems in Real Operating Systems',
        content:
          'Real OS implementations include POSIX shm (`shm_open`, `mmap`), anonymous pipes (`|` in bash), Mach microkernel message ports, and Windows ALPC (Advanced Local Procedure Call).',
      },
    ],
    industrialApplication: {
      company: 'Jane Street / Citadel Securities',
      industry: 'High-Frequency Trading (HFT) & Quantitative Finance',
      systemName: 'POSIX Shared Memory & Ring Buffers (IPC)',
      tagline: 'Executing sub-microsecond market orders via zero-copy shared memory',
      challenge:
        'Passing market order books between trading algorithms and network gateway processes using TCP sockets incurs 5-15 microseconds of kernel socket latency, costing millions in slippage.',
      solution:
        'HFT engines use POSIX Shared Memory (`shm_open`, `mmap`) with lock-free single-producer single-consumer (SPSC) circular ring buffers, bypassing kernel syscalls entirely.',
      architectureDetails: [
        'Shared memory segments mapped directly into L3 CPU cache lines.',
        'Atomic memory fences (`std::atomic_thread_fence`) eliminate mutex locking overhead.',
        'Data exchange occurs in under 80 nanoseconds.',
      ],
      techStack: ['C++', 'POSIX shm_open', 'mmap', 'x86-64 Cacheline Padding'],
      codeOrConfigSnippet: {
        language: 'c',
        title: 'POSIX Shared Memory Setup in C',
        code: `// Process A: Create shared memory block
int fd = shm_open("/hft_order_book", O_CREAT | O_RDWR, 0666);
ftruncate(fd, sizeof(OrderBook));
OrderBook* book = mmap(NULL, sizeof(OrderBook), PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);

// Process B: Maps same physical RAM instantly
// Writes happen at L3 memory bus speed (< 80ns)`,
      },
      metrics: [
        { label: 'Socket IPC Latency', value: '8,500 ns' },
        { label: 'Shared Memory Latency', value: '75 ns' },
        { label: 'Speedup Factor', value: '113x Faster' },
      ],
    },
    examNotes: {
      frequentQuestions: [
        {
          question: 'Compare Shared Memory and Message Passing IPC paradigms.',
          answer:
            'Shared Memory: Data is read/written directly to RAM; maximum speed, zero kernel involvement during transfer, but programmer must handle synchronization (mutex/semaphore). Message Passing: Data copied via kernel buffers; slower, but avoids race conditions and functions across network nodes.',
        },
      ],
    },
  },

  {
    id: 'u2-context-switching',
    unitId: 'unit-2',
    unitNumber: 2,
    unitTitle: 'UNIT-II: Processes, Threads, IPC & Scheduling Queues',
    title: 'Context Switching & Dispatch Latency',
    shortSummary: 'The mechanism of stopping the currently executing process, saving its CPU state to its PCB, and loading the state of a new process from its PCB.',
    animationType: 'context-switch',
    keyTakeaways: [
      'Context switch is pure computational overhead; the CPU performs no productive user work during a switch.',
      'Steps: Save registers/PC to Old PCB -> Update Old State -> Select New Process -> Load New PCB registers -> Flush/switch memory mappings -> Resume.',
      'Costs: Hardware register saves, Translation Lookaside Buffer (TLB) flush, and CPU L1/L2 cache pollution.',
    ],
    theorySections: [
      {
        heading: '1. Step-by-Step Context Switch Sequence',
        content:
          'When a hardware timer fires or a process blocks on I/O, the kernel scheduler executes a context switch:',
        bullets: [
          '1. Hardware Interrupt: Timer ticks, CPU enters kernel mode via interrupt vector.',
          '2. State Preservation: General purpose registers (RAX, RBX, etc.), stack pointer (RSP), and program counter (RIP) are pushed into the outgoing Process PCB.',
          '3. State Transition: Outgoing process state changes from RUNNING to READY or WAITING.',
          '4. Scheduler Invocation: Scheduler algorithm selects next process from Ready Queue.',
          '5. Memory Space Switch: Page table pointer register (e.g. `CR3` on x86) is updated to point to the incoming process page table.',
          '6. State Restoration: Incoming Process PCB registers and stack pointer are popped into CPU hardware.',
          '7. Execution Resumption: `iret` or `sysret` instruction resumes incoming process execution.',
        ],
      },
    ],
    industrialApplication: {
      company: 'Twitter / X & LinkedIn',
      industry: 'High-Concurrency Web Infrastructure',
      systemName: 'Linux CFS Context Switch Tuning in Web Servers',
      tagline: 'Minimizing context-switch overhead across 100,000 req/sec clusters',
      challenge:
        'Excessive context switching (> 150,000 switches/sec per core) was causing up to 25% of server CPU power to be wasted entirely on switching registers and flushing TLB caches.',
      solution:
        'Engineers migrated from multi-threaded blocking models to non-blocking epoll event loops (Node.js/Netty), pinning worker threads to specific CPU cores via thread affinity (`sched_setaffinity`).',
      architectureDetails: [
        'CPU Core Pinning prevents cross-core migration and preserves warm L1/L2 cache lines.',
        'Linux `sched_migration_cost_ns` tuning prevents premature task migration.',
      ],
      techStack: ['Linux CFS', 'epoll', 'sched_setaffinity', 'C++'],
      metrics: [
        { label: 'Wasted CPU Overhead', value: 'Reduced from 24% to 3.2%' },
        { label: 'Context Switches / Sec', value: 'Dropped 78%' },
      ],
    },
    examNotes: {
      frequentQuestions: [
        {
          question: 'Why is context switching considered pure overhead?',
          answer:
            'Because the CPU does not execute any useful user application code while saving and loading PCB registers and switching memory tables.',
        },
      ],
    },
  },

  {
    id: 'u2-schedulers-queues',
    unitId: 'unit-2',
    unitNumber: 2,
    unitTitle: 'UNIT-II: Processes, Threads, IPC & Scheduling Queues',
    title: 'Scheduling Queues & 3-Tier Schedulers',
    shortSummary: 'Classification of process queues (Job, Ready, Device) and the roles of Long-Term, Medium-Term (Swapper), and Short-Term (CPU Dispatcher) schedulers.',
    animationType: 'schedulers-queues',
    keyTakeaways: [
      'Scheduling Queues: Job Queue (all programs submitted), Ready Queue (residing in RAM waiting for CPU), Device Queue (waiting for specific I/O device).',
      'Long-Term Scheduler (Job Scheduler): Controls degree of multiprogramming; admits jobs from disk into RAM.',
      'Medium-Term Scheduler (Swapper): Handles swapping processes between RAM and secondary disk swap space.',
      'Short-Term Scheduler (CPU Scheduler): Runs at millisecond frequency; selects which ready process gets CPU execution.',
    ],
    theorySections: [
      {
        heading: '1. The Three Schedulers Compared',
        content:
          'Operating systems balance CPU and I/O utilization through a three-tier scheduling hierarchy:',
        bullets: [
          'Long-Term Scheduler (Job Scheduler): Invoked infrequently (seconds/minutes). Selects processes from pool on disk and loads them into RAM. Controls the Degree of Multiprogramming (number of processes in memory). Aims for a healthy mix of I/O-bound and CPU-bound processes.',
          'Medium-Term Scheduler (Swapper): Invoked when memory is overcommitted. Swaps out idle or blocked processes to disk swap partition to free up RAM, and swaps them back in when memory frees.',
          'Short-Term Scheduler (CPU Scheduler): Invoked very frequently (every 10-100 milliseconds). Selects a process from the Ready Queue and assigns it to a CPU core. Must be blazingly fast.',
        ],
        diagramAscii: `
[ Disks / Job Pool ] 
         |
         v (Long-Term Scheduler admits jobs)
+-------------------+ <============== (Medium-Term Swapper swaps in)
|    READY QUEUE    | 
+-------------------+ ==============> (Medium-Term Swapper swaps out to disk)
         |
         v (Short-Term Scheduler dispatches)
   [ CPU CORE ]
      /      \\
(I/O Block)  (Finished)
    /          \\
[Device Queue] [Terminated]
        `,
      },
    ],
    industrialApplication: {
      company: 'Spotify Technology S.A.',
      industry: 'Audio Streaming & Big Data Analytics',
      systemName: 'Apache Hadoop YARN & Linux Swapper Integration',
      tagline: 'Balancing real-time song recommendations with petabyte batch processing',
      challenge:
        'Running heavy 200-terabyte nightly data analytics jobs on the same cluster as real-time audio search APIs without causing memory out-of-memory crashes.',
      solution:
        'Spotify employs YARN Capacity Scheduler acting as a distributed Long-Term Scheduler, paired with Linux `vm.swappiness` medium-term memory throttling.',
      architectureDetails: [
        'Admission controller limits degree of multiprogramming during peak listening hours.',
        'Short-term CPU dispatchers use priority weights to guarantee user audio requests precede analytics.',
      ],
      techStack: ['Apache YARN', 'Hadoop', 'Linux Kernel CFS', 'Java'],
      metrics: [
        { label: 'Cluster Data Volume', value: '200+ Petabytes' },
        { label: 'Daily Jobs Managed', value: '50,000+ jobs' },
      ],
    },
    examNotes: {
      frequentQuestions: [
        {
          question: 'What is the primary role of the Long-Term Scheduler?',
          answer:
            'To control the Degree of Multiprogramming by admitting an optimal balance of CPU-bound and I/O-bound jobs from disk into ready memory.',
        },
      ],
    },
  },

  {
    id: 'u2-revision',
    unitId: 'unit-2',
    unitNumber: 2,
    unitTitle: 'UNIT-II: Processes, Threads, IPC & Scheduling Queues',
    title: 'Revised - Unit No. 2 (Quick Review & Exam Q&A)',
    shortSummary: 'High-yield revision sheet on process lifecycle, threads, PCB anatomy, IPC paradigms, and scheduling queue transitions.',
    animationType: 'unit-revision',
    keyTakeaways: [
      'Process: Active program with PCB, 5 states (New, Ready, Running, Waiting, Terminated).',
      'Thread: Lightweight execution unit; shares code/data/heap with peer threads.',
      'IPC: Shared Memory (fastest, zero-copy, mutex required) vs Message Passing (kernel buffer mediated).',
      'Context Switch: Pure overhead; saves/restores registers to PCB.',
      'Schedulers: Long-term (degree of multiprogramming), Medium-term (swapper), Short-term (CPU dispatcher).',
    ],
    theorySections: [
      {
        heading: 'Comprehensive Unit 2 Knowledge Checklist',
        content:
          'Crucial concepts frequently tested in university exams and tech company interviews:',
        bullets: [
          'State transitions: Ready -> Running (Scheduler Dispatch), Running -> Ready (Timer Interrupt), Running -> Waiting (I/O or Event Wait), Waiting -> Ready (I/O Complete).',
          'PCB Components: PID, PC, Registers, Scheduling Info, Memory Management (Page tables), Open Files.',
          'Multithreading models: 1:1 provides best true parallelism on modern multicore hardware.',
        ],
      },
    ],
    industrialApplication: {
      company: 'Microsoft Corporation',
      industry: 'Enterprise Software & Cloud',
      systemName: 'Windows NT Kernel Process & Thread Subsystems',
      tagline: 'Underlying process and thread scheduler running Windows 11 & Azure',
      challenge:
        'Ensuring interactive desktop responsiveness while background system services execute heavy updates and indexing.',
      solution:
        'Windows NT uses dynamic priority thread scheduling with thread priority boosting for GUI windows, thread pool work items, and Fiber user-mode scheduling.',
      architectureDetails: [
        'EPROCESS (Executive Process) and KPROCESS (Kernel Process) block structures.',
        'I/O completion ports (IOCP) provide scalable async I/O worker threads.',
      ],
      techStack: ['C', 'C++', 'Windows NT Kernel', 'x86-64 / ARM64'],
      metrics: [
        { label: 'Active OS Installs', value: '1.4 Billion+' },
        { label: 'Scheduling Levels', value: '32 Priority Levels (0-31)' },
      ],
    },
    examNotes: {
      frequentQuestions: [
        {
          question: 'What is the difference between a context switch between threads vs processes?',
          answer:
            'A thread context switch only changes CPU registers and stack pointer while retaining the same virtual address space and page tables. A process context switch must also swap page tables (CR3 register) and flush or invalidate the TLB, which is significantly more expensive.',
        },
      ],
    },
  },

  // ==========================================
  // UNIT III: CPU SCHEDULING & DEADLOCKS
  // ==========================================
  {
    id: 'u3-scheduling-criteria',
    unitId: 'unit-3',
    unitNumber: 3,
    unitTitle: 'UNIT-III: CPU Scheduling Algorithms & Deadlocks',
    title: 'Scheduling: Concept, Criteria & Preemption',
    shortSummary: 'Mathematical evaluation criteria for CPU algorithms and fundamental differences between Pre-emptive and Non-pre-emptive scheduling.',
    animationType: 'cpu-scheduling',
    keyTakeaways: [
      'Scheduling Criteria: CPU Utilization, Throughput, Turnaround Time (TAT), Waiting Time (WT), and Response Time (RT).',
      'Turnaround Time (TAT) = Completion Time - Arrival Time.',
      'Waiting Time (WT) = Turnaround Time - Burst Time.',
      'Non-Preemptive: Once CPU is assigned, process holds it until it terminates or requests I/O.',
      'Preemptive: Process can be interrupted and moved back to Ready queue by a higher-priority task or timer tick.',
    ],
    theorySections: [
      {
        heading: '1. Five Mathematical Scheduling Criteria',
        content:
          'Different algorithms optimize for different metrics. System designers select algorithms based on which criteria are most critical for the workload.',
        bullets: [
          'CPU Utilization: Percentage of time the CPU is doing useful work (Target: 40% to 90%).',
          'Throughput: Number of processes completed per unit of time (Target: Maximize).',
          'Turnaround Time (TAT): Total interval from process submission to completion. (TAT = CT - AT) (Target: Minimize).',
          'Waiting Time (WT): Total amount of time a process spends waiting in the Ready queue. (WT = TAT - BT) (Target: Minimize).',
          'Response Time (RT): Time from submission until the first response is produced. Essential in interactive systems. (Target: Minimize).',
        ],
      },
      {
        heading: '2. Pre-emptive vs Non-Pre-emptive Scheduling',
        content:
          'Scheduling decisions occur under four circumstances: 1. Process switches from Running to Waiting (I/O). 2. Process switches from Running to Ready (timer interrupt). 3. Process switches from Waiting to Ready (I/O finished). 4. Process terminates.',
        bullets: [
          'Non-Preemptive: Scheduling takes place only under conditions 1 and 4. Simple, low context switch overhead, but poor response times for short tasks.',
          'Preemptive: Scheduling takes place under all four conditions. Provides responsive interactive systems, but incurs context switch overhead and requires synchronization for shared data.',
        ],
      },
    ],
    industrialApplication: {
      company: 'Apple Inc. & WebKit',
      industry: 'Browser Engines & Interactive UI',
      systemName: 'WebKit Browser Thread Cooperative & Preemptive Scheduler',
      tagline: 'Maintaining 60/120 FPS web scrolling during heavy JavaScript evaluation',
      challenge:
        'A heavy JavaScript task running on the browser main thread would lock up user touch events and scrolling if scheduled non-preemptively.',
      solution:
        'WebKit splits browser tasks into cooperative micro-tasks and preemptive frame-budgeted tasks, yielding to the compositor thread every 8.3ms.',
      architectureDetails: [
        'Cooperative cooperative micro-task scheduling via JavaScript event loop.',
        'Preemptive compositor thread runs on isolated high-priority OS thread.',
      ],
      techStack: ['C++', 'WebKit', 'WebAssembly', 'POSIX Threads'],
      metrics: [
        { label: 'Frame Budget', value: '8.33 ms (120Hz ProMotion)' },
        { label: 'Touch Input Latency', value: '< 12 ms' },
      ],
    },
    examNotes: {
      criticalFormulasOrRules: [
        'Turnaround Time (TAT) = Completion Time (CT) - Arrival Time (AT)',
        'Waiting Time (WT) = Turnaround Time (TAT) - Burst Time (BT)',
        'Average Waiting Time = (Sum of all WT) / Number of Processes',
      ],
      frequentQuestions: [
        {
          question: 'What is the Convoy Effect in CPU Scheduling?',
          answer:
            'A phenomenon where short processes wait behind a long, CPU-heavy process in the Ready queue (typical in FCFS), leading to lower CPU and device utilization.',
        },
      ],
    },
  },

  {
    id: 'u3-fcfs-sjf',
    unitId: 'unit-3',
    unitNumber: 3,
    unitTitle: 'UNIT-III: CPU Scheduling Algorithms & Deadlocks',
    title: 'FCFS, Non-Preemptive SJF & Preemptive SJF (SRTF)',
    shortSummary: 'First-Come First-Served vs Shortest Job First non-preemptive and preemptive (Shortest Remaining Time First) with Gantt chart step execution.',
    animationType: 'cpu-scheduling',
    keyTakeaways: [
      'FCFS (First-Come, First-Served): Simple FIFO queue; non-preemptive; suffers from Convoy Effect and high average waiting time.',
      'Non-Preemptive SJF: Allocates CPU to process with shortest CPU burst time; mathematically optimal for minimizing average waiting time when burst times are known.',
      'Preemptive SJF (SRTF): If a newly arrived process has a burst time shorter than the remaining time of the currently running process, it preempts the running process.',
      'Limitation of SJF: Cannot be implemented directly in general-purpose OS because future CPU burst lengths cannot be known in advance (must be predicted via exponential smoothing).',
    ],
    theorySections: [
      {
        heading: '1. FCFS and the Convoy Effect',
        content:
          'Processes are dispatched strictly in order of arrival. If a large process (Burst = 30) arrives first, smaller processes (Burst = 2) must wait 30 units of time. Average waiting time skyrockets.',
        diagramAscii: `
FCFS GANTT CHART:
|==================== P1 (Burst: 24) ====================|== P2 (3) ==|== P3 (3) ==|
0                                                        24           27           30
Avg Waiting Time = (0 + 24 + 27) / 3 = 17.0 ms
        `,
      },
      {
        heading: '2. SJF & Shortest Remaining Time First (SRTF)',
        content:
          'SJF is proven optimal: it gives the minimum average waiting time for a given set of processes.',
        bullets: [
          'Non-Preemptive SJF: Once a process starts running, it cannot be interrupted even if a shorter job arrives.',
          'Preemptive SJF (SRTF): At every new arrival, the scheduler compares `remaining_time(current_process)` with `burst_time(new_process)`. If new is shorter, preemption occurs.',
        ],
        diagramAscii: `
SRTF GANTT CHART (P1 arrives at 0, P2 arrives at 2 with shorter burst):
|== P1 ==|=========== P2 (Burst: 4) ===========|========= P1 (Remaining) =========|
0        2                                     6                                   12
        `,
      },
    ],
    industrialApplication: {
      company: 'Boeing & Aerospace Flight Control',
      industry: 'Avionics & Real-Time Flight Management',
      systemName: 'Flight Surface Actuator Scheduler (SRTF variants)',
      tagline: 'Prioritizing emergency aerodynamic sensor corrections within 2ms',
      challenge:
        'Sensor alerts (wind shear, stall warnings) arrive intermittently and must preempt routine telemetry logging immediately to prevent aerodynamic destabilization.',
      solution:
        'Avionics processors utilize Shortest Remaining Time First combined with Rate-Monotonic guarantees to preempt flight-recorder tasks instantly when high-priority short flight control bursts arrive.',
      architectureDetails: [
        'Preemption occurs in hardware in under 5 microseconds.',
        'Worst-Case Execution Time (WCET) pre-calculated mathematically.',
      ],
      techStack: ['Ada', 'C', 'ARINC 653 Avionics Standard', 'PowerPC'],
      metrics: [
        { label: 'Preemption Latency', value: '< 4.5 µs' },
        { label: 'Flight Control Loop', value: '250 Hz (4ms deadline)' },
      ],
    },
    examNotes: {
      frequentQuestions: [
        {
          question: 'Why is SJF scheduling considered optimal, and why can it not be implemented in practice?',
          answer:
            'SJF is optimal because it minimizes average waiting time by scheduling shorter jobs first. It cannot be implemented directly in general-purpose OS because the kernel cannot know the exact next CPU burst duration in advance.',
        },
      ],
    },
  },

  {
    id: 'u3-round-robin-priority',
    unitId: 'unit-3',
    unitNumber: 3,
    unitTitle: 'UNIT-III: CPU Scheduling Algorithms & Deadlocks',
    title: 'Round Robin (RR) & Priority Scheduling',
    shortSummary: 'Time-sharing through Round Robin time quantums and Priority Scheduling with Aging solutions to prevent process starvation.',
    animationType: 'cpu-scheduling',
    keyTakeaways: [
      'Round Robin (RR): Preemptive algorithm designed for time-sharing; each process gets a small unit of CPU time (time quantum, typically 10-100ms).',
      'Quantum Size Trade-off: If quantum is too large, RR degenerates to FCFS; if quantum is too small, context switch overhead dominates CPU execution.',
      'Priority Scheduling: A priority number is associated with each process; highest priority gets CPU.',
      'Starvation (Indefinite Blocking): Low priority jobs may never run; solved by AGING (gradually increasing priority of waiting processes).',
    ],
    theorySections: [
      {
        heading: '1. Round Robin & Time Quantum Optimization',
        content:
          'In Round Robin, the ready queue is treated as a circular FIFO queue. When the time quantum expires, a timer interrupt forces a context switch and the running process is placed at the tail of the ready queue.',
        bullets: [
          'Rule of thumb: 80% of CPU bursts should be shorter than the time quantum.',
          'Provides excellent response time for interactive users.',
        ],
        diagramAscii: `
Round Robin (Quantum = 4ms):
Ready Queue: [P2, P3]
CPU: |=== P1 (4ms) ===| (P1 slice expires -> P1 placed at queue tail)
New Ready Queue: [P3, P1]
CPU: |=== P2 (4ms) ===|
        `,
      },
      {
        heading: '2. Priority Scheduling & Starvation Mitigation',
        content:
          'Priority can be defined internally (memory limits, open files, ratio of I/O burst to CPU burst) or externally (importance, user tier).',
        bullets: [
          'Problem: Low priority processes can wait indefinitely in a heavily loaded system (Starvation). A famous MIT IBM 7094 was shut down in 1973 with a process submitted in 1967 that had never run!',
          'Solution: Aging - as time passes, the OS periodically increments the priority integer of waiting processes until they reach top priority.',
        ],
      },
    ],
    industrialApplication: {
      company: 'Linux Foundation / Linus Torvalds',
      industry: 'Open Source Operating Systems',
      systemName: 'Linux Completely Fair Scheduler (CFS)',
      tagline: 'Balancing priority weights and fairness using Red-Black trees',
      challenge:
        'Scheduling thousands of competing desktop, server, audio, and background tasks fairly without fixed time quantum thrashing.',
      solution:
        'Linux CFS tracks virtual runtime (`vruntime`) for each task in a time-ordered Red-Black tree (`rb_node`). The task that has run the least (`min_vruntime`) is always scheduled next. Process nice values (-20 to +19) act as geometric priority weights.',
      architectureDetails: [
        'O(log N) scheduling complexity via balanced Red-Black tree.',
        'High-priority tasks accumulate `vruntime` slower, receiving proportionally more CPU time.',
      ],
      techStack: ['Linux Kernel', 'C', 'Red-Black Tree', 'sched/fair.c'],
      codeOrConfigSnippet: {
        language: 'c',
        title: 'Linux CFS priority weight mapping table',
        code: `// Linux kernel priority weight table (linux/kernel/sched/core.c)
const int sched_prio_to_weight[40] = {
 /* -20 */     88761,     71755,     56483,     46273,
 /* -10 */      9548,      7620,      6100,      4904,
 /*   0 */      1024,       820,       655,       526, // Default priority (nice 0)
 /*  10 */       110,        87,        70,        56,
 /*  19 */        15
};`,
      },
      metrics: [
        { label: 'Time Complexity', value: 'O(log N) selection' },
        { label: 'CFS Granularity', value: '0.75 ms minimum' },
        { label: 'Global Servers Running CFS', value: '85%+' },
      ],
    },
    examNotes: {
      frequentQuestions: [
        {
          question: 'What happens to Round Robin if the time quantum is extremely large or extremely small?',
          answer:
            'If the quantum is extremely large (infinite), Round Robin behaves identically to First-Come First-Served (FCFS). If the quantum is extremely small, the system suffers severe context switch thrashing and CPU performance collapses.',
        },
        {
          question: 'What is Aging in Priority Scheduling?',
          answer:
            'A technique of gradually increasing the priority of processes that wait in the system for a long time to prevent starvation/indefinite blocking.',
        },
      ],
    },
  },

  {
    id: 'u3-deadlocks-concept',
    unitId: 'unit-3',
    unitNumber: 3,
    unitTitle: 'UNIT-III: CPU Scheduling Algorithms & Deadlocks',
    title: 'Deadlocks: Concept & 4 Necessary Conditions',
    shortSummary: 'A deadlock occurs when every process in a set is waiting for an event that can only be caused by another process in the set.',
    animationType: 'deadlock-rag',
    keyTakeaways: [
      'Deadlock definition: A state where two or more processes are blocked forever because each is holding a resource and waiting for another held resource.',
      'Coffman Conditions (All 4 must hold simultaneously for a deadlock to exist):',
      '1. Mutual Exclusion: At least one resource must be held in a non-shareable mode.',
      '2. Hold and Wait: A process must be holding at least one resource and waiting to acquire additional resources held by other processes.',
      '3. No Preemption: Resources cannot be forcibly taken away; they can only be released voluntarily by the holding process.',
      '4. Circular Wait: A closed chain of processes exists such that each process holds at least one resource needed by the next process in the chain.',
    ],
    theorySections: [
      {
        heading: '1. The 4 Coffman Conditions',
        content:
          'In 1971, Edward G. Coffman Jr. proved that a deadlock can arise if and only if all four conditions hold simultaneously:',
        bullets: [
          'Mutual Exclusion: Exclusive lock on a printer, tape drive, or database record.',
          'Hold and Wait: Process P1 holds Resource R1 and requests R2; P1 does not release R1 while waiting.',
          'No Preemption: The OS cannot snatch R1 from P1; P1 must call `release()` voluntarily.',
          'Circular Wait: P0 waits for P1, P1 waits for P2, ..., Pn waits for P0.',
        ],
        diagramAscii: `
CIRCULAR WAIT DEADLOCK GRAPH:
     +---------> [ Resource R1 ] ----------+
     |                 ^                   |
     | (Allocated to)  | (Requested by)    | (Allocated to)
     |                 |                   v
[ Process P2 ]         |              [ Process P1 ]
     ^                 |                   |
     | (Requested by)  +-------------------+ (Requested by)
     |                                     |
     +--------- [ Resource R2 ] <---------+
        `,
      },
    ],
    industrialApplication: {
      company: 'PostgreSQL Global Development Group',
      industry: 'Relational Database Management Systems (RDBMS)',
      systemName: 'PostgreSQL Lock Manager & Deadlock Detector',
      tagline: 'Detecting and resolving transaction deadlocks across enterprise financial tables',
      challenge:
        'When Transaction A updates Bank Account 1 and attempts to update Account 2, while Transaction B does the reverse, both transactions freeze in an infinite circular wait.',
      solution:
        'PostgreSQL maintains an in-memory Resource Allocation Graph. A background deadlock detector timer (`deadlock_timeout = 1000ms`) wakes up, detects cycles using Tarjan algorithm, and aborts one transaction with error `40P01 (deadlock_detected)`.',
      architectureDetails: [
        'Two-phase locking protocol (2PL) for ACID compliance.',
        'Wait-for graph cycle detection runs asynchronously on timer expiration.',
      ],
      techStack: ['C', 'PostgreSQL Lock Manager', 'Tarjan Cycle Detection'],
      metrics: [
        { label: 'Deadlock Detection Delay', value: '1,000 ms default' },
        { label: 'Transaction Rollback Time', value: '< 2 ms' },
      ],
    },
    examNotes: {
      frequentQuestions: [
        {
          question: 'Can a deadlock occur if only 3 of the 4 Coffman conditions hold?',
          answer:
            'No. A deadlock can arise if and only if ALL four conditions (Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait) hold simultaneously in the system.',
        },
      ],
    },
  },

  {
    id: 'u3-deadlock-strategies',
    unitId: 'unit-3',
    unitNumber: 3,
    unitTitle: 'UNIT-III: CPU Scheduling Algorithms & Deadlocks',
    title: 'Deadlock Strategies: Prevention, Avoidance, Detection & Recovery',
    shortSummary: 'Comprehensive strategies to deal with deadlocks: Prevention (breaking conditions), Avoidance (Banker algorithm), Detection (Wait-For graphs), and Recovery.',
    animationType: 'bankers-algorithm',
    keyTakeaways: [
      'Four fundamental handling strategies: 1. Ostrich Algorithm (ignore). 2. Deadlock Prevention (design system so 1 of 4 conditions cannot hold). 3. Deadlock Avoidance (dynamically check for safe states, Banker\'s Algorithm). 4. Deadlock Detection & Recovery.',
      'Banker\'s Algorithm: Avoidance algorithm for multiple instances of resources; checks if granting a request leaves the system in a SAFE STATE where every process can eventually finish.',
      'Data Structures in Banker\'s: Available Vector, Max Matrix, Allocation Matrix, Need Matrix (Need = Max - Allocation).',
    ],
    theorySections: [
      {
        heading: '1. Four Deadlock Handling Strategies',
        content:
          'Operating systems select strategies based on performance vs safety trade-offs:',
        bullets: [
          'Deadlock Ignorance (Ostrich Algorithm): Pretend deadlocks never occur. Used by Linux and Windows for general processes because full prevention/avoidance overhead is too high. Reboot or kill frozen processes manually.',
          'Deadlock Prevention: Constrain resource requests by invalidating one condition: Eliminate Circular Wait by imposing a strict total numerical ordering on all resources (`F(R)`). Processes can only request resources in increasing numerical order.',
          'Deadlock Avoidance: System possesses a priori knowledge of maximum resources each process will need. Dynamically allocates resources only if system remains in a SAFE state.',
          'Deadlock Detection & Recovery: Allow deadlocks to occur, detect cycles in Resource Allocation Graphs, and recover by either terminating processes or preempting resources.',
        ],
      },
      {
        heading: '2. Banker\'s Algorithm for Deadlock Avoidance',
        content:
          'Developed by Edsger Dijkstra. Formulated around a small-town banker who allocates cash credit lines to customers.',
        bullets: [
          'Safety Algorithm: Finds whether there exists a safe execution sequence `<P1, P2, ..., Pn>` such that each process can satisfy its maximum need with current available resources plus resources released by previously finished processes.',
          'Need Matrix Formula: `Need[i][j] = Max[i][j] - Allocation[i][j]`.',
        ],
      },
    ],
    industrialApplication: {
      company: 'Oracle Corporation',
      industry: 'Enterprise Database & Cloud Infrastructure',
      systemName: 'Oracle Database Row-Level Enqueue & Deadlock Recovery',
      tagline: 'Automated statement rollback and deadlock recovery in Oracle RAC',
      challenge:
        'Thousands of concurrent distributed financial transactions updating row-level table locks simultaneously without freezing the bank transaction engine.',
      solution:
        'Oracle implements automated Deadlock Detection via Wait-For Graphs. When a circular wait cycle is detected, Oracle picks the transaction that has performed the least work as the "victim" and issues an automated statement rollback (`ORA-00060`).',
      architectureDetails: [
        'Enqueue lock architecture with Shared (S) and Exclusive (X) modes.',
        'Victim selection prioritizes saving long-running batch transactions.',
      ],
      techStack: ['C', 'Oracle Kernel', 'Distributed Wait-for Graphs'],
      metrics: [
        { label: 'Transactions / Sec', value: '500,000 TPS' },
        { label: 'Deadlock Detection Speed', value: '< 500 ms' },
      ],
    },
    examNotes: {
      criticalFormulasOrRules: [
        'Need Matrix: Need[i][j] = Max[i][j] - Allocation[i][j]',
        'Condition to grant request: Request <= Need AND Request <= Available',
        'If safe sequence exists -> SAFE STATE (No deadlock possible)',
      ],
      frequentQuestions: [
        {
          question: 'How does Resource Ordering prevent Deadlocks?',
          answer:
            'By assigning a unique integer index to every resource and requiring that processes request resources strictly in increasing numerical order, Circular Wait becomes mathematically impossible.',
        },
      ],
    },
  },

  {
    id: 'u3-revision',
    unitId: 'unit-3',
    unitNumber: 3,
    unitTitle: 'UNIT-III: CPU Scheduling Algorithms & Deadlocks',
    title: 'Revised - Unit No. 3 (Quick Review & Exam Q&A)',
    shortSummary: 'High-yield revision sheet on CPU scheduling algorithms, Gantt chart calculations, deadlock conditions, and Banker algorithm matrices.',
    animationType: 'unit-revision',
    keyTakeaways: [
      'Scheduling Algorithms: FCFS (Convoy effect), SJF (optimal waiting time), SRTF (preemptive SJF), Round Robin (quantum trade-off), Priority (aging prevents starvation).',
      'Turnaround Time = Completion - Arrival; Waiting Time = Turnaround - Burst.',
      'Deadlock 4 Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.',
      'Banker\'s Algorithm: Need = Max - Allocation; verifies safe execution sequence.',
    ],
    theorySections: [
      {
        heading: 'Algorithm Comparison Cheat-Sheet',
        content:
          'Quick reference for exam problems:',
        bullets: [
          'FCFS: Non-preemptive. High average waiting time. Poor for short jobs.',
          'SJF: Optimal average waiting time. Can cause starvation for long jobs.',
          'SRTF: Preemptive SJF. Minimum waiting time. Higher context switch count.',
          'Round Robin: Preemptive. Responsive for interactive time-sharing. Quantum size critical.',
          'Priority: Preemptive or Non-preemptive. Needs Aging to prevent starvation.',
        ],
      },
    ],
    industrialApplication: {
      company: 'NVIDIA Corporation',
      industry: 'GPU Computing & AI Infrastructure',
      systemName: 'CUDA Warp Scheduler & GPU Thread Dispatch',
      tagline: 'Scheduling 100,000+ parallel AI tensor threads with zero context switch latency',
      challenge:
        'Modern GPUs execute thousands of threads concurrently. CPU-style context switching would melt GPU interconnects with latency.',
      solution:
        'NVIDIA GPUs use hardware Warp Schedulers that switch between 32-thread warps in a single clock cycle if one warp stalls on high-bandwidth memory (HBM) fetch.',
      architectureDetails: [
        'Hardware-level warp scheduling with zero software OS overhead.',
        'Simultaneous multithreading hides 200-cycle memory latency.',
      ],
      techStack: ['NVIDIA CUDA', 'Hardware Warp Scheduler', 'TensorRT'],
      metrics: [
        { label: 'Active Warps / SM', value: '64 Warps' },
        { label: 'Switch Overhead', value: '0 Clock Cycles (Hardware)' },
      ],
    },
    examNotes: {
      frequentQuestions: [
        {
          question: 'What is the Ostrich Algorithm and why do popular OSes use it?',
          answer:
            'The Ostrich Algorithm involves ignoring the deadlock problem completely and assuming it occurs rarely. Operating systems like Linux and Windows adopt it because the performance overhead of continuously running deadlock avoidance (Banker\'s) on every memory/lock request is far too high for general computing.',
        },
      ],
    },
  },

  // ==========================================
  // UNIT IV: MEMORY MANAGEMENT & VIRTUAL MEMORY
  // ==========================================
  {
    id: 'u4-memory-requirements',
    unitId: 'unit-4',
    unitNumber: 4,
    unitTitle: 'UNIT-IV: Memory Management, Paging & Virtual Memory',
    title: 'Main Memory Management Requirements & Partitioning',
    shortSummary: 'Memory requirements (Relocation, Protection, Sharing, Organization) and static vs dynamic partitioning techniques with First, Best, and Worst fit.',
    animationType: 'memory-partitioning',
    keyTakeaways: [
      'Core Memory Requirements: Relocation (code can execute at any physical address), Protection (processes cannot access other processes memory), Sharing (shared libraries in RAM), Logical & Physical Organization.',
      'Static (Fixed) Partitioning: RAM divided into fixed size partitions at boot; leads to INTERNAL FRAGMENTATION.',
      'Dynamic (Variable) Partitioning: Partitions created dynamically based on exact process request size; leads to EXTERNAL FRAGMENTATION.',
      'Dynamic Allocation Algorithms: First Fit (fastest), Best Fit (smallest hole, leaves tiny useless fragments), Worst Fit (largest hole).',
      'External Fragmentation is solved by COMPACTION (relocating active processes to one end of memory).',
    ],
    theorySections: [
      {
        heading: '1. Memory Management Requirements',
        content:
          'The OS must fulfill five architectural memory requirements:',
        bullets: [
          'Relocation: The programmer does not know which physical address the program will occupy at runtime. Memory references must be translated dynamically.',
          'Protection: Hardware Base and Limit registers prevent process A from writing into the memory of process B or the OS kernel.',
          'Sharing: Controlled access allowing multiple processes to share common read-only code (e.g., standard C library `libc`).',
          'Logical Organization: Memory presented as linear arrays of bytes or structured modules/segments.',
          'Physical Organization: Flow of information between fast, volatile main RAM and slow, non-volatile secondary storage.',
        ],
      },
      {
        heading: '2. Static vs Dynamic Partitioning & Fragmentation',
        content:
          'Memory allocation strategies evolved from simple partitioning:',
        bullets: [
          'Internal Fragmentation: Allocated memory block is larger than requested memory. The wasted space is INSIDE the partition (characteristic of Fixed Partitioning and Paging).',
          'External Fragmentation: Total free memory space is adequate to satisfy a request, but the space is fragmented into small, non-contiguous holes (characteristic of Dynamic Partitioning and Segmentation).',
          'Compaction: Moving all occupied partitions to one end of RAM to combine all free fragments into one large contiguous block. Requires dynamic relocation hardware.',
        ],
        diagramAscii: `
DYNAMIC PARTITIONING (Holes & Fragmentation):
+------------------------------------------------------------------------+
| P1 (20MB) | FREE (5MB) | P2 (30MB) | FREE (8MB) | P3 (15MB) | FREE (2MB)|
+------------------------------------------------------------------------+
Total Free = 15MB, but a 10MB process cannot be loaded! (EXTERNAL FRAGMENTATION)
        `,
      },
    ],
    industrialApplication: {
      company: 'Redis Ltd.',
      industry: 'In-Memory Data Structures & Caching',
      systemName: 'Redis Jemalloc Memory Allocator',
      tagline: 'Eliminating memory fragmentation across multi-gigabyte in-memory caches',
      challenge:
        'Standard glibc `malloc()` in Linux produced severe external memory fragmentation in Redis over weeks of high-churn cache writes, consuming 40GB RAM for 20GB of actual cache keys.',
      solution:
        'Redis integrated Facebook\'s `jemalloc` memory allocator. `jemalloc` allocates memory using standardized size classes and thread-local allocation caches (tcache), reducing fragmentation to near zero.',
      architectureDetails: [
        'Memory categorized into Small, Large, and Huge size classes.',
        'Thread-local arenas prevent cross-thread lock contention.',
        'Active background defragmentation reallocates memory without stopping Redis reads.',
      ],
      techStack: ['C', 'jemalloc', 'Redis In-Memory Engine'],
      metrics: [
        { label: 'Fragmentation Ratio', value: 'Dropped from 2.1x to 1.08x' },
        { label: 'Throughput', value: '1,000,000 ops/sec' },
      ],
    },
    examNotes: {
      keyDifferences: [
        {
          feature: 'Location of Wasted RAM',
          itemA: 'Internal Fragmentation: Inside allocated block (Process asked for 24KB, partition was 32KB -> 8KB wasted)',
          itemB: 'External Fragmentation: Outside allocated blocks (Holes scattered across RAM cannot form one contiguous block)',
          difference: 'Paging eliminates external fragmentation; segmentation eliminates internal fragmentation.',
        },
      ],
      frequentQuestions: [
        {
          question: 'Which allocation algorithm is fastest: First Fit, Best Fit, or Worst Fit?',
          answer:
            'First Fit is typically the fastest because it searches from the beginning of the free memory list and stops immediately at the first hole large enough to satisfy the request.',
        },
      ],
    },
  },

  {
    id: 'u4-paging-tables',
    unitId: 'unit-4',
    unitNumber: 4,
    unitTitle: 'UNIT-IV: Memory Management, Paging & Virtual Memory',
    title: 'Paging: Concept, Page Table Structure & Address Translation',
    shortSummary: 'Non-contiguous memory allocation dividing logical address space into fixed-size Pages and physical RAM into Frames, translated via Page Tables and TLB.',
    animationType: 'paging-translation',
    keyTakeaways: [
      'Paging eliminates external fragmentation by allowing a process\'s physical memory to be non-contiguous.',
      'Logical Address space divided into fixed-size PAGES; Physical RAM divided into identical-size FRAMES (typically 4 KB).',
      'Address Translation: Logical Address = [ Page Number (p) | Offset (d) ].',
      'Physical Address = [ Frame Number (f) | Offset (d) ] where f = PageTable[p].',
      'Translation Lookaside Buffer (TLB): High-speed associative hardware cache storing recently translated page-to-frame entries.',
    ],
    theorySections: [
      {
        heading: '1. Paging Architecture & Mathematical Translation',
        content:
          'If the logical address space is 2^m bytes and page size is 2^n bytes, then the high-order (m - n) bits designate the Page Number (p), and the low-order n bits designate the Page Offset (d).',
        diagramAscii: `
LOGICAL ADDRESS:
+-----------------------------------+---------------------------+
|      Page Number (p)              |        Offset (d)         |
+-----------------------------------+---------------------------+
                 |                                     |
                 v                                     |
         +---------------+                             |
         |  PAGE TABLE   |                             |
         |  p -> Frame f |                             |
         +---------------+                             |
                 |                                     |
                 v                                     v
PHYSICAL ADDRESS:
+-----------------------------------+---------------------------+
|      Frame Number (f)             |        Offset (d)         |
+-----------------------------------+---------------------------+
                 |                                     |
                 +==================+==================+
                                    v
                         [ PHYSICAL RAM LOCATION ]
        `,
      },
      {
        heading: '2. Translation Lookaside Buffer (TLB)',
        content:
          'Looking up a page table entry in RAM doubles the memory access time (1 access for page table, 1 access for actual data). The TLB solves this by caching page table entries in hardware.',
        bullets: [
          'TLB Hit: Frame number obtained in ~1 nanosecond; data retrieved immediately.',
          'TLB Miss: Page table read from RAM; frame loaded into TLB for future hits.',
          'Effective Memory Access Time (EMAT): `EMAT = HitRate * (TLB_time + RAM_time) + (1 - HitRate) * (TLB_time + 2 * RAM_time)`.',
        ],
      },
    ],
    industrialApplication: {
      company: 'Intel Corporation & AMD',
      industry: 'Microprocessor Architecture & Silicon Design',
      systemName: 'x86-64 4-Level Paging (PML4) & 5-Level Paging (PML5)',
      tagline: 'Translating 64-bit virtual memory addresses in modern CPU silicon',
      challenge:
        'A flat page table for a 64-bit computer would require millions of gigabytes of RAM just to store the page table itself!',
      solution:
        'Intel designed 4-Level hierarchical paging: Page Map Level 4 (PML4) -> Page Directory Pointer (PDP) -> Page Directory (PD) -> Page Table (PT), caching hot mappings in L1/L2 TLBs with 2MB/1GB HugePages.',
      architectureDetails: [
        'Hardware Memory Management Unit (MMU) performs 4-level page table walks automatically.',
        'CR3 control register holds physical pointer to top-level PML4 table.',
      ],
      techStack: ['x86-64 Architecture', 'MMU', 'PML4 / PML5', 'Hardware TLB'],
      metrics: [
        { label: 'Virtual Address Space', value: '128 Terabytes (48-bit)' },
        { label: 'TLB Hit Rate', value: '98.5% - 99.8%' },
        { label: 'HugePage Speedup', value: '+18% Database throughput' },
      ],
    },
    examNotes: {
      criticalFormulasOrRules: [
        'Logical Address Size = 2^m; Page Size = 2^n bytes',
        'Number of Pages = 2^(m - n); Page Offset bits = n',
        'Physical Address = (Frame Number * Frame Size) + Offset',
        'EMAT = h * (t_tlb + t_mem) + (1 - h) * (t_tlb + 2 * t_mem)',
      ],
      frequentQuestions: [
        {
          question: 'Why does Paging suffer from Internal Fragmentation but not External Fragmentation?',
          answer:
            'Paging eliminates external fragmentation because any free frame can be allocated to any process regardless of physical location. It suffers from internal fragmentation only on the final page of a process if the process memory requirement is not an exact multiple of the page size.',
        },
      ],
    },
  },

  {
    id: 'u4-virtual-memory-demand-paging',
    unitId: 'unit-4',
    unitNumber: 4,
    unitTitle: 'UNIT-IV: Memory Management, Paging & Virtual Memory',
    title: 'Virtual Memory & Demand Paging',
    shortSummary: 'Separation of user logical memory from physical memory allowing execution of processes larger than physical RAM via Demand Paging and Page Fault handling.',
    animationType: 'virtual-memory-page-fault',
    keyTakeaways: [
      'Virtual memory allows the execution of processes that are not completely in main RAM.',
      'Benefits: Programs can exceed physical RAM size, more processes can be accommodated in memory (higher multiprogramming), less I/O needed to load/swap programs.',
      'Demand Paging: Pages are loaded into RAM only when demanded during execution ("lazy swapper").',
      'Page Fault: A hardware trap raised by the MMU when a process attempts to access a page marked invalid (not currently in RAM).',
    ],
    theorySections: [
      {
        heading: '1. The 6-Step Page Fault Handling Pipeline',
        content:
          'When an instruction accesses an unmapped virtual address, the hardware triggers a Page Fault interrupt. The OS handles it through six deterministic steps:',
        bullets: [
          '1. Hardware Trap: MMU encounters Valid/Invalid bit = 0 in Page Table, generating an internal CPU interrupt.',
          '2. Trap Handler: OS checks internal PCB table to verify if the address reference is a legitimate memory location or an illegal segmentation violation.',
          '3. Free Frame Discovery: OS searches the free frame list for an empty physical RAM frame.',
          '4. Disk I/O Swap-In: OS schedules a disk read to copy the missing page from backing storage (swap partition) into the allocated frame.',
          '5. Page Table Update: OS sets the frame number in the Page Table and flips the Valid bit from 0 to 1.',
          '6. Instruction Restart: CPU program counter is rolled back and the instruction that caused the fault is re-executed seamlessly.',
        ],
        diagramAscii: `
[ CPU ] ---> (Access Page 3) ---> [ Page Table: Bit=0 ]
                                          |
   +--------------------------------------+ (1. Trap: Page Fault)
   v
[ OS Kernel Page Fault Handler ]
   |
   | (2. Locate page on disk)
   v
[ Backing Store / Swap Space ]
   |
   | (3. Read disk into physical frame)
   v
[ Physical Memory Frame ]
   |
   | (4. Set Page Table Bit=1)
   v
[ Restart Trapped Instruction ]
        `,
      },
    ],
    industrialApplication: {
      company: 'Valve Corporation & SteamOS',
      industry: 'Gaming & High-Performance Graphics',
      systemName: 'Linux zRAM & Compressed Swap in Steam Deck',
      tagline: 'Executing 16GB AAA games seamlessly on 16GB unified RAM architecture',
      challenge:
        'When gaming on the Steam Deck, high-resolution textures exceed physical RAM. Paging to slow flash storage causes micro-stutters and frame rate drops.',
      solution:
        'SteamOS utilizes `zRAM` virtual memory. Instead of paging out to NVMe/microSD disks, cold pages are compressed in-memory using the LZ4 algorithm into a compressed RAM block, achieving 3:1 compression with zero disk latency.',
      architectureDetails: [
        'zRAM creates a virtual block device in RAM with LZ4 hardware compression.',
        'Page faults resolved at memory bus speeds (microseconds instead of milliseconds).',
      ],
      techStack: ['Linux Kernel', 'zRAM', 'LZ4 Compression', 'SteamOS'],
      metrics: [
        { label: 'Virtual Memory Multiplier', value: '1.5x effective RAM' },
        { label: 'Page Fault Latency', value: '< 2.5 µs (vs 15ms disk)' },
      ],
    },
    examNotes: {
      frequentQuestions: [
        {
          question: 'What is Thrashing in Virtual Memory?',
          answer:
            'A pathological state where the system spends more time servicing page faults and swapping pages in and out than executing actual user code. Occurs when the sum of process working sets exceeds physical RAM.',
        },
      ],
    },
  },

  {
    id: 'u4-page-replacement',
    unitId: 'unit-4',
    unitNumber: 4,
    unitTitle: 'UNIT-IV: Memory Management, Paging & Virtual Memory',
    title: 'Page Replacement Algorithms: FIFO, LRU & Optimal',
    shortSummary: 'When no free frame is available during a page fault, page replacement algorithms select a victim frame: FIFO, Belady anomaly, LRU, and Optimal.',
    animationType: 'page-replacement',
    keyTakeaways: [
      'Page replacement is required when a page fault occurs and there are no free frames left in physical RAM.',
      'FIFO (First-In, First-Out): Replaces the oldest page; easy to implement with a queue; suffers from Belady\'s Anomaly.',
      'Belady\'s Anomaly: For some page replacement algorithms (like FIFO), the page fault rate may INCREASE as the number of allocated frames INCREASES.',
      'Optimal Page Replacement (OPT): Replaces the page that will not be used for the longest period of time in the future. Theoretical benchmark (cannot be implemented practically).',
      'LRU (Least Recently Used): Replaces the page that has not been used for the longest period in the past. High performance; stack algorithm (immune to Belady\'s Anomaly).',
    ],
    theorySections: [
      {
        heading: '1. Algorithm Mechanics Compared',
        content:
          'Evaluate each algorithm using the textbook reference string: `7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2` across 3 physical frames:',
        bullets: [
          'FIFO: Replaces the frame at the head of the queue. Generates 15 page faults.',
          'Optimal: Looks ahead into future references; replaces the page with the furthest future reference. Generates 9 page faults (minimum possible).',
          'LRU: Looks back into the past; replaces the page with the oldest access timestamp. Generates 12 page faults.',
        ],
      },
      {
        heading: '2. Belady\'s Anomaly Proof',
        content:
          'Belady demonstrated that with the reference string `1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5`: With 3 frames, FIFO yields 9 page faults. With 4 frames, FIFO yields 10 page faults! More memory produced MORE errors due to the queue rotation mismatching the access pattern.',
      },
    ],
    industrialApplication: {
      company: 'MySQL (Oracle) & InnoDB Engine',
      industry: 'Enterprise Relational Databases',
      systemName: 'InnoDB Buffer Pool Midpoint Insertion (LRU Variant)',
      tagline: 'Managing terabytes of active database pages in RAM',
      challenge:
        'A single full table scan (e.g. `SELECT * FROM orders`) would flush all hot customer data out of the database memory cache if pure LRU were used.',
      solution:
        'MySQL InnoDB splits its LRU list into "Young" (5/8) and "Old" (3/8) sub-lists. New pages are inserted at the midpoint boundary. Full-table scan pages are aged out of the Old list immediately without evicting hot pages from the Young list.',
      architectureDetails: [
        'Midpoint insertion policy buffers hot pages against scan pollution.',
        'Dirty pages flushed asynchronously by background page cleaner threads.',
      ],
      techStack: ['C++', 'MySQL InnoDB', 'Buffer Pool LRU'],
      metrics: [
        { label: 'Cache Hit Rate', value: '99.2%' },
        { label: 'Scan Eviction Resistance', value: '100% Hot Data Preserved' },
      ],
    },
    examNotes: {
      frequentQuestions: [
        {
          question: 'What is Belady\'s Anomaly and which algorithms are immune to it?',
          answer:
            'Belady\'s Anomaly is the counter-intuitive phenomenon where increasing the number of physical page frames results in an increased number of page faults. Stack algorithms (such as LRU and Optimal) are mathematically immune because the set of pages in an n-frame system is always a subset of pages in an (n+1)-frame system.',
        },
      ],
    },
  },

  {
    id: 'u4-segmentation-swapping-free-space',
    unitId: 'unit-4',
    unitNumber: 4,
    unitTitle: 'UNIT-IV: Memory Management, Paging & Virtual Memory',
    title: 'Segmentation, Swapping & Free Space Management',
    shortSummary: 'Memory segmentation reflecting programmer perspective (Base & Limit), Swapping mechanisms, and Free Space tracking via Bitmaps and Linked Lists.',
    animationType: 'segmentation-check',
    keyTakeaways: [
      'Segmentation: Memory-management scheme supporting user view of memory; program is a collection of logical segments (Code, Stack, Heap, Symbol Table).',
      'Logical Address = [ Segment Number (s) | Offset (d) ].',
      'Segment Table contains BASE (physical start address) and LIMIT (length of segment). If `d >= limit`, a hardware segmentation trap is thrown.',
      'Swapping: Temporarily moving a process from main memory to secondary backing store (Roll-out / Roll-in).',
      'Free Space Management: Bitmaps (bit vector where 0 = free, 1 = allocated) vs Linked Lists (nodes storing free block size and pointer to next free block).',
    ],
    theorySections: [
      {
        heading: '1. Segmentation Address Translation & Protection',
        content:
          'Unlike fixed-size paging, segmentation allows variable-sized blocks that match logical program structures.',
        bullets: [
          'Segment Table Entry: `<Limit, Base>`.',
          'Validation Step: Hardware comparator checks if `offset d < limit`. If false, CPU generates TRAP: Addressing Error (Segmentation Fault).',
          'Physical Address: `Physical_Address = Base + Offset (d)`.',
        ],
        diagramAscii: `
LOGICAL ADDRESS: [ Segment s | Offset d ]
                      |            |
                      v            v
            +---------------+   (d < limit ?)
            | SEGMENT TABLE |        |
            | s: Base, Limit| ======+======> NO: TRAP (Segmentation Fault)
            +---------------+        |
                    |                | YES
                    v                v
            [ Base Address ] + [ Offset d ] ===> [ PHYSICAL ADDRESS ]
        `,
      },
      {
        heading: '2. Free Space Techniques: Bitmap vs Linked List',
        content:
          'The OS tracks unallocated memory blocks using two primary structures:',
        bullets: [
          'Bitmap (Bit Vector): Each block represented by 1 bit (0 = free, 1 = occupied). Extremely compact; easily finds contiguous blocks via hardware bit-scan instructions (`tzcnt`).',
          'Linked List: Each free block contains a header pointing to the next free block. Merges adjacent free blocks during deallocation (Coalescing).',
        ],
      },
    ],
    industrialApplication: {
      company: 'Linux Kernel Organization',
      industry: 'Operating System Core Engineering',
      systemName: 'Linux Buddy Allocator & SLUB Free Space Manager',
      tagline: 'Managing physical RAM frames and kernel objects without fragmentation',
      challenge:
        'Allocating memory for millions of tiny kernel network packet buffers (`sk_buff`) without wasting 4KB frame pages or fragmenting physical RAM.',
      solution:
        'Linux pairs the Buddy Allocator (managing power-of-two page frames via free lists) with the SLUB allocator (carving frames into caches of identical object sizes).',
      architectureDetails: [
        'Buddy system splits 4MB blocks down to 4KB and coalesces buddies upon free.',
        'SLUB allocator caches kernel objects without metadata headers.',
      ],
      techStack: ['C', 'Linux mm/buddy.c', 'mm/slub.c'],
      metrics: [
        { label: 'Allocation Latency', value: '< 15 nanoseconds' },
        { label: 'External Fragmentation', value: '< 4%' },
      ],
    },
    examNotes: {
      frequentQuestions: [
        {
          question: 'What causes a Segmentation Fault in user programs?',
          answer:
            'A Segmentation Fault occurs when a program attempts to access an offset `d` that exceeds the `limit` register for that segment, or attempts to write to a segment marked read-only.',
        },
      ],
    },
  },

  {
    id: 'u4-revision',
    unitId: 'unit-4',
    unitNumber: 4,
    unitTitle: 'UNIT-IV: Memory Management, Paging & Virtual Memory',
    title: 'Revised - Unit No. 4 (Quick Review & Exam Q&A)',
    shortSummary: 'High-yield revision sheet on memory partitioning, address translation formulas, page replacement algorithms, and segmentation tables.',
    animationType: 'unit-revision',
    keyTakeaways: [
      'Partitioning: Fixed (internal fragmentation) vs Dynamic (external fragmentation, compaction).',
      'Paging: Logical (p, d) -> Physical (f, d); TLB accelerates translation.',
      'Page Faults: Trap -> Free frame -> Disk swap-in -> Page table update -> Restart instruction.',
      'Page Replacement: FIFO (Belady anomaly), LRU (stack algorithm, immune), Optimal (theoretical benchmark).',
      'Segmentation: Logical (s, d); checked against limit register; Base + d.',
    ],
    theorySections: [
      {
        heading: 'Unit 4 High-Yield Formula Sheet',
        content:
          'Keep these equations ready for semester calculations:',
        bullets: [
          'Effective Memory Access Time (EMAT): `h * (TLB + RAM) + (1-h) * (TLB + 2*RAM)`.',
          'Physical Address in Paging: `(Frame_Number * Page_Size) + Offset`.',
          'Physical Address in Segmentation: `Base + Offset` (only if `Offset < Limit`).',
          'Page Fault Service Overhead: `(1 - p) * Memory_Access + p * Disk_Fault_Time`.',
        ],
      },
    ],
    industrialApplication: {
      company: 'Microsoft Azure',
      industry: 'Hyper-Scale Cloud Infrastructure',
      systemName: 'Azure Hyper-V Second Level Address Translation (SLAT)',
      tagline: 'Hardware nested paging accelerating millions of virtual cloud machines',
      challenge:
        'Software shadow page tables for virtual machines introduced 30% performance penalties during virtual memory paging.',
      solution:
        'Hyper-V leverages Intel EPT (Extended Page Tables) / AMD RVI, allowing hardware CPU MMUs to translate Guest Virtual -> Guest Physical -> Host Physical addresses in silicon.',
      architectureDetails: [
        'Two-dimensional page table walk in hardware silicon.',
        'Zero hypervisor traps for guest OS page faults.',
      ],
      techStack: ['Hyper-V', 'Intel EPT / SLAT', 'C++'],
      metrics: [
        { label: 'Virtualization Overhead', value: 'Reduced from 28% to < 2%' },
        { label: 'VM Memory Density', value: '+40% VMs per host' },
      ],
    },
    examNotes: {
      frequentQuestions: [
        {
          question: 'What is the difference between Paging and Segmentation?',
          answer:
            'Paging divides memory into fixed-size physical blocks (transparent to programmer, no external fragmentation, causes internal fragmentation). Segmentation divides memory into variable-sized logical units (user-visible, no internal fragmentation, causes external fragmentation).',
        },
      ],
    },
  },

  // ==========================================
  // UNIT V: STORAGE & FILE SYSTEMS
  // ==========================================
  {
    id: 'u5-file-concepts-access',
    unitId: 'unit-5',
    unitNumber: 5,
    unitTitle: 'UNIT-V: File Systems, Directory Structures & Allocation Methods',
    title: 'File: Concepts, Attributes, Operations & Access Methods',
    shortSummary: 'Files as named collections of related information on persistent storage, file attributes, operations, and Sequential vs Direct Access methods.',
    animationType: 'file-access-methods',
    keyTakeaways: [
      'File Concept: The smallest logical allotment of secondary storage; abstraction over raw sectors.',
      'File Attributes: Name, Identifier, Type, Location, Size, Protection, Time/Date/User credentials.',
      'File Operations: Create, Write, Read, Reposition within file (Seek), Delete, Truncate.',
      'Access Methods: Sequential Access (read next, write next, rewind) vs Direct (Random) Access (read block n, write block n, random seek).',
    ],
    theorySections: [
      {
        heading: '1. File Attributes & Metadata in Storage',
        content:
          'Operating systems isolate storage devices into abstract files. A file consists of data content and metadata attributes stored in directory entries or inodes:',
        bullets: [
          'Identifier: Unique tag (number) identifying the file within the filesystem (e.g. Inode number).',
          'Type: Required for systems supporting multiple file types (.txt, .elf, .exe).',
          'Location: Pointer to device and disk block addresses hosting the file content.',
          'Protection: Access-control list (ACL) determining read, write, execute permissions.',
        ],
      },
      {
        heading: '2. Sequential vs Direct (Random) Access Methods',
        content:
          'How applications read and write data streams:',
        bullets: [
          'Sequential Access: Information processed in order, one record after another. Reads advance an internal file pointer (`fp++`). Modeled after magnetic tape storage. Example: Audio/Video streaming.',
          'Direct (Random) Access: File made up of fixed-length logical records; programs can read or write records in any order without sequential traversal (`lseek(fd, offset, SEEK_SET)`). Modeled after disk drives. Essential for database indexing.',
        ],
      },
    ],
    industrialApplication: {
      company: 'Netflix & YouTube (Google)',
      industry: 'Global Video On-Demand (VOD) Streaming',
      systemName: 'HTTP Range Requests & Random File Access in Video Streaming',
      tagline: 'Instant video seeking across 4K film files stored on cloud object storage',
      challenge:
        'When a user clicks to minute 45:12 of a 2-hour 4K movie, sequential reading would require downloading 15 gigabytes of preceding video data before playback could start.',
      solution:
        'Streaming media servers utilize Direct File Access via HTTP Range Requests (`Range: bytes=5242880-10485760`) and OS `lseek()`, reading the exact disk blocks containing the keyframe instantly.',
      architectureDetails: [
        'MP4 `moov` atom metadata parsed at file head to calculate exact byte offsets.',
        'Zero-copy `sendfile()` system call transmits requested blocks directly from kernel disk cache to network card.',
      ],
      techStack: ['Nginx', 'HTTP/2 Range Requests', 'Linux sendfile', 'lseek'],
      metrics: [
        { label: 'Seek Start Latency', value: '< 120 ms' },
        { label: 'Bandwidth Saved', value: '88% per user scrub' },
      ],
    },
    examNotes: {
      frequentQuestions: [
        {
          question: 'What is the role of the file pointer in Sequential File Access?',
          answer:
            'The file pointer tracks the current byte position within the file. Every read or write operation automatically increments the pointer to the next consecutive byte position.',
        },
      ],
    },
  },

  {
    id: 'u5-directory-structures',
    unitId: 'unit-5',
    unitNumber: 5,
    unitTitle: 'UNIT-V: File Systems, Directory Structures & Allocation Methods',
    title: 'Directory Structures: Single-Level, Two-Level, Tree & Acyclic',
    shortSummary: 'Organization of directory namespaces: Single-level, Two-level (User directories), Tree-structured (hierarchical paths), and Acyclic-Graph (links/aliases).',
    animationType: 'directory-structures',
    keyTakeaways: [
      'Directory: A symbol table translating human-readable file names into directory entries and inodes.',
      'Single-Level Directory: All files in the same directory; major naming collisions, impossible for multi-user systems.',
      'Two-Level Directory: Master File Directory (MFD) points to individual User File Directories (UFD); solves naming collisions, but prevents user collaboration.',
      'Tree-Structured Directory: Arbitrary depth hierarchy with root `/`; supports absolute and relative pathnames; standard in modern systems.',
      'Acyclic-Graph Directory: Allows directories and files to have shared subdirectories/files via Hard Links and Symbolic (Soft) Links.',
    ],
    theorySections: [
      {
        heading: '1. Evolution of Directory Architecture',
        content:
          'Directory systems evolved to support complex multi-tenant environments:',
        bullets: [
          'Single-Level: Single directory contains all files. If User A creates `notes.txt`, User B cannot create a file named `notes.txt`.',
          'Two-Level: MFD maps User ID to private UFD. Solves naming collision, but users cannot share files easily.',
          'Tree-Structured: Folders can contain both files and subdirectories. Provides natural organization and security isolation.',
          'Acyclic Graph: Enables sharing. Hard links point directly to the inode number; Symbolic links store the textual path of target file.',
        ],
        diagramAscii: `
TREE-STRUCTURED DIRECTORY HIERARCHY:
                  / (Root)
         +--------+--------+
         |                 |
       home/              etc/
    +----+----+            |
    |         |         passwd
  alice/    bob/
    |         |
 notes.txt  code.c
        `,
      },
    ],
    industrialApplication: {
      company: 'Git & GitHub (Microsoft)',
      industry: 'Distributed Version Control & Software Engineering',
      systemName: 'Git Tree Objects & Merkle DAG Directory Representation',
      tagline: 'Tracking file directory trees across 100+ million developer repositories',
      challenge:
        'Storing millions of directory snapshots for every commit without duplicating files or running out of filesystem inodes.',
      solution:
        'Git models directory structures as a Directed Acyclic Graph (DAG) of cryptographically hashed "tree objects". Identical directories share the same SHA-1/SHA-256 hash pointer, giving instant deduplication.',
      architectureDetails: [
        'Tree objects point to sub-tree objects and blob objects (files).',
        'A single git commit is an immutable pointer to the root tree object.',
      ],
      techStack: ['C', 'Git Internals', 'Merkle Tree DAG', 'SHA-1 / SHA-256'],
      metrics: [
        { label: 'Storage Deduplication', value: 'Up to 90% space saved' },
        { label: 'Tree Diff Speed', value: '< 5 ms for 50,000 files' },
      ],
    },
    examNotes: {
      keyDifferences: [
        {
          feature: 'Hard Link vs Soft Link',
          itemA: 'Hard Link: Direct pointer to the file\'s Inode number; if original file name is deleted, data remains intact',
          itemB: 'Symbolic (Soft) Link: A pointer file containing the path string of the target; if target deleted, link becomes dangling',
          difference: 'Hard links cannot cross filesystem boundaries; soft links can point across disks and to directories.',
        },
      ],
      frequentQuestions: [
        {
          question: 'What is the danger of allowing cycles in a directory graph?',
          answer:
            'Cycles can cause infinite loops during recursive directory traversals (`find`, `du`), and prevent reference counting algorithms from deallocating deleted directories, causing disk leaks.',
        },
      ],
    },
  },

  {
    id: 'u5-file-allocation-methods',
    unitId: 'unit-5',
    unitNumber: 5,
    unitTitle: 'UNIT-V: File Systems, Directory Structures & Allocation Methods',
    title: 'File Allocation Methods: Contiguous, Linked & Indexed (Inodes)',
    shortSummary: 'How disk blocks are allocated for files: Contiguous Allocation, Linked List Allocation, and Indexed Allocation (UNIX Inode multi-level pointers).',
    animationType: 'file-allocation',
    keyTakeaways: [
      'Contiguous Allocation: File occupies a contiguous set of disk blocks. Pros: Fast sequential and direct access. Cons: Severe external fragmentation; file size cannot grow dynamically.',
      'Linked Allocation: Each file is a linked list of disk blocks; directory points to first and last block. Pros: Zero external fragmentation. Cons: Direct access is very slow (O(n) seeks); reliability risk if a pointer is corrupted.',
      'Indexed Allocation (Inodes): Each file has an Index Block (Inode) storing an array of direct and indirect pointers to disk blocks. Standard in modern OSes (ext4, NTFS).',
      'UNIX Inode Structure: 12 Direct Pointers, 1 Single Indirect Pointer, 1 Double Indirect Pointer, 1 Triple Indirect Pointer.',
    ],
    theorySections: [
      {
        heading: '1. Three Allocation Paradigms Compared',
        content:
          'Operating systems solve the mapping from logical file byte offsets to physical disk sectors using three fundamental approaches:',
        bullets: [
          'Contiguous: File defined by Start Block address and Length. Excellent for CD-ROMs and gaming consoles where files are static.',
          'Linked: File blocks scattered across disk. Block header contains pointer to next block. Eliminates external fragmentation. FAT (File Allocation Table) cached this link table in RAM.',
          'Indexed (Inodes): Allocates an index block per file containing pointers to data blocks. Fast direct access to any block `k` via index `inode->i_block[k]`.',
        ],
        diagramAscii: `
UNIX MULTI-LEVEL INDEXED INODE STRUCTURE:
[ INODE (Metadata, Size, Mode) ]
|-- Direct Block 0  ----------------------> [ Disk Block 42 ]
|-- Direct Block 1  ----------------------> [ Disk Block 43 ]
|-- ... (Up to Direct Block 11)
|-- Single Indirect Pointer --------------> [ Index Block ] ---> [ Disk Blocks... ]
|-- Double Indirect Pointer --------------> [ Index Block ] ---> [ Index Blocks ] ---> [ Disk Blocks... ]
|-- Triple Indirect Pointer --------------> (Enables Terabyte files)
        `,
      },
    ],
    industrialApplication: {
      company: 'Canonical / Ubuntu & Linux Kernel',
      industry: 'Server & Cloud Operating Systems',
      systemName: 'Linux Ext4 File System Extent Trees & Inodes',
      tagline: 'Powering exabytes of production storage across Linux clouds',
      challenge:
        'Traditional indirect block pointers in ext3 required huge index blocks for multi-terabyte database files, slowing down sequential I/O.',
      solution:
        'Linux Ext4 replaced single block pointers with Extents. A single extent can represent up to 128MB of contiguous physical disk blocks with a single 12-byte descriptor, cutting filesystem metadata size by 95%.',
      architectureDetails: [
        'Ext4 inode contains 4 inline extents, spilling to an H-tree if fragmented.',
        'Delayed Allocation (`delalloc`) buffers writes in RAM until flush time to allocate contiguous extents.',
      ],
      techStack: ['C', 'Linux ext4', 'VFS (Virtual File System)', 'Extent Trees'],
      metrics: [
        { label: 'Max File Size', value: '16 Terabytes' },
        { label: 'Max Volume Size', value: '1 Exabyte' },
        { label: 'Metadata Overhead', value: 'Reduced by 92%' },
      ],
    },
    examNotes: {
      criticalFormulasOrRules: [
        'Direct Blocks = 12 * Block_Size',
        'Single Indirect Capacity = (Block_Size / Pointer_Size) * Block_Size',
        'Double Indirect Capacity = (Block_Size / Pointer_Size)^2 * Block_Size',
        'Maximum File Size = Sum of Direct, Single, Double, and Triple Indirect capacities',
      ],
      frequentQuestions: [
        {
          question: 'Calculate maximum file size in a UNIX filesystem with 4KB block size, 4-byte disk pointers, 12 direct, 1 single indirect, and 1 double indirect pointer.',
          answer:
            'Number of pointers per block = 4096 / 4 = 1024 pointers. Direct = 12 * 4KB = 48 KB. Single Indirect = 1024 * 4KB = 4 MB. Double Indirect = 1024 * 1024 * 4KB = 4 GB. Total maximum file size = 48 KB + 4 MB + 4 GB ≈ 4.004 GB.',
        },
      ],
    },
  },

  {
    id: 'u5-revision',
    unitId: 'unit-5',
    unitNumber: 5,
    unitTitle: 'UNIT-V: File Systems, Directory Structures & Allocation Methods',
    title: 'Revised - Unit No. 5 (Quick Review & Exam Q&A)',
    shortSummary: 'High-yield revision sheet on file operations, directory structures, contiguous vs linked vs indexed allocation, and UNIX inode math.',
    animationType: 'unit-revision',
    keyTakeaways: [
      'File: Named unit of storage; sequential vs direct access.',
      'Directories: Single-level (collision), Two-level, Tree (hierarchical paths), Acyclic graph (hard/soft links).',
      'Allocation: Contiguous (fast, fragmentation), Linked (sequential, pointer overhead), Indexed (Inodes, direct + indirect pointers).',
      'Free Space: Bit vector (compact) vs Linked List (coalescing).',
    ],
    theorySections: [
      {
        heading: 'Comprehensive Unit 5 Knowledge Review',
        content:
          'Review these key comparisons before university viva or written exams:',
        bullets: [
          'Access Methods: Sequential (streaming, audio) vs Direct (random seek, databases).',
          'Hard Link vs Symbolic Link: Hard link shares inode number; Soft link stores target path string.',
          'Allocation: Inode multi-level indexing provides the best balance of small file efficiency and massive multi-terabyte file scaling.',
        ],
      },
    ],
    industrialApplication: {
      company: 'Amazon Web Services (AWS)',
      industry: 'Cloud Block Storage Infrastructure',
      systemName: 'AWS EBS (Elastic Block Store) & Nitro NVMe Disks',
      tagline: 'Allocating petabytes of virtual block disks across global datacenters',
      challenge:
        'Providing sub-millisecond random I/O latency for enterprise databases running on virtual disk volumes.',
      solution:
        'AWS EBS combines distributed extent-based log-structured allocations with custom Nitro NVMe hardware controllers, delivering up to 256,000 IOPS per volume.',
      architectureDetails: [
        'Network-replicated block allocation with automated snapshotting to S3.',
        'Direct NVMe protocol pass-through eliminates hypervisor I/O traps.',
      ],
      techStack: ['AWS Nitro', 'NVMe', 'Distributed Storage Engine', 'Rust / C++'],
      metrics: [
        { label: 'Max IOPS per Volume', value: '256,000 IOPS' },
        { label: 'Throughput', value: '4,000 MB/s' },
      ],
    },
    examNotes: {
      frequentQuestions: [
        {
          question: 'What is a Virtual File System (VFS) in modern operating systems?',
          answer:
            'VFS is a kernel abstraction layer that allows different physical filesystems (ext4, NTFS, FAT32, NFS, procfs) to be accessed using identical standard POSIX system calls (`open`, `read`, `write`) through uniform vnode structures.',
        },
      ],
    },
  },
];

export const THEORY_UNITS: UnitInfo[] = [
  {
    id: 'unit-1',
    number: 1,
    title: 'UNIT-I: OS Foundations, Architectures & RTOS',
    subtitle: 'What is an OS, Services, System Calls, Types (Batch, Time-Sharing, SMP), and Real-Time Systems',
    description:
      'Explore core kernel foundations: how operating systems manage hardware, dual-mode execution (Ring 0 vs Ring 3), system call traps, real-time deadlines, distributed clusters, and OS evolution.',
    topics: THEORY_TOPICS.filter((t) => t.unitId === 'unit-1'),
  },
  {
    id: 'unit-2',
    number: 2,
    title: 'UNIT-II: Processes, Threads, IPC & Scheduling Queues',
    subtitle: 'Process Lifecycle, PCB, Multithreading Models, IPC (Shared Memory vs Message Passing), Context Switching & 3-Tier Schedulers',
    description:
      'Master the lifecycle of running programs: 5-state process machine, PCB memory layout, thread architectures, zero-copy shared memory IPC, context switch penalties, and scheduling queue pipelines.',
    topics: THEORY_TOPICS.filter((t) => t.unitId === 'unit-2'),
  },
  {
    id: 'unit-3',
    number: 3,
    title: 'UNIT-III: CPU Scheduling Algorithms & Deadlocks',
    subtitle: 'FCFS, SJF, SRTF, Round Robin, Priority Scheduling, Coffman Deadlock Conditions & Banker\'s Algorithm',
    description:
      'Simulate CPU scheduling algorithms with interactive Gantt charts and mathematical metrics. Analyze deadlock creation via Resource Allocation Graphs and evaluate safe sequences using Banker\'s algorithm.',
    topics: THEORY_TOPICS.filter((t) => t.unitId === 'unit-3'),
  },
  {
    id: 'unit-4',
    number: 4,
    title: 'UNIT-IV: Memory Management, Paging & Virtual Memory',
    subtitle: 'Memory Partitioning, Paging & TLB Translation, Demand Paging, Page Replacement (FIFO, LRU, Optimal), Segmentation & Free Space',
    description:
      'Deep dive into physical and virtual memory: dynamic partitioning with First/Best/Worst fit, hardware address translation, page fault handling pipelines, Belady\'s anomaly, and segmentation check registers.',
    topics: THEORY_TOPICS.filter((t) => t.unitId === 'unit-4'),
  },
  {
    id: 'unit-5',
    number: 5,
    title: 'UNIT-V: File Systems, Directory Structures & Allocation',
    subtitle: 'File Concepts & Access Methods, Directory Hierarchies (Tree, Acyclic), Contiguous vs Linked vs Indexed Allocation & Inodes',
    description:
      'Unravel secondary storage management: direct vs sequential access, hierarchical path resolution, hard vs symbolic links, and UNIX multi-level Inode allocation block structures.',
    topics: THEORY_TOPICS.filter((t) => t.unitId === 'unit-5'),
  },
];
