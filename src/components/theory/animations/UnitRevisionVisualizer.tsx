import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  Award,
  ChevronRight,
} from 'lucide-react';
import { TheoryTopic } from '../../../types/theory';

interface UnitRevisionProps {
  topic: TheoryTopic;
}

export const UnitRevisionVisualizer: React.FC<UnitRevisionProps> = ({ topic }) => {
  const [activeCard, setActiveCard] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [answeredCards, setAnsweredCards] = useState<Record<number, boolean>>({});

  const questions = topic.examNotes.frequentQuestions;

  const handleNext = () => {
    setShowAnswer(false);
    setActiveCard((prev) => (prev + 1) % questions.length);
  };

  const handleSelfGrade = (correct: boolean) => {
    if (!answeredCards[activeCard]) {
      setAnsweredCards({ ...answeredCards, [activeCard]: true });
      if (correct) setQuizScore((prev) => prev + 1);
    }
    handleNext();
  };

  const handleReset = () => {
    setActiveCard(0);
    setShowAnswer(false);
    setQuizScore(0);
    setAnsweredCards({});
  };

  return (
    <div className="bg-white border border-[#dfd7c6] rounded-xl p-5 space-y-5 shadow-xs font-mono">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#dfd7c6]/60">
        <div>
          <h4 className="font-bold text-sm text-[#2c2825]">
            {topic.title} — Viva & Flashcard Drill
          </h4>
          <p className="text-xs text-[#78716c] font-sans">
            Test your recall on high-frequency semester examination and technical interview viva prompts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-[#b45309] font-bold flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#b45309]" />
            <span>Score: {quizScore} / {questions.length}</span>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-xs font-mono text-[#78716c] hover:bg-[#f5f0e1] hover:text-[#2c2825] transition-colors"
            title="Reset Quiz"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Flashcard Section - Open, Border-less Typography */}
      {questions.length > 0 ? (
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#2d5a88] block">
              Exam Viva Prompt {activeCard + 1} of {questions.length}
            </span>
            <h5 className="text-base font-bold text-[#2c2825] font-sans">
              {questions[activeCard].question}
            </h5>
          </div>

          {showAnswer ? (
            <div className="border-l-2 border-emerald-600 pl-4 py-1 text-xs text-[#2c2825] font-sans leading-relaxed space-y-1">
              <strong className="block text-[11px] font-mono uppercase tracking-wider text-emerald-800">
                Official Answer & Solution:
              </strong>
              <p className="text-[#44403c]">{questions[activeCard].answer}</p>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setShowAnswer(true)}
                className="px-3.5 py-1.5 bg-[#2d5a88] text-white text-xs font-mono font-medium rounded-lg hover:bg-[#23476c] transition-colors"
              >
                Reveal Model Answer
              </button>
            </div>
          )}

          {showAnswer && (
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-[#78716c] font-mono">Self Assessment:</span>
              <button
                onClick={() => handleSelfGrade(true)}
                className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#1e5327] text-white text-xs font-mono font-medium hover:bg-[#163f1e] transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Knew It (+1)</span>
              </button>
              <button
                onClick={() => handleSelfGrade(false)}
                className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#9f1239] text-white text-xs font-mono font-medium hover:bg-[#7e0e2d] transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Need Review</span>
              </button>
            </div>
          )}
        </div>
      ) : null}

      {/* Critical Differences / Formula Matrix */}
      {topic.examNotes.keyDifferences && topic.examNotes.keyDifferences.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-[#dfd7c6]/60">
          <span className="text-xs font-mono font-bold text-[#57534e] block">
            High-Yield Architectural Comparison:
          </span>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-[#dfd7c6] text-[#78716c] text-[11px]">
                  <th className="pb-2 text-left font-semibold">Feature</th>
                  <th className="pb-2 text-left font-semibold">Concept A</th>
                  <th className="pb-2 text-left font-semibold">Concept B</th>
                  <th className="pb-2 text-left font-semibold">Architectural Distinction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dfd7c6]/60">
                {topic.examNotes.keyDifferences.map((d, i) => (
                  <tr key={i} className="hover:bg-[#f5f0e1]/40 transition-colors">
                    <td className="py-2 font-bold text-[#2d5a88]">{d.feature}</td>
                    <td className="py-2 text-[#57534e]">{d.itemA}</td>
                    <td className="py-2 text-[#57534e]">{d.itemB}</td>
                    <td className="py-2 text-[#b45309] font-medium">{d.difference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
