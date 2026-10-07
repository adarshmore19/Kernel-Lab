import React, { useState } from 'react';
import { Navbar, NavTab } from './components/common/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { LinuxLabPage } from './pages/LinuxLabPage';
import { SchedulerLabPage } from './pages/SchedulerLabPage';
import { LabsPage } from './pages/LabsPage';
import { CheatSheetModal } from './components/common/CheatSheetModal';
import { useVirtualTerminal } from './hooks/useVirtualTerminal';
import { useUserProgress } from './hooks/useUserProgress';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [targetLessonId, setTargetLessonId] = useState<string | undefined>();
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState<boolean>(false);

  // User progress hook
  const {
    progress,
    markLessonComplete,
    markChallengeComplete,
    setLastActiveLesson,
  } = useUserProgress();

  // Virtual Terminal & Filesystem hook
  const {
    fs,
    fsVersion,
    context,
    historyEntries,
    runInput,
    resetEnvironment,
    clearHistory,
    getAutocompleteSuggestions,
  } = useVirtualTerminal();

  const handleNavigate = (tab: NavTab, lessonId?: string) => {
    setActiveTab(tab);
    if (lessonId) {
      setTargetLessonId(lessonId);
      setLastActiveLesson(lessonId);
    }
  };

  const handleSelectCheatCommand = (cmd: string) => {
    setActiveTab('linux');
    runInput(cmd);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-[#e2e8f0] flex flex-col selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Top Main Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setTargetLessonId(undefined);
        }}
        xp={progress.xp}
        onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'dashboard' && (
          <DashboardPage
            onNavigate={handleNavigate}
            completedLessons={progress.completedLessons}
            completedChallenges={progress.completedChallenges}
            xp={progress.xp}
            recentCommands={context.history}
          />
        )}

        {activeTab === 'linux' && (
          <LinuxLabPage
            fs={fs}
            fsVersion={fsVersion}
            historyEntries={historyEntries}
            currentCwd={context.cwd}
            user={context.user}
            hostname={context.hostname}
            onExecute={runInput}
            onReset={resetEnvironment}
            onClear={clearHistory}
            getSuggestions={getAutocompleteSuggestions}
            completedLessons={progress.completedLessons}
            completedChallenges={progress.completedChallenges}
            onCompleteLesson={markLessonComplete}
            onCompleteChallenge={markChallengeComplete}
            targetLessonId={targetLessonId || progress.lastActiveLessonId}
          />
        )}

        {activeTab === 'scheduler' && <SchedulerLabPage />}

        {activeTab === 'labs' && <LabsPage />}
      </main>

      {/* Command Cheat Sheet Search Modal */}
      <CheatSheetModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
        onSelectCommand={handleSelectCheatCommand}
      />
    </div>
  );
}

export default App;
