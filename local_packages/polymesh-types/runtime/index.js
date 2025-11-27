"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = void 0;
const v3_1 = require("./assetApi/v3");
const v4_1 = require("./assetApi/v4");
const v1_1 = require("./complianceApi/v1");
const v2_1 = require("./complianceApi/v2");
const v1_2 = require("./groupApi/v1");
const v3_2 = require("./identityApi/v3");
const v4_2 = require("./identityApi/v4");
const v1_3 = require("./nftApi/v1");
const v2_2 = require("./nftApi/v2");
const v1_4 = require("./pipsApi/v1");
const v1_5 = require("./protocolFeeApi/v1");
const v1_6 = require("./settlementApi/v1");
const v2_3 = require("./settlementApi/v2");
const v1_7 = require("./stakingApi/v1");
const v0_1 = require("./statisticsApi/v0");
exports.runtime = {
    AssetApi: [
        { methods: v4_1.AssetApiV4, version: 4 },
        { methods: v3_1.AssetApiV3, version: 3 },
    ],
    ComplianceApi: [
        { methods: v2_1.ComplianceApiV2, version: 2 },
        { methods: v1_1.ComplianceApiV1, version: 1 },
    ],
    GroupApi: [{ methods: v1_2.GroupApiV1, version: 1 }],
    IdentityApi: [
        { methods: v4_2.IdentityApiV4, version: 4 },
        { methods: v3_2.IdentityApiV3, version: 3 },
    ],
    NFTApi: [
        { methods: v2_2.NFTApiV2, version: 2 },
        { methods: v1_3.NFTApiV1, version: 1 },
    ],
    PipsApi: [{ methods: v1_4.PipsApiV1, version: 1 }],
    ProtocolFeeApi: [{ methods: v1_5.ProtocolFeeApiV1, version: 1 }],
    SettlementApi: [
        { methods: v2_3.SettlementApiV2, version: 2 },
        { methods: v1_6.SettlementApiV1, version: 1 },
    ],
    StakingApi: [{ methods: v1_7.StakingApiV1, version: 1 }],
    StatisticsApi: [{ methods: v0_1.StatisticsApiV0, version: 0 }],
};
exports.default = exports.runtime;
//# sourceMappingURL=index.js.map