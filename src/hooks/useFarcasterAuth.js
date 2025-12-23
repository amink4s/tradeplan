import { sdk } from '@farcaster/miniapp-sdk';
import { useState, useEffect } from 'preact/hooks';

export const useFarcasterAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const authenticate = async () => {
      try {
        // Get context first
        const context = await sdk.context;
        
        // Try QuickAuth for JWT
        let token = null;
        try {
          const authResult = await sdk.experimental.quickAuth();
          token = authResult?.token;
        } catch (authErr) {
          console.warn('QuickAuth not available:', authErr);
        }

        if (context?.user) {
          setUser({
            fid: context.user.fid,
            username: context.user.username,
            displayName: context.user.displayName,
            pfpUrl: context.user.pfpUrl,
            walletAddress: context.client?.added_wallet_address || null,
            token,
          });
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    authenticate();
  }, []);

  return { user, isLoading, error };
};
