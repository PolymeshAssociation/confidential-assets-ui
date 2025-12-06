/**
 * Getting Started Guides
 *
 * Guides for new users to understand confidential assets on Polymesh
 */

import type { Guide } from './types';

export const gettingStartedGuides: Guide[] = [
  {
    id: 'what-are-confidential-assets',
    title: 'What are Confidential Assets?',
    description:
      'Confidential assets on Polymesh allow you to transfer tokens privately while maintaining regulatory compliance. Unlike traditional blockchain transactions where amounts and parties are visible to everyone, confidential assets keep your transaction details private.',
    sections: [
      {
        title: 'Privacy by Default',
        description:
          'Your balances and transfer amounts are encrypted using advanced cryptography. Only you and authorized parties (like auditors or mediators) can see the actual values.',
      },
      {
        title: 'Zero-Knowledge Proofs',
        description:
          'When you make a transfer, the system generates mathematical proofs that verify you have sufficient funds without revealing your actual balance. This is called a "zero-knowledge proof" because it proves something is true without revealing the underlying data.',
      },
      {
        title: 'Regulatory Compliance',
        description:
          'While your transactions are private from public view, asset issuers can designate auditors who can decrypt transaction details for compliance purposes. Mediators can also be assigned to approve or reject specific transfers.',
      },
    ],
    behindTheScenes:
      'Polymesh uses P-DART (Privacy-preserving Decentralized Anonymous Regulation-friendly Tokenization), an account-based confidential asset system. Unlike UTXO-based systems where coins are spent and created, your account maintains an encrypted balance that gets updated with each transaction.',
    learnMoreUrl: 'https://assets.polymesh.network/P-DART-v1.pdf',
    learnMoreLabel: 'Read the P-DART Technical Paper',
    relatedGuides: ['connecting-wallet', 'getting-did'],
  },
  {
    id: 'connecting-wallet',
    title: 'Connecting Your Wallet',
    description:
      'To interact with confidential assets, you need a Polymesh-compatible wallet. This guide walks you through the setup and connection process.',
    steps: [
      {
        title: 'Install the Polymesh Wallet',
        description:
          "Download and install the Polymesh Wallet browser extension (or a compatible alternative) if you haven't already.",
        link: {
          text: 'Get Polymesh Wallet (Chrome Web Store)',
          url: 'https://chromewebstore.google.com/detail/polymesh-wallet/jojhfeoedkpkglbfimdfabpdfjaoolaf',
        },
      },
      {
        title: 'Create an Account (Signing Key)',
        description:
          'Open your wallet extension and create at least one account. This will be your "signing key" used to authorize transactions.',
        warning:
          "Make sure to back up your wallet's recovery phrase in a secure location.",
      },
      {
        title: 'Configure Wallet Network (Optional)',
        description:
          'For some wallets, you may need to manually configure the network connection to view transaction details correctly. For the Polymesh wallet, enable "Display development networks" from the settings menu. Then select "Custom" and set the RPC endpoint to the following:',
        info: `RPC Endpoint: ${import.meta.env.VITE_POLYMESH_NODE_URL}`,
      },
      {
        title: 'Click "Connect Wallet"',
        description:
          'Find the Connect Wallet button in the top-right corner of the application or on the home page.',
      },
      {
        title: 'Select Your Wallet',
        description:
          'Choose your wallet from the list of available options. The Polymesh Wallet is recommended.',
      },
      {
        title: 'Approve the Connection',
        description:
          'Your wallet will ask you to approve the connection. Review the request and click approve.',
      },
      {
        title: 'Select Your Signing Key',
        description:
          'If you have multiple accounts, select the one you want to use for signing. This account pays for transaction fees (in POLYX).',
        tip: 'Need POLYX? You can get test tokens during the onboarding process. See the "Getting Your DID" guide.',
      },
    ],
    relatedGuides: ['getting-did', 'what-are-confidential-assets'],
  },
  {
    id: 'getting-did',
    title: 'Getting Your DID (Testnet Onboarding)',
    description:
      'On Polymesh, every user needs a Decentralized Identity (DID) to participate in asset transactions. On the testnet, you can get a DID and test tokens automatically.',
    prerequisites: ['Wallet connected', 'Signing key selected'],
    steps: [
      {
        title: 'Navigate to the Home Page',
        description:
          "After connecting your wallet and selecting a key, you'll see an onboarding prompt if you don't have a DID.",
      },
      {
        title: 'Click "Get Test POLYX & DID"',
        description:
          'This button requests both a DID and test tokens from the testnet faucet.',
        tip: "This only works on the testnet. On mainnet, you'll need to go through the proper identity verification process.",
      },
      {
        title: 'Wait for Confirmation',
        description:
          "The request is sent to the blockchain. After a few seconds, you'll receive your DID and some test POLYX tokens.",
      },
      {
        title: 'Start Using the App',
        description:
          'With your DID created, you can now create confidential accounts, assets, and participate in transfers.',
      },
    ],
    behindTheScenes:
      'Your DID (Decentralized Identifier) is your on-chain identity on Polymesh. It links your signing keys to a verifiable identity and is required for all regulated asset transactions. The testnet faucet automatically creates an on-chain identity for testing purposes.',
    relatedGuides: ['creating-account', 'what-are-confidential-assets'],
  },
];
