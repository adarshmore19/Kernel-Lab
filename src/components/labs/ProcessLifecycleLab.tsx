import React, { useState } from 'react';
import { Activity, RotateCcw, Cpu, Terminal } from 'lucide-react';

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
    NEW: { bg: 'bg-[#ebf2f8]', border: 'border-[#c8d9e8]', text: 'text-[#1e4569]' },
    READY: { bg: 'bg-[#e5eff8]', border: 'border-[#bcd3e6]', text: 'text-[#1e4569]' },
    RUNNING: { bg: 'bg-[#edf5ed]', border: 'border-[#cbe0cc]', text: 'text-[#1e5327]' },
    WAITING: { bg: 'bg-[#fbf3e4]', border: 'border-[#ecd6b2]', text: 'text-[#7d4e08]' },
    TERMINATED: { bg: 'bg-[#eee8db]', border: 'border-[#dfd7c6]', text: 'text-[#78716c]' },
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-[#fdfbf6] border border-[#dfd7c6] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#dfd7c6]">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#2d5a88]" />
            <div>
              <h3 className="text-sm font-bold text-[#2c2825] uppercase tracking-wider font-mono">
                Process State Machine & PCB Inspector
              </h3>
              <p className="text-xs text-[#78716c]">
                Simulate operating system kernel state transitions and observe Process Control Block updates.
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-[#78716c] hover:text-[#2c2825] flex items-center gap-1 font-mono transition-colors"
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
                    ? `${c.bg} ${c.border} ring-2 ring-[#2d5a88] shadow-xs`
                    : 'bg-[#f4f0e5] border-[#dfd7c6] opacity-70'
                }`}
              >
                <span className={`text-xs font-bold font-mono ${c.text}`}>{s}</span>
                <span className="text-[10px] text-[#78716c] block mt-1">
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
        <div className="p-4 bg-[#f4f0e5] border border-[#dfd7c6] rounded-lg space-y-3 font-mono">
          <span className="text-xs text-[#78716c] uppercase tracking-wider block font-semibold">
            Trigger OS Kernel Transition:
          </span>

          <div className="flex flex-wrap gap-2 text-xs">
            {state === 'NEW' && (
              <button
                onClick={() => updateState('READY', 'admit()', 'Process admitted into Ready Queue by Long-Term Scheduler.')}
                className="px-3 py-1.5 bg-[#2d5a88] hover:bg-[#23476d] text-white rounded font-medium transition-colors shadow-2xs"
              >
                Admit to Ready Queue &rarr;
              </button>
            )}

            {state === 'READY' && (
              <button
                onClick={() => updateState('RUNNING', 'dispatch()', 'Short-Term Scheduler dispatched process to CPU.')}
                className="px-3 py-1.5 bg-[#1e5327] hover:bg-[#153f1d] text-white rounded font-medium transition-colors shadow-2xs"
              >
                Dispatch to CPU &rarr;
              </button>
            )}

            {state === 'RUNNING' && (
              <>
                <button
                  onClick={() => updateState('READY', 'interrupt()', 'Quantum expired or higher priority process preempted CPU.')}
                  className="px-3 py-1.5 bg-[#b45309] hover:bg-[#92400e] text-white rounded font-medium transition-colors shadow-2xs"
                >
                  Interrupt / Preempt (Timer Expired)
                </button>
                <button
                  onClick={() => updateState('WAITING', 'io_call()', 'Process requested disk read or network socket; blocked on I/O.')}
                  className="px-3 py-1.5 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded font-medium transition-colors shadow-2xs"
                >
                  I/O or Event Wait (sys_read)
                </button>
                <button
                  onClick={() => updateState('TERMINATED', 'exit()', 'Process finished execution and called sys_exit(0).')}
                  className="px-3 py-1.5 bg-[#9f1239] hover:bg-[#881337] text-white rounded font-medium transition-colors shadow-2xs"
                >
                  Terminate (exit)
                </button>
              </>
            )}

            {state === 'WAITING' && (
              <button
                onClick={() => updateState('READY', 'io_complete()', 'I/O interrupt received; transferred data to user buffer. Moved back to Ready Queue.')}
                className="px-3 py-1.5 bg-[#2d5a88] hover:bg-[#23476d] text-white rounded font-medium transition-colors shadow-2xs"
              >
                I/O Complete (Hardware Interrupt)
              </button>
            )}

            {state === 'TERMINATED' && (
              <span className="text-[#78716c] text-xs py-1">
                Process is terminated. Click Reset State to simulate another process.
              </span>
            )}
          </div>
        </div>

        {/* Live PCB Inspector & Transition Logs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {/* PCB Panel */}
          <div className="p-4 bg-[#f4f0e5] border border-[#dfd7c6] rounded-lg space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#dfd7c6]">
              <span className="text-[#2c2825] font-bold uppercase flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#2d5a88]" />
                PCB (Process Control Block)
              </span>
              <span className="text-[10px] font-mono text-[#1e4569] bg-[#ebf2f8] border border-[#c8d9e8] px-1.5 py-0.5 rounded font-semibold">
                PID: {pcb.pid}
              </span>
            </div>
            <div className="space-y-1 text-[#2c2825]">
              <div className="flex justify-between">
                <span className="text-[#78716c]">State:</span>
                <span className="font-bold text-[#1e4569]">{pcb.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716c]">Program Counter:</span>
                <span className="text-[#2c2825]">{pcb.programCounter}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716c]">Registers:</span>
                <span className="text-[#2c2825]">
                  R0={pcb.registers.R0}, SP={pcb.registers.SP}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716c]">Priority:</span>
                <span className="text-[#2c2825]">{pcb.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716c]">Open File Descriptors:</span>
                <span className="text-[#2c2825]">{pcb.openFiles.length} files</span>
              </div>
            </div>
          </div>

          {/* Kernel Event Log */}
          <div className="p-4 bg-[#f4f0e5] border border-[#dfd7c6] rounded-lg space-y-2">
            <span className="text-[#2c2825] font-bold uppercase flex items-center gap-1.5 pb-2 border-b border-[#dfd7c6]">
              <Terminal className="w-3.5 h-3.5 text-[#78716c]" />
              Kernel Event Audit Log
            </span>
            <div className="space-y-1 text-[11px] text-[#57534e]">
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
