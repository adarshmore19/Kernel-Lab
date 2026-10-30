import React, { useState } from 'react';
import {
  Sparkles,
  Briefcase,
  BookOpen,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Code2,
} from 'lucide-react';
import { TheoryTopic } from '../../types/theory';
import {
  RTOSDeadlineVisualizer,
  DistributedClusterVisualizer,
  SystemCallTrapVisualizer,
} from './animations/Unit1Animations';
import {
  ThreadModelsVisualizer,
  IPCSimulator,
  ContextSwitchVisualizer,
} from './animations/Unit2Animations';
import {
  CPUSchedulingSimulator,
  DeadlockRAGVisualizer,
  BankersAlgorithmVisualizer,
} from './animations/Unit3Animations';
import {
  MemoryPartitioningVisualizer,
  PagingTranslationVisualizer,
  PageReplacementVisualizer,
} from './animations/Unit4Animations';
import {
  DirectoryStructuresVisualizer,
  FileAllocationVisualizer,
} from './animations/Unit5Animations';
import { UnitRevisionVisualizer } from './animations/UnitRevisionVisualizer';
import { ProcessLifecycleLab } from '../labs/ProcessLifecycleLab';

interface TheoryTopicViewProps {
  topic: TheoryTopic;
  onNavigateTopic?: (topicId: string) => void;
  prevTopic?: TheoryTopic;
  nextTopic?: TheoryTopic;
}

export const TheoryTopicView: React.FC<TheoryTopicViewProps> = ({
  topic,
  onNavigateTopic,
  prevTopic,
  nextTopic,
}) => {
  const [activeTab, setActiveTab] = useState<'animation' | 'industry' | 'theory' | 'exam'>(
    'animation'
  );

  const renderAnimation = () => {
    switch (topic.animationType) {
      case 'rtos-deadlines':
        return <RTOSDeadlineVisualizer />;
      case 'distributed-cluster':
        return <DistributedClusterVisualizer />;
      case 'system-call-trap':
      case 'os-services':
      case 'os-types':
        return <SystemCallTrapVisualizer />;
      case 'process-lifecycle':
        return <ProcessLifecycleLab />;
      case 'thread-models':
        return <ThreadModelsVisualizer />;
      case 'ipc-mechanisms':
        return <IPCSimulator />;
      case 'context-switch':
      case 'schedulers-queues':
        return <ContextSwitchVisualizer />;
      case 'cpu-scheduling':
        return <CPUSchedulingSimulator />;
      case 'deadlock-rag':
        return <DeadlockRAGVisualizer />;
      case 'bankers-algorithm':
        return <BankersAlgorithmVisualizer />;
      case 'memory-partitioning':
      case 'segmentation-check':
      case 'free-space-bitmap-list':
        return <MemoryPartitioningVisualizer />;
      case 'paging-translation':
      case 'virtual-memory-page-fault':
        return <PagingTranslationVisualizer />;
      case 'page-replacement':
        return <PageReplacementVisualizer />;
      case 'directory-structures':
        return <DirectoryStructuresVisualizer />;
      case 'file-allocation':
      case 'file-access-methods':
        return <FileAllocationVisualizer />;
      case 'unit-revision':
        return <UnitRevisionVisualizer topic={topic} />;
      default:
        return <SystemCallTrapVisualizer />;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header - Open & Non-Boxed */}
      <div className="space-y-3 pb-2 border-b border-[#dfd7c6]/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono text-[#78716c]">
            {topic.unitTitle.split(':')[0]} • Topic #{topic.id}
          </div>

          {/* Quick Prev / Next Switchers */}
          <div className="flex items-center gap-2">
            {prevTopic && onNavigateTopic && (
              <button
                onClick={() => onNavigateTopic(prevTopic.id)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-[#57534e] hover:text-[#2c2825] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
            )}
            {nextTopic && onNavigateTopic && (
              <button
                onClick={() => onNavigateTopic(nextTopic.id)}
                className="flex items-center gap-1 px-3 py-1 bg-[#2d5a88] text-white rounded-md text-xs font-mono font-medium hover:bg-[#23476c] transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2c2825] tracking-tight">
            {topic.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#78716c] mt-1 leading-relaxed">
            {topic.shortSummary}
          </p>
        </div>

        {/* Key Takeaways - Simple clean list, no nested badges */}
        <div className="flex flex-wrap gap-x-5 gap-y-1 pt-1 text-xs text-[#57534e]">
          {topic.keyTakeaways.map((point, idx) => (
            <span key={idx} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2d5a88] shrink-0" />
              <span>{point}</span>
            </span>
          ))}
        </div>

        {/* Mode Switcher Tabs - Underline Tabs, No Double Box */}
        <div className="flex items-center gap-6 border-b border-[#dfd7c6] pt-3 -mb-px">
          {[
            { id: 'animation', label: 'Interactive Animation', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'industry', label: 'Industrial Applications', icon: <Briefcase className="w-4 h-4" /> },
            { id: 'theory', label: 'Theory & Architecture', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'exam', label: 'Exam & Viva Q&A', icon: <HelpCircle className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 pb-2.5 text-xs font-mono font-medium border-b-2 transition-all -mb-px ${
                activeTab === tab.id
                  ? 'border-[#2d5a88] text-[#2d5a88] font-bold'
                  : 'border-transparent text-[#78716c] hover:text-[#2c2825]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="space-y-6">
        {/* TAB 1: INTERACTIVE ANIMATION */}
        {activeTab === 'animation' && (
          <div>
            {renderAnimation()}
          </div>
        )}

        {/* TAB 2: INDUSTRIAL APPLICATIONS */}
        {activeTab === 'industry' && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3 border-b border-[#dfd7c6]/60">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#2c2825]">
                    {topic.industrialApplication.company}
                  </h3>
                  <span className="text-xs text-[#78716c] font-mono">
                    • {topic.industrialApplication.industry}
                  </span>
                </div>
                <div className="text-xs font-mono text-[#2d5a88] font-semibold mt-0.5">
                  {topic.industrialApplication.systemName}
                </div>
              </div>
              <span className="text-xs italic text-[#78716c]">
                "{topic.industrialApplication.tagline}"
              </span>
            </div>

            {/* Metrics - Clean 3-Column Stats Row, No Box Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-2">
              {topic.industrialApplication.metrics.map((m, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="text-xl font-bold text-[#2d5a88] font-mono">
                    {m.value}
                  </div>
                  <div className="text-[11px] text-[#78716c]">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Problem vs Solution - Clean Left Accent Border */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="border-l-2 border-rose-400 pl-4 space-y-1">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-rose-800 block">
                  Production Challenge
                </span>
                <p className="text-xs leading-relaxed text-[#44403c]">
                  {topic.industrialApplication.challenge}
                </p>
              </div>

              <div className="border-l-2 border-emerald-500 pl-4 space-y-1">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                  OS Architectural Solution
                </span>
                <p className="text-xs leading-relaxed text-[#44403c]">
                  {topic.industrialApplication.solution}
                </p>
              </div>
            </div>

            {/* Architecture Decisions */}
            <div className="space-y-2 pt-2">
              <h4 className="font-mono text-[11px] font-bold text-[#57534e] uppercase tracking-wider">
                Production Architectural Decisions
              </h4>
              <ul className="space-y-1.5 text-xs text-[#44403c]">
                {topic.industrialApplication.architectureDetails.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#2d5a88] font-bold">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Code / Config Snippet */}
            {topic.industrialApplication.codeOrConfigSnippet && (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#78716c]">
                  <span className="flex items-center gap-1.5 font-bold text-[#2c2825]">
                    <Code2 className="w-4 h-4 text-[#2d5a88]" />
                    {topic.industrialApplication.codeOrConfigSnippet.title}
                  </span>
                  <span className="uppercase text-[10px] text-[#78716c]">
                    {topic.industrialApplication.codeOrConfigSnippet.language}
                  </span>
                </div>
                <div className="bg-[#1c1917] text-[#f5f5f4] p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-[#44403c]">
                  <pre>{topic.industrialApplication.codeOrConfigSnippet.code}</pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: THEORY & ARCHITECTURE */}
        {activeTab === 'theory' && (
          <div className="space-y-6">
            {topic.theorySections.map((sec, idx) => (
              <div key={idx} className="space-y-2 pb-4 border-b border-[#dfd7c6]/60 last:border-0 last:pb-0">
                <h3 className="text-sm font-bold text-[#2c2825] font-mono">
                  {sec.heading}
                </h3>
                <p className="text-xs sm:text-sm text-[#44403c] leading-relaxed">
                  {sec.content}
                </p>

                {sec.bullets && (
                  <ul className="space-y-1 text-xs text-[#44403c] pl-4 pt-1">
                    {sec.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="list-disc leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}

                {sec.diagramAscii && (
                  <div className="bg-[#1c1917] text-emerald-400 p-3.5 rounded-lg font-mono text-xs overflow-x-auto border border-[#44403c] mt-2">
                    <pre>{sec.diagramAscii.trim()}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: EXAM & VIVA Q&A */}
        {activeTab === 'exam' && (
          <div className="space-y-4">
            <div className="pb-2 border-b border-[#dfd7c6]/60">
              <h3 className="text-xs font-mono font-bold text-[#2c2825] uppercase tracking-wider">
                University Semester & Viva Q&A
              </h3>
            </div>

            <div className="space-y-4">
              {topic.examNotes.frequentQuestions.map((q, idx) => (
                <div key={idx} className="space-y-1 pb-3 border-b border-[#dfd7c6]/40 last:border-0">
                  <div className="text-xs font-bold text-[#2c2825]">
                    Q{idx + 1}. {q.question}
                  </div>
                  <div className="border-l-2 border-emerald-600/70 pl-3 py-0.5 text-xs text-[#44403c] leading-relaxed">
                    {q.answer}
                  </div>
                </div>
              ))}
            </div>

            {/* Critical Formulas */}
            {topic.examNotes.criticalFormulasOrRules && (
              <div className="pt-2 border-t border-[#dfd7c6]/60 space-y-1 text-xs font-mono">
                <span className="font-bold text-[#7d4e08] block uppercase text-[10px] tracking-wider">
                  Important Exam Formulas & Rules
                </span>
                <ul className="space-y-1 text-[#7d4e08]">
                  {topic.examNotes.criticalFormulasOrRules.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span>✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
