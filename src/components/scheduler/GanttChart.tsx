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
      <div className="p-8 text-center bg-[#fdfbf6] border border-[#dfd7c6] rounded-xl text-[#78716c] font-mono text-xs">
        No active execution timeline. Add processes or run simulation.
      </div>
    );
  }

  // Calculate current scrubber percentage
  const scrubberPercentage = Math.min(100, Math.max(0, (currentTime / totalTime) * 100));

  return (
    <div className="bg-[#fdfbf6] border border-[#dfd7c6] rounded-xl p-5 shadow-xs space-y-4 font-mono">
      <div className="flex items-center justify-between pb-2 border-b border-[#dfd7c6]">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold text-[#2c2825] tracking-wider">
            CPU Execution Gantt Chart
          </span>
          <span className="text-xs text-[#1e4569] bg-[#ebf2f8] px-2 py-0.5 rounded border border-[#c8d9e8]">
            Total Span: {totalTime} units
          </span>
        </div>
        <div className="text-xs text-[#57534e]">
          Scrubber Time: <strong className="text-[#2d5a88] text-sm">{currentTime}</strong> / {totalTime}
        </div>
      </div>

      {/* Main Gantt Bar Container */}
      <div className="relative pt-6 pb-8">
        {/* Scrubber needle */}
        <div
          className="absolute top-0 bottom-2 w-0.5 bg-[#2d5a88] z-20 pointer-events-none transition-all duration-150"
          style={{ left: `${scrubberPercentage}%` }}
        >
          <div className="absolute -top-3 -translate-x-1/2 bg-[#2d5a88] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-2xs">
            t={currentTime}
          </div>
        </div>

        {/* Blocks Row */}
        <div className="w-full flex h-14 rounded-lg overflow-hidden border border-[#dfd7c6] bg-[#eee8db] relative select-none">
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
                  className={`h-full flex flex-col items-center justify-center bg-[#e4ddd0] text-[#78716c] text-xs font-semibold border-r border-[#dfd7c6] cursor-pointer hover:bg-[#ded6c5] transition-colors ${
                    isCurrent ? 'ring-2 ring-[#2d5a88] z-10' : ''
                  }`}
                >
                  <span className="text-[11px] tracking-wider uppercase font-semibold">IDLE</span>
                  <span className="text-[9px] text-[#78716c] font-normal">({duration})</span>
                </div>
              );
            }

            return (
              <div
                key={block.id}
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: block.color || '#93c5fd',
                }}
                onClick={() => onTimeSeek?.(block.startTime)}
                title={`${block.processName}: ${block.startTime} → ${block.endTime} (${duration} units)`}
                className={`h-full flex flex-col items-center justify-center text-[#1c1917] text-xs font-bold border-r border-[#dfd7c6]/80 cursor-pointer hover:opacity-90 transition-all ${
                  isCurrent ? 'ring-2 ring-[#2d5a88] shadow-2xs z-10' : ''
                }`}
              >
                <span className="truncate px-1">{block.processName}</span>
                <span className="text-[10px] font-medium text-[#44403c]">[{duration}]</span>
              </div>
            );
          })}
        </div>

        {/* Timeline Ticks / Timestamp Labels */}
        <div className="relative w-full h-5 mt-2">
          {ganttChart.map((block) => {
            const startPercent = (block.startTime / totalTime) * 100;
            return (
              <div
                key={`tick-${block.id}`}
                className="absolute text-[11px] text-[#78716c] font-mono -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${startPercent}%` }}
              >
                <div className="w-0.5 h-1.5 bg-[#dfd7c6] mb-0.5" />
                <span>{block.startTime}</span>
              </div>
            );
          })}
          {/* Final timestamp tick */}
          <div
            className="absolute text-[11px] text-[#78716c] font-mono -translate-x-1/2 flex flex-col items-center"
            style={{ left: '100%' }}
          >
            <div className="w-0.5 h-1.5 bg-[#dfd7c6] mb-0.5" />
            <span>{totalTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
