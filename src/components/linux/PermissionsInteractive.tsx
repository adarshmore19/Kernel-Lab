import React, { useState } from 'react';
import { Shield, Info, Check, X, RotateCcw } from 'lucide-react';

interface PermRole {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export const PermissionsInteractive: React.FC = () => {
  const [user, setUser] = useState<PermRole>({ read: true, write: true, execute: true });
  const [group, setGroup] = useState<PermRole>({ read: true, write: false, execute: true });
  const [others, setOthers] = useState<PermRole>({ read: true, write: false, execute: false });

  const calcOctalDigit = (p: PermRole) =>
    (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0);

  const userOctal = calcOctalDigit(user);
  const groupOctal = calcOctalDigit(group);
  const othersOctal = calcOctalDigit(others);
  const fullOctal = `0${userOctal}${groupOctal}${othersOctal}`;

  const roleToString = (p: PermRole) =>
    (p.read ? 'r' : '-') + (p.write ? 'w' : '-') + (p.execute ? 'x' : '-');

  const setPreset = (u: number, g: number, o: number) => {
    setUser({ read: (u & 4) !== 0, write: (u & 2) !== 0, execute: (u & 1) !== 0 });
    setGroup({ read: (g & 4) !== 0, write: (g & 2) !== 0, execute: (g & 1) !== 0 });
    setOthers({ read: (o & 4) !== 0, write: (o & 2) !== 0, execute: (o & 1) !== 0 });
  };

  return (
    <div className="bg-[#fdfbf6] border border-[#dfd7c6] rounded-xl p-5 shadow-xs my-6 font-sans">
      <div className="flex items-center justify-between pb-4 border-b border-[#dfd7c6]">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-[#2d5a88]" />
          <h3 className="font-semibold text-[#2c2825] text-sm tracking-wide">
            Interactive POSIX Permission Calculator
          </h3>
        </div>
        <button
          onClick={() => setPreset(7, 5, 5)}
          className="text-xs text-[#78716c] hover:text-[#2d5a88] flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset (755)
        </button>
      </div>

      {/* Mode String Display */}
      <div className="mt-4 p-4 bg-[#f4f0e5] border border-[#dfd7c6] rounded-lg text-center flex flex-col items-center">
        <span className="text-xs text-[#78716c] uppercase tracking-wider mb-1 font-mono">
          Symbolic Mode Representation
        </span>
        <div className="font-mono text-3xl font-bold tracking-widest text-[#2c2825] flex items-center justify-center gap-2">
          <span className="text-[#a8a29e] font-normal">-</span>
          <span className="text-[#1e4569] bg-[#ebf2f8] px-2 py-1 rounded border border-[#c8d9e8]">
            {roleToString(user)}
          </span>
          <span className="text-[#1e5327] bg-[#edf5ed] px-2 py-1 rounded border border-[#cbe0cc]">
            {roleToString(group)}
          </span>
          <span className="text-[#7d4e08] bg-[#fbf3e4] px-2 py-1 rounded border border-[#ecd6b2]">
            {roleToString(others)}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-6 font-mono text-xs sm:text-sm">
          <span className="text-[#2c2825]">
            Octal: <strong className="text-[#2d5a88]">{fullOctal}</strong>
          </span>
          <span className="text-[#2c2825]">
            chmod: <code className="text-[#1e5327] bg-[#fdfbf6] px-2 py-0.5 rounded border border-[#dfd7c6]">chmod {userOctal}{groupOctal}{othersOctal} filename</code>
          </span>
        </div>
      </div>

      {/* Preset Pills */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[#78716c] font-mono">Common Presets:</span>
        {[
          { name: '755 (Exec Script)', u: 7, g: 5, o: 5 },
          { name: '644 (Normal File)', u: 6, g: 4, o: 4 },
          { name: '600 (Private Key)', u: 6, g: 0, o: 0 },
          { name: '700 (Private Dir)', u: 7, g: 0, o: 0 },
          { name: '777 (Full Access)', u: 7, g: 7, o: 7 },
        ].map((preset) => (
          <button
            key={preset.name}
            onClick={() => setPreset(preset.u, preset.g, preset.o)}
            className="px-2.5 py-1 bg-[#eee8db] hover:bg-[#ebf2f8] hover:border-[#c8d9e8] border border-[#dfd7c6] rounded text-[#2c2825] transition-colors font-mono"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Interactive Toggle Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 font-mono">
        {/* Owner */}
        <div className="p-4 rounded-lg bg-[#f4f0e5] border border-[#dfd7c6]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[#2c2825] font-sans">User (Owner)</span>
            <span className="font-mono text-xs text-[#1e4569] font-bold bg-[#ebf2f8] border border-[#c8d9e8] px-2 py-0.5 rounded">
              Value: {userOctal}
            </span>
          </div>
          <div className="space-y-2">
            {[
              { key: 'read', label: 'Read (r = 4)', val: user.read },
              { key: 'write', label: 'Write (w = 2)', val: user.write },
              { key: 'execute', label: 'Execute (x = 1)', val: user.execute },
            ].map((perm) => (
              <button
                key={perm.key}
                onClick={() => setUser((prev) => ({ ...prev, [perm.key]: !prev[perm.key as keyof PermRole] }))}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-mono transition-all ${
                  perm.val
                    ? 'bg-[#ebf2f8] border border-[#c8d9e8] text-[#1e4569] font-medium shadow-2xs'
                    : 'bg-[#fdfbf6] border border-[#dfd7c6] text-[#a8a29e] hover:text-[#57534e]'
                }`}
              >
                <span>{perm.label}</span>
                {perm.val ? <Check className="w-4 h-4 text-[#2d5a88]" /> : <X className="w-4 h-4 text-[#a8a29e]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Group */}
        <div className="p-4 rounded-lg bg-[#f4f0e5] border border-[#dfd7c6]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[#2c2825] font-sans">Group</span>
            <span className="font-mono text-xs text-[#1e5327] font-bold bg-[#edf5ed] border border-[#cbe0cc] px-2 py-0.5 rounded">
              Value: {groupOctal}
            </span>
          </div>
          <div className="space-y-2">
            {[
              { key: 'read', label: 'Read (r = 4)', val: group.read },
              { key: 'write', label: 'Write (w = 2)', val: group.write },
              { key: 'execute', label: 'Execute (x = 1)', val: group.execute },
            ].map((perm) => (
              <button
                key={perm.key}
                onClick={() => setGroup((prev) => ({ ...prev, [perm.key]: !prev[perm.key as keyof PermRole] }))}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-mono transition-all ${
                  perm.val
                    ? 'bg-[#edf5ed] border border-[#cbe0cc] text-[#1e5327] font-medium shadow-2xs'
                    : 'bg-[#fdfbf6] border border-[#dfd7c6] text-[#a8a29e] hover:text-[#57534e]'
                }`}
              >
                <span>{perm.label}</span>
                {perm.val ? <Check className="w-4 h-4 text-[#1e5327]" /> : <X className="w-4 h-4 text-[#a8a29e]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Others */}
        <div className="p-4 rounded-lg bg-[#f4f0e5] border border-[#dfd7c6]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[#2c2825] font-sans">Others (World)</span>
            <span className="font-mono text-xs text-[#7d4e08] font-bold bg-[#fbf3e4] border border-[#ecd6b2] px-2 py-0.5 rounded">
              Value: {othersOctal}
            </span>
          </div>
          <div className="space-y-2">
            {[
              { key: 'read', label: 'Read (r = 4)', val: others.read },
              { key: 'write', label: 'Write (w = 2)', val: others.write },
              { key: 'execute', label: 'Execute (x = 1)', val: others.execute },
            ].map((perm) => (
              <button
                key={perm.key}
                onClick={() => setOthers((prev) => ({ ...prev, [perm.key]: !prev[perm.key as keyof PermRole] }))}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-mono transition-all ${
                  perm.val
                    ? 'bg-[#fbf3e4] border border-[#ecd6b2] text-[#7d4e08] font-medium shadow-2xs'
                    : 'bg-[#fdfbf6] border border-[#dfd7c6] text-[#a8a29e] hover:text-[#57534e]'
                }`}
              >
                <span>{perm.label}</span>
                {perm.val ? <Check className="w-4 h-4 text-[#b45309]" /> : <X className="w-4 h-4 text-[#a8a29e]" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-[#ebf2f8]/70 border border-[#c8d9e8] rounded-lg flex items-start gap-2 text-xs text-[#1e4569] font-sans">
        <Info className="w-4 h-4 text-[#2d5a88] shrink-0 mt-0.5" />
        <span>
          Toggle bits above to observe how symbolic notation maps directly to binary powers (4, 2, 1) and octal chmod parameters.
        </span>
      </div>
    </div>
  );
};
