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

  const modeString = `-${roleToString(user)}${roleToString(group)}${roleToString(others)}`;

  const setPreset = (u: number, g: number, o: number) => {
    setUser({ read: (u & 4) !== 0, write: (u & 2) !== 0, execute: (u & 1) !== 0 });
    setGroup({ read: (g & 4) !== 0, write: (g & 2) !== 0, execute: (g & 1) !== 0 });
    setOthers({ read: (o & 4) !== 0, write: (o & 2) !== 0, execute: (o & 1) !== 0 });
  };

  return (
    <div className="bg-[#0f1422] border border-[#1e293b] rounded-xl p-5 shadow-lg my-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#1e293b]">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-slate-100 text-sm tracking-wide">
            Interactive POSIX Permission Calculator
          </h3>
        </div>
        <button
          onClick={() => setPreset(7, 5, 5)}
          className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset (755)
        </button>
      </div>

      {/* Mode String Display */}
      <div className="mt-4 p-4 bg-[#090d16] border border-[#1e2738] rounded-lg text-center flex flex-col items-center">
        <span className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-mono">
          Symbolic Mode Representation
        </span>
        <div className="font-mono text-3xl font-bold tracking-widest text-slate-100 flex items-center justify-center gap-2">
          <span className="text-slate-500 font-normal">-</span>
          <span className="text-cyan-400 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-800/50">
            {roleToString(user)}
          </span>
          <span className="text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-800/50">
            {roleToString(group)}
          </span>
          <span className="text-amber-400 bg-amber-950/40 px-2 py-1 rounded border border-amber-800/50">
            {roleToString(others)}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-6 font-mono text-sm">
          <span className="text-slate-300">
            Octal: <strong className="text-cyan-300">{fullOctal}</strong>
          </span>
          <span className="text-slate-300">
            chmod: <code className="text-emerald-300 bg-slate-900 px-2 py-0.5 rounded">chmod {userOctal}{groupOctal}{othersOctal} filename</code>
          </span>
        </div>
      </div>

      {/* Preset Pills */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-mono">Common Presets:</span>
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
            className="px-2.5 py-1 bg-[#172033] hover:bg-cyan-950 hover:border-cyan-700/50 border border-[#1e293b] rounded text-slate-300 transition-colors font-mono"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Interactive Toggle Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {/* Owner */}
        <div className="p-4 rounded-lg bg-[#141b2d] border border-cyan-900/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-cyan-300">User (Owner)</span>
            <span className="font-mono text-xs text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded">
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
                    ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-200'
                    : 'bg-[#090d16] border border-[#1e293b] text-slate-500 hover:text-slate-300'
                }`}
              >
                <span>{perm.label}</span>
                {perm.val ? <Check className="w-4 h-4 text-cyan-400" /> : <X className="w-4 h-4 text-slate-600" />}
              </button>
            ))}
          </div>
        </div>

        {/* Group */}
        <div className="p-4 rounded-lg bg-[#141b2d] border border-emerald-900/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-emerald-300">Group</span>
            <span className="font-mono text-xs text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded">
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
                    ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-200'
                    : 'bg-[#090d16] border border-[#1e293b] text-slate-500 hover:text-slate-300'
                }`}
              >
                <span>{perm.label}</span>
                {perm.val ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-slate-600" />}
              </button>
            ))}
          </div>
        </div>

        {/* Others */}
        <div className="p-4 rounded-lg bg-[#141b2d] border border-amber-900/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-amber-300">Others (World)</span>
            <span className="font-mono text-xs text-amber-400 font-bold bg-amber-950 px-2 py-0.5 rounded">
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
                    ? 'bg-amber-950/60 border border-amber-500/50 text-amber-200'
                    : 'bg-[#090d16] border border-[#1e293b] text-slate-500 hover:text-slate-300'
                }`}
              >
                <span>{perm.label}</span>
                {perm.val ? <Check className="w-4 h-4 text-amber-400" /> : <X className="w-4 h-4 text-slate-600" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-cyan-950/20 border border-cyan-900/30 rounded-lg flex items-start gap-2 text-xs text-cyan-200/90">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <span>
          Toggle bits above to observe how symbolic notation maps directly to binary powers (4, 2, 1) and octal chmod parameters.
        </span>
      </div>
    </div>
  );
};
