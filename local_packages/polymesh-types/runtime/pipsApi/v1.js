"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipsApiV1 = void 0;
exports.PipsApiV1 = {
    get_votes: {
        description: 'Summary of votes of a proposal given by index',
        params: [
            {
                name: 'index',
                type: 'PipId',
            },
        ],
        type: 'VoteCount',
    },
    proposed_by: {
        description: 'Retrieves proposal indices started by address',
        params: [
            {
                name: 'address',
                type: 'AccountId',
            },
        ],
        type: 'Vec<PipId>',
    },
    voted_on: {
        description: 'Retrieves proposal address indices voted on',
        params: [
            {
                name: 'address',
                type: 'AccountId',
            },
        ],
        type: 'Vec<PipId>',
    },
};
//# sourceMappingURL=v1.js.map