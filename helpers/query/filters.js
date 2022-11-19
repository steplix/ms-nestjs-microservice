"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filters = void 0;
const lodash_1 = require("lodash");
const sequelize_1 = require("sequelize");
const query_filters_1 = require("@comodinx/query-filters");
const booleans_1 = require("../../constants/booleans");
//
// constants
//
// operator mappers
const mapOperator = {
    eq: sequelize_1.Op.eq,
    ee: "ee",
    ne: sequelize_1.Op.ne,
    gt: sequelize_1.Op.gt,
    ge: sequelize_1.Op.gte,
    lt: sequelize_1.Op.lt,
    le: sequelize_1.Op.lte,
    li: sequelize_1.Op.like,
    nl: sequelize_1.Op.notLike,
    in: sequelize_1.Op.in,
    ni: sequelize_1.Op.notIn,
    be: sequelize_1.Op.between,
    nb: sequelize_1.Op.notBetween,
    is: sequelize_1.Op.is,
    no: sequelize_1.Op.not,
};
// filter separator
const defaultSeparator = ",";
// eslint-disable-next-line no-useless-escape
const key = "[A-Za-z0-9_.]+";
// eslint-disable-next-line no-useless-escape
const valueLikeParse = /\*/g;
// eslint-disable-next-line no-useless-escape
const valueLikeFormat = /\%/g;
// Json keys
const defaultJsonKeys = ["metadata"];
// Extends mappers on @comodinx/query-filters
query_filters_1.Mappers.Sequelize = mapOperator;
//
// helpers
//
const isNumberString = (value) => {
    if ((0, lodash_1.isNumber)(value)) {
        return true;
    }
    return !(0, lodash_1.isEmpty)(value) && !isNaN(Number(value));
};
const isBooleanString = (value) => {
    return !(0, lodash_1.isEmpty)(value) && booleans_1.booleans.includes(String(value).toLowerCase());
};
const mapValueParse = (value, operator) => {
    // exact equal
    if (operator.trim() === "ee") {
        return value;
    }
    // is or is not
    if (operator.trim() === "is" || operator.trim() === "no") {
        if (value === "null" || value === "undefined") {
            return null;
        }
        return value;
    }
    if ((0, lodash_1.isArray)(value)) {
        return (0, lodash_1.map)(value, (value) => mapValueParse(value, operator));
    }
    if (isNumberString(value)) {
        return Number(value);
    }
    if ((0, lodash_1.isBoolean)(value)) {
        return value;
    }
    if (isBooleanString(value)) {
        return booleans_1.trues.includes(String(value).toLowerCase());
    }
    if ((0, lodash_1.isString)(value)) {
        return value.replace(valueLikeParse, "%");
    }
    return value;
};
const mapValueFormat = (value, operator) => {
    if ((0, lodash_1.isArray)(value)) {
        return `[${value.map((value) => mapValueFormat(value, operator)).join(";")}]`;
    }
    if ((0, lodash_1.isObject)(value)) {
        return JSON.stringify(value);
    }
    if ((0, lodash_1.isString)(value)) {
        return value.replace(valueLikeFormat, "*");
    }
    return value;
};
const createParser = (options = {}) => {
    return new query_filters_1.Parser((0, lodash_1.merge)({}, {
        separator: defaultSeparator,
        mapValueFormat,
        mapValueParse,
        mapOperator,
        key,
    }, options));
};
//
// source code
//
const filters = (query, options = {}) => {
    // Save last parser instance.
    const parser = (exports.filters.lastParser = createParser((0, lodash_1.merge)({}, {
        separator: (query && query.filtersSeparator) || defaultSeparator,
    }, options || {})));
    if (!query || !query.filters || (0, lodash_1.isEmpty)(query.filters)) {
        return;
    }
    const parsed = parser.parse(query.filters);
    if (!parsed) {
        return;
    }
    const jsonKeys = options.jsonKeys || defaultJsonKeys;
    return (0, lodash_1.reduce)(parsed, (carry, condition, key) => {
        const jsonKey = (0, lodash_1.find)(jsonKeys, (jsonKey) => (0, lodash_1.startsWith)(key, `${jsonKey}.`));
        if (jsonKey) {
            carry[sequelize_1.Op.and] = carry[sequelize_1.Op.and] || [];
            carry[sequelize_1.Op.and].push((0, sequelize_1.where)((0, sequelize_1.literal)(`${jsonKey}->"$${key.replace(jsonKey, "")}"`), condition));
        }
        else {
            carry[key] = condition;
        }
        return carry;
    }, {});
};
exports.filters = filters;
exports.filters.createParser = createParser;
