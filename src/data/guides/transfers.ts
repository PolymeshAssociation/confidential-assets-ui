/**
 * Transfer Guides
 *
 * Guides for confidential asset transfers (settlements)
 */

import type { Guide } from './types';

export const transferGuides: Guide[] = [
  {
    id: 'how-transfers-work',
    title: 'How Private Transfers Work',
    description:
      'Confidential asset transfers on Polymesh use a multi-step process that ensures privacy while maintaining compliance controls.',
    sections: [
      {
        title: 'Create a Transfer',
        description:
          'A transfer instruction specifies who is sending, who is receiving, which asset, and how much. The amounts are encrypted with the encryption public keys of the sender,receiver, auditors, and mediators so only the parties involved can decrypt and see them.',
        tip: 'Transfers can be single leg (direct sender to receiver) or multi leg (atomic swaps of multiple assets between multiple parties).',
      },
      {
        title: 'Sender Approves',
        description:
          'The sender must approve the transfer. This generates a zero-knowledge proof that they have sufficient funds, decreases their balance, and locks the amount being sent.',
      },
      {
        title: 'Receiver Approves',
        description:
          'The receiver must also approve the transfer. This confirms they accept the incoming assets.',
      },
      {
        title: 'Mediator Reviews (If Required)',
        description:
          'If the asset has a mediator, they must approve or reject the transfer. Mediators can see the decrypted details for compliance review.',
      },
      {
        title: 'Auditor Views',
        description:
          'Auditors can see the decrypted details for compliance review or cap table management.',
      },

      {
        title: 'Transfer Executes',
        description:
          'Once all parties have approved, the transfer executes automatically on-chain, making all assets available to the receiver(s).',
      },
      {
        title: 'Receiver Claims Assets',
        description:
          'The receiver must claim the assets to add them to their available balance. This decreases their pending transfer count.',
      },
      {
        title: 'Sender Updates Counter',
        description:
          'Once executed, the sender updates their counter to confirm the transfer is finalized. This decreases their pending transfer count and keeps future proof of balance calculation costs low.',
      },
    ],
    behindTheScenes:
      "Each approval generates a zero-knowledge proof verified on-chain. The sender's proof shows they have sufficient funds without revealing their balance. All amounts are encrypted using the public keys of the receiver, auditors, and mediators so only authorized parties can decrypt the values.",
    learnMoreUrl: 'https://assets.polymesh.network/P-DART-v1.pdf',
    learnMoreLabel: 'P-DART Technical Paper',
    relatedGuides: [
      'creating-transfer',
      'approving-sender',
      'approving-mediator',
    ],
  },
  {
    id: 'creating-transfer',
    title: 'Creating a Transfer',
    description:
      'Learn how to initiate a new confidential asset transfer to another party.',
    prerequisites: [
      'Confidential account registered for the asset',
      'Sufficient balance in the asset',
      "Receiver's account public key",
    ],
    steps: [
      {
        title: 'Navigate to Transfers',
        description:
          'Click on "Transfers" in the navigation menu to go to the transfer page.',
      },
      {
        title: 'Click "Create Transfer"',
        description:
          'Click the Create Transfer to open the creation modal. Create Transfer opens the Send Asset modal where your confidential account is set as the sender.',
        tip: 'You can also click the Request Transfer to open the Receive Asset modal where your confidential account is set as the receiver or click the Multi-Leg Builder to open the Multi-Leg Transfer modal where multiple assets can be swapped atomically between multiple parties.',
      },
      {
        title: 'Add Transfer Details',
        description:
          "For each transfer, specify: the sender's account (public key), the receiver's account (public key), the asset ID, and the amount. For send and receive your confidential account is automatically set as the sender and receiver respectively.",
        info: 'You can add multiple legs for more complex transfers, like asset swaps (Delivery vs Payment).',
      },
      {
        title: 'Review & Create',
        description:
          'Review the transfer details. Click Create to submit the transaction. The transfer will be created in "Pending" status.',
        tip: 'Share the transfer ID with the other parties for them to be able to retrieve, decrypt and approve the transfer.',
        info: 'Any signing key, associated with a DID, with sufficient POLYX can submit the transaction to create a transfer instruction, it does not need to be the one linked to your Confidential Account.',
      },
    ],

    behindTheScenes:
      'Creating a transfer encrypts the amounts for all parties (sender, receiver, auditors, mediators) and stores the encrypted data on-chain. The transfer gets a unique ID that parties use to look it up and approve it. ',
    relatedGuides: ['approving-sender', 'looking-up-transfer'],
  },
  {
    id: 'looking-up-transfer',
    title: 'Looking Up a Transfer by ID',
    description:
      'If you know a transfer ID, you can look it up to see its details and take action.',
    steps: [
      {
        title: 'Navigate to Transfers',
        description: 'Go to the Transfers page using the navigation menu.',
      },
      {
        title: 'Enter the Transfer ID',
        description:
          'In the search box, enter the transfer ID (a hexadecimal text string). The system will fetch the transfer details from the blockchain.',
        info: 'If a transfer ID was not provided, you can retrieve historical transfer instruction IDs from the blockchain or an indexer, then attempt to decrypt them to determine whether you were involved in the transfer.',
      },
      {
        title: 'Decrypt the Details',
        description:
          "If you're a party to the transfer (sender, receiver, auditor or mediator), the app will decrypt the transfer details so you can see the assets, amounts, and counter parties for legs you are involved in and take action.",
        tip: 'The transfer will be saved to your local history for easy access later.',
      },
    ],
    behindTheScenes:
      "Transfer details are decrypted locally using your encryption key. If you're not a party to the transfer, wont be able to view the details. Your role (sender, receiver, mediator, auditor) is determined by matching your account keys against the transfer data.",
    relatedGuides: ['approving-sender', 'approving-receiver'],
  },
  {
    id: 'approving-sender',
    title: 'Approving as Sender',
    description:
      "When you're the sender in a transfer, you must approve it to lock the funds and authorize the transfer.",
    prerequisites: ['Sufficient balance for the transfer amount'],
    steps: [
      {
        title: 'Find the Transfer',
        description:
          'Look up the transfer by ID or find it in your transfer list. Open the transfer details.',
      },
      {
        title: 'Verify the Details',
        description:
          'Review the transfer details carefully: the receiver, asset, and amount. Make sure everything is correct.',
      },
      {
        title: 'Click "Approve"',
        description:
          'Click the Approve button to generate a proof and submit your approval.',
        warning:
          'Your balance will be reduced immediately when you approve. The funds are locked until the transfer completes or is cancelled.',
      },
      {
        title: 'Wait for Confirmation',
        description:
          'The blockchain will verify your proof and record your approval. You\'ll see the status change to "Sender Approved".',
      },
    ],
    behindTheScenes:
      'Approval generates a zero-knowledge proof that: (1) you own the sender account, (2) you have sufficient funds, and (3) the new encrypted balance is correct after deducting the transfer amount. Your pending transfer count increases by 1.',
    relatedGuides: [
      'approving-receiver',
      'pending-count',
      'reclaiming-rejected',
    ],
  },
  {
    id: 'approving-receiver',
    title: 'Approving as Receiver',
    description:
      "When you're the receiver in a transfer, you must approve it to confirm you accept the incoming assets.",
    prerequisites: ['Registered for the asset being transferred'],
    steps: [
      {
        title: 'Find the Transfer',
        description:
          'Look up the transfer by ID or find it in your transfer list. Open the transfer details.',
      },
      {
        title: 'Verify the Details',
        description:
          'Review the transfer details: the sender, asset, and amount. Make sure you expect this transfer.',
      },
      {
        title: 'Click "Approve"',
        description:
          'Click the Approve button to generate a proof and submit your approval.',
      },
      {
        title: 'Wait for Execution',
        description:
          'Once all parties (sender, receiver, and any mediators) have approved, the transfer will execute automatically, making assets available to be claimed by the receiver.',
      },
    ],
    behindTheScenes:
      "Receiver approval proves you own the receiver account without revealing your private key. Your balance doesn't change at this point - you'll need to claim the assets after the transfer executes. Your pending transfer count increases by 1.",
    relatedGuides: ['claiming-assets', 'approving-sender'],
  },
  {
    id: 'approving-mediator',
    title: 'Participating as a Mediator',
    description:
      'Mediators are trusted third parties who must approve transfers for certain assets (e.g., for compliance reasons).',
    prerequisites: [
      'You are a designated mediator for the asset',
      'The transfer ID (provided by the sender)',
    ],
    steps: [
      {
        title: 'Look Up the Transfer',
        description:
          'Use the transfer ID provided by the sender to look up the transfer details.',
      },
      {
        title: 'Review Transfer Details',
        description:
          'As a mediator, you can decrypt and view the transfer amounts and parties to verify compliance.',
      },
      {
        title: 'Affirm or Reject',
        description:
          'Click "Affirm as Mediator" to approve the transfer, or "Reject" to block it.',
        warning:
          'Rejecting a transfer is permanent. The transfer status will change to "Rejected" and cannot be executed. Any assets previously locked will be available for the sender to reclaim.',
      },
    ],
    behindTheScenes:
      'Mediator approval is verified on-chain. The mediator proves they are the authorized party without revealing their identity in the clear (if using anonymous mediation, though typically mediators are known entities).',
    relatedGuides: ['looking-up-transfer', 'reclaiming-rejected'],
  },
  {
    id: 'claiming-assets',
    title: 'Claiming Your Assets',
    description:
      'After a transfer executes, the receiver must "claim" the assets to add them to their available balance.',
    prerequisites: ['Transfer has been executed'],
    steps: [
      {
        title: 'Find the Completed Transfer',
        description:
          'Go to Transfers and find the transfer with "Executed" status where you\'re the receiver.',
      },
      {
        title: 'Click "Claim Assets"',
        description:
          'Click the Claim button to generate a proof and claim your assets.',
      },
      {
        title: 'Check Your Balance',
        description:
          'After claiming, your account balance will increase by the transferred amount.',
        tip: 'Unclaimed assets sit in a pending state. Make sure to claim them to use them in future transfers.',
      },
    ],
    behindTheScenes:
      'Claiming generates a proof that your new balance equals your old balance plus the transferred amount. This updates your encrypted balance on-chain. Your pending transfer count decreases by 1.',
    relatedGuides: ['viewing-balances', 'pending-count'],
  },
  {
    id: 'reclaiming-rejected',
    title: 'Reclaiming Rejected Assets',
    description:
      'If a transfer is rejected (e.g., by a mediator) after you have approved it, your assets remain locked. You must reclaim them to make them available again.',
    prerequisites: [
      'Transfer status is "Rejected"',
      'You are the sender and have typically already approved',
    ],
    steps: [
      {
        title: 'Find the Rejected Transfer',
        description:
          'Locate the transfer with "Rejected" status in your history or by ID.',
      },
      {
        title: 'Click "Revert Affirmation"',
        description:
          'Click the Revert Affirmation button. This will generate a proof to unlock your assets and return them to your available balance.',
      },
      {
        title: 'Wait for Confirmation',
        description:
          'Once the transaction is finalized, your available balance increases by the amount previously locked.',
      },
    ],
    behindTheScenes:
      'Reverting an affirmation generates a proof that creates a new note with your assets, effectively "spending" the locked note and creating a new available note for yourself. This ensures funds are never lost even if a transfer fails.',
    relatedGuides: ['approving-sender', 'pending-count'],
  },

  {
    id: 'pending-count',
    title: 'Understanding the Pending Count',
    description:
      'The pending count tracks how many unfinalized transfers involve your account. Understanding this helps you manage your proof generation costs.',
    sections: [
      {
        title: 'What is the Pending Count?',
        description:
          'Each time you approve a transfer (as sender or receiver), your pending count increases. When transfers complete and you finalize them, the count decreases.',
      },
      {
        title: 'Why It Matters',
        description:
          'A higher pending count means larger proofs when you need to prove your balance. Keeping your count low makes operations faster and cheaper. After transfers complete, claim your assets (as receiver) or update your counter (as sender) to reduce your pending count.',
      },
      {
        title: 'Sender Counter Update',
        description:
          'After a transfer executes, senders can "Update Counter" to decrease their pending count. This doesn\'t change their balance but optimizes future operations.',
      },
    ],
    behindTheScenes:
      'The counter is part of the Proof of Balance mechanism. It ensures you can\'t hide funds by "forgetting" about pending transfers. Each pending transfer must be included in your balance proof, so fewer pending transfers means simpler and faster proofs.',
    relatedGuides: ['claiming-assets', 'approving-sender'],
  },
];
