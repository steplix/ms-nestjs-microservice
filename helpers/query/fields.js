"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fields = void 0;
const lodash_1 = require("lodash");
const sequelize_1 = require("sequelize");
const properties_1 = require("./properties");
//
// source code
//
const fields = (query, options = {}) => {
    const result = (0, properties_1.properties)(query, "fields", options);
    if (result && result.fields) {
        const fields = (0, lodash_1.map)(result.fields, (field) => {
            const parts = field.split("-");
            if (parts.length <= 1) {
                return field;
            }
            return [(0, sequelize_1.fn)(parts[0], (0, sequelize_1.col)(parts[1])), parts[2] || (parts[1] !== "*" ? parts[1] : parts[0])];
        });
        result.fields = fields && fields.length === 1 && fields[0] === "*" ? null : fields;
    }
    return result;
};
exports.fields = fields;
