import React, { useState } from 'react';
import { Trophy, CheckCircle2, Circle, HelpCircle, ArrowRight, Check } from 'lucide-react';
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
    }
  };

  return (
    <div className="bg-[#fdfbf6] border border-[#dfd7c6] rounded-xl p-5 my-6 shadow-xs font-sans">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-[#ebf2f8] text-[#1e4569] border border-[#c8d9e8] font-mono">
              Interactive Challenge
            </span>
            <div className="flex items-center gap-1 text-xs text-[#7d4e08] font-semibold bg-[#fbf3e4] px-2 py-0.5 rounded border border-[#ecd6b2] font-mono">
              <Trophy className="w-3.5 h-3.5 text-[#b45309]" />
              <span>+{challenge.xp} XP</span>
            </div>
          </div>
          <h4 className="text-base font-bold text-[#2c2825] mt-1">{challenge.title}</h4>
          <p className="text-xs text-[#57534e]">{challenge.description}</p>
        </div>

        {isCompleted && (
          <span className="px-2.5 py-1 text-xs rounded-full bg-[#edf5ed] border border-[#cbe0cc] text-[#1e5327] font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1e5327]" />
            Solved
          </span>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 space-y-2">
        <span className="text-xs font-semibold text-[#2c2825] tracking-wider font-mono">
          Objectives:
        </span>
        <ul className="space-y-1.5 text-xs text-[#2c2825]">
          {challenge.instructions.map((inst, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-[#2d5a88] font-bold font-mono">0{idx + 1}.</span>
              <span>{inst}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Evaluation Results if Run */}
      {evaluation && (
        <div className="mt-4 p-3.5 rounded-lg bg-[#f4f0e5] border border-[#dfd7c6] space-y-2 font-mono">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#57534e]">Filesystem Evaluation:</span>
            <span
              className={`font-bold ${
                evaluation.allPassed ? 'text-[#1e5327]' : 'text-[#b45309]'
              }`}
            >
              {evaluation.allPassed ? 'Complete' : 'Pending Requirements'}
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            {evaluation.results.map((res, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                {res.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-[#1e5327] shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-[#a8a29e] shrink-0" />
                )}
                <span
                  className={
                    res.passed ? 'text-[#1e5327]' : 'text-[#57534e]'
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
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#dfd7c6]">
        <button
          onClick={() => setShowHints(!showHints)}
          className="text-xs text-[#78716c] hover:text-[#2d5a88] flex items-center gap-1 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          {showHints ? 'Hide Hints' : 'Need a hint?'}
        </button>

        <button
          onClick={handleVerify}
          className="px-4 py-2 bg-[#2d5a88] hover:bg-[#23476d] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
        >
          <Check className="w-3.5 h-3.5" />
          Verify Solution in Virtual FS
        </button>
      </div>

      {/* Hints Panel */}
      {showHints && (
        <div className="mt-3 p-3 bg-[#f4f0e5] border border-[#dfd7c6] rounded-lg text-xs space-y-2">
          <span className="font-semibold text-[#2c2825] font-mono">Solution Hints:</span>
          {challenge.hints.map((h, i) => (
            <div key={i} className="flex items-center justify-between text-[#2c2825]">
              <span className="font-mono">{h}</span>
              {onInsertCommand && (
                <button
                  onClick={() => onInsertCommand(h.replace(/`/g, ''))}
                  className="px-2 py-0.5 bg-[#fdfbf6] hover:bg-[#ebf2f8] text-[#1e4569] border border-[#dfd7c6] rounded text-[11px] flex items-center gap-1 transition-colors"
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
