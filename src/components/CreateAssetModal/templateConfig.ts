import type { AssetMetadataKey } from '@/types/asset';

export type FieldType = 'text' | 'number' | 'autocomplete';

export interface FieldDefinition {
  key: AssetMetadataKey;
  label: string;
  type: FieldType;
  placeholder?: string;
  data?: string[];
}

export type TemplateRow = FieldDefinition | FieldDefinition[];

export const TEMPLATE_CONFIG: Record<string, TemplateRow[]> = {
  currency: [
    [
      {
        key: 'peggedCurrency',
        label: 'Pegged Currency',
        type: 'autocomplete',
        data: ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'AUD', 'CAD', 'CHF', 'HKD'],
        placeholder: 'e.g. USD, EUR',
      },
      {
        key: 'pegMechanism',
        label: 'Peg Mechanism',
        type: 'autocomplete',
        data: ['fiat-backed', 'crypto-collateralized', 'algorithmic', 'hybrid'],
        placeholder: 'e.g. fiat-backed',
      },
    ],
    [
      {
        key: 'collateralType',
        label: 'Collateral Type',
        type: 'text',
        placeholder: 'e.g. US Treasury Bills',
      },
      {
        key: 'reserveAuditor',
        label: 'Reserve Auditor',
        type: 'text',
        placeholder: 'e.g. Audit Firm Name',
      },
    ],
    {
      key: 'attestationFrequency',
      label: 'Attestation Frequency',
      type: 'autocomplete',
      data: ['real-time', 'daily', 'monthly', 'quarterly'],
      placeholder: 'e.g. daily, monthly',
    },
  ],
  equity: [
    [
      {
        key: 'shareClass',
        label: 'Share Class',
        type: 'text',
        placeholder: 'e.g. Class A Common',
      },
      {
        key: 'votingRights',
        label: 'Voting Rights',
        type: 'autocomplete',
        data: ['voting', 'non-voting', 'limited', 'super-voting'],
        placeholder: 'e.g. voting, non-voting',
      },
    ],
    [
      {
        key: 'dividendRights',
        label: 'Dividend Rights',
        type: 'autocomplete',
        data: ['cumulative', 'non-cumulative', 'participating', 'none'],
        placeholder: 'e.g. cumulative',
      },
      {
        key: 'parValue',
        label: 'Par Value',
        type: 'number',
      },
    ],
    [
      {
        key: 'authorizedShares',
        label: 'Authorized Shares',
        type: 'text',
      },
      {
        key: 'liquidationPreference',
        label: 'Liquidation Preference (multiplier)',
        type: 'number',
      },
    ],
    {
      key: 'transferRestrictions',
      label: 'Transfer Restrictions',
      type: 'text',
    },
  ],
  debt: [
    [
      {
        key: 'debtType',
        label: 'Debt Type',
        type: 'text',
        placeholder: 'e.g. Senior Secured Note',
      },
      {
        key: 'issueDate',
        label: 'Issue Date',
        type: 'text',
        placeholder: 'YYYY-MM-DD',
      },
    ],
    [
      {
        key: 'maturityDate',
        label: 'Maturity Date',
        type: 'text',
        placeholder: 'YYYY-MM-DD',
      },
      {
        key: 'couponRate',
        label: 'Coupon Rate (%)',
        type: 'number',
      },
    ],
    [
      {
        key: 'couponType',
        label: 'Coupon Type',
        type: 'autocomplete',
        data: ['fixed', 'floating', 'zero-coupon', 'step-up'],
        placeholder: 'e.g. fixed, floating',
      },
      {
        key: 'paymentFrequency',
        label: 'Payment Frequency',
        type: 'text',
        placeholder: 'e.g. Semi-annual',
      },
    ],
    [
      {
        key: 'seniority',
        label: 'Seniority',
        type: 'text',
        placeholder: 'e.g. Senior Secured',
      },
      {
        key: 'callable',
        label: 'Callable',
        type: 'autocomplete',
        data: ['yes', 'no'],
        placeholder: 'e.g. yes, no',
      },
    ],
  ],
  fund: [
    [
      {
        key: 'fundType',
        label: 'Fund Type',
        type: 'text',
        placeholder: 'e.g. Open-ended',
      },
      {
        key: 'fundManager',
        label: 'Fund Manager',
        type: 'text',
      },
    ],
    [
      {
        key: 'managementFee',
        label: 'Management Fee (%)',
        type: 'number',
      },
      {
        key: 'performanceFee',
        label: 'Performance Fee (%)',
        type: 'number',
      },
    ],
    [
      {
        key: 'inceptionDate',
        label: 'Inception Date',
        type: 'text',
        placeholder: 'YYYY-MM-DD',
      },
      {
        key: 'initialNav',
        label: 'Initial NAV',
        type: 'number',
      },
    ],
    [
      {
        key: 'investmentObjective',
        label: 'Investment Objective',
        type: 'text',
      },
      {
        key: 'minimumInvestment',
        label: 'Minimum Investment',
        type: 'number',
      },
    ],
  ],
  commodity: [
    [
      {
        key: 'commodityCategory',
        label: 'Category',
        type: 'text',
        placeholder: 'e.g. Precious Metals',
      },
      {
        key: 'specificCommodity',
        label: 'Specific Commodity',
        type: 'text',
        placeholder: 'e.g. Gold Bullion',
      },
    ],
    [
      {
        key: 'grade',
        label: 'Grade/Quality',
        type: 'text',
      },
      {
        key: 'purity',
        label: 'Purity',
        type: 'text',
      },
    ],
    [
      {
        key: 'standardUnit',
        label: 'Standard Unit',
        type: 'text',
        placeholder: 'e.g. Troy Ounce',
      },
      {
        key: 'deliveryLocation',
        label: 'Delivery Location',
        type: 'text',
      },
    ],
  ],
  'real-estate': [
    [
      {
        key: 'propertyType',
        label: 'Property Type',
        type: 'text',
        placeholder: 'e.g. Commercial Office',
      },
      {
        key: 'propertyAddress',
        label: 'Property Address',
        type: 'text',
      },
    ],
    [
      {
        key: 'totalValue',
        label: 'Total Value',
        type: 'number',
      },
      {
        key: 'valuationDate',
        label: 'Valuation Date',
        type: 'text',
        placeholder: 'YYYY-MM-DD',
      },
    ],
    [
      {
        key: 'totalArea',
        label: 'Total Area',
        type: 'text',
        placeholder: 'e.g. 5000 sq ft',
      },
      {
        key: 'occupancyRate',
        label: 'Occupancy Rate (%)',
        type: 'number',
      },
    ],
  ],
  derivative: [
    [
      {
        key: 'derivativeType',
        label: 'Derivative Type',
        type: 'text',
        placeholder: 'e.g. Call Option',
      },
      {
        key: 'underlyingIdentifier',
        label: 'Underlying Identifier',
        type: 'text',
      },
    ],
    [
      {
        key: 'strikePrice',
        label: 'Strike Price',
        type: 'number',
      },
      {
        key: 'expirationDate',
        label: 'Expiration Date',
        type: 'text',
        placeholder: 'YYYY-MM-DD',
      },
    ],
    [
      {
        key: 'settlementType',
        label: 'Settlement Type',
        type: 'text',
        placeholder: 'e.g. Physical, Cash',
      },
      {
        key: 'contractSize',
        label: 'Contract Size',
        type: 'number',
      },
    ],
  ],
  'structured-product': [
    [
      {
        key: 'productType',
        label: 'Product Type',
        type: 'text',
        placeholder: 'e.g. Reverse Convertible',
      },
      {
        key: 'underlyingAssets',
        label: 'Underlying Assets',
        type: 'text',
      },
    ],
    [
      {
        key: 'capitalProtection',
        label: 'Capital Protection (%)',
        type: 'number',
      },
      {
        key: 'barrierLevel',
        label: 'Barrier Level',
        type: 'number',
      },
    ],
    [
      {
        key: 'participationRate',
        label: 'Participation Rate (%)',
        type: 'number',
      },
      {
        key: 'cap',
        label: 'Cap (%)',
        type: 'number',
      },
    ],
  ],
  'credit-entitlement': [
    [
      {
        key: 'creditCategory',
        label: 'Category',
        type: 'text',
        placeholder: 'e.g. Carbon Offset',
      },
      {
        key: 'projectType',
        label: 'Project Type',
        type: 'text',
      },
    ],
    [
      {
        key: 'vintageYear',
        label: 'Vintage Year',
        type: 'number',
      },
      {
        key: 'certifyingStandard',
        label: 'Certifying Standard',
        type: 'text',
      },
    ],
    [
      {
        key: 'registry',
        label: 'Registry',
        type: 'text',
      },
      {
        key: 'registryId',
        label: 'Registry ID',
        type: 'text',
      },
    ],
  ],
  basic: [
    [
      {
        key: 'tokenCategory',
        label: 'Category',
        type: 'text',
        placeholder: 'e.g. Utility Token',
      },
      {
        key: 'platform',
        label: 'Platform',
        type: 'text',
      },
    ],
    [
      {
        key: 'maxSupply',
        label: 'Max Supply',
        type: 'text',
      },
      {
        key: 'initialSupply',
        label: 'Initial Supply',
        type: 'text',
      },
    ],
    [
      {
        key: 'utility',
        label: 'Utility/Use Case',
        type: 'text',
      },
      {
        key: 'governanceModel',
        label: 'Governance Model',
        type: 'text',
      },
    ],
  ],
};
