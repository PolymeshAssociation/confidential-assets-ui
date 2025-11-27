"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceApiV1 = void 0;
exports.ComplianceApiV1 = {
    compliance_report: {
        description: 'Checks all compliance requirements for the given ticker.',
        params: [
            { name: 'ticker', type: 'Ticker' },
            { name: 'sender_identity', type: 'IdentityId' },
            { name: 'receiver_identity', type: 'IdentityId' },
        ],
        type: 'Result<ComplianceReport, DispatchError>',
    },
};
//# sourceMappingURL=v1.js.map