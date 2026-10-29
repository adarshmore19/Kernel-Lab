import React from 'react';
import { BookOpen, Info } from 'lucide-react';
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
    <div className="bg-[#fdfbf6] border border-[#dfd7c6] rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#dfd7c6]">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#2d5a88]" />
          <h4 className="text-xs uppercase font-bold text-[#2c2825] tracking-wider font-mono">
            Scheduler Decision Explainer & Theory
          </h4>
        </div>
        <span className="text-xs font-mono text-[#1e4569] bg-[#ebf2f8] px-2 py-0.5 rounded border border-[#c8d9e8]">
          {result.algorithmName}
        </span>
      </div>

      {/* Step Decision Callout */}
      {currentRecord && (
        <div className="p-3.5 bg-[#ebf2f8]/70 border border-[#c8d9e8] rounded-lg flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#2d5a88] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#1e4569] font-mono">
              Live Decision at t = {currentTime}:
            </span>
            <p className="text-xs text-[#2c2825] font-sans leading-relaxed">
              {currentRecord.actionDescription}
            </p>
          </div>
        </div>
      )}

      {/* Algorithm Theory & Educational Notes */}
      <div className="space-y-2 pt-1 font-sans text-xs">
        <span className="font-semibold text-[#57534e] uppercase tracking-wider text-[11px] font-mono block">
          Algorithmic Principles:
        </span>
        <ul className="space-y-1.5 text-[#57534e]">
          {result.educationalNotes.map((note, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-[#2d5a88] font-mono font-bold">&bull;</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
