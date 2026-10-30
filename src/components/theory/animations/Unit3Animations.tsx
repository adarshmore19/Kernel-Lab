import React, { useState, useMemo } from 'react';
import {
  Cpu,
  RotateCcw,
  AlertTriangle,
  Lock,
  Unlock,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

// ==========================================
// 1. CPU SCHEDULING ALGORITHM SIMULATOR
// ==========================================
export const CPUSchedulingSimulator: React.FC = () => {
  const [algo, setAlgo] = useState<'FCFS' | 'SJF' | 'SRTF' | 'RR' | 'PRIO'>('RR');
  const [quantum, setQuantum] = useState(2);
  const [useAging, setUseAging] = useState(false);

  const baseProcesses = [
    { pid: 'P1', at: 0, bt: 5, priority: 3 },
    { pid: 'P2', at: 1, bt: 3, priority: 1 },
    { pid: 'P3', at: 2, bt: 8, priority: 4 },
    { pid: 'P4', at: 3, bt: 4, priority: 2 },
  ];

  const result = useMemo(() => {
    const gantt: Array<{ pid: string; start: number; end: number }> = [];
    const n = baseProcesses.length;
    let ct: Record<string, number> = {};
    let wt: Record<string, number> = {};
    let tat: Record<string, number> = {};

    if (algo === 'FCFS') {
      let currentTime = 0;
      const sorted = [...baseProcesses].sort((a, b) => a.at - b.at);
      for (const p of sorted) {
        if (currentTime < p.at) currentTime = p.at;
        const start = currentTime;
        const end = currentTime + p.bt;
        gantt.push({ pid: p.pid, start, end });
        currentTime = end;
        ct[p.pid] = end;
        tat[p.pid] = ct[p.pid] - p.at;
        wt[p.pid] = tat[p.pid] - p.bt;
      }
    } else if (algo === 'SJF') {
      let currentTime = 0;
      let completed = 0;
      const done: Record<string, boolean> = {};

      while (completed < n) {
        const available = baseProcesses.filter((p) => p.at <= currentTime && !done[p.pid]);
        if (available.length === 0) {
          currentTime++;
          continue;
        }
        available.sort((a, b) => a.bt - b.bt);
        const p = available[0];
        const start = currentTime;
        const end = currentTime + p.bt;
        gantt.push({ pid: p.pid, start, end });
        currentTime = end;
        done[p.pid] = true;
        completed++;
        ct[p.pid] = end;
        tat[p.pid] = ct[p.pid] - p.at;
        wt[p.pid] = tat[p.pid] - p.bt;
      }
    } else if (algo === 'SRTF') {
      let currentTime = 0;
      let completed = 0;
      const rem: Record<string, number> = {};
      baseProcesses.forEach((p) => (rem[p.pid] = p.bt));

      while (completed < n) {
        const available = baseProcesses.filter((p) => p.at <= currentTime && rem[p.pid] > 0);
        if (available.length === 0) {
          currentTime++;
          continue;
        }
        available.sort((a, b) => rem[a.pid] - rem[b.pid]);
        const p = available[0];

        if (gantt.length > 0 && gantt[gantt.length - 1].pid === p.pid) {
          gantt[gantt.length - 1].end++;
        } else {
          gantt.push({ pid: p.pid, start: currentTime, end: currentTime + 1 });
        }

        rem[p.pid]--;
        currentTime++;

        if (rem[p.pid] === 0) {
          completed++;
          ct[p.pid] = currentTime;
          tat[p.pid] = ct[p.pid] - p.at;
          wt[p.pid] = tat[p.pid] - p.bt;
        }
      }
    } else if (algo === 'RR') {
      let currentTime = 0;
      const rem: Record<string, number> = {};
      baseProcesses.forEach((p) => (rem[p.pid] = p.bt));
      const queue: string[] = [];
      const inQueue: Record<string, boolean> = {};

      baseProcesses
        .filter((p) => p.at === 0)
        .forEach((p) => {
          queue.push(p.pid);
          inQueue[p.pid] = true;
        });

      let completed = 0;
      while (completed < n) {
        if (queue.length === 0) {
          currentTime++;
          baseProcesses
            .filter((p) => p.at <= currentTime && rem[p.pid] > 0 && !inQueue[p.pid])
            .forEach((p) => {
              queue.push(p.pid);
              inQueue[p.pid] = true;
            });
          continue;
        }

        const pid = queue.shift()!;
        inQueue[pid] = false;
        const p = baseProcesses.find((x) => x.pid === pid)!;
        const slice = Math.min(quantum, rem[pid]);
        const start = currentTime;
        const end = currentTime + slice;
        gantt.push({ pid, start, end });
        currentTime = end;
        rem[pid] -= slice;

        baseProcesses
          .filter((x) => x.at <= currentTime && rem[x.pid] > 0 && !inQueue[x.pid] && x.pid !== pid)
          .forEach((x) => {
            queue.push(x.pid);
            inQueue[x.pid] = true;
          });

        if (rem[pid] > 0) {
          queue.push(pid);
          inQueue[pid] = true;
        } else {
          completed++;
          ct[pid] = currentTime;
          tat[pid] = ct[pid] - p.at;
          wt[pid] = tat[pid] - p.bt;
        }
      }
    } else {
      let currentTime = 0;
      let completed = 0;
      const done: Record<string, boolean> = {};
      const dynPrio: Record<string, number> = {};
      baseProcesses.forEach((p) => (dynPrio[p.pid] = p.priority));

      while (completed < n) {
        const available = baseProcesses.filter((p) => p.at <= currentTime && !done[p.pid]);
        if (available.length === 0) {
          currentTime++;
          continue;
        }
        available.sort((a, b) => dynPrio[a.pid] - dynPrio[b.pid]);
        const p = available[0];
        const start = currentTime;
        const end = currentTime + p.bt;
        gantt.push({ pid: p.pid, start, end });
        currentTime = end;
        done[p.pid] = true;
        completed++;
        ct[p.pid] = end;
        tat[p.pid] = ct[p.pid] - p.at;
        wt[p.pid] = tat[p.pid] - p.bt;

        if (useAging) {
          baseProcesses.forEach((other) => {
            if (!done[other.pid] && other.at <= currentTime) {
              dynPrio[other.pid] = Math.max(1, dynPrio[other.pid] - 1);
            }
          });
        }
      }
    }

    const avgWT = Object.values(wt).reduce((a, b) => a + b, 0) / n;
    const avgTAT = Object.values(tat).reduce((a, b) => a + b, 0) / n;

    return { gantt, ct, wt, tat, avgWT: avgWT.toFixed(2), avgTAT: avgTAT.toFixed(2) };
  }, [algo, quantum, useAging]);

  const totalTime = result.gantt.length > 0 ? result.gantt[result.gantt.length - 1].end : 20;

  return (
    <div className="bg-white border border-[#dfd7c6] rounded-xl p-5 space-y-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#dfd7c6]/60">
        <div>
          <h4 className="font-mono font-bold text-sm text-[#2c2825]">
            CPU Scheduling Simulator & Gantt Chart
          </h4>
          <p className="text-xs text-[#78716c]">
            Interactive execution of FCFS, SJF, SRTF, Round Robin, and Priority Scheduling.
          </p>
        </div>

        {/* Algorithm Tabs */}
        <div className="flex items-center gap-1 text-xs font-mono">
          {(['FCFS', 'SJF', 'SRTF', 'RR', 'PRIO'] as const).map((a) => (
            <button
              key={a}
              onClick={() => setAlgo(a)}
              className={`px-3 py-1 rounded transition-all ${
                algo === a ? 'bg-[#2d5a88] text-white font-bold' : 'text-[#78716c] hover:bg-stone-100'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Algorithm Config Controls - Flat row, no nested box */}
      {algo === 'RR' && (
        <div className="flex items-center gap-4 text-xs font-mono pb-2 border-b border-[#dfd7c6]/40">
          <span className="text-[#57534e]">Time Quantum:</span>
          <input
            type="range"
            min={1}
            max={6}
            value={quantum}
            onChange={(e) => setQuantum(Number(e.target.value))}
            className="w-32 accent-[#2d5a88]"
          />
          <span className="font-bold text-[#2d5a88]">{quantum} ms</span>
        </div>
      )}

      {algo === 'PRIO' && (
        <div className="flex items-center gap-4 text-xs font-mono pb-2 border-b border-[#dfd7c6]/40">
          <span className="text-[#57534e]">Aging Protection:</span>
          <button
            onClick={() => setUseAging(!useAging)}
            className={`px-3 py-1 rounded text-xs transition-all ${
              useAging ? 'bg-[#1e5327] text-white font-bold' : 'bg-stone-100 text-[#78716c]'
            }`}
          >
            {useAging ? '✓ Aging Active' : 'Aging Disabled'}
          </button>
        </div>
      )}

      {/* Visual Gantt Chart */}
      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase text-[#78716c]">
          Timeline: 0 to {totalTime} ms
        </span>
        <div className="flex h-9 w-full rounded-lg overflow-hidden border border-[#dfd7c6] bg-stone-100">
          {result.gantt.map((block, idx) => {
            const widthPct = ((block.end - block.start) / totalTime) * 100;
            const colors: Record<string, string> = {
              P1: 'bg-[#2d5a88] text-white',
              P2: 'bg-[#1e5327] text-white',
              P3: 'bg-[#b45309] text-white',
              P4: 'bg-[#6b21a8] text-white',
            };
            return (
              <div
                key={idx}
                style={{ width: `${widthPct}%` }}
                className={`h-full flex items-center justify-center font-mono text-xs font-bold ${
                  colors[block.pid] || 'bg-gray-500 text-white'
                }`}
                title={`${block.pid}: ${block.start}-${block.end}ms`}
              >
                <span>{block.pid}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Metrics Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="text-[#78716c] border-b border-[#dfd7c6]">
              <th className="py-2 text-left">Process</th>
              <th className="py-2 text-center">Arrival</th>
              <th className="py-2 text-center">Burst</th>
              <th className="py-2 text-center">Priority</th>
              <th className="py-2 text-center">Completion</th>
              <th className="py-2 text-center">Turnaround</th>
              <th className="py-2 text-center font-bold text-[#1e5327]">Waiting Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dfd7c6]/40">
            {baseProcesses.map((p) => (
              <tr key={p.pid}>
                <td className="py-2 font-bold text-[#2d5a88]">{p.pid}</td>
                <td className="py-2 text-center">{p.at} ms</td>
                <td className="py-2 text-center">{p.bt} ms</td>
                <td className="py-2 text-center">{p.priority}</td>
                <td className="py-2 text-center">{result.ct[p.pid]} ms</td>
                <td className="py-2 text-center">{result.tat[p.pid]} ms</td>
                <td className="py-2 text-center font-bold text-[#1e5327]">{result.wt[p.pid]} ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Aggregate Scorecard - Clean flat stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-[#dfd7c6]/60 text-xs font-mono">
        <div>
          <span className="text-[10px] text-[#78716c] block">Average Waiting Time</span>
          <strong className="text-sm text-[#1e5327]">{result.avgWT} ms</strong>
        </div>
        <div>
          <span className="text-[10px] text-[#78716c] block">Average Turnaround</span>
          <strong className="text-sm text-[#2d5a88]">{result.avgTAT} ms</strong>
        </div>
        <div>
          <span className="text-[10px] text-[#78716c] block">Algorithm Category</span>
          <strong className="text-sm text-[#b45309]">
            {algo === 'FCFS' || algo === 'SJF' ? 'Non-Preemptive' : 'Preemptive'}
          </strong>
        </div>
        <div>
          <span className="text-[10px] text-[#78716c] block">Optimal Metric</span>
          <strong className="text-sm text-[#2c2825]">
            {algo === 'SRTF' ? 'Minimum Average WT' : 'Interactive Response'}
          </strong>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. DEADLOCK RESOURCE ALLOCATION GRAPH (RAG)
// ==========================================
export const DeadlockRAGVisualizer: React.FC = () => {
  const [hasCycle, setHasCycle] = useState(false);

  return (
    <div className="bg-white border border-[#dfd7c6] rounded-xl p-5 space-y-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#dfd7c6]/60">
        <div>
          <h4 className="font-mono font-bold text-sm text-[#2c2825]">
            Resource Allocation Graph (RAG) & Circular Wait
          </h4>
          <p className="text-xs text-[#78716c]">
            Interactive Coffman conditions and cycle detection leading to system deadlock.
          </p>
        </div>

        <button
          onClick={() => setHasCycle(!hasCycle)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
            hasCycle ? 'bg-[#9f1239] text-white' : 'bg-[#1e5327] text-white'
          }`}
        >
          {hasCycle ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          <span>{hasCycle ? 'Cycle Injected: Deadlock' : 'Safe: No Deadlock'}</span>
        </button>
      </div>

      {/* RAG Graph - Flat 4 Column Row, No Nested Box */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-2 text-center font-mono">
        <div className="p-3 bg-stone-50 rounded-lg">
          <span className="text-xs font-bold text-[#2d5a88] block">Process P1</span>
          <span className="text-[10px] text-[#78716c] block">Holds: Resource R1</span>
          <span className="text-[10px] text-amber-700 block">Requests: R2</span>
        </div>

        <div className="p-3 bg-stone-50 rounded-lg">
          <span className="text-xs font-bold text-[#b45309] block">Resource R1 (Printer)</span>
          <span className="text-[10px] text-[#1e5327] font-bold block">Assigned to: P1</span>
        </div>

        <div
          className={`p-3 rounded-lg transition-all ${
            hasCycle ? 'bg-rose-50 text-rose-950 font-bold' : 'bg-stone-50'
          }`}
        >
          <span className="text-xs font-bold text-[#2d5a88] block">Process P2</span>
          <span className="text-[10px] text-[#78716c] block">Holds: Resource R2</span>
          <span className={`text-[10px] block ${hasCycle ? 'text-rose-700 font-bold' : 'text-gray-400'}`}>
            {hasCycle ? 'Requests: R1 (CYCLE!)' : 'No requests'}
          </span>
        </div>

        <div className="p-3 bg-stone-50 rounded-lg">
          <span className="text-xs font-bold text-[#b45309] block">Resource R2 (Tape Drive)</span>
          <span className="text-[10px] text-[#1e5327] font-bold block">Assigned to: P2</span>
        </div>
      </div>

      {/* Dynamic Cycle Callout */}
      {hasCycle && (
        <div className="border-l-3 border-rose-600 pl-3 py-1.5 text-xs font-mono text-rose-900 bg-rose-50/50">
          <strong>DEADLOCK CYCLE DETECTED:</strong> P1 holds R1 and waits for R2, while P2 holds R2 and waits for R1. Neither can proceed.
        </div>
      )}

      {/* 4 Conditions - Flat Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-[#dfd7c6]/60 text-xs font-mono">
        <div>
          <span className="text-[10px] text-[#78716c] block">1. Mutual Exclusion</span>
          <strong className="text-rose-800">Exclusive Lock</strong>
        </div>
        <div>
          <span className="text-[10px] text-[#78716c] block">2. Hold & Wait</span>
          <strong className="text-rose-800">Holding R1/R2</strong>
        </div>
        <div>
          <span className="text-[10px] text-[#78716c] block">3. No Preemption</span>
          <strong className="text-rose-800">Cannot Preempt</strong>
        </div>
        <div>
          <span className="text-[10px] text-[#78716c] block">4. Circular Wait</span>
          <strong className={hasCycle ? 'text-rose-700 font-bold' : 'text-[#1e5327]'}>
            {hasCycle ? 'CYCLE ACTIVE' : 'BROKEN (Safe)'}
          </strong>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. BANKER'S ALGORITHM SAFETY SIMULATOR
// ==========================================
export const BankersAlgorithmVisualizer: React.FC = () => {
  const [step, setStep] = useState(0);

  const safetySteps = [
    {
      evaluating: 'Initial State',
      work: [3, 3, 2],
      completed: [],
      note: 'Available Vector: [3, 3, 2]. Calculating Need = Max - Allocation for all processes.',
    },
    {
      evaluating: 'Process P1',
      work: [5, 3, 2],
      completed: ['P1'],
      note: 'Need(P1) = [1, 2, 2] <= Work [3, 3, 2]. P1 finishes! Releases allocation [2, 0, 0]. New Work = [5, 3, 2].',
    },
    {
      evaluating: 'Process P3',
      work: [7, 4, 3],
      completed: ['P1', 'P3'],
      note: 'Need(P3) = [0, 1, 1] <= Work [5, 3, 2]. P3 finishes! Releases [2, 1, 1]. New Work = [7, 4, 3].',
    },
    {
      evaluating: 'Process P4',
      work: [7, 4, 5],
      completed: ['P1', 'P3', 'P4'],
      note: 'Need(P4) = [4, 3, 1] <= Work [7, 4, 3]. P4 finishes! Releases [0, 0, 2]. New Work = [7, 4, 5].',
    },
    {
      evaluating: 'Process P0',
      work: [7, 5, 5],
      completed: ['P1', 'P3', 'P4', 'P0'],
      note: 'Need(P0) = [7, 4, 3] <= Work [7, 4, 5]. P0 finishes! Releases [0, 1, 0]. New Work = [7, 5, 5].',
    },
    {
      evaluating: 'Process P2',
      work: [10, 5, 7],
      completed: ['P1', 'P3', 'P4', 'P0', 'P2'],
      note: 'Need(P2) = [6, 0, 0] <= Work [7, 5, 5]. P2 finishes! System is in a 100% SAFE STATE!',
    },
  ];

  return (
    <div className="bg-white border border-[#dfd7c6] rounded-xl p-5 space-y-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#dfd7c6]/60">
        <div>
          <h4 className="font-mono font-bold text-sm text-[#2c2825]">
            Banker's Algorithm: Safety Sequence Evaluator
          </h4>
          <p className="text-xs text-[#78716c]">
            Step-by-step mathematical check proving system is in a safe deadlock-free execution sequence.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setStep(0)}
            className="p-1.5 text-xs font-mono text-[#78716c] hover:bg-stone-100 rounded"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setStep((prev) => Math.min(safetySteps.length - 1, prev + 1))}
            disabled={step === safetySteps.length - 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#2d5a88] text-white text-xs font-semibold hover:bg-[#23476c] disabled:opacity-40"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Safe Sequence - Clean Flat Pill Sequence */}
      <div className="flex items-center gap-3 text-xs font-mono py-1">
        <span className="text-[#78716c]">Safe Sequence:</span>
        <div className="flex items-center gap-2">
          {['P1', 'P3', 'P4', 'P0', 'P2'].map((p, i) => {
            const isDone = safetySteps[step].completed.includes(p);
            return (
              <React.Fragment key={p}>
                <span
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                    isDone ? 'bg-[#1e5327] text-white' : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {p}
                </span>
                {i < 4 && <ArrowRight className="w-3 h-3 text-stone-400" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Available & Work Vector - Flat */}
      <div className="flex flex-wrap gap-8 py-2 border-y border-[#dfd7c6]/60 text-xs font-mono">
        <div>
          <span className="text-[#78716c] block text-[11px]">Free Work Vector</span>
          <div className="flex gap-3 mt-0.5">
            <span>A: <strong className="text-[#2d5a88]">{safetySteps[step].work[0]}</strong></span>
            <span>B: <strong className="text-[#1e5327]">{safetySteps[step].work[1]}</strong></span>
            <span>C: <strong className="text-[#b45309]">{safetySteps[step].work[2]}</strong></span>
          </div>
        </div>

        <div>
          <span className="text-[#78716c] block text-[11px]">Current Step</span>
          <strong className="text-[#2c2825] mt-0.5 block">
            Step {step} of 5: {safetySteps[step].evaluating}
          </strong>
        </div>
      </div>

      {/* Detailed Math Note */}
      <div className="border-l-3 border-[#2d5a88] pl-3 py-1.5 text-xs font-mono text-[#1e4569]">
        <strong>Check:</strong> {safetySteps[step].note}
      </div>
    </div>
  );
};
