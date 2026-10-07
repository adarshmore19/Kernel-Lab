import React, { useState } from 'react';
import { Activity, Layers, Sparkles, BookOpen } from 'lucide-react';
import { ProcessLifecycleLab } from '../components/labs/ProcessLifecycleLab';
import { MemoryLab } from '../components/labs/MemoryLab';

export const LabsPage: React.FC = () => {
  const [activeLab, setActiveLab] = useState<'process' | 'memory'>('process');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1b253b]">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Interactive Operating System Concept Labs
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deep-dive into core kernel primitives: Process control blocks, state transitions, virtual memory, and page replacement.
          </p>
        </div>

        {/* Lab Switcher */}
        <div className="flex items-center gap-1 bg-[#0e1424] border border-[#1e2a42] p-1 rounded-xl">
          <button
            onClick={() => setActiveLab('process')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all ${
              activeLab === 'process'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Process Lifecycle & PCB</span>
          </button>

          <button
            onClick={() => setActiveLab('memory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all ${
              activeLab === 'memory'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Virtual Memory & Paging</span>
          </button>
        </div>
      </div>

      {/* Lab View */}
      {activeLab === 'process' ? <ProcessLifecycleLab /> : <MemoryLab />}
    </div>
  );
};
