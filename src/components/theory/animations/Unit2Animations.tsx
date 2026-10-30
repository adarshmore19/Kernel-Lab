import React, { useState } from 'react';
import {
  Activity,
  Layers,
  Cpu,
  Share2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

// ==========================================
// 1. THREAD MULTITHREADING MODELS SIMULATOR
// ==========================================
export const ThreadModelsVisualizer: React.FC = () => {
  const [model, setModel] = useState<'M:1' | '1:1' | 'M:N'>('1:1');
  const [blockedThread, setBlockedThread] = useState<number | null>(null);

  const handleSimulateBlock = (threadIndex: number) => {
    setBlockedThread(blockedThread === threadIndex ? null : threadIndex);
  };

  return (
    <div className="bg-white border border-[#dfd7c6] rounded-xl p-5 space-y-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#dfd7c6]/60">
        <div>
          <h4 className="font-mono font-bold text-sm text-[#2c2825]">
            Multithreading Models & Blocking Simulator
          </h4>
          <p className="text-xs text-[#78716c]">
            Observe Many-to-One, One-to-One, and Many-to-Many mapping to OS kernel execution threads.
          </p>
        </div>

        {/* Model Switcher - Flat */}
        <div className="flex items-center gap-1 text-xs font-mono">
          {(['M:1', '1:1', 'M:N'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setModel(m);
                setBlockedThread(null);
              }}
              className={`px-3 py-1 rounded text-xs transition-all ${
                model === m ? 'bg-[#2d5a88] text-white font-bold' : 'text-[#78716c] hover:bg-stone-100'
              }`}
            >
              {m === 'M:1' ? 'Many-to-One' : m === '1:1' ? 'One-to-One (Linux)' : 'Many-to-Many'}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Mapping - Clean 2-column, No Nested Card Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
        {/* User Space (ULTs) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-1 text-xs text-[#1e4569] font-mono font-bold">
            <span>User Space Threads (ULT)</span>
            <span className="text-[10px] text-[#78716c] font-normal">Click thread to simulate I/O block</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((t) => {
              const isBlocked = blockedThread === t;
              const isIndirectlyBlocked = model === 'M:1' && blockedThread !== null;
              return (
                <button
                  key={t}
                  onClick={() => handleSimulateBlock(t)}
                  className={`p-2.5 rounded-lg text-center transition-all ${
                    isBlocked
                      ? 'bg-rose-100 text-rose-900 font-bold'
                      : isIndirectlyBlocked
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-stone-100 text-[#1e4569] hover:bg-stone-200'
                  }`}
                >
                  <div className="text-xs font-mono font-semibold">User Thread {t}</div>
                  <span className="text-[10px] block opacity-75 mt-0.5">
                    {isBlocked ? 'BLOCKED' : isIndirectlyBlocked ? 'STALLED (M:1)' : 'RUNNING'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Kernel Space (KLTs) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-1 text-xs text-[#1e5327] font-mono font-bold">
            <span>Kernel Threads (CPU Hardware Cores)</span>
            <span className="text-[10px] text-[#1e5327]">Execution Units</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(model === 'M:1' ? [1] : model === 'M:N' ? [1, 2] : [1, 2, 3]).map((k) => {
              const isKernelBlocked =
                model === 'M:1' && blockedThread !== null
                  ? true
                  : model === '1:1' && blockedThread === k;
              return (
                <div
                  key={k}
                  className={`p-2.5 rounded-lg text-center transition-all ${
                    isKernelBlocked
                      ? 'bg-rose-50 text-rose-800'
                      : 'bg-stone-100 text-[#1e5327]'
                  }`}
                >
                  <Cpu className="w-4 h-4 mx-auto mb-1 opacity-70" />
                  <div className="text-xs font-mono font-semibold">Kernel Core {k}</div>
                  <span className="text-[10px] block opacity-75 mt-0.5">
                    {isKernelBlocked ? 'WAITING' : 'ACTIVE'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Model Analysis & Diagnostics - Simple clean callout */}
      <div
        className={`border-l-3 pl-3 py-1.5 text-xs font-mono ${
          model === 'M:1' && blockedThread !== null
            ? 'border-rose-600 text-rose-900 bg-rose-50/50'
            : 'border-[#2d5a88] text-[#1e4569]'
        }`}
      >
        {model === 'M:1' && blockedThread !== null ? (
          <div>
            <strong>CRITICAL FLAW OF M:1:</strong> Entire process is frozen! All user threads share one single kernel thread, so one thread blocking on disk blocks all other threads.
          </div>
        ) : (
          <div>
            <strong>Model: {model}</strong> —{' '}
            {model === '1:1'
              ? 'True multicore parallelism. If Thread 1 blocks on I/O, Threads 2 & 3 execute unaffected on other CPU cores.'
              : model === 'M:N'
              ? 'Hybrid multiplexing. M user threads dynamically schedule onto N worker kernel threads.'
              : 'User-space thread library without kernel awareness.'}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. IPC SIMULATOR: SHARED MEMORY VS MESSAGE PASSING
// ==========================================
export const IPCSimulator: React.FC = () => {
  const [ipcType, setIpcType] = useState<'shm' | 'msg'>('shm');
  const [dataPayload, setDataPayload] = useState('0x4A6F62');
  const [transferStep, setTransferStep] = useState(0);

  const handleSend = () => {
    setTransferStep(1);
    setTimeout(() => setTransferStep(2), 500);
    setTimeout(() => setTransferStep(3), 1000);
  };

  return (
    <div className="bg-white border border-[#dfd7c6] rounded-xl p-5 space-y-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#dfd7c6]/60">
        <div>
          <h4 className="font-mono font-bold text-sm text-[#2c2825]">
            Inter-Process Communication (IPC) Engine
          </h4>
          <p className="text-xs text-[#78716c]">
            Compare high-speed zero-copy Shared Memory vs kernel-buffered Message Passing.
          </p>
        </div>

        <div className="flex gap-1 text-xs font-mono">
          <button
            onClick={() => {
              setIpcType('shm');
              setTransferStep(0);
            }}
            className={`px-3 py-1 rounded transition-all ${
              ipcType === 'shm' ? 'bg-[#1e5327] text-white font-bold' : 'text-[#78716c] hover:bg-stone-100'
            }`}
          >
            Shared Memory (Zero-Copy)
          </button>
          <button
            onClick={() => {
              setIpcType('msg');
              setTransferStep(0);
            }}
            className={`px-3 py-1 rounded transition-all ${
              ipcType === 'msg' ? 'bg-[#2d5a88] text-white font-bold' : 'text-[#78716c] hover:bg-stone-100'
            }`}
          >
            Message Passing (Syscalls)
          </button>
        </div>
      </div>

      {/* IPC Flow - Clean 3 Columns, No Nested Outer Border Box */}
      <div className="grid grid-cols-3 gap-6 items-center py-2 font-mono">
        {/* Process A */}
        <div className="space-y-1.5 text-center">
          <span className="text-xs font-bold text-[#2c2825] block">Process A (Producer)</span>
          <span className="text-[10px] text-[#78716c] block">PID: 1042</span>
          <div className="text-xs text-[#b45309] font-bold py-1 bg-amber-50 rounded">
            Payload: {dataPayload}
          </div>
          <button
            onClick={handleSend}
            className="w-full py-1 bg-[#2d5a88] text-white text-[11px] font-bold rounded hover:bg-[#23476c]"
          >
            Transfer Data
          </button>
        </div>

        {/* IPC Channel */}
        <div className="space-y-1.5 text-center">
          {ipcType === 'shm' ? (
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#1e5327] block">Physical Shared RAM</span>
              <span className="text-[10px] text-[#78716c] block">/dev/shm/hft_buffer</span>
              <div
                className={`py-1 px-2 rounded text-xs transition-all ${
                  transferStep >= 1
                    ? 'bg-emerald-100 text-emerald-800 font-bold'
                    : 'bg-stone-100 text-stone-500'
                }`}
              >
                {transferStep >= 1 ? dataPayload : '[ Empty Memory Slot ]'}
              </div>
              <span className="text-[10px] text-[#1e5327] block font-bold">Bus Speed: &lt; 80 ns</span>
            </div>
          ) : (
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#2d5a88] block">Kernel Message Queue</span>
              <span className="text-[10px] text-[#78716c] block">System Call copy_from_user()</span>
              <div
                className={`py-1 px-2 rounded text-xs transition-all ${
                  transferStep === 1
                    ? 'bg-blue-100 text-blue-800 font-bold animate-pulse'
                    : 'bg-stone-100 text-stone-500'
                }`}
              >
                {transferStep === 1 ? `[ Packet: ${dataPayload} ]` : '[ Queue Ready ]'}
              </div>
              <span className="text-[10px] text-[#2d5a88] block font-bold">Latency: ~8,000 ns</span>
            </div>
          )}
        </div>

        {/* Process B */}
        <div className="space-y-1.5 text-center">
          <span className="text-xs font-bold text-[#2c2825] block">Process B (Consumer)</span>
          <span className="text-[10px] text-[#78716c] block">PID: 1088</span>
          <div
            className={`text-xs py-1 rounded transition-all font-bold ${
              transferStep >= 2
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-stone-100 text-stone-500'
            }`}
          >
            {transferStep >= 2 ? `Received: ${dataPayload}` : 'waiting...'}
          </div>
          <button
            onClick={() => setTransferStep(0)}
            className="w-full py-1 text-[#78716c] text-[11px] rounded hover:bg-stone-100"
          >
            Clear Buffer
          </button>
        </div>
      </div>

      {/* Comparison Metrics - Flat 4 Column Row, No Individual Box Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-[#dfd7c6]/60 text-xs font-mono">
        <div>
          <span className="text-[10px] text-[#78716c] block">Transfer Mechanism</span>
          <strong className="text-[#2c2825]">{ipcType === 'shm' ? 'Direct RAM Bus' : 'Kernel Syscall Copy'}</strong>
        </div>
        <div>
          <span className="text-[10px] text-[#78716c] block">Memory Copies</span>
          <strong className="text-[#1e5327]">{ipcType === 'shm' ? '0 (Zero-Copy)' : '2 Copies (User/Kernel)'}</strong>
        </div>
        <div>
          <span className="text-[10px] text-[#78716c] block">Synchronization</span>
          <strong className="text-[#b45309]">{ipcType === 'shm' ? 'Mutex / Semaphore' : 'OS Handled'}</strong>
        </div>
        <div>
          <span className="text-[10px] text-[#78716c] block">Network Scaling</span>
          <strong className="text-[#2d5a88]">{ipcType === 'shm' ? 'Single Machine' : 'Cross Cluster'}</strong>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. CONTEXT SWITCH STEP-BY-STEP ANIMATOR
// ==========================================
export const ContextSwitchVisualizer: React.FC = () => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: '1. Running on CPU (P1)',
      desc: 'Process P1 (PID 101) is executing. CPU registers contain P1 active state (RAX=0x42, RIP=0x401080).',
      activeCpu: 'P1',
      pcb1Saved: false,
      pcb2Loaded: false,
      tlbStatus: 'Warm (P1 Pages Cached)',
    },
    {
      title: '2. Timer Interrupt Fires',
      desc: 'Hardware APIC timer fires. CPU traps to kernel mode. Execution freezes.',
      activeCpu: 'OS Dispatcher',
      pcb1Saved: false,
      pcb2Loaded: false,
      tlbStatus: 'Kernel Mode',
    },
    {
      title: '3. Save State into PCB 1',
      desc: 'CPU registers pushed to PCB 1 in kernel memory. P1 state transitioned to READY.',
      activeCpu: 'OS Dispatcher',
      pcb1Saved: true,
      pcb2Loaded: false,
      tlbStatus: 'Registers Saved to RAM',
    },
    {
      title: '4. Memory Map & CR3 Switch',
      desc: 'Kernel updates CPU CR3 register to point to P2 Page Directory. TLB cache invalidated (FLUSH)!',
      activeCpu: 'OS Dispatcher',
      pcb1Saved: true,
      pcb2Loaded: false,
      tlbStatus: 'TLB FLUSHED (Cache Cold)',
    },
    {
      title: '5. Restore State from PCB 2',
      desc: 'PCB 2 registers popped into CPU hardware registers. Program counter pointed to P2 next instruction.',
      activeCpu: 'P2',
      pcb1Saved: true,
      pcb2Loaded: true,
      tlbStatus: 'Warm-up Begins',
    },
  ];

  return (
    <div className="bg-white border border-[#dfd7c6] rounded-xl p-5 space-y-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#dfd7c6]/60">
        <div>
          <h4 className="font-mono font-bold text-sm text-[#2c2825]">
            CPU Context Switch & PCB State Restoration
          </h4>
          <p className="text-xs text-[#78716c]">
            Visualize register dumping to kernel memory, CR3 page table switching, and TLB cache penalties.
          </p>
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => setStep((prev) => Math.max(0, prev - 1))}
            disabled={step === 0}
            className="px-2.5 py-1 text-xs font-mono disabled:opacity-40 hover:bg-stone-100 rounded"
          >
            Prev
          </button>
          <button
            onClick={() => setStep((prev) => Math.min(steps.length - 1, prev + 1))}
            disabled={step === steps.length - 1}
            className="px-3 py-1 rounded bg-[#2d5a88] text-white text-xs font-semibold hover:bg-[#23476c] disabled:opacity-40"
          >
            Next ({step + 1}/5)
          </button>
        </div>
      </div>

      {/* Visual CPU & PCBs - Clean 3 Columns, Flat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        {/* PCB 1 */}
        <div
          className={`p-3 rounded-lg transition-all ${
            steps[step].pcb1Saved ? 'bg-amber-50 text-amber-950' : 'bg-stone-50 text-stone-700'
          }`}
        >
          <span className="font-bold text-[#b45309] block mb-1">PCB 1 (Process P1)</span>
          <div className="text-[11px] space-y-0.5 opacity-90">
            <div>PID: 101 • PC: 0x00401080</div>
            <div>Regs: {steps[step].pcb1Saved ? 'SAVED IN RAM' : 'ACTIVE IN CPU'}</div>
            <div>State: {steps[step].pcb1Saved ? 'READY' : 'RUNNING'}</div>
          </div>
        </div>

        {/* Central CPU Core */}
        <div className="p-3.5 rounded-lg bg-[#1c1917] text-white text-center space-y-1">
          <div className="text-[11px] text-[#38bdf8] font-bold">Hardware CPU Core</div>
          <div className="text-sm font-bold text-emerald-400">
            Active: {steps[step].activeCpu}
          </div>
          <div className="text-[10px] text-[#a8a29e]">
            TLB: <span className="text-yellow-400">{steps[step].tlbStatus}</span>
          </div>
        </div>

        {/* PCB 2 */}
        <div
          className={`p-3 rounded-lg transition-all ${
            steps[step].pcb2Loaded ? 'bg-emerald-50 text-emerald-950' : 'bg-stone-50 text-stone-700'
          }`}
        >
          <span className="font-bold text-[#1e5327] block mb-1">PCB 2 (Process P2)</span>
          <div className="text-[11px] space-y-0.5 opacity-90">
            <div>PID: 102 • PC: 0x00402240</div>
            <div>Regs: {steps[step].pcb2Loaded ? 'LOADED IN CPU' : 'IN RAM'}</div>
            <div>State: {steps[step].pcb2Loaded ? 'RUNNING' : 'READY'}</div>
          </div>
        </div>
      </div>

      {/* Step Explanation */}
      <div className="border-l-3 border-[#2d5a88] pl-3 py-1.5 text-xs font-mono text-[#1e4569]">
        <strong>{steps[step].title}</strong> — {steps[step].desc}
      </div>
    </div>
  );
};
