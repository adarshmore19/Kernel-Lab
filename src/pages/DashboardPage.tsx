import React from 'react';
import {
  Terminal,
  Cpu,
  Compass,
  FolderTree,
  ShieldCheck,
  Activity,
  Layers,
  ArrowRight,
  Trophy,
  CheckCircle2,
  Clock,
  Sparkles,
  Play,
  RotateCcw,
} from 'lucide-react';
import { NavTab } from '../components/common/Navbar';
import { CURRICULUM_MODULES } from '../data/curriculum/modules';

interface DashboardPageProps {
  onNavigate: (tab: NavTab, targetId?: string) => void;
  completedLessons: string[];
  completedChallenges: string[];
  xp: number;
  recentCommands: string[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  completedLessons,
  completedChallenges,
  xp,
  recentCommands,
}) => {
  const totalLessons = CURRICULUM_MODULES.reduce(
    (acc, m) => acc + m.lessons.length,
    0
  );
  const lessonsPercentage = Math.round(
    (completedLessons.length / totalLessons) * 100
  );

  const quickStartCards = [
    {
      title: 'Linux Fundamentals',
      desc: 'Unix architectures, kernel vs user space, rings, and FHS.',
      tab: 'linux' as NavTab,
      targetId: 'what-is-linux',
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      tag: 'Module 1',
    },
    {
      title: 'Filesystem Navigation',
      desc: 'Master pwd, ls -la, cd .., tree, and absolute vs relative paths.',
      tab: 'linux' as NavTab,
      targetId: 'nav-basics',
      icon: <Compass className="w-5 h-5 text-emerald-400" />,
      tag: 'Module 2',
    },
    {
      title: 'Files & Directories',
      desc: 'Create, duplicate, move, inspect and safely remove filesystem nodes.',
      tab: 'linux' as NavTab,
      targetId: 'creating-files-dirs',
      icon: <FolderTree className="w-5 h-5 text-amber-400" />,
      tag: 'Module 3',
    },
    {
      title: 'Users & Permissions',
      desc: 'Interactive POSIX permission triplets, octal calculation, and chmod.',
      tab: 'linux' as NavTab,
      targetId: 'posix-permission-model',
      icon: <ShieldCheck className="w-5 h-5 text-rose-400" />,
      tag: 'Module 4',
    },
    {
      title: 'CPU Scheduling Lab',
      desc: 'Simulate FCFS, SJF, SRTF, Round Robin & Priority with live Gantt charts.',
      tab: 'scheduler' as NavTab,
      icon: <Cpu className="w-5 h-5 text-indigo-400" />,
      tag: 'Scheduler',
    },
    {
      title: 'Process Management',
      desc: 'Inspect PID trees, top, signals, and simulated daemon management.',
      tab: 'linux' as NavTab,
      targetId: 'process-lifecycle',
      icon: <Activity className="w-5 h-5 text-purple-400" />,
      tag: 'Module 5',
    },
    {
      title: 'Process Lifecycle Lab',
      desc: 'Interactive 5-state machine: New, Ready, Running, Waiting, Terminated.',
      tab: 'labs' as NavTab,
      icon: <Activity className="w-5 h-5 text-emerald-400" />,
      tag: 'OS Lab',
    },
    {
      title: 'Virtual Memory Paging',
      desc: 'FIFO, LRU, Optimal page replacement simulator and fault analyzer.',
      tab: 'labs' as NavTab,
      icon: <Layers className="w-5 h-5 text-cyan-400" />,
      tag: 'OS Lab',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Hero / Continue Learning Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1629] via-[#0b1222] to-[#070b16] border border-[#1e2a42] p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-300 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Operating Systems & Linux Workbench</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Master Linux Systems & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300">
              CPU Scheduling Internals
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-2xl">
            KernelLab combines an authentic in-memory Fish terminal, sandboxed POSIX virtual filesystem, and a deterministic CPU scheduling engine for hands-on OS mastery.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('linux')}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
            >
              <Terminal className="w-4 h-4" />
              <span>Resume Linux Curriculum</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('scheduler')}
              className="px-5 py-2.5 bg-[#121a2d] hover:bg-[#18233a] border border-[#212f4d] text-slate-200 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Launch Scheduler Simulator</span>
            </button>
          </div>
        </div>

        {/* Ambient background grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      </div>

      {/* Overview Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Linux Curriculum Card */}
        <div className="bg-[#0e1424] border border-[#1e2a42] rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-sm text-slate-100">Linux Curriculum</h3>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400">
              {lessonsPercentage}%
            </span>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-[#080c16] h-2 rounded-full overflow-hidden border border-[#1b253b]">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
                style={{ width: `${lessonsPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>{completedLessons.length} / {totalLessons} Lessons Finished</span>
              <span>{completedChallenges.length} Challenges Solved</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('linux')}
            className="w-full py-2 bg-[#121a2d] hover:bg-[#18233a] border border-[#1b253b] rounded-lg text-xs font-semibold text-cyan-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Open Course Modules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* CPU Scheduling Status Card */}
        <div className="bg-[#0e1424] border border-[#1e2a42] rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm text-slate-100">CPU Scheduler Lab</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              6 Algorithms
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Preemptive & non-preemptive algorithms with live Gantt scrubber, animated ready queues, and CT/TAT/WT/RT metrics.
          </p>

          <button
            onClick={() => onNavigate('scheduler')}
            className="w-full py-2 bg-[#121a2d] hover:bg-[#18233a] border border-[#1b253b] rounded-lg text-xs font-semibold text-emerald-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Simulate Algorithms</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* User Lab Achievements Card */}
        <div className="bg-[#0e1424] border border-[#1e2a42] rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-sm text-slate-100">XP & Mastery</h3>
            </div>
            <span className="text-xs font-mono font-bold text-amber-300">
              Level {Math.floor(xp / 100) + 1}
            </span>
          </div>

          <div className="p-3 bg-[#080c16] border border-[#1b253b] rounded-lg space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Total Experience:</span>
              <span className="font-mono font-bold text-amber-300">{xp} XP</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Next Level:</span>
              <span className="font-mono text-slate-300">
                {(Math.floor(xp / 100) + 1) * 100 - xp} XP needed
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('labs')}
            className="w-full py-2 bg-[#121a2d] hover:bg-[#18233a] border border-[#1b253b] rounded-lg text-xs font-semibold text-amber-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Explore Concept Labs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Start Curriculum Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider font-mono">
            Core Learning Modules & Laboratories
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            8 Modular Units Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStartCards.map((card, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate(card.tab, card.targetId)}
              className="p-5 rounded-xl bg-[#0e1424] border border-[#1e2a42] hover:border-cyan-700/60 hover:bg-[#12192c] transition-all cursor-pointer group flex flex-col justify-between space-y-3 shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-[#080c16] border border-[#1b253b] group-hover:scale-105 transition-transform">
                    {card.icon}
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#141d31] text-slate-300 border border-[#1b253b]">
                    {card.tag}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {card.desc}
                </p>
              </div>

              <div className="pt-2 flex items-center text-xs font-semibold text-cyan-400 gap-1 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all font-mono">
                <span>Start Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Used Commands Banner */}
      {recentCommands.length > 0 && (
        <div className="p-4 bg-[#0a0f1d] border border-[#1d273d] rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Recently Simulated Commands:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentCommands.slice(-5).map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate('linux')}
                className="px-2.5 py-1 bg-[#121a2d] hover:bg-cyan-950 border border-[#212f4d] text-cyan-300 rounded text-xs transition-colors"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
