import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle2, Circle, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Challenge } from '../../types/curriculum';
import { evaluateChallenge, ChallengeEvaluation } from '../../data/curriculum/challenges';
import { VirtualFS } from '../../engine/filesystem/VirtualFS';

interface ChallengeCardProps {
  challenge: Challenge;
  fs: VirtualFS;
  isCompleted: boolean;
  onComplete: (challengeId: string, xp: number) => void;
  onInsertCommand?: (cmd: string) => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  fs,
  isCompleted,
  onComplete,
  onInsertCommand,
}) => {
  const [evaluation, setEvaluation] = useState<ChallengeEvaluation | null>(null);
  const [showHints, setShowHints] = useState(false);

  const handleVerify = () => {
    const result = evaluateChallenge(challenge, fs);
    setEvaluation(result);

    if (result.allPassed && !isCompleted) {
      onComplete(challenge.id, challenge.xp);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#34d399', '#f59e0b'],
      });
    }
  };

  return (
    <div className="bg-[#0e1424] border border-[#1e2a42] rounded-xl p-5 my-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-500 to-amber-500 opacity-60" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
              Interactive Challenge
            </span>
            <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
              <Trophy className="w-3.5 h-3.5" />
              <span>+{challenge.xp} XP</span>
            </div>
          </div>
          <h4 className="text-base font-bold text-slate-100 mt-1">{challenge.title}</h4>
          <p className="text-xs text-slate-400">{challenge.description}</p>
        </div>

        {isCompleted && (
          <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Solved!
          </span>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 space-y-2">
        <span className="text-xs font-semibold text-slate-300 tracking-wider font-mono">
          Objectives:
        </span>
        <ul className="space-y-1.5 text-xs text-slate-300">
          {challenge.instructions.map((inst, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold font-mono">0{idx + 1}.</span>
              <span>{inst}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Evaluation Results if Run */}
      {evaluation && (
        <div className="mt-4 p-3.5 rounded-lg bg-[#080c16] border border-[#1b253b] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Filesystem Evaluation:</span>
            <span
              className={`font-bold ${
                evaluation.allPassed ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {evaluation.allPassed ? '✓ Complete!' : 'Pending Requirements'}
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            {evaluation.results.map((res, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                {res.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                )}
                <span
                  className={
                    res.passed ? 'text-emerald-200' : 'text-slate-400'
                  }
                >
                  {res.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hints Toggle & Action Buttons */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1b253b]">
        <button
          onClick={() => setShowHints(!showHints)}
          className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          {showHints ? 'Hide Hints' : 'Need a hint?'}
        </button>

        <button
          onClick={handleVerify}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Verify Solution in Virtual FS
        </button>
      </div>

      {/* Hints Panel */}
      {showHints && (
        <div className="mt-3 p-3 bg-cyan-950/20 border border-cyan-800/30 rounded-lg text-xs space-y-2">
          <span className="font-semibold text-cyan-300">Solution Hints:</span>
          {challenge.hints.map((h, i) => (
            <div key={i} className="flex items-center justify-between text-slate-300">
              <span className="font-mono">{h}</span>
              {onInsertCommand && (
                <button
                  onClick={() => onInsertCommand(h.replace(/`/g, ''))}
                  className="px-2 py-0.5 bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 rounded text-[11px] flex items-center gap-1 transition-colors"
                >
                  Insert <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
