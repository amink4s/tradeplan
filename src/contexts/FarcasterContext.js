import { createContext } from 'preact';

export const FarcasterContext = createContext({
  user: null,
  isLoading: true,
  error: null,
});
