import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TermIcon, Trash2, RotateCcw, Copy, Check, Info } from 'lucide-react';
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
    <div className="flex flex-col h-full bg-[#fdfbf6] border border-[#dfd7c6] rounded-xl overflow-hidden shadow-xs font-mono">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#f4f0e5] border-b border-[#dfd7c6] select-none text-xs">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#d6cebf] border border-[#c4baa7]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#d6cebf] border border-[#c4baa7]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#d6cebf] border border-[#c4baa7]" />
          </div>
          <div className="flex items-center space-x-1.5 text-[#2c2825] font-semibold pl-2">
            <TermIcon className="w-3.5 h-3.5 text-[#2d5a88]" />
            <span>fish — {user}@{hostname}</span>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowHints(!showHints)}
            title="Toggle learning feedback hints"
            className={`p-1.5 rounded transition-colors ${
              showHints ? 'text-[#1e4569] bg-[#ebf2f8] border border-[#c8d9e8]' : 'text-[#78716c] hover:text-[#2c2825]'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={copyTerminalOutput}
            title="Copy terminal session"
            className="p-1.5 text-[#78716c] hover:text-[#2c2825] rounded transition-colors hover:bg-[#eae4d5]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#1e5327]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClear}
            title="Clear terminal (Ctrl+L)"
            className="p-1.5 text-[#78716c] hover:text-[#2c2825] rounded transition-colors hover:bg-[#eae4d5]"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            title="Reset Linux Environment"
            className="p-1.5 text-[#78716c] hover:text-rose-600 rounded transition-colors hover:bg-[#eae4d5]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="p-3 bg-[#fbf3e4] border-b border-[#ecd6b2] flex items-center justify-between text-xs text-[#7d4e08]">
          <span>Reset virtual filesystem to default state?</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onReset();
                setShowResetConfirm(false);
              }}
              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-2.5 py-1 bg-[#eee8db] hover:bg-[#e4ddd0] text-[#57534e] rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Terminal Viewport */}
      <div
        className="flex-1 p-4 overflow-y-auto space-y-3.5 text-sm bg-[#faf7ef]"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Welcome Banner */}
        {historyEntries.length === 0 && (
          <div className="text-[#78716c] text-xs space-y-1 pb-2 border-b border-[#eae4d5]">
            <p className="text-[#2d5a88] font-semibold font-sans">KernelLab Simulated Fish Terminal</p>
            <p>Type commands: <code className="text-[#1e5327] bg-[#f1ede0] px-1 py-0.5 rounded border border-[#dfd7c6]">ls -la</code>, <code className="text-[#1e5327] bg-[#f1ede0] px-1 py-0.5 rounded border border-[#dfd7c6]">pwd</code>, <code className="text-[#1e5327] bg-[#f1ede0] px-1 py-0.5 rounded border border-[#dfd7c6]">cat notes.txt</code>, <code className="text-[#1e5327] bg-[#f1ede0] px-1 py-0.5 rounded border border-[#dfd7c6]">uname -a</code></p>
            <p className="text-[#a8a29e]">Autocomplete: <kbd className="px-1 py-0.2 bg-[#eee8db] border border-[#dfd7c6] rounded text-[#57534e]">Tab</kbd>, History: <kbd className="px-1 py-0.2 bg-[#eee8db] border border-[#dfd7c6] rounded text-[#57534e]">Up</kbd> <kbd className="px-1 py-0.2 bg-[#eee8db] border border-[#dfd7c6] rounded text-[#57534e]">Down</kbd></p>
          </div>
        )}

        {/* History Stream */}
        {historyEntries.map((entry) => (
          <div key={entry.id} className="space-y-1.5">
            {/* Fish-style prompt */}
            {entry.command && (
              <div className="text-xs">
                <div className="text-[#78716c] flex items-center gap-1.5">
                  <span className="text-[#a8a29e]">╭─</span>
                  <span className="text-[#1e5327] font-medium">{entry.promptUser}@{entry.promptHost}</span>
                  <span className="text-[#2d5a88] font-medium">{entry.promptCwd}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[#2c2825] font-medium">
                  <span className="text-[#a8a29e]">╰─❯</span>
                  <span>{entry.command}</span>
                </div>
              </div>
            )}

            {/* Standard Output */}
            {entry.stdout && (
              <pre className="text-[#2c2825] text-xs whitespace-pre-wrap leading-relaxed pl-2 font-mono">
                {entry.stdout}
              </pre>
            )}

            {/* Standard Error */}
            {entry.stderr && (
              <pre className="text-[#9f1239] bg-[#fbf0f0] border border-[#f5c6c6] p-2 rounded text-xs whitespace-pre-wrap leading-relaxed font-mono">
                {entry.stderr}
              </pre>
            )}

            {/* Learning Feedback Hint */}
            {showHints && entry.learningHint && (
              <div className="ml-2 mt-1.5 p-2.5 bg-[#ebf2f8] border border-[#c8d9e8] rounded text-xs text-[#1e4569] flex items-start gap-2">
                <Info className="w-4 h-4 text-[#2d5a88] shrink-0 mt-0.5" />
                <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                  {entry.learningHint}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Active Fish Prompt Input Line */}
        <div className="text-xs pt-1">
          <div className="text-[#78716c] flex items-center gap-1.5">
            <span className="text-[#a8a29e]">╭─</span>
            <span className="text-[#1e5327] font-medium">{user}@{hostname}</span>
            <span className="text-[#2d5a88] font-medium">{formatPromptCwd(currentCwd)}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[#a8a29e] font-bold">╰─❯</span>
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
              className="flex-1 bg-transparent border-none outline-none text-[#2c2825] font-mono text-xs focus:ring-0 p-0"
              placeholder=""
              aria-label="Terminal command input"
            />
          </div>
        </div>

        {/* Autocomplete Suggestions Box */}
        {suggestions.length > 0 && (
          <div className="p-2 bg-[#f4f0e5] border border-[#dfd7c6] rounded-lg text-xs space-y-1">
            <span className="text-[#78716c] block text-[11px] font-sans">Suggestions:</span>
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
                  className="px-2 py-0.5 bg-[#fdfbf6] hover:bg-[#ebf2f8] border border-[#dfd7c6] rounded text-[#2d5a88] font-mono"
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
