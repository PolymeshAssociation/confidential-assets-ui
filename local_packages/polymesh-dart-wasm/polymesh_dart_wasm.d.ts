/* tslint:disable */
/* eslint-disable */

/**
 * Contains both the registration proof and the resulting account asset state when
 * registering an account for a specific confidential asset.
 *
 * This is returned by `AccountKeys.registerAccountAssetProof()` and provides everything
 * needed to register the account on-chain and track the resulting state locally.
 *
 * # Example
 * ```javascript
 * const registration = accountKeys.registerAccountAssetProof(assetId, did);
 *
 * // Get the proof to submit on-chain
 * const proof = registration.getProof();
 * const results = await signer.registerAccountAsset(proof);
 *
 * // Get the state to track locally
 * const accountState = registration.getAccountAssetState();
 * accountState.commitPendingState(results.leafIndex());
 * ```
 */
export class AccountAssetRegistration {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Gets the resulting account asset state that should be tracked locally.
     *
     * After submitting the registration proof on-chain, you should commit the
     * transaction results to this state using `commitPendingState()`.
     *
     * # Returns
     * An `AccountAssetState` object that can be used to track the account's
     * confidential balance and generate future proofs.
     *
     * # Example
     * ```javascript
     * const accountState = registration.getAccountAssetState();
     *
     * // After submitting the proof
     * const results = await signer.registerAccountAsset(registration.getProof());
     * accountState.commitPendingState(results.leafIndex());
     *
     * // Now you can use the state for future operations
     * console.log('Balance:', accountState.balance());
     * ```
     */
    getAccountAssetState(): AccountAssetState;
    /**
     * Gets the registration proof as a batched proof (containing a single proof).
     *
     * This is useful if you want to combine multiple registration proofs into a single
     * batched transaction later.
     *
     * # Returns
     * A `BatchedAccountAssetRegistrationProof` containing this single proof.
     *
     * # Example
     * ```javascript
     * const batchedProof = registration.getBatchedProof();
     * ```
     */
    getBatchedProof(): BatchedAccountAssetRegistrationProof;
    /**
     * Gets the batched registration proof as SCALE-encoded bytes.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded batched proof.
     *
     * # Example
     * ```javascript
     * const bytes = registration.getBatchedProofBytes();
     * ```
     */
    getBatchedProofBytes(): Uint8Array;
    /**
     * Gets the registration proof that can be submitted to the blockchain.
     *
     * # Returns
     * An `AccountAssetRegistrationProof` object.
     *
     * # Example
     * ```javascript
     * const proof = registration.getProof();
     * const results = await signer.registerAccountAsset(proof);
     * ```
     */
    getProof(): AccountAssetRegistrationProof;
    /**
     * Gets the registration proof as SCALE-encoded bytes.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded proof.
     *
     * # Example
     * ```javascript
     * const bytes = registration.getProofBytes();
     * console.log('Proof bytes length:', bytes.length);
     * ```
     */
    getProofBytes(): Uint8Array;
}

/**
 * A zero-knowledge proof that registers an account for a specific confidential asset.
 *
 * This proof demonstrates that the account holder has the authority to participate
 * in transactions for the specified asset without revealing their identity or other
 * sensitive information. The proof must be submitted via `PolymeshSigner.registerAccountAsset()`.
 *
 * # Example
 * ```javascript
 * // Generated from AccountKeys
 * const registration = accountKeys.registerAccountAssetProof(assetId, did);
 * const proof = registration.getProof();
 *
 * // Submit to blockchain
 * const results = await signer.registerAccountAsset(proof);
 * ```
 */
export class AccountAssetRegistrationProof {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Deserializes a proof from a SCALE-encoded byte array.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing SCALE-encoded proof data.
     *
     * # Returns
     * The deserialized `AccountAssetRegistrationProof` object.
     *
     * # Errors
     * * Throws an error if the byte array is invalid or corrupted.
     *
     * # Example
     * ```javascript
     * const proof = AccountAssetRegistrationProof.fromBytes(bytes);
     * ```
     */
    static fromBytes(bytes: Uint8Array): AccountAssetRegistrationProof;
    /**
     * Deserializes a proof from a hexadecimal string.
     *
     * # Arguments
     * * `hex_str` - A hex-encoded string containing the proof data.
     *
     * # Returns
     * The deserialized `AccountAssetRegistrationProof` object.
     *
     * # Errors
     * * Throws an error if the hex string is invalid or contains non-hex characters.
     * * Throws an error if the decoded bytes don't represent a valid proof.
     *
     * # Example
     * ```javascript
     * const proof = AccountAssetRegistrationProof.fromHex('0x1234abcd...');
     * ```
     */
    static fromHex(hex_str: string): AccountAssetRegistrationProof;
    /**
     * Serializes the proof to a SCALE-encoded byte array.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded proof.
     *
     * # Example
     * ```javascript
     * const bytes = proof.toBytes();
     * ```
     */
    toBytes(): Uint8Array;
    /**
     * Exports the proof as a hexadecimal string.
     *
     * # Returns
     * A hex-encoded string representation of the proof.
     *
     * # Example
     * ```javascript
     * const hexString = proof.toHex();
     * console.log('Proof:', hexString);
     * ```
     */
    toHex(): string;
}

/**
 * Manages the confidential account state for a specific asset.
 *
 * This type tracks an account's confidential balance for a particular asset, including
 * pending transaction states. It's used to generate proofs for minting, settlements,
 * and other confidential asset operations. The state must be kept in sync with the
 * on-chain account tree by committing pending states after successful transactions.
 *
 * # Example
 * ```javascript
 * // Get account asset state from registration
 * const registration = issuerKeys.registerAccountAssetProof(assetId, issuerDid);
 * const accountState = registration.getAccountAssetState();
 *
 * // After a successful transaction, commit the new state
 * const results = await issuer.registerAccountAsset(registration.getProof());
 * accountState.commitPendingState(results.leafIndex());
 *
 * // Check the balance
 * console.log('Balance:', accountState.balance());
 * ```
 */
export class AccountAssetState {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Gets the asset ID associated with this account state.
     *
     * # Returns
     * The numeric asset ID (as a number).
     *
     * # Example
     * ```javascript
     * const assetId = accountState.assetId();
     * console.log('Asset ID:', assetId);
     * ```
     */
    assetId(): number;
    /**
     * Generates a zero-knowledge proof for minting new assets to this account.
     *
     * This proof demonstrates that the account holder has the authority to mint
     * assets without revealing the amount or account details. The proof must be
     * submitted via `PolymeshSigner.mintAsset()`.
     *
     * # Arguments
     * * `keys` - The account keys proving ownership of this account.
     * * `path` - The curve tree path from the account leaf to the tree root, obtained
     *   from `AccountCurveTree.getLeafPathAndRoot()`.
     * * `did` - The identity ID (DID) of the account holder. Accepts:
     *   - Hex string with or without "0x" prefix (e.g., "0x1234...")
     *   - 32-byte `Uint8Array`
     * * `amount` - The amount to mint. Accepts:
     *   - JavaScript number (e.g., `1000`)
     *   - JavaScript BigInt (e.g., `1000n`)
     *   - Decimal string (e.g., `"1000"`)
     *   - Hex string with 0x prefix (e.g., `"0x3e8"`)
     *
     * # Returns
     * An `AssetMintingProof` that can be submitted to the blockchain.
     *
     * # Errors
     * * Throws an error if the proof generation fails.
     * * Throws an error if the amount format is invalid.
     *
     * # Example
     * ```javascript
     * const leafIndex = issuerAccountState.leafIndex();
     * const path = await accountCurveTree.getLeafPathAndRoot(leafIndex);
     * const mintAmount = 1000000n;
     *
     * const mintingProof = issuerAccountState.assetMintingProof(
     *   issuerKeys,
     *   path,
     *   issuerDid,
     *   mintAmount
     * );
     *
     * const results = await issuer.mintAsset(mintingProof);
     * issuerAccountState.commitPendingState(results.leafIndex());
     * ```
     */
    assetMintingProof(keys: AccountKeys, path: AccountLeafPathAndRoot, did: any, amount: any): AssetMintingProof;
    /**
     * Gets the current confidential balance for this account asset.
     *
     * # Returns
     * The balance as a `bigint`.
     *
     * # Example
     * ```javascript
     * const balance = accountState.balance();
     * console.log('Current balance:', balance);
     * ```
     */
    balance(): any;
    /**
     * Commits a pending state change to the current state and updates the leaf index.
     *
     * After a successful transaction that modifies the account state (e.g., minting,
     * affirming a settlement), you must call this method with the new leaf index
     * from the transaction results. This updates the local state to match the on-chain state.
     *
     * # Arguments
     * * `leaf_index` - The new leaf index from the transaction results. Pass `u64::MAX`
     *   (JavaScript: `18446744073709551615n`) to discard pending state without committing.
     *
     * # Example
     * ```javascript
     * // Generate and submit a minting proof
     * const mintingProof = accountState.assetMintingProof(keys, path, 1000n);
     * const results = await signer.mintAsset(mintingProof);
     *
     * // Commit the pending state with the new leaf index
     * accountState.commitPendingState(results.leafIndex());
     * ```
     */
    commitPendingState(leaf_index: bigint): void;
    /**
     * Deserializes account asset state from a SCALE-encoded byte array.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing SCALE-encoded account asset state data.
     *
     * # Returns
     * The deserialized `AccountAssetState` object.
     *
     * # Errors
     * * Throws an error if the byte array is invalid or corrupted.
     *
     * # Example
     * ```javascript
     * const storedBytes = JSON.parse(localStorage.getItem('accountState'));
     * const accountState = AccountAssetState.fromBytes(new Uint8Array(storedBytes));
     * ```
     */
    static fromBytes(bytes: Uint8Array): AccountAssetState;
    /**
     * Checks if there is a pending state change that hasn't been committed yet.
     *
     * A pending state exists after generating a proof but before committing the
     * transaction results. This is useful to prevent generating multiple proofs
     * before committing the first one.
     *
     * # Returns
     * `true` if there's a pending state change, `false` otherwise.
     *
     * # Example
     * ```javascript
     * if (accountState.hasPendingState()) {
     *   console.log('Warning: Pending state exists. Commit or discard before generating new proofs.');
     * }
     * ```
     */
    hasPendingState(): boolean;
    /**
     * Gets the leaf index of this account in the account curve tree.
     *
     * The leaf index is assigned when an account is registered for an asset and is
     * needed to retrieve the account's curve tree path for proof generation.
     *
     * # Returns
     * The leaf index as a `bigint`. Returns `u64::MAX` if not yet set.
     *
     * # Example
     * ```javascript
     * const leafIndex = accountState.leafIndex();
     * const path = await accountCurveTree.getLeafPathAndRoot(leafIndex);
     * ```
     */
    leafIndex(): bigint;
    /**
     * Generates a zero-knowledge proof for the receiver to affirm their participation
     * in a settlement leg.
     *
     * As the receiver in a confidential asset transfer, you must affirm the settlement leg
     * by proving you can receive the assets. This doesn't immediately credit your balance;
     * you must call `receiverClaimProof()` after both parties have affirmed to actually
     * claim the transferred assets.
     *
     * # Arguments
     * * `keys` - The account keys proving ownership of this account.
     * * `path` - The curve tree path from the account leaf to the tree root.
     * * `settlement_ref` - The settlement reference ID (as a `bigint` or number).
     * * `leg_id` - The leg ID within the settlement.
     * * `leg_enc` - The encrypted settlement leg containing transfer details.
     * * `asset_id` - The asset ID being received (must match the leg's asset).
     * * `amount` - Optional amount for validation. Pass `null` or `undefined` to skip.
     *
     * # Returns
     * A `ReceiverAffirmationProof` that can be submitted via `PolymeshSigner.receiverAffirmation()`.
     *
     * # Errors
     * * Throws an error if the encrypted leg cannot be decrypted with the provided keys.
     * * Throws an error if the asset ID doesn't match the leg's asset ID.
     * * Throws an error if the amount is provided and doesn't match the leg amount.
     * * Throws an error if proof generation fails.
     *
     * # Example
     * ```javascript
     * const settlementLegs = await client.getSettlementLegs(settlementRef);
     * const encryptedLeg = settlementLegs.getLeg(0);
     * const leafIndex = receiverAccountState.leafIndex();
     * const path = await accountCurveTree.getLeafPathAndRoot(leafIndex);
     *
     * const receiverProof = receiverAccountState.receiverAffirmProof(
     *   receiverKeys,
     *   path,
     *   settlementRef,
     *   0,
     *   encryptedLeg,
     *   assetId,
     *   null
     * );
     *
     * const results = await receiver.receiverAffirmation(receiverProof);
     * receiverAccountState.commitPendingState(results.leafIndex());
     * ```
     */
    receiverAffirmProof(keys: AccountKeys, path: AccountLeafPathAndRoot, settlement_ref: any, leg_id: number, leg_enc: SettlementLegEncrypted, asset_id: number, amount: any): ReceiverAffirmationProof;
    /**
     * Generates a zero-knowledge proof for the receiver to claim assets from an affirmed
     * settlement leg.
     *
     * After both the sender and receiver have affirmed a settlement leg, the receiver must
     * generate and submit a claim proof to actually receive the transferred assets into their
     * confidential balance. This is the final step in a confidential asset transfer.
     *
     * # Arguments
     * * `keys` - The account keys proving ownership of this account.
     * * `path` - The curve tree path from the account leaf to the tree root.
     * * `settlement_ref` - The settlement reference ID (as a `bigint` or number).
     * * `leg_id` - The leg ID within the settlement.
     * * `leg_enc` - The encrypted settlement leg containing transfer details.
     * * `asset_id` - The asset ID being claimed (must match the leg's asset).
     * * `amount` - Optional amount for validation. Pass `null` or `undefined` to skip.
     *
     * # Returns
     * A `ReceiverClaimProof` that can be submitted via `PolymeshSigner.receiverClaim()`.
     *
     * # Errors
     * * Throws an error if the encrypted leg cannot be decrypted with the provided keys.
     * * Throws an error if the asset ID doesn't match the leg's asset ID.
     * * Throws an error if the amount is provided and doesn't match the leg amount.
     * * Throws an error if proof generation fails.
     *
     * # Example
     * ```javascript
     * // After both parties have affirmed, the receiver can claim
     * const settlementLegs = await client.getSettlementLegs(settlementRef);
     * const encryptedLeg = settlementLegs.getLeg(0);
     * const leafIndex = receiverAccountState.leafIndex();
     * const path = await accountCurveTree.getLeafPathAndRoot(leafIndex);
     *
     * const claimProof = receiverAccountState.receiverClaimProof(
     *   receiverKeys,
     *   path,
     *   settlementRef,
     *   0,
     *   encryptedLeg,
     *   assetId,
     *   null
     * );
     *
     * const results = await receiver.receiverClaim(claimProof);
     * receiverAccountState.commitPendingState(results.leafIndex());
     *
     * // The receiver's balance is now updated with the transferred amount
     * console.log('New balance:', receiverAccountState.balance());
     * ```
     */
    receiverClaimProof(keys: AccountKeys, path: AccountLeafPathAndRoot, settlement_ref: any, leg_id: number, leg_enc: SettlementLegEncrypted, asset_id: number, amount: any): ReceiverClaimProof;
    /**
     * Generates a zero-knowledge proof for the sender to affirm their participation in a settlement leg.
     *
     * As the sender in a confidential asset transfer, you must affirm the settlement leg
     * by proving you have sufficient balance without revealing the amount. This proof
     * decrements your balance by the transfer amount and locks it for the settlement.
     *
     * # Arguments
     * * `keys` - The account keys proving ownership of this account.
     * * `path` - The curve tree path from the account leaf to the tree root.
     * * `settlement_ref` - The settlement reference ID. Accepts:
     *   - Hex string with or without "0x" prefix (e.g., "0x1234...")
     *   - 32-byte `Uint8Array`
     * * `leg_id` - The leg ID within the settlement (typically `0` for the first leg).
     * * `leg_enc` - The encrypted settlement leg containing transfer details.
     * * `asset_id` - The asset ID being transferred (must match the leg's asset).
     * * `amount` - Optional amount for validation. If provided, verifies it matches the
     *   encrypted leg amount. Pass `null` or `undefined` to skip validation. Accepts:
     *   - JavaScript number (e.g., `1000`)
     *   - JavaScript BigInt (e.g., `1000n`)
     *   - Decimal string (e.g., `"1000"`)
     *   - Hex string with 0x prefix (e.g., `"0x3e8"`)
     *
     * # Returns
     * A `SenderAffirmationProof` that can be submitted via `PolymeshSigner.senderAffirmation()`.
     *
     * # Errors
     * * Throws an error if the encrypted leg cannot be decrypted with the provided keys.
     * * Throws an error if the asset ID doesn't match the leg's asset ID.
     * * Throws an error if the amount is provided and doesn't match the leg amount.
     * * Throws an error if proof generation fails.
     *
     * # Example
     * ```javascript
     * const settlementLegs = await client.getSettlementLegs(settlementRef);
     * const encryptedLeg = settlementLegs.getLeg(0);
     * const leafIndex = senderAccountState.leafIndex();
     * const path = await accountCurveTree.getLeafPathAndRoot(leafIndex);
     *
     * const senderProof = senderAccountState.senderAffirmProof(
     *   senderKeys,
     *   path,
     *   settlementRef,
     *   0,  // leg_id
     *   encryptedLeg,
     *   assetId,
     *   null  // Let it use the amount from the encrypted leg
     * );
     *
     * const results = await sender.senderAffirmation(senderProof);
     * senderAccountState.commitPendingState(results.leafIndex());
     * ```
     */
    senderAffirmProof(keys: AccountKeys, path: AccountLeafPathAndRoot, settlement_ref: any, leg_id: number, leg_enc: SettlementLegEncrypted, asset_id: number, amount: any): SenderAffirmationProof;
    /**
     * Generates a zero-knowledge proof for the sender to update their transaction counter
     * without transferring assets.
     *
     * This is used to increment the sender's transaction counter for a settlement leg
     * without actually transferring the locked assets. This can be useful in certain
     * settlement workflows where the counter needs to be updated separately.
     *
     * # Arguments
     * * `keys` - The account keys proving ownership of this account.
     * * `path` - The curve tree path from the account leaf to the tree root.
     * * `settlement_ref` - The settlement reference ID (as a `bigint` or number).
     * * `leg_id` - The leg ID within the settlement.
     * * `leg_enc` - The encrypted settlement leg.
     * * `asset_id` - The asset ID (must match the leg's asset).
     * * `amount` - Optional amount for validation. Pass `null` or `undefined` to skip.
     *
     * # Returns
     * A `SenderCounterUpdateProof` that can be submitted to the blockchain.
     *
     * # Errors
     * * Throws an error if the encrypted leg cannot be decrypted.
     * * Throws an error if the asset ID doesn't match.
     * * Throws an error if the amount is provided and doesn't match.
     * * Throws an error if proof generation fails.
     *
     * # Example
     * ```javascript
     * const proof = accountState.senderCounterUpdateProof(
     *   keys,
     *   path,
     *   settlementRef,
     *   0,
     *   encryptedLeg,
     *   assetId,
     *   null
     * );
     * ```
     */
    senderCounterUpdateProof(keys: AccountKeys, path: AccountLeafPathAndRoot, settlement_ref: any, leg_id: number, leg_enc: SettlementLegEncrypted, asset_id: number, amount: any): SenderCounterUpdateProof;
    /**
     * Generates a zero-knowledge proof for the sender to revert (cancel) their affirmation
     * of a settlement leg.
     *
     * If a sender has affirmed a settlement leg but wants to cancel before the receiver
     * claims the assets, they can generate a revert proof. This unlocks the previously
     * locked assets and returns them to the sender's available balance.
     *
     * # Arguments
     * * `keys` - The account keys proving ownership of this account.
     * * `path` - The curve tree path from the account leaf to the tree root.
     * * `settlement_ref` - The settlement reference ID (as a `bigint` or number).
     * * `leg_id` - The leg ID within the settlement.
     * * `leg_enc` - The encrypted settlement leg.
     * * `asset_id` - The asset ID being reverted (must match the leg's asset).
     * * `amount` - Optional amount for validation. Pass `null` or `undefined` to skip.
     *
     * # Returns
     * A `SenderRevertAffirmationProof` that can be submitted to the blockchain.
     *
     * # Errors
     * * Throws an error if the encrypted leg cannot be decrypted.
     * * Throws an error if the asset ID doesn't match.
     * * Throws an error if the amount is provided and doesn't match.
     * * Throws an error if proof generation fails.
     *
     * # Example
     * ```javascript
     * const revertProof = senderAccountState.senderRevertProof(
     *   senderKeys,
     *   path,
     *   settlementRef,
     *   0,
     *   encryptedLeg,
     *   assetId,
     *   null
     * );
     *
     * // Submit the revert proof to cancel the sender's affirmation
     * const results = await sender.senderReversal(revertProof);
     * senderAccountState.commitPendingState(results.leafIndex());
     * ```
     */
    senderRevertProof(keys: AccountKeys, path: AccountLeafPathAndRoot, settlement_ref: any, leg_id: number, leg_enc: SettlementLegEncrypted, asset_id: number, amount: any): SenderRevertAffirmationProof;
    /**
     * Serializes the account asset state to a SCALE-encoded byte array.
     *
     * This allows you to store the state off-chain and restore it later.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded state.
     *
     * # Example
     * ```javascript
     * const bytes = accountState.toBytes();
     * // Store bytes in local storage or a database
     * localStorage.setItem('accountState', JSON.stringify(Array.from(bytes)));
     * ```
     */
    toBytes(): Uint8Array;
    /**
     * Exports the account asset state as a JSON string for debugging purposes.
     *
     * # Returns
     * A JSON string representation of the state.
     *
     * # Errors
     * * Throws an error if serialization fails.
     *
     * # Example
     * ```javascript
     * console.log('Account State:', accountState.toJson());
     * ```
     */
    toJson(): string;
}

/**
 * Contains the secret keys for a confidential account.
 *
 * This type holds both the account secret key (used for generating zero-knowledge proofs)
 * and the encryption secret key (used for decrypting settlement leg information). These keys
 * are essential for all confidential asset operations including registration, minting,
 * and settlements.
 *
 * **Security Warning:** These keys should be kept secure and never shared. Loss of these
 * keys means permanent loss of access to the confidential account.
 *
 * # Example
 * ```javascript
 * // Generate from a deterministic seed
 * const keys = AccountKeys.fromSeed("my-secure-seed-phrase");
 *
 * // Generate from a random hex seed
 * const randomSeed = generateRandomSeed();
 * const keys = new AccountKeys(randomSeed);
 *
 * // Get public keys for sharing
 * const publicKeys = keys.publicKeys();
 * ```
 */
export class AccountKeys {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Clears the secret keys from memory by zeroing them out.
     *
     * The `AccountKeys` instance can't be used after calling this method.
     */
    clear(): void;
    /**
     * Extracts the encryption key pair from these account keys.
     *
     * The encryption key pair is used to decrypt settlement leg information and
     * encrypted transaction data.
     *
     * # Returns
     * An `EncryptionKeyPair` object containing the encryption secret key.
     *
     * # Example
     * ```javascript
     * const encryptionKeys = keys.encryptionKeyPair();
     * // Use for decrypting settlement legs
     * const decrypted = settlementLegs.tryDecryptAsMediatorOrAuditor(encryptionKeys);
     * ```
     */
    encryptionKeyPair(): EncryptionKeyPair;
    /**
     * Creates account keys from any seed string using deterministic hashing.
     *
     * This is a convenience method that accepts any string and hashes it to create
     * a deterministic 32-byte seed. The same input string will always produce the
     * same keys.
     *
     * # Arguments
     * * `seed` - Any string to use as the seed (will be hashed internally).
     *
     * # Returns
     * A new `AccountKeys` object.
     *
     * # Errors
     * * Throws an error if key generation fails.
     *
     * # Example
     * ```javascript
     * const keys = AccountKeys.fromSeed("my-secure-passphrase");
     * // Same seed always produces the same keys
     * const keys2 = AccountKeys.fromSeed("my-secure-passphrase");
     * ```
     */
    static fromSeed(seed: string): AccountKeys;
    /**
     * Generate mediator affirmation for a settlement leg.
     *
     * # Arguments
     * * `settlement_ref` - The settlement reference (can be hex string or Uint8Array).
     * * `leg_id` - The identifier of the settlement leg.
     * * `leg_enc` - The encrypted settlement leg.
     * * `accept` - Boolean indicating whether to accept (true) or reject (false) the leg.
     * * `asset_id` - The asset ID of the settlement leg.
     * * `amount` - The expected amount (can be null/undefined to skip check).
     *
     * # Returns
     * A `MediatorAffirmationProof` that can be submitted to the blockchain.
     *
     * # Errors
     * * Throws an error if decryption fails.
     * * Throws an error if asset ID or amount do not match.
     * * Throws an error if the account is not a mediator for the leg.
     */
    mediatorAffirmationProof(settlement_ref: any, leg_id: number, leg_enc: SettlementLegEncrypted, accept: boolean, asset_id: number, amount: any): MediatorAffirmationProof;
    /**
     * Creates new account keys from a hexadecimal seed string.
     *
     * # Arguments
     * * `seed_hex` - A 32-byte hexadecimal string (64 hex characters), with or without "0x" prefix.
     *
     * # Returns
     * A new `AccountKeys` object containing the generated secret keys.
     *
     * # Errors
     * * Throws an error if the seed is not valid hexadecimal.
     * * Throws an error if the seed is not exactly 32 bytes (64 hex characters).
     *
     * # Example
     * ```javascript
     * const seed = generateRandomSeed(); // Returns a 64-character hex string
     * const keys = new AccountKeys(seed);
     * ```
     */
    constructor(seed_hex: string);
    /**
     * Extracts the public keys from these account keys.
     *
     * Public keys can be safely shared and are used for account registration,
     * receiving settlements, and encryption.
     *
     * # Returns
     * An `AccountPublicKeys` object containing both the account public key and encryption public key.
     *
     * # Example
     * ```javascript
     * const publicKeys = keys.publicKeys();
     * console.log('Account key:', publicKeys.accountPublicKey().toJson());
     * console.log('Encryption key:', publicKeys.encryptionPublicKey().toJson());
     * ```
     */
    publicKeys(): AccountPublicKeys;
    /**
     * Generates a zero-knowledge proof for registering this account for a specific asset.
     *
     * This proof allows the account to participate in confidential transactions for the
     * specified asset. After registration, the account can mint, transfer, and receive
     * the asset while maintaining confidentiality.
     *
     * # Arguments
     * * `asset_id` - The numeric identifier of the confidential asset.
     * * `did` - The identity ID (DID) of the account holder. Accepts:
     *   - Hex string with or without "0x" prefix (e.g., "0x1234...")
     *   - 32-byte `Uint8Array`
     *
     * # Returns
     * An `AccountAssetRegistration` containing both the proof and the initial account state.
     *
     * # Errors
     * * Throws an error if the DID format is invalid.
     * * Throws an error if proof generation fails.
     *
     * # Example
     * ```javascript
     * const registration = keys.registerAccountAssetProof(assetId, myDid);
     * const proof = registration.getProof();
     * const result = await signer.registerAccountAsset(proof);
     *
     * // Track the account state
     * const accountState = registration.getAccountAssetState();
     * accountState.commitPendingState(result.leafIndex());
     * ```
     */
    registerAccountAssetProof(asset_id: number, did: any): AccountAssetRegistration;
    /**
     * Generates a zero-knowledge proof for registering this account on-chain.
     *
     * This proof demonstrates that the account holder possesses the secret keys
     * corresponding to the public keys being registered, without revealing the secret keys.
     *
     * # Arguments
     * * `did` - The identity ID (DID) to link this account to. Accepts:
     *   - Hex string with or without "0x" prefix (e.g., "0x1234...")
     *   - 32-byte `Uint8Array`
     *
     * # Returns
     * An `AccountRegistrationProof` that can be submitted to the blockchain.
     *
     * # Errors
     * * Throws an error if the DID format is invalid.
     * * Throws an error if proof generation fails.
     *
     * # Example
     * ```javascript
     * const proof = keys.registerAccountProof(myDid);
     * const result = await signer.registerAccount(proof);
     * ```
     */
    registerAccountProof(did: any): AccountRegistrationProof;
}

/**
 * Account leaf path and root.
 *
 * Contains both the curve tree path from an account leaf to the root and the root value itself
 * at a specific block number. Used for generating zero-knowledge proofs about account states
 * (e.g., proving balance sufficiency during settlement affirmations).
 */
export class AccountLeafPathAndRoot {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Imports an account leaf path and root from a SCALE-encoded byte array.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing the SCALE-encoded path and root.
     *
     * # Returns
     * A `FeeAccountLeafPathAndRoot` instance.
     *
     * # Errors
     * * Throws an error if the bytes are not a valid SCALE-encoded account leaf path and root.
     *
     * # Example
     * ```javascript
     * const pathAndRoot = AccountLeafPathAndRoot.fromBytes(bytes);
     * ```
     */
    static fromBytes(bytes: Uint8Array): FeeAccountLeafPathAndRoot;
    /**
     * Gets the block number at which this root was generated.
     *
     * The block number indicates at which blockchain state the curve tree root was calculated.
     * This is important for ensuring proofs are verified against the correct historical state.
     *
     * # Returns
     * The block number as a `u32`.
     *
     * # Errors
     * * Throws an error if the block number cannot be extracted from the path.
     *
     * # Example
     * ```javascript
     * const accountCurveTree = await client.getAccountCurveTree();
     * const pathAndRoot = await accountCurveTree.getLeafPathAndRoot(leafIndex);
     * const blockNumber = pathAndRoot.getBlockNumber();
     * console.log(`Root calculated at block ${blockNumber}`);
     * ```
     */
    getBlockNumber(): number;
    /**
     * Exports the account leaf path and root as a SCALE-encoded byte array.
     *
     * This is useful for storing or transmitting the path and root in a compact binary format.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded path and root.
     *
     * # Example
     * ```javascript
     * const accountCurveTree = await client.getAccountCurveTree();
     * const pathAndRoot = await accountCurveTree.getLeafPathAndRoot(leafIndex);
     * const bytes = pathAndRoot.toBytes();
     * // Store or transmit bytes
     * ```
     */
    toBytes(): Uint8Array;
}

/**
 * Account leaf path builder.
 *
 * A utility for incrementally building curve tree paths for accounts in the account curve tree.
 * This builder helps you construct paths by querying on-chain data (leaves, inner nodes, and roots)
 * and assembling them into a complete path structure.
 *
 * The workflow is identical to `AssetLeafPathBuilder` but operates on the account tree instead of the asset tree.
 * Account paths are used when generating proofs related to account states (balance commitments, etc.).
 *
 * # Workflow
 * 1. Create a new builder with the target leaf index, tree height, and block number
 * 2. Get the list of node locations needed from `getNodeLocations()`
 * 3. Query the blockchain for inner nodes at those locations
 * 4. Get the range of leaf indices needed from `getMinLeafIndex()` / `getMaxLeafIndex()`
 * 5. Query the blockchain for those leaves
 * 6. Query the blockchain for the tree root at the block number
 * 7. Set all the data using `setLeaf()`, `setNodeAtIndex()`, and `setRoot()`
 * 8. Build the final path with `buildLeafPathWithRoot()`
 *
 * # Example
 * ```javascript
 * const accountCurveTree = await client.getAccountCurveTree();
 * const blockNumber = await accountCurveTree.getLastBlockNumber();
 * const leafIndex = accountState.leafIndex();
 *
 * // Create the builder
 * const builder = new AccountLeafPathBuilder(leafIndex, 4, blockNumber);
 *
 * // Query and set leaves
 * const minLeaf = builder.getMinLeafIndex();
 * const maxLeaf = builder.getMaxLeafIndex();
 * for (let i = minLeaf; i < maxLeaf; i++) {
 *   const leaf = await client.getAccountLeaf(i, blockNumber);
 *   builder.setLeaf(i, leaf);
 * }
 *
 * // Query and set inner nodes
 * const nodeLocations = builder.getNodeLocations();
 * for (let i = 0; i < nodeLocations.length; i++) {
 *   const node = await client.getAccountInnerNode(nodeLocations[i], blockNumber);
 *   builder.setNodeAtIndex(i, node);
 * }
 *
 * // Query and set root
 * const root = await client.getAccountTreeRoot(blockNumber);
 * builder.setRoot(root);
 *
 * // Build the path
 * const pathAndRoot = builder.buildLeafPathWithRoot();
 * ```
 */
export class AccountLeafPathBuilder {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Builds the account leaf path with the root included.
     *
     * Constructs the complete curve tree path from the target leaf to the root, including the root value.
     * This is used when generating zero-knowledge proofs about account states.
     *
     * # Returns
     * An `AccountLeafPathAndRoot` instance containing both the curve tree path and the root.
     *
     * # Errors
     * * Throws an error if required leaves, nodes, or root have not been set.
     * * Throws an error if the path cannot be constructed.
     *
     * # Example
     * ```javascript
     * const builder = new AccountLeafPathBuilder(leafIndex, 4, blockNumber);
     *
     * // Set all leaves
     * const minLeaf = builder.getMinLeafIndex();
     * const maxLeaf = builder.getMaxLeafIndex();
     * for (let i = minLeaf; i < maxLeaf; i++) {
     *   const leaf = await client.getAccountLeaf(i, blockNumber);
     *   builder.setLeaf(i, leaf);
     * }
     *
     * // Set all inner nodes
     * const nodeLocations = builder.getNodeLocations();
     * for (let i = 0; i < nodeLocations.length; i++) {
     *   const node = await client.getAccountInnerNode(nodeLocations[i], blockNumber);
     *   builder.setNodeAtIndex(i, node);
     * }
     *
     * // Set the root
     * const root = await client.getAccountTreeRoot(blockNumber);
     * builder.setRoot(root);
     *
     * // Build the complete path with root
     * const pathAndRoot = builder.buildLeafPathWithRoot();
     * ```
     */
    buildLeafPathWithRoot(): AccountLeafPathAndRoot;
    /**
     * Returns the `L` parameter of the account tree.
     *
     * This represents the branching factor (arity) of the tree - how many children each node has.
     *
     * # Returns
     * The tree arity as a number (typically 4 for account trees).
     *
     * # Example
     * ```javascript
     * const builder = new AccountLeafPathBuilder(leafIndex, 4, blockNumber);
     * console.log(`Tree arity: ${builder.getL()}`); // 4
     * ```
     */
    getL(): number;
    /**
     * Gets the list of leaf indices that need to be queried from the blockchain.
     *
     * Returns all sibling leaf indices along the path to the target leaf.
     *
     * # Returns
     * An array of leaf indices (as numbers).
     *
     * # Example
     * ```javascript
     * const builder = new AccountLeafPathBuilder(leafIndex, 4, blockNumber);
     * const leafIndices = builder.getLeafIndices();
     * for (const index of leafIndices) {
     *   const leaf = await client.getAccountLeaf(index, blockNumber);
     *   builder.setLeaf(index, leaf);
     * }
     * ```
     */
    getLeafIndices(): BigUint64Array;
    /**
     * Returns the `M` parameter of the account tree.
     *
     * This represents the maximum number of children stored in each compressed inner node.
     *
     * # Returns
     * The compression parameter as a number.
     *
     * # Example
     * ```javascript
     * const builder = new AccountLeafPathBuilder(leafIndex, 4, blockNumber);
     * console.log(`Compression parameter: ${builder.getM()}`);
     * ```
     */
    getM(): number;
    /**
     * Gets the maximum leaf index that needs to be queried.
     *
     * Combined with `getMinLeafIndex()`, this defines a range of leaves to query.
     *
     * # Returns
     * The maximum leaf index as a number (exclusive - use `i < maxLeaf` in loops).
     *
     * # Example
     * ```javascript
     * const builder = new AccountLeafPathBuilder(leafIndex, 4, blockNumber);
     * const minLeaf = builder.getMinLeafIndex();
     * const maxLeaf = builder.getMaxLeafIndex();
     * for (let i = minLeaf; i < maxLeaf; i++) {
     *   const leaf = await client.getAccountLeaf(i, blockNumber);
     *   builder.setLeaf(i, leaf);
     * }
     * ```
     */
    getMaxLeafIndex(): bigint;
    /**
     * Gets the minimum leaf index that needs to be queried.
     *
     * Combined with `getMaxLeafIndex()`, this defines a range of leaves to query.
     *
     * # Returns
     * The minimum leaf index as a number.
     *
     * # Example
     * ```javascript
     * const builder = new AccountLeafPathBuilder(leafIndex, 4, blockNumber);
     * const minLeaf = builder.getMinLeafIndex();
     * const maxLeaf = builder.getMaxLeafIndex();
     * for (let i = minLeaf; i < maxLeaf; i++) {
     *   const leaf = await client.getAccountLeaf(i, blockNumber);
     *   builder.setLeaf(i, leaf);
     * }
     * ```
     */
    getMinLeafIndex(): bigint;
    /**
     * Gets the list of inner node locations that need to be queried from the blockchain.
     *
     * Returns an array of SCALE-encoded node locations. These should be used to query
     * the on-chain storage for inner nodes.
     *
     * # Returns
     * An array of `Uint8Array` values, each representing a SCALE-encoded node location.
     *
     * # Example
     * ```javascript
     * const builder = new AccountLeafPathBuilder(leafIndex, 4, blockNumber);
     * const nodeLocations = builder.getNodeLocations();
     * for (let i = 0; i < nodeLocations.length; i++) {
     *   const node = await client.getAccountInnerNode(nodeLocations[i], blockNumber);
     *   builder.setNodeAtIndex(i, node);
     * }
     * ```
     */
    getNodeLocations(): Uint8Array[];
    /**
     * Creates a new account leaf path builder.
     *
     * # Arguments
     * * `leaf_index` - The index of the target leaf in the tree (typically from account state)
     * * `height` - The height of the tree (typically 4 for account trees)
     * * `block_number` - The block number at which to build the path
     *
     * # Returns
     * A new `AccountLeafPathBuilder` instance ready to collect tree data.
     *
     * # Example
     * ```javascript
     * const accountCurveTree = await client.getAccountCurveTree();
     * const blockNumber = await accountCurveTree.getLastBlockNumber();
     * const leafIndex = accountState.leafIndex();
     * const builder = new AccountLeafPathBuilder(leafIndex, 4, blockNumber);
     * ```
     */
    constructor(leaf_index: bigint, height: number, block_number: number);
    /**
     * Sets a leaf value at the specified index.
     *
     * # Arguments
     * * `leaf_index` - The index of the leaf in the tree
     * * `leaf` - A `Uint8Array` containing the SCALE-encoded leaf value, or `null`/`undefined` to remove
     *
     * # Errors
     * * Throws an error if the leaf data cannot be decoded.
     *
     * # Example
     * ```javascript
     * const builder = new AccountLeafPathBuilder(leafIndex, 4, blockNumber);
     * const leaf = await client.getAccountLeaf(0, blockNumber);
     * builder.setLeaf(0, leaf);
     * ```
     */
    setLeaf(leaf_index: bigint, leaf?: any | null): void;
    /**
     * Sets an inner node at the specified location index.
     *
     * The location index corresponds to the position in the array returned by `getNodeLocations()`.
     *
     * # Arguments
     * * `location_index` - The index in the node locations array
     * * `node` - A `Uint8Array` containing the SCALE-encoded inner node, or `null`/`undefined` to remove
     *
     * # Errors
     * * Throws an error if the location index is out of bounds.
     * * Throws an error if the node data cannot be decoded.
     *
     * # Example
     * ```javascript
     * const builder = new AccountLeafPathBuilder(leafIndex, 4, blockNumber);
     * const nodeLocations = builder.getNodeLocations();
     * for (let i = 0; i < nodeLocations.length; i++) {
     *   const node = await client.getAccountInnerNode(nodeLocations[i], blockNumber);
     *   builder.setNodeAtIndex(i, node);
     * }
     * ```
     */
    setNodeAtIndex(location_index: number, node?: any | null): void;
    /**
     * Sets the tree root value.
     *
     * # Arguments
     * * `root` - A `Uint8Array` containing the SCALE-encoded tree root
     *
     * # Example
     * ```javascript
     * const builder = new AccountLeafPathBuilder(leafIndex, 4, blockNumber);
     * const root = await client.getAccountTreeRoot(blockNumber);
     * builder.setRoot(root);
     * ```
     */
    setRoot(root: Uint8Array): void;
}

/**
 * The public key component used for account identification in the account curve tree.
 *
 * This key is derived from the account secret key and is used to create account
 * commitments and verify zero-knowledge proofs. It can be safely shared publicly.
 *
 * # Example
 * ```javascript
 * // From AccountPublicKeys
 * const accountKey = publicKeys.accountPublicKey();
 *
 * // From hex string or bytes
 * const accountKey = new AccountPublicKey("0x1234...");
 * const accountKey = new AccountPublicKey(uint8Array);
 * ```
 */
export class AccountPublicKey {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Deserializes an account public key from a SCALE-encoded byte array.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing SCALE-encoded account public key data.
     *
     * # Returns
     * The deserialized `AccountPublicKey`.
     *
     * # Errors
     * * Throws an error if the byte array is invalid or corrupted.
     *
     * # Example
     * ```javascript
     * const accountKey = AccountPublicKey.fromBytes(keyBytes);
     * ```
     */
    static fromBytes(bytes: Uint8Array): AccountPublicKey;
    /**
     * Import account public key from a JsValue.
     */
    static fromJs(js_value: any): AccountPublicKeys;
    /**
     * Creates a new account public key from various input formats.
     *
     * # Arguments
     * * `js_value` - Can be any of:
     *   - A hex string with or without "0x" prefix (e.g., "0x1234...")
     *   - A 32-byte `Uint8Array`
     *   - A Polkadot.js `Codec` object with a `.toU8a()` method
     *
     * # Returns
     * A new `AccountPublicKey` object.
     *
     * # Errors
     * * Throws an error if the input format is not recognized or invalid.
     * * Throws an error if the decoded key is not 32 bytes.
     *
     * # Example
     * ```javascript
     * // From hex string
     * const key1 = new AccountPublicKey("0x1234...");
     *
     * // From Uint8Array
     * const key2 = new AccountPublicKey(new Uint8Array(32));
     *
     * // From Polkadot.js Codec
     * const assetDetail = await api.query.confidentialAssets.dartAssetDetails(assetId);
     * const auditor = assetDetail.auditors[0]; // Auditor key from chain storage
     * const key4 = new AccountPublicKey(auditor); // Automatically calls toU8a()
     * ```
     */
    constructor(js_value: any);
    /**
     * Serializes the account public key to a SCALE-encoded byte array.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded public key.
     *
     * # Example
     * ```javascript
     * const bytes = accountKey.toBytes();
     * ```
     */
    toBytes(): Uint8Array;
    /**
     * Exports the account public key as a JsValue for interoperability.
     */
    toJs(): any;
    /**
     * Exports the account public key as a JSON string for debugging purposes.
     *
     * # Returns
     * A JSON string representation of the account public key.
     *
     * # Errors
     * * Throws an error if serialization to JSON fails.
     *
     * # Example
     * ```javascript
     * console.log('Account Public Key:', accountKey.toJson());
     * ```
     */
    toJson(): string;
}

/**
 * Contains both the account public key and encryption public key for a confidential account.
 *
 * This type combines the two public keys needed for confidential asset operations:
 * - The account public key identifies the account in the account curve tree
 * - The encryption public key allows others to encrypt data for this account
 *
 * These keys can be safely shared publicly and are required for others to send
 * confidential assets to this account.
 *
 * # Example
 * ```javascript
 * const publicKeys = accountKeys.publicKeys();
 *
 * // Access individual keys
 * const accountKey = publicKeys.accountPublicKey();
 * const encryptionKey = publicKeys.encryptionPublicKey();
 *
 * // Use in settlement legs
 * const leg = new LegBuilder(senderKeys, publicKeys, assetState, amount);
 * ```
 */
export class AccountPublicKeys {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Extracts the account public key component.
     *
     * # Returns
     * The `AccountPublicKey` used for account identification in the curve tree.
     *
     * # Example
     * ```javascript
     * const accountKey = publicKeys.accountPublicKey();
     * ```
     */
    accountPublicKey(): AccountPublicKey;
    /**
     * Extracts the encryption public key component.
     *
     * # Returns
     * The `EncryptionPublicKey` used for encrypting data to this account.
     *
     * # Example
     * ```javascript
     * const encryptionKey = publicKeys.encryptionPublicKey();
     * ```
     */
    encryptionPublicKey(): EncryptionPublicKey;
    /**
     * Deserializes public keys from a SCALE-encoded byte array.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing SCALE-encoded public keys.
     *
     * # Returns
     * The deserialized `AccountPublicKeys`.
     *
     * # Errors
     * * Throws an error if the byte array is invalid or corrupted.
     *
     * # Example
     * ```javascript
     * const publicKeys = AccountPublicKeys.fromBytes(publicKeyBytes);
     * ```
     */
    static fromBytes(bytes: Uint8Array): AccountPublicKeys;
    /**
     * Import public keys from a JsValue.
     */
    static fromJs(js_value: any): AccountPublicKeys;
    /**
     * Creates `AccountPublicKeys` from various input formats.
     *
     * # Arguments
     * * `js_value` - Can be any of:
     *   - A 64-byte `Uint8Array`
     *   - JS map/object with `accountPublicKey` and `encryptionPublicKey` properties
     *
     * # Returns
     * A new `AccountPublicKeys` object.
     *
     * # Errors
     * * Throws an error if the input format is not recognized or invalid.
     *
     * # Example
     * ```javascript
     * // From Uint8Array
     * const publicKeys = new AccountPublicKeys(uint8Array);
     *
     * // From JS object
     * const publicKeys = new AccountPublicKeys({
     *   accountPublicKey: "0x1234...",
     *   encryptionPublicKey: "0x5678..."
     * });
     *
     * // Use in settlement legs
     * const leg = new LegBuilder(senderKeys, publicKeys, assetState, amount);
     * ```
     */
    constructor(keys: any);
    /**
     * Serializes the public keys to a SCALE-encoded byte array.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded public keys.
     *
     * # Example
     * ```javascript
     * const bytes = publicKeys.toBytes();
     * ```
     */
    toBytes(): Uint8Array;
    /**
     * Exports the public keys as a JsValue for interoperability.
     */
    toJs(): any;
    /**
     * Exports the public keys as a JSON string for debugging purposes.
     *
     * # Returns
     * A JSON string representation of the public keys.
     *
     * # Errors
     * * Throws an error if serialization to JSON fails.
     *
     * # Example
     * ```javascript
     * console.log('Public Keys:', publicKeys.toJson());
     * ```
     */
    toJson(): string;
}

/**
 * A zero-knowledge proof for registering a confidential account on-chain.
 *
 * This proof demonstrates ownership of the account keys without revealing the secret keys.
 * It must be submitted via `PolymeshSigner.registerAccount()` to create the account on-chain.
 *
 * # Example
 * ```javascript
 * const proof = accountKeys.registerAccountProof(myDid);
 * const result = await signer.registerAccount(proof);
 * console.log('Account registered with leaf index:', result.leafIndex());
 * ```
 */
export class AccountRegistrationProof {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Deserializes a proof from a SCALE-encoded byte array.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing SCALE-encoded proof data.
     *
     * # Returns
     * The deserialized `AccountRegistrationProof`.
     *
     * # Errors
     * * Throws an error if the byte array is invalid or corrupted.
     *
     * # Example
     * ```javascript
     * const proof = AccountRegistrationProof.fromBytes(proofBytes);
     * ```
     */
    static fromBytes(bytes: Uint8Array): AccountRegistrationProof;
    /**
     * Serializes the proof to a SCALE-encoded byte array.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded proof.
     *
     * # Example
     * ```javascript
     * const bytes = proof.toBytes();
     * ```
     */
    toBytes(): Uint8Array;
}

/**
 * Represents the on-chain commitment value stored in the account curve tree.
 *
 * This is a read-only snapshot of an account's state at a specific point in time,
 * containing the asset ID, balance, and transaction counter. Unlike `AccountAssetState`,
 * this type doesn't track pending changes and is primarily used for verification
 * and debugging purposes.
 *
 * # Example
 * ```javascript
 * // Typically obtained from on-chain queries or deserialization
 * const accountState = AccountState.fromBytes(stateBytes);
 * console.log('Asset ID:', accountState.assetId());
 * console.log('Balance:', accountState.balance());
 * console.log('Counter:', accountState.counter());
 * ```
 */
export class AccountState {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Gets the asset ID associated with this account state.
     *
     * # Returns
     * The numeric asset ID.
     *
     * # Example
     * ```javascript
     * const assetId = accountState.assetId();
     * ```
     */
    assetId(): number;
    /**
     * Gets the confidential balance for this account.
     *
     * # Returns
     * The balance as a `bigint`.
     *
     * # Example
     * ```javascript
     * const balance = accountState.balance();
     * ```
     */
    balance(): any;
    /**
     * Gets the pending transaction counter for this account.
     *
     * The counter increments with each transaction to prevent replay attacks and
     * ensure transaction ordering.
     *
     * # Returns
     * The counter value as a `bigint`.
     *
     * # Example
     * ```javascript
     * const counter = accountState.counter();
     * ```
     */
    counter(): bigint;
    /**
     * Deserializes account state from a SCALE-encoded byte array.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing SCALE-encoded account state data.
     *
     * # Returns
     * The deserialized `AccountState` object.
     *
     * # Errors
     * * Throws an error if the byte array is invalid or corrupted.
     *
     * # Example
     * ```javascript
     * const accountState = AccountState.fromBytes(encodedBytes);
     * ```
     */
    static fromBytes(bytes: Uint8Array): AccountState;
    /**
     * Serializes the account state to a SCALE-encoded byte array.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded state.
     *
     * # Example
     * ```javascript
     * const bytes = accountState.toBytes();
     * ```
     */
    toBytes(): Uint8Array;
    /**
     * Exports the account state as a JSON string for debugging purposes.
     *
     * # Returns
     * A JSON string representation of the state.
     *
     * # Errors
     * * Throws an error if serialization fails.
     *
     * # Example
     * ```javascript
     * console.log('State:', accountState.toJson());
     * ```
     */
    toJson(): string;
}

/**
 * Asset leaf path.
 *
 * Contains the curve tree path from an asset leaf to the root (without the root value itself).
 * Used when you only need the path structure without the specific root commitment.
 */
export class AssetLeafPath {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Imports an asset leaf path from a SCALE-encoded byte array.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing the SCALE-encoded path.
     *
     * # Returns
     * An `AssetLeafPath` instance.
     *
     * # Errors
     * * Throws an error if the bytes are not a valid SCALE-encoded asset leaf path.
     *
     * # Example
     * ```javascript
     * const path = AssetLeafPath.fromBytes(bytes);
     * ```
     */
    static fromBytes(bytes: Uint8Array): AssetLeafPath;
    /**
     * Exports the asset leaf path as a SCALE-encoded byte array.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded path.
     *
     * # Example
     * ```javascript
     * const assetLeafPathBuilder = new AssetLeafPathBuilder(leafIndex, height, blockNumber);
     * // ... set leaves and nodes ...
     * const path = assetLeafPathBuilder.buildLeafPath();
     * const bytes = path.toBytes();
     * ```
     */
    toBytes(): Uint8Array;
}

/**
 * Asset leaf path and root.
 *
 * Contains both the curve tree path from an asset leaf to the root and the root value itself
 * at a specific block number. Assets are stored in their own curve tree separate from accounts.
 * This structure is used when building settlement proofs to prove asset states.
 */
export class AssetLeafPathAndRoot {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Imports an asset leaf path and root from a SCALE-encoded byte array.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing the SCALE-encoded path and root.
     *
     * # Returns
     * An `AssetLeafPathAndRoot` instance.
     *
     * # Errors
     * * Throws an error if the bytes are not a valid SCALE-encoded asset leaf path and root.
     *
     * # Example
     * ```javascript
     * const pathAndRoot = AssetLeafPathAndRoot.fromBytes(bytes);
     * ```
     */
    static fromBytes(bytes: Uint8Array): AssetLeafPathAndRoot;
    /**
     * Gets the block number at which this root was generated.
     *
     * The block number indicates at which blockchain state the curve tree root was calculated.
     * This is critical for settlement proofs as they must reference a specific block state.
     *
     * # Returns
     * The block number as a `u32`.
     *
     * # Errors
     * * Throws an error if the block number cannot be extracted from the path.
     *
     * # Example
     * ```javascript
     * const assetCurveTree = await client.getAssetCurveTree();
     * const pathAndRoot = await assetCurveTree.getLeafPathAndRoot(assetState.leafIndex());
     * const blockNumber = pathAndRoot.getBlockNumber();
     * console.log(`Asset root at block ${blockNumber}`);
     * ```
     */
    getBlockNumber(): number;
    /**
     * Extracts the asset tree root from the path and root.
     *
     * The root represents the commitment to all asset states in the tree at a specific block.
     *
     * # Returns
     * An `AssetTreeRoot` instance.
     *
     * # Errors
     * * Throws an error if the root cannot be extracted from the path.
     *
     * # Example
     * ```javascript
     * const assetCurveTree = await client.getAssetCurveTree();
     * const pathAndRoot = await assetCurveTree.getLeafPathAndRoot(assetState.leafIndex());
     * const root = pathAndRoot.getRoot();
     * ```
     */
    getRoot(): AssetTreeRoot;
    /**
     * Exports the asset leaf path and root as a SCALE-encoded byte array.
     *
     * This is useful for storing or transmitting the path and root in a compact binary format.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded path and root.
     *
     * # Example
     * ```javascript
     * const assetCurveTree = await client.getAssetCurveTree();
     * const pathAndRoot = await assetCurveTree.getLeafPathAndRoot(assetState.leafIndex());
     * const bytes = pathAndRoot.toBytes();
     * // Store or transmit bytes
     * ```
     */
    toBytes(): Uint8Array;
}

/**
 * Asset leaf path builder.
 *
 * A utility for incrementally building curve tree paths for assets in the asset curve tree.
 * This builder helps you construct paths by querying on-chain data (leaves, inner nodes, and roots)
 * and assembling them into a complete path structure.
 *
 * # Workflow
 * 1. Create a new builder with the target leaf index, tree height, and block number
 * 2. Get the list of node locations needed from `getNodeLocations()`
 * 3. Query the blockchain for inner nodes at those locations
 * 4. Get the range of leaf indices needed from `getMinLeafIndex()` / `getMaxLeafIndex()`
 * 5. Query the blockchain for those leaves
 * 6. Query the blockchain for the tree root at the block number
 * 7. Set all the data using `setLeaf()`, `setNodeAtIndex()`, and `setRoot()`
 * 8. Build the final path with `buildLeafPath()` or `buildLeafPathWithRoot()`
 *
 * # Example
 * ```javascript
 * const assetCurveTree = await client.getAssetCurveTree();
 * const blockNumber = await assetCurveTree.getLastBlockNumber();
 * const leafIndex = assetState.leafIndex();
 *
 * // Create the builder
 * const builder = new AssetLeafPathBuilder(leafIndex, 4, blockNumber);
 *
 * // Query and set leaves
 * const minLeaf = builder.getMinLeafIndex();
 * const maxLeaf = builder.getMaxLeafIndex();
 * for (let i = minLeaf; i < maxLeaf; i++) {
 *   const leaf = await client.getAssetLeaf(i, blockNumber);
 *   builder.setLeaf(i, leaf);
 * }
 *
 * // Query and set inner nodes
 * const nodeLocations = builder.getNodeLocations();
 * for (let i = 0; i < nodeLocations.length; i++) {
 *   const node = await client.getAssetInnerNode(nodeLocations[i], blockNumber);
 *   builder.setNodeAtIndex(i, node);
 * }
 *
 * // Query and set root
 * const root = await client.getAssetTreeRoot(blockNumber);
 * builder.setRoot(root);
 *
 * // Build the path
 * const pathAndRoot = builder.buildLeafPathWithRoot();
 * ```
 */
export class AssetLeafPathBuilder {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Builds the asset leaf path (without the root).
     *
     * Constructs the curve tree path from the target leaf to the root using the leaves and nodes
     * that have been set. The root itself is not included in the result.
     *
     * # Returns
     * An `AssetLeafPath` instance containing the curve tree path.
     *
     * # Errors
     * * Throws an error if required leaves or nodes have not been set.
     * * Throws an error if the path cannot be constructed.
     *
     * # Example
     * ```javascript
     * const builder = new AssetLeafPathBuilder(leafIndex, 4, blockNumber);
     * // ... set all leaves and nodes ...
     * const path = builder.buildLeafPath();
     * ```
     */
    buildLeafPath(): AssetLeafPath;
    /**
     * Builds the asset leaf path with the root included.
     *
     * Constructs the complete curve tree path from the target leaf to the root, including the root value.
     * This is the most common method used as proofs typically require both the path and the root.
     *
     * # Returns
     * An `AssetLeafPathAndRoot` instance containing both the curve tree path and the root.
     *
     * # Errors
     * * Throws an error if required leaves, nodes, or root have not been set.
     * * Throws an error if the path cannot be constructed.
     *
     * # Example
     * ```javascript
     * const builder = new AssetLeafPathBuilder(leafIndex, 4, blockNumber);
     *
     * // Set all leaves
     * const minLeaf = builder.getMinLeafIndex();
     * const maxLeaf = builder.getMaxLeafIndex();
     * for (let i = minLeaf; i < maxLeaf; i++) {
     *   const leaf = await client.getAssetLeaf(i, blockNumber);
     *   builder.setLeaf(i, leaf);
     * }
     *
     * // Set all inner nodes
     * const nodeLocations = builder.getNodeLocations();
     * for (let i = 0; i < nodeLocations.length; i++) {
     *   const node = await client.getAssetInnerNode(nodeLocations[i], blockNumber);
     *   builder.setNodeAtIndex(i, node);
     * }
     *
     * // Set the root
     * const root = await client.getAssetTreeRoot(blockNumber);
     * builder.setRoot(root);
     *
     * // Build the complete path with root
     * const pathAndRoot = builder.buildLeafPathWithRoot();
     * ```
     */
    buildLeafPathWithRoot(): AssetLeafPathAndRoot;
    /**
     * Returns the `L` parameter of the asset tree.
     *
     * This represents the branching factor (arity) of the tree - how many children each node has.
     *
     * # Returns
     * The tree arity as a number (typically 4 for asset trees).
     *
     * # Example
     * ```javascript
     * const builder = new AssetLeafPathBuilder(leafIndex, 4, blockNumber);
     * console.log(`Tree arity: ${builder.getL()}`); // 4
     * ```
     */
    getL(): number;
    /**
     * Gets the list of leaf indices that need to be queried from the blockchain.
     *
     * Returns all sibling leaf indices along the path to the target leaf.
     *
     * # Returns
     * An array of leaf indices (as numbers).
     *
     * # Example
     * ```javascript
     * const builder = new AssetLeafPathBuilder(leafIndex, 4, blockNumber);
     * const leafIndices = builder.getLeafIndices();
     * for (const index of leafIndices) {
     *   const leaf = await client.getAssetLeaf(index, blockNumber);
     *   builder.setLeaf(index, leaf);
     * }
     * ```
     */
    getLeafIndices(): BigUint64Array;
    /**
     * Returns the `M` parameter of the asset tree.
     *
     * This represents the maximum number of children stored in each compressed inner node.
     *
     * # Returns
     * The compression parameter as a number.
     *
     * # Example
     * ```javascript
     * const builder = new AssetLeafPathBuilder(leafIndex, 4, blockNumber);
     * console.log(`Compression parameter: ${builder.getM()}`);
     * ```
     */
    getM(): number;
    /**
     * Gets the maximum leaf index that needs to be queried.
     *
     * Combined with `getMinLeafIndex()`, this defines a range of leaves to query.
     *
     * # Returns
     * The maximum leaf index as a number (exclusive - use `i < maxLeaf` in loops).
     *
     * # Example
     * ```javascript
     * const builder = new AssetLeafPathBuilder(leafIndex, 4, blockNumber);
     * const minLeaf = builder.getMinLeafIndex();
     * const maxLeaf = builder.getMaxLeafIndex();
     * for (let i = minLeaf; i < maxLeaf; i++) {
     *   const leaf = await client.getAssetLeaf(i, blockNumber);
     *   builder.setLeaf(i, leaf);
     * }
     * ```
     */
    getMaxLeafIndex(): bigint;
    /**
     * Gets the minimum leaf index that needs to be queried.
     *
     * Combined with `getMaxLeafIndex()`, this defines a range of leaves to query.
     *
     * # Returns
     * The minimum leaf index as a number.
     *
     * # Example
     * ```javascript
     * const builder = new AssetLeafPathBuilder(leafIndex, 4, blockNumber);
     * const minLeaf = builder.getMinLeafIndex();
     * const maxLeaf = builder.getMaxLeafIndex();
     * for (let i = minLeaf; i < maxLeaf; i++) {
     *   const leaf = await client.getAssetLeaf(i, blockNumber);
     *   builder.setLeaf(i, leaf);
     * }
     * ```
     */
    getMinLeafIndex(): bigint;
    /**
     * Gets the list of inner node locations that need to be queried from the blockchain.
     *
     * Returns an array of SCALE-encoded node locations. These should be used to query
     * the on-chain storage for inner nodes.
     *
     * # Returns
     * An array of `Uint8Array` values, each representing a SCALE-encoded node location.
     *
     * # Example
     * ```javascript
     * const builder = new AssetLeafPathBuilder(leafIndex, 4, blockNumber);
     * const nodeLocations = builder.getNodeLocations();
     * for (let i = 0; i < nodeLocations.length; i++) {
     *   const node = await client.getAssetInnerNode(nodeLocations[i], blockNumber);
     *   builder.setNodeAtIndex(i, node);
     * }
     * ```
     */
    getNodeLocations(): Uint8Array[];
    /**
     * Creates a new asset leaf path builder.
     *
     * # Arguments
     * * `leaf_index` - The index of the target leaf in the tree (typically from `assetState.leafIndex()`)
     * * `height` - The height of the tree (typically 4 for asset trees)
     * * `block_number` - The block number at which to build the path
     *
     * # Returns
     * A new `AssetLeafPathBuilder` instance ready to collect tree data.
     *
     * # Example
     * ```javascript
     * const assetCurveTree = await client.getAssetCurveTree();
     * const blockNumber = await assetCurveTree.getLastBlockNumber();
     * const leafIndex = assetState.leafIndex();
     * const builder = new AssetLeafPathBuilder(leafIndex, 4, blockNumber);
     * ```
     */
    constructor(leaf_index: bigint, height: number, block_number: number);
    /**
     * Sets a leaf value at the specified index.
     *
     * # Arguments
     * * `leaf_index` - The index of the leaf in the tree
     * * `leaf` - A `Uint8Array` containing the SCALE-encoded leaf value, or `null`/`undefined` to remove
     *
     * # Errors
     * * Throws an error if the leaf data cannot be decoded.
     *
     * # Example
     * ```javascript
     * const builder = new AssetLeafPathBuilder(leafIndex, 4, blockNumber);
     * const leaf = await client.getAssetLeaf(0, blockNumber);
     * builder.setLeaf(0, leaf);
     * ```
     */
    setLeaf(leaf_index: bigint, leaf?: any | null): void;
    /**
     * Sets an inner node at the specified location index.
     *
     * The location index corresponds to the position in the array returned by `getNodeLocations()`.
     *
     * # Arguments
     * * `location_index` - The index in the node locations array
     * * `node` - A `Uint8Array` containing the SCALE-encoded inner node, or `null`/`undefined` to remove
     *
     * # Errors
     * * Throws an error if the location index is out of bounds.
     * * Throws an error if the node data cannot be decoded.
     *
     * # Example
     * ```javascript
     * const builder = new AssetLeafPathBuilder(leafIndex, 4, blockNumber);
     * const nodeLocations = builder.getNodeLocations();
     * for (let i = 0; i < nodeLocations.length; i++) {
     *   const node = await client.getAssetInnerNode(nodeLocations[i], blockNumber);
     *   builder.setNodeAtIndex(i, node);
     * }
     * ```
     */
    setNodeAtIndex(location_index: number, node?: any | null): void;
    /**
     * Sets the tree root value.
     *
     * # Arguments
     * * `root` - A `Uint8Array` containing the SCALE-encoded tree root
     *
     * # Example
     * ```javascript
     * const builder = new AssetLeafPathBuilder(leafIndex, 4, blockNumber);
     * const root = await client.getAssetTreeRoot(blockNumber);
     * builder.setRoot(root);
     * ```
     */
    setRoot(root: Uint8Array): void;
}

/**
 * A zero-knowledge proof that allows minting new confidential assets.
 *
 * This proof demonstrates that the account holder has the authority to mint assets
 * without revealing the amount being minted or the account details. Only authorized
 * issuers can generate valid minting proofs for their assets.
 *
 * # Example
 * ```javascript
 * const mintingProof = accountState.assetMintingProof(keys, path, 1000000n);
 * const results = await issuer.mintAsset(mintingProof);
 * accountState.commitPendingState(results.leafIndex());
 * ```
 */
export class AssetMintingProof {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Deserializes a minting proof from a SCALE-encoded byte array.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing SCALE-encoded minting proof data.
     *
     * # Returns
     * The deserialized `AssetMintingProof` object.
     *
     * # Errors
     * * Throws an error if the byte array is invalid or corrupted.
     *
     * # Example
     * ```javascript
     * const mintingProof = AssetMintingProof.fromBytes(storedBytes);
     * ```
     */
    static fromBytes(bytes: Uint8Array): AssetMintingProof;
    /**
     * Deserializes a minting proof from a hexadecimal string.
     *
     * # Arguments
     * * `hex_str` - A hex-encoded string containing the proof data.
     *
     * # Returns
     * The deserialized `AssetMintingProof` object.
     *
     * # Errors
     * * Throws an error if the hex string is invalid or contains non-hex characters.
     * * Throws an error if the decoded bytes don't represent a valid proof.
     *
     * # Example
     * ```javascript
     * const mintingProof = AssetMintingProof.fromHex('0xabcd1234...');
     * ```
     */
    static fromHex(hex_str: string): AssetMintingProof;
    /**
     * Serializes the proof to a SCALE-encoded byte array.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded proof.
     *
     * # Example
     * ```javascript
     * const bytes = mintingProof.toBytes();
     * console.log('Proof size:', bytes.length, 'bytes');
     * ```
     */
    toBytes(): Uint8Array;
    /**
     * Exports the proof as a hexadecimal string.
     *
     * # Returns
     * A hex-encoded string representation of the proof.
     *
     * # Example
     * ```javascript
     * const hexString = mintingProof.toHex();
     * ```
     */
    toHex(): string;
}

/**
 * Represents the confidential asset state stored in the asset curve tree.
 *
 * This type contains the asset's unique identifier and the encryption public keys
 * of all mediators and auditors associated with the asset. This information is needed
 * to encrypt settlement legs so that mediators and auditors can decrypt and verify
 * confidential transactions.
 *
 * # Examples
 * ```javascript
 * // From Polkadot.js chain data (recommended)
 * const assetDetail = await api.query.confidentialAssets.dartAssetDetails(assetId);
 * const assetState = new AssetState(assetId, assetDetail.mediators, assetDetail.auditors);
 *
 * // From pre-converted keys
 * const mediatorKey = new EncryptionPublicKey("0x1234...");
 * const auditorKey = new EncryptionPublicKey("0x5678...");
 * const assetState = new AssetState(assetId, [mediatorKey], [auditorKey]);
 *
 * // Use in settlement legs
 * const leg = new LegBuilder(senderKeys, receiverKeys, assetState, amount);
 * ```
 */
export class AssetState {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Gets the unique asset identifier.
     *
     * # Returns
     * The asset ID as a number.
     *
     * # Example
     * ```javascript
     * const assetId = assetState.assetId();
     * console.log('Asset ID:', assetId);
     * ```
     */
    assetId(): number;
    /**
     * Gets the number of auditors associated with this asset.
     *
     * # Returns
     * The count of auditors as a number.
     *
     * # Example
     * ```javascript
     * console.log('Auditors:', assetState.auditorCount());
     * ```
     */
    auditorCount(): number;
    /**
     * Deserializes asset state from a SCALE-encoded byte array.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing SCALE-encoded asset state data.
     *
     * # Returns
     * The deserialized `AssetState` object.
     *
     * # Errors
     * * Throws an error if the byte array is invalid or corrupted.
     *
     * # Example
     * ```javascript
     * const storedBytes = JSON.parse(localStorage.getItem('assetState'));
     * const assetState = AssetState.fromBytes(new Uint8Array(storedBytes));
     * ```
     */
    static fromBytes(bytes: Uint8Array): AssetState;
    /**
     * Gets the leaf index of this asset in the asset curve tree.
     *
     * The leaf index is used to retrieve the asset's curve tree path for settlement proofs.
     * Currently this is the same as the asset ID, but may change in future versions.
     *
     * # Returns
     * The leaf index as a `bigint` (u64).
     *
     * # Example
     * ```javascript
     * const leafIndex = assetState.leafIndex();
     * const path = await assetCurveTree.getLeafPath(leafIndex);
     * settlementBuilder.addAssetPath(assetId, path);
     * ```
     */
    leafIndex(): bigint;
    /**
     * Gets the number of mediators associated with this asset.
     *
     * # Returns
     * The count of mediators as a number.
     *
     * # Example
     * ```javascript
     * console.log('Mediators:', assetState.mediatorCount());
     * ```
     */
    mediatorCount(): number;
    /**
     * Creates a new asset state from raw chain data or pre-converted encryption keys.
     *
     * This constructor automatically converts raw key data from various sources into
     * `EncryptionPublicKey` objects. It's especially useful when querying the Polymesh chain
     * for mediators and auditors using Polkadot.js, which returns keys as `Codec` objects
     * with `.toU8a()` methods.
     *
     * # Arguments
     * * `asset_id` - The unique identifier for this confidential asset (as a number).
     * * `mediators` - Array of raw key data or `EncryptionPublicKey` objects. Each element can be:
     *   - An existing `EncryptionPublicKey` object
     *   - A `Uint8Array` (32 bytes)
     *   - A hex string with or without "0x" prefix
     *   - Any Polkadot.js `Codec` object with a `.toU8a()` method
     * * `auditors` - Array of raw key data in the same formats as mediators.
     *
     * # Returns
     * A new `AssetState` object.
     *
     * # Errors
     * * Throws an error if any key cannot be decoded or is invalid.
     *
     * # Examples
     * ```javascript
     * // From Polkadot.js chain data (recommended)
     * const assetKeys = await api.query.confidentialAssets.keys(assetId);
     * const assetState = new AssetState(assetId, assetKeys);
     *
     * // Use in settlement legs
     * const leg = new LegBuilder(senderKeys, receiverKeys, assetState, amount);
     * ```
     */
    constructor(asset_id: number, asset_keys: any);
    /**
     * Serializes the asset state to a SCALE-encoded byte array.
     *
     * This allows you to store the asset state off-chain and restore it later.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded asset state.
     *
     * # Example
     * ```javascript
     * const bytes = assetState.toBytes();
     * localStorage.setItem('assetState', JSON.stringify(Array.from(bytes)));
     * ```
     */
    toBytes(): Uint8Array;
    /**
     * Exports the asset state as a JSON string for debugging purposes.
     *
     * # Returns
     * A JSON string representation of the asset state.
     *
     * # Errors
     * * Throws an error if serialization to JSON fails.
     *
     * # Example
     * ```javascript
     * console.log('Asset State:', assetState.toJson());
     * ```
     */
    toJson(): string;
}

/**
 * Asset tree root.
 *
 * Represents the root commitment of the asset curve tree at a specific point in time.
 * This root is used in settlement proofs to verify that asset states are valid.
 */
export class AssetTreeRoot {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Imports an asset tree root from a SCALE-encoded byte array.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing the SCALE-encoded root.
     *
     * # Returns
     * An `AssetTreeRoot` instance.
     *
     * # Errors
     * * Throws an error if the bytes are not a valid SCALE-encoded asset tree root.
     *
     * # Example
     * ```javascript
     * const root = AssetTreeRoot.fromBytes(bytes);
     * ```
     */
    static fromBytes(bytes: Uint8Array): AssetTreeRoot;
    /**
     * Exports the asset tree root as a SCALE-encoded byte array.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded root.
     *
     * # Example
     * ```javascript
     * const assetCurveTree = await client.getAssetCurveTree();
     * const pathAndRoot = await assetCurveTree.getLeafPathAndRoot(assetState.leafIndex());
     * const root = pathAndRoot.getRoot();
     * const bytes = root.toBytes();
     * ```
     */
    toBytes(): Uint8Array;
}

/**
 * A batched collection of account asset registration proofs for multiple accounts.
 *
 * This allows registering multiple accounts for an asset in a single transaction,
 * which is more efficient than registering each account individually.
 *
 * # Example
 * ```javascript
 * // Typically created from individual registration proofs
 * const batchedProof = registration.getBatchedProof();
 * const bytes = batchedProof.toBytes();
 * ```
 */
export class BatchedAccountAssetRegistrationProof {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Deserializes a batched proof from a SCALE-encoded byte array.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing SCALE-encoded batched proof data.
     *
     * # Returns
     * The deserialized `BatchedAccountAssetRegistrationProof` object.
     *
     * # Errors
     * * Throws an error if the byte array is invalid or corrupted.
     *
     * # Example
     * ```javascript
     * const batchedProof = BatchedAccountAssetRegistrationProof.fromBytes(bytes);
     * ```
     */
    static fromBytes(bytes: Uint8Array): BatchedAccountAssetRegistrationProof;
    /**
     * Serializes the batched proof to a SCALE-encoded byte array.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded batched proof.
     *
     * # Example
     * ```javascript
     * const bytes = batchedProof.toBytes();
     * ```
     */
    toBytes(): Uint8Array;
}

/**
 * Contains the encryption secret key for decrypting confidential transaction data.
 *
 * This type is used by mediators and auditors to decrypt settlement leg information.
 * It can also be extracted from `AccountKeys` for accounts to decrypt their own
 * transaction details.
 *
 * # Example
 * ```javascript
 * // Extract from account keys
 * const encKeyPair = accountKeys.encryptionKeyPair();
 *
 * // Decrypt settlement legs as mediator/auditor
 * const decryptedLegs = settlementLegs.tryDecryptAsMediatorOrAuditor(encKeyPair);
 * ```
 */
export class EncryptionKeyPair {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Clears the encryption secret key from memory by zeroing it out.
     *
     * The `EncryptionKeyPair` instance can't be used after calling this method.
     */
    clear(): void;
}

/**
 * The public key used for encrypting confidential transaction data.
 *
 * This key allows others to encrypt settlement leg information and transaction
 * details that only the holder of the corresponding secret key can decrypt.
 * It's essential for maintaining confidentiality in settlements.
 *
 * # Example
 * ```javascript
 * // From AccountPublicKeys
 * const encKey = publicKeys.encryptionPublicKey();
 *
 * // From hex string or bytes
 * const encKey = new EncryptionPublicKey("0x1234...");
 * const encKey = new EncryptionPublicKey(uint8Array);
 *
 * // Use in AssetState
 * const assetState = new AssetState(assetId, [mediatorEncKey], [auditorEncKey]);
 * ```
 */
export class EncryptionPublicKey {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Deserializes an encryption public key from a SCALE-encoded byte array.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing SCALE-encoded encryption public key data.
     *
     * # Returns
     * The deserialized `EncryptionPublicKey`.
     *
     * # Errors
     * * Throws an error if the byte array is invalid or corrupted.
     *
     * # Example
     * ```javascript
     * const encryptionKey = EncryptionPublicKey.fromBytes(keyBytes);
     * ```
     */
    static fromBytes(bytes: Uint8Array): EncryptionPublicKey;
    /**
     * Import encryption public key from a JsValue.
     */
    static fromJs(js_value: any): EncryptionPublicKey;
    /**
     * Creates a new encryption public key from various input formats.
     *
     * # Arguments
     * * `js_value` - Can be any of:
     *   - A hex string with or without "0x" prefix (e.g., "0x1234...")
     *   - A 32-byte `Uint8Array`
     *   - A Polkadot.js `Codec` object with a `.toU8a()` method
     *
     * # Returns
     * A new `EncryptionPublicKey` object.
     *
     * # Errors
     * * Throws an error if the input format is not recognized or invalid.
     * * Throws an error if the decoded key is not 32 bytes.
     *
     * # Example
     * ```javascript
     * // From hex string
     * const key1 = new EncryptionPublicKey("0x1234...");
     *
     * // From Uint8Array
     * const key2 = new EncryptionPublicKey(new Uint8Array(32));
     *
     * // From Polkadot.js Codec
     * const assetDetail = await api.query.confidentialAssets.dartAssetDetails(assetId);
     * const mediator = assetDetail.mediators[0]; // Mediator key from chain storage
     * const key4 = new EncryptionPublicKey(mediator); // Automatically calls toU8a()
     * ```
     */
    constructor(js_value: any);
    /**
     * Serializes the encryption public key to a SCALE-encoded byte array.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded public key.
     *
     * # Example
     * ```javascript
     * const bytes = encryptionKey.toBytes();
     * ```
     */
    toBytes(): Uint8Array;
    /**
     * Exports the encryption public key as a JsValue for interoperability.
     */
    toJs(): any;
    /**
     * Exports the encryption public key as a JSON string for debugging purposes.
     *
     * # Returns
     * A JSON string representation of the encryption public key.
     *
     * # Errors
     * * Throws an error if serialization to JSON fails.
     *
     * # Example
     * ```javascript
     * console.log('Encryption Public Key:', encryptionKey.toJson());
     * ```
     */
    toJson(): string;
}

/**
 * Fee account leaf path and root.
 *
 * Contains both the curve tree path from a fee account leaf to the root and the root value itself
 * at a specific block number. Used for generating zero-knowledge proofs about fee account states.
 */
export class FeeAccountLeafPathAndRoot {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Imports a fee account leaf path and root from a SCALE-encoded byte array.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing the SCALE-encoded path and root.
     *
     * # Returns
     * A `FeeAccountLeafPathAndRoot` instance.
     *
     * # Errors
     * * Throws an error if the bytes are not a valid SCALE-encoded fee account leaf path and root.
     *
     * # Example
     * ```javascript
     * const pathAndRoot = FeeAccountLeafPathAndRoot.fromBytes(bytes);
     * ```
     */
    static fromBytes(bytes: Uint8Array): FeeAccountLeafPathAndRoot;
    /**
     * Exports the fee account leaf path and root as a SCALE-encoded byte array.
     *
     * This is useful for storing or transmitting the path and root in a compact binary format.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded path and root.
     *
     * # Example
     * ```javascript
     * const feeAccountCurveTree = await client.getFeeAccountCurveTree();
     * const pathAndRoot = await feeAccountCurveTree.getLeafPathAndRoot(leafIndex);
     * const bytes = pathAndRoot.toBytes();
     * // Store or transmit bytes
     * ```
     */
    toBytes(): Uint8Array;
}

/**
 * Holds the information needed for a single transfer leg in a settlement.
 *
 * A leg represents a confidential transfer of a specific amount of an asset from one
 * account to another. The leg builder contains all the public information needed to
 * encrypt the leg details and generate the settlement proof.
 *
 * # Example
 * ```javascript
 * // Create a leg to transfer 1000 units from sender to receiver
 * const leg = new LegBuilder(
 *     senderPublicKeys,
 *     receiverPublicKeys,
 *     assetState,
 *     1000n  // amount as BigInt
 * );
 *
 * // Add to settlement
 * settlementBuilder.addLeg(leg);
 * ```
 */
export class LegBuilder {
    /**
     ** Return copy of self without private attributes.
     */
    toJSON(): Object;
    /**
     * Return stringified version of self.
     */
    toString(): string;
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Creates a new transfer leg for a settlement.
     *
     * # Arguments
     * * `sender` - The sender's account public keys (`AccountPublicKeys`).
     * * `receiver` - The receiver's account public keys (`AccountPublicKeys`).
     * * `asset` - The asset state containing mediator and auditor encryption keys (`AssetState`).
     * * `amount` - The amount to transfer. Accepts:
     *   - JavaScript number (e.g., `1000`)
     *   - JavaScript BigInt (e.g., `1000n`)
     *   - Decimal string (e.g., `"1000"`)
     *   - Hex string with 0x prefix (e.g., `"0x3e8"`)
     *
     * # Returns
     * A new `LegBuilder` instance.
     *
     * # Errors
     * * Throws an error if the amount format is invalid.
     *
     * # On-chain Data
     * All the required information can be queried from on-chain:
     * - `confidentialAssets.accountEncryptionKey(accountPublicKey)` - Get encryption keys
     * - `confidentialAssets.dartAssetDetails(assetId)` - Get asset mediators/auditors
     *
     * # Example
     * ```javascript
     * const leg = new LegBuilder(
     *     issuerPublicKeys,
     *     investorPublicKeys,
     *     assetState,
     *     250n  // Transfer 250 units
     * );
     * settlementBuilder.addLeg(leg);
     * ```
     */
    constructor(sender: AccountPublicKeys, receiver: AccountPublicKeys, asset: AssetState, amount: any);
    amount: bigint;
    asset: AssetState;
    receiver: AccountPublicKeys;
    sender: AccountPublicKeys;
}

/**
 * MasterSeed for deriving account keys.
 */
export class MasterSeed {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Derive a new AccountKeys from this MasterSeed.
     *
     * # Arguments
     * * `path` - The derivation path string (e.g., "m/44'/595'/0'/0/0").
     *
     * # Returns
     * A new `AccountKeys` object derived from the master seed.
     */
    deriveAccountKeys(path: string): AccountKeys;
    /**
     * Creates a new MasterSeed from a hexadecimal seed string.
     *
     * # Arguments
     * * `seed` - A seed phrase or "0x"-prefixed hexadecimal string used to derive the master seed.
     *
     * # Returns
     * A new `MasterSeed` object containing the generated seed.
     *
     * # Example
     * ```javascript
     * const masterSeed = new MasterSeed("my-secure-seed-phrase");
     * ```
     */
    constructor(seed: string);
}

/**
 * Zero-knowledge proof for mediator affirmation of a settlement.
 *
 * Mediators (also called auditors) are special parties that can observe and validate
 * confidential settlements. They generate this proof to affirm a settlement using their
 * encryption keys. This allows them to audit the settlement without blocking it.
 *
 * # Example
 * ```javascript
 * // Decrypt and verify the settlement leg as mediator
 * const decryptedLeg = encryptedLeg.decrypt(mediatorEncryptionKey);
 *
 * // Mediator generates affirmation proof (implementation dependent on use case)
 * const proof = ...; // Generated through mediator-specific flow
 *
 * // Submit the affirmation
 * const result = await mediator.mediatorAffirmation(proof);
 * ```
 */
export class MediatorAffirmationProof {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Imports a proof from a SCALE-encoded byte array.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing the SCALE-encoded proof.
     *
     * # Returns
     * A `MediatorAffirmationProof` instance.
     *
     * # Errors
     * * Throws an error if the bytes are not a valid SCALE-encoded mediator affirmation proof.
     *
     * # Example
     * ```javascript
     * const proof = MediatorAffirmationProof.fromBytes(bytes);
     * ```
     */
    static fromBytes(bytes: Uint8Array): MediatorAffirmationProof;
    /**
     * Imports a proof from a hex-encoded string.
     *
     * # Arguments
     * * `hex_str` - A hex string representing the SCALE-encoded proof (with or without "0x" prefix).
     *
     * # Returns
     * A `MediatorAffirmationProof` instance.
     *
     * # Errors
     * * Throws an error if the string is not valid hex.
     * * Throws an error if the decoded bytes are not a valid mediator affirmation proof.
     *
     * # Example
     * ```javascript
     * const proof = MediatorAffirmationProof.fromHex("a1b2c3...");
     * ```
     */
    static fromHex(hex_str: string): MediatorAffirmationProof;
    /**
     * Exports the proof as a SCALE-encoded byte array.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded proof.
     *
     * # Example
     * ```javascript
     * const bytes = proof.toBytes();
     * ```
     */
    toBytes(): Uint8Array;
    /**
     * Exports the proof as a hex-encoded string.
     *
     * # Returns
     * A hex string (without "0x" prefix) representing the SCALE-encoded proof.
     *
     * # Example
     * ```javascript
     * const hexString = proof.toHex();
     * ```
     */
    toHex(): string;
}

/**
 * Zero-knowledge proof that the receiver affirms a settlement leg.
 *
 * This proof is generated by the receiver to affirm their participation in a settlement leg.
 * After the receiver affirms, they can later claim the transferred assets.
 * The proof is submitted on-chain via the `receiverAffirmation` transaction.
 *
 * # Example
 * ```javascript
 * // Generate receiver affirmation proof
 * const proof = investorAccountState.receiverAffirmProof(
 *   investorKeys,
 *   accountPath,
 *   settlementRef,
 *   legId,
 *   encryptedLeg,
 *   assetId,
 *   amount
 * );
 *
 * // Submit the affirmation
 * const result = await investor.receiverAffirmation(proof);
 * ```
 */
export class ReceiverAffirmationProof {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Imports a proof from a SCALE-encoded byte array.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing the SCALE-encoded proof.
     *
     * # Returns
     * A `ReceiverAffirmationProof` instance.
     *
     * # Errors
     * * Throws an error if the bytes are not a valid SCALE-encoded receiver affirmation proof.
     *
     * # Example
     * ```javascript
     * const proof = ReceiverAffirmationProof.fromBytes(bytes);
     * ```
     */
    static fromBytes(bytes: Uint8Array): ReceiverAffirmationProof;
    /**
     * Imports a proof from a hex-encoded string.
     *
     * # Arguments
     * * `hex_str` - A hex string representing the SCALE-encoded proof (with or without "0x" prefix).
     *
     * # Returns
     * A `ReceiverAffirmationProof` instance.
     *
     * # Errors
     * * Throws an error if the string is not valid hex.
     * * Throws an error if the decoded bytes are not a valid receiver affirmation proof.
     *
     * # Example
     * ```javascript
     * const proof = ReceiverAffirmationProof.fromHex("a1b2c3...");
     * ```
     */
    static fromHex(hex_str: string): ReceiverAffirmationProof;
    /**
     * Exports the proof as a SCALE-encoded byte array.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded proof.
     *
     * # Example
     * ```javascript
     * const bytes = proof.toBytes();
     * ```
     */
    toBytes(): Uint8Array;
    /**
     * Exports the proof as a hex-encoded string.
     *
     * # Returns
     * A hex string (without "0x" prefix) representing the SCALE-encoded proof.
     *
     * # Example
     * ```javascript
     * const hexString = proof.toHex();
     * ```
     */
    toHex(): string;
}

/**
 * Zero-knowledge proof for claiming assets from a settlement leg.
 *
 * After a settlement leg has been affirmed by both sender and receiver, the receiver
 * generates this proof to claim the transferred assets. This updates the receiver's
 * on-chain balance commitment. The proof is submitted via the `receiverClaim` transaction.
 *
 * # Example
 * ```javascript
 * // Generate claim proof
 * const proof = investorAccountState.receiverClaimProof(
 *   investorKeys,
 *   accountPath,
 *   settlementRef,
 *   legId,
 *   encryptedLeg,
 *   assetId,
 *   amount
 * );
 *
 * // Submit the claim
 * const result = await investor.receiverClaim(proof);
 * ```
 */
export class ReceiverClaimProof {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Imports a proof from a SCALE-encoded byte array.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing the SCALE-encoded proof.
     *
     * # Returns
     * A `ReceiverClaimProof` instance.
     *
     * # Errors
     * * Throws an error if the bytes are not a valid SCALE-encoded receiver claim proof.
     *
     * # Example
     * ```javascript
     * const proof = ReceiverClaimProof.fromBytes(bytes);
     * ```
     */
    static fromBytes(bytes: Uint8Array): ReceiverClaimProof;
    /**
     * Imports a proof from a hex-encoded string.
     *
     * # Arguments
     * * `hex_str` - A hex string representing the SCALE-encoded proof (with or without "0x" prefix).
     *
     * # Returns
     * A `ReceiverClaimProof` instance.
     *
     * # Errors
     * * Throws an error if the string is not valid hex.
     * * Throws an error if the decoded bytes are not a valid receiver claim proof.
     *
     * # Example
     * ```javascript
     * const proof = ReceiverClaimProof.fromHex("a1b2c3...");
     * ```
     */
    static fromHex(hex_str: string): ReceiverClaimProof;
    /**
     * Exports the proof as a SCALE-encoded byte array.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded proof.
     *
     * # Example
     * ```javascript
     * const bytes = proof.toBytes();
     * ```
     */
    toBytes(): Uint8Array;
    /**
     * Exports the proof as a hex-encoded string.
     *
     * # Returns
     * A hex string (without "0x" prefix) representing the SCALE-encoded proof.
     *
     * # Example
     * ```javascript
     * const hexString = proof.toHex();
     * ```
     */
    toHex(): string;
}

/**
 * Zero-knowledge proof that the sender affirms a settlement leg.
 *
 * This proof is generated by the sender to affirm their participation in a settlement leg,
 * proving they have sufficient balance without revealing the actual amount or balance.
 * The proof is submitted on-chain via the `senderAffirmation` transaction.
 *
 * # Example
 * ```javascript
 * // Generate sender affirmation proof
 * const proof = issuerAccountState.senderAffirmProof(
 *   issuerKeys,
 *   accountPath,
 *   settlementRef,
 *   legId,
 *   encryptedLeg,
 *   assetId,
 *   amount
 * );
 *
 * // Submit the affirmation
 * const result = await issuer.senderAffirmation(proof);
 * ```
 */
export class SenderAffirmationProof {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Imports a proof from a SCALE-encoded byte array.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing the SCALE-encoded proof.
     *
     * # Returns
     * A `SenderAffirmationProof` instance.
     *
     * # Errors
     * * Throws an error if the bytes are not a valid SCALE-encoded sender affirmation proof.
     *
     * # Example
     * ```javascript
     * const proof = SenderAffirmationProof.fromBytes(bytes);
     * ```
     */
    static fromBytes(bytes: Uint8Array): SenderAffirmationProof;
    /**
     * Imports a proof from a hex-encoded string.
     *
     * # Arguments
     * * `hex_str` - A hex string representing the SCALE-encoded proof (with or without "0x" prefix).
     *
     * # Returns
     * A `SenderAffirmationProof` instance.
     *
     * # Errors
     * * Throws an error if the string is not valid hex.
     * * Throws an error if the decoded bytes are not a valid sender affirmation proof.
     *
     * # Example
     * ```javascript
     * const proof = SenderAffirmationProof.fromHex("a1b2c3...");
     * // or with 0x prefix
     * const proof2 = SenderAffirmationProof.fromHex("0xa1b2c3...");
     * ```
     */
    static fromHex(hex_str: string): SenderAffirmationProof;
    /**
     * Exports the proof as a SCALE-encoded byte array.
     *
     * This is useful for storing or transmitting the proof in a compact binary format.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded proof.
     *
     * # Example
     * ```javascript
     * const bytes = proof.toBytes();
     * // Store or transmit bytes
     * ```
     */
    toBytes(): Uint8Array;
    /**
     * Exports the proof as a hex-encoded string.
     *
     * # Returns
     * A hex string (without "0x" prefix) representing the SCALE-encoded proof.
     *
     * # Example
     * ```javascript
     * const hexString = proof.toHex();
     * console.log(hexString); // "a1b2c3..."
     * ```
     */
    toHex(): string;
}

/**
 * Zero-knowledge proof for updating the sender's counter after leg affirmation.
 *
 * After the sender has affirmed a settlement leg, they may need to update their counter
 * if there are changes to the settlement. This proof allows updating the counter without
 * revealing sensitive information. Submitted via the `senderCounterUpdate` transaction.
 *
 * # Example
 * ```javascript
 * // Generate counter update proof
 * const proof = issuerAccountState.senderCounterUpdateProof(
 *   issuerKeys,
 *   accountPath,
 *   settlementRef,
 *   legId,
 *   encryptedLeg,
 *   assetId,
 *   amount
 * );
 *
 * // Submit the counter update
 * const result = await issuer.senderCounterUpdate(proof);
 * ```
 */
export class SenderCounterUpdateProof {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Imports a proof from a SCALE-encoded byte array.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing the SCALE-encoded proof.
     *
     * # Returns
     * A `SenderCounterUpdateProof` instance.
     *
     * # Errors
     * * Throws an error if the bytes are not a valid SCALE-encoded sender counter update proof.
     *
     * # Example
     * ```javascript
     * const proof = SenderCounterUpdateProof.fromBytes(bytes);
     * ```
     */
    static fromBytes(bytes: Uint8Array): SenderCounterUpdateProof;
    /**
     * Imports a proof from a hex-encoded string.
     *
     * # Arguments
     * * `hex_str` - A hex string representing the SCALE-encoded proof (with or without "0x" prefix).
     *
     * # Returns
     * A `SenderCounterUpdateProof` instance.
     *
     * # Errors
     * * Throws an error if the string is not valid hex.
     * * Throws an error if the decoded bytes are not a valid sender counter update proof.
     *
     * # Example
     * ```javascript
     * const proof = SenderCounterUpdateProof.fromHex("a1b2c3...");
     * ```
     */
    static fromHex(hex_str: string): SenderCounterUpdateProof;
    /**
     * Exports the proof as a SCALE-encoded byte array.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded proof.
     *
     * # Example
     * ```javascript
     * const bytes = proof.toBytes();
     * ```
     */
    toBytes(): Uint8Array;
    /**
     * Exports the proof as a hex-encoded string.
     *
     * # Returns
     * A hex string (without "0x" prefix) representing the SCALE-encoded proof.
     *
     * # Example
     * ```javascript
     * const hexString = proof.toHex();
     * ```
     */
    toHex(): string;
}

/**
 * Zero-knowledge proof for reversing a sender's affirmation of a settlement leg.
 *
 * If the sender needs to cancel their affirmation before the settlement executes,
 * they generate this proof to revert their affirmed state. This restores their balance
 * commitment as if the affirmation never happened. Submitted via the `senderRevert` transaction.
 *
 * # Example
 * ```javascript
 * // Generate reversal proof
 * const proof = issuerAccountState.senderRevertProof(
 *   issuerKeys,
 *   accountPath,
 *   settlementRef,
 *   legId,
 *   encryptedLeg,
 *   assetId,
 *   amount
 * );
 *
 * // Submit the reversal
 * const result = await issuer.senderRevert(proof);
 * ```
 */
export class SenderRevertAffirmationProof {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Imports a proof from a SCALE-encoded byte array.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing the SCALE-encoded proof.
     *
     * # Returns
     * A `SenderReversalProof` instance.
     *
     * # Errors
     * * Throws an error if the bytes are not a valid SCALE-encoded sender reversal proof.
     *
     * # Example
     * ```javascript
     * const proof = SenderReversalProof.fromBytes(bytes);
     * ```
     */
    static fromBytes(bytes: Uint8Array): SenderRevertAffirmationProof;
    /**
     * Imports a proof from a hex-encoded string.
     *
     * # Arguments
     * * `hex_str` - A hex string representing the SCALE-encoded proof (with or without "0x" prefix).
     *
     * # Returns
     * A `SenderRevertAffirmationProof` instance.
     *
     * # Errors
     * * Throws an error if the string is not valid hex.
     * * Throws an error if the decoded bytes are not a valid sender revert affirmation proof.
     *
     * # Example
     * ```javascript
     * const proof = SenderRevertAffirmationProof.fromHex("a1b2c3...");
     * ```
     */
    static fromHex(hex_str: string): SenderRevertAffirmationProof;
    /**
     * Exports the proof as a SCALE-encoded byte array.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded proof.
     *
     * # Example
     * ```javascript
     * const bytes = proof.toBytes();
     * ```
     */
    toBytes(): Uint8Array;
    /**
     * Exports the proof as a hex-encoded string.
     *
     * # Returns
     * A hex string (without "0x" prefix) representing the SCALE-encoded proof.
     *
     * # Example
     * ```javascript
     * const hexString = proof.toHex();
     * ```
     */
    toHex(): string;
}

/**
 * Builds a confidential settlement transaction with multiple legs.
 *
 * A settlement transfers confidential assets between accounts while maintaining privacy
 * through zero-knowledge proofs. This builder collects all the legs (individual transfers)
 * and asset paths needed to create the settlement proof.
 *
 * # Example
 * ```javascript
 * // Create a settlement builder
 * const builder = new SettlementBuilder("Transfer memo", blockNumber, assetTreeRoot);
 *
 * // Add asset paths (only once per asset)
 * builder.addAssetPath(assetId, assetPath);
 *
 * // Add transfer legs
 * const leg = new LegBuilder(senderKeys, receiverKeys, assetState, 1000n);
 * builder.addLeg(leg);
 *
 * // Build the proof
 * const proof = builder.build();
 * const result = await signer.createSettlement(proof);
 * ```
 */
export class SettlementBuilder {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Adds the curve tree path for an asset in the asset curve tree.
     *
     * This path is required for each unique asset used in the settlement legs.
     * If multiple legs use the same asset, only add the path once.
     *
     * # Arguments
     * * `asset_id` - The numeric identifier of the asset.
     * * `path` - The asset's curve tree path in the asset curve tree.
     *
     * # Errors
     * * Throws an error if the path cannot be decoded.
     * * Throws an error if the path has already been added for this asset.
     *
     * # Example
     * ```javascript
     * const assetPath = await assetCurveTree.getLeafPath(assetState.leafIndex());
     * builder.addAssetPath(assetId, assetPath);
     * ```
     */
    addAssetPath(asset_id: number, path: AssetLeafPath): void;
    /**
     * Adds a transfer leg to the settlement.
     *
     * Multiple legs can be added to create a multi-leg settlement where multiple
     * transfers happen atomically.
     *
     * # Arguments
     * * `leg` - A `LegBuilder` containing the transfer details.
     *
     * # Example
     * ```javascript
     * const leg = new LegBuilder(senderKeys, receiverKeys, assetState, 1000n);
     * builder.addLeg(leg);
     * ```
     */
    addLeg(leg: LegBuilder): void;
    /**
     * Builds the final settlement proof from all added legs and paths.
     *
     * This consumes the builder and generates the zero-knowledge proof that can
     * be submitted to the blockchain to create the settlement.
     *
     * # Returns
     * A `SettlementProof` ready to be submitted on-chain.
     *
     * # Errors
     * * Throws an error if proof generation fails (e.g., missing asset paths).
     *
     * # Example
     * ```javascript
     * const proof = builder.build();
     * const result = await signer.createSettlement(proof);
     * ```
     */
    build(): SettlementProof;
    /**
     * Creates a new settlement builder.
     *
     * # Arguments
     * * `memo` - A string or byte array memo/description for this settlement. Accepts:
     *   - String (will be converted to UTF-8 bytes)
     *   - Hex string with "0x" prefix
     *   - `Uint8Array`
     * * `block_number` - The block number at which the asset tree root was captured (as a number).
     * * `root` - The asset tree root at the specified block number.
     *
     * # Returns
     * A new `SettlementBuilder` instance.
     *
     * # Errors
     * * Throws an error if the memo cannot be converted to bytes.
     *
     * # Example
     * ```javascript
     * const blockNumber = await assetCurveTree.getLastBlockNumber();
     * const root = await assetCurveTree.getRoot(blockNumber);
     * const builder = new SettlementBuilder("My settlement", blockNumber, root);
     * ```
     */
    constructor(memo: any, block_number: number, root: AssetTreeRoot);
}

/**
 * Represents a decrypted settlement leg with visible transfer details.
 *
 * This type contains the plaintext information about a transfer after successful decryption.
 * The fields are accessible as properties in JavaScript.
 *
 * # Properties
 * * `sender` - The sender's encryption public keys (`EncryptionPublicKey`)
 * * `receiver` - The receiver's encryption public keys (`EncryptionPublicKey`)
 * * `assetId` - The asset identifier (number)
 * * `amount` - The transfer amount (number)
 *
 * # Example
 * ```javascript
 * const leg = encryptedLeg.tryDecrypt(accountKeys);
 * if (leg) {
 *     console.log('Decrypted leg details:');
 *     console.log('Role:', leg.role);
 *     console.log('Sender:', leg.sender.toJson());
 *     console.log('Receiver:', leg.receiver.toJson());
 *     console.log('Asset ID:', leg.assetId);
 *     console.log('Amount:', leg.amount);
 * }
 * ```
 */
export class SettlementLeg {
    private constructor();
    /**
     ** Return copy of self without private attributes.
     */
    toJSON(): Object;
    /**
     * Return stringified version of self.
     */
    toString(): string;
    free(): void;
    [Symbol.dispose](): void;
    amount: bigint;
    assetId: number;
    receiver: EncryptionPublicKey;
    role: string;
    sender: EncryptionPublicKey;
}

/**
 * Represents an encrypted settlement leg retrieved from the blockchain.
 *
 * Settlement legs are encrypted so that only the sender, receiver, mediators,
 * and auditors can decrypt the transfer details. This type provides methods
 * to decrypt the leg if you have the appropriate keys.
 *
 * # Example
 * ```javascript
 * // Retrieve encrypted legs from chain
 * const encryptedLegs = await client.getSettlementLegs(settlementRef);
 * const encryptedLeg = encryptedLegs.getLeg(0);
 *
 * // Try to decrypt as account holder
 * const decrypted = encryptedLeg.tryDecrypt(accountKeys);
 * if (decrypted) {
 *     console.log('Sender:', decrypted.sender);
 *     console.log('Amount:', decrypted.amount);
 * }
 * ```
 */
export class SettlementLegEncrypted {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Deserializes an encrypted leg from a SCALE-encoded byte array.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing SCALE-encoded encrypted leg data.
     *
     * # Returns
     * The deserialized `SettlementLegEncrypted`.
     *
     * # Errors
     * * Throws an error if the byte array is invalid or corrupted.
     *
     * # Example
     * ```javascript
     * const encryptedLeg = SettlementLegEncrypted.fromBytes(legBytes);
     * ```
     */
    static fromBytes(bytes: Uint8Array): SettlementLegEncrypted;
    /**
     * Deserializes an encrypted leg from a hexadecimal string.
     *
     * # Arguments
     * * `hex_str` - A hex-encoded string (with or without "0x" prefix).
     *
     * # Returns
     * The deserialized `SettlementLegEncrypted`.
     *
     * # Errors
     * * Throws an error if the hex string is invalid.
     *
     * # Example
     * ```javascript
     * const encryptedLeg = SettlementLegEncrypted.fromHex("0x1234...");
     * ```
     */
    static fromHex(hex_str: string): SettlementLegEncrypted;
    /**
     * Serializes the encrypted leg to a SCALE-encoded byte array.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded encrypted leg.
     *
     * # Example
     * ```javascript
     * const bytes = encryptedLeg.toBytes();
     * ```
     */
    toBytes(): Uint8Array;
    /**
     * Exports the encrypted leg as a hexadecimal string.
     *
     * # Returns
     * A hex-encoded string representation of the encrypted leg.
     *
     * # Example
     * ```javascript
     * const hexString = encryptedLeg.toHex();
     * ```
     */
    toHex(): string;
    /**
     * Attempts to decrypt the leg using account keys.
     *
     * This method tries to decrypt the leg if you are the sender or receiver of the transfer.
     *
     * # Arguments
     * * `account_keys` - The account keys to use for decryption.
     *
     * # Returns
     * * `Some(SettlementLeg)` if decryption succeeded (you are the sender or receiver).
     * * `None` if decryption failed (you are not involved in this leg).
     *
     * # Example
     * ```javascript
     * const decrypted = encryptedLeg.tryDecrypt(accountKeys);
     * if (decrypted) {
     *     console.log('Sender:', decrypted.sender);
     *     console.log('Receiver:', decrypted.receiver);
     *     console.log('Amount:', decrypted.amount);
     * } else {
     *     console.log('Not involved in this leg');
     * }
     * ```
     */
    tryDecrypt(account_keys: AccountKeys): SettlementLeg | undefined;
    /**
     * Attempts to decrypt the leg as a mediator or auditor.
     *
     * Mediators and auditors can decrypt all legs in a settlement to verify and approve transactions.
     *
     * # Arguments
     * * `encryption_key` - The encryption key pair for the mediator or auditor.
     * * `max_asset_id` - Optional maximum asset ID to limit decryption scope.
     *
     * # Returns
     * * `Some(SettlementLeg)` if decryption succeeded.
     * * `None` if decryption failed (you are not a mediator/auditor for this asset).
     *
     * # Example
     * ```javascript
     * const mediatorKeys = accountKeys.encryptionKeyPair();
     * const maxAssetId = 500; // Optional limit
     * const decrypted = encryptedLeg.tryDecryptAsMediatorOrAuditor(mediatorKeys, maxAssetId);
     * if (decrypted) {
     *     console.log('Can see transfer details as mediator/auditor');
     *     console.log('Amount:', decrypted.amount);
     * }
     * ```
     */
    tryDecryptAsMediatorOrAuditor(encryption_key: EncryptionKeyPair, max_asset_id?: number | null): SettlementLeg | undefined;
}

/**
 * A collection of decrypted (or partially decrypted) settlement legs.
 *
 * This type represents the result of attempting to decrypt multiple legs. Each leg
 * may be `Some` (successfully decrypted) or `None` (not decrypted, either because
 * you don't have the right keys or you're not involved in that leg).
 *
 * # Example
 * ```javascript
 * const decryptedLegs = encryptedLegs.tryDecrypt(accountKeys);
 * for (let i = 0; i < decryptedLegs.legCount(); i++) {
 *     const leg = decryptedLegs.getLeg(i);
 *     if (leg) {
 *         console.log(`Leg ${i}:`);
 *         console.log('  Sender:', leg.sender.toJson());
 *         console.log('  Receiver:', leg.receiver.toJson());
 *         console.log('  Amount:', leg.amount);
 *     } else {
 *         console.log(`Leg ${i}: Could not decrypt (not involved)`);
 *     }
 * }
 * ```
 */
export class SettlementLegs {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Gets a decrypted leg by its index.
     *
     * # Arguments
     * * `index` - The zero-based index of the leg to retrieve.
     *
     * # Returns
     * * `Some(SettlementLeg)` if the index is valid and the leg was successfully decrypted.
     * * `None` if the index is out of bounds or the leg could not be decrypted.
     *
     * # Example
     * ```javascript
     * const leg = decryptedLegs.getLeg(0);
     * if (leg) {
     *     console.log('Decrypted leg amount:', leg.amount);
     * } else {
     *     console.log('Leg not decrypted or index invalid');
     * }
     * ```
     */
    getLeg(index: number): SettlementLeg | undefined;
    /**
     * Gets the total number of legs (both decrypted and not decrypted).
     *
     * # Returns
     * The count of legs as a number.
     *
     * # Example
     * ```javascript
     * console.log('Total legs:', decryptedLegs.legCount());
     * ```
     */
    legCount(): number;
}

/**
 * A collection of encrypted settlement legs.
 *
 * This type represents multiple encrypted transfer legs, typically retrieved from
 * a settlement on-chain or extracted from a settlement proof. Each leg can be
 * independently decrypted if you have the appropriate keys.
 *
 * # Example
 * ```javascript
 * const encryptedLegs = await client.getSettlementLegs(settlementRef);
 * console.log('Settlement has', encryptedLegs.legCount(), 'legs');
 *
 * // Try to decrypt all legs
 * const decryptedLegs = encryptedLegs.tryDecrypt(accountKeys);
 * for (let i = 0; i < decryptedLegs.legCount(); i++) {
 *     const leg = decryptedLegs.getLeg(i);
 *     if (leg) {
 *         console.log(`Leg ${i}: ${leg.amount} units`);
 *     }
 * }
 * ```
 */
export class SettlementLegsEncrypted {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Deserializes encrypted legs from a SCALE-encoded byte array.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing SCALE-encoded encrypted legs data.
     *
     * # Returns
     * The deserialized `SettlementLegsEncrypted`.
     *
     * # Errors
     * * Throws an error if the byte array is invalid or corrupted.
     *
     * # Example
     * ```javascript
     * const encryptedLegs = SettlementLegsEncrypted.fromBytes(legsBytes);
     * ```
     */
    static fromBytes(bytes: Uint8Array): SettlementLegsEncrypted;
    /**
     * Gets an encrypted leg by its index.
     *
     * # Arguments
     * * `index` - The zero-based index of the leg to retrieve.
     *
     * # Returns
     * * `Some(SettlementLegEncrypted)` if the index is valid.
     * * `None` if the index is out of bounds.
     *
     * # Example
     * ```javascript
     * const leg = encryptedLegs.getLeg(0);
     * if (leg) {
     *     const decrypted = leg.tryDecrypt(accountKeys);
     * }
     * ```
     */
    getLeg(index: number): SettlementLegEncrypted | undefined;
    /**
     * Gets the number of encrypted legs.
     *
     * # Returns
     * The count of legs as a number.
     *
     * # Example
     * ```javascript
     * console.log('Number of legs:', encryptedLegs.legCount());
     * ```
     */
    legCount(): number;
    /**
     * Serializes all encrypted legs to a SCALE-encoded byte array.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded encrypted legs.
     *
     * # Example
     * ```javascript
     * const bytes = encryptedLegs.toBytes();
     * ```
     */
    toBytes(): Uint8Array;
    /**
     * Attempts to decrypt all legs using account keys.
     *
     * This method tries to decrypt each leg. Successfully decrypted legs (where you are
     * the sender or receiver) will be `Some`, while legs you're not involved in will be `None`.
     *
     * # Arguments
     * * `account_keys` - The account keys to use for decryption.
     *
     * # Returns
     * A `SettlementLegs` object where each leg is either decrypted (`Some`) or not (`None`).
     *
     * # Example
     * ```javascript
     * const decryptedLegs = encryptedLegs.tryDecrypt(accountKeys);
     * for (let i = 0; i < decryptedLegs.legCount(); i++) {
     *     const leg = decryptedLegs.getLeg(i);
     *     if (leg) {
     *         console.log(`Leg ${i}: Received ${leg.amount} units`);
     *     }
     * }
     * ```
     */
    tryDecrypt(account_keys: AccountKeys): SettlementLegs;
    /**
     * Attempts to decrypt all legs as a mediator or auditor.
     *
     * Mediators and auditors can decrypt all legs in a settlement to verify transactions
     * even if they are not the sender or receiver.
     *
     * # Arguments
     * * `encryption_key` - The encryption key pair for the mediator or auditor.
     *
     * # Returns
     * A `SettlementLegs` object where each leg is either decrypted (`Some`) or not (`None`).
     *
     * # Example
     * ```javascript
     * const mediatorKeys = accountKeys.encryptionKeyPair();
     * const decryptedLegs = encryptedLegs.tryDecryptAsMediatorOrAuditor(mediatorKeys);
     * console.log('As mediator, can see', decryptedLegs.legCount(), 'legs');
     * ```
     */
    tryDecryptAsMediatorOrAuditor(encryption_key: EncryptionKeyPair): SettlementLegs;
}

/**
 * A zero-knowledge proof for creating a confidential settlement on-chain.
 *
 * This proof demonstrates that a settlement is valid (senders have sufficient balances,
 * all transfers are properly encrypted) without revealing any confidential information.
 * The proof is generated by `SettlementBuilder.build()` and submitted via
 * `PolymeshSigner.createSettlement()`.
 *
 * # Example
 * ```javascript
 * const proof = settlementBuilder.build();
 * const result = await signer.createSettlement(proof);
 * console.log('Settlement created:', result.settlementId());
 * ```
 */
export class SettlementProof {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Deserializes a settlement proof from a SCALE-encoded byte array.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing SCALE-encoded proof data.
     *
     * # Returns
     * The deserialized `SettlementProof`.
     *
     * # Errors
     * * Throws an error if the byte array is invalid or corrupted.
     *
     * # Example
     * ```javascript
     * const proof = SettlementProof.fromBytes(proofBytes);
     * ```
     */
    static fromBytes(bytes: Uint8Array): SettlementProof;
    /**
     * Gets the block number at which the asset tree root was captured.
     *
     * This is the block number used for the asset leaf paths in the proof.
     *
     * # Returns
     * The block number as a number.
     *
     * # Example
     * ```javascript
     * const blockNumber = proof.getBlockNumber();
     * console.log('Proof uses asset tree at block:', blockNumber);
     * ```
     */
    getBlockNumber(): number;
    /**
     * Extracts the encrypted legs from the settlement proof.
     *
     * The encrypted legs contain the transfer details that can only be decrypted
     * by the involved parties (sender, receiver, mediators, auditors).
     *
     * # Returns
     * A `SettlementLegsEncrypted` object containing all encrypted legs.
     *
     * # Example
     * ```javascript
     * const encryptedLegs = proof.getEncryptedLegs();
     * const decryptedLegs = encryptedLegs.tryDecrypt(accountKeys);
     * ```
     */
    getEncryptedLegs(): SettlementLegsEncrypted;
    /**
     * Gets the number of legs in this settlement.
     *
     * # Returns
     * The count of transfer legs as a number.
     *
     * # Example
     * ```javascript
     * console.log('Settlement has', proof.getLegCount(), 'legs');
     * ```
     */
    getLegCount(): number;
    /**
     * Gets the settlement memo/description.
     *
     * # Returns
     * The memo as a string (if valid UTF-8) or hex string (if binary data).
     *
     * # Example
     * ```javascript
     * const memo = proof.getMemo();
     * console.log('Settlement memo:', memo);
     * ```
     */
    getMemo(): any;
    /**
     * Serializes the settlement proof to a SCALE-encoded byte array.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded proof.
     *
     * # Example
     * ```javascript
     * const bytes = proof.toBytes();
     * ```
     */
    toBytes(): Uint8Array;
}

/**
 * Generates a cryptographically secure random 32-byte seed for key generation.
 *
 * This function uses the operating system's random number generator to produce
 * a high-quality random seed suitable for generating account keys.
 *
 * # Returns
 * A 64-character hexadecimal string representing the 32-byte seed.
 *
 * # Errors
 * * May throw an error if the OS random number generator is unavailable (rare).
 *
 * # Example
 * ```javascript
 * const seed = generateRandomSeed();
 * console.log('Random seed:', seed); // e.g., "a1b2c3d4..."
 *
 * // Use the seed to create account keys
 * const keys = new AccountKeys(seed);
 * ```
 */
export function generateRandomSeed(): string;

/**
 * Initialize the WASM module. This should be called once when loading the module.
 * It sets up panic hooks for better error messages in the browser console.
 */
export function init(): void;

/**
 * Get the version of the polymesh-dart-wasm library
 */
export function version(): string;
