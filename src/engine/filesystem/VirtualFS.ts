import {
  DirectoryNode,
  FileNode,
  FilePermissions,
  FSNode,
  FSStat,
  NodePermissions,
  NodeType,
} from '../../types/filesystem';

export function defaultPermissions(
  isDir: boolean,
  ownerName = 'user',
  groupName = 'user'
): NodePermissions {
  return {
    owner: { read: true, write: true, execute: isDir },
    group: { read: true, write: false, execute: isDir },
    others: { read: true, write: false, execute: isDir },
    ownerName,
    groupName,
  };
}

export function permissionsToModeString(
  perms: NodePermissions,
  type: NodeType
): string {
  const prefix = type === 'directory' ? 'd' : '-';
  const rwx = (p: FilePermissions) =>
    (p.read ? 'r' : '-') + (p.write ? 'w' : '-') + (p.execute ? 'x' : '-');
  return prefix + rwx(perms.owner) + rwx(perms.group) + rwx(perms.others);
}

export function permissionsToOctal(perms: NodePermissions): string {
  const calc = (p: FilePermissions) =>
    (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0);
  return `0${calc(perms.owner)}${calc(perms.group)}${calc(perms.others)}`;
}

export function parseOctalToPermissions(
  octal: string,
  current: NodePermissions
): NodePermissions {
  const clean = octal.replace(/^0+/, '');
  const padded = clean.padStart(3, '0');
  const oVal = parseInt(padded[0], 10);
  const gVal = parseInt(padded[1], 10);
  const otVal = parseInt(padded[2], 10);

  const valToPerm = (val: number): FilePermissions => ({
    read: (val & 4) !== 0,
    write: (val & 2) !== 0,
    execute: (val & 1) !== 0,
  });

  return {
    ...current,
    owner: valToPerm(oVal),
    group: valToPerm(gVal),
    others: valToPerm(otVal),
  };
}

export class VirtualFS {
  private root: DirectoryNode;

  constructor(initialRoot?: DirectoryNode) {
    if (initialRoot) {
      this.root = initialRoot;
    } else {
      this.root = {
        name: '',
        type: 'directory',
        createdAt: Date.now(),
        modifiedAt: Date.now(),
        size: 4096,
        permissions: defaultPermissions(true, 'root', 'root'),
        children: {},
      };
    }
  }

  public getRoot(): DirectoryNode {
    return this.root;
  }

  public normalizePath(path: string, cwd = '/home/user'): string {
    let clean = path.trim();
    if (!clean) return cwd;

    // Handle home tilde expansion
    if (clean === '~') {
      clean = '/home/user';
    } else if (clean.startsWith('~/')) {
      clean = '/home/user/' + clean.slice(2);
    }

    // Handle relative vs absolute
    if (!clean.startsWith('/')) {
      clean = `${cwd === '/' ? '' : cwd}/${clean}`;
    }

    const parts = clean.split('/').filter(Boolean);
    const resolved: string[] = [];

    for (const part of parts) {
      if (part === '.') continue;
      if (part === '..') {
        if (resolved.length > 0) {
          resolved.pop();
        }
      } else {
        resolved.push(part);
      }
    }

    return '/' + resolved.join('/');
  }

  public splitPath(absolutePath: string): { dirPath: string; baseName: string } {
    const parts = absolutePath.split('/').filter(Boolean);
    if (parts.length === 0) {
      return { dirPath: '/', baseName: '' };
    }
    const baseName = parts[parts.length - 1];
    const dirParts = parts.slice(0, -1);
    const dirPath = '/' + dirParts.join('/');
    return { dirPath, baseName };
  }

  public getNode(path: string, cwd = '/home/user'): FSNode | null {
    const normalized = this.normalizePath(path, cwd);
    if (normalized === '/') {
      return this.root;
    }

    const parts = normalized.split('/').filter(Boolean);
    let current: FSNode = this.root;

    for (const part of parts) {
      if (current.type !== 'directory') {
        return null;
      }
      const dirNode = current as DirectoryNode;
      const child: FSNode | undefined = dirNode.children[part];
      if (!child) {
        return null;
      }
      current = child;
    }

    return current;
  }

  public exists(path: string, cwd = '/home/user'): boolean {
    return this.getNode(path, cwd) !== null;
  }

  public isDirectory(path: string, cwd = '/home/user'): boolean {
    const node = this.getNode(path, cwd);
    return node !== null && node.type === 'directory';
  }

  public isFile(path: string, cwd = '/home/user'): boolean {
    const node = this.getNode(path, cwd);
    return node !== null && node.type === 'file';
  }

  public readFile(path: string, cwd = '/home/user'): string {
    const node = this.getNode(path, cwd);
    if (!node) {
      throw new Error(`cat: ${path}: No such file or directory`);
    }
    if (node.type === 'directory') {
      throw new Error(`cat: ${path}: Is a directory`);
    }
    return node.content;
  }

  public writeFile(
    path: string,
    content: string,
    cwd = '/home/user',
    createParents = false
  ): void {
    const normalized = this.normalizePath(path, cwd);
    const { dirPath, baseName } = this.splitPath(normalized);

    if (!baseName) {
      throw new Error(`Cannot write to root directory`);
    }

    let parentNode = this.getNode(dirPath);
    if (!parentNode) {
      if (createParents) {
        this.createDirectory(dirPath, true, cwd);
        parentNode = this.getNode(dirPath);
      } else {
        throw new Error(`Directory ${dirPath} does not exist`);
      }
    }

    if (!parentNode || parentNode.type !== 'directory') {
      throw new Error(`${dirPath} is not a directory`);
    }

    const existing = parentNode.children[baseName];
    const now = Date.now();

    if (existing && existing.type === 'directory') {
      throw new Error(`${baseName} is a directory`);
    }

    const fileNode: FileNode = {
      name: baseName,
      type: 'file',
      content,
      size: new Blob([content]).size || content.length,
      createdAt: existing ? existing.createdAt : now,
      modifiedAt: now,
      permissions: existing ? existing.permissions : defaultPermissions(false, 'user', 'user'),
    };

    parentNode.children[baseName] = fileNode;
    parentNode.modifiedAt = now;
  }

  public appendFile(path: string, content: string, cwd = '/home/user'): void {
    const normalized = this.normalizePath(path, cwd);
    if (this.exists(normalized)) {
      const existing = this.readFile(normalized);
      this.writeFile(normalized, existing + content, cwd);
    } else {
      this.writeFile(normalized, content, cwd);
    }
  }

  public touch(path: string, cwd = '/home/user'): void {
    const normalized = this.normalizePath(path, cwd);
    const node = this.getNode(normalized);
    const now = Date.now();
    if (node) {
      node.modifiedAt = now;
    } else {
      this.writeFile(normalized, '', cwd, false);
    }
  }

  public createDirectory(
    path: string,
    recursive = false,
    cwd = '/home/user'
  ): void {
    const normalized = this.normalizePath(path, cwd);
    if (normalized === '/') return;

    const parts = normalized.split('/').filter(Boolean);
    let current = this.root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const child = current.children[part];

      if (child) {
        if (child.type !== 'directory') {
          throw new Error(`mkdir: cannot create directory '${path}': File exists`);
        }
        if (isLast && !recursive) {
          throw new Error(`mkdir: cannot create directory '${path}': File exists`);
        }
        current = child;
      } else {
        if (!isLast && !recursive) {
          throw new Error(`mkdir: cannot create directory '${path}': No such file or directory`);
        }
        const now = Date.now();
        const newDir: DirectoryNode = {
          name: part,
          type: 'directory',
          size: 4096,
          createdAt: now,
          modifiedAt: now,
          permissions: defaultPermissions(true, 'user', 'user'),
          children: {},
        };
        current.children[part] = newDir;
        current.modifiedAt = now;
        current = newDir;
      }
    }
  }

  public remove(path: string, recursive = false, cwd = '/home/user'): void {
    const normalized = this.normalizePath(path, cwd);
    if (normalized === '/') {
      throw new Error(`rm: cannot remove root directory '/'`);
    }

    const { dirPath, baseName } = this.splitPath(normalized);
    const parent = this.getNode(dirPath);

    if (!parent || parent.type !== 'directory') {
      throw new Error(`rm: cannot remove '${path}': No such file or directory`);
    }

    const target = parent.children[baseName];
    if (!target) {
      throw new Error(`rm: cannot remove '${path}': No such file or directory`);
    }

    if (target.type === 'directory' && !recursive) {
      throw new Error(`rm: cannot remove '${path}': Is a directory`);
    }

    delete parent.children[baseName];
    parent.modifiedAt = Date.now();
  }

  public removeDirectory(path: string, cwd = '/home/user'): void {
    const normalized = this.normalizePath(path, cwd);
    if (normalized === '/') {
      throw new Error(`rmdir: failed to remove '/': Device or resource busy`);
    }

    const node = this.getNode(normalized);
    if (!node) {
      throw new Error(`rmdir: failed to remove '${path}': No such file or directory`);
    }
    if (node.type !== 'directory') {
      throw new Error(`rmdir: failed to remove '${path}': Not a directory`);
    }
    if (Object.keys(node.children).length > 0) {
      throw new Error(`rmdir: failed to remove '${path}': Directory not empty`);
    }

    this.remove(normalized, true);
  }

  public listDirectory(path: string, cwd = '/home/user'): FSNode[] {
    const node = this.getNode(path, cwd);
    if (!node) {
      throw new Error(`ls: cannot access '${path}': No such file or directory`);
    }
    if (node.type !== 'directory') {
      return [node];
    }
    return Object.values(node.children).sort((a, b) => a.name.localeCompare(b.name));
  }

  public copy(
    sourcePath: string,
    destPath: string,
    recursive = false,
    cwd = '/home/user'
  ): void {
    const srcNode = this.getNode(sourcePath, cwd);
    if (!srcNode) {
      throw new Error(`cp: cannot stat '${sourcePath}': No such file or directory`);
    }

    if (srcNode.type === 'directory' && !recursive) {
      throw new Error(`cp: -r not specified; omitting directory '${sourcePath}'`);
    }

    const normDest = this.normalizePath(destPath, cwd);
    const destNode = this.getNode(normDest);

    let targetPath = normDest;
    if (destNode && destNode.type === 'directory') {
      targetPath = `${normDest === '/' ? '' : normDest}/${srcNode.name}`;
    }

    this.deepCopyNode(srcNode, targetPath);
  }

  private deepCopyNode(node: FSNode, destAbsolutePath: string): void {
    const { dirPath, baseName } = this.splitPath(destAbsolutePath);
    const parent = this.getNode(dirPath);
    if (!parent || parent.type !== 'directory') {
      throw new Error(`cp: cannot copy to '${destAbsolutePath}': No such directory`);
    }

    const now = Date.now();
    if (node.type === 'file') {
      parent.children[baseName] = {
        name: baseName,
        type: 'file',
        content: node.content,
        size: node.size,
        createdAt: now,
        modifiedAt: now,
        permissions: JSON.parse(JSON.stringify(node.permissions)),
      };
    } else {
      const newDir: DirectoryNode = {
        name: baseName,
        type: 'directory',
        size: 4096,
        createdAt: now,
        modifiedAt: now,
        permissions: JSON.parse(JSON.stringify(node.permissions)),
        children: {},
      };
      parent.children[baseName] = newDir;
      for (const [childName, childNode] of Object.entries(node.children)) {
        this.deepCopyNode(childNode, `${destAbsolutePath}/${childName}`);
      }
    }
  }

  public move(sourcePath: string, destPath: string, cwd = '/home/user'): void {
    this.copy(sourcePath, destPath, true, cwd);
    this.remove(sourcePath, true, cwd);
  }

  public chmod(path: string, mode: string, cwd = '/home/user'): void {
    const node = this.getNode(path, cwd);
    if (!node) {
      throw new Error(`chmod: cannot access '${path}': No such file or directory`);
    }

    if (/^[0-7]{3,4}$/.test(mode)) {
      node.permissions = parseOctalToPermissions(mode, node.permissions);
      node.modifiedAt = Date.now();
      return;
    }

    // Symbolic mode handling: e.g. +x, u+x, go-w, a+r
    const regex = /^([ugoa]*)([\+\-=])([rwx]+)$/;
    const match = mode.match(regex);
    if (!match) {
      throw new Error(`chmod: invalid mode: '${mode}'`);
    }

    const who = match[1] || 'a';
    const op = match[2];
    const perms = match[3];

    const targets: Array<'owner' | 'group' | 'others'> = [];
    if (who.includes('u') || who === 'a') targets.push('owner');
    if (who.includes('g') || who === 'a') targets.push('group');
    if (who.includes('o') || who === 'a') targets.push('others');

    for (const target of targets) {
      const p = node.permissions[target];
      const hasR = perms.includes('r');
      const hasW = perms.includes('w');
      const hasX = perms.includes('x');

      if (op === '+') {
        if (hasR) p.read = true;
        if (hasW) p.write = true;
        if (hasX) p.execute = true;
      } else if (op === '-') {
        if (hasR) p.read = false;
        if (hasW) p.write = false;
        if (hasX) p.execute = false;
      } else if (op === '=') {
        p.read = hasR;
        p.write = hasW;
        p.execute = hasX;
      }
    }
    node.modifiedAt = Date.now();
  }

  public getStat(path: string, cwd = '/home/user'): FSStat | null {
    const node = this.getNode(path, cwd);
    if (!node) return null;

    return {
      name: node.name || '/',
      type: node.type,
      size: node.size,
      mode: permissionsToModeString(node.permissions, node.type),
      octal: permissionsToOctal(node.permissions),
      owner: node.permissions.ownerName,
      group: node.permissions.groupName,
      modifiedAt: new Date(node.modifiedAt),
    };
  }

  public clone(): VirtualFS {
    const clonedRoot = JSON.parse(JSON.stringify(this.root));
    return new VirtualFS(clonedRoot);
  }
}
