import React, { useState, useMemo } from 'react';
import { Layers, Info } from 'lucide-react';

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
      <div className="bg-[#fdfbf6] border border-[#dfd7c6] rounded-xl p-5 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#dfd7c6]">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#2d5a88]" />
            <div>
              <h3 className="text-sm font-bold text-[#2c2825] uppercase tracking-wider">
                Virtual Memory Page Replacement Simulator
              </h3>
              <p className="text-xs text-[#78716c] font-sans">
                Observe FIFO, LRU, and Optimal page replacement algorithms and analyze Page Faults.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#7d4e08] bg-[#fbf3e4] border border-[#ecd6b2] px-3 py-1 rounded">
              Faults: <strong>{simulation.faultCount}</strong> / {pages.length}
            </span>
            <span className="text-[#1e4569] bg-[#ebf2f8] border border-[#c8d9e8] px-3 py-1 rounded">
              Hit Ratio: <strong>{simulation.hitRatio}%</strong>
            </span>
          </div>
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[#78716c] uppercase text-[10px] font-semibold tracking-wider">Algorithm</label>
            <select
              value={algo}
              onChange={(e) => setAlgo(e.target.value as ReplacementAlgo)}
              className="w-full bg-[#f4f0e5] border border-[#dfd7c6] text-[#2c2825] rounded-lg px-3 py-2 outline-none font-medium focus:border-[#2d5a88] focus:bg-[#fdfbf6] transition-colors"
            >
              <option value="FIFO">First-In First-Out (FIFO)</option>
              <option value="LRU">Least Recently Used (LRU)</option>
              <option value="OPTIMAL">Optimal Page Replacement (OPT)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[#78716c] uppercase text-[10px] font-semibold tracking-wider">Physical Page Frames</label>
            <input
              type="number"
              min="2"
              max="6"
              value={frameCount}
              onChange={(e) => setFrameCount(Math.max(2, Math.min(6, parseInt(e.target.value) || 3)))}
              className="w-full bg-[#f4f0e5] border border-[#dfd7c6] text-[#2c2825] rounded-lg px-3 py-2 outline-none font-medium focus:border-[#2d5a88] focus:bg-[#fdfbf6] transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#78716c] uppercase text-[10px] font-semibold tracking-wider">Page Reference String</label>
            <input
              type="text"
              value={refStringInput}
              onChange={(e) => setRefStringInput(e.target.value)}
              placeholder="7, 0, 1, 2, 0, 3..."
              className="w-full bg-[#f4f0e5] border border-[#dfd7c6] text-[#2c2825] rounded-lg px-3 py-2 outline-none focus:border-[#2d5a88] focus:bg-[#fdfbf6] transition-colors"
            />
          </div>
        </div>

        {/* Frame Matrix Display */}
        <div className="pt-2 overflow-x-auto">
          <div className="min-w-[600px] border border-[#dfd7c6] rounded-lg bg-[#f4f0e5] p-4">
            <table className="w-full text-center">
              <thead>
                <tr className="border-b border-[#dfd7c6] text-[#78716c] text-[11px]">
                  <th className="py-2 text-left font-sans pl-2">Ref Page</th>
                  {simulation.steps.map((s, idx) => (
                    <th key={idx} className="py-2 px-1 font-bold text-[#2c2825]">
                      {s.page}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: frameCount }).map((_, frameIdx) => (
                  <tr key={frameIdx} className="border-b border-[#dfd7c6]/70">
                    <td className="py-2 text-left font-sans pl-2 text-[#78716c]">
                      Frame {frameIdx}
                    </td>
                    {simulation.steps.map((s, stepIdx) => {
                      const val = s.frames[frameIdx];
                      return (
                        <td
                          key={stepIdx}
                          className="py-2 px-1 text-[#2c2825] font-semibold"
                        >
                          {val !== null ? (
                            <span className="inline-block w-6 py-0.5 rounded bg-[#fdfbf6] border border-[#dfd7c6] text-[#2c2825] font-medium">
                              {val}
                            </span>
                          ) : (
                            <span className="text-[#a8a29e]">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {/* Result Row */}
                <tr className="pt-2">
                  <td className="py-2 text-left font-sans pl-2 text-[#78716c]">Result</td>
                  {simulation.steps.map((s, idx) => (
                    <td key={idx} className="py-2 px-1">
                      {s.isHit ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#edf5ed] text-[#1e5327] font-bold border border-[#cbe0cc]">
                          HIT
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#fbf0f0] text-[#9f1239] font-bold border border-[#f5c6c6]">
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
        <div className="p-4 bg-[#ebf2f8]/70 border border-[#c8d9e8] rounded-lg flex items-start gap-2.5 text-[#1e4569] font-sans leading-relaxed text-xs">
          <Info className="w-4 h-4 text-[#2d5a88] shrink-0 mt-0.5" />
          <span>
            <strong>Belady&apos;s Anomaly Note:</strong> Under FIFO, increasing the number of page frames can sometimes lead to <em>more</em> page faults instead of fewer. Stack-based algorithms like LRU and OPT are immune to Belady&apos;s Anomaly.
          </span>
        </div>
      </div>
    </div>
  );
};
