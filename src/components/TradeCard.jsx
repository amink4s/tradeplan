import { Trash2 } from 'lucide-react';

export const TradeCard = ({ trade, onMarkResult, onDelete }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
            trade.direction === 'long' 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : 'bg-rose-500/20 text-rose-400'
          }`}>
            {trade.direction.toUpperCase()}
          </span>
          <span className="font-bold">{trade.pair}</span>
        </div>
        <button 
          onClick={() => onDelete(trade.id)} 
          className="text-slate-600 hover:text-rose-500"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="p-4 grid grid-cols-3 gap-2 text-center text-xs font-mono border-b border-slate-800/50">
        <div>
          <p className="text-[10px] text-slate-600 uppercase mb-1">Entry</p>
          {trade.entry}
        </div>
        <div>
          <p className="text-[10px] text-slate-600 uppercase mb-1 text-rose-500">Stop</p>
          {trade.sl}
        </div>
        <div>
          <p className="text-[10px] text-slate-600 uppercase mb-1 text-emerald-500">Target</p>
          {trade.tp}
        </div>
      </div>
      <div className="p-4 bg-slate-950/50">
        <div className="flex gap-2">
          <button 
            onClick={() => onMarkResult(trade.id, 'win')} 
            className="flex-1 py-2 bg-emerald-600/10 text-emerald-500 rounded-lg text-xs font-bold border border-emerald-500/20"
          >
            WIN
          </button>
          <button 
            onClick={() => onMarkResult(trade.id, 'loss')} 
            className="flex-1 py-2 bg-rose-600/10 text-rose-500 rounded-lg text-xs font-bold border border-rose-500/20"
          >
            LOSS
          </button>
        </div>
      </div>
    </div>
  );
};
