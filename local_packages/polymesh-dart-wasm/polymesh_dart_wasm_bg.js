let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    }
}

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
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
 * @returns {string}
 */
export function generateRandomSeed() {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.generateRandomSeed();
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

let cachedBigUint64ArrayMemory0 = null;

function getBigUint64ArrayMemory0() {
    if (cachedBigUint64ArrayMemory0 === null || cachedBigUint64ArrayMemory0.byteLength === 0) {
        cachedBigUint64ArrayMemory0 = new BigUint64Array(wasm.memory.buffer);
    }
    return cachedBigUint64ArrayMemory0;
}

function getArrayU64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getBigUint64ArrayMemory0().subarray(ptr / 8, ptr / 8 + len);
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_externrefs.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}
/**
 * Get the version of the polymesh-dart-wasm library
 * @returns {string}
 */
export function version() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.version();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Initialize the WASM module. This should be called once when loading the module.
 * It sets up panic hooks for better error messages in the browser console.
 */
export function init() {
    wasm.init();
}

const AccountAssetRegistrationFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_accountassetregistration_free(ptr >>> 0, 1));
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

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AccountAssetRegistration.prototype);
        obj.__wbg_ptr = ptr;
        AccountAssetRegistrationFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AccountAssetRegistrationFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_accountassetregistration_free(ptr, 0);
    }
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
     * @returns {Uint8Array}
     */
    getProofBytes() {
        const ret = wasm.accountassetregistration_getProofBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
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
     * @returns {BatchedAccountAssetRegistrationProof}
     */
    getBatchedProof() {
        const ret = wasm.accountassetregistration_getBatchedProof(this.__wbg_ptr);
        return BatchedAccountAssetRegistrationProof.__wrap(ret);
    }
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
     * @returns {AccountAssetState}
     */
    getAccountAssetState() {
        const ret = wasm.accountassetregistration_getAccountAssetState(this.__wbg_ptr);
        return AccountAssetState.__wrap(ret);
    }
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
     * @returns {Uint8Array}
     */
    getBatchedProofBytes() {
        const ret = wasm.accountassetregistration_getBatchedProofBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
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
     * @returns {AccountAssetRegistrationProof}
     */
    getProof() {
        const ret = wasm.accountassetregistration_getProof(this.__wbg_ptr);
        return AccountAssetRegistrationProof.__wrap(ret);
    }
}
if (Symbol.dispose) AccountAssetRegistration.prototype[Symbol.dispose] = AccountAssetRegistration.prototype.free;

const AccountAssetRegistrationProofFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_accountassetregistrationproof_free(ptr >>> 0, 1));
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

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AccountAssetRegistrationProof.prototype);
        obj.__wbg_ptr = ptr;
        AccountAssetRegistrationProofFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AccountAssetRegistrationProofFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_accountassetregistrationproof_free(ptr, 0);
    }
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
     * @param {Uint8Array} bytes
     * @returns {AccountAssetRegistrationProof}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.accountassetregistrationproof_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AccountAssetRegistrationProof.__wrap(ret[0]);
    }
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
     * @returns {string}
     */
    toHex() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.accountassetregistrationproof_toHex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
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
     * @param {string} hex_str
     * @returns {AccountAssetRegistrationProof}
     */
    static fromHex(hex_str) {
        const ptr0 = passStringToWasm0(hex_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.accountassetregistrationproof_fromHex(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AccountAssetRegistrationProof.__wrap(ret[0]);
    }
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
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.accountassetregistrationproof_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}
if (Symbol.dispose) AccountAssetRegistrationProof.prototype[Symbol.dispose] = AccountAssetRegistrationProof.prototype.free;

const AccountAssetStateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_accountassetstate_free(ptr >>> 0, 1));
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

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AccountAssetState.prototype);
        obj.__wbg_ptr = ptr;
        AccountAssetStateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AccountAssetStateFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_accountassetstate_free(ptr, 0);
    }
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
     * @param {Uint8Array} bytes
     * @returns {AccountAssetState}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.accountassetstate_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AccountAssetState.__wrap(ret[0]);
    }
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
     * @returns {bigint}
     */
    leafIndex() {
        const ret = wasm.accountassetstate_leafIndex(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
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
     * @returns {boolean}
     */
    hasPendingState() {
        const ret = wasm.accountassetstate_hasPendingState(this.__wbg_ptr);
        return ret !== 0;
    }
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
     *   mintAmount
     * );
     *
     * const results = await issuer.mintAsset(mintingProof);
     * issuerAccountState.commitPendingState(results.leafIndex());
     * ```
     * @param {AccountKeys} keys
     * @param {AccountLeafPathAndRoot} path
     * @param {any} amount
     * @returns {AssetMintingProof}
     */
    assetMintingProof(keys, path, amount) {
        _assertClass(keys, AccountKeys);
        _assertClass(path, AccountLeafPathAndRoot);
        const ret = wasm.accountassetstate_assetMintingProof(this.__wbg_ptr, keys.__wbg_ptr, path.__wbg_ptr, amount);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AssetMintingProof.__wrap(ret[0]);
    }
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
     * @param {AccountKeys} keys
     * @param {AccountLeafPathAndRoot} path
     * @param {any} settlement_ref
     * @param {number} leg_id
     * @param {SettlementLegEncrypted} leg_enc
     * @param {number} asset_id
     * @param {any} amount
     * @returns {SenderAffirmationProof}
     */
    senderAffirmProof(keys, path, settlement_ref, leg_id, leg_enc, asset_id, amount) {
        _assertClass(keys, AccountKeys);
        _assertClass(path, AccountLeafPathAndRoot);
        _assertClass(leg_enc, SettlementLegEncrypted);
        const ret = wasm.accountassetstate_senderAffirmProof(this.__wbg_ptr, keys.__wbg_ptr, path.__wbg_ptr, settlement_ref, leg_id, leg_enc.__wbg_ptr, asset_id, amount);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return SenderAffirmationProof.__wrap(ret[0]);
    }
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
     * A `SenderReversalProof` that can be submitted to the blockchain.
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
     * @param {AccountKeys} keys
     * @param {AccountLeafPathAndRoot} path
     * @param {any} settlement_ref
     * @param {number} leg_id
     * @param {SettlementLegEncrypted} leg_enc
     * @param {number} asset_id
     * @param {any} amount
     * @returns {SenderReversalProof}
     */
    senderRevertProof(keys, path, settlement_ref, leg_id, leg_enc, asset_id, amount) {
        _assertClass(keys, AccountKeys);
        _assertClass(path, AccountLeafPathAndRoot);
        _assertClass(leg_enc, SettlementLegEncrypted);
        const ret = wasm.accountassetstate_senderRevertProof(this.__wbg_ptr, keys.__wbg_ptr, path.__wbg_ptr, settlement_ref, leg_id, leg_enc.__wbg_ptr, asset_id, amount);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return SenderReversalProof.__wrap(ret[0]);
    }
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
     * @param {bigint} leaf_index
     */
    commitPendingState(leaf_index) {
        wasm.accountassetstate_commitPendingState(this.__wbg_ptr, leaf_index);
    }
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
     * @param {AccountKeys} keys
     * @param {AccountLeafPathAndRoot} path
     * @param {any} settlement_ref
     * @param {number} leg_id
     * @param {SettlementLegEncrypted} leg_enc
     * @param {number} asset_id
     * @param {any} amount
     * @returns {ReceiverClaimProof}
     */
    receiverClaimProof(keys, path, settlement_ref, leg_id, leg_enc, asset_id, amount) {
        _assertClass(keys, AccountKeys);
        _assertClass(path, AccountLeafPathAndRoot);
        _assertClass(leg_enc, SettlementLegEncrypted);
        const ret = wasm.accountassetstate_receiverClaimProof(this.__wbg_ptr, keys.__wbg_ptr, path.__wbg_ptr, settlement_ref, leg_id, leg_enc.__wbg_ptr, asset_id, amount);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ReceiverClaimProof.__wrap(ret[0]);
    }
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
     * @param {AccountKeys} keys
     * @param {AccountLeafPathAndRoot} path
     * @param {any} settlement_ref
     * @param {number} leg_id
     * @param {SettlementLegEncrypted} leg_enc
     * @param {number} asset_id
     * @param {any} amount
     * @returns {ReceiverAffirmationProof}
     */
    receiverAffirmProof(keys, path, settlement_ref, leg_id, leg_enc, asset_id, amount) {
        _assertClass(keys, AccountKeys);
        _assertClass(path, AccountLeafPathAndRoot);
        _assertClass(leg_enc, SettlementLegEncrypted);
        const ret = wasm.accountassetstate_receiverAffirmProof(this.__wbg_ptr, keys.__wbg_ptr, path.__wbg_ptr, settlement_ref, leg_id, leg_enc.__wbg_ptr, asset_id, amount);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ReceiverAffirmationProof.__wrap(ret[0]);
    }
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
     * @param {AccountKeys} keys
     * @param {AccountLeafPathAndRoot} path
     * @param {any} settlement_ref
     * @param {number} leg_id
     * @param {SettlementLegEncrypted} leg_enc
     * @param {number} asset_id
     * @param {any} amount
     * @returns {SenderCounterUpdateProof}
     */
    senderCounterUpdateProof(keys, path, settlement_ref, leg_id, leg_enc, asset_id, amount) {
        _assertClass(keys, AccountKeys);
        _assertClass(path, AccountLeafPathAndRoot);
        _assertClass(leg_enc, SettlementLegEncrypted);
        const ret = wasm.accountassetstate_senderCounterUpdateProof(this.__wbg_ptr, keys.__wbg_ptr, path.__wbg_ptr, settlement_ref, leg_id, leg_enc.__wbg_ptr, asset_id, amount);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return SenderCounterUpdateProof.__wrap(ret[0]);
    }
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
     * @returns {any}
     */
    balance() {
        const ret = wasm.accountassetstate_balance(this.__wbg_ptr);
        return ret;
    }
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
     * @returns {string}
     */
    toJson() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.accountassetstate_toJson(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
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
     * @returns {number}
     */
    assetId() {
        const ret = wasm.accountassetstate_assetId(this.__wbg_ptr);
        return ret >>> 0;
    }
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
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.accountassetstate_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}
if (Symbol.dispose) AccountAssetState.prototype[Symbol.dispose] = AccountAssetState.prototype.free;

const AccountKeysFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_accountkeys_free(ptr >>> 0, 1));
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

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AccountKeys.prototype);
        obj.__wbg_ptr = ptr;
        AccountKeysFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AccountKeysFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_accountkeys_free(ptr, 0);
    }
    /**
     * Deserializes account keys from a SCALE-encoded byte array.
     *
     * **Security Warning:** Only use this with bytes from a trusted, secure source.
     *
     * # Arguments
     * * `bytes` - A `Uint8Array` containing SCALE-encoded account keys.
     *
     * # Returns
     * The deserialized `AccountKeys` object.
     *
     * # Errors
     * * Throws an error if the byte array is invalid or corrupted.
     *
     * # Example
     * ```javascript
     * const decrypted = decryptData(encryptedKeys);
     * const keys = AccountKeys.fromBytes(decrypted);
     * ```
     * @param {Uint8Array} bytes
     * @returns {AccountKeys}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.accountkeys_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AccountKeys.__wrap(ret[0]);
    }
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
     * @returns {AccountPublicKeys}
     */
    publicKeys() {
        const ret = wasm.accountkeys_publicKeys(this.__wbg_ptr);
        return AccountPublicKeys.__wrap(ret);
    }
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
     * @returns {EncryptionKeyPair}
     */
    encryptionKeyPair() {
        const ret = wasm.accountkeys_encryptionKeyPair(this.__wbg_ptr);
        return EncryptionKeyPair.__wrap(ret);
    }
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
     * @param {any} did
     * @returns {AccountRegistrationProof}
     */
    registerAccountProof(did) {
        const ret = wasm.accountkeys_registerAccountProof(this.__wbg_ptr, did);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AccountRegistrationProof.__wrap(ret[0]);
    }
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
     * @param {number} asset_id
     * @param {any} did
     * @returns {AccountAssetRegistration}
     */
    registerAccountAssetProof(asset_id, did) {
        const ret = wasm.accountkeys_registerAccountAssetProof(this.__wbg_ptr, asset_id, did);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AccountAssetRegistration.__wrap(ret[0]);
    }
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
     * @param {string} seed_hex
     */
    constructor(seed_hex) {
        const ptr0 = passStringToWasm0(seed_hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.accountkeys_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        AccountKeysFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Serializes the account keys to a SCALE-encoded byte array.
     *
     * **Security Warning:** This exports the secret keys. The resulting bytes should
     * be encrypted before storage and never transmitted over insecure channels.
     *
     * # Returns
     * A `Uint8Array` containing the SCALE-encoded secret keys.
     *
     * # Example
     * ```javascript
     * const bytes = keys.toBytes();
     * // Encrypt bytes before storing!
     * const encrypted = encryptData(bytes);
     * localStorage.setItem('encryptedKeys', encrypted);
     * ```
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.accountkeys_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
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
     * @param {string} seed
     * @returns {AccountKeys}
     */
    static fromSeed(seed) {
        const ptr0 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.accountkeys_fromSeed(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AccountKeys.__wrap(ret[0]);
    }
}
if (Symbol.dispose) AccountKeys.prototype[Symbol.dispose] = AccountKeys.prototype.free;

const AccountLeafPathAndRootFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_accountleafpathandroot_free(ptr >>> 0, 1));
/**
 * Account leaf path and root.
 *
 * Contains both the curve tree path from an account leaf to the root and the root value itself
 * at a specific block number. Used for generating zero-knowledge proofs about account states
 * (e.g., proving balance sufficiency during settlement affirmations).
 */
export class AccountLeafPathAndRoot {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AccountLeafPathAndRoot.prototype);
        obj.__wbg_ptr = ptr;
        AccountLeafPathAndRootFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AccountLeafPathAndRootFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_accountleafpathandroot_free(ptr, 0);
    }
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
     * @param {Uint8Array} bytes
     * @returns {FeeAccountLeafPathAndRoot}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.accountleafpathandroot_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return FeeAccountLeafPathAndRoot.__wrap(ret[0]);
    }
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
     * @returns {number}
     */
    getBlockNumber() {
        const ret = wasm.accountleafpathandroot_getBlockNumber(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] >>> 0;
    }
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
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.accountleafpathandroot_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}
if (Symbol.dispose) AccountLeafPathAndRoot.prototype[Symbol.dispose] = AccountLeafPathAndRoot.prototype.free;

const AccountLeafPathBuilderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_accountleafpathbuilder_free(ptr >>> 0, 1));
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

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AccountLeafPathBuilderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_accountleafpathbuilder_free(ptr, 0);
    }
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
     * @returns {BigUint64Array}
     */
    getLeafIndices() {
        const ret = wasm.accountleafpathbuilder_getLeafIndices(this.__wbg_ptr);
        var v1 = getArrayU64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
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
     * @param {number} location_index
     * @param {any | null} [node]
     */
    setNodeAtIndex(location_index, node) {
        const ret = wasm.accountleafpathbuilder_setNodeAtIndex(this.__wbg_ptr, location_index, isLikeNone(node) ? 0 : addToExternrefTable0(node));
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
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
     * @returns {bigint}
     */
    getMaxLeafIndex() {
        const ret = wasm.accountleafpathbuilder_getMaxLeafIndex(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
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
     * @returns {bigint}
     */
    getMinLeafIndex() {
        const ret = wasm.accountleafpathbuilder_getMinLeafIndex(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
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
     * @returns {Uint8Array[]}
     */
    getNodeLocations() {
        const ret = wasm.accountleafpathbuilder_getNodeLocations(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
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
     * @returns {AccountLeafPathAndRoot}
     */
    buildLeafPathWithRoot() {
        const ret = wasm.accountleafpathbuilder_buildLeafPathWithRoot(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AccountLeafPathAndRoot.__wrap(ret[0]);
    }
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
     * @param {bigint} leaf_index
     * @param {number} height
     * @param {number} block_number
     */
    constructor(leaf_index, height, block_number) {
        const ret = wasm.accountleafpathbuilder_new(leaf_index, height, block_number);
        this.__wbg_ptr = ret >>> 0;
        AccountLeafPathBuilderFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
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
     * @returns {number}
     */
    getL() {
        const ret = wasm.accountleafpathbuilder_getL(this.__wbg_ptr);
        return ret >>> 0;
    }
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
     * @returns {number}
     */
    getM() {
        const ret = wasm.accountleafpathbuilder_getM(this.__wbg_ptr);
        return ret >>> 0;
    }
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
     * @param {bigint} leaf_index
     * @param {any | null} [leaf]
     */
    setLeaf(leaf_index, leaf) {
        const ret = wasm.accountleafpathbuilder_setLeaf(this.__wbg_ptr, leaf_index, isLikeNone(leaf) ? 0 : addToExternrefTable0(leaf));
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
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
     * @param {Uint8Array} root
     */
    setRoot(root) {
        const ptr0 = passArray8ToWasm0(root, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.accountleafpathbuilder_setRoot(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) AccountLeafPathBuilder.prototype[Symbol.dispose] = AccountLeafPathBuilder.prototype.free;

const AccountPublicKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_accountpublickey_free(ptr >>> 0, 1));
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

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AccountPublicKey.prototype);
        obj.__wbg_ptr = ptr;
        AccountPublicKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AccountPublicKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_accountpublickey_free(ptr, 0);
    }
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
     * @param {Uint8Array} bytes
     * @returns {AccountPublicKey}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.accountpublickey_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AccountPublicKey.__wrap(ret[0]);
    }
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
     * @param {any} js_value
     */
    constructor(js_value) {
        const ret = wasm.accountpublickey_new(js_value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        AccountPublicKeyFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Exports the account public key as a JsValue for interoperability.
     * @returns {any}
     */
    toJs() {
        const ret = wasm.accountpublickey_toJs(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Import account public key from a JsValue.
     * @param {any} js_value
     * @returns {AccountPublicKeys}
     */
    static fromJs(js_value) {
        const ret = wasm.accountpublickey_fromJs(js_value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AccountPublicKeys.__wrap(ret[0]);
    }
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
     * @returns {string}
     */
    toJson() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.accountpublickey_toJson(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
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
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.accountpublickey_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}
if (Symbol.dispose) AccountPublicKey.prototype[Symbol.dispose] = AccountPublicKey.prototype.free;

const AccountPublicKeysFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_accountpublickeys_free(ptr >>> 0, 1));
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

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AccountPublicKeys.prototype);
        obj.__wbg_ptr = ptr;
        AccountPublicKeysFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AccountPublicKeysFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_accountpublickeys_free(ptr, 0);
    }
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
     * @param {Uint8Array} bytes
     * @returns {AccountPublicKeys}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.accountpublickeys_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AccountPublicKeys.__wrap(ret[0]);
    }
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
     * @returns {AccountPublicKey}
     */
    accountPublicKey() {
        const ret = wasm.accountpublickeys_accountPublicKey(this.__wbg_ptr);
        return AccountPublicKey.__wrap(ret);
    }
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
     * @returns {EncryptionPublicKey}
     */
    encryptionPublicKey() {
        const ret = wasm.accountpublickeys_encryptionPublicKey(this.__wbg_ptr);
        return EncryptionPublicKey.__wrap(ret);
    }
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
     * @param {any} keys
     */
    constructor(keys) {
        const ret = wasm.accountpublickeys_new(keys);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        AccountPublicKeysFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Exports the public keys as a JsValue for interoperability.
     * @returns {any}
     */
    toJs() {
        const ret = wasm.accountpublickeys_toJs(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Import public keys from a JsValue.
     * @param {any} js_value
     * @returns {AccountPublicKeys}
     */
    static fromJs(js_value) {
        const ret = wasm.accountpublickeys_fromJs(js_value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AccountPublicKeys.__wrap(ret[0]);
    }
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
     * @returns {string}
     */
    toJson() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.accountpublickeys_toJson(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
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
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.accountpublickeys_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}
if (Symbol.dispose) AccountPublicKeys.prototype[Symbol.dispose] = AccountPublicKeys.prototype.free;

const AccountRegistrationProofFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_accountregistrationproof_free(ptr >>> 0, 1));
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

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AccountRegistrationProof.prototype);
        obj.__wbg_ptr = ptr;
        AccountRegistrationProofFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AccountRegistrationProofFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_accountregistrationproof_free(ptr, 0);
    }
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
     * @param {Uint8Array} bytes
     * @returns {AccountRegistrationProof}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.accountregistrationproof_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AccountRegistrationProof.__wrap(ret[0]);
    }
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
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.accountregistrationproof_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}
if (Symbol.dispose) AccountRegistrationProof.prototype[Symbol.dispose] = AccountRegistrationProof.prototype.free;

const AccountStateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_accountstate_free(ptr >>> 0, 1));
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

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AccountState.prototype);
        obj.__wbg_ptr = ptr;
        AccountStateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AccountStateFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_accountstate_free(ptr, 0);
    }
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
     * @param {Uint8Array} bytes
     * @returns {AccountState}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.accountstate_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AccountState.__wrap(ret[0]);
    }
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
     * @returns {any}
     */
    balance() {
        const ret = wasm.accountstate_balance(this.__wbg_ptr);
        return ret;
    }
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
     * @returns {bigint}
     */
    counter() {
        const ret = wasm.accountstate_counter(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
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
     * @returns {string}
     */
    toJson() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.accountstate_toJson(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
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
     * @returns {number}
     */
    assetId() {
        const ret = wasm.accountstate_assetId(this.__wbg_ptr);
        return ret >>> 0;
    }
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
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.accountstate_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}
if (Symbol.dispose) AccountState.prototype[Symbol.dispose] = AccountState.prototype.free;

const AssetLeafPathFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_assetleafpath_free(ptr >>> 0, 1));
/**
 * Asset leaf path.
 *
 * Contains the curve tree path from an asset leaf to the root (without the root value itself).
 * Used when you only need the path structure without the specific root commitment.
 */
export class AssetLeafPath {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AssetLeafPath.prototype);
        obj.__wbg_ptr = ptr;
        AssetLeafPathFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AssetLeafPathFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_assetleafpath_free(ptr, 0);
    }
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
     * @param {Uint8Array} bytes
     * @returns {AssetLeafPath}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.assetleafpath_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AssetLeafPath.__wrap(ret[0]);
    }
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
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.assetleafpath_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}
if (Symbol.dispose) AssetLeafPath.prototype[Symbol.dispose] = AssetLeafPath.prototype.free;

const AssetLeafPathAndRootFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_assetleafpathandroot_free(ptr >>> 0, 1));
/**
 * Asset leaf path and root.
 *
 * Contains both the curve tree path from an asset leaf to the root and the root value itself
 * at a specific block number. Assets are stored in their own curve tree separate from accounts.
 * This structure is used when building settlement proofs to prove asset states.
 */
export class AssetLeafPathAndRoot {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AssetLeafPathAndRoot.prototype);
        obj.__wbg_ptr = ptr;
        AssetLeafPathAndRootFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AssetLeafPathAndRootFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_assetleafpathandroot_free(ptr, 0);
    }
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
     * @param {Uint8Array} bytes
     * @returns {AssetLeafPathAndRoot}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.assetleafpathandroot_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AssetLeafPathAndRoot.__wrap(ret[0]);
    }
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
     * @returns {number}
     */
    getBlockNumber() {
        const ret = wasm.assetleafpathandroot_getBlockNumber(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] >>> 0;
    }
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
     * @returns {AssetTreeRoot}
     */
    getRoot() {
        const ret = wasm.assetleafpathandroot_getRoot(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AssetTreeRoot.__wrap(ret[0]);
    }
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
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.assetleafpathandroot_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}
if (Symbol.dispose) AssetLeafPathAndRoot.prototype[Symbol.dispose] = AssetLeafPathAndRoot.prototype.free;

const AssetLeafPathBuilderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_assetleafpathbuilder_free(ptr >>> 0, 1));
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

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AssetLeafPathBuilderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_assetleafpathbuilder_free(ptr, 0);
    }
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
     * @returns {AssetLeafPath}
     */
    buildLeafPath() {
        const ret = wasm.assetleafpathbuilder_buildLeafPath(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AssetLeafPath.__wrap(ret[0]);
    }
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
     * @returns {BigUint64Array}
     */
    getLeafIndices() {
        const ret = wasm.assetleafpathbuilder_getLeafIndices(this.__wbg_ptr);
        var v1 = getArrayU64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
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
     * @param {number} location_index
     * @param {any | null} [node]
     */
    setNodeAtIndex(location_index, node) {
        const ret = wasm.assetleafpathbuilder_setNodeAtIndex(this.__wbg_ptr, location_index, isLikeNone(node) ? 0 : addToExternrefTable0(node));
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
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
     * @returns {bigint}
     */
    getMaxLeafIndex() {
        const ret = wasm.assetleafpathbuilder_getMaxLeafIndex(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
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
     * @returns {bigint}
     */
    getMinLeafIndex() {
        const ret = wasm.assetleafpathbuilder_getMinLeafIndex(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
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
     * @returns {Uint8Array[]}
     */
    getNodeLocations() {
        const ret = wasm.assetleafpathbuilder_getNodeLocations(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
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
     * @returns {AssetLeafPathAndRoot}
     */
    buildLeafPathWithRoot() {
        const ret = wasm.assetleafpathbuilder_buildLeafPathWithRoot(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AssetLeafPathAndRoot.__wrap(ret[0]);
    }
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
     * @param {bigint} leaf_index
     * @param {number} height
     * @param {number} block_number
     */
    constructor(leaf_index, height, block_number) {
        const ret = wasm.assetleafpathbuilder_new(leaf_index, height, block_number);
        this.__wbg_ptr = ret >>> 0;
        AssetLeafPathBuilderFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
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
     * @returns {number}
     */
    getL() {
        const ret = wasm.assetleafpathbuilder_getL(this.__wbg_ptr);
        return ret >>> 0;
    }
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
     * @returns {number}
     */
    getM() {
        const ret = wasm.assetleafpathbuilder_getM(this.__wbg_ptr);
        return ret >>> 0;
    }
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
     * @param {bigint} leaf_index
     * @param {any | null} [leaf]
     */
    setLeaf(leaf_index, leaf) {
        const ret = wasm.assetleafpathbuilder_setLeaf(this.__wbg_ptr, leaf_index, isLikeNone(leaf) ? 0 : addToExternrefTable0(leaf));
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
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
     * @param {Uint8Array} root
     */
    setRoot(root) {
        const ptr0 = passArray8ToWasm0(root, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.assetleafpathbuilder_setRoot(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) AssetLeafPathBuilder.prototype[Symbol.dispose] = AssetLeafPathBuilder.prototype.free;

const AssetMintingProofFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_assetmintingproof_free(ptr >>> 0, 1));
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

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AssetMintingProof.prototype);
        obj.__wbg_ptr = ptr;
        AssetMintingProofFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AssetMintingProofFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_assetmintingproof_free(ptr, 0);
    }
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
     * @param {Uint8Array} bytes
     * @returns {AssetMintingProof}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.assetmintingproof_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AssetMintingProof.__wrap(ret[0]);
    }
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
     * @returns {string}
     */
    toHex() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.assetmintingproof_toHex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
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
     * @param {string} hex_str
     * @returns {AssetMintingProof}
     */
    static fromHex(hex_str) {
        const ptr0 = passStringToWasm0(hex_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.assetmintingproof_fromHex(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AssetMintingProof.__wrap(ret[0]);
    }
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
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.assetmintingproof_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}
if (Symbol.dispose) AssetMintingProof.prototype[Symbol.dispose] = AssetMintingProof.prototype.free;

const AssetStateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_assetstate_free(ptr >>> 0, 1));
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

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AssetState.prototype);
        obj.__wbg_ptr = ptr;
        AssetStateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AssetStateFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_assetstate_free(ptr, 0);
    }
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
     * @param {Uint8Array} bytes
     * @returns {AssetState}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.assetstate_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AssetState.__wrap(ret[0]);
    }
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
     * @returns {bigint}
     */
    leafIndex() {
        const ret = wasm.assetstate_leafIndex(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
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
     * @returns {number}
     */
    auditorCount() {
        const ret = wasm.assetstate_auditorCount(this.__wbg_ptr);
        return ret >>> 0;
    }
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
     * @returns {number}
     */
    mediatorCount() {
        const ret = wasm.assetstate_mediatorCount(this.__wbg_ptr);
        return ret >>> 0;
    }
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
     * const assetDetail = await api.query.confidentialAssets.dartAssetDetails(assetId);
     * const assetState = new AssetState(assetId, assetDetail.mediators, assetDetail.auditors);
     *
     * // From pre-converted EncryptionPublicKey objects
     * const mediatorKey = new EncryptionPublicKey("0x1234...");
     * const auditorKey = new EncryptionPublicKey("0x5678...");
     * const assetState = new AssetState(assetId, [mediatorKey], [auditorKey]);
     *
     * // From hex strings or Uint8Arrays
     * const assetState = new AssetState(assetId, ["0xabc..."], [new Uint8Array(32)]);
     *
     * // Use in settlement legs
     * const leg = new LegBuilder(senderKeys, receiverKeys, assetState, amount);
     * ```
     * @param {number} asset_id
     * @param {any} mediators
     * @param {any} auditors
     */
    constructor(asset_id, mediators, auditors) {
        const ret = wasm.assetstate_new(asset_id, mediators, auditors);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        AssetStateFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
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
     * @returns {string}
     */
    toJson() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.assetstate_toJson(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
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
     * @returns {number}
     */
    assetId() {
        const ret = wasm.assetstate_assetId(this.__wbg_ptr);
        return ret >>> 0;
    }
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
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.assetstate_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}
if (Symbol.dispose) AssetState.prototype[Symbol.dispose] = AssetState.prototype.free;

const AssetTreeRootFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_assettreeroot_free(ptr >>> 0, 1));
/**
 * Asset tree root.
 *
 * Represents the root commitment of the asset curve tree at a specific point in time.
 * This root is used in settlement proofs to verify that asset states are valid.
 */
export class AssetTreeRoot {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AssetTreeRoot.prototype);
        obj.__wbg_ptr = ptr;
        AssetTreeRootFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AssetTreeRootFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_assettreeroot_free(ptr, 0);
    }
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
     * @param {Uint8Array} bytes
     * @returns {AssetTreeRoot}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.assettreeroot_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AssetTreeRoot.__wrap(ret[0]);
    }
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
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.assettreeroot_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}
if (Symbol.dispose) AssetTreeRoot.prototype[Symbol.dispose] = AssetTreeRoot.prototype.free;

const BatchedAccountAssetRegistrationProofFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_batchedaccountassetregistrationproof_free(ptr >>> 0, 1));
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

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BatchedAccountAssetRegistrationProof.prototype);
        obj.__wbg_ptr = ptr;
        BatchedAccountAssetRegistrationProofFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BatchedAccountAssetRegistrationProofFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_batchedaccountassetregistrationproof_free(ptr, 0);
    }
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
     * @param {Uint8Array} bytes
     * @returns {BatchedAccountAssetRegistrationProof}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.batchedaccountassetregistrationproof_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return BatchedAccountAssetRegistrationProof.__wrap(ret[0]);
    }
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
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.batchedaccountassetregistrationproof_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}
if (Symbol.dispose) BatchedAccountAssetRegistrationProof.prototype[Symbol.dispose] = BatchedAccountAssetRegistrationProof.prototype.free;

const EncryptionKeyPairFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_encryptionkeypair_free(ptr >>> 0, 1));
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

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(EncryptionKeyPair.prototype);
        obj.__wbg_ptr = ptr;
        EncryptionKeyPairFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EncryptionKeyPairFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_encryptionkeypair_free(ptr, 0);
    }
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
     * @param {any} settlement_ref
     * @param {number} leg_id
     * @param {SettlementLegEncrypted} leg_enc
     * @param {boolean} accept
     * @param {number} asset_id
     * @param {any} amount
     * @returns {MediatorAffirmationProof}
     */
    mediatorAffirmationProof(settlement_ref, leg_id, leg_enc, accept, asset_id, amount) {
        _assertClass(leg_enc, SettlementLegEncrypted);
        const ret = wasm.encryptionkeypair_mediatorAffirmationProof(this.__wbg_ptr, settlement_ref, leg_id, leg_enc.__wbg_ptr, accept, asset_id, amount);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return MediatorAffirmationProof.__wrap(ret[0]);
    }
}
if (Symbol.dispose) EncryptionKeyPair.prototype[Symbol.dispose] = EncryptionKeyPair.prototype.free;

const EncryptionPublicKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_encryptionpublickey_free(ptr >>> 0, 1));
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

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(EncryptionPublicKey.prototype);
        obj.__wbg_ptr = ptr;
        EncryptionPublicKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EncryptionPublicKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_encryptionpublickey_free(ptr, 0);
    }
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
     * @param {Uint8Array} bytes
     * @returns {EncryptionPublicKey}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.encryptionpublickey_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return EncryptionPublicKey.__wrap(ret[0]);
    }
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
     * @param {any} js_value
     */
    constructor(js_value) {
        const ret = wasm.encryptionpublickey_new(js_value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        EncryptionPublicKeyFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Exports the encryption public key as a JsValue for interoperability.
     * @returns {any}
     */
    toJs() {
        const ret = wasm.encryptionpublickey_toJs(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Import encryption public key from a JsValue.
     * @param {any} js_value
     * @returns {EncryptionPublicKey}
     */
    static fromJs(js_value) {
        const ret = wasm.encryptionpublickey_fromJs(js_value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return EncryptionPublicKey.__wrap(ret[0]);
    }
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
     * @returns {string}
     */
    toJson() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.encryptionpublickey_toJson(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
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
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.encryptionpublickey_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}
if (Symbol.dispose) EncryptionPublicKey.prototype[Symbol.dispose] = EncryptionPublicKey.prototype.free;

const FeeAccountLeafPathAndRootFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_feeaccountleafpathandroot_free(ptr >>> 0, 1));
/**
 * Fee account leaf path and root.
 *
 * Contains both the curve tree path from a fee account leaf to the root and the root value itself
 * at a specific block number. Used for generating zero-knowledge proofs about fee account states.
 */
export class FeeAccountLeafPathAndRoot {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FeeAccountLeafPathAndRoot.prototype);
        obj.__wbg_ptr = ptr;
        FeeAccountLeafPathAndRootFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FeeAccountLeafPathAndRootFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_feeaccountleafpathandroot_free(ptr, 0);
    }
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
     * @param {Uint8Array} bytes
     * @returns {FeeAccountLeafPathAndRoot}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.feeaccountleafpathandroot_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return FeeAccountLeafPathAndRoot.__wrap(ret[0]);
    }
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
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.feeaccountleafpathandroot_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}
if (Symbol.dispose) FeeAccountLeafPathAndRoot.prototype[Symbol.dispose] = FeeAccountLeafPathAndRoot.prototype.free;

const LegBuilderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_legbuilder_free(ptr >>> 0, 1));
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

    toJSON() {
        return {
            sender: this.sender,
            receiver: this.receiver,
            asset: this.asset,
            amount: this.amount,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LegBuilderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_legbuilder_free(ptr, 0);
    }
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
     * @param {AccountPublicKeys} sender
     * @param {AccountPublicKeys} receiver
     * @param {AssetState} asset
     * @param {any} amount
     */
    constructor(sender, receiver, asset, amount) {
        _assertClass(sender, AccountPublicKeys);
        _assertClass(receiver, AccountPublicKeys);
        _assertClass(asset, AssetState);
        const ret = wasm.legbuilder_new(sender.__wbg_ptr, receiver.__wbg_ptr, asset.__wbg_ptr, amount);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        LegBuilderFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {AccountPublicKeys}
     */
    get sender() {
        const ret = wasm.__wbg_get_legbuilder_sender(this.__wbg_ptr);
        return AccountPublicKeys.__wrap(ret);
    }
    /**
     * @param {AccountPublicKeys} arg0
     */
    set sender(arg0) {
        _assertClass(arg0, AccountPublicKeys);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_legbuilder_sender(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {AccountPublicKeys}
     */
    get receiver() {
        const ret = wasm.__wbg_get_legbuilder_receiver(this.__wbg_ptr);
        return AccountPublicKeys.__wrap(ret);
    }
    /**
     * @param {AccountPublicKeys} arg0
     */
    set receiver(arg0) {
        _assertClass(arg0, AccountPublicKeys);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_legbuilder_receiver(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {AssetState}
     */
    get asset() {
        const ret = wasm.__wbg_get_legbuilder_asset(this.__wbg_ptr);
        return AssetState.__wrap(ret);
    }
    /**
     * @param {AssetState} arg0
     */
    set asset(arg0) {
        _assertClass(arg0, AssetState);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_legbuilder_asset(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {bigint}
     */
    get amount() {
        const ret = wasm.__wbg_get_legbuilder_amount(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set amount(arg0) {
        wasm.__wbg_set_legbuilder_amount(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) LegBuilder.prototype[Symbol.dispose] = LegBuilder.prototype.free;

const MediatorAffirmationProofFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_mediatoraffirmationproof_free(ptr >>> 0, 1));
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

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(MediatorAffirmationProof.prototype);
        obj.__wbg_ptr = ptr;
        MediatorAffirmationProofFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MediatorAffirmationProofFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_mediatoraffirmationproof_free(ptr, 0);
    }
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
     * @param {Uint8Array} bytes
     * @returns {MediatorAffirmationProof}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.mediatoraffirmationproof_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return MediatorAffirmationProof.__wrap(ret[0]);
    }
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
     * @returns {string}
     */
    toHex() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.mediatoraffirmationproof_toHex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
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
     * @param {string} hex_str
     * @returns {MediatorAffirmationProof}
     */
    static fromHex(hex_str) {
        const ptr0 = passStringToWasm0(hex_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.mediatoraffirmationproof_fromHex(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return MediatorAffirmationProof.__wrap(ret[0]);
    }
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
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.mediatoraffirmationproof_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}
if (Symbol.dispose) MediatorAffirmationProof.prototype[Symbol.dispose] = MediatorAffirmationProof.prototype.free;

const ReceiverAffirmationProofFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_receiveraffirmationproof_free(ptr >>> 0, 1));
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

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ReceiverAffirmationProof.prototype);
        obj.__wbg_ptr = ptr;
        ReceiverAffirmationProofFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ReceiverAffirmationProofFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_receiveraffirmationproof_free(ptr, 0);
    }
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
     * @param {Uint8Array} bytes
     * @returns {ReceiverAffirmationProof}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.receiveraffirmationproof_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ReceiverAffirmationProof.__wrap(ret[0]);
    }
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
     * @returns {string}
     */
    toHex() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.receiveraffirmationproof_toHex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
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
     * @param {string} hex_str
     * @returns {ReceiverAffirmationProof}
     */
    static fromHex(hex_str) {
        const ptr0 = passStringToWasm0(hex_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.receiveraffirmationproof_fromHex(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ReceiverAffirmationProof.__wrap(ret[0]);
    }
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
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.receiveraffirmationproof_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}
if (Symbol.dispose) ReceiverAffirmationProof.prototype[Symbol.dispose] = ReceiverAffirmationProof.prototype.free;

const ReceiverClaimProofFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_receiverclaimproof_free(ptr >>> 0, 1));
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

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ReceiverClaimProof.prototype);
        obj.__wbg_ptr = ptr;
        ReceiverClaimProofFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ReceiverClaimProofFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_receiverclaimproof_free(ptr, 0);
    }
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
     * @param {Uint8Array} bytes
     * @returns {ReceiverClaimProof}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.receiverclaimproof_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ReceiverClaimProof.__wrap(ret[0]);
    }
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
     * @returns {string}
     */
    toHex() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.receiverclaimproof_toHex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
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
     * @param {string} hex_str
     * @returns {ReceiverClaimProof}
     */
    static fromHex(hex_str) {
        const ptr0 = passStringToWasm0(hex_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.receiverclaimproof_fromHex(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ReceiverClaimProof.__wrap(ret[0]);
    }
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
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.receiverclaimproof_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}
if (Symbol.dispose) ReceiverClaimProof.prototype[Symbol.dispose] = ReceiverClaimProof.prototype.free;

const SenderAffirmationProofFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_senderaffirmationproof_free(ptr >>> 0, 1));
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

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SenderAffirmationProof.prototype);
        obj.__wbg_ptr = ptr;
        SenderAffirmationProofFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SenderAffirmationProofFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_senderaffirmationproof_free(ptr, 0);
    }
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
     * @param {Uint8Array} bytes
     * @returns {SenderAffirmationProof}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.senderaffirmationproof_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return SenderAffirmationProof.__wrap(ret[0]);
    }
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
     * @returns {string}
     */
    toHex() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.senderaffirmationproof_toHex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
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
     * @param {string} hex_str
     * @returns {SenderAffirmationProof}
     */
    static fromHex(hex_str) {
        const ptr0 = passStringToWasm0(hex_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.senderaffirmationproof_fromHex(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return SenderAffirmationProof.__wrap(ret[0]);
    }
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
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.senderaffirmationproof_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}
if (Symbol.dispose) SenderAffirmationProof.prototype[Symbol.dispose] = SenderAffirmationProof.prototype.free;

const SenderCounterUpdateProofFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_sendercounterupdateproof_free(ptr >>> 0, 1));
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

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SenderCounterUpdateProof.prototype);
        obj.__wbg_ptr = ptr;
        SenderCounterUpdateProofFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SenderCounterUpdateProofFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_sendercounterupdateproof_free(ptr, 0);
    }
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
     * @param {Uint8Array} bytes
     * @returns {SenderCounterUpdateProof}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.sendercounterupdateproof_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return SenderCounterUpdateProof.__wrap(ret[0]);
    }
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
     * @returns {string}
     */
    toHex() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.sendercounterupdateproof_toHex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
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
     * @param {string} hex_str
     * @returns {SenderCounterUpdateProof}
     */
    static fromHex(hex_str) {
        const ptr0 = passStringToWasm0(hex_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.sendercounterupdateproof_fromHex(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return SenderCounterUpdateProof.__wrap(ret[0]);
    }
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
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.sendercounterupdateproof_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}
if (Symbol.dispose) SenderCounterUpdateProof.prototype[Symbol.dispose] = SenderCounterUpdateProof.prototype.free;

const SenderReversalProofFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_senderreversalproof_free(ptr >>> 0, 1));
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
export class SenderReversalProof {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SenderReversalProof.prototype);
        obj.__wbg_ptr = ptr;
        SenderReversalProofFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SenderReversalProofFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_senderreversalproof_free(ptr, 0);
    }
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
     * @param {Uint8Array} bytes
     * @returns {SenderReversalProof}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.senderreversalproof_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return SenderReversalProof.__wrap(ret[0]);
    }
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
     * @returns {string}
     */
    toHex() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.senderreversalproof_toHex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Imports a proof from a hex-encoded string.
     *
     * # Arguments
     * * `hex_str` - A hex string representing the SCALE-encoded proof (with or without "0x" prefix).
     *
     * # Returns
     * A `SenderReversalProof` instance.
     *
     * # Errors
     * * Throws an error if the string is not valid hex.
     * * Throws an error if the decoded bytes are not a valid sender reversal proof.
     *
     * # Example
     * ```javascript
     * const proof = SenderReversalProof.fromHex("a1b2c3...");
     * ```
     * @param {string} hex_str
     * @returns {SenderReversalProof}
     */
    static fromHex(hex_str) {
        const ptr0 = passStringToWasm0(hex_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.senderreversalproof_fromHex(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return SenderReversalProof.__wrap(ret[0]);
    }
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
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.senderreversalproof_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}
if (Symbol.dispose) SenderReversalProof.prototype[Symbol.dispose] = SenderReversalProof.prototype.free;

const SettlementBuilderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_settlementbuilder_free(ptr >>> 0, 1));
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

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SettlementBuilderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_settlementbuilder_free(ptr, 0);
    }
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
     * @param {number} asset_id
     * @param {AssetLeafPath} path
     */
    addAssetPath(asset_id, path) {
        _assertClass(path, AssetLeafPath);
        const ret = wasm.settlementbuilder_addAssetPath(this.__wbg_ptr, asset_id, path.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
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
     * @param {any} memo
     * @param {number} block_number
     * @param {AssetTreeRoot} root
     */
    constructor(memo, block_number, root) {
        _assertClass(root, AssetTreeRoot);
        const ret = wasm.settlementbuilder_new(memo, block_number, root.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        SettlementBuilderFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
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
     * @returns {SettlementProof}
     */
    build() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.settlementbuilder_build(ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return SettlementProof.__wrap(ret[0]);
    }
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
     * @param {LegBuilder} leg
     */
    addLeg(leg) {
        _assertClass(leg, LegBuilder);
        wasm.settlementbuilder_addLeg(this.__wbg_ptr, leg.__wbg_ptr);
    }
}
if (Symbol.dispose) SettlementBuilder.prototype[Symbol.dispose] = SettlementBuilder.prototype.free;

const SettlementLegFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_settlementleg_free(ptr >>> 0, 1));
/**
 * Represents a decrypted settlement leg with visible transfer details.
 *
 * This type contains the plaintext information about a transfer after successful decryption.
 * The fields are accessible as properties in JavaScript.
 *
 * # Properties
 * * `sender` - The sender's account public key (`AccountPublicKey`)
 * * `receiver` - The receiver's account public key (`AccountPublicKey`)
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

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SettlementLeg.prototype);
        obj.__wbg_ptr = ptr;
        SettlementLegFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            role: this.role,
            sender: this.sender,
            receiver: this.receiver,
            assetId: this.assetId,
            amount: this.amount,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SettlementLegFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_settlementleg_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get role() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_settlementleg_role(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set role(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_settlementleg_role(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {AccountPublicKey}
     */
    get sender() {
        const ret = wasm.__wbg_get_settlementleg_sender(this.__wbg_ptr);
        return AccountPublicKey.__wrap(ret);
    }
    /**
     * @param {AccountPublicKey} arg0
     */
    set sender(arg0) {
        _assertClass(arg0, AccountPublicKey);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_settlementleg_sender(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {AccountPublicKey}
     */
    get receiver() {
        const ret = wasm.__wbg_get_settlementleg_receiver(this.__wbg_ptr);
        return AccountPublicKey.__wrap(ret);
    }
    /**
     * @param {AccountPublicKey} arg0
     */
    set receiver(arg0) {
        _assertClass(arg0, AccountPublicKey);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_settlementleg_receiver(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {number}
     */
    get assetId() {
        const ret = wasm.__wbg_get_settlementleg_assetId(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set assetId(arg0) {
        wasm.__wbg_set_settlementleg_assetId(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {bigint}
     */
    get amount() {
        const ret = wasm.__wbg_get_settlementleg_amount(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set amount(arg0) {
        wasm.__wbg_set_settlementleg_amount(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) SettlementLeg.prototype[Symbol.dispose] = SettlementLeg.prototype.free;

const SettlementLegEncryptedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_settlementlegencrypted_free(ptr >>> 0, 1));
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

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SettlementLegEncrypted.prototype);
        obj.__wbg_ptr = ptr;
        SettlementLegEncryptedFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SettlementLegEncryptedFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_settlementlegencrypted_free(ptr, 0);
    }
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
     * @param {Uint8Array} bytes
     * @returns {SettlementLegEncrypted}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.settlementlegencrypted_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return SettlementLegEncrypted.__wrap(ret[0]);
    }
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
     * @param {AccountKeys} account_keys
     * @returns {SettlementLeg | undefined}
     */
    tryDecrypt(account_keys) {
        _assertClass(account_keys, AccountKeys);
        const ret = wasm.settlementlegencrypted_tryDecrypt(this.__wbg_ptr, account_keys.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] === 0 ? undefined : SettlementLeg.__wrap(ret[0]);
    }
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
     * @param {EncryptionKeyPair} encryption_key
     * @param {number | null} [max_asset_id]
     * @returns {SettlementLeg | undefined}
     */
    tryDecryptAsMediatorOrAuditor(encryption_key, max_asset_id) {
        _assertClass(encryption_key, EncryptionKeyPair);
        const ret = wasm.settlementlegencrypted_tryDecryptAsMediatorOrAuditor(this.__wbg_ptr, encryption_key.__wbg_ptr, isLikeNone(max_asset_id) ? 0x100000001 : (max_asset_id) >>> 0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] === 0 ? undefined : SettlementLeg.__wrap(ret[0]);
    }
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
     * @returns {string}
     */
    toHex() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.settlementlegencrypted_toHex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
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
     * @param {string} hex_str
     * @returns {SettlementLegEncrypted}
     */
    static fromHex(hex_str) {
        const ptr0 = passStringToWasm0(hex_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.settlementlegencrypted_fromHex(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return SettlementLegEncrypted.__wrap(ret[0]);
    }
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
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.settlementlegencrypted_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}
if (Symbol.dispose) SettlementLegEncrypted.prototype[Symbol.dispose] = SettlementLegEncrypted.prototype.free;

const SettlementLegsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_settlementlegs_free(ptr >>> 0, 1));
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

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SettlementLegs.prototype);
        obj.__wbg_ptr = ptr;
        SettlementLegsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SettlementLegsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_settlementlegs_free(ptr, 0);
    }
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
     * @param {number} index
     * @returns {SettlementLeg | undefined}
     */
    getLeg(index) {
        const ret = wasm.settlementlegs_getLeg(this.__wbg_ptr, index);
        return ret === 0 ? undefined : SettlementLeg.__wrap(ret);
    }
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
     * @returns {number}
     */
    legCount() {
        const ret = wasm.settlementlegs_legCount(this.__wbg_ptr);
        return ret >>> 0;
    }
}
if (Symbol.dispose) SettlementLegs.prototype[Symbol.dispose] = SettlementLegs.prototype.free;

const SettlementLegsEncryptedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_settlementlegsencrypted_free(ptr >>> 0, 1));
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

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SettlementLegsEncrypted.prototype);
        obj.__wbg_ptr = ptr;
        SettlementLegsEncryptedFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SettlementLegsEncryptedFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_settlementlegsencrypted_free(ptr, 0);
    }
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
     * @param {Uint8Array} bytes
     * @returns {SettlementLegsEncrypted}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.settlementlegsencrypted_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return SettlementLegsEncrypted.__wrap(ret[0]);
    }
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
     * @param {AccountKeys} account_keys
     * @returns {SettlementLegs}
     */
    tryDecrypt(account_keys) {
        _assertClass(account_keys, AccountKeys);
        const ret = wasm.settlementlegsencrypted_tryDecrypt(this.__wbg_ptr, account_keys.__wbg_ptr);
        return SettlementLegs.__wrap(ret);
    }
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
     * @param {EncryptionKeyPair} encryption_key
     * @returns {SettlementLegs}
     */
    tryDecryptAsMediatorOrAuditor(encryption_key) {
        _assertClass(encryption_key, EncryptionKeyPair);
        const ret = wasm.settlementlegsencrypted_tryDecryptAsMediatorOrAuditor(this.__wbg_ptr, encryption_key.__wbg_ptr);
        return SettlementLegs.__wrap(ret);
    }
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
     * @param {number} index
     * @returns {SettlementLegEncrypted | undefined}
     */
    getLeg(index) {
        const ret = wasm.settlementlegsencrypted_getLeg(this.__wbg_ptr, index);
        return ret === 0 ? undefined : SettlementLegEncrypted.__wrap(ret);
    }
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
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.settlementlegsencrypted_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
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
     * @returns {number}
     */
    legCount() {
        const ret = wasm.settlementlegsencrypted_legCount(this.__wbg_ptr);
        return ret >>> 0;
    }
}
if (Symbol.dispose) SettlementLegsEncrypted.prototype[Symbol.dispose] = SettlementLegsEncrypted.prototype.free;

const SettlementProofFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_settlementproof_free(ptr >>> 0, 1));
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

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SettlementProof.prototype);
        obj.__wbg_ptr = ptr;
        SettlementProofFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SettlementProofFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_settlementproof_free(ptr, 0);
    }
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
     * @param {Uint8Array} bytes
     * @returns {SettlementProof}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.settlementproof_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return SettlementProof.__wrap(ret[0]);
    }
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
     * @returns {number}
     */
    getLegCount() {
        const ret = wasm.settlementproof_getLegCount(this.__wbg_ptr);
        return ret >>> 0;
    }
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
     * @returns {number}
     */
    getBlockNumber() {
        const ret = wasm.settlementproof_getBlockNumber(this.__wbg_ptr);
        return ret >>> 0;
    }
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
     * @returns {SettlementLegsEncrypted}
     */
    getEncryptedLegs() {
        const ret = wasm.settlementproof_getEncryptedLegs(this.__wbg_ptr);
        return SettlementLegsEncrypted.__wrap(ret);
    }
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
     * @returns {any}
     */
    getMemo() {
        const ret = wasm.settlementproof_getMemo(this.__wbg_ptr);
        return ret;
    }
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
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.settlementproof_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}
if (Symbol.dispose) SettlementProof.prototype[Symbol.dispose] = SettlementProof.prototype.free;

export function __wbg_BigInt_77ad2fe9a1c378c1(arg0) {
    const ret = BigInt(arg0);
    return ret;
};

export function __wbg_BigInt_7bf8b8b2f99c431a() { return handleError(function (arg0) {
    const ret = BigInt(arg0);
    return ret;
}, arguments) };

export function __wbg_Error_e83987f665cf5504(arg0, arg1) {
    const ret = Error(getStringFromWasm0(arg0, arg1));
    return ret;
};

export function __wbg_String_8f0eb39a4a4c2f66(arg0, arg1) {
    const ret = String(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg___wbindgen_boolean_get_6d5a1ee65bab5f68(arg0) {
    const v = arg0;
    const ret = typeof(v) === 'boolean' ? v : undefined;
    return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
};

export function __wbg___wbindgen_debug_string_df47ffb5e35e6763(arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg___wbindgen_in_bb933bd9e1b3bc0f(arg0, arg1) {
    const ret = arg0 in arg1;
    return ret;
};

export function __wbg___wbindgen_is_function_ee8a6c5833c90377(arg0) {
    const ret = typeof(arg0) === 'function';
    return ret;
};

export function __wbg___wbindgen_is_object_c818261d21f283a4(arg0) {
    const val = arg0;
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
};

export function __wbg___wbindgen_is_string_fbb76cb2940daafd(arg0) {
    const ret = typeof(arg0) === 'string';
    return ret;
};

export function __wbg___wbindgen_is_undefined_2d472862bd29a478(arg0) {
    const ret = arg0 === undefined;
    return ret;
};

export function __wbg___wbindgen_jsval_loose_eq_b664b38a2f582147(arg0, arg1) {
    const ret = arg0 == arg1;
    return ret;
};

export function __wbg___wbindgen_lt_6594d884e1c6a1ab(arg0, arg1) {
    const ret = arg0 < arg1;
    return ret;
};

export function __wbg___wbindgen_neg_9b61844910d27670(arg0) {
    const ret = -arg0;
    return ret;
};

export function __wbg___wbindgen_number_get_a20bf9b85341449d(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};

export function __wbg___wbindgen_string_get_e4f06c90489ad01b(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg___wbindgen_throw_b855445ff6a94295(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbg_call_525440f72fbfc0ea() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.call(arg1, arg2);
    return ret;
}, arguments) };

export function __wbg_call_e762c39fa8ea36bf() { return handleError(function (arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
}, arguments) };

export function __wbg_crypto_574e78ad8b13b65f(arg0) {
    const ret = arg0.crypto;
    return ret;
};

export function __wbg_debug_e55e1461940eb14d(arg0, arg1, arg2, arg3) {
    console.debug(arg0, arg1, arg2, arg3);
};

export function __wbg_error_a7f8fbb0523dae15(arg0) {
    console.error(arg0);
};

export function __wbg_error_d8b22cf4e59a6791(arg0, arg1, arg2, arg3) {
    console.error(arg0, arg1, arg2, arg3);
};

export function __wbg_from_a4ad7cbddd0d7135(arg0) {
    const ret = Array.from(arg0);
    return ret;
};

export function __wbg_getRandomValues_b8f5dbd5f3995a9e() { return handleError(function (arg0, arg1) {
    arg0.getRandomValues(arg1);
}, arguments) };

export function __wbg_get_7bed016f185add81(arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return ret;
};

export function __wbg_get_efcb449f58ec27c2() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(arg0, arg1);
    return ret;
}, arguments) };

export function __wbg_get_with_ref_key_1dc361bd10053bfe(arg0, arg1) {
    const ret = arg0[arg1];
    return ret;
};

export function __wbg_info_68cd5b51ef7e5137(arg0, arg1, arg2, arg3) {
    console.info(arg0, arg1, arg2, arg3);
};

export function __wbg_instanceof_ArrayBuffer_70beb1189ca63b38(arg0) {
    let result;
    try {
        result = arg0 instanceof ArrayBuffer;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_Uint8Array_20c8e73002f7af98(arg0) {
    let result;
    try {
        result = arg0 instanceof Uint8Array;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_length_69bca3cb64fc8748(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_length_cdd215e10d9dd507(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_log_45eb3a49e7cdcb64(arg0, arg1, arg2, arg3) {
    console.log(arg0, arg1, arg2, arg3);
};

export function __wbg_msCrypto_a61aeb35a24c1329(arg0) {
    const ret = arg0.msCrypto;
    return ret;
};

export function __wbg_new_1acc0b6eea89d040() {
    const ret = new Object();
    return ret;
};

export function __wbg_new_5a79be3ab53b8aa5(arg0) {
    const ret = new Uint8Array(arg0);
    return ret;
};

export function __wbg_new_from_slice_92f4d78ca282a2d2(arg0, arg1) {
    const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
    return ret;
};

export function __wbg_new_no_args_ee98eee5275000a4(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return ret;
};

export function __wbg_new_with_length_01aa0dc35aa13543(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return ret;
};

export function __wbg_node_905d3e251edff8a2(arg0) {
    const ret = arg0.node;
    return ret;
};

export function __wbg_process_dc0fbacc7c1c06f7(arg0) {
    const ret = arg0.process;
    return ret;
};

export function __wbg_prototypesetcall_2a6620b6922694b2(arg0, arg1, arg2) {
    Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
};

export function __wbg_randomFillSync_ac0988aba3254290() { return handleError(function (arg0, arg1) {
    arg0.randomFillSync(arg1);
}, arguments) };

export function __wbg_require_60cc747a6bc5215a() { return handleError(function () {
    const ret = module.require;
    return ret;
}, arguments) };

export function __wbg_set_3f1d0b984ed272ed(arg0, arg1, arg2) {
    arg0[arg1] = arg2;
};

export function __wbg_static_accessor_GLOBAL_89e1d9ac6a1b250e() {
    const ret = typeof global === 'undefined' ? null : global;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_GLOBAL_THIS_8b530f326a9e48ac() {
    const ret = typeof globalThis === 'undefined' ? null : globalThis;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_SELF_6fdf4b64710cc91b() {
    const ret = typeof self === 'undefined' ? null : self;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_WINDOW_b45bfc5a37f6cfa2() {
    const ret = typeof window === 'undefined' ? null : window;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_subarray_480600f3d6a9f26c(arg0, arg1, arg2) {
    const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
    return ret;
};

export function __wbg_toString_b4979eaf8b235b54(arg0, arg1, arg2) {
    const ret = arg1.toString(arg2);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_versions_c01dfd4722a88165(arg0) {
    const ret = arg0.versions;
    return ret;
};

export function __wbg_warn_8f5b5437666d0885(arg0, arg1, arg2, arg3) {
    console.warn(arg0, arg1, arg2, arg3);
};

export function __wbindgen_cast_2241b6af4c4b2941(arg0, arg1) {
    // Cast intrinsic for `Ref(String) -> Externref`.
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
};

export function __wbindgen_cast_cb9088102bce6b30(arg0, arg1) {
    // Cast intrinsic for `Ref(Slice(U8)) -> NamedExternref("Uint8Array")`.
    const ret = getArrayU8FromWasm0(arg0, arg1);
    return ret;
};

export function __wbindgen_cast_d6cd19b81560fd6e(arg0) {
    // Cast intrinsic for `F64 -> Externref`.
    const ret = arg0;
    return ret;
};

export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_externrefs;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
    ;
};

export function __wbindgen_object_is_null_or_undefined(arg0) {
    const ret = arg0 == null;
    return ret;
};

export function __wbindgen_object_is_undefined(arg0) {
    const ret = arg0 === undefined;
    return ret;
};

