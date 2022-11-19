"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryParse = void 0;
const lodash_1 = require("lodash");
const pagination_1 = require("./pagination");
const filters_1 = require("./filters");
const include_1 = require("./include");
const fields_1 = require("./fields");
const order_1 = require("./order");
const group_1 = require("./group");
const orm_1 = require("./orm");
//
// helpers
//
/**
 * Merge array values
 */
const mergeArrays = (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
        return objValue.concat(srcValue);
    }
};
//
// source code
//
const queryParse = (query, options = {}) => {
    const pagination = (0, pagination_1.pagination)(query, options);
    const filters = (0, filters_1.filters)(query, options);
    const fieldsOptions = (0, fields_1.fields)(query, options);
    const includeOptions = (0, include_1.include)(query, options);
    const orders = (0, order_1.order)(query, options);
    const groups = (0, group_1.group)(query);
    const opts = {};
    // resolve pagination
    if (pagination) {
        opts.limit = pagination.limit;
        opts.offset = pagination.offset;
    }
    // resolve filters as where
    if (filters) {
        opts.where = filters;
    }
    // resolve fields
    if (fieldsOptions) {
        if (fieldsOptions.fields && fieldsOptions.fields.length) {
            opts.attributes = fieldsOptions.fields;
        }
        if (fieldsOptions.relations) {
            opts.relations = (0, lodash_1.mergeWith)(opts.relations || {}, fieldsOptions.relations, mergeArrays);
        }
        if (fieldsOptions.remotes && fieldsOptions.remotes.length) {
            opts.remotes = mergeArrays(opts.remotes || [], fieldsOptions.remotes);
        }
    }
    // resolve includes
    if (includeOptions) {
        if (includeOptions.include && includeOptions.include.length) {
            opts.include = includeOptions.include;
        }
        if (includeOptions.relations) {
            opts.relations = (0, lodash_1.mergeWith)(opts.relations || {}, includeOptions.relations, mergeArrays);
        }
        if (includeOptions.remotes && includeOptions.remotes.length) {
            opts.remotes = mergeArrays(opts.remotes || [], includeOptions.remotes);
        }
    }
    // resolve order
    if (orders) {
        opts.order = orders;
    }
    // resolve group
    if (groups && groups.length) {
        opts.group = groups;
    }
    // Parse options to sequelize ORM format
    return (0, orm_1.sequelizeParser)(opts);
};
exports.queryParse = queryParse;
