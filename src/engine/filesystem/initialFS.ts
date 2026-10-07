import { VirtualFS } from './VirtualFS';

export function createInitialFS(): VirtualFS {
  const fs = new VirtualFS();

  // Create standard directories
  fs.createDirectory('/home/user/Documents', true);
  fs.createDirectory('/home/user/Downloads', true);
  fs.createDirectory('/home/user/projects/linux/notes', true);
  fs.createDirectory('/home/user/projects/linux/scripts', true);
  fs.createDirectory('/etc', true);
  fs.createDirectory('/tmp', true);
  fs.createDirectory('/var/log', true);
  fs.createDirectory('/usr/bin', true);

  // User home files
  fs.writeFile(
    '/home/user/notes.txt',
    `KernelLab Operating Systems Study Guide:
1. Kernel vs Shell: The kernel interacts directly with hardware; the shell provides the user interface.
2. Scheduling Metrics:
   - Turnaround Time (TAT) = Completion Time (CT) - Arrival Time (AT)
   - Waiting Time (WT) = Turnaround Time (TAT) - Burst Time (BT)
   - Response Time (RT) = First CPU Time - Arrival Time
3. Preemptive vs Non-Preemptive: Preemptive algorithms allow higher-priority tasks to interrupt running processes.
4. Memory Management: Paging divides physical memory into fixed-sized frames and logical memory into pages.
`
  );

  fs.writeFile(
    '/home/user/Documents/welcome.txt',
    `Welcome to KernelLab!
This is a safe, virtual in-memory Linux and OS laboratory.
Try running commands like:
  ls -la
  cat notes.txt | grep Scheduling
  whoami
  uname -a
`
  );

  fs.writeFile(
    '/home/user/Downloads/package.tar.gz',
    `[Binary Archive File: 1024 bytes]`
  );

  fs.writeFile(
    '/home/user/projects/linux/README.md',
    `# Linux & OS Laboratory
This repository contains exercises and scripts for practicing Linux commands and CPU scheduling algorithms.
Explore the scripts/ directory and test your commands in the terminal!
`
  );

  fs.writeFile(
    '/home/user/projects/linux/scripts/backup.sh',
    `#!/bin/bash
# Backup automation script
echo "Starting system backup..."
date
echo "Backup completed successfully."
`
  );

  // Set executable permission on backup.sh
  fs.chmod('/home/user/projects/linux/scripts/backup.sh', '755');

  // /etc system files
  fs.writeFile('/etc/hostname', 'kernellab\n');
  fs.writeFile(
    '/etc/os-release',
    `NAME="KernelLab Linux"
VERSION="1.0.0-LTS"
ID=kernellab
PRETTY_NAME="KernelLab Linux 1.0 (Interactive OS Edition)"
VERSION_ID="1.0"
HOME_URL="https://kernellab.dev"
`
  );

  fs.writeFile(
    '/etc/passwd',
    `root:x:0:0:root:/root:/bin/bash
user:x:1000:1000:KernelLab Student:/home/user:/usr/bin/fish
syslog:x:104:108::/home/syslog:/usr/sbin/nologin
`
  );

  fs.writeFile(
    '/etc/group',
    `root:x:0:
user:x:1000:
wheel:x:998:user
docker:x:999:user
`
  );

  // /var/log files
  fs.writeFile(
    '/var/log/syslog',
    `Oct 07 10:00:01 kernellab systemd[1]: Started KernelLab Simulated OS v1.0.
Oct 07 10:00:02 kernellab kernel: [    0.000000] Linux version 6.8.0-kernellab-x86_64
Oct 07 10:00:03 kernellab kernel: [    0.000100] CPU: 4 virtual cores detected
Oct 07 10:00:04 kernellab kernel: [    0.000200] Memory: 8192MB RAM online
Oct 07 10:00:05 kernellab kernel: [    0.000300] Schedulers available: FCFS, SJF, SRTF, RR, Priority
Oct 07 10:00:06 kernellab systemd[1]: Reached target Graphical Interface.
`
  );

  fs.writeFile(
    '/var/log/dmesg',
    `[    0.000000] Linux version 6.8.0-kernellab-x86_64 (buildd@kernellab)
[    0.001200] ACPI: Core revision 20240322
[    0.004500] Initializing cgroup subsys cpu
[    0.004501] Initializing cgroup subsys cpuacct
[    0.012000] In-memory safe filesystem initialized.
`
  );

  return fs;
}
