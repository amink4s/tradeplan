import { useState, useEffect } from 'preact/hooks';
import { signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';
import { FarcasterProvider } from './providers/FarcasterProvider';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { MintOverlay } from './components/MintOverlay';
import { JournalView } from './views/JournalView';
import { PlanCreator } from './views/PlanCreator';
import { HistoryView } from './views/HistoryView';
import { useTrades } from './hooks/useTrades';

const AppContent = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('journal');
  const [isMinting, setIsMinting] = useState(false);
  const [lastSavedTrade, setLastSavedTrade] = useState(null);
  
  const { trades, saveTrade, markResult, deleteTrade } = useTrades(user);

  // Auth Logic
  useEffect(() => {
    if (!auth) {
      console.error('Firebase is not configured. Please set VITE_FIREBASE_CONFIG environment variable.');
      return;
    }

    const initAuth = async () => {
      try {
        // Check for custom token in global scope (if available)
        const customToken = typeof window !== 'undefined' && window.__initial_auth_token;
        if (customToken) {
          await signInWithCustomToken(auth, customToken);
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

  const handleSavePlan = async (tradeData) => {
    const savedTrade = await saveTrade(tradeData);
    if (savedTrade) {
      setLastSavedTrade(savedTrade);
      setIsMinting(true);
    }
  };

  const handleMint = () => {
    // Placeholder for actual minting logic
    setIsMinting(false);
    setView('journal');
  };

  const handleSkipMint = () => {
    setIsMinting(false);
    setView('journal');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500 font-mono">
        Initializing Session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        <Header />
        
        {!isMinting && (
          <Navigation currentView={view} onViewChange={setView} />
        )}

        {isMinting && (
          <MintOverlay 
            trade={lastSavedTrade}
            onMint={handleMint}
            onSkip={handleSkipMint}
          />
        )}

        {!isMinting && (
          <main>
            {view === 'new-plan' && (
              <PlanCreator onSave={handleSavePlan} />
            )}

            {view === 'journal' && (
              <JournalView 
                trades={trades}
                onMarkResult={markResult}
                onDelete={deleteTrade}
              />
            )}

            {view === 'history' && (
              <HistoryView trades={trades} />
            )}
          </main>
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <FarcasterProvider>
      <AppContent />
    </FarcasterProvider>
  );
};

export default App;
