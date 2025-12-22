import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  query, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  ClipboardCheck, 
  BookOpen, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  History,
  Trash2,
  BrainCircuit,
  Share2,
  ShieldCheck,
  Award
} from 'lucide-react';

// Firebase configuration from environment
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'trade-plan-v0';

const App = () => {
  const [user, setUser] = useState(null);
  const [trades, setTrades] = useState([]);
  const [view, setView] = useState('journal');
  const [accountBalance, setAccountBalance] = useState(10000);
  const [isMinting, setIsMinting] = useState(false);
  const [lastSavedTrade, setLastSavedTrade] = useState(null);
  
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

  // 1. Auth Logic (Rule 3)
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth failed", err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // 2. Data Fetching (Rule 1 & 2)
  useEffect(() => {
    if (!user) return;

    // We use the public path as suggested for shared/mintable plans
    const tradesCol = collection(db, 'artifacts', appId, 'public', 'data', 'trades');
    
    const unsubscribe = onSnapshot(tradesCol, 
      (snapshot) => {
        const tradeData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sorting in memory (Rule 2)
        setTrades(tradeData.sort((a, b) => b.timestamp - a.timestamp));
      },
      (error) => console.error("Firestore error:", error)
    );

    return () => unsubscribe();
  }, [user]);

  // Calculations
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

  const handleSavePlan = async () => {
    if (!user || !newTrade.pair || !newTrade.entry || !newTrade.sl || !newTrade.rulesFollowed) return;

    const tradeId = Date.now().toString();
    const tradeToSave = {
      ...newTrade,
      userId: user.uid,
      timestamp: Date.now(),
      positionSize: calculatePositionSize(),
      rr: calculateRR(),
      status: 'planned'
    };

    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'trades', tradeId), tradeToSave);
      setLastSavedTrade({ ...tradeToSave, id: tradeId });
      setIsMinting(true); // Trigger the "Commitment" view
      setNewTrade({
        pair: '', direction: 'long', entry: '', sl: '', tp: '', 
        riskPercent: '1', thesis: '', rulesFollowed: false, status: 'planned'
      });
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const markResult = async (id, result) => {
    if (!user) return;
    const tradeRef = doc(db, 'artifacts', appId, 'public', 'data', 'trades', id);
    await updateDoc(tradeRef, { 
      status: 'closed', 
      result,
      closedAt: Date.now()
    });
  };

  const deleteTrade = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'trades', id));
  };

  const activeTrades = trades.filter(t => t.status === 'planned');
  const closedTrades = trades.filter(t => t.status === 'closed');

  if (!user) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500 font-mono">Initializing Session...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-6 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <ClipboardCheck size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">TradePlan</h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">User ID</p>
            <p className="text-[10px] font-mono text-slate-400">{user.uid.substring(0, 8)}...</p>
          </div>
        </header>

        {/* Navigation */}
        {!isMinting && (
          <div className="flex gap-2 mb-6">
            <button onClick={() => setView('journal')} className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition ${view === 'journal' ? 'bg-white text-black' : 'bg-slate-900 text-slate-400'}`}>
              <BookOpen size={16} /> Journal
            </button>
            <button onClick={() => setView('new-plan')} className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition ${view === 'new-plan' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'}`}>
              <PlusCircle size={16} /> New Plan
            </button>
            <button onClick={() => setView('history')} className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition ${view === 'history' ? 'bg-white text-black' : 'bg-slate-900 text-slate-400'}`}>
              <History size={16} /> History
            </button>
          </div>
        )}

        {/* Minting Overlay / Success State */}
        {isMinting && (
          <div className="bg-slate-900 border-2 border-blue-500/50 p-8 rounded-3xl text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Plan Locked In</h2>
            <p className="text-slate-400 text-sm mb-6">Commit this plan to the blockchain to prevent yourself from breaking your rules.</p>
            
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 mb-6 text-left relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10"><Award size={80} /></div>
               <p className="text-blue-500 font-mono text-xs mb-1 uppercase tracking-tighter">Commitment Certificate</p>
               <h3 className="text-xl font-bold text-white mb-2">{lastSavedTrade?.pair} {lastSavedTrade?.direction.toUpperCase()}</h3>
               <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="text-slate-500 uppercase">Risk</div>
                  <div className="text-slate-300">{lastSavedTrade?.riskPercent}%</div>
                  <div className="text-slate-500 uppercase">Entry</div>
                  <div className="text-slate-300">{lastSavedTrade?.entry}</div>
                  <div className="text-slate-500 uppercase">Target</div>
                  <div className="text-emerald-400">{lastSavedTrade?.tp}</div>
               </div>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={() => setIsMinting(false)} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                <Share2 size={18} /> MINT COMMITMENT
              </button>
              <button onClick={() => { setIsMinting(false); setView('journal'); }} className="w-full py-3 bg-transparent text-slate-500 text-sm font-medium">
                Skip for now
              </button>
            </div>
          </div>
        )}

        {/* Standard Views */}
        {!isMinting && (
          <main>
            {view === 'new-plan' && (
              <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <BrainCircuit className="text-blue-500" size={20} /> Define Strategy
                </h2>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase font-bold">Pair</label>
                    <input type="text" placeholder="ETH/USDT" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm" value={newTrade.pair} onChange={e => setNewTrade({...newTrade, pair: e.target.value.toUpperCase()})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase font-bold">Direction</label>
                    <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                      <button className={`flex-1 py-2 rounded-md text-xs font-bold ${newTrade.direction === 'long' ? 'bg-emerald-500 text-white' : 'text-slate-500'}`} onClick={() => setNewTrade({...newTrade, direction: 'long'})}>LONG</button>
                      <button className={`flex-1 py-2 rounded-md text-xs font-bold ${newTrade.direction === 'short' ? 'bg-rose-500 text-white' : 'text-slate-500'}`} onClick={() => setNewTrade({...newTrade, direction: 'short'})}>SHORT</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {['entry', 'sl', 'tp'].map(field => (
                    <div key={field} className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-bold">{field === 'sl' ? 'Stop' : field === 'tp' ? 'Target' : field}</label>
                      <input type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm font-mono" value={newTrade[field]} onChange={e => setNewTrade({...newTrade, [field]: e.target.value})} />
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

                <textarea className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 h-20 text-sm mb-4" placeholder="Thesis: e.g. Weekly resistance flip..." value={newTrade.thesis} onChange={e => setNewTrade({...newTrade, thesis: e.target.value})} />

                <label className="flex items-center gap-3 p-4 bg-blue-500/5 rounded-xl border border-blue-500/20 mb-6 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" checked={newTrade.rulesFollowed} onChange={e => setNewTrade({...newTrade, rulesFollowed: e.target.checked})} />
                  <span className="text-xs font-medium text-slate-300">I confirm this follows my rules.</span>
                </label>

                <button disabled={!newTrade.rulesFollowed || !newTrade.pair} onClick={handleSavePlan} className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white font-bold rounded-xl transition shadow-lg">
                  LOCK IN COMMITMENT
                </button>
              </section>
            )}

            {view === 'journal' && (
              <div className="space-y-4">
                {activeTrades.map(trade => (
                  <div key={trade.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${trade.direction === 'long' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>{trade.direction.toUpperCase()}</span>
                        <span className="font-bold">{trade.pair}</span>
                      </div>
                      <button onClick={() => deleteTrade(trade.id)} className="text-slate-600 hover:text-rose-500"><Trash2 size={14} /></button>
                    </div>
                    <div className="p-4 grid grid-cols-3 gap-2 text-center text-xs font-mono border-b border-slate-800/50">
                      <div><p className="text-[10px] text-slate-600 uppercase mb-1">Entry</p>{trade.entry}</div>
                      <div><p className="text-[10px] text-slate-600 uppercase mb-1 text-rose-500">Stop</p>{trade.sl}</div>
                      <div><p className="text-[10px] text-slate-600 uppercase mb-1 text-emerald-500">Target</p>{trade.tp}</div>
                    </div>
                    <div className="p-4 bg-slate-950/50">
                      <div className="flex gap-2">
                        <button onClick={() => markResult(trade.id, 'win')} className="flex-1 py-2 bg-emerald-600/10 text-emerald-500 rounded-lg text-xs font-bold border border-emerald-500/20">WIN</button>
                        <button onClick={() => markResult(trade.id, 'loss')} className="flex-1 py-2 bg-rose-600/10 text-rose-500 rounded-lg text-xs font-bold border border-rose-500/20">LOSS</button>
                      </div>
                    </div>
                  </div>
                ))}
                {activeTrades.length === 0 && <div className="text-center py-20 text-slate-600 border-2 border-dashed border-slate-900 rounded-3xl">No active commitments.</div>}
              </div>
            )}

            {view === 'history' && (
              <div className="space-y-3">
                {closedTrades.map(trade => (
                  <div key={trade.id} className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm">{trade.pair} <span className={`text-[10px] ml-1 uppercase ${trade.result === 'win' ? 'text-emerald-500' : 'text-rose-500'}`}>{trade.result}</span></p>
                      <p className="text-[10px] text-slate-600">{new Date(trade.closedAt || trade.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono text-blue-500">1:{trade.rr} RR</p>
                      <p className="text-[10px] text-slate-500 uppercase">Followed Plan</p>
                    </div>
                  </div>
                ))}
                {closedTrades.length === 0 && <div className="text-center py-20 text-slate-600">No trading history yet.</div>}
              </div>
            )}
          </main>
        )}

      </div>
    </div>
  );
};

export default App;