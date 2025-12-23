import { useBalance } from 'wagmi';
import { useContext } from 'preact/hooks';
import { FarcasterContext } from '../contexts/FarcasterContext';
import { BASE_CHAIN_ID } from '../constants';

export const UserProfileBar = () => {
  const { user: farcasterUser } = useContext(FarcasterContext);

  // Get wallet balance using wagmi
  const { data: balance } = useBalance({
    address: farcasterUser?.walletAddress,
    chainId: BASE_CHAIN_ID,
  });

  return (
    <header className="flex justify-between items-center mb-6 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
      <div className="flex items-center gap-3">
        {farcasterUser?.pfpUrl && (
          <img 
            src={farcasterUser.pfpUrl} 
            alt="Profile" 
            className="w-8 h-8 rounded-full"
          />
        )}
        <div>
          <p className="text-sm font-medium text-slate-200">
            @{farcasterUser?.username || 'user'}
          </p>
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
        {!balance && farcasterUser?.walletAddress && (
          <>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Wallet</p>
            <p className="text-[10px] font-mono text-slate-400">
              {farcasterUser.walletAddress.substring(0, 6)}...{farcasterUser.walletAddress.slice(-4)}
            </p>
          </>
        )}
      </div>
    </header>
  );
};
