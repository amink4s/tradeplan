import { useEffect } from 'preact/hooks';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

export const useUserProfile = (user) => {
  const appId = import.meta.env.VITE_APP_ID || 'trade-plan-v0';

  useEffect(() => {
    if (!user || !user.fid || !db) return;

    const saveUserProfile = async () => {
      try {
        const userDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', user.fid.toString());
        
        // Check if user already exists
        const userDoc = await getDoc(userDocRef);
        
        const userData = {
          fid: user.fid,
          username: user.username || '',
          displayName: user.displayName || '',
          pfpUrl: user.pfpUrl || '',
          walletAddress: user.walletAddress || '',
          lastSeenAt: serverTimestamp(),
        };

        if (!userDoc.exists()) {
          // First time seeing this user - add createdAt
          userData.createdAt = serverTimestamp();
        }

        await setDoc(userDocRef, userData, { merge: true });
      } catch (err) {
        console.error('Failed to save user profile:', err);
      }
    };

    saveUserProfile();
  }, [user, appId]);
};
