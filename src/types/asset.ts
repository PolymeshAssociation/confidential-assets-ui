/**
 * Confidential Asset Type Definitions
 */

/**
 * Metadata template types for common asset classes
 */
export type AssetTemplateType =
  | 'basic'
  | 'currency'
  | 'equity'
  | 'debt'
  | 'fund'
  | 'commodity'
  | 'real-estate'
  | 'derivative'
  | 'structured-product'
  | 'credit-entitlement'
  | 'custom';

/**
 * Comprehensive metadata structure for confidential assets
 * Stored on-chain in the asset's data field (max ~8KB)
 */
export interface AssetMetadataKnownFields {
  // ===== Universal Fields (Required/Common) =====
  /** Broad category (e.g. "Equity", "Debt") */
  assetType: string;
  /** Specific type (e.g. "Common Stock", "Convertible Bond") */
  assetSubType?: string;
  /** Detailed description of the asset */
  description?: string;
  /** ISO 4217 currency code (USD, EUR, GBP) */
  currency?: string;
  /** Legal name of the issuing entity */
  issuer?: string;
  /** LEI or company registration number */
  issuerIdentifier?: string;
  /** Legal jurisdiction (US, UK, SG, etc.) */
  jurisdiction?: string;
  /** Official website URL */
  website?: string;
  /** URL to whitepaper, prospectus, or offering document */
  whitepaper?: string;
  /** URI to off-chain metadata (JSON/IPFS) for mutable data */
  metadataUri?: string;

  // ===== Financial Identifiers =====
  /** International Securities Identification Number (12 chars) */
  isin?: string;
  /** CUSIP identifier (9 chars, North America) */
  cusip?: string;
  /** CUSIP International Numbering System (9 chars, non-US/CA) */
  cins?: string;
  /** Stock Exchange Daily Official List (7 chars, UK) */
  sedol?: string;
  /** Financial Instrument Global Identifier (12 chars) */
  figi?: string;
  /** Legal Entity Identifier of the issuer (20 chars) */
  lei?: string;

  // ===== Currency Template Fields =====
  peggedCurrency?: string;
  pegMechanism?:
    | 'fiat-backed'
    | 'crypto-collateralized'
    | 'algorithmic'
    | 'hybrid';
  collateralType?: string;
  reserveAuditor?: string;
  attestationFrequency?: 'real-time' | 'daily' | 'monthly' | 'quarterly';
  redeemable?: 'yes' | 'no' | 'qualified-only';
  minimumRedemption?: number;
  redemptionFee?: number;

  // ===== Equity Template Fields =====
  shareClass?: string;
  votingRights?: 'voting' | 'non-voting' | 'limited' | 'super-voting';
  dividendRights?: 'cumulative' | 'non-cumulative' | 'participating' | 'none';
  parValue?: number;
  authorizedShares?: string;
  liquidationPreference?: number;
  conversionRights?: string;
  transferRestrictions?: string;
  registrar?: string;

  // ===== Debt Template Fields =====
  debtType?: string;
  issueDate?: string;
  maturityDate?: string;
  couponRate?: number;
  couponType?: 'fixed' | 'floating' | 'zero-coupon' | 'step-up';
  paymentFrequency?: string;
  dayCountConvention?: string;
  seniority?: string;
  collateral?: string;
  callable?: 'yes' | 'no';
  callDate?: string;
  callPrice?: number;
  putable?: 'yes' | 'no';
  putDate?: string;
  creditRating?: string;
  ratingAgency?: string;
  guarantor?: string;
  covenants?: string;

  // ===== Fund Template Fields =====
  fundType?: string;
  fundManager?: string;
  managementFee?: number;
  performanceFee?: number;
  inceptionDate?: string;
  initialNav?: number;
  benchmark?: string;
  investmentObjective?: string;
  assetClass?: string;
  minimumInvestment?: number;
  redemptionPeriod?: string;
  lockupPeriod?: string;
  administrator?: string;
  custodian?: string;
  auditor?: string;

  // ===== Commodity Template Fields =====
  commodityCategory?: string;
  specificCommodity?: string;
  grade?: string;
  purity?: string;
  standardUnit?: string;
  tokensPerUnit?: number;
  deliveryLocation?: string;
  contractStandard?: string;
  assayProvider?: string;
  insuranceProvider?: string;
  auditFrequency?: string;

  // ===== Real Estate Template Fields =====
  propertyType?: string;
  propertyAddress?: string;
  propertyIdentifier?: string;
  totalValue?: number;
  valuationDate?: string;
  valuationFirm?: string;
  totalArea?: string;
  yearBuilt?: number;
  occupancyStatus?: string;
  occupancyRate?: number;
  annualRentalIncome?: number;
  propertyManager?: string;
  titleStatus?: string;
  encumbrances?: string;

  // ===== Derivative Template Fields =====
  derivativeType?: string;
  underlyingAsset?: string;
  underlyingIdentifier?: string;
  strikePrice?: number;
  settlementType?: string;
  contractSize?: number;
  tickSize?: number;
  marginRequirement?: number;
  fundingRate?: number;
  exerciseStyle?: string;
  clearingHouse?: string;

  // ===== Structured Product Template Fields =====
  productType?: string;
  underlyingAssets?: string;
  issuePrice?: number;
  capitalProtection?: number;
  barrierLevel?: number;
  barrierType?: string;
  participationRate?: number;
  cap?: number;
  observationDates?: string;
  autocallTrigger?: number;
  payoffFormula?: string;
  calculationAgent?: string;

  // ===== Credit/Entitlement Template Fields =====
  creditCategory?: string;
  projectType?: string;
  vintageYear?: number;
  certifyingStandard?: string;
  geography?: string;
  methodology?: string;
  verificationBody?: string;
  registryId?: string;
  registry?: string;
  retirementEligible?: string;
  projectId?: string;
  expirationDate?: string;

  // ===== Digital Token Template Fields =====
  tokenCategory?: string;
  platform?: string;
  utility?: string;
  maxSupply?: string;
  initialSupply?: string;
  supplyModel?: string;
  inflationRate?: number;
  mintingMechanism?: string;
  burningMechanism?: string;
  stakingAvailable?: string;
  stakingReward?: number;
  vestingSchedule?: string;
  governanceModel?: string;
}

export type AssetMetadataKey = keyof AssetMetadataKnownFields;

export interface AssetMetadata extends AssetMetadataKnownFields {
  // ===== Custom Fields =====
  /** Additional user-defined fields */
  [key: string]: string | number | boolean | undefined;
}

/**
 * Complete asset details from chain
 * Includes all fields from PalletConfidentialAssetsDartAssetDetail
 */
export interface AssetDetails {
  /** Asset ID */
  assetId: string;
  /** Asset name (queried from confidentialAssetNames) */
  name: string;
  /** Asset symbol/ticker (queried from confidentialAssetSymbols) */
  symbol: string;
  /** Number of decimal places (queried from confidentialAssetDecimals) */
  decimals: number;
  /** Total supply from chain (raw value, not scaled by decimals) */
  totalSupply: string;
  /** Owner DID from chain */
  ownerDid: string;
  /** Decoded metadata from chain data field */
  metadata?: AssetMetadata;
  /** Array of mediator encryption public keys (hex strings) */
  mediators: string[];
  /** Array of auditor encryption public keys (hex strings) */
  auditors: string[];
  /** Current balance (only present for registered assets with account state) */
  balance?: string;
  /** Timestamp when details were fetched/cached */
  fetchedAt: number;
}

/**
 * Account asset state storage record
 * Stores the WASM AccountAssetState for a specific account-asset pair
 */
export interface AccountAssetStateRecord {
  version: 1;
  /** Account public key (hex) */
  accountPublicKey: string;
  /** Asset ID */
  assetId: string;
  /** SCALE-encoded AccountAssetState bytes (base64) */
  stateBytes: string;
  /** Last known leaf index */
  leafIndex: string; // bigint as string
  /** Last update timestamp */
  updatedAt: number;
}
