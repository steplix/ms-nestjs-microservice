"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.group = void 0;
//
// constants
//
const defaultSeparator = ",";
//
// source code
//
const group = (query) => {
    if (!query || !query.group) {
        return;
    }
    return query.group.split(query.groupSeparator || defaultSeparator);
};
exports.group = group;
