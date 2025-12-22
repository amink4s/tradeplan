import { ShieldCheck, Award, Share2 } from 'lucide-react';

export const MintOverlay = ({ trade, onMint, onSkip }) => {
  return (
    <div className="bg-slate-900 border-2 border-blue-500/50 p-8 rounded-3xl text-center animate-in zoom-in duration-300">
      <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShieldCheck size={32} />
      </div>
      <h2 className="text-2xl font-bold mb-2">Plan Locked In</h2>
      <p className="text-slate-400 text-sm mb-6">
        Commit this plan to the blockchain to prevent yourself from breaking your rules.
      </p>
      
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 mb-6 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Award size={80} />
        </div>
        <p className="text-blue-500 font-mono text-xs mb-1 uppercase tracking-tighter">
          Commitment Certificate
        </p>
        <h3 className="text-xl font-bold text-white mb-2">
          {trade?.pair} {trade?.direction.toUpperCase()}
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="text-slate-500 uppercase">Risk</div>
          <div className="text-slate-300">{trade?.riskPercent}%</div>
          <div className="text-slate-500 uppercase">Entry</div>
          <div className="text-slate-300">{trade?.entry}</div>
          <div className="text-slate-500 uppercase">Target</div>
          <div className="text-emerald-400">{trade?.tp}</div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button 
          onClick={onMint} 
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
        >
          <Share2 size={18} /> MINT COMMITMENT
        </button>
        <button 
          onClick={onSkip} 
          className="w-full py-3 bg-transparent text-slate-500 text-sm font-medium"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};
