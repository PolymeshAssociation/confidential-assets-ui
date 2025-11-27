"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typesBundle = void 0;
const rpc_1 = __importDefault(require("./rpc"));
const runtime_1 = __importDefault(require("./runtime"));
const signedExtensions_1 = __importDefault(require("./signedExtensions"));
const types_1 = __importDefault(require("./types"));
const specTypes = {
    rpc: rpc_1.default,
    runtime: runtime_1.default,
    types: types_1.default,
    signedExtensions: signedExtensions_1.default,
};
exports.typesBundle = {
    spec: {
        polymesh_dev: specTypes,
        polymesh: specTypes,
        polymesh_ci: specTypes,
        polymesh_mainnet: specTypes,
        polymesh_testnet: specTypes,
        polymesh_private_dev: specTypes,
        polymesh_private_prod: specTypes,
    },
};
//# sourceMappingURL=index.js.map