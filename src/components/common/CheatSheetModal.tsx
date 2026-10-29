import React, { useState } from 'react';
import { X, Search, Terminal, ArrowRight } from 'lucide-react';

interface CheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCommand?: (cmd: string) => void;
}

interface CommandDoc {
  name: string;
  category: string;
  syntax: string;
  desc: string;
  example: string;
}

const COMMAND_DOCS: CommandDoc[] = [
  { name: 'pwd', category: 'Navigation', syntax: 'pwd', desc: 'Print current working directory path', example: 'pwd' },
  { name: 'ls', category: 'Navigation', syntax: 'ls [-la]', desc: 'List directory entries and permissions', example: 'ls -la' },
  { name: 'cd', category: 'Navigation', syntax: 'cd [dir]', desc: 'Change working directory', example: 'cd ~/projects/linux' },
  { name: 'tree', category: 'Navigation', syntax: 'tree [dir]', desc: 'Render recursive directory tree', example: 'tree ~/projects' },
  { name: 'clear', category: 'Navigation', syntax: 'clear', desc: 'Clear terminal scrollback (or Ctrl+L)', example: 'clear' },
  { name: 'touch', category: 'Files', syntax: 'touch <file>', desc: 'Create empty file or update timestamps', example: 'touch notes.txt' },
  { name: 'mkdir', category: 'Files', syntax: 'mkdir -p <dir>', desc: 'Create directory or nested directory path', example: 'mkdir -p ~/projects/linux/notes' },
  { name: 'cp', category: 'Files', syntax: 'cp [-r] <src> <dest>', desc: 'Copy files or directories recursively', example: 'cp notes.txt ~/Documents/' },
  { name: 'mv', category: 'Files', syntax: 'mv <src> <dest>', desc: 'Move or rename files and directories', example: 'mv file.txt backup.txt' },
  { name: 'rm', category: 'Files', syntax: 'rm [-rf] <target>', desc: 'Delete files or directories permanently', example: 'rm file.txt' },
  { name: 'cat', category: 'Files', syntax: 'cat <file>', desc: 'Output file contents to standard output', example: 'cat /etc/os-release' },
  { name: 'head', category: 'Files', syntax: 'head -n <N> <file>', desc: 'Output first N lines of file', example: 'head -n 5 /var/log/syslog' },
  { name: 'tail', category: 'Files', syntax: 'tail -n <N> <file>', desc: 'Output last N lines of file', example: 'tail -n 5 /var/log/syslog' },
  { name: 'grep', category: 'Text', syntax: 'grep [-ivn] <pattern>', desc: 'Filter matching lines in files or streams', example: 'cat notes.txt | grep Kernel' },
  { name: 'wc', category: 'Text', syntax: 'wc [-lwc] <file>', desc: 'Count lines, words, and byte counts', example: 'wc -l notes.txt' },
  { name: 'sort', category: 'Text', syntax: 'sort [-rn] <file>', desc: 'Sort lines of text alphabetically or numerically', example: 'sort notes.txt' },
  { name: 'chmod', category: 'Permissions', syntax: 'chmod <mode> <file>', desc: 'Modify POSIX permissions (e.g. 755 or +x)', example: 'chmod 755 script.sh' },
  { name: 'stat', category: 'Permissions', syntax: 'stat <file>', desc: 'Display low-level inode & permission details', example: 'stat notes.txt' },
  { name: 'whoami', category: 'Users', syntax: 'whoami', desc: 'Display current login username', example: 'whoami' },
  { name: 'id', category: 'Users', syntax: 'id', desc: 'Display UID, GID, and supplemental group IDs', example: 'id' },
  { name: 'ps', category: 'Processes', syntax: 'ps', desc: 'Report snapshot of currently active processes', example: 'ps' },
  { name: 'top', category: 'Processes', syntax: 'top', desc: 'Display dynamic CPU and RAM process status', example: 'top' },
  { name: 'set', category: 'Fish', syntax: 'set <key> <val>', desc: 'Assign Fish shell variables', example: 'set MY_VAR "KernelLab"' },
  { name: 'type', category: 'Fish', syntax: 'type <cmd>', desc: 'Determine command type (builtin, binary, function)', example: 'type ls' },
  { name: 'uname', category: 'System', syntax: 'uname -a', desc: 'Print operating system name and kernel version', example: 'uname -a' },
  { name: 'free', category: 'System', syntax: 'free -h', desc: 'Display physical RAM and swap space utilization', example: 'free -h' },
  { name: 'lscpu', category: 'System', syntax: 'lscpu', desc: 'Display CPU architecture and cache topology', example: 'lscpu' },
  { name: 'dmesg', category: 'Logs', syntax: 'dmesg', desc: 'Inspect kernel ring buffer boot log', example: 'dmesg' },
];

export const CheatSheetModal: React.FC<CheatSheetModalProps> = ({
  isOpen,
  onClose,
  onSelectCommand,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Navigation', 'Files', 'Text', 'Permissions', 'Processes', 'Fish', 'System', 'Logs'];

  const filtered = COMMAND_DOCS.filter((cmd) => {
    const matchesSearch =
      cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.syntax.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || cmd.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-3xl max-h-[85vh] bg-[#fdfbf6] border border-[#dfd7c6] rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#dfd7c6] flex items-center justify-between bg-[#f4f0e5]">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#2d5a88]" />
            <h3 className="font-mono font-bold text-sm text-[#2c2825] uppercase tracking-wider">
              KernelLab Command Reference & Cheat Sheet
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#78716c] hover:text-[#2c2825] hover:bg-[#eae4d5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="p-4 border-b border-[#dfd7c6] space-y-3 bg-[#fdfbf6]">
          <div className="relative">
            <Search className="w-4 h-4 text-[#a8a29e] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search commands, syntax, or concepts (e.g. grep, chmod, permissions, pipes)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#f4f0e5] border border-[#dfd7c6] rounded-lg text-xs text-[#2c2825] placeholder-[#a8a29e] outline-none focus:border-[#2d5a88] focus:bg-[#fdfbf6] font-mono"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#ebf2f8] text-[#1e4569] border border-[#c8d9e8] font-semibold'
                    : 'bg-[#f4f0e5] text-[#57534e] hover:text-[#2c2825] hover:bg-[#eae4d5] border border-[#dfd7c6]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Command List Grid */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#f7f4ea]/60">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-[#a8a29e] text-xs font-mono">
              No matching commands found.
            </div>
          ) : (
            filtered.map((cmd) => (
              <div
                key={cmd.name}
                className="p-3 bg-[#fdfbf6] border border-[#dfd7c6] rounded-lg hover:border-[#c8d9e8] hover:bg-[#f5f0e1] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-bold text-[#2d5a88] font-mono bg-[#ebf2f8] px-1.5 py-0.5 rounded border border-[#c8d9e8]">
                      {cmd.name}
                    </code>
                    <span className="px-1.5 py-0.2 text-[9px] bg-[#eee8db] text-[#57534e] rounded font-mono border border-[#dfd7c6]">
                      {cmd.category}
                    </span>
                    <span className="text-[#78716c] font-mono text-[11px]">
                      {cmd.syntax}
                    </span>
                  </div>
                  <p className="text-[#57534e] font-sans">{cmd.desc}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <code className="text-[11px] bg-[#eee8db] text-[#1e5327] px-2 py-1 rounded border border-[#dfd7c6] font-mono">
                    {cmd.example}
                  </code>
                  {onSelectCommand && (
                    <button
                      onClick={() => {
                        onSelectCommand(cmd.example);
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-[#2d5a88] hover:bg-[#23476d] text-white rounded text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                    >
                      Run <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
