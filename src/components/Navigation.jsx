import { BookOpen, PlusCircle, History } from 'lucide-react';

export const Navigation = ({ currentView, onViewChange }) => {
  return (
    <div className="flex gap-2 mb-6">
      <button 
        onClick={() => onViewChange('journal')} 
        className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition ${
          currentView === 'journal' 
            ? 'bg-white text-black' 
            : 'bg-slate-900 text-slate-400'
        }`}
      >
        <BookOpen size={16} /> Journal
      </button>
      <button 
        onClick={() => onViewChange('new-plan')} 
        className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition ${
          currentView === 'new-plan' 
            ? 'bg-blue-600 text-white' 
            : 'bg-slate-900 text-slate-400'
        }`}
      >
        <PlusCircle size={16} /> New Plan
      </button>
      <button 
        onClick={() => onViewChange('history')} 
        className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition ${
          currentView === 'history' 
            ? 'bg-white text-black' 
            : 'bg-slate-900 text-slate-400'
        }`}
      >
        <History size={16} /> History
      </button>
    </div>
  );
};
