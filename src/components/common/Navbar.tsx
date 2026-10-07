import React, { useState } from 'react';
import {
  Terminal,
  Cpu,
  Layers,
  LayoutDashboard,
  Trophy,
  BookOpen,
  Menu,
  X,
  Search,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'linux' | 'scheduler' | 'labs';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  xp: number;
  onOpenCheatSheet: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  xp,
  onOpenCheatSheet,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: NavTab; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'linux', label: 'Linux Lab', icon: <Terminal className="w-4 h-4" /> },
    { id: 'scheduler', label: 'CPU Scheduler', icon: <Cpu className="w-4 h-4" /> },
    { id: 'labs', label: 'OS Concept Labs', icon: <Layers className="w-4 h-4" /> },
  ];

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#090d16]/95 backdrop-blur border-b border-[#1b253b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Cpu className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white font-mono">
                Kernel<span className="text-cyan-400">Lab</span>
              </span>
              <span className="px-1.5 py-0.2 text-[9px] uppercase font-bold tracking-wider rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Interactive OS & Linux Laboratory
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0e1424] border border-[#1e2a42] p-1 rounded-xl">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & XP Counter */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCheatSheet}
            title="Linux Command Reference (Cheat Sheet)"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#0e1424] hover:bg-slate-800 border border-[#1e2a42] rounded-lg text-xs text-slate-300 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono">Cheat Sheet</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/40 border border-amber-800/40 rounded-lg text-xs text-amber-300 font-mono font-bold shadow-sm">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{xp} XP</span>
          </div>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-[#0d121f] border-b border-[#1b253b] space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${
                activeTab === item.id
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/50'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => {
              onOpenCheatSheet();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Command Cheat Sheet</span>
          </button>
        </div>
      )}
    </header>
  );
};
