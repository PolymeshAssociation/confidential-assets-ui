# Polymesh Confidential Assets UI - MVP

A frontend-only application for experiencing new confidential asset features on Polymesh blockchain.

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **UI Library**: Material-UI (MUI) with light/dark theme support
- **Blockchain**: Polymesh SDK + Polkadot.js API
- **Wallet Integration**: Polymesh Wallet & Polkadot.js extension (prioritized)
- **GraphQL**: Apollo Client for SubQuery middleware
- **Routing**: React Router v7
- **Cryptography**: WASM-based prover (stub implementation ready)

## Project Structure

```
src/
├── components/       # Reusable React components
├── context/          # React Context providers
│   ├── ThemeContext.tsx
│   ├── NotificationContext.tsx
│   ├── PolymeshContext.tsx
│   └── ConfidentialKeyContext.tsx
├── hooks/            # Custom React hooks
├── pages/            # Page components
│   ├── HomePage.tsx
│   └── KeyManagementPage.tsx
├── services/         # Business logic services
│   ├── apollo.ts     # Apollo Client configuration
│   ├── prover/       # WASM prover integration (stub)
│   └── storage/      # localStorage key management
├── styles/           # Theme configuration
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
VITE_NETWORK=testnet
VITE_POLYMESH_NODE_URL=wss://testnet-rpc.polymesh.network
VITE_SUBQUERY_URL=https://squid.subsquid.io/polymesh-testnet/graphql
```

## Development

### Prerequisites

- Node.js 22.12+ or 20.19+
- pnpm (recommended package manager)

### Install Dependencies

```bash
pnpm install
```

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

## Features

### Current (MVP)

- ✅ Wallet connection (Polymesh Wallet, Polkadot.js)
- ✅ Confidential key generation with password encryption
- ✅ Multiple confidential key management with aliases
- ✅ Key unlock/lock functionality (auto-locks on page refresh)
- ✅ Local encrypted key storage (browser localStorage)
- ✅ Light/dark theme toggle
- ✅ Material-UI components
- ✅ Apollo Client for SubQuery integration
- ✅ WASM prover stub implementation ready for integration

### WASM Prover Integration (Ready)

The application includes a complete TypeScript interface for the WASM prover:

```typescript
interface WasmProofManager {
  initWasm(): Promise<void>;
  generateKey(password: string): Promise<EncryptedKeyBlob>;
  unlockKey(password: string, encryptedBlob: EncryptedKeyBlob): Promise<void>;
  lockKey(): Promise<void>;
  getPublicKey(): Promise<string>;
  generateProof(inputData: Uint8Array): Promise<Uint8Array>;
  verifyProof(proof: Uint8Array, publicInput: Uint8Array): Promise<boolean>;
}
```

The stub implementation in `src/services/prover/index.ts` can be replaced with the real Rust/WASM module when available.

### Key Storage

Confidential keys are stored encrypted in browser localStorage:

- Multiple keys supported with user-defined aliases
- Keys are encrypted with user password (handled by WASM prover)
- Unlocked keys exist only in WASM memory, never exposed to JavaScript
- Auto-lock on page refresh/close for security

## Architecture

### Context Providers Hierarchy

```
ThemeProvider (MUI theme + mode switching)
  └─ NotificationProvider (Snackbar notifications)
      └─ PolymeshProvider (SDK + Apollo Client)
          └─ ConfidentialKeyProvider (WASM prover + key management)
              └─ BrowserRouter
                  └─ App Routes
```

### State Management

Uses React Context API for global state:

- `ThemeContext`: Light/dark mode
- `NotificationContext`: User notifications
- `PolymeshContext`: SDK connection, wallet accounts
- `ConfidentialKeyContext`: Confidential key lifecycle

## Wallet Support

Prioritized wallets (others supported but lower priority):

- Polymesh Wallet
- Polkadot.js extension

## Security Notes

⚠️ **This is an MVP for development/testing**:

- Confidential keys stored in browser localStorage (encrypted)
- Private keys never leave WASM memory when unlocked
- Keys auto-lock on page refresh/close
- Production use requires additional security measures

## Future Enhancements

- Key export/import functionality
- Multi-signature support
- Asset creation and management
- Confidential transfers UI
- Transaction history
- Portfolio view
- Enhanced error handling and recovery
- Key backup to secure storage

---

## Vite + React + TypeScript Notes

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
