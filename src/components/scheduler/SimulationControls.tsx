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
    <div className="bg-[#fdfbf6] border border-[#dfd7c6] rounded-xl px-5 py-3 shadow-xs flex flex-wrap items-center justify-between gap-4 font-mono">
      {/* Playback Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRestart}
          title="Restart Simulation (t=0)"
          className="p-2 bg-[#eee8db] hover:bg-[#e4ddd0] border border-[#dfd7c6] text-[#2c2825] rounded-lg text-xs transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onStepBackward}
          disabled={currentTime <= 0 || isPlaying}
          title="Step Backward (t-1)"
          className="p-2 bg-[#eee8db] hover:bg-[#e4ddd0] disabled:opacity-40 disabled:cursor-not-allowed border border-[#dfd7c6] text-[#2c2825] rounded-lg text-xs transition-colors"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        {isPlaying ? (
          <button
            onClick={onPause}
            className="px-4 py-2 bg-[#b45309] hover:bg-[#92400e] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
          >
            <Pause className="w-4 h-4 fill-current" />
            Pause
          </button>
        ) : (
          <button
            onClick={onPlay}
            disabled={currentTime >= totalTime}
            className="px-4 py-2 bg-[#2d5a88] hover:bg-[#23476d] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            Play
          </button>
        )}

        <button
          onClick={onStepForward}
          disabled={currentTime >= totalTime || isPlaying}
          title="Step Forward (t+1)"
          className="p-2 bg-[#eee8db] hover:bg-[#e4ddd0] disabled:opacity-40 disabled:cursor-not-allowed border border-[#dfd7c6] text-[#2c2825] rounded-lg text-xs transition-colors"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Progress / Step indicator */}
      <div className="flex items-center gap-3 text-xs text-[#57534e]">
        <span>
          Time step: <strong className="text-[#2d5a88] text-sm">{currentTime}</strong> / {totalTime}
        </span>
        <div className="w-32 bg-[#eee8db] border border-[#dfd7c6] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#2d5a88] h-full transition-all duration-150"
            style={{ width: `${totalTime > 0 ? (currentTime / totalTime) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Speed Selector */}
      <div className="flex items-center gap-2 text-xs">
        <FastForward className="w-3.5 h-3.5 text-[#a8a29e]" />
        <span className="text-[#78716c]">Speed:</span>
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
                ? 'bg-[#ebf2f8] border border-[#c8d9e8] text-[#1e4569] font-bold'
                : 'bg-[#eee8db] border border-[#dfd7c6] text-[#57534e] hover:text-[#2c2825]'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};
