"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolFeeApiV1 = void 0;
exports.ProtocolFeeApiV1 = {
    compute_fee: {
        description: 'Gets the fee of a chargeable extrinsic operation',
        params: [
            {
                name: 'op',
                type: 'ProtocolOp',
            },
        ],
        type: 'CappedFee',
    },
};
//# sourceMappingURL=v1.js.map