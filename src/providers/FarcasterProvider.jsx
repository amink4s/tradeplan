import { useEffect } from 'preact/hooks';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { farcasterMiniAppConnector } from '@farcaster/miniapp-wagmi-connector';
import sdk from '@farcaster/frame-sdk';

// Create wagmi config with Farcaster connector
const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [farcasterMiniAppConnector()],
});

// Create QueryClient instance
const queryClient = new QueryClient();

export const FarcasterProvider = ({ children }) => {
  useEffect(() => {
    // Initialize Farcaster SDK
    sdk.actions.ready();
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};
