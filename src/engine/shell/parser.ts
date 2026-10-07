import { CommandStage, ParsedPipeline } from '../../types/shell';

export function expandEnvVars(
  token: string,
  env: Record<string, string>
): string {
  return token.replace(/\$([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, varName) => {
    return env[varName] !== undefined ? env[varName] : '';
  });
}

export function tokenizeString(input: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let isEscaped = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (isEscaped) {
      current += char;
      isEscaped = false;
      continue;
    }

    if (char === '\\' && !inSingleQuote) {
      isEscaped = true;
      continue;
    }

    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      continue;
    }

    if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      continue;
    }

    if ((char === ' ' || char === '\t') && !inSingleQuote && !inDoubleQuote) {
      if (current.length > 0) {
        tokens.push(current);
        current = '';
      }
      continue;
    }

    current += char;
  }

  if (current.length > 0) {
    tokens.push(current);
  }

  return tokens;
}

export function parseCommandLine(
  rawInput: string,
  env: Record<string, string> = {}
): ParsedPipeline {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { stages: [] };
  }

  // Handle pipe splitting respecting quotes
  const stagesRaw: string[] = [];
  let currentStage = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];

    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
    } else if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
    }

    if (char === '|' && !inSingleQuote && !inDoubleQuote) {
      stagesRaw.push(currentStage.trim());
      currentStage = '';
    } else {
      currentStage += char;
    }
  }

  if (currentStage.trim().length > 0) {
    stagesRaw.push(currentStage.trim());
  }

  const stages: CommandStage[] = [];
  let inputRedirectFile: string | undefined;
  let outputRedirectFile: string | undefined;
  let appendOutput = false;

  for (let sIdx = 0; sIdx < stagesRaw.length; sIdx++) {
    const stageStr = stagesRaw[sIdx];
    const isFirst = sIdx === 0;
    const isLast = sIdx === stagesRaw.length - 1;

    // Tokenize
    const rawTokens = tokenizeString(stageStr);
    const expandedTokens = rawTokens.map((t) => expandEnvVars(t, env));

    const finalTokens: string[] = [];
    for (let i = 0; i < expandedTokens.length; i++) {
      const tok = expandedTokens[i];

      if (isLast && (tok === '>>' || tok === '>')) {
        appendOutput = tok === '>>';
        if (i + 1 < expandedTokens.length) {
          outputRedirectFile = expandedTokens[i + 1];
          i++; // Skip the filename token
        }
        continue;
      }

      if (isFirst && tok === '<') {
        if (i + 1 < expandedTokens.length) {
          inputRedirectFile = expandedTokens[i + 1];
          i++;
        }
        continue;
      }

      // Check for inline redirection like >output.txt or >>output.txt
      if (isLast && tok.startsWith('>>')) {
        appendOutput = true;
        outputRedirectFile = tok.slice(2);
        continue;
      }
      if (isLast && tok.startsWith('>')) {
        appendOutput = false;
        outputRedirectFile = tok.slice(1);
        continue;
      }
      if (isFirst && tok.startsWith('<')) {
        inputRedirectFile = tok.slice(1);
        continue;
      }

      finalTokens.push(tok);
    }

    if (finalTokens.length > 0) {
      stages.push({
        command: finalTokens[0],
        args: finalTokens.slice(1),
        rawText: stageStr,
      });
    }
  }

  return {
    stages,
    inputRedirectFile,
    outputRedirectFile,
    appendOutput,
  };
}

export interface ParsedFlags {
  flags: Set<string>;
  options: Record<string, string>;
  positional: string[];
}

export function parseArgsAndFlags(
  args: string[],
  optionsWithValues: string[] = []
): ParsedFlags {
  const flags = new Set<string>();
  const options: Record<string, string> = {};
  const positional: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--') {
      positional.push(...args.slice(i + 1));
      break;
    }

    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      if (optionsWithValues.includes(key) && i + 1 < args.length) {
        options[key] = args[++i];
      } else {
        flags.add(key);
      }
    } else if (arg.startsWith('-') && arg.length > 1) {
      const chars = arg.slice(1);
      // Check if it's an option that takes a value e.g. -n 5
      if (optionsWithValues.includes(chars) && i + 1 < args.length) {
        options[chars] = args[++i];
      } else {
        for (const c of chars) {
          flags.add(c);
        }
      }
    } else {
      positional.push(arg);
    }
  }

  return { flags, options, positional };
}
