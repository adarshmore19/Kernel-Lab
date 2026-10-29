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
import { BarChart3, Info, Award } from 'lucide-react';
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
      <div className="p-8 text-center bg-[#fdfbf6] border border-[#dfd7c6] rounded-xl text-[#78716c] font-mono text-xs">
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
    <div className="bg-[#fdfbf6] border border-[#dfd7c6] rounded-xl p-5 shadow-xs space-y-6 font-mono">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-[#dfd7c6]">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#2d5a88]" />
          <h3 className="text-sm uppercase font-bold text-[#2c2825] tracking-wider">
            Multi-Algorithm Benchmark & Comparison
          </h3>
        </div>
        <span className="text-xs text-[#1e5327] bg-[#edf5ed] border border-[#cbe0cc] px-2.5 py-1 rounded flex items-center gap-1 font-sans font-medium">
          <Award className="w-3.5 h-3.5 text-[#1e5327]" />
          Lowest WT: {lowestWTAlgo?.name} ({lowestWTAlgo?.result.metrics.avgWaitingTime} units)
        </span>
      </div>

      {/* Comparative Metrics Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#dfd7c6] text-[#78716c]">
              <th className="pb-2.5 font-medium">Algorithm</th>
              <th className="pb-2.5 font-medium">Type</th>
              <th className="pb-2.5 font-medium text-[#2d5a88]">Avg WT</th>
              <th className="pb-2.5 font-medium text-[#1e5327]">Avg TAT</th>
              <th className="pb-2.5 font-medium text-[#b45309]">Avg RT</th>
              <th className="pb-2.5 font-medium text-[#2c2825]">CPU Util</th>
              <th className="pb-2.5 font-medium text-[#2c2825]">Context Switches</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dfd7c6]/60">
            {comparisonResults.map((item) => {
              const isBest = item.id === lowestWTAlgo?.id;
              const isPreemptive = schedulers[item.id].isPreemptive;
              return (
                <tr
                  key={item.id}
                  className={`hover:bg-[#f5f0e1]/60 transition-colors ${
                    isBest ? 'bg-[#ebf2f8]/50 font-medium' : ''
                  }`}
                >
                  <td className="py-2.5 font-bold text-[#1c1917] flex items-center gap-1.5">
                    {item.name}
                    {isBest && (
                      <span className="px-1.5 py-0.2 text-[9px] bg-[#dbe6f0] text-[#1e4569] rounded border border-[#c8d9e8]">
                        OPTIMAL
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 text-[#78716c]">
                    {isPreemptive ? 'Preemptive' : 'Non-Preemptive'}
                  </td>
                  <td className="py-2.5 font-bold text-[#2d5a88]">
                    {item.result.metrics.avgWaitingTime}
                  </td>
                  <td className="py-2.5 font-bold text-[#1e5327]">
                    {item.result.metrics.avgTurnaroundTime}
                  </td>
                  <td className="py-2.5 text-[#b45309]">
                    {item.result.metrics.avgResponseTime}
                  </td>
                  <td className="py-2.5 text-[#2c2825]">
                    {item.result.metrics.cpuUtilization}%
                  </td>
                  <td className="py-2.5 text-[#2c2825]">
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
        <h4 className="text-xs text-[#57534e] uppercase tracking-wider mb-3">
          Turnaround vs Waiting Time Comparison (Lower is Better)
        </h4>
        <div className="h-64 w-full bg-[#f4f0e5] border border-[#dfd7c6] rounded-lg p-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dfd7c6" />
              <XAxis dataKey="name" stroke="#78716c" tick={{ fontSize: 11, fill: '#57534e' }} />
              <YAxis stroke="#78716c" tick={{ fontSize: 11, fill: '#57534e' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fdfbf6',
                  borderColor: '#dfd7c6',
                  borderRadius: '8px',
                  color: '#2c2825',
                  fontSize: '11px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="Avg WT" fill="#5b8ab8" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Avg TAT" fill="#4a965d" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Deep Educational Technical Explanation (Why Results Differ) */}
      <div className="p-4 bg-[#f4f0e5] border border-[#dfd7c6] rounded-lg space-y-3 font-sans text-xs">
        <div className="flex items-center gap-2 text-[#2c2825] font-semibold font-mono">
          <Info className="w-4 h-4 text-[#2d5a88]" />
          Technical Analysis: Why Do These Schedulers Differ?
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[#57534e] leading-relaxed">
          <div className="p-3 bg-[#fdfbf6] rounded border border-[#dfd7c6]">
            <strong className="text-[#1e4569] font-mono block mb-1">
              SRTF & SJF Efficiency
            </strong>
            SRTF achieves the minimal theoretical average waiting time by greedily scheduling the job closest to completion. When a short job arrives, preempting a longer job prevents the short job from waiting for multiple cycles.
          </div>
          <div className="p-3 bg-[#fdfbf6] rounded border border-[#dfd7c6]">
            <strong className="text-[#7d4e08] font-mono block mb-1">
              FCFS Convoy Pitfall
            </strong>
            In FCFS, if an early-arriving process has a long burst time, all subsequent quick processes are blocked in the ready queue. This inflates Average Turnaround Time.
          </div>
          <div className="p-3 bg-[#fdfbf6] rounded border border-[#dfd7c6]">
            <strong className="text-[#1e5327] font-mono block mb-1">
              Round Robin Fairness
            </strong>
            Round Robin prevents starvation and yields low Response Times by slicing execution with quantum ({quantum}). However, it incurs higher context switches, slightly increasing overall overhead.
          </div>
        </div>
      </div>
    </div>
  );
};
