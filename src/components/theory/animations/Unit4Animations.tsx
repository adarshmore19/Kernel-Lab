import React, { useState, useMemo } from 'react';
import {
  Layers,
  Database,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Zap,
} from 'lucide-react';

// ==========================================
// 1. DYNAMIC MEMORY PARTITION ALLOCATOR
// ==========================================
export const MemoryPartitioningVisualizer: React.FC = () => {
  const [strategy, setStrategy] = useState<'First' | 'Best' | 'Worst'>('First');
  const [requestSize, setRequestSize] = useState<number>(20);

  // Memory segments: { id: string, size: number, allocated: boolean, pid?: string }
  const [segments, setSegments] = useState<
    Array<{ id: number; size: number; allocated: boolean; pid?: string }>
  >([
    { id: 1, size: 50, allocated: true, pid: 'OS Kernel' },
    { id: 2, size: 40, allocated: false },
    { id: 3, size: 80, allocated: true, pid: 'Process P1' },
    { id: 4, size: 30, allocated: false },
    { id: 5, size: 100, allocated: true, pid: 'Process P2' },
    { id: 6, size: 60, allocated: false },
  ]);

  const [message, setMessage] = useState<string>(
    'Select a strategy (First Fit, Best Fit, Worst Fit) and allocate a new process.'
  );

  const handleAllocate = () => {
    // Find candidate holes
    const holes = segments
      .map((s, idx) => ({ ...s, idx }))
      .filter((s) => !s.allocated && s.size >= requestSize);

    if (holes.length === 0) {
      setMessage(`ALLOCATION FAILED: No single contiguous free hole >= ${requestSize} MB. (External Fragmentation!)`);
      return;
    }

    let targetHole = holes[0];
    if (strategy === 'Best') {
      // Smallest hole that fits
      holes.sort((a, b) => a.size - b.size);
      targetHole = holes[0];
    } else if (strategy === 'Worst') {
      // Largest hole
      holes.sort((a, b) => b.size - a.size);
      targetHole = holes[0];
    }

    // Split target hole
    const newSegments = [...segments];
    const originalHole = newSegments[targetHole.idx];
    const remainingSize = originalHole.size - requestSize;

    if (remainingSize === 0) {
      newSegments[targetHole.idx] = {
        id: Math.random(),
        size: requestSize,
        allocated: true,
        pid: `Proc ${Math.floor(Math.random() * 900) + 100}`,
      };
    } else {
      newSegments.splice(
        targetHole.idx,
        1,
        {
          id: Math.random(),
          size: requestSize,
          allocated: true,
          pid: `Proc ${Math.floor(Math.random() * 900) + 100}`,
        },
        {
          id: Math.random(),
          size: remainingSize,
          allocated: false,
        }
      );
    }

    setSegments(newSegments);
    setMessage(
      `Allocated ${requestSize} MB using ${strategy} Fit in Hole of original size ${originalHole.size} MB. Remaining fragment: ${remainingSize} MB.`
    );
  };

  const handleCompaction = () => {
    const allocated = segments.filter((s) => s.allocated);
    const totalFreeSize = segments
      .filter((s) => !s.allocated)
      .reduce((acc, s) => acc + s.size, 0);

    setSegments([
      ...allocated,
      { id: Math.random(), size: totalFreeSize, allocated: false },
    ]);
    setMessage(
      `COMPACTION COMPLETE: Combined all scattered fragments into one single contiguous ${totalFreeSize} MB free hole!`
    );
  };

  const handleReset = () => {
    setSegments([
      { id: 1, size: 50, allocated: true, pid: 'OS Kernel' },
      { id: 2, size: 40, allocated: false },
      { id: 3, size: 80, allocated: true, pid: 'Process P1' },
      { id: 4, size: 30, allocated: false },
      { id: 5, size: 100, allocated: true, pid: 'Process P2' },
      { id: 6, size: 60, allocated: false },
    ]);
    setMessage('Memory state reset to initial fragmentation.');
  };

  const totalMem = segments.reduce((a, b) => a + b.size, 0);

  return (
    <div className="bg-white border border-[#dfd7c6] rounded-xl p-5 space-y-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#dfd7c6]/60">
        <div>
          <h4 className="font-mono font-bold text-sm text-[#2c2825]">
            Dynamic Memory Partition Allocator & Compaction
          </h4>
          <p className="text-xs text-[#78716c]">
            Interactive First Fit, Best Fit, Worst Fit algorithms and External Fragmentation resolution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCompaction}
            className="px-3 py-1.5 bg-[#1e5327] text-white text-xs font-mono font-semibold rounded-lg hover:bg-[#163f1e] transition-colors"
          >
            Run Compaction
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-xs font-mono text-[#78716c] hover:bg-[#f5f0e1] hover:text-[#2c2825] transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Control Bar - Flat, No Nested Card Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-3 border-b border-[#dfd7c6]/60 text-xs font-mono">
        <div>
          <span className="text-[#78716c] text-[11px] block mb-1">Fitting Strategy:</span>
          <div className="flex gap-1">
            {(['First', 'Best', 'Worst'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStrategy(s)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  strategy === s ? 'bg-[#2d5a88] text-white font-bold' : 'text-[#57534e] hover:bg-stone-100'
                }`}
              >
                {s} Fit
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[#78716c] text-[11px]">Request Size:</span>
            <span className="font-bold text-[#2d5a88]">{requestSize} MB</span>
          </div>
          <input
            type="range"
            min={10}
            max={70}
            step={5}
            value={requestSize}
            onChange={(e) => setRequestSize(Number(e.target.value))}
            className="w-full accent-[#2d5a88]"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={handleAllocate}
            className="w-full py-1.5 bg-[#2d5a88] text-white font-medium rounded-lg hover:bg-[#23476c] transition-colors"
          >
            Allocate {requestSize} MB Process
          </button>
        </div>
      </div>

      {/* Visual Memory Strip */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-[11px] font-mono text-[#78716c]">
          <span>Physical Address: 0x00000000 (0 MB)</span>
          <span>Total RAM: {totalMem} MB</span>
        </div>
        <div className="flex h-12 w-full rounded-lg overflow-hidden border border-[#dfd7c6] bg-stone-50">
          {segments.map((s, idx) => {
            const widthPct = (s.size / totalMem) * 100;
            return (
              <div
                key={idx}
                style={{ width: `${widthPct}%` }}
                className={`h-full flex flex-col items-center justify-center border-r border-white/20 font-mono text-xs transition-all ${
                  s.allocated
                    ? s.pid === 'OS Kernel'
                      ? 'bg-[#1c1917] text-white font-bold'
                      : 'bg-[#2d5a88] text-white font-bold'
                    : 'bg-[#e7e0cf] text-[#78716c] font-semibold border-dashed'
                }`}
                title={`${s.allocated ? s.pid : 'FREE HOLE'}: ${s.size} MB`}
              >
                <span className="text-[10px] leading-tight truncate px-1">
                  {s.allocated ? s.pid : 'FREE'}
                </span>
                <span className="text-[8px] opacity-75">{s.size} MB</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Feedback - Flat Accent Line, No Box */}
      <div className="border-l-2 border-[#2d5a88] pl-3 py-1 text-xs font-mono text-[#44403c]">
        <strong className="text-[#2d5a88]">Allocator Status:</strong> {message}
      </div>
    </div>
  );
};

// ==========================================
// 2. PAGING & TLB ADDRESS TRANSLATION
// ==========================================
export const PagingTranslationVisualizer: React.FC = () => {
  const [logicalPage, setLogicalPage] = useState<number>(2);
  const [offset, setOffset] = useState<number>(1024);
  const pageSize = 4096; // 4 KB

  // Page table: Page 0->5, 1->2, 2->8, 3->1
  const pageTable: Record<number, number> = {
    0: 5,
    1: 2,
    2: 8,
    3: 1,
  };

  // TLB has cached 2 entries: 1->2, 2->8
  const tlbCache: Record<number, number> = {
    1: 2,
    2: 8,
  };

  const isTLBHit = tlbCache[logicalPage] !== undefined;
  const frameNumber = pageTable[logicalPage];
  const physicalAddress = frameNumber * pageSize + offset;

  return (
    <div className="bg-white border border-[#dfd7c6] rounded-xl p-5 space-y-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#dfd7c6]/60">
        <div>
          <h4 className="font-mono font-bold text-sm text-[#2c2825]">
            Hardware Paging & TLB Address Translation Engine
          </h4>
          <p className="text-xs text-[#78716c]">
            Interactive mapping from Logical Address [p, d] to Physical Address [f, d].
          </p>
        </div>
      </div>

      {/* Input Controls - Flat, No Nested Card Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-3 border-b border-[#dfd7c6]/60 text-xs font-mono">
        <div>
          <span className="text-[#78716c] text-[11px] block mb-1">Select Logical Page Number (p):</span>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map((p) => (
              <button
                key={p}
                onClick={() => setLogicalPage(p)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  logicalPage === p ? 'bg-[#2d5a88] text-white font-bold' : 'text-[#57534e] hover:bg-stone-100'
                }`}
              >
                Page {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[#78716c] text-[11px]">Page Offset (d):</span>
            <span className="font-bold text-[#2d5a88]">{offset} bytes (within 4KB Page)</span>
          </div>
          <input
            type="range"
            min={0}
            max={4095}
            step={128}
            value={offset}
            onChange={(e) => setOffset(Number(e.target.value))}
            className="w-full accent-[#2d5a88]"
          />
        </div>
      </div>

      {/* Translation Flow Architecture - Clean Columns, No Nested Subcards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
        {/* Step 1: Logical Address */}
        <div className="p-3 rounded-lg border border-[#dfd7c6] bg-stone-50 text-center space-y-1">
          <span className="text-[10px] text-[#78716c] uppercase tracking-wider block">1. CPU Logical Address</span>
          <div className="text-sm font-bold text-[#2d5a88]">
            [ Page: {logicalPage} | Offset: {offset} ]
          </div>
          <span className="text-[10px] text-[#78716c] block">4KB Page Boundary</span>
        </div>

        {/* Step 2: TLB Lookup */}
        <div
          className={`p-3 rounded-lg border text-center space-y-1 transition-all ${
            isTLBHit ? 'bg-emerald-50 border-emerald-300' : 'bg-amber-50 border-amber-300'
          }`}
        >
          <span className="text-[10px] text-[#78716c] uppercase tracking-wider block">2. Hardware TLB Cache</span>
          <div
            className={`text-sm font-bold ${
              isTLBHit ? 'text-emerald-900' : 'text-amber-900'
            }`}
          >
            {isTLBHit ? 'TLB HIT (< 1 ns)' : 'TLB MISS -> Page Walk'}
          </div>
          <span className="text-[10px] text-[#78716c] block">
            {isTLBHit ? 'Instant silicon lookup' : 'Main memory bus query'}
          </span>
        </div>

        {/* Step 3: Physical Address */}
        <div className="p-3 rounded-lg border border-[#cbe0cc] bg-emerald-50 text-center space-y-1">
          <span className="text-[10px] text-[#1e5327] uppercase tracking-wider block">3. Resulting RAM Address</span>
          <div className="text-sm font-bold text-[#1e5327]">
            [ Frame: {frameNumber} | Offset: {offset} ]
          </div>
          <span className="text-[10px] text-[#1e5327] block font-bold">
            Hex: 0x{physicalAddress.toString(16).toUpperCase()} ({physicalAddress} B)
          </span>
        </div>
      </div>

      {/* Formula Explanation - Flat Accent Line */}
      <div className="border-l-2 border-[#2d5a88] pl-3 py-1 text-xs font-mono text-[#44403c]">
        <strong className="text-[#2d5a88]">Physical Address Calculation:</strong> (Frame × 4096) + Offset =
        ({frameNumber} × 4096) + {offset} = <strong>{physicalAddress}</strong> (0x{physicalAddress.toString(16).toUpperCase()})
      </div>
    </div>
  );
};

// ==========================================
// 3. PAGE REPLACEMENT RACE (FIFO, LRU, OPTIMAL)
// ==========================================
export const PageReplacementVisualizer: React.FC = () => {
  const [algo, setAlgo] = useState<'FIFO' | 'LRU' | 'OPT'>('LRU');
  const [step, setStep] = useState<number>(0);

  const refString = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3];
  const frameCount = 3;

  const simulation = useMemo(() => {
    const states: Array<{
      currentRef: number;
      frames: number[];
      isHit: boolean;
      faults: number;
    }> = [];

    const frames: number[] = [];
    let faults = 0;
    const lruMap: Record<number, number> = {};

    for (let i = 0; i < refString.length; i++) {
      const page = refString[i];
      const hit = frames.includes(page);

      if (hit) {
        lruMap[page] = i;
      } else {
        faults++;
        if (frames.length < frameCount) {
          frames.push(page);
          lruMap[page] = i;
        } else {
          // Eviction
          let victimIdx = 0;
          if (algo === 'FIFO') {
            victimIdx = 0; // Replace oldest
          } else if (algo === 'LRU') {
            let minTime = Infinity;
            frames.forEach((f, idx) => {
              if (lruMap[f] < minTime) {
                minTime = lruMap[f];
                victimIdx = idx;
              }
            });
          } else {
            // OPTIMAL
            let furthest = -1;
            frames.forEach((f, idx) => {
              let nextUse = Infinity;
              for (let k = i + 1; k < refString.length; k++) {
                if (refString[k] === f) {
                  nextUse = k;
                  break;
                }
              }
              if (nextUse > furthest) {
                furthest = nextUse;
                victimIdx = idx;
              }
            });
          }

          frames.splice(victimIdx, 1);
          frames.push(page);
          lruMap[page] = i;
        }
      }

      states.push({
        currentRef: page,
        frames: [...frames],
        isHit: hit,
        faults,
      });
    }

    return states;
  }, [algo]);

  const current = simulation[step];

  return (
    <div className="bg-white border border-[#dfd7c6] rounded-xl p-5 space-y-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#dfd7c6]/60">
        <div>
          <h4 className="font-mono font-bold text-sm text-[#2c2825]">
            Page Replacement Race: FIFO vs LRU vs Optimal
          </h4>
          <p className="text-xs text-[#78716c]">
            Observe cache hits, victim frame evictions, and Belady anomaly immunity.
          </p>
        </div>

        {/* Algorithm Switcher - Flat */}
        <div className="flex items-center gap-1">
          {(['FIFO', 'LRU', 'OPT'] as const).map((a) => (
            <button
              key={a}
              onClick={() => {
                setAlgo(a);
                setStep(0);
              }}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                algo === a ? 'bg-[#2d5a88] text-white font-bold' : 'text-[#78716c] hover:bg-stone-100'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Stepper Controls - Flat, No Nested Card Box */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#dfd7c6]/60 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[#78716c] text-[11px]">Reference String:</span>
          <div className="flex gap-1.5">
            {refString.map((p, idx) => (
              <span
                key={idx}
                className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[11px] transition-all ${
                  step === idx
                    ? 'bg-[#2d5a88] text-white ring-2 ring-[#2d5a88]/30'
                    : idx < step
                    ? 'bg-stone-200 text-stone-700'
                    : 'bg-stone-50 border border-[#dfd7c6] text-[#78716c]'
                }`}
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep((prev) => Math.max(0, prev - 1))}
            disabled={step === 0}
            className="px-2.5 py-1 rounded border border-[#dfd7c6] text-xs font-mono text-[#57534e] hover:bg-stone-50 disabled:opacity-30"
          >
            Prev
          </button>
          <button
            onClick={() => setStep((prev) => Math.min(refString.length - 1, prev + 1))}
            disabled={step === refString.length - 1}
            className="px-3 py-1 rounded bg-[#2d5a88] text-white text-xs font-mono font-medium hover:bg-[#23476c] disabled:opacity-30"
          >
            Next ({step + 1}/{refString.length})
          </button>
        </div>
      </div>

      {/* Frame Slots Display - Flat 3 Slots, No Nested Wrapper Card */}
      <div className="space-y-3 font-mono">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#78716c]">Physical 3-Frame RAM Allocation:</span>
          <div className="flex items-center gap-3">
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                current.isHit ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {current.isHit ? '✓ CACHE HIT' : '✗ PAGE FAULT (MISS)'}
            </span>
            <span className="font-bold text-[#2c2825] text-xs">Faults: {current.faults}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((slotIdx) => {
            const pageInSlot = current.frames[slotIdx];
            return (
              <div
                key={slotIdx}
                className={`p-3 rounded-lg border text-center font-bold transition-all ${
                  pageInSlot !== undefined
                    ? 'bg-[#edf5ed] border-[#cbe0cc] text-[#1e5327]'
                    : 'bg-stone-50 border-stone-200 text-stone-400'
                }`}
              >
                <span className="text-[10px] text-[#78716c] block font-normal mb-1">Frame {slotIdx}</span>
                <span className="text-base">{pageInSlot !== undefined ? `Page ${pageInSlot}` : '[ Empty ]'}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
