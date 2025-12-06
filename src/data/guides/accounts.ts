/**
 * Confidential Accounts Guides
 *
 * Guides for creating and managing confidential accounts
 */

import type { Guide } from './types';

export const accountGuides: Guide[] = [
  {
    id: 'what-is-confidential-account',
    title: 'What is a Confidential Account?',
    description:
      'A confidential account is a special cryptographic identity that allows you to hold and transfer assets privately on Polymesh.',
    sections: [
      {
        title: 'Account vs Signing Key',
        description:
          "Your confidential account is separate from your wallet's signing key. While your signing key authorizes blockchain transactions, your confidential account is used for zero-knowledge proofs generation and verification and holds your private asset balances.",
      },
      {
        title: 'Two Key Pairs',
        description:
          'Each confidential account has two cryptographic key pairs: an Account Key (for managing balances and generating proofs) and an Encryption Key (for decrypting transaction details so authorized parties can read them).',
      },
      {
        title: 'Encrypted Storage',
        description:
          'For this application the seed used to generate your confidential account is encrypted with a password and stored in your browser. Only you can unlock it with your password. Unlike your wallet, confidential account keys are stored locally as they are required for zero-knowledge proofs and decrypting transfer details—always export a backup!',
      },
    ],
    behindTheScenes:
      'Confidential accounts use homomorphic encryption (based on the ElGamal scheme) for balance confidentiality and zero-knowledge proofs to verify transaction validity. The account key generates proofs that you have sufficient funds, while the encryption key allows designated auditors and mediators to decrypt transaction details.',
    learnMoreUrl: 'https://assets.polymesh.network/P-DART-v1.pdf',
    learnMoreLabel: 'P-DART Technical Paper',
    relatedGuides: ['creating-account', 'registering-account'],
  },
  {
    id: 'creating-account',
    title: 'Creating Your First Confidential Account',
    description:
      'Learn how to generate a new confidential account that you can use to hold and transfer private assets.',
    prerequisites: ['Wallet connected', 'DID created'],
    steps: [
      {
        title: 'Navigate to Confidential Accounts',
        description:
          'Click on "Confidential Accounts" in the navigation menu to go to the account management page.',
      },
      {
        title: 'Click "Generate New"',
        description:
          'Click the generate button to create a new confidential account.',
      },
      {
        title: 'Enter a Name',
        description:
          'Give your account a memorable name (alias) to help you identify it later. This name is only stored locally.',
      },
      {
        title: 'Set a Password',
        description:
          'Choose a strong password to encrypt your account. This password protects your private keys stored in the browser.',
        tip: 'Use a unique password.',
        warning:
          "If you forget your password, you won't be able to access your confidential account.",
      },
      {
        title: 'Save Your Account',
        description:
          'Click Generate to create the account. Your encrypted account will be stored in your browser.',
      },
    ],
    behindTheScenes:
      "When you generate an account, the system creates a random seed. This seed is used to derive two Pallas cryptographic key pairs (Account Key and Encryption Key) when required. It is the seed that is encrypted with your password and stored in your browser's localStorage, not the keys themselves.",
    relatedGuides: ['registering-account', 'exporting-account'],
  },
  {
    id: 'registering-account',
    title: 'Registering Your Account On-Chain',
    description:
      'Before you can receive assets, you must register your confidential account on the Polymesh blockchain. This links your account to your on chain identity.',
    prerequisites: [
      'Confidential account created',
      'POLYX for transaction fees',
    ],
    steps: [
      {
        title: 'Click "Register"',
        description:
          'On the Confidential Account Management page, select your confidential account. If it is not registered, click the "Register On-Chain" button to start instructions.',
      },
      {
        title: 'Unlock Your Account',
        description:
          'If your confidential account is currently locked, you will be prompted to enter your password to unlock it for proof generation.',
      },
      {
        title: 'Approve in Wallet',
        description:
          "Once the proof is generated your wallet will prompt you to sign the transaction. This registers your account's public keys on the blockchain.",
        info: 'Registration only needs to be done once per account. After registration, your account is permanently linked to your DID.',
      },
      {
        title: 'Wait for Confirmation',
        description:
          'The blockchain will process your registration. Once confirmed, the display will update to show the associated DID and Registered status.',
      },
    ],
    behindTheScenes:
      "Registration creates a zero-knowledge proof that proves you own the account (without revealing the private keys) and submits it to the blockchain. The chain verifies this proof and adds your account's public key to the global registry, linking it to your DID so you can hold regulate assets.",
    relatedGuides: ['creating-account', 'what-is-confidential-account'],
  },
  {
    id: 'exporting-account',
    title: 'Importing & Exporting Accounts',
    description:
      'Learn how to backup your confidential account and restore it in another browser or device.',
    steps: [
      {
        title: 'Export Your Account',
        description:
          'On the account management page, click the export icon next to your account. You will be prompted for your password to confirm the export. Your encrypted account file will be downloaded.',
        warning:
          'Store this backup file and the password securely. The file contains your encrypted seed for key derivation. If you lose it or the password, you will not be able to access your account.',
      },
      {
        title: 'Import an Account',
        description:
          'Click the "Import" button and select your previously exported account file.',
      },
      {
        title: 'Enter the Password',
        description:
          'Enter the password you used when the account was created. This decrypts and verifies the account.',
      },
      {
        title: 'Account Restored',
        description:
          'Your account is now available in this browser. You may need to register it on-chain if using a new identity.',
      },
    ],
    behindTheScenes:
      'The export file contains your confidential account details, including your encrypted seed for key derivation. The password encrypts the private key material, so even if someone obtains the file, they cannot access your funds without the password.',
    relatedGuides: ['account-security', 'creating-account'],
  },
  {
    id: 'account-security',
    title: 'Account Security Best Practices',
    description:
      'Important security considerations for managing your confidential accounts.',
    sections: [
      {
        title: 'Always Export Backups',
        description:
          "Your confidential account is stored only in your browser. If you clear browser data or switch devices, you'll lose access without a backup. Export your account immediately after creating it and store the backup securely.",
        warning: 'Losing your backup means losing access to your funds.',
      },
      {
        title: 'Use Strong Passwords',
        description:
          'Choose a unique, strong password for each confidential account. Password managers can help you generate and store secure passwords.',
      },
      {
        title: 'Understand Auto-Lock',
        description:
          'Your confidential account automatically locks when you switch confidential accounts or disconnect your wallet. This protects your assets if someone else uses your browser.',
      },
      {
        title: "Don't Share Your Password",
        description:
          'Never share your confidential account password or export file with untrusted parties. Anyone with both can access your private asset balances.',
        warning:
          'Anyone with your file and password controls your funds. Treat them like your bank PIN.',
      },
    ],
    relatedGuides: ['exporting-account'],
  },
];
