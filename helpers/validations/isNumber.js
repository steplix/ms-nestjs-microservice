"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumber = void 0;
const lodash_1 = require("lodash");
const regexpNumber = /^[+-]?([0-9]*[.])?[0-9]+$/;
const isNumber = (value) => {
    if ((0, lodash_1.isNumber)(value)) {
        return true;
    }
    return !(0, lodash_1.isEmpty)(value) && regexpNumber.test(value);
};
exports.isNumber = isNumber;
