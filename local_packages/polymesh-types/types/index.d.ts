declare const _default: ({
    minmax: number[];
    types: {
        PolymeshAssetId: string;
        IdentityId: string;
        Ticker: string;
        CddId: string;
        PalletName: string;
        ExtrinsicName: string;
        AuthorizationNonce: string;
        TargetIdAuthorization: {
            targetId: string;
            nonce: string;
            expiresAt: string;
        };
        Receipt: {
            uid: string;
            instructionId: string;
            legId: string;
            senderIdentity: string;
            receiverIdentity: string;
            ticker: string;
            amount: string;
        };
        FundraiserId: string;
        FundraiserReceipt: {
            uid: string;
            fundraiserId: string;
            legId: string;
            senderIdentity: string;
            receiverIdentity: string;
            ticker: string;
            amount: string;
        };
        AssetPermissions: {
            _enum: {
                Whole: string;
                These: string;
                Except: string;
            };
        };
        PortfolioPermissions: {
            _enum: {
                Whole: string;
                These: string;
                Except: string;
            };
        };
        ExtrinsicNames: {
            _enum: {
                Whole: string;
                These: string;
                Except: string;
            };
        };
        PalletPermissions: {
            extrinsics: string;
        };
        ExtrinsicPermissions: {
            _enum: {
                Whole: string;
                These: string;
                Except: string;
            };
        };
        Permissions: {
            asset: string;
            extrinsic: string;
            portfolio: string;
        };
        Signatory: {
            _enum: {
                Identity: string;
                Account: string;
            };
        };
        SecondaryKey: {
            key: string;
            permissions: string;
        };
        KeyIdentityData: {
            identity: string;
            permissions: string;
        };
        CountryCode: {
            _enum: string[];
        };
        Scope: {
            _enum: {
                Identity: string;
                Asset: string;
                Custom: string;
            };
        };
        CustomClaimTypeId: string;
        Claim: {
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
        ClaimType: {
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
        IdentityClaim: {
            claimIssuer: string;
            issuanceDate: string;
            lastUpdateDate: string;
            expiry: string;
            claim: string;
        };
        ComplianceRequirementResult: {
            senderConditions: string;
            receiverConditions: string;
            id: string;
            result: string;
        };
        ConditionType: {
            _enum: {
                IsPresent: string;
                IsAbsent: string;
                IsAnyOf: string;
                IsNoneOf: string;
                IsIdentity: string;
            };
        };
        TrustedFor: {
            _enum: {
                Any: string;
                Specific: string;
            };
        };
        TrustedIssuer: {
            issuer: string;
            trustedFor: string;
        };
        Condition: {
            conditionType: string;
            issuers: string;
        };
        ConditionResult: {
            condition: string;
            result: string;
        };
        PipId: string;
        Authorization: {
            authorizationData: string;
            authorizedBy: string;
            expiry: string;
            authId: string;
            count: string;
        };
        AuthorizationData: {
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
        Percentage: string;
        StatClaim: {
            _enum: {
                Accredited: string;
                Affiliate: string;
                Jurisdiction: string;
            };
        };
        TransferCondition: {
            _enum: {
                MaxInvestorCount: string;
                MaxInvestorOwnership: string;
                ClaimCount: string;
                ClaimOwnership: string;
            };
        };
        AssetComplianceResult: {
            paused: string;
            requirements: string;
            result: string;
        };
        ProtocolOp: {
            _enum: string[];
        };
        CddStatus: {
            _enum: {
                Ok: string;
                Err: string;
            };
        };
        AssetDidResult: {
            _enum: {
                Ok: string;
                Err: string;
            };
        };
        RpcDidRecordsSuccess: {
            primaryKey: string;
            secondaryKeys: string;
        };
        RpcDidRecords: {
            _enum: {
                Success: string;
                IdNotFound: string;
            };
        };
        VoteCountProposalFound: {
            ayes: string;
            nays: string;
        };
        VoteCount: {
            _enum: {
                ProposalFound: string;
                ProposalNotFound: string;
            };
        };
        CappedFee: string;
        AuthorizationType: {
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
        DidStatus: {
            _enum: {
                Unknown: string;
                Exists: string;
                CddVerified: string;
            };
        };
        PortfolioNumber: string;
        PortfolioKind: {
            _enum: {
                Default: string;
                User: string;
            };
        };
        PortfolioId: {
            did: string;
            kind: string;
        };
        PolymeshMoment: string;
        InstructionId: string;
        LegId: string;
        TargetIdentity: {
            _enum: {
                ExternalAgent: string;
                Specific: string;
            };
        };
        CanTransferGranularReturn: {
            _enum: {
                Ok: string;
                Err: string;
            };
        };
        GranularCanTransferResult: {
            invalidGranularity: string;
            selfTransfer: string;
            invalidReceiverCdd: string;
            invalidSenderCdd: string;
            receiverCustodianError: string;
            senderCustodianError: string;
            senderInsufficientBalance: string;
            portfolioValidityResult: string;
            assetFrozen: string;
            transferConditionResult: string;
            complianceResult: string;
            result: string;
            consumedWeight: string;
        };
        PortfolioValidityResult: {
            receiverIsSamePortfolio: string;
            senderPortfolioDoesNotExist: string;
            receiverPortfolioDoesNotExist: string;
            senderInsufficientBalance: string;
            result: string;
        };
        TransferConditionResult: {
            condition: string;
            result: string;
        };
        AGId: string;
        AgentGroup: {
            _enum: {
                Full: string;
                Custom: string;
                ExceptMeta: string;
                PolymeshV1CAA: string;
                PolymeshV1PIA: string;
            };
        };
        Member: {
            id: string;
            expiryAt: string;
            inactiveFrom: string;
        };
        NFTId: string;
        NFTs: {
            assetId: string;
            ids: string;
        };
        FungibleLeg: {
            sender: string;
            receiver: string;
            assetId: string;
            amount: string;
        };
        NonFungibleLeg: {
            sender: string;
            receiver: string;
            nfts: string;
        };
        OffChainLeg: {
            senderIdentity: string;
            receiverIdentity: string;
            ticker: string;
            amount: string;
        };
        Leg: {
            _enum: {
                Fungible: string;
                NonFungible: string;
                OffChain: string;
            };
        };
        ExecuteInstructionInfo: {
            fungibleTokens: string;
            nonFungibleTokens: string;
            offChainAssets: string;
            consumedWeight: string;
            error: string;
        };
        AssetCount: {
            fungibleTokens: string;
            nonFungibleTokens: string;
            offChainAssets: string;
        };
        AffirmationCount: {
            senderAssetCount: string;
            receiverAssetCount: string;
            offchainCount: string;
        };
        ComplianceReport: {
            anyRequirementSatisfied: string;
            pausedCompliance: string;
            requirements: string;
        };
        RequirementReport: {
            requirementSatisfied: string;
            id: string;
            senderConditions: string;
            receiverConditions: string;
        };
        ConditionReport: {
            satisfied: string;
            condition: string;
        };
    };
} | {
    minmax: number[];
    types: {
        AssetId: string;
        IdentityId: string;
        Ticker: string;
        CddId: string;
        PalletName: string;
        ExtrinsicName: string;
        AssetPermissions: {
            _enum: {
                Whole: string;
                These: string;
                Except: string;
            };
        };
        PortfolioPermissions: {
            _enum: {
                Whole: string;
                These: string;
                Except: string;
            };
        };
        ExtrinsicNames: {
            _enum: {
                Whole: string;
                These: string;
                Except: string;
            };
        };
        PalletPermissions: {
            extrinsics: string;
        };
        ExtrinsicPermissions: {
            _enum: {
                Whole: string;
                These: string;
                Except: string;
            };
        };
        Permissions: {
            asset: string;
            extrinsic: string;
            portfolio: string;
        };
        Signatory: {
            _enum: {
                Identity: string;
                Account: string;
            };
        };
        SecondaryKey: {
            key: string;
            permissions: string;
        };
        KeyIdentityData: {
            identity: string;
            permissions: string;
        };
        CountryCode: {
            _enum: string[];
        };
        Scope: {
            _enum: {
                Identity: string;
                Asset: string;
                Custom: string;
            };
        };
        CustomClaimTypeId: string;
        Claim: {
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
        ClaimType: {
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
        IdentityClaim: {
            claim_issuer: string;
            issuance_date: string;
            last_update_date: string;
            expiry: string;
            claim: string;
        };
        ComplianceRequirementResult: {
            sender_conditions: string;
            receiver_conditions: string;
            id: string;
            result: string;
        };
        ConditionType: {
            _enum: {
                IsPresent: string;
                IsAbsent: string;
                IsAnyOf: string;
                IsNoneOf: string;
                IsIdentity: string;
            };
        };
        TrustedFor: {
            _enum: {
                Any: string;
                Specific: string;
            };
        };
        TrustedIssuer: {
            issuer: string;
            trusted_for: string;
        };
        Condition: {
            condition_type: string;
            issuers: string;
        };
        ConditionResult: {
            condition: string;
            result: string;
        };
        PipId: string;
        Authorization: {
            authorization_data: string;
            authorized_by: string;
            expiry: string;
            auth_id: string;
            count: string;
        };
        AuthorizationData: {
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
        Percentage: string;
        StatClaim: {
            _enum: {
                Accredited: string;
                Affiliate: string;
                Jurisdiction: string;
            };
        };
        TransferCondition: {
            _enum: {
                MaxInvestorCount: string;
                MaxInvestorOwnership: string;
                ClaimCount: string;
                ClaimOwnership: string;
            };
        };
        AssetComplianceResult: {
            paused: string;
            requirements: string;
            result: string;
        };
        ProtocolOp: {
            _enum: string[];
        };
        CddStatus: {
            _enum: {
                Ok: string;
                Err: string;
            };
        };
        AssetDidResult: {
            _enum: {
                Ok: string;
                Err: string;
            };
        };
        RpcDidRecordsSuccess: {
            primary_key: string;
            secondary_keys: string;
        };
        RpcDidRecords: {
            _enum: {
                Success: string;
                IdNotFound: string;
            };
        };
        VoteCountProposalFound: {
            ayes: string;
            nays: string;
        };
        VoteCount: {
            _enum: {
                ProposalFound: string;
                ProposalNotFound: string;
            };
        };
        CappedFee: string;
        AuthorizationType: {
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
        DidStatus: {
            _enum: {
                Unknown: string;
                Exists: string;
                CddVerified: string;
            };
        };
        PortfolioNumber: string;
        PortfolioKind: {
            _enum: {
                Default: string;
                User: string;
            };
        };
        PortfolioId: {
            did: string;
            kind: string;
        };
        Moment: string;
        InstructionId: string;
        TargetIdentity: {
            _enum: {
                ExternalAgent: string;
                Specific: string;
            };
        };
        CanTransferGranularReturn: {
            _enum: {
                Ok: string;
                Err: string;
            };
        };
        GranularCanTransferResult: {
            invalid_granularity: string;
            self_transfer: string;
            invalid_receiver_cdd: string;
            invalid_sender_cdd: string;
            receiver_custodian_error: string;
            sender_custodian_error: string;
            sender_insufficient_balance: string;
            portfolio_validity_result: string;
            asset_frozen: string;
            transfer_condition_result: string;
            compliance_result: string;
            result: string;
            consumed_weight: string;
        };
        PortfolioValidityResult: {
            receiver_is_same_portfolio: string;
            sender_portfolio_does_not_exist: string;
            receiver_portfolio_does_not_exist: string;
            sender_insufficient_balance: string;
            result: string;
        };
        TransferConditionResult: {
            condition: string;
            result: string;
        };
        AGId: string;
        AgentGroup: {
            _enum: {
                Full: string;
                Custom: string;
                ExceptMeta: string;
                PolymeshV1CAA: string;
                PolymeshV1PIA: string;
            };
        };
        Member: {
            id: string;
            expiry_at: string;
            inactive_from: string;
        };
        NFTId: string;
        NFTs: {
            asset_id: string;
            ids: string;
        };
        FungibleLeg: {
            sender: string;
            receiver: string;
            asset_id: string;
            amount: string;
        };
        NonFungibleLeg: {
            sender: string;
            receiver: string;
            nfts: string;
        };
        OffChainLeg: {
            sender_identity: string;
            receiver_identity: string;
            asset_id: string;
            amount: string;
        };
        Leg: {
            _enum: {
                Fungible: string;
                NonFungible: string;
                OffChain: string;
            };
        };
        ExecuteInstructionInfo: {
            fungible_tokens: string;
            non_fungible_tokens: string;
            off_chain_assets: string;
            consumed_weight: string;
            error: string;
        };
        AssetCount: {
            fungible_tokens: string;
            non_fungible_tokens: string;
            off_chain_assets: string;
        };
        AffirmationCount: {
            sender_asset_count: string;
            receiver_asset_count: string;
            offchain_count: string;
        };
        ComplianceReport: {
            any_requirement_satisfied: string;
            paused_compliance: string;
            requirements: string;
        };
        RequirementReport: {
            requirement_satisfied: string;
            id: string;
            sender_conditions: string;
            receiver_conditions: string;
        };
        ConditionReport: {
            satisfied: string;
            condition: string;
        };
    };
} | {
    minmax: number[];
    types: {
        AccountInfo: string;
        Address: string;
        LookupSource: string;
    };
})[];
export default _default;
//# sourceMappingURL=index.d.ts.map