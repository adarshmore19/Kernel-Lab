import React from 'react';
import { BookOpen, Sparkles, HelpCircle } from 'lucide-react';
import { SchedulingResult, TimeSliceRecord } from '../../types/scheduler';

interface EducationalExplanationProps {
  result: SchedulingResult;
  currentRecord?: TimeSliceRecord;
  currentTime: number;
}

export const EducationalExplanation: React.FC<EducationalExplanationProps> = ({
  result,
  currentRecord,
  currentTime,
}) => {
  return (
    <div className="bg-[#0e1424] border border-[#1e2a42] rounded-xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#1b253b]">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs uppercase font-bold text-slate-200 tracking-wider font-mono">
            Scheduler Decision Explainer & Theory
          </h4>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
          {result.algorithmName}
        </span>
      </div>

      {/* Step Decision Callout */}
      {currentRecord && (
        <div className="p-3.5 bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-800/50 rounded-lg flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-bold text-cyan-300 font-mono">
              Live Decision at t = {currentTime}:
            </span>
            <p className="text-xs text-slate-200 font-sans leading-relaxed">
              {currentRecord.actionDescription}
            </p>
          </div>
        </div>
      )}

      {/* Algorithm Theory & Educational Notes */}
      <div className="space-y-2 pt-1 font-sans text-xs">
        <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px] font-mono block">
          Algorithmic Principles:
        </span>
        <ul className="space-y-1.5 text-slate-300">
          {result.educationalNotes.map((note, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-cyan-400 font-mono font-bold">&bull;</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
