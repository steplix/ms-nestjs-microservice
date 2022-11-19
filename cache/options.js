"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCacheEnabled = void 0;
const constants_1 = require("../constants");
/**
 * Indicate if Cache feature is enabled
 */
exports.isCacheEnabled = constants_1.trues.includes(String(process.env.CACHE_ENABLED).toLowerCase());
