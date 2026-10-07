import React from 'react';
import { Cpu, ArrowDown, CheckCircle2, Clock, Hourglass } from 'lucide-react';
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
    <div className="bg-[#0e1424] border border-[#1e2a42] rounded-xl p-5 shadow-xl space-y-5 font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-[#1b253b]">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="text-xs uppercase font-bold text-slate-300 tracking-wider">
            Kernel Process Queue & CPU State (t = {currentTime})
          </span>
        </div>
        <span className="text-xs text-slate-400">
          State: {runningProc ? <span className="text-emerald-400 font-bold">BUSY ({runningProc.name})</span> : <span className="text-amber-400 font-bold">IDLE</span>}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        {/* 1. NEW QUEUE */}
        <div className="bg-[#090d16] border border-[#1b253b] rounded-lg p-3 space-y-2 min-h-[140px]">
          <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-900">
            <span className="flex items-center gap-1">
              <Hourglass className="w-3.5 h-3.5 text-blue-400" />
              NEW / UNARRIVED
            </span>
            <span className="text-[10px] text-slate-500">{newProcs.length}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {newProcs.length === 0 ? (
              <span className="text-[11px] text-slate-600 italic">None pending</span>
            ) : (
              newProcs.map((p) => (
                <div
                  key={p.id}
                  className="px-2.5 py-1 rounded bg-[#131b2e] border border-[#1e2a42] text-xs text-slate-300 flex items-center gap-1.5"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                  <span>{p.name}</span>
                  <span className="text-[10px] text-slate-500">at t={p.arrivalTime}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. READY QUEUE */}
        <div className="bg-[#090d16] border border-cyan-900/40 rounded-lg p-3 space-y-2 min-h-[140px]">
          <div className="flex items-center justify-between text-[11px] text-cyan-300 pb-1 border-b border-cyan-950">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              READY QUEUE
            </span>
            <span className="text-[10px] text-cyan-400/80 font-bold">{readyProcs.length}</span>
          </div>

          <div className="space-y-1.5 pt-1">
            {readyProcs.length === 0 ? (
              <span className="text-[11px] text-slate-600 italic block">Queue empty</span>
            ) : (
              readyProcs.map((p, idx) => (
                <div
                  key={p.id}
                  className="p-1.5 rounded bg-[#101a2f] border border-cyan-800/40 text-xs text-cyan-100 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 font-bold">#{idx + 1}</span>
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="font-bold">{p.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2">
                    <span>BT: {p.burstTime}</span>
                    <span>Pri: {p.priority}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. CPU EXECUTION CORE */}
        <div className="bg-[#090d16] border-2 border-emerald-500/40 rounded-lg p-3 flex flex-col items-center justify-center min-h-[140px] text-center relative overflow-hidden shadow-lg">
          <div className="absolute top-2 left-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Cpu className="w-3 h-3 text-emerald-400" />
            CPU CORE
          </div>

          {runningProc ? (
            <div className="space-y-1 mt-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base text-slate-950 mx-auto shadow-md ring-4 ring-emerald-500/20 animate-pulse"
                style={{ backgroundColor: runningProc.color }}
              >
                {runningProc.name}
              </div>
              <div className="text-xs font-bold text-slate-100 pt-1">
                PID {runningProc.pid} Running
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">
                Priority: {runningProc.priority} | Burst: {runningProc.burstTime}
              </div>
            </div>
          ) : (
            <div className="space-y-1 mt-3 text-slate-500">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 mx-auto">
                IDLE
              </div>
              <span className="text-xs block text-slate-500">No process executing</span>
            </div>
          )}
        </div>

        {/* 4. TERMINATED */}
        <div className="bg-[#090d16] border border-[#1b253b] rounded-lg p-3 space-y-2 min-h-[140px]">
          <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-900">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              TERMINATED
            </span>
            <span className="text-[10px] text-slate-500">{terminatedProcs.length}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {terminatedProcs.length === 0 ? (
              <span className="text-[11px] text-slate-600 italic">None completed</span>
            ) : (
              terminatedProcs.map((p) => (
                <div
                  key={p.id}
                  className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
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
