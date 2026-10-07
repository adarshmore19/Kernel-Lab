import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { BarChart3, Info, Check, Award, AlertCircle } from 'lucide-react';
import { AlgorithmType, Process, SchedulingResult } from '../../types/scheduler';
import { schedulers } from '../../engine/scheduling';

interface AlgorithmComparisonProps {
  processes: Process[];
  quantum: number;
}

export const AlgorithmComparison: React.FC<AlgorithmComparisonProps> = ({
  processes,
  quantum,
}) => {
  const comparisonResults = useMemo(() => {
    if (processes.length === 0) return [];

    const results: Array<{
      id: AlgorithmType;
      name: string;
      result: SchedulingResult;
    }> = [];

    const algos: AlgorithmType[] = [
      'FCFS',
      'SJF',
      'SRTF',
      'RR',
      'PRIORITY_NP',
      'PRIORITY_P',
    ];

    for (const algoId of algos) {
      const runner = schedulers[algoId];
      const res = runner.schedule(processes, quantum);
      results.push({
        id: algoId,
        name: runner.name,
        result: res,
      });
    }

    return results;
  }, [processes, quantum]);

  if (processes.length === 0) {
    return (
      <div className="p-8 text-center bg-[#0e1424] border border-[#1e2a42] rounded-xl text-slate-500 font-mono text-xs">
        Add processes to compare algorithm performance metrics.
      </div>
    );
  }

  // Chart data
  const chartData = comparisonResults.map((item) => ({
    name: item.id,
    fullName: item.name,
    'Avg WT': item.result.metrics.avgWaitingTime,
    'Avg TAT': item.result.metrics.avgTurnaroundTime,
    'Avg RT': item.result.metrics.avgResponseTime,
    'Context Switches': item.result.metrics.contextSwitches,
  }));

  // Find lowest average WT winner
  const lowestWTAlgo = [...comparisonResults].sort(
    (a, b) => a.result.metrics.avgWaitingTime - b.result.metrics.avgWaitingTime
  )[0];

  return (
    <div className="bg-[#0e1424] border border-[#1e2a42] rounded-xl p-5 shadow-xl space-y-6 font-mono">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1b253b]">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm uppercase font-bold text-slate-200 tracking-wider">
            Multi-Algorithm Benchmark & Comparison
          </h3>
        </div>
        <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded flex items-center gap-1 font-sans">
          <Award className="w-3.5 h-3.5" />
          Lowest WT: {lowestWTAlgo?.name} ({lowestWTAlgo?.result.metrics.avgWaitingTime} units)
        </span>
      </div>

      {/* Comparative Metrics Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#1b253b] text-slate-400">
              <th className="pb-2.5 font-medium">Algorithm</th>
              <th className="pb-2.5 font-medium">Type</th>
              <th className="pb-2.5 font-medium text-cyan-400">Avg WT</th>
              <th className="pb-2.5 font-medium text-emerald-400">Avg TAT</th>
              <th className="pb-2.5 font-medium text-amber-400">Avg RT</th>
              <th className="pb-2.5 font-medium text-indigo-400">CPU Util</th>
              <th className="pb-2.5 font-medium text-purple-400">Context Switches</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#151c2e]">
            {comparisonResults.map((item) => {
              const isBest = item.id === lowestWTAlgo?.id;
              const isPreemptive = schedulers[item.id].isPreemptive;
              return (
                <tr
                  key={item.id}
                  className={`hover:bg-[#12192c]/50 transition-colors ${
                    isBest ? 'bg-cyan-950/20' : ''
                  }`}
                >
                  <td className="py-2.5 font-bold text-slate-100 flex items-center gap-1.5">
                    {item.name}
                    {isBest && (
                      <span className="px-1.5 py-0.2 text-[9px] bg-cyan-900 text-cyan-200 rounded">
                        OPTIMAL
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 text-slate-400">
                    {isPreemptive ? 'Preemptive' : 'Non-Preemptive'}
                  </td>
                  <td className="py-2.5 font-bold text-cyan-300">
                    {item.result.metrics.avgWaitingTime}
                  </td>
                  <td className="py-2.5 font-bold text-emerald-300">
                    {item.result.metrics.avgTurnaroundTime}
                  </td>
                  <td className="py-2.5 text-amber-300">
                    {item.result.metrics.avgResponseTime}
                  </td>
                  <td className="py-2.5 text-indigo-300">
                    {item.result.metrics.cpuUtilization}%
                  </td>
                  <td className="py-2.5 text-purple-300 font-semibold">
                    {item.result.metrics.contextSwitches}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Visual Bar Chart */}
      <div className="pt-2">
        <h4 className="text-xs text-slate-400 uppercase tracking-wider mb-3">
          Turnaround vs Waiting Time Comparison (Lower is Better)
        </h4>
        <div className="h-64 w-full bg-[#080c16] border border-[#1b253b] rounded-lg p-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#17223b" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0d1322',
                  borderColor: '#1e293b',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  fontSize: '11px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="Avg WT" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Avg TAT" fill="#34d399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Deep Educational Technical Explanation (Why Results Differ) */}
      <div className="p-4 bg-[#0a0f1d] border border-[#1d273d] rounded-lg space-y-3 font-sans text-xs">
        <div className="flex items-center gap-2 text-cyan-300 font-semibold font-mono">
          <Info className="w-4 h-4 text-cyan-400" />
          Technical Analysis: Why Do These Schedulers Differ?
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300 leading-relaxed">
          <div className="p-3 bg-[#0d1424] rounded border border-[#1a2438]">
            <strong className="text-cyan-300 font-mono block mb-1">
              SRTF & SJF Efficiency
            </strong>
            SRTF achieves the minimal theoretical average waiting time by greedily scheduling the job closest to completion. When a short job arrives, preempting a longer job prevents the short job from waiting for multiple cycles.
          </div>
          <div className="p-3 bg-[#0d1424] rounded border border-[#1a2438]">
            <strong className="text-amber-300 font-mono block mb-1">
              FCFS Convoy Pitfall
            </strong>
            In FCFS, if an early-arriving process has a long burst time, all subsequent quick processes are blocked in the ready queue. This dramatically inflates Average Turnaround Time.
          </div>
          <div className="p-3 bg-[#0d1424] rounded border border-[#1a2438]">
            <strong className="text-emerald-300 font-mono block mb-1">
              Round Robin Fairness
            </strong>
            Round Robin prevents starvation and yields low Response Times by slicing execution with quantum ({quantum}). However, it incurs higher context switches, slightly increasing overall overhead.
          </div>
        </div>
      </div>
    </div>
  );
};
