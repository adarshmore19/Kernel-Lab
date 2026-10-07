import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Cpu, BarChart2, Play, Sparkles, BookOpen } from 'lucide-react';
import { AlgorithmType, Process, SchedulingResult } from '../types/scheduler';
import { SCHEDULER_PRESETS } from '../engine/scheduling/presets';
import { runScheduler, schedulers } from '../engine/scheduling';
import { ProcessInputTable } from '../components/scheduler/ProcessInputTable';
import { GanttChart } from '../components/scheduler/GanttChart';
import { SimulationControls } from '../components/scheduler/SimulationControls';
import { ProcessQueueVisualizer } from '../components/scheduler/ProcessQueueVisualizer';
import { MetricsSummary } from '../components/scheduler/MetricsSummary';
import { AlgorithmComparison } from '../components/scheduler/AlgorithmComparison';
import { EducationalExplanation } from '../components/scheduler/EducationalExplanation';

export const SchedulerLabPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'simulator' | 'compare'>('simulator');

  const [processes, setProcesses] = useState<Process[]>(() =>
    JSON.parse(JSON.stringify(SCHEDULER_PRESETS[0].processes))
  );
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('FCFS');
  const [quantum, setQuantum] = useState<number>(3);

  // Playback state
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(500);

  // Run the scheduler algorithm
  const result: SchedulingResult = useMemo(() => {
    return runScheduler(algorithm, processes, quantum);
  }, [algorithm, processes, quantum]);

  const totalTime = result.metrics.totalTime;

  // Playback timer loop
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalTime) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, totalTime, playbackSpeed]);

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleStepForward = () => {
    setCurrentTime((prev) => Math.min(totalTime, prev + 1));
  };

  const handleStepBackward = () => {
    setCurrentTime((prev) => Math.max(0, prev - 1));
  };

  // Find the timeline record for the current timestamp
  const currentRecord = result.timeline.find((t) => t.time === currentTime);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Top Header & View Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1b253b]">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              CPU Scheduling Simulator & Visualizer
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Experiment with CPU scheduling algorithms, analyze animated Gantt charts, and compare performance metrics.
          </p>
        </div>

        {/* View Switcher: Simulator vs Comparison */}
        <div className="flex items-center gap-1 bg-[#0e1424] border border-[#1e2a42] p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('simulator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all ${
              activeSubTab === 'simulator'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </button>

          <button
            onClick={() => setActiveSubTab('compare')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all ${
              activeSubTab === 'compare'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Algorithm Comparison</span>
          </button>
        </div>
      </div>

      {/* Simulator View */}
      {activeSubTab === 'simulator' ? (
        <div className="space-y-6">
          {/* 1. Process Input Table */}
          <ProcessInputTable
            processes={processes}
            algorithm={algorithm}
            quantum={quantum}
            onProcessesChange={(newProcs) => {
              setProcesses(newProcs);
              handleRestart();
            }}
            onAlgorithmChange={(algo) => {
              setAlgorithm(algo);
              handleRestart();
            }}
            onQuantumChange={(q) => {
              setQuantum(q);
              handleRestart();
            }}
            onResetSimulation={handleRestart}
          />

          {/* 2. Simulation Playback Controls */}
          <SimulationControls
            isPlaying={isPlaying}
            currentTime={currentTime}
            totalTime={totalTime}
            playbackSpeed={playbackSpeed}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onStepForward={handleStepForward}
            onStepBackward={handleStepBackward}
            onRestart={handleRestart}
            onSpeedChange={setPlaybackSpeed}
          />

          {/* 3. Gantt Chart */}
          <GanttChart
            ganttChart={result.ganttChart}
            currentTime={currentTime}
            totalTime={totalTime}
            onTimeSeek={(t) => {
              setIsPlaying(false);
              setCurrentTime(t);
            }}
          />

          {/* 4. Live Process Queue & State Visualizer */}
          <ProcessQueueVisualizer
            currentRecord={currentRecord}
            processes={processes}
            currentTime={currentTime}
          />

          {/* 5. Educational Explanation */}
          <EducationalExplanation
            result={result}
            currentRecord={currentRecord}
            currentTime={currentTime}
          />

          {/* 6. Metrics Summary Table */}
          <MetricsSummary metrics={result.metrics} />
        </div>
      ) : (
        /* Comparison View */
        <div className="space-y-6">
          <AlgorithmComparison processes={processes} quantum={quantum} />
        </div>
      )}
    </div>
  );
};
