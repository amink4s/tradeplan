import { useEffect } from 'preact/hooks';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getUserDocPath } from '../utils/firestore';

export const useUserProfile = (user) => {
  useEffect(() => {
    if (!user || !user.fid || !db) return;

    const saveUserProfile = async () => {
      try {
        const userDocRef = doc(db, ...getUserDocPath(user.fid));
        
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
  }, [user]);
};
