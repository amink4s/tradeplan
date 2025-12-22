import { useState } from 'preact/hooks';
import { BrainCircuit } from 'lucide-react';

export const PlanCreator = ({ onSave, accountBalance = 10000 }) => {
  const [newTrade, setNewTrade] = useState({
    pair: '',
    direction: 'long',
    entry: '',
    sl: '',
    tp: '',
    riskPercent: '1',
    thesis: '',
    rulesFollowed: false,
    status: 'planned'
  });

  const calculatePositionSize = () => {
    const entry = parseFloat(newTrade.entry);
    const sl = parseFloat(newTrade.sl);
    const risk = (accountBalance * (parseFloat(newTrade.riskPercent) / 100));
    if (!entry || !sl || entry === sl) return 0;
    return (risk / Math.abs(entry - sl)).toFixed(4);
  };

  const calculateRR = () => {
    const entry = parseFloat(newTrade.entry);
    const sl = parseFloat(newTrade.sl);
    const tp = parseFloat(newTrade.tp);
    if (!entry || !sl || !tp) return 0;
    return (Math.abs(tp - entry) / Math.abs(entry - sl)).toFixed(2);
  };

  const handleSave = () => {
    if (!newTrade.pair || !newTrade.entry || !newTrade.sl || !newTrade.rulesFollowed) return;
    
    const tradeToSave = {
      ...newTrade,
      positionSize: calculatePositionSize(),
      rr: calculateRR(),
    };
    
    onSave(tradeToSave);
    
    setNewTrade({
      pair: '', 
      direction: 'long', 
      entry: '', 
      sl: '', 
      tp: '', 
      riskPercent: '1', 
      thesis: '', 
      rulesFollowed: false, 
      status: 'planned'
    });
  };

  return (
    <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
      <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
        <BrainCircuit className="text-blue-500" size={20} /> Define Strategy
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <label className="text-[10px] text-slate-500 uppercase font-bold">Pair</label>
          <input 
            type="text" 
            placeholder="ETH/USDT" 
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm" 
            value={newTrade.pair} 
            onChange={e => setNewTrade({...newTrade, pair: e.target.value.toUpperCase()})} 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-slate-500 uppercase font-bold">Direction</label>
          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button 
              className={`flex-1 py-2 rounded-md text-xs font-bold ${
                newTrade.direction === 'long' 
                  ? 'bg-emerald-500 text-white' 
                  : 'text-slate-500'
              }`} 
              onClick={() => setNewTrade({...newTrade, direction: 'long'})}
            >
              LONG
            </button>
            <button 
              className={`flex-1 py-2 rounded-md text-xs font-bold ${
                newTrade.direction === 'short' 
                  ? 'bg-rose-500 text-white' 
                  : 'text-slate-500'
              }`} 
              onClick={() => setNewTrade({...newTrade, direction: 'short'})}
            >
              SHORT
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {['entry', 'sl', 'tp'].map(field => (
          <div key={field} className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-bold">
              {field === 'sl' ? 'Stop' : field === 'tp' ? 'Target' : field}
            </label>
            <input 
              type="number" 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm font-mono" 
              value={newTrade[field]} 
              onChange={e => setNewTrade({...newTrade, [field]: e.target.value})} 
            />
          </div>
        ))}
      </div>

      <div className="mb-6 p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
        <div className="text-center flex-1">
          <p className="text-[10px] text-slate-500 uppercase">Size</p>
          <p className="text-sm font-mono text-blue-400">{calculatePositionSize()}</p>
        </div>
        <div className="w-px bg-slate-800 mx-4"></div>
        <div className="text-center flex-1">
          <p className="text-[10px] text-slate-500 uppercase">R:R</p>
          <p className="text-sm font-mono text-blue-400">1:{calculateRR()}</p>
        </div>
      </div>

      <textarea 
        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 h-20 text-sm mb-4" 
        placeholder="Thesis: e.g. Weekly resistance flip..." 
        value={newTrade.thesis} 
        onChange={e => setNewTrade({...newTrade, thesis: e.target.value})} 
      />

      <label className="flex items-center gap-3 p-4 bg-blue-500/5 rounded-xl border border-blue-500/20 mb-6 cursor-pointer">
        <input 
          type="checkbox" 
          className="w-4 h-4" 
          checked={newTrade.rulesFollowed} 
          onChange={e => setNewTrade({...newTrade, rulesFollowed: e.target.checked})} 
        />
        <span className="text-xs font-medium text-slate-300">I confirm this follows my rules.</span>
      </label>

      <button 
        disabled={!newTrade.rulesFollowed || !newTrade.pair} 
        onClick={handleSave} 
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white font-bold rounded-xl transition shadow-lg"
      >
        LOCK IN COMMITMENT
      </button>
    </section>
  );
};
