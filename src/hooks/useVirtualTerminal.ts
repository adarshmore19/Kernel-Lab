import { useState, useCallback, useRef } from 'react';
import { VirtualFS } from '../engine/filesystem/VirtualFS';
import { createInitialFS } from '../engine/filesystem/initialFS';
import { ShellContext, TerminalEntry } from '../types/shell';
import { executeCommand } from '../engine/shell/dispatcher';
import { commandsRegistry } from '../engine/shell/commands';

const INITIAL_CONTEXT: ShellContext = {
  cwd: '/home/user',
  user: 'user',
  hostname: 'kernellab',
  env: {
    USER: 'user',
    HOME: '/home/user',
    SHELL: '/usr/bin/fish',
    PATH: '/usr/bin:/bin',
    TERM: 'xterm-256color',
  },
  history: [],
  aliases: {
    ll: 'ls -la',
    la: 'ls -a',
  },
  functions: {},
};

export function useVirtualTerminal() {
  const [fs, setFs] = useState<VirtualFS>(() => createInitialFS());
  const [context, setContext] = useState<ShellContext>(INITIAL_CONTEXT);
  const [historyEntries, setHistoryEntries] = useState<TerminalEntry[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const [fsVersion, setFsVersion] = useState<number>(0);

  const formatPromptCwd = useCallback((cwd: string) => {
    if (cwd === '/home/user') return '~';
    if (cwd.startsWith('/home/user/')) return '~' + cwd.slice('/home/user'.length);
    return cwd;
  }, []);

  const runInput = useCallback(
    (input: string) => {
      const trimmed = input.trim();
      if (!trimmed) {
        // Empty enter adds an empty prompt entry
        const entry: TerminalEntry = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
          command: '',
          promptUser: context.user,
          promptHost: context.hostname,
          promptCwd: formatPromptCwd(context.cwd),
          stdout: '',
          stderr: '',
          exitCode: 0,
        };
        setHistoryEntries((prev) => [...prev, entry]);
        return;
      }

      // Check for alias replacement
      let cmdToRun = trimmed;
      const firstWord = trimmed.split(/\s+/)[0];
      if (context.aliases[firstWord]) {
        cmdToRun = trimmed.replace(firstWord, context.aliases[firstWord]);
      }

      const res = executeCommand(cmdToRun, fs, context);

      if (res.clearScreen) {
        setHistoryEntries([]);
        return;
      }

      const entry: TerminalEntry = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        command: trimmed,
        promptUser: context.user,
        promptHost: context.hostname,
        promptCwd: formatPromptCwd(context.cwd),
        stdout: res.stdout,
        stderr: res.stderr,
        exitCode: res.exitCode,
        learningHint: res.learningHint,
      };

      setHistoryEntries((prev) => [...prev, entry]);

      // Update shell context
      setContext((prev) => ({
        ...prev,
        cwd: res.newCwd || prev.cwd,
        env: res.envUpdates ? { ...prev.env, ...res.envUpdates } : prev.env,
        history: [...prev.history, trimmed],
      }));

      // Trigger re-render for filesystem observers
      setFsVersion((v) => v + 1);
      historyIndexRef.current = -1;
    },
    [fs, context, formatPromptCwd]
  );

  const resetEnvironment = useCallback(() => {
    const newFs = createInitialFS();
    setFs(newFs);
    setContext(INITIAL_CONTEXT);
    setHistoryEntries([
      {
        id: 'reset-entry',
        timestamp: Date.now(),
        command: '',
        promptUser: 'system',
        promptHost: 'kernellab',
        promptCwd: '~',
        stdout: 'Virtual filesystem reset to initial factory state.\n',
        stderr: '',
        exitCode: 0,
      },
    ]);
    setFsVersion((v) => v + 1);
  }, []);

  const getAutocompleteSuggestions = useCallback(
    (input: string): string[] => {
      const parts = input.split(' ');
      const last = parts[parts.length - 1];

      if (parts.length <= 1) {
        // Autocomplete command name
        const availableCommands = Object.keys(commandsRegistry);
        return availableCommands.filter((c) => c.startsWith(last));
      }

      // Autocomplete files/directories in current path
      try {
        const dirPath = last.includes('/')
          ? last.substring(0, last.lastIndexOf('/'))
          : context.cwd;
        const prefix = last.includes('/')
          ? last.substring(last.lastIndexOf('/') + 1)
          : last;

        const resolvedDir = fs.normalizePath(dirPath, context.cwd);
        const children = fs.listDirectory(resolvedDir);
        return children
          .filter((c) => c.name.startsWith(prefix))
          .map((c) => {
            const trailingSlash = c.type === 'directory' ? '/' : '';
            if (last.includes('/')) {
              return `${dirPath}/${c.name}${trailingSlash}`;
            }
            return `${c.name}${trailingSlash}`;
          });
      } catch {
        return [];
      }
    },
    [fs, context.cwd]
  );

  return {
    fs,
    fsVersion,
    context,
    historyEntries,
    runInput,
    resetEnvironment,
    getAutocompleteSuggestions,
    clearHistory: () => setHistoryEntries([]),
  };
}
