"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceApiV2 = void 0;
exports.ComplianceApiV2 = {
    compliance_report: {
        description: 'Checks all compliance requirements for the given asset_id.',
        params: [
            {
                name: 'asset_id',
                type: 'PolymeshAssetId',
            },
            {
                name: 'sender_identity',
                type: 'IdentityId',
            },
            {
                name: 'receiver_identity',
                type: 'IdentityId',
            },
        ],
        type: 'Result<ComplianceReport, DispatchError>',
    },
};
//# sourceMappingURL=v2.js.map