import { CurriculumModule } from '../../types/curriculum';

export const CURRICULUM_MODULES: CurriculumModule[] = [
  {
    id: 'fundamentals',
    number: 1,
    title: 'Linux Fundamentals',
    shortTitle: 'Fundamentals',
    description: 'Core concepts of Unix architectures, kernels, hardware abstraction, and the user space.',
    iconName: 'Cpu',
    badgeText: 'Foundation',
    lessons: [
      {
        id: 'what-is-linux',
        moduleId: 'fundamentals',
        title: 'What is Linux & Unix Philosophy',
        summary: 'Understand Unix heritage, operating system layers, and the principle of doing one thing well.',
        readTime: '4 min',
        content: `### What is Linux?

Linux is a monolithic Unix-like operating system kernel created by Linus Torvalds in 1991. When combined with GNU user space utilities, compilers, and a desktop or server environment, it constitutes the GNU/Linux Operating System.

#### Key Architectural Layers:
1. **Hardware**: Physical CPU, memory (RAM), disks, and peripherals.
2. **Kernel**: The core supervisor executing in privileged mode (Ring 0). It manages CPU scheduling, virtual memory, device drivers, and system calls.
3. **System Call Interface (POSIX)**: The bridge allowing user space processes to request kernel services (e.g., \`read()\`, \`write()\`, \`fork()\`).
4. **User Space (Ring 3)**: Unprivileged applications, shells, daemons, and libraries.

#### The Unix Philosophy:
- Write programs that do one thing and do it well.
- Write programs to work together.
- Write programs to handle text streams, because text is a universal interface.`,
        examples: [
          {
            command: 'uname -a',
            description: 'Print all system architecture and kernel version information',
          },
          {
            command: 'cat /etc/os-release',
            description: 'Inspect Linux distribution metadata and release identifiers',
          },
        ],
        keyTakeaways: [
          'The kernel manages hardware access and process isolation in Ring 0.',
          'User space applications interact with the kernel through POSIX system calls.',
          'Small modular tools compose into powerful pipelines via standard text streams.',
        ],
      },
      {
        id: 'filesystem-hierarchy',
        moduleId: 'fundamentals',
        title: 'Filesystem Hierarchy Standard (FHS)',
        summary: 'Explore the root directory tree and the designated purpose of each standard directory.',
        readTime: '5 min',
        content: `### The Linux Directory Tree

Unlike Windows, which uses drive letters like \`C:\` and \`D:\`, Linux organizes all storage under a single unified hierarchical tree rooted at \`/\`.

#### Key Top-Level Directories:
- \`/\` : The root of the entire filesystem.
- \`/home\` : User personal files, configs, and workspaces (e.g., \`/home/user\`).
- \`/etc\` : System-wide host-specific configuration files (e.g., \`/etc/hostname\`, \`/etc/passwd\`).
- \`/bin\` & \`/usr/bin\` : Essential user command binaries (e.g., \`ls\`, \`cat\`, \`fish\`).
- \`/var\` : Variable data that changes during system operation (logs, caches, spools).
- \`/tmp\` : Temporary scratch storage cleared across reboots.
- \`/proc\` & \`/sys\` : Virtual in-memory pseudo-filesystems exposing kernel internals and device states.`,
        examples: [
          {
            command: 'ls /',
            description: 'List the contents of the root filesystem directory',
          },
          {
            command: 'cat /etc/hostname',
            description: 'Read the configured system network hostname',
          },
        ],
        keyTakeaways: [
          'Everything starts at the single root directory `/`.',
          'Configuration files live in `/etc`, while user documents live in `/home/<username>`.',
          'In Unix, "everything is a file", including devices, network sockets, and processes.',
        ],
      },
    ],
  },
  {
    id: 'navigation',
    number: 2,
    title: 'Filesystem Navigation',
    shortTitle: 'Navigation',
    description: 'Master moving across directory trees, listing nodes, and path resolutions.',
    iconName: 'Compass',
    badgeText: 'Essential',
    lessons: [
      {
        id: 'nav-basics',
        moduleId: 'navigation',
        title: 'pwd, ls, and cd Essentials',
        summary: 'Find your current working directory, list directory contents, and move seamlessly.',
        readTime: '4 min',
        content: `### Traversing the Hierarchy

To navigate effectively, you need three core commands:

1. **\`pwd\` (Print Working Directory)**: Outputs the full absolute path of where your shell is currently located.
2. **\`ls\` (List)**: Shows files and directories inside the target directory.
   - \`-l\` : Detailed long format (permissions, owner, size, timestamp).
   - \`-a\` : Show hidden files (names starting with \`.\`).
   - \`-la\` : Combine both flags.
3. **\`cd\` (Change Directory)**:
   - \`cd Documents\` : Move into a child directory.
   - \`cd ..\` : Move up one directory level.
   - \`cd ~\` or just \`cd\` : Return to your home directory (\`/home/user\`).`,
        syntax: 'cd [PATH] | ls [-l] [-a] [PATH] | pwd',
        examples: [
          { command: 'pwd', description: 'Displays your current location' },
          { command: 'ls -la', description: 'Lists all files with permissions and hidden entries' },
          { command: 'cd Documents', description: 'Enter the Documents directory' },
        ],
        interactiveChallenge: {
          id: 'nav-challenge-1',
          title: 'Navigate to Documents and inspect files',
          description: 'Change directory to Documents and list its contents.',
          instructions: [
            'Use cd to enter the Documents directory inside your home folder.',
            'Confirm your current path with pwd.',
            'List the files using ls -la.',
          ],
          hints: ['Run `cd ~/Documents` or `cd Documents` from your home directory.'],
          targetOutcome: 'Current directory is /home/user/Documents',
          rules: [
            {
              type: 'path_exists',
              path: '/home/user/Documents/welcome.txt',
              description: 'Access welcome.txt inside Documents',
            },
          ],
          xp: 50,
        },
        keyTakeaways: [
          'Relative paths depend on your current working directory; absolute paths always begin with `/`.',
          '`..` represents the parent directory, while `.` represents the current directory.',
        ],
      },
      {
        id: 'tree-and-structure',
        moduleId: 'navigation',
        title: 'Visualizing Trees with tree and clear',
        summary: 'Render visual directory branch hierarchies and manage terminal viewport cleanliness.',
        readTime: '3 min',
        content: `### Tree Structure & Terminal Control

The \`tree\` command recursively descends directories and generates an indented tree representation of files and subdirectories.

When output fills up your screen, use:
- **\`clear\`**: Clears the visible terminal scrollback.
- **Shortcut \`Ctrl + L\`**: Built-in keyboard shortcut to clear terminal screen immediately.`,
        syntax: 'tree [PATH] | clear',
        examples: [
          { command: 'tree ~/projects', description: 'Renders the projects folder hierarchy' },
          { command: 'clear', description: 'Clears the terminal viewport' },
        ],
        keyTakeaways: [
          '`tree` provides an instant bird-eye view of recursive filesystem structures.',
          '`Ctrl+L` or `clear` restores clean terminal clarity.',
        ],
      },
    ],
  },
  {
    id: 'files',
    number: 3,
    title: 'Files and Directories',
    shortTitle: 'Files & Dirs',
    description: 'Create, inspect, copy, move, and remove files and nested directory structures.',
    iconName: 'FolderTree',
    badgeText: 'Hands-on',
    lessons: [
      {
        id: 'creating-files-dirs',
        moduleId: 'files',
        title: 'touch and mkdir -p',
        summary: 'Create empty files, update timestamps, and construct nested directory trees in one go.',
        readTime: '4 min',
        content: `### Creating Storage Nodes

#### 1. \`touch <filename>\`
Creates an empty file if it doesn't already exist. If it does exist, it updates the file's last modified timestamp without modifying content.

#### 2. \`mkdir <dirname>\`
Creates a new directory. 
- Without flags, it fails if parent directories do not exist.
- Using \`mkdir -p path/to/nested/dir\` automatically creates all intermediate missing parent directories safely!`,
        syntax: 'touch <file...> | mkdir [-p] <dir...>',
        examples: [
          { command: 'touch notes.txt', description: 'Creates an empty notes.txt' },
          { command: 'mkdir -p ~/projects/linux/scripts', description: 'Creates nested directories in one command' },
        ],
        interactiveChallenge: {
          id: 'challenge-file-tree',
          title: 'Build a Linux Project Skeleton',
          description: 'Construct a structured project directory tree for your OS notes.',
          instructions: [
            'Create the nested path: `~/projects/linux/notes` and `~/projects/linux/scripts` using `mkdir -p`.',
            'Create a `README.md` file inside `~/projects/linux`.',
            'Write notes into a file named `notes.txt` inside `~/projects/linux/notes/`.',
          ],
          hints: [
            'Run: `mkdir -p ~/projects/linux/notes ~/projects/linux/scripts`',
            'Run: `touch ~/projects/linux/README.md`',
            'Run: `echo "OS Concepts" > ~/projects/linux/notes/notes.txt`',
          ],
          targetOutcome: 'Project directories and notes exist in virtual filesystem',
          rules: [
            { type: 'is_dir', path: '/home/user/projects/linux/notes', description: 'notes directory exists' },
            { type: 'is_dir', path: '/home/user/projects/linux/scripts', description: 'scripts directory exists' },
            { type: 'is_file', path: '/home/user/projects/linux/README.md', description: 'README.md exists' },
          ],
          xp: 100,
        },
        keyTakeaways: [
          'Always use `mkdir -p` when constructing multi-level directory paths in scripts.',
          '`touch` is the standard tool to create files or bump timestamps.',
        ],
      },
      {
        id: 'file-manipulation',
        moduleId: 'files',
        title: 'cp, mv, rm, and Content Inspection',
        summary: 'Copy nodes, rename files, remove safely, and inspect file contents with cat, head, and tail.',
        readTime: '5 min',
        content: `### Copying, Moving, and Reading

#### Safe File Operations:
- **\`cp <src> <dest>\`** : Copy file. Use \`-r\` to copy entire directories recursively.
- **\`mv <src> <dest>\`** : Move or rename files and directories.
- **\`rm <target>\`** : Delete file. Use \`-r\` for directories, and \`-f\` to suppress non-existent warnings.
- **\`cat <file>\`** : Concatenate and display entire file contents to standard output.
- **\`head -n <lines> <file>\`** : View the first N lines of a file (default 10).
- **\`tail -n <lines> <file>\`** : View the last N lines of a file (default 10).
- **\`stat <file>\`** : Inspect low-level inode data, size, and octal permissions.`,
        syntax: 'cp [-r] <src> <dest> | mv <src> <dest> | rm [-r] <file> | cat <file>',
        examples: [
          { command: 'cat ~/notes.txt', description: 'Read full study notes' },
          { command: 'head -n 2 ~/notes.txt', description: 'Read the first 2 lines of notes' },
          { command: 'cp ~/notes.txt ~/Documents/backup.txt', description: 'Create a backup copy' },
        ],
        interactiveChallenge: {
          id: 'challenge-backup-file',
          title: 'Duplicate and Backup Study Notes',
          description: 'Make a duplicate copy of your notes into Documents.',
          instructions: [
            'Copy `~/notes.txt` to `~/Documents/study_backup.txt` using the `cp` command.',
            'Verify the copy exists by running `cat ~/Documents/study_backup.txt`.',
          ],
          hints: ['Run `cp ~/notes.txt ~/Documents/study_backup.txt`'],
          targetOutcome: '~/Documents/study_backup.txt exists with study notes',
          rules: [
            {
              type: 'is_file',
              path: '/home/user/Documents/study_backup.txt',
              description: 'study_backup.txt exists in Documents',
            },
            {
              type: 'file_contains',
              path: '/home/user/Documents/study_backup.txt',
              expected: 'Kernel vs Shell',
              description: 'Backup file contains study notes content',
            },
          ],
          xp: 75,
        },
        keyTakeaways: [
          'Use `cp -r` for recursive directory replication.',
          'Linux has no recycle bin: `rm` removes files permanently from the filesystem.',
        ],
      },
    ],
  },
  {
    id: 'permissions',
    number: 4,
    title: 'Users and Permissions',
    shortTitle: 'Permissions',
    description: 'Understand the POSIX security model: owner, group, others, chmod octal and symbolic modes.',
    iconName: 'ShieldCheck',
    badgeText: 'Security',
    lessons: [
      {
        id: 'posix-permission-model',
        moduleId: 'permissions',
        title: 'The POSIX Security Model & chmod',
        summary: 'Decode `-rwxr-xr--` permission strings, owner/group triplets, and calculate octal masks.',
        readTime: '6 min',
        content: `### Understanding Linux Permissions

Every file and directory in Linux has an owner user and a group, along with 3 sets of permission bits:
1. **User (Owner)**: The user who created or owns the file.
2. **Group**: Other users who belong to the file's assigned group.
3. **Others (World)**: Anyone else on the system.

#### Permission Triplets:
- **\`r\` (Read)** = 4 : Permission to view file contents or list directory contents.
- **\`w\` (Write)** = 2 : Permission to edit/delete file or create files in directory.
- **\`x\` (Execute)** = 1 : Permission to execute a script/binary or \`cd\` into directory.

#### Calculating Octal Notation:
Sum the values for each role:
- \`rwx\` = 4 + 2 + 1 = **7**
- \`rw-\` = 4 + 2 + 0 = **6**
- \`r-x\` = 4 + 0 + 1 = **5**
- \`r--\` = 4 + 0 + 0 = **4**

Example: \`chmod 755 script.sh\` gives:
- Owner: \`7\` (\`rwx\`)
- Group: \`5\` (\`r-x\`)
- Others: \`5\` (\`r-x\`)`,
        syntax: 'chmod <octal|symbolic> <file> | whoami | id | groups',
        examples: [
          { command: 'whoami', description: 'Outputs current active user' },
          { command: 'id', description: 'Outputs UID, GID, and supplemental group memberships' },
          { command: 'chmod 755 ~/projects/linux/scripts/backup.sh', description: 'Make script executable for owner and readable by world' },
        ],
        interactiveChallenge: {
          id: 'challenge-chmod-exec',
          title: 'Grant Execution Rights to Backup Script',
          description: 'Set safe executable permissions on the shell script.',
          instructions: [
            'Create a script file at `~/projects/linux/scripts/deploy.sh` with content: `echo "Deploying..."`.',
            'Use chmod to give it mode `755` (-rwxr-xr-x).',
            'Verify with `stat ~/projects/linux/scripts/deploy.sh`.',
          ],
          hints: [
            'Run: `echo \'echo "Deploying..."\' > ~/projects/linux/scripts/deploy.sh`',
            'Run: `chmod 755 ~/projects/linux/scripts/deploy.sh`',
          ],
          targetOutcome: 'deploy.sh has octal mode 0755',
          rules: [
            { type: 'is_file', path: '/home/user/projects/linux/scripts/deploy.sh', description: 'deploy.sh exists' },
            { type: 'permission_mode', path: '/home/user/projects/linux/scripts/deploy.sh', expected: '0755', description: 'Permissions set to 0755' },
          ],
          xp: 120,
        },
        keyTakeaways: [
          'Read=4, Write=2, Execute=1. Memorize standard values like 755, 644, and 600.',
          'Execute bit (`+x`) is required on directories to traverse into them.',
        ],
      },
    ],
  },
  {
    id: 'processes',
    number: 5,
    title: 'Process Management',
    shortTitle: 'Processes',
    description: 'Explore process states, PID lifecycle, inspection with ps and top, and POSIX signals.',
    iconName: 'Activity',
    badgeText: 'Operating System',
    lessons: [
      {
        id: 'process-lifecycle',
        moduleId: 'processes',
        title: 'PIDs, States, and Signals',
        summary: 'Learn how the Linux kernel schedules and tracks running tasks from fork() to wait().',
        readTime: '5 min',
        content: `### What is a Process?

A process is a program in execution. It consists of:
- An executable machine code segment.
- Private virtual address space (text, data, heap, stack).
- In-kernel state: Process Control Block (PCB / \`task_struct\` in Linux), PID, registers, file descriptors, and CPU priority.

#### Process States:
- **Running (R)**: Executing on CPU or waiting in the Ready queue.
- **Interruptible Sleep (S)**: Waiting for an event or I/O completion.
- **Uninterruptible Sleep (D)**: Waiting directly on hardware I/O.
- **Zombie (Z)**: Terminated process whose parent has not yet read its exit status with \`wait()\`.

#### Commands:
- \`ps\` : Snapshot of current active processes.
- \`top\` : Real-time dynamic view of CPU load and memory usage.
- \`kill <PID>\` : Send signals to processes (SIGTERM = 15, SIGKILL = 9).`,
        syntax: 'ps [-ef] | top | kill [-9] <PID>',
        examples: [
          { command: 'ps', description: 'List processes in current session' },
          { command: 'top', description: 'Inspect CPU load, RAM usage, and active tasks' },
          { command: 'kill 512', description: 'Send graceful termination signal to process 512' },
        ],
        keyTakeaways: [
          'PID 1 is init/systemd, the ancestor of all user space processes.',
          'Signals allow asynchronous communication between processes and the kernel.',
        ],
      },
    ],
  },
  {
    id: 'shell-fish',
    number: 6,
    title: 'Shell and Fish Environment',
    shortTitle: 'Shell & Fish',
    description: 'Learn pipelines, redirection, environment variables, and Fish-specific features.',
    iconName: 'Terminal',
    badgeText: 'Command Line',
    lessons: [
      {
        id: 'pipes-and-redirects',
        moduleId: 'shell-fish',
        title: 'Pipelines and Stream Redirection',
        summary: 'Harness the power of standard streams: stdin (0), stdout (1), stderr (2), and pipes.',
        readTime: '5 min',
        content: `### Standard Streams & Piping

Every Unix process is created with 3 standard I/O streams:
- **Standard Input (\`stdin\`, fd 0)**: Source of input (keyboard or redirected stream).
- **Standard Output (\`stdout\`, fd 1)**: Output stream (terminal display or redirected file).
- **Standard Error (\`stderr\`, fd 2)**: Diagnostic and error messages.

#### Redirection Operators:
- \`cmd > file\` : Overwrite file with stdout.
- \`cmd >> file\` : Append stdout to end of file without deleting previous content.
- \`cmd < file\` : Feed file contents into command stdin.
- \`cmd1 | cmd2\` : Pipe the stdout of \`cmd1\` directly into the stdin of \`cmd2\`!`,
        syntax: 'cmd > file | cmd >> file | cmd1 | cmd2',
        examples: [
          { command: 'echo "Operating Systems" > os.txt', description: 'Write text into file' },
          { command: 'cat notes.txt | grep Scheduling', description: 'Filter notes containing "Scheduling"' },
          { command: 'cat notes.txt | grep Kernel | wc -l', description: 'Count occurrences in pipeline' },
        ],
        interactiveChallenge: {
          id: 'challenge-pipeline-filter',
          title: 'Extract Schedulers via Command Pipeline',
          description: 'Filter system log messages using grep and save the output.',
          instructions: [
            'Read `/var/log/syslog` using `cat`.',
            'Filter for lines containing `Scheduler` using `grep`.',
            'Redirect the filtered output to `~/Documents/schedulers.log`.',
          ],
          hints: ['Run: `cat /var/log/syslog | grep Scheduler > ~/Documents/schedulers.log`'],
          targetOutcome: '~/Documents/schedulers.log contains the scheduler log line',
          rules: [
            { type: 'is_file', path: '/home/user/Documents/schedulers.log', description: 'schedulers.log file created' },
            { type: 'file_contains', path: '/home/user/Documents/schedulers.log', expected: 'Schedulers available', description: 'Contains filtered scheduler line' },
          ],
          xp: 150,
        },
        keyTakeaways: [
          'Pipes connect the stdout of one process directly to the stdin of another in memory.',
          'Use `>` to overwrite and `>>` to safely append.',
        ],
      },
      {
        id: 'fish-variables',
        moduleId: 'shell-fish',
        title: 'Fish Shell Variables and Helpers',
        summary: 'Learn Fish shell commands: set, type, functions, and environment inspection.',
        readTime: '4 min',
        content: `### Friendly Interactive Shell (Fish)

Fish is a modern shell designed for developer ergonomics with syntax highlighting, autosuggestions, and clean scripting syntax.

#### Fish Builtins:
- **\`set NAME "value"\`** : Set a shell variable.
- **\`echo $NAME\`** : Access variable value.
- **\`type <command>\`** : Discover whether a command is a builtin, alias, or external binary.
- **\`functions\`** : List all loaded shell functions.
- **\`history\`** : Search and inspect past executed commands.`,
        syntax: 'set <VAR> <VALUE> | type <CMD> | history',
        examples: [
          { command: 'set LAB_NAME "KernelLab"', description: 'Set shell variable LAB_NAME' },
          { command: 'echo $LAB_NAME', description: 'Print value of LAB_NAME' },
          { command: 'type ls', description: 'Inspect command type of ls' },
        ],
        keyTakeaways: [
          'Fish uses `set VAR VALUE` instead of `VAR=VALUE`.',
          '`type` clarifies whether you are running an internal builtin or disk binary.',
        ],
      },
    ],
  },
  {
    id: 'networking',
    number: 7,
    title: 'Networking Fundamentals',
    shortTitle: 'Networking',
    description: 'Network interfaces, IP addresses, packet routing, and HTTP communication tools.',
    iconName: 'Network',
    badgeText: 'Connectivity',
    lessons: [
      {
        id: 'network-inspection',
        moduleId: 'networking',
        title: 'ip, ping, and Socket Inspection with ss',
        summary: 'Inspect network interfaces, test packet reachability with ICMP, and review listening sockets.',
        readTime: '5 min',
        content: `### Linux Network Stack

The Linux kernel networking subsystem implements the TCP/IP suite.

#### Core Networking Commands:
- **\`ip a\` (or \`ip addr\`)**: Displays configured network interfaces, IP addresses, and link states.
  - \`lo\`: Loopback interface (127.0.0.1) for inter-process communication on localhost.
  - \`eth0\` / \`wlan0\`: Physical ethernet or wireless interface.
- **\`ping <host>\`**: Sends ICMP ECHO_REQUEST packets to measure round-trip time (RTT) and verify reachability.
- **\`ss\` (Socket Statistics)**: Inspects open sockets, active TCP connections, and listening ports.
- **\`curl <url>\`**: Command-line HTTP/REST client for transferring data across networks.`,
        syntax: 'ip a | ping <host> | ss | curl <url>',
        examples: [
          { command: 'ip a', description: 'Show all network interfaces and IP addresses' },
          { command: 'ping localhost', description: 'Test ICMP loopback latency' },
          { command: 'curl https://kernellab.dev/api/status', description: 'Simulate HTTP API request' },
        ],
        keyTakeaways: [
          '`ip` has replaced the legacy `ifconfig` tool in modern Linux.',
          '`ss` is the modern, high-performance successor to `netstat`.',
        ],
      },
    ],
  },
  {
    id: 'sysinfo',
    number: 8,
    title: 'System Information',
    shortTitle: 'System Info',
    description: 'Hardware inspection, memory utilization, disk partitions, and CPU architecture.',
    iconName: 'Server',
    badgeText: 'Hardware',
    lessons: [
      {
        id: 'hardware-and-resources',
        moduleId: 'sysinfo',
        title: 'lscpu, free, df, and Uptime',
        summary: 'Examine CPU topologies, RAM usage buffers, disk space, and system uptime.',
        readTime: '4 min',
        content: `### Inspecting System Resources

System administrators and kernel developers constantly monitor hardware resource utilization:

- **\`lscpu\`**: Summarizes CPU architecture, core count, cache sizes (L1, L2, L3), and CPU clock speed.
- **\`free -h\`**: Displays total, used, and available physical RAM and swap memory in human-readable units.
- **\`df -h\`**: Displays disk filesystem space usage, mountpoints, and percentage used.
- **\`uptime\`**: Shows how long the machine has been running along with 1, 5, and 15-minute load averages.`,
        syntax: 'lscpu | free -h | df -h | uptime',
        examples: [
          { command: 'lscpu', description: 'Inspect CPU cache hierarchy and core counts' },
          { command: 'free -h', description: 'Inspect RAM and swap utilization' },
          { command: 'df -h', description: 'Inspect disk storage capacity and mountpoints' },
        ],
        keyTakeaways: [
          'Memory reported as "buff/cache" is reclaimed by the kernel if user processes request RAM.',
          '`lscpu` reveals CPU socket topology and microarchitecture details.',
        ],
      },
    ],
  },
  {
    id: 'debugging',
    number: 9,
    title: 'Logs and Debugging',
    shortTitle: 'Logs & Debug',
    description: 'Systemd service management, kernel ring buffer diagnostics with dmesg, and system logs.',
    iconName: 'Bug',
    badgeText: 'Diagnostics',
    lessons: [
      {
        id: 'systemd-and-dmesg',
        moduleId: 'debugging',
        title: 'systemctl, dmesg, and journalctl',
        summary: 'Diagnose kernel initialization events, service status, and centralized system logs.',
        readTime: '5 min',
        content: `### Diagnostics and Systemd

Modern Linux distributions use **systemd** as their init system and service supervisor.

#### Key Diagnostic Tools:
- **\`dmesg\`**: Dumps the kernel ring buffer. Critical for troubleshooting driver loading, ACPI events, memory detection, and hardware faults.
- **\`journalctl\`**: Queries the centralized binary system log collected by \`systemd-journald\`.
- **\`systemctl status <service>\`**: Queries the runtime state, PID, memory, and recent log messages of a background daemon.`,
        syntax: 'dmesg | journalctl | systemctl status <service>',
        examples: [
          { command: 'dmesg', description: 'Review early boot kernel messages' },
          { command: 'journalctl', description: 'Inspect system event log' },
          { command: 'systemctl status kernellab.service', description: 'Inspect simulated service status' },
        ],
        keyTakeaways: [
          '`dmesg` reads directly from the kernel ring buffer, even before userspace loggers start.',
          '`systemctl` controls daemon lifecycles and manages dependencies.',
        ],
      },
    ],
  },
];
