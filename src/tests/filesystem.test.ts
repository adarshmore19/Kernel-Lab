import { describe, it, expect, beforeEach } from 'vitest';
import { VirtualFS, parseOctalToPermissions, permissionsToOctal, permissionsToModeString, defaultPermissions } from '../engine/filesystem/VirtualFS';
import { createInitialFS } from '../engine/filesystem/initialFS';

describe('VirtualFS Engine', () => {
  let fs: VirtualFS;

  beforeEach(() => {
    fs = createInitialFS();
  });

  it('initializes with seed files and directories', () => {
    expect(fs.exists('/home/user')).toBe(true);
    expect(fs.isDirectory('/home/user')).toBe(true);
    expect(fs.exists('/home/user/notes.txt')).toBe(true);
    expect(fs.isFile('/home/user/notes.txt')).toBe(true);
    expect(fs.exists('/etc/hostname')).toBe(true);
    expect(fs.readFile('/etc/hostname').trim()).toBe('kernellab');
  });

  it('normalizes relative and absolute paths accurately', () => {
    expect(fs.normalizePath('notes.txt', '/home/user')).toBe('/home/user/notes.txt');
    expect(fs.normalizePath('../user/notes.txt', '/home/user')).toBe('/home/user/notes.txt');
    expect(fs.normalizePath('~/Documents', '/tmp')).toBe('/home/user/Documents');
    expect(fs.normalizePath('../../../', '/home/user')).toBe('/');
  });

  it('creates, writes, and reads files', () => {
    fs.writeFile('/home/user/test.txt', 'Hello World', '/home/user');
    expect(fs.exists('/home/user/test.txt')).toBe(true);
    expect(fs.readFile('/home/user/test.txt')).toBe('Hello World');
  });

  it('creates nested directories with recursive flag', () => {
    fs.createDirectory('/home/user/deep/nested/dir', true);
    expect(fs.isDirectory('/home/user/deep/nested/dir')).toBe(true);
  });

  it('fails to create nested directories without recursive flag if parent missing', () => {
    expect(() => {
      fs.createDirectory('/home/user/missing/dir', false);
    }).toThrow();
  });

  it('appends to files correctly', () => {
    fs.writeFile('/home/user/log.txt', 'Line 1\n');
    fs.appendFile('/home/user/log.txt', 'Line 2\n');
    expect(fs.readFile('/home/user/log.txt')).toBe('Line 1\nLine 2\n');
  });

  it('copies files and directories recursively', () => {
    fs.copy('/home/user/projects', '/home/user/backup_projects', true);
    expect(fs.isDirectory('/home/user/backup_projects')).toBe(true);
    expect(fs.exists('/home/user/backup_projects/linux/README.md')).toBe(true);
  });

  it('moves files correctly', () => {
    fs.writeFile('/home/user/moveme.txt', 'move content');
    fs.move('/home/user/moveme.txt', '/home/user/Documents/moved.txt');
    expect(fs.exists('/home/user/moveme.txt')).toBe(false);
    expect(fs.readFile('/home/user/Documents/moved.txt')).toBe('move content');
  });

  it('removes files and directories', () => {
    fs.writeFile('/home/user/removeme.txt', 'bye');
    fs.remove('/home/user/removeme.txt');
    expect(fs.exists('/home/user/removeme.txt')).toBe(false);

    fs.createDirectory('/home/user/empty_dir');
    fs.removeDirectory('/home/user/empty_dir');
    expect(fs.exists('/home/user/empty_dir')).toBe(false);
  });

  it('changes permissions with numeric chmod', () => {
    fs.writeFile('/home/user/perm.sh', '#!/bin/bash');
    fs.chmod('/home/user/perm.sh', '755');
    const stat = fs.getStat('/home/user/perm.sh');
    expect(stat?.octal).toBe('0755');
    expect(stat?.mode).toBe('-rwxr-xr-x');
  });

  it('changes permissions with symbolic chmod', () => {
    fs.writeFile('/home/user/script.sh', 'echo hi');
    fs.chmod('/home/user/script.sh', '644');
    fs.chmod('/home/user/script.sh', '+x');
    const stat = fs.getStat('/home/user/script.sh');
    expect(stat?.mode).toBe('-rwxr-xr-x');
  });
});
