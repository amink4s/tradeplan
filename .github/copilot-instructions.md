# TradePlan - GitHub Copilot Instructions

## Project Overview

TradePlan is a Farcaster mini app for traders to plan and journal their trades. It's a single-page React application built with Firebase for authentication and data storage.

## Tech Stack

- **Frontend**: React (JSX)
- **Backend**: Firebase (Firestore, Authentication)
- **UI Components**: Lucide React icons
- **Styling**: Tailwind CSS utility classes
- **Build System**: None specified (JSX file suggests direct usage or external build pipeline)

## Code Style & Conventions

### General Guidelines

1. **File Structure**: The entire application is in a single `tradeplan.jsx` file
2. **Component Style**: Functional React components with hooks
3. **Naming Conventions**:
   - Use camelCase for variables, functions, and state: `accountBalance`, `newTrade`, `handleSavePlan`
   - Use PascalCase for React components: `App`
   - Use UPPERCASE for constants from globals: `__firebase_config`, `__app_id`, `__initial_auth_token`
   - Use uppercase for direction strings in UI: `'LONG'`, `'SHORT'`

4. **State Management**: Use React hooks (`useState`, `useEffect`) for all state management
5. **Async Operations**: Use async/await for Firebase operations with try/catch error handling

### Firebase Patterns

1. **Firestore Data Structure**:
   - Path pattern: `artifacts/{appId}/public/data/trades/{tradeId}`
   - Always use the `public` collection path for shared/mintable plans
   - Document IDs use timestamps: `Date.now().toString()`

2. **Authentication**:
   - Support both custom token authentication and anonymous authentication
   - Check for `__initial_auth_token` global before falling back to anonymous
   - Use `onAuthStateChanged` listener for auth state management

3. **Data Operations**:
   - Use `setDoc` for creating new trades with explicit document IDs
   - Use `updateDoc` for modifying existing trades
   - Use `deleteDoc` for removing trades
   - Use `onSnapshot` for real-time data fetching with proper unsubscribe cleanup
   - Always sort data in-memory after fetching (e.g., by timestamp descending)

### React Patterns

1. **Hooks**:
   - Initialize auth and data fetching in separate `useEffect` hooks
   - Always include cleanup functions (`return () => unsubscribe()`) for subscriptions
   - Check for null/undefined state (e.g., `if (!user) return`) before proceeding

2. **State Updates**:
   - Use spread operator for updating nested state: `{...newTrade, pair: value}`
   - Reset form state after successful save operations

3. **Conditional Rendering**:
   - Early return pattern for loading states
   - Use ternary operators for simple conditionals in JSX
   - Use `&&` for conditional rendering of optional elements

### UI/UX Patterns

1. **Tailwind Classes**:
   - Use dark theme with slate color palette (bg-slate-950, text-slate-100)
   - Consistent spacing: p-4, p-6, p-8 for padding
   - Rounded corners: rounded-xl, rounded-2xl, rounded-3xl
   - Border styling: border border-slate-800

2. **Button States**:
   - Include disabled states with `disabled:opacity-30`
   - Use color coding: blue for primary, emerald for long/win, rose for short/loss
   - Include hover states: `hover:bg-blue-500`

3. **Form Validation**:
   - Disable submit buttons until required fields are filled
   - Use checkbox for rule confirmation before allowing trade submission
   - Show real-time calculations (position size, risk/reward ratio)

### Data Model

Trade object structure:
```javascript
{
  pair: string,           // e.g., "ETH/USDT"
  direction: 'long' | 'short',
  entry: string,          // numeric string
  sl: string,             // stop loss
  tp: string,             // take profit
  riskPercent: string,    // e.g., "1"
  thesis: string,         // trade rationale
  rulesFollowed: boolean,
  status: 'planned' | 'closed',
  userId: string,         // from Firebase auth
  timestamp: number,      // Date.now()
  positionSize: string,   // calculated
  rr: string,             // risk/reward ratio, calculated
  result?: 'win' | 'loss', // for closed trades
  closedAt?: number       // timestamp for closed trades
}
```

## Key Features & Workflows

1. **Trade Planning**: Users create trade plans with entry, stop loss, and take profit levels
2. **Risk Management**: Automatic position size calculation based on account balance and risk percentage
3. **Commitment System**: "Mint commitment" flow to lock in trade plans
4. **Trade Journal**: Active trades view with win/loss marking
5. **Trade History**: Historical record of closed trades

## Development Guidelines

1. **Error Handling**: Always wrap Firebase operations in try/catch blocks and log errors to console
2. **Comments**: Include inline comments for major sections (e.g., "// 1. Auth Logic (Rule 3)")
3. **Calculations**: 
   - Use `parseFloat()` for numeric conversions
   - Use `.toFixed()` for formatting decimal places
   - Check for division by zero or invalid inputs before calculating

4. **User Experience**:
   - Show loading states (e.g., "Initializing Session...")
   - Provide empty states with helpful messages
   - Use animations for success states (e.g., "animate-in zoom-in duration-300")

## Testing Considerations

- Test Firebase authentication flows (both custom token and anonymous)
- Verify Firestore CRUD operations work correctly
- Ensure calculations are accurate (position size, R:R ratio)
- Test edge cases (empty states, missing data, invalid inputs)
- Validate that real-time updates work properly with onSnapshot

## Global Variables

The application expects these global variables to be defined externally:
- `__firebase_config`: JSON string with Firebase configuration
- `__app_id`: Application identifier (defaults to 'trade-plan-v0')
- `__initial_auth_token`: Optional custom authentication token

## Important Notes

- This is a single-file React application designed to run as a Farcaster mini app
- Data is stored in a public Firestore collection for sharing/minting capabilities
- The app uses client-side Firebase SDK directly (no backend API layer)
- All styling is done inline with Tailwind utility classes
