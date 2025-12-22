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

export const useTrades = (user) => {
  const [trades, setTrades] = useState([]);
  const appId = import.meta.env.VITE_APP_ID || 'trade-plan-v0';

  useEffect(() => {
    if (!user) return;

    const tradesCol = collection(db, 'artifacts', appId, 'public', 'data', 'trades');
    
    const unsubscribe = onSnapshot(
      tradesCol, 
      (snapshot) => {
        const tradeData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTrades(tradeData.sort((a, b) => b.timestamp - a.timestamp));
      },
      (error) => console.error("Firestore error:", error)
    );

    return () => unsubscribe();
  }, [user, appId]);

  const saveTrade = async (tradeData) => {
    if (!user) return null;

    const tradeId = Date.now().toString();
    const tradeToSave = {
      ...tradeData,
      userId: user.uid,
      timestamp: Date.now(),
      status: 'planned'
    };

    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'trades', tradeId), tradeToSave);
      return { ...tradeToSave, id: tradeId };
    } catch (err) {
      console.error("Save failed", err);
      return null;
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

  return {
    trades,
    saveTrade,
    markResult,
    deleteTrade
  };
};
