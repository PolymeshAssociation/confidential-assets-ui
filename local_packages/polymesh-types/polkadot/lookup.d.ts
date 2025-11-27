declare const _default: {
    /**
     * Lookup3: frame_system::AccountInfo<Index, pallet_balances::AccountData>
     **/
    FrameSystemAccountInfo: {
        nonce: string;
        consumers: string;
        providers: string;
        sufficients: string;
        data: string;
    };
    /**
     * Lookup5: pallet_balances::AccountData
     **/
    PalletBalancesAccountData: {
        free: string;
        reserved: string;
        miscFrozen: string;
        feeFrozen: string;
    };
    /**
     * Lookup7: frame_support::dispatch::PerDispatchClass<sp_weights::weight_v2::Weight>
     **/
    FrameSupportDispatchPerDispatchClassWeight: {
        normal: string;
        operational: string;
        mandatory: string;
    };
    /**
     * Lookup8: sp_weights::weight_v2::Weight
     **/
    SpWeightsWeightV2Weight: {
        refTime: string;
        proofSize: string;
    };
    /**
     * Lookup13: sp_runtime::generic::digest::Digest
     **/
    SpRuntimeDigest: {
        logs: string;
    };
    /**
     * Lookup15: sp_runtime::generic::digest::DigestItem
     **/
    SpRuntimeDigestDigestItem: {
        _enum: {
            Other: string;
            __Unused1: string;
            __Unused2: string;
            __Unused3: string;
            Consensus: string;
            Seal: string;
            PreRuntime: string;
            __Unused7: string;
            RuntimeEnvironmentUpdated: string;
        };
    };
    /**
     * Lookup18: frame_system::EventRecord<polymesh_runtime_develop::runtime::RuntimeEvent, primitive_types::H256>
     **/
    FrameSystemEventRecord: {
        phase: string;
        event: string;
        topics: string;
    };
    /**
     * Lookup20: frame_system::pallet::Event<T>
     **/
    FrameSystemEvent: {
        _enum: {
            ExtrinsicSuccess: {
                dispatchInfo: string;
            };
            ExtrinsicFailed: {
                dispatchError: string;
                dispatchInfo: string;
            };
            CodeUpdated: string;
            NewAccount: {
                account: string;
            };
            KilledAccount: {
                account: string;
            };
            Remarked: {
                _alias: {
                    hash_: string;
                };
                sender: string;
                hash_: string;
            };
        };
    };
    /**
     * Lookup21: frame_support::dispatch::DispatchInfo
     **/
    FrameSupportDispatchDispatchInfo: {
        weight: string;
        class: string;
        paysFee: string;
    };
    /**
     * Lookup22: frame_support::dispatch::DispatchClass
     **/
    FrameSupportDispatchDispatchClass: {
        _enum: string[];
    };
    /**
     * Lookup23: frame_support::dispatch::Pays
     **/
    FrameSupportDispatchPays: {
        _enum: string[];
    };
    /**
     * Lookup24: sp_runtime::DispatchError
     **/
    SpRuntimeDispatchError: {
        _enum: {
            Other: string;
            CannotLookup: string;
            BadOrigin: string;
            Module: string;
            ConsumerRemaining: string;
            NoProviders: string;
            TooManyConsumers: string;
            Token: string;
            Arithmetic: string;
            Transactional: string;
            Exhausted: string;
            Corruption: string;
            Unavailable: string;
        };
    };
    /**
     * Lookup25: sp_runtime::ModuleError
     **/
    SpRuntimeModuleError: {
        index: string;
        error: string;
    };
    /**
     * Lookup26: sp_runtime::TokenError
     **/
    SpRuntimeTokenError: {
        _enum: string[];
    };
    /**
     * Lookup27: sp_arithmetic::ArithmeticError
     **/
    SpArithmeticArithmeticError: {
        _enum: string[];
    };
    /**
     * Lookup28: sp_runtime::TransactionalError
     **/
    SpRuntimeTransactionalError: {
        _enum: string[];
    };
    /**
     * Lookup29: pallet_indices::pallet::Event<T>
     **/
    PalletIndicesEvent: {
        _enum: {
            IndexAssigned: {
                who: string;
                index: string;
            };
            IndexFreed: {
                index: string;
            };
            IndexFrozen: {
                index: string;
                who: string;
            };
        };
    };
    /**
     * Lookup30: pallet_balances::pallet::Event<T>
     **/
    PalletBalancesEvent: {
        _enum: {
            Endowed: string;
            Transfer: string;
            BalanceSet: string;
            AccountBalanceBurned: string;
            Reserved: string;
            Unreserved: string;
            ReserveRepatriated: string;
        };
    };
    /**
     * Lookup32: polymesh_primitives::identity_id::IdentityId
     **/
    PolymeshPrimitivesIdentityId: string;
    /**
     * Lookup34: polymesh_primitives::Memo
     **/
    PolymeshPrimitivesMemo: string;
    /**
     * Lookup35: frame_support::traits::tokens::misc::BalanceStatus
     **/
    FrameSupportTokensMiscBalanceStatus: {
        _enum: string[];
    };
    /**
     * Lookup36: pallet_transaction_payment::pallet::Event<T>
     **/
    PalletTransactionPaymentEvent: {
        _enum: {
            TransactionFeePaid: {
                who: string;
                actualFee: string;
                tip: string;
            };
        };
    };
    /**
     * Lookup37: pallet_identity::pallet::Event<T>
     **/
    PalletIdentityEvent: {
        _enum: {
            DidCreated: string;
            SecondaryKeysAdded: string;
            SecondaryKeysRemoved: string;
            SecondaryKeyLeftIdentity: string;
            SecondaryKeyPermissionsUpdated: string;
            PrimaryKeyUpdated: string;
            ClaimAdded: string;
            ClaimRevoked: string;
            AssetDidRegistered: string;
            AuthorizationAdded: string;
            AuthorizationRevoked: string;
            AuthorizationRejected: string;
            AuthorizationConsumed: string;
            AuthorizationRetryLimitReached: string;
            CddRequirementForPrimaryKeyUpdated: string;
            CddClaimsInvalidated: string;
            SecondaryKeysFrozen: string;
            SecondaryKeysUnfrozen: string;
            CustomClaimTypeAdded: string;
            ChildDidCreated: string;
            ChildDidUnlinked: string;
        };
    };
    /**
     * Lookup39: polymesh_primitives::secondary_key::SecondaryKey<sp_core::crypto::AccountId32>
     **/
    PolymeshPrimitivesSecondaryKey: {
        key: string;
        permissions: string;
    };
    /**
     * Lookup40: polymesh_primitives::secondary_key::Permissions
     **/
    PolymeshPrimitivesSecondaryKeyPermissions: {
        asset: string;
        extrinsic: string;
        portfolio: string;
    };
    /**
     * Lookup41: polymesh_primitives::subset::SubsetRestriction<polymesh_primitives::asset::AssetId>
     **/
    PolymeshPrimitivesSubsetSubsetRestrictionAssetId: {
        _enum: {
            Whole: string;
            These: string;
            Except: string;
        };
    };
    /**
     * Lookup42: polymesh_primitives::asset::AssetId
     **/
    PolymeshPrimitivesAssetAssetId: string;
    /**
     * Lookup46: polymesh_primitives::secondary_key::ExtrinsicPermissions
     **/
    PolymeshPrimitivesSecondaryKeyExtrinsicPermissions: {
        _enum: {
            Whole: string;
            These: string;
            Except: string;
        };
    };
    /**
     * Lookup50: polymesh_primitives::secondary_key::PalletPermissions
     **/
    PolymeshPrimitivesSecondaryKeyPalletPermissions: {
        extrinsics: string;
    };
    /**
     * Lookup51: polymesh_primitives::subset::SubsetRestriction<polymesh_primitives::ExtrinsicName>
     **/
    PolymeshPrimitivesSubsetSubsetRestrictionExtrinsicName: {
        _enum: {
            Whole: string;
            These: string;
            Except: string;
        };
    };
    /**
     * Lookup57: polymesh_primitives::subset::SubsetRestriction<polymesh_primitives::identity_id::PortfolioId>
     **/
    PolymeshPrimitivesSubsetSubsetRestrictionPortfolioId: {
        _enum: {
            Whole: string;
            These: string;
            Except: string;
        };
    };
    /**
     * Lookup58: polymesh_primitives::identity_id::PortfolioId
     **/
    PolymeshPrimitivesIdentityIdPortfolioId: {
        did: string;
        kind: string;
    };
    /**
     * Lookup59: polymesh_primitives::identity_id::PortfolioKind
     **/
    PolymeshPrimitivesIdentityIdPortfolioKind: {
        _enum: {
            Default: string;
            User: string;
        };
    };
    /**
     * Lookup64: polymesh_primitives::identity_claim::IdentityClaim
     **/
    PolymeshPrimitivesIdentityClaim: {
        claimIssuer: string;
        issuanceDate: string;
        lastUpdateDate: string;
        expiry: string;
        claim: string;
    };
    /**
     * Lookup66: polymesh_primitives::identity_claim::Claim
     **/
    PolymeshPrimitivesIdentityClaimClaim: {
        _enum: {
            Accredited: string;
            Affiliate: string;
            BuyLockup: string;
            SellLockup: string;
            CustomerDueDiligence: string;
            KnowYourCustomer: string;
            Jurisdiction: string;
            Exempted: string;
            Blocked: string;
            Custom: string;
        };
    };
    /**
     * Lookup67: polymesh_primitives::identity_claim::Scope
     **/
    PolymeshPrimitivesIdentityClaimScope: {
        _enum: {
            Identity: string;
            Asset: string;
            Custom: string;
        };
    };
    /**
     * Lookup68: polymesh_primitives::cdd_id::CddId
     **/
    PolymeshPrimitivesCddId: string;
    /**
     * Lookup69: polymesh_primitives::jurisdiction::CountryCode
     **/
    PolymeshPrimitivesJurisdictionCountryCode: {
        _enum: string[];
    };
    /**
     * Lookup72: polymesh_primitives::ticker::Ticker
     **/
    PolymeshPrimitivesTicker: string;
    /**
     * Lookup75: polymesh_primitives::authorization::AuthorizationData<sp_core::crypto::AccountId32>
     **/
    PolymeshPrimitivesAuthorizationAuthorizationData: {
        _enum: {
            AttestPrimaryKeyRotation: string;
            RotatePrimaryKey: string;
            TransferTicker: string;
            AddMultiSigSigner: string;
            TransferAssetOwnership: string;
            JoinIdentity: string;
            PortfolioCustody: string;
            BecomeAgent: string;
            AddRelayerPayingKey: string;
            RotatePrimaryKeyToSecondary: string;
        };
    };
    /**
     * Lookup76: polymesh_primitives::agent::AgentGroup
     **/
    PolymeshPrimitivesAgentAgentGroup: {
        _enum: {
            Full: string;
            Custom: string;
            ExceptMeta: string;
            PolymeshV1CAA: string;
            PolymeshV1PIA: string;
        };
    };
    /**
     * Lookup79: pallet_group::pallet::Event<T, I>
     **/
    PalletGroupEvent: {
        _enum: {
            MemberAdded: string;
            MemberRemoved: string;
            MemberRevoked: string;
            MembersSwapped: string;
            MembersReset: string;
            ActiveLimitChanged: string;
            Dummy: string;
        };
    };
    /**
     * Lookup81: pallet_committee::pallet::Event<T, I>
     **/
    PalletCommitteeEvent: {
        _enum: {
            Proposed: string;
            Voted: string;
            VoteRetracted: string;
            FinalVotes: string;
            Approved: string;
            Rejected: string;
            Executed: string;
            ReleaseCoordinatorUpdated: string;
            ExpiresAfterUpdated: string;
            VoteThresholdUpdated: string;
        };
    };
    /**
     * Lookup84: polymesh_primitives::MaybeBlock<BlockNumber>
     **/
    PolymeshPrimitivesMaybeBlock: {
        _enum: {
            Some: string;
            None: string;
        };
    };
    /**
     * Lookup90: pallet_multisig::pallet::Event<T>
     **/
    PalletMultisigEvent: {
        _enum: {
            MultiSigCreated: {
                callerDid: string;
                multisig: string;
                caller: string;
                signers: string;
                sigsRequired: string;
            };
            ProposalAdded: {
                callerDid: string;
                multisig: string;
                proposalId: string;
            };
            ProposalExecuted: {
                callerDid: string;
                multisig: string;
                proposalId: string;
                result: string;
            };
            MultiSigSignerAdded: {
                callerDid: string;
                multisig: string;
                signer: string;
            };
            MultiSigSignersAuthorized: {
                callerDid: string;
                multisig: string;
                signers: string;
            };
            MultiSigSignersRemoved: {
                callerDid: string;
                multisig: string;
                signers: string;
            };
            MultiSigSignersRequiredChanged: {
                callerDid: string;
                multisig: string;
                sigsRequired: string;
            };
            ProposalApprovalVote: {
                callerDid: string;
                multisig: string;
                signer: string;
                proposalId: string;
            };
            ProposalRejectionVote: {
                callerDid: string;
                multisig: string;
                signer: string;
                proposalId: string;
            };
            ProposalApproved: {
                callerDid: string;
                multisig: string;
                proposalId: string;
            };
            ProposalRejected: {
                callerDid: string;
                multisig: string;
                proposalId: string;
            };
            MultiSigAddedAdmin: {
                callerDid: string;
                multisig: string;
                adminDid: string;
            };
            MultiSigRemovedAdmin: {
                callerDid: string;
                multisig: string;
                adminDid: string;
            };
            MultiSigRemovedPayingDid: {
                callerDid: string;
                multisig: string;
                payingDid: string;
            };
        };
    };
    /**
     * Lookup92: pallet_staking::pallet::pallet::Event<T>
     **/
    PalletStakingPalletEvent: {
        _enum: {
            EraPaid: {
                eraIndex: string;
                validatorPayout: string;
                remainder: string;
            };
            Rewarded: {
                identity: string;
                stash: string;
                amount: string;
            };
            Slashed: {
                staker: string;
                amount: string;
            };
            SlashReported: {
                validator: string;
                fraction: string;
                slashEra: string;
            };
            OldSlashingReportDiscarded: {
                sessionIndex: string;
            };
            StakersElected: string;
            Bonded: {
                identity: string;
                stash: string;
                amount: string;
            };
            Unbonded: {
                identity: string;
                stash: string;
                amount: string;
            };
            Withdrawn: {
                stash: string;
                amount: string;
            };
            Kicked: {
                nominator: string;
                stash: string;
            };
            StakingElectionFailed: string;
            Chilled: {
                stash: string;
            };
            PayoutStarted: {
                eraIndex: string;
                validatorStash: string;
            };
            ValidatorPrefsSet: {
                stash: string;
                prefs: string;
            };
            ForceEra: {
                mode: string;
            };
            Nominated: {
                nominatorIdentity: string;
                stash: string;
                targets: string;
            };
            PermissionedIdentityAdded: {
                governanceCouncillDid: string;
                validatorsIdentity: string;
            };
            PermissionedIdentityRemoved: {
                governanceCouncillDid: string;
                validatorsIdentity: string;
            };
            InvalidatedNominators: {
                governanceCouncillDid: string;
                governanceCouncillAccount: string;
                expiredNominators: string;
            };
            SlashingAllowedForChanged: {
                slashingSwitch: string;
            };
            RewardPaymentSchedulingInterrupted: {
                accountId: string;
                era: string;
                error: string;
            };
            CommissionCapUpdated: {
                governanceCouncillDid: string;
                oldCommissionCap: string;
                newCommissionCap: string;
            };
        };
    };
    /**
     * Lookup94: pallet_staking::ValidatorPrefs
     **/
    PalletStakingValidatorPrefs: {
        commission: string;
        blocked: string;
    };
    /**
     * Lookup96: pallet_staking::Forcing
     **/
    PalletStakingForcing: {
        _enum: string[];
    };
    /**
     * Lookup97: pallet_staking::types::SlashingSwitch
     **/
    PalletStakingSlashingSwitch: {
        _enum: string[];
    };
    /**
     * Lookup98: pallet_offences::pallet::Event
     **/
    PalletOffencesEvent: {
        _enum: {
            Offence: {
                kind: string;
                timeslot: string;
            };
        };
    };
    /**
     * Lookup99: pallet_session::pallet::Event
     **/
    PalletSessionEvent: {
        _enum: {
            NewSession: {
                sessionIndex: string;
            };
        };
    };
    /**
     * Lookup100: pallet_grandpa::pallet::Event
     **/
    PalletGrandpaEvent: {
        _enum: {
            NewAuthorities: {
                authoritySet: string;
            };
            Paused: string;
            Resumed: string;
        };
    };
    /**
     * Lookup103: sp_consensus_grandpa::app::Public
     **/
    SpConsensusGrandpaAppPublic: string;
    /**
     * Lookup104: sp_core::ed25519::Public
     **/
    SpCoreEd25519Public: string;
    /**
     * Lookup105: pallet_im_online::pallet::Event<T>
     **/
    PalletImOnlineEvent: {
        _enum: {
            HeartbeatReceived: {
                authorityId: string;
            };
            AllGood: string;
            SomeOffline: {
                offline: string;
            };
        };
    };
    /**
     * Lookup106: pallet_im_online::sr25519::app_sr25519::Public
     **/
    PalletImOnlineSr25519AppSr25519Public: string;
    /**
     * Lookup107: sp_core::sr25519::Public
     **/
    SpCoreSr25519Public: string;
    /**
     * Lookup110: pallet_staking::Exposure<sp_core::crypto::AccountId32, Balance>
     **/
    PalletStakingExposure: {
        total: string;
        own: string;
        others: string;
    };
    /**
     * Lookup113: pallet_staking::IndividualExposure<sp_core::crypto::AccountId32, Balance>
     **/
    PalletStakingIndividualExposure: {
        who: string;
        value: string;
    };
    /**
     * Lookup114: pallet_sudo::pallet::Event<T>
     **/
    PalletSudoEvent: {
        _enum: {
            Sudid: {
                sudoResult: string;
            };
            KeyChanged: {
                oldSudoer: string;
            };
            SudoAsDone: {
                sudoResult: string;
            };
        };
    };
    /**
     * Lookup115: pallet_asset::pallet::Event<T>
     **/
    PalletAssetEvent: {
        _enum: {
            AssetCreated: string;
            IdentifiersUpdated: string;
            DivisibilityChanged: string;
            TickerRegistered: string;
            TickerTransferred: string;
            AssetOwnershipTransferred: string;
            AssetFrozen: string;
            AssetUnfrozen: string;
            AssetRenamed: string;
            FundingRoundSet: string;
            DocumentAdded: string;
            DocumentRemoved: string;
            ControllerTransfer: string;
            CustomAssetTypeExists: string;
            CustomAssetTypeRegistered: string;
            SetAssetMetadataValue: string;
            SetAssetMetadataValueDetails: string;
            RegisterAssetMetadataLocalType: string;
            RegisterAssetMetadataGlobalType: string;
            AssetTypeChanged: string;
            LocalMetadataKeyDeleted: string;
            MetadataValueDeleted: string;
            AssetBalanceUpdated: string;
            AssetAffirmationExemption: string;
            RemoveAssetAffirmationExemption: string;
            PreApprovedAsset: string;
            RemovePreApprovedAsset: string;
            AssetMediatorsAdded: string;
            AssetMediatorsRemoved: string;
            TickerLinkedToAsset: string;
            TickerUnlinkedFromAsset: string;
            GlobalMetadataSpecUpdated: string;
        };
    };
    /**
     * Lookup116: polymesh_primitives::asset::AssetType
     **/
    PolymeshPrimitivesAssetAssetType: {
        _enum: {
            EquityCommon: string;
            EquityPreferred: string;
            Commodity: string;
            FixedIncome: string;
            REIT: string;
            Fund: string;
            RevenueShareAgreement: string;
            StructuredProduct: string;
            Derivative: string;
            Custom: string;
            StableCoin: string;
            NonFungible: string;
        };
    };
    /**
     * Lookup118: polymesh_primitives::asset::NonFungibleType
     **/
    PolymeshPrimitivesAssetNonFungibleType: {
        _enum: {
            Derivative: string;
            FixedIncome: string;
            Invoice: string;
            Custom: string;
        };
    };
    /**
     * Lookup121: polymesh_primitives::asset_identifier::AssetIdentifier
     **/
    PolymeshPrimitivesAssetIdentifier: {
        _enum: {
            CUSIP: string;
            CINS: string;
            ISIN: string;
            LEI: string;
            FIGI: string;
        };
    };
    /**
     * Lookup127: polymesh_primitives::document::Document
     **/
    PolymeshPrimitivesDocument: {
        uri: string;
        contentHash: string;
        name: string;
        docType: string;
        filingDate: string;
    };
    /**
     * Lookup129: polymesh_primitives::document_hash::DocumentHash
     **/
    PolymeshPrimitivesDocumentHash: {
        _enum: {
            None: string;
            H512: string;
            H384: string;
            H320: string;
            H256: string;
            H224: string;
            H192: string;
            H160: string;
            H128: string;
        };
    };
    /**
     * Lookup140: polymesh_primitives::asset_metadata::AssetMetadataValueDetail<Moment>
     **/
    PolymeshPrimitivesAssetMetadataAssetMetadataValueDetail: {
        expire: string;
        lockStatus: string;
    };
    /**
     * Lookup141: polymesh_primitives::asset_metadata::AssetMetadataLockStatus<Moment>
     **/
    PolymeshPrimitivesAssetMetadataAssetMetadataLockStatus: {
        _enum: {
            Unlocked: string;
            Locked: string;
            LockedUntil: string;
        };
    };
    /**
     * Lookup144: polymesh_primitives::asset_metadata::AssetMetadataSpec
     **/
    PolymeshPrimitivesAssetMetadataAssetMetadataSpec: {
        url: string;
        description: string;
        typeDef: string;
    };
    /**
     * Lookup151: polymesh_primitives::asset_metadata::AssetMetadataKey
     **/
    PolymeshPrimitivesAssetMetadataAssetMetadataKey: {
        _enum: {
            Global: string;
            Local: string;
        };
    };
    /**
     * Lookup153: polymesh_primitives::portfolio::PortfolioUpdateReason
     **/
    PolymeshPrimitivesPortfolioPortfolioUpdateReason: {
        _enum: {
            Issued: {
                fundingRoundName: string;
            };
            Redeemed: string;
            Transferred: {
                instructionId: string;
                instructionMemo: string;
            };
            ControllerTransfer: string;
        };
    };
    /**
     * Lookup157: pallet_corporate_actions::distribution::pallet::Event<T>
     **/
    PalletCorporateActionsDistributionPalletEvent: {
        _enum: {
            Created: string;
            BenefitClaimed: string;
            Reclaimed: string;
            Removed: string;
        };
    };
    /**
     * Lookup158: polymesh_primitives::event_only::EventOnly<polymesh_primitives::identity_id::IdentityId>
     **/
    PolymeshPrimitivesEventOnly: string;
    /**
     * Lookup159: pallet_corporate_actions::CAId
     **/
    PalletCorporateActionsCaId: {
        assetId: string;
        localId: string;
    };
    /**
     * Lookup161: pallet_corporate_actions::distribution::Distribution
     **/
    PalletCorporateActionsDistribution: {
        from: string;
        currency: string;
        perShare: string;
        amount: string;
        remaining: string;
        reclaimed: string;
        paymentAt: string;
        expiresAt: string;
    };
    /**
     * Lookup163: pallet_asset::checkpoint::pallet::Event<T>
     **/
    PalletAssetCheckpointPalletEvent: {
        _enum: {
            CheckpointCreated: string;
            MaximumSchedulesComplexityChanged: string;
            ScheduleCreated: string;
            ScheduleRemoved: string;
        };
    };
    /**
     * Lookup166: polymesh_common_utilities::traits::checkpoint::ScheduleCheckpoints
     **/
    PolymeshCommonUtilitiesCheckpointScheduleCheckpoints: {
        pending: string;
    };
    /**
     * Lookup169: pallet_compliance_manager::pallet::Event<T>
     **/
    PalletComplianceManagerEvent: {
        _enum: {
            ComplianceRequirementCreated: string;
            ComplianceRequirementRemoved: string;
            AssetComplianceReplaced: string;
            AssetComplianceReset: string;
            AssetComplianceResumed: string;
            AssetCompliancePaused: string;
            ComplianceRequirementChanged: string;
            TrustedDefaultClaimIssuerAdded: string;
            TrustedDefaultClaimIssuerRemoved: string;
        };
    };
    /**
     * Lookup170: polymesh_primitives::compliance_manager::ComplianceRequirement
     **/
    PolymeshPrimitivesComplianceManagerComplianceRequirement: {
        senderConditions: string;
        receiverConditions: string;
        id: string;
    };
    /**
     * Lookup172: polymesh_primitives::condition::Condition
     **/
    PolymeshPrimitivesCondition: {
        conditionType: string;
        issuers: string;
    };
    /**
     * Lookup173: polymesh_primitives::condition::ConditionType
     **/
    PolymeshPrimitivesConditionConditionType: {
        _enum: {
            IsPresent: string;
            IsAbsent: string;
            IsAnyOf: string;
            IsNoneOf: string;
            IsIdentity: string;
        };
    };
    /**
     * Lookup175: polymesh_primitives::condition::TargetIdentity
     **/
    PolymeshPrimitivesConditionTargetIdentity: {
        _enum: {
            ExternalAgent: string;
            Specific: string;
        };
    };
    /**
     * Lookup177: polymesh_primitives::condition::TrustedIssuer
     **/
    PolymeshPrimitivesConditionTrustedIssuer: {
        issuer: string;
        trustedFor: string;
    };
    /**
     * Lookup178: polymesh_primitives::condition::TrustedFor
     **/
    PolymeshPrimitivesConditionTrustedFor: {
        _enum: {
            Any: string;
            Specific: string;
        };
    };
    /**
     * Lookup180: polymesh_primitives::identity_claim::ClaimType
     **/
    PolymeshPrimitivesIdentityClaimClaimType: {
        _enum: {
            Accredited: string;
            Affiliate: string;
            BuyLockup: string;
            SellLockup: string;
            CustomerDueDiligence: string;
            KnowYourCustomer: string;
            Jurisdiction: string;
            Exempted: string;
            Blocked: string;
            Custom: string;
        };
    };
    /**
     * Lookup182: pallet_corporate_actions::pallet::Event<T>
     **/
    PalletCorporateActionsEvent: {
        _enum: {
            MaxDetailsLengthChanged: string;
            DefaultTargetIdentitiesChanged: string;
            DefaultWithholdingTaxChanged: string;
            DidWithholdingTaxChanged: string;
            CAInitiated: string;
            CALinkedToDoc: string;
            CARemoved: string;
            RecordDateChanged: string;
        };
    };
    /**
     * Lookup183: pallet_corporate_actions::TargetIdentities
     **/
    PalletCorporateActionsTargetIdentities: {
        identities: string;
        treatment: string;
    };
    /**
     * Lookup184: pallet_corporate_actions::TargetTreatment
     **/
    PalletCorporateActionsTargetTreatment: {
        _enum: string[];
    };
    /**
     * Lookup186: pallet_corporate_actions::CorporateAction
     **/
    PalletCorporateActionsCorporateAction: {
        kind: string;
        declDate: string;
        recordDate: string;
        targets: string;
        defaultWithholdingTax: string;
        withholdingTax: string;
    };
    /**
     * Lookup187: pallet_corporate_actions::CAKind
     **/
    PalletCorporateActionsCaKind: {
        _enum: string[];
    };
    /**
     * Lookup189: pallet_corporate_actions::RecordDate
     **/
    PalletCorporateActionsRecordDate: {
        date: string;
        checkpoint: string;
    };
    /**
     * Lookup190: pallet_corporate_actions::CACheckpoint
     **/
    PalletCorporateActionsCaCheckpoint: {
        _enum: {
            Scheduled: string;
            Existing: string;
        };
    };
    /**
     * Lookup195: pallet_corporate_actions::ballot::pallet::Event<T>
     **/
    PalletCorporateActionsBallotPalletEvent: {
        _enum: {
            Created: string;
            VoteCast: string;
            RangeChanged: string;
            MetaChanged: string;
            RCVChanged: string;
            Removed: string;
        };
    };
    /**
     * Lookup196: pallet_corporate_actions::ballot::BallotTimeRange
     **/
    PalletCorporateActionsBallotBallotTimeRange: {
        start: string;
        end: string;
    };
    /**
     * Lookup197: pallet_corporate_actions::ballot::BallotMeta
     **/
    PalletCorporateActionsBallotBallotMeta: {
        title: string;
        motions: string;
    };
    /**
     * Lookup200: pallet_corporate_actions::ballot::Motion
     **/
    PalletCorporateActionsBallotMotion: {
        title: string;
        infoLink: string;
        choices: string;
    };
    /**
     * Lookup206: pallet_corporate_actions::ballot::BallotVote
     **/
    PalletCorporateActionsBallotBallotVote: {
        power: string;
        fallback: string;
    };
    /**
     * Lookup209: pallet_pips::pallet::Event<T>
     **/
    PalletPipsEvent: {
        _enum: {
            HistoricalPipsPruned: string;
            ProposalCreated: string;
            ProposalStateUpdated: string;
            Voted: string;
            PipClosed: string;
            ExecutionScheduled: string;
            DefaultEnactmentPeriodChanged: string;
            MinimumProposalDepositChanged: string;
            PendingPipExpiryChanged: string;
            MaxPipSkipCountChanged: string;
            ActivePipLimitChanged: string;
            ProposalRefund: string;
            SnapshotCleared: string;
            SnapshotTaken: string;
            PipSkipped: string;
            SnapshotResultsEnacted: string;
            ExecutionSchedulingFailed: string;
            ExpiryScheduled: string;
            ExpirySchedulingFailed: string;
            ExecutionCancellingFailed: string;
        };
    };
    /**
     * Lookup210: pallet_pips::types::Proposer<sp_core::crypto::AccountId32>
     **/
    PalletPipsProposer: {
        _enum: {
            Community: string;
            Committee: string;
        };
    };
    /**
     * Lookup211: pallet_pips::types::Committee
     **/
    PalletPipsCommittee: {
        _enum: string[];
    };
    /**
     * Lookup215: pallet_pips::types::ProposalData
     **/
    PalletPipsProposalData: {
        _enum: {
            Hash: string;
            Proposal: string;
        };
    };
    /**
     * Lookup216: pallet_pips::types::ProposalState
     **/
    PalletPipsProposalState: {
        _enum: string[];
    };
    /**
     * Lookup219: pallet_pips::types::SnapshottedPip
     **/
    PalletPipsSnapshottedPip: {
        id: string;
        weight: string;
    };
    /**
     * Lookup225: pallet_portfolio::pallet::Event<T>
     **/
    PalletPortfolioEvent: {
        _enum: {
            PortfolioCreated: string;
            PortfolioDeleted: string;
            PortfolioRenamed: string;
            UserPortfolios: string;
            PortfolioCustodianChanged: string;
            FundsMovedBetweenPortfolios: string;
            PreApprovedPortfolio: string;
            RevokePreApprovedPortfolio: string;
            AllowIdentityToCreatePortfolios: string;
            RevokeCreatePortfoliosPermission: string;
        };
    };
    /**
     * Lookup229: polymesh_primitives::portfolio::FundDescription
     **/
    PolymeshPrimitivesPortfolioFundDescription: {
        _enum: {
            Fungible: {
                assetId: string;
                amount: string;
            };
            NonFungible: string;
        };
    };
    /**
     * Lookup230: polymesh_primitives::nft::NFTs
     **/
    PolymeshPrimitivesNftNfTs: {
        assetId: string;
        ids: string;
    };
    /**
     * Lookup233: pallet_protocol_fee::pallet::Event<T>
     **/
    PalletProtocolFeeEvent: {
        _enum: {
            FeeSet: string;
            CoefficientSet: string;
            FeeCharged: string;
        };
    };
    /**
     * Lookup234: polymesh_primitives::PosRatio
     **/
    PolymeshPrimitivesPosRatio: string;
    /**
     * Lookup235: pallet_scheduler::pallet::Event<T>
     **/
    PalletSchedulerEvent: {
        _enum: {
            Scheduled: {
                when: string;
                index: string;
            };
            Canceled: {
                when: string;
                index: string;
            };
            Dispatched: {
                task: string;
                id: string;
                result: string;
            };
            CallUnavailable: {
                task: string;
                id: string;
            };
            PeriodicFailed: {
                task: string;
                id: string;
            };
            PermanentlyOverweight: {
                task: string;
                id: string;
            };
        };
    };
    /**
     * Lookup238: pallet_settlement::pallet::Event<T>
     **/
    PalletSettlementEvent: {
        _enum: {
            VenueCreated: string;
            VenueDetailsUpdated: string;
            VenueTypeUpdated: string;
            InstructionAffirmed: string;
            AffirmationWithdrawn: string;
            InstructionRejected: string;
            ReceiptClaimed: string;
            VenueFiltering: string;
            VenuesAllowed: string;
            VenuesBlocked: string;
            LegFailedExecution: string;
            InstructionExecuted: string;
            VenueUnauthorized: string;
            SchedulingFailed: string;
            InstructionRescheduled: string;
            VenueSignersUpdated: string;
            SettlementManuallyExecuted: string;
            InstructionCreated: string;
            FailedToExecuteInstruction: string;
            InstructionAutomaticallyAffirmed: string;
            MediatorAffirmationReceived: string;
            MediatorAffirmationWithdrawn: string;
            InstructionMediators: string;
            InstructionLocked: string;
        };
    };
    /**
     * Lookup241: polymesh_primitives::settlement::VenueType
     **/
    PolymeshPrimitivesSettlementVenueType: {
        _enum: string[];
    };
    /**
     * Lookup244: polymesh_primitives::settlement::ReceiptMetadata
     **/
    PolymeshPrimitivesSettlementReceiptMetadata: string;
    /**
     * Lookup247: polymesh_primitives::settlement::SettlementType<BlockNumber>
     **/
    PolymeshPrimitivesSettlementSettlementType: {
        _enum: {
            SettleOnAffirmation: string;
            SettleOnBlock: string;
            SettleManual: string;
            SettleAfterLock: string;
        };
    };
    /**
     * Lookup249: polymesh_primitives::settlement::Leg
     **/
    PolymeshPrimitivesSettlementLeg: {
        _enum: {
            Fungible: {
                sender: string;
                receiver: string;
                assetId: string;
                amount: string;
            };
            NonFungible: {
                sender: string;
                receiver: string;
                nfts: string;
            };
            OffChain: {
                senderIdentity: string;
                receiverIdentity: string;
                ticker: string;
                amount: string;
            };
        };
    };
    /**
     * Lookup250: pallet_statistics::pallet::Event<T>
     **/
    PalletStatisticsEvent: {
        _enum: {
            StatTypesAdded: string;
            StatTypesRemoved: string;
            AssetStatsUpdated: string;
            SetAssetTransferCompliance: string;
            TransferConditionExemptionsAdded: string;
            TransferConditionExemptionsRemoved: string;
        };
    };
    /**
     * Lookup252: polymesh_primitives::statistics::StatType
     **/
    PolymeshPrimitivesStatisticsStatType: {
        operationType: string;
        claimIssuer: string;
    };
    /**
     * Lookup253: polymesh_primitives::statistics::StatOpType
     **/
    PolymeshPrimitivesStatisticsStatOpType: {
        _enum: string[];
    };
    /**
     * Lookup257: polymesh_primitives::statistics::StatUpdate
     **/
    PolymeshPrimitivesStatisticsStatUpdate: {
        key2: string;
        value: string;
    };
    /**
     * Lookup258: polymesh_primitives::statistics::Stat2ndKey
     **/
    PolymeshPrimitivesStatisticsStat2ndKey: {
        _enum: {
            NoClaimStat: string;
            Claim: string;
        };
    };
    /**
     * Lookup259: polymesh_primitives::statistics::StatClaim
     **/
    PolymeshPrimitivesStatisticsStatClaim: {
        _enum: {
            Accredited: string;
            Affiliate: string;
            Jurisdiction: string;
        };
    };
    /**
     * Lookup263: polymesh_primitives::transfer_compliance::TransferCondition
     **/
    PolymeshPrimitivesTransferComplianceTransferCondition: {
        _enum: {
            MaxInvestorCount: string;
            MaxInvestorOwnership: string;
            ClaimCount: string;
            ClaimOwnership: string;
        };
    };
    /**
     * Lookup264: polymesh_primitives::transfer_compliance::TransferConditionExemptKey
     **/
    PolymeshPrimitivesTransferComplianceTransferConditionExemptKey: {
        assetId: string;
        op: string;
        claimType: string;
    };
    /**
     * Lookup266: pallet_sto::pallet::Event<T>
     **/
    PalletStoEvent: {
        _enum: {
            FundraiserCreated: {
                agentDid: string;
                offeringAsset: string;
                raisingAsset: string;
                fundraiserId: string;
                fundraiserName: string;
                fundraiser: string;
            };
            Invested: {
                investorDid: string;
                offeringAsset: string;
                fundraiserId: string;
                fundingAsset: string;
                offeringAmount: string;
                raiseAmount: string;
            };
            FundraiserFrozen: {
                agentDid: string;
                offeringAsset: string;
                fundraiserId: string;
            };
            FundraiserUnfrozen: {
                agentDid: string;
                offeringAsset: string;
                fundraiserId: string;
            };
            FundraiserWindowModified: {
                agentDid: string;
                offeringAsset: string;
                fundraiserId: string;
                oldStart: string;
                oldEnd: string;
                newStart: string;
                newEnd: string;
            };
            FundraiserClosed: {
                agentDid: string;
                offeringAsset: string;
                fundraiserId: string;
            };
            FundraiserOffchainFundingEnabled: {
                agentDid: string;
                offeringAsset: string;
                fundraiserId: string;
                ticker: string;
            };
        };
    };
    /**
     * Lookup269: pallet_sto::Fundraiser<Moment>
     **/
    PalletStoFundraiser: {
        creator: string;
        offeringPortfolio: string;
        offeringAsset: string;
        raisingPortfolio: string;
        raisingAsset: string;
        tiers: string;
        venueId: string;
        start: string;
        end: string;
        status: string;
        minimumInvestment: string;
    };
    /**
     * Lookup271: pallet_sto::FundraiserTier
     **/
    PalletStoFundraiserTier: {
        total: string;
        price: string;
        remaining: string;
    };
    /**
     * Lookup272: pallet_sto::FundraiserStatus
     **/
    PalletStoFundraiserStatus: {
        _enum: string[];
    };
    /**
     * Lookup273: pallet_sto::FundingAsset
     **/
    PalletStoFundingAsset: {
        _enum: {
            OnChain: string;
            OffChain: string;
        };
    };
    /**
     * Lookup274: pallet_treasury::pallet::Event<T>
     **/
    PalletTreasuryEvent: {
        _enum: {
            TreasuryDisbursement: string;
            TreasuryDisbursementFailed: string;
            TreasuryReimbursement: string;
        };
    };
    /**
     * Lookup275: pallet_utility::pallet::Event<T>
     **/
    PalletUtilityEvent: {
        _enum: {
            BatchInterrupted: {
                index: string;
                error: string;
            };
            BatchCompleted: string;
            BatchCompletedWithErrors: string;
            ItemCompleted: string;
            ItemFailed: {
                error: string;
            };
            DispatchedAs: {
                result: string;
            };
            RelayedTx: {
                callerDid: string;
                target: string;
                result: string;
            };
        };
    };
    /**
     * Lookup276: pallet_base::pallet::Event
     **/
    PalletBaseEvent: {
        _enum: {
            UnexpectedError: string;
        };
    };
    /**
     * Lookup278: pallet_external_agents::pallet::Event<T>
     **/
    PalletExternalAgentsEvent: {
        _enum: {
            GroupCreated: string;
            GroupPermissionsUpdated: string;
            AgentAdded: string;
            AgentRemoved: string;
            GroupChanged: string;
        };
    };
    /**
     * Lookup279: pallet_relayer::pallet::Event<T>
     **/
    PalletRelayerEvent: {
        _enum: {
            AuthorizedPayingKey: string;
            AcceptedPayingKey: string;
            RemovedPayingKey: string;
            UpdatedPolyxLimit: string;
        };
    };
    /**
     * Lookup280: pallet_contracts::pallet::Event<T>
     **/
    PalletContractsEvent: {
        _enum: {
            Instantiated: {
                deployer: string;
                contract: string;
            };
            Terminated: {
                contract: string;
                beneficiary: string;
            };
            CodeStored: {
                codeHash: string;
            };
            ContractEmitted: {
                contract: string;
                data: string;
            };
            CodeRemoved: {
                codeHash: string;
            };
            ContractCodeUpdated: {
                contract: string;
                newCodeHash: string;
                oldCodeHash: string;
            };
            Called: {
                caller: string;
                contract: string;
            };
            DelegateCalled: {
                contract: string;
                codeHash: string;
            };
        };
    };
    /**
     * Lookup281: polymesh_contracts::pallet::Event<T>
     **/
    PolymeshContractsEvent: {
        _enum: {
            ApiHashUpdated: string;
            SCRuntimeCall: string;
        };
    };
    /**
     * Lookup282: polymesh_contracts::Api
     **/
    PolymeshContractsApi: {
        desc: string;
        major: string;
    };
    /**
     * Lookup283: polymesh_contracts::ChainVersion
     **/
    PolymeshContractsChainVersion: {
        specVersion: string;
        txVersion: string;
    };
    /**
     * Lookup284: polymesh_contracts::chain_extension::ExtrinsicId
     **/
    PolymeshContractsChainExtensionExtrinsicId: string;
    /**
     * Lookup285: pallet_preimage::pallet::Event<T>
     **/
    PalletPreimageEvent: {
        _enum: {
            Noted: {
                _alias: {
                    hash_: string;
                };
                hash_: string;
            };
            Requested: {
                _alias: {
                    hash_: string;
                };
                hash_: string;
            };
            Cleared: {
                _alias: {
                    hash_: string;
                };
                hash_: string;
            };
        };
    };
    /**
     * Lookup286: pallet_nft::pallet::Event<T>
     **/
    PalletNftEvent: {
        _enum: {
            NftCollectionCreated: string;
            NFTPortfolioUpdated: string;
        };
    };
    /**
     * Lookup288: pallet_election_provider_multi_phase::pallet::Event<T>
     **/
    PalletElectionProviderMultiPhaseEvent: {
        _enum: {
            SolutionStored: {
                compute: string;
                origin: string;
                prevEjected: string;
            };
            ElectionFinalized: {
                compute: string;
                score: string;
            };
            ElectionFailed: string;
            Rewarded: {
                account: string;
                value: string;
            };
            Slashed: {
                account: string;
                value: string;
            };
            PhaseTransitioned: {
                from: string;
                to: string;
                round: string;
            };
        };
    };
    /**
     * Lookup289: pallet_election_provider_multi_phase::ElectionCompute
     **/
    PalletElectionProviderMultiPhaseElectionCompute: {
        _enum: string[];
    };
    /**
     * Lookup290: sp_npos_elections::ElectionScore
     **/
    SpNposElectionsElectionScore: {
        minimalStake: string;
        sumStake: string;
        sumStakeSquared: string;
    };
    /**
     * Lookup291: pallet_election_provider_multi_phase::Phase<Bn>
     **/
    PalletElectionProviderMultiPhasePhase: {
        _enum: {
            Off: string;
            Signed: string;
            Unsigned: string;
            Emergency: string;
        };
    };
    /**
     * Lookup293: pallet_confidential_assets::pallet::Event<T>
     **/
    PalletConfidentialAssetsEvent: {
        _enum: {
            AccountRegistered: {
                callerDid: string;
                account: string;
                encryptionKey: string;
            };
            EncryptionKeyRegistered: {
                callerDid: string;
                encryptionKey: string;
            };
            AssetCreated: {
                callerDid: string;
                assetId: string;
                mediators: string;
                auditors: string;
                data: string;
            };
            AssetUpdated: {
                callerDid: string;
                assetId: string;
                mediators: string;
                auditors: string;
            };
            AccountAssetRegistered: {
                callerDid: string;
                account: string;
                assetId: string;
            };
            AssetMinted: {
                callerDid: string;
                assetId: string;
                amount: string;
                totalSupply: string;
                account: string;
            };
            FeeAccountUpdated: {
                callerDid: string;
                account: string;
                isRegistration: string;
                amount: string;
            };
            SettlementCreated: {
                settlementRef: string;
                memo: string;
                assetRootBlock: string;
                legs: string;
            };
            SenderAffirmed: {
                legRef: string;
            };
            ReceiverAffirmed: {
                legRef: string;
            };
            MediatorAffirmed: {
                legRef: string;
            };
            MediatorRejected: {
                legRef: string;
            };
            SenderCounterUpdated: {
                legRef: string;
            };
            SenderReverted: {
                legRef: string;
            };
            ReceiverClaimed: {
                legRef: string;
            };
            SettlementStatusUpdated: {
                settlementRef: string;
                status: string;
            };
            AccountStateLeafInserted: {
                leafIndex: string;
                accountCommitment: string;
            };
            FeeAccountStateLeafInserted: {
                leafIndex: string;
                feeAccountCommitment: string;
            };
            AssetStateLeafUpdated: {
                leafIndex: string;
                assetLeaf: string;
            };
            AssetCurveTreeRootUpdated: {
                root: string;
            };
            AccountCurveTreeRootUpdated: {
                root: string;
            };
            FeeAccountCurveTreeRootUpdated: {
                root: string;
            };
            FeeAccountDeposited: {
                sender: string;
                amount: string;
            };
            FeeAccountWithdrawn: {
                receiver: string;
                amount: string;
            };
            RelayerBatchedProofs: {
                relayer: string;
                amount: string;
                batchHash: string;
                batchResult: string;
            };
        };
    };
    /**
     * Lookup294: polymesh_dart::bp::keys::AccountPublicKey
     **/
    PolymeshDartBpKeysAccountPublicKey: string;
    /**
     * Lookup295: polymesh_dart::bp::encode::CompressedAffine
     **/
    PolymeshDartBpEncodeCompressedAffine: string;
    /**
     * Lookup296: polymesh_dart::bp::keys::EncryptionPublicKey
     **/
    PolymeshDartBpKeysEncryptionPublicKey: string;
    /**
     * Lookup301: polymesh_dart::bp::leg::SettlementRef
     **/
    PolymeshDartBpLegSettlementRef: string;
    /**
     * Lookup307: polymesh_dart::bp::leg::LegRef
     **/
    PolymeshDartBpLegLegRef: {
        settlement: string;
        legId: string;
    };
    /**
     * Lookup308: pallet_confidential_assets::settlement::SettlementStatus
     **/
    PalletConfidentialAssetsSettlementSettlementStatus: {
        _enum: string[];
    };
    /**
     * Lookup309: polymesh_dart::bp::account::AccountStateCommitment
     **/
    PolymeshDartBpAccountAccountStateCommitment: string;
    /**
     * Lookup310: polymesh_dart::bp::fee::FeeAccountStateCommitment
     **/
    PolymeshDartBpFeeFeeAccountStateCommitment: string;
    /**
     * Lookup311: polymesh_dart::curve_tree::common::CompressedLeafValue<C>
     **/
    PolymeshDartCurveTreeCommonCompressedLeafValue: {
        point: string;
    };
    /**
     * Lookup312: polymesh_dart::curve_tree::CompressedCurveTreeRoot<C>
     **/
    PolymeshDartCurveTreeCompressedCurveTreeRoot: {
        commitments: string;
        xCoordChildren: string;
        height: string;
    };
    /**
     * Lookup316: polymesh_dart::bp::encode::CompressedBaseField
     **/
    PolymeshDartBpEncodeCompressedBaseField: string;
    /**
     * Lookup319: polymesh_dart::bp::batched::ProofHash
     **/
    PolymeshDartBpBatchedProofHash: string;
    /**
     * Lookup320: frame_system::Phase
     **/
    FrameSystemPhase: {
        _enum: {
            ApplyExtrinsic: string;
            Finalization: string;
            Initialization: string;
        };
    };
    /**
     * Lookup323: frame_system::LastRuntimeUpgradeInfo
     **/
    FrameSystemLastRuntimeUpgradeInfo: {
        specVersion: string;
        specName: string;
    };
    /**
     * Lookup325: frame_system::pallet::Call<T>
     **/
    FrameSystemCall: {
        _enum: {
            remark: {
                remark: string;
            };
            set_heap_pages: {
                pages: string;
            };
            set_code: {
                code: string;
            };
            set_code_without_checks: {
                code: string;
            };
            set_storage: {
                items: string;
            };
            kill_storage: {
                _alias: {
                    keys_: string;
                };
                keys_: string;
            };
            kill_prefix: {
                prefix: string;
                subkeys: string;
            };
            remark_with_event: {
                remark: string;
            };
        };
    };
    /**
     * Lookup329: frame_system::limits::BlockWeights
     **/
    FrameSystemLimitsBlockWeights: {
        baseBlock: string;
        maxBlock: string;
        perClass: string;
    };
    /**
     * Lookup330: frame_support::dispatch::PerDispatchClass<frame_system::limits::WeightsPerClass>
     **/
    FrameSupportDispatchPerDispatchClassWeightsPerClass: {
        normal: string;
        operational: string;
        mandatory: string;
    };
    /**
     * Lookup331: frame_system::limits::WeightsPerClass
     **/
    FrameSystemLimitsWeightsPerClass: {
        baseExtrinsic: string;
        maxExtrinsic: string;
        maxTotal: string;
        reserved: string;
    };
    /**
     * Lookup333: frame_system::limits::BlockLength
     **/
    FrameSystemLimitsBlockLength: {
        max: string;
    };
    /**
     * Lookup334: frame_support::dispatch::PerDispatchClass<T>
     **/
    FrameSupportDispatchPerDispatchClassU32: {
        normal: string;
        operational: string;
        mandatory: string;
    };
    /**
     * Lookup335: sp_weights::RuntimeDbWeight
     **/
    SpWeightsRuntimeDbWeight: {
        read: string;
        write: string;
    };
    /**
     * Lookup336: sp_version::RuntimeVersion
     **/
    SpVersionRuntimeVersion: {
        specName: string;
        implName: string;
        authoringVersion: string;
        specVersion: string;
        implVersion: string;
        apis: string;
        transactionVersion: string;
        stateVersion: string;
    };
    /**
     * Lookup341: frame_system::pallet::Error<T>
     **/
    FrameSystemError: {
        _enum: string[];
    };
    /**
     * Lookup344: sp_consensus_babe::app::Public
     **/
    SpConsensusBabeAppPublic: string;
    /**
     * Lookup347: sp_consensus_babe::digests::NextConfigDescriptor
     **/
    SpConsensusBabeDigestsNextConfigDescriptor: {
        _enum: {
            __Unused0: string;
            V1: {
                c: string;
                allowedSlots: string;
            };
        };
    };
    /**
     * Lookup349: sp_consensus_babe::AllowedSlots
     **/
    SpConsensusBabeAllowedSlots: {
        _enum: string[];
    };
    /**
     * Lookup353: sp_consensus_babe::digests::PreDigest
     **/
    SpConsensusBabeDigestsPreDigest: {
        _enum: {
            __Unused0: string;
            Primary: string;
            SecondaryPlain: string;
            SecondaryVRF: string;
        };
    };
    /**
     * Lookup354: sp_consensus_babe::digests::PrimaryPreDigest
     **/
    SpConsensusBabeDigestsPrimaryPreDigest: {
        authorityIndex: string;
        slot: string;
        vrfOutput: string;
        vrfProof: string;
    };
    /**
     * Lookup355: sp_consensus_babe::digests::SecondaryPlainPreDigest
     **/
    SpConsensusBabeDigestsSecondaryPlainPreDigest: {
        authorityIndex: string;
        slot: string;
    };
    /**
     * Lookup356: sp_consensus_babe::digests::SecondaryVRFPreDigest
     **/
    SpConsensusBabeDigestsSecondaryVRFPreDigest: {
        authorityIndex: string;
        slot: string;
        vrfOutput: string;
        vrfProof: string;
    };
    /**
     * Lookup357: sp_consensus_babe::BabeEpochConfiguration
     **/
    SpConsensusBabeBabeEpochConfiguration: {
        c: string;
        allowedSlots: string;
    };
    /**
     * Lookup361: pallet_babe::pallet::Call<T>
     **/
    PalletBabeCall: {
        _enum: {
            report_equivocation: {
                equivocationProof: string;
                keyOwnerProof: string;
            };
            report_equivocation_unsigned: {
                equivocationProof: string;
                keyOwnerProof: string;
            };
            plan_config_change: {
                config: string;
            };
        };
    };
    /**
     * Lookup362: sp_consensus_slots::EquivocationProof<sp_runtime::generic::header::Header<Number, sp_runtime::traits::BlakeTwo256>, sp_consensus_babe::app::Public>
     **/
    SpConsensusSlotsEquivocationProof: {
        offender: string;
        slot: string;
        firstHeader: string;
        secondHeader: string;
    };
    /**
     * Lookup363: sp_runtime::generic::header::Header<Number, sp_runtime::traits::BlakeTwo256>
     **/
    SpRuntimeHeader: {
        parentHash: string;
        number: string;
        stateRoot: string;
        extrinsicsRoot: string;
        digest: string;
    };
    /**
     * Lookup364: sp_runtime::traits::BlakeTwo256
     **/
    SpRuntimeBlakeTwo256: string;
    /**
     * Lookup365: sp_session::MembershipProof
     **/
    SpSessionMembershipProof: {
        session: string;
        trieNodes: string;
        validatorCount: string;
    };
    /**
     * Lookup366: pallet_babe::pallet::Error<T>
     **/
    PalletBabeError: {
        _enum: string[];
    };
    /**
     * Lookup367: pallet_timestamp::pallet::Call<T>
     **/
    PalletTimestampCall: {
        _enum: {
            set: {
                now: string;
            };
        };
    };
    /**
     * Lookup369: pallet_indices::pallet::Call<T>
     **/
    PalletIndicesCall: {
        _enum: {
            claim: {
                index: string;
            };
            transfer: {
                _alias: {
                    new_: string;
                };
                new_: string;
                index: string;
            };
            free: {
                index: string;
            };
            force_transfer: {
                _alias: {
                    new_: string;
                };
                new_: string;
                index: string;
                freeze: string;
            };
            freeze: {
                index: string;
            };
        };
    };
    /**
     * Lookup371: pallet_indices::pallet::Error<T>
     **/
    PalletIndicesError: {
        _enum: string[];
    };
    /**
     * Lookup373: pallet_balances::pallet::BalanceLock<Balance>
     **/
    PalletBalancesBalanceLock: {
        id: string;
        amount: string;
        reasons: string;
    };
    /**
     * Lookup374: pallet_balances::Reasons
     **/
    PalletBalancesReasons: {
        _enum: string[];
    };
    /**
     * Lookup375: pallet_balances::pallet::Call<T>
     **/
    PalletBalancesCall: {
        _enum: {
            transfer: {
                dest: string;
                value: string;
            };
            transfer_with_memo: {
                dest: string;
                value: string;
                memo: string;
            };
            deposit_block_reward_reserve_balance: {
                value: string;
            };
            set_balance: {
                who: string;
                newFree: string;
                newReserved: string;
            };
            force_transfer: {
                source: string;
                dest: string;
                value: string;
            };
            burn_account_balance: {
                amount: string;
            };
        };
    };
    /**
     * Lookup376: pallet_balances::pallet::Error<T>
     **/
    PalletBalancesError: {
        _enum: string[];
    };
    /**
     * Lookup378: pallet_transaction_payment::Releases
     **/
    PalletTransactionPaymentReleases: {
        _enum: string[];
    };
    /**
     * Lookup379: pallet_transaction_payment::pallet::Call<T>
     **/
    PalletTransactionPaymentCall: {
        _enum: {
            set_disable_fees: {
                value: string;
            };
        };
    };
    /**
     * Lookup381: sp_weights::WeightToFeeCoefficient<Balance>
     **/
    SpWeightsWeightToFeeCoefficient: {
        coeffInteger: string;
        coeffFrac: string;
        negative: string;
        degree: string;
    };
    /**
     * Lookup382: polymesh_primitives::identity::DidRecord<sp_core::crypto::AccountId32>
     **/
    PolymeshPrimitivesIdentityDidRecord: {
        primaryKey: string;
    };
    /**
     * Lookup384: pallet_identity::types::Claim1stKey
     **/
    PalletIdentityClaim1stKey: {
        target: string;
        claimType: string;
    };
    /**
     * Lookup385: pallet_identity::types::Claim2ndKey
     **/
    PalletIdentityClaim2ndKey: {
        issuer: string;
        scope: string;
    };
    /**
     * Lookup386: polymesh_primitives::secondary_key::KeyRecord<sp_core::crypto::AccountId32>
     **/
    PolymeshPrimitivesSecondaryKeyKeyRecord: {
        _enum: {
            PrimaryKey: string;
            SecondaryKey: string;
            MultiSigSignerKey: string;
        };
    };
    /**
     * Lookup389: polymesh_primitives::secondary_key::Signatory<sp_core::crypto::AccountId32>
     **/
    PolymeshPrimitivesSecondaryKeySignatory: {
        _enum: {
            Identity: string;
            Account: string;
        };
    };
    /**
     * Lookup390: polymesh_primitives::authorization::Authorization<sp_core::crypto::AccountId32, Moment>
     **/
    PolymeshPrimitivesAuthorization: {
        authorizationData: string;
        authorizedBy: string;
        expiry: string;
        authId: string;
        count: string;
    };
    /**
     * Lookup394: pallet_identity::pallet::Call<T>
     **/
    PalletIdentityCall: {
        _enum: {
            cdd_register_did: {
                targetAccount: string;
                secondaryKeys: string;
            };
            invalidate_cdd_claims: {
                cdd: string;
                disableFrom: string;
                expiry: string;
            };
            accept_primary_key: {
                rotationAuthId: string;
                optionalCddAuthId: string;
            };
            change_cdd_requirement_for_mk_rotation: {
                authRequired: string;
            };
            join_identity_as_key: {
                authId: string;
            };
            leave_identity_as_key: string;
            add_claim: {
                target: string;
                claim: string;
                expiry: string;
            };
            revoke_claim: {
                target: string;
                claim: string;
            };
            freeze_secondary_keys: string;
            unfreeze_secondary_keys: string;
            add_authorization: {
                target: string;
                data: string;
                expiry: string;
            };
            remove_authorization: {
                target: string;
                authId: string;
                authIssuerPays: string;
            };
            gc_add_cdd_claim: {
                target: string;
            };
            gc_revoke_cdd_claim: {
                target: string;
            };
            revoke_claim_by_index: {
                target: string;
                claimType: string;
                scope: string;
            };
            rotate_primary_key_to_secondary: {
                authId: string;
                optionalCddAuthId: string;
            };
            add_secondary_keys_with_authorization: {
                additionalKeys: string;
                expiresAt: string;
            };
            set_secondary_key_permissions: {
                key: string;
                perms: string;
            };
            remove_secondary_keys: {
                keysToRemove: string;
            };
            register_custom_claim_type: {
                ty: string;
            };
            cdd_register_did_with_cdd: {
                targetAccount: string;
                secondaryKeys: string;
                expiry: string;
            };
            create_child_identity: {
                secondaryKey: string;
            };
            create_child_identities: {
                childKeys: string;
                expiresAt: string;
            };
            unlink_child_identity: {
                childDid: string;
            };
        };
    };
    /**
     * Lookup396: polymesh_common_utilities::traits::identity::SecondaryKeyWithAuth<sp_core::crypto::AccountId32>
     **/
    PolymeshCommonUtilitiesIdentitySecondaryKeyWithAuth: {
        secondaryKey: string;
        authSignature: string;
    };
    /**
     * Lookup399: polymesh_common_utilities::traits::identity::CreateChildIdentityWithAuth<sp_core::crypto::AccountId32>
     **/
    PolymeshCommonUtilitiesIdentityCreateChildIdentityWithAuth: {
        key: string;
        authSignature: string;
    };
    /**
     * Lookup400: pallet_identity::pallet::Error<T>
     **/
    PalletIdentityError: {
        _enum: string[];
    };
    /**
     * Lookup402: polymesh_primitives::traits::group::InactiveMember<Moment>
     **/
    PolymeshPrimitivesGroupInactiveMember: {
        id: string;
        deactivatedAt: string;
        expiry: string;
    };
    /**
     * Lookup403: pallet_group::pallet::Call<T, I>
     **/
    PalletGroupCall: {
        _enum: {
            set_active_members_limit: {
                limit: string;
            };
            disable_member: {
                who: string;
                expiry: string;
                at: string;
            };
            add_member: {
                who: string;
            };
            remove_member: {
                who: string;
            };
            swap_member: {
                remove: string;
                add: string;
            };
            reset_members: {
                members: string;
            };
            abdicate_membership: string;
        };
    };
    /**
     * Lookup404: pallet_group::pallet::Error<T, I>
     **/
    PalletGroupError: {
        _enum: string[];
    };
    /**
     * Lookup406: pallet_committee::pallet::Call<T, I>
     **/
    PalletCommitteeCall: {
        _enum: {
            set_vote_threshold: {
                n: string;
                d: string;
            };
            set_release_coordinator: {
                id: string;
            };
            set_expires_after: {
                expiry: string;
            };
            vote_or_propose: {
                approve: string;
                call: string;
            };
            vote: {
                proposal: string;
                index: string;
                approve: string;
            };
        };
    };
    /**
     * Lookup412: pallet_multisig::pallet::Call<T>
     **/
    PalletMultisigCall: {
        _enum: {
            create_multisig: {
                signers: string;
                sigsRequired: string;
                permissions: string;
            };
            create_proposal: {
                multisig: string;
                proposal: string;
                expiry: string;
            };
            approve: {
                multisig: string;
                proposalId: string;
                maxWeight: string;
            };
            reject: {
                multisig: string;
                proposalId: string;
            };
            accept_multisig_signer: {
                authId: string;
            };
            add_multisig_signers: {
                signers: string;
            };
            remove_multisig_signers: {
                signers: string;
            };
            add_multisig_signers_via_admin: {
                multisig: string;
                signers: string;
            };
            remove_multisig_signers_via_admin: {
                multisig: string;
                signers: string;
            };
            change_sigs_required: {
                sigsRequired: string;
            };
            change_sigs_required_via_admin: {
                multisig: string;
                signaturesRequired: string;
            };
            add_admin: {
                adminDid: string;
            };
            remove_admin_via_admin: {
                multisig: string;
            };
            remove_payer: string;
            remove_payer_via_payer: {
                multisig: string;
            };
            approve_join_identity: {
                multisig: string;
                authId: string;
            };
            join_identity: {
                authId: string;
            };
            remove_admin: string;
        };
    };
    /**
     * Lookup414: pallet_staking::pallet::pallet::Call<T>
     **/
    PalletStakingPalletCall: {
        _enum: {
            bond: {
                controller: string;
                value: string;
                payee: string;
            };
            bond_extra: {
                maxAdditional: string;
            };
            unbond: {
                value: string;
            };
            withdraw_unbonded: {
                numSlashingSpans: string;
            };
            validate: {
                prefs: string;
            };
            nominate: {
                targets: string;
            };
            chill: string;
            set_payee: {
                payee: string;
            };
            set_controller: {
                controller: string;
            };
            set_validator_count: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            increase_validator_count: {
                additional: string;
            };
            scale_validator_count: {
                factor: string;
            };
            force_no_eras: string;
            force_new_era: string;
            set_invulnerables: {
                invulnerables: string;
            };
            force_unstake: {
                stash: string;
                numSlashingSpans: string;
            };
            force_new_era_always: string;
            cancel_deferred_slash: {
                era: string;
                slashIndices: string;
            };
            payout_stakers: {
                validatorStash: string;
                era: string;
            };
            rebond: {
                value: string;
            };
            reap_stash: {
                stash: string;
                numSlashingSpans: string;
            };
            kick: {
                who: string;
            };
            set_staking_configs: {
                minNominatorBond: string;
                minValidatorBond: string;
                maxNominatorCount: string;
                maxValidatorCount: string;
                chillThreshold: string;
                minCommission: string;
            };
            chill_other: {
                controller: string;
            };
            force_apply_min_commission: {
                validatorStash: string;
            };
            set_min_commission: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            add_permissioned_validator: {
                identity: string;
                intendedCount: string;
            };
            remove_permissioned_validator: {
                identity: string;
            };
            __Unused28: string;
            payout_stakers_by_system: {
                validatorStash: string;
                era: string;
            };
            change_slashing_allowed_for: {
                slashingSwitch: string;
            };
            update_permissioned_validator_intended_count: {
                identity: string;
                newIntendedCount: string;
            };
            chill_from_governance: {
                identity: string;
                stashKeys: string;
            };
            set_commission_cap: {
                newCap: string;
            };
        };
    };
    /**
     * Lookup415: pallet_staking::RewardDestination<sp_core::crypto::AccountId32>
     **/
    PalletStakingRewardDestination: {
        _enum: {
            Staked: string;
            Stash: string;
            Controller: string;
            Account: string;
            None: string;
        };
    };
    /**
     * Lookup419: pallet_staking::pallet::pallet::ConfigOp<T>
     **/
    PalletStakingPalletConfigOpU128: {
        _enum: {
            Noop: string;
            Set: string;
            Remove: string;
        };
    };
    /**
     * Lookup420: pallet_staking::pallet::pallet::ConfigOp<T>
     **/
    PalletStakingPalletConfigOpU32: {
        _enum: {
            Noop: string;
            Set: string;
            Remove: string;
        };
    };
    /**
     * Lookup421: pallet_staking::pallet::pallet::ConfigOp<sp_arithmetic::per_things::Percent>
     **/
    PalletStakingPalletConfigOpPercent: {
        _enum: {
            Noop: string;
            Set: string;
            Remove: string;
        };
    };
    /**
     * Lookup422: pallet_staking::pallet::pallet::ConfigOp<sp_arithmetic::per_things::Perbill>
     **/
    PalletStakingPalletConfigOpPerbill: {
        _enum: {
            Noop: string;
            Set: string;
            Remove: string;
        };
    };
    /**
     * Lookup424: pallet_session::pallet::Call<T>
     **/
    PalletSessionCall: {
        _enum: {
            set_keys: {
                _alias: {
                    keys_: string;
                };
                keys_: string;
                proof: string;
            };
            purge_keys: string;
        };
    };
    /**
     * Lookup425: polymesh_runtime_develop::runtime::SessionKeys
     **/
    PolymeshRuntimeDevelopRuntimeSessionKeys: {
        grandpa: string;
        babe: string;
        imOnline: string;
        authorityDiscovery: string;
    };
    /**
     * Lookup426: sp_authority_discovery::app::Public
     **/
    SpAuthorityDiscoveryAppPublic: string;
    /**
     * Lookup427: pallet_grandpa::pallet::Call<T>
     **/
    PalletGrandpaCall: {
        _enum: {
            report_equivocation: {
                equivocationProof: string;
                keyOwnerProof: string;
            };
            report_equivocation_unsigned: {
                equivocationProof: string;
                keyOwnerProof: string;
            };
            note_stalled: {
                delay: string;
                bestFinalizedBlockNumber: string;
            };
        };
    };
    /**
     * Lookup428: sp_consensus_grandpa::EquivocationProof<primitive_types::H256, N>
     **/
    SpConsensusGrandpaEquivocationProof: {
        setId: string;
        equivocation: string;
    };
    /**
     * Lookup429: sp_consensus_grandpa::Equivocation<primitive_types::H256, N>
     **/
    SpConsensusGrandpaEquivocation: {
        _enum: {
            Prevote: string;
            Precommit: string;
        };
    };
    /**
     * Lookup430: finality_grandpa::Equivocation<sp_consensus_grandpa::app::Public, finality_grandpa::Prevote<primitive_types::H256, N>, sp_consensus_grandpa::app::Signature>
     **/
    FinalityGrandpaEquivocationPrevote: {
        roundNumber: string;
        identity: string;
        first: string;
        second: string;
    };
    /**
     * Lookup431: finality_grandpa::Prevote<primitive_types::H256, N>
     **/
    FinalityGrandpaPrevote: {
        targetHash: string;
        targetNumber: string;
    };
    /**
     * Lookup432: sp_consensus_grandpa::app::Signature
     **/
    SpConsensusGrandpaAppSignature: string;
    /**
     * Lookup433: sp_core::ed25519::Signature
     **/
    SpCoreEd25519Signature: string;
    /**
     * Lookup435: finality_grandpa::Equivocation<sp_consensus_grandpa::app::Public, finality_grandpa::Precommit<primitive_types::H256, N>, sp_consensus_grandpa::app::Signature>
     **/
    FinalityGrandpaEquivocationPrecommit: {
        roundNumber: string;
        identity: string;
        first: string;
        second: string;
    };
    /**
     * Lookup436: finality_grandpa::Precommit<primitive_types::H256, N>
     **/
    FinalityGrandpaPrecommit: {
        targetHash: string;
        targetNumber: string;
    };
    /**
     * Lookup438: pallet_im_online::pallet::Call<T>
     **/
    PalletImOnlineCall: {
        _enum: {
            heartbeat: {
                heartbeat: string;
                signature: string;
            };
        };
    };
    /**
     * Lookup439: pallet_im_online::Heartbeat<BlockNumber>
     **/
    PalletImOnlineHeartbeat: {
        blockNumber: string;
        networkState: string;
        sessionIndex: string;
        authorityIndex: string;
        validatorsLen: string;
    };
    /**
     * Lookup440: sp_core::offchain::OpaqueNetworkState
     **/
    SpCoreOffchainOpaqueNetworkState: {
        peerId: string;
        externalAddresses: string;
    };
    /**
     * Lookup444: pallet_im_online::sr25519::app_sr25519::Signature
     **/
    PalletImOnlineSr25519AppSr25519Signature: string;
    /**
     * Lookup445: sp_core::sr25519::Signature
     **/
    SpCoreSr25519Signature: string;
    /**
     * Lookup446: pallet_sudo::pallet::Call<T>
     **/
    PalletSudoCall: {
        _enum: {
            sudo: {
                call: string;
            };
            sudo_unchecked_weight: {
                call: string;
                weight: string;
            };
            set_key: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            sudo_as: {
                who: string;
                call: string;
            };
        };
    };
    /**
     * Lookup447: pallet_asset::pallet::Call<T>
     **/
    PalletAssetCall: {
        _enum: {
            register_unique_ticker: {
                ticker: string;
            };
            accept_ticker_transfer: {
                authId: string;
            };
            accept_asset_ownership_transfer: {
                authId: string;
            };
            create_asset: {
                assetName: string;
                divisible: string;
                assetType: string;
                assetIdentifiers: string;
                fundingRoundName: string;
            };
            freeze: {
                assetId: string;
            };
            unfreeze: {
                assetId: string;
            };
            rename_asset: {
                assetId: string;
                assetName: string;
            };
            issue: {
                assetId: string;
                amount: string;
                portfolioKind: string;
            };
            redeem: {
                assetId: string;
                value: string;
                portfolioKind: string;
            };
            make_divisible: {
                assetId: string;
            };
            add_documents: {
                docs: string;
                assetId: string;
            };
            remove_documents: {
                docsId: string;
                assetId: string;
            };
            set_funding_round: {
                assetId: string;
                fundingRoundName: string;
            };
            update_identifiers: {
                assetId: string;
                assetIdentifiers: string;
            };
            controller_transfer: {
                assetId: string;
                value: string;
                fromPortfolio: string;
            };
            register_custom_asset_type: {
                ty: string;
            };
            create_asset_with_custom_type: {
                assetName: string;
                divisible: string;
                customAssetType: string;
                assetIdentifiers: string;
                fundingRoundName: string;
            };
            set_asset_metadata: {
                assetId: string;
                key: string;
                value: string;
                detail: string;
            };
            set_asset_metadata_details: {
                assetId: string;
                key: string;
                detail: string;
            };
            register_and_set_local_asset_metadata: {
                assetId: string;
                name: string;
                spec: string;
                value: string;
                detail: string;
            };
            register_asset_metadata_local_type: {
                assetId: string;
                name: string;
                spec: string;
            };
            register_asset_metadata_global_type: {
                name: string;
                spec: string;
            };
            update_asset_type: {
                assetId: string;
                assetType: string;
            };
            remove_local_metadata_key: {
                assetId: string;
                localKey: string;
            };
            remove_metadata_value: {
                assetId: string;
                metadataKey: string;
            };
            exempt_asset_affirmation: {
                assetId: string;
            };
            remove_asset_affirmation_exemption: {
                assetId: string;
            };
            pre_approve_asset: {
                assetId: string;
            };
            remove_asset_pre_approval: {
                assetId: string;
            };
            add_mandatory_mediators: {
                assetId: string;
                mediators: string;
            };
            remove_mandatory_mediators: {
                assetId: string;
                mediators: string;
            };
            link_ticker_to_asset_id: {
                ticker: string;
                assetId: string;
            };
            unlink_ticker_from_asset_id: {
                ticker: string;
                assetId: string;
            };
            update_global_metadata_spec: {
                assetMetadataName: string;
                assetMetadataSpec: string;
            };
        };
    };
    /**
     * Lookup450: pallet_corporate_actions::distribution::pallet::Call<T>
     **/
    PalletCorporateActionsDistributionPalletCall: {
        _enum: {
            distribute: {
                caId: string;
                portfolio: string;
                currency: string;
                perShare: string;
                amount: string;
                paymentAt: string;
                expiresAt: string;
            };
            claim: {
                caId: string;
            };
            push_benefit: {
                caId: string;
                holder: string;
            };
            reclaim: {
                caId: string;
            };
            remove_distribution: {
                caId: string;
            };
        };
    };
    /**
     * Lookup452: pallet_asset::checkpoint::pallet::Call<T>
     **/
    PalletAssetCheckpointPalletCall: {
        _enum: {
            create_checkpoint: {
                assetId: string;
            };
            set_schedules_max_complexity: {
                maxComplexity: string;
            };
            create_schedule: {
                assetId: string;
                schedule: string;
            };
            remove_schedule: {
                assetId: string;
                id: string;
            };
        };
    };
    /**
     * Lookup453: pallet_compliance_manager::pallet::Call<T>
     **/
    PalletComplianceManagerCall: {
        _enum: {
            add_compliance_requirement: {
                assetId: string;
                senderConditions: string;
                receiverConditions: string;
            };
            remove_compliance_requirement: {
                assetId: string;
                id: string;
            };
            replace_asset_compliance: {
                assetId: string;
                assetCompliance: string;
            };
            reset_asset_compliance: {
                assetId: string;
            };
            pause_asset_compliance: {
                assetId: string;
            };
            resume_asset_compliance: {
                assetId: string;
            };
            add_default_trusted_claim_issuer: {
                assetId: string;
                issuer: string;
            };
            remove_default_trusted_claim_issuer: {
                assetId: string;
                issuer: string;
            };
            change_compliance_requirement: {
                assetId: string;
                newReq: string;
            };
        };
    };
    /**
     * Lookup454: pallet_corporate_actions::pallet::Call<T>
     **/
    PalletCorporateActionsCall: {
        _enum: {
            set_max_details_length: {
                length: string;
            };
            set_default_targets: {
                assetId: string;
                targets: string;
            };
            set_default_withholding_tax: {
                assetId: string;
                tax: string;
            };
            set_did_withholding_tax: {
                assetId: string;
                taxedDid: string;
                tax: string;
            };
            initiate_corporate_action: {
                assetId: string;
                kind: string;
                declDate: string;
                recordDate: string;
                details: string;
                targets: string;
                defaultWithholdingTax: string;
                withholdingTax: string;
            };
            link_ca_doc: {
                id: string;
                docs: string;
            };
            remove_ca: {
                caId: string;
            };
            change_record_date: {
                caId: string;
                recordDate: string;
            };
            initiate_corporate_action_and_distribute: {
                caArgs: string;
                portfolio: string;
                currency: string;
                perShare: string;
                amount: string;
                paymentAt: string;
                expiresAt: string;
            };
            initiate_corporate_action_and_ballot: {
                caArgs: string;
                ballotTimeRange: string;
                ballotMeta: string;
                rcv: string;
            };
        };
    };
    /**
     * Lookup456: pallet_corporate_actions::RecordDateSpec
     **/
    PalletCorporateActionsRecordDateSpec: {
        _enum: {
            Scheduled: string;
            ExistingSchedule: string;
            Existing: string;
        };
    };
    /**
     * Lookup459: pallet_corporate_actions::InitiateCorporateActionArgs
     **/
    PalletCorporateActionsInitiateCorporateActionArgs: {
        assetId: string;
        kind: string;
        declDate: string;
        recordDate: string;
        details: string;
        targets: string;
        defaultWithholdingTax: string;
        withholdingTax: string;
    };
    /**
     * Lookup460: pallet_corporate_actions::ballot::pallet::Call<T>
     **/
    PalletCorporateActionsBallotPalletCall: {
        _enum: {
            attach_ballot: {
                caId: string;
                range: string;
                meta: string;
                rcv: string;
            };
            vote: {
                caId: string;
                votes: string;
            };
            change_end: {
                caId: string;
                end: string;
            };
            change_meta: {
                caId: string;
                meta: string;
            };
            change_rcv: {
                caId: string;
                rcv: string;
            };
            remove_ballot: {
                caId: string;
            };
        };
    };
    /**
     * Lookup461: pallet_pips::pallet::Call<T>
     **/
    PalletPipsCall: {
        _enum: {
            set_prune_historical_pips: {
                prune: string;
            };
            set_min_proposal_deposit: {
                deposit: string;
            };
            set_default_enactment_period: {
                duration: string;
            };
            set_pending_pip_expiry: {
                expiry: string;
            };
            set_max_pip_skip_count: {
                max: string;
            };
            set_active_pip_limit: {
                limit: string;
            };
            propose: {
                proposal: string;
                deposit: string;
                url: string;
                description: string;
            };
            vote: {
                id: string;
                ayeOrNay: string;
                deposit: string;
            };
            approve_committee_proposal: {
                id: string;
            };
            reject_proposal: {
                id: string;
            };
            prune_proposal: {
                id: string;
            };
            reschedule_execution: {
                id: string;
                until: string;
            };
            clear_snapshot: string;
            snapshot: string;
            enact_snapshot_results: {
                results: string;
            };
            execute_scheduled_pip: {
                id: string;
            };
            expire_scheduled_pip: {
                did: string;
                id: string;
            };
        };
    };
    /**
     * Lookup464: pallet_pips::types::SnapshotResult
     **/
    PalletPipsSnapshotResult: {
        _enum: string[];
    };
    /**
     * Lookup465: pallet_portfolio::pallet::Call<T>
     **/
    PalletPortfolioCall: {
        _enum: {
            create_portfolio: {
                name: string;
            };
            delete_portfolio: {
                num: string;
            };
            rename_portfolio: {
                num: string;
                toName: string;
            };
            quit_portfolio_custody: {
                pid: string;
            };
            accept_portfolio_custody: {
                authId: string;
            };
            move_portfolio_funds: {
                from: string;
                to: string;
                funds: string;
            };
            pre_approve_portfolio: {
                assetId: string;
                portfolioId: string;
            };
            remove_portfolio_pre_approval: {
                assetId: string;
                portfolioId: string;
            };
            allow_identity_to_create_portfolios: {
                trustedIdentity: string;
            };
            revoke_create_portfolios_permission: {
                identity: string;
            };
            create_custody_portfolio: {
                portfolioOwnerId: string;
                portfolioName: string;
            };
        };
    };
    /**
     * Lookup467: polymesh_primitives::portfolio::Fund
     **/
    PolymeshPrimitivesPortfolioFund: {
        description: string;
        memo: string;
    };
    /**
     * Lookup468: pallet_protocol_fee::pallet::Call<T>
     **/
    PalletProtocolFeeCall: {
        _enum: {
            change_coefficient: {
                coefficient: string;
            };
            change_base_fee: {
                op: string;
                baseFee: string;
            };
        };
    };
    /**
     * Lookup469: polymesh_common_utilities::protocol_fee::ProtocolOp
     **/
    PolymeshCommonUtilitiesProtocolFeeProtocolOp: {
        _enum: string[];
    };
    /**
     * Lookup470: pallet_scheduler::pallet::Call<T>
     **/
    PalletSchedulerCall: {
        _enum: {
            schedule: {
                when: string;
                maybePeriodic: string;
                priority: string;
                call: string;
            };
            cancel: {
                when: string;
                index: string;
            };
            schedule_named: {
                id: string;
                when: string;
                maybePeriodic: string;
                priority: string;
                call: string;
            };
            cancel_named: {
                id: string;
            };
            schedule_after: {
                after: string;
                maybePeriodic: string;
                priority: string;
                call: string;
            };
            schedule_named_after: {
                id: string;
                after: string;
                maybePeriodic: string;
                priority: string;
                call: string;
            };
        };
    };
    /**
     * Lookup472: pallet_settlement::pallet::Call<T>
     **/
    PalletSettlementCall: {
        _enum: {
            create_venue: {
                details: string;
                signers: string;
                typ: string;
            };
            update_venue_details: {
                id: string;
                details: string;
            };
            update_venue_type: {
                id: string;
                typ: string;
            };
            affirm_with_receipts: {
                id: string;
                receiptDetails: string;
                portfolios: string;
            };
            set_venue_filtering: {
                assetId: string;
                enabled: string;
            };
            allow_venues: {
                assetId: string;
                venues: string;
            };
            disallow_venues: {
                assetId: string;
                venues: string;
            };
            update_venue_signers: {
                id: string;
                signers: string;
                addSigners: string;
            };
            execute_manual_instruction: {
                id: string;
                portfolio: string;
                fungibleTransfers: string;
                nftsTransfers: string;
                offchainTransfers: string;
                weightLimit: string;
            };
            add_instruction: {
                venueId: string;
                settlementType: string;
                tradeDate: string;
                valueDate: string;
                legs: string;
                instructionMemo: string;
            };
            add_and_affirm_instruction: {
                venueId: string;
                settlementType: string;
                tradeDate: string;
                valueDate: string;
                legs: string;
                portfolios: string;
                instructionMemo: string;
            };
            affirm_instruction: {
                id: string;
                portfolios: string;
            };
            withdraw_affirmation: {
                id: string;
                portfolios: string;
            };
            reject_instruction: {
                id: string;
                portfolio: string;
            };
            execute_scheduled_instruction: {
                id: string;
                weightLimit: string;
            };
            affirm_with_receipts_with_count: {
                id: string;
                receiptDetails: string;
                portfolios: string;
                numberOfAssets: string;
            };
            affirm_instruction_with_count: {
                id: string;
                portfolios: string;
                numberOfAssets: string;
            };
            reject_instruction_with_count: {
                id: string;
                portfolio: string;
                numberOfAssets: string;
            };
            withdraw_affirmation_with_count: {
                id: string;
                portfolios: string;
                numberOfAssets: string;
            };
            add_instruction_with_mediators: {
                venueId: string;
                settlementType: string;
                tradeDate: string;
                valueDate: string;
                legs: string;
                instructionMemo: string;
                mediators: string;
            };
            add_and_affirm_with_mediators: {
                venueId: string;
                settlementType: string;
                tradeDate: string;
                valueDate: string;
                legs: string;
                portfolios: string;
                instructionMemo: string;
                mediators: string;
            };
            affirm_instruction_as_mediator: {
                instructionId: string;
                expiry: string;
            };
            withdraw_affirmation_as_mediator: {
                instructionId: string;
            };
            reject_instruction_as_mediator: {
                instructionId: string;
                numberOfAssets: string;
            };
            lock_instruction: {
                instId: string;
                weightLimit: string;
            };
        };
    };
    /**
     * Lookup474: polymesh_primitives::settlement::ReceiptDetails<sp_core::crypto::AccountId32, sp_runtime::MultiSignature>
     **/
    PolymeshPrimitivesSettlementReceiptDetails: {
        uid: string;
        instructionId: string;
        legId: string;
        signer: string;
        signature: string;
        metadata: string;
    };
    /**
     * Lookup475: sp_runtime::MultiSignature
     **/
    SpRuntimeMultiSignature: {
        _enum: {
            Ed25519: string;
            Sr25519: string;
            Ecdsa: string;
        };
    };
    /**
     * Lookup476: sp_core::ecdsa::Signature
     **/
    SpCoreEcdsaSignature: string;
    /**
     * Lookup480: polymesh_primitives::settlement::AffirmationCount
     **/
    PolymeshPrimitivesSettlementAffirmationCount: {
        senderAssetCount: string;
        receiverAssetCount: string;
        offchainCount: string;
    };
    /**
     * Lookup481: polymesh_primitives::settlement::AssetCount
     **/
    PolymeshPrimitivesSettlementAssetCount: {
        fungible: string;
        nonFungible: string;
        offChain: string;
    };
    /**
     * Lookup484: pallet_statistics::pallet::Call<T>
     **/
    PalletStatisticsCall: {
        _enum: {
            set_active_asset_stats: {
                assetId: string;
                statTypes: string;
            };
            batch_update_asset_stats: {
                assetId: string;
                statType: string;
                values: string;
            };
            set_asset_transfer_compliance: {
                assetId: string;
                transferConditions: string;
            };
            set_entities_exempt: {
                isExempt: string;
                exemptKey: string;
                entities: string;
            };
        };
    };
    /**
     * Lookup488: pallet_sto::pallet::Call<T>
     **/
    PalletStoCall: {
        _enum: {
            create_fundraiser: {
                offeringPortfolio: string;
                offeringAsset: string;
                raisingPortfolio: string;
                raisingAsset: string;
                tiers: string;
                venueId: string;
                start: string;
                end: string;
                minimumInvestment: string;
                fundraiserName: string;
            };
            invest: {
                offeringAsset: string;
                fundraiserId: string;
                investmentPortfolio: string;
                funding: string;
                purchaseAmount: string;
                maxPrice: string;
            };
            freeze_fundraiser: {
                offeringAsset: string;
                fundraiserId: string;
            };
            unfreeze_fundraiser: {
                offeringAsset: string;
                fundraiserId: string;
            };
            modify_fundraiser_window: {
                offeringAsset: string;
                fundraiserId: string;
                start: string;
                end: string;
            };
            stop: {
                offeringAsset: string;
                fundraiserId: string;
            };
            enable_offchain_funding: {
                offeringAsset: string;
                fundraiserId: string;
                ticker: string;
            };
        };
    };
    /**
     * Lookup490: pallet_sto::PriceTier
     **/
    PalletStoPriceTier: {
        total: string;
        price: string;
    };
    /**
     * Lookup491: pallet_sto::FundingMethod<sp_core::crypto::AccountId32, sp_runtime::MultiSignature>
     **/
    PalletStoFundingMethod: {
        _enum: {
            OnChain: string;
            OffChain: string;
        };
    };
    /**
     * Lookup492: polymesh_primitives::sto::FundraiserReceiptDetails<sp_core::crypto::AccountId32, sp_runtime::MultiSignature>
     **/
    PolymeshPrimitivesStoFundraiserReceiptDetails: {
        uid: string;
        signer: string;
        signature: string;
        metadata: string;
    };
    /**
     * Lookup493: pallet_treasury::pallet::Call<T>
     **/
    PalletTreasuryCall: {
        _enum: {
            disbursement: {
                beneficiaries: string;
            };
            reimbursement: {
                amount: string;
            };
        };
    };
    /**
     * Lookup495: polymesh_primitives::Beneficiary<Balance>
     **/
    PolymeshPrimitivesBeneficiary: {
        id: string;
        amount: string;
    };
    /**
     * Lookup496: pallet_utility::pallet::Call<T>
     **/
    PalletUtilityCall: {
        _enum: {
            batch: {
                calls: string;
            };
            relay_tx: {
                target: string;
                signature: string;
                call: string;
            };
            batch_all: {
                calls: string;
            };
            dispatch_as: {
                asOrigin: string;
                call: string;
            };
            force_batch: {
                calls: string;
            };
            with_weight: {
                call: string;
                weight: string;
            };
            __Unused6: string;
            __Unused7: string;
            __Unused8: string;
            as_derivative: {
                index: string;
                call: string;
            };
        };
    };
    /**
     * Lookup498: pallet_utility::UniqueCall<polymesh_runtime_develop::runtime::RuntimeCall>
     **/
    PalletUtilityUniqueCall: {
        nonce: string;
        call: string;
    };
    /**
     * Lookup499: polymesh_runtime_develop::runtime::OriginCaller
     **/
    PolymeshRuntimeDevelopRuntimeOriginCaller: {
        _enum: {
            system: string;
            __Unused1: string;
            __Unused2: string;
            __Unused3: string;
            Void: string;
            __Unused5: string;
            __Unused6: string;
            __Unused7: string;
            __Unused8: string;
            PolymeshCommittee: string;
            __Unused10: string;
            TechnicalCommittee: string;
            __Unused12: string;
            UpgradeCommittee: string;
        };
    };
    /**
     * Lookup500: frame_support::dispatch::RawOrigin<sp_core::crypto::AccountId32>
     **/
    FrameSupportDispatchRawOrigin: {
        _enum: {
            Root: string;
            Signed: string;
            None: string;
        };
    };
    /**
     * Lookup501: pallet_committee::pallet::RawOrigin<sp_core::crypto::AccountId32, I>
     **/
    PalletCommitteeRawOrigin: {
        _enum: string[];
    };
    /**
     * Lookup504: sp_core::Void
     **/
    SpCoreVoid: string;
    /**
     * Lookup505: pallet_base::pallet::Call<T>
     **/
    PalletBaseCall: string;
    /**
     * Lookup506: pallet_external_agents::pallet::Call<T>
     **/
    PalletExternalAgentsCall: {
        _enum: {
            create_group: {
                assetId: string;
                perms: string;
            };
            set_group_permissions: {
                assetId: string;
                id: string;
                perms: string;
            };
            remove_agent: {
                assetId: string;
                agent: string;
            };
            abdicate: {
                assetId: string;
            };
            change_group: {
                assetId: string;
                agent: string;
                group: string;
            };
            accept_become_agent: {
                authId: string;
            };
            create_group_and_add_auth: {
                assetId: string;
                perms: string;
                target: string;
                expiry: string;
            };
            create_and_change_custom_group: {
                assetId: string;
                perms: string;
                agent: string;
            };
        };
    };
    /**
     * Lookup507: pallet_relayer::pallet::Call<T>
     **/
    PalletRelayerCall: {
        _enum: {
            set_paying_key: {
                userKey: string;
                polyxLimit: string;
            };
            accept_paying_key: {
                authId: string;
            };
            remove_paying_key: {
                userKey: string;
                payingKey: string;
            };
            update_polyx_limit: {
                userKey: string;
                polyxLimit: string;
            };
            increase_polyx_limit: {
                userKey: string;
                amount: string;
            };
            decrease_polyx_limit: {
                userKey: string;
                amount: string;
            };
        };
    };
    /**
     * Lookup508: pallet_contracts::pallet::Call<T>
     **/
    PalletContractsCall: {
        _enum: {
            call_old_weight: {
                dest: string;
                value: string;
                gasLimit: string;
                storageDepositLimit: string;
                data: string;
            };
            instantiate_with_code_old_weight: {
                value: string;
                gasLimit: string;
                storageDepositLimit: string;
                code: string;
                data: string;
                salt: string;
            };
            instantiate_old_weight: {
                value: string;
                gasLimit: string;
                storageDepositLimit: string;
                codeHash: string;
                data: string;
                salt: string;
            };
            upload_code: {
                code: string;
                storageDepositLimit: string;
                determinism: string;
            };
            remove_code: {
                codeHash: string;
            };
            set_code: {
                dest: string;
                codeHash: string;
            };
            call: {
                dest: string;
                value: string;
                gasLimit: string;
                storageDepositLimit: string;
                data: string;
            };
            instantiate_with_code: {
                value: string;
                gasLimit: string;
                storageDepositLimit: string;
                code: string;
                data: string;
                salt: string;
            };
            instantiate: {
                value: string;
                gasLimit: string;
                storageDepositLimit: string;
                codeHash: string;
                data: string;
                salt: string;
            };
        };
    };
    /**
     * Lookup512: pallet_contracts::wasm::Determinism
     **/
    PalletContractsWasmDeterminism: {
        _enum: string[];
    };
    /**
     * Lookup513: polymesh_contracts::pallet::Call<T>
     **/
    PolymeshContractsCall: {
        _enum: {
            instantiate_with_code_perms: {
                endowment: string;
                gasLimit: string;
                storageDepositLimit: string;
                code: string;
                data: string;
                salt: string;
                perms: string;
            };
            instantiate_with_hash_perms: {
                endowment: string;
                gasLimit: string;
                storageDepositLimit: string;
                codeHash: string;
                data: string;
                salt: string;
                perms: string;
            };
            update_call_runtime_whitelist: {
                updates: string;
            };
            instantiate_with_code_as_primary_key: {
                endowment: string;
                gasLimit: string;
                storageDepositLimit: string;
                code: string;
                data: string;
                salt: string;
            };
            instantiate_with_hash_as_primary_key: {
                endowment: string;
                gasLimit: string;
                storageDepositLimit: string;
                codeHash: string;
                data: string;
                salt: string;
            };
            upgrade_api: {
                api: string;
                nextUpgrade: string;
            };
        };
    };
    /**
     * Lookup516: polymesh_contracts::NextUpgrade<T>
     **/
    PolymeshContractsNextUpgrade: {
        chainVersion: string;
        apiHash: string;
    };
    /**
     * Lookup517: polymesh_contracts::ApiCodeHash<T>
     **/
    PolymeshContractsApiCodeHash: {
        _alias: {
            hash_: string;
        };
        hash_: string;
    };
    /**
     * Lookup518: pallet_preimage::pallet::Call<T>
     **/
    PalletPreimageCall: {
        _enum: {
            note_preimage: {
                bytes: string;
            };
            unnote_preimage: {
                _alias: {
                    hash_: string;
                };
                hash_: string;
            };
            request_preimage: {
                _alias: {
                    hash_: string;
                };
                hash_: string;
            };
            unrequest_preimage: {
                _alias: {
                    hash_: string;
                };
                hash_: string;
            };
        };
    };
    /**
     * Lookup519: pallet_nft::pallet::Call<T>
     **/
    PalletNftCall: {
        _enum: {
            create_nft_collection: {
                assetId: string;
                nftType: string;
                collectionKeys: string;
            };
            issue_nft: {
                assetId: string;
                nftMetadataAttributes: string;
                portfolioKind: string;
            };
            redeem_nft: {
                assetId: string;
                nftId: string;
                portfolioKind: string;
                numberOfKeys: string;
            };
            controller_transfer: {
                nfts: string;
                sourcePortfolio: string;
                callersPortfolioKind: string;
            };
        };
    };
    /**
     * Lookup522: polymesh_primitives::nft::NFTCollectionKeys
     **/
    PolymeshPrimitivesNftNftCollectionKeys: string;
    /**
     * Lookup525: polymesh_primitives::nft::NFTMetadataAttribute
     **/
    PolymeshPrimitivesNftNftMetadataAttribute: {
        key: string;
        value: string;
    };
    /**
     * Lookup527: pallet_election_provider_multi_phase::pallet::Call<T>
     **/
    PalletElectionProviderMultiPhaseCall: {
        _enum: {
            submit_unsigned: {
                rawSolution: string;
                witness: string;
            };
            set_minimum_untrusted_score: {
                maybeNextScore: string;
            };
            set_emergency_election_result: {
                supports: string;
            };
            submit: {
                rawSolution: string;
            };
            governance_fallback: {
                maybeMaxVoters: string;
                maybeMaxTargets: string;
            };
        };
    };
    /**
     * Lookup528: pallet_election_provider_multi_phase::RawSolution<polymesh_runtime_common::NposSolution16>
     **/
    PalletElectionProviderMultiPhaseRawSolution: {
        solution: string;
        score: string;
        round: string;
    };
    /**
     * Lookup529: polymesh_runtime_common::NposSolution16
     **/
    PolymeshRuntimeCommonNposSolution16: {
        votes1: string;
        votes2: string;
        votes3: string;
        votes4: string;
        votes5: string;
        votes6: string;
        votes7: string;
        votes8: string;
        votes9: string;
        votes10: string;
        votes11: string;
        votes12: string;
        votes13: string;
        votes14: string;
        votes15: string;
        votes16: string;
    };
    /**
     * Lookup580: pallet_election_provider_multi_phase::SolutionOrSnapshotSize
     **/
    PalletElectionProviderMultiPhaseSolutionOrSnapshotSize: {
        voters: string;
        targets: string;
    };
    /**
     * Lookup584: sp_npos_elections::Support<sp_core::crypto::AccountId32>
     **/
    SpNposElectionsSupport: {
        total: string;
        voters: string;
    };
    /**
     * Lookup587: pallet_confidential_assets::pallet::Call<T>
     **/
    PalletConfidentialAssetsCall: {
        _enum: {
            register_accounts: {
                proof: string;
            };
            create_asset: {
                mediators: string;
                auditors: string;
                data: string;
            };
            register_account_assets: {
                proof: string;
            };
            mint_asset: {
                proof: string;
            };
            create_settlement: {
                proof: string;
            };
            sender_affirmation: {
                proof: string;
            };
            receiver_affirmation: {
                proof: string;
            };
            mediator_affirmation: {
                proof: string;
            };
            sender_update_counter: {
                proof: string;
            };
            sender_revert: {
                proof: string;
            };
            receiver_claim: {
                proof: string;
            };
            batched_settlement: {
                proof: string;
            };
            register_fee_accounts: {
                proof: string;
            };
            topup_fee_accounts: {
                proof: string;
            };
            submit_batched_proofs: {
                proof: string;
            };
            relayer_submit_batched_proofs: {
                proof: string;
            };
            register_encryption_keys: {
                proof: string;
            };
        };
    };
    /**
     * Lookup588: polymesh_dart::bp::keys::AccountRegistrationProof<T>
     **/
    PolymeshDartBpKeysAccountRegistrationProof: {
        accounts: string;
        proof: string;
    };
    /**
     * Lookup590: polymesh_dart::bp::keys::AccountPublicKeys
     **/
    PolymeshDartBpKeysAccountPublicKeys: {
        enc: string;
        acct: string;
    };
    /**
     * Lookup593: polymesh_dart::bp::account::BatchedAccountAssetRegistrationProof<T>
     **/
    PolymeshDartBpAccountBatchedAccountAssetRegistrationProof: {
        proofs: string;
    };
    /**
     * Lookup595: polymesh_dart::bp::account::AccountAssetRegistrationProof
     **/
    PolymeshDartBpAccountAccountAssetRegistrationProof: {
        account: string;
        assetId: string;
        counter: string;
        accountStateCommitment: string;
        nullifier: string;
        proof: string;
    };
    /**
     * Lookup596: polymesh_dart::bp::account::AccountStateNullifier
     **/
    PolymeshDartBpAccountAccountStateNullifier: string;
    /**
     * Lookup599: polymesh_dart::bp::asset::AssetMintingProof<C>
     **/
    PolymeshDartBpAssetAssetMintingProof: {
        pk: string;
        assetId: string;
        amount: string;
        rootBlock: string;
        updatedAccountStateCommitment: string;
        nullifier: string;
        proof: string;
    };
    /**
     * Lookup601: polymesh_dart::bp::leg::SettlementProof<T, C>
     **/
    PolymeshDartBpLegSettlementProof: {
        memo: string;
        rootBlock: string;
        legs: string;
    };
    /**
     * Lookup603: polymesh_dart::bp::leg::SettlementLegProof<C>
     **/
    PolymeshDartBpLegSettlementLegProof: {
        legEnc: string;
        proof: string;
    };
    /**
     * Lookup606: polymesh_dart::bp::leg::SenderAffirmationProof<C>
     **/
    PolymeshDartBpLegSenderAffirmationProof: {
        legRef: string;
        rootBlock: string;
        updatedAccountStateCommitment: string;
        nullifier: string;
        proof: string;
    };
    /**
     * Lookup608: polymesh_dart::bp::leg::ReceiverAffirmationProof<C>
     **/
    PolymeshDartBpLegReceiverAffirmationProof: {
        legRef: string;
        rootBlock: string;
        updatedAccountStateCommitment: string;
        nullifier: string;
        proof: string;
    };
    /**
     * Lookup610: polymesh_dart::bp::leg::MediatorAffirmationProof
     **/
    PolymeshDartBpLegMediatorAffirmationProof: {
        legRef: string;
        accept: string;
        keyIndex: string;
        proof: string;
    };
    /**
     * Lookup612: polymesh_dart::bp::leg::SenderCounterUpdateProof<C>
     **/
    PolymeshDartBpLegSenderCounterUpdateProof: {
        legRef: string;
        rootBlock: string;
        updatedAccountStateCommitment: string;
        nullifier: string;
        proof: string;
    };
    /**
     * Lookup614: polymesh_dart::bp::leg::SenderReversalProof<C>
     **/
    PolymeshDartBpLegSenderReversalProof: {
        legRef: string;
        rootBlock: string;
        updatedAccountStateCommitment: string;
        nullifier: string;
        proof: string;
    };
    /**
     * Lookup616: polymesh_dart::bp::leg::ReceiverClaimProof<C>
     **/
    PolymeshDartBpLegReceiverClaimProof: {
        legRef: string;
        rootBlock: string;
        updatedAccountStateCommitment: string;
        nullifier: string;
        proof: string;
    };
    /**
     * Lookup618: polymesh_dart::bp::leg::BatchedSettlementProof<T, polymesh_dart::curve_tree::AssetTreeConfig, polymesh_dart::curve_tree::AccountTreeConfig>
     **/
    PolymeshDartBpLegBatchedSettlementProof: {
        settlement: string;
        legAffirmations: string;
    };
    /**
     * Lookup619: polymesh_dart::curve_tree::AssetTreeConfig
     **/
    PolymeshDartCurveTreeAssetTreeConfig: string;
    /**
     * Lookup620: polymesh_dart::curve_tree::AccountTreeConfig
     **/
    PolymeshDartCurveTreeAccountTreeConfig: string;
    /**
     * Lookup622: polymesh_dart::bp::leg::BatchedSettlementLegAffirmations<polymesh_dart::curve_tree::AccountTreeConfig>
     **/
    PolymeshDartBpLegBatchedSettlementLegAffirmations: {
        sender: string;
        receiver: string;
    };
    /**
     * Lookup626: polymesh_dart::bp::fee::BatchedFeeAccountRegistrationProof<T>
     **/
    PolymeshDartBpFeeBatchedFeeAccountRegistrationProof: {
        proofs: string;
    };
    /**
     * Lookup628: polymesh_dart::bp::fee::FeeAccountRegistrationProof
     **/
    PolymeshDartBpFeeFeeAccountRegistrationProof: {
        account: string;
        assetId: string;
        amount: string;
        accountStateCommitment: string;
        proof: string;
    };
    /**
     * Lookup631: polymesh_dart::bp::fee::BatchedFeeAccountTopupProof<T, C>
     **/
    PolymeshDartBpFeeBatchedFeeAccountTopupProof: {
        rootBlock: string;
        proofs: string;
    };
    /**
     * Lookup633: polymesh_dart::bp::fee::FeeAccountTopupProof<C>
     **/
    PolymeshDartBpFeeFeeAccountTopupProof: {
        account: string;
        assetId: string;
        amount: string;
        updatedAccountStateCommitment: string;
        nullifier: string;
        proof: string;
    };
    /**
     * Lookup634: polymesh_dart::bp::fee::FeeAccountStateNullifier
     **/
    PolymeshDartBpFeeFeeAccountStateNullifier: string;
    /**
     * Lookup637: polymesh_dart::bp::batched::BatchedProofs<T>
     **/
    PolymeshDartBpBatchedBatchedProofs: {
        proofs: string;
    };
    /**
     * Lookup639: polymesh_dart::bp::batched::BatchedProof<T>
     **/
    PolymeshDartBpBatchedBatchedProof: {
        _enum: {
            CreateSettlement: string;
            SenderAffirmation: string;
            ReceiverAffirmation: string;
            MediatorAffirmation: string;
            SenderCounterUpdate: string;
            SenderReversal: string;
            ReceiverClaim: string;
        };
    };
    /**
     * Lookup641: polymesh_dart::bp::fee::FeePaymentWithBatchedProofs<T, C>
     **/
    PolymeshDartBpFeeFeePaymentWithBatchedProofs: {
        feePayment: string;
        batchedProofs: string;
    };
    /**
     * Lookup642: polymesh_dart::bp::fee::FeeAccountPaymentProof<C>
     **/
    PolymeshDartBpFeeFeeAccountPaymentProof: {
        assetId: string;
        amount: string;
        rootBlock: string;
        updatedAccountStateCommitment: string;
        nullifier: string;
        proof: string;
    };
    /**
     * Lookup644: polymesh_dart::bp::keys::EncryptionKeyRegistrationProof<T>
     **/
    PolymeshDartBpKeysEncryptionKeyRegistrationProof: {
        _alias: {
            keys_: string;
        };
        keys_: string;
        proof: string;
    };
    /**
     * Lookup647: pallet_committee::pallet::PolymeshVotes<BlockNumber>
     **/
    PalletCommitteePolymeshVotes: {
        index: string;
        ayes: string;
        nays: string;
        expiry: string;
    };
    /**
     * Lookup648: pallet_committee::pallet::Error<T, I>
     **/
    PalletCommitteeError: {
        _enum: string[];
    };
    /**
     * Lookup657: polymesh_primitives::multisig::ProposalVoteCount
     **/
    PolymeshPrimitivesMultisigProposalVoteCount: {
        approvals: string;
        rejections: string;
    };
    /**
     * Lookup658: polymesh_primitives::multisig::ProposalState<Moment>
     **/
    PolymeshPrimitivesMultisigProposalState: {
        _enum: {
            Active: {
                until: string;
            };
            ExecutionSuccessful: string;
            ExecutionFailed: string;
            Rejected: string;
        };
    };
    /**
     * Lookup660: pallet_multisig::pallet::Error<T>
     **/
    PalletMultisigError: {
        _enum: string[];
    };
    /**
     * Lookup661: pallet_staking::StakingLedger<T>
     **/
    PalletStakingStakingLedger: {
        stash: string;
        total: string;
        active: string;
        unlocking: string;
        claimedRewards: string;
    };
    /**
     * Lookup663: pallet_staking::UnlockChunk<Balance>
     **/
    PalletStakingUnlockChunk: {
        value: string;
        era: string;
    };
    /**
     * Lookup666: pallet_staking::Nominations<T>
     **/
    PalletStakingNominations: {
        targets: string;
        submittedIn: string;
        suppressed: string;
    };
    /**
     * Lookup668: pallet_staking::ActiveEraInfo
     **/
    PalletStakingActiveEraInfo: {
        index: string;
        start: string;
    };
    /**
     * Lookup670: pallet_staking::EraRewardPoints<sp_core::crypto::AccountId32>
     **/
    PalletStakingEraRewardPoints: {
        total: string;
        individual: string;
    };
    /**
     * Lookup675: pallet_staking::UnappliedSlash<sp_core::crypto::AccountId32, Balance>
     **/
    PalletStakingUnappliedSlash: {
        validator: string;
        own: string;
        others: string;
        reporters: string;
        payout: string;
    };
    /**
     * Lookup677: pallet_staking::slashing::SlashingSpans
     **/
    PalletStakingSlashingSlashingSpans: {
        spanIndex: string;
        lastStart: string;
        lastNonzeroSlash: string;
        prior: string;
    };
    /**
     * Lookup678: pallet_staking::slashing::SpanRecord<Balance>
     **/
    PalletStakingSlashingSpanRecord: {
        slashed: string;
        paidOut: string;
    };
    /**
     * Lookup681: pallet_staking::types::PermissionedIdentityPrefs
     **/
    PalletStakingPermissionedIdentityPrefs: {
        intendedCount: string;
        runningCount: string;
    };
    /**
     * Lookup683: pallet_staking::pallet::pallet::Error<T>
     **/
    PalletStakingPalletError: {
        _enum: string[];
    };
    /**
     * Lookup684: sp_staking::offence::OffenceDetails<sp_core::crypto::AccountId32, Offender>
     **/
    SpStakingOffenceOffenceDetails: {
        offender: string;
        reporters: string;
    };
    /**
     * Lookup689: sp_core::crypto::KeyTypeId
     **/
    SpCoreCryptoKeyTypeId: string;
    /**
     * Lookup690: pallet_session::pallet::Error<T>
     **/
    PalletSessionError: {
        _enum: string[];
    };
    /**
     * Lookup691: pallet_grandpa::StoredState<N>
     **/
    PalletGrandpaStoredState: {
        _enum: {
            Live: string;
            PendingPause: {
                scheduledAt: string;
                delay: string;
            };
            Paused: string;
            PendingResume: {
                scheduledAt: string;
                delay: string;
            };
        };
    };
    /**
     * Lookup692: pallet_grandpa::StoredPendingChange<N, Limit>
     **/
    PalletGrandpaStoredPendingChange: {
        scheduledAt: string;
        delay: string;
        nextAuthorities: string;
        forced: string;
    };
    /**
     * Lookup694: pallet_grandpa::pallet::Error<T>
     **/
    PalletGrandpaError: {
        _enum: string[];
    };
    /**
     * Lookup698: pallet_im_online::BoundedOpaqueNetworkState<PeerIdEncodingLimit, MultiAddrEncodingLimit, AddressesLimit>
     **/
    PalletImOnlineBoundedOpaqueNetworkState: {
        peerId: string;
        externalAddresses: string;
    };
    /**
     * Lookup702: pallet_im_online::pallet::Error<T>
     **/
    PalletImOnlineError: {
        _enum: string[];
    };
    /**
     * Lookup704: pallet_sudo::pallet::Error<T>
     **/
    PalletSudoError: {
        _enum: string[];
    };
    /**
     * Lookup705: pallet_asset::types::TickerRegistration<T>
     **/
    PalletAssetTickerRegistration: {
        owner: string;
        expiry: string;
    };
    /**
     * Lookup706: pallet_asset::types::TickerRegistrationConfig<T>
     **/
    PalletAssetTickerRegistrationConfig: {
        maxTickerLength: string;
        registrationLength: string;
    };
    /**
     * Lookup707: pallet_asset::types::AssetDetails
     **/
    PalletAssetAssetDetails: {
        totalSupply: string;
        ownerDid: string;
        divisible: string;
        assetType: string;
    };
    /**
     * Lookup717: pallet_asset::pallet::Error<T>
     **/
    PalletAssetError: {
        _enum: string[];
    };
    /**
     * Lookup720: pallet_corporate_actions::distribution::pallet::Error<T>
     **/
    PalletCorporateActionsDistributionPalletError: {
        _enum: string[];
    };
    /**
     * Lookup724: polymesh_common_utilities::traits::checkpoint::NextCheckpoints
     **/
    PolymeshCommonUtilitiesCheckpointNextCheckpoints: {
        nextAt: string;
        totalPending: string;
        schedules: string;
    };
    /**
     * Lookup730: pallet_asset::checkpoint::pallet::Error<T>
     **/
    PalletAssetCheckpointPalletError: {
        _enum: string[];
    };
    /**
     * Lookup731: polymesh_primitives::compliance_manager::AssetCompliance
     **/
    PolymeshPrimitivesComplianceManagerAssetCompliance: {
        paused: string;
        requirements: string;
    };
    /**
     * Lookup733: pallet_compliance_manager::pallet::Error<T>
     **/
    PalletComplianceManagerError: {
        _enum: string[];
    };
    /**
     * Lookup736: pallet_corporate_actions::pallet::Error<T>
     **/
    PalletCorporateActionsError: {
        _enum: string[];
    };
    /**
     * Lookup740: pallet_corporate_actions::ballot::pallet::Error<T>
     **/
    PalletCorporateActionsBallotPalletError: {
        _enum: string[];
    };
    /**
     * Lookup741: pallet_permissions::pallet::Error<T>
     **/
    PalletPermissionsError: {
        _enum: string[];
    };
    /**
     * Lookup742: pallet_pips::types::PipsMetadata<BlockNumber>
     **/
    PalletPipsPipsMetadata: {
        id: string;
        url: string;
        description: string;
        createdAt: string;
        transactionVersion: string;
        expiry: string;
    };
    /**
     * Lookup744: pallet_pips::types::DepositInfo<sp_core::crypto::AccountId32>
     **/
    PalletPipsDepositInfo: {
        owner: string;
        amount: string;
    };
    /**
     * Lookup745: pallet_pips::types::Pip<polymesh_runtime_develop::runtime::RuntimeCall, sp_core::crypto::AccountId32>
     **/
    PalletPipsPip: {
        id: string;
        proposal: string;
        proposer: string;
    };
    /**
     * Lookup746: pallet_pips::types::VotingResult
     **/
    PalletPipsVotingResult: {
        ayesCount: string;
        ayesStake: string;
        naysCount: string;
        naysStake: string;
    };
    /**
     * Lookup747: pallet_pips::types::Vote
     **/
    PalletPipsVote: string;
    /**
     * Lookup748: pallet_pips::types::SnapshotMetadata<BlockNumber, sp_core::crypto::AccountId32>
     **/
    PalletPipsSnapshotMetadata: {
        createdAt: string;
        madeBy: string;
        id: string;
    };
    /**
     * Lookup750: pallet_pips::pallet::Error<T>
     **/
    PalletPipsError: {
        _enum: string[];
    };
    /**
     * Lookup758: pallet_portfolio::pallet::Error<T>
     **/
    PalletPortfolioError: {
        _enum: string[];
    };
    /**
     * Lookup759: pallet_protocol_fee::pallet::Error<T>
     **/
    PalletProtocolFeeError: {
        _enum: string[];
    };
    /**
     * Lookup762: pallet_scheduler::Scheduled<Name, frame_support::traits::preimages::Bounded<polymesh_runtime_develop::runtime::RuntimeCall>, BlockNumber, polymesh_runtime_develop::runtime::OriginCaller, sp_core::crypto::AccountId32>
     **/
    PalletSchedulerScheduled: {
        maybeId: string;
        priority: string;
        call: string;
        maybePeriodic: string;
        origin: string;
    };
    /**
     * Lookup763: frame_support::traits::preimages::Bounded<polymesh_runtime_develop::runtime::RuntimeCall>
     **/
    FrameSupportPreimagesBounded: {
        _enum: {
            Legacy: {
                _alias: {
                    hash_: string;
                };
                hash_: string;
            };
            Inline: string;
            Lookup: {
                _alias: {
                    hash_: string;
                };
                hash_: string;
                len: string;
            };
        };
    };
    /**
     * Lookup766: pallet_scheduler::pallet::Error<T>
     **/
    PalletSchedulerError: {
        _enum: string[];
    };
    /**
     * Lookup767: polymesh_primitives::settlement::Venue
     **/
    PolymeshPrimitivesSettlementVenue: {
        creator: string;
        venueType: string;
    };
    /**
     * Lookup771: polymesh_primitives::settlement::Instruction<Moment, BlockNumber>
     **/
    PolymeshPrimitivesSettlementInstruction: {
        instructionId: string;
        venueId: string;
        settlementType: string;
        createdAt: string;
        tradeDate: string;
        valueDate: string;
    };
    /**
     * Lookup773: polymesh_primitives::settlement::LegStatus<sp_core::crypto::AccountId32>
     **/
    PolymeshPrimitivesSettlementLegStatus: {
        _enum: {
            PendingTokenLock: string;
            ExecutionPending: string;
            ExecutionToBeSkipped: string;
        };
    };
    /**
     * Lookup775: polymesh_primitives::settlement::AffirmationStatus
     **/
    PolymeshPrimitivesSettlementAffirmationStatus: {
        _enum: string[];
    };
    /**
     * Lookup778: polymesh_primitives::settlement::InstructionStatus<BlockNumber>
     **/
    PolymeshPrimitivesSettlementInstructionStatus: {
        _enum: {
            Unknown: string;
            Pending: string;
            Failed: string;
            Success: string;
            Rejected: string;
            LockedForExecution: string;
        };
    };
    /**
     * Lookup780: polymesh_primitives::settlement::MediatorAffirmationStatus<T>
     **/
    PolymeshPrimitivesSettlementMediatorAffirmationStatus: {
        _enum: {
            Unknown: string;
            Pending: string;
            Affirmed: {
                expiry: string;
            };
        };
    };
    /**
     * Lookup782: pallet_settlement::pallet::Error<T>
     **/
    PalletSettlementError: {
        _enum: string[];
    };
    /**
     * Lookup785: polymesh_primitives::statistics::Stat1stKey
     **/
    PolymeshPrimitivesStatisticsStat1stKey: {
        assetId: string;
        statType: string;
    };
    /**
     * Lookup786: polymesh_primitives::transfer_compliance::AssetTransferCompliance<S>
     **/
    PolymeshPrimitivesTransferComplianceAssetTransferCompliance: {
        paused: string;
        requirements: string;
    };
    /**
     * Lookup790: pallet_statistics::pallet::Error<T>
     **/
    PalletStatisticsError: {
        _enum: string[];
    };
    /**
     * Lookup793: pallet_sto::pallet::Error<T>
     **/
    PalletStoError: {
        _enum: string[];
    };
    /**
     * Lookup794: pallet_treasury::pallet::Error<T>
     **/
    PalletTreasuryError: {
        _enum: string[];
    };
    /**
     * Lookup795: pallet_utility::pallet::Error<T>
     **/
    PalletUtilityError: {
        _enum: string[];
    };
    /**
     * Lookup796: pallet_base::pallet::Error<T>
     **/
    PalletBaseError: {
        _enum: string[];
    };
    /**
     * Lookup799: pallet_external_agents::pallet::Error<T>
     **/
    PalletExternalAgentsError: {
        _enum: string[];
    };
    /**
     * Lookup800: pallet_relayer::pallet::Subsidy<sp_core::crypto::AccountId32>
     **/
    PalletRelayerSubsidy: {
        payingKey: string;
        remaining: string;
    };
    /**
     * Lookup801: pallet_relayer::pallet::Error<T>
     **/
    PalletRelayerError: {
        _enum: string[];
    };
    /**
     * Lookup803: pallet_contracts::wasm::PrefabWasmModule<T>
     **/
    PalletContractsWasmPrefabWasmModule: {
        instructionWeightsVersion: string;
        initial: string;
        maximum: string;
        code: string;
        determinism: string;
    };
    /**
     * Lookup805: pallet_contracts::wasm::OwnerInfo<T>
     **/
    PalletContractsWasmOwnerInfo: {
        owner: string;
        deposit: string;
        refcount: string;
    };
    /**
     * Lookup806: pallet_contracts::storage::ContractInfo<T>
     **/
    PalletContractsStorageContractInfo: {
        trieId: string;
        depositAccount: string;
        codeHash: string;
        storageBytes: string;
        storageItems: string;
        storageByteDeposit: string;
        storageItemDeposit: string;
        storageBaseDeposit: string;
    };
    /**
     * Lookup809: pallet_contracts::storage::DeletedContract
     **/
    PalletContractsStorageDeletedContract: {
        trieId: string;
    };
    /**
     * Lookup811: pallet_contracts::schedule::Schedule<T>
     **/
    PalletContractsSchedule: {
        limits: string;
        instructionWeights: string;
        hostFnWeights: string;
    };
    /**
     * Lookup812: pallet_contracts::schedule::Limits
     **/
    PalletContractsScheduleLimits: {
        eventTopics: string;
        globals: string;
        locals: string;
        parameters: string;
        memoryPages: string;
        tableSize: string;
        brTableSize: string;
        subjectLen: string;
        payloadLen: string;
    };
    /**
     * Lookup813: pallet_contracts::schedule::InstructionWeights<T>
     **/
    PalletContractsScheduleInstructionWeights: {
        _alias: {
            r_if: string;
        };
        version: string;
        fallback: string;
        i64const: string;
        i64load: string;
        i64store: string;
        select: string;
        r_if: string;
        br: string;
        brIf: string;
        brTable: string;
        brTablePerEntry: string;
        call: string;
        callIndirect: string;
        callIndirectPerParam: string;
        callPerLocal: string;
        localGet: string;
        localSet: string;
        localTee: string;
        globalGet: string;
        globalSet: string;
        memoryCurrent: string;
        memoryGrow: string;
        i64clz: string;
        i64ctz: string;
        i64popcnt: string;
        i64eqz: string;
        i64extendsi32: string;
        i64extendui32: string;
        i32wrapi64: string;
        i64eq: string;
        i64ne: string;
        i64lts: string;
        i64ltu: string;
        i64gts: string;
        i64gtu: string;
        i64les: string;
        i64leu: string;
        i64ges: string;
        i64geu: string;
        i64add: string;
        i64sub: string;
        i64mul: string;
        i64divs: string;
        i64divu: string;
        i64rems: string;
        i64remu: string;
        i64and: string;
        i64or: string;
        i64xor: string;
        i64shl: string;
        i64shrs: string;
        i64shru: string;
        i64rotl: string;
        i64rotr: string;
    };
    /**
     * Lookup814: pallet_contracts::schedule::HostFnWeights<T>
     **/
    PalletContractsScheduleHostFnWeights: {
        _alias: {
            r_return: string;
        };
        caller: string;
        isContract: string;
        codeHash: string;
        ownCodeHash: string;
        callerIsOrigin: string;
        address: string;
        gasLeft: string;
        balance: string;
        valueTransferred: string;
        minimumBalance: string;
        blockNumber: string;
        now: string;
        weightToFee: string;
        gas: string;
        input: string;
        inputPerByte: string;
        r_return: string;
        returnPerByte: string;
        terminate: string;
        random: string;
        depositEvent: string;
        depositEventPerTopic: string;
        depositEventPerByte: string;
        debugMessage: string;
        debugMessagePerByte: string;
        setStorage: string;
        setStoragePerNewByte: string;
        setStoragePerOldByte: string;
        setCodeHash: string;
        clearStorage: string;
        clearStoragePerByte: string;
        containsStorage: string;
        containsStoragePerByte: string;
        getStorage: string;
        getStoragePerByte: string;
        takeStorage: string;
        takeStoragePerByte: string;
        transfer: string;
        call: string;
        delegateCall: string;
        callTransferSurcharge: string;
        callPerClonedByte: string;
        instantiate: string;
        instantiateTransferSurcharge: string;
        instantiatePerInputByte: string;
        instantiatePerSaltByte: string;
        hashSha2256: string;
        hashSha2256PerByte: string;
        hashKeccak256: string;
        hashKeccak256PerByte: string;
        hashBlake2256: string;
        hashBlake2256PerByte: string;
        hashBlake2128: string;
        hashBlake2128PerByte: string;
        ecdsaRecover: string;
        ecdsaToEthAddress: string;
        reentranceCount: string;
        accountReentranceCount: string;
        instantiationNonce: string;
    };
    /**
     * Lookup815: pallet_contracts::pallet::Error<T>
     **/
    PalletContractsError: {
        _enum: string[];
    };
    /**
     * Lookup817: polymesh_contracts::pallet::Error<T>
     **/
    PolymeshContractsError: {
        _enum: string[];
    };
    /**
     * Lookup818: pallet_preimage::RequestStatus<sp_core::crypto::AccountId32, Balance>
     **/
    PalletPreimageRequestStatus: {
        _enum: {
            Unrequested: {
                deposit: string;
                len: string;
            };
            Requested: {
                deposit: string;
                count: string;
                len: string;
            };
        };
    };
    /**
     * Lookup822: pallet_preimage::pallet::Error<T>
     **/
    PalletPreimageError: {
        _enum: string[];
    };
    /**
     * Lookup823: polymesh_primitives::nft::NFTCollection
     **/
    PolymeshPrimitivesNftNftCollection: {
        id: string;
        assetId: string;
    };
    /**
     * Lookup827: pallet_nft::pallet::Error<T>
     **/
    PalletNftError: {
        _enum: string[];
    };
    /**
     * Lookup828: pallet_election_provider_multi_phase::ReadySolution<T>
     **/
    PalletElectionProviderMultiPhaseReadySolution: {
        supports: string;
        score: string;
        compute: string;
    };
    /**
     * Lookup830: pallet_election_provider_multi_phase::RoundSnapshot<T>
     **/
    PalletElectionProviderMultiPhaseRoundSnapshot: {
        voters: string;
        targets: string;
    };
    /**
     * Lookup836: pallet_election_provider_multi_phase::signed::SignedSubmission<sp_core::crypto::AccountId32, Balance, polymesh_runtime_common::NposSolution16>
     **/
    PalletElectionProviderMultiPhaseSignedSignedSubmission: {
        who: string;
        deposit: string;
        rawSolution: string;
        callFee: string;
    };
    /**
     * Lookup837: pallet_election_provider_multi_phase::pallet::Error<T>
     **/
    PalletElectionProviderMultiPhaseError: {
        _enum: string[];
    };
    /**
     * Lookup839: pallet_confidential_assets::DartAssetDetail<T>
     **/
    PalletConfidentialAssetsDartAssetDetail: {
        assetId: string;
        totalSupply: string;
        ownerDid: string;
        data: string;
        mediators: string;
        auditors: string;
    };
    /**
     * Lookup843: polymesh_dart::curve_tree::common::NodeLocation
     **/
    PolymeshDartCurveTreeCommonNodeLocation: {
        _enum: {
            Leaf: string;
            Odd: string;
            Even: string;
        };
    };
    /**
     * Lookup844: polymesh_dart::curve_tree::common::NodePosition
     **/
    PolymeshDartCurveTreeCommonNodePosition: {
        level: string;
        index: string;
    };
    /**
     * Lookup846: polymesh_dart::curve_tree::common::CompressedInner<C>
     **/
    PolymeshDartCurveTreeCommonCompressedInner: {
        isEven: string;
        commitments: string;
    };
    /**
     * Lookup852: pallet_confidential_assets::settlement::LegAffirmParty
     **/
    PalletConfidentialAssetsSettlementLegAffirmParty: {
        _enum: {
            Sender: string;
            Receiver: string;
            Mediator: string;
        };
    };
    /**
     * Lookup853: pallet_confidential_assets::settlement::AffirmationStatus
     **/
    PalletConfidentialAssetsSettlementAffirmationStatus: {
        _enum: string[];
    };
    /**
     * Lookup854: frame_support::PalletId
     **/
    FrameSupportPalletId: string;
    /**
     * Lookup855: pallet_confidential_assets::pallet::Error<T>
     **/
    PalletConfidentialAssetsError: {
        _enum: string[];
    };
    /**
     * Lookup858: frame_system::extensions::check_spec_version::CheckSpecVersion<T>
     **/
    FrameSystemExtensionsCheckSpecVersion: string;
    /**
     * Lookup859: frame_system::extensions::check_tx_version::CheckTxVersion<T>
     **/
    FrameSystemExtensionsCheckTxVersion: string;
    /**
     * Lookup860: frame_system::extensions::check_genesis::CheckGenesis<T>
     **/
    FrameSystemExtensionsCheckGenesis: string;
    /**
     * Lookup863: frame_system::extensions::check_nonce::CheckNonce<T>
     **/
    FrameSystemExtensionsCheckNonce: string;
    /**
     * Lookup864: frame_system::extensions::check_weight::CheckWeight<T>
     **/
    FrameSystemExtensionsCheckWeight: string;
    /**
     * Lookup865: pallet_transaction_payment::ChargeTransactionPayment<T>
     **/
    PalletTransactionPaymentChargeTransactionPayment: string;
    /**
     * Lookup866: pallet_permissions::StoreCallMetadata<T>
     **/
    PalletPermissionsStoreCallMetadata: string;
    /**
     * Lookup867: polymesh_runtime_develop::runtime::Runtime
     **/
    PolymeshRuntimeDevelopRuntime: string;
};
export default _default;
//# sourceMappingURL=lookup.d.ts.map