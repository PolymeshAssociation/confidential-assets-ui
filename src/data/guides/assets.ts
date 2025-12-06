/**
 * Asset Management Guides
 *
 * Guides for creating and managing confidential assets
 */

import type { Guide } from './types';

export const assetGuides: Guide[] = [
  {
    id: 'creating-asset',
    title: 'Creating a Confidential Asset',
    description:
      'Asset issuers can create new confidential assets on Polymesh. This guide walks through the asset creation process.',
    prerequisites: [
      'Wallet connected',
      'DID created',
      'POLYX for transaction fees',
      'At least 1 Auditor Confidential Account Encryption Key (registered)',
      'Optional: Mediator Confidential Account Encryption Key (registered)',
    ],
    steps: [
      {
        title: 'Navigate to Assets',
        description:
          'Click on "Assets" in the navigation menu to go to the asset management page.',
      },
      {
        title: 'Click "Create Asset"',
        description:
          'Click the Create Asset button to open the creation modal.',
      },
      {
        title: 'Step 1: Asset Details',
        description:
          'Select a template (Optional), then enter your asset name, symbol, and configure the number of decimal places. You can also standard metadata or custom metadata fields as required.',
        tip: 'Templates provide pre-configured settings for common asset types like tokens or securities.',
      },
      {
        title: 'Step 2: Access Control',
        description:
          'Auditors and mediators allow for compliance and regulatory controls.',
        warning:
          'You MUST add at least one auditor key. Auditors are required to decrypt transaction details for regulatory compliance. Mediators are optional but if set must approve transfers before they can be executed.',
      },
      {
        title: 'Step 3: Review & Create',
        description:
          'Review all your settings and click Create to submit the transaction. Approve the transaction in your wallet.',
      },
    ],
    behindTheScenes:
      'Creating an asset registers it on the Polymesh blockchain with your DID as the owner. Auditor and mediator encryption keys are stored with the asset so transaction details can be encrypted for them. Auditors are passive (can only view transactions), while mediators are active (must approve transfers).',
    relatedGuides: ['registering-for-asset', 'minting-tokens'],
  },
  {
    id: 'asset-templates',
    title: 'Understanding Asset Templates & Types',
    description:
      'Asset templates provide pre-configured settings for common asset types, making it easier to create assets with standard configurations.',
    steps: [
      {
        title: 'Why Use Templates?',
        description:
          'Templates automatically configure relevant metadata fields for specific asset classes. For example, the "Debt" template adds fields for coupon rate, maturity date, and payment frequency, while "Real Estate" includes property address and valuation details.',
      },
      {
        title: 'Available Templates',
        description:
          'Choose from specialized templates including Currency, Equity (shares), Debt (bonds), Funds, Commodities, Real Estate, Derivatives, Structured Products, and Carbon Credits. You can also use the "Basic" template for simple tokens.',
      },
      {
        title: 'Metadata Fields',
        description:
          'Each template allows you to define specific properties. For example, a commodity asset can define purity and grade, while a fund asset can specify management fees and investment objectives. You can also add custom fields to any template.',
      },
    ],
    relatedGuides: ['creating-asset'],
  },
  {
    id: 'registering-for-asset',
    title: 'Registering for an Asset',
    description:
      'Before you can receive a confidential asset, your account must be registered for that specific asset.',
    prerequisites: [
      'Confidential account created and registered on-chain',
      'Signing key linked to your DID (for this transaction)',
    ],
    steps: [
      {
        title: 'Find the Asset',
        description:
          "If you created the asset, it will appear in your 'Created Assets' list. For other assets, you must know their Asset ID.",
      },
      {
        title: 'Click "Register"',
        description:
          'Click the Register action for the asset you created. For assets you didn\'t create, click the "Register for Asset" button under the Held Assets tab and manually enter the Asset ID. Confirm the asset details and click Register for Asset.',
      },
      {
        title: 'Approve the Transaction',
        description:
          'If your confidential account is locked, you will be prompted to enter your password to unlock it. Once thee asset registration proof has been generated, your wallet will prompt you to sign a transaction. This registers your account for this specific asset on chain.',
        tip: 'For this transaction, the selected signing key MUST be linked to the same DID as your confidential account.',
      },
      {
        title: 'Start Receiving Assets',
        description:
          'Once registered, others can transfer this asset to your confidential account.',
        warning:
          'Your account history and balance state for this asset are stored locally in your browser. Do not clear your browser storage without a backup, or you may lose access to your asset data. Currently, this application does not support restoring this account asset state from the blockchain.',
      },
    ],
    behindTheScenes:
      'Asset registration creates an entry for your account in the asset\'s "curve tree" - a cryptographic data structure that enables efficient zero-knowledge proofs. Your initial balance is set to zero. This tree structure allows the system to prove you have sufficient funds for a transfer without revealing your actual balance.',
    relatedGuides: ['viewing-balances', 'creating-transfer'],
  },
  {
    id: 'minting-tokens',
    title: 'Minting Tokens (Asset Issuers)',
    description:
      'As an asset issuer, you can mint (create) new tokens for your assets. Minting increases the total supply and adds tokens to your confidential account.',
    prerequisites: [
      'A signing key linked to the asset owners DID',
      'Confidential account linked to the asset owners DID',
      'Confidential account registered for the asset',
    ],
    steps: [
      {
        title: 'Select Your Asset',
        description:
          'Navigate to the Assets page and select the Created Assets tab to find the asset you own and want to mint tokens for. Click on it to view details.',
      },
      {
        title: 'Click "Mint"',
        description: 'Click the Mint action to open the minting modal.',
      },
      {
        title: 'Enter Amount',
        description:
          'Enter the amount of tokens you want to create and click "Mint Tokens". This will be added to your selected confidential account\'s balance.',
      },
      {
        title: 'Generate Proof & Submit',
        description:
          'If prompted unlock your confidential account. The system generates a zero-knowledge proof and then prompts you to sign the transaction in your wallet before submitting the minting transaction to the blockchain.',
        info: 'Minting creates new tokens. Only the asset owner can mint.',
      },
    ],
    behindTheScenes:
      "Minting generates a proof that demonstrates the new encrypted balance is correct (old balance + minted amount = new balance) without revealing any actual values. The proof is verified on-chain and your account's encrypted balance is updated.",
    relatedGuides: ['viewing-balances', 'creating-transfer'],
  },
  {
    id: 'viewing-balances',
    title: 'Viewing Your Balances',
    description:
      'Learn how to view your confidential asset balances and understand the balance display.',
    sections: [
      {
        title: 'View on Assets Page',
        description:
          'Navigate to Assets page and select the Held Assets tab. You will see your actual balance displayed. This balance is tracked in browser storage as part of the "Account Asset State".',
        warning:
          'Your account history and balance state are stored locally in your browser. Do not clear your browser storage without a backup, or you may lose access to your asset data. Currently, this application does not support restoring this account asset state and unencrypted balance from the blockchain if local data is lost.',
      },
    ],
    behindTheScenes:
      "Because confidential balances are encrypted on-chain, the application tracks your balance locally by maintaining an 'Account Asset State'. This state is updated with every transaction. Currently, we do not provide support for restoring this state from the blockchain if local data is lost.",
    relatedGuides: ['minting-tokens', 'claiming-assets'],
  },
];
