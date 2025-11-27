"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFTApiV1 = void 0;
exports.NFTApiV1 = {
    validate_nft_transfer: {
        description: 'Verifies if and the sender and receiver are not the same, if both have valid balances, if the sender owns the nft, and if all compliance rules are being respected.',
        params: [
            { name: 'sender_portfolio', type: 'PortfolioId' },
            { name: 'receiver_portfolio', type: 'PortfolioId' },
            { name: 'nfts', type: 'NFTs' },
        ],
        type: 'DispatchResult',
    },
};
//# sourceMappingURL=v1.js.map