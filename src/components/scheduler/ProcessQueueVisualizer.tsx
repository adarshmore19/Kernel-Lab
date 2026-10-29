import React from 'react';
import { Cpu, CheckCircle2, Clock, Hourglass } from 'lucide-react';
import { Process, TimeSliceRecord } from '../../types/scheduler';

interface ProcessQueueVisualizerProps {
  currentRecord?: TimeSliceRecord;
  processes: Process[];
  currentTime: number;
}

export const ProcessQueueVisualizer: React.FC<ProcessQueueVisualizerProps> = ({
  currentRecord,
  processes,
  currentTime,
}) => {
  const getProcessById = (id: string) => processes.find((p) => p.id === id);

  const runningProc = currentRecord?.runningProcessId
    ? getProcessById(currentRecord.runningProcessId)
    : null;

  const readyProcs = (currentRecord?.readyQueue || [])
    .map(getProcessById)
    .filter(Boolean) as Process[];

  const newProcs = processes.filter((p) => p.arrivalTime > currentTime);

  const terminatedProcs = (currentRecord?.terminatedQueue || [])
    .map(getProcessById)
    .filter(Boolean) as Process[];

  return (
    <div className="bg-[#fdfbf6] border border-[#dfd7c6] rounded-xl p-5 shadow-xs space-y-5 font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-[#dfd7c6]">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#2d5a88]" />
          <span className="text-xs uppercase font-bold text-[#2c2825] tracking-wider">
            Kernel Process Queue & CPU State (t = {currentTime})
          </span>
        </div>
        <span className="text-xs text-[#57534e]">
          State: {runningProc ? <span className="text-[#1e5327] font-bold">BUSY ({runningProc.name})</span> : <span className="text-[#b45309] font-bold">IDLE</span>}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        {/* 1. NEW QUEUE */}
        <div className="bg-[#f4f0e5] border border-[#dfd7c6] rounded-lg p-3 space-y-2 min-h-[140px]">
          <div className="flex items-center justify-between text-[11px] text-[#57534e] pb-1 border-b border-[#dfd7c6]">
            <span className="flex items-center gap-1 font-semibold">
              <Hourglass className="w-3.5 h-3.5 text-[#2d5a88]" />
              NEW / UNARRIVED
            </span>
            <span className="text-[10px] text-[#78716c] font-bold">{newProcs.length}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {newProcs.length === 0 ? (
              <span className="text-[11px] text-[#a8a29e] italic">None pending</span>
            ) : (
              newProcs.map((p) => (
                <div
                  key={p.id}
                  className="px-2.5 py-1 rounded bg-[#fdfbf6] border border-[#dfd7c6] text-xs text-[#2c2825] flex items-center gap-1.5 shadow-2xs"
                >
                  <div
                    className="w-2 h-2 rounded-full border border-[#dfd7c6]"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="font-semibold">{p.name}</span>
                  <span className="text-[10px] text-[#78716c]">t={p.arrivalTime}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. READY QUEUE */}
        <div className="bg-[#ebf2f8]/60 border border-[#c8d9e8] rounded-lg p-3 space-y-2 min-h-[140px]">
          <div className="flex items-center justify-between text-[11px] text-[#1e4569] pb-1 border-b border-[#c8d9e8]">
            <span className="flex items-center gap-1 font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#2d5a88]" />
              READY QUEUE
            </span>
            <span className="text-[10px] text-[#1e4569] font-bold">{readyProcs.length}</span>
          </div>

          <div className="space-y-1.5 pt-1">
            {readyProcs.length === 0 ? (
              <span className="text-[11px] text-[#a8a29e] italic block">Queue empty</span>
            ) : (
              readyProcs.map((p, idx) => (
                <div
                  key={p.id}
                  className="p-1.5 rounded bg-[#fdfbf6] border border-[#c8d9e8] text-xs text-[#2c2825] flex items-center justify-between shadow-2xs"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#78716c] font-bold">#{idx + 1}</span>
                    <div
                      className="w-2 h-2 rounded-full border border-[#dfd7c6]"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="font-bold">{p.name}</span>
                  </div>
                  <div className="text-[10px] text-[#78716c] flex items-center gap-2">
                    <span>BT: {p.burstTime}</span>
                    <span>Pri: {p.priority}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. CPU EXECUTION CORE */}
        <div className="bg-[#f4f0e5] border-2 border-[#1e5327]/60 rounded-lg p-3 flex flex-col items-center justify-center min-h-[140px] text-center relative overflow-hidden shadow-2xs">
          <div className="absolute top-2 left-2 text-[10px] font-bold text-[#57534e] uppercase tracking-widest flex items-center gap-1">
            <Cpu className="w-3 h-3 text-[#1e5327]" />
            CPU CORE
          </div>

          {runningProc ? (
            <div className="space-y-1 mt-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base text-[#1c1917] mx-auto shadow-2xs border border-[#dfd7c6]"
                style={{ backgroundColor: runningProc.color }}
              >
                {runningProc.name}
              </div>
              <div className="text-xs font-bold text-[#2c2825] pt-1">
                PID {runningProc.pid} Running
              </div>
              <div className="text-[10px] text-[#1e5327] font-mono">
                Priority: {runningProc.priority} | Burst: {runningProc.burstTime}
              </div>
            </div>
          ) : (
            <div className="space-y-1 mt-3 text-[#78716c]">
              <div className="w-12 h-12 rounded-xl bg-[#eee8db] border border-[#dfd7c6] flex items-center justify-center text-xs font-bold text-[#78716c] mx-auto">
                IDLE
              </div>
              <span className="text-xs block text-[#78716c]">No process executing</span>
            </div>
          )}
        </div>

        {/* 4. TERMINATED */}
        <div className="bg-[#f4f0e5] border border-[#dfd7c6] rounded-lg p-3 space-y-2 min-h-[140px]">
          <div className="flex items-center justify-between text-[11px] text-[#57534e] pb-1 border-b border-[#dfd7c6]">
            <span className="flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1e5327]" />
              TERMINATED
            </span>
            <span className="text-[10px] text-[#78716c] font-bold">{terminatedProcs.length}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {terminatedProcs.length === 0 ? (
              <span className="text-[11px] text-[#a8a29e] italic">None completed</span>
            ) : (
              terminatedProcs.map((p) => (
                <div
                  key={p.id}
                  className="px-2 py-0.5 rounded bg-[#edf5ed] border border-[#cbe0cc] text-xs text-[#1e5327] flex items-center gap-1 font-medium"
                >
                  <CheckCircle2 className="w-2.5 h-2.5 text-[#1e5327]" />
                  <span>{p.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
