import React, { useState } from 'react';
import { Activity, Play, ArrowRight, RotateCcw, Info, Terminal, Cpu } from 'lucide-react';

type ProcessState = 'NEW' | 'READY' | 'RUNNING' | 'WAITING' | 'TERMINATED';

interface PCB {
  pid: number;
  state: ProcessState;
  programCounter: string;
  registers: { R0: string; R1: string; SP: string };
  priority: number;
  openFiles: string[];
}

export const ProcessLifecycleLab: React.FC = () => {
  const [state, setState] = useState<ProcessState>('NEW');
  const [pcb, setPcb] = useState<PCB>({
    pid: 1042,
    state: 'NEW',
    programCounter: '0x00401020',
    registers: { R0: '0x00000000', R1: '0x00000010', SP: '0x7ffd9820' },
    priority: 2,
    openFiles: ['stdin (0)', 'stdout (1)', 'stderr (2)'],
  });
  const [transitionLog, setTransitionLog] = useState<string[]>([
    'Process created via fork(). PCB allocated in kernel memory.',
  ]);

  const updateState = (newState: ProcessState, actionName: string, detail: string) => {
    setState(newState);
    setPcb((prev) => ({
      ...prev,
      state: newState,
      programCounter:
        newState === 'RUNNING'
          ? '0x00401088'
          : newState === 'TERMINATED'
          ? '0x00000000'
          : prev.programCounter,
    }));
    setTransitionLog((prev) => [
      `[${new Date().toLocaleTimeString()}] ${actionName}: ${detail}`,
      ...prev.slice(0, 7),
    ]);
  };

  const handleReset = () => {
    setState('NEW');
    setPcb({
      pid: Math.floor(Math.random() * 8000) + 1000,
      state: 'NEW',
      programCounter: '0x00401000',
      registers: { R0: '0x00000000', R1: '0x00000005', SP: '0x7ffd9820' },
      priority: 2,
      openFiles: ['stdin (0)', 'stdout (1)', 'stderr (2)'],
    });
    setTransitionLog(['Process re-initialized. Ready for state transitions.']);
  };

  const stateColors: Record<ProcessState, { bg: string; border: string; text: string }> = {
    NEW: { bg: 'bg-blue-950/40', border: 'border-blue-600/60', text: 'text-blue-300' },
    READY: { bg: 'bg-cyan-950/40', border: 'border-cyan-600/60', text: 'text-cyan-300' },
    RUNNING: { bg: 'bg-emerald-950/40', border: 'border-emerald-500', text: 'text-emerald-300' },
    WAITING: { bg: 'bg-amber-950/40', border: 'border-amber-600/60', text: 'text-amber-300' },
    TERMINATED: { bg: 'bg-slate-900', border: 'border-slate-700', text: 'text-slate-400' },
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-[#0e1424] border border-[#1e2a42] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1b253b]">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
                Process State Machine & PCB Inspector
              </h3>
              <p className="text-xs text-slate-400">
                Simulate operating system kernel state transitions and observe Process Control Block updates.
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 font-mono transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset State
          </button>
        </div>

        {/* Visual Lifecycle State Diagram */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          {(['NEW', 'READY', 'RUNNING', 'WAITING', 'TERMINATED'] as ProcessState[]).map((s) => {
            const isActive = state === s;
            const c = stateColors[s];
            return (
              <div
                key={s}
                className={`p-3 rounded-lg border text-center transition-all ${
                  isActive
                    ? `${c.bg} ${c.border} ring-2 ring-cyan-500/50 scale-105 shadow-lg`
                    : 'bg-[#090d16] border-[#1b253b] opacity-60'
                }`}
              >
                <span className={`text-xs font-bold font-mono ${c.text}`}>{s}</span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  {s === 'NEW' && 'Being created'}
                  {s === 'READY' && 'In ready queue'}
                  {s === 'RUNNING' && 'Executing on CPU'}
                  {s === 'WAITING' && 'Blocked on I/O'}
                  {s === 'TERMINATED' && 'Execution finished'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Transition Controls */}
        <div className="p-4 bg-[#080c16] border border-[#1b253b] rounded-lg space-y-3 font-mono">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">
            Trigger OS Kernel Transition:
          </span>

          <div className="flex flex-wrap gap-2 text-xs">
            {state === 'NEW' && (
              <button
                onClick={() => updateState('READY', 'admit()', 'Process admitted into Ready Queue by Long-Term Scheduler.')}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-semibold transition-all"
              >
                Admit to Ready Queue &rarr;
              </button>
            )}

            {state === 'READY' && (
              <button
                onClick={() => updateState('RUNNING', 'dispatch()', 'Short-Term Scheduler dispatched process to CPU.')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold transition-all"
              >
                Dispatch to CPU &rarr;
              </button>
            )}

            {state === 'RUNNING' && (
              <>
                <button
                  onClick={() => updateState('READY', 'interrupt()', 'Quantum expired or higher priority process preempted CPU.')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded font-semibold transition-all"
                >
                  Interrupt / Preempt (Timer Expired)
                </button>
                <button
                  onClick={() => updateState('WAITING', 'io_call()', 'Process requested disk read or network socket; blocked on I/O.')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-semibold transition-all"
                >
                  I/O or Event Wait (sys_read)
                </button>
                <button
                  onClick={() => updateState('TERMINATED', 'exit()', 'Process finished execution and called sys_exit(0).')}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-semibold transition-all"
                >
                  Terminate (exit)
                </button>
              </>
            )}

            {state === 'WAITING' && (
              <button
                onClick={() => updateState('READY', 'io_complete()', 'I/O interrupt received; transferred data to user buffer. Moved back to Ready Queue.')}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-semibold transition-all"
              >
                I/O Complete (Hardware Interrupt)
              </button>
            )}

            {state === 'TERMINATED' && (
              <span className="text-slate-500 text-xs py-1">
                Process is terminated. Click Reset State to simulate another process.
              </span>
            )}
          </div>
        </div>

        {/* Live PCB Inspector & Transition Logs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {/* PCB Panel */}
          <div className="p-4 bg-[#080c16] border border-[#1b253b] rounded-lg space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-900">
              <span className="text-slate-400 font-bold uppercase flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                PCB (Process Control Block)
              </span>
              <span className="text-[10px] text-cyan-400">PID: {pcb.pid}</span>
            </div>
            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">State:</span>
                <span className="font-bold text-cyan-300">{pcb.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Program Counter:</span>
                <span className="text-slate-200">{pcb.programCounter}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Registers:</span>
                <span className="text-slate-200">
                  R0={pcb.registers.R0}, SP={pcb.registers.SP}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Priority:</span>
                <span className="text-slate-200">{pcb.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Open File Descriptors:</span>
                <span className="text-slate-200">{pcb.openFiles.length} files</span>
              </div>
            </div>
          </div>

          {/* Kernel Event Log */}
          <div className="p-4 bg-[#080c16] border border-[#1b253b] rounded-lg space-y-2">
            <span className="text-slate-400 font-bold uppercase flex items-center gap-1.5 pb-2 border-b border-slate-900">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              Kernel Event Audit Log
            </span>
            <div className="space-y-1 text-[11px] text-slate-400">
              {transitionLog.map((log, idx) => (
                <div key={idx} className="leading-tight truncate">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
