import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TermIcon, Trash2, RotateCcw, Copy, Check, Sparkles, HelpCircle } from 'lucide-react';
import { TerminalEntry } from '../../types/shell';

interface TerminalProps {
  historyEntries: TerminalEntry[];
  currentCwd: string;
  user: string;
  hostname: string;
  onExecute: (command: string) => void;
  onReset: () => void;
  onClear: () => void;
  getSuggestions: (input: string) => string[];
  suggestedCommand?: string;
}

export const Terminal: React.FC<TerminalProps> = ({
  historyEntries,
  currentCwd,
  user,
  hostname,
  onExecute,
  onReset,
  onClear,
  getSuggestions,
  suggestedCommand,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [copied, setCopied] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  // Format current cwd for prompt (~/projects)
  const formatPromptCwd = (cwd: string) => {
    if (cwd === '/home/user') return '~';
    if (cwd.startsWith('/home/user/')) return '~' + cwd.slice('/home/user'.length);
    return cwd;
  };

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [historyEntries]);

  // When suggestedCommand prop changes, pre-fill it into terminal input
  useEffect(() => {
    if (suggestedCommand) {
      setInputVal(suggestedCommand);
      inputRef.current?.focus();
    }
  }, [suggestedCommand]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ctrl + L: Clear terminal
    if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      onClear();
      return;
    }

    // Tab: Autocomplete
    if (e.key === 'Tab') {
      e.preventDefault();
      const list = getSuggestions(inputVal);
      if (list.length === 1) {
        // Complete single match
        const parts = inputVal.split(' ');
        parts[parts.length - 1] = list[0];
        setInputVal(parts.join(' '));
        setSuggestions([]);
      } else if (list.length > 1) {
        setSuggestions(list);
      }
      return;
    }

    // Up Arrow: History backward
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const pastCommands = historyEntries
        .map((h) => h.command)
        .filter((c) => c.trim().length > 0);

      if (pastCommands.length === 0) return;

      const nextIdx = historyIndex + 1;
      if (nextIdx < pastCommands.length) {
        setHistoryIndex(nextIdx);
        setInputVal(pastCommands[pastCommands.length - 1 - nextIdx]);
      }
      return;
    }

    // Down Arrow: History forward
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const pastCommands = historyEntries
        .map((h) => h.command)
        .filter((c) => c.trim().length > 0);

      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(pastCommands[pastCommands.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
      return;
    }

    // Enter: Execute command
    if (e.key === 'Enter') {
      e.preventDefault();
      onExecute(inputVal);
      setInputVal('');
      setHistoryIndex(-1);
      setSuggestions([]);
    }
  };

  const copyTerminalOutput = () => {
    const text = historyEntries
      .map((entry) => {
        const cmd = entry.command ? `user@kernellab ${entry.promptCwd} > ${entry.command}\n` : '';
        return `${cmd}${entry.stdout}${entry.stderr}`;
      })
      .join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#070a12] border border-[#1e2738] rounded-xl overflow-hidden shadow-2xl font-mono">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d121f] border-b border-[#1b2336] select-none text-xs">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/60" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/60" />
          </div>
          <div className="flex items-center space-x-1 text-slate-400 font-semibold pl-2">
            <TermIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>fish — {user}@{hostname}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowHints(!showHints)}
            title="Toggle learning feedback hints"
            className={`p-1.5 rounded transition-colors ${
              showHints ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-800/40' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={copyTerminalOutput}
            title="Copy terminal session"
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded transition-colors hover:bg-slate-800/60"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClear}
            title="Clear terminal (Ctrl+L)"
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded transition-colors hover:bg-slate-800/60"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            title="Reset Linux Environment"
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded transition-colors hover:bg-slate-800/60"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="p-3 bg-rose-950/40 border-b border-rose-900/60 flex items-center justify-between text-xs text-rose-200">
          <span>Are you sure you want to reset the virtual filesystem to initial state?</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onReset();
                setShowResetConfirm(false);
              }}
              className="px-2.5 py-1 bg-rose-700 hover:bg-rose-600 text-white rounded font-medium transition-colors"
            >
              Confirm Reset
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Terminal Viewport */}
      <div
        className="flex-1 p-4 overflow-y-auto space-y-3.5 text-sm"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Welcome Banner */}
        {historyEntries.length === 0 && (
          <div className="text-slate-500 text-xs space-y-1 pb-2 border-b border-slate-900">
            <p className="text-cyan-400/90 font-semibold">KernelLab Interactive Fish Terminal v1.0.0</p>
            <p>Type <code className="text-slate-300">help</code> or explore commands: <code className="text-emerald-400">ls -la</code>, <code className="text-emerald-400">pwd</code>, <code className="text-emerald-400">cat notes.txt</code>, <code className="text-emerald-400">uname -a</code></p>
            <p className="text-slate-600">Autocomplete with <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-400">Tab</kbd>, navigate history with <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-400">↑</kbd> <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-400">↓</kbd></p>
          </div>
        )}

        {/* History Stream */}
        {historyEntries.map((entry) => (
          <div key={entry.id} className="space-y-1.5">
            {/* Fish-style prompt */}
            {entry.command && (
              <div className="text-xs">
                <div className="text-slate-400 flex items-center gap-1.5">
                  <span className="text-slate-600">╭─</span>
                  <span className="text-emerald-400 font-medium">{entry.promptUser}@{entry.promptHost}</span>
                  <span className="text-cyan-400">{entry.promptCwd}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-slate-100 font-medium">
                  <span className="text-cyan-500">╰─❯</span>
                  <span>{entry.command}</span>
                </div>
              </div>
            )}

            {/* Standard Output */}
            {entry.stdout && (
              <pre className="text-slate-200 text-xs whitespace-pre-wrap leading-relaxed pl-2 font-mono">
                {entry.stdout}
              </pre>
            )}

            {/* Standard Error */}
            {entry.stderr && (
              <pre className="text-rose-400 text-xs whitespace-pre-wrap leading-relaxed pl-2 font-mono">
                {entry.stderr}
              </pre>
            )}

            {/* Learning Feedback Hint */}
            {showHints && entry.learningHint && (
              <div className="ml-2 mt-1.5 p-2.5 bg-cyan-950/30 border border-cyan-800/40 rounded text-xs text-cyan-300/90 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                  {entry.learningHint}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Active Fish Prompt Input Line */}
        <div className="text-xs pt-1">
          <div className="text-slate-400 flex items-center gap-1.5">
            <span className="text-slate-600">╭─</span>
            <span className="text-emerald-400 font-medium">{user}@{hostname}</span>
            <span className="text-cyan-400">{formatPromptCwd(currentCwd)}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-cyan-400 font-bold">╰─❯</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                setSuggestions([]);
              }}
              onKeyDown={handleKeyDown}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              className="flex-1 bg-transparent border-none outline-none text-slate-100 font-mono text-xs focus:ring-0 p-0"
              placeholder=""
              aria-label="Terminal command input"
            />
          </div>
        </div>

        {/* Autocomplete Suggestions Box */}
        {suggestions.length > 0 && (
          <div className="p-2 bg-[#0e1424] border border-[#1e2a42] rounded-lg text-xs space-y-1">
            <span className="text-slate-400 block text-[11px] font-sans">Suggestions:</span>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    const parts = inputVal.split(' ');
                    parts[parts.length - 1] = s;
                    setInputVal(parts.join(' '));
                    setSuggestions([]);
                    inputRef.current?.focus();
                  }}
                  className="px-2 py-0.5 bg-[#172033] hover:bg-cyan-900 border border-[#212f4d] rounded text-cyan-300 font-mono"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={scrollEndRef} />
      </div>
    </div>
  );
};
