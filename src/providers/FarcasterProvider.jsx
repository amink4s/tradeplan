import { WagmiProvider, createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';
import { FarcasterContext } from '../contexts/FarcasterContext';
import { useFarcasterAuth } from '../hooks/useFarcasterAuth';

// Create wagmi config with Farcaster connector
const config = createConfig({
  chains: [base],
  transports: {
    [base. id]: http(),
  },
  connectors: [farcasterMiniApp()],
});

// Create QueryClient instance
const queryClient = new QueryClient();

const FarcasterWrapper = ({ children }) => {
  const farcasterAuth = useFarcasterAuth();

  return (
    <FarcasterContext.Provider value={farcasterAuth}>
      {children}
    </FarcasterContext.Provider>
  );
};

export const FarcasterProvider = ({ children }) => {
  // Note: sdk.actions.ready() is called in App.jsx after content is ready
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <FarcasterWrapper>
          {children}
        </FarcasterWrapper>
      </QueryClientProvider>
    </WagmiProvider>
  );
};