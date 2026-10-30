import React, { useState } from 'react';
import {
  Terminal,
  Cpu,
  Layers,
  LayoutDashboard,
  Menu,
  X,
  Search,
  BookOpen,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'theory' | 'linux' | 'scheduler' | 'labs';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  xp?: number;
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
    { id: 'theory', label: 'OS Theory', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'linux', label: 'Linux Lab', icon: <Terminal className="w-4 h-4" /> },
    { id: 'scheduler', label: 'CPU Scheduler', icon: <Cpu className="w-4 h-4" /> },
    { id: 'labs', label: 'OS Concept Labs', icon: <Layers className="w-4 h-4" /> },
  ];

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#fdfbf6]/95 backdrop-blur border-b border-[#dfd7c6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Logo */}
        <div
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-[#2d5a88] flex items-center justify-center text-white shadow-xs">
            <Cpu className="w-5 h-5 text-white stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-[#2c2825] font-mono">
                Kernel<span className="text-[#2d5a88]">Lab</span>
              </span>
              <span className="px-1.5 py-0.2 text-[9px] uppercase font-bold tracking-wider rounded bg-[#eee8db] text-[#57534e] border border-[#dfd7c6]">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-[#78716c] hidden sm:block">
              Interactive OS & Linux Laboratory
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#eee8db] border border-[#dfd7c6] p-1 rounded-xl shrink-0">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#fdfbf6] text-[#2d5a88] shadow-xs border border-[#dfd7c6]'
                    : 'text-[#57534e] hover:text-[#2c2825] hover:bg-[#e4ddd0] border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & XP Counter */}
        <div className="flex items-center gap-3 shrink-0 pl-3 sm:pl-6">
          <button
            onClick={onOpenCheatSheet}
            title="Linux Command Reference (Cheat Sheet)"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#fdfbf6] hover:bg-[#f5f0e1] border border-[#dfd7c6] rounded-lg text-xs text-[#2c2825] transition-colors shadow-xs"
          >
            <Search className="w-3.5 h-3.5 text-[#2d5a88]" />
            <span className="font-mono">Cheat Sheet</span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#57534e] hover:text-[#2c2825] rounded-lg hover:bg-[#eee8db] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-[#fdfbf6] border-b border-[#dfd7c6] space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
                activeTab === item.id
                  ? 'bg-[#eee8db] text-[#2d5a88]'
                  : 'text-[#57534e] hover:bg-[#eee8db]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
