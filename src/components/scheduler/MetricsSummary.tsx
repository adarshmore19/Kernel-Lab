import React from 'react';
import { SimulationMetrics } from '../../types/scheduler';
import { Activity } from 'lucide-react';

interface MetricsSummaryProps {
  metrics: SimulationMetrics;
}

export const MetricsSummary: React.FC<MetricsSummaryProps> = ({ metrics }) => {
  if (metrics.processMetrics.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#fdfbf6] border border-[#dfd7c6] rounded-xl p-5 shadow-xs space-y-5 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#dfd7c6]">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#2d5a88]" />
          <h4 className="text-xs uppercase font-bold text-[#2c2825] tracking-wider">
            Calculated Scheduling Metrics
          </h4>
        </div>
        <span className="text-xs text-[#78716c]">
          Formulas: TAT = CT - AT &bull; WT = TAT - BT &bull; RT = FirstCPU - AT
        </span>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 bg-[#f4f0e5] border border-[#dfd7c6] rounded-lg">
          <span className="text-[10px] text-[#78716c] block font-sans">Avg Waiting Time</span>
          <span className="text-lg font-bold text-[#2d5a88]">{metrics.avgWaitingTime}</span>
          <span className="text-[10px] text-[#a8a29e] block">units</span>
        </div>

        <div className="p-3 bg-[#f4f0e5] border border-[#dfd7c6] rounded-lg">
          <span className="text-[10px] text-[#78716c] block font-sans">Avg Turnaround Time</span>
          <span className="text-lg font-bold text-[#1e5327]">{metrics.avgTurnaroundTime}</span>
          <span className="text-[10px] text-[#a8a29e] block">units</span>
        </div>

        <div className="p-3 bg-[#f4f0e5] border border-[#dfd7c6] rounded-lg">
          <span className="text-[10px] text-[#78716c] block font-sans">Avg Response Time</span>
          <span className="text-lg font-bold text-[#b45309]">{metrics.avgResponseTime}</span>
          <span className="text-[10px] text-[#a8a29e] block">units</span>
        </div>

        <div className="p-3 bg-[#f4f0e5] border border-[#dfd7c6] rounded-lg">
          <span className="text-[10px] text-[#78716c] block font-sans">CPU Utilization</span>
          <span className="text-lg font-bold text-[#2c2825]">{metrics.cpuUtilization}%</span>
          <span className="text-[10px] text-[#a8a29e] block">active ratio</span>
        </div>

        <div className="p-3 bg-[#f4f0e5] border border-[#dfd7c6] rounded-lg">
          <span className="text-[10px] text-[#78716c] block font-sans">Throughput</span>
          <span className="text-lg font-bold text-[#2c2825]">{metrics.throughput}</span>
          <span className="text-[10px] text-[#a8a29e] block">proc / unit</span>
        </div>

        <div className="p-3 bg-[#f4f0e5] border border-[#dfd7c6] rounded-lg">
          <span className="text-[10px] text-[#78716c] block font-sans">Context Switches</span>
          <span className="text-lg font-bold text-[#2c2825]">{metrics.contextSwitches}</span>
          <span className="text-[10px] text-[#a8a29e] block">preemptions</span>
        </div>
      </div>

      {/* Per Process Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#dfd7c6] text-[#78716c]">
              <th className="pb-2 font-medium">Process</th>
              <th className="pb-2 font-medium">Arrival Time (AT)</th>
              <th className="pb-2 font-medium">Burst Time (BT)</th>
              <th className="pb-2 font-medium">Priority</th>
              <th className="pb-2 font-medium text-[#2d5a88]">Completion Time (CT)</th>
              <th className="pb-2 font-medium text-[#1e5327]">Turnaround Time (TAT)</th>
              <th className="pb-2 font-medium text-[#b45309]">Waiting Time (WT)</th>
              <th className="pb-2 font-medium text-[#6b21a8]">Response Time (RT)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dfd7c6]/60 text-[#2c2825]">
            {metrics.processMetrics.map((pm) => (
              <tr key={pm.processId} className="hover:bg-[#f5f0e1]/60">
                <td className="py-2.5 font-bold text-[#1c1917]">{pm.name}</td>
                <td className="py-2.5 text-[#57534e]">{pm.arrivalTime}</td>
                <td className="py-2.5 text-[#57534e]">{pm.burstTime}</td>
                <td className="py-2.5 text-[#57534e]">{pm.priority}</td>
                <td className="py-2.5 text-[#2d5a88] font-semibold">{pm.completionTime}</td>
                <td className="py-2.5 text-[#1e5327] font-semibold">{pm.turnaroundTime}</td>
                <td className="py-2.5 text-[#b45309] font-semibold">{pm.waitingTime}</td>
                <td className="py-2.5 text-[#6b21a8] font-semibold">{pm.responseTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
