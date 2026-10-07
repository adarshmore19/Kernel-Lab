# KernelLab — Operating Systems & Linux Interactive Laboratory

**KernelLab** is a production-quality educational web workbench that combines:
1. An interactive **CPU Scheduling Visualizer** (FCFS, SJF, SRTF, Round Robin, Preemptive & Non-Preemptive Priority) with animated Gantt charts, process queues, and mathematical metrics.
2. A progressive **Linux Learning Guide** featuring an authentic in-browser **Fish-style terminal** powered by a sandboxed virtual filesystem.
3. Interactive **OS Concept Labs** covering Process Control Blocks (PCB), State Transitions, and Virtual Memory Page Replacement (FIFO, LRU, OPT).

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Running Locally
```bash
# 1. Install dependencies
npm install

# 2. Run unit tests
npm test

# 3. Start local development server
npm run dev

# 4. Production build
npm run build
```

The application runs locally with zero backend dependencies. All command executions and CPU simulations occur purely in-memory inside the browser sandbox.

---

## 🏛 Architecture & Modular Structure

```text
src/
├── types/
│   ├── filesystem.ts          # Virtual node tree, permissions, inode stats
│   ├── shell.ts               # Command stages, pipelines, redirects, terminal entries
│   ├── scheduler.ts           # Process structures, Gantt blocks, timeline slices, metrics
│   └── curriculum.ts          # Modules, lessons, challenges, validation rules
├── engine/
│   ├── filesystem/
│   │   ├── VirtualFS.ts       # Pure in-memory hierarchical filesystem with POSIX permissions
│   │   └── initialFS.ts       # Realistic seed: /home/user, /etc/os-release, /var/log, /tmp
│   ├── shell/
│   │   ├── parser.ts          # Tokenizer handling quotes, flags, env expansion, pipes (|), redirects (>, >>, <)
│   │   ├── dispatcher.ts      # Pipeline execution engine and educational hints
│   │   └── commands/          # 30+ Safe virtual implementations (pwd, ls, cd, mkdir, cat, grep, etc.)
│   └── scheduling/
│       ├── algorithms/        # FCFS, SJF, SRTF, Round Robin, Priority Non-Preemptive & Preemptive
│       ├── metrics.ts         # CT, TAT, WT, RT, averages, CPU utilization, throughput, context switches
│       └── presets.ts         # Textbook scenarios (Silberschatz Classic, Convoy Effect, Preemption Showdown)
├── components/
│   ├── terminal/
│   │   └── Terminal.tsx       # Fish shell prompt (╭─ user@kernellab ~/projects ╰─❯), autocomplete, history, copy
│   ├── scheduler/
│   │   ├── ProcessInputTable.tsx # Process management, presets, randomizer, algorithm selector
│   │   ├── GanttChart.tsx        # Animated Gantt chart with time scrubber and IDLE periods
│   │   ├── SimulationControls.tsx # Play, Pause, Step forward/backward, Restart, Speed slider
│   │   ├── ProcessQueueVisualizer.tsx # Visual states: New -> Ready Queue -> CPU -> Terminated
│   │   ├── MetricsSummary.tsx    # CT, TAT, WT, RT table and aggregate cards
│   │   ├── AlgorithmComparison.tsx # Side-by-side benchmark table and Recharts visual comparison
│   │   └── EducationalExplanation.tsx # Step-by-step reason for every scheduling decision
│   ├── linux/
│   │   ├── ChallengeCard.tsx     # Live challenge evaluator with automated filesystem checks & confetti
│   │   └── PermissionsInteractive.tsx # Clickable POSIX permission calculator (-rwxr-xr-- / octal)
│   └── labs/
│       ├── ProcessLifecycleLab.tsx # 5-state process machine & PCB inspector
│       └── MemoryLab.tsx           # Page replacement simulator (FIFO, LRU, Optimal)
├── pages/
│   ├── DashboardPage.tsx      # Overview, curriculum progress, quick start cards
│   ├── LinuxLabPage.tsx       # 3-column layout: Navigation, Lesson content, Fish terminal
│   ├── SchedulerLabPage.tsx   # Interactive simulator and multi-algorithm benchmark
│   └── LabsPage.tsx           # Process Lifecycle & Memory Paging concept labs
└── tests/                     # 9 Vitest suites testing parser, filesystem, commands, algorithms & metrics
```

---

## 🔒 Security Guarantee
KernelLab does **NOT** execute arbitrary host operating-system commands. It never uses `child_process`, `exec`, or host shell APIs. All terminal commands execute within a sandboxed virtual JavaScript filesystem and parser.

---

## 🧪 Test Suite
Run `npm test` to execute all 33 unit tests across 9 test suites:
- `filesystem.test.ts` (path normalization, CRUD, copy, move, permissions, recursive ops)
- `parser.test.ts` (tokenization, environment variable expansion, pipes, redirection)
- `commands.test.ts` (cd, ls, mkdir -p, echo, cat, pipelines, chmod learning hints, fish set)
- `fcfs.test.ts` (arrival order, CPU idle periods)
- `sjf.test.ts` (shortest job first non-preemptive logic)
- `srtf.test.ts` (shortest remaining time first preemptions)
- `roundRobin.test.ts` (time quantum slicing and FIFO queue rotation)
- `priority.test.ts` (preemptive vs non-preemptive priority comparison)
- `metrics.test.ts` (CT, TAT, WT, RT, utilization, and throughput formulas)
