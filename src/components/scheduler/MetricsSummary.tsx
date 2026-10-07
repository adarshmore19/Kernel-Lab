import React from 'react';
import { SimulationMetrics } from '../../types/scheduler';
import { Activity, Gauge, Zap, Repeat } from 'lucide-react';

interface MetricsSummaryProps {
  metrics: SimulationMetrics;
}

export const MetricsSummary: React.FC<MetricsSummaryProps> = ({ metrics }) => {
  if (metrics.processMetrics.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#0e1424] border border-[#1e2a42] rounded-xl p-5 shadow-xl space-y-5 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1b253b]">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider">
            Calculated Scheduling Metrics
          </h4>
        </div>
        <span className="text-xs text-slate-400">
          Formulas: TAT = CT - AT &bull; WT = TAT - BT &bull; RT = FirstCPU - AT
        </span>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 bg-[#090d16] border border-[#1b253b] rounded-lg">
          <span className="text-[10px] text-slate-400 block font-sans">Avg Waiting Time</span>
          <span className="text-lg font-bold text-cyan-300">{metrics.avgWaitingTime}</span>
          <span className="text-[10px] text-slate-500 block">units</span>
        </div>

        <div className="p-3 bg-[#090d16] border border-[#1b253b] rounded-lg">
          <span className="text-[10px] text-slate-400 block font-sans">Avg Turnaround Time</span>
          <span className="text-lg font-bold text-emerald-300">{metrics.avgTurnaroundTime}</span>
          <span className="text-[10px] text-slate-500 block">units</span>
        </div>

        <div className="p-3 bg-[#090d16] border border-[#1b253b] rounded-lg">
          <span className="text-[10px] text-slate-400 block font-sans">Avg Response Time</span>
          <span className="text-lg font-bold text-amber-300">{metrics.avgResponseTime}</span>
          <span className="text-[10px] text-slate-500 block">units</span>
        </div>

        <div className="p-3 bg-[#090d16] border border-[#1b253b] rounded-lg">
          <span className="text-[10px] text-slate-400 block font-sans">CPU Utilization</span>
          <span className="text-lg font-bold text-indigo-300">{metrics.cpuUtilization}%</span>
          <span className="text-[10px] text-slate-500 block">active ratio</span>
        </div>

        <div className="p-3 bg-[#090d16] border border-[#1b253b] rounded-lg">
          <span className="text-[10px] text-slate-400 block font-sans">Throughput</span>
          <span className="text-lg font-bold text-rose-300">{metrics.throughput}</span>
          <span className="text-[10px] text-slate-500 block">proc / unit</span>
        </div>

        <div className="p-3 bg-[#090d16] border border-[#1b253b] rounded-lg">
          <span className="text-[10px] text-slate-400 block font-sans">Context Switches</span>
          <span className="text-lg font-bold text-purple-300">{metrics.contextSwitches}</span>
          <span className="text-[10px] text-slate-500 block">preemptions/switches</span>
        </div>
      </div>

      {/* Per Process Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#1b253b] text-slate-400">
              <th className="pb-2 font-medium">Process</th>
              <th className="pb-2 font-medium">Arrival Time (AT)</th>
              <th className="pb-2 font-medium">Burst Time (BT)</th>
              <th className="pb-2 font-medium">Priority</th>
              <th className="pb-2 font-medium text-cyan-400">Completion Time (CT)</th>
              <th className="pb-2 font-medium text-emerald-400">Turnaround Time (TAT)</th>
              <th className="pb-2 font-medium text-amber-400">Waiting Time (WT)</th>
              <th className="pb-2 font-medium text-purple-400">Response Time (RT)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#151c2e]">
            {metrics.processMetrics.map((pm) => (
              <tr key={pm.processId} className="hover:bg-[#12192c]/50">
                <td className="py-2.5 font-bold text-slate-200">{pm.name}</td>
                <td className="py-2.5 text-slate-300">{pm.arrivalTime}</td>
                <td className="py-2.5 text-slate-300">{pm.burstTime}</td>
                <td className="py-2.5 text-slate-300">{pm.priority}</td>
                <td className="py-2.5 text-cyan-300 font-semibold">{pm.completionTime}</td>
                <td className="py-2.5 text-emerald-300 font-semibold">{pm.turnaroundTime}</td>
                <td className="py-2.5 text-amber-300 font-semibold">{pm.waitingTime}</td>
                <td className="py-2.5 text-purple-300 font-semibold">{pm.responseTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
