"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    rpc: {
        getCurve: {
            description: 'Retrieves curves parameters',
            params: [
                {
                    name: 'blockHash',
                    type: 'Hash',
                    isOptional: true,
                },
            ],
            type: 'Vec<(Perbill, Perbill)>',
        },
    },
    types: {},
};
//# sourceMappingURL=definitions.js.map