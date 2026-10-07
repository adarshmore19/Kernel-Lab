export interface CommandStage {
  command: string;
  args: string[];
  rawText: string;
}

export interface ParsedPipeline {
  stages: CommandStage[];
  inputRedirectFile?: string;
  outputRedirectFile?: string;
  appendOutput?: boolean;
}

export interface ShellContext {
  cwd: string;
  user: string;
  hostname: string;
  env: Record<string, string>;
  history: string[];
  aliases: Record<string, string>;
  functions: Record<string, string>;
}

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  newCwd?: string;
  envUpdates?: Record<string, string>;
  clearScreen?: boolean;
}

export interface TerminalEntry {
  id: string;
  timestamp: number;
  command: string;
  promptUser: string;
  promptHost: string;
  promptCwd: string;
  stdout: string;
  stderr: string;
  exitCode: number;
  learningHint?: string;
}

export interface AutocompleteSuggestion {
  text: string;
  type: 'command' | 'file' | 'directory' | 'flag';
  description?: string;
}
