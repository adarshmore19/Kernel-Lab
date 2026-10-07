export type NodeType = 'file' | 'directory';

export interface FilePermissions {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export interface NodePermissions {
  owner: FilePermissions;
  group: FilePermissions;
  others: FilePermissions;
  ownerName: string;
  groupName: string;
}

export interface BaseNode {
  name: string;
  type: NodeType;
  permissions: NodePermissions;
  createdAt: number;
  modifiedAt: number;
  size: number;
}

export interface FileNode extends BaseNode {
  type: 'file';
  content: string;
}

export interface DirectoryNode extends BaseNode {
  type: 'directory';
  children: Record<string, FSNode>;
}

export type FSNode = FileNode | DirectoryNode;

export interface PathInfo {
  absolutePath: string;
  dirName: string;
  baseName: string;
}

export interface FSStat {
  name: string;
  type: NodeType;
  size: number;
  mode: string; // e.g. "-rwxr-xr-x" or "drwxr-xr-x"
  octal: string; // e.g. "0755"
  owner: string;
  group: string;
  modifiedAt: Date;
}
