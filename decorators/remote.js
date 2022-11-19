"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Remote = void 0;
require("reflect-metadata");
// eslint-disable-next-line @typescript-eslint/ban-types
function Remote(...args) {
    const options = args[0] || {};
    return (target, memberName) => {
        Reflect.defineMetadata(`remote_${memberName}`, options, target, memberName);
    };
}
exports.Remote = Remote;
