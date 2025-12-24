import { useState } from 'preact/hooks';
import { ShieldCheck, Award, Share2, Loader2, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { sdk } from '@farcaster/miniapp-sdk';
import { uploadTradeMetadata, isIPFSConfigured } from '../services/ipfs';

export const MintOverlay = ({ trade, user, onMint, onSkip }) => {
  const [mintState, setMintState] = useState('idle'); // idle, uploading, minting, complete, error
  const [error, setError] = useState(null);
  const [ipfsData, setIpfsData] = useState(null);
  const [isSharing, setIsSharing] = useState(false);

  const handleMint = async () => {
    setError(null);
    
    // Check if IPFS is configured
    if (!isIPFSConfigured()) {
      setError('IPFS storage not configured. Please set up 4EVERLAND credentials.');
      setMintState('error');
      return;
    }

    try {
      // Step 1: Upload metadata to IPFS
      setMintState('uploading');
      const result = await uploadTradeMetadata(trade, user);
      setIpfsData(result);
      console.log('Metadata uploaded to IPFS:', result);

      // Step 2: Mint NFT (placeholder - needs contract integration)
      setMintState('minting');
      
      // TODO: Add actual minting logic here using wagmi
      // const { writeContract } = useWriteContract();
      // await writeContract({
      //   address: NFT_CONTRACT_ADDRESS,
      //   abi: NFT_ABI,
      //   functionName: 'mint',
      //   args: [result.url],
      // });

      // For now, simulate success after upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMintState('complete');
      
      // Call parent callback after short delay
      setTimeout(() => {
        onMint(result);
      }, 2000);

    } catch (err) {
      console.error('Minting failed:', err);
      setError(err.message || 'Failed to mint commitment');
      setMintState('error');
    }
  };

  const handleShare = async () => {
    if (!trade) return;
    
    setIsSharing(true);
    try {
      // Build the share URL with trade data as query params
      const baseUrl = 'https://tradeplan-mu.vercel.app';
      const shareParams = new URLSearchParams({
        pair: trade.pair || '',
        direction: trade.direction || 'long',
        entry: trade.entry || '0',
        tp: trade.tp || '0',
        sl: trade.sl || '0',
        rr: trade.rr || '0',
        risk: trade.riskPercent || '1',
        username: user?.username || 'Trader',
      });
      
      const shareUrl = `${baseUrl}/api/share/trade?${shareParams.toString()}`;
      
      // Open Farcaster compose with the share URL as embed
      await sdk.actions.composeCast({
        text: `📊 I just committed to a ${trade.pair} ${trade.direction.toUpperCase()} trade!\n\nEntry: ${trade.entry}\nTarget: ${trade.tp}\nR:R: 1:${trade.rr}\n\nPlan your trades with TradePlan 👇`,
        embeds: [shareUrl],
      });
    } catch (err) {
      console.error('Share failed:', err);
      setError('Failed to open share dialog');
    } finally {
      setIsSharing(false);
    }
  };

  const getButtonContent = () => {
    switch (mintState) {
      case 'uploading':
        return (
          <>
            <Loader2 size={18} className="animate-spin" /> UPLOADING TO IPFS... 
          </>
        );
      case 'minting': 
        return (
          <>
            <Loader2 size={18} className="animate-spin" /> MINTING...
          </>
        );
      case 'complete':
        return (
          <>
            <CheckCircle size={18} /> MINTED SUCCESSFULLY!
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle size={18} /> TRY AGAIN
          </>
        );
      default:
        return (
          <>
            <Share2 size={18} /> MINT COMMITMENT
          </>
        );
    }
  };

  return (
    <div className="bg-slate-900 border-2 border-blue-500/50 p-8 rounded-3xl text-center animate-in zoom-in duration-300">
      <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShieldCheck size={32} />
      </div>
      <h2 className="text-2xl font-bold mb-2">Plan Locked In</h2>
      <p className="text-slate-400 text-sm mb-6">
        Commit this plan to the blockchain to prevent yourself from breaking your rules. 
      </p>
      
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 mb-6 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Award size={80} />
        </div>
        <p className="text-blue-500 font-mono text-xs mb-1 uppercase tracking-tighter">
          Commitment Certificate
        </p>
        <h3 className="text-xl font-bold text-white mb-2">
          {trade?. pair} {trade?. direction.toUpperCase()}
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="text-slate-500 uppercase">Risk</div>
          <div className="text-slate-300">{trade?.riskPercent}%</div>
          <div className="text-slate-500 uppercase">Entry</div>
          <div className="text-slate-300">{trade?.entry}</div>
          <div className="text-slate-500 uppercase">Target</div>
          <div className="text-emerald-400">{trade?.tp}</div>
        </div>
      </div>

      {/* IPFS Status */}
      {ipfsData && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 mb-4 text-left">
          <p className="text-emerald-400 text-xs font-mono">
            ✓ Stored on IPFS:  {ipfsData. cid. substring(0, 20)}...
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 mb-4 text-left">
          <p className="text-rose-400 text-xs">{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <button 
            onClick={handleMint} 
            disabled={mintState === 'uploading' || mintState === 'minting' || mintState === 'complete'}
            className={`flex-1 py-4 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition
              ${mintState === 'complete' 
                ? 'bg-emerald-600 text-white' 
                : mintState === 'error'
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white shadow-blue-900/20'
              }`}
          >
            {getButtonContent()}
          </button>
          <button 
            onClick={handleShare}
            disabled={isSharing || mintState === 'uploading' || mintState === 'minting'}
            className="flex-1 py-4 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white"
          >
            {isSharing ? (
              <>
                <Loader2 size={18} className="animate-spin" /> SHARING...
              </>
            ) : (
              <>
                <Send size={18} /> SHARE
              </>
            )}
          </button>
        </div>
        <button 
          onClick={onSkip} 
          disabled={mintState === 'uploading' || mintState === 'minting'}
          className="w-full py-3 bg-transparent text-slate-500 text-sm font-medium disabled:opacity-30"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};