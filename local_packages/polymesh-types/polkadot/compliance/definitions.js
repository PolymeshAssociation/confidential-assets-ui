"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    rpc: {
        complianceReport: {
            description: 'Checks all compliance requirements for the given asset.',
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
    },
    types: {},
};
//# sourceMappingURL=definitions.js.map