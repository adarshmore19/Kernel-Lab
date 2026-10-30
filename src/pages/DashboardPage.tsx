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
  Clock,
  Info,
  BookOpen,
  Sparkles,
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
      icon: <Cpu className="w-5 h-5 text-[#2d5a88]" />,
      tag: 'Module 1',
    },
    {
      title: 'Filesystem Navigation',
      desc: 'Master pwd, ls -la, cd .., tree, and absolute vs relative paths.',
      tab: 'linux' as NavTab,
      targetId: 'nav-basics',
      icon: <Compass className="w-5 h-5 text-[#1e5327]" />,
      tag: 'Module 2',
    },
    {
      title: 'Files & Directories',
      desc: 'Create, duplicate, move, inspect and safely remove filesystem nodes.',
      tab: 'linux' as NavTab,
      targetId: 'creating-files-dirs',
      icon: <FolderTree className="w-5 h-5 text-[#b45309]" />,
      tag: 'Module 3',
    },
    {
      title: 'Users & Permissions',
      desc: 'Interactive POSIX permission triplets, octal calculation, and chmod.',
      tab: 'linux' as NavTab,
      targetId: 'posix-permission-model',
      icon: <ShieldCheck className="w-5 h-5 text-[#9f1239]" />,
      tag: 'Module 4',
    },
    {
      title: 'CPU Scheduling Lab',
      desc: 'Simulate FCFS, SJF, SRTF, Round Robin & Priority with live Gantt charts.',
      tab: 'scheduler' as NavTab,
      icon: <Cpu className="w-5 h-5 text-[#4338ca]" />,
      tag: 'Scheduler',
    },
    {
      title: 'Process Management',
      desc: 'Inspect PID trees, top, signals, and simulated daemon management.',
      tab: 'linux' as NavTab,
      targetId: 'process-lifecycle',
      icon: <Activity className="w-5 h-5 text-[#6b21a8]" />,
      tag: 'Module 5',
    },
    {
      title: 'Process Lifecycle Lab',
      desc: 'Interactive 5-state machine: New, Ready, Running, Waiting, Terminated.',
      tab: 'labs' as NavTab,
      icon: <Activity className="w-5 h-5 text-[#1e5327]" />,
      tag: 'OS Lab',
    },
    {
      title: 'Virtual Memory Paging',
      desc: 'FIFO, LRU, Optimal page replacement simulator and fault analyzer.',
      tab: 'labs' as NavTab,
      icon: <Layers className="w-5 h-5 text-[#2d5a88]" />,
      tag: 'OS Lab',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Hero / Continue Learning Section */}
      <div className="relative overflow-hidden rounded-2xl bg-[#fdfbf6] border border-[#dfd7c6] p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebf2f8] border border-[#c8d9e8] text-[#1e4569] text-xs font-mono font-medium">
            <Info className="w-3.5 h-3.5 text-[#2d5a88]" />
            <span>Interactive Operating Systems & Linux Workbench</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#2c2825] tracking-tight leading-tight">
            Master Linux Systems & <br />
            <span className="text-[#2d5a88]">
              CPU Scheduling Internals
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#57534e] leading-relaxed font-sans max-w-2xl">
            KernelLab combines an authentic in-memory Fish terminal, sandboxed POSIX virtual filesystem, and a deterministic CPU scheduling engine for hands-on OS mastery.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('theory')}
              className="px-5 py-2.5 bg-[#2d5a88] hover:bg-[#23476d] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>OS Theory & Animations</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('linux')}
              className="px-5 py-2.5 bg-[#fdfbf6] hover:bg-[#f5f0e1] border border-[#dfd7c6] text-[#2c2825] rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors active:scale-95"
            >
              <Terminal className="w-4 h-4 text-[#2d5a88]" />
              <span>Linux Shell Lab</span>
            </button>

            <button
              onClick={() => onNavigate('scheduler')}
              className="px-5 py-2.5 bg-[#fdfbf6] hover:bg-[#f5f0e1] border border-[#dfd7c6] text-[#2c2825] rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <Cpu className="w-4 h-4 text-[#1e5327]" />
              <span>Scheduler Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Linux Curriculum Card */}
        <div className="bg-[#fdfbf6] border border-[#dfd7c6] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#2d5a88]" />
              <h3 className="font-bold text-sm text-[#2c2825]">Linux Curriculum</h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#2d5a88]">
              {lessonsPercentage}%
            </span>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-[#eee8db] h-2 rounded-full overflow-hidden border border-[#dfd7c6]">
              <div
                className="bg-[#2d5a88] h-full transition-all duration-300"
                style={{ width: `${lessonsPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-[#78716c] font-mono">
              <span>{completedLessons.length} / {totalLessons} Lessons Finished</span>
              <span>{completedChallenges.length} Challenges Solved</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('linux')}
            className="w-full py-2 bg-[#f4f0e5] hover:bg-[#eae4d5] border border-[#dfd7c6] rounded-lg text-xs font-semibold text-[#2d5a88] flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Open Course Modules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* CPU Scheduling Status Card */}
        <div className="bg-[#fdfbf6] border border-[#dfd7c6] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#1e5327]" />
              <h3 className="font-bold text-sm text-[#2c2825]">CPU Scheduler Lab</h3>
            </div>
            <span className="text-xs font-mono text-[#1e5327] bg-[#edf5ed] px-2 py-0.5 rounded border border-[#cbe0cc] font-semibold">
              6 Algorithms
            </span>
          </div>

          <p className="text-xs text-[#57534e] leading-relaxed font-sans">
            Preemptive & non-preemptive algorithms with live Gantt scrubber, animated ready queues, and CT/TAT/WT/RT metrics.
          </p>

          <button
            onClick={() => onNavigate('scheduler')}
            className="w-full py-2 bg-[#f4f0e5] hover:bg-[#eae4d5] border border-[#dfd7c6] rounded-lg text-xs font-semibold text-[#1e5327] flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Simulate Algorithms</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* User Lab Achievements Card */}
        <div className="bg-[#fdfbf6] border border-[#dfd7c6] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#b45309]" />
              <h3 className="font-bold text-sm text-[#2c2825]">XP & Mastery</h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#7d4e08] bg-[#fbf3e4] px-2 py-0.5 rounded border border-[#ecd6b2]">
              Level {Math.floor(xp / 100) + 1}
            </span>
          </div>

          <div className="p-3 bg-[#f4f0e5] border border-[#dfd7c6] rounded-lg space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#78716c]">Total Experience:</span>
              <span className="font-mono font-bold text-[#7d4e08]">{xp} XP</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#78716c]">Next Level:</span>
              <span className="font-mono text-[#2c2825] font-medium">
                {(Math.floor(xp / 100) + 1) * 100 - xp} XP needed
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('labs')}
            className="w-full py-2 bg-[#f4f0e5] hover:bg-[#eae4d5] border border-[#dfd7c6] rounded-lg text-xs font-semibold text-[#7d4e08] flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Explore Concept Labs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Featured OS Theory Curriculum & Industrial Animations Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#2d5a88]" />
              <h2 className="text-base font-bold text-[#2c2825] uppercase tracking-wider font-mono">
                OS THEORY & INDUSTRIAL APPLICATIONS
              </h2>
              <span className="text-xs font-mono font-semibold text-[#1e5327]">
                • Units I - V
              </span>
            </div>
            <p className="text-xs text-[#78716c] mt-0.5">
              Interactive animations, dual-mode traps, Gantt charts, deadlock RAGs, page replacement, and real-world tech case studies.
            </p>
          </div>
          <button
            onClick={() => onNavigate('theory')}
            className="text-xs font-mono font-bold text-[#2d5a88] hover:underline flex items-center gap-1"
          >
            <span>View All 5 Units</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            {
              unit: 'UNIT-I',
              title: 'OS Foundations & RTOS',
              desc: 'What is OS, Batch, Time-sharing, SMP, Dual-mode syscalls, RTOS deadlines & Distributed systems.',
              caseStudy: 'NASA & Tesla (VxWorks / FreeRTOS)',
              topicId: 'u1-what-is-os',
              color: 'text-[#2d5a88]',
              border: 'border-[#dfd7c6]',
            },
            {
              unit: 'UNIT-II',
              title: 'Processes, Threads & IPC',
              desc: '5-State process machine, PCB, 1:1 vs M:1 thread models, zero-copy shared memory vs message passing.',
              caseStudy: 'Citadel HFT & Netflix Threads',
              topicId: 'u2-process-concept',
              color: 'text-[#1e5327]',
              border: 'border-[#dfd7c6]',
            },
            {
              unit: 'UNIT-III',
              title: 'CPU Scheduling & Deadlocks',
              desc: 'FCFS, SJF, SRTF, Round Robin, Priority Aging, 4 Coffman conditions & Banker algorithm.',
              caseStudy: 'PostgreSQL & Linux CFS',
              topicId: 'u3-scheduling-criteria',
              color: 'text-[#b45309]',
              border: 'border-[#dfd7c6]',
            },
            {
              unit: 'UNIT-IV',
              title: 'Memory Mgmt & Virtual Memory',
              desc: 'Dynamic partitions (First/Best/Worst fit), Compaction, Paging & TLB, Demand paging, FIFO/LRU/OPT.',
              caseStudy: 'Intel x86 MMU & Redis Jemalloc',
              topicId: 'u4-memory-requirements',
              color: 'text-[#4338ca]',
              border: 'border-[#dfd7c6]',
            },
            {
              unit: 'UNIT-V',
              title: 'Storage & File Systems',
              desc: 'Sequential vs Direct access, Directory trees, Hard/Soft links, Contiguous, Linked & Inode indexing.',
              caseStudy: 'Linux Ext4 & AWS EBS NVMe',
              topicId: 'u5-file-concepts-access',
              color: 'text-[#6b21a8]',
              border: 'border-[#dfd7c6]',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate('theory', item.topicId)}
              className="p-4 rounded-xl bg-white border border-[#dfd7c6] hover:border-[#2d5a88] hover:bg-[#f5f0e1]/40 transition-all cursor-pointer group flex flex-col justify-between space-y-2 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#78716c]">
                    {item.unit}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[#2d5a88] opacity-70 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className={`text-xs font-bold font-mono mt-1 ${item.color}`}>
                  {item.title}
                </h3>
                <p className="text-[11px] text-[#78716c] leading-snug mt-1">
                  {item.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-[#dfd7c6]/60">
                <span className="text-[10px] font-mono text-[#57534e] block truncate font-semibold">
                  🏢 {item.caseStudy}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Start Curriculum Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#2c2825] uppercase tracking-wider font-mono">
            Core Learning Modules & Laboratories
          </h2>
          <span className="text-xs text-[#78716c] font-mono">
            8 Modular Units Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStartCards.map((card, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate(card.tab, card.targetId)}
              className="p-5 rounded-xl bg-[#fdfbf6] border border-[#dfd7c6] hover:border-[#b8ad99] hover:bg-[#f5f0e1] transition-all cursor-pointer group flex flex-col justify-between space-y-3 shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-[#f4f0e5] border border-[#dfd7c6] group-hover:scale-105 transition-transform">
                    {card.icon}
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#eee8db] text-[#57534e] border border-[#dfd7c6]">
                    {card.tag}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#2c2825] group-hover:text-[#2d5a88] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-[#57534e] leading-relaxed font-sans">
                  {card.desc}
                </p>
              </div>

              <div className="pt-2 flex items-center text-xs font-semibold text-[#2d5a88] gap-1 opacity-90 group-hover:opacity-100 group-hover:translate-x-1 transition-all font-mono">
                <span>Start Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Used Commands Banner */}
      {recentCommands.length > 0 && (
        <div className="p-4 bg-[#fdfbf6] border border-[#dfd7c6] rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-xs">
          <div className="flex items-center gap-2 text-[#78716c]">
            <Clock className="w-4 h-4 text-[#2d5a88]" />
            <span>Recently Simulated Commands:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentCommands.slice(-5).map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate('linux')}
                className="px-2.5 py-1 bg-[#f4f0e5] hover:bg-[#eae4d5] border border-[#dfd7c6] text-[#2c2825] rounded text-xs transition-colors"
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
