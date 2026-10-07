import { CommandResult, ShellContext } from '../../types/shell';
import { VirtualFS } from '../filesystem/VirtualFS';
import { parseCommandLine } from './parser';
import { commandsRegistry } from './commands';

export interface DispatcherOutput extends CommandResult {
  learningHint?: string;
}

export function generateLearningHint(rawCommand: string): string | undefined {
  const trimmed = rawCommand.trim();

  // chmod hints
  if (trimmed.startsWith('chmod')) {
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 3 && /^[0-7]{3,4}$/.test(parts[1])) {
      const octal = parts[1].slice(-3);
      const digitToText = (d: string) => {
        const val = parseInt(d, 10);
        const r = (val & 4) ? 'r' : '-';
        const w = (val & 2) ? 'w' : '-';
        const x = (val & 1) ? 'x' : '-';
        return `${r}${w}${x}`;
      };
      return `Permission changed to ${octal}:\n  owner:  ${digitToText(octal[0])}\n  group:  ${digitToText(octal[1])}\n  others: ${digitToText(octal[2])}`;
    }
  }

  // ps / kill hint
  if (trimmed.startsWith('ps')) {
    return 'PID is the unique Process Identifier. In Linux, init/systemd is PID 1.';
  }

  // grep hint
  if (trimmed.includes('|') && trimmed.includes('grep')) {
    return 'Pipeline detected! Standard output of the first command is streamed as standard input to grep.';
  }

  return undefined;
}

export function executeCommand(
  rawInput: string,
  fs: VirtualFS,
  context: ShellContext
): DispatcherOutput {
  const parsed = parseCommandLine(rawInput, context.env);
  if (parsed.stages.length === 0) {
    return { stdout: '', stderr: '', exitCode: 0 };
  }

  let currentStdin = '';

  // Handle initial input redirection <
  if (parsed.inputRedirectFile) {
    const norm = fs.normalizePath(parsed.inputRedirectFile, context.cwd);
    if (!fs.exists(norm)) {
      return {
        stdout: '',
        stderr: `shell: ${parsed.inputRedirectFile}: No such file or directory\n`,
        exitCode: 1,
      };
    }
    try {
      currentStdin = fs.readFile(norm);
    } catch (e: any) {
      return { stdout: '', stderr: `${e.message}\n`, exitCode: 1 };
    }
  }

  let lastResult: CommandResult = { stdout: '', stderr: '', exitCode: 0 };
  let currentCwd = context.cwd;
  const envUpdates: Record<string, string> = {};

  // Execute pipeline stages sequentially
  for (let i = 0; i < parsed.stages.length; i++) {
    const stage = parsed.stages[i];
    const handler = commandsRegistry[stage.command];

    if (!handler) {
      return {
        stdout: '',
        stderr: `fish: Unknown command '${stage.command}'\n`,
        exitCode: 127,
      };
    }

    const result = handler({
      fs,
      cwd: currentCwd,
      args: stage.args,
      stdin: currentStdin,
      context: {
        ...context,
        cwd: currentCwd,
        env: { ...context.env, ...envUpdates },
      },
    });

    if (result.newCwd) {
      currentCwd = result.newCwd;
    }

    if (result.envUpdates) {
      Object.assign(envUpdates, result.envUpdates);
    }

    if (result.exitCode !== 0 && parsed.stages.length > 1) {
      return result;
    }

    lastResult = result;
    currentStdin = result.stdout;
  }

  // Handle final output redirection > or >>
  if (parsed.outputRedirectFile) {
    const targetPath = fs.normalizePath(parsed.outputRedirectFile, currentCwd);
    try {
      if (parsed.appendOutput) {
        fs.appendFile(targetPath, lastResult.stdout, currentCwd);
      } else {
        fs.writeFile(targetPath, lastResult.stdout, currentCwd, true);
      }
      // Redirected output does not show on terminal
      lastResult.stdout = '';
    } catch (e: any) {
      return {
        stdout: '',
        stderr: `shell: cannot write to '${parsed.outputRedirectFile}': ${e.message}\n`,
        exitCode: 1,
      };
    }
  }

  const hint = generateLearningHint(rawInput);

  return {
    ...lastResult,
    newCwd: currentCwd !== context.cwd ? currentCwd : undefined,
    envUpdates: Object.keys(envUpdates).length > 0 ? envUpdates : undefined,
    learningHint: hint,
  };
}
