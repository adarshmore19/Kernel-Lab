import React from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, FastForward } from 'lucide-react';

interface SimulationControlsProps {
  isPlaying: boolean;
  currentTime: number;
  totalTime: number;
  playbackSpeed: number; // in ms per step, e.g. 1000, 500, 250
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onRestart: () => void;
  onSpeedChange: (speed: number) => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  isPlaying,
  currentTime,
  totalTime,
  playbackSpeed,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onRestart,
  onSpeedChange,
}) => {
  return (
    <div className="bg-[#0e1424] border border-[#1e2a42] rounded-xl px-5 py-3 shadow-md flex flex-wrap items-center justify-between gap-4 font-mono">
      {/* Playback Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRestart}
          title="Restart Simulation (t=0)"
          className="p-2 bg-[#172033] hover:bg-slate-800 border border-[#212f4d] text-slate-300 rounded-lg text-xs transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onStepBackward}
          disabled={currentTime <= 0 || isPlaying}
          title="Step Backward (t-1)"
          className="p-2 bg-[#172033] hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border border-[#212f4d] text-slate-300 rounded-lg text-xs transition-colors"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        {isPlaying ? (
          <button
            onClick={onPause}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-all"
          >
            <Pause className="w-4 h-4 fill-current" />
            Pause
          </button>
        ) : (
          <button
            onClick={onPlay}
            disabled={currentTime >= totalTime}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            Play
          </button>
        )}

        <button
          onClick={onStepForward}
          disabled={currentTime >= totalTime || isPlaying}
          title="Step Forward (t+1)"
          className="p-2 bg-[#172033] hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border border-[#212f4d] text-slate-300 rounded-lg text-xs transition-colors"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Progress / Step indicator */}
      <div className="flex items-center gap-3 text-xs text-slate-300">
        <span>
          Time step: <strong className="text-cyan-400 text-sm">{currentTime}</strong> / {totalTime}
        </span>
        <div className="w-32 bg-[#090d16] border border-[#1e2738] h-2 rounded-full overflow-hidden">
          <div
            className="bg-cyan-400 h-full transition-all duration-150"
            style={{ width: `${totalTime > 0 ? (currentTime / totalTime) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Speed Selector */}
      <div className="flex items-center gap-2 text-xs">
        <FastForward className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-400">Speed:</span>
        {[
          { label: '0.5x', speed: 1000 },
          { label: '1x', speed: 500 },
          { label: '2x', speed: 200 },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() => onSpeedChange(s.speed)}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              playbackSpeed === s.speed
                ? 'bg-cyan-950 border border-cyan-600 text-cyan-300 font-bold'
                : 'bg-[#172033] border border-[#212f4d] text-slate-400 hover:text-slate-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};
