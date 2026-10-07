import React from 'react';
import { GanttBlock } from '../../types/scheduler';

interface GanttChartProps {
  ganttChart: GanttBlock[];
  currentTime: number;
  totalTime: number;
  onTimeSeek?: (time: number) => void;
}

export const GanttChart: React.FC<GanttChartProps> = ({
  ganttChart,
  currentTime,
  totalTime,
  onTimeSeek,
}) => {
  if (ganttChart.length === 0 || totalTime === 0) {
    return (
      <div className="p-8 text-center bg-[#090d16] border border-[#1e2738] rounded-xl text-slate-500 font-mono text-xs">
        No active execution timeline. Add processes or run simulation.
      </div>
    );
  }

  // Calculate current scrubber percentage
  const scrubberPercentage = Math.min(100, Math.max(0, (currentTime / totalTime) * 100));

  return (
    <div className="bg-[#0e1424] border border-[#1e2a42] rounded-xl p-5 shadow-xl space-y-4 font-mono">
      <div className="flex items-center justify-between pb-2 border-b border-[#1b253b]">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            CPU Execution Gantt Chart
          </span>
          <span className="text-xs text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
            Total Span: {totalTime} units
          </span>
        </div>
        <div className="text-xs text-slate-400">
          Scrubber Time: <strong className="text-emerald-400 text-sm">{currentTime}</strong> / {totalTime}
        </div>
      </div>

      {/* Main Gantt Bar Container */}
      <div className="relative pt-6 pb-8">
        {/* Scrubber needle */}
        <div
          className="absolute top-0 bottom-2 w-0.5 bg-emerald-400 z-20 pointer-events-none transition-all duration-150 shadow-[0_0_10px_#34d399]"
          style={{ left: `${scrubberPercentage}%` }}
        >
          <div className="absolute -top-3 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
            t={currentTime}
          </div>
        </div>

        {/* Blocks Row */}
        <div className="w-full flex h-14 rounded-lg overflow-hidden border border-[#212f4d] bg-[#080c16] relative select-none">
          {ganttChart.map((block) => {
            const duration = block.endTime - block.startTime;
            const widthPercent = (duration / totalTime) * 100;
            const isCurrent = currentTime >= block.startTime && currentTime < block.endTime;

            if (block.isIdle) {
              return (
                <div
                  key={block.id}
                  style={{ width: `${widthPercent}%` }}
                  onClick={() => onTimeSeek?.(block.startTime)}
                  title={`IDLE: ${block.startTime} → ${block.endTime} (${duration} units)`}
                  className={`h-full flex flex-col items-center justify-center bg-[repeating-linear-gradient(45deg,#111827,#111827_6px,#1e293b_6px,#1e293b_12px)] text-slate-500 text-xs font-semibold border-r border-[#1b253b] cursor-pointer hover:opacity-90 transition-opacity ${
                    isCurrent ? 'ring-2 ring-amber-400/80 z-10' : ''
                  }`}
                >
                  <span className="text-[11px] tracking-widest uppercase">IDLE</span>
                  <span className="text-[9px] text-slate-600 font-normal">({duration})</span>
                </div>
              );
            }

            return (
              <div
                key={block.id}
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: block.color || '#38bdf8',
                }}
                onClick={() => onTimeSeek?.(block.startTime)}
                title={`${block.processName}: ${block.startTime} → ${block.endTime} (${duration} units)`}
                className={`h-full flex flex-col items-center justify-center text-slate-950 text-xs font-bold border-r border-slate-900/40 cursor-pointer hover:brightness-110 transition-all ${
                  isCurrent ? 'ring-2 ring-white shadow-lg z-10 brightness-110' : 'opacity-90'
                }`}
              >
                <span className="truncate px-1">{block.processName}</span>
                <span className="text-[10px] font-normal opacity-85">[{duration}]</span>
              </div>
            );
          })}
        </div>

        {/* Timeline Ticks / Timestamp Labels */}
        <div className="relative w-full h-5 mt-2">
          {ganttChart.map((block, idx) => {
            const startPercent = (block.startTime / totalTime) * 100;
            return (
              <div
                key={`tick-${block.id}`}
                className="absolute text-[11px] text-slate-400 font-mono -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${startPercent}%` }}
              >
                <div className="w-0.5 h-1.5 bg-[#212f4d] mb-0.5" />
                <span>{block.startTime}</span>
              </div>
            );
          })}
          {/* Final timestamp tick */}
          <div
            className="absolute text-[11px] text-slate-400 font-mono -translate-x-1/2 flex flex-col items-center"
            style={{ left: '100%' }}
          >
            <div className="w-0.5 h-1.5 bg-[#212f4d] mb-0.5" />
            <span>{totalTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
