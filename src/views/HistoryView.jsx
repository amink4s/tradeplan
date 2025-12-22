export const HistoryView = ({ trades }) => {
  const closedTrades = trades.filter(t => t.status === 'closed');

  return (
    <div className="space-y-3">
      {closedTrades.map(trade => (
        <div 
          key={trade.id} 
          className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex items-center justify-between"
        >
          <div>
            <p className="font-bold text-sm">
              {trade.pair} 
              <span className={`text-[10px] ml-1 uppercase ${
                trade.result === 'win' ? 'text-emerald-500' : 'text-rose-500'
              }`}>
                {trade.result}
              </span>
            </p>
            <p className="text-[10px] text-slate-600">
              {new Date(trade.closedAt || trade.timestamp).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono text-blue-500">1:{trade.rr} RR</p>
            <p className="text-[10px] text-slate-500 uppercase">Followed Plan</p>
          </div>
        </div>
      ))}
      {closedTrades.length === 0 && (
        <div className="text-center py-20 text-slate-600">
          No trading history yet.
        </div>
      )}
    </div>
  );
};
