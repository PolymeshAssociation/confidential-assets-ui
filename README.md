# Polymesh Confidential Assets UI

A frontend application for managing **confidential assets** on the Polymesh blockchain. This application enables users to create, manage, and transfer confidential assets using zero-knowledge proofs for privacy-preserving transactions.

## Features

- **Wallet Integration**: Connect via Polymesh Wallet other Polkadot compatible wallet extensions
- **Identity Management**: DID creation and testnet onboarding
- **Confidential Account Keys**: Generate, import, export, and manage encrypted confidential account keys
- **On-Chain Registration**: Register confidential accounts and register for assets on the blockchain
- **Asset Operations**: Create confidential assets with metadata, mediators, and auditors
- **Minting**: Mint tokens to registered confidential accounts
- **Privacy-Preserving Transfers**: Multi-leg settlement instructions with sender, receiver, and mediator affirmations
- **Zero-Knowledge Proofs**: All sensitive operations generate ZK proofs via WASM cryptography in browser

> 📖 For detailed workflow diagrams and sequence charts, see [Workflow Documentation](docs/WORKFLOWS.md)

---

## Tech Stack

| Category             | Technology                                              |
| -------------------- | ------------------------------------------------------- |
| **Framework**        | React 19 + TypeScript + Vite 7                          |
| **UI Library**       | Mantine v8 with light/dark theme support                |
| **Blockchain**       | Polymesh SDK v29 + Polkadot.js API                      |
| **Wallet**           | Polymesh Browser Extension Signing Manager              |
| **GraphQL**          | Apollo Client v4 for SubQuery middleware                |
| **Routing**          | React Router v7                                         |
| **Cryptography**     | Rust/WASM-based prover (`@polymesh/polymesh-dart-wasm`) |
| **State Management** | React Context API                                       |

---

## Project Structure

```
src/
├── components/           # Reusable React components
│   ├── CreateAssetModal/ # Multi-step asset creation wizard
│   ├── settlement/       # Settlement-related modals and components
│   └── ...               # Other UI components
├── context/              # React Context providers
│   ├── asset/            # Asset state management
│   ├── confidential-key/ # Confidential key lifecycle
│   ├── modal/            # Modal state management
│   ├── notification/     # Notification system
│   ├── polymesh/         # SDK connection, wallet accounts
│   ├── settlement/       # Settlement state management
│   ├── theme/            # Light/dark theme
│   └── transaction/      # Transaction submission
├── hooks/                # Custom React hooks
├── pages/                # Page components
│   ├── HomePage.tsx      # Dashboard with onboarding
│   ├── KeyManagementPage.tsx     # Confidential account management
│   ├── AssetManagementPage.tsx   # Asset creation and viewing
│   └── SettlementPage.tsx        # Transfer settlements
├── services/             # Business logic services
│   ├── confidential/     # Core confidential operations
│   │   ├── keyManager.ts       # WASM key management
│   │   ├── registerAccount.ts  # Account registration
│   │   ├── createAsset.ts      # Asset creation
│   │   ├── registerAsset.ts    # Asset registration
│   │   ├── mintAsset.ts        # Token minting
│   │   └── settlement/         # Settlement services
│   ├── storage/          # localStorage key management
│   └── onboarding.ts     # DID and test token provisioning
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

---

## Getting Started

### Prerequisites

- Node.js 22.12+ or 20.19+
- pnpm (recommended package manager)
- A Polymesh-compatible wallet (Polymesh Wallet or Polkadot.js extension)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd confidential-assets-ui

# Install dependencies
pnpm install

# Copy environment configuration
cp .env.example .env
```

### Development

```bash
# Start development server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

---

## User Journeys

### 1. Onboarding

1. **Connect Wallet**: Select and authorize a wallet (Polymesh Wallet, Subwallet, Polkadot.js etc.)
2. **Select Signing Key**: Choose an account/key from the connected wallet
3. **Create Identity** (if needed): Request a DID and test POLYX

### 2. Confidential Account Management

Confidential accounts consist of an **account key** (for sender/receiver operations) and an **encryption key** (for encrypting amounts, also used by mediators/auditors).

- **Generate**: Create new encrypted confidential accounts
- **Import/Export**: Portable encrypted account files compatible across devices
- **Unlock/Lock**: Load keys into WASM memory for operations
- **Register Account**: Link confidential account to your DID on-chain

### 3. Asset Management

- **Create Asset**: Multi-step wizard for asset creation with metadata and roles
- **Register for Asset**: Register your confidential account to hold a specific asset
- **Mint Tokens**: Mint tokens to your registered confidential account (issuer only)

### 4. Settlements (Transfers)

- **Create Settlement**: Define multi-leg transfers with sender, receiver, asset, and amount
- **Affirm Settlement**: All parties (sender, receiver, mediators) must affirm
- **Claim/Finalize**: Receiver claims assets, sender updates counter after execution

---

## Security Considerations

> ⚠️ This application is intended for **development and testing** on devnet/testnet environments.

### Key Security Features

| Feature                | Implementation                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| **Encrypted Storage**  | Seeds encrypted with Scrypt KDF + XSalsa20-Poly1305                                       |
| **Memory Protection**  | Private keys exist only in WASM memory when unlocked                                      |
| **Auto-Lock**          | Keys automatically cleared on page refresh/close and when switching confidential accounts |
| **No Key Export**      | Raw private keys never exposed to JavaScript                                              |
| **Password Protected** | All key operations require password authentication                                        |

### ⚠️ Important Warnings

> [!CAUTION]
> **Unencrypted Asset State Storage**
>
> Account asset state (including your confidential asset balances) is stored **unencrypted** in browser localStorage. Anyone with access to your browser's developer tools can view this data.

> [!CAUTION]
> **Data Loss Risk - Do Not Clear Browser Storage**
>
> Clearing your browser's localStorage will **permanently delete**:
>
> - All confidential account keys (encrypted seeds)
> - All account asset states (balances and counters)
>
> **The UI does not currently support rebuilding state from the chain.** If you lose this data, you will need to wait for future development to restore access to your confidential accounts and balances.

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Polymesh Node RPC URL
# Testnet: wss://testnet-rpc.polymesh.live
# Mainnet: wss://mainnet-rpc.polymesh.network
VITE_POLYMESH_NODE_URL=wss://testnet-rpc.polymesh.live

# SubQuery GraphQL Endpoint
# Testnet: https://testnet-graphql.polymesh.live
# Mainnet: https://mainnet-graphql.polymesh.network
VITE_SUBQUERY_URL=https://testnet-graphql.polymesh.live

# Onboarding Service URL (for requesting test DIDs and tokens)
VITE_ONBOARDING_URL=

# Blockchain Explorer URL Template
# Supports variables: {blockNumber}, {blockHash}, {extrinsicHash}, {extrinsicId}
# Examples:
# - https://staging-app.polymesh.dev/#/explorer/query/{blockNumber}
# - https://polymesh.subscan.io/block/{blockNumber}
VITE_EXPLORER_URL=

# Password Validation Configuration
# Minimum password length (default: 12)
VITE_MIN_PASSWORD_LENGTH=12

# Enable breach checking via Have I Been Pwned API (default: true)
VITE_ENABLE_BREACH_CHECK=true
```

---

## Wallet Support

**Supported wallets:**

- Polymesh Wallet (recommended)
- Subwallet
- Polkadot.js extension
- Other Polkadot-compatible wallets

> [!NOTE]
> **Custom Network Configuration**
>
> When connecting to testnet or custom networks, you may need to:
>
> 1. Add a custom network in your wallet using the target chain's RPC endpoint
> 2. Upload chain metadata to your wallet to enable clear signing of transactions
>
> Refer to your wallet's documentation for specific instructions.

---

## Documentation

- [Workflow Documentation](docs/WORKFLOWS.md) - Detailed flowcharts and sequence diagrams for all user journeys

---

## License

See [LICENSE](LICENSE) for details.
