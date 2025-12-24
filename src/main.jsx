import { render } from 'preact';
import { sdk } from '@farcaster/miniapp-sdk';
import App from './App';
import './index.css';

// Call ready immediately before rendering
sdk.actions.ready().catch(err => {
  console.warn('SDK ready failed (might not be in Farcaster):', err);
});

render(<App />, document.getElementById('app'));