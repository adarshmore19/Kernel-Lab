import React, { useState } from 'react';
import {
  FolderTree,
  FileText,
  HardDrive,
  Link,
  ArrowRight,
  Database,
  Search,
  CheckCircle2,
} from 'lucide-react';

// ==========================================
// 1. DIRECTORY STRUCTURES EXPLORER
// ==========================================
export const DirectoryStructuresVisualizer: React.FC = () => {
  const [structure, setStructure] = useState<'single' | 'two' | 'tree' | 'acyclic'>('tree');
  const [selectedPath] = useState<string>('/home/alice/project/main.c');

  return (
    <div className="bg-white border border-[#dfd7c6] rounded-xl p-5 space-y-4 shadow-xs font-mono">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#dfd7c6]/60">
        <div>
          <h4 className="font-bold text-sm text-[#2c2825]">
            Directory Structure Hierarchy & Path Resolution
          </h4>
          <p className="text-xs text-[#78716c] font-sans">
            Explore Single-Level, Two-Level, Tree-Structured, and Acyclic-Graph (Links) directory models.
          </p>
        </div>

        {/* Directory Structure Switcher - Flat */}
        <div className="flex items-center gap-1 text-xs">
          {(['single', 'two', 'tree', 'acyclic'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStructure(s)}
              className={`px-2.5 py-1 rounded capitalize transition-all ${
                structure === s
                  ? 'bg-[#2d5a88] text-white font-bold'
                  : 'text-[#78716c] hover:bg-stone-100'
              }`}
            >
              {s === 'single'
                ? 'Single-Level'
                : s === 'two'
                ? 'Two-Level'
                : s === 'tree'
                ? 'Tree Structure'
                : 'Acyclic Graph'}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Canvas - Open, No Nested Beige Card Box */}
      <div className="space-y-4 text-xs">
        {structure === 'single' && (
          <div className="space-y-3">
            <span className="font-bold text-[#b45309] block">
              Single-Level Directory (Flat namespace — Major Collision Risk):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {['main.c', 'data.csv', 'notes.txt', 'test.py', 'backup.tar', 'error.log'].map((f) => (
                <div
                  key={f}
                  className="p-2 border border-[#dfd7c6] rounded-md flex items-center gap-1.5 bg-stone-50 text-[#2c2825]"
                >
                  <FileText className="w-3.5 h-3.5 text-[#2d5a88] shrink-0" />
                  <span className="truncate">{f}</span>
                </div>
              ))}
            </div>
            <div className="border-l-2 border-amber-500 pl-3 py-1 text-xs text-[#57534e] font-sans">
              <strong>Limitation:</strong> All users share one global namespace. If User A creates <code className="text-[#b45309]">notes.txt</code>, User B is prevented from creating any file with the same name.
            </div>
          </div>
        )}

        {structure === 'two' && (
          <div className="space-y-3">
            <span className="font-bold text-[#2d5a88] block">
              Two-Level Directory (Master File Directory → Isolated User File Directories):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-l-2 border-[#1e5327] pl-3 space-y-1.5">
                <span className="font-bold text-[#1e5327] block">MFD Node: /user/alice/</span>
                <div className="space-y-1 text-[#57534e]">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#1e5327]" />
                    <span>notes.txt (Isolated)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#1e5327]" />
                    <span>project.c</span>
                  </div>
                </div>
              </div>

              <div className="border-l-2 border-[#2d5a88] pl-3 space-y-1.5">
                <span className="font-bold text-[#2d5a88] block">MFD Node: /user/bob/</span>
                <div className="space-y-1 text-[#57534e]">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#2d5a88]" />
                    <span>notes.txt (No Collision with Alice!)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#2d5a88]" />
                    <span>database.db</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {structure === 'tree' && (
          <div className="space-y-3">
            <span className="font-bold text-[#1e5327] block">
              Tree-Structured Directory (Arbitrary Nested Subdirectories & Canonical Paths):
            </span>
            <div className="space-y-1.5 py-1">
              <div className="font-bold text-[#2c2825]">/ (Root)</div>
              <div className="pl-4 border-l border-[#dfd7c6] space-y-1.5">
                <div className="text-[#57534e]">📁 home/</div>
                <div className="pl-4 border-l border-[#dfd7c6] space-y-1.5">
                  <div className="text-[#57534e]">📁 alice/</div>
                  <div className="pl-4 border-l border-[#dfd7c6] space-y-1.5">
                    <div className="text-[#57534e]">📁 project/</div>
                    <div className="pl-4 border-l-2 border-emerald-500 font-bold text-emerald-800">
                      📄 main.c (Resolved Absolute Path)
                    </div>
                  </div>
                </div>
                <div className="text-[#57534e]">📁 etc/</div>
                <div className="pl-4 border-l border-[#dfd7c6] text-[#57534e]">📄 passwd</div>
              </div>
            </div>
            <div className="border-l-2 border-[#2d5a88] pl-3 py-1 text-xs text-[#1e4569]">
              Resolved Path: <strong>{selectedPath}</strong> (Full access isolation & hierarchical tree depth)
            </div>
          </div>
        )}

        {structure === 'acyclic' && (
          <div className="space-y-3">
            <span className="font-bold text-[#6b21a8] block">
              Acyclic-Graph Directory (Shared Files via Hard Links & Symbolic Soft Links):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-l-2 border-emerald-500 pl-3 space-y-1">
                <span className="font-bold text-[#1e5327] block">Hard Link (Direct Inode Sharing)</span>
                <p className="text-[11px] text-[#57534e] leading-relaxed font-sans">
                  <code className="text-[#1e5327]">/alice/lib.c</code> and <code className="text-[#1e5327]">/bob/lib.c</code> point to <strong>Inode #4012</strong>. Reference counter incremented; file payload persists until counter reaches 0.
                </p>
              </div>
              <div className="border-l-2 border-[#2d5a88] pl-3 space-y-1">
                <span className="font-bold text-[#2d5a88] block">Symbolic Link (File Path Alias)</span>
                <p className="text-[11px] text-[#57534e] leading-relaxed font-sans">
                  <code className="text-[#2d5a88]">/usr/bin/python → /usr/bin/python3.11</code>. Small pointer file storing text path. If original is deleted, link becomes a dangling reference.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. FILE ALLOCATION METHODS (CONTIGUOUS, LINKED, INODES)
// ==========================================
export const FileAllocationVisualizer: React.FC = () => {
  const [method, setMethod] = useState<'contiguous' | 'linked' | 'indexed'>('indexed');

  return (
    <div className="bg-white border border-[#dfd7c6] rounded-xl p-5 space-y-4 shadow-xs font-mono">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#dfd7c6]/60">
        <div>
          <h4 className="font-bold text-sm text-[#2c2825]">
            Disk File Allocation Methods & UNIX Inodes
          </h4>
          <p className="text-xs text-[#78716c] font-sans">
            Compare Contiguous Allocation, Linked List Allocation, and UNIX Inode Multi-Level Indexing.
          </p>
        </div>

        {/* Method Switcher - Flat */}
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setMethod('contiguous')}
            className={`px-2.5 py-1 rounded transition-all ${
              method === 'contiguous'
                ? 'bg-[#2d5a88] text-white font-bold'
                : 'text-[#78716c] hover:bg-stone-100'
            }`}
          >
            Contiguous
          </button>
          <button
            onClick={() => setMethod('linked')}
            className={`px-2.5 py-1 rounded transition-all ${
              method === 'linked'
                ? 'bg-[#2d5a88] text-white font-bold'
                : 'text-[#78716c] hover:bg-stone-100'
            }`}
          >
            Linked
          </button>
          <button
            onClick={() => setMethod('indexed')}
            className={`px-2.5 py-1 rounded transition-all ${
              method === 'indexed'
                ? 'bg-[#2d5a88] text-white font-bold'
                : 'text-[#78716c] hover:bg-stone-100'
            }`}
          >
            Indexed (UNIX Inode)
          </button>
        </div>
      </div>

      {/* Visual Disk Allocation Canvas - Flat, Open Layout */}
      <div className="space-y-4 text-xs">
        {method === 'contiguous' && (
          <div className="space-y-3">
            <span className="font-bold text-[#b45309] block">
              Contiguous Allocation: File starts at Block 2, Length = 4 blocks:
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {Array.from({ length: 8 }).map((_, i) => {
                const isAllocated = i >= 2 && i <= 5;
                return (
                  <div
                    key={i}
                    className={`p-2.5 rounded-lg border text-center font-bold transition-all ${
                      isAllocated
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-stone-50 text-stone-400 border-stone-200'
                    }`}
                  >
                    Block {i}
                    <span className="text-[10px] block font-normal mt-0.5">
                      {isAllocated ? 'File Data' : 'Free Sector'}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="border-l-2 border-amber-500 pl-3 py-1 text-xs text-[#57534e] font-sans">
              <strong>Trade-off:</strong> Highest sequential & random access throughput (minimal seek time). However, causes severe external disk fragmentation and files cannot grow dynamically without relocation.
            </div>
          </div>
        )}

        {method === 'linked' && (
          <div className="space-y-3">
            <span className="font-bold text-[#1e5327] block">
              Linked Allocation: Blocks chained via embedded pointers [1] → [4] → [7]:
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {Array.from({ length: 8 }).map((_, i) => {
                const isPart = i === 1 || i === 4 || i === 7;
                const nextPtr = i === 1 ? '→ Ptr: 4' : i === 4 ? '→ Ptr: 7' : i === 7 ? '→ NULL' : 'Free';
                return (
                  <div
                    key={i}
                    className={`p-2.5 rounded-lg border text-center font-bold transition-all ${
                      isPart
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-stone-50 text-stone-400 border-stone-200'
                    }`}
                  >
                    Block {i}
                    <span className="text-[10px] block font-normal mt-0.5">{nextPtr}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-l-2 border-emerald-600 pl-3 py-1 text-xs text-[#57534e] font-sans">
              <strong>Trade-off:</strong> Zero external fragmentation; files grow effortlessly. However, random access is slow (must traverse <code className="text-[#1e5327]">O(N)</code> link chain) and pointer corruption corrupts subsequent file sectors.
            </div>
          </div>
        )}

        {method === 'indexed' && (
          <div className="space-y-3">
            <span className="font-bold text-[#2d5a88] block">
              Indexed Allocation (UNIX Inode Multi-Level Architecture):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Inode Box */}
              <div className="border-l-2 border-[#2d5a88] pl-3 space-y-1.5">
                <span className="font-bold text-[#2d5a88] block">INODE #1024 DESCRIPTOR</span>
                <div className="text-[11px] space-y-1 text-[#57534e]">
                  <div>Direct Pointer 0 → Block 3</div>
                  <div>Direct Pointer 1 → Block 5</div>
                  <div>Direct Pointer 2 → Block 6</div>
                  <div className="text-amber-700 font-semibold">Single Indirect Ptr → Block 8</div>
                  <div className="text-purple-700 font-semibold">Double Indirect Ptr → Block 12</div>
                </div>
              </div>

              {/* Data Blocks */}
              <div className="md:col-span-2 space-y-1.5">
                <span className="font-bold text-[#1e5327] block">Physical Disk Blocks Allocated:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-md font-bold text-emerald-900">
                    Block 3 (Data)
                  </div>
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-md font-bold text-emerald-900">
                    Block 5 (Data)
                  </div>
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-md font-bold text-emerald-900">
                    Block 6 (Data)
                  </div>
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded-md font-bold text-amber-900">
                    Block 8 (Index)
                  </div>
                </div>
              </div>
            </div>
            <div className="border-l-2 border-[#2d5a88] pl-3 py-1 text-xs text-[#57534e] font-sans">
              <strong>UNIX Standard:</strong> Fast direct random access to any block via index lookup. Efficient for small files, while 2-level and 3-level indirect pointers support multi-terabyte files without external fragmentation.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
