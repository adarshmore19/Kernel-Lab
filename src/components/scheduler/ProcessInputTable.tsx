import React, { useState } from 'react';
import { Plus, Trash2, Shuffle, Sparkles, RefreshCw, Settings2 } from 'lucide-react';
import { AlgorithmType, Process } from '../../types/scheduler';
import { SCHEDULER_PRESETS, SchedulerPreset } from '../../engine/scheduling/presets';
import { schedulers } from '../../engine/scheduling';

const PROCESS_COLORS = [
  '#38bdf8', // cyan
  '#34d399', // emerald
  '#f59e0b', // amber
  '#a78bfa', // purple
  '#f43f5e', // rose
  '#06b6d4', // cyan-dark
  '#84cc16', // lime
  '#ec4899', // pink
];

interface ProcessInputTableProps {
  processes: Process[];
  algorithm: AlgorithmType;
  quantum: number;
  onProcessesChange: (processes: Process[]) => void;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
  onQuantumChange: (quantum: number) => void;
  onResetSimulation: () => void;
}

export const ProcessInputTable: React.FC<ProcessInputTableProps> = ({
  processes,
  algorithm,
  quantum,
  onProcessesChange,
  onAlgorithmChange,
  onQuantumChange,
  onResetSimulation,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('silberschatz-classic');

  const handleAddProcess = () => {
    const nextPid = processes.length > 0 ? Math.max(...processes.map((p) => p.pid)) + 1 : 1;
    const color = PROCESS_COLORS[(nextPid - 1) % PROCESS_COLORS.length];
    const newProc: Process = {
      id: `p-${Date.now()}`,
      pid: nextPid,
      name: `P${nextPid}`,
      arrivalTime: 0,
      burstTime: Math.floor(Math.random() * 6) + 2,
      priority: Math.floor(Math.random() * 4) + 1,
      color,
    };
    onProcessesChange([...processes, newProc]);
  };

  const handleRemoveProcess = (id: string) => {
    onProcessesChange(processes.filter((p) => p.id !== id));
  };

  const handleUpdateProcess = (id: string, field: keyof Process, val: any) => {
    onProcessesChange(
      processes.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const handleGenerateRandom = () => {
    const count = 4;
    const randomized: Process[] = [];
    for (let i = 1; i <= count; i++) {
      randomized.push({
        id: `p-rand-${i}-${Date.now()}`,
        pid: i,
        name: `P${i}`,
        arrivalTime: Math.floor(Math.random() * 4),
        burstTime: Math.floor(Math.random() * 8) + 1,
        priority: Math.floor(Math.random() * 4) + 1,
        color: PROCESS_COLORS[(i - 1) % PROCESS_COLORS.length],
      });
    }
    onProcessesChange(randomized);
    onResetSimulation();
  };

  const handleLoadPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const found = SCHEDULER_PRESETS.find((p) => p.id === presetId);
    if (found) {
      onProcessesChange(JSON.parse(JSON.stringify(found.processes)));
      if (found.quantum) {
        onQuantumChange(found.quantum);
      }
      onResetSimulation();
    }
  };

  const currentAlgoMeta = schedulers[algorithm];

  return (
    <div className="bg-[#0e1424] border border-[#1e2a42] rounded-xl p-5 shadow-xl space-y-5">
      {/* Top Configuration Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1b253b]">
        {/* Algorithm Dropdown */}
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Scheduling Algorithm
            </label>
            <select
              value={algorithm}
              onChange={(e) => {
                onAlgorithmChange(e.target.value as AlgorithmType);
                onResetSimulation();
              }}
              aria-label="Scheduling Algorithm"
              className="bg-[#080c16] border border-[#212f4d] text-cyan-300 text-sm font-semibold rounded-lg px-3 py-2 outline-none focus:border-cyan-500 transition-colors"
            >
              {Object.values(schedulers).map((algo) => (
                <option key={algo.id} value={algo.id}>
                  {algo.name} {algo.isPreemptive ? '(Preemptive)' : '(Non-Preemptive)'}
                </option>
              ))}
            </select>
          </div>

          {/* Time Quantum (Round Robin only) */}
          {currentAlgoMeta.requiresQuantum && (
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block">
                Time Quantum (q)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={quantum}
                onChange={(e) => onQuantumChange(Math.max(1, parseInt(e.target.value) || 1))}
                aria-label="Time Quantum"
                className="w-24 bg-[#080c16] border border-[#212f4d] text-amber-300 text-sm font-mono font-bold rounded-lg px-3 py-2 outline-none focus:border-amber-500"
              />
            </div>
          )}
        </div>

        {/* Presets and Randomizer */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Preset Scenarios
            </label>
            <select
              value={selectedPresetId}
              onChange={(e) => handleLoadPreset(e.target.value)}
              aria-label="Preset Scenarios"
              className="bg-[#080c16] border border-[#212f4d] text-slate-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-cyan-500"
            >
              {SCHEDULER_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>

          <div className="self-end flex items-center gap-2">
            <button
              onClick={handleGenerateRandom}
              title="Generate Random Processes"
              className="px-3 py-2 bg-[#172033] hover:bg-slate-800 border border-[#212f4d] text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
              Randomize
            </button>

            <button
              onClick={() => onProcessesChange([])}
              title="Clear all processes"
              className="px-3 py-2 bg-[#172033] hover:bg-rose-950/60 border border-[#212f4d] text-rose-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Process Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[#1b253b] text-slate-400">
              <th className="pb-2.5 font-medium">Process</th>
              <th className="pb-2.5 font-medium">Arrival Time (AT)</th>
              <th className="pb-2.5 font-medium">Burst Time (BT)</th>
              <th className="pb-2.5 font-medium">Priority (Lower = Higher)</th>
              <th className="pb-2.5 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#151c2e]">
            {processes.map((p) => (
              <tr key={p.id} className="hover:bg-[#12192c]/50 transition-colors">
                <td className="py-2.5 flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: p.color }}
                  />
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => handleUpdateProcess(p.id, 'name', e.target.value)}
                    className="w-20 bg-transparent text-slate-100 font-bold border-b border-transparent hover:border-slate-600 focus:border-cyan-400 outline-none"
                  />
                </td>
                <td className="py-2.5">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={p.arrivalTime}
                    onChange={(e) =>
                      handleUpdateProcess(p.id, 'arrivalTime', Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="w-16 bg-[#080c16] border border-[#1b253b] rounded px-2 py-1 text-slate-200 outline-none focus:border-cyan-500"
                  />
                </td>
                <td className="py-2.5">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={p.burstTime}
                    onChange={(e) =>
                      handleUpdateProcess(p.id, 'burstTime', Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 bg-[#080c16] border border-[#1b253b] rounded px-2 py-1 text-slate-200 outline-none focus:border-cyan-500"
                  />
                </td>
                <td className="py-2.5">
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={p.priority}
                    onChange={(e) =>
                      handleUpdateProcess(p.id, 'priority', Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 bg-[#080c16] border border-[#1b253b] rounded px-2 py-1 text-slate-200 outline-none focus:border-cyan-500"
                  />
                </td>
                <td className="py-2.5 text-right">
                  <button
                    onClick={() => handleRemoveProcess(p.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Process Button */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={handleAddProcess}
          className="px-3 py-1.5 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-700/50 text-cyan-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Process
        </button>

        <span className="text-xs text-slate-400 font-mono">
          Total Processes: <strong className="text-slate-200">{processes.length}</strong>
        </span>
      </div>
    </div>
  );
};
