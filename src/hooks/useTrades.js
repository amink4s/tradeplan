import { useState, useEffect } from 'preact/hooks';
import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { getTradesCollectionPath, getTradeDocPath } from '../utils/firestore';

export const useTrades = (user, farcasterUser = null) => {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Use user-specific trades collection path
    const tradesCol = collection(db, ...getTradesCollectionPath(user.uid));
    
    const unsubscribe = onSnapshot(
      tradesCol, 
      (snapshot) => {
        const tradeData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTrades(tradeData.sort((a, b) => b.timestamp - a.timestamp));
      },
      (error) => console.error("Firestore error:", error)
    );

    return () => unsubscribe();
  }, [user]);

  const saveTrade = async (tradeData) => {
    if (!user) return null;

    const tradeId = Date.now().toString();
    const tradeToSave = {
      ...tradeData,
      userId: user.uid,
      timestamp: Date.now(),
      status: 'planned'
    };

    // Add Farcaster user context if available
    if (farcasterUser) {
      tradeToSave.fid = farcasterUser.fid;
      tradeToSave.username = farcasterUser.username;
      tradeToSave.walletAddress = farcasterUser.walletAddress;
    }

    try {
      await setDoc(doc(db, ...getTradeDocPath(user.uid, tradeId)), tradeToSave);
      return { ...tradeToSave, id: tradeId };
    } catch (err) {
      console.error("Save failed", err);
      return null;
    }
  };

  const markResult = async (id, result) => {
    if (!user) return;
    const tradeRef = doc(db, ...getTradeDocPath(user.uid, id));
    await updateDoc(tradeRef, { 
      status: 'closed', 
      result,
      closedAt: Date.now()
    });
  };

  const deleteTrade = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, ...getTradeDocPath(user.uid, id)));
  };

  return {
    trades,
    saveTrade,
    markResult,
    deleteTrade
  };
};
