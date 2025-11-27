declare const _default: {
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
    rpc: {};
    runtime: {
        AssetApi: ({
            methods: {
                transfer_report: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                can_transfer_granular?: undefined;
            };
            version: number;
        } | {
            methods: {
                can_transfer_granular: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                transfer_report?: undefined;
            };
            version: number;
        })[];
        ComplianceApi: {
            methods: {
                compliance_report: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
            };
            version: number;
        }[];
        GroupApi: {
            methods: {
                get_cdd_valid_members: {
                    description: string;
                    params: never[];
                    type: string;
                };
                get_gc_valid_members: {
                    description: string;
                    params: never[];
                    type: string;
                };
            };
            version: number;
        }[];
        IdentityApi: ({
            methods: {
                is_identity_has_valid_cdd: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                get_did_records: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                get_did_status: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                get_filtered_authorizations: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                get_key_identity_data: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                valid_cdd_claims: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                get_asset_did?: undefined;
            };
            version: number;
        } | {
            methods: {
                is_identity_has_valid_cdd: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                get_asset_did: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                get_did_records: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                get_did_status: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                get_filtered_authorizations: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                get_key_identity_data: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                valid_cdd_claims: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
            };
            version: number;
        })[];
        NFTApi: ({
            methods: {
                transfer_report: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                validate_nft_transfer?: undefined;
            };
            version: number;
        } | {
            methods: {
                validate_nft_transfer: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                transfer_report?: undefined;
            };
            version: number;
        })[];
        PipsApi: {
            methods: {
                get_votes: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                proposed_by: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                voted_on: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
            };
            version: number;
        }[];
        ProtocolFeeApi: {
            methods: {
                compute_fee: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
            };
            version: number;
        }[];
        SettlementApi: ({
            methods: {
                get_execute_instruction_info: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                get_affirmation_count: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                get_transfer_report: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                get_execute_instruction_report: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                instruction_asset_count: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                lock_instruction_weight: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
            };
            version: number;
        } | {
            methods: {
                get_execute_instruction_info: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                get_affirmation_count: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                get_transfer_report: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                get_execute_instruction_report: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
                instruction_asset_count?: undefined;
                lock_instruction_weight?: undefined;
            };
            version: number;
        })[];
        StakingApi: {
            methods: {
                get_curve: {
                    description: string;
                    params: never[];
                    type: string;
                };
            };
            version: number;
        }[];
        StatisticsApi: {
            methods: {
                transfer_restrictions_report: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
            };
            version: number;
        }[];
    };
    signedExtensions: {
        StoreCallMetadata: {
            extrinsic: {};
            payload: {};
        };
    };
};
export default _default;
//# sourceMappingURL=definitions.d.ts.map