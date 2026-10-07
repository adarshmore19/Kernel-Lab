import React, { useState, useMemo } from 'react';
import { Layers, RotateCcw, Info, Sparkles, Check, AlertTriangle } from 'lucide-react';

type ReplacementAlgo = 'FIFO' | 'LRU' | 'OPTIMAL';

export const MemoryLab: React.FC = () => {
  const [algo, setAlgo] = useState<ReplacementAlgo>('FIFO');
  const [frameCount, setFrameCount] = useState<number>(3);
  const [refStringInput, setRefStringInput] = useState<string>('7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2');

  const pages = useMemo(() => {
    return refStringInput
      .split(/[\s,]+/)
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
  }, [refStringInput]);

  const simulation = useMemo(() => {
    const steps: Array<{
      page: number;
      frames: Array<number | null>;
      isHit: boolean;
      faultCount: number;
    }> = [];

    const frames: Array<number | null> = Array(frameCount).fill(null);
    let faultCount = 0;

    // FIFO queue of indices
    const fifoQueue: number[] = [];
    // LRU last used map
    const lastUsedMap: Record<number, number> = {};

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const hitIndex = frames.indexOf(page);
      const isHit = hitIndex !== -1;

      if (isHit) {
        lastUsedMap[page] = i;
      } else {
        faultCount++;
        const emptyIndex = frames.indexOf(null);

        if (emptyIndex !== -1) {
          frames[emptyIndex] = page;
          fifoQueue.push(emptyIndex);
          lastUsedMap[page] = i;
        } else {
          // Frame replacement needed
          let replaceIndex = 0;

          if (algo === 'FIFO') {
            replaceIndex = fifoQueue.shift()!;
            fifoQueue.push(replaceIndex);
          } else if (algo === 'LRU') {
            // Find frame with minimum lastUsed
            let minTime = Infinity;
            for (let f = 0; f < frames.length; f++) {
              const p = frames[f]!;
              const time = lastUsedMap[p] ?? -1;
              if (time < minTime) {
                minTime = time;
                replaceIndex = f;
              }
            }
          } else if (algo === 'OPTIMAL') {
            // Find frame whose next use is furthest in the future
            let furthest = -1;
            for (let f = 0; f < frames.length; f++) {
              const p = frames[f]!;
              let nextUse = Infinity;
              for (let k = i + 1; k < pages.length; k++) {
                if (pages[k] === p) {
                  nextUse = k;
                  break;
                }
              }
              if (nextUse > furthest) {
                furthest = nextUse;
                replaceIndex = f;
              }
            }
          }

          frames[replaceIndex] = page;
          lastUsedMap[page] = i;
        }
      }

      steps.push({
        page,
        frames: [...frames],
        isHit,
        faultCount,
      });
    }

    const total = pages.length;
    const hits = total - faultCount;
    const hitRatio = total > 0 ? ((hits / total) * 100).toFixed(1) : '0';

    return { steps, faultCount, hitRatio };
  }, [pages, frameCount, algo]);

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="bg-[#0e1424] border border-[#1e2a42] rounded-xl p-5 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#1b253b]">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Virtual Memory Page Replacement Simulator
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Observe FIFO, LRU, and Optimal page replacement algorithms and analyze Page Faults.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded">
              Faults: <strong>{simulation.faultCount}</strong> / {pages.length}
            </span>
            <span className="text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded">
              Hit Ratio: <strong>{simulation.hitRatio}%</strong>
            </span>
          </div>
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-slate-400 uppercase text-[10px]">Algorithm</label>
            <select
              value={algo}
              onChange={(e) => setAlgo(e.target.value as ReplacementAlgo)}
              className="w-full bg-[#080c16] border border-[#212f4d] text-cyan-300 rounded-lg px-3 py-2 outline-none font-bold"
            >
              <option value="FIFO">First-In First-Out (FIFO)</option>
              <option value="LRU">Least Recently Used (LRU)</option>
              <option value="OPTIMAL">Optimal Page Replacement (OPT)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 uppercase text-[10px]">Physical Page Frames</label>
            <input
              type="number"
              min="2"
              max="6"
              value={frameCount}
              onChange={(e) => setFrameCount(Math.max(2, Math.min(6, parseInt(e.target.value) || 3)))}
              className="w-full bg-[#080c16] border border-[#212f4d] text-slate-200 rounded-lg px-3 py-2 outline-none font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 uppercase text-[10px]">Page Reference String</label>
            <input
              type="text"
              value={refStringInput}
              onChange={(e) => setRefStringInput(e.target.value)}
              placeholder="7, 0, 1, 2, 0, 3..."
              className="w-full bg-[#080c16] border border-[#212f4d] text-slate-200 rounded-lg px-3 py-2 outline-none"
            />
          </div>
        </div>

        {/* Frame Matrix Display */}
        <div className="pt-2 overflow-x-auto">
          <div className="min-w-[600px] border border-[#1b253b] rounded-lg bg-[#080c16] p-4">
            <table className="w-full text-center">
              <thead>
                <tr className="border-b border-slate-900 text-slate-400 text-[11px]">
                  <th className="py-2 text-left font-sans pl-2">Ref Page</th>
                  {simulation.steps.map((s, idx) => (
                    <th key={idx} className="py-2 px-1 font-bold text-slate-200">
                      {s.page}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: frameCount }).map((_, frameIdx) => (
                  <tr key={frameIdx} className="border-b border-[#11192a]">
                    <td className="py-2 text-left font-sans pl-2 text-slate-500">
                      Frame {frameIdx}
                    </td>
                    {simulation.steps.map((s, stepIdx) => {
                      const val = s.frames[frameIdx];
                      return (
                        <td
                          key={stepIdx}
                          className="py-2 px-1 text-slate-300 font-semibold"
                        >
                          {val !== null ? (
                            <span className="inline-block w-6 py-0.5 rounded bg-[#10192e] border border-[#1b263d]">
                              {val}
                            </span>
                          ) : (
                            <span className="text-slate-700">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {/* Result Row */}
                <tr className="pt-2">
                  <td className="py-2 text-left font-sans pl-2 text-slate-400">Result</td>
                  {simulation.steps.map((s, idx) => (
                    <td key={idx} className="py-2 px-1">
                      {s.isHit ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950/80 text-emerald-400 font-bold border border-emerald-800/40">
                          HIT
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-950/80 text-rose-400 font-bold border border-rose-800/40">
                          FAULT
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Theory Callout */}
        <div className="p-4 bg-cyan-950/20 border border-cyan-800/30 rounded-lg flex items-start gap-2 text-cyan-200 font-sans leading-relaxed">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong>Belady&apos;s Anomaly Note:</strong> Under FIFO, increasing the number of page frames can sometimes lead to <em>more</em> page faults instead of fewer. Stack-based algorithms like LRU and OPT are immune to Belady&apos;s Anomaly.
          </span>
        </div>
      </div>
    </div>
  );
};
