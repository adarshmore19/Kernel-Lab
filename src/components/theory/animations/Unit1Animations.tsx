import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Network,
  Cpu,
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Server,
  ArrowRight,
  Database,
  Radio,
} from 'lucide-react';

// ==========================================
// 1. RTOS DEADLINE & PRIORITY INVERSION VISUALIZER
// ==========================================
export const RTOSDeadlineVisualizer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [mode, setMode] = useState<'hard' | 'soft'>('hard');
  const [usePriorityInheritance, setUsePriorityInheritance] = useState(false);
  const [activeTask, setActiveTask] = useState<'T_HIGH' | 'T_MED' | 'T_LOW' | 'IDLE'>('IDLE');
  const [log, setLog] = useState<string[]>([
    'System initialized. Hard RTOS scheduler running at 1000Hz deterministic rate.',
  ]);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setTime((prev) => {
          if (prev >= 14) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 900);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    if (time === 0) {
      setActiveTask('IDLE');
    } else if (time >= 1 && time < 3) {
      setActiveTask('T_LOW');
      if (time === 1) addLog('t=1: Task T_LOW (Sensor Polling) starts & acquires Mutex M.');
    } else if (time >= 3 && time < 4) {
      setActiveTask('T_MED');
      if (time === 3) addLog('t=3: Task T_MED (Telemetry Network) arrives. Preempts T_LOW.');
    } else if (time >= 4 && time <= 9) {
      if (time === 4) addLog('t=4: CRITICAL Task T_HIGH (Airbag/Thruster) arrives! Demands Mutex M.');
      if (usePriorityInheritance) {
        if (time < 6) {
          setActiveTask('T_LOW');
          addLog(`t=${time}: [PRIORITY INHERITANCE] T_LOW boosted to HIGH priority to release Mutex M!`);
        } else if (time >= 6 && time <= 8) {
          setActiveTask('T_HIGH');
          addLog(`t=${time}: Mutex M released. T_HIGH acquires lock & executes on time!`);
        } else {
          setActiveTask('T_MED');
          addLog(`t=${time}: T_HIGH finished. T_MED completes execution.`);
        }
      } else {
        if (time < 6) {
          setActiveTask('T_MED');
          addLog(`t=${time}: [PRIORITY INVERSION] T_MED runs! T_HIGH is blocked waiting for T_LOW.`);
        } else if (time < 8) {
          setActiveTask('T_LOW');
          addLog(`t=${time}: T_MED done. T_LOW finally resumes to finish holding Mutex M.`);
        } else {
          setActiveTask('T_HIGH');
          if (mode === 'hard') {
            addLog(`t=${time}: DEADLINE MISSED! T_HIGH finishes past deadline t=8. SYSTEM HALT!`);
          } else {
            addLog(`t=${time}: Soft deadline exceeded. Result delivered late with degraded QoS.`);
          }
        }
      }
    } else if (time > 9 && time <= 12) {
      setActiveTask(time <= 10 ? 'T_MED' : 'IDLE');
    } else {
      setActiveTask('IDLE');
    }
  }, [time, usePriorityInheritance, mode]);

  const addLog = (msg: string) => {
    setLog((prev) => [msg, ...prev.slice(0, 5)]);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
    setActiveTask('IDLE');
    setLog(['Simulation reset. Ready.']);
  };

  return (
    <div className="bg-white border border-[#dfd7c6] rounded-xl p-5 space-y-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#dfd7c6]/60">
        <div>
          <h4 className="font-mono font-bold text-sm text-[#2c2825]">
            RTOS Execution & Priority Inversion Visualizer
          </h4>
          <p className="text-xs text-[#78716c]">
            Observe deterministic task deadlines, priority inversion pitfalls, and Priority Inheritance Protocol.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2d5a88] text-white text-xs font-semibold hover:bg-[#23476c] transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-[#78716c] hover:text-[#2c2825] hover:bg-[#f5f0e1] transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Controls Bar - Flat, No Nested Card Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-3 border-b border-[#dfd7c6]/60 text-xs">
        <div>
          <span className="text-[#78716c] text-[11px] font-mono block mb-1">System Mode:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setMode('hard')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
                mode === 'hard'
                  ? 'bg-[#9f1239] text-white'
                  : 'text-[#57534e] hover:bg-stone-100'
              }`}
            >
              Hard RTOS (Airbag)
            </button>
            <button
              onClick={() => setMode('soft')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
                mode === 'soft'
                  ? 'bg-[#2d5a88] text-white'
                  : 'text-[#57534e] hover:bg-stone-100'
              }`}
            >
              Soft RTOS (Stream)
            </button>
          </div>
        </div>

        <div>
          <span className="text-[#78716c] text-[11px] font-mono block mb-1">Priority Protocol:</span>
          <button
            onClick={() => setUsePriorityInheritance(!usePriorityInheritance)}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
              usePriorityInheritance
                ? 'bg-[#1e5327] text-white'
                : 'text-[#b45309] bg-amber-50 hover:bg-amber-100'
            }`}
          >
            {usePriorityInheritance ? '✓ Inheritance Active' : 'Inheritance Disabled'}
          </button>
        </div>

        <div>
          <span className="text-[#78716c] text-[11px] font-mono block mb-1">Timeline: t = {time} ms</span>
          <input
            type="range"
            min={0}
            max={14}
            value={time}
            onChange={(e) => setTime(Number(e.target.value))}
            className="w-full accent-[#2d5a88]"
          />
        </div>
      </div>

      {/* Real-time Timeline Visualization */}
      <div className="space-y-2 pt-1">
        {/* Task High */}
        <div className="flex items-center gap-3">
          <div className="w-28 text-xs font-mono font-bold text-[#9f1239] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#9f1239]"></span>
            T_HIGH
          </div>
          <div className="flex-1 grid grid-cols-15 gap-1 bg-stone-100 p-1 rounded-md">
            {Array.from({ length: 15 }).map((_, i) => {
              const isCurrent = time === i;
              const hasRun = usePriorityInheritance ? i >= 6 && i <= 8 : i >= 8 && i <= 10;
              const isDeadline = i === 8;
              return (
                <div
                  key={i}
                  className={`h-6 rounded text-[10px] font-mono flex flex-col items-center justify-center transition-all ${
                    isCurrent ? 'ring-2 ring-[#2c2825]' : ''
                  } ${
                    hasRun
                      ? 'bg-[#9f1239] text-white font-bold'
                      : i < 4
                      ? 'text-[#a8a29e]'
                      : 'bg-[#ebd5da] text-[#9f1239]'
                  } ${isDeadline ? 'border-r-2 border-r-red-600' : ''}`}
                >
                  <span>{i}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Med */}
        <div className="flex items-center gap-3">
          <div className="w-28 text-xs font-mono font-bold text-[#b45309] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#b45309]"></span>
            T_MED
          </div>
          <div className="flex-1 grid grid-cols-15 gap-1 bg-stone-100 p-1 rounded-md">
            {Array.from({ length: 15 }).map((_, i) => {
              const isCurrent = time === i;
              const hasRun = usePriorityInheritance
                ? (i >= 3 && i < 4) || (i >= 9 && i <= 10)
                : i >= 3 && i <= 5;
              return (
                <div
                  key={i}
                  className={`h-6 rounded text-[10px] font-mono flex items-center justify-center transition-all ${
                    isCurrent ? 'ring-2 ring-[#2c2825]' : ''
                  } ${
                    hasRun
                      ? 'bg-[#b45309] text-white font-bold'
                      : i < 3
                      ? 'text-[#a8a29e]'
                      : 'bg-[#f4ebd0] text-[#7d4e08]'
                  }`}
                >
                  {i}
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Low */}
        <div className="flex items-center gap-3">
          <div className="w-28 text-xs font-mono font-bold text-[#1e5327] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1e5327]"></span>
            T_LOW
          </div>
          <div className="flex-1 grid grid-cols-15 gap-1 bg-stone-100 p-1 rounded-md">
            {Array.from({ length: 15 }).map((_, i) => {
              const isCurrent = time === i;
              const hasRun = usePriorityInheritance
                ? (i >= 1 && i < 3) || (i >= 4 && i < 6)
                : (i >= 1 && i < 3) || (i >= 6 && i < 8);
              return (
                <div
                  key={i}
                  className={`h-6 rounded text-[10px] font-mono flex items-center justify-center transition-all ${
                    isCurrent ? 'ring-2 ring-[#2c2825]' : ''
                  } ${
                    hasRun
                      ? 'bg-[#1e5327] text-white font-bold'
                      : i < 1
                      ? 'text-[#a8a29e]'
                      : 'bg-[#d8ebd9] text-[#1e5327]'
                  }`}
                >
                  {i}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Outcome Banner - Clean left-border callout */}
      <div
        className={`border-l-3 pl-3 py-1.5 text-xs font-mono ${
          time >= 9 && !usePriorityInheritance && mode === 'hard'
            ? 'border-red-600 text-red-900 bg-red-50/50'
            : time >= 9 && usePriorityInheritance
            ? 'border-emerald-600 text-emerald-900 bg-emerald-50/50'
            : 'border-[#2d5a88] text-[#1e4569]'
        }`}
      >
        {time >= 9 && !usePriorityInheritance && mode === 'hard' ? (
          <div>
            <strong>DEADLINE MISSED AT t=8:</strong> Priority Inversion occurred because T_MED preempted T_LOW holding Mutex M.
          </div>
        ) : time >= 9 && usePriorityInheritance ? (
          <div>
            <strong>ALL DEADLINES MET:</strong> Priority Inheritance elevated T_LOW to finish Mutex M on time.
          </div>
        ) : (
          <div>
            Active CPU Task: <strong>{activeTask}</strong> • Deterministic rate: 1 kHz
          </div>
        )}
      </div>

      {/* Event Log Console - Clean, Minimal */}
      <div className="bg-[#1c1917] text-[#a8a29e] p-3 rounded-lg font-mono text-xs space-y-1">
        {log.map((entry, idx) => (
          <div key={idx} className={idx === 0 ? 'text-[#38bdf8]' : 'opacity-65'}>
            ❯ {entry}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 2. DISTRIBUTED OS RPC & CLUSTER VISUALIZER
// ==========================================
export const DistributedClusterVisualizer: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [failedNode, setFailedNode] = useState<number | null>(null);

  const steps = [
    { title: 'Client Invocation', desc: 'Client process executes local RPC stub: file_write("/data/sales.csv", chunk)' },
    { title: 'Marshaling & Flight', desc: 'Parameters serialized into network packet and transmitted over cluster bus.' },
    { title: 'Storage Execution', desc: 'Node 2 receives RPC, executes local kernel write, and replicates to Node 3.' },
    { title: 'Consensus & Acknowledgment', desc: 'Quorum reached. Acknowledgment packet routed back to Client. Full Location Transparency!' },
  ];

  const handleNext = () => {
    setActiveStep((prev) => (prev + 1) % steps.length);
  };

  const triggerNodeFailure = (nodeId: number) => {
    setFailedNode(failedNode === nodeId ? null : nodeId);
  };

  return (
    <div className="bg-white border border-[#dfd7c6] rounded-xl p-5 space-y-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#dfd7c6]/60">
        <div>
          <h4 className="font-mono font-bold text-sm text-[#2c2825]">
            Distributed OS Cluster & RPC Transparency Simulator
          </h4>
          <p className="text-xs text-[#78716c]">
            Single System Image (SSI), Remote Procedure Calls, location transparency, and fault tolerance.
          </p>
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2d5a88] text-white text-xs font-semibold hover:bg-[#23476c] transition-colors"
        >
          <span>Next RPC Step</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cluster Nodes - Clean 4-Column Grid, No Intermediate Box Wrapper */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-2">
        {/* Client Node */}
        <div
          className={`p-3 rounded-lg text-center transition-all ${
            activeStep === 0 || activeStep === 3
              ? 'bg-[#ebf2f8] text-[#1e4569] font-bold'
              : 'bg-stone-50 text-[#57534e]'
          }`}
        >
          <Server className="w-5 h-5 mx-auto mb-1.5 opacity-80" />
          <span className="font-mono text-xs block">Node 1 (Client)</span>
          <span className="text-[10px] text-[#78716c] block">posix_write()</span>
        </div>

        {/* Master Coordinator */}
        <div
          className={`p-3 rounded-lg text-center transition-all ${
            activeStep === 1
              ? 'bg-[#fbf3e4] text-[#b45309] font-bold'
              : 'bg-stone-50 text-[#57534e]'
          }`}
        >
          <Radio className="w-5 h-5 mx-auto mb-1.5 opacity-80" />
          <span className="font-mono text-xs block">Borg / Master</span>
          <span className="text-[10px] text-[#78716c] block">RPC Scheduler</span>
        </div>

        {/* Storage Node 2 */}
        <div
          onClick={() => triggerNodeFailure(2)}
          className={`p-3 rounded-lg cursor-pointer text-center transition-all ${
            failedNode === 2
              ? 'bg-rose-100 text-rose-800'
              : activeStep === 2
              ? 'bg-[#edf5ed] text-[#1e5327] font-bold'
              : 'bg-stone-50 text-[#57534e]'
          }`}
        >
          <Database className="w-5 h-5 mx-auto mb-1.5 opacity-80" />
          <span className="font-mono text-xs block">Node 2 (Worker)</span>
          <span className="text-[10px] block opacity-75">
            {failedNode === 2 ? 'CRASHED' : 'Click to toggle fail'}
          </span>
        </div>

        {/* Replica Node 3 */}
        <div
          onClick={() => triggerNodeFailure(3)}
          className={`p-3 rounded-lg cursor-pointer text-center transition-all ${
            failedNode === 3
              ? 'bg-rose-100 text-rose-800'
              : activeStep === 2 || activeStep === 3
              ? 'bg-[#edf5ed] text-[#1e5327] font-bold'
              : 'bg-stone-50 text-[#57534e]'
          }`}
        >
          <Database className="w-5 h-5 mx-auto mb-1.5 opacity-80" />
          <span className="font-mono text-xs block">Node 3 (Replica)</span>
          <span className="text-[10px] block opacity-75">
            {failedNode === 3 ? 'CRASHED' : 'Paxos Log'}
          </span>
        </div>
      </div>

      {/* Step Explanation Callout */}
      <div className="border-l-3 border-[#2d5a88] pl-3 py-1.5 text-xs font-mono text-[#1e4569]">
        <strong>Phase [{activeStep + 1}/4]: {steps[activeStep].title}</strong> — {steps[activeStep].desc}
        {failedNode && (
          <span className="text-rose-700 block mt-0.5">
            Node {failedNode} is down. Consensus automatically routes replicas to healthy nodes.
          </span>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 3. SYSTEM CALL HARDWARE TRAP ANIMATION
// ==========================================
export const SystemCallTrapVisualizer: React.FC = () => {
  const [step, setStep] = useState(0);

  const stages = [
    {
      ring: 'Ring 3 (User Space)',
      name: '1. User Library Call',
      detail: 'Application invokes write(fd, "KernelLab", 9). Standard C library glibc prepares parameters in CPU registers.',
      registers: { RAX: '1 (sys_write)', RDI: '1 (stdout)', RSI: '0x7ffeb020', RDX: '9' },
      modeBit: '1 (User Mode)',
    },
    {
      ring: 'Hardware CPU Trap Boundary',
      name: '2. SYSCALL Trap Instruction',
      detail: 'CPU executes SYSCALL opcode. Hardware flips mode bit from 1 to 0, saves user PC into RCX, and jumps to kernel entry point.',
      registers: { RAX: '1', RCX: '0x004010a8 (Saved PC)', R11: '0x0246 (Flags)', Mode: 'Ring 0' },
      modeBit: '0 (Kernel Mode)',
    },
    {
      ring: 'Ring 0 (Kernel Space)',
      name: '3. System Call Table Lookup',
      detail: 'Kernel indexes sys_call_table[RAX=1] -> jumps to sys_write() handler in kernel memory. Validates buffer pointers.',
      registers: { Table: 'sys_call_table[1]', Handler: 'sys_write()', Priv: 'Supervisor Ring 0' },
      modeBit: '0 (Kernel Mode)',
    },
    {
      ring: 'Ring 0 (Kernel Space)',
      name: '4. Hardware Driver Output',
      detail: 'Kernel invokes console/terminal TTY driver. Characters written to display device controller registers.',
      registers: { Device: 'TTY0 Console', BytesWritten: '9 bytes', Status: 'Success' },
      modeBit: '0 (Kernel Mode)',
    },
    {
      ring: 'Hardware CPU Sysret Boundary',
      name: '5. SYSRET & Resume Execution',
      detail: 'Kernel places return value in RAX (9). Executes SYSRET instruction. Hardware flips mode bit back to 1. User app continues.',
      registers: { RAX: '9 (Bytes Returned)', RIP: '0x004010aa', Mode: 'Ring 3' },
      modeBit: '1 (User Mode)',
    },
  ];

  return (
    <div className="bg-white border border-[#dfd7c6] rounded-xl p-5 space-y-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#dfd7c6]/60">
        <div>
          <h4 className="font-mono font-bold text-sm text-[#2c2825]">
            System Call Trap & Dual-Mode Ring Transition
          </h4>
          <p className="text-xs text-[#78716c]">
            Interactive step-by-step trace of CPU mode switches (Ring 3 User Mode to Ring 0 Kernel Mode).
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setStep((prev) => Math.max(0, prev - 1))}
            disabled={step === 0}
            className="px-2.5 py-1 text-xs font-mono disabled:opacity-40 hover:bg-stone-100 rounded"
          >
            Prev
          </button>
          <button
            onClick={() => setStep((prev) => Math.min(stages.length - 1, prev + 1))}
            disabled={step === stages.length - 1}
            className="px-3 py-1 rounded bg-[#2d5a88] text-white text-xs font-semibold hover:bg-[#23476c] disabled:opacity-40"
          >
            Next ({step + 1}/5)
          </button>
        </div>
      </div>

      {/* Visual Dual-Mode Architecture Split - Clean 2-Column, No Nested Subcards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* User Space Ring 3 */}
        <div
          className={`p-3.5 rounded-lg transition-all ${
            stages[step].modeBit.startsWith('1')
              ? 'bg-[#ebf2f8] text-[#1e4569]'
              : 'bg-stone-50 text-[#78716c] opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-black/10">
            <span className="font-mono font-bold text-xs">USER SPACE (Ring 3)</span>
            <span className="text-[10px] font-mono">Unprivileged</span>
          </div>
          <div className="space-y-1 text-xs font-mono">
            <div><code>printf("KernelLab\n");</code></div>
            <div><code>mov rax, 1; syscall</code></div>
          </div>
        </div>

        {/* Kernel Space Ring 0 */}
        <div
          className={`p-3.5 rounded-lg transition-all ${
            stages[step].modeBit.startsWith('0')
              ? 'bg-[#edf5ed] text-[#1e5327]'
              : 'bg-stone-50 text-[#78716c] opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-black/10">
            <span className="font-mono font-bold text-xs">KERNEL SPACE (Ring 0)</span>
            <span className="text-[10px] font-mono">Supervisor</span>
          </div>
          <div className="space-y-1 text-xs font-mono">
            <div><code>sys_call_table[1] = sys_write</code></div>
            <div><code>tty_write() -&gt; hardware</code></div>
          </div>
        </div>
      </div>

      {/* Step Detail & Hardware Registers */}
      <div className="bg-[#1c1917] text-[#f5f5f4] p-4 rounded-xl font-mono text-xs space-y-2.5">
        <div className="flex items-center justify-between text-[#38bdf8]">
          <span className="font-bold">{stages[step].name}</span>
          <span className="text-yellow-400 text-[11px]">Mode Bit: {stages[step].modeBit}</span>
        </div>

        <p className="text-[#a8a29e]">{stages[step].detail}</p>

        {/* Flat Register Row */}
        <div className="flex flex-wrap gap-3 pt-1 border-t border-[#44403c] text-[11px]">
          {Object.entries(stages[step].registers).map(([k, v]) => (
            <div key={k}>
              <span className="text-[#94a3b8]">{k}:</span> <span className="text-emerald-400 font-bold">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
