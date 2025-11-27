"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    rpc: {
        getCDDValidMembers: {
            description: 'Get the CDD members',
            params: [
                {
                    name: 'blockHash',
                    type: 'Hash',
                    isOptional: true,
                },
            ],
            type: 'Vec<Member>',
        },
        getGCValidMembers: {
            description: 'Get the GC members',
            params: [
                {
                    name: 'blockHash',
                    type: 'Hash',
                    isOptional: true,
                },
            ],
            type: 'Vec<Member>',
        },
    },
    types: {},
};
//# sourceMappingURL=definitions.js.map