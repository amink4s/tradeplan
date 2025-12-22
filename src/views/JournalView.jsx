import { TradeCard } from '../components/TradeCard';

export const JournalView = ({ trades, onMarkResult, onDelete }) => {
  const activeTrades = trades.filter(t => t.status === 'planned');

  return (
    <div className="space-y-4">
      {activeTrades.map(trade => (
        <TradeCard 
          key={trade.id} 
          trade={trade} 
          onMarkResult={onMarkResult}
          onDelete={onDelete}
        />
      ))}
      {activeTrades.length === 0 && (
        <div className="text-center py-20 text-slate-600 border-2 border-dashed border-slate-900 rounded-3xl">
          No active commitments.
        </div>
      )}
    </div>
  );
};
