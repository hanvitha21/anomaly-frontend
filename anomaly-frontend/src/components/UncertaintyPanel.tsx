import React from 'react';
import { AlertTriangle, HelpCircle, ShieldAlert } from 'lucide-react';

interface Props {
  missingVariables: string[];
  unverifiedAssumptions: string[];
  contradictions: string[];
}

export const UncertaintyPanel: React.FC<Props> = ({
  missingVariables,
  unverifiedAssumptions,
  contradictions,
}) => {
  return (
    <footer className="h-44 border-t border-zinc-800 bg-zinc-950 p-3 font-mono flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
            Epistemic Gaps & Uncertainty Register
          </span>
        </div>
        <span className="text-[11px] text-zinc-500">STATUS: DELIBERATION UNDERDETERMINED</span>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
        <div className="bg-amber-950/20 border border-amber-900/40 rounded p-2.5">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
            <HelpCircle size={14} />
            <span>MISSING DATA ({missingVariables.length})</span>
          </div>
          <ul className="text-zinc-400 space-y-1 text-[11px]">
            {missingVariables.map((item, idx) => (
              <li key={idx} className="truncate">• {item}</li>
            ))}
          </ul>
        </div>

        <div className="bg-purple-950/20 border border-purple-900/40 rounded p-2.5">
          <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-1">
            <AlertTriangle size={14} />
            <span>UNVERIFIED ASSUMPTIONS ({unverifiedAssumptions.length})</span>
          </div>
          <ul className="text-zinc-400 space-y-1 text-[11px]">
            {unverifiedAssumptions.map((item, idx) => (
              <li key={idx} className="truncate">• {item}</li>
            ))}
          </ul>
        </div>

        <div className="bg-red-950/20 border border-red-900/40 rounded p-2.5">
          <div className="flex items-center gap-1.5 text-red-400 font-semibold mb-1">
            <ShieldAlert size={14} />
            <span>CONTRADICTIONS IDENTIFIED ({contradictions.length})</span>
          </div>
          <ul className="text-zinc-400 space-y-1 text-[11px]">
            {contradictions.map((item, idx) => (
              <li key={idx} className="truncate text-red-300">• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};