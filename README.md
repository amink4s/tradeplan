# tradeplan
a farcaster mini app for traders

## Project Structure

This is a modular Vite + Preact application with Farcaster Frame SDK v2 integration.

### Tech Stack
- **Frontend**: Preact (React alternative)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth & Firestore)
- **Blockchain**: Wagmi + Viem for Base chain
- **Farcaster**: Frame SDK v2 with miniapp-wagmi-connector

### Directory Structure
```
/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.jsx       # Shows Farcaster user & wallet balance
│   │   ├── Navigation.jsx   # App navigation
│   │   ├── TradeCard.jsx    # Individual trade display
│   │   └── MintOverlay.jsx  # Commitment certificate view
│   ├── views/              # Page-level components
│   │   ├── JournalView.jsx  # Active trades list
│   │   ├── PlanCreator.jsx  # Create new trade plan
│   │   └── HistoryView.jsx  # Closed trades history
│   ├── hooks/              # Custom React hooks
│   │   └── useTrades.js     # Firestore trades logic
│   ├── services/           # External service integrations
│   │   └── firebase.js      # Firebase initialization
│   ├── providers/          # Context providers
│   │   └── FarcasterProvider.jsx  # Wagmi & Farcaster SDK setup
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
└── package.json            # Dependencies

```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Configure your environment variables:
   - `VITE_FIREBASE_CONFIG`: JSON string with Firebase config
   - `VITE_APP_ID`: Application identifier for Firestore

## Development

Start the development server:
```bash
npm run dev
```

## Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Features

- **Trade Planning**: Create and track trading plans with entry, stop-loss, and take-profit levels
- **Risk Management**: Automatic position size and risk/reward calculations
- **Farcaster Integration**: Display user profile and wallet balance from Farcaster
- **Firebase Backend**: Real-time data sync with Firestore
- **Commitment System**: Lock in trade plans with blockchain commitment (minting feature)
- **Trade History**: Track wins and losses over time

