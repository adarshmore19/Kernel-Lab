import { CommandResult, ShellContext } from '../../../types/shell';
import { VirtualFS, permissionsToModeString, permissionsToOctal } from '../../filesystem/VirtualFS';
import { parseArgsAndFlags } from '../parser';

export interface CommandExecutionEnv {
  fs: VirtualFS;
  cwd: string;
  args: string[];
  stdin: string;
  context: ShellContext;
}

export type CommandHandler = (env: CommandExecutionEnv) => CommandResult;

export const commandsRegistry: Record<string, CommandHandler> = {
  pwd: ({ cwd }) => {
    return { stdout: cwd + '\n', stderr: '', exitCode: 0 };
  },

  cd: ({ fs, cwd, args }) => {
    const target = args[0] || '~';
    const resolved = fs.normalizePath(target, cwd);

    if (!fs.exists(resolved)) {
      return {
        stdout: '',
        stderr: `cd: The directory '${target}' does not exist\n`,
        exitCode: 1,
      };
    }

    if (!fs.isDirectory(resolved)) {
      return {
        stdout: '',
        stderr: `cd: '${target}' is not a directory\n`,
        exitCode: 1,
      };
    }

    return { stdout: '', stderr: '', exitCode: 0, newCwd: resolved };
  },

  ls: ({ fs, cwd, args }) => {
    const { flags, positional } = parseArgsAndFlags(args);
    const showAll = flags.has('a');
    const showLong = flags.has('l');
    const showHuman = flags.has('h');

    const targetPath = positional[0] || cwd;
    const resolved = fs.normalizePath(targetPath, cwd);

    try {
      const node = fs.getNode(resolved);
      if (!node) {
        return {
          stdout: '',
          stderr: `ls: cannot access '${targetPath}': No such file or directory\n`,
          exitCode: 2,
        };
      }

      if (node.type === 'file') {
        if (showLong) {
          const mode = permissionsToModeString(node.permissions, 'file');
          const date = new Date(node.modifiedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          });
          return {
            stdout: `${mode}  1  ${node.permissions.ownerName}  ${node.permissions.groupName}  ${node.size.toString().padStart(6)}  ${date}  ${node.name}\n`,
            stderr: '',
            exitCode: 0,
          };
        }
        return { stdout: `${node.name}\n`, stderr: '', exitCode: 0 };
      }

      // Directory listing
      let children = fs.listDirectory(resolved);
      if (!showAll) {
        children = children.filter((c) => !c.name.startsWith('.'));
      }

      if (showLong) {
        let out = `total ${children.length * 4}\n`;
        for (const c of children) {
          const mode = permissionsToModeString(c.permissions, c.type);
          const date = new Date(c.modifiedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          });
          const sizeStr = showHuman && c.size > 1024
            ? `${(c.size / 1024).toFixed(1)}K`
            : c.size.toString().padStart(5);
          out += `${mode}  1  ${c.permissions.ownerName}  ${c.permissions.groupName}  ${sizeStr}  ${date}  ${c.name}${c.type === 'directory' ? '/' : ''}\n`;
        }
        return { stdout: out, stderr: '', exitCode: 0 };
      }

      // Standard columnar / space-separated output
      if (children.length === 0) {
        return { stdout: '', stderr: '', exitCode: 0 };
      }
      const names = children.map((c) => (c.type === 'directory' ? `${c.name}/` : c.name));
      return { stdout: names.join('  ') + '\n', stderr: '', exitCode: 0 };
    } catch (err: any) {
      return { stdout: '', stderr: `ls: ${err.message}\n`, exitCode: 2 };
    }
  },

  mkdir: ({ fs, cwd, args }) => {
    const { flags, positional } = parseArgsAndFlags(args);
    const recursive = flags.has('p');

    if (positional.length === 0) {
      return { stdout: '', stderr: 'mkdir: missing operand\n', exitCode: 1 };
    }

    try {
      for (const target of positional) {
        fs.createDirectory(target, recursive, cwd);
      }
      return { stdout: '', stderr: '', exitCode: 0 };
    } catch (err: any) {
      return { stdout: '', stderr: `${err.message}\n`, exitCode: 1 };
    }
  },

  touch: ({ fs, cwd, args }) => {
    if (args.length === 0) {
      return { stdout: '', stderr: 'touch: missing file operand\n', exitCode: 1 };
    }

    try {
      for (const target of args) {
        fs.touch(target, cwd);
      }
      return { stdout: '', stderr: '', exitCode: 0 };
    } catch (err: any) {
      return { stdout: '', stderr: `touch: ${err.message}\n`, exitCode: 1 };
    }
  },

  cat: ({ fs, cwd, args, stdin }) => {
    if (args.length === 0) {
      if (stdin) {
        return { stdout: stdin, stderr: '', exitCode: 0 };
      }
      return { stdout: '', stderr: '', exitCode: 0 };
    }

    let out = '';
    try {
      for (const target of args) {
        const content = fs.readFile(target, cwd);
        out += content;
        if (!content.endsWith('\n') && content.length > 0) {
          out += '\n';
        }
      }
      return { stdout: out, stderr: '', exitCode: 0 };
    } catch (err: any) {
      return { stdout: out, stderr: `${err.message}\n`, exitCode: 1 };
    }
  },

  echo: ({ args }) => {
    const { flags, positional } = parseArgsAndFlags(args);
    const noTrailingNewline = flags.has('n');
    const text = positional.join(' ');
    return {
      stdout: text + (noTrailingNewline ? '' : '\n'),
      stderr: '',
      exitCode: 0,
    };
  },

  cp: ({ fs, cwd, args }) => {
    const { flags, positional } = parseArgsAndFlags(args);
    const recursive = flags.has('r') || flags.has('R');

    if (positional.length < 2) {
      return { stdout: '', stderr: 'cp: missing destination file operand\n', exitCode: 1 };
    }

    const src = positional[0];
    const dest = positional[1];

    try {
      fs.copy(src, dest, recursive, cwd);
      return { stdout: '', stderr: '', exitCode: 0 };
    } catch (err: any) {
      return { stdout: '', stderr: `${err.message}\n`, exitCode: 1 };
    }
  },

  mv: ({ fs, cwd, args }) => {
    const { positional } = parseArgsAndFlags(args);
    if (positional.length < 2) {
      return { stdout: '', stderr: 'mv: missing destination file operand\n', exitCode: 1 };
    }

    try {
      fs.move(positional[0], positional[1], cwd);
      return { stdout: '', stderr: '', exitCode: 0 };
    } catch (err: any) {
      return { stdout: '', stderr: `${err.message}\n`, exitCode: 1 };
    }
  },

  rm: ({ fs, cwd, args }) => {
    const { flags, positional } = parseArgsAndFlags(args);
    const recursive = flags.has('r') || flags.has('R');
    const force = flags.has('f');

    if (positional.length === 0) {
      if (force) return { stdout: '', stderr: '', exitCode: 0 };
      return { stdout: '', stderr: 'rm: missing operand\n', exitCode: 1 };
    }

    try {
      for (const target of positional) {
        try {
          fs.remove(target, recursive, cwd);
        } catch (e: any) {
          if (!force) throw e;
        }
      }
      return { stdout: '', stderr: '', exitCode: 0 };
    } catch (err: any) {
      return { stdout: '', stderr: `${err.message}\n`, exitCode: 1 };
    }
  },

  rmdir: ({ fs, cwd, args }) => {
    if (args.length === 0) {
      return { stdout: '', stderr: 'rmdir: missing operand\n', exitCode: 1 };
    }

    try {
      for (const target of args) {
        fs.removeDirectory(target, cwd);
      }
      return { stdout: '', stderr: '', exitCode: 0 };
    } catch (err: any) {
      return { stdout: '', stderr: `${err.message}\n`, exitCode: 1 };
    }
  },

  clear: () => {
    return { stdout: '', stderr: '', exitCode: 0, clearScreen: true };
  },

  whoami: ({ context }) => {
    return { stdout: `${context.user}\n`, stderr: '', exitCode: 0 };
  },

  id: ({ context }) => {
    return {
      stdout: `uid=1000(${context.user}) gid=1000(${context.user}) groups=1000(${context.user}),998(wheel),999(docker)\n`,
      stderr: '',
      exitCode: 0,
    };
  },

  groups: ({ context }) => {
    return {
      stdout: `${context.user} wheel docker\n`,
      stderr: '',
      exitCode: 0,
    };
  },

  head: ({ fs, cwd, args, stdin }) => {
    const { options, positional } = parseArgsAndFlags(args, ['n']);
    const count = parseInt(options['n'] || '10', 10);

    let text = stdin;
    if (positional.length > 0) {
      try {
        text = fs.readFile(positional[0], cwd);
      } catch (err: any) {
        return { stdout: '', stderr: `${err.message}\n`, exitCode: 1 };
      }
    }

    const lines = text.split('\n');
    const result = lines.slice(0, count).join('\n');
    return {
      stdout: result + (result.endsWith('\n') ? '' : '\n'),
      stderr: '',
      exitCode: 0,
    };
  },

  tail: ({ fs, cwd, args, stdin }) => {
    const { options, positional } = parseArgsAndFlags(args, ['n']);
    const count = parseInt(options['n'] || '10', 10);

    let text = stdin;
    if (positional.length > 0) {
      try {
        text = fs.readFile(positional[0], cwd);
      } catch (err: any) {
        return { stdout: '', stderr: `${err.message}\n`, exitCode: 1 };
      }
    }

    const lines = text.split('\n');
    if (lines[lines.length - 1] === '') lines.pop(); // remove trailing empty split
    const result = lines.slice(-count).join('\n');
    return {
      stdout: result + '\n',
      stderr: '',
      exitCode: 0,
    };
  },

  grep: ({ fs, cwd, args, stdin }) => {
    const { flags, positional } = parseArgsAndFlags(args);
    const ignoreCase = flags.has('i');
    const invert = flags.has('v');
    const showLineNumber = flags.has('n');

    if (positional.length === 0) {
      return { stdout: '', stderr: 'grep: search pattern required\n', exitCode: 2 };
    }

    const pattern = positional[0];
    const regexFlags = ignoreCase ? 'i' : '';
    let regex: RegExp;
    try {
      regex = new RegExp(pattern, regexFlags);
    } catch {
      return { stdout: '', stderr: `grep: invalid pattern '${pattern}'\n`, exitCode: 2 };
    }

    let content = stdin;
    if (positional.length > 1) {
      try {
        content = fs.readFile(positional[1], cwd);
      } catch (err: any) {
        return { stdout: '', stderr: `${err.message}\n`, exitCode: 2 };
      }
    }

    const lines = content.split('\n');
    const matches: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line === '' && i === lines.length - 1) continue;
      const matched = regex.test(line);
      const shouldInclude = invert ? !matched : matched;

      if (shouldInclude) {
        matches.push(showLineNumber ? `${i + 1}:${line}` : line);
      }
    }

    return {
      stdout: matches.length > 0 ? matches.join('\n') + '\n' : '',
      stderr: '',
      exitCode: matches.length > 0 ? 0 : 1,
    };
  },

  wc: ({ fs, cwd, args, stdin }) => {
    const { flags, positional } = parseArgsAndFlags(args);
    let countLines = flags.has('l');
    let countWords = flags.has('w');
    let countChars = flags.has('c');

    if (!countLines && !countWords && !countChars) {
      countLines = true;
      countWords = true;
      countChars = true;
    }

    let text = stdin;
    let label = '';
    if (positional.length > 0) {
      try {
        text = fs.readFile(positional[0], cwd);
        label = ` ${positional[0]}`;
      } catch (err: any) {
        return { stdout: '', stderr: `${err.message}\n`, exitCode: 1 };
      }
    }

    const lines = text.split('\n').length - (text.endsWith('\n') ? 1 : 0);
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const bytes = new Blob([text]).size || text.length;

    const parts: string[] = [];
    if (countLines) parts.push(lines.toString().padStart(6));
    if (countWords) parts.push(words.toString().padStart(6));
    if (countChars) parts.push(bytes.toString().padStart(6));

    return {
      stdout: `${parts.join(' ')}${label}\n`,
      stderr: '',
      exitCode: 0,
    };
  },

  sort: ({ fs, cwd, args, stdin }) => {
    const { flags, positional } = parseArgsAndFlags(args);
    const reverse = flags.has('r');
    const numeric = flags.has('n');

    let text = stdin;
    if (positional.length > 0) {
      try {
        text = fs.readFile(positional[0], cwd);
      } catch (err: any) {
        return { stdout: '', stderr: `${err.message}\n`, exitCode: 1 };
      }
    }

    const lines = text.split('\n').filter((l, idx, arr) => !(idx === arr.length - 1 && l === ''));

    lines.sort((a, b) => {
      if (numeric) {
        const numA = parseFloat(a) || 0;
        const numB = parseFloat(b) || 0;
        return reverse ? numB - numA : numA - numB;
      }
      return reverse ? b.localeCompare(a) : a.localeCompare(b);
    });

    return {
      stdout: lines.join('\n') + (lines.length > 0 ? '\n' : ''),
      stderr: '',
      exitCode: 0,
    };
  },

  uniq: ({ fs, cwd, args, stdin }) => {
    const { flags, positional } = parseArgsAndFlags(args);
    const count = flags.has('c');

    let text = stdin;
    if (positional.length > 0) {
      try {
        text = fs.readFile(positional[0], cwd);
      } catch (err: any) {
        return { stdout: '', stderr: `${err.message}\n`, exitCode: 1 };
      }
    }

    const lines = text.split('\n').filter((l, idx, arr) => !(idx === arr.length - 1 && l === ''));
    const result: string[] = [];

    let current = '';
    let currentCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (i === 0) {
        current = line;
        currentCount = 1;
      } else if (line === current) {
        currentCount++;
      } else {
        result.push(count ? `${currentCount.toString().padStart(4)} ${current}` : current);
        current = line;
        currentCount = 1;
      }
    }

    if (currentCount > 0) {
      result.push(count ? `${currentCount.toString().padStart(4)} ${current}` : current);
    }

    return {
      stdout: result.join('\n') + (result.length > 0 ? '\n' : ''),
      stderr: '',
      exitCode: 0,
    };
  },

  chmod: ({ fs, cwd, args }) => {
    if (args.length < 2) {
      return { stdout: '', stderr: 'chmod: missing operand\n', exitCode: 1 };
    }
    const mode = args[0];
    const target = args[1];

    try {
      fs.chmod(target, mode, cwd);
      return { stdout: '', stderr: '', exitCode: 0 };
    } catch (err: any) {
      return { stdout: '', stderr: `${err.message}\n`, exitCode: 1 };
    }
  },

  stat: ({ fs, cwd, args }) => {
    if (args.length === 0) {
      return { stdout: '', stderr: 'stat: missing operand\n', exitCode: 1 };
    }
    const target = args[0];
    const stat = fs.getStat(target, cwd);
    if (!stat) {
      return { stdout: '', stderr: `stat: cannot stat '${target}': No such file or directory\n`, exitCode: 1 };
    }

    const out = `  File: ${stat.name}
  Size: ${stat.size}      Blocks: 8          IO Block: 4096   ${stat.type === 'directory' ? 'directory' : 'regular file'}
Device: 801h/2049d      Inode: 483921      Links: 1
Access: (${stat.octal}/${stat.mode})  Uid: (1000/${stat.owner})   Gid: (1000/${stat.group})
Access: ${stat.modifiedAt.toISOString()}
Modify: ${stat.modifiedAt.toISOString()}
Change: ${stat.modifiedAt.toISOString()}
`;
    return { stdout: out, stderr: '', exitCode: 0 };
  },

  file: ({ fs, cwd, args }) => {
    if (args.length === 0) {
      return { stdout: '', stderr: 'file: missing operand\n', exitCode: 1 };
    }
    const target = args[0];
    const node = fs.getNode(target, cwd);
    if (!node) {
      return { stdout: '', stderr: `file: cannot open '${target}': No such file or directory\n`, exitCode: 1 };
    }

    if (node.type === 'directory') {
      return { stdout: `${target}: directory\n`, stderr: '', exitCode: 0 };
    }
    if (node.name.endsWith('.sh')) {
      return { stdout: `${target}: POSIX shell script, ASCII text executable\n`, stderr: '', exitCode: 0 };
    }
    if (node.name.endsWith('.tar.gz')) {
      return { stdout: `${target}: gzip compressed data, from Unix\n`, stderr: '', exitCode: 0 };
    }
    if (node.name.endsWith('.txt') || node.name.endsWith('.md')) {
      return { stdout: `${target}: Unicode text, UTF-8 text\n`, stderr: '', exitCode: 0 };
    }
    return { stdout: `${target}: ASCII text\n`, stderr: '', exitCode: 0 };
  },

  tree: ({ fs, cwd, args }) => {
    const target = args[0] || cwd;
    const resolved = fs.normalizePath(target, cwd);
    const node = fs.getNode(resolved);
    if (!node) {
      return { stdout: '', stderr: `tree: '${target}': No such file or directory\n`, exitCode: 1 };
    }

    let dirCount = 0;
    let fileCount = 0;

    const renderTree = (curr: any, prefix = ''): string => {
      if (curr.type === 'file') {
        fileCount++;
        return '';
      }

      let res = '';
      const children = Object.values(curr.children) as any[];
      children.sort((a, b) => a.name.localeCompare(b.name));

      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const isLast = i === children.length - 1;
        const pointer = isLast ? '└── ' : '├── ';
        const childPrefix = prefix + (isLast ? '    ' : '│   ');

        res += `${prefix}${pointer}${child.name}${child.type === 'directory' ? '/' : ''}\n`;
        if (child.type === 'directory') {
          dirCount++;
          res += renderTree(child, childPrefix);
        } else {
          fileCount++;
        }
      }
      return res;
    };

    let output = `${target}\n` + renderTree(node);
    output += `\n${dirCount} directories, ${fileCount} files\n`;
    return { stdout: output, stderr: '', exitCode: 0 };
  },

  find: ({ fs, cwd, args }) => {
    const { positional, options } = parseArgsAndFlags(args, ['name']);
    const startPath = positional[0] || '.';
    const nameFilter = options['name'];

    const resolved = fs.normalizePath(startPath, cwd);
    const results: string[] = [];

    const walk = (currPath: string) => {
      const node = fs.getNode(currPath);
      if (!node) return;

      const baseName = node.name || '.';
      let match = true;
      if (nameFilter) {
        if (nameFilter.startsWith('*') && nameFilter.endsWith('*')) {
          match = baseName.includes(nameFilter.slice(1, -1));
        } else if (nameFilter.startsWith('*')) {
          match = baseName.endsWith(nameFilter.slice(1));
        } else if (nameFilter.endsWith('*')) {
          match = baseName.startsWith(nameFilter.slice(0, -1));
        } else {
          match = baseName === nameFilter;
        }
      }

      if (match) {
        results.push(currPath);
      }

      if (node.type === 'directory') {
        const children = Object.keys(node.children).sort();
        for (const child of children) {
          const childPath = currPath === '/' ? `/${child}` : `${currPath}/${child}`;
          walk(childPath);
        }
      }
    };

    walk(resolved);
    return {
      stdout: results.join('\n') + (results.length > 0 ? '\n' : ''),
      stderr: '',
      exitCode: 0,
    };
  },

  which: ({ args }) => {
    if (args.length === 0) {
      return { stdout: '', stderr: 'which: missing command\n', exitCode: 1 };
    }
    const cmd = args[0];
    if (commandsRegistry[cmd]) {
      return { stdout: `/usr/bin/${cmd}\n`, stderr: '', exitCode: 0 };
    }
    return { stdout: '', stderr: `which: no ${cmd} in (/usr/bin:/bin)\n`, exitCode: 1 };
  },

  type: ({ args, context }) => {
    if (args.length === 0) {
      return { stdout: '', stderr: 'type: missing argument\n', exitCode: 1 };
    }
    const cmd = args[0];
    if (context.functions[cmd]) {
      return { stdout: `${cmd} is a function\n`, stderr: '', exitCode: 0 };
    }
    if (context.aliases[cmd]) {
      return { stdout: `${cmd} is an alias for '${context.aliases[cmd]}'\n`, stderr: '', exitCode: 0 };
    }
    if (commandsRegistry[cmd]) {
      return { stdout: `${cmd} is a shell builtin\n`, stderr: '', exitCode: 0 };
    }
    return { stdout: '', stderr: `type: ${cmd}: not found\n`, exitCode: 1 };
  },

  set: ({ args, context }) => {
    // Fish shell variable assignment: set KEY VALUE
    if (args.length === 0) {
      const vars = Object.entries(context.env)
        .map(([k, v]) => `${k} '${v}'`)
        .join('\n');
      return { stdout: vars + '\n', stderr: '', exitCode: 0 };
    }

    const key = args[0];
    const val = args.slice(1).join(' ');
    return {
      stdout: '',
      stderr: '',
      exitCode: 0,
      envUpdates: { [key]: val },
    };
  },

  functions: ({ context }) => {
    const fnList = Object.keys(context.functions);
    const defaults = ['fish_prompt', 'fish_title', 'll', 'la'];
    const all = Array.from(new Set([...defaults, ...fnList])).sort();
    return { stdout: all.join('  ') + '\n', stderr: '', exitCode: 0 };
  },

  history: ({ context }) => {
    const list = context.history.map((cmd, idx) => `  ${(idx + 1).toString().padStart(4)}  ${cmd}`);
    return { stdout: list.join('\n') + (list.length > 0 ? '\n' : ''), stderr: '', exitCode: 0 };
  },

  uname: ({ args }) => {
    const { flags } = parseArgsAndFlags(args);
    if (flags.has('a')) {
      return {
        stdout: 'Linux kernellab 6.8.0-kernellab-x86_64 #1 SMP PREEMPT_DYNAMIC Wed Oct 07 10:00:00 UTC 2026 x86_64 GNU/Linux\n',
        stderr: '',
        exitCode: 0,
      };
    }
    if (flags.has('r')) {
      return { stdout: '6.8.0-kernellab-x86_64\n', stderr: '', exitCode: 0 };
    }
    return { stdout: 'Linux\n', stderr: '', exitCode: 0 };
  },

  hostname: ({ context }) => {
    return { stdout: `${context.hostname}\n`, stderr: '', exitCode: 0 };
  },

  date: () => {
    return { stdout: new Date().toUTCString() + '\n', stderr: '', exitCode: 0 };
  },

  env: ({ context }) => {
    const list = Object.entries(context.env)
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');
    return { stdout: list + '\n', stderr: '', exitCode: 0 };
  },

  printenv: ({ args, context }) => {
    if (args.length > 0) {
      const val = context.env[args[0]];
      return { stdout: val !== undefined ? val + '\n' : '', stderr: '', exitCode: val !== undefined ? 0 : 1 };
    }
    const list = Object.entries(context.env)
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');
    return { stdout: list + '\n', stderr: '', exitCode: 0 };
  },

  ps: () => {
    const out = `  PID TTY          TIME CMD
    1 ?        00:00:01 systemd
  120 ?        00:00:00 kthreadd
  342 ?        00:00:00 udevd
  512 pts/0    00:00:00 fish
  589 pts/0    00:00:00 ps
`;
    return { stdout: out, stderr: '', exitCode: 0 };
  },

  top: () => {
    const out = `top - 10:14:00 up 2 days,  1 user,  load average: 0.12, 0.08, 0.05
Tasks: 5 total,   1 running,   4 sleeping,   0 stopped,   0 zombie
%Cpu(s):  2.3 us,  1.1 sy,  0.0 ni, 96.4 id,  0.2 wa,  0.0 hi,  0.0 si
MiB Mem :   8192.0 total,   4812.3 free,   2130.4 used,   1249.3 buff/cache
MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
  512 user      20   0   14.2m   4.1m   3.2m S   0.0   0.1   0:00.08 fish
    1 root      20   0  168.4m  12.8m   8.9m S   0.0   0.2   0:01.42 systemd
  342 root      20   0   24.1m   5.2m   4.1m S   0.0   0.1   0:00.12 udevd
`;
    return { stdout: out, stderr: '', exitCode: 0 };
  },

  uptime: () => {
    return {
      stdout: ' 10:14:02 up 2 days,  1 user,  load average: 0.08, 0.05, 0.02\n',
      stderr: '',
      exitCode: 0,
    };
  },

  free: ({ args }) => {
    const { flags } = parseArgsAndFlags(args);
    const human = flags.has('h') || flags.has('m');
    const unit = human ? 'Mi' : '';
    const out = `               total        used        free      shared  buff/cache   available
Mem:           ${human ? '8192Mi' : '8388608'}     ${human ? '2130Mi' : '2181120'}     ${human ? '4812Mi' : '4927488'}       ${human ? '64Mi' : '65536'}     ${human ? '1250Mi' : '1280000'}     ${human ? '5820Mi' : '5959680'}
Swap:          ${human ? '2048Mi' : '2097152'}        ${human ? '0Mi' : '0'}     ${human ? '2048Mi' : '2097152'}
`;
    return { stdout: out, stderr: '', exitCode: 0 };
  },

  df: ({ args }) => {
    const out = `Filesystem     1K-blocks      Used Available Use% Mounted on
udev             4096000         0   4096000   0% /dev
/dev/nvme0n1p2 102400000  28400000  68700000  30% /
tmpfs             819200      1200    818000   1% /run
/dev/nvme0n1p1    524288     14200    510088   3% /boot/efi
`;
    return { stdout: out, stderr: '', exitCode: 0 };
  },

  lscpu: () => {
    const out = `Architecture:                    x86_64
CPU op-mode(s):                  32-bit, 64-bit
Address sizes:                   39 bits physical, 48 bits virtual
Byte Order:                      Little Endian
CPU(s):                          4
On-line CPU(s) list:             0-3
Model name:                      KernelLab Simulated Virtual CPU @ 3.20GHz
Thread(s) per core:              1
Core(s) per socket:              4
Socket(s):                       1
L1d cache:                       128 KiB (4 instances)
L1i cache:                       128 KiB (4 instances)
L2 cache:                        2 MiB (4 instances)
L3 cache:                        8 MiB (1 instance)
`;
    return { stdout: out, stderr: '', exitCode: 0 };
  },

  lsblk: () => {
    const out = `NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
nvme0n1     259:0    0 119.2G  0 disk 
├─nvme0n1p1 259:1    0   512M  0 part /boot/efi
└─nvme0n1p2 259:2    0 118.7G  0 part /
`;
    return { stdout: out, stderr: '', exitCode: 0 };
  },

  dmesg: ({ fs }) => {
    try {
      const content = fs.readFile('/var/log/dmesg');
      return { stdout: content, stderr: '', exitCode: 0 };
    } catch {
      return {
        stdout: '[    0.000000] Linux version 6.8.0-kernellab-x86_64\n[    0.004500] Initializing cgroup subsys cpu\n',
        stderr: '',
        exitCode: 0,
      };
    }
  },

  journalctl: ({ fs }) => {
    try {
      const content = fs.readFile('/var/log/syslog');
      return { stdout: content, stderr: '', exitCode: 0 };
    } catch {
      return { stdout: '-- No logs available --\n', stderr: '', exitCode: 0 };
    }
  },

  systemctl: ({ args }) => {
    if (args.length === 0 || args[0] === 'status') {
      const service = args[1] || 'kernellab.service';
      return {
        stdout: `● ${service} - KernelLab OS Environment
     Loaded: loaded (/etc/systemd/system/${service}; enabled; preset: enabled)
     Active: active (running) since Wed 2026-10-07 10:00:00 UTC
   Main PID: 1 (systemd)
      Tasks: 4 (limit: 4915)
     Memory: 24.8M
        CPU: 180ms
     CGroup: /system.slice/${service}
`,
        stderr: '',
        exitCode: 0,
      };
    }
    return { stdout: `Systemctl action '${args[0]}' simulated successfully.\n`, stderr: '', exitCode: 0 };
  },

  ping: ({ args }) => {
    if (args.length === 0) {
      return { stdout: '', stderr: 'ping: usage error: Destination address required\n', exitCode: 1 };
    }
    const host = args[0];
    const out = `PING ${host} (127.0.0.1) 56(84) bytes of data.
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.038 ms
64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.042 ms
64 bytes from 127.0.0.1: icmp_seq=3 ttl=64 time=0.039 ms

--- ${host} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2003ms
rtt min/avg/max/mdev = 0.038/0.040/0.042/0.002 ms
`;
    return { stdout: out, stderr: '', exitCode: 0 };
  },

  curl: ({ args }) => {
    if (args.length === 0) {
      return { stdout: '', stderr: 'curl: try \'curl --help\' for more information\n', exitCode: 2 };
    }
    const url = args[args.length - 1];
    return {
      stdout: `HTTP/2 200 OK\ncontent-type: application/json\nx-served-by: kernellab-simulation\n\n{\n  "status": "online",\n  "target": "${url}",\n  "message": "Connection to ${url} simulated successfully."\n}\n`,
      stderr: '',
      exitCode: 0,
    };
  },

  ip: ({ args }) => {
    if (args.length === 0 || args[0] === 'a' || args[0] === 'addr') {
      const out = `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 52:54:00:12:34:56 brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.105/24 brd 192.168.1.255 scope global dynamic eth0
       valid_lft 86120sec preferred_lft 86120sec
`;
      return { stdout: out, stderr: '', exitCode: 0 };
    }
    return { stdout: 'ip command executed.\n', stderr: '', exitCode: 0 };
  },

  ss: () => {
    const out = `Netid State  Recv-Q Send-Q   Local Address:Port   Peer Address:Port Process
tcp   LISTEN 0      128            0.0.0.0:22          0.0.0.0:*    
tcp   LISTEN 0      4096         127.0.0.1:8080        0.0.0.0:*    
`;
    return { stdout: out, stderr: '', exitCode: 0 };
  },

  kill: ({ args }) => {
    if (args.length === 0) {
      return { stdout: '', stderr: 'kill: usage: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ... or kill -l [sigspec]\n', exitCode: 1 };
    }
    const pid = args[args.length - 1];
    return { stdout: `Process ${pid} terminated with SIGTERM (15).\n`, stderr: '', exitCode: 0 };
  },
};
