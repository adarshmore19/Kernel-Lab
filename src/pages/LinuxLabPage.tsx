import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Terminal as TermIcon,
  Play,
  Sparkles,
  Shield,
  Layers,
} from 'lucide-react';
import { CURRICULUM_MODULES } from '../data/curriculum/modules';
import { CurriculumModule, Lesson } from '../types/curriculum';
import { Terminal } from '../components/terminal/Terminal';
import { ChallengeCard } from '../components/linux/ChallengeCard';
import { PermissionsInteractive } from '../components/linux/PermissionsInteractive';
import { VirtualFS } from '../engine/filesystem/VirtualFS';
import { TerminalEntry } from '../types/shell';

interface LinuxLabPageProps {
  fs: VirtualFS;
  fsVersion: number;
  historyEntries: TerminalEntry[];
  currentCwd: string;
  user: string;
  hostname: string;
  onExecute: (command: string) => void;
  onReset: () => void;
  onClear: () => void;
  getSuggestions: (input: string) => string[];
  completedLessons: string[];
  completedChallenges: string[];
  onCompleteLesson: (lessonId: string) => void;
  onCompleteChallenge: (challengeId: string, xp: number) => void;
  targetLessonId?: string;
}

export const LinuxLabPage: React.FC<LinuxLabPageProps> = ({
  fs,
  fsVersion,
  historyEntries,
  currentCwd,
  user,
  hostname,
  onExecute,
  onReset,
  onClear,
  getSuggestions,
  completedLessons,
  completedChallenges,
  onCompleteLesson,
  onCompleteChallenge,
  targetLessonId,
}) => {
  // Find initial lesson
  const [selectedModuleId, setSelectedModuleId] = useState<string>('fundamentals');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('what-is-linux');
  const [suggestedCommand, setSuggestedCommand] = useState<string>('');

  useEffect(() => {
    if (targetLessonId) {
      for (const m of CURRICULUM_MODULES) {
        const found = m.lessons.find((l) => l.id === targetLessonId);
        if (found) {
          setSelectedModuleId(m.id);
          setSelectedLessonId(found.id);
          break;
        }
      }
    }
  }, [targetLessonId]);

  const currentModule =
    CURRICULUM_MODULES.find((m) => m.id === selectedModuleId) || CURRICULUM_MODULES[0];
  const currentLesson =
    currentModule.lessons.find((l) => l.id === selectedLessonId) || currentModule.lessons[0];

  // Flat list of all lessons for Next/Prev
  const allLessons: Lesson[] = CURRICULUM_MODULES.flatMap((m) => m.lessons);
  const currentLessonIndex = allLessons.findIndex((l) => l.id === currentLesson.id);

  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  const navigateToLesson = (lesson: Lesson) => {
    setSelectedModuleId(lesson.moduleId);
    setSelectedLessonId(lesson.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRunExample = (command: string) => {
    setSuggestedCommand(command);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Module & Curriculum Navigation (3 cols) */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-[#0e1424] border border-[#1e2a42] rounded-xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1b253b]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  Curriculum Modules
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {completedLessons.length} done
              </span>
            </div>

            <div className="space-y-1.5 max-h-[75vh] overflow-y-auto pr-1">
              {CURRICULUM_MODULES.map((m) => {
                const isSelectedModule = m.id === currentModule.id;
                const moduleDoneCount = m.lessons.filter((l) =>
                  completedLessons.includes(l.id)
                ).length;

                return (
                  <div key={m.id} className="space-y-1">
                    <button
                      onClick={() => {
                        setSelectedModuleId(m.id);
                        setSelectedLessonId(m.lessons[0].id);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                        isSelectedModule
                          ? 'bg-cyan-950/70 border border-cyan-800/60 text-cyan-200'
                          : 'bg-[#080d16] hover:bg-[#12192d] border border-[#172033] text-slate-300'
                      }`}
                    >
                      <span className="truncate">
                        {m.number}. {m.shortTitle}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {moduleDoneCount}/{m.lessons.length}
                      </span>
                    </button>

                    {/* Lessons list for active module */}
                    {isSelectedModule && (
                      <div className="pl-3 py-1 space-y-1 border-l-2 border-cyan-900/60 ml-2">
                        {m.lessons.map((lesson) => {
                          const isCurrent = lesson.id === currentLesson.id;
                          const isDone = completedLessons.includes(lesson.id);

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => setSelectedLessonId(lesson.id)}
                              className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-all ${
                                isCurrent
                                  ? 'bg-[#152038] text-cyan-300 font-bold'
                                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#101728]'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {isDone ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                ) : (
                                  <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                )}
                                <span className="truncate">{lesson.title}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* CENTER COLUMN: Lesson Content (5 cols) */}
        <main className="lg:col-span-5 space-y-6">
          <article className="bg-[#0e1424] border border-[#1e2a42] rounded-xl p-6 shadow-xl space-y-6">
            {/* Lesson Header */}
            <div className="space-y-2 pb-4 border-b border-[#1b253b]">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40 font-mono">
                  Module {currentModule.number}: {currentModule.shortTitle}
                </span>
                <span className="text-xs text-slate-500">&bull;</span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentLesson.readTime} read
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {currentLesson.title}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {currentLesson.summary}
              </p>
            </div>

            {/* Markdown Body Content */}
            <div className="text-xs text-slate-300 leading-relaxed space-y-4 font-sans whitespace-pre-line">
              {currentLesson.content}
            </div>

            {/* Interactive Permissions Widget for Permissions Lesson */}
            {currentLesson.id === 'posix-permission-model' && (
              <PermissionsInteractive />
            )}

            {/* Syntax Box if available */}
            {currentLesson.syntax && (
              <div className="p-3.5 bg-[#090d16] border border-[#1b253b] rounded-lg space-y-1 font-mono">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Command Syntax
                </span>
                <code className="text-xs text-cyan-300 block font-bold">
                  {currentLesson.syntax}
                </code>
              </div>
            )}

            {/* Interactive Command Examples */}
            {currentLesson.examples.length > 0 && (
              <div className="space-y-2.5">
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider font-mono block">
                  Interactive Terminal Examples
                </span>
                <div className="space-y-2">
                  {currentLesson.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#080d16] border border-[#1b253b] rounded-lg flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 font-mono">
                        <code className="text-emerald-300 font-bold block">
                          {ex.command}
                        </code>
                        <span className="text-slate-400 text-[11px] font-sans block">
                          {ex.description}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRunExample(ex.command)}
                        className="px-2.5 py-1 bg-[#152038] hover:bg-cyan-900 border border-[#212f4d] text-cyan-300 rounded text-[11px] font-mono flex items-center gap-1 shrink-0 transition-colors"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Run</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Takeaways */}
            <div className="p-4 bg-[#0a0f1d] border border-[#1b253b] rounded-lg space-y-2">
              <span className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider block">
                Key Takeaways
              </span>
              <ul className="space-y-1 text-xs text-slate-300 font-sans">
                {currentLesson.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">&bull;</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Challenge Card */}
            {currentLesson.interactiveChallenge && (
              <ChallengeCard
                key={currentLesson.interactiveChallenge.id}
                challenge={currentLesson.interactiveChallenge}
                fs={fs}
                isCompleted={completedChallenges.includes(
                  currentLesson.interactiveChallenge.id
                )}
                onComplete={onCompleteChallenge}
                onInsertCommand={(cmd) => setSuggestedCommand(cmd)}
              />
            )}

            {/* Bottom Actions: Mark Complete & Next/Prev */}
            <div className="pt-4 border-t border-[#1b253b] flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => onCompleteLesson(currentLesson.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  completedLessons.includes(currentLesson.id)
                    ? 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-300'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {completedLessons.includes(currentLesson.id)
                    ? 'Lesson Completed ✓'
                    : 'Mark as Completed'}
                </span>
              </button>

              <div className="flex items-center gap-2">
                {prevLesson && (
                  <button
                    onClick={() => navigateToLesson(prevLesson)}
                    className="p-2 bg-[#121a2d] hover:bg-[#18233a] border border-[#1b253b] rounded-lg text-xs text-slate-300 flex items-center gap-1 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>
                )}
                {nextLesson && (
                  <button
                    onClick={() => {
                      onCompleteLesson(currentLesson.id);
                      navigateToLesson(nextLesson);
                    }}
                    className="px-3 py-2 bg-[#121a2d] hover:bg-cyan-950 border border-[#212f4d] text-cyan-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <span>Next: {nextLesson.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </article>
        </main>

        {/* RIGHT COLUMN: Terminal Workbench (4 cols) */}
        <aside className="lg:col-span-4 sticky top-20 h-[calc(100vh-6rem)]">
          <Terminal
            historyEntries={historyEntries}
            currentCwd={currentCwd}
            user={user}
            hostname={hostname}
            onExecute={onExecute}
            onReset={onReset}
            onClear={onClear}
            getSuggestions={getSuggestions}
            suggestedCommand={suggestedCommand}
          />
        </aside>
      </div>
    </div>
  );
};
