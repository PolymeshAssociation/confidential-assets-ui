"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFTApiV2 = void 0;
exports.NFTApiV2 = {
    transfer_report: {
        description: "Returns a vector containing all errors for the transfer. An empty vec means there's no error.",
        params: [
            {
                name: 'sender_portfolio',
                type: 'PortfolioId',
            },
            {
                name: 'receiver_portfolio',
                type: 'PortfolioId',
            },
            {
                name: 'nfts',
                type: 'NFTs',
            },
            {
                name: 'skip_locked_check',
                type: 'bool',
            },
        ],
        type: 'Vec<DispatchError>',
    },
};
//# sourceMappingURL=v2.js.map