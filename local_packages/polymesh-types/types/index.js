"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _2_0_0_json_1 = __importDefault(require("./2.0.0.json"));
const _4_0_0_json_1 = __importDefault(require("./4.0.0.json"));
const _4_1_x_json_1 = __importDefault(require("./4.1.x.json"));
const _5_0_x_json_1 = __importDefault(require("./5.0.x.json"));
const _5_1_x_json_1 = __importDefault(require("./5.1.x.json"));
const _5_2_x_json_1 = __importDefault(require("./5.2.x.json"));
const _5_3_x_json_1 = __importDefault(require("./5.3.x.json"));
const _5_4_x_json_1 = __importDefault(require("./5.4.x.json"));
const _6_0_x_json_1 = __importDefault(require("./6.0.x.json"));
const _6_1_x_json_1 = __importDefault(require("./6.1.x.json"));
const _6_3_x_json_1 = __importDefault(require("./6.3.x.json"));
const _7_0_x_json_1 = __importDefault(require("./7.0.x.json"));
const _7_3_x_json_1 = __importDefault(require("./7.3.x.json"));
const _8_0_x_json_1 = __importDefault(require("./8.0.x.json"));
exports.default = [
    { minmax: [8000000, 8999999], types: _8_0_x_json_1.default },
    { minmax: [7003000, 7999999], types: _7_3_x_json_1.default },
    { minmax: [7000000, 7002999], types: _7_0_x_json_1.default },
    { minmax: [6003000, 6999999], types: _6_3_x_json_1.default },
    { minmax: [6001000, 6002999], types: _6_1_x_json_1.default },
    { minmax: [6000000, 6000009], types: _6_0_x_json_1.default },
    {
        minmax: [5004000, 5004009],
        types: _5_4_x_json_1.default,
    },
    {
        minmax: [5003000, 5003009],
        types: _5_3_x_json_1.default,
    },
    {
        minmax: [5002000, 5002009],
        types: _5_2_x_json_1.default,
    },
    {
        minmax: [5001000, 5001009],
        types: _5_1_x_json_1.default,
    },
    {
        minmax: [5000000, 5000009],
        types: _5_0_x_json_1.default,
    },
    {
        minmax: [3010, 3019],
        types: _4_1_x_json_1.default,
    },
    {
        minmax: [3002, 3002],
        types: _4_1_x_json_1.default,
    },
    {
        minmax: [3003, 3003],
        types: _4_0_0_json_1.default,
    },
    {
        minmax: [3000, 3001],
        types: _4_0_0_json_1.default,
    },
    {
        minmax: [2021, 2023],
        types: _2_0_0_json_1.default,
    },
    /**
     * Polymesh Private spec - These may need their own package in the future
     */
    { minmax: [1000000, 1999999], types: _6_1_x_json_1.default },
    { minmax: [2000000, 2999999], types: _7_0_x_json_1.default }, // private v2 has the same spec as public v7
];
//# sourceMappingURL=index.js.map