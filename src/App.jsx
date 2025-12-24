import { useState, useEffect, useContext, useRef } from 'preact/hooks';
import { signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { sdk } from '@farcaster/miniapp-sdk';
import { auth } from './services/firebase';
import { FarcasterProvider } from './providers/FarcasterProvider';
import { FarcasterContext } from './contexts/FarcasterContext';
import { UserProfileBar } from './components/UserProfileBar';
import { Navigation } from './components/Navigation';
import { MintOverlay } from './components/MintOverlay';
import { JournalView } from './views/JournalView';
import { PlanCreator } from './views/PlanCreator';
import { HistoryView } from './views/HistoryView';
import { useTrades } from './hooks/useTrades';
import { useUserProfile } from './hooks/useUserProfile';

const AppContent = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('journal');
  const [isMinting, setIsMinting] = useState(false);
  const [lastSavedTrade, setLastSavedTrade] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const readyCalled = useRef(false);
  
  const { user: farcasterUser } = useContext(FarcasterContext);
  const { trades, saveTrade, markResult, deleteTrade } = useTrades(user, farcasterUser);
  
  // Save/update user profile in Firestore
  useUserProfile(farcasterUser);

  // Auth Logic
  useEffect(() => {
    if (! auth) {
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

  // Call sdk.actions.ready() when the app is ready to display
  useEffect(() => {
    const callReady = async () => {
      // Only call ready once, and only after user is authenticated
      if (user && !readyCalled.current) {
        readyCalled. current = true;
        try {
          await sdk.actions.ready();
          setIsReady(true);
          console.log('Farcaster SDK ready called successfully');
        } catch (err) {
          console.error('Failed to call sdk.actions.ready():', err);
          // Still set ready to true so app doesn't get stuck
          setIsReady(true);
        }
      }
    };
    
    callReady();
  }, [user]);

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
        <UserProfileBar />
        
        {!isMinting && (
          <Navigation currentView={view} onViewChange={setView} />
        )}

        {isMinting && (
          <MintOverlay 
            trade={lastSavedTrade}
            user={farcasterUser}
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