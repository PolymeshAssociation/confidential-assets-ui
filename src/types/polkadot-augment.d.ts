/**
 * Type augmentations for Polkadot API with Polymesh types
 *
 * This file ensures TypeScript recognizes the Polymesh-specific types
 * from @polymeshassociation/polymesh-types
 *
 * TODO: Remove this file once @polymeshassociation/polymesh-types and
 * @polymeshassociation/polymesh-sdk are updated with the curve tree types.
 * After update, import types directly from '@polkadot/types/lookup' instead.
 */

// Import the types from the polymesh types package
import '@polymeshassociation/polymesh-types';

// Re-export specific types we need
// TODO: Remove these re-exports and import directly from '@polkadot/types/lookup'
// once the SDK is updated
import type {
  PolymeshDartBpAccountAccountStateCommitment,
  PolymeshDartBpEncodeCompressedAffine,
  PolymeshDartCurveTreeCommonCompressedInner,
  PolymeshDartCurveTreeCompressedCurveTreeRoot,
} from '@polkadot/types/lookup';

// interface PolymeshDartCurveTreeCompressedCurveTreeRoot extends Struct {
//   readonly commitments: Vec<PolymeshDartBpEncodeCompressedAffine>;
//   readonly xCoordChildren: Vec<Vec<U8aFixed>>;
//   readonly height: u8;
// }

export type {
  PolymeshDartBpAccountAccountStateCommitment,
  PolymeshDartBpEncodeCompressedAffine,
  PolymeshDartCurveTreeCommonCompressedInner,
  PolymeshDartCurveTreeCompressedCurveTreeRoot,
};
