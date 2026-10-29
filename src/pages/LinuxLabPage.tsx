import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  Play,
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
          <div className="bg-[#fdfbf6] border border-[#dfd7c6] rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#dfd7c6]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#2d5a88]" />
                <h3 className="text-xs font-bold text-[#2c2825] uppercase tracking-wider font-mono">
                  Curriculum Modules
                </h3>
              </div>
              <span className="text-[11px] text-[#78716c] font-mono">
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
                          ? 'bg-[#ebf2f8] border border-[#c8d9e8] text-[#1e4569]'
                          : 'bg-[#f4f0e5] hover:bg-[#eae4d5] border border-[#dfd7c6] text-[#2c2825]'
                      }`}
                    >
                      <span className="truncate">
                        {m.number}. {m.shortTitle}
                      </span>
                      <span className="text-[10px] text-[#78716c] font-mono">
                        {moduleDoneCount}/{m.lessons.length}
                      </span>
                    </button>

                    {/* Lessons list for active module */}
                    {isSelectedModule && (
                      <div className="pl-3 py-1 space-y-1 border-l-2 border-[#c8d9e8] ml-2">
                        {m.lessons.map((lesson) => {
                          const isCurrent = lesson.id === currentLesson.id;
                          const isDone = completedLessons.includes(lesson.id);

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => setSelectedLessonId(lesson.id)}
                              className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-all ${
                                isCurrent
                                  ? 'bg-[#dbe6f0] text-[#1e4569] font-semibold'
                                  : 'text-[#57534e] hover:text-[#2c2825] hover:bg-[#eae4d5]'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {isDone ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1e5327] shrink-0" />
                                ) : (
                                  <Circle className="w-3.5 h-3.5 text-[#a8a29e] shrink-0" />
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
          <article className="bg-[#fdfbf6] border border-[#dfd7c6] rounded-xl p-6 shadow-xs space-y-6">
            {/* Lesson Header */}
            <div className="space-y-2 pb-4 border-b border-[#dfd7c6]">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-[#ebf2f8] text-[#1e4569] border border-[#c8d9e8] font-mono">
                  Module {currentModule.number}: {currentModule.shortTitle}
                </span>
                <span className="text-xs text-[#a8a29e]">&bull;</span>
                <span className="text-xs text-[#78716c] font-mono">
                  {currentLesson.readTime} read
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2c2825] tracking-tight">
                {currentLesson.title}
              </h2>
              <p className="text-xs text-[#57534e] leading-relaxed font-sans">
                {currentLesson.summary}
              </p>
            </div>

            {/* Markdown Body Content */}
            <div className="text-xs text-[#44403c] leading-relaxed space-y-4 font-sans whitespace-pre-line">
              {currentLesson.content}
            </div>

            {/* Interactive Permissions Widget for Permissions Lesson */}
            {currentLesson.id === 'posix-permission-model' && (
              <PermissionsInteractive />
            )}

            {/* Syntax Box if available */}
            {currentLesson.syntax && (
              <div className="p-3.5 bg-[#f4f0e5] border border-[#dfd7c6] rounded-lg space-y-1 font-mono">
                <span className="text-[10px] uppercase font-bold text-[#78716c] block tracking-wider">
                  Command Syntax
                </span>
                <code className="text-xs text-[#2d5a88] block font-bold">
                  {currentLesson.syntax}
                </code>
              </div>
            )}

            {/* Interactive Command Examples */}
            {currentLesson.examples.length > 0 && (
              <div className="space-y-2.5">
                <span className="text-xs uppercase font-bold text-[#78716c] tracking-wider font-mono block">
                  Interactive Terminal Examples
                </span>
                <div className="space-y-2">
                  {currentLesson.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#f4f0e5] border border-[#dfd7c6] rounded-lg flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 font-mono">
                        <code className="text-[#1e5327] font-bold block">
                          {ex.command}
                        </code>
                        <span className="text-[#57534e] text-[11px] font-sans block">
                          {ex.description}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRunExample(ex.command)}
                        className="px-2.5 py-1 bg-[#fdfbf6] hover:bg-[#eae4d5] border border-[#dfd7c6] text-[#2c2825] rounded text-[11px] font-mono flex items-center gap-1 shrink-0 transition-colors shadow-2xs"
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
            <div className="p-4 bg-[#ebf2f8]/70 border border-[#c8d9e8] rounded-lg space-y-2">
              <span className="text-xs font-bold text-[#1e4569] font-mono uppercase tracking-wider block">
                Key Takeaways
              </span>
              <ul className="space-y-1 text-xs text-[#2c2825] font-sans">
                {currentLesson.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#2d5a88] font-bold">&bull;</span>
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
            <div className="pt-4 border-t border-[#dfd7c6] flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => onCompleteLesson(currentLesson.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  completedLessons.includes(currentLesson.id)
                    ? 'bg-[#edf5ed] border border-[#cbe0cc] text-[#1e5327] font-medium'
                    : 'bg-[#2d5a88] hover:bg-[#23476d] text-white shadow-xs font-medium'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {completedLessons.includes(currentLesson.id)
                    ? 'Lesson Completed'
                    : 'Mark as Completed'}
                </span>
              </button>

              <div className="flex items-center gap-2">
                {prevLesson && (
                  <button
                    onClick={() => navigateToLesson(prevLesson)}
                    className="p-2 bg-[#fdfbf6] hover:bg-[#f5f0e1] border border-[#dfd7c6] rounded-lg text-xs text-[#2c2825] flex items-center gap-1 transition-colors"
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
                    className="px-3 py-2 bg-[#f4f0e5] hover:bg-[#eae4d5] border border-[#dfd7c6] text-[#2c2825] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
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
