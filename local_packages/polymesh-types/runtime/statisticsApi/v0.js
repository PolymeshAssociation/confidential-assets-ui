"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsApiV0 = void 0;
exports.StatisticsApiV0 = {
    transfer_restrictions_report: {
        description: "Returns a vector containing all TransferCondition that are not being respected for the transfer. An empty vec means there's no error.",
        params: [
            {
                name: 'asset_id',
                type: 'PolymeshAssetId',
            },
            {
                name: 'sender_did',
                type: 'IdentityId',
            },
            {
                name: 'receiver_did',
                type: 'IdentityId',
            },
            {
                name: 'transfer_amount',
                type: 'Balance',
            },
        ],
        type: 'Result<Vec<TransferCondition>, DispatchError>',
    },
};
//# sourceMappingURL=v0.js.map