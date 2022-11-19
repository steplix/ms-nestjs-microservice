"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.order = void 0;
const lodash_1 = require("lodash");
//
// constants
//
const directions = ["DESC", "ASC"];
const defaultMapping = {
    date: "created_at",
};
//
// source code
//
const order = (query, mapping = {}) => {
    if (!query || !query.order) {
        return;
    }
    mapping = (0, lodash_1.merge)({}, defaultMapping, mapping);
    return (0, lodash_1.map)(query.order.split(query.orderSeparator || ","), (condition) => {
        const [key, direction] = condition.split("-");
        const order = [mapping[key] || key];
        if (direction && directions.includes(direction.toUpperCase())) {
            order.push(direction.toUpperCase());
        }
        return order;
    });
};
exports.order = order;
