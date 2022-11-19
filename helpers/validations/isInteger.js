"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInteger = void 0;
const lodash_1 = require("lodash");
const regexpInteger = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;
const isInteger = (value) => {
    if ((0, lodash_1.isInteger)(value)) {
        return true;
    }
    return !(0, lodash_1.isEmpty)(value) && regexpInteger.test(value);
};
exports.isInteger = isInteger;
