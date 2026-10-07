import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialFS } from '../engine/filesystem/initialFS';
import { VirtualFS } from '../engine/filesystem/VirtualFS';
import { executeCommand } from '../engine/shell/dispatcher';
import { ShellContext } from '../types/shell';

describe('Linux Commands & Dispatcher Engine', () => {
  let fs: VirtualFS;
  let context: ShellContext;

  beforeEach(() => {
    fs = createInitialFS();
    context = {
      cwd: '/home/user',
      user: 'user',
      hostname: 'kernellab',
      env: {
        USER: 'user',
        HOME: '/home/user',
        SHELL: '/usr/bin/fish',
        PATH: '/usr/bin:/bin',
      },
      history: [],
      aliases: {},
      functions: {},
    };
  });

  it('executes pwd and cd commands', () => {
    const pwdRes = executeCommand('pwd', fs, context);
    expect(pwdRes.stdout.trim()).toBe('/home/user');

    const cdRes = executeCommand('cd Documents', fs, context);
    expect(cdRes.newCwd).toBe('/home/user/Documents');

    const cdInvalid = executeCommand('cd nonexistent', fs, context);
    expect(cdInvalid.exitCode).toBe(1);
    expect(cdInvalid.stderr).toContain('does not exist');
  });

  it('executes ls with and without flags', () => {
    const lsRes = executeCommand('ls', fs, context);
    expect(lsRes.stdout).toContain('Documents/');
    expect(lsRes.stdout).toContain('notes.txt');

    const lsLa = executeCommand('ls -la', fs, context);
    expect(lsLa.stdout).toContain('total');
    expect(lsLa.stdout).toContain('user');
  });

  it('executes echo, redirection, and cat', () => {
    executeCommand('echo "Hello KernelLab" > hello.txt', fs, context);
    expect(fs.exists('/home/user/hello.txt')).toBe(true);

    const catRes = executeCommand('cat hello.txt', fs, context);
    expect(catRes.stdout.trim()).toBe('Hello KernelLab');
  });

  it('executes command pipeline: cat | grep | wc', () => {
    const res = executeCommand('cat notes.txt | grep Kernel | wc -l', fs, context);
    expect(res.exitCode).toBe(0);
    expect(parseInt(res.stdout.trim(), 10)).toBeGreaterThan(0);
  });

  it('executes mkdir -p and verifies virtual filesystem change', () => {
    executeCommand('mkdir -p ~/projects/linux/testdir/sub', fs, context);
    expect(fs.isDirectory('/home/user/projects/linux/testdir/sub')).toBe(true);
  });

  it('executes touch and stat', () => {
    executeCommand('touch newfile.txt', fs, context);
    expect(fs.exists('/home/user/newfile.txt')).toBe(true);

    const statRes = executeCommand('stat newfile.txt', fs, context);
    expect(statRes.stdout).toContain('File: newfile.txt');
    expect(statRes.stdout).toContain('Access:');
  });

  it('executes chmod and provides learning feedback hint', () => {
    executeCommand('touch script.sh', fs, context);
    const chmodRes = executeCommand('chmod 755 script.sh', fs, context);
    expect(chmodRes.exitCode).toBe(0);
    expect(chmodRes.learningHint).toContain('755');
    expect(chmodRes.learningHint).toContain('owner:  rwx');
  });

  it('executes fish set command to update shell variables', () => {
    const setRes = executeCommand('set MYVAR "KernelLab"', fs, context);
    expect(setRes.envUpdates?.MYVAR).toBe('KernelLab');
  });
});
