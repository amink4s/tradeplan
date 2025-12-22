import { ClipboardCheck } from 'lucide-react';
import { useBalance } from 'wagmi';
import sdk from '@farcaster/frame-sdk';
import { useEffect, useState } from 'preact/hooks';

export const Header = () => {
  const [farcasterUser, setFarcasterUser] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    // Get Farcaster user context
    const getUserContext = async () => {
      try {
        const context = await sdk.context;
        if (context?.user) {
          setFarcasterUser(context.user);
        }
        // Get wallet address from context
        if (context?.client?.added_wallet_address) {
          setAddress(context.client.added_wallet_address);
        }
      } catch (err) {
        console.error('Failed to get Farcaster context:', err);
      }
    };
    
    getUserContext();
  }, []);

  // Get wallet balance using wagmi
  const { data: balance } = useBalance({
    address: address,
    chainId: 8453, // Base chain
  });

  return (
    <header className="flex justify-between items-center mb-6 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <ClipboardCheck size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">TradePlan</h1>
          {farcasterUser && (
            <div className="flex items-center gap-2 mt-1">
              {farcasterUser.pfpUrl && (
                <img 
                  src={farcasterUser.pfpUrl} 
                  alt="Profile" 
                  className="w-4 h-4 rounded-full"
                />
              )}
              <p className="text-xs text-slate-400">@{farcasterUser.username || 'user'}</p>
            </div>
          )}
        </div>
      </div>
      <div className="text-right">
        {balance && (
          <>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Balance</p>
            <p className="text-sm font-mono text-slate-300">
              {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
            </p>
          </>
        )}
        {!balance && address && (
          <>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Wallet</p>
            <p className="text-[10px] font-mono text-slate-400">{address.substring(0, 6)}...{address.substring(38)}</p>
          </>
        )}
      </div>
    </header>
  );
};
