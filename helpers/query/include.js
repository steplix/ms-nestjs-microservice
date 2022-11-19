"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.include = void 0;
const properties_1 = require("./properties");
//
// source code
//
const include = (query, options = {}) => {
    return (0, properties_1.properties)(query, "include", options);
};
exports.include = include;
