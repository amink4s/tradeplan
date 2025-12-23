import { ShieldCheck, Award, Share2, Loader2 } from 'lucide-react';
import { useState } from 'preact/hooks';

export const MintOverlay = ({ trade, onMint, onSkip }) => {
  const [mintState, setMintState] = useState('idle'); // idle | uploading | minting | complete | error
  const [error, setError] = useState(null);

  const handleMintClick = async () => {
    try {
      setMintState('uploading');
      setError(null);

      // TODO: Step 1 - Generate trade commitment image/metadata
      // This would create an image or JSON metadata for the NFT
      
      // TODO: Step 2 - Upload to IPFS (when configured)
      // Check if IPFS is configured, if not skip this step
      const ipfsConfigured = 
        import.meta.env.VITE_STORJ_ACCESS_GRANT ||
        import.meta.env.VITE_4EVERLAND_API_KEY ||
        import.meta.env.VITE_WEB3_STORAGE_TOKEN;

      let ipfsCID = null;
      if (ipfsConfigured) {
        // import { uploadToIPFS, generateTradeMetadata } from '../services/ipfs';
        // const metadata = generateTradeMetadata(trade);
        // ipfsCID = await uploadToIPFS(metadata);
        console.log('IPFS upload would happen here if configured');
      } else {
        console.warn('IPFS not configured - skipping metadata upload');
      }

      setMintState('minting');

      // TODO: Step 3 - Call NFT contract mint function via wagmi
      // This would use the contract address from VITE_NFT_CONTRACT_ADDRESS
      const contractAddress = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;
      if (!contractAddress) {
        throw new Error('NFT contract address not configured. Set VITE_NFT_CONTRACT_ADDRESS in .env');
      }

      // Simulate minting for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMintState('complete');
      
      // Wait a moment before calling onMint
      setTimeout(() => {
        onMint();
      }, 1500);
    } catch (err) {
      console.error('Mint failed:', err);
      setError(err.message);
      setMintState('error');
    }
  };

  const getMintButtonContent = () => {
    switch (mintState) {
      case 'uploading':
        return (
          <>
            <Loader2 size={18} className="animate-spin" /> UPLOADING METADATA...
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
            <ShieldCheck size={18} /> MINTED!
          </>
        );
      case 'error':
        return 'TRY AGAIN';
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
          {trade?.pair} {trade?.direction.toUpperCase()}
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

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button 
          onClick={handleMintClick} 
          disabled={mintState === 'uploading' || mintState === 'minting' || mintState === 'complete'}
          className={`w-full py-4 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all ${
            mintState === 'error' 
              ? 'bg-red-600 text-white shadow-red-900/20'
              : mintState === 'complete'
              ? 'bg-emerald-600 text-white shadow-emerald-900/20'
              : 'bg-blue-600 text-white shadow-blue-900/20'
          } ${
            (mintState === 'uploading' || mintState === 'minting' || mintState === 'complete')
              ? 'opacity-75 cursor-not-allowed'
              : 'hover:bg-blue-700'
          }`}
        >
          {getMintButtonContent()}
        </button>
        {mintState === 'idle' || mintState === 'error' ? (
          <button 
            onClick={onSkip} 
            className="w-full py-3 bg-transparent text-slate-500 text-sm font-medium hover:text-slate-400"
          >
            Skip for now
          </button>
        ) : null}
      </div>
    </div>
  );
};
